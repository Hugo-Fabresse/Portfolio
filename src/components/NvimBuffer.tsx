/**
 * NvimBuffer — Renders content lines with nvim-style line numbers, tildes, and cursor.
 *
 * Wraps text content to look like a Neovim buffer:
 * - Line numbers in comment color on the left
 * - Content lines with syntax-highlighting-style formatting
 * - ~ characters for empty lines past the content
 * - 2D cursor (j/k/h/l) when active
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md
 */

import { useState, useEffect, useCallback } from "react"

interface NvimLine {
  /** Line content — can be a React node for custom formatting */
  content: React.ReactNode
  /** Plain text of the line — used for cursor bounds */
  text?: string
  /** If true, this is a comment line (dimmed) */
  isComment?: boolean
  /** If true, this line is blank (no content, just line number) */
  isBlank?: boolean
}

interface NvimBufferProps {
  /** Lines to render in the buffer */
  lines: NvimLine[]
  /** Minimum total lines to show (fills rest with ~) */
  minLines?: number
  /** Whether the buffer is focused and cursor is active */
  active?: boolean
}

export default function NvimBuffer({ lines, minLines = 12, active = false }: NvimBufferProps) {
  const [cursorRow, setCursorRow] = useState(0)
  const [cursorCol, setCursorCol] = useState(0)
  const tildeCount = Math.max(0, minLines - lines.length)
  const lineNumberWidth = String(lines.length).length

  /** Get the text length of a line for cursor bounds */
  const getLineLength = useCallback(
    (row: number) => {
      const line = lines[row]
      if (!line || line.isBlank) return 0
      return line.text?.length ?? 1
    },
    [lines],
  )

  /** Keyboard handler for cursor navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active) return

      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select") return

      switch (e.key) {
        case "j":
          e.preventDefault()
          setCursorRow((prev) => {
            const next = Math.min(prev + 1, lines.length - 1)
            const maxCol = Math.max(0, getLineLength(next) - 1)
            setCursorCol((col) => Math.min(col, maxCol))
            return next
          })
          break
        case "k":
          e.preventDefault()
          setCursorRow((prev) => {
            const next = Math.max(0, prev - 1)
            const maxCol = Math.max(0, getLineLength(next) - 1)
            setCursorCol((col) => Math.min(col, maxCol))
            return next
          })
          break
        case "h":
          e.preventDefault()
          setCursorCol((prev) => Math.max(0, prev - 1))
          break
        case "l":
          e.preventDefault()
          setCursorCol((prev) => {
            const maxCol = Math.max(0, getLineLength(cursorRow) - 1)
            return Math.min(maxCol, prev + 1)
          })
          break
      }
    },
    [active, lines.length, getLineLength, cursorRow],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  /* Reset cursor when lines change (new detail opened) */
  useEffect(() => {
    setCursorRow(0)
    setCursorCol(0)
  }, [lines])

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      {/* Content lines */}
      {lines.map((line, i) => {
        const isCursorLine = active && i === cursorRow
        const lineText = line.text ?? ""
        return (
          <div key={i} className="flex">
            <span
              className="text-tn-comment text-right mr-3 select-none shrink-0"
              style={{ width: `${lineNumberWidth + 1}ch` }}
            >
              {i + 1}
            </span>
            <span className={`min-w-0 flex-1 ${line.isComment ? "text-tn-comment" : ""}`}>
              {isCursorLine ? (
                line.isBlank ? (
                  <span className="bg-tn-fg text-tn-bg">{"\u00A0"}</span>
                ) : (
                  lineText.split("").map((char, ci) =>
                    ci === cursorCol ? (
                      <span key={ci} className="bg-tn-fg text-tn-bg">{char}</span>
                    ) : (
                      <span key={ci}>{char}</span>
                    ),
                  )
                )
              ) : (
                line.isBlank ? "" : line.content
              )}
            </span>
          </div>
        )
      })}

      {/* Tilde lines (empty past end of file) */}
      {Array.from({ length: tildeCount }, (_, i) => (
        <div key={`tilde-${i}`} className="flex">
          <span
            className="text-tn-accent text-right mr-3 select-none shrink-0"
            style={{ width: `${lineNumberWidth + 1}ch` }}
          >
            ~
          </span>
        </div>
      ))}
    </div>
  )
}
