// Objets 3D réutilisables : bloc, chaîne de blocs, ordinateur (nœud) et paquet qui voyage.
import * as THREE from 'three';
import { C, CSS, FONT_TITLE, textTexture, disposeTree, reduceMotion } from './engine.js';
import { chainStatus, describe } from './chain.js';

// Couleurs par état : vert = valide, rouge = invalide, ambre = sélectionné / en cours.
const STATES = {
  ok: { edge: 0x7dffb8, body: 0x1c3a2b, emissive: 0x0e3a22 },
  bad: { edge: 0xff6a5e, body: 0x4a1f1c, emissive: 0x5a120c },
  warn: { edge: 0xffd36b, body: 0x4a3d1a, emissive: 0x4a3608 },
  neutral: { edge: 0x8b8f98, body: C.block, emissive: 0x000000 },
};

export class BlockMesh extends THREE.Group {
  constructor(size = 1.4, withLabel = true) {
    super();
    this.size = size;
    const geo = new THREE.BoxGeometry(size, size, size);
    this.mat = new THREE.MeshStandardMaterial({ color: C.block, roughness: 0.45, metalness: 0.1, transparent: true, opacity: 0.92 });
    this.box = new THREE.Mesh(geo, this.mat);
    this.add(this.box);
    this.edgeMat = new THREE.LineBasicMaterial({ color: C.ok });
    this.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), this.edgeMat));
    if (withLabel) {
      this.label = textTexture(256, 256);
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(size * 0.92, size * 0.92),
        new THREE.MeshBasicMaterial({ map: this.label.tex, transparent: true }),
      );
      face.position.z = size / 2 + 0.01;
      this.add(face);
    }
    this.setState('neutral');
  }

  setText(title, line2 = '', line3 = '', color3 = CSS.ink) {
    this.label?.draw([
      { text: title, size: 40, font: FONT_TITLE, weight: 400, color: CSS.warn },
      { text: line2, size: 28, weight: 400, color: CSS.muted },
      { text: line3, size: 34, color: color3 },
    ]);
  }

  setState(state) {
    const s = STATES[state];
    this.state = state;
    this.edgeMat.color.setHex(s.edge);
    this.mat.color.setHex(s.body);
    this.mat.emissive.setHex(s.emissive);
  }
}

export class ChainView extends THREE.Group {
  constructor(engine, blocks, { spacing = 2.2, size = 1.4, label = true, slots, onPick } = {}) {
    super();
    Object.assign(this, { engine, spacing, size, labelOn: label, onPick });
    this.blocks = blocks;
    this.meshes = [];
    this.links = [];
    this.removers = [];
    this.selected = -1;
    this.override = null;
    this.startX = -(((slots ?? blocks.length) - 1) * spacing) / 2;
    blocks.forEach((b, i) => this._add(b, i, false));
    this.refresh();
  }

  x(i) { return this.startX + i * this.spacing; }

  _add(block, i, animate) {
    const mesh = new BlockMesh(this.size, this.labelOn);
    mesh.position.x = this.x(i);
    this.add(mesh);
    this.meshes[i] = mesh;
    this.updateLabel(i);
    if (this.onPick) this.removers.push(this.engine.addClickable(mesh.box, () => this.onPick(i)));
    if (i > 0) {
      const link = new THREE.Mesh(
        new THREE.CylinderGeometry(this.size * 0.05, this.size * 0.05, this.spacing - this.size, 8),
        new THREE.MeshBasicMaterial({ color: C.ok }),
      );
      link.rotation.z = Math.PI / 2;
      link.position.x = this.x(i) - this.spacing / 2;
      this.add(link);
      this.links[i] = link;
    }
    if (!animate) return Promise.resolve();
    mesh.scale.setScalar(0.01);
    return this.engine.tween(550, (k) => {
      mesh.scale.setScalar(Math.max(k, 0.01));
      mesh.position.y = 1.2 * (1 - k);
    });
  }

  append(block) {
    this.blocks.push(block);
    const p = this._add(block, this.blocks.length - 1, true);
    this.refresh();
    return p;
  }

  updateLabel(i) {
    if (!this.labelOn) return;
    const b = this.blocks[i];
    const d = describe(b);
    this.meshes[i].setText(`BLOC ${i + 1}`, d.who, d.amount);
  }

  status() { return chainStatus(this.blocks); }

  refresh({ cascade = false } = {}) {
    const st = this.status();
    const apply = (i) => {
      const s = st[i];
      const mesh = this.meshes[i];
      if (!mesh) return;
      let state = this.override || (s.valid ? 'ok' : 'bad');
      if (i === this.selected) state = 'warn';
      if (mesh.state === 'ok' && state === 'bad' && this.labelOn) sparks(this.engine, this, mesh.position, C.bad);
      mesh.setState(state);
      if (this.labelOn) mesh.scale.setScalar(i === this.selected ? 1.12 : 1);
      const link = this.links[i];
      if (link) {
        const linkGood = s.linkOk && st[i - 1].valid;
        link.material.color.setHex(this.override === 'neutral' ? C.muted : linkGood ? 0x7dffb8 : 0xff6a5e);
      }
    };
    const first = st.findIndex((s) => !s.valid);
    if (!cascade || reduceMotion || first < 0) {
      st.forEach((_, i) => apply(i));
    } else {
      // Effet domino : les blocs passent au rouge l'un après l'autre.
      st.forEach((_, i) => {
        if (i < first) apply(i);
        else setTimeout(() => apply(i), 260 * (i - first + 1));
      });
    }
    return st;
  }

  dispose() { this.removers.forEach((r) => r()); }
}

// Un ordinateur de la famille = un nœud du réseau, avec sa copie de la chaîne au-dessus.
export class Station extends THREE.Group {
  constructor(engine, name) {
    super();
    this.engine = engine;
    this.name = name;
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.8, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x2e2620, roughness: 0.85 }),
    );
    desk.position.y = -0.8;
    this.add(desk);
    this.frameMat = new THREE.MeshStandardMaterial({ color: 0x1b1f27, emissive: 0x000000 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.35, 0.12), this.frameMat);
    frame.position.y = 0.3;
    this.add(frame);
    this.screen = textTexture(512, 320);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 1.2), new THREE.MeshBasicMaterial({ map: this.screen.tex }));
    screen.position.set(0, 0.3, 0.07);
    this.add(screen);
    this.hitboxes = [desk, frame, screen];
    this.setStatus('ordinateur');
  }

  setStatus(text, color = CSS.muted) {
    this.status = text;
    this.screen.draw([
      { text: this.name, size: 76, font: FONT_TITLE, weight: 400, color: CSS.ink },
      { text, size: 40, weight: 600, color },
    ], '#10141b');
  }

  setChain(blocks) {
    if (this.chain) { this.chain.dispose(); disposeTree(this.chain); }
    this.chain = new ChainView(this.engine, blocks, { size: 0.4, spacing: 0.58, label: false, slots: 9 });
    this.chain.position.y = 1.75;
    this.add(this.chain);
    return this.chain;
  }

  flash(hex, ms = 900) {
    this.frameMat.emissive.setHex(hex);
    return this.engine.tween(ms, (k) => this.frameMat.emissive.setScalar(0).lerp(new THREE.Color(hex), 1 - k));
  }

  anchor(dy = 0.9) { return this.position.clone().add(new THREE.Vector3(0, dy, 0.8)); }
}

// Une transaction qui voyage d'un ordinateur à l'autre, en arc.
export function sendPacket(engine, parent, from, to, { color = C.packet, arc = 2.5, duration = 1000, keep = false } = {}) {
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14), new THREE.MeshBasicMaterial({ color }));
  parent.add(sphere);
  const mid = from.clone().lerp(to, 0.5);
  mid.y += arc;
  const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
  sphere.position.copy(from);
  return engine.tween(duration, (k) => sphere.position.copy(curve.getPoint(k))).then(() => {
    if (!keep) disposeTree(sphere);
    return sphere;
  });
}

// Gerbe d'étincelles : quand un bloc casse, ou quand une transaction est refusée.
export function sparks(engine, parent, at, color = C.bad, count = 60) {
  const pos = new Float32Array(count * 3);
  const vel = [];
  for (let i = 0; i < count; i++) {
    pos.set([at.x, at.y, at.z], i * 3);
    const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI - Math.PI / 2, v = 0.004 + Math.random() * 0.006;
    vel.push([Math.cos(a) * Math.cos(b) * v, Math.abs(Math.sin(b)) * v + 0.003, Math.sin(a) * Math.cos(b) * v]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color, size: 0.12, transparent: true, depthWrite: false });
  const pts = new THREE.Points(geo, mat);
  parent.add(pts);
  let last = 0;
  return engine.tween(900, (k) => {
    const dt = (k - last) * 900; last = k;
    for (let i = 0; i < count; i++) {
      vel[i][1] -= 0.00001 * dt;
      pos[i * 3] += vel[i][0] * dt; pos[i * 3 + 1] += vel[i][1] * dt; pos[i * 3 + 2] += vel[i][2] * dt;
    }
    geo.attributes.position.needsUpdate = true;
    mat.opacity = 1 - k;
  }, (t) => t).then(() => disposeTree(pts));
}
