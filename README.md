# Portfolio — Hugo Fabresse

Portfolio personnel inspire de Neovim et Hyprland. Interface minimaliste, navigation clavier vim-style, tiling split view, theme Tokyo Night. Formes et spacing inspires de mes dotfiles (Hyprland gaps, Waybar, Kitty, Neovim).

## Stack

| Outil | Role |
|---|---|
| React 18 + TypeScript | Framework UI |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Composants UI |
| Framer Motion | Animations (beziers snap/drift) |
| next-themes | Dark/Light mode |
| GitHub Pages | Hebergement |

## Demarrage

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build    # Genere dist/
```

Le deploiement est automatique via GitHub Actions sur push `main`.

## Navigation clavier

| Raccourci | Action |
|---|---|
| `j` / `k` | Scroll bas / haut |
| `gg` / `G` | Top / Bottom |
| `1-4` | Saut a la section N |
| `/` | Recherche |
| `:` | Command palette |
| `Esc` | Fermer |

## Structure

```
src/
├── components/   # UI reutilisable (Navbar, Section, CommandBar)
├── sections/     # Composants de section (About, Projects, Experience, Skills)
├── data/         # Contenu type par section
├── hooks/        # Custom hooks (vim navigation)
├── theme/        # Palette Tokyo Night
├── config.ts     # Toggles sections + metadata
└── registry.ts   # Mapping config -> composants
```

## Ajouter une section

1. Creer `src/sections/NewSection.tsx`
2. Creer `src/data/newsection.ts`
3. Ajouter dans `src/registry.ts`
4. Ajouter dans `src/config.ts` avec `enabled: true`

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — structure et responsabilites
- [Decisions techniques](docs/TECHNICAL_DECISIONS.md) — choix justifies
- [Conventions](docs/CONVENTIONS.md) — regles de code
- [Progression](PROGRESS.md) — journal des changements
- [Design Spec](docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md) — spec initiale

## Licence

MIT
