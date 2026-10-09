#!/usr/bin/env bash
# Crée en une fois : dépôt, GitHub Pages, labels, milestones, issues et GitHub Project.
# Prérequis : git + GitHub CLI (https://cli.github.com) et `gh auth login` fait,
# avec le scope project :  gh auth refresh -s project
# Usage (depuis ce dossier) :  bash setup-github.sh NOM-DU-DEPOT
set -e

REPO_NAME="${1:-blockchain-3d}"
OWNER="alamine01"
REPO="$OWNER/$REPO_NAME"

echo "▶ Dépôt $REPO"
git init -q
git add .
git commit -qm "Initialisation du projet : README, cadrage, suivi S01, scène de départ"
git branch -M main
gh repo create "$REPO" --public --source=. --push

echo "▶ GitHub Pages (branche main)"
gh api -X POST "repos/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null || true

echo "▶ Labels"
for l in "notion:1d76db" "documentation:0e8a16" "3d:5319e7" "ux:fbca04" "tests:d93f0b" "gestion:c5def5"; do
  gh label create "${l%%:*}" --color "${l##*:}" --repo "$REPO" --force >/dev/null
done

echo "▶ Milestones"
ms() { gh api -X POST "repos/$REPO/milestones" -f title="$1" -f due_on="$2T21:59:00Z" -f description="$3" >/dev/null; }
ms "M1 Cadrage"               2026-10-09 "Dépôt, Project, premières issues"
ms "M2 Recherche & storyboard" 2026-10-18 "Recherche sur les 7 notions, storyboard, choix de métaphores"
ms "M3 Prototype 3D"          2026-10-25 "Scène, navigation, notions 1 à 3"
ms "M4 Mécaniques complètes"  2026-11-08 "Notions 4 à 7, fil rouge complet"
ms "M5 Tests & corrections"   2026-11-13 "2 testeurs extérieurs, corrections, perfs 30 FPS"
ms "M6 Livraison"             2026-11-15 "Rendu final GitHub + démo en ligne"
ms "M7 Soutenance"            2026-11-19 "Répétition 9h30, soutenance 11h"

echo "▶ Issues"
issue() { gh issue create --repo "$REPO" --title "$1" --label "$2" --milestone "$3" --body "$4" >/dev/null; echo "  + $1"; }

issue "Créer le dépôt et le README"                       gestion       "M1 Cadrage" "README avec équipe, liens, lancement local, déclaration IA."
issue "Configurer GitHub Project, colonnes et milestones" gestion       "M1 Cadrage" "Colonnes : Backlog, À faire, En cours, À vérifier, Terminé."
issue "Rédiger le document de cadrage"                    documentation "M1 Cadrage" "docs/CADRAGE.md : public, fil rouge, périmètre, contraintes."
issue "Scène Three.js minimale + déploiement GitHub Pages" 3d           "M1 Cadrage" "Chaîne de blocs cliquables, compteur FPS, en ligne."
issue "Fiche de suivi semaine 01"                         documentation "M1 Cadrage" "docs/suivi/SEMAINE-01.md + envoi par mail."

issue "Recherche documentaire sur les 7 notions"          documentation "M2 Recherche & storyboard" "Sources fiables, synthèse dans docs/."
issue "Storyboard du fil rouge (Alice → Bob)"             ux            "M2 Recherche & storyboard" "Une planche par étape, transitions, textes de médiation."
issue "Première version de CHOIX-MODELISATION.md"         documentation "M2 Recherche & storyboard" "Une métaphore visuelle justifiée par notion."
issue "Recruter 2 testeurs extérieurs"                    tests         "M2 Recherche & storyboard" "Personnes extérieures, n'ayant pas suivi R507."

issue "Notion 1 : structure d'un bloc"                    notion        "M3 Prototype 3D" "Ouvrir un bloc : données, hash, hash précédent, nonce."
issue "Notion 2 : chaînage cryptographique"               notion        "M3 Prototype 3D" "Lien visuel hash parent → bloc suivant."
issue "Notion 3 : immutabilité et détection de falsification" notion    "M3 Prototype 3D" "Modifier un bloc → liens suivants invalides (rouge)."
issue "Navigation et caméra guidée"                       3d            "M3 Prototype 3D" "Passage d'étape en étape, retour possible."

issue "Notion 4 : réseau décentralisé"                    notion        "M4 Mécaniques complètes" "Plusieurs nœuds, chacun sa copie, propagation."
issue "Notion 5 : minage (proof of work)"                 notion        "M4 Mécaniques complètes" "Recherche du nonce, difficulté réglable."
issue "Notion 6 : comparaison PoW / PoS"                  notion        "M4 Mécaniques complètes" "Bascule entre les deux, avantages et limites."
issue "Notion 7 : vie d'une transaction + attaque"        notion        "M4 Mécaniques complètes" "Création → propagation → validation → bloc, puis double dépense détectée."
issue "Textes de médiation et glossaire à l'écran"        ux            "M4 Mécaniques complètes" "Vocabulaire défini au moment où il apparaît."

issue "Tests utilisateurs (2 personnes extérieures)"      tests         "M5 Tests & corrections" "Protocole, observations, une issue par problème relevé."
issue "Vérifier 30 FPS sur un poste de TP"                tests         "M5 Tests & corrections" "Mesure + optimisations si besoin."
issue "Accessibilité et responsive"                       ux            "M5 Tests & corrections" "Contraste, taille des textes, clavier."

issue "Finaliser CHOIX-MODELISATION.md"                   documentation "M6 Livraison" "Justifications complètes, limites de chaque représentation."
issue "Vérification finale du rendu"                      gestion       "M6 Livraison" "Démo en ligne, README à jour, Project propre, 8 fiches de suivi."

issue "Remplir GRILLE-AUTOEVAL.md"                        documentation "M7 Soutenance" "À déposer dans docs/ avant la soutenance."
issue "Préparer la soutenance (20 min)"                   gestion       "M7 Soutenance" "Support de présentation, démo, réponses aux questions."

echo "▶ GitHub Project"
PNUM=$(gh project create --owner "$OWNER" --title "R507 Blockchain 3D" --format json -q .number)
gh project link "$PNUM" --owner "$OWNER" --repo "$REPO" >/dev/null || true
for n in $(gh issue list --repo "$REPO" --limit 100 --json number -q '.[].number'); do
  gh project item-add "$PNUM" --owner "$OWNER" --url "https://github.com/$REPO/issues/$n" >/dev/null
done

echo "▶ Mise à jour du lien du Project dans les documents"
sed -i.bak "s#projects/NUMERO#projects/$PNUM#g" README.md docs/suivi/SEMAINE-01.md MAIL-SEMAINE-01.txt && rm -f *.bak docs/suivi/*.bak
git add README.md docs/suivi/SEMAINE-01.md && git commit -qm "Ajout du lien GitHub Project" && git push -q

cat <<EOF

✅ Terminé.
   Dépôt   : https://github.com/$REPO
   Project : https://github.com/users/$OWNER/projects/$PNUM
   Démo    : https://$OWNER.github.io/$REPO_NAME/   (1 à 2 min avant d'être en ligne)

⚠️ Dernière étape manuelle (1 min) : dans le Project, menu "..." du champ Status → Edit,
   renommer/ajouter les options : Backlog, À faire, En cours, À vérifier, Terminé.
   Puis remplacer « Mouhamed Al Amine BAH » par ton nom dans les fichiers, commit et push.
EOF
