# Document de cadrage

## 1. Équipe

| Membre | Rôle | Compte GitHub |
|---|---|---|
| Mouhamed Al Amine BAH | Gestion de projet, développement 3D, documentation | @alamine01 |
| *Hugo delpuech* | UX, storyboard, tests utilisateurs | @LeCapet |

## 2. Public cible

Personne **non initiée** : extérieure au projet, n'ayant pas suivi R507, sans explication orale préalable.
Conséquence : l'expérience doit être **autonome** (consignes à l'écran, vocabulaire défini au moment où il apparaît).

## 3. Fil rouge narratif : « L'Affaire Émile »

Émile, un grand-père passionné d'informatique, est mort. Il gérait l'argent de la famille avec un registre partagé (une blockchain) : chacun de ses 4 petits-enfants (Marc, Sofia, Karim, Léa) en a une copie. Léa affirme qu'Émile lui a donné 50 000 jetons. **L'utilisateur est l'enquêteur** : il découvre comment fonctionne une blockchain parce que chaque notion lui sert d'indice pour démasquer la falsification.

Ce fil rouge a été choisi parce qu'une enquête rend l'utilisateur **actif** (il cherche, compare, teste), et parce que la question « à qui faire confiance quand il n'y a pas d'autorité ? » est exactement le problème que résout une blockchain.

| Étape | Notion | Ce que l'utilisateur fait |
|---|---|---|
| 0. Le dossier | Introduction | Découvre le litige et les 4 ordinateurs |
| 1. La pièce à conviction | 1. Structure d'un bloc | Ouvre un bloc et lit ses 4 champs |
| 2. Le labo des empreintes | 2. Chaînage | Modifie un bloc d'essai et voit l'empreinte et le lien changer |
| 3. La scène du crime | 3. Immutabilité | Trouve le bloc falsifié dans la copie de Léa, le modifie et le restaure |
| 4. Les témoins | 4. Réseau | Compare les 4 copies, regarde une opération circuler |
| 5. L'alibi de Léa | 5. Minage | Mine un bloc (difficulté réglable), lance la course Léa contre le réseau |
| 6. Le procès | 6. PoW / PoS | Lance des manches PoW et PoS, voit la caution de Léa confisquée |
| 7. La reconstitution | 7. Transaction + attaque | Rejoue le paiement d'Émile étape par étape, puis une double dépense |
| 8. Le verdict | Synthèse | Désigne le coupable, reçoit le récapitulatif des preuves |

## 4. Périmètre

**Dans le périmètre** : scène 3D interactive, 7 notions animées, textes de médiation, déploiement GitHub Pages.
**Hors périmètre** : vraie cryptographie sécurisée, vraie connexion réseau, comptes utilisateurs.

## 5. Contraintes

- 30 FPS minimum sur un poste de TP, navigateur récent.
- Déploiement en ligne (GitHub Pages).
- Tests auprès d'au moins 2 personnes extérieures, observations → issues.

## 6. Organisation

- **GitHub Projects** : colonnes Backlog, À faire, En cours, À vérifier, Terminé.
- **Milestones** : Cadrage (09/10), Recherche & storyboard (18/10), Prototype 3D (25/10), Mécaniques (08/11), Tests & corrections (13/11), Livraison (15/11), Soutenance (19/11).
- Issues granulaires, assignées, liées aux commits (`git commit -m "... (#12)"`).
- Fiche de suivi chaque vendredi, envoyée par mail et déposée dans `docs/suivi/`.

## 7. Outils

Three.js 0.160 (CDN, sans bundler), SHA-256 implémenté en JavaScript, VS Code, GitHub / GitHub Projects / GitHub Pages, Playwright (tests automatisés du parcours). Tests humains : voir `TESTS-UTILISATEURS.md`.
