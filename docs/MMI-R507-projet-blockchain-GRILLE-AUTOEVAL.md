# Grille d'auto-évaluation — L'Affaire Émile

> Organisée selon l'évaluation indicative du sujet (section 7). Les tests utilisateurs ont eu lieu le 15/11 ; les lignes encore marquées *à compléter* dépendent de la répétition du 19 novembre et d'une mesure sur poste de TP.

**Groupe** : Mouhamed Al Amine BAH (@alamine01), Hugo Delpuech (@LeCapet)
**Démo** : https://alamine01.github.io/blockchain-3d/

## 1. Pertinence pédagogique (25 %)

| Critère du sujet | Preuve dans le projet | Auto-évaluation |
|---|---|---|
| Les 7 notions sont présentes | Une étape par notion (étapes 1 à 7), nommée à l'identique du sujet | ✓ |
| Chaque notion produit une animation ou une interaction observable | Mission obligatoire à chaque étape (ouvrir un bloc, modifier des données, scanner, comparer, miner, PoW/PoS, rejouer une transaction et une double dépense) | ✓ |
| Fil rouge narratif qui relie les notions | « L'Affaire Émile » : chaque notion est un indice ; preuves épinglées sur le mur ; récapitulatif final des 7 notions | ✓ |
| Compréhensible par un non-initié sans explication | Mots techniques cliquables, missions, « À retenir », glossaire. Les 2 testeurs ont terminé l'enquête seuls et désigné le bon coupable : « pas d'erreur de texte, c'est bien expliqué » | ✓ |
| Attaque illustrée + détection | Falsification du bloc 7 (étapes 3-4) et double dépense (étape 7), toutes deux détectées par le réseau | ✓ |

## 2. Argumentation des choix (25 %)

| Critère | Preuve | Auto-évaluation |
|---|---|---|
| Livraison de `CHOIX-MODELISATION.md` | `docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` | ✓ *(à aligner sur le modèle officiel)* |
| Sources fiables | 5 sources (livre blanc Bitcoin, ethereum.org, CNIL…), citées dans les fiches | ✓ |
| Storyboard | 9 écrans décrits (caméra, action, réaction, texte) | ✓ |
| Justification de chaque représentation, avec alternatives écartées | Tableau des choix transversaux + une fiche par notion | ✓ |
| Limites de la modélisation | Section 6 du document | ✓ |

## 3. GitHub Projects et gestion de projet (20 %)

| Critère | Preuve | Auto-évaluation |
|---|---|---|
| Colonnes exactes : Backlog, À faire, En cours, À vérifier, Terminé | Board du dépôt | *à vérifier sur le board* |
| Milestones calés sur le calendrier | M1 Cadrage (09/10) → M6 Livraison (15/11) → M7 Soutenance (19/11) | ✓ |
| Issues granulaires, assignées, liées aux commits/PR | 25+ issues, numéros cités dans les commits, pull request finale | ✓ |
| 8 fiches hebdomadaires | `docs/suivi/` : S01 à S08 présentes ; S02 à S05 rédigées a posteriori et signalées comme telles | *partiel — assumé et expliqué* |
| Usage de l'IA déclaré | README, CHOIX-MODELISATION, fiches | ✓ |
| Travail réparti entre les membres | Mouhamed Al Amine BAH : gestion de projet, modèle blockchain et scène Three.js, documentation. Hugo Delpuech : UX, storyboard, textes de médiation, tests utilisateurs. Répartition annoncée dans `CADRAGE.md` | ✓ |

## 4. Interaction, UX et finition (15 %)

| Critère | Preuve | Auto-évaluation |
|---|---|---|
| Légendes, boutons, textes lisibles, feedback, navigation | Missions cochées, bouton Suivant qui s'illumine, notifications « Indice obtenu », barre de progression, navigation clavier | ✓ |
| ≥ 30 FPS sur poste de TP | Compteur affiché, qualité adaptative. *Mesure : à compléter* | *à mesurer* |
| Tests avec ≥ 2 personnes extérieures, issues créées | 2 testeurs le 15/11, synthèse dans `docs/TESTS-UTILISATEURS.md` §4, issues #48 et #49 créées et corrigées le jour même | ✓ |
| Déploiement en ligne | GitHub Pages | ✓ |
| Accessibilité | Couleurs doublées de texte, clavier, `aria-live`, mouvement réduit, mobile | ✓ |

## 5. Soutenance (15 %)

| Critère | Préparation | Auto-évaluation |
|---|---|---|
| 20 minutes, démonstration fonctionnelle | Support interactif (`docs/soutenance/`) avec chrono de 20 min ; plan minuté, script de démo et questions anticipées dans `docs/SOUTENANCE.md` | ✓ *(à répéter le 19/11)* |
| Chaque membre peut expliquer tout le projet | *Chaque membre a parcouru `story.js` et sait expliquer chaque étape* | *à confirmer* |

## Note estimée par le groupe

| Critère | Poids | Estimation | Pourquoi pas plus |
|---|---|---|---|
| Pertinence pédagogique | 25 % | 22 / 25 | Les 7 notions sont traitées, chacune par une interaction, et deux testeurs non initiés ont terminé l'enquête seuls en désignant le bon coupable. Le modèle reste simplifié (pas de signature cryptographique réelle, difficulté fixe à 3 zéros, 4 nœuds). |
| Argumentation des choix | 25 % | 21 / 25 | Storyboard, tableau des choix transversaux, une fiche par notion, alternatives écartées et limites documentées. Le document n'a pas pu être transposé dans le modèle officiel de l'enseignant, faute de l'avoir récupéré à temps. |
| GitHub Projects et gestion de projet | 20 % | 15 / 20 | Milestones calées sur le calendrier, issues granulaires liées aux commits, 8 fiches hebdomadaires. Mais S02 à S05 ont été rédigées a posteriori et signalées comme telles, et la répartition réelle du travail n'a pas été respectée en cours de projet. |
| Interaction, UX et finition | 15 % | 13 / 15 | Tests réalisés, problèmes transformés en issues et corrigés le jour même ; accessibilité clavier, contrastes, mouvement réduit, mobile. La mesure des 30 FPS sur poste de TP reste à faire. |
| Soutenance | 15 % | *à compléter après le 19/11* | |

**Total estimé hors soutenance : 71 / 85, soit environ 16,7 / 20.**

Le point le plus coûteux est la gestion de projet : le suivi hebdomadaire n'a pas
été tenu au fil de l'eau et le travail n'a pas été réparti dans les faits. C'est
assumé et expliqué dans les fiches plutôt que masqué.
