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

import { useState } from "react"
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
  renderItem: (item: T, isSelected: boolean) => React.ReactNode
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
  renderDetail,
  listTitle,
  getDetailTitle,
}: SplitViewProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [viewState, setViewState] = useState<ViewState>("closed")

  /** Open split view with a specific item */
  const openSplit = (item: T) => {
    setSelectedItem(item)
    setViewState("split")
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

  return (
    <div className="flex flex-col lg:flex-row gap-1.5 min-h-[400px]">
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
              ${selectedItem ? "border-tn-comment" : "border-tn-comment/20"}
            `}
          >
            {/* Panel title bar */}
            <div className="flex items-center h-6 px-3 bg-tn-bg-dark border-b border-tn-comment/20 text-[11px] text-tn-comment">
              {listTitle}
            </div>

            {/* Items */}
            <div className={`p-1.5 ${viewState === "closed" ? "grid grid-cols-1 md:grid-cols-2 gap-1.5" : "flex flex-col gap-1.5"}`}>
              {items.map((item) => {
                const key = getKey(item)
                const isSelected = selectedItem !== null && getKey(selectedItem) === key
                return (
                  <button
                    key={key}
                    onClick={() => openSplit(item)}
                    className={`text-left rounded-md p-3 transition-colors ${
                      isSelected
                        ? "bg-tn-fg text-tn-bg font-bold"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {renderItem(item, isSelected)}
                  </button>
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
              border-2 border-tn-accent rounded-lg overflow-hidden
              ${viewState === "expanded" ? "w-full" : "lg:w-3/5 w-full"}
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
