# Architecture

Reference vivante de la structure du projet. Mise a jour a chaque changement structurel.

## Arborescence

```
Portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions : build + deploy gh-pages
├── content/
│   └── projects.yml          # Contenu des projets (YAML, editable sans toucher au code)
├── docs/
│   ├── ARCHITECTURE.md         # Ce fichier
│   ├── CONVENTIONS.md          # Conventions de code
│   ├── TECHNICAL_DECISIONS.md  # Choix techniques justifies
│   └── superpowers/
│       └── specs/              # Specs de design (brainstorming)
├── public/                     # Assets statiques (favicon, images, fonts)
├── src/
│   ├── components/             # Composants UI reutilisables
│   │   ├── ui/                 # Composants shadcn/ui (generes)
│   │   ├── Navbar.tsx          # Barre de navigation haut, style tabline Neovim
│   │   ├── Section.tsx         # Wrapper generique pour chaque section
│   │   ├── SplitView.tsx       # Pattern tiling WM : liste + detail split, expand plein ecran
│   │   ├── CommandBar.tsx      # Overlay ":" command palette vim-style
│   │   └── SEO.tsx             # Meta tags Open Graph, Twitter Card, description
│   ├── sections/               # Composants de sections (1 par section du portfolio)
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   └── Skills.tsx
│   ├── data/                   # Donnees typees (1 fichier par section)
│   │   ├── about.ts
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   └── skills.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useVimNavigation.ts # Keybinds vim globaux
│   │   └── useActiveSection.ts # IntersectionObserver pour la navbar
│   ├── theme/                  # Configuration theme
│   │   └── tokyonight.ts       # Palette dark + light + tokens de forme (gaps, rounding, beziers)
│   ├── config.ts               # Config centrale : toggles sections, metadata site
│   ├── registry.ts             # Mapping cle config -> composant section
│   ├── App.tsx                 # Root : itere config, rend sections via registry
│   └── main.tsx                # Entry point React
├── CLAUDE.md                   # Hub central pour Claude (refere tous les docs)
├── PROGRESS.md                 # Journal de progression
├── README.md                   # Presentation du projet
├── index.html                  # HTML entry point Vite
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

## Flux de donnees

```
config.ts (sections activees)
    │
    ▼
App.tsx ──► registry.ts (lookup composant)
    │              │
    ▼              ▼
Section.tsx ◄── sections/About.tsx ◄── data/about.ts
                content/projects.yml ──► data/projects.ts (YAML loader) ──► sections/Projects.tsx
                sections/Experience.tsx ◄── data/experience.ts
                sections/Skills.tsx ◄── data/skills.ts
```

## Flux Split View (tiling WM)

```
Etat 1: FERME
┌──────────────────────────────┐
│  [Projet A] [Projet B]      │
│  [Projet C] [Projet D]      │
└──────────────────────────────┘
         │ clic / Enter
         ▼
Etat 2: SPLIT (desktop)
┌──────────────┬───────────────┐
│ [Projet A]   │ Detail        │
│ [Projet B] ◄ │ Projet B      │
│ [Projet C]   │ description,  │
│ [Projet D]   │ tags, liens   │
└──────────────┴───────────────┘
         │ bouton expand / "o"
         ▼
Etat 3: EXPAND (plein ecran)
┌──────────────────────────────┐
│ Detail Projet B              │
│ description complete,        │
│ tags, liens, screenshots     │
│                    [retour]  │
└──────────────────────────────┘
         │ Esc / "q"
         ▼
Retour a Etat 2 puis Etat 1
```

Pattern generique via `SplitView.tsx`, utilise par Projects, Experience, Skills.

## Flux navigation

```
useVimNavigation.ts
    │
    ├── j/k ──► scroll bas/haut (page) OU navigation dans liste (si split ouvert)
    ├── h/l ──► switch focus liste <-> detail (si split ouvert)
    ├── gg/G ──► top/bottom de la page
    ├── 1-4 ──► section.scrollIntoView (sections activees uniquement)
    ├── Enter ──► ouvrir detail en split
    ├── o ──► expand detail plein ecran
    ├── q/Esc ──► fermer detail / fermer overlays
    ├── p ──► switch to Projects buffer (dashboard about uniquement)
    ├── s ──► switch to Skills buffer (dashboard about uniquement)
    ├── g ──► open GitHub (dashboard about uniquement)
    ├── / ──► CommandBar focus (recherche)
    └── : ──► CommandBar mode commande
```

## Responsabilites des couches

| Couche | Responsabilite | Ne doit PAS |
|---|---|---|
| `config.ts` | Source de verite : quelles sections sont actives, metadata site | Contenir du contenu ou de la logique UI |
| `data/` | Loaders et contenu : parse les fichiers YAML (content/) et expose les donnees typees | Contenir de logique de rendu |
| `sections/` | Rendu visuel d'une section a partir de ses data | Acceder a la config d'autres sections |
| `components/` | UI reutilisable (Navbar, Section wrapper, SplitView, CommandBar) | Contenir du contenu specifique |
| `SplitView.tsx` | Pattern tiling WM generique : gere les 3 etats (ferme, split, expand), layout responsive, animations | Connaitre le type de contenu (recoit des render props) |
| `hooks/` | Logique reutilisable (keybinds, scroll spy) | Manipuler le DOM directement sauf scroll |
| `theme/` | Tokens de couleur et config visuelle | Contenir de la logique |
| `registry.ts` | Mapping cle -> composant | Contenir de la logique de rendu |

## Comment ajouter une section

1. Creer `src/sections/NewSection.tsx` (composant)
2. Creer `src/data/newsection.ts` (donnees typees)
3. Ajouter dans `src/registry.ts` : `newsection: NewSection`
4. Ajouter dans `src/config.ts` : `newsection: { enabled: true, label: "new.rs" }`
5. Documenter dans `PROGRESS.md`

Zero modification de `App.tsx` ou d'autres sections.
