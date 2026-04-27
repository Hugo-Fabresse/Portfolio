# Dashboard About Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the About section into a snacks.nvim-style dashboard with ASCII header, bio, and action shortcuts.

**Architecture:** Replace About.tsx content (currently NvimBuffer with line numbers) with a centered dashboard layout. Add `githubUrl` to about data. Add dashboard-specific keybinds (p/s/g) in About.tsx via a local useEffect. Change navbar label from `about.md` to `about`.

**Tech Stack:** React, Tailwind CSS, Lucide React (FolderOpen, Wrench, Github icons), Framer Motion (existing Section wrapper).

**Spec:** `docs/superpowers/specs/2026-04-27-dashboard-about-design.md`

---

### Task 1: Add GitHub URL to about data

**Files:**
- Modify: `src/data/about.ts`

- [ ] **Step 1: Add `githubUrl` to AboutData interface and data**

```ts
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
  /** GitHub profile URL */
  githubUrl: string
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
  githubUrl: "https://github.com/Hugo-Fabresse",
}
```

---

### Task 2: Change navbar label

**Files:**
- Modify: `src/config.ts:35`

- [ ] **Step 1: Change `about.md` to `about`**

In `src/config.ts`, change:
```ts
about:      { enabled: true,  label: "about.md" },
```
to:
```ts
about:      { enabled: true,  label: "about" },
```

---

### Task 3: Rewrite About.tsx as dashboard

**Files:**
- Modify: `src/sections/About.tsx` (full rewrite)

- [ ] **Step 1: Write the dashboard component**

Replace entire `src/sections/About.tsx` with:

```tsx
/**
 * Section About — Dashboard landing page, snacks.nvim style.
 *
 * Centered layout: ASCII header, bio, focus tags, action shortcuts.
 * Keybinds p/s/g active only on this buffer.
 * Data: src/data/about.ts
 */

import { useEffect } from "react"
import { FolderOpen, Wrench, Github } from "lucide-react"

import Section from "@/components/Section"
import { aboutData } from "@/data/about"

/** ASCII art "BONJOUR" header */
const HEADER = `██████╗  ██████╗ ███╗   ██╗     ██╗ ██████╗ ██╗   ██╗██████╗
██╔══██╗██╔═══██╗████╗  ██║     ██║██╔═══██╗██║   ██║██╔══██╗
██████╔╝██║   ██║██╔██╗ ██║     ██║██║   ██║██║   ██║██████╔╝
██╔══██╗██║   ██║██║╚██╗██║██   ██║██║   ██║██║   ██║██╔══██╗
██████╔╝╚██████╔╝██║ ╚████║╚█████╔╝╚██████╔╝╚██████╔╝██║  ██║
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝`

/** Dashboard action item definition */
interface DashboardAction {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  key: string
  action: () => void
}

interface AboutProps {
  /** Callback to switch active buffer (passed from App) */
  onBufferSwitch?: (key: string) => void
}

export default function About({ onBufferSwitch }: AboutProps) {
  const actions: DashboardAction[] = [
    {
      icon: FolderOpen,
      label: "Projects",
      key: "p",
      action: () => onBufferSwitch?.("projects"),
    },
    {
      icon: Wrench,
      label: "Skills",
      key: "s",
      action: () => onBufferSwitch?.("skills"),
    },
    {
      icon: Github,
      label: "GitHub",
      key: "g",
      action: () => window.open(aboutData.githubUrl, "_blank"),
    },
  ]

  /* Dashboard-specific keybinds (p, s, g) */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      const match = actions.find((a) => a.key === e.key)
      if (match) {
        e.preventDefault()
        match.action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [actions])

  return (
    <Section id="about">
      <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
        {/* ASCII header */}
        <pre className="text-tn-accent text-[10px] sm:text-xs leading-none select-none hidden sm:block">
          {HEADER}
        </pre>

        {/* Identity */}
        <div>
          <h1 className="text-lg font-bold">{aboutData.title}</h1>
          <p className="text-tn-secondary text-sm">{aboutData.tagline}</p>
        </div>

        {/* Bio */}
        <div className="max-w-lg space-y-1 text-sm">
          {aboutData.bio.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* Focus tags */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {aboutData.focus.map((tag) => (
            <span
              key={tag}
              className="px-[10px] py-[2px] text-[11px] rounded bg-tn-accent/10 text-tn-accent border border-tn-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="text-tn-comment select-none text-xs">
          ────────────────────────────────────────
        </div>

        {/* Actions */}
        <div className="w-full max-w-xs space-y-2">
          {actions.map((item) => (
            <button
              key={item.key}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded hover:bg-tn-fg/5 transition-colors text-sm group"
            >
              <item.icon size={16} className="text-black dark:text-white shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              <span className="text-tn-comment text-xs">{item.key}</span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  )
}
```

---

### Task 4: Pass `onBufferSwitch` from App to About

**Files:**
- Modify: `src/App.tsx:46`
- Modify: `src/registry.ts` (if sections are rendered via registry lookup)

The current architecture renders sections via `sectionRegistry[activeBuffer]` which returns a component with no props. About now needs `onBufferSwitch`. Two options exist — the simplest is to pass it directly in App.tsx when the active buffer is `about`.

- [ ] **Step 1: Update App.tsx to pass onBufferSwitch to the active component**

In `src/App.tsx`, change the rendering block:

```tsx
{ActiveComponent && <ActiveComponent />}
```

to:

```tsx
{ActiveComponent && (
  <ActiveComponent
    {...(activeBuffer === "about" ? { onBufferSwitch: setActiveBuffer } : {})}
  />
)}
```

This passes `onBufferSwitch` only to the About component. Other sections ignore unknown props.

---

### Task 5: Verify and test

- [ ] **Step 1: Run dev server**

Run: `npm run dev`
Expected: site starts without errors.

- [ ] **Step 2: Visual check**

1. About page shows centered dashboard with ASCII "BONJOUR" header
2. Bio, tags, divider, and 3 action rows visible
3. Icons are black in light mode, white in dark mode
4. Navbar tab says "about" (not "about.md")

- [ ] **Step 3: Test keybinds**

1. Press `p` → switches to Projects buffer
2. Press `1` (or navigate back to about) → back to dashboard
3. Press `s` → switches to Skills buffer
4. Navigate back, press `g` → opens GitHub in new tab
5. Open CommandBar (`:`) → press `p` → should NOT trigger buffer switch (input focus guard)

- [ ] **Step 4: Test responsive**

1. Resize to mobile width → ASCII header hidden (sm:block)
2. Layout still centered, actions still functional

---

### Task 6: Update documentation

**Files:**
- Modify: `PROGRESS.md`
- Modify: `docs/ARCHITECTURE.md`

- [ ] **Step 1: Add entry to PROGRESS.md**

Add at the end of the Historique section:

```markdown
### [2026-04-27] - Dashboard About (snacks.nvim style)
- **Type**: feature
- **Fichiers**: `src/sections/About.tsx`, `src/data/about.ts`, `src/config.ts`, `src/App.tsx`
- **Details**: Remplacement de la section About par un dashboard style snacks.nvim : header ASCII "BONJOUR", bio centree, tags focus, actions avec raccourcis clavier (p→Projects, s→Skills, g→GitHub). Label navbar passe de "about.md" a "about". Icons Lucide noir/blanc selon le theme.
```

- [ ] **Step 2: Update ARCHITECTURE.md**

In the navigation flow section, add under the vim keybinds:

```
    ├── p ──► switch to Projects buffer (about dashboard only)
    ├── s ──► switch to Skills buffer (about dashboard only)
    └── g ──► open GitHub (about dashboard only)
```
