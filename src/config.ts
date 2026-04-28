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
    about:      { enabled: true,  label: "about" },
    projects:   { enabled: true,  label: "projects.yml" },
    experience: { enabled: false, label: "experience.log" },
    skills:     { enabled: true,  label: "skills.yml" },
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
