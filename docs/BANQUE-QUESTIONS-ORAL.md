# Banque de questions — oral R507 (20 min de questions, ~10 min chacun)

> Format de l'oral : **10 min de présentation, puis 20 min de questions**, environ
> 10 min par personne. Tu seras interrogé **seul**. Cette fiche couvre les
> questions les plus probables. Pour chacune : une **réponse courte, à dire avec
> tes mots**. Ne l'apprends pas par cœur — comprends l'idée, et reformule.
>
> Règle d'or : **réponse courte d'abord, puis un exemple du site.** Mieux vaut
> trois phrases justes qu'un long discours flou.

---

## A. Comprendre la blockchain (le plus probable)

**« C'est quoi une blockchain, en une phrase ? »**
> « Un registre de comptes que tout le monde copie. Il est fait de pages — les
> blocs — accrochées les unes aux autres par des empreintes. Personne ne peut
> modifier une vieille page sans que tout le monde le voie. »

**« C'est quoi un bloc ? »**
> « Une page du registre. Elle contient des opérations, une empreinte du bloc
> précédent, et un nonce. Dans notre code, c'est quatre champs : numéro, données,
> empreinte précédente, nonce. »

**« C'est quoi une empreinte, ou un "hash" ? »**
> « Un code de 64 caractères calculé à partir du contenu d'un bloc. Si on change
> un seul caractère du contenu, tout le code change. C'est ce qui rend la triche
> visible. On le montre sur la diapo des empreintes : 500 et 501 donnent deux
> codes qui n'ont presque rien en commun. »

**« Pourquoi une blockchain est-elle difficile à falsifier ? »**
> « Parce que chaque bloc contient l'empreinte du précédent. Si je modifie un
> vieux bloc, son empreinte change, et le bloc suivant pointe toujours vers
> l'ancienne : le lien casse. Et comme tout le monde a une copie, la fraude se
> voit immédiatement. »

**« C'est quoi le minage ? »**
> « Chercher un nonce — un nombre — qui donne une empreinte commençant par un
> certain nombre de zéros. Chez nous, trois zéros. La seule méthode, c'est
> d'essayer les nombres un par un. C'est long à trouver, mais instantané à
> vérifier. »

**« Pourquoi le minage coûte-t-il de l'énergie ? »**
> « Parce qu'il faut essayer énormément de nombres avant d'en trouver un qui
> marche. Chaque zéro exigé en plus multiplie le travail par seize. C'est ce
> coût qui rend la triche non rentable. »

**« C'est quoi un nœud ? »**
> « Un ordinateur du réseau. Il garde une copie complète de la chaîne et vérifie
> lui-même chaque bloc. Il n'y a pas de serveur central. »

**« C'est quoi le consensus ? »**
> « La règle commune qui permet aux nœuds de se mettre d'accord sur le prochain
> bloc sans chef. En preuve de travail, on retient la chaîne qui représente le
> plus de travail cumulé. »

**« Preuve de travail contre preuve d'enjeu, la différence ? »**
> « En preuve de travail, le droit d'écrire un bloc se gagne par le calcul — c'est
> Bitcoin. En preuve d'enjeu, un validateur est tiré au sort selon une caution
> qu'il perd s'il triche — c'est Ethereum. La première est très sûre mais coûte
> de l'énergie ; la seconde est économe. On montre les deux au chapitre 6. »

**« C'est quoi une double dépense ? »**
> « Essayer de dépenser deux fois les mêmes jetons. Le réseau détecte la seconde
> opération et la refuse. C'est l'attaque qu'on met en scène au chapitre 7. »

---

## B. Le code (révise aussi la fiche FICHE-REVISION-CODE.md)

**« Est-ce vous qui avez écrit ce code ? »**
> « L'IA a tapé la majorité des commits, sous notre direction, et c'est déclaré
> dans le README et les fiches. Ce qu'on a décidé nous-mêmes : le fil rouge, les
> choix, les textes, les tests. Et on sait expliquer chaque fichier. »

**« Montrez-nous un fichier et expliquez-le. »**
> Demande `chain.js` si tu peux choisir — c'est 64 lignes et tu le connais.
> « `chain.js`, c'est toute notre blockchain : un bloc = quatre champs ;
> `computeHash` calcule l'empreinte ; `mineSync` cherche le nonce ; `chainStatus`
> vérifie toute la chaîne et casse en domino dès qu'un bloc est faux. »

**« Que fait chaque fichier ? »**
> « `sha256.js` : la fonction d'empreinte. `chain.js` : le modèle blockchain.
> `engine.js` : la scène 3D et les clics. `story.js` : les 9 chapitres, un objet
> chacun. `main.js` : le chef d'orchestre qui enchaîne les chapitres. »

**« Votre blockchain est-elle réelle ou simulée ? »**
> « Le hachage SHA-256 et le minage sont de vrais calculs, dans le navigateur. Ce
> qu'on simplifie, c'est l'échelle : un paiement par bloc, quatre nœuds. C'est
> écrit dans le document de choix de modélisation. »

**« Expliquez cette ligne précise. »**
> Si tu la connais, explique. Sinon : « Cette ligne fait partie de l'algorithme
> standard de SHA-256 ; ce qui compte, c'est ce que la fonction produit — une
> empreinte imprévisible de 64 caractères. » Puis ramène vers `chain.js`.

---

## C. Les choix de modélisation (affiche la diapo "limites")

**« Pourquoi quatre nœuds seulement ? »**
> « Pour la lisibilité. Avec quatre participants, on voit chacun vérifier et
> relayer. Avec des milliers, on ne verrait rien. L'idée — se mettre d'accord
> sans chef — passe aussi bien avec quatre. »

**« Pourquoi un seul paiement par bloc ? »**
> « Pareil, la lisibilité. Un vrai bloc contient des centaines d'opérations ;
> nous en montrons une, pour qu'on suive ce qui se passe. »

**« Qu'est-ce que vous ne modélisez pas ? »**
> « La signature numérique : on l'explique mais on ne la code pas. Et la course
> entre mineurs est mise en scène, alors que le minage, lui, est un vrai calcul.
> Tout ça est assumé dans le document de choix. »

**« Pourquoi avoir choisi une enquête comme fil rouge ? »**
> « Parce que le problème des héritiers — se mettre d'accord sans autorité de
> confiance — est exactement le problème que résout la blockchain. On a écarté
> "Alice paie Bob", trop vu et passif, et la métaphore du village, où le visiteur
> reste spectateur. »

---

## D. Gestion de projet et usage de l'IA

**« Combien de l'IA dans ce projet ? »**
> « Elle a rédigé 30 de nos 37 commits, sous notre direction. L'onglet
> Contributors de GitHub le montre, on n'a pas maquillé l'historique. On l'a
> déclaré dans le README et dans chaque fiche. Ce qui vient de nous : les choix,
> les textes, les tests, et la vérification de chaque notion. »

**« Pourquoi quatre fiches hebdomadaires écrites après coup ? »**
> « Honnêtement, on a eu deux semaines creuses fin octobre et on n'a pas tenu le
> suivi au fil de l'eau. On a reconstitué les fiches à partir de l'historique du
> dépôt, et on l'a signalé par un bandeau sur chacune, plutôt que de faire croire
> qu'elles avaient été envoyées à temps. C'est notre principal point faible, et
> on l'assume. »

**« Comment le travail est-il réparti ? »**
> « J'ai porté la gestion de projet, le modèle blockchain, la scène 3D et la
> documentation. Hugo a fait la relecture des textes, le storyboard et les tests
> utilisateurs. »

**« À quoi sert votre board GitHub ? »**
> « À suivre les tâches : cinq colonnes imposées par le sujet, des issues liées
> aux commits, et sept milestones calées sur le calendrier, du cadrage à la
> soutenance. »

---

## E. Tests et UX

**« Comment avez-vous testé ? »**
> « Deux personnes extérieures ont parcouru le site le 15 novembre, sans aucune
> explication. Les deux ont terminé l'enquête seules et trouvé la coupable.
> Leur critique portait sur la forme : trop de texte. »

**« Qu'est-ce que les tests ont changé ? »**
> « On a allégé le panneau : avant, 450 caractères dès l'arrivée ; après, entre
> 140 et 217. Et on a ajouté un repère sur les objets cliquables, parce que
> personne ne devinait que la scène était cliquable. Chaque remarque est devenue
> une issue, corrigée le jour même. »

**« Vos testeurs ne sont-ils pas des proches ? »**
> « Si, ce sont des proches de Hugo — extérieurs à la formation, donc non
> initiés, mais pas indépendants. On l'écrit noir sur blanc dans le compte rendu,
> avec les autres limites : la grille par chapitre n'a pas été remplie pendant la
> séance, et on n'a pas relevé les images par seconde. »

---

## F. Questions pièges

**« En quoi votre projet est-il original ? »**
> « Le fil rouge : une enquête policière où chaque notion est un indice, et où le
> visiteur manipule au lieu de lire. La plupart des approches font payer Alice ;
> nous, on fait mener une enquête. »

**« Si c'était à refaire ? »**
> « Deux choses : tenir le suivi hebdomadaire au fil de l'eau, et tester dès le
> prototype. Les blocages de vocabulaire, on les aurait vus bien plus tôt. »

**« Qu'avez-vous appris ? »**
> « Que la difficulté n'était pas technique mais dans les mots. "Nonce", "nœud" :
> ce sont ces termes qui bloquaient les testeurs, pas les concepts. »

---

## Si tu ne sais pas répondre

1. **Ne bluffe pas.** « Je ne me souviens plus de ce détail, mais le principe,
   c'est… » passe mieux qu'une invention qui s'effondre à la question suivante.
2. **Ramène vers ce que tu maîtrises** : `chain.js`, l'affaire, les quatre idées
   de la blockchain.
3. **Propose de montrer** : « Je peux vous le montrer sur le site. » Montrer vaut
   mieux que réciter.
4. **Respire.** Tu as construit ce projet. Tu en sais plus que tu ne crois.
