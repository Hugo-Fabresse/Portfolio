/**
 * App — Root component.
 *
 * Reads enabled sections from config, looks up components
 * in the registry, and renders them in order.
 * Wraps everything in theme and SEO providers.
 */

import { getEnabledSections } from "@/config"
import { sectionRegistry } from "@/registry"

export default function App() {
  const sections = getEnabledSections()

  return (
    <main className="min-h-screen font-mono">
      {sections.map(({ key }) => {
        const Component = sectionRegistry[key]
        if (!Component) return null
        return (
          <section key={key} id={key} className="p-3">
            <Component />
          </section>
        )
      })}
    </main>
  )
}
