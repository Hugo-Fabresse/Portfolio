/**
 * Site configuration loader — reads content/site.yml at build time.
 *
 * Edit content/site.yml to manage navbar title, sections, and order.
 * To add a new component type, register it in src/registry.ts.
 *
 * @see docs/ARCHITECTURE.md
 */

import YAML from "yaml"

import raw from "../content/site.yml?raw"

/** Configuration for a single section */
export interface SectionConfig {
  /** Unique identifier (used for routing and buffer switching) */
  key: string
  /** Navbar label (styled as a filename for Neovim aesthetic) */
  label: string
  /** React component name (must exist in registry.ts) */
  component: string
}

/** Full site configuration */
export interface SiteConfig {
  /** Site title shown centered in navbar */
  title: string
  /** Ordered list of sections to display */
  sections: SectionConfig[]
}

export const siteConfig: SiteConfig = YAML.parse(raw)

/**
 * Returns the ordered list of sections.
 * Used by App.tsx and Navbar to know what to render.
 */
export function getEnabledSections(): SectionConfig[] {
  return siteConfig.sections
}
