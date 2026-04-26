/**
 * Data for the Skills section.
 *
 * Modify this file to update the Skills section content.
 * See src/sections/Skills.tsx for rendering.
 */

/** A skill category with a list of items */
export interface SkillCategory {
  /** Unique identifier */
  id: string
  /** Category name */
  title: string
  /** Skills within this category */
  items: string[]
  /** Detailed description shown in SplitView detail panel */
  description?: string
}

/** All skill categories */
export const skillsData: SkillCategory[] = [
  {
    id: "expertise",
    title: "Domaines d'expertise",
    items: [
      "C (Axe de developpement principal)",
      "C++",
      "Assembly (Architecture bas niveau)",
      "Manipulation avancee des structures memoire",
      "Interaction systeme profonde",
      "Securite offensive / Pentest / Red Team",
    ],
  },
  {
    id: "methodologie",
    title: "Methodologie",
    items: [
      "Minimalisme structurel et conceptuel",
      "Rejet de la complexite inutile et des abstractions couteuses",
      "Philosophie du 'Build tools, not dependencies'",
      "Vision strategique et anticipation des failles",
    ],
  },
]
