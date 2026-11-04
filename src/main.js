// Point d'entrée : construit le monde 3D, puis gère la navigation entre les étapes.
import * as THREE from 'three';
import { createEngine, disposeTree, CSS } from './engine.js';
import { Station } from './objects.js';
import { EvidenceBoard } from './board.js';
import { makeChain, clone, setData } from './chain.js';
import { steps, CAMERAS } from './story.js';

// Le registre d'Émile : 9 blocs. Le bloc 7 contient le vrai paiement de 500 jetons.
const DATAS = [
  'Genèse : registre d’Émile',
  'Émile → Marc : 300 jetons',
  'Émile → Sofia : 300 jetons',
  'Karim → Émile : 120 jetons',
  'Émile → Karim : 300 jetons',
  'Sofia → Marc : 40 jetons',
  'Émile → Léa : 500 jetons',
  'Marc → Karim : 25 jetons',
  'Léa → Sofia : 60 jetons',
];

async function start() {
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch { /* polices facultatives */ }

  const engine = createEngine(document.getElementById('stage'));
  const honest = makeChain(DATAS);
  // La copie de Léa : bloc 7 modifié après coup, sans re-minage.
  const tampered = clone(honest);
  setData(tampered[6], 'Émile → Léa : 50 000 jetons');

  // Les 4 ordinateurs (nœuds) et celui d'Émile, au centre.
  const stations = {};
  const layout = { Marc: [-6, -25.5], Sofia: [6, -25.5], Karim: [6, -34.5], 'Léa': [-6, -34.5] };
  let ctx = null;
  for (const [name, [x, z]] of Object.entries(layout)) {
    const st = new Station(engine, name);
    st.position.set(x, 0, z);
    engine.scene.add(st);
    st.hitboxes.forEach((h) => engine.addClickable(h, () => ctx?.onStationClick?.(name)));
    stations[name] = st;
  }
  const emile = new Station(engine, 'Émile †');
  emile.position.set(0, 0, -30);
  emile.scale.setScalar(0.8);
  emile.setStatus('archive', CSS.muted);
  engine.scene.add(emile);

  // Câbles du réseau : chaque nœud est relié à ses voisins, il n'y a pas de centre.
  const pairs = [['Marc', 'Sofia'], ['Sofia', 'Karim'], ['Karim', 'Léa'], ['Léa', 'Marc'], ['Marc', 'Karim']];
  const pts = pairs.flatMap(([a, b]) => [stations[a].position.clone().setY(-0.35), stations[b].position.clone().setY(-0.35)]);
  engine.scene.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineDashedMaterial({ color: 0x5a6273, dashSize: 0.4, gapSize: 0.25 }),
  ).computeLineDistances());
  const board = new EvidenceBoard(engine);
  board.position.set(0, 2.4, -41.5);
  engine.scene.add(board);
  let reached = 0;

  // Tampon « Affaire classée », avec un bruit sourd synthétisé (aucun fichier son).
  function stamp() {
    const el = document.getElementById('stamp');
    el.hidden = false;
    el.classList.remove('hit');
    void el.offsetWidth;
    el.classList.add('hit');
    try {
      const ac = new AudioContext();
      const o = ac.createOscillator(); const g = ac.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(140, ac.currentTime + 0.35); o.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.6);
      g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.setValueAtTime(0.6, ac.currentTime + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.8);
      o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.85);
    } catch { /* son facultatif */ }
  }
  document.getElementById('stamp').addEventListener('click', (e) => { e.currentTarget.hidden = true; });

  // ---------- interface ----------
  const $ = (id) => document.getElementById(id);
  const controls = $('controls');
  const dots = $('dots');
  steps.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" aria-label="Étape ${i}: ${s.title}" title="${s.title}">${i}</button>`;
    li.firstChild.addEventListener('click', () => go(i));
    dots.appendChild(li);
  });

  let current = -1;
  function makeCtx() {
    const c = {
      engine, honest, tampered, stations, emile, board,
      group: new THREE.Group(),
      live: true,
      cleanups: [],
      onStationClick: null,
      alive: () => c.live,
      track: (fn) => c.cleanups.push(fn),
      later: (ms) => new Promise((r) => { const t = setTimeout(() => r(c.live), ms); c.cleanups.push(() => { clearTimeout(t); r(false); }); }),
      ui: { html(markup) { controls.innerHTML = markup; return controls; }, stamp },
    };
    engine.scene.add(c.group);
    return c;
  }

  function go(i, { fromKeyboard = false } = {}) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    if (i === current) return;
    if (ctx) { ctx.live = false; ctx.cleanups.forEach((f) => f()); disposeTree(ctx.group); }
    current = i;
    reached = Math.max(reached, i);
    board.setProgress(reached);
    document.getElementById('stamp').hidden = true;
    const s = steps[i];
    $('tag').textContent = s.tag;
    $('count').textContent = `Étape ${i} / ${steps.length - 1}`;
    $('title').textContent = s.title;
    $('story').innerHTML = s.story;
    $('retenir').innerHTML = s.retenir;
    $('prev').disabled = i === 0;
    $('next').disabled = i === steps.length - 1;
    dots.querySelectorAll('button').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'step' : 'false');
      b.classList.toggle('seen', k < i);
    });
    ctx = makeCtx();
    s.enter(ctx);
    // Sur un écran étroit (téléphone), on recule la caméra pour tout voir.
    const [pos, target] = CAMERAS[s.area];
    const k = engine.camera.aspect < 1 ? 1.9 : 1;
    if (!introOpen) engine.flyTo(pos.map((v, j) => target[j] + (v - target[j]) * k), target);
    $('panel').scrollTop = 0;
    try { history.replaceState(null, '', `#etape-${i}`); } catch { /* ignoré */ }
    if (fromKeyboard) $('title').focus({ preventScroll: true });
  }

  $('prev').addEventListener('click', () => go(current - 1));
  $('next').addEventListener('click', () => go(current + 1));
  document.addEventListener('click', (e) => {
    const n = e.target.closest('[data-next]');
    if (n) go(current + 1);
    const g = e.target.closest('[data-goto]');
    if (g) go(+g.dataset.goto);
  });
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select, dialog')) return;
    if (e.key === 'ArrowRight') go(current + 1, { fromKeyboard: true });
    if (e.key === 'ArrowLeft') go(current - 1, { fromKeyboard: true });
  });

  const gloss = $('gloss');
  $('glossBtn').addEventListener('click', () => gloss.showModal());
  $('glossClose').addEventListener('click', () => gloss.close());

  const fromHash = /^#etape-(\d)$/.exec(location.hash);
  // Écran-titre : la caméra attend au-dessus de la ville, puis plonge vers le réseau.
  const intro = $('intro');
  let introOpen = !fromHash;
  intro.hidden = !introOpen;
  document.body.classList.toggle('intro-open', introOpen);
  $('introStart').addEventListener('click', () => {
    introOpen = false;
    document.body.classList.remove('intro-open');
    intro.classList.add('leaving');
    setTimeout(() => { intro.hidden = true; }, 700);
    const [pos, target] = CAMERAS.nodes;
    const k = engine.camera.aspect < 1 ? 1.9 : 1;
    engine.flyTo(pos.map((v, j) => target[j] + (v - target[j]) * k), target, 3200);
    $('title').focus({ preventScroll: true });
  });
  if (introOpen) { const idle = engine.onFrame((dt, now) => { if (!introOpen) { idle(); return; } engine.camera.position.set(Math.sin(now / 9000) * 22, 24, -30 + Math.cos(now / 9000) * 22); }); }
  // Ouverture : la caméra descend du ciel vers le réseau familial.
  go(fromHash ? +fromHash[1] : 0);
  document.body.classList.add('ready');
  // Pour les tests automatisés.
  window.__app = { go, get current() { return current; } };
}

start().catch((err) => {
  console.error(err);
  document.getElementById('story').textContent = 'Impossible de lancer la scène 3D. Vérifiez que WebGL est activé dans votre navigateur.';
});
