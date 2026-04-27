/**
 * useBufferRouting — Syncs active buffer with browser URL.
 *
 * Uses History API (pushState/popstate) to update the URL
 * when switching buffers, and reads the URL on load to restore
 * the correct buffer. No router dependency needed.
 *
 * URLs: /Portfolio/ → first section, /Portfolio/projects → projects, etc.
 */

import { useState, useEffect, useCallback } from "react"

import { getEnabledSections } from "@/config"

/** Base path from Vite config — must match vite.config.ts `base` */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "")

/**
 * Extracts the buffer key from the current URL.
 * Checks ?route= query param first (GitHub Pages 404 redirect),
 * then falls back to pathname. Returns first section if no match.
 */
function getBufferFromPath(): string {
  const sections = getEnabledSections()

  /* Check for GitHub Pages 404 redirect query param */
  const params = new URLSearchParams(window.location.search)
  const redirectedPath = params.get("route")
  if (redirectedPath) {
    const key = redirectedPath.replace(BASE, "").replace(/^\//, "").replace(/\/$/, "")
    if (sections.some((s) => s.key === key)) {
      /* Clean up the URL: replace ?route= with the real path */
      window.history.replaceState(null, "", `${BASE}/${key}`)
      return key
    }
  }

  const path = window.location.pathname.replace(BASE, "").replace(/^\//, "").replace(/\/$/, "")

  if (path && sections.some(({ key }) => key === path)) {
    return path
  }

  return sections[0]?.key ?? ""
}

/**
 * Manages active buffer state synced with browser URL.
 *
 * @returns [activeBuffer, setActiveBuffer] — setter updates both state and URL
 */
export function useBufferRouting(): [string, (key: string) => void] {
  const [activeBuffer, setActiveBufferState] = useState(getBufferFromPath)

  /** Update state and push to history */
  const setActiveBuffer = useCallback(
    (key: string) => {
      setActiveBufferState(key)

      const sections = getEnabledSections()
      const isFirst = sections[0]?.key === key
      const url = isFirst ? `${BASE}/` : `${BASE}/${key}`

      window.history.pushState({ buffer: key }, "", url)
    },
    [],
  )

  /** Handle browser back/forward */
  useEffect(() => {
    const handlePopState = () => {
      setActiveBufferState(getBufferFromPath())
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return [activeBuffer, setActiveBuffer]
}
