# Fiche de révision — expliquer notre code à l'oral

> À réviser avant le 19/11. Objectif : savoir dire, pour chaque fichier, **ce
> qu'il fait** et **la phrase à sortir** si le jury pointe dessus. Tu n'as pas à
> réciter les maths. Tu dois tenir la logique — et la logique, elle est à toi.

## La phrase d'ouverture, si on t'interroge sur le code

> « On a séparé le modèle de la mise en scène. `sha256.js` et `chain.js`
> contiennent la vraie blockchain, vérifiable sans la 3D. `engine.js`, `story.js`
> et `main.js` sont la mise en scène autour. L'IA a tapé le code sous notre
> direction — c'est déclaré partout — mais on peut expliquer n'importe quel
> fichier. »

Dis-le une fois, calmement, au début. Ça désamorce la question « est-ce vous qui
avez écrit ça ».

## Le modèle mental en une phrase

Une blockchain, c'est un **cahier que tout le monde copie**. Chaque page (un
**bloc**) porte un **sceau** (son empreinte) calculé à partir de son contenu, et
**recopie le sceau de la page précédente**. Changer une vieille page change son
sceau, donc le lien avec la suivante casse — et ça se voit chez tout le monde.

---

## 1. `sha256.js` — la machine à empreintes

**Ce que ça fait** : une fonction, `sha256(texte)`, qui prend n'importe quel
texte et rend un code de **64 caractères**. Le même texte donne toujours le même
code ; un caractère change, et tout le code change.

**La phrase à dire** :
> « On n'a pas inventé SHA-256 : c'est l'algorithme standard, celui de Bitcoin.
> On l'a réécrit nous-mêmes et vérifié contre celui de Node.js. Ce qui compte,
> c'est sa propriété : imprévisible, et un caractère change tout. »

**Si on insiste sur les maths** (peu probable) :
> « C'est une suite d'opérations sur les bits — des décalages et des XOR, répétés
> 64 fois. On ne connaît pas la valeur de chaque constante par cœur, ce sont
> celles de la norme. L'important est le comportement, pas les constantes. »

Le seul détail que tu peux montrer — pourquoi c'est **synchrone** :
```js
// SHA-256 synchrone (la même fonction de hachage que Bitcoin).
// Synchrone pour pouvoir miner image par image sans attendre de promesse.
```
> « On l'a fait synchrone exprès : pendant le minage, on calcule des milliers
> d'empreintes par image, sans attendre. »

---

## 2. `chain.js` — la blockchain (64 lignes, le fichier clé)

C'est **le** fichier à connaître. Il tient en quatre idées.

### a) Un bloc = quatre champs
```js
export const content = (b) => `${b.index}|${b.data}|${b.prev}|${b.nonce}`;
export const computeHash = (b) => sha256(content(b));
```
> « Un bloc, c'est son numéro, ses données, l'empreinte du bloc précédent
> (`prev`), et un nonce. L'empreinte se calcule sur **tout** ça collé ensemble. »

### b) Miner = chercher un nonce
```js
export function mineSync(block, d = DIFFICULTY) {
  const p = prefix(d);           // "000" si difficulté = 3
  block.nonce = 0;
  for (;;) {
    const h = computeHash(block);
    if (h.startsWith(p)) { block.hash = h; return block; } // trouvé
    block.nonce++;               // sinon on réessaie
  }
}
```
> « Miner, ce n'est pas calculer intelligemment : on essaie des nonces 0, 1, 2…
> jusqu'à tomber sur une empreinte qui commence par trois zéros. Un zéro de plus,
> c'est seize fois plus d'essais. »

### c) Modifier un vieux bloc casse le lien
```js
export function setData(block, data) {
  block.data = data;
  block.hash = computeHash(block);   // l'empreinte change tout de suite…
  // …mais le nonce ne change pas, donc elle ne respecte plus la difficulté,
  // et le bloc suivant garde encore l'ancienne empreinte dans son "prev".
}
```
> « Dès qu'on touche aux données, l'empreinte change. Le bloc d'après pointe
> toujours vers l'ancienne : le lien est rompu. C'est la falsification du
> chapitre 3. »

### d) Vérifier = remonter toute la chaîne
```js
export function chainStatus(chain, d = DIFFICULTY) {
  let broken = false;
  return chain.map((b, i) => {
    const hash = computeHash(b);
    const sealOk = hash === b.hash && hash.startsWith(prefix(d)); // sceau bon ?
    const linkOk = i === 0 || b.prev === chain[i - 1].hash;       // pointe bien ?
    const valid = !broken && sealOk && linkOk;
    if (!valid) broken = true;   // une fois cassé, tout ce qui suit est cassé
    return { sealOk, linkOk, valid, hash };
  });
}
```
> « Un bloc est valide si son sceau est bon, s'il pointe vers le bon parent, **et
> si tout ce qui le précède est valide**. La variable `broken` fait l'effet
> domino : dès qu'un bloc casse, tous les suivants tombent. »

---

## 3. `engine.js` — le moteur 3D (la mise en scène)

**Ce que ça fait** : installe la scène Three.js (caméra, lumière), détecte les
clics sur les objets, et fait tourner la boucle d'animation image par image.

**La phrase à dire** :
> « C'est la couche d'affichage. Elle ne connaît rien à la blockchain : elle sait
> juste afficher des objets 3D, détecter sur quoi on clique, et animer. »

Deux choses à savoir montrer :

- **`addClickable(objet, fonction)`** : rend un objet cliquable **et** pose la
  pastille ambrée au-dessus. *« C'est né d'un test utilisateur : personne ne
  devinait que la scène était cliquable. »*
- **La qualité adaptative** : si on descend sous 30 images/seconde, le halo
  lumineux se coupe et la résolution baisse. *« Pour tenir les 30 FPS même sur
  une machine modeste. »*

---

## 4. `story.js` — les 9 chapitres (le scénario)

**Ce que ça fait** : un grand tableau `steps`, **un objet par chapitre**. Chaque
chapitre décrit son titre, sa notion, son texte, ses missions, et une fonction
`enter()` qui construit sa scène 3D.
```js
export const steps = [
  { id: 'dossier',  title: 'Le dossier',            tag: 'Introduction', … },
  { id: 'piece',    title: 'La pièce à conviction', tag: 'Notion 1 · Structure d’un bloc', … },
  { id: 'labo',     title: 'Le labo des empreintes',tag: 'Notion 2 · Chaînage cryptographique', … },
  // … jusqu'au chapitre 8, « Le verdict »
];
```
**La phrase à dire** :
> « Tout le scénario est ici : une entrée par chapitre, avec son texte, ses
> missions et la fonction qui monte la scène. Pour ajouter un chapitre, on ajoute
> un objet dans ce tableau. »

C'est le fichier à ouvrir si le jury demande « montrez-moi comment une notion est
reliée à une scène » : chaque `tag` nomme la notion du sujet.

---

## 5. `main.js` — le chef d'orchestre

**Ce que ça fait** : démarre tout, gère la navigation entre chapitres (`go(i)`),
affiche les missions à droite, coche celles qui sont faites, et débloque le
bouton « Suivant ».

**La phrase à dire** :
> « C'est le point d'entrée : il crée le moteur, charge le chapitre demandé dans
> l'URL, et gère le passage d'un chapitre à l'autre. »

La fonction centrale est `go(i)` : elle quitte le chapitre courant, monte le
suivant, et remet à jour le panneau de droite.

---

## Les 5 questions probables du jury

**« Est-ce vous qui avez écrit ce code ? »**
> « L'IA a tapé la majorité des commits, sous notre direction, et c'est déclaré
> dans le README et les fiches. Ce qu'on a décidé nous-mêmes : le fil rouge, les
> choix de modélisation, les textes, les tests. Et on peut expliquer chaque
> fichier — demandez-nous lequel. »

**« Votre blockchain est-elle réelle ou simulée ? »**
> « Le hachage SHA-256 et le minage par preuve de travail sont de vrais calculs,
> faits dans le navigateur. Ce qu'on simplifie, c'est l'échelle : un paiement par
> bloc, quatre nœuds. C'est écrit dans le document de choix de modélisation. »

**« Que se passe-t-il si on modifie un bloc du milieu ? »**
> « Son empreinte est recalculée et ne correspond plus à ce que le bloc suivant a
> enregistré : le lien casse à cet endroit, et tous les blocs d'après deviennent
> invalides. C'est la fonction `chainStatus`, et c'est la démo du chapitre 3. »

**« Pourquoi le minage coûte-t-il quelque chose ? »**
> « Parce qu'il faut essayer énormément de nonces avant d'en trouver un qui donne
> une empreinte commençant par les zéros exigés. C'est la boucle de `mineSync`. »

**« Savez-vous expliquer cette ligne précise ? »**
> Si tu la connais, explique. Sinon : « Cette ligne fait partie de l'algorithme
> standard de SHA-256 ; ce qui m'importe, c'est ce que la fonction produit — une
> empreinte imprévisible de 64 caractères. » Puis ramène vers une ligne que tu
> maîtrises dans `chain.js`.

## Kit de survie — si tu bloques

1. **Reviens toujours à `chain.js`.** C'est 64 lignes, tu peux tout y expliquer.
2. **Ne fais jamais semblant de connaître une ligne de `sha256.js`.** Dis que
   c'est la norme, et reviens à ce que ça produit.
3. **Propose d'ouvrir le fichier sur l'écran.** Montrer vaut mieux que réciter.
4. **Si tu ne sais pas : « Je ne me souviens plus de ce détail, mais voici le
   principe… »** — l'honnêteté passe mieux qu'un bluff qui s'effondre.
