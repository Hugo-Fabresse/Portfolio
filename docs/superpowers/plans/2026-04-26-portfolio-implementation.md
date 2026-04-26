# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Neovim/Hyprland-inspired portfolio with vim keybinds, tiling split views, Tokyo Night theme, and modular section system, deployed on GitHub Pages.

**Architecture:** Single-page React app with a config-driven section registry. Each section is an independent component + data file, togglable via config. A generic SplitView component implements the Hyprland tiling WM pattern. A global vim navigation hook manages all keybinds.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion, next-themes, react-helmet-async, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md`
**Architecture:** `docs/ARCHITECTURE.md`
**Conventions:** `docs/CONVENTIONS.md`

---

## Task 1: Project Scaffolding (Vite + React + TypeScript)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Initialize Vite project**

```bash
cd /home/hugo/Projects/Portfolio
npm create vite@latest . -- --template react-ts
```

Select "Ignore files and continue" if prompted about existing files.

- [ ] **Step 2: Verify scaffolding**

```bash
ls src/main.tsx src/App.tsx vite.config.ts tsconfig.json index.html package.json
```

Expected: all files exist.

- [ ] **Step 3: Install dependencies**

```bash
npm install framer-motion next-themes react-helmet-async
npm install -D @tailwindcss/vite tailwindcss
```

- [ ] **Step 4: Clean up Vite defaults**

Remove default Vite boilerplate. Replace `src/App.tsx`:

```tsx
/**
 * App - Root component.
 *
 * Iterates over enabled sections in config and renders them
 * via the section registry. Wraps everything in theme and SEO providers.
 */

export default function App() {
  return (
    <main className="min-h-screen bg-tn-bg text-tn-fg font-mono">
      <p className="p-3 text-tn-accent">Portfolio</p>
    </main>
  )
}
```

Replace `src/main.tsx`:

```tsx
/**
 * Entry point - Mounts the React app.
 */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Remove `src/App.css` if it exists. Remove `src/assets/` if it exists.

- [ ] **Step 5: Configure Vite with path aliases**

Replace `vite.config.ts`:

```ts
/**
 * Vite configuration.
 *
 * Configures path alias (@/ -> src/) and Tailwind CSS plugin.
 */

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

- [ ] **Step 6: Configure TypeScript path alias**

In `tsconfig.app.json`, ensure `compilerOptions` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 7: Create index.css with Tailwind**

Create `src/index.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 8: Update index.html**

Replace `index.html`:

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <title>Hugo Fabresse — Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Note: Maple Mono NF is not on Google Fonts. We use JetBrains Mono as the web fallback. If Hugo wants Maple Mono, he can self-host the font in `public/fonts/` later.

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on localhost, page shows "Portfolio" in accent color on dark background.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.app.json vite.config.ts index.html src/main.tsx src/App.tsx src/index.css .gitignore
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

## Task 2: Tailwind Theme (Tokyo Night + Form Tokens)

**Files:**
- Create: `src/theme/tokyonight.ts`
- Modify: `src/index.css`

- [ ] **Step 1: Create Tokyo Night theme tokens**

Create `src/theme/tokyonight.ts`:

```ts
/**
 * Tokyo Night theme tokens.
 *
 * Contains color palettes (dark + light) and form tokens
 * (spacing, rounding, animation curves) derived from Hugo's dotfiles.
 *
 * Colors: Tokyo Night palette.
 * Form: Hyprland gaps (4/6/12/16), rounding (4/6/8), beziers (snap/drift).
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md
 */

/** Dark palette — Tokyo Night (default) */
export const dark = {
  bg: "#1a1b26",
  "bg-dark": "#16161e",
  fg: "#a9b1d6",
  accent: "#7aa2f7",
  secondary: "#bb9af7",
  green: "#9ece6a",
  red: "#f7768e",
  orange: "#ff9e64",
  comment: "#565f89",
} as const

/** Light palette — Tokyo Night Day */
export const light = {
  bg: "#d5d6db",
  "bg-dark": "#c8c9ce",
  fg: "#343b58",
  accent: "#2e7de9",
  secondary: "#7847bd",
  green: "#587539",
  red: "#f52a65",
  orange: "#b15c00",
  comment: "#6172b0",
} as const

/**
 * Animation bezier curves from Hyprland config.
 * snap: fast, snappy response for UI interactions.
 * drift: smooth, flowing motion for transitions.
 */
export const beziers = {
  snap: [0.2, 0.8, 0.25, 1.0] as const,
  drift: [0.3, 0.0, 0.2, 1.0] as const,
}

/**
 * Duration ranges for animations.
 * snap: quick interactions (200-400ms).
 * drift: smooth transitions (600-1000ms).
 */
export const durations = {
  snap: { min: 0.2, default: 0.3, max: 0.4 },
  drift: { min: 0.6, default: 0.8, max: 1.0 },
}
```

- [ ] **Step 2: Configure Tailwind with Tokyo Night CSS variables**

Replace `src/index.css`:

```css
@import "tailwindcss";

@theme {
  /* Typography */
  --font-mono: "Maple Mono NF", "JetBrains Mono", ui-monospace, monospace;

  /* Tokyo Night Dark (default) */
  --color-tn-bg: #1a1b26;
  --color-tn-bg-dark: #16161e;
  --color-tn-fg: #a9b1d6;
  --color-tn-accent: #7aa2f7;
  --color-tn-secondary: #bb9af7;
  --color-tn-green: #9ece6a;
  --color-tn-red: #f7768e;
  --color-tn-orange: #ff9e64;
  --color-tn-comment: #565f89;
}

/* Tokyo Night Light override */
.light {
  --color-tn-bg: #d5d6db;
  --color-tn-bg-dark: #c8c9ce;
  --color-tn-fg: #343b58;
  --color-tn-accent: #2e7de9;
  --color-tn-secondary: #7847bd;
  --color-tn-green: #587539;
  --color-tn-red: #f52a65;
  --color-tn-orange: #b15c00;
  --color-tn-comment: #6172b0;
}

/* Base styles */
html {
  font-family: var(--font-mono);
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-tn-bg);
  color: var(--color-tn-fg);
}
```

- [ ] **Step 3: Update App.tsx to use theme tokens**

```tsx
export default function App() {
  return (
    <main className="min-h-screen font-mono">
      <p className="p-3 text-tn-accent font-bold">Portfolio</p>
      <p className="p-3 text-tn-comment">Tokyo Night theme active</p>
    </main>
  )
}
```

- [ ] **Step 4: Verify theme renders correctly**

```bash
npm run dev
```

Expected: Dark background (#1a1b26), accent blue text, comment gray text, monospace font.

- [ ] **Step 5: Commit**

```bash
git add src/theme/tokyonight.ts src/index.css src/App.tsx
git commit -m "feat: add Tokyo Night theme with dark/light palettes and form tokens"
```

---

## Task 3: Site Config + Section Registry

**Files:**
- Create: `src/config.ts`
- Create: `src/registry.ts`

- [ ] **Step 1: Create site config**

Create `src/config.ts`:

```ts
/**
 * Site configuration — source of truth.
 *
 * Controls which sections are enabled, their navbar labels,
 * and site-wide metadata. The Navbar and App read this to decide
 * what to render.
 *
 * To enable/disable a section: toggle `enabled`.
 * To add a section: add a new entry here + in registry.ts.
 *
 * @see docs/ARCHITECTURE.md — "Comment ajouter une section"
 */

/** Configuration for a single section */
export interface SectionConfig {
  /** Whether this section is rendered and shown in navbar */
  enabled: boolean
  /** Navbar label (styled as a filename for Neovim aesthetic) */
  label: string
}

/** Full site configuration */
export interface SiteConfig {
  /** Site title shown in navbar and SEO */
  title: string
  /** Section toggle map — key must match registry.ts keys */
  sections: Record<string, SectionConfig>
  /** Ordered array of section keys (controls render + nav order) */
  sectionOrder: string[]
}

export const siteConfig: SiteConfig = {
  title: "SYS_ARCH",
  sections: {
    about:      { enabled: true,  label: "about.md" },
    projects:   { enabled: true,  label: "projects/" },
    experience: { enabled: false, label: "experience.log" },
    skills:     { enabled: true,  label: "skills.toml" },
  },
  sectionOrder: ["about", "projects", "experience", "skills"],
}

/**
 * Returns only the enabled sections in order.
 * Used by App.tsx and Navbar to know what to render.
 */
export function getEnabledSections(): { key: string; config: SectionConfig }[] {
  return siteConfig.sectionOrder
    .filter((key) => siteConfig.sections[key]?.enabled)
    .map((key) => ({ key, config: siteConfig.sections[key] }))
}
```

- [ ] **Step 2: Create placeholder sections for registry**

Create `src/sections/About.tsx`:

```tsx
/**
 * Section About — Presentation and philosophy.
 *
 * Displays Hugo's bio, philosophy, and setup.
 * Data: src/data/about.ts
 */

export default function About() {
  return <div className="p-3"><p className="text-tn-comment">[ about.md ]</p></div>
}
```

Create `src/sections/Projects.tsx`:

```tsx
/**
 * Section Projects — Personal projects showcase.
 *
 * Displays project cards with SplitView detail panel.
 * Data: src/data/projects.ts
 */

export default function Projects() {
  return <div className="p-3"><p className="text-tn-comment">[ projects/ ]</p></div>
}
```

Create `src/sections/Experience.tsx`:

```tsx
/**
 * Section Experience — Professional experience and leadership.
 *
 * Displays experience entries with SplitView detail panel.
 * Data: src/data/experience.ts
 */

export default function Experience() {
  return <div className="p-3"><p className="text-tn-comment">[ experience.log ]</p></div>
}
```

Create `src/sections/Skills.tsx`:

```tsx
/**
 * Section Skills — Technical skills and certifications.
 *
 * Displays skill categories with SplitView detail panel.
 * Data: src/data/skills.ts
 */

export default function Skills() {
  return <div className="p-3"><p className="text-tn-comment">[ skills.toml ]</p></div>
}
```

- [ ] **Step 3: Create section registry**

Create `src/registry.ts`:

```ts
/**
 * Section registry — maps config keys to React components.
 *
 * This is the Open/Closed glue: App.tsx iterates config,
 * looks up each key here, and renders the component.
 * Adding a section = adding one entry here + one in config.ts.
 *
 * @see docs/TECHNICAL_DECISIONS.md TD-009
 */

import type { ComponentType } from "react"

import About from "@/sections/About"
import Projects from "@/sections/Projects"
import Experience from "@/sections/Experience"
import Skills from "@/sections/Skills"

/** Maps section config keys to their React components */
export const sectionRegistry: Record<string, ComponentType> = {
  about: About,
  projects: Projects,
  experience: Experience,
  skills: Skills,
}
```

- [ ] **Step 4: Wire App.tsx to use config + registry**

Replace `src/App.tsx`:

```tsx
/**
 * App — Root component.
 *
 * Reads enabled sections from config, looks up components
 * in the registry, and renders them in order.
 * Wraps everything in theme and SEO providers.
 */

import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"

export default function App() {
  const sections = getEnabledSections()

  return (
    <main className="min-h-screen font-mono">
      {sections.map(({ key }) => {
        const Component = sectionRegistry[key]
        if (!Component) return null
        return (
          <section key={key} id={key} className="p-3">
            <Component />
          </section>
        )
      })}
    </main>
  )
}
```

- [ ] **Step 5: Verify config-driven rendering**

```bash
npm run dev
```

Expected: Page shows `[ about.md ]`, `[ projects/ ]`, `[ skills.toml ]`. Experience is hidden (enabled: false).

- [ ] **Step 6: Verify toggling works**

Temporarily change `experience.enabled` to `true` in config.ts. Verify `[ experience.log ]` appears. Change it back to `false`.

- [ ] **Step 7: Commit**

```bash
git add src/config.ts src/registry.ts src/sections/ src/App.tsx
git commit -m "feat: add config-driven section system with registry pattern"
```

---

## Task 4: Section Wrapper Component

**Files:**
- Create: `src/components/Section.tsx`
- Modify: `src/sections/About.tsx`
- Modify: `src/sections/Projects.tsx`
- Modify: `src/sections/Experience.tsx`
- Modify: `src/sections/Skills.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Section wrapper**

Create `src/components/Section.tsx`:

```tsx
/**
 * Section — Generic wrapper for portfolio sections.
 *
 * Provides consistent layout, spacing, and scroll target (id).
 * Every section component must wrap its content in this.
 * The id is used by vim navigation for scroll-to-section.
 *
 * @see docs/CONVENTIONS.md — "Structure d'un composant section"
 */

import type { ReactNode } from "react"

interface SectionProps {
  /** Section id — must match the config key for scroll targeting */
  id: string
  children: ReactNode
}

export default function Section({ id, children }: SectionProps) {
  return (
    <section
      id={id}
      className="min-h-screen p-3 border-b border-tn-comment/20"
    >
      {children}
    </section>
  )
}
```

- [ ] **Step 2: Update all section components to use Section wrapper**

Update `src/sections/About.tsx`:

```tsx
/**
 * Section About — Presentation and philosophy.
 *
 * Displays Hugo's bio, philosophy, and setup.
 * Data: src/data/about.ts
 */

import Section from "@/components/Section"

export default function About() {
  return (
    <Section id="about">
      <p className="text-tn-comment">[ about.md ]</p>
    </Section>
  )
}
```

Update `src/sections/Projects.tsx`:

```tsx
/**
 * Section Projects — Personal projects showcase.
 *
 * Displays project cards with SplitView detail panel.
 * Data: src/data/projects.ts
 */

import Section from "@/components/Section"

export default function Projects() {
  return (
    <Section id="projects">
      <p className="text-tn-comment">[ projects/ ]</p>
    </Section>
  )
}
```

Update `src/sections/Experience.tsx`:

```tsx
/**
 * Section Experience — Professional experience and leadership.
 *
 * Displays experience entries with SplitView detail panel.
 * Data: src/data/experience.ts
 */

import Section from "@/components/Section"

export default function Experience() {
  return (
    <Section id="experience">
      <p className="text-tn-comment">[ experience.log ]</p>
    </Section>
  )
}
```

Update `src/sections/Skills.tsx`:

```tsx
/**
 * Section Skills — Technical skills and certifications.
 *
 * Displays skill categories with SplitView detail panel.
 * Data: src/data/skills.ts
 */

import Section from "@/components/Section"

export default function Skills() {
  return (
    <Section id="skills">
      <p className="text-tn-comment">[ skills.toml ]</p>
    </Section>
  )
}
```

- [ ] **Step 3: Update App.tsx — remove redundant section wrapper**

Replace `src/App.tsx`:

```tsx
/**
 * App — Root component.
 *
 * Reads enabled sections from config, looks up components
 * in the registry, and renders them in order.
 */

import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"

export default function App() {
  const sections = getEnabledSections()

  return (
    <main className="min-h-screen font-mono">
      {sections.map(({ key }) => {
        const Component = sectionRegistry[key]
        if (!Component) return null
        return <Component key={key} />
      })}
    </main>
  )
}
```

- [ ] **Step 4: Verify sections render with consistent layout**

```bash
npm run dev
```

Expected: Each section takes full viewport height, separated by subtle bottom borders.

- [ ] **Step 5: Commit**

```bash
git add src/components/Section.tsx src/sections/ src/App.tsx
git commit -m "feat: add Section wrapper for consistent layout and scroll targeting"
```

---

## Task 5: Data Files

**Files:**
- Create: `src/data/about.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/experience.ts`
- Create: `src/data/skills.ts`

- [ ] **Step 1: Create about data**

Create `src/data/about.ts`:

```ts
/**
 * Data for the About section.
 *
 * Modify this file to update the About section content.
 * See src/sections/About.tsx for rendering.
 */

/** About section content */
export interface AboutData {
  /** Main title */
  title: string
  /** Short tagline */
  tagline: string
  /** Multi-paragraph bio */
  bio: string[]
  /** Key focus areas displayed as tags */
  focus: string[]
}

/** About section content */
export const aboutData: AboutData = {
  title: "Hugo Fabresse",
  tagline: "System Architect",
  bio: [
    "Specialisation en C. Focus structurel. Refus des abstractions inutiles.",
    "Environnement minimaliste (Hyprland, Neovim). Rigueur mathematique appliquee au code. Controle total sur l'execution.",
  ],
  focus: ["C", "Low-Level", "Security", "Architecture"],
}
```

- [ ] **Step 2: Create projects data**

Create `src/data/projects.ts`:

```ts
/**
 * Data for the Projects section.
 *
 * Modify this file to update the Projects section content.
 * See src/sections/Projects.tsx for rendering.
 */

/** A single project entry */
export interface Project {
  /** Unique identifier (used as key and for SplitView) */
  id: string
  /** Project name */
  title: string
  /** One-line project description */
  subtitle: string
  /** Detailed description shown in SplitView detail panel */
  description: string
  /** Technology tags */
  tags: string[]
  /** GitHub repository URL */
  github?: string
  /** Live demo URL */
  url?: string
}

/** All projects */
export const projectsData: Project[] = [
  {
    id: "just",
    title: "JUST",
    subtitle: "Version Control System",
    description:
      "VCS developpe integralement en C from scratch. Implementation d'un systeme d'objets complet (blobs, trees, commits). Gestion de memoire rigoureuse et compilation stricte. Manipulation avancee de pointeurs.",
    tags: ["C", "Makefile", "Memory Management", "Data Structures"],
  },
  {
    id: "goat",
    title: "GOAT",
    subtitle: "Minimalist Git",
    description:
      "Reproduction des primitives essentielles de Git. Approche experimentale visant a comprendre les mecanismes internes profonds de l'outil. Parfaite complementarite architecturale avec le developpement de JUST.",
    tags: ["C", "System Calls", "File I/O", "Reverse Engineering"],
  },
]
```

- [ ] **Step 3: Create experience data**

Create `src/data/experience.ts`:

```ts
/**
 * Data for the Experience section.
 *
 * Modify this file to update the Experience section content.
 * See src/sections/Experience.tsx for rendering.
 */

/** A single experience entry */
export interface Experience {
  /** Unique identifier */
  id: string
  /** Role/title */
  role: string
  /** Organization name */
  organization: string
  /** Category tag (Leadership, Encadrement, Pedagogie...) */
  type: string
  /** Detailed description shown in SplitView detail panel */
  description: string
  /** Optional time period */
  period?: string
}

/** All experience entries */
export const experienceData: Experience[] = [
  {
    id: "chef-projet",
    role: "Chef de Projet, Scrum Master & Lead Developer",
    organization: "Projets Techniques Avances",
    type: "Leadership",
    description:
      "Pilotage d'equipes de developpement sur des projets d'envergure. Vision strategique, anticipation proactive des bloqueurs techniques et prise de decision critique sous contrainte de temps.",
  },
  {
    id: "coding-club",
    role: "Manager & Superviseur",
    organization: "Coding Club Epitech Montpellier",
    type: "Encadrement",
    description:
      "1 an d'experience en tant que Superviseur suivi d'une annee comme Manager. Responsable de l'organisation des sessions, de la transmission des connaissances et de la gestion de l'equipe pedagogique.",
  },
  {
    id: "aer",
    role: "Accompagnateur Etudiant (AER)",
    organization: "Epitech",
    type: "Pedagogie",
    description:
      "2 ans d'implication directe dans le soutien technique. Pedagogie axee sur la deconstruction et l'explication claire de concepts complexes (algorithmique, gestion memoire, architecture systeme).",
  },
]
```

- [ ] **Step 4: Create skills data**

Create `src/data/skills.ts`:

```ts
/**
 * Data for the Skills section.
 *
 * Modify this file to update the Skills section content.
 * See src/sections/Skills.tsx for rendering.
 */

/** A skill category with a list of items */
export interface SkillCategory {
  /** Unique identifier */
  id: string
  /** Category name */
  title: string
  /** Skills within this category */
  items: string[]
  /** Detailed description shown in SplitView detail panel */
  description?: string
}

/** All skill categories */
export const skillsData: SkillCategory[] = [
  {
    id: "expertise",
    title: "Domaines d'expertise",
    items: [
      "C (Axe de developpement principal)",
      "C++",
      "Assembly (Architecture bas niveau)",
      "Manipulation avancee des structures memoire",
      "Interaction systeme profonde",
      "Securite offensive / Pentest / Red Team",
    ],
  },
  {
    id: "methodologie",
    title: "Methodologie",
    items: [
      "Minimalisme structurel et conceptuel",
      "Rejet de la complexite inutile et des abstractions couteuses",
      "Philosophie du 'Build tools, not dependencies'",
      "Vision strategique et anticipation des failles",
    ],
  },
]
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/
git commit -m "feat: add typed data files for all sections"
```

---

## Task 6: Navbar (Waybar-inspired)

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/hooks/useActiveSection.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create useActiveSection hook**

Create `src/hooks/useActiveSection.ts`:

```ts
/**
 * useActiveSection — Tracks which section is currently visible.
 *
 * Uses IntersectionObserver to detect which section is in the viewport.
 * Returns the key of the currently visible section for navbar highlighting.
 */

import { useState, useEffect } from "react"

import { getEnabledSections } from "@/config"

/**
 * Observes enabled sections and returns the key of the one
 * currently most visible in the viewport.
 *
 * @returns The config key of the active section (e.g. "about", "projects")
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const sections = getEnabledSections()
    const sectionIds = sections.map(({ key }) => key)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.3 },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return activeSection
}
```

- [ ] **Step 2: Create Navbar component**

Create `src/components/Navbar.tsx`:

```tsx
/**
 * Navbar — Top navigation bar inspired by Waybar/Neovim tabline.
 *
 * Displays enabled sections as "buffer tabs" with file-style labels.
 * Highlights the currently active section (via IntersectionObserver).
 * Includes dark/light mode toggle and vim mode indicator.
 *
 * Height: 24-32px (matching Waybar's minimal footprint).
 * Active tab: fg/bg inversion + bold (Waybar/Wofi pattern).
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Navbar"
 */

import { getEnabledSections } from "@/config"
import { siteConfig } from "@/config"
import { useActiveSection } from "@/hooks/useActiveSection"

export default function Navbar() {
  const sections = getEnabledSections()
  const activeSection = useActiveSection()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-8 px-3 bg-tn-bg-dark border-b border-tn-comment/20 font-mono text-[11px]">
      {/* Site title */}
      <span className="text-tn-accent font-bold mr-3">
        {siteConfig.title}
      </span>

      {/* Section tabs */}
      <div className="flex items-center gap-1">
        {sections.map(({ key, config }) => {
          const isActive = activeSection === key
          return (
            <button
              key={key}
              onClick={() => {
                document.getElementById(key)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`px-[10px] py-[2px] rounded transition-colors ${
                isActive
                  ? "bg-tn-fg text-tn-bg font-bold"
                  : "text-tn-fg hover:bg-white/10"
              }`}
            >
              {config.label}
            </button>
          )
        })}
      </div>

      {/* Right side — mode indicator */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-tn-green font-bold">NORMAL</span>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Add Navbar to App.tsx**

Replace `src/App.tsx`:

```tsx
/**
 * App — Root component.
 *
 * Renders the Navbar and all enabled sections from config.
 */

import Navbar from "@/components/Navbar"
import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"

export default function App() {
  const sections = getEnabledSections()

  return (
    <>
      <Navbar />
      <main className="min-h-screen font-mono pt-8">
        {sections.map(({ key }) => {
          const Component = sectionRegistry[key]
          if (!Component) return null
          return <Component key={key} />
        })}
      </main>
    </>
  )
}
```

- [ ] **Step 4: Verify navbar renders and highlights active section**

```bash
npm run dev
```

Expected: Fixed top bar (~32px), dark background, section tabs with file-style labels. Scrolling highlights the current section tab with inverted colors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx src/hooks/useActiveSection.ts src/App.tsx
git commit -m "feat: add Waybar-inspired navbar with active section tracking"
```

---

## Task 7: Dark/Light Mode Toggle

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] **Step 1: Configure next-themes provider**

Update `src/main.tsx`:

```tsx
/**
 * Entry point — Mounts the React app with theme provider.
 */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"

import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" themes={["dark", "light"]}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

- [ ] **Step 2: Update index.html to prevent flash**

Add `class="dark"` to the `<html>` tag in `index.html`:

```html
<html lang="fr" class="dark">
```

- [ ] **Step 3: Update CSS for class-based theme switching**

In `src/index.css`, change the light theme selector from `.light` to `.light` (already correct since next-themes adds class to `<html>`):

The existing `.light { ... }` block already works because next-themes sets the class on `<html>`.

- [ ] **Step 4: Add theme toggle to Navbar**

Update the right side of `src/components/Navbar.tsx`:

```tsx
import { useTheme } from "next-themes"

// Inside Navbar component, add:
const { theme, setTheme } = useTheme()

// Replace the right-side div:
<div className="ml-auto flex items-center gap-3">
  <button
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="text-tn-comment hover:text-tn-fg transition-colors"
    title="Toggle theme (:theme)"
  >
    {theme === "dark" ? "light" : "dark"}
  </button>
  <span className="text-tn-green font-bold">NORMAL</span>
</div>
```

- [ ] **Step 5: Verify theme toggle works**

```bash
npm run dev
```

Expected: Clicking the theme toggle switches between dark (Tokyo Night) and light (Tokyo Night Day). Colors update across the entire page. Preference is persisted in localStorage.

- [ ] **Step 6: Commit**

```bash
git add src/main.tsx src/components/Navbar.tsx src/index.css index.html
git commit -m "feat: add dark/light mode toggle with next-themes"
```

---

## Task 8: SplitView Component (Tiling WM)

**Files:**
- Create: `src/components/SplitView.tsx`

- [ ] **Step 1: Create SplitView component**

Create `src/components/SplitView.tsx`:

```tsx
/**
 * SplitView — Hyprland-inspired tiling window manager component.
 *
 * Generic component that manages 3 states:
 * 1. CLOSED: displays items in a list/grid
 * 2. SPLIT: screen divides — list on left, detail on right (desktop)
 *    or list on top, detail on bottom (mobile)
 * 3. EXPANDED: detail takes full width, list hidden
 *
 * Uses render props to stay content-agnostic.
 * Styled with Hyprland aesthetics: gaps, borders, panel titles.
 *
 * @see docs/TECHNICAL_DECISIONS.md TD-010
 * @see docs/ARCHITECTURE.md — "Flux Split View"
 */

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

/** Bezier curves from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const
const drift = [0.3, 0.0, 0.2, 1.0] as const

/** The three view states */
type ViewState = "closed" | "split" | "expanded"

interface SplitViewProps<T> {
  /** Array of items to display */
  items: T[]
  /** Unique key extractor for each item */
  getKey: (item: T) => string
  /** Render a single item in the list panel */
  renderItem: (item: T, isSelected: boolean) => React.ReactNode
  /** Render the detail panel for the selected item */
  renderDetail: (item: T) => React.ReactNode
  /** Title shown in the list panel header (e.g. "projects/") */
  listTitle: string
  /** Title shown in the detail panel header (derived from selected item) */
  getDetailTitle: (item: T) => string
}

export default function SplitView<T>({
  items,
  getKey,
  renderItem,
  renderDetail,
  listTitle,
  getDetailTitle,
}: SplitViewProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [viewState, setViewState] = useState<ViewState>("closed")

  /** Open split view with a specific item */
  const openSplit = (item: T) => {
    setSelectedItem(item)
    setViewState("split")
  }

  /** Expand detail to full width */
  const expand = () => {
    setViewState("expanded")
  }

  /** Close detail — from expanded goes to split, from split goes to closed */
  const close = () => {
    if (viewState === "expanded") {
      setViewState("split")
    } else {
      setViewState("closed")
      setSelectedItem(null)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-1.5 min-h-[400px]">
      {/* List panel — hidden when expanded */}
      <AnimatePresence>
        {viewState !== "expanded" && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              flex: viewState === "closed" ? 1 : undefined,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: snap }}
            className={`
              border-2 rounded-lg overflow-hidden
              ${viewState === "split" ? "lg:w-2/5 w-full" : "w-full"}
              ${selectedItem ? "border-tn-comment" : "border-tn-comment/20"}
            `}
          >
            {/* Panel title bar */}
            <div className="flex items-center h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px] text-tn-comment">
              {listTitle}
            </div>

            {/* Items */}
            <div className={`p-1.5 ${viewState === "closed" ? "grid grid-cols-1 md:grid-cols-2 gap-1.5" : "flex flex-col gap-1.5"}`}>
              {items.map((item) => {
                const key = getKey(item)
                const isSelected = selectedItem !== null && getKey(selectedItem) === key
                return (
                  <button
                    key={key}
                    onClick={() => openSplit(item)}
                    className={`text-left rounded-md p-3 transition-colors ${
                      isSelected
                        ? "bg-tn-fg text-tn-bg font-bold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {renderItem(item, isSelected)}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel — visible in split and expanded states */}
      <AnimatePresence>
        {selectedItem && viewState !== "closed" && (
          <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: snap }}
            className={`
              border-2 border-tn-accent rounded-lg overflow-hidden
              ${viewState === "expanded" ? "w-full" : "lg:w-3/5 w-full"}
            `}
          >
            {/* Panel title bar with controls */}
            <div className="flex items-center justify-between h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px]">
              <span className="text-tn-accent font-bold">
                {getDetailTitle(selectedItem)}
              </span>
              <div className="flex items-center gap-1">
                {viewState === "split" && (
                  <button
                    onClick={expand}
                    className="text-tn-comment hover:text-tn-fg transition-colors"
                    title="Expand (o)"
                  >
                    [expand]
                  </button>
                )}
                <button
                  onClick={close}
                  className="text-tn-comment hover:text-tn-fg transition-colors"
                  title="Close (q)"
                >
                  [x]
                </button>
              </div>
            </div>

            {/* Detail content */}
            <div className="p-3">
              {renderDetail(selectedItem)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SplitView.tsx
git commit -m "feat: add SplitView component with Hyprland tiling WM behavior"
```

---

## Task 9: Wire Sections to Data + SplitView

**Files:**
- Modify: `src/sections/About.tsx`
- Modify: `src/sections/Projects.tsx`
- Modify: `src/sections/Experience.tsx`
- Modify: `src/sections/Skills.tsx`

- [ ] **Step 1: Implement About section (no SplitView — simple content)**

Update `src/sections/About.tsx`:

```tsx
/**
 * Section About — Presentation and philosophy.
 *
 * Displays Hugo's bio, philosophy, and focus areas.
 * Simple layout — no SplitView (no detail to expand).
 * Data: src/data/about.ts
 */

import { motion } from "framer-motion"

import Section from "@/components/Section"
import { aboutData } from "@/data/about"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

export default function About() {
  return (
    <Section id="about">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: snap }}
        className="max-w-2xl"
      >
        <h1 className="text-tn-accent font-bold">{aboutData.title}</h1>
        <p className="text-tn-secondary text-[11px] mt-1">{aboutData.tagline}</p>

        <div className="mt-3 flex flex-col gap-1.5">
          {aboutData.bio.map((paragraph, i) => (
            <p key={i} className="text-[13px] leading-relaxed">{paragraph}</p>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {aboutData.focus.map((tag) => (
            <span
              key={tag}
              className="px-[10px] py-[2px] text-[11px] rounded bg-tn-accent/10 text-tn-accent border border-tn-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}
```

- [ ] **Step 2: Implement Projects section with SplitView**

Update `src/sections/Projects.tsx`:

```tsx
/**
 * Section Projects — Personal projects showcase.
 *
 * Uses SplitView to display project cards with expandable detail.
 * Data: src/data/projects.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import { projectsData } from "@/data/projects"

import type { Project } from "@/data/projects"

export default function Projects() {
  return (
    <Section id="projects">
      <SplitView<Project>
        items={projectsData}
        getKey={(p) => p.id}
        listTitle="projects/"
        getDetailTitle={(p) => `${p.id}.c`}
        renderItem={(project, isSelected) => (
          <div>
            <span className={isSelected ? "" : "text-tn-accent"}>{project.title}</span>
            <span className={`ml-1.5 text-[11px] ${isSelected ? "opacity-70" : "text-tn-comment"}`}>
              {project.subtitle}
            </span>
          </div>
        )}
        renderDetail={(project) => (
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-tn-accent font-bold">{project.title}</h3>
              <p className="text-tn-comment text-[11px]">{project.subtitle}</p>
            </div>
            <p className="text-[13px] leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-[10px] py-[2px] text-[11px] rounded bg-tn-green/10 text-tn-green border border-tn-green/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tn-accent text-[11px] hover:underline"
              >
                {project.github}
              </a>
            )}
          </div>
        )}
      />
    </Section>
  )
}
```

- [ ] **Step 3: Implement Experience section with SplitView**

Update `src/sections/Experience.tsx`:

```tsx
/**
 * Section Experience — Professional experience and leadership.
 *
 * Uses SplitView to display experience entries with expandable detail.
 * Data: src/data/experience.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import { experienceData } from "@/data/experience"

import type { Experience } from "@/data/experience"

export default function Experience() {
  return (
    <Section id="experience">
      <SplitView<Experience>
        items={experienceData}
        getKey={(e) => e.id}
        listTitle="experience.log"
        getDetailTitle={(e) => e.id}
        renderItem={(exp, isSelected) => (
          <div>
            <span className={isSelected ? "" : "text-tn-accent"}>{exp.role}</span>
            <span className={`ml-1.5 text-[11px] ${isSelected ? "opacity-70" : "text-tn-comment"}`}>
              @ {exp.organization}
            </span>
          </div>
        )}
        renderDetail={(exp) => (
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-tn-accent font-bold">{exp.role}</h3>
              <p className="text-tn-comment text-[11px]">
                {exp.organization} — {exp.type}
              </p>
              {exp.period && (
                <p className="text-tn-comment text-[11px]">{exp.period}</p>
              )}
            </div>
            <p className="text-[13px] leading-relaxed">{exp.description}</p>
          </div>
        )}
      />
    </Section>
  )
}
```

- [ ] **Step 4: Implement Skills section with SplitView**

Update `src/sections/Skills.tsx`:

```tsx
/**
 * Section Skills — Technical skills and certifications.
 *
 * Uses SplitView to display skill categories with item lists.
 * Data: src/data/skills.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import { skillsData } from "@/data/skills"

import type { SkillCategory } from "@/data/skills"

export default function Skills() {
  return (
    <Section id="skills">
      <SplitView<SkillCategory>
        items={skillsData}
        getKey={(s) => s.id}
        listTitle="skills.toml"
        getDetailTitle={(s) => `[${s.id}]`}
        renderItem={(category, isSelected) => (
          <div>
            <span className={isSelected ? "" : "text-tn-accent"}>{category.title}</span>
            <span className={`ml-1.5 text-[11px] ${isSelected ? "opacity-70" : "text-tn-comment"}`}>
              ({category.items.length})
            </span>
          </div>
        )}
        renderDetail={(category) => (
          <div className="flex flex-col gap-3">
            <h3 className="text-tn-accent font-bold">{category.title}</h3>
            {category.description && (
              <p className="text-[13px] leading-relaxed">{category.description}</p>
            )}
            <ul className="flex flex-col gap-1">
              {category.items.map((item) => (
                <li key={item} className="text-[13px]">
                  <span className="text-tn-comment mr-1.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      />
    </Section>
  )
}
```

- [ ] **Step 5: Verify all sections render with data and SplitView**

```bash
npm run dev
```

Expected: About shows bio and tags. Projects and Skills show clickable lists that split the screen on click. Clicking expand goes full width. Closing returns to list.

- [ ] **Step 6: Commit**

```bash
git add src/sections/
git commit -m "feat: wire all sections to data files and SplitView"
```

---

## Task 10: Vim Navigation Hook

**Files:**
- Create: `src/hooks/useVimNavigation.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create useVimNavigation hook**

Create `src/hooks/useVimNavigation.ts`:

```ts
/**
 * useVimNavigation — Global vim-style keyboard navigation.
 *
 * Listens to keydown events and maps vim motions to page actions.
 * Disabled when an input/textarea has focus (e.g. CommandBar).
 *
 * Keybinds:
 * - j/k: scroll down/up
 * - gg/G: top/bottom of page
 * - 1-9: jump to section N (enabled sections only)
 * - /: open command bar (search mode)
 * - :: open command bar (command mode)
 * - Esc: close overlays
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Navigation Vim"
 */

import { useEffect, useRef, useCallback } from "react"

import { getEnabledSections } from "@/config"

/** Scroll amount in pixels for j/k */
const SCROLL_STEP = 100

interface VimNavigationOptions {
  /** Callback when "/" is pressed — opens command bar in search mode */
  onSearch?: () => void
  /** Callback when ":" is pressed — opens command bar in command mode */
  onCommand?: () => void
  /** Callback when "Esc" is pressed — closes overlays */
  onEscape?: () => void
}

/**
 * Registers global vim keybinds for page navigation.
 *
 * @param options - Callbacks for search, command, and escape actions
 */
export function useVimNavigation(options: VimNavigationOptions = {}) {
  const lastKeyRef = useRef("")
  const lastKeyTimeRef = useRef(0)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      /* Skip if user is typing in an input */
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      const now = Date.now()
      const key = e.key

      switch (key) {
        case "j":
          e.preventDefault()
          window.scrollBy({ top: SCROLL_STEP, behavior: "smooth" })
          break

        case "k":
          e.preventDefault()
          window.scrollBy({ top: -SCROLL_STEP, behavior: "smooth" })
          break

        case "g":
          /* gg = go to top (two g presses within 500ms) */
          if (lastKeyRef.current === "g" && now - lastKeyTimeRef.current < 500) {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          break

        case "G":
          e.preventDefault()
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
          break

        case "/":
          e.preventDefault()
          options.onSearch?.()
          break

        case ":":
          e.preventDefault()
          options.onCommand?.()
          break

        case "Escape":
          options.onEscape?.()
          break

        default: {
          /* Number keys 1-9: jump to section N */
          const num = parseInt(key, 10)
          if (num >= 1 && num <= 9) {
            const sections = getEnabledSections()
            const target = sections[num - 1]
            if (target) {
              e.preventDefault()
              document.getElementById(target.key)?.scrollIntoView({ behavior: "smooth" })
            }
          }
        }
      }

      lastKeyRef.current = key
      lastKeyTimeRef.current = now
    },
    [options],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}
```

- [ ] **Step 2: Wire hook into App.tsx**

Update `src/App.tsx`:

```tsx
/**
 * App — Root component.
 *
 * Renders the Navbar and all enabled sections from config.
 * Registers global vim keybinds via useVimNavigation.
 */

import Navbar from "@/components/Navbar"
import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"
import { useVimNavigation } from "@/hooks/useVimNavigation"

export default function App() {
  const sections = getEnabledSections()

  useVimNavigation({
    onSearch: () => {
      /* CommandBar will be wired in Task 11 */
    },
    onCommand: () => {
      /* CommandBar will be wired in Task 11 */
    },
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen font-mono pt-8">
        {sections.map(({ key }) => {
          const Component = sectionRegistry[key]
          if (!Component) return null
          return <Component key={key} />
        })}
      </main>
    </>
  )
}
```

- [ ] **Step 3: Verify vim navigation works**

```bash
npm run dev
```

Expected:
- `j`/`k` scroll the page smoothly
- `gg` goes to top, `G` goes to bottom
- `1`, `2`, `3` jump to the corresponding enabled sections
- Keys don't trigger when typing in an input

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useVimNavigation.ts src/App.tsx
git commit -m "feat: add vim-style keyboard navigation hook"
```

---

## Task 11: Command Bar (Vim Command Palette)

**Files:**
- Create: `src/components/CommandBar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create CommandBar component**

Create `src/components/CommandBar.tsx`:

```tsx
/**
 * CommandBar — Vim-style command palette overlay.
 *
 * Activated by ":" (command mode) or "/" (search mode).
 * Supports commands: :q, :help, :theme.
 * Extensible for v2 (:lang, :blog, etc.).
 *
 * Styled like Neovim's cmdline: bottom of screen, minimal.
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Command palette"
 */

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

type CommandBarMode = "command" | "search" | null

interface CommandBarProps {
  /** Current mode — null means closed */
  mode: CommandBarMode
  /** Called when the bar should close */
  onClose: () => void
}

/** Available commands and their descriptions */
const helpText = [
  ":q        — Close this (you can't quit the web)",
  ":help     — Show available commands",
  ":theme    — Toggle dark/light mode",
  "j/k       — Scroll down/up",
  "gg/G      — Top/Bottom",
  "1-4       — Jump to section",
  "/         — Search",
  "Esc       — Close",
]

export default function CommandBar({ mode, onClose }: CommandBarProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

  /* Focus input when mode changes */
  useEffect(() => {
    if (mode) {
      setInput("")
      setOutput([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [mode])

  /** Execute a command string */
  const execute = (cmd: string) => {
    const trimmed = cmd.trim()

    switch (trimmed) {
      case "q":
      case "quit":
        setOutput(["E37: No write since last change (you're on the web)"])
        setTimeout(onClose, 1500)
        break
      case "help":
      case "h":
        setOutput(helpText)
        break
      case "theme":
        setTheme(theme === "dark" ? "light" : "dark")
        setOutput([`Switched to ${theme === "dark" ? "light" : "dark"} mode`])
        setTimeout(onClose, 800)
        break
      default:
        setOutput([`E492: Not a command: ${trimmed}`])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "command") {
      execute(input)
    }
    /* Search mode: scroll to first section containing the text */
    if (mode === "search") {
      const sections = document.querySelectorAll("section[id]")
      for (const section of sections) {
        if (section.textContent?.toLowerCase().includes(input.toLowerCase())) {
          section.scrollIntoView({ behavior: "smooth" })
          onClose()
          return
        }
      }
      setOutput([`Pattern not found: ${input}`])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: snap }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-tn-bg-dark border-t border-tn-comment/20"
        >
          {/* Output lines */}
          {output.length > 0 && (
            <div className="px-3 py-1.5 text-[11px]">
              {output.map((line, i) => (
                <p key={i} className="text-tn-comment">{line}</p>
              ))}
            </div>
          )}

          {/* Input line */}
          <form onSubmit={handleSubmit} className="flex items-center px-3 h-8">
            <span className="text-tn-accent font-bold mr-1">
              {mode === "command" ? ":" : "/"}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-tn-fg text-[13px] outline-none font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Wire CommandBar into App.tsx**

Update `src/App.tsx`:

```tsx
/**
 * App — Root component.
 *
 * Renders Navbar, enabled sections, and CommandBar.
 * Registers global vim keybinds via useVimNavigation.
 */

import { useState } from "react"

import Navbar from "@/components/Navbar"
import CommandBar from "@/components/CommandBar"
import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"
import { useVimNavigation } from "@/hooks/useVimNavigation"

type CommandBarMode = "command" | "search" | null

export default function App() {
  const sections = getEnabledSections()
  const [commandBarMode, setCommandBarMode] = useState<CommandBarMode>(null)

  useVimNavigation({
    onSearch: () => setCommandBarMode("search"),
    onCommand: () => setCommandBarMode("command"),
    onEscape: () => setCommandBarMode(null),
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen font-mono pt-8">
        {sections.map(({ key }) => {
          const Component = sectionRegistry[key]
          if (!Component) return null
          return <Component key={key} />
        })}
      </main>
      <CommandBar
        mode={commandBarMode}
        onClose={() => setCommandBarMode(null)}
      />
    </>
  )
}
```

- [ ] **Step 3: Verify CommandBar works**

```bash
npm run dev
```

Expected:
- Press `:` — command bar appears at bottom with `:` prefix
- Type `help` + Enter — shows keybind list
- Type `q` + Enter — shows easter egg message
- Type `theme` + Enter — toggles dark/light
- Press `/` — search mode, type text, Enter scrolls to matching section
- Press `Esc` — closes command bar

- [ ] **Step 4: Commit**

```bash
git add src/components/CommandBar.tsx src/App.tsx
git commit -m "feat: add vim command palette with :q, :help, :theme, and / search"
```

---

## Task 12: SEO with react-helmet-async

**Files:**
- Modify: `src/main.tsx`
- Create: `src/components/SEO.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create SEO component**

Create `src/components/SEO.tsx`:

```tsx
/**
 * SEO — Meta tags for search engines and social sharing.
 *
 * Sets Open Graph, Twitter Card, description, and lang.
 * Uses react-helmet-async to manage <head> tags.
 */

import { Helmet } from "react-helmet-async"

import { siteConfig } from "@/config"

export default function SEO() {
  const title = `${siteConfig.title} — Hugo Fabresse`
  const description =
    "Portfolio de Hugo Fabresse — System Architect. C, Low-Level, Security, Architecture."
  const url = "https://hugo-fabresse.github.io/Portfolio/"

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
```

- [ ] **Step 2: Add HelmetProvider to main.tsx**

Update `src/main.tsx`:

```tsx
/**
 * Entry point — Mounts the React app with theme and SEO providers.
 */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { HelmetProvider } from "react-helmet-async"

import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" themes={["dark", "light"]}>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
```

- [ ] **Step 3: Add SEO to App.tsx**

Add `import SEO from "@/components/SEO"` and `<SEO />` right after `<Navbar />` in App.tsx.

- [ ] **Step 4: Verify meta tags are set**

```bash
npm run dev
```

Inspect the page source or use browser dev tools — Elements > head should contain the og and twitter meta tags.

- [ ] **Step 5: Commit**

```bash
git add src/components/SEO.tsx src/main.tsx src/App.tsx
git commit -m "feat: add SEO meta tags with react-helmet-async"
```

---

## Task 13: GitHub Actions Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `vite.config.ts`

- [ ] **Step 1: Set Vite base path for GitHub Pages**

In `vite.config.ts`, add `base` to the config:

```ts
export default defineConfig({
  base: "/Portfolio/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

- [ ] **Step 2: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
# Deploys the portfolio to GitHub Pages on push to main.
# Build: npm ci + npm run build -> dist/
# Deploy: uploads dist/ as GitHub Pages artifact.

name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Verify build succeeds locally**

```bash
npm run build
ls dist/index.html
```

Expected: Build completes, `dist/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml vite.config.ts
git commit -m "chore: add GitHub Actions workflow for GitHub Pages deployment"
```

---

## Task 14: Documentation Update

**Files:**
- Modify: `PROGRESS.md`
- Modify: `docs/ARCHITECTURE.md` (verify up-to-date)
- Modify: `README.md` (verify up-to-date)

- [ ] **Step 1: Update PROGRESS.md with all implementation work**

Add a new entry for each completed task to `PROGRESS.md`.

- [ ] **Step 2: Verify ARCHITECTURE.md matches actual file structure**

Run `find src -type f | sort` and compare against the arborescence in `docs/ARCHITECTURE.md`. Fix any discrepancies.

- [ ] **Step 3: Verify README.md instructions work**

Run `npm install && npm run dev` from a clean state. Verify the README instructions match reality.

- [ ] **Step 4: Commit**

```bash
git add PROGRESS.md docs/ARCHITECTURE.md README.md
git commit -m "docs: update progress, architecture, and README after implementation"
```
