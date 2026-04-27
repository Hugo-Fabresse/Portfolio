/**
 * Section About — snacks.nvim-style dashboard.
 *
 * Renders ASCII header, identity, bio, focus tags, and action shortcuts.
 * Keyboard shortcuts: p (projects), s (skills), g (GitHub).
 * Data: src/data/about.ts
 */

import { useEffect } from "react"
import { FolderOpen, Wrench } from "lucide-react"

/** GitHub mark SVG — real logo, not a generic icon */
function GithubIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

import Section from "@/components/Section"
import { aboutData } from "@/data/about"

/** ASCII art for "BONJOUR" in block letters */
const ASCII_HEADER = `██████╗  ██████╗ ███╗   ██╗     ██╗ ██████╗ ██╗   ██╗██████╗
██╔══██╗██╔═══██╗████╗  ██║     ██║██╔═══██╗██║   ██║██╔══██╗
██████╔╝██║   ██║██╔██╗ ██║     ██║██║   ██║██║   ██║██████╔╝
██╔══██╗██║   ██║██║╚██╗██║██   ██║██║   ██║██║   ██║██╔══██╗
██████╔╝╚██████╔╝██║ ╚████║╚█████╔╝╚██████╔╝╚██████╔╝██║  ██║
╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝`

/** Dashboard action definition */
interface DashboardAction {
  /** Lucide icon component */
  icon: React.ElementType
  /** Display label */
  label: string
  /** Keyboard shortcut character */
  shortcut: string
  /** Action to execute on click/keypress */
  action: () => void
}

interface AboutProps {
  /** Callback to switch to another buffer by key */
  onBufferSwitch?: (key: string) => void
}

export default function About({ onBufferSwitch }: AboutProps) {
  /** Dashboard actions — Projects, Skills, GitHub */
  const actions: DashboardAction[] = [
    {
      icon: FolderOpen,
      label: "Projects",
      shortcut: "p",
      action: () => onBufferSwitch?.("projects"),
    },
    {
      icon: Wrench,
      label: "Skills",
      shortcut: "s",
      action: () => onBufferSwitch?.("skills"),
    },
    {
      icon: GithubIcon,
      label: "GitHub",
      shortcut: "g",
      action: () => window.open(aboutData.githubUrl, "_blank"),
    },
  ]

  /** Keyboard shortcuts for dashboard actions */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      /* Skip if user is typing in an input */
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      const match = actions.find((a) => a.shortcut === e.key)
      if (match) {
        e.preventDefault()
        match.action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onBufferSwitch])

  return (
    <Section id="about">
      <div className="h-full border-2 border-tn-comment rounded-lg overflow-hidden flex flex-col">
        {/* Panel title bar — same style as SplitView panels */}
        <div className="flex items-center h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px] text-tn-comment shrink-0">
          about
        </div>

        {/* Dashboard content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
          {/* ASCII header — hidden on mobile */}
          <pre className="hidden sm:block text-tn-accent text-center text-[0.55rem] leading-tight sm:text-xs">
            {ASCII_HEADER}
          </pre>

          {/* Identity */}
          <div className="text-center">
            <h1 className="text-lg font-bold">{aboutData.title}</h1>
            <p className="text-tn-secondary">{aboutData.tagline}</p>
          </div>

          {/* Bio */}
          <div className="text-center max-w-lg space-y-2">
            {aboutData.bio.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* Focus tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {aboutData.focus.map((tag) => (
              <span
                key={tag}
                className="px-[10px] py-[2px] text-[11px] rounded bg-tn-accent/10 text-tn-accent border border-tn-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Divider */}
          <span className="text-tn-comment select-none">
            ────────────────────────────────────────
          </span>

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {actions.map((a) => (
              <button
                key={a.shortcut}
                onClick={a.action}
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-tn-accent/10 transition-colors cursor-pointer"
              >
                <a.icon size={16} className="text-black dark:text-white" />
                <span className="flex-1 text-left">{a.label}</span>
                <span className="text-tn-comment text-sm">{a.shortcut}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
