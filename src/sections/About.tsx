/**
 * Section About — Presentation and philosophy.
 *
 * Displays Hugo's bio, philosophy, and focus areas.
 * Simple layout — no SplitView (no detail to expand).
 * Data: src/data/about.ts
 */

import { motion } from "framer-motion"

import Section from "@/components/Section"
import { aboutData } from "@/data/about"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

export default function About() {
  return (
    <Section id="about">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: snap }}
        className="max-w-2xl"
      >
        <h1 className="text-tn-accent font-bold">{aboutData.title}</h1>
        <p className="text-tn-secondary text-[11px] mt-1">{aboutData.tagline}</p>

        <div className="mt-3 flex flex-col gap-1.5">
          {aboutData.bio.map((paragraph, i) => (
            <p key={i} className="text-[13px] leading-relaxed">{paragraph}</p>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {aboutData.focus.map((tag) => (
            <span
              key={tag}
              className="px-[10px] py-[2px] text-[11px] rounded bg-tn-accent/10 text-tn-accent border border-tn-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}
