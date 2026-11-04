// Moteur 3D : rendu, caméra, animations, clics et textes dessinés sur des textures.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const C = {
  bg: 0x07090d, floor: 0x0b0e13, ok: 0x4cc38a, bad: 0xe5534b, warn: 0xe0b04a,
  ink: 0xe8e4da, muted: 0x8b8f98, block: 0x26303d, packet: 0xe0b04a,
};
export const CSS = { ok: '#4cc38a', bad: '#e5534b', warn: '#e0b04a', ink: '#e8e4da', muted: '#9a9ea7' };
export const FONT = '"IBM Plex Sans", system-ui, sans-serif';
export const FONT_TITLE = '"Big Shoulders Display", "Arial Narrow", sans-serif';

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function createEngine(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.Fog(C.bg, 24, 58);
  // Reflets doux sur le verre et le sol, calculés une seule fois au chargement.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 13, -12);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3;
  controls.maxDistance = 34;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0, 0, -30);

  scene.add(new THREE.HemisphereLight(0x8aa4d6, 0x0a0806, 0.35));
  const key = new THREE.DirectionalLight(0xfff1d6, 0.8);
  key.position.set(6, 14, 8);
  scene.add(key);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 220),
    new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.32, metalness: 0.55, envMapIntensity: 0.35 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  scene.add(floor);

  // Flaques de lumière chaude sous chaque zone de l'enquête.
  const pool = document.createElement('canvas');
  pool.width = pool.height = 256;
  const pg = pool.getContext('2d');
  const grad = pg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,190,110,0.35)');
  grad.addColorStop(0.5, 'rgba(255,170,90,0.10)');
  grad.addColorStop(1, 'rgba(255,170,90,0)');
  pg.fillStyle = grad;
  pg.fillRect(0, 0, 256, 256);
  const poolTex = new THREE.CanvasTexture(pool);
  for (const [z, size] of [[0, 26], [18, 14], [-30, 26], [-60, 18]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size * 0.7),
      new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, -1.18, z);
    scene.add(m);
  }

  // Lampe d'enquêteur : un cône de lumière chaude au-dessus de chaque zone.
  for (const z of [0, 18, -30, -60]) {
    const lamp = new THREE.SpotLight(0xffc878, 55, 34, Math.PI / 4.5, 0.8, 1.5);
    lamp.position.set(0, 12, z + 2);
    lamp.target.position.set(0, -1.2, z);
    scene.add(lamp, lamp.target);
  }

  // Poussière qui flotte dans la lumière.
  const dustCount = 900;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 40;
    dustPos[i * 3 + 1] = Math.random() * 9 - 1;
    dustPos[i * 3 + 2] = Math.random() * 100 - 72;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xffd9a0, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false,
  }));
  scene.add(dust);

  // Halo lumineux (bloom) sur les éléments brillants : liens, arêtes, paquets.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // Seuil élevé : seuls les liens, arêtes et paquets très lumineux brillent, pas les textes.
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.5, 0.78);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const forceHQ = new URLSearchParams(location.search).has('hq');
  let useBloom = true;

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    // Sur grand écran, le panneau couvre la droite : on décale le centre de l'image vers la gauche.
    const off = w > 1100 ? 228 : w > 900 ? 203 : 0;
    if (off) camera.setViewOffset(w, h, off, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  // Animations simples : une fonction appelée avec un avancement de 0 à 1.
  const tweens = new Set();
  function tween(duration, onUpdate, easing = easeInOut) {
    return new Promise((resolve) => {
      if (reduceMotion || duration <= 0) { onUpdate(1); resolve(); return; }
      tweens.add({ t: 0, duration, onUpdate, easing, resolve });
    });
  }
  const frameCallbacks = new Set();
  const onFrame = (fn) => { frameCallbacks.add(fn); return () => frameCallbacks.delete(fn); };

  function flyTo(pos, target, duration = 1100) {
    const p0 = camera.position.clone();
    const t0 = controls.target.clone();
    const p1 = new THREE.Vector3(...pos);
    const t1 = new THREE.Vector3(...target);
    return tween(duration, (k) => {
      camera.position.lerpVectors(p0, p1, k);
      controls.target.lerpVectors(t0, t1, k);
    });
  }

  // Clics sur les objets 3D (un glisser de plus de 6 px fait tourner la caméra, ce n'est pas un clic).
  const clickables = new Map();
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const isShown = (o) => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects([...clickables.keys()], false).find((h) => isShown(h.object));
    return hit?.object;
  }
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
    down = null;
    if (moved > 6) return;
    const o = pick(e);
    if (o) clickables.get(o)();
  });
  renderer.domElement.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' && !down) renderer.domElement.style.cursor = pick(e) ? 'pointer' : '';
  });
  const addClickable = (obj, fn) => { clickables.set(obj, fn); return () => clickables.delete(obj); };

  const fpsEl = document.getElementById('fps');
  let frames = 0, slow = 0, lastFps = performance.now(), prev = performance.now();
  renderer.setAnimationLoop((now) => {
    const dt = Math.min(now - prev, 100);
    prev = now;
    for (const tw of tweens) {
      tw.t += dt;
      const k = Math.min(tw.t / tw.duration, 1);
      tw.onUpdate(tw.easing(k));
      if (k >= 1) { tweens.delete(tw); tw.resolve(); }
    }
    for (const fn of frameCallbacks) fn(dt, now);
    if (!reduceMotion) {
      dust.rotation.y += dt * 0.00002;
      dust.position.y = Math.sin(now / 4000) * 0.3;
    }
    controls.update();
    if (useBloom) composer.render(); else renderer.render(scene, camera);
    frames++;
    if (now - lastFps >= 1000) {
      // Qualité adaptative : si l'ordinateur passe sous 30 images/s, on coupe le halo.
      slow = frames < 30 ? slow + 1 : 0;
      if (useBloom && slow >= 3 && now > 5000 && !forceHQ) { useBloom = false; renderer.setPixelRatio(1); resize(); }
      if (fpsEl) fpsEl.textContent = `${frames} FPS${useBloom ? '' : ' · mode économie'}`;
      frames = 0;
      lastFps = now;
    }
  });

  return { THREE, scene, camera, controls, renderer, tween, onFrame, flyTo, addClickable };
}

// Texte dessiné dans un canvas, utilisé comme texture.
export function textTexture(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const g = canvas.getContext('2d');
  function draw(lines, bg) {
    g.clearRect(0, 0, w, h);
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    const total = lines.reduce((s, l) => s + (l.size || 40) * 1.25, 0);
    let y = (h - total) / 2;
    for (const l of lines) {
      const size = l.size || 40;
      g.font = `${l.weight || 600} ${size}px ${l.font || FONT}`;
      g.fillStyle = l.color || CSS.ink;
      g.textAlign = 'center';
      g.textBaseline = 'top';
      g.fillText(l.text, w / 2, y + size * 0.1, w - 20);
      y += size * 1.25;
    }
    tex.needsUpdate = true;
  }
  return { tex, draw };
}

export function makeSprite(lines, width = 4, { w = 512, h = 128, bg } = {}) {
  const t = textTexture(w, h);
  t.draw(lines, bg);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: t.tex, transparent: true, depthWrite: false }));
  sprite.scale.set(width, (width * h) / w, 1);
  sprite.userData.draw = (l) => t.draw(l, bg);
  return sprite;
}

export function disposeTree(root) {
  root.traverse((o) => {
    o.geometry?.dispose();
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => { if (m) { m.map?.dispose(); m.dispose(); } });
  });
  root.removeFromParent();
}
