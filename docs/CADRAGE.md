# Document de cadrage

## 1. Équipe

| Membre | Rôle | Compte GitHub |
|---|---|---|
| Mouhamed Al Amine BAH | Gestion, 3D, UX, documentation, tests | @alamine01 |

## 2. Public cible

Personne **non initiée** : extérieure au projet, n'ayant pas suivi R507, sans explication orale préalable.
Conséquence : l'expérience doit être **autonome** (consignes à l'écran, vocabulaire défini au moment où il apparaît).

## 3. Fil rouge narratif (proposition, à valider)

**« Le voyage d'un paiement »** : l'utilisateur suit Alice qui envoie 5 jetons à Bob.

| Étape | Notion | Ce que l'utilisateur fait / voit |
|---|---|---|
| 1. Alice crée sa transaction | 7 (création) | Il remplit/valide une transaction, elle prend la forme d'un objet lumineux |
| 2. La transaction voyage | 4 Réseau | Elle se propage de nœud en nœud sur une carte de nœuds |
| 3. On ouvre un bloc | 1 Structure | Clic sur un bloc → il s'ouvre et révèle données, hash, hash parent, nonce |
| 4. Un mineur travaille | 5 Minage | Le nonce défile jusqu'à trouver un hash valide (difficulté réglable) |
| 5. Le bloc rejoint la chaîne | 2 Chaînage | Un lien visuel relie le hash du parent au bloc suivant |
| 6. Et si on trichait ? | 3 + 7 (attaque) | L'utilisateur modifie un ancien bloc → les liens deviennent rouges, les autres nœuds rejettent la copie |
| 7. D'autres façons de décider | 6 Consensus | Bascule PoW / PoS : course au calcul vs tirage pondéré par la mise |

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

Three.js (CDN), VS Code, GitHub / GitHub Projects / GitHub Pages, Figma (storyboard).
