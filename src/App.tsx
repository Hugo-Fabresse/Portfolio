/**
 * App — Root component.
 *
 * Renders the Navbar and all enabled sections from config.
 * Registers global vim keybinds via useVimNavigation.
 */

import Navbar from "@/components/Navbar"
import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"
import { useVimNavigation } from "@/hooks/useVimNavigation"

export default function App() {
  const sections = getEnabledSections()

  useVimNavigation({
    onSearch: () => {
      /* CommandBar will be wired in Task 11 */
    },
    onCommand: () => {
      /* CommandBar will be wired in Task 11 */
    },
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
    </>
  )
}
