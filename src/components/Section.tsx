/**
 * Section — Generic wrapper for portfolio sections.
 *
 * Takes full viewport (minus navbar/statusbar). Centers content.
 * No scroll between sections — each is a "buffer".
 *
 * @see docs/CONVENTIONS.md — "Structure d'un composant section"
 */

import type { ReactNode } from "react"
import { motion } from "framer-motion"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

interface SectionProps {
  /** Section id — must match the config key */
  id: string
  children: ReactNode
}

export default function Section({ id, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: snap }}
      className="h-full flex items-center justify-center p-4 overflow-auto"
    >
      <div className="w-full max-w-6xl">
        {children}
      </div>
    </motion.section>
  )
}
