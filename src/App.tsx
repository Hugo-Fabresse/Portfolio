/**
 * App — Root component.
 *
 * Renders Navbar, enabled sections, and CommandBar.
 * Registers global vim keybinds via useVimNavigation.
 */

import { useState } from "react"

import Navbar from "@/components/Navbar"
import CommandBar from "@/components/CommandBar"
import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"
import { useVimNavigation } from "@/hooks/useVimNavigation"

type CommandBarMode = "command" | "search" | null

export default function App() {
  const sections = getEnabledSections()
  const [commandBarMode, setCommandBarMode] = useState<CommandBarMode>(null)

  useVimNavigation({
    onSearch: () => setCommandBarMode("search"),
    onCommand: () => setCommandBarMode("command"),
    onEscape: () => setCommandBarMode(null),
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen font-mono pt-8">
        {sections.map(({ key }) => {
          const Component = sectionRegistry[key]
          if (!Component) return null
          return <Component key={key} />
        })}
      </main>
      <CommandBar
        mode={commandBarMode}
        onClose={() => setCommandBarMode(null)}
      />
    </>
  )
}
