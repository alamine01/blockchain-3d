// Écran-titre : le dossier se décode. Aucune dépendance, pour démarrer avant le moteur 3D.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HEX = '0123456789abcdef';
const rnd = (s) => s[(Math.random() * s.length) | 0];

// 1) Le titre émerge d'une empreinte : chaque lettre défile en hexadécimal puis se fixe.
function decodeTitle(el) {
  const text = el.dataset.decode;
  el.querySelector('.placeholder')?.remove();   // l'empreinte figée du HTML cède la place aux lettres animées
  const spans = [...text].map((ch) => {
    const s = document.createElement('span');
    if (ch === '\n') { const br = document.createElement('br'); el.append(br); return null; }
    s.textContent = ch === ' ' ? ' ' : ch;
    s.className = 'glyph';
    el.append(s);
    return ch === ' ' ? null : { s, ch };
  }).filter(Boolean);
  el.classList.add('ready');
  if (reduce) { spans.forEach(({ s }) => s.classList.add('locked')); return; }

  spans.forEach(({ s, ch }, i) => {
    const start = 180 + i * 78;
    const dur = 620 + Math.random() * 320;
    s.textContent = rnd(HEX);
    s.classList.add('scrambling');
    const t0 = performance.now();
    const tick = (now) => {
      const t = now - t0;
      if (t < start) { requestAnimationFrame(tick); return; }
      if (t > start + dur) { s.textContent = ch; s.classList.remove('scrambling'); s.classList.add('locked'); return; }
      if (((t / 45) | 0) % 1 === 0) s.textContent = rnd(HEX);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// 2) Fond : des lignes d'empreintes, balayées par une lueur, avec de rares scintillements.
function hexField(canvas) {
  if (reduce || !canvas.clientWidth) return;   // inutile si l'on ouvre directement sur un chapitre
  const g = canvas.getContext('2d', { alpha: true });
  let rows = [], cw = 0, rowH = 0, cols = 0, dpr = 1;
  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    g.scale(dpr, dpr);
    g.font = '12px "IBM Plex Mono", ui-monospace, monospace';
    cw = g.measureText('0').width || 7.2;
    rowH = 19;
    cols = Math.ceil(canvas.clientWidth / cw) + 2;
    const n = Math.ceil(canvas.clientHeight / rowH) + 1;
    rows = Array.from({ length: n }, () => Array.from({ length: cols }, () => rnd(HEX)));
  }
  build();
  addEventListener('resize', build);
  let sweep = -0.3;
  let last = 0;
  (function frame(now) {
    // L'écran-titre refermé, la largeur tombe à zéro : la boucle s'arrête d'elle-même
    // et ne consomme plus rien pendant l'enquête.
    if (!canvas.isConnected || !canvas.clientWidth) return;
    requestAnimationFrame(frame);
    if (now - last < 60) return;           // ~16 images/s : discret et peu coûteux
    last = now;
    for (let k = 0; k < 14; k++) {          // quelques caractères changent à chaque passe
      const r = (Math.random() * rows.length) | 0;
      if (rows[r]) rows[r][(Math.random() * cols) | 0] = rnd(HEX);
    }
    sweep += 0.0035;
    if (sweep > 1.3) sweep = -0.3;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    g.clearRect(0, 0, W, H);
    g.font = '12px "IBM Plex Mono", ui-monospace, monospace';
    g.textBaseline = 'top';
    const sx = sweep * W;
    for (let r = 0; r < rows.length; r++) {
      const y = r * rowH;
      for (let c = 0; c < cols; c++) {
        const x = c * cw;
        const d = Math.abs(x - sx) / (W * 0.18);
        const lit = Math.max(0, 1 - d);
        g.fillStyle = `rgba(240,181,74,${0.05 + lit * 0.34})`;
        g.fillText(rows[r][c], x, y);
      }
    }
  })(0);
}

// 3) Le fil rouge se trace entre deux punaises, comme sur le mur des preuves.
function drawThread(svg) {
  if (reduce) { svg.classList.add('drawn'); return; }
  requestAnimationFrame(() => svg.classList.add('drawn'));
}

export function initIntro() {
  const title = document.getElementById('introTitle');
  if (!title || title.dataset.done) return;
  title.dataset.done = '1';
  decodeTitle(title);
  const fx = document.getElementById('introFx');
  if (fx) hexField(fx);
  const thread = document.getElementById('introThread');
  if (thread) drawThread(thread);
  // Le tampon tombe une fois le titre fixé.
  setTimeout(() => document.getElementById('introStamp')?.classList.add('in'), reduce ? 0 : 1250);
}

initIntro();
