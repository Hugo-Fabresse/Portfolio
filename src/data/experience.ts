/**
 * Data for the Experience section.
 *
 * Modify this file to update the Experience section content.
 * See src/sections/Experience.tsx for rendering.
 */

/** A single experience entry */
export interface Experience {
  /** Unique identifier */
  id: string
  /** Role/title */
  role: string
  /** Organization name */
  organization: string
  /** Category tag (Leadership, Encadrement, Pedagogie...) */
  type: string
  /** Detailed description shown in SplitView detail panel */
  description: string
  /** Optional time period */
  period?: string
}

/** All experience entries */
export const experienceData: Experience[] = [
  {
    id: "chef-projet",
    role: "Chef de Projet, Scrum Master & Lead Developer",
    organization: "Projets Techniques Avances",
    type: "Leadership",
    description:
      "Pilotage d'equipes de developpement sur des projets d'envergure. Vision strategique, anticipation proactive des bloqueurs techniques et prise de decision critique sous contrainte de temps.",
  },
  {
    id: "coding-club",
    role: "Manager & Superviseur",
    organization: "Coding Club Epitech Montpellier",
    type: "Encadrement",
    description:
      "1 an d'experience en tant que Superviseur suivi d'une annee comme Manager. Responsable de l'organisation des sessions, de la transmission des connaissances et de la gestion de l'equipe pedagogique.",
  },
  {
    id: "aer",
    role: "Accompagnateur Etudiant (AER)",
    organization: "Epitech",
    type: "Pedagogie",
    description:
      "2 ans d'implication directe dans le soutien technique. Pedagogie axee sur la deconstruction et l'explication claire de concepts complexes (algorithmique, gestion memoire, architecture systeme).",
  },
]
