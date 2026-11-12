# Suivi hebdomadaire — Semaine 05

**Période** : du 02/11/2026 au 06/11/2026
**Membres** : Mouhamed Al Amine BAH (@alamine01), binôme (@LeCapet) — *nom à compléter*
**Démo en ligne** : https://alamine01.github.io/blockchain-3d/
**Dépôt** : https://github.com/alamine01/blockchain-3d
**GitHub Project** : https://github.com/alamine01/blockchain-3d/projects

> ⚠️ Fiche rédigée **a posteriori** le 12/11/2026 à partir de l'historique du dépôt (commits et issues), car elle n'a pas été envoyée en fin de semaine. Les éléments en italique sont à compléter par l'équipe.


## 1. Ce qui a été fait cette semaine

- **Développement complet de l'enquête en 9 étapes** (commits `71db4e3`, `85f39d7`, `72faf6c`) :
  - modèle de blockchain avec un **vrai SHA-256**, chaînage, minage, validation ;
  - une interaction par notion (ouvrir un bloc, modifier une empreinte, détecter la falsification, comparer les copies, miner, PoW/PoS, cycle de vie + double dépense) ;
  - navigation guidée, glossaire, compteur de FPS et **qualité adaptative** (halo coupé sous 30 FPS).
- **Refonte visuelle** : écran-titre, mur des preuves avec fils rouges, tampon « Affaire classée », matériaux en verre, panneau translucide (commit `f5056e0`).
- Corrections suite à nos propres essais : éblouissement des fiches de preuves, cache du navigateur, définition du mot « jeton » (commits `01e7381`, `f9c3664`, `864ef53`).
- Documentation : storyboard des 9 écrans et justification de chaque choix dans `CHOIX-MODELISATION.md` (commit `c9586b9`).

## 2. Issues traitées

| Issue | Titre | Statut |
|---|---|---|
| #7, #8 | Storyboard, CHOIX-MODELISATION v1 | Terminé |
| #10 à #17 | Notions 1 à 7, navigation | À vérifier (tests) |
| #18, #21 | Textes de médiation, accessibilité | En cours |

## 3. Difficultés rencontrées

- Déploiement GitHub Pages bloqué une fois côté GitHub (relancé).
- Version en cache dans le navigateur : ajout d'un numéro de version sur les fichiers.
- Effet de halo trop fort rendant les textes illisibles : seuil ajusté.

## 4. Décisions prises

- Vocabulaire réel conservé (« jeton », « nonce »…) mais **expliqué** au moment où il apparaît.
- Code couleur fixe : vert = valide, rouge = falsifié, ambre = sélectionné.

## 5. Usage de l'IA cette semaine

| Outil | Usage | Vérification |
|---|---|---|
| Claude | Aide au développement Three.js, à la refonte visuelle et à la documentation | Parcours testé ; chaque étape relue et expliquée par l'équipe |

## 6. Objectifs de la semaine suivante

- Tests avec 2 personnes extérieures, mesure des FPS sur poste de TP.
- Fiches de suivi, auto-évaluation, support de soutenance.

## 7. Temps passé (estimation)

| Membre | Heures |
|---|---|
| Mouhamed Al Amine BAH | 12 h |
| Binôme (@LeCapet) | *à compléter* |
