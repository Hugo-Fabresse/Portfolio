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
