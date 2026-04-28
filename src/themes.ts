/**
 * Theme list — all available colorschemes.
 *
 * Each theme id maps to a CSS class in index.css.
 * "dark" is the default (Tokyo Night Dark, no class needed).
 */

export interface ThemeInfo {
  /** Theme id — matches next-themes value and CSS class */
  id: string
  /** Display name shown in navbar and command bar */
  label: string
}

export const themes: ThemeInfo[] = [
  { id: "dark", label: "Tokyo Night" },
  { id: "light", label: "Tokyo Night Light" },
  { id: "catppuccin-mocha", label: "Catppuccin Mocha" },
  { id: "catppuccin-latte", label: "Catppuccin Latte" },
  { id: "gruvbox-dark", label: "Gruvbox Dark" },
  { id: "gruvbox-light", label: "Gruvbox Light" },
  { id: "nord", label: "Nord" },
  { id: "dracula", label: "Dracula" },
  { id: "solarized-dark", label: "Solarized Dark" },
  { id: "solarized-light", label: "Solarized Light" },
  { id: "one-dark", label: "One Dark" },
]

/** Get the next theme in the cycle */
export function getNextTheme(current: string): ThemeInfo {
  const index = themes.findIndex((t) => t.id === current)
  return themes[(index + 1) % themes.length]
}

/** Get theme info by id */
export function getThemeLabel(id: string): string {
  return themes.find((t) => t.id === id)?.label ?? id
}
