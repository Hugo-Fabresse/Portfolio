/**
 * HelpPanel — Overlay showing all keybinds and commands.
 *
 * Toggled by pressing "?". Shows navigation keys, commands,
 * and buffer switching shortcuts.
 */

import { AnimatePresence, motion } from "framer-motion"

/** Bezier snap curve from Hyprland config */
const snap = [0.2, 0.8, 0.25, 1.0] as const

interface HelpPanelProps {
  open: boolean
  onClose: () => void
}

const keybinds = [
  { key: "1-4", desc: "Switch to buffer N" },
  { key: "j / k", desc: "Navigate items down / up" },
  { key: "h / l", desc: "Switch focus list / detail" },
  { key: "Enter", desc: "Open detail (split view)" },
  { key: "o", desc: "Expand detail full screen" },
  { key: "q", desc: "Close detail / go back" },
  { key: ":", desc: "Command palette" },
  { key: "/", desc: "Search" },
  { key: "?", desc: "Toggle this help" },
  { key: "Esc", desc: "Close overlay" },
]

const commands = [
  { cmd: ":help", desc: "Show help" },
  { cmd: ":theme", desc: "Toggle dark/light" },
  { cmd: ":q", desc: "Easter egg" },
]

export default function HelpPanel({ open, onClose }: HelpPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: snap }}
          className="fixed inset-0 z-40 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-tn-bg/80 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: snap }}
            className="relative border-2 border-tn-accent rounded-lg bg-tn-bg-dark max-w-lg w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between h-6 px-3 border-b border-tn-comment/20 text-[11px]">
              <span className="text-tn-accent font-bold">help.md</span>
              <button
                onClick={onClose}
                className="text-tn-comment hover:text-tn-fg transition-colors"
              >
                [x]
              </button>
            </div>

            <div className="p-4 font-mono text-[13px]">
              {/* Keybinds section */}
              <p className="text-tn-secondary font-bold mb-1.5"># Keybinds</p>
              <div className="flex flex-col gap-1 mb-4">
                {keybinds.map(({ key, desc }) => (
                  <div key={key} className="flex">
                    <span className="text-tn-accent w-24 shrink-0">{key}</span>
                    <span className="text-tn-comment">— {desc}</span>
                  </div>
                ))}
              </div>

              {/* Commands section */}
              <p className="text-tn-secondary font-bold mb-1.5"># Commands</p>
              <div className="flex flex-col gap-1">
                {commands.map(({ cmd, desc }) => (
                  <div key={cmd} className="flex">
                    <span className="text-tn-green w-24 shrink-0">{cmd}</span>
                    <span className="text-tn-comment">— {desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
