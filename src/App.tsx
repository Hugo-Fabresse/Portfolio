/**
 * App — Root component.
 *
 * Manages active buffer state. Only renders one section at a time
 * (buffer-based navigation, no scroll). Registers vim keybinds.
 */

import { useState, useCallback } from "react"

import Navbar from "@/components/Navbar"
import SEO from "@/components/SEO"
import CommandBar from "@/components/CommandBar"
import HelpPanel from "@/components/HelpPanel"
import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"
import { useVimNavigation } from "@/hooks/useVimNavigation"
import { useBufferRouting } from "@/hooks/useBufferRouting"

type CommandBarMode = "command" | "search" | null

export default function App() {
  const sections = getEnabledSections()
  const [activeBuffer, setActiveBuffer] = useBufferRouting()
  const [commandBarMode, setCommandBarMode] = useState<CommandBarMode>(null)
  const [helpOpen, setHelpOpen] = useState(false)

  const switchBuffer = useCallback(
    (index: number) => {
      const target = sections[index]
      if (target) setActiveBuffer(target.key)
    },
    [sections, setActiveBuffer],
  )

  useVimNavigation({
    onSearch: () => setCommandBarMode("search"),
    onCommand: () => setCommandBarMode("command"),
    onEscape: () => {
      if (helpOpen) setHelpOpen(false)
      else setCommandBarMode(null)
    },
    onHelp: () => setHelpOpen((prev) => !prev),
    onBufferSwitch: switchBuffer,
  })

  const ActiveComponent = sectionRegistry[activeBuffer]

  return (
    <>
      <SEO />
      <Navbar
        activeBuffer={activeBuffer}
        onBufferSelect={setActiveBuffer}
      />
      <main className="fixed top-8 bottom-0 left-0 right-0 font-mono">
        <div className="h-full w-full overflow-auto">
          {ActiveComponent && (
            <ActiveComponent
              {...(activeBuffer === "about" ? { onBufferSwitch: setActiveBuffer } : {})}
            />
          )}
        </div>
      </main>
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
      <CommandBar
        mode={commandBarMode}
        onClose={() => setCommandBarMode(null)}
      />
    </>
  )
}
