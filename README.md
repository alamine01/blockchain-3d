# Blockchain 3D — comprendre la blockchain en l'explorant

Projet R507 — BUT MMI 3e année.
Expérience web interactive en 3D (Three.js) qui fait comprendre le fonctionnement d'une blockchain à un public non initié.

**L'Affaire Émile** : l'utilisateur est un enquêteur. Un grand-père a laissé un registre partagé (une blockchain) à ses 4 petits-enfants, et l'une d'eux prétend avoir reçu 50 000 jetons. En 9 étapes, chaque notion de la blockchain devient un indice pour trouver la vérité.

> ⚠️ Ce projet est une **médiation scientifique** : il ne s'agit pas d'une vraie blockchain, mais d'une représentation pédagogique.

## Équipe

| Membre | Rôle principal |
|---|---|
| Mouhamed Al Amine BAH ([@alamine01](https://github.com/alamine01)) | Gestion de projet, développement 3D, documentation |
| *(nom à compléter)* ([@LeCapet](https://github.com/LeCapet)) | UX, storyboard, tests utilisateurs |

## Liens

- **Démo en ligne** : https://alamine01.github.io/blockchain-3d/
- **GitHub Project** : https://github.com/alamine01/blockchain-3d/projects
- **Choix de modélisation** : [`docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`](docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md)
- **Document de cadrage** : [`docs/CADRAGE.md`](docs/CADRAGE.md)
- **Suivi hebdomadaire** : [`docs/suivi/`](docs/suivi/)

## Ce que fait l'expérience

- **Écran-titre** puis **9 chapitres** (prologue, 7 notions, épilogue), introduits par une carte de chapitre.
- À chaque étape, une **mission** à accomplir, qui oblige à manipuler la notion ; elle se coche toute seule.
- **Mots techniques cliquables** (empreinte, nonce, nœud…) avec leur définition.
- **Mur des preuves** : chaque notion comprise épingle une preuve reliée à la coupable par un fil rouge.
- Vraies empreintes **SHA-256**, minage réel du bloc 10 avec difficulté réglable.
- **Récapitulatif des 7 notions** au verdict.
- Accessible au clavier, adapté au téléphone, **qualité adaptative** pour rester à 30 FPS sur un poste de TP.

## Livrables

| Livrable du sujet | Emplacement |
|---|---|
| Application Three.js | `index.html`, `src/`, en ligne sur GitHub Pages |
| GitHub Projects + milestones | onglet Projects du dépôt |
| Document de cadrage | [`docs/CADRAGE.md`](docs/CADRAGE.md) |
| Choix de modélisation (livrable officiel) | [`docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`](docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md) |
| Fiches hebdomadaires | [`docs/suivi/`](docs/suivi/) |
| Tests utilisateurs | [`docs/TESTS-UTILISATEURS.md`](docs/TESTS-UTILISATEURS.md) |
| Support de soutenance | [`docs/soutenance/`](docs/soutenance/) · plan et questions : [`docs/SOUTENANCE.md`](docs/SOUTENANCE.md) |
| Auto-évaluation | [`docs/MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md`](docs/MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md) |

## Lancer le projet en local

Aucune installation nécessaire (Three.js est chargé via CDN).

```bash
# depuis la racine du dépôt
npx serve .
# ou
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Notions couvertes

1. Structure d'un bloc
2. Chaînage cryptographique
3. Immutabilité et détection de falsification
4. Réseau et décentralisation
5. Validation et minage
6. Comparaison de mécanismes de consensus (PoW / PoS)
7. Cycle de vie d'une transaction et scénario d'attaque

## Organisation du dépôt

```
├── index.html          # point d'entrée
├── style.css
├── src/
│   ├── main.js         # monde 3D et navigation entre les étapes
│   ├── story.js        # les 9 étapes de l'enquête (une par notion)
│   ├── objects.js      # bloc, chaîne, ordinateur (nœud), paquet, étincelles
│   ├── board.js        # mur des preuves
│   ├── glossary.js     # définitions (glossaire et mots cliquables)
│   ├── engine.js       # rendu, caméra, halo, animations, clics
│   ├── chain.js        # modèle : empreinte, chaînage, minage, validation
│   └── sha256.js       # fonction de hachage SHA-256
├── docs/
│   ├── CADRAGE.md
│   ├── MMI-R507-projet-blockchain-CHOIX-MODELISATION.md
│   ├── MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md   (avant soutenance)
│   └── suivi/SEMAINE-01.md … SEMAINE-08.md
```

## Usage de l'IA générative

Déclaration transparente, conformément au sujet :

| Date | Outil | Usage | Vérification |
|---|---|---|---|
| 09/10/2026 | Claude | Structure initiale du dépôt, liste d'issues, scène de départ | Relu et adapté |
| 04/11/2026 | Claude | Développement de la scène 3D et de l'enquête, documentation | Code relu, testé et expliqué par l'équipe |
| 12/11/2026 | Claude | Missions, glossaire cliquable, cartes de chapitre, scanner, documents de suivi et de tests | Parcours testé, textes relus par l'équipe |
