# Choix de modélisation — Blockchain 3D

> Version de travail (semaine 02). La structure sera alignée sur le modèle officiel fourni avec le sujet.

**Projet** : Blockchain 3D — https://alamine01.github.io/blockchain-3d/
**Public visé** : personne non initiée, sans explication orale.
**Fil rouge** : le voyage d'un paiement — Alice envoie 5 jetons à Bob.

---

## 1. Recherche documentaire

### Sources principales

| # | Source | Type | Utilisée pour |
|---|---|---|---|
| S1 | Satoshi Nakamoto, *Bitcoin: A Peer-to-Peer Electronic Cash System*, 2008 — https://bitcoin.org/en/bitcoin-paper | Article fondateur | Notions 1, 2, 3, 4, 5, 7 |
| S2 | ethereum.org, *Proof-of-stake (PoS)* — https://ethereum.org/developers/docs/consensus-mechanisms/pos/ | Documentation officielle | Notion 6 |
| S3 | ethereum.org, *Proof-of-work (PoW)* — https://ethereum.org/developers/docs/consensus-mechanisms/pow/ | Documentation officielle | Notions 5, 6 |
| S4 | CNIL, *Blockchain et RGPD : quelles solutions pour un usage responsable…* — https://cnil.fr/fr/technologies/blockchain-et-rgpd-quelles-solutions-pour-un-usage-responsable-en-presence-de-donnees-personnelles | Autorité publique française | Notions 3, 4 (définitions, limites) |
| S5 | Anders Brownworth, *Blockchain Demo* — https://andersbrownworth.com/blockchain/ | Démonstrateur pédagogique | Inspiration pour la représentation des notions 1, 2, 3, 5 |

> Toute affirmation des fiches ci-dessous renvoie à une de ces sources (repère `[S1]`, `[S2]`…).

---

### Notion 1 — Structure d'un bloc

- **En une phrase** : un bloc est un paquet de données horodaté qui contient des transactions, son empreinte (hash), l'empreinte du bloc précédent et un nonce. [S1]
- **Comment ça marche** : les transactions récentes sont regroupées dans un bloc. L'en-tête du bloc contient le hash du bloc précédent et le nonce ; le hash du bloc est calculé à partir de tout ce contenu. [S1]
- **Analogie** : une page d'un cahier de comptes, avec au bas de la page un « sceau » calculé à partir de son contenu.
- **Idée reçue à éviter** : le hash n'est pas « stocké » de façon arbitraire ; il est **calculé** à partir du contenu et change si le contenu change.

### Notion 2 — Chaînage cryptographique

- **En une phrase** : chaque bloc contient le hash du bloc précédent, ce qui crée une chaîne ordonnée. [S1]
- **Comment ça marche** : une fonction de hachage transforme n'importe quel contenu en une empreinte de taille fixe. Le même contenu donne toujours la même empreinte ; la moindre modification donne une empreinte totalement différente. Bitcoin utilise SHA-256. [S1, S3]
- **Analogie** : les maillons d'une chaîne, ou une empreinte digitale du texte.
- **Idée reçue à éviter** : le hash n'est pas un chiffrement ; on ne peut pas « décoder » un hash pour retrouver le contenu.

### Notion 3 — Immutabilité et détection de falsification

- **En une phrase** : modifier un ancien bloc change son hash, qui ne correspond plus à celui enregistré dans le bloc suivant ; l'incohérence est détectable par tous les nœuds. [S1]
- **Comment ça marche** : pour qu'une modification passe inaperçue, il faudrait recalculer tous les blocs suivants (et refaire leur preuve de travail) plus vite que le reste du réseau. [S1]
- **Analogie** : arracher une page d'un cahier dont chaque page porte le sceau de la précédente.
- **Nuance** : la blockchain est « très difficile à modifier », pas magiquement impossible à modifier. [S4]

### Notion 4 — Réseau et décentralisation

- **En une phrase** : il n'y a pas d'autorité centrale ; chaque nœud conserve une copie de la chaîne, et les transactions comme les blocs sont diffusés de nœud en nœud. [S1, S4]
- **Comment ça marche** : une nouvelle transaction est diffusée à tous les nœuds ; un nœud qui reçoit un bloc le vérifie avant de l'accepter. En cas de désaccord, les nœuds retiennent la chaîne qui représente le plus de travail cumulé (règle de la « chaîne la plus longue » en PoW). [S1]
- **Analogie** : un cahier dont chaque habitant d'un village possède une copie identique.
- **Idée reçue à éviter** : « décentralisé » ne veut pas dire « sans règles » ; tous les nœuds appliquent les mêmes règles de validation.

### Notion 5 — Validation et minage

- **En une phrase** : en proof of work, un mineur cherche un nonce tel que le hash du bloc respecte une contrainte de difficulté (par ex. commencer par un certain nombre de zéros). [S1, S3]
- **Comment ça marche** : la seule méthode est d'essayer des nonces un par un. Trouver est long et coûteux ; vérifier est instantané. La difficulté est ajustée pour garder un rythme de blocs régulier. Le mineur gagnant reçoit une récompense. [S1, S3]
- **Analogie** : chercher le code d'un cadenas en essayant toutes les combinaisons ; vérifier un code donné prend une seconde.
- **Idée reçue à éviter** : les mineurs ne « fabriquent » pas la monnaie par un calcul ; ils sécurisent la chaîne et sont récompensés pour cela.

### Notion 6 — Comparaison de deux mécanismes de consensus : PoW et PoS

- **En une phrase** : le consensus est la règle qui permet aux nœuds de s'accorder sur le bloc suivant sans autorité centrale.
- **Proof of Work** : le droit d'ajouter un bloc se gagne par la puissance de calcul. [S1, S3]
- **Proof of Stake** : des validateurs immobilisent des jetons (la mise) ; un validateur est choisi pour proposer un bloc et d'autres l'attestent ; un comportement malhonnête est sanctionné par la perte d'une partie de la mise (*slashing*). [S2]

| | Proof of Work | Proof of Stake |
|---|---|---|
| Droit d'écrire obtenu par | la puissance de calcul | la mise de jetons |
| Avantages | éprouvé depuis 2009, sécurité liée au coût réel du calcul | consommation d'énergie très faible, sanction directe du tricheur |
| Limites | très forte consommation d'énergie, matériel spécialisé | avantage aux plus gros détenteurs, mécanisme plus complexe |
| Exemple | Bitcoin | Ethereum (depuis 2022) |

[S2, S3]

### Notion 7 — Cycle de vie d'une transaction et scénario d'attaque

- **Cycle de vie** : création et signature par l'émetteur → propagation dans le réseau → vérification par les nœuds (l'émetteur possède-t-il les fonds ?) → inclusion dans un bloc par un mineur/validateur → confirmation à mesure que des blocs s'ajoutent par-dessus. [S1]
- **Attaque choisie : la double dépense** — Alice tente de dépenser les mêmes jetons deux fois (à Bob et à Chloé). Le système de Bitcoin a été conçu précisément pour l'empêcher : les nœuds n'acceptent que la première transaction inscrite dans la chaîne et rejettent celle qui réutilise des fonds déjà dépensés. [S1]
- **Limite** : un attaquant contrôlant la majorité de la puissance de calcul (« attaque des 51 % ») pourrait réécrire les blocs récents ; c'est pourquoi on attend plusieurs confirmations. [S1]

---

## 2. Storyboard

*À compléter (issue #7) : une case par écran — croquis, ce qu'on voit, action de l'utilisateur, animation, texte affiché, notion couverte. Croquis dans `docs/storyboard/`.*

---

## 3. Choix de représentation par notion

*À compléter (issue #8) : pour chaque notion, la forme 3D retenue, la couleur, l'interaction, et la justification pédagogique, avec les alternatives écartées.*

---

## 4. Usage de l'IA

| Date | Outil | Usage | Vérification |
|---|---|---|---|
| 13/10/2026 | Claude | Aide à la rédaction des fiches de recherche à partir des sources citées | Sources ouvertes et relues, contenu reformulé et compris |
