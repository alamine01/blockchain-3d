# Relecture #37 — textes corrigés

Périmètre : **textes seulement** (`src/story.js`, `src/glossary.js`). Aucune modification de l'interface ni du fonctionnement.
Les balises HTML (`<strong>`, `<p class="aside">`…) et les expressions `${...}` sont conservées telles quelles : il suffit de remplacer le texte autour.
Un commit par chapitre : `texte: relecture étape N (#37)`.

## 0. Règles appliquées partout

| Règle | Pourquoi (test utilisateur) |
|---|---|
| Un seul mot pour l'avancement : **étape** (« Prologue » et « Épilogue » pour les deux extrémités) | « chapitre / étape / notion » se mélangeaient |
| **Paiement** partout (jamais « opération » ni « transaction », sauf dans le glossaire : « on dit aussi transaction ») | Testeuse 1 ne faisait pas le lien |
| Tout mot technique est défini **avant** son premier emploi (empreinte, sceau, miner, nœud, validateur, caution) | termes obscurs |
| Plafonds : histoire ≤ 50 mots (hors prologue), mission = 1 phrase, « À retenir » = 1 à 2 phrases, message d'interaction ≤ 25 mots | « très lourd », « baillé à cause du texte » |
| Jamais de couleur seule dans une consigne (« verte » → « ✓ valide ») | accessibilité |

## 1. Textes hors `story.js` à aligner (autres fichiers, à toi de décider)

| Fichier | Texte actuel | Proposition |
|---|---|---|
| `index.html` (ligne « meta-line ») | « 9 étapes · environ 15 minutes… » | « Prologue, 7 étapes, épilogue · environ 15 minutes… » |
| `src/main.js` (compteur) | « Étape 0 / 8 » … « Étape 8 / 8 » | « Prologue » · « Étape 1 / 7 » … « Étape 7 / 7 » · « Épilogue » |
| `src/main.js` (carte de chapitre) | « Chapitre 3 » | « Étape 3 » |

Les renvois « étape 5 » du texte (minage) restent valides avec cette numérotation.

---

## Étape 0 — Le dossier

**Mission**
```
Lire le dossier, puis passer à l'étape 1
```

**story**
```html
<p>Émile, 82 ans, est mort le mois dernier. Il gérait l'argent de la famille dans un <strong>registre partagé</strong> : une blockchain. Chacun de ses quatre petits-enfants en garde une copie sur son ordinateur.</p>
<p class="aside">💰 Dans ce registre, l'argent se compte en <strong>jetons</strong>. Pour simplifier : <strong>1 jeton = 1 euro</strong>.</p>
<p>Chez le notaire, <strong>Léa</strong> affirme qu'Émile lui a donné <strong>50 000 jetons</strong> juste avant sa mort, et sa copie du registre semble le prouver. Si c'est vrai, elle hérite de presque tout. Marc, Sofia et Karim jurent que c'est faux.</p>
<p>Vous êtes l'enquêteur. Chaque étape vous apprend une règle de la blockchain, qui devient une <strong>preuve</strong> épinglée sur le mur.</p>
```

**retenir**
```html
Une blockchain est un registre de comptes que <strong>plusieurs personnes gardent en même temps</strong> : il n'existe pas d'« original ».
```

Changements : 149 → ~105 mots ; « le bitcoin est un exemple célèbre » retiré (déjà dans le glossaire) ; « chapitre 1 » → « étape 1 ».

---

## Étape 1 — La pièce à conviction

**Missions**
```
open   : Ouvrir un bloc et lire ce qu'il contient
parent : Ouvrir deux blocs voisins : l'« empreinte du bloc précédent » du second est-elle identique à l'« empreinte » du premier ?
```

**story**
```html
<p>Le notaire vous confie la copie de <strong>Marc</strong>. Le registre est découpé en <strong>blocs</strong>, comme les pages d'un cahier. Chaque bloc contient des <strong>paiements</strong> et porte une <strong>empreinte</strong> : un code unique calculé à partir de son contenu.</p>
<p>Cliquez sur un cube pour l'ouvrir.</p>
```

**retenir**
```html
Un bloc contient quatre choses : <strong>des paiements</strong>, <strong>sa propre empreinte</strong>, <strong>l'empreinte du bloc précédent</strong> et un <strong>nonce</strong> (un nombre trouvé par le minage, expliqué à l'étape 5).
```

**Textes dans `select(i)`** (remplacer seulement les phrases)
```
Nonce : note →  nombre trouvé en « minant » (étape 5)
Empreinte : note →  calculée à partir de tout le contenu du bloc. Elle commence par ${DIFFICULTY} zéros : c'est le « sceau » du bloc, la preuve qu'il a été validé par minage.
Empreinte du bloc précédent : prevNote (genèse) →  Premier bloc (« genèse ») : il n'a pas de bloc précédent, on y met des zéros.
Empreinte du bloc précédent : prevNote (autres) → inchangé (« = l'empreinte du bloc ${i}. C'est ce qui accroche les blocs entre eux. »)
```

Changements : « empreinte » définie dès la première phrase ; « sceau » défini sur place ; mission « parent » rendue non ambiguë (« la même que quoi ? »).

---

## Étape 2 — Le labo des empreintes

**Missions**
```
edit   : Changer une seule lettre ou un chiffre dans les données
remine : Cliquer sur « Re-miner ce bloc » : le lien avec le bloc suivant est-il réparé ?
```

**story**
```html
<p>Un expert vous montre comment fonctionne une <strong>empreinte</strong>. Voici trois blocs d'essai.</p>
<p>Changez une seule lettre dans les données d'un bloc et regardez ce qui arrive à son empreinte et au lien avec le bloc suivant. « Re-miner » un bloc, c'est refaire son sceau (détaillé à l'étape 5).</p>
```

**retenir**
```html
<strong>La moindre modification change complètement l'empreinte.</strong> Le bloc suivant, qui avait noté l'ancienne empreinte, ne reconnaît plus ce bloc : le lien est cassé.
```

**Textes dans l'étape**
```
labDiff (sceau brisé) :  ${diff} caractères sur 64 ont changé. Elle ne commence plus par 000 : le sceau est brisé.   (déjà correct, à garder)
labOut (cur < 2 …)    :  Le bloc ${cur + 1} a de nouveau un sceau valide (nonce ${chain[cur].nonce}). Mais le bloc ${cur + 2} garde l'ancienne empreinte : <strong>le lien reste cassé</strong>. Il faudrait re-miner tous les blocs suivants.   (déjà correct, à garder)
```

Changements : définition de « re-miner » avant le bouton ; « à retenir » raccourci.

---

## Étape 3 — La scène du crime

**Missions**
```
find    : Trouver le bloc falsifié et l'ouvrir
restore : Remettre la version d'origine du bloc : la chaîne redevient-elle valide (✓) ?
```

**story**
```html
<p>Voici la copie de <strong>Léa</strong>, celle qui « prouve » les 50 000 jetons. Le scanner de l'enquêteur la vérifie bloc par bloc. Où la chaîne se casse-t-elle, et pourquoi ?</p>
<p>Ensuite, modifiez un bloc vous-même, puis remettez la version d'origine.</p>
```

**retenir**
```html
Modifier un ancien bloc change son empreinte : le bloc suivant ne le reconnaît plus, puis le suivant… <strong>Tous les blocs après lui deviennent invalides, comme des dominos.</strong> La falsification se voit tout de suite.
```

Changements : « verte » → « valide (✓) » ; « dominos » rendu explicite.

---

## Étape 4 — Les témoins

**Missions**
```
compare : Comparer les 4 copies du registre
gossip  : Diffuser un paiement et le suivre de nœud en nœud
```

**story**
```html
<p>Léa répond : « Ma copie est celle d'Émile ! » Mais il n'existe <strong>aucun registre central</strong> : chaque petit-enfant est un <strong>nœud</strong> du réseau, c'est-à-dire un ordinateur qui garde sa propre copie.</p>
<p>Cliquez sur un ordinateur pour lire son bloc 7, puis comparez les quatre copies.</p>
```

**retenir**
```html
<strong>Pas de serveur central</strong> : chaque nœud garde une copie complète, vérifie tout lui-même et passe les paiements à ses voisins. Une copie <strong>différente des autres et dont la chaîne est cassée</strong> est rejetée.
```

**Textes dans l'étape**
```
Bouton gossip : Diffuser un nouveau paiement
verdict (compare) : <strong>${same.length} copies sur 4</strong> disent « ${esc(ref)} ». Celle de Léa est la seule différente <em>et</em> sa chaîne est cassée : les autres nœuds la <strong>rejettent</strong>.
gossip 1 : Sofia crée le paiement « Sofia → Karim : 15 jetons » et l'envoie à ses voisins.
gossip 2 : Marc et Karim le vérifient, puis le relaient à leurs voisins.
gossip 3 : En quelques instants, <strong>tous les nœuds</strong> le connaissent, sans serveur central.
```

Changements : « nœud » défini sur place ; le critère de rejet est maintenant « différente **et** invalide » (et non la seule majorité) ; « opération » → « paiement ».

---

## Étape 5 — L'alibi de Léa

**Missions**
```
mine : Miner le bloc 10 (essayez aussi avec 4 zéros)
race : Lancer la course entre Léa et le réseau
```

**story**
```html
<p>Léa se défend : « Il me suffit de recalculer mes blocs pour que ma copie redevienne valide ! » Recalculer un bloc, c'est le <strong>miner</strong> : essayer des nombres, les <strong>nonces</strong>, jusqu'à obtenir une empreinte qui commence par plusieurs zéros.</p>
<p>Minez le bloc 10 vous-même, puis lancez la course entre Léa et le réseau.</p>
```

**retenir**
```html
Miner demande <strong>beaucoup d'essais</strong>, mais vérifier le résultat est <strong>instantané</strong>. Seule contre tout le réseau, Léa ne peut pas aller assez vite.
```

**Textes dans l'étape**
```
Légende difficulté :  Difficulté : nombre de zéros exigés au début de l'empreinte (un zéro de plus = environ 16 fois plus d'essais)
mineOut 1 :  ✓ Trouvé après <strong>${(block.nonce + 1).toLocaleString('fr-FR')} essais</strong> (${...} s).   (inchangé)
mineOut 2 :  Pour vérifier, les autres nœuds n'ont besoin que d'<strong>un seul calcul</strong> : ils recalculent l'empreinte avec le nonce ${block.nonce} et constatent qu'elle commence par ${p}.
Intro course :  Léa doit re-miner les blocs 7, 8 et 9, seule avec <strong>1 ordinateur</strong>. Pendant ce temps, Marc, Sofia et Karim (<strong>3 ordinateurs</strong>) continuent d'ajouter des blocs. <em>Course simulée : les vitesses sont fixées pour l'exemple.</em>
Verdict course :  Léa a fini de re-miner ses 3 blocs, mais le réseau en a ajouté ${netCount - 9} pendant ce temps. Sa chaîne (9 blocs) est <strong>plus courte</strong> que celle du réseau (${netCount} blocs) : les nœuds retiennent la chaîne la plus longue, celle qui a demandé le plus de travail. La copie de Léa est ignorée. <strong>Son alibi tombe.</strong>
```

Changements : « ×16 » sorti du « à retenir » et expliqué en légende (« environ ») ; mention honnête que la course est une simulation ; « le plus de travail » expliqué par « la plus longue ».

---

## Étape 6 — Le procès

**Missions**
```
pow   : Lancer une manche en preuve de travail
pos   : Passer en preuve d'enjeu et tirer un validateur au sort
slash : Voir ce que Léa perd si elle triche en preuve d'enjeu
```

**story**
```html
<p>L'avocat de Léa attaque : « Qui a décidé que la chaîne des autres était la bonne ? » Réponse : une <strong>règle commune</strong>, le <strong>consensus</strong>, qui désigne qui ajoute le prochain bloc.</p>
<p>Toutes les blockchains n'ont pas choisi la même règle, chacune a ses avantages et ses limites. Comparez les deux plus connues, et lancez quelques manches.</p>
```

**retenir**
```html
<strong>Preuve de travail (PoW)</strong> : le premier qui trouve le nonce écrit le bloc (sûr, mais très gourmand en énergie). <strong>Preuve d'enjeu (PoS)</strong> : un validateur est tiré au sort selon sa caution, qu'il perd s'il triche (économe, mais cela favorise les plus riches).
```

**Textes dans l'étape**
```
PoW intro :  Les 4 ordinateurs cherchent le nonce en même temps. Le premier qui le trouve écrit le bloc.
PoW (Léa gagne) :  <strong>Léa</strong> a trouvé le nonce la première, mais son bloc s'appuie sur sa copie falsifiée : les trois autres nœuds le <strong>refusent</strong>.   (inchangé)
PoW (un autre gagne) :  <strong>${winner}</strong> a trouvé le nonce le premier : son bloc est ajouté par tous les nœuds honnêtes. Le calcul des 3 autres a été dépensé pour rien.
PoS intro :  Chacun a déposé une <strong>caution</strong> (les pièces dorées), en plus du reste de ses jetons. Plus elle est grosse, plus on a de chances d'être tiré au sort comme <strong>validateur</strong> : celui qui écrit le bloc.
PoS (tirage) :  <strong>${pick}</strong> (caution : ${stakes[pick]} jetons) est tiré au sort. Les autres vérifient son bloc et l'acceptent. Presque aucune énergie dépensée.
PoS (fraude) :  <strong>Léa</strong> propose un bloc frauduleux. Les autres validateurs le refusent et <strong>confisquent 20 de ses 25 jetons de caution</strong>. Tricher lui coûte cher.
```

Changements : faute « avantage ceux qui possèdent le plus » → « favorise les plus riches » ; phrase de liaison pour répondre à « pourquoi deux méthodes ? » ; « validateur » et « caution » définis ; précision que la caution est à part des 440 jetons de Léa (étape 7).

---

## Étape 7 — La reconstitution

**Missions**
```
life   : Rejouer les 5 étapes du vrai paiement d'Émile
double : Rejouer la double dépense de Léa et voir comment le réseau la bloque
```

**story**
```html
<p>L'ordinateur d'Émile, au centre, a gardé son dernier paiement, <strong>signé</strong> de sa main numérique. Vous le rejouez étape par étape, à l'époque où les copies n'avaient encore que 6 blocs.</p>
<p>Puis vous rejouez une autre ruse de Léa : dépenser deux fois les mêmes jetons.</p>
```

**retenir**
```html
Un paiement est <strong>créé</strong>, <strong>propagé</strong>, <strong>vérifié</strong>, <strong>inclus</strong> dans un bloc, puis <strong>confirmé</strong> par les blocs suivants. Une <strong>double dépense</strong> est refusée : les jetons sont déjà marqués comme dépensés.
```

**Textes dans l'étape**
```
Création :  <strong>Création</strong> : Émile écrit « Émile → Léa : 500 jetons » et le <strong>signe</strong> avec sa clé secrète. Seul lui peut le faire.
Propagation :  <strong>Propagation</strong> : le paiement part de l'ordinateur d'Émile vers les 4 nœuds.
Validation :  <strong>${n}</strong> vérifie : signature correcte, et Émile possède bien 500 jetons ✓
Inclusion :  <strong>Inclusion</strong> : Karim trouve le nonce le premier et place le paiement dans le <strong>bloc 7</strong>, que tous ajoutent à leur copie.
Confirmations :  Bloc ${j + 1} ajouté par-dessus : <strong>${j - 5} confirmation…</strong>   (inchangé, cohérent avec le nouveau glossaire)
Conclusion :  Plus il y a de blocs au-dessus du bloc 7, plus il est difficile à modifier. Le vrai montant était donc bien <strong>500 jetons</strong>, pas 50 000.
```

**Paragraphe « La double dépense » (dans le HTML de l'étape)**
```html
<p>Léa possède 440 jetons (500 reçus d'Émile, 60 donnés à Sofia). Elle envoie <strong>les mêmes 440 jetons deux fois</strong>, au même moment : une fois à Marc, une fois à Karim.</p>
```

**Messages de la double dépense**
```
1 :  Léa envoie le paiement <strong>A</strong> « ${A} » aux nœuds Marc et Sofia, et le paiement <strong>B</strong> « ${B} » à Karim.
2 :  Sofia mine le <strong>bloc 10</strong> avec le paiement A. Tous les nœuds l'ajoutent.
3 :  Karim relaie le paiement B. Chaque nœud vérifie : les 440 jetons de Léa sont <strong>déjà dépensés dans le bloc 10</strong>. B est <strong>refusé partout</strong>.
4 :  Limite : si Léa contrôlait plus de la moitié de la puissance de calcul du réseau (« attaque des 51 % »), elle pourrait réécrire les blocs récents. C'est pourquoi on attend plusieurs confirmations.
```

Changements : l'incohérence « Marc et Karim » (texte) / Marc, Sofia et Karim (animation) est levée ; « 6 blocs » expliqué ; « 51 % » désormais au glossaire.

---

## Étape 8 — Le verdict (épilogue)

**story** : inchangé.
```html
<p>Vous avez toutes les preuves. Qui a falsifié le registre d'Émile ?</p>
<p>Cliquez sur l'ordinateur du coupable, ou choisissez son nom.</p>
```

**retenir**
```html
Une blockchain ne se réécrit pas : <strong>on lui ajoute des blocs</strong>. Grâce aux empreintes, aux copies partagées et au consensus, <strong>personne ne peut tricher seul sans que ça se voie</strong>, et on n'a pas besoin de faire confiance à un banquier ou à un notaire.
```

**Récapitulatif (liste `recap`)**
```html
<li><strong>Un bloc</strong> contient des paiements, son empreinte, celle du bloc précédent et un nonce.</li>
<li><strong>L'empreinte</strong> change complètement à la moindre modification, et chaque bloc recopie celle du précédent.</li>
<li><strong>Falsifier</strong> le bloc 7 a brisé son sceau et tous les blocs suivants : on le voit tout de suite.</li>
<li><strong>Le réseau</strong> : chaque nœud a sa copie ; celle de Léa était la seule différente, donc rejetée.</li>
<li><strong>Le minage</strong> : refaire ses blocs seule était trop lent face au réseau.</li>
<li><strong>Le consensus</strong> : en PoW tricher coûte de l'énergie, en PoS cela coûte sa caution.</li>
<li><strong>Un paiement</strong> est créé, propagé, vérifié, inclus puis confirmé ; la double dépense est refusée.</li>
```

Autres textes : « Affaire résolue… » et « Non. La copie de ${n}… » inchangés.

Changements : « ne se modifie jamais » (contredisait le glossaire et l'attaque à 51 %) → « ne se réécrit pas » ; phrase de confiance rendue non ambiguë.

---

## `src/glossary.js` — nouvelles définitions

Entrées modifiées ou ajoutées (les autres restent telles quelles). Ordre conseillé : celui ci-dessous.

| Terme | `match` | Définition |
|---|---|---|
| Blockchain | `['blockchain']` | Registre de comptes copié chez tous les participants. Ses pages, les blocs, sont accrochées entre elles par des empreintes. |
| **Registre** *(nouveau)* | `['registre']` | Cahier de comptes où l'on note qui a payé quoi. Dans une blockchain, tout le monde en garde la même copie. |
| Jeton | `['jetons', 'jeton']` | Unité de monnaie numérique qui n'existe que dans le registre, comme le bitcoin. Dans l'enquête, 1 jeton = 1 euro. |
| **Paiement** *(nouveau)* | `['paiements', 'paiement', 'transactions', 'transaction']` | Une ligne du registre : « qui donne combien à qui ». On dit aussi « transaction ». |
| Bloc | `['blocs', 'bloc']` | Une page du registre : des paiements, son empreinte, l'empreinte du bloc précédent et un nonce. |
| Empreinte (hash) | `['empreintes', 'empreinte', 'hash']` | Code de 64 caractères calculé à partir du contenu d'un bloc (ici avec SHA-256, comme Bitcoin). Une seule lettre change, et toute l'empreinte change. En pratique, on ne peut pas retrouver le contenu à partir de l'empreinte. |
| **Sceau** *(nouveau)* | `['sceau', 'sceaux']` | Preuve qu'un bloc a bien été miné : son empreinte commence par le bon nombre de zéros. Si le bloc est modifié, le sceau se brise. |
| Nonce | `['nonce']` | Nombre que l'on change à chaque essai de minage, jusqu'à obtenir une empreinte qui respecte la difficulté. |
| Minage | `['miner', 'minage', 'mine']` | Recherche, par essais successifs, d'un nonce qui donne une empreinte commençant par plusieurs zéros. |
| Difficulté | `['difficulté']` | Nombre de zéros exigés au début de l'empreinte. Chaque zéro de plus demande en moyenne 16 fois plus d'essais. |
| Nœud | `['nœuds', 'nœud']` | Un ordinateur du réseau. Il garde une copie complète de la chaîne et vérifie lui-même chaque paiement. |
| **Validateur** *(nouveau)* | `['validateurs', 'validateur']` | En preuve d'enjeu, le nœud tiré au sort pour écrire le prochain bloc. |
| **Caution** *(nouveau)* | `['cautions', 'caution']` | Jetons mis de côté par un validateur comme garantie. Il les perd s'il triche. |
| Signature | `['signe', 'signé', 'signature', 'clé secrète']` | Preuve numérique que seul le propriétaire des jetons a pu créer le paiement, grâce à sa clé secrète. Les autres nœuds la vérifient sans connaître cette clé. |
| Confirmation | `['confirmations', 'confirmation', 'confirmée']` | Le bloc qui contient un paiement compte pour 1 ; chaque bloc ajouté ensuite en ajoute 1. Plus il y en a, plus le paiement est sûr. |
| Double dépense | `['double dépense']` | Tentative de dépenser deux fois les mêmes jetons. Le réseau refuse le second paiement. |
| **Attaque des 51 %** *(nouveau)* | `['attaque des 51 %']` | Un tricheur qui contrôlerait plus de la moitié de la puissance de calcul du réseau pourrait réécrire les derniers blocs. C'est pourquoi on attend plusieurs confirmations. |

Entrées non listées (Genèse, Immutabilité, Consensus, PoW, PoS) : seule la formule « beaucoup d'énergie dépensée » devient « gourmand en énergie » pour la PoW ; le reste est conservé.

**À vérifier au moment de l'intégration**
- Pour « attaque des 51 % » : l'espace du texte dans `story.js` et celui du `match` doivent être le même caractère (espace normale ou insécable).
- Le mot « mine » (minage) peut aussi s'afficher comme lien sur la phrase « la mine » : à relire sur le site.
- Après avoir remplacé « opération » par « paiement » : relancer une recherche « opération » sur `story.js` et `glossary.js`.
