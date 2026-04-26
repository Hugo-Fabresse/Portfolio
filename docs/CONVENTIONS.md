# Conventions

Regles de code a suivre dans tout le projet. Reference pour maintenir la coherence.

## Nommage

| Element | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `Navbar.tsx`, `CommandBar.tsx` |
| Fichiers data | camelCase | `projects.ts`, `experience.ts` |
| Hooks | camelCase prefixe `use` | `useVimNavigation.ts` |
| Interfaces/Types | PascalCase | `Project`, `Experience`, `SiteConfig` |
| Variables/fonctions | camelCase | `siteConfig`, `handleScroll` |
| Constantes | camelCase (pas UPPER_SNAKE) | `sectionRegistry`, `tokyoNightDark` |
| CSS classes (Tailwind) | kebab-case si custom | `bg-tn-bg`, `text-tn-accent` |
| Cles de config | camelCase | `about`, `projects`, `experience` |

## Structure d'un composant section

```tsx
/**
 * Section [Nom] - [description courte]
 *
 * Affiche [ce que la section montre].
 * Donnees : src/data/[fichier].ts
 */

import { motion } from "framer-motion"
import Section from "@/components/Section"
import { données } from "@/data/fichier"

export default function NomSection() {
  return (
    <Section id="nom">
      {/* contenu */}
    </Section>
  )
}
```

Regles :
- Un seul export default par fichier section
- Toujours wrapper dans `<Section>` pour la coherence layout
- Import des data depuis `@/data/`, jamais de contenu en dur dans le composant
- JSDoc en tete de fichier : ce que la section fait + ou sont les data

## Structure d'un fichier data

```ts
/**
 * Donnees de la section [Nom]
 *
 * Modifier ce fichier pour mettre a jour le contenu de la section.
 * Voir src/sections/[Nom].tsx pour le rendu.
 */

/** Description du type */
export interface NomType {
  id: string
  title: string
  // ...
}

/** Contenu de la section */
export const nomData: NomType[] = [
  // ...
]
```

Regles :
- Types exportes en premier, data ensuite
- JSDoc sur l'interface et sur la constante
- Chaque champ de l'interface est documente si pas evident

## Imports

Ordre des imports (separes par une ligne vide) :

```tsx
// 1. React et librairies tierces
import { useState } from "react"
import { motion } from "framer-motion"

// 2. Composants internes
import Section from "@/components/Section"

// 3. Data et config
import { projects } from "@/data/projects"
import { siteConfig } from "@/config"

// 4. Types (si import separe)
import type { Project } from "@/data/projects"
```

## Documentation dans le code

### Obligatoire
- JSDoc en tete de chaque fichier : role du fichier, lien vers fichiers lies
- JSDoc sur chaque interface/type exporte
- JSDoc sur chaque fonction exportee
- Commentaire inline pour toute logique non evidente

### Interdit
- Commentaires qui repetent le code (`// increment counter` au dessus de `counter++`)
- TODO sans contexte (toujours preciser quoi et pourquoi)

### Format JSDoc

```ts
/**
 * Description courte (une ligne).
 *
 * Description longue si necessaire, explique le pourquoi
 * plutot que le comment.
 *
 * @param name - description du parametre
 * @returns description du retour
 *
 * @example
 * ```ts
 * maFonction("arg")
 * ```
 */
```

## Tailwind

- Utiliser les tokens theme (`bg-tn-bg`, `text-tn-accent`) jamais les couleurs brutes
- Prefixer les tokens Tokyo Night avec `tn-` pour eviter les collisions
- Pas de `@apply` sauf pour des patterns repetes 3+ fois
- Responsive : mobile-first (`sm:`, `md:`, `lg:`)

### Spacing strict (systeme 4/6/12/16)

Seules 4 valeurs de spacing sont autorisees :

| Token Tailwind | Valeur | Usage |
|---|---|---|
| `gap-1` / `p-1` | 4px | Elements inline, separateurs |
| `gap-1.5` / `p-1.5` | 6px | Entre cartes, inner gaps |
| `gap-3` / `p-3` | 12px | Marges externes, padding sections |
| `gap-4` / `p-4` | 16px | Padding genereux, respiration |

Pas de valeurs intermediaires (8px, 10px, 20px...).

### Bordures

- `border-2` sur panneaux/fenetres (SplitView, conteneurs principaux)
- `border` (1px) sur elements UI (boutons, inputs, cartes)
- Actif : gradient fg→comment a 45deg
- Inactif : couleur comment unie
- Jamais de `shadow-*`. Zero ombre.

### Rounding

- `rounded` (4px) : badges, tags, boutons, tabs
- `rounded-md` (6px) : notifications, entrees
- `rounded-lg` (8px) : conteneurs, panneaux SplitView
- Jamais `rounded-none` ni `rounded-full`

### Etats interactifs (pattern inversion)

- Normal : `text-tn-fg`
- Hover : `bg-tn-bg-dark` ou `bg-white/10`
- Actif : `bg-tn-fg text-tn-bg font-bold` (inversion)
- Focus : `border-tn-accent`

## Composants shadcn/ui

- Generes dans `src/components/ui/`
- Modifiables librement (on les own)
- Ne pas modifier le pattern d'API de base (props, variants) pour rester compatible avec les docs shadcn si besoin de re-generer

## Git

- Pas de commit automatique (Hugo commit manuellement)
- Messages de commit en anglais, format conventionnel : `type: description`
  - Types : `feat`, `fix`, `refactor`, `docs`, `style`, `chore`
- Documenter chaque changement dans `PROGRESS.md` AVANT de commit

## Principes

- **SOLID** : voir docs/TECHNICAL_DECISIONS.md TD-009 pour le registry pattern
- **DRY** : si un pattern se repete 3+ fois, extraire un composant ou un utilitaire
- **KISS** : la solution la plus simple qui marche. Pas d'abstraction prematuree
- **YAGNI** : ne pas coder ce qui n'est pas dans la v1 du spec
- Zero contenu en dur dans les composants, tout passe par `data/`
