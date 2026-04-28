/**
 * Navbar — Top navigation bar inspired by Waybar/Neovim tabline.
 *
 * Displays enabled sections as buffer tabs. Active buffer is controlled
 * by parent (App.tsx), not by scroll observation.
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Navbar"
 */

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"

import { getEnabledSections } from "@/config"
import { themes, getThemeLabel } from "@/themes"

interface NavbarProps {
  /** Currently active buffer key */
  activeBuffer: string
  /** Callback to switch buffer */
  onBufferSelect: (key: string) => void
}

export default function Navbar({ activeBuffer, onBufferSelect }: NavbarProps) {
  const sections = getEnabledSections()
  const { theme, setTheme } = useTheme()
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  /* Close menu on click outside */
  useEffect(() => {
    if (!themeMenuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [themeMenuOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-8 px-3 bg-tn-bg-dark border-b border-tn-comment/20 font-mono text-[11px]">
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

      {/* Center — name */}
      <span className="absolute left-1/2 -translate-x-1/2 text-tn-accent font-bold text-[15px]">
        Hugo Fabresse
      </span>

      {/* Right side — help hint, theme toggle, mode indicator */}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-tn-comment">? help</span>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setThemeMenuOpen((prev) => !prev)}
            className="text-tn-comment hover:text-tn-fg transition-colors"
          >
            {getThemeLabel(theme ?? "dark")}
          </button>
          {themeMenuOpen && (
            <div className="absolute right-0 top-full mt-1 border border-tn-comment/20 rounded-lg bg-tn-bg-dark py-1 min-w-[180px] z-50">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id)
                    setThemeMenuOpen(false)
                  }}
                  className={`w-full text-left px-3 py-1 transition-colors ${
                    theme === t.id
                      ? "bg-tn-fg text-tn-bg font-bold"
                      : "text-tn-fg hover:bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-tn-green font-bold">NORMAL</span>
      </div>
    </nav>
  )
}
