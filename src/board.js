// Mur de preuves : les 4 suspects en haut, les preuves en bas, reliées à Léa par des fils rouges.
// Une preuve s'épingle chaque fois que l'utilisateur termine l'étape correspondante.
import * as THREE from 'three';
import { CSS, FONT, FONT_TITLE, reduceMotion } from './engine.js?v=20261112a';

const SUSPECTS = [
  { name: 'Marc', role: 'petit-fils' },
  { name: 'Sofia', role: 'petite-fille' },
  { name: 'Karim', role: 'petit-fils' },
  { name: 'Léa', role: 'petite-fille' },
];
// step = étape qui débloque la preuve.
const PROOFS = [
  { step: 3, title: 'BLOC 7', text: 'Sceau brisé', sub: 'empreinte ≠ 000…' },
  { step: 4, title: 'COPIES', text: '1 sur 4 différente', sub: 'celle de Léa' },
  { step: 5, title: 'COURSE', text: 'Chaîne en retard', sub: '9 blocs contre 18' },
  { step: 6, title: 'CAUTION', text: '20 jetons confisqués', sub: 'preuve d’enjeu' },
  { step: 7, title: 'PAIEMENT', text: '500 jetons', sub: 'signé par Émile' },
];

function cardTexture(draw, w = 512, h = 640) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const redraw = (...args) => { g.clearRect(0, 0, w, h); draw(g, w, h, ...args); tex.needsUpdate = true; };
  return { tex, redraw };
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

function drawSuspect(g, w, h, s, guilty) {
  roundRect(g, 8, 8, w - 16, h - 16, 28);
  g.fillStyle = '#0e131b'; g.fill();
  g.lineWidth = 4; g.strokeStyle = guilty ? CSS.bad : 'rgba(255,255,255,0.18)'; g.stroke();
  // Silhouette anonyme (portrait d'identité).
  const grad = g.createLinearGradient(0, 60, 0, 400);
  grad.addColorStop(0, '#3a4556'); grad.addColorStop(1, '#1a2029');
  g.fillStyle = grad;
  g.beginPath(); g.arc(w / 2, 190, 78, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(w / 2, 400, 150, 120, 0, Math.PI, 0); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(40, 60, w - 80, 4);
  g.textAlign = 'center';
  g.fillStyle = CSS.ink; g.font = `800 92px ${FONT_TITLE}`; g.fillText(s.name.toUpperCase(), w / 2, 500);
  g.fillStyle = CSS.muted; g.font = `500 34px ${FONT}`; g.fillText(s.role, w / 2, 550);
  if (guilty) {
    g.save(); g.translate(w / 2, 270); g.rotate(-0.22);
    g.strokeStyle = CSS.bad; g.lineWidth = 10; roundRect(g, -200, -60, 400, 120, 10); g.stroke();
    g.fillStyle = CSS.bad; g.font = `900 84px ${FONT_TITLE}`; g.textBaseline = 'middle'; g.fillText('COUPABLE', 0, 4);
    g.restore();
  }
}

function drawProof(g, w, h, p) {
  roundRect(g, 8, 8, w - 16, h - 16, 22);
  g.fillStyle = '#141a24'; g.fill();
  g.lineWidth = 3; g.strokeStyle = 'rgba(255,90,79,0.55)'; g.stroke();
  g.fillStyle = CSS.bad; g.fillRect(8, 40, 10, h - 80);
  g.textAlign = 'left';
  g.fillStyle = CSS.bad; g.font = `800 40px ${FONT_TITLE}`; g.fillText(`PREUVE · ${p.title}`, 42, 80);
  g.fillStyle = '#d9d4c8'; g.font = `700 50px ${FONT}`;
  const words = p.text.split(' ');
  let line = '', y = 165;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (g.measureText(test).width > w - 80) { g.fillText(line, 42, y); line = word; y += 60; } else line = test;
  }
  g.fillText(line, 42, y);
  g.fillStyle = '#8a909b'; g.font = `500 32px ${FONT}`; g.fillText(p.sub, 42, h - 48);
}

export class EvidenceBoard extends THREE.Group {
  constructor(engine) {
    super();
    this.engine = engine;
    // Paroi de verre fumé avec un cadre lumineux.
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(17, 7.2),
      new THREE.MeshPhysicalMaterial({ color: 0x0d1118, roughness: 0.15, metalness: 0.2, clearcoat: 1, transparent: true, opacity: 0.88 }),
    );
    this.add(glass);
    const frame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(17, 7.2)),
      new THREE.LineBasicMaterial({ color: 0x8aa0c4 }),
    );
    frame.position.z = 0.01;
    this.add(frame);

    const title = cardTexture((g, w, h) => {
      g.textAlign = 'center'; g.fillStyle = CSS.warn; g.font = `800 78px ${FONT_TITLE}`;
      g.fillText('AFFAIRE ÉMILE B. — MUR DES PREUVES', w / 2, 92);
    }, 1600, 130);
    title.redraw();
    const t = new THREE.Mesh(new THREE.PlaneGeometry(9, 0.73), new THREE.MeshBasicMaterial({ map: title.tex, transparent: true }));
    t.position.set(0, 3.05, 0.02);
    this.add(t);

    this.suspects = SUSPECTS.map((s, i) => {
      const tex = cardTexture((g, w, h, guilty) => drawSuspect(g, w, h, s, guilty));
      tex.redraw(false);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.12), new THREE.MeshBasicMaterial({ map: tex.tex, transparent: true }));
      m.position.set(-5.4 + i * 3.6, 1.15, 0.03);
      this.add(m);
      return { mesh: m, tex };
    });

    this.proofs = PROOFS.map((p, i) => {
      const tex = cardTexture((g, w, h) => drawProof(g, w, h, p), 512, 360);
      tex.redraw();
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.69), new THREE.MeshBasicMaterial({ map: tex.tex, transparent: true }));
      m.position.set(-6.4 + i * 3.2, -2.1, 0.04);
      m.rotation.z = (i % 2 ? 1 : -1) * 0.04;
      m.visible = false;
      this.add(m);
      // Punaise rouge.
      const pin = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff4a3d }));
      pin.position.set(0, 0.7, 0.05);
      m.add(pin);
      // Fil rouge vers la carte de Léa, qui pend légèrement.
      const a = new THREE.Vector3(m.position.x, m.position.y + 0.75, 0.08);
      const b = this.suspects[3].mesh.position.clone().setZ(0.08).add(new THREE.Vector3(0, -0.9, 0));
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -0.5, 0));
      const thread = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 40, 0.025, 6),
        new THREE.MeshBasicMaterial({ color: 0xff3b30 }),
      );
      thread.visible = false;
      this.add(thread);
      return { ...p, mesh: m, thread, shown: false };
    });
  }

  // Épingle les preuves des étapes déjà terminées.
  setProgress(reached) {
    for (const p of this.proofs) {
      if (p.shown || reached <= p.step) continue;
      p.shown = true;
      p.mesh.visible = true;
      p.thread.visible = true;
      if (reduceMotion) continue;
      p.mesh.scale.setScalar(0.01);
      this.engine.tween(700, (k) => { p.mesh.scale.setScalar(Math.max(0.01, k + 0.25 * Math.sin(k * Math.PI))); });
    }
  }

  markGuilty(on = true) { this.suspects[3].tex.redraw(on); }
}
