/**
 * About data loader — reads content/about.yml at build time.
 *
 * Edit content/about.yml to update about content.
 * See src/sections/About.tsx for rendering.
 */

import YAML from "yaml"

import raw from "../../content/about.yml?raw"

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
export const aboutData: AboutData = YAML.parse(raw)
