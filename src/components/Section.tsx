/**
 * Section — Generic wrapper for portfolio sections.
 *
 * Provides consistent layout, spacing, and scroll target (id).
 * Every section component must wrap its content in this.
 * The id is used by vim navigation for scroll-to-section.
 *
 * @see docs/CONVENTIONS.md — "Structure d'un composant section"
 */

import type { ReactNode } from "react"

interface SectionProps {
  /** Section id — must match the config key for scroll targeting */
  id: string
  children: ReactNode
}

export default function Section({ id, children }: SectionProps) {
  return (
    <section
      id={id}
      className="min-h-screen p-3 border-b border-tn-comment/20"
    >
      {children}
    </section>
  )
}
