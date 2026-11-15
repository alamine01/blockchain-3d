# Checklist de rendu — à faire avant le 15 novembre, 23h59

> Le calendrier commun fixe la livraison au **15 novembre 23h59** (GitHub, GitHub Project et démo). La section 2 du sujet mentionne le 18 novembre 17h : **viser le 15**.
> Soutenance : **19 novembre, 11h** (répétition à 9h30).

## A. Ce qui est déjà livré

| # | Livrable du sujet | Où | État |
|---|---|---|---|
| 1 | Application Three.js et dépôt GitHub | https://alamine01.github.io/blockchain-3d/ · `index.html`, `src/` | ✅ |
| 2 | GitHub Projects actif, colonnes et milestones | onglet Projects du dépôt | ⚠️ **à mettre à jour, voir B** |
| 3 | Document de cadrage et README | `docs/CADRAGE.md`, `README.md` | ✅ |
| 4 | `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` | `docs/` | ✅ *(à recopier dans le modèle officiel)* |
| 5 | Fiches hebdomadaires | `docs/suivi/SEMAINE-01` à `08` | ✅ *(S02-S05 a posteriori, signalé)* |
| 6 | `MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md` | `docs/` | ⚠️ brouillon, à finaliser |
| 7 | Démonstration et support de soutenance | `docs/soutenance/` + `docs/SOUTENANCE.md` | ✅ |

## B. GitHub Project — à faire à la main (≈ 10 min)

Le board n'est pas modifiable en ligne de commande : il faut passer par l'interface.
Il compte pour **20 % de la note**, c'est la tâche la plus rentable de la liste.

1. **Vérifier les 5 colonnes**, nommées exactement : `Backlog`, `À faire`, `En cours`, `À vérifier`, `Terminé`.
2. **Ajouter les cartes manquantes** : dans une colonne, `+ Add item` → taper le numéro.
3. **Ranger les cartes** ainsi :

| Colonne | Issues |
|---|---|
| **Terminé** | 1 à 19, 21, 26 à 30, 32 à 36, 39, 48, 49 |
| **À vérifier** | 22 (CHOIX-MODELISATION, en attente du modèle officiel) |
| **En cours** | 20 (mesure des FPS), 24 (auto-évaluation, ligne soutenance ouverte), 37 (relecture UX — Hugo) |
| **À faire** | 23 (vérification finale), 25 (préparer la soutenance), 38 (organiser le board — Hugo) |

> Huit issues en double créées le 13/11 (#40 à #47) ont été fermées comme doublons
> le 15/11 : si elles figurent encore sur le board, les retirer.

4. **Vérifier que le board est public** (⋯ → Settings → Visibility), sinon le correcteur ne le verra pas.

## C. Les trois actions humaines qui restent

### 1. Tests utilisateurs — issues #9 et #19 · *faits le 15/11*
- [x] 2 personnes hors R507 ont parcouru le site sans explication orale
- [x] Observations consignées dans [`TESTS-UTILISATEURS.md`](TESTS-UTILISATEURS.md) §4
- [x] Une issue par problème relevé : #48 (trop de texte) et #49 (pas assez intuitif)
- [x] Corrections livrées et liées aux issues (commit `b643356`)
- [ ] Compléter les fiches 2 et 3 : prénom/profil/date des testeurs, FPS relevés, réponses au questionnaire de fin

### 2. Mesure des FPS — issue #20
- [ ] Ouvrir le site sur un poste de salle de TP
- [ ] Noter le compteur (en bas à gauche) aux chapitres 0, 3, 5 et 8
- [ ] Reporter les valeurs dans `TESTS-UTILISATEURS.md` et dans la grille d'auto-évaluation

### 3. Binôme et répartition
- [x] Nom du binôme (Hugo Delpuech) renseigné dans le README, le cadrage, les fiches et la grille
- [ ] Renseigner « Travail réparti entre les membres » dans la grille d'auto-évaluation
- [ ] Vérifier qu'il est bien collaborateur du dépôt et qu'il a des issues assignées

## D. Dernière relecture avant d'envoyer

- [ ] Le site s'ouvre et les 9 chapitres se parcourent sans erreur
- [ ] Les modèles officiels de l'enseignant (CHOIX-MODELISATION, SUIVI-HEBDO, GRILLE-AUTOEVAL) sont respectés
- [ ] `GRILLE-AUTOEVAL.md` est déposée dans `docs/` **avant** la soutenance
- [ ] Mail de livraison envoyé avec les trois liens : dépôt, Project, démo
- [ ] Répétition faite avec le chrono du support (`docs/soutenance/`)
