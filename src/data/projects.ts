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
