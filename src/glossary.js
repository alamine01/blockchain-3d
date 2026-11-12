// Glossaire unique : sert à la fenêtre « Glossaire » et aux mots cliquables dans les textes.
// Les définitions reprennent le glossaire commun du sujet R507, reformulé pour un novice.
export const GLOSSARY = [
  { term: 'Blockchain', match: ['blockchain'], def: 'Registre de comptes copié chez tous les participants. Ses pages, les blocs, sont accrochées les unes aux autres par des empreintes.' },
  { term: 'Jeton', match: ['jetons', 'jeton'], def: 'Unité de monnaie numérique qui n’existe que dans le registre, comme le bitcoin. Dans l’enquête, imaginez que 1 jeton = 1 euro.' },
  { term: 'Bloc', match: ['blocs', 'bloc'], def: 'Une page du registre : des opérations, son empreinte, l’empreinte du bloc précédent et un nonce.' },
  { term: 'Empreinte (hash)', match: ['empreintes', 'empreinte', 'hash'], def: 'Code de 64 caractères calculé à partir du contenu d’un bloc (ici avec SHA-256, comme Bitcoin). Une seule lettre change, et toute l’empreinte change. On ne peut pas retrouver le contenu à partir de l’empreinte.' },
  { term: 'Genèse', match: ['genèse'], def: 'Le tout premier bloc de la chaîne. Il n’a pas de bloc précédent.' },
  { term: 'Immutabilité', match: ['immutabilité'], def: 'Un bloc validé est très difficile à modifier sans que cela se voie. Ce n’est pas impossible physiquement, mais toute modification est détectée.' },
  { term: 'Nonce', match: ['nonce'], def: 'Nombre que l’on fait varier pendant le minage jusqu’à obtenir une empreinte qui respecte la difficulté.' },
  { term: 'Minage', match: ['miner', 'minage', 'mine'], def: 'Recherche, par essais successifs, du nonce qui donne une empreinte commençant par un certain nombre de zéros.' },
  { term: 'Difficulté', match: ['difficulté'], def: 'Nombre de zéros exigés au début de l’empreinte. Chaque zéro de plus multiplie le travail par 16.' },
  { term: 'Nœud', match: ['nœuds', 'nœud'], def: 'Un ordinateur du réseau. Il garde une copie complète de la chaîne et vérifie lui-même chaque opération.' },
  { term: 'Consensus', match: ['consensus'], def: 'Règle commune qui permet aux nœuds de se mettre d’accord sur le prochain bloc, sans chef.' },
  { term: 'Preuve de travail (PoW)', match: ['preuve de travail', 'PoW'], def: 'Le premier qui trouve le nonce écrit le bloc. Très sûr, mais beaucoup d’énergie dépensée. Utilisée par Bitcoin.' },
  { term: 'Preuve d’enjeu (PoS)', match: ['preuve d’enjeu', 'preuve d\'enjeu', 'PoS'], def: 'Un validateur est tiré au sort selon sa caution, qu’il perd s’il triche. Économe en énergie. Utilisée par Ethereum depuis 2022.' },
  { term: 'Signature', match: ['signe', 'signé', 'signature'], def: 'Preuve numérique que seul le propriétaire des jetons a pu créer l’opération, grâce à sa clé secrète.' },
  { term: 'Confirmation', match: ['confirmations', 'confirmation', 'confirmée'], def: 'Chaque bloc ajouté après celui qui contient une opération. Plus il y en a, plus l’opération est sûre.' },
  { term: 'Double dépense', match: ['double dépense'], def: 'Tentative de dépenser deux fois les mêmes jetons. Le réseau refuse la seconde opération.' },
];

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Transforme la première apparition de chaque terme d'un texte en bouton qui ouvre sa définition.
export function linkTerms(root) {
  const used = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('button, code, .term, input, label') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    let text = node.nodeValue;
    const frag = document.createDocumentFragment();
    let changed = false;
    for (;;) {
      let best = null;
      GLOSSARY.forEach((g, gi) => {
        if (used.has(gi)) return;
        for (const m of g.match) {
          const re = new RegExp(`(^|[^\\p{L}])(${escRe(m)})(?![\\p{L}])`, 'iu');
          const r = re.exec(text);
          if (r && (!best || r.index + r[1].length < best.at)) best = { at: r.index + r[1].length, len: r[2].length, gi };
        }
      });
      if (!best) break;
      used.add(best.gi);
      changed = true;
      frag.append(text.slice(0, best.at));
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'term';
      b.dataset.gi = best.gi;
      b.textContent = text.slice(best.at, best.at + best.len);
      b.setAttribute('aria-label', `${b.textContent} : voir la définition`);
      frag.append(b);
      text = text.slice(best.at + best.len);
    }
    if (changed) { frag.append(text); node.replaceWith(frag); }
  }
}
