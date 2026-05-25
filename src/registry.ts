/**
 * Section registry — maps component names to React components.
 *
 * content/site.yml references component names as strings.
 * This file resolves those strings to actual React components.
 * Adding a new component type = adding one import + one entry here.
 *
 * @see docs/TECHNICAL_DECISIONS.md TD-009
 */

import type { ComponentType } from "react"

import About from "@/sections/About"
import Projects from "@/sections/Projects"
import Experience from "@/sections/Experience"
import Skills from "@/sections/Skills"

/** Maps component name strings to their React components */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionRegistry: Record<string, ComponentType<any>> = {
  About,
  Projects,
  Experience,
  Skills,
}
