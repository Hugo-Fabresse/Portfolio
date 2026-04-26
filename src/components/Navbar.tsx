/**
 * Navbar — Top navigation bar inspired by Waybar/Neovim tabline.
 *
 * Displays enabled sections as buffer tabs. Active buffer is controlled
 * by parent (App.tsx), not by scroll observation.
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Navbar"
 */

import { useTheme } from "next-themes"

import { getEnabledSections } from "@/config"
import { siteConfig } from "@/config"

interface NavbarProps {
  /** Currently active buffer key */
  activeBuffer: string
  /** Callback to switch buffer */
  onBufferSelect: (key: string) => void
}

export default function Navbar({ activeBuffer, onBufferSelect }: NavbarProps) {
  const sections = getEnabledSections()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-8 px-3 bg-tn-bg-dark border-b border-tn-comment/20 font-mono text-[11px]">
      {/* Site title */}
      <span className="text-tn-accent font-bold mr-3">
        {siteConfig.title}
      </span>

      {/* Buffer tabs */}
      <div className="flex items-center gap-1">
        {sections.map(({ key, config }, index) => {
          const isActive = activeBuffer === key
          return (
            <button
              key={key}
              onClick={() => onBufferSelect(key)}
              className={`px-[10px] py-[2px] rounded transition-colors ${
                isActive
                  ? "bg-tn-fg text-tn-bg font-bold"
                  : "text-tn-fg hover:bg-white/10"
              }`}
            >
              <span className="text-tn-comment mr-1">{index + 1}:</span>
              {config.label}
            </button>
          )
        })}
      </div>

      {/* Right side — help hint, theme toggle, mode indicator */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-tn-comment">? help</span>
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
