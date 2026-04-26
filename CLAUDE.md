# CLAUDE.md — Hub Central

## Projet

Portfolio personnel de Hugo Fabresse. Interface inspiree de Neovim, minimaliste et nihiliste. Navigation clavier vim-style, theme Tokyo Night, deploye sur GitHub Pages.

## Philosophie

- **Minimalisme** : pas de dependance inutile, pas d'abstraction prematuree, pas de feature non demandee
- **Modularite** : chaque section est autonome (composant + data + config toggle). Ajouter/supprimer une section ne touche pas le reste
- **Vim-first** : l'interface se navigue au clavier. La souris est optionnelle
- **Ownership** : on own tout le code (shadcn copie dans le projet, pas de lib UI opaque)
- **Documentation** : tout choix, changement, convention est documente. Le code est abondamment commente (JSDoc)

## Stack V1

React 18 + TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Lucide React, Framer Motion, next-themes, react-helmet-async, GitHub Actions.

Pas de backend, pas de base de donnees, pas de router, pas de state manager.

## References obligatoires

Avant de travailler sur ce projet, lire ces fichiers :

| Fichier | Contenu | Quand le consulter |
|---|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Structure fichiers, flux de donnees, responsabilites des couches | Avant de creer ou deplacer un fichier |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Nommage, structure composants, imports, documentation, Tailwind | Avant d'ecrire du code |
| [docs/TECHNICAL_DECISIONS.md](docs/TECHNICAL_DECISIONS.md) | Choix techniques avec justifications (TD-001 a TD-009) | Avant de changer une techno ou un pattern |
| [PROGRESS.md](PROGRESS.md) | Journal de progression | Apres chaque changement significatif (y ecrire) |
| [docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md](docs/superpowers/specs/2026-04-26-portfolio-redesign-design.md) | Design spec complet du portfolio | Pour comprendre le scope et les features prevues |

## Regles de travail

### Documentation vivante (CRITIQUE)

**Tous les fichiers de documentation doivent etre mis a jour en meme temps que le code.**
Ce n'est pas une tache separee, c'est partie integrante de chaque changement.

| Changement | Fichiers a mettre a jour |
|---|---|
| Nouveau fichier/dossier, fichier deplace ou supprime | `docs/ARCHITECTURE.md` (arborescence + responsabilites) |
| Nouveau pattern, nouvelle lib, changement de techno | `docs/TECHNICAL_DECISIONS.md` (nouvelle TD-XXX) |
| Changement de convention, nouveau pattern de code | `docs/CONVENTIONS.md` |
| Tout changement significatif | `PROGRESS.md` (nouvelle entree) |
| Changement de stack, philosophie, regles, scope | `CLAUDE.md` |
| Changement visible pour l'utilisateur du repo | `README.md` |

**Si le code change mais que la doc ne suit pas, le travail n'est pas termine.**

### Autres regles

1. **Pas de commit automatique** — Hugo commit manuellement
2. **Respecter les conventions** de docs/CONVENTIONS.md (nommage, JSDoc, imports, structure)
3. **Respecter l'architecture** de docs/ARCHITECTURE.md (ou sont les fichiers, qui fait quoi)
4. **SOLID, DRY, KISS, YAGNI** — voir docs/CONVENTIONS.md section Principes
5. **Zero contenu en dur** dans les composants — tout passe par `src/data/`
6. **Tokens theme** — utiliser `tn-*` (Tokyo Night), jamais de couleurs brutes
7. **Code abondamment documente** — JSDoc sur chaque fichier, interface, fonction exportee

## V2+ (prevu, pas a implementer maintenant)

- i18n (Paraglide ou i18next)
- Analytics (Umami)
- Blog (MDX)
- PDF / CV (react-pdf)
- Terminal interactif (xterm.js)

Ne pas coder ces features. L'architecture est prete pour les accueillir.
