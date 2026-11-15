# Tests utilisateurs — L'Affaire Émile

> Exigence du sujet : au moins **2 personnes extérieures au groupe**, n'ayant pas suivi R507 et **sans explication orale préalable**. Les observations sont consignées ici et donnent lieu à des issues GitHub (#19).

## 0. Version express (40 min en tout) — à utiliser si le temps manque

Deux personnes suffisent. Un colocataire, un membre de la famille, un ami d'une autre filière : il faut seulement qu'ils n'aient **pas suivi R507**. Cela marche aussi à distance, par appel vidéo avec partage d'écran.

**Message à leur envoyer**

> Salut ! J'ai besoin de 20 minutes pour un projet de cours. Tu ouvres un site, tu l'utilises comme tu veux et tu dis à voix haute ce que tu comprends et ce qui te bloque. Je ne t'aiderai pas, c'est le principe : je dois voir si le site s'explique tout seul. Aucune connaissance requise, c'est même mieux si tu n'y connais rien.
> Le lien : https://alamine01.github.io/blockchain-3d/

**Déroulé minuté**

| Temps | Ce que vous faites |
|---|---|
| 0-1 min | Les deux questions « avant » (ci-dessous). Vous notez les réponses. |
| 1-16 min | Il parcourt seul. **Vous ne dites rien.** Vous notez dans le tableau chaque hésitation, chaque mot incompris, chaque clic sans effet. |
| 16-19 min | Les questions « après », site fermé. |
| 19-20 min | « Qu'est-ce qui t'a le plus aidé ? Qu'est-ce qui t'a gêné ? » |

**Juste après chaque test** : créez une issue GitHub par problème relevé, même mineur (`gh issue create` ou le bouton « New issue »). C'est cette trace que le sujet demande, autant que le test lui-même.

## 1. Protocole détaillé

| Élément | Choix |
|---|---|
| Matériel | Poste de salle de TP (navigateur récent), souris |
| Adresse | https://alamine01.github.io/blockchain-3d/ |
| Durée | 15 à 20 minutes par personne |
| Consigne donnée au testeur (seule phrase dite) | « Voici un site. Utilise-le comme tu veux et pense à voix haute. Je ne peux pas t'aider. » |
| Rôle de l'observateur | Noter sans intervenir : hésitations, clics sans effet, mots incompris, moments de surprise |
| Mesure de fluidité | Noter le compteur de FPS (en bas à gauche) aux étapes 0, 3, 5 et 8 |

### Questionnaire avant (30 s)
1. Sur une échelle de 1 à 5, à quel point sais-tu ce qu'est une blockchain ?
2. En une phrase, c'est quoi pour toi ?

### Questionnaire après (3 min, sans le site)
1. Même échelle de 1 à 5.
2. Que contient un bloc ?
3. Pourquoi Léa ne pouvait-elle pas modifier le bloc 7 sans que ça se voie ?
4. Pourquoi Léa ne pouvait-elle pas simplement « recalculer » sa copie ?
5. Quelle est la différence entre la preuve de travail et la preuve d'enjeu ?
6. Qu'est-ce qu'une double dépense et comment est-elle bloquée ?
7. Qu'est-ce qui t'a le plus aidé ? Qu'est-ce qui t'a gêné ou perdu ?

**Critère de réussite retenu** : au moins 5 bonnes réponses sur les questions 2 à 6 à eux deux (sur 10), et aucun blocage qui empêche de finir l'enquête.

## 2. Fiche d'observation — Testeur 1

| Champ | Réponse |
|---|---|
| Prénom (ou initiales), profil | |
| Date, poste utilisé | |
| Niveau avant / après (1-5) | / |
| FPS observés (étapes 0 / 3 / 5 / 8) | / / / |
| Temps total | |
| A trouvé le coupable ? | |

| Étape | Observation (hésitation, incompréhension, réaction) | Gravité (bloquant / gênant / mineur) | Issue créée |
|---|---|---|---|
| 0 Le dossier | | | |
| 1 La pièce à conviction | | | |
| 2 Le labo des empreintes | | | |
| 3 La scène du crime | | | |
| 4 Les témoins | | | |
| 5 L'alibi de Léa | | | |
| 6 Le procès | | | |
| 7 La reconstitution | | | |
| 8 Le verdict | | | |

Réponses au questionnaire après : …

## 3. Fiche d'observation — Testeur 2

*(même tableau que le testeur 1)*

## 4. Synthèse et corrections

Deux personnes extérieures à la promotion R507 ont parcouru le site le
**15/11/2026**, sans aucune explication orale, puis ont répondu aux questions.

**Ce qui a fonctionné.** Les deux ont parcouru l'enquête jusqu'au bout et ont
désigné le bon coupable. Aucune erreur de contenu relevée : *« pas d'erreur de
texte, c'est bien expliqué »*. Les notions sont donc passées — c'est l'objectif
pédagogique du projet, et il est atteint.

**Ce qui a bloqué.** La critique est unanime et porte uniquement sur la forme :
*« trop de texte sur la droite, pas assez intuitif […] c'est la forme du texte
qui dérange »*.

| Problème observé | Testeurs concernés | Correction apportée | Issue / commit |
|---|---|---|---|
| Trop de texte affiché d'un coup dans le panneau de droite (~450 caractères avant d'avoir rien fait) | Les 2 | Divulgation progressive : accroche courte → mission mise en avant → commandes → contexte replié dans un `<details>` → « À retenir » masqué jusqu'à ce que les missions soient faites | [#48](https://github.com/alamine01/blockchain-3d/issues/48) |
| Parcours pas assez intuitif : rien n'indique que les objets de la scène 3D sont cliquables (le curseur ne change qu'au survol, donc jamais au tactile) | Les 2 | Pastille ambrée posée automatiquement au-dessus de chaque objet interactif, qui s'efface après le premier clic | [#49](https://github.com/alamine01/blockchain-3d/issues/49) |
| Les trois missions d'une étape sont présentées à égalité : on ne sait pas par où commencer | Les 2 | Seule la première mission non faite est mise en avant (blanc, gras, case ambrée) ; les suivantes passent en retrait | [#49](https://github.com/alamine01/blockchain-3d/issues/49) |
| Le texte qui défile passe derrière la barre « Précédent / Suivant » et reste lisible par transparence | Testeur 2 | Fond de la barre rendu opaque | [#49](https://github.com/alamine01/blockchain-3d/issues/49) |

**Mesure avant / après.** Texte affiché à l'arrivée sur une étape, avant toute
action de l'utilisateur :

| Étape | Avant | Après |
|---|---|---|
| 1 La pièce à conviction | ~430 caractères | 142 |
| 3 La scène du crime | ~470 caractères | 169 |
| 5 L'alibi de Léa | ~520 caractères | 217 |
| 6 Le procès | ~450 caractères | 198 |

> **À compléter par l'équipe** : prénom ou initiales, profil et date de chaque
> testeur dans les fiches 2 et 3 ci-dessus, ainsi que les FPS relevés et les
> réponses au questionnaire de fin. Ces informations ne figurent pas encore dans
> ce document faute d'avoir été notées pendant la séance.

## 5. Vérifications déjà faites par l'équipe (avant tests)

| Vérification | Résultat |
|---|---|
| Parcours complet des 9 étapes, toutes les missions validées (test automatisé Playwright) | ✓ sans erreur JavaScript |
| Affichage téléphone (390 px) : pas de défilement horizontal | ✓ |
| 30 FPS sur poste de TP | À mesurer pendant les tests |
