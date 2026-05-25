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
  /** Known defaults/weaknesses (author's opinion) */
  defaults?: string
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
