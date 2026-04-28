/**
 * Entry point — Mounts the React app with theme and SEO providers.
 */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { HelmetProvider } from "react-helmet-async"

import App from "./App"
import { themes } from "./themes"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" themes={themes.map((t) => t.id)}>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
