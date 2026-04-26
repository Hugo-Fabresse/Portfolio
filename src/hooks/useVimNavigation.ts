/**
 * useVimNavigation — Global vim-style keyboard navigation.
 *
 * Listens to keydown events and maps vim motions to page actions.
 * Disabled when an input/textarea has focus (e.g. CommandBar).
 *
 * Keybinds:
 * - j/k: scroll down/up
 * - gg/G: top/bottom of page
 * - 1-9: jump to section N (enabled sections only)
 * - /: open command bar (search mode)
 * - :: open command bar (command mode)
 * - Esc: close overlays
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Navigation Vim"
 */

import { useEffect, useRef, useCallback } from "react"

import { getEnabledSections } from "@/config"

/** Scroll amount in pixels for j/k */
const SCROLL_STEP = 100

interface VimNavigationOptions {
  /** Callback when "/" is pressed — opens command bar in search mode */
  onSearch?: () => void
  /** Callback when ":" is pressed — opens command bar in command mode */
  onCommand?: () => void
  /** Callback when "Esc" is pressed — closes overlays */
  onEscape?: () => void
}

/**
 * Registers global vim keybinds for page navigation.
 *
 * @param options - Callbacks for search, command, and escape actions
 */
export function useVimNavigation(options: VimNavigationOptions = {}) {
  const lastKeyRef = useRef("")
  const lastKeyTimeRef = useRef(0)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      /* Skip if user is typing in an input */
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      const now = Date.now()
      const key = e.key

      switch (key) {
        case "j":
          e.preventDefault()
          window.scrollBy({ top: SCROLL_STEP, behavior: "smooth" })
          break

        case "k":
          e.preventDefault()
          window.scrollBy({ top: -SCROLL_STEP, behavior: "smooth" })
          break

        case "g":
          /* gg = go to top (two g presses within 500ms) */
          if (lastKeyRef.current === "g" && now - lastKeyTimeRef.current < 500) {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          break

        case "G":
          e.preventDefault()
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
          break

        case "/":
          e.preventDefault()
          options.onSearch?.()
          break

        case ":":
          e.preventDefault()
          options.onCommand?.()
          break

        case "Escape":
          options.onEscape?.()
          break

        default: {
          /* Number keys 1-9: jump to section N */
          const num = parseInt(key, 10)
          if (num >= 1 && num <= 9) {
            const sections = getEnabledSections()
            const target = sections[num - 1]
            if (target) {
              e.preventDefault()
              document.getElementById(target.key)?.scrollIntoView({ behavior: "smooth" })
            }
          }
        }
      }

      lastKeyRef.current = key
      lastKeyTimeRef.current = now
    },
    [options],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}
