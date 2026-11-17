# Plan de soutenance — 20 minutes

**Date** : 19 novembre 2026, 11h · **Support** : [`docs/soutenance/`](soutenance/) (en ligne : https://alamine01.github.io/blockchain-3d/docs/soutenance/)
**Répétition** : 19 novembre, 9h30.

> Le support intègre un **chrono de 20 minutes** (bouton en bas à droite). Lancez-le au début : il passe en rouge dès le dépassement.
> Raccourcis : `←` `→` ou Espace pour naviguer, `F` plein écran, `P` pour exporter en PDF.

## Minutage

| Temps | Diapo | Qui | Contenu |
|---|---|---|---|
| 0:00–1:30 | 1-2 | A | Accroche : raconter l'affaire **avant** de nommer le projet. Puis le problème : 7 notions abstraites, public non initié, sans explication orale. |
| 1:30–3:30 | 3-4 | B | Le parti pris (chaque notion = un indice) et pourquoi ce fil rouge. Les 9 chapitres et la correspondance avec les 7 notions. |
| 3:30–10:30 | 5 | A (manipule) + B (commente) | **Démonstration** (voir script ci-dessous). |
| 10:30–13:00 | 6-7 | B | Choix de modélisation défendus + limites assumées. |
| 13:00–14:00 | 8 | A | Comment on empêche le novice de décrocher (mots cliquables, missions, récapitulatif). |
| 14:00–15:30 | 9 | A | Gestion de projet GitHub : le retard assumé, et l'usage de l'IA assumé lui aussi. |
| 15:30–17:30 | 10-11 | B | Tests et performance, puis **ce que les tests ont changé** (avant/après du panneau). |
| 17:30–18:00 | 12-13 | A | Bilan, puis questions. |
| 18:00–20:00 | — | Les deux | Questions du jury. |

> Chaque membre doit pouvoir répondre sur **toutes** les parties : les rôles ci-dessus ne sont qu'une répartition de parole.

## Script de démonstration (7 min)

Ouvrir le site **avant** de commencer, sur l'écran-titre. Désactiver les extensions de navigateur qui recolorent les pages (elles cassent le code couleur vert/rouge/ambre).

0. **En arrivant au chapitre 1**, montrer du doigt les pastilles ambrées au-dessus des blocs. *« Ça, c'est né d'un test utilisateur : personne ne devinait que la scène était cliquable. »* Une phrase, pas plus — la diapo 11 y revient.
1. **Chapitre 1 — le bloc.** Cliquer sur le bloc 7. *« Voilà ce que contient une page du registre : les données, son empreinte, l'empreinte de la page précédente, et un nonce. »*
2. **Chapitre 2 — le chaînage.** Remplacer `500` par `501`. *« Un chiffre change, et 60 caractères sur 64 changent. Le bloc suivant ne reconnaît plus celui-ci. »* Cliquer sur « Re-miner » : le sceau revient, **mais le lien reste cassé**.
3. **Chapitre 3 — la falsification.** Laisser le scanner balayer. *« La chaîne casse exactement au bloc 7, celui que Léa a modifié. »* Puis restaurer la version d'origine : tout redevient vert.
4. **Chapitre 5 — le minage.** Miner à 3 zéros, puis à 4. *« Un zéro de plus : seize fois plus d'essais. »* Lancer la course : Léa re-mine 3 blocs pendant que le réseau en ajoute neuf.
5. **Chapitre 6 — le consensus.** Passer en preuve d'enjeu, cliquer sur « Léa propose un bloc frauduleux » : sa caution fond de 25 à 5 jetons.
6. **Chapitre 8 — le verdict.** Accuser Léa. Tampon « Affaire classée », puis **montrer le mur des preuves** : cinq fils rouges, un par notion.

**Plan B** : si le réseau de la salle tombe, ouvrir le dépôt local (`python3 -m http.server 8000`). Si la 3D ne démarre pas (WebGL désactivé), passer aux captures du dossier `docs/`.

## Questions probables et réponses

**« Pourquoi une enquête plutôt qu'une explication linéaire ? »**
Parce que le problème de nos quatre héritiers — se mettre d'accord sans autorité de confiance — est le problème que résout la blockchain. L'utilisateur n'apprend pas une notion « parce qu'elle est au programme », mais parce qu'elle lui sert à démasquer la coupable.

**« Les empreintes sont-elles réelles ? »**
Oui, c'est un vrai SHA-256, la fonction de Bitcoin, que nous avons implémentée et vérifiée contre l'implémentation de référence de Node.js. Le minage du bloc 10 est un vrai calcul. En revanche, la course de l'étape 5 et les tirages de l'étape 6 sont simulés, et c'est écrit dans nos limites.

**« Pourquoi seulement 4 nœuds ? »**
Pour la lisibilité. Mais la vraie règle n'est pas « la majorité des copies » : c'est la chaîne qui contient le plus de travail cumulé. Nous l'expliquons au chapitre 5, quand Léa se retrouve avec 9 blocs face à 18.

**« Et si Léa avait plus de puissance que tout le réseau ? »**
C'est l'attaque des 51 % : elle pourrait réécrire les blocs récents. Nous le mentionnons à la fin du chapitre 7, et c'est précisément pourquoi on attend plusieurs confirmations.

**« Qu'est-ce que l'IA a écrit dans ce projet ? »** · *diapo 9, nous l'annonçons nous-mêmes*
Trente des trente-sept commits sont rédigés par elle, et l'onglet *Contributors* du dépôt le montre sans ambiguïté — nous avons choisi de ne pas réécrire cet historique. Ce que nous avons fait nous-mêmes : le choix du fil rouge, les choix de modélisation, la relecture des textes, les tests utilisateurs, et la vérification de chaque notion contre les sources. C'est déclaré dans le README, dans CHOIX-MODELISATION et dans chaque fiche hebdomadaire.

**« Savez-vous expliquer ce code ? »** · *la vraie question derrière la précédente*
Oui, et c'est vérifiable sur place : `sha256.js` implémente la fonction de hachage, `chain.js` le modèle (bloc, minage, validation), `engine.js` la scène et les interactions, `story.js` une fonction par chapitre. Demandez-nous n'importe quel fichier.

**« Vos testeurs portent le même nom que votre binôme. »**
Ce sont deux proches de Hugo : extérieurs à la formation, donc non initiés, mais pas indépendants. Nous l'écrivons noir sur blanc dans `TESTS-UTILISATEURS.md`, avec les deux autres limites du protocole — la grille par chapitre n'a pas été remplie pendant la séance, et les FPS n'ont pas été relevés à cette occasion.

**« Pourquoi quatre fiches hebdomadaires ont-elles été écrites après coup ? »**
Parce que nous avons pris du retard fin octobre et que nous ne les avons pas envoyées à temps. Nous les avons reconstituées à partir de l'historique du dépôt et nous l'avons signalé en tête de chaque fiche, plutôt que de faire croire à un suivi régulier.

**« Comment garantissez-vous les 30 FPS ? »**
Formes primitives uniquement, aucune texture lourde, aucun modèle externe. Le compteur est affiché en permanence, et si la machine descend sous 30 images par seconde pendant trois secondes, le halo lumineux se coupe et la résolution baisse automatiquement.

**« Qu'est-ce qui vous a le plus surpris ? »**
Que la difficulté ne soit pas technique mais lexicale : nos premiers essais butaient sur des mots comme « nonce » ou « nœud ». D'où les définitions cliquables au moment où le mot apparaît.

## Avant de partir

- [ ] Extensions de navigateur désactivées (thèmes sombres, bloqueurs)
- [ ] Site ouvert sur l'écran-titre, son coupé si la salle l'exige (le tampon final émet un bruit sourd)
- [ ] Dépôt cloné en local pour le plan B
- [ ] Support exporté en PDF (touche `P`) sur une clé USB
- [ ] `GRILLE-AUTOEVAL.md` déposée dans `docs/`
