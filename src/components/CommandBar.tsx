/**
 * CommandBar — Vim-style command palette overlay.
 *
 * Activated by ":" (command mode) or "/" (search mode).
 * Shows suggestions as you type. Tab to complete.
 *
 * Styled like Neovim's cmdline: bottom of screen, minimal.
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Command palette"
 */

import { useState, useEffect, useRef, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import { themes } from "@/themes"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

type CommandBarMode = "command" | "search" | null

interface CommandBarProps {
  /** Current mode — null means closed */
  mode: CommandBarMode
  /** Called when the bar should close */
  onClose: () => void
}

/** Command definitions for suggestions */
const commands = [
  { name: "q", desc: "Close this (you can't quit the web)" },
  { name: "quit", desc: "Close this (you can't quit the web)" },
  { name: "help", desc: "Show keybinds and commands" },
  { name: "theme", desc: "List or set colorscheme (:theme <name>)" },
]

/** Available commands and their descriptions */
const helpText = [
  "-- Commands --",
  ":q              — Close this (you can't quit the web)",
  ":help           — Show this help",
  ":theme          — List colorschemes",
  ":theme <name>   — Set colorscheme (partial match)",
  "",
  "-- Navigation --",
  "j/k             — Navigate lines",
  "h/l             — Navigate characters",
  "Tab             — Switch panel (list/detail)",
  "1-9             — Switch buffer",
  "Enter           — Open item",
  "o               — Expand detail (focus detail)",
  "q               — Close detail (focus detail)",
  "Esc             — Close overlay",
  "",
  "-- Dashboard (about) --",
  "p               — Go to projects",
  "s               — Go to skills",
  "g               — Open GitHub",
  "",
  "-- Other --",
  "?               — Toggle help panel",
  ":               — Command bar",
  "/               — Search",
]

export default function CommandBar({ mode, onClose }: CommandBarProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

  /** Compute suggestions based on current input */
  const suggestions = useMemo(() => {
    if (mode !== "command" || !input || output.length > 0) return []

    const trimmed = input.trim().toLowerCase()

    /* Check if input starts with a theme command (with or without space) */
    if (trimmed.startsWith("theme")) {
      const rest = trimmed.slice(5).trim()
      return themes
        .filter((t) => !rest || t.id.includes(rest) || t.label.toLowerCase().includes(rest))
        .map((t) => ({ name: `theme ${t.id}`, desc: t.label }))
    }

    /* Suggest matching commands (partial match anywhere) */
    return commands.filter((c) => c.name.includes(trimmed))
  }, [input, mode, output.length])

  /* Reset selected suggestion when suggestions change */
  useEffect(() => {
    setSelectedSuggestion(0)
  }, [suggestions.length])

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
    const [command, ...args] = trimmed.split(/\s+/)
    const arg = args.join(" ").toLowerCase()

    switch (command) {
      case "q":
      case "quit":
        setOutput(["E37: No write since last change (you're on the web)"])
        setTimeout(onClose, 1500)
        break
      case "help":
      case "h":
        setOutput(helpText)
        break
      case "theme": {
        if (!arg) {
          setOutput(themes.map((t) =>
            t.id === (theme ?? "dark") ? `* ${t.label} (${t.id})` : `  ${t.label} (${t.id})`,
          ))
          break
        }
        const match = themes.find(
          (t) => t.id === arg || t.label.toLowerCase() === arg,
        ) ?? themes.find(
          (t) => t.id.includes(arg) || t.label.toLowerCase().includes(arg),
        )
        if (match) {
          setTheme(match.id)
          onClose()
        } else {
          setOutput([`E185: Cannot find colorscheme "${args.join(" ")}"`])
        }
        break
      }
      default:
        setOutput([`E492: Not a command: ${trimmed}`])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "command") {
      /* If suggestions are visible, execute the selected one */
      const cmd = suggestions.length > 0
        ? suggestions[selectedSuggestion].name
        : input
      execute(cmd)
    }
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
      return
    }

    /* Tab to complete from suggestions */
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault()
      setInput(suggestions[selectedSuggestion].name)
      return
    }

    /* Arrow keys to navigate suggestions */
    if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault()
      setSelectedSuggestion((prev) => (prev + 1) % suggestions.length)
      return
    }
    if (e.key === "ArrowUp" && suggestions.length > 0) {
      e.preventDefault()
      setSelectedSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length)
      return
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

          {/* Suggestions — above input like nvim wildmenu */}
          {suggestions.length > 0 && (
            <div className="px-3 py-1 border-b border-tn-comment/20 text-[11px] font-mono">
              {suggestions.map((s, i) => (
                <div
                  key={s.name}
                  className={`flex gap-2 px-1 ${
                    i === selectedSuggestion
                      ? "bg-tn-fg text-tn-bg font-bold"
                      : ""
                  }`}
                >
                  <span className="text-tn-accent w-40 shrink-0">:{s.name}</span>
                  <span className={i === selectedSuggestion ? "" : "text-tn-comment"}>
                    {s.desc}
                  </span>
                </div>
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
              onChange={(e) => { setInput(e.target.value); setOutput([]) }}
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
