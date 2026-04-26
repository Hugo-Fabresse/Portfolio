/**
 * CommandBar — Vim-style command palette overlay.
 *
 * Activated by ":" (command mode) or "/" (search mode).
 * Supports commands: :q, :help, :theme.
 * Extensible for v2 (:lang, :blog, etc.).
 *
 * Styled like Neovim's cmdline: bottom of screen, minimal.
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Command palette"
 */

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

type CommandBarMode = "command" | "search" | null

interface CommandBarProps {
  /** Current mode — null means closed */
  mode: CommandBarMode
  /** Called when the bar should close */
  onClose: () => void
}

/** Available commands and their descriptions */
const helpText = [
  ":q        — Close this (you can't quit the web)",
  ":help     — Show available commands",
  ":theme    — Toggle dark/light mode",
  "j/k       — Scroll down/up",
  "gg/G      — Top/Bottom",
  "1-4       — Jump to section",
  "/         — Search",
  "Esc       — Close",
]

export default function CommandBar({ mode, onClose }: CommandBarProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

  /* Focus input when mode changes */
  useEffect(() => {
    if (mode) {
      setInput("")
      setOutput([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [mode])

  /** Execute a command string */
  const execute = (cmd: string) => {
    const trimmed = cmd.trim()

    switch (trimmed) {
      case "q":
      case "quit":
        setOutput(["E37: No write since last change (you're on the web)"])
        setTimeout(onClose, 1500)
        break
      case "help":
      case "h":
        setOutput(helpText)
        break
      case "theme":
        setTheme(theme === "dark" ? "light" : "dark")
        setOutput([`Switched to ${theme === "dark" ? "light" : "dark"} mode`])
        setTimeout(onClose, 800)
        break
      default:
        setOutput([`E492: Not a command: ${trimmed}`])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "command") {
      execute(input)
    }
    /* Search mode: scroll to first section containing the text */
    if (mode === "search") {
      const sections = document.querySelectorAll("section[id]")
      for (const section of sections) {
        if (section.textContent?.toLowerCase().includes(input.toLowerCase())) {
          section.scrollIntoView({ behavior: "smooth" })
          onClose()
          return
        }
      }
      setOutput([`Pattern not found: ${input}`])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: snap }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-tn-bg-dark border-t border-tn-comment/20"
        >
          {/* Output lines */}
          {output.length > 0 && (
            <div className="px-3 py-1.5 text-[11px]">
              {output.map((line, i) => (
                <p key={i} className="text-tn-comment">{line}</p>
              ))}
            </div>
          )}

          {/* Input line */}
          <form onSubmit={handleSubmit} className="flex items-center px-3 h-8">
            <span className="text-tn-accent font-bold mr-1">
              {mode === "command" ? ":" : "/"}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-tn-fg text-[13px] outline-none font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
