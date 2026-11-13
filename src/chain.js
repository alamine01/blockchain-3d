// Modèle pédagogique d'une blockchain : des blocs, leur empreinte, le chaînage et le minage.
import { sha256 } from './sha256.js?v=20261113c';

// Difficulté : nombre de zéros exigés au début de l'empreinte d'un bloc valide.
export const DIFFICULTY = 3;
export const prefix = (d = DIFFICULTY) => '0'.repeat(d);
export const GENESIS_PREV = '0'.repeat(64);

// Tout le contenu du bloc entre dans le calcul de l'empreinte.
export const content = (b) => `${b.index}|${b.data}|${b.prev}|${b.nonce}`;
export const computeHash = (b) => sha256(content(b));

// Minage : essayer des nonces jusqu'à obtenir une empreinte qui commence par les zéros exigés.
export function mineSync(block, d = DIFFICULTY) {
  const p = prefix(d);
  block.nonce = 0;
  for (;;) {
    const h = computeHash(block);
    if (h.startsWith(p)) { block.hash = h; return block; }
    block.nonce++;
  }
}

export function makeChain(datas, d = DIFFICULTY) {
  const chain = [];
  datas.forEach((data, index) => {
    const prev = index === 0 ? GENESIS_PREV : chain[index - 1].hash;
    chain.push(mineSync({ index, data, prev, nonce: 0 }, d));
  });
  return chain;
}

export function nextBlock(chain, data, d = DIFFICULTY) {
  const last = chain[chain.length - 1];
  return mineSync({ index: chain.length, data, prev: last.hash, nonce: 0 }, d);
}

// Modifier les données : l'empreinte est recalculée tout de suite, mais le nonce ne change pas,
// donc elle ne respecte presque jamais la difficulté, et le bloc suivant garde l'ancienne empreinte.
export function setData(block, data) {
  block.data = data;
  block.hash = computeHash(block);
}

// Un bloc est valide si son sceau est correct, s'il pointe vers l'empreinte de son parent,
// et si tous les blocs avant lui sont valides.
export function chainStatus(chain, d = DIFFICULTY) {
  let broken = false;
  return chain.map((b, i) => {
    const hash = computeHash(b);
    const sealOk = hash === b.hash && hash.startsWith(prefix(d));
    const linkOk = i === 0 || b.prev === chain[i - 1].hash;
    const valid = !broken && sealOk && linkOk;
    if (!valid) broken = true;
    return { sealOk, linkOk, valid, hash };
  });
}

export const clone = (chain) => chain.map((b) => ({ ...b }));

export function describe(block) {
  const m = /^(.+?) → (.+?) : (.+)$/.exec(block.data);
  return m ? { who: `${m[1]} → ${m[2]}`, amount: m[3] } : { who: block.data, amount: '' };
}
