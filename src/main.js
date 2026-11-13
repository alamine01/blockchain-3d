// Point d'entrée : construit le monde 3D, puis gère la navigation entre les étapes.
import * as THREE from 'three';
import { createEngine, disposeTree, CSS } from './engine.js?v=20261113e';
import { Station } from './objects.js?v=20261113e';
import { EvidenceBoard } from './board.js?v=20261113e';
import { makeChain, clone, setData } from './chain.js?v=20261113e';
import { steps, CAMERAS } from './story.js?v=20261113e';
import { GLOSSARY, linkTerms } from './glossary.js?v=20261113e';

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
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))]); } catch { /* polices facultatives */ }

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

  // Missions : ce que l'utilisateur doit faire à chaque étape. Elles restent cochées si on revient.
  const doneMissions = new Map(steps.map((st) => [st.id, new Set()]));
  function renderMissions() {
    const s = steps[current];
    const list = s.missions || [];
    const box = $('missions');
    box.hidden = list.length === 0;
    const done = doneMissions.get(s.id);
    box.querySelector('ul').innerHTML = list.map(([id, text]) =>
      `<li class="${done.has(id) ? 'done' : ''}"><span class="check" aria-hidden="true"></span><span>${text}</span><span class="sr-only">${done.has(id) ? ' (fait)' : ' (à faire)'}</span></li>`).join('');
    const all = list.length === 0 || list.every(([id]) => done.has(id));
    $('next').classList.toggle('ready', all && current < steps.length - 1);
    box.classList.toggle('complete', all && list.length > 0);
  }
  function completeMission(stepId, id) {
    const set = doneMissions.get(stepId);
    if (set.has(id) || steps[current].id !== stepId) return;
    set.add(id);
    const list = steps[current].missions || [];
    renderMissions();
    if (list.every(([m]) => set.has(m))) toast(current === steps.length - 1 ? 'Enquête terminée' : 'Indice obtenu · étape suivante débloquée');
  }
  let toastTimer = null;
  function toast(text) {
    const t = $('toast');
    t.textContent = text;
    t.hidden = false;
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  // Carte de chapitre entre deux étapes (effet générique de série).
  let chapterTimer = null;
  function chapterCard(i) {
    const el = $('chapter');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.querySelector('.ch-num').textContent = i === 0 ? 'Prologue' : i === steps.length - 1 ? 'Épilogue' : `Chapitre ${i}`;
    el.querySelector('.ch-title').textContent = steps[i].title;
    el.querySelector('.ch-tag').textContent = steps[i].tag;
    el.hidden = false;
    el.classList.remove('play');
    void el.offsetWidth;
    el.classList.add('play');
    clearTimeout(chapterTimer);
    chapterTimer = setTimeout(() => { el.hidden = true; }, 1900);
  }

  // Définition d'un terme au clic, dans une petite bulle.
  const pop = $('termPop');
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.term');
    if (!t) { if (!e.target.closest('#termPop')) pop.hidden = true; return; }
    const g = GLOSSARY[+t.dataset.gi];
    pop.querySelector('strong').textContent = g.term;
    pop.querySelector('p').textContent = g.def;
    pop.hidden = false;
    const r = t.getBoundingClientRect();
    const w = Math.min(320, window.innerWidth - 32);
    pop.style.width = `${w}px`;
    pop.style.left = `${Math.max(16, Math.min(r.left, window.innerWidth - w - 16))}px`;
    const below = r.bottom + 8;
    pop.style.top = `${below + pop.offsetHeight > window.innerHeight - 8 ? r.top - pop.offsetHeight - 8 : below}px`;
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') pop.hidden = true; });
  // Le glossaire complet est généré à partir de la même liste.
  $('glossList').innerHTML = GLOSSARY.map((g) => `<dt>${g.term}</dt><dd>${g.def}</dd>`).join('');

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
      ui: { html(markup) { controls.innerHTML = markup; return controls; }, stamp, toast },
      done: (id) => completeMission(steps[current].id, id),
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
    document.querySelector('#progress span').style.width = `${(i / (steps.length - 1)) * 100}%`;
    $('title').textContent = s.title;
    $('story').innerHTML = s.story;
    $('retenir').innerHTML = s.retenir;
    linkTerms($('story'));
    pop.hidden = true;
    $('prev').disabled = i === 0;
    $('next').disabled = i === steps.length - 1;
    dots.querySelectorAll('button').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'step' : 'false');
      b.classList.toggle('seen', k < i);
    });
    ctx = makeCtx();
    renderMissions();
    s.enter(ctx);
    if (!introOpen) chapterCard(i);
    // Sur un écran étroit (téléphone), on recule la caméra pour tout voir.
    const [pos, target] = CAMERAS[s.area];
    const k = engine.camera.aspect < 1 ? 1.9 : 1;
    if (!introOpen) engine.flyTo(pos.map((v, j) => target[j] + (v - target[j]) * k), target);
    $('panel').scrollTop = 0;
    // Au prologue, on retire le repère de l'adresse : un rechargement repart de l'écran-titre,
    // ce qui évite de tomber au milieu de l'enquête le jour de la soutenance.
    try { history.replaceState(null, '', i === 0 ? location.pathname : `#etape-${i}`); } catch { /* ignoré */ }
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
  document.documentElement.classList.toggle('boot-titre', introOpen);
  const startBtn = $('introStart');
  function openInvestigation() {
    if (!introOpen) return;
    introOpen = false;
    document.documentElement.classList.remove('boot-titre');
    intro.classList.add('leaving');
    setTimeout(() => { intro.hidden = true; }, 700);
    const [pos, target] = CAMERAS.nodes;
    const k = engine.camera.aspect < 1 ? 1.9 : 1;
    engine.flyTo(pos.map((v, j) => target[j] + (v - target[j]) * k), target, 3200);
    setTimeout(() => chapterCard(current), 600);
    $('title').focus({ preventScroll: true });
  }
  startBtn.addEventListener('click', openInvestigation);
  if (introOpen) { const idle = engine.onFrame((dt, now) => { if (!introOpen) { idle(); return; } engine.camera.position.set(Math.sin(now / 9000) * 22, 24, -30 + Math.cos(now / 9000) * 22); }); }
  // Ouverture : la caméra descend du ciel vers le réseau familial.
  go(fromHash ? +fromHash[1] : 0);
  // La scène est prête : le bouton redevient actif, et un clic passé pendant le chargement est honoré.
  window.__ready = true;
  document.getElementById('slowNote').hidden = true;
  startBtn.classList.remove('loading');
  startBtn.textContent = 'Ouvrir l’enquête';
  document.body.classList.add('ready');
  if (window.__pendingStart && introOpen) openInvestigation();
  // Pour les tests automatisés.
  window.__app = { go, get current() { return current; }, missions: doneMissions };
}

start().catch((err) => {
  console.error(err);
  document.getElementById('story').textContent = 'Impossible de lancer la scène 3D. Vérifiez que WebGL est activé dans votre navigateur.';
});
