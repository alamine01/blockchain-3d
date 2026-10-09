# Blockchain 3D — comprendre la blockchain en l'explorant

Projet R507 — BUT MMI 3e année.
Expérience web interactive en 3D (Three.js) qui fait comprendre le fonctionnement d'une blockchain à un public non initié.

> ⚠️ Ce projet est une **médiation scientifique** : il ne s'agit pas d'une vraie blockchain, mais d'une représentation pédagogique.

## Équipe

| Membre | Rôle principal |
|---|---|
| Mouhamed Al Amine BAH ([@alamine01](https://github.com/alamine01)) | Gestion de projet, développement 3D, UX, documentation et tests |

## Liens

- **Démo en ligne** : https://alamine01.github.io/blockchain-3d/
- **GitHub Project** : https://github.com/alamine01/blockchain-3d/projects
- **Choix de modélisation** : [`docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`](docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md)
- **Document de cadrage** : [`docs/CADRAGE.md`](docs/CADRAGE.md)
- **Suivi hebdomadaire** : [`docs/suivi/`](docs/suivi/)

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
├── src/main.js         # scène Three.js
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
