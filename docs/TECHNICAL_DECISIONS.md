# Technical Decisions

Chaque choix technique significatif est documente ici avec sa justification.

## Format

```
### TD-XXX: Titre
- **Date**: YYYY-MM-DD
- **Statut**: accepted | superseded | deprecated
- **Contexte**: pourquoi ce choix s'est pose
- **Decision**: ce qu'on a choisi
- **Justification**: pourquoi
- **Alternatives rejetees**: ce qu'on n'a pas pris et pourquoi
```

---

## Decisions

### TD-001: React + Vite + TypeScript comme stack frontend
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Choix du framework pour un portfolio statique heberge sur GitHub Pages, avec forte modularite (sections activables/desactivables).
- **Decision**: React 18 + Vite + TypeScript
- **Justification**: Stack connue du developpeur, Vite genere du statique compatible GitHub Pages, TypeScript securise les data files et la config, React permet un systeme de composants modulaire (1 section = 1 composant).
- **Alternatives rejetees**:
  - Astro : excellent pour le statique pur mais nouveau framework a apprendre, gain de perf negligeable pour un portfolio
  - HTML/CSS/JS vanille : coherent philosophiquement mais modularite plus difficile a maintenir sans systeme de composants

### TD-002: Tailwind CSS v4 pour le styling
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Besoin de styler rapidement avec une palette custom (Tokyo Night).
- **Decision**: Tailwind CSS v4
- **Justification**: Utility-first, configuration directe des tokens de couleur Tokyo Night, pas de CSS custom a maintenir, deja utilise dans le projet precedent.
- **Alternatives rejetees**:
  - CSS modules : plus de code a ecrire, moins rapide pour iterer
  - CSS-in-JS (styled-components) : dependance lourde, runtime overhead inutile

### TD-003: shadcn/ui pour les composants UI
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Besoin de composants UI sans tout recoder a la main.
- **Decision**: shadcn/ui
- **Justification**: Pas une librairie mais des composants copies dans le projet. On les own, on les modifie, on les supprime. Parfait pour la modularite et la philosophie "pas de dependances inutiles". Inclut Lucide React pour les icons.
- **Alternatives rejetees**:
  - MUI / Chakra : trop lourds, imposent leur design system
  - Radix seul : shadcn est deja base sur Radix avec le styling en plus

### TD-004: Pas de backend, full statique
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Hebergement sur GitHub Pages qui ne supporte que le statique. Pas de formulaire de contact, pas de donnees dynamiques.
- **Decision**: Zero backend, zero base de donnees.
- **Justification**: Aucun use-case ne necessite de serveur. Le contenu est gere dans des fichiers TS edites manuellement. Si un besoin dynamique apparait plus tard, on branchera un service externe (Cloudflare Workers, API tierce).
- **Alternatives rejetees**:
  - Express + PostgreSQL (ancien setup) : overkill pour du contenu statique

### TD-005: Fichiers TypeScript separes pour les donnees
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Choix du format de stockage du contenu (projets, experience, skills...).
- **Decision**: Un fichier `.ts` par section dans `src/data/`, avec types exportes.
- **Justification**: Typage compile-time (erreur au build, pas en prod), fichiers petits et cibles, facile a naviguer dans Neovim, 0 dependance supplementaire. Structure prete pour i18n futur (cles au lieu de strings brutes).
- **Alternatives rejetees**:
  - Fichier JSON unique : grossit vite, pas de typage natif, risque de casser une section en editant une autre
  - Markdown + frontmatter : necessite un parser (remark/mdx), dependance supplementaire, moins adapte pour du contenu structure

### TD-006: Framer Motion pour les animations
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Choix entre animations CSS pures, Framer Motion, ou aucune animation.
- **Decision**: Framer Motion pour des transitions subtiles (fade-in au scroll, transitions de sections).
- **Justification**: API declarative, s'integre bien avec React, permet des animations plus complexes si besoin plus tard. Usage minimaliste : pas de surcharge visuelle.
- **Alternatives rejetees**:
  - CSS only : suffisant pour du basique mais limité pour orchestrer des animations au scroll
  - Aucune animation : trop brut, un minimum de polish aide la lisibilite

### TD-007: next-themes pour le dark/light mode
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Toggle dark/light avec palette Tokyo Night (dark) et Tokyo Night Day (light).
- **Decision**: next-themes
- **Justification**: Fonctionne avec Vite (pas couple a Next.js malgre le nom), gere la persistance localStorage, evite le flash au chargement, API simple.
- **Alternatives rejetees**:
  - Implementation custom : reinventer la roue pour un probleme resolu

### TD-008: GitHub Actions pour le deploiement
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Deploiement automatique sur GitHub Pages.
- **Decision**: GitHub Actions workflow : push sur main -> npm install -> npm run build -> deploy dist/ sur gh-pages.
- **Justification**: Gratuit, integre a GitHub, zero infrastructure a gerer.

### TD-009: Registry pattern pour le mapping des sections
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Comment App.tsx rend les sections activees sans if/else ou switch.
- **Decision**: Objet registry `Record<string, React.ComponentType>` qui mappe les cles de config aux composants.
- **Justification**: Respecte Open/Closed (SOLID) — ajouter une section = ajouter une entree dans le registry + config, zero modification du code de rendu existant.

### TD-010: SplitView pattern inspire de Hyprland tiling WM
- **Date**: 2026-04-26
- **Statut**: accepted
- **Contexte**: Comment afficher le detail d'un element (projet, experience...) sans quitter la vue liste. Inspiration directe du tiling window manager Hyprland et du peek view de Notion.
- **Decision**: Composant generique `SplitView.tsx` avec 3 etats : ferme (liste seule), split (liste + detail cote a cote), expand (detail plein ecran). Layout responsive dynamique comme Hyprland (horizontal desktop, vertical mobile). Style : gaps entre panneaux, bordures fines accent sur panneau actif, titre de fenetre, pas d'ombres.
- **Justification**: Pattern generique reutilisable par toute section qui a du contenu detaille (Projects, Experience, Skills). Render props pour decoupler le SplitView du contenu. Raccourcis vim integres (Enter/o/q/h/l) pour une navigation coherente avec le reste du site.
- **Alternatives rejetees**:
  - Modal/Dialog : casse la metaphore tiling WM, cache le contexte de la liste
  - Navigation par route : necessiterait un router, complexite inutile pour une single page
  - Accordion/expand in place : ne reproduit pas l'experience tiling WM souhaitee
