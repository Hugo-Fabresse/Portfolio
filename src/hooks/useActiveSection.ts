/**
 * useActiveSection — Tracks which section is currently visible.
 *
 * Uses IntersectionObserver to detect which section is in the viewport.
 * Returns the key of the currently visible section for navbar highlighting.
 */

import { useState, useEffect } from "react"

import { getEnabledSections } from "@/config"

/**
 * Observes enabled sections and returns the key of the one
 * currently most visible in the viewport.
 *
 * @returns The config key of the active section (e.g. "about", "projects")
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const sections = getEnabledSections()
    const sectionIds = sections.map(({ key }) => key)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.3 },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return activeSection
}
