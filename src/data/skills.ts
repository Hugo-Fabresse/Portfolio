/**
 * Skills data loader — reads content/skills.yml at build time.
 *
 * Edit content/skills.yml to update skills content.
 * See src/sections/Skills.tsx for rendering.
 */

import YAML from "yaml"

import raw from "../../content/skills.yml?raw"

/** Section-level configuration */
export interface SkillsSection {
  /** Title shown in the list panel tab */
  title: string
  /** Header fields rendered as comments (key: value) */
  header: Record<string, string>
}

/** A skill category with a list of items */
export interface SkillCategory {
  /** Unique identifier */
  id: string
  /** Display name in the list */
  name: string
  /** Title shown in the detail panel tab (e.g. "expertise.c") */
  page: string
  /** Header fields rendered as comment block in detail view */
  header: Record<string, string>
  /** Skills within this category */
  items: string[]
  /** Detailed description shown in detail panel */
  description?: string
}

/** Raw YAML structure */
interface SkillsYAML {
  section: SkillsSection
  categories: SkillCategory[]
}

const parsed: SkillsYAML = YAML.parse(raw)

/** Section-level config (title, header fields) */
export const skillsSection: SkillsSection = parsed.section

/** All skill categories */
export const skillsData: SkillCategory[] = parsed.categories
