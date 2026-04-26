/**
 * Tokyo Night theme tokens.
 *
 * Contains color palettes (dark + light) and form tokens
 * (spacing, rounding, animation curves) derived from Hugo's dotfiles.
 *
 * Colors: Tokyo Night palette.
 * Form: Hyprland gaps (4/6/12/16), rounding (4/6/8), beziers (snap/drift).
 *
 * @see docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md
 */

/** Dark palette — Tokyo Night (default) */
export const dark = {
  bg: "#1a1b26",
  "bg-dark": "#16161e",
  fg: "#a9b1d6",
  accent: "#7aa2f7",
  secondary: "#bb9af7",
  green: "#9ece6a",
  red: "#f7768e",
  orange: "#ff9e64",
  comment: "#565f89",
} as const

/** Light palette — Tokyo Night Day */
export const light = {
  bg: "#d5d6db",
  "bg-dark": "#c8c9ce",
  fg: "#343b58",
  accent: "#2e7de9",
  secondary: "#7847bd",
  green: "#587539",
  red: "#f52a65",
  orange: "#b15c00",
  comment: "#6172b0",
} as const

/**
 * Animation bezier curves from Hyprland config.
 * snap: fast, snappy response for UI interactions.
 * drift: smooth, flowing motion for transitions.
 */
export const beziers = {
  snap: [0.2, 0.8, 0.25, 1.0] as const,
  drift: [0.3, 0.0, 0.2, 1.0] as const,
}

/**
 * Duration ranges for animations.
 * snap: quick interactions (200-400ms).
 * drift: smooth transitions (600-1000ms).
 */
export const durations = {
  snap: { min: 0.2, default: 0.3, max: 0.4 },
  drift: { min: 0.6, default: 0.8, max: 1.0 },
}
