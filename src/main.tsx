/**
 * Entry point — Mounts the React app with theme provider.
 */

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"

import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" themes={["dark", "light"]}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
