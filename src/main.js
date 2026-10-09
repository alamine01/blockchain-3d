// Scène de départ : une chaîne de blocs cliquables.
// Hash pédagogique (pas cryptographique) : simple, rapide, lisible.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function fakeHash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// --- Données de la chaîne -------------------------------------------------
const transactions = ['Genèse', 'Alice → Bob : 5', 'Bob → Chloé : 2', 'Chloé → Alice : 1'];
const chain = [];
transactions.forEach((data, i) => {
  const previousHash = i === 0 ? '00000000' : chain[i - 1].hash;
  const nonce = Math.floor(Math.random() * 1000);
  const hash = fakeHash(i + data + previousHash + nonce);
  chain.push({ index: i, data, previousHash, nonce, hash });
});

// --- Scène ----------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 8, 5);
scene.add(light);

// --- Blocs et liens -------------------------------------------------------
const spacing = 2.6;
const offset = ((chain.length - 1) * spacing) / 2;
const blocks = [];

chain.forEach((b, i) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x2f81f7, transparent: true, opacity: 0.85 })
  );
  mesh.position.x = i * spacing - offset;
  mesh.userData = b;
  scene.add(mesh);
  blocks.push(mesh);

  if (i > 0) {
    const link = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, spacing - 1.4),
      new THREE.MeshStandardMaterial({ color: 0x3fb950 })
    );
    link.rotation.z = Math.PI / 2;
    link.position.x = mesh.position.x - spacing / 2;
    scene.add(link);
  }
});

// --- Interaction : clic sur un bloc --------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const details = document.getElementById('details');
let selected = null;

renderer.domElement.addEventListener('click', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(blocks)[0];
  if (selected) selected.material.emissive.setHex(0x000000);
  if (!hit) return;
  selected = hit.object;
  selected.material.emissive.setHex(0x1f4f8f);
  const b = selected.userData;
  details.innerHTML = `
    <strong>Bloc #${b.index}</strong><br>
    Données : ${b.data}<br>
    Nonce : ${b.nonce}<br>
    Hash : <code>${b.hash}</code><br>
    Hash précédent : <code>${b.previousHash}</code>`;
});

// --- Boucle + compteur FPS -----------------------------------------------
const fpsEl = document.getElementById('fps');
let frames = 0, last = performance.now();

renderer.setAnimationLoop(() => {
  blocks.forEach((m, i) => (m.position.y = Math.sin(performance.now() / 800 + i) * 0.1));
  controls.update();
  renderer.render(scene, camera);
  frames++;
  const now = performance.now();
  if (now - last >= 1000) { fpsEl.textContent = `${frames} FPS`; frames = 0; last = now; }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
