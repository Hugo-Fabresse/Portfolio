/**
 * SplitView — Hyprland-inspired tiling window manager component.
 *
 * Generic component that manages 3 states:
 * 1. CLOSED: displays items in a list/grid
 * 2. SPLIT: screen divides — list on left, detail on right
 * 3. EXPANDED: detail takes full width, list hidden
 *
 * Uses BufferView for the list panel — consistent cursor behavior everywhere.
 * List buffer can contain header lines before items.
 *
 * @see docs/TECHNICAL_DECISIONS.md TD-010
 * @see docs/ARCHITECTURE.md — "Flux Split View"
 */

import { useState, useEffect, useCallback } from "react"

import BufferView from "@/components/BufferView"

import type { BufferLine } from "@/components/BufferView"

/** The three view states */
type ViewState = "closed" | "split" | "expanded"

interface SplitViewProps<T> {
  /** Array of items to display */
  items: T[]
  /** All lines for the list buffer (headers + items) */
  listLines: BufferLine[]
  /** Line indices in listLines that correspond to items (clickable/Enter-able) */
  itemLineIndices: number[]
  /** Render the detail panel for the selected item */
  renderDetail: (item: T, active: boolean) => React.ReactNode
  /** Title shown in the list panel header */
  listTitle: string
  /** Title shown in the detail panel header */
  getDetailTitle: (item: T) => string
}

export default function SplitView<T>({
  items,
  listLines,
  itemLineIndices,
  renderDetail,
  listTitle,
  getDetailTitle,
}: SplitViewProps<T>) {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [viewState, setViewState] = useState<ViewState>("closed")
  const [focusPanel, setFocusPanel] = useState<"list" | "detail">("list")

  const selectedItem = selectedItemIndex !== null ? items[selectedItemIndex] : null

  /** Map a buffer line index to an item index, or null if not an item line */
  const lineToItemIndex = useCallback(
    (lineIndex: number): number | null => {
      const pos = itemLineIndices.indexOf(lineIndex)
      return pos !== -1 ? pos : null
    },
    [itemLineIndices],
  )

  /** Open split view with item at given item index */
  const openItem = useCallback((itemIndex: number) => {
    setSelectedItemIndex(itemIndex)
    setViewState("split")
    setFocusPanel("detail")
  }, [])

  /** Handle Enter/click on a buffer line */
  const handleLineAction = useCallback(
    (lineIndex: number) => {
      const itemIndex = lineToItemIndex(lineIndex)
      if (itemIndex !== null) {
        openItem(itemIndex)
      }
    },
    [lineToItemIndex, openItem],
  )

  /** Keyboard handler — Tab/o/q only, cursor is handled by BufferView */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select") return

      switch (e.key) {
        case "Tab":
          if (viewState === "split") {
            e.preventDefault()
            setFocusPanel((prev) => prev === "list" ? "detail" : "list")
          }
          break
        case "o":
          if (viewState === "split" && focusPanel === "detail") {
            e.preventDefault()
            setViewState("expanded")
          }
          break
        case "q":
          if (viewState === "expanded") {
            e.preventDefault()
            setViewState("split")
          } else if (viewState === "split" && focusPanel === "detail") {
            e.preventDefault()
            setViewState("closed")
            setSelectedItemIndex(null)
            setFocusPanel("list")
          }
          break
      }
    },
    [focusPanel, viewState],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (viewState === "closed") {
      setFocusPanel("list")
    }
  }, [viewState])

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* List panel — hidden when expanded */}
      {viewState !== "expanded" && (
        <div
          className={`
            border-2 rounded-lg overflow-hidden flex flex-col
            ${viewState === "split" ? "lg:w-2/5 w-full" : "w-full flex-1"}
            ${viewState === "closed" || focusPanel === "list" ? "border-tn-accent" : "border-tn-comment/20"}
          `}
        >
          <div className="flex items-center h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px] text-tn-comment">
            {listTitle}
          </div>

          <div className="flex-1 overflow-auto">
            <BufferView
              lines={listLines}
              active={focusPanel === "list"}
              onEnter={handleLineAction}
              onLineClick={handleLineAction}
              clickableLines={itemLineIndices}
            />
          </div>
        </div>
      )}

      {/* Detail panel — visible in split and expanded states */}
      {selectedItem && viewState !== "closed" && (
        <div
          className={`
            border-2 rounded-lg overflow-hidden flex flex-col
            ${viewState === "expanded" ? "w-full" : "lg:w-3/5 w-full"}
            ${focusPanel === "detail" || viewState === "expanded" ? "border-tn-accent" : "border-tn-comment/20"}
          `}
        >
          <div className="flex items-center justify-between h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px]">
            <span className="text-tn-accent font-bold">
              {getDetailTitle(selectedItem)}
            </span>
            <div className="flex items-center gap-1">
              {viewState === "split" && (
                <button
                  onClick={() => setViewState("expanded")}
                  className="text-tn-comment hover:text-tn-fg transition-colors"
                  title="Expand (o)"
                >
                  [expand]
                </button>
              )}
              <button
                onClick={() => {
                  if (viewState === "expanded") {
                    setViewState("split")
                  } else {
                    setViewState("closed")
                    setSelectedItemIndex(null)
                    setFocusPanel("list")
                  }
                }}
                className="text-tn-comment hover:text-tn-fg transition-colors"
                title="Close (q)"
              >
                [x]
              </button>
            </div>
          </div>

          <div className="p-3 flex-1 overflow-auto">
            {renderDetail(selectedItem, focusPanel === "detail")}
          </div>
        </div>
      )}
    </div>
  )
}
