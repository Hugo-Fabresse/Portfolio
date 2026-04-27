# Dashboard About — Design Spec

## Objectif

Transformer la section About en page d'accueil style snacks.nvim dashboard. Layout centre, header ASCII art, bio courte, actions avec raccourcis clavier.

## Label navbar

`about.md` → `about` dans `config.ts`.

## Layout

Tout centre verticalement et horizontalement. Pas de NvimBuffer, pas de line numbers.

### Structure (de haut en bas)

1. **Header ASCII** — mot "BONJOUR" en art ASCII (style identique au "NIHIL" de la config snacks.nvim). Couleur `tn-accent`.

2. **Identite** — "Hugo Fabresse" en bold, "System Architect" en `tn-secondary`. Centre.

3. **Bio** — 2 lignes de texte depuis `aboutData.bio`. Couleur `tn-fg`. Centre.

4. **Tags focus** — badges `[C] [Low-Level] [Security] [Architecture]`. Style actuel (bg accent/10, border accent/20, text accent).

5. **Divider** — ligne de tirets `────────────────` en `tn-comment`.

6. **Actions** — liste verticale, chaque ligne :
   - Icone Lucide a gauche (couleur `text-black dark:text-white`)
   - Nom de l'action au centre
   - Touche raccourci a droite en `tn-comment`

### Actions

| Icone (Lucide) | Nom | Touche | Comportement |
|---|---|---|---|
| `FolderOpen` | Projects | `p` | `setActiveBuffer("projects")` |
| `Wrench` | Skills | `s` | `setActiveBuffer("skills")` |
| `Github` | GitHub | `g` | `window.open(url, "_blank")` |

## Keybinds

Les touches p, s, g sont actives uniquement quand le buffer `about` est affiche. Elles doivent etre desactivees quand la CommandBar ou un autre overlay est ouvert.

## Composant

Remplace le contenu de `src/sections/About.tsx`. Le composant NvimBuffer n'est plus utilise par About (mais reste disponible pour d'autres sections).

## Data

`src/data/about.ts` reste inchange (title, tagline, bio, focus). L'URL GitHub est ajoutee dans about.ts ou directement dans le composant (a determiner a l'implementation — preference pour about.ts pour respecter la regle "zero contenu en dur").

## Style

- Font mono, taille 13px (comme le reste du site)
- Animations : fade-in via Section wrapper (snap bezier, 300ms)
- Pas de line numbers, pas de tildes
- Responsive : le header ASCII peut etre reduit ou masque sur mobile si trop large
