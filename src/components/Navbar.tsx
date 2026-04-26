/**
 * Navbar — Top navigation bar inspired by Waybar/Neovim tabline.
 *
 * Displays enabled sections as "buffer tabs" with file-style labels.
 * Highlights the currently active section (via IntersectionObserver).
 * Includes dark/light mode toggle and vim mode indicator.
 *
 * Height: 24-32px (matching Waybar's minimal footprint).
 * Active tab: fg/bg inversion + bold (Waybar/Wofi pattern).
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Navbar"
 */

import { useTheme } from "next-themes"

import { getEnabledSections } from "@/config"
import { siteConfig } from "@/config"
import { useActiveSection } from "@/hooks/useActiveSection"

export default function Navbar() {
  const sections = getEnabledSections()
  const activeSection = useActiveSection()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-8 px-3 bg-tn-bg-dark border-b border-tn-comment/20 font-mono text-[11px]">
      {/* Site title */}
      <span className="text-tn-accent font-bold mr-3">
        {siteConfig.title}
      </span>

      {/* Section tabs */}
      <div className="flex items-center gap-1">
        {sections.map(({ key, config }) => {
          const isActive = activeSection === key
          return (
            <button
              key={key}
              onClick={() => {
                document.getElementById(key)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`px-[10px] py-[2px] rounded transition-colors ${
                isActive
                  ? "bg-tn-fg text-tn-bg font-bold"
                  : "text-tn-fg hover:bg-white/10"
              }`}
            >
              {config.label}
            </button>
          )
        })}
      </div>

      {/* Right side — theme toggle + mode indicator */}
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-tn-comment hover:text-tn-fg transition-colors"
          title="Toggle theme (:theme)"
        >
          {theme === "dark" ? "light" : "dark"}
        </button>
        <span className="text-tn-green font-bold">NORMAL</span>
      </div>
    </nav>
  )
}
