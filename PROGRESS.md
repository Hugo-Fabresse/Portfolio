# Progress

Journal de progression du projet. Chaque changement significatif est documente ici.

## Format

```
### [YYYY-MM-DD] - Description courte
- **Type**: feature | fix | refactor | docs | config
- **Fichiers**: fichiers concernes
- **Details**: ce qui a ete fait et pourquoi
```

---

## Historique

## 2026-05-25 — YAML content system (projects)

- Migration des donnees projets de `src/data/projects.ts` (hardcode) vers `content/projects.yml`
- Loader YAML avec import `?raw` de Vite + package `yaml`
- Headers de section et de projet dynamiques (Record<string, string>)
- Ajout/suppression de champs dans le YAML sans toucher au code

### [2026-04-26] - Nettoyage du repo et phase de design
- **Type**: refactor
- **Fichiers**: tous (suppression), `docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md`
- **Details**: Suppression de l'ancien portfolio (React/Vite/Tailwind avec theme terminal, backend Express/PostgreSQL). Redaction du design spec pour le nouveau portfolio : interface Neovim-inspired, stack React + Vite + Tailwind v4 + shadcn/ui, deploiement GitHub Pages. Phase de brainstorming terminee.

### [2026-04-26] - Mise en place de l'architecture de documentation
- **Type**: docs
- **Fichiers**: `PROGRESS.md`, `README.md`, `CLAUDE.md`, `docs/TECHNICAL_DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/CONVENTIONS.md`
- **Details**: Creation de tous les fichiers de documentation pour structurer le travail. Hub central dans CLAUDE.md, choix techniques justifies, conventions de code, architecture de reference.

### [2026-04-26] - Implementation V1 complete
- **Type**: feature
- **Fichiers**: tout `src/`, `.github/workflows/deploy.yml`, `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`
- **Details**: Implementation des 13 tasks du plan :
  1. Scaffolding Vite + React + TypeScript
  2. Theme Tailwind Tokyo Night (dark/light) avec tokens de forme Hyprland
  3. Config centrale + registry pattern (SOLID Open/Closed)
  4. Section wrapper pour layout et scroll targeting
  5. Fichiers data types (about, projects, experience, skills)
  6. Navbar Waybar-inspired avec active section tracking (IntersectionObserver)
  7. Dark/Light mode toggle via next-themes
  8. SplitView tiling WM (3 etats : closed/split/expanded, Framer Motion)
  9. Sections wirees aux data + SplitView (About simple, Projects/Experience/Skills avec split)
  10. Vim navigation hook (j/k, gg/G, 1-9, /, :, Esc)
  11. Command Bar vim (:q, :help, :theme, /search)
  12. SEO meta tags (react-helmet-async, Open Graph, Twitter Card)
  13. GitHub Actions deploy sur GitHub Pages

### [2026-04-27] - Dashboard About (snacks.nvim style)
- **Type**: feature
- **Fichiers**: `src/sections/About.tsx`, `src/data/about.ts`, `src/config.ts`, `src/App.tsx`
- **Details**: Remplacement de la section About par un dashboard style snacks.nvim : header ASCII "BONJOUR", bio centree, tags focus, actions avec raccourcis clavier (p→Projects, s→Skills, g→GitHub). Cadre fenetre identique aux autres sections (border + title bar). Label navbar passe de "about.md" a "about". Icone GitHub SVG reelle, icones noir/blanc selon le theme.
