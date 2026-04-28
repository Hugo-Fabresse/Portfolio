/**
 * BufferView — Unified nvim buffer renderer.
 *
 * Renders text character-by-character with syntax highlighting segments,
 * line numbers, tildes, and a 2D cursor (j/k/h/l).
 * Tildes fill remaining visible space dynamically.
 *
 * Every buffer in the app uses this component for consistent behavior.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react"

/** A colored segment of text within a line */
export interface BufferSegment {
  /** Plain text content */
  text: string
  /** Tailwind classes for coloring (e.g. "text-tn-comment") */
  className?: string
}

/** A single line in the buffer */
export interface BufferLine {
  /** Segments of colored text — empty array = blank line */
  segments: BufferSegment[]
}

interface BufferViewProps {
  /** Lines to render */
  lines: BufferLine[]
  /** Whether the buffer is focused and cursor is active */
  active?: boolean
  /** Called when Enter is pressed — provides the line index */
  onEnter?: (lineIndex: number) => void
  /** Called when a line is clicked */
  onLineClick?: (lineIndex: number) => void
  /** Line indices that are clickable (cursor-pointer + click handler) */
  clickableLines?: number[]
}

/** Flatten segments into individual characters with their class */
function flattenLine(segments: BufferSegment[]): { char: string; className: string }[] {
  const chars: { char: string; className: string }[] = []
  for (const seg of segments) {
    for (const char of seg.text) {
      chars.push({ char, className: seg.className ?? "" })
    }
  }
  return chars
}

export default function BufferView({
  lines,
  active = false,
  onEnter,
  onLineClick,
  clickableLines,
}: BufferViewProps) {
  /* Append trailing blank line (like nvim EOL) */
  const allLines = useMemo(() => [...lines, { segments: [] }], [lines])

  const [cursorRow, setCursorRow] = useState(0)
  const [cursorCol, setCursorCol] = useState(0)
  const [tildeCount, setTildeCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lastKeyRef = useRef("")
  const lastKeyTimeRef = useRef(0)
  const lineNumberWidth = String(allLines.length).length

  /** Measure container and content to calculate tilde count */
  const updateTildes = useCallback(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const containerHeight = container.clientHeight
    const contentHeight = content.scrollHeight
    const remaining = containerHeight - contentHeight

    if (remaining <= 0) {
      setTildeCount(0)
      return
    }

    /* Get line height from first content line or estimate */
    const firstLine = content.querySelector("[data-line]")
    const lineHeight = firstLine ? firstLine.getBoundingClientRect().height : 21
    setTildeCount(Math.floor(remaining / lineHeight))
  }, [])

  useEffect(() => {
    updateTildes()

    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(updateTildes)
    observer.observe(container)
    return () => observer.disconnect()
  }, [updateTildes, allLines])

  /** Get the total character count of a line */
  const getLineLength = useCallback(
    (row: number) => {
      const line = allLines[row]
      if (!line) return 0
      return line.segments.reduce((sum, seg) => sum + seg.text.length, 0)
    },
    [allLines],
  )

  /** Clamp cursor col to line length */
  const clampCol = useCallback(
    (row: number, col: number) => {
      const len = getLineLength(row)
      if (len === 0) return 0
      return Math.min(col, len - 1)
    },
    [getLineLength],
  )

  /** Get the full plain text of a line */
  const getLineText = useCallback(
    (row: number) => {
      const line = allLines[row]
      if (!line) return ""
      return line.segments.map((s) => s.text).join("")
    },
    [allLines],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active) return

      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select") return

      const now = Date.now()
      const isDoubleKey = lastKeyRef.current === e.key && now - lastKeyTimeRef.current < 500

      switch (e.key) {
        /* Line navigation */
        case "j":
          e.preventDefault()
          setCursorRow((prev) => {
            const next = Math.min(prev + 1, allLines.length - 1)
            setCursorCol((col) => clampCol(next, col))
            return next
          })
          break
        case "k":
          e.preventDefault()
          setCursorRow((prev) => {
            const next = Math.max(0, prev - 1)
            setCursorCol((col) => clampCol(next, col))
            return next
          })
          break

        /* Character navigation */
        case "h":
          e.preventDefault()
          setCursorCol((prev) => Math.max(0, prev - 1))
          break
        case "l":
          e.preventDefault()
          setCursorCol((prev) => clampCol(cursorRow, prev + 1))
          break

        /* Line position */
        case "0":
          e.preventDefault()
          setCursorCol(0)
          break
        case "$":
          e.preventDefault()
          setCursorCol(Math.max(0, getLineLength(cursorRow) - 1))
          break
        case "^": {
          e.preventDefault()
          const text = getLineText(cursorRow)
          const firstNonSpace = text.search(/\S/)
          setCursorCol(firstNonSpace >= 0 ? firstNonSpace : 0)
          break
        }

        /* Word navigation */
        case "w": {
          e.preventDefault()
          const text = getLineText(cursorRow)
          const after = text.slice(cursorCol + 1)
          const match = after.search(/(?<=\s)\S|(?<=[a-zA-Z0-9_])[^a-zA-Z0-9_\s]|(?<=[^a-zA-Z0-9_\s])[a-zA-Z0-9_]/)
          if (match >= 0) {
            setCursorCol(cursorCol + 1 + match)
          } else if (cursorRow < allLines.length - 1) {
            /* Move to next line start */
            setCursorRow((prev) => prev + 1)
            const nextText = getLineText(cursorRow + 1)
            const firstNonSpace = nextText.search(/\S/)
            setCursorCol(firstNonSpace >= 0 ? firstNonSpace : 0)
          }
          break
        }
        case "b": {
          e.preventDefault()
          const text = getLineText(cursorRow)
          const before = text.slice(0, cursorCol)
          /* Find last word boundary before cursor */
          const matches = [...before.matchAll(/(?:^|\s)\S|[a-zA-Z0-9_][^a-zA-Z0-9_\s]|[^a-zA-Z0-9_\s][a-zA-Z0-9_]/g)]
          if (matches.length > 0) {
            const last = matches[matches.length - 1]
            const pos = last.index! + (last[0].startsWith(" ") || last[0].startsWith("\t") ? 1 : (/\S/.test(last[0][0]) ? 0 : 1))
            setCursorCol(pos)
          } else if (cursorCol > 0) {
            setCursorCol(0)
          } else if (cursorRow > 0) {
            /* Move to end of previous line */
            setCursorRow((prev) => prev - 1)
            setCursorCol(Math.max(0, getLineLength(cursorRow - 1) - 1))
          }
          break
        }
        case "e": {
          e.preventDefault()
          const text = getLineText(cursorRow)
          const after = text.slice(cursorCol + 1)
          const match = after.search(/\S(?=\s|$)|[a-zA-Z0-9_](?=[^a-zA-Z0-9_])|[^a-zA-Z0-9_\s](?=[a-zA-Z0-9_])/)
          if (match >= 0) {
            setCursorCol(cursorCol + 1 + match)
          } else if (cursorRow < allLines.length - 1) {
            setCursorRow((prev) => prev + 1)
            const nextText = getLineText(cursorRow + 1)
            const wordEnd = nextText.search(/\S(?=\s|$)/)
            setCursorCol(wordEnd >= 0 ? wordEnd : 0)
          }
          break
        }

        /* File navigation */
        case "g":
          if (isDoubleKey) {
            /* gg — go to first line */
            e.preventDefault()
            setCursorRow(0)
            setCursorCol(0)
          }
          break
        case "G":
          /* G — go to last line */
          e.preventDefault()
          setCursorRow(allLines.length - 1)
          setCursorCol(0)
          break

        /* Paragraph navigation */
        case "{":
          e.preventDefault()
          setCursorRow((prev) => {
            let row = prev - 1
            while (row > 0 && getLineLength(row) > 0) row--
            setCursorCol(0)
            return Math.max(0, row)
          })
          break
        case "}":
          e.preventDefault()
          setCursorRow((prev) => {
            let row = prev + 1
            while (row < allLines.length - 1 && getLineLength(row) > 0) row++
            setCursorCol(0)
            return Math.min(allLines.length - 1, row)
          })
          break

        /* Action */
        case "Enter":
          e.preventDefault()
          onEnter?.(cursorRow)
          break
      }

      lastKeyRef.current = e.key
      lastKeyTimeRef.current = now
    },
    [active, allLines.length, clampCol, cursorRow, onEnter, getLineLength, getLineText],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  /* Reset cursor only when actual content changes (not just reference) */
  const prevLinesKey = useRef("")
  useEffect(() => {
    const key = lines.map((l) => l.segments.map((s) => s.text).join("")).join("\n")
    if (key !== prevLinesKey.current) {
      prevLinesKey.current = key
      setCursorRow(0)
      setCursorCol(0)
    }
  }, [lines])

  return (
    <div
      ref={containerRef}
      className="font-mono text-[13px] leading-relaxed h-full"
      style={{ fontVariantLigatures: "none" }}
    >
      {/* Content lines */}
      <div ref={contentRef}>
        {allLines.map((line, i) => {
          const isCursorLine = active && i === cursorRow
          const isBlank = line.segments.length === 0
          const chars = flattenLine(line.segments)

          return (
            <div
              key={i}
              data-line
              className={`flex ${clickableLines?.includes(i) ? "cursor-pointer" : ""}`}
              onClick={clickableLines?.includes(i) ? () => onLineClick?.(i) : undefined}
            >
              {/* Line number */}
              <span
                className="text-tn-comment text-right mr-3 select-none shrink-0"
                style={{ width: `${lineNumberWidth + 1}ch` }}
              >
                {i + 1}
              </span>

              {/* Line content — character by character */}
              <span className="min-w-0 flex-1 whitespace-pre-wrap">
                {isBlank ? (
                  isCursorLine ? (
                    <span className="bg-tn-fg text-tn-bg">{"\u00A0"}</span>
                  ) : (
                    "\u00A0"
                  )
                ) : (
                  chars.map((ch, ci) => {
                    const isUnderCursor = isCursorLine && ci === cursorCol
                    return (
                      <span
                        key={ci}
                        className={isUnderCursor ? "bg-tn-fg text-tn-bg" : ch.className}
                      >
                        {ch.char}
                      </span>
                    )
                  })
                )}
              </span>
            </div>
          )
        })}
      </div>

      {/* Tilde lines — fill remaining visible space */}
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
