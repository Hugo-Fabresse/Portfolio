/**
 * NvimBuffer — Renders content lines with nvim-style line numbers and tildes.
 *
 * Wraps text content to look like a Neovim buffer:
 * - Line numbers in comment color on the left
 * - Content lines with syntax-highlighting-style formatting
 * - ~ characters for empty lines past the content
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md
 */

interface NvimLine {
  /** Line content — can be a React node for custom formatting */
  content: React.ReactNode
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
}

export default function NvimBuffer({ lines, minLines = 12 }: NvimBufferProps) {
  /* Fill remaining space with tilde lines */
  const tildeCount = Math.max(0, minLines - lines.length)
  const lineNumberWidth = String(lines.length).length

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      {/* Content lines */}
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span
            className="text-tn-comment text-right mr-3 select-none shrink-0"
            style={{ width: `${lineNumberWidth + 1}ch` }}
          >
            {i + 1}
          </span>
          <span className={line.isComment ? "text-tn-comment" : ""}>
            {line.isBlank ? "" : line.content}
          </span>
        </div>
      ))}

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
