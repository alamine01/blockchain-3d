# Choix de modélisation — Blockchain 3D

> Version de travail (novembre). La structure sera alignée sur le modèle officiel fourni avec le sujet.

**Projet** : Blockchain 3D — https://alamine01.github.io/blockchain-3d/
**Public visé** : personne non initiée, sans explication orale.
**Fil rouge** : « L'Affaire Émile » — l'utilisateur est un enquêteur qui doit découvrir qui a falsifié le registre partagé d'un grand-père.

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

Le parcours est linéaire (9 écrans) avec un retour possible à tout moment. Chaque écran suit la même structure : un récit (à droite), une action à faire, une scène 3D qui réagit, et un encadré « À retenir ».

| # | Écran | Caméra / ce qu'on voit | Action de l'utilisateur | Réaction animée | Texte « À retenir » (résumé) |
|---|---|---|---|---|---|
| 0 | Le dossier | Vue plongeante sur 4 bureaux reliés par des câbles, l'ordinateur d'Émile au centre | Lit le litige, ouvre le dossier | Travelling d'ouverture du ciel vers le réseau | Un registre conservé par plusieurs personnes |
| 1 | La pièce à conviction | Rangée de 9 cubes (copie de Marc) | Clique sur un cube | La caméra s'approche, le bloc s'illumine, ses 4 champs s'affichent | Données, empreinte, empreinte du précédent, nonce |
| 2 | Le labo des empreintes | 3 gros cubes d'essai | Tape dans les données d'un bloc | L'empreinte change en direct, le cube et le lien suivant passent au rouge ; « Re-miner » rescelle le bloc mais pas le lien | Une lettre change, toute l'empreinte change |
| 3 | La scène du crime | Copie de Léa, d'abord grise | Clique bloc par bloc, modifie, restaure | Les blocs 7, 8, 9 tombent au rouge un par un (domino), étincelles | Modifier un bloc invalide tous les suivants |
| 4 | Les témoins | Les 4 bureaux avec leur mini-chaîne | Lit le bloc 7 chez chacun, compare, diffuse une opération | Écrans qui s'allument, paquets lumineux qui voyagent de voisin en voisin, copie de Léa marquée « rejetée » | Pas de centre, la copie différente est rejetée |
| 5 | L'alibi de Léa | Un gros bloc 10 sous la lampe | Choisit la difficulté, mine, lance la course | Le nonce défile, le cube tourne puis passe au vert ; deux rangées « Léa » et « Réseau » grandissent | Long à trouver, instantané à vérifier |
| 6 | Le procès | Les 4 bureaux + barres de calcul ou piles de pièces | Bascule PoW / PoS, lance des manches | Barres qui montent (course), compteur d'énergie ; piles de cautions, celle de Léa fond | Deux règles de consensus, avantages et limites |
| 7 | La reconstitution | Les 4 bureaux + l'ordinateur d'Émile | Avance étape par étape, puis rejoue la double dépense | Paquet signé, propagation, validation, nouveaux blocs ; la 2e dépense devient rouge et éclate | Cycle de vie d'une transaction, double dépense refusée |
| 8 | Le verdict | Les 4 bureaux | Désigne le coupable | Écran « COUPABLE », récapitulatif des preuves, ou retour vers l'indice manqué | On ne modifie pas une blockchain, on la complète |

---

## 3. Choix de représentation par notion

### Choix transversaux

| Choix | Justification | Alternative écartée |
|---|---|---|
| **Vert = valide, rouge = invalide, ambre = sélectionné** | Code couleur universel, compris sans légende. Toujours doublé par un texte (« ✓ valide », « ✗ invalide ») pour les personnes daltoniennes. | Couleurs par personne : trop d'informations à décoder |
| **Fil rouge « enquête »** | L'utilisateur a une raison de manipuler chaque notion (elle devient un indice). La méfiance entre héritiers illustre le problème de confiance que résout la blockchain. | « Alice paie Bob » : clair mais passif et vu partout |
| **Vraie fonction SHA-256** | Les empreintes affichées sont de vraies empreintes (comme Bitcoin) : on peut les vérifier avec n'importe quel outil en ligne. | Hash simplifié : plus rapide mais moins crédible en soutenance |
| **Difficulté de 3 zéros** | Assez pour que le minage dure environ une seconde et soit visible, assez peu pour ne pas bloquer un poste de TP. | 4 zéros : 16 fois plus long (proposé en option à l'étape 5) |
| **Ambiance polar moderne** (nuit, lampes ambrées, blocs en verre avec reflets, halo lumineux) | Cohérente avec le récit d'enquête ; le fond sombre fait ressortir les couleurs d'état. Un rendu soigné donne envie d'explorer. | Fond blanc neutre : moins immersif |
| **Mur des preuves** (suspects en haut, preuves reliées à Léa par des fils rouges) | Image universelle de l'enquête. Une preuve s'épingle à chaque étape terminée : l'utilisateur **voit sa progression** et comprend que chaque notion est un indice. | Simple barre de progression : n'explique rien |
| **Écran-titre et tampon « Affaire classée »** | Un début et une fin marqués structurent l'expérience comme un récit ; le tampon récompense la bonne réponse. | Arrivée directe dans la scène : moins mémorable |
| **Panneau translucide sur scène plein écran** | La 3D occupe tout l'écran ; le texte reste lisible grâce au flou d'arrière-plan. Sur téléphone, le panneau passe sous la scène. | Écran partagé en deux : scène plus petite |
| **Une mission par étape** (cases à cocher qui se valident toutes seules) | Le novice sait toujours **quoi faire**. Chaque mission oblige à réaliser l'interaction qui illustre la notion : on ne peut pas « passer » une notion sans l'avoir manipulée. Le bouton Suivant s'illumine quand l'indice est obtenu (feedback). | Consigne en texte seul : facile à ignorer |
| **Mots techniques cliquables** (empreinte, nonce, nœud…) | Le vocabulaire est expliqué **au moment où il apparaît**, sans quitter l'histoire. Les définitions reprennent le glossaire commun du sujet. | Glossaire seulement en fin de page : jamais ouvert |
| **Cartes de chapitre** entre les étapes (« Chapitre 3 — La scène du crime ») | Découpent l'enquête comme une série : le novice sait où il en est et quelle notion arrive. Bandes noires de cinéma pour l'immersion. | Changement de vue sans transition : perte de repères |
| **Scanner de l'enquêteur** à l'étape 3 | Les blocs se colorent un par un au passage du faisceau : on **voit** la vérification bloc par bloc et le moment exact où la chaîne casse. | Coloration immédiate : on rate la logique du domino |
| **Écran-titre « couverture de dossier »** : titre qui se décode depuis une empreinte hexadécimale, fond de hachages, fil rouge qui se trace entre des punaises, tampon « Affaire non résolue » | Le premier écran annonce **à la fois le sujet et le genre**. Le titre qui émerge d'une suite hexadécimale *est* la notion 2 (une empreinte devient lisible) : la pédagogie commence avant le premier clic. Mise en page asymétrique et bandeau de métadonnées (défunt, parties, pièce, litige) pour une identité qui ne ressemble pas à un gabarit. Le tampon « non résolue » répond au tampon « Affaire classée » du verdict : l'expérience est encadrée par deux bornes narratives. | Écarté : titre centré sur fond noir — lisible mais interchangeable avec n'importe quel autre projet |
| **Récapitulatif des 7 notions** au verdict | Fait le lien entre l'histoire et le cours : chaque preuve correspond à une notion. Sert d'évaluation douce : si l'utilisateur désigne le bon coupable, il a suivi le raisonnement. | Fin sans synthèse : notions isolées |
| **Qualité adaptative** | Le halo (bloom) se coupe automatiquement si l'ordinateur passe sous 30 images/s, pour respecter la contrainte de 30 FPS. | Toujours sans effet : moins spectaculaire |

### Notion 1 — Structure d'un bloc
- **Représentation** : un cube translucide, avec son numéro et son opération écrits sur la face avant. Un clic l'agrandit et affiche ses 4 champs dans le panneau.
- **Pourquoi** : le cube évoque une « boîte » qui contient quelque chose ; la face avant donne l'essentiel, le panneau donne le détail sans surcharger la 3D.
- **Limite** : un vrai bloc contient des centaines de transactions ; ici une seule, pour la lisibilité.

### Notion 2 — Chaînage cryptographique
- **Représentation** : un tube lumineux entre deux cubes. Il est vert quand le bloc suivant a noté la bonne empreinte, rouge sinon. Dans le labo, l'empreinte est recalculée à chaque lettre tapée et le nombre de caractères changés est affiché.
- **Pourquoi** : le tube matérialise le champ « empreinte du précédent », qui est invisible dans un vrai registre. Taper soi-même montre l'effet avalanche mieux qu'une explication.
- **Limite** : le tube suggère un lien physique, alors qu'il s'agit d'une simple copie de texte (expliqué dans le panneau).

### Notion 3 — Immutabilité et détection de falsification
- **Représentation** : la copie de Léa apparaît grise, puis les blocs se colorent ; à partir du bloc 7, ils tombent au rouge l'un après l'autre (effet domino) avec une gerbe d'étincelles. Le panneau compare côte à côte « empreinte recalculée » et « empreinte notée dans le bloc suivant ».
- **Pourquoi** : le domino rend visible que la modification d'un bloc touche **tous les suivants**, pas seulement lui. La comparaison des deux empreintes donne la preuve « technique ».
- **Limite** : « immuable » ne veut pas dire « impossible à modifier » : on peut modifier sa copie, mais cela se voit et elle est rejetée (étape 4).

### Notion 4 — Réseau et décentralisation
- **Représentation** : 4 bureaux reliés par des câbles en pointillé, sans élément central ; chacun porte sa mini-chaîne au-dessus de lui. Une opération est une sphère lumineuse qui saute de voisin en voisin.
- **Pourquoi** : le bureau personnifie le nœud (« l'ordinateur de Marc ») ; la mini-chaîne au-dessus de chacun montre qu'il a sa **propre copie**. Les câbles maillés, sans centre, montrent l'absence de serveur.
- **Limite** : un vrai réseau compte des milliers de nœuds ; la majorité y est déterminée par le travail cumulé, pas par un vote à main levée.

### Notion 5 — Validation et minage
- **Représentation** : un gros cube qui tourne pendant que le nonce et l'empreinte défilent ; il s'arrête et passe au vert quand l'empreinte commence par les zéros exigés. La difficulté se règle de 1 à 4 zéros. Puis une course : rangée « Léa » (1 ordinateur) contre rangée « Réseau » (3 ordinateurs).
- **Pourquoi** : le défilement montre que le minage est une recherche **par essais**, pas un calcul intelligent. Régler la difficulté fait sentir que chaque zéro multiplie le travail par 16. La course montre pourquoi un tricheur seul ne peut pas rattraper le réseau.
- **Limite** : la course est simulée (vitesses fixes) ; les vitesses réelles dépendent du matériel.

### Notion 6 — Comparaison PoW / PoS
- **Représentation** : en PoW, une barre de calcul monte à côté de chaque bureau et un compteur d'énergie augmente ; le premier arrivé écrit le bloc. En PoS, une pile de pièces dorées par bureau (la caution) ; un tirage pondéré désigne le validateur ; la pile de Léa fond quand elle triche.
- **Pourquoi** : la barre et le compteur rendent visible le **gaspillage** d'énergie du PoW ; la pile de pièces rend concrète la **mise en jeu** et la sanction du PoS. Un tableau comparatif résume avantages et limites.
- **Limite** : le PoS réel (Ethereum) utilise des comités de validateurs et des attestations, simplifiés ici en un seul tirage.

### Notion 7 — Cycle de vie d'une transaction et attaque
- **Représentation** : une sphère dorée « signée par Émile » part de son ordinateur, se propage aux 4 nœuds, qui s'allument en vert un par un (validation), puis un bloc 7 apparaît sur toutes les chaînes, suivi des blocs 8 et 9 (confirmations). Pour la double dépense, deux sphères partent de chez Léa ; la seconde devient rouge et éclate.
- **Pourquoi** : découper en 5 étapes déclenchées par l'utilisateur lui laisse le temps de comprendre chacune. La double dépense est l'attaque qui a motivé l'invention de Bitcoin [S1].
- **Limite** : la signature numérique est mentionnée mais pas montrée en détail ; l'attaque des 51 % est expliquée en texte.

---

## 4. Accessibilité et performance

| Point | Ce que nous avons fait |
|---|---|
| Couleurs | Toujours doublées par un texte ou un symbole (✓ / ✗, « COPIE REJETÉE ») pour les personnes daltoniennes. |
| Clavier | Toutes les actions de la 3D existent aussi en boutons dans le panneau (choix d'un bloc, d'un ordinateur…). Flèches ← → pour changer d'étape, Échap pour fermer une définition. |
| Lecteurs d'écran | Zones de résultats en `aria-live`, état des missions annoncé (« fait » / « à faire »), libellés sur les boutons sans texte. |
| Mouvement | Les animations sont désactivées si le système demande de réduire les mouvements (`prefers-reduced-motion`). |
| Lisibilité | Panneau compact sur petits écrans, mise en page adaptée au téléphone (panneau sous la scène). |
| Performance (≥ 30 FPS) | Formes simples, aucune texture lourde, aucun modèle 3D externe. Compteur de FPS affiché en permanence. Si l'ordinateur passe sous 30 images/s pendant 3 secondes, le halo lumineux se coupe et la résolution baisse automatiquement (« mode économie »). Mesure sur poste de TP : voir `docs/TESTS-UTILISATEURS.md`. |

## 5. Tests utilisateurs

Protocole, observations et corrections : voir [`TESTS-UTILISATEURS.md`](TESTS-UTILISATEURS.md).

## 6. Limites assumées de la modélisation

- **Une transaction par bloc** (au lieu de centaines) pour que chaque bloc reste lisible.
- **4 nœuds** au lieu de milliers : la « majorité » est montrée comme une comparaison de copies ; en réalité, c'est la chaîne qui contient le plus de travail qui l'emporte (expliqué à l'étape 5).
- **La course de l'étape 5 et les manches PoW/PoS sont simulées** (vitesses et tirages fixés pour la lisibilité). En revanche, les empreintes et le minage du bloc 10 utilisent un vrai SHA-256.
- **La signature numérique** est nommée et expliquée en une phrase, mais pas modélisée (clés publiques/privées hors périmètre).
- **Le PoS** est simplifié en un tirage pondéré par la caution ; Ethereum utilise des comités de validateurs et des attestations.
- **Les jetons** sont une monnaie fictive (« 1 jeton = 1 € ») : on garde le vrai vocabulaire mais on le rend concret.

## 7. Usage de l'IA

| Date | Outil | Usage | Vérification |
|---|---|---|---|
| 13/10/2026 | Claude | Aide à la rédaction des fiches de recherche à partir des sources citées | Sources ouvertes et relues, contenu reformulé et compris |
| 04/11/2026 | Claude | Aide au développement de la scène Three.js et à la rédaction du storyboard et des choix de représentation | Code relu et testé par l'équipe ; chaque choix discuté et validé |
| 12/11/2026 | Claude | Missions par étape, glossaire cliquable, cartes de chapitre, scanner, corrections de cohérence, fiches de suivi a posteriori, protocole de tests | Parcours testé ; textes relus ; chaque membre doit pouvoir expliquer `story.js` étape par étape |
