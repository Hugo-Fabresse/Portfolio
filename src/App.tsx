/**
 * App — Root component.
 *
 * Renders the Navbar and all enabled sections from config.
 */

import Navbar from "@/components/Navbar"
import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"

export default function App() {
  const sections = getEnabledSections()

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
