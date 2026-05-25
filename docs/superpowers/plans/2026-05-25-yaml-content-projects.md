# YAML Content System for Projects — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded `src/data/projects.ts` with a YAML content file (`content/projects.yml`) that the code reads and renders dynamically, allowing flexible field management without touching code.

**Architecture:** A `content/projects.yml` file defines section-level config (title, header) and per-project entries (name, page title, header fields, tags, description, links). A TypeScript loader (`src/data/projects.ts`) parses the YAML and exposes typed data. `Projects.tsx` renders whatever fields are present in each project — headers are dynamic, not hardcoded.

**Tech Stack:** `yaml` npm package for YAML parsing, Vite raw import (`?raw`) for loading the file at build time.

---

### Task 1: Install YAML parser

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the `yaml` package**

```bash
npm install yaml
```

- [ ] **Step 2: Verify install**

```bash
node -e "const YAML = require('yaml'); console.log(YAML.parse('a: 1'))"
```

Expected: `{ a: 1 }`

---

### Task 2: Create `content/projects.yml`

**Files:**
- Create: `content/projects.yml`

- [ ] **Step 1: Create the content directory and YAML file**

Create `content/projects.yml` with the current project data migrated from `src/data/projects.ts`:

```yaml
# content/projects.yml
# Edit this file to manage the Projects section content.
# The code reads this file and renders it automatically.
# Fields in "header" are rendered dynamically — add/remove freely.

section:
  title: "projects.yml"
  header:
    Author: Hugo Fabresse
    Last modified: 2026-04-27
    Status: active

projects:
  - id: just
    name: JUST
    subtitle: Version Control System
    page: just.c
    header:
      Author: Hugo Fabresse
      Created: 2025
      Status: completed
      Language: C
      License: MIT
    tags: [C, Makefile, Memory Management, Data Structures]
    description: >
      VCS developpe integralement en C from scratch. Implementation d'un
      systeme d'objets complet (blobs, trees, commits). Gestion de memoire
      rigoureuse et compilation stricte. Manipulation avancee de pointeurs.
    github: https://github.com/Hugo-music/JUST

  - id: goat
    name: GOAT
    subtitle: Minimalist Git
    page: goat.c
    header:
      Author: Hugo Fabresse
      Created: 2025
      Status: completed
      Language: C
      License: MIT
    tags: [C, System Calls, "File I/O", Reverse Engineering]
    description: >
      Reproduction des primitives essentielles de Git. Approche experimentale
      visant a comprendre les mecanismes internes profonds de l'outil.
      Parfaite complementarite architecturale avec le developpement de JUST.
    github: https://github.com/Hugo-music/GOAT
```

---

### Task 3: Rewrite `src/data/projects.ts` as YAML loader

**Files:**
- Modify: `src/data/projects.ts`

This replaces the hardcoded data with a loader that parses the YAML file and exposes typed data.

- [ ] **Step 1: Rewrite `src/data/projects.ts`**

```ts
/**
 * Projects data loader — reads content/projects.yml at build time.
 *
 * Edit content/projects.yml to update project content.
 * See src/sections/Projects.tsx for rendering.
 */

import YAML from "yaml"

import raw from "../../content/projects.yml?raw"

/** Section-level configuration */
export interface ProjectsSection {
  /** Title shown in the list panel tab */
  title: string
  /** Header fields rendered as comments (key: value) */
  header: Record<string, string>
}

/** A single project entry */
export interface Project {
  /** Unique identifier */
  id: string
  /** Display name in the list */
  name: string
  /** Short description (used in detail header comment) */
  subtitle: string
  /** Title shown in the detail panel tab (e.g. "just.c") */
  page: string
  /** Header fields rendered as comment block in detail view */
  header: Record<string, string>
  /** Technology tags */
  tags: string[]
  /** Detailed description */
  description: string
  /** GitHub repository URL */
  github?: string
  /** Live demo URL */
  url?: string
}

/** Raw YAML structure */
interface ProjectsYAML {
  section: ProjectsSection
  projects: Project[]
}

const parsed: ProjectsYAML = YAML.parse(raw)

/** Section-level config (title, header fields) */
export const projectsSection: ProjectsSection = parsed.section

/** All projects */
export const projectsData: Project[] = parsed.projects
```

- [ ] **Step 2: Add YAML raw import type declaration**

Create `src/vite-env.d.ts` or add to existing — check if it already exists first:

Add this declaration so TypeScript accepts `?raw` imports for `.yml` files:

```ts
declare module "*.yml?raw" {
  const content: string
  export default content
}
```

---

### Task 4: Update `Projects.tsx` to use dynamic fields

**Files:**
- Modify: `src/sections/Projects.tsx`

The section currently hardcodes the header format. Update it to render fields dynamically from the YAML data.

- [ ] **Step 1: Rewrite `src/sections/Projects.tsx`**

```tsx
/**
 * Section Projects — Personal projects showcase.
 *
 * Uses SplitView with BufferView for list and detail panels.
 * Data: content/projects.yml (loaded via src/data/projects.ts)
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import BufferView from "@/components/BufferView"
import { projectsSection, projectsData } from "@/data/projects"

import type { Project } from "@/data/projects"
import type { BufferLine } from "@/components/BufferView"

/** Helper: a comment line */
const cm = (text: string): BufferLine => ({
  segments: [{ text, className: "text-tn-comment" }],
})

/** Helper: blank line */
const blank: BufferLine = { segments: [] }

/** Number of header lines (title + header fields + entries count + blank) */
const HEADER_SIZE =
  1 + Object.keys(projectsSection.header).length + 1 + 1

/** Build full list buffer: header + item lines */
function buildListLines(): BufferLine[] {
  const headerLines = Object.entries(projectsSection.header).map(
    ([key, value]) => cm(`# ${key}: ${value}`),
  )

  return [
    cm(`# ${projectsSection.title}`),
    ...headerLines,
    cm(`# Entries: ${projectsData.length}`),
    blank,
    ...projectsData.map((p) => ({
      segments: [
        { text: "- ", className: "text-tn-comment" },
        { text: "name", className: "text-tn-secondary" },
        { text: ": ", className: "text-tn-comment" },
        { text: p.name, className: "text-tn-green" },
        { text: " # press <enter> to open", className: "text-tn-comment" },
      ],
    })),
  ]
}

/** Indices of item lines in the list buffer */
const itemLineIndices = projectsData.map((_, i) => HEADER_SIZE + i)

/** Build detail lines with dynamic header fields */
function getDetailLines(project: Project): BufferLine[] {
  const headerEntries = Object.entries(project.header)
  const headerLines = headerEntries.map(([key, value], i) => {
    const padded = `${key}:`.padEnd(
      Math.max(...headerEntries.map(([k]) => k.length + 1)) + 1,
    )
    const prefix = i === 0 ? " * " : " * "
    return cm(`${prefix}${padded}${value}`)
  })

  return [
    cm(`/* ${project.page}`),
    cm(` * ${project.subtitle}`),
    ...headerLines,
    cm(` */`),
    blank,
    {
      segments: [
        { text: "tags = ", className: "text-tn-comment" },
        {
          text: `[${project.tags.map((t) => `"${t}"`).join(", ")}]`,
          className: "text-tn-green",
        },
      ],
    },
    blank,
    cm("// Description"),
    { segments: [{ text: project.description.trim() }] },
    ...(project.github
      ? [
          blank,
          cm("// Source"),
          {
            segments: [
              { text: project.github, className: "text-tn-accent" },
            ],
          } as BufferLine,
        ]
      : []),
    ...(project.url
      ? [
          blank,
          cm("// Live"),
          {
            segments: [
              { text: project.url, className: "text-tn-accent" },
            ],
          } as BufferLine,
        ]
      : []),
  ]
}

export default function Projects() {
  const listLines = buildListLines()

  return (
    <Section id="projects">
      <SplitView<Project>
        items={projectsData}
        listTitle={projectsSection.title}
        listLines={listLines}
        itemLineIndices={itemLineIndices}
        getDetailTitle={(p) => p.page}
        renderDetail={(project, active) => (
          <BufferView lines={getDetailLines(project)} active={active} />
        )}
      />
    </Section>
  )
}
```

---

### Task 5: Verify build and dev server

**Files:** None (verification only)

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Open browser, navigate to Projects section. Verify:
- List panel shows `projects.yml` title with header comments
- Each project appears in the list
- Clicking/Enter opens detail with dynamic header fields
- Tags and description render correctly

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

---

### Task 6: Update documentation

**Files:**
- Modify: `docs/ARCHITECTURE.md`
- Modify: `PROGRESS.md`

- [ ] **Step 1: Update ARCHITECTURE.md**

Add `content/` directory to the tree:

```
Portfolio/
├── content/
│   └── projects.yml          # Project content (YAML, edit without touching code)
```

Update the data flow section to show:

```
content/projects.yml ──► src/data/projects.ts (YAML loader)
                              │
                              ▼
                         sections/Projects.tsx
```

Update the `data/` layer description:

| `data/` | Loaders: parse content files (YAML) and expose typed data | Contenir de logique de rendu |

- [ ] **Step 2: Add PROGRESS.md entry**

Add entry describing the YAML content system migration.

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Install `yaml` package | `package.json` |
| 2 | Create YAML content file | `content/projects.yml` |
| 3 | Rewrite data loader | `src/data/projects.ts`, `src/vite-env.d.ts` |
| 4 | Update section to use dynamic fields | `src/sections/Projects.tsx` |
| 5 | Verify build + dev | — |
| 6 | Update docs | `docs/ARCHITECTURE.md`, `PROGRESS.md` |
