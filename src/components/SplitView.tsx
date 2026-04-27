/**
 * SplitView — Hyprland-inspired tiling window manager component.
 *
 * Generic component that manages 3 states:
 * 1. CLOSED: displays items in a list/grid
 * 2. SPLIT: screen divides — list on left, detail on right (desktop)
 *    or list on top, detail on bottom (mobile)
 * 3. EXPANDED: detail takes full width, list hidden
 *
 * Uses render props to stay content-agnostic.
 * Styled with Hyprland aesthetics: gaps, borders, panel titles.
 *
 * @see docs/TECHNICAL_DECISIONS.md TD-010
 * @see docs/ARCHITECTURE.md — "Flux Split View"
 */

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

/** The three view states */
type ViewState = "closed" | "split" | "expanded"

interface SplitViewProps<T> {
  /** Array of items to display */
  items: T[]
  /** Unique key extractor for each item */
  getKey: (item: T) => string
  /** Render a single item in the list panel */
  renderItem: (item: T) => React.ReactNode
  /** Plain text of an item — used for cursor bounds */
  getItemText: (item: T) => string
  /** Render the detail panel for the selected item */
  renderDetail: (item: T) => React.ReactNode
  /** Title shown in the list panel header (e.g. "projects/") */
  listTitle: string
  /** Title shown in the detail panel header (derived from selected item) */
  getDetailTitle: (item: T) => string
}

export default function SplitView<T>({
  items,
  getKey,
  renderItem,
  getItemText,
  renderDetail,
  listTitle,
  getDetailTitle,
}: SplitViewProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [viewState, setViewState] = useState<ViewState>("closed")
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [cursorCol, setCursorCol] = useState(0)
  const [focusPanel, setFocusPanel] = useState<"list" | "detail">("list")

  /** Open split view with a specific item */
  const openSplit = (item: T) => {
    setSelectedItem(item)
    setViewState("split")
    setFocusPanel("detail")
  }

  /** Expand detail to full width */
  const expand = () => {
    setViewState("expanded")
  }

  /** Close detail — from expanded goes to split, from split goes to closed */
  const close = () => {
    if (viewState === "expanded") {
      setViewState("split")
    } else {
      setViewState("closed")
      setSelectedItem(null)
    }
  }

  /** Keyboard handler for vim-style navigation */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if an input element has focus (CommandBar, HelpPanel, etc.)
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select") return

      switch (e.key) {
        case "j":
          if (focusPanel === "list" && viewState !== "expanded") {
            e.preventDefault()
            setFocusedIndex((prev) => {
              const next = (prev + 1) % items.length
              /* Clamp cursor col to new line length */
              const maxCol = Math.max(0, getItemText(items[next]).length - 1)
              setCursorCol((col) => Math.min(col, maxCol))
              return next
            })
          }
          break
        case "k":
          if (focusPanel === "list" && viewState !== "expanded") {
            e.preventDefault()
            setFocusedIndex((prev) => {
              const next = (prev - 1 + items.length) % items.length
              const maxCol = Math.max(0, getItemText(items[next]).length - 1)
              setCursorCol((col) => Math.min(col, maxCol))
              return next
            })
          }
          break
        case "h":
          if (focusPanel === "list" && viewState !== "expanded") {
            e.preventDefault()
            setCursorCol((prev) => Math.max(0, prev - 1))
          }
          break
        case "l":
          if (focusPanel === "list" && viewState !== "expanded") {
            e.preventDefault()
            const maxCol = Math.max(0, getItemText(items[focusedIndex]).length - 1)
            setCursorCol((prev) => Math.min(maxCol, prev + 1))
          }
          break
        case "Tab":
          if (viewState === "split") {
            e.preventDefault()
            setFocusPanel((prev) => prev === "list" ? "detail" : "list")
          }
          break
        case "Enter":
          if (focusPanel === "list" && viewState !== "expanded" && items.length > 0) {
            e.preventDefault()
            openSplit(items[focusedIndex])
          }
          break
        case "o":
          if (viewState === "split" && focusPanel === "detail") {
            e.preventDefault()
            expand()
          }
          break
        case "q":
          if (viewState === "expanded") {
            e.preventDefault()
            setViewState("split")
          } else if (viewState === "split" && focusPanel === "detail") {
            e.preventDefault()
            setViewState("closed")
            setSelectedItem(null)
            setFocusPanel("list")
          }
          break
      }
    },
    [focusPanel, viewState, items, focusedIndex]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Keep focusedIndex in bounds if items change
  useEffect(() => {
    if (items.length > 0 && focusedIndex >= items.length) {
      setFocusedIndex(items.length - 1)
    }
  }, [items.length, focusedIndex])

  // Reset focus to list panel when detail closes
  useEffect(() => {
    if (viewState === "closed") {
      setFocusPanel("list")
    }
  }, [viewState])

  return (
    <div className="flex flex-col lg:flex-row gap-1.5 h-full">
      {/* List panel — hidden when expanded */}
      <AnimatePresence>
        {viewState !== "expanded" && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              flex: viewState === "closed" ? 1 : undefined,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: snap }}
            className={`
              border-2 rounded-lg overflow-hidden
              ${viewState === "split" ? "lg:w-2/5 w-full" : "w-full"}
              ${viewState === "closed" || focusPanel === "list" ? "border-tn-accent" : "border-tn-comment/20"}
            `}
          >
            {/* Panel title bar */}
            <div className="flex items-center h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px] text-tn-comment">
              {listTitle}
            </div>

            {/* Items — nvim buffer style with line numbers and tildes */}
            <div className="flex-1 font-mono text-[13px] leading-relaxed overflow-auto">
              {items.map((item, index) => {
                const key = getKey(item)
                const isFocused = index === focusedIndex
                const lineNumWidth = String(items.length).length
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFocusedIndex(index)
                      openSplit(item)
                    }}
                    className="flex w-full text-left"
                  >
                    <span
                      className="text-right mr-3 pl-3 py-[2px] select-none shrink-0 text-tn-comment"
                      style={{ width: `${lineNumWidth + 2}ch` }}
                    >
                      {index + 1}
                    </span>
                    {/* Buffer content with cursor overlay */}
                    <span className="py-[2px] pr-3 relative">
                      {renderItem(item)}
                      {/* Cursor block — shows character underneath inverted */}
                      {isFocused && (
                        <span
                          className="absolute top-0 bottom-0 w-[1ch] bg-tn-fg text-tn-bg flex items-center justify-center text-[13px]"
                          style={{ left: `${cursorCol}ch` }}
                        >
                          {getItemText(item)[cursorCol] ?? " "}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
              {/* Tilde lines to fill remaining space */}
              {Array.from({ length: Math.max(0, 12 - items.length) }, (_, i) => {
                const lineNumWidth = String(items.length).length
                return (
                  <div key={`tilde-${i}`} className="flex">
                    <span
                      className="text-tn-accent text-right mr-3 pl-3 select-none shrink-0"
                      style={{ width: `${lineNumWidth + 2}ch` }}
                    >
                      ~
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel — visible in split and expanded states */}
      <AnimatePresence>
        {selectedItem && viewState !== "closed" && (
          <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: snap }}
            className={`
              border-2 rounded-lg overflow-hidden
              ${viewState === "expanded" ? "w-full" : "lg:w-3/5 w-full"}
              ${focusPanel === "detail" || viewState === "expanded" ? "border-tn-accent" : "border-tn-comment/20"}
            `}
          >
            {/* Panel title bar with controls */}
            <div className="flex items-center justify-between h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px]">
              <span className="text-tn-accent font-bold">
                {getDetailTitle(selectedItem)}
              </span>
              <div className="flex items-center gap-1">
                {viewState === "split" && (
                  <button
                    onClick={expand}
                    className="text-tn-comment hover:text-tn-fg transition-colors"
                    title="Expand (o)"
                  >
                    [expand]
                  </button>
                )}
                <button
                  onClick={close}
                  className="text-tn-comment hover:text-tn-fg transition-colors"
                  title="Close (q)"
                >
                  [x]
                </button>
              </div>
            </div>

            {/* Detail content */}
            <div className="p-3">
              {renderDetail(selectedItem)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
