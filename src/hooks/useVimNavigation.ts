/**
 * useVimNavigation — Global vim-style keyboard navigation.
 *
 * Buffer-based: no scroll. Number keys switch buffers.
 * j/k reserved for within-section navigation (SplitView items).
 * ? toggles help panel.
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md — "Navigation Vim"
 */

import { useEffect, useRef, useCallback } from "react"

interface VimNavigationOptions {
  /** Callback when "/" is pressed — opens command bar in search mode */
  onSearch?: () => void
  /** Callback when ":" is pressed — opens command bar in command mode */
  onCommand?: () => void
  /** Callback when "Esc" is pressed — closes overlays */
  onEscape?: () => void
  /** Callback when "?" is pressed — toggles help panel */
  onHelp?: () => void
  /** Callback when a number key is pressed — switches to buffer N (0-indexed) */
  onBufferSwitch?: (index: number) => void
}

/**
 * Registers global vim keybinds for buffer navigation.
 *
 * @param options - Callbacks for navigation actions
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
        case "/":
          e.preventDefault()
          options.onSearch?.()
          break

        case ":":
          e.preventDefault()
          options.onCommand?.()
          break

        case "?":
          e.preventDefault()
          options.onHelp?.()
          break

        case "Escape":
          options.onEscape?.()
          break

        default: {
          /* Number keys 1-9: switch to buffer N */
          const num = parseInt(key, 10)
          if (num >= 1 && num <= 9) {
            e.preventDefault()
            options.onBufferSwitch?.(num - 1)
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
