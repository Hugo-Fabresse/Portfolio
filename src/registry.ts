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
