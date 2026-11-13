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

Le board n'est pas modifiable depuis un outil en ligne de commande : il faut passer par l'interface. Il compte pour **20 % de la note**, donc c'est la tâche la plus rentable de la liste.

1. **Vérifier les 5 colonnes**, nommées exactement : `Backlog`, `À faire`, `En cours`, `À vérifier`, `Terminé`.
2. **Ajouter les issues manquantes** : dans une colonne, `+ Add item` → taper `#26`, puis `#27`, `#28`, `#29`, `#30`, `#32`, `#33`.
3. **Ranger les cartes** :

| Colonne | Issues |
|---|---|
| **Terminé** | 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 21, 26, 27, 28, 29, 30, 32, 33 |
| **À vérifier** | 22 (CHOIX-MODELISATION, en attente du modèle officiel) |
| **En cours** | 9 (recruter les testeurs), 19 (tests utilisateurs), 20 (mesure des FPS) |
| **À faire** | 23 (vérification finale), 24 (auto-évaluation), 25 (préparer la soutenance) |

4. **Vérifier que le board est public** (⋯ → Settings → Visibility), sinon le correcteur ne le verra pas.

## C. Les trois actions humaines qui restent

### 1. Tests utilisateurs — issues #9 et #19 · *obligatoire, et non fait à ce jour*
Le sujet l'exige deux fois : dans le déroulé pédagogique et dans les **critères de réussite**. C'est aussi évalué dans l'UX (15 %). Sans tests, ce critère est manqué — et c'est le seul qui le soit.
**Version express (40 min au total)** : voir la section 0 de [`TESTS-UTILISATEURS.md`](TESTS-UTILISATEURS.md), avec le message prêt à envoyer aux testeurs.
- [ ] Trouver 2 personnes hors R507 (famille, colocataire, autre filière — un appel vidéo suffit)
- [ ] 20 min chacune : une seule consigne, pensée à voix haute, aucune aide
- [ ] Remplir la grille d'observation
- [ ] Créer **une issue par problème relevé**, corriger, lier le commit à l'issue

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
