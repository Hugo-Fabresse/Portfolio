# Portfolio Redesign - Design Spec

## Objectif

Plateforme personnelle qui vend Hugo : projets, experience, certifications, skills. Interface inspiree de Neovim et Hyprland (tiling WM) visuellement et philosophiquement (raccourcis clavier, navigation sans souris, split views). Minimaliste, nihiliste.

## Stack Technique

### V1 (maintenant)

| Outil | Role |
|---|---|
| React 18 + TypeScript | Framework UI |
| Vite | Build tool, dev server |
| Tailwind CSS v4 | Styling utility-first |
| shadcn/ui | Composants UI (copies dans le projet, pas une dep) |
| Lucide React | Icons (inclus avec shadcn) |
| Framer Motion | Animations subtiles (fade-in, transitions) |
| next-themes | Dark/Light mode toggle + persistance localStorage |
| react-helmet-async | SEO, Open Graph, Twitter cards, meta tags |
| JetBrains Mono | Font monospace (Google Fonts) |
| GitHub Actions | CI/CD : build + deploy sur GitHub Pages |

### V2+ (prevu, pas implemente)

| Feature | Outil envisage | Notes |
|---|---|---|
| i18n | Paraglide ou i18next | Data structurees avec cles pour faciliter le branchement |
| Analytics | Umami | Self-hostable, privacy-friendly |
| Blog | MDX + fichiers .mdx | Section desactivee dans config |
| PDF / CV | react-pdf ou generation build-time | Reutilise les data TS |
| Terminal interactif | xterm.js ou custom | Easter egg, commandes custom |

### Ce qu'on n'utilise PAS

- Pas de router (single page)
- Pas de state management (pas d'etat complexe)
- Pas de formulaire / validation
- Pas de fetching / API client
- Pas de CSS-in-JS
- Pas de backend / DB

## Architecture

```
src/
├── components/
│   ├── Navbar.tsx          # Barre de nav en haut, style tabline Neovim
│   ├── Section.tsx         # Wrapper generique pour chaque section
│   ├── SplitView.tsx       # Pattern tiling WM : liste + detail split, expand
│   └── CommandBar.tsx      # Overlay ":" style vim command palette
├── sections/
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Experience.tsx
│   └── Skills.tsx
├── data/
│   ├── about.ts
│   ├── projects.ts
│   ├── experience.ts
│   └── skills.ts
├── config.ts               # Toggles sections + metadonnees site
├── hooks/
│   └── useVimNavigation.ts # Logique keybinds centralisee
├── theme/
│   └── tokyonight.ts       # Palette Tokyo Night dark + light
├── App.tsx
└── main.tsx
```

## Sections

4 sections, toutes implementees mais activables/desactivables via `config.ts` :

| Section | Label navbar (style fichier) | Contenu |
|---|---|---|
| About | `about.md` | Presentation, philosophie, setup |
| Projects | `projects/` | Projets perso (JUST, GOAT, etc.) |
| Experience | `experience.log` | Roles : Scrum Master, Coding Club, AER... |
| Skills | `skills.toml` | Competences techniques et certifications |

### Config centrale

```ts
export const siteConfig = {
  title: "SYS_ARCH",
  sections: {
    about:      { enabled: true,  label: "about.md" },
    projects:   { enabled: true,  label: "projects/" },
    experience: { enabled: false, label: "experience.log" },
    skills:     { enabled: true,  label: "skills.toml" },
  },
}
```

- La navbar ne montre que les sections `enabled: true`
- Les sections desactivees ne sont pas rendues mais le code et les data restent
- Ajouter une section = creer composant + fichier data + ligne dans config

## Navigation Vim

Hook `useVimNavigation` qui ecoute les keydown globalement :

| Raccourci | Action |
|---|---|
| `j` / `k` | Scroll bas / haut |
| `gg` | Top de la page |
| `G` | Bottom de la page |
| `1`, `2`, `3`, `4` | Saut direct a la section N (sections activees uniquement) |
| `/` | Focus command bar (recherche) |
| `:` | Command palette |
| `Esc` | Fermer overlays |

### Command palette

- `:q` : Easter egg (message humoristique)
- `:help` : Affiche les raccourcis disponibles
- `:theme` : Toggle dark/light
- Extensible pour v2 (`:lang fr`, `:blog`, etc.)

Les keybinds sont desactives quand un input a le focus (command bar ouverte).

## Navbar

- Position fixe en haut
- Style tabline Neovim : chaque section = un "buffer tab"
- Highlight la section courante au scroll (intersection observer)
- N'affiche que les sections activees dans config
- Contient aussi : toggle dark/light, indicateur de mode (NORMAL)
- Collapse sur mobile (hamburger ou drawer)

## Theme Tokyo Night

### Palette Dark (defaut)

| Token | Couleur | Usage |
|---|---|---|
| bg | `#1a1b26` | Background principal |
| bg-dark | `#16161e` | Background navbar/elevated |
| fg | `#a9b1d6` | Texte principal |
| accent | `#7aa2f7` | Liens, elements actifs |
| secondary | `#bb9af7` | Accents secondaires |
| green | `#9ece6a` | Succes, tags |
| red | `#f7768e` | Erreurs, accents |
| orange | `#ff9e64` | Warnings, highlights |
| comment | `#565f89` | Texte mute, secondaire |

### Palette Light (variante Tokyo Night Day)

| Token | Couleur | Usage |
|---|---|---|
| bg | `#d5d6db` | Background principal |
| bg-dark | `#c8c9ce` | Background navbar/elevated |
| fg | `#343b58` | Texte principal |
| accent | `#2e7de9` | Liens, elements actifs |
| secondary | `#7847bd` | Accents secondaires |
| green | `#587539` | Succes, tags |
| red | `#f52a65` | Erreurs, accents |
| comment | `#6172b0` | Texte mute |

### Principes de forme (inspires des dotfiles Hyprland/Waybar/Kitty/Neovim)

Ces principes definissent la FORME visuelle, independamment de la palette de couleurs.
Inspires directement de la config Hyprland, Waybar, Kitty, Neovim et Dunst de Hugo.

#### Spacing (systeme 4/6/12/16)

| Token | Valeur | Usage | Origine dotfiles |
|---|---|---|---|
| `gap-xs` | 4px | Entre elements inline, separateurs | Waybar modules margin |
| `gap-sm` | 6px | Entre cartes, entre panneaux (inner gap) | Hyprland gaps_in |
| `gap-md` | 12px | Marges externes, padding sections | Hyprland gaps_out |
| `gap-lg` | 16px | Padding genereux, respiration | Kitty window_padding |

Seules ces 4 valeurs sont utilisees. Pas de 8px, 10px, 20px, etc.

#### Bordures

- **Largeur** : 2px sur les panneaux/fenetres (Hyprland border_size), 1px sur les elements UI (Dunst, Wofi)
- **Actif** : gradient de fg vers comment a 45deg (inspire de `rgba(ffffffee) rgba(444444ee) 45deg` de Hyprland)
- **Inactif** : couleur comment unie
- **Jamais de bordure sur les elements decoratifs** (comme les notifications Spotify, PiP dans Hyprland)

#### Rounding

- **4px** sur les petits elements (badges, tags, boutons)
- **6px** sur les elements moyens (notifications Dunst, entrees Wofi)
- **8px** sur les grands conteneurs (fenetres Hyprland, launcher Wofi)
- **Jamais 0** (pas de coins sharp)
- **Jamais > 8px** (pas de pilules rondes)

#### Animations

Deux courbes bezier extraites de la config Hyprland :

| Nom | Valeur CSS | Usage |
|---|---|---|
| `snap` | `cubic-bezier(0.2, 0.8, 0.25, 1.0)` | Ouverture de panneaux, apparition d'elements, reponse rapide |
| `drift` | `cubic-bezier(0.3, 0.0, 0.2, 1.0)` | Transitions de sections, scroll smooth, mouvements amples |

- Duree snap : 200-400ms
- Duree drift : 600-1000ms
- **Pas de transition sur le texte** (changement instantane)
- **Pas de bounce, pas d'elastic** — toujours ease-out

#### Etats interactifs (pattern inversion)

Inspire du Waybar et Wofi de Hugo ou l'element actif inverse fg/bg :

| Etat | Style |
|---|---|
| Normal | Texte fg sur fond transparent |
| Hover | Fond subtle (bg-dark ou 10% blanc) |
| Actif/Selectionne | **Inversion : texte bg sur fond fg + bold** |
| Focus | Bordure accent |
| Disabled | Opacite 50% |

Ce pattern d'inversion est la signature visuelle. A appliquer sur : tabs navbar, items de liste dans SplitView, commandes dans CommandBar.

#### Ombres et effets

- **Zero box-shadow.** Jamais. Nulle part.
- Separation des elements par bordures et gaps, pas par ombres
- Si besoin de profondeur : leger backdrop-blur (comme le blur Hyprland: size 5, passes 3)

#### Navbar (inspire Waybar)

- **Hauteur fine** : ~24-32px (le Waybar fait 24px)
- **Fond :** bg-dark
- **Elements inline**, espaces par gap-md
- **Tab active** : pattern inversion (fg sur bg + bold)
- **Tab inactive** : fg sur transparent
- **Rounding des tabs** : 4px

#### Typographie

- **Font principale** : Maple Mono NF (la font de tout l'environnement de Hugo)
- **Fallback** : JetBrains Mono, monospace
- **Tailles** : 11px (base UI comme Waybar/Kitty), 13px (contenu principal comme Wofi input)
- **Hierarchie par weight et couleur**, pas par taille : le bold et la couleur accent distinguent les titres, pas des tailles exagerees
- **Texte secondaire** : couleur comment avec opacite reduite (comme les formats Dunst a 50-65% alpha)

## Data (structure type)

### projects.ts

```ts
export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  github?: string
  url?: string
}

export const projects: Project[] = [
  {
    id: "just",
    title: "JUST",
    subtitle: "Version Control System",
    description: "VCS developpe integralement en C from scratch...",
    tags: ["C", "Makefile", "Memory Management", "Data Structures"],
    github: "https://github.com/...",
  },
]
```

### Principes data

- Cles string pour le contenu (pas de i18n now, mais structure prete)
- Types exportes pour chaque section
- Un fichier = une section = un tableau ou objet type

## Split View (Tiling WM / Notion-style)

Inspiration directe de Hyprland : quand on clique sur un element qui a du detail (projet, experience...), l'ecran se divise comme un tiling window manager.

### Comportement

1. **Etat ferme** : la section affiche une liste/grille d'elements (ex: cartes projet)
2. **Clic sur un element** : l'ecran se split en deux
   - Cote gauche (ou haut sur mobile) : la liste reste visible, l'element selectionne est highlight
   - Cote droit (ou bas sur mobile) : le detail de l'element s'affiche (peek view, comme Notion)
3. **Bouton "expand"** : le detail passe en plein ecran (la liste disparait)
4. **Esc ou clic retour** : revient au split, puis ferme le detail

### Layout dynamique (comme Hyprland)

- **Desktop (>= 1024px)** : split horizontal (gauche: liste, droite: detail)
- **Tablette (768-1023px)** : split horizontal mais ratio 40/60
- **Mobile (< 768px)** : split vertical (haut: liste reduite, bas: detail) ou directement peek overlay

### Raccourcis vim associes

| Raccourci | Action |
|---|---|
| `Enter` | Ouvrir le detail de l'element selectionne (split) |
| `o` | Expand le detail en plein ecran |
| `q` ou `Esc` | Fermer le detail / revenir au split |
| `j` / `k` | Naviguer dans la liste quand le split est ouvert |
| `h` / `l` | Switch focus entre liste et detail dans le split |

### Pattern generique

Ce comportement est un pattern reutilisable, pas specifique aux projets. Tout composant section qui a des elements avec du contenu detaille peut l'utiliser :

- `Projects.tsx` : clic sur un projet -> detail du projet
- `Experience.tsx` : clic sur une experience -> detail de l'experience
- `Skills.tsx` : clic sur une categorie -> detail des competences

Le pattern est encapsule dans un composant `SplitView.tsx` :

```tsx
<SplitView
  items={projects}
  renderItem={(project) => <ProjectCard project={project} />}
  renderDetail={(project) => <ProjectDetail project={project} />}
/>
```

### Animations

- Framer Motion pour le split : la liste se compresse, le detail slide in
- Transition smooth entre split et expand (layout animation)
- Le split respecte le style Hyprland : bordures nettes, pas de drop shadow excessif, gaps entre les "fenetres"

### Style visuel Hyprland

- **Gaps** entre les panneaux (comme les gaps Hyprland entre fenetres)
- **Bordures** fines avec la couleur accent (`tn-accent`) sur le panneau actif
- **Titre du panneau** en haut de chaque "fenetre" (comme la barre de titre Hyprland)
- Pas d'ombre portee, pas de blur — plat, net, minimaliste

## SEO

- `react-helmet-async` pour les meta tags par defaut
- Open Graph : titre, description, image
- Twitter card
- Meta description
- Balise lang (fr par defaut, pret pour i18n)

## Deploiement

- GitHub Actions workflow sur push `main`
- `npm install` -> `npm run build` -> deploy `dist/` sur branche `gh-pages`
- Custom domain optionnel plus tard

## Modularity / Extensibilite

Pour ajouter une nouvelle section :

1. Creer `src/sections/NewSection.tsx`
2. Creer `src/data/newsection.ts`
3. Ajouter dans `config.ts` : `newsection: { enabled: true, label: "new.rs" }`
4. Le composant `App.tsx` itere sur la config et rend automatiquement

Pour desactiver une section : `enabled: false` dans config. C'est tout.
