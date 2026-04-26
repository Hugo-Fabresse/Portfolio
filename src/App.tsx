/**
 * App - Root component.
 *
 * Iterates over enabled sections in config and renders them
 * via the section registry. Wraps everything in theme and SEO providers.
 */

export default function App() {
  return (
    <main className="min-h-screen font-mono">
      <p className="p-3 text-tn-accent font-bold">Portfolio</p>
      <p className="p-3 text-tn-comment">Tokyo Night theme active</p>
    </main>
  )
}
