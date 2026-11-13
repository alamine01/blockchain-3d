// Les 9 étapes de « L'Affaire Émile ». Chaque étape = une notion + une interaction.
import * as THREE from 'three';
import { C, CSS, FONT_TITLE, makeSprite } from './engine.js?v=20261113e';
import { BlockMesh, ChainView, sendPacket, sparks } from './objects.js?v=20261113e';
import { DIFFICULTY, prefix, computeHash, mineSync, nextBlock, setData, clone, describe } from './chain.js?v=20261113e';

export const AREAS = {
  nodes: new THREE.Vector3(0, 0, -30),
  registre: new THREE.Vector3(0, 0, 0),
  labo: new THREE.Vector3(0, 0, 18),
  mine: new THREE.Vector3(0, 0, -60),
};
export const CAMERAS = {
  nodes: [[0, 10.5, -11.5], [0, 1.2, -32]],
  registre: [[0, 5, 17], [0, 0, 0]],
  labo: [[0, 3.2, 27.5], [0, 0.2, 18]],
  mine: [[0, 4.5, -48.5], [0, 1.4, -60]],
};

const NAMES = ['Marc', 'Sofia', 'Karim', 'Léa'];

// ---------- petits utilitaires d'affichage ----------
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
function hashHTML(h, d = DIFFICULTY) {
  const zeros = h.match(/^0*/)[0];
  const ok = zeros.length >= d;
  return `<code class="hash ${ok ? 'is-ok' : 'is-bad'}"><span class="zeros">${zeros}</span>${h.slice(zeros.length)}</code>`;
}
const short = (h) => `${h.slice(0, 10)}…`;

// Effet « décodage » : les caractères d'une empreinte défilent avant de se fixer.
const HEX = '0123456789abcdef';
function scramble(container, ms = 450) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  container.querySelectorAll('code.hash').forEach((code) => {
    const finalHTML = code.innerHTML;
    const text = code.textContent;
    const t0 = performance.now();
    code.classList.add('decoding');
    const tick = (now) => {
      const k = Math.min((now - t0) / ms, 1);
      if (k >= 1 || !code.isConnected) { code.innerHTML = finalHTML; code.classList.remove('decoding'); return; }
      const fixed = Math.floor(text.length * k);
      code.textContent = text.slice(0, fixed) + [...text.slice(fixed)].map(() => HEX[(Math.random() * 16) | 0]).join('');
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function blockPicker(n, label = 'Bloc') {
  return `<div class="blockpick" role="group" aria-label="Choisir un bloc">${Array.from({ length: n }, (_, i) =>
    `<button type="button" data-i="${i}" aria-label="${label} ${i + 1}">${i + 1}</button>`).join('')}</div>`;
}
function markPicked(root, i) {
  root.querySelectorAll('.blockpick button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.i === i)));
}
function addLine(el, html, cls = '') {
  const p = document.createElement('p');
  p.className = cls;
  p.innerHTML = html;
  el.appendChild(p);
  el.scrollTop = el.scrollHeight;
}
function titleSprite(ctx, text, pos, width = 8) {
  const s = makeSprite([{ text: text.toUpperCase(), size: 64, color: CSS.warn, font: FONT_TITLE, weight: 800 }], width);
  s.position.copy(pos);
  ctx.group.add(s);
  return s;
}

// Prépare les 4 ordinateurs pour une étape « réseau ».
function setupStations(ctx, { lea = 'tampered', slice, chains = true, emile = false } = {}) {
  for (const name of NAMES) {
    const st = ctx.stations[name];
    let source = name === 'Léa' && lea === 'tampered' ? ctx.tampered : ctx.honest;
    if (slice) source = source.slice(0, slice);
    st.setChain(clone(source));
    st.chain.visible = chains;
    st.setStatus('ordinateur');
  }
  ctx.emile.visible = emile;
}

// ======================================================================
export const steps = [
  // ---------------------------------------------------------------- 0
  {
    id: 'dossier', title: 'Le dossier', tag: 'Introduction', area: 'nodes',
    missions: [['read', 'Lire le dossier, puis passer au chapitre 1']],
    story: `<p>Émile, 82 ans, est mort le mois dernier. Passionné d'informatique, il gérait l'argent de la famille avec un <strong>registre partagé</strong> : une blockchain. Chacun de ses quatre petits-enfants en garde une copie sur son ordinateur.</p>
      <p class="aside">💰 Dans ce registre, l'argent se compte en <strong>jetons</strong> : une monnaie numérique propre à la famille, qui n'existe que dans le registre. Pour simplifier, imaginez que <strong>1 jeton = 1 euro</strong>. Le bitcoin est un exemple célèbre de jeton.</p>
      <p>Chez le notaire, <strong>Léa</strong> affirme qu'Émile lui a donné <strong>50 000 jetons</strong> (soit 50 000 €) juste avant sa mort, et sa copie du registre semble le prouver. Si c'est vrai, elle hérite de presque tout. Marc, Sofia et Karim jurent que c'est faux.</p>
      <p>Vous êtes l'enquêteur. Chaque chapitre vous fait découvrir un principe de la blockchain, et chaque principe devient une <strong>preuve</strong> épinglée sur le mur, derrière les ordinateurs.</p>`,
    retenir: `Une blockchain est un registre de comptes que <strong>plusieurs personnes conservent en même temps</strong>. Personne ne détient « l'original ».`,
    enter(ctx) {
      setupStations(ctx, { chains: false, emile: true });
      ctx.ui.html(`<div class="cast">${NAMES.map((n) => `<div><strong>${n}</strong><span>${n === 'Léa' ? 'réclame 50 000 jetons' : 'conteste'}</span></div>`).join('')}</div>
        <button type="button" class="primary" data-next>Ouvrir le dossier</button>`);
      ctx.done('read');
    },
  },

  // ---------------------------------------------------------------- 1
  {
    id: 'piece', title: 'La pièce à conviction', tag: 'Notion 1 · Structure d’un bloc', area: 'registre',
    missions: [['open', 'Ouvrir un bloc et lire ses 4 champs'], ['parent', 'Ouvrir le bloc suivant : son « empreinte du bloc précédent » est-elle la même ?']],
    story: `<p>Le notaire vous confie la copie de <strong>Marc</strong>. Le registre est découpé en <strong>blocs</strong>, comme les pages d'un cahier. Chaque bloc garde quelques opérations.</p>
      <p>Cliquez sur un cube pour ouvrir le bloc et lire ce qu'il contient.</p>`,
    retenir: `Un bloc contient : <strong>des données</strong> (les paiements), <strong>son empreinte</strong> (hash), <strong>l'empreinte du bloc précédent</strong> et un <strong>nonce</strong>, le nombre trouvé par le minage.`,
    enter(ctx) {
      const chain = clone(ctx.honest);
      const view = new ChainView(ctx.engine, chain, { onPick: (i) => select(i) });
      view.position.copy(AREAS.registre);
      ctx.group.add(view);
      ctx.track(() => view.dispose());
      titleSprite(ctx, 'Registre — copie de Marc', new THREE.Vector3(0, 3.4, -2), 6);

      const root = ctx.ui.html(`${blockPicker(chain.length)}
        <div id="fields" class="fields"><p class="hint">Aucun bloc ouvert.</p></div>
        <button type="button" class="ghost" id="overview">Revenir à la vue d'ensemble</button>`);
      root.querySelectorAll('.blockpick button').forEach((b) => b.addEventListener('click', () => select(+b.dataset.i)));
      root.querySelector('#overview').addEventListener('click', () => {
        view.selected = -1; view.refresh(); markPicked(root, -1);
        ctx.engine.flyTo(...CAMERAS.registre, 800);
      });

      const opened = new Set();
      function select(i) {
        view.selected = i;
        view.refresh();
        markPicked(root, i);
        ctx.engine.flyTo([view.x(i) + 0.8, 1.6, 7.5], [view.x(i), 0.2, 0], 800);
        ctx.done('open');
        if (opened.has(i - 1) || opened.has(i + 1)) ctx.done('parent');
        opened.add(i);
        const b = chain[i];
        const prevNote = i === 0
          ? `<span class="note">Premier bloc (« genèse ») : il n'a pas de parent, on y met des zéros.</span>`
          : `<span class="note ok">= l'empreinte du bloc ${i}. C'est ce qui accroche les blocs entre eux.</span>`;
        root.querySelector('#fields').innerHTML = `
          <dl>
            <dt>Numéro</dt><dd>Bloc ${i + 1}</dd>
            <dt>Données</dt><dd>${esc(b.data)}</dd>
            <dt>Nonce</dt><dd><code>${b.nonce}</code> <span class="note">nombre trouvé en minant (étape 5)</span></dd>
            <dt>Empreinte (hash)</dt><dd>${hashHTML(b.hash)}<span class="note">calculée à partir de tout le contenu du bloc. Elle commence par ${DIFFICULTY} zéros : c'est le « sceau » du minage.</span></dd>
            <dt>Empreinte du bloc précédent</dt><dd>${hashHTML(b.prev, 0)}${prevNote}</dd>
          </dl>`;
        scramble(root.querySelector('#fields'));
      }
    },
  },

  // ---------------------------------------------------------------- 2
  {
    id: 'labo', title: 'Le labo des empreintes', tag: 'Notion 2 · Chaînage cryptographique', area: 'labo',
    missions: [['edit', 'Changer une seule lettre ou un chiffre dans les données'], ['remine', 'Re-miner ce bloc : le lien avec le suivant est-il réparé ?']],
    story: `<p>Avant d'examiner la copie de Léa, un expert vous montre comment fonctionne une <strong>empreinte</strong> (hash). Voici trois blocs d'essai.</p>
      <p>Modifiez les données d'un bloc, même une seule lettre, et regardez son empreinte et le lien avec le bloc suivant.</p>`,
    retenir: `Le même contenu donne toujours la même empreinte. <strong>La moindre modification donne une empreinte complètement différente.</strong> Comme chaque bloc recopie l'empreinte du précédent, toucher un bloc casse le lien avec le suivant.`,
    enter(ctx) {
      const chain = clone(ctx.honest.slice(0, 3));
      const original = clone(chain);
      let cur = 1;
      const view = new ChainView(ctx.engine, chain, { spacing: 2.6, size: 1.6, onPick: (i) => select(i) });
      view.position.copy(AREAS.labo);
      ctx.group.add(view);
      ctx.track(() => view.dispose());
      titleSprite(ctx, 'Blocs d’essai', new THREE.Vector3(0, 2.4, 18), 5);

      const root = ctx.ui.html(`${blockPicker(3)}
        <label class="field" for="labData">Données du bloc <span id="labN"></span></label>
        <input id="labData" type="text" autocomplete="off" spellcheck="false">
        <div class="compare">
          <p><span class="lbl">Empreinte d'origine</span>${hashHTML(original[cur].hash)}</p>
          <p><span class="lbl">Empreinte maintenant</span><span id="labNow"></span></p>
          <p id="labDiff" class="note"></p>
          <p id="labLink"></p>
        </div>
        <div class="row">
          <button type="button" id="labMine">Re-miner ce bloc</button>
          <button type="button" class="ghost" id="labReset">Tout remettre</button>
        </div>
        <div id="labOut" class="out" aria-live="polite"></div>`);
      const input = root.querySelector('#labData');
      root.querySelectorAll('.blockpick button').forEach((b) => b.addEventListener('click', () => select(+b.dataset.i)));
      input.addEventListener('input', () => {
        setData(chain[cur], input.value);
        view.updateLabel(cur);
        render();
        scramble(root.querySelector('#labNow'), 250);
        if (chain[cur].data !== original[cur].data) ctx.done('edit');
      });
      root.querySelector('#labMine').addEventListener('click', () => {
        mineSync(chain[cur]);
        render();
        scramble(root.querySelector('#labNow'));
        if (chain[cur].data !== original[cur].data) ctx.done('remine');
        root.querySelector('#labOut').innerHTML = cur < 2 && chain[cur + 1].prev !== chain[cur].hash
          ? `<p>Le bloc ${cur + 1} a de nouveau un sceau valide (nonce ${chain[cur].nonce}). Mais le bloc ${cur + 2} garde l'ancienne empreinte : <strong>le lien reste cassé</strong>. Il faudrait re-miner tous les blocs suivants.</p>`
          : `<p>Le bloc ${cur + 1} a de nouveau un sceau valide (nonce ${chain[cur].nonce}).</p>`;
      });
      root.querySelector('#labReset').addEventListener('click', () => {
        chain.forEach((b, i) => Object.assign(b, original[i]));
        chain.forEach((_, i) => view.updateLabel(i));
        root.querySelector('#labOut').innerHTML = '';
        select(cur);
      });

      function select(i) {
        cur = i;
        view.selected = -1;
        markPicked(root, i);
        root.querySelector('#labN').textContent = i + 1;
        input.value = chain[i].data;
        root.querySelector('.compare p').innerHTML = `<span class="lbl">Empreinte d'origine</span>${hashHTML(original[i].hash)}`;
        render();
      }
      function render() {
        const st = view.refresh({ cascade: true });
        const now = chain[cur].hash;
        const diff = [...now].filter((c, k) => c !== original[cur].hash[k]).length;
        root.querySelector('#labNow').innerHTML = hashHTML(now);
        root.querySelector('#labDiff').textContent = diff === 0
          ? 'Identique à l’origine.'
          : `${diff} caractères sur 64 ont changé.${st[cur].sealOk ? '' : ' Elle ne commence plus par 000 : le sceau est brisé.'}`;
        const next = chain[cur + 1];
        root.querySelector('#labLink').innerHTML = next
          ? (next.prev === now
            ? `<span class="ok">✓ Le bloc ${cur + 2} reconnaît bien ce bloc (il a noté la même empreinte).</span>`
            : `<span class="bad">✗ Le bloc ${cur + 2} a noté <code>${short(next.prev)}</code> : il ne reconnaît plus ce bloc.</span>`)
          : `<span class="note">C'est le dernier bloc : aucun bloc ne dépend de lui pour l'instant.</span>`;
      }
      select(1);
      ctx.later(400).then(() => input.focus({ preventScroll: true }));
    },
  },

  // ---------------------------------------------------------------- 3
  {
    id: 'crime', title: 'La scène du crime', tag: 'Notion 3 · Immutabilité et falsification', area: 'registre',
    missions: [['find', 'Trouver le bloc falsifié et l’ouvrir'], ['restore', 'Remettre la version d’origine : la chaîne redevient-elle verte ?']],
    story: `<p>Voici maintenant la copie de <strong>Léa</strong>, celle qui « prouve » les 50 000 jetons. Le scanner de l'enquêteur la vérifie bloc par bloc. Où la chaîne se casse-t-elle, et pourquoi ?</p>
      <p>Ensuite, essayez vous-même : modifiez un bloc, puis remettez la version d'origine.</p>`,
    retenir: `Modifier un ancien bloc change son empreinte. Le bloc suivant ne le reconnaît plus, et <strong>tous les blocs après lui deviennent invalides</strong>, comme des dominos. La falsification se voit tout de suite.`,
    enter(ctx) {
      const chain = clone(ctx.tampered);
      const view = new ChainView(ctx.engine, chain, { onPick: (i) => select(i) });
      view.position.copy(AREAS.registre);
      view.override = 'neutral';
      view.refresh();
      ctx.group.add(view);
      ctx.track(() => view.dispose());
      titleSprite(ctx, 'Registre — copie de Léa', new THREE.Vector3(0, 3.4, -2), 6);
      let cur = -1;

      const root = ctx.ui.html(`<p id="banner" class="banner">Examen en cours…</p>
        ${blockPicker(chain.length)}
        <div id="fields" class="fields"><p class="hint">Cliquez sur un bloc pour l'examiner.</p></div>`);
      root.querySelectorAll('.blockpick button').forEach((b) => b.addEventListener('click', () => select(+b.dataset.i)));

      // Le scanner balaie la chaîne de gauche à droite et colore chaque bloc vérifié.
      const beam = new THREE.Mesh(
        new THREE.PlaneGeometry(0.12, 3.2),
        new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }),
      );
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 3.2),
        new THREE.MeshBasicMaterial({ color: 0xffb547, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      beam.add(glow);
      beam.position.set(view.x(0) - 1.5, 0.2, 1);
      beam.rotation.y = 0;
      ctx.group.add(beam);
      view.override = null;
      view.revealed = -1;
      update(false);
      const x0 = view.x(0) - 1.5, x1 = view.x(chain.length - 1) + 1.5;
      ctx.later(500).then((ok) => ok && ctx.engine.tween(3000, (k) => {
        beam.position.x = x0 + (x1 - x0) * k;
        const r = chain.findLastIndex((_, i) => view.x(i) <= beam.position.x);
        if (r !== view.revealed) { view.revealed = r; update(false); }
      }, (t) => t)).then(() => {
        if (!ctx.alive()) return;
        view.revealed = Infinity;
        update(false);
        ctx.engine.tween(400, (k) => { beam.material.opacity = 0.85 * (1 - k); glow.material.opacity = 0.12 * (1 - k); });
      });

      function update(cascade) {
        const st = view.refresh({ cascade });
        const first = st.findIndex((s) => !s.valid);
        const banner = root.querySelector('#banner');
        banner.className = `banner ${first < 0 ? 'ok' : 'bad'}`;
        const scanning = view.revealed !== Infinity;
        banner.textContent = scanning
          ? 'Scanner en cours…'
          : first < 0
            ? '✓ Chaîne intacte : chaque bloc reconnaît le précédent.'
            : `✗ Chaîne rompue à partir du bloc ${first + 1}.`;
        if (scanning) banner.className = 'banner';
        if (!scanning && first < 0 && chain[6].data === ctx.honest[6].data) ctx.done('restore');
        if (cur >= 0) fields(st);
        return st;
      }
      function select(i) {
        cur = i;
        view.selected = i;
        markPicked(root, i);
        if (i === 6 && chain[6].data !== ctx.honest[6].data) ctx.done('find');
        ctx.engine.flyTo([view.x(i) + 0.8, 1.6, 7.5], [view.x(i), 0.2, 0], 800);
        fields(update(false));
      }
      function fields(st) {
        const b = chain[cur];
        const s = st[cur];
        const next = chain[cur + 1];
        const origin = ctx.honest[cur].data;
        root.querySelector('#fields').innerHTML = `
          <dl>
            <dt>Bloc ${cur + 1} — données</dt>
            <dd><input id="crimeData" type="text" value="${esc(b.data)}" aria-label="Données du bloc ${cur + 1}" spellcheck="false"></dd>
            <dt>Empreinte recalculée</dt><dd>${hashHTML(s.hash)}
              <span class="note ${s.sealOk ? 'ok' : 'bad'}">${s.sealOk ? `Commence par ${DIFFICULTY} zéros : sceau valide.` : 'Ne commence pas par 000 : ce bloc a été modifié après le minage.'}</span></dd>
            ${next ? `<dt>Empreinte notée dans le bloc ${cur + 2}</dt><dd>${hashHTML(next.prev, 0)}
              <span class="note ${next.prev === s.hash ? 'ok' : 'bad'}">${next.prev === s.hash ? '✓ Identique : le lien tient.' : '✗ Différente : le bloc suivant ne reconnaît plus ce bloc.'}</span></dd>` : ''}
          </dl>
          ${b.data !== origin ? `<button type="button" id="restore">Remettre la version d'origine : « ${esc(origin)} »</button>` : ''}`;
        const input = root.querySelector('#crimeData');
        input.addEventListener('change', () => { setData(chain[cur], input.value); view.updateLabel(cur); fields(update(true)); });
        root.querySelector('#restore')?.addEventListener('click', () => {
          setData(chain[cur], origin);
          view.updateLabel(cur);
          fields(update(false));
        });
      }
    },
  },

  // ---------------------------------------------------------------- 4
  {
    id: 'temoins', title: 'Les témoins', tag: 'Notion 4 · Réseau et décentralisation', area: 'nodes',
    missions: [['compare', 'Comparer les 4 copies du registre'], ['gossip', 'Diffuser une opération et la suivre de nœud en nœud']],
    story: `<p>Léa répond : « Ma copie est celle d'Émile ! » Il n'existe pourtant <strong>pas de registre central</strong> : chaque petit-enfant est un <strong>nœud</strong> du réseau et garde sa propre copie.</p>
      <p>Cliquez sur un ordinateur pour lire son bloc 7, puis comparez les quatre copies. Regardez aussi comment une nouvelle opération circule.</p>`,
    retenir: `Chaque nœud a une copie complète et vérifie tout lui-même. Les opérations passent <strong>de voisin en voisin</strong>, sans serveur central. Une copie différente de toutes les autres est <strong>rejetée</strong>.`,
    enter(ctx) {
      setupStations(ctx);
      const root = ctx.ui.html(`<div class="row">
          <button type="button" class="primary" id="compare">Comparer les 4 copies</button>
          <button type="button" id="gossip">Diffuser une nouvelle opération</button>
        </div>
        <div class="row">${NAMES.map((n) => `<button type="button" class="ghost" data-n="${n}">Lire chez ${n}</button>`).join('')}</div>
        <div id="out" class="out" aria-live="polite"></div>`);
      const out = root.querySelector('#out');
      const inspect = (name) => {
        const st = ctx.stations[name];
        const b = st.chain.blocks[6];
        const valid = st.chain.status()[6].valid;
        st.flash(valid ? C.ok : C.bad);
        addLine(out, `<strong>${name}</strong>, bloc 7 : « ${esc(b.data)} » — empreinte ${hashHTML(computeHash(b))} ${valid ? '<span class="ok">✓ valide</span>' : '<span class="bad">✗ invalide</span>'}`);
      };
      ctx.onStationClick = inspect;
      root.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => inspect(b.dataset.n)));

      root.querySelector('#compare').addEventListener('click', async (e) => {
        e.currentTarget.disabled = true;
        out.innerHTML = '';
        for (const n of NAMES) {
          inspect(n);
          if (!(await ctx.later(700))) return;
        }
        const ref = ctx.honest[6].data;
        const same = NAMES.filter((n) => ctx.stations[n].chain.blocks[6].data === ref);
        addLine(out, `<strong>${same.length} copies sur 4</strong> disent « ${esc(ref)} ». La copie de Léa est la seule différente, et sa chaîne est cassée : les autres nœuds la <strong>rejettent</strong>.`, 'verdict');
        ctx.stations['Léa'].setStatus('COPIE REJETÉE', CSS.bad);
        ctx.done('compare');
      });

      root.querySelector('#gossip').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        const S = ctx.stations;
        addLine(out, `Sofia crée l'opération « Sofia → Karim : 15 jetons » et l'envoie à ses voisins.`);
        S.Sofia.flash(C.warn);
        await Promise.all([
          sendPacket(ctx.engine, ctx.group, S.Sofia.anchor(), S.Marc.anchor()).then(() => S.Marc.flash(C.warn)),
          sendPacket(ctx.engine, ctx.group, S.Sofia.anchor(), S.Karim.anchor()).then(() => S.Karim.flash(C.warn)),
        ]);
        if (!ctx.alive()) return;
        addLine(out, `Marc et Karim la vérifient, puis la relaient à leurs propres voisins.`);
        await sendPacket(ctx.engine, ctx.group, S.Karim.anchor(), S['Léa'].anchor());
        if (!ctx.alive()) return;
        S['Léa'].flash(C.warn);
        addLine(out, `En quelques instants, <strong>tous les nœuds</strong> connaissent l'opération. Personne n'a eu besoin d'un serveur central.`);
        ctx.done('gossip');
        btn.disabled = false;
      });
    },
  },

  // ---------------------------------------------------------------- 5
  {
    id: 'alibi', title: 'L’alibi de Léa', tag: 'Notion 5 · Validation et minage', area: 'mine',
    missions: [['mine', 'Miner le bloc 10 (essayez aussi avec 0000)'], ['race', 'Lancer la course entre Léa et le réseau']],
    story: `<p>Léa se défend : « Il suffit que je recalcule mes blocs pour que ma copie redevienne valide ! » Pour sceller un bloc, il faut <strong>miner</strong> : trouver un nombre, le <strong>nonce</strong>, qui donne une empreinte commençant par plusieurs zéros.</p>
      <p>Minez le bloc 10 vous-même, puis lancez la course entre Léa et le reste du réseau.</p>`,
    retenir: `Miner, c'est essayer des nonces un par un jusqu'à trouver une empreinte valide : <strong>long à trouver, instantané à vérifier</strong>. Chaque zéro de plus multiplie le travail par 16. Un tricheur seul ne peut pas aller plus vite que tout le réseau.`,
    enter(ctx) {
      const center = AREAS.mine;
      const block = { index: 9, data: 'Marc → Sofia : 20 jetons', prev: ctx.honest[8].hash, nonce: 0 };
      block.hash = computeHash(block);
      const mesh = new BlockMesh(1.8, true);
      mesh.setText('BLOC 10', 'Marc → Sofia', '20 jetons');
      mesh.position.set(center.x, 3, center.z);
      ctx.group.add(mesh);
      let difficulty = 3;
      let stopMining = null;

      const root = ctx.ui.html(`<fieldset class="diff"><legend>Difficulté : zéros exigés au début de l'empreinte</legend>
          ${[1, 2, 3, 4].map((d) => `<label><input type="radio" name="diff" value="${d}" ${d === 3 ? 'checked' : ''}> ${'0'.repeat(d)}</label>`).join('')}
        </fieldset>
        <button type="button" class="primary" id="mine">Miner le bloc 10</button>
        <div class="minestats" aria-live="off">
          <p>Nonce essayé : <b id="nonce">0</b></p>
          <p id="hash">${hashHTML(block.hash, difficulty)}</p>
        </div>
        <div id="mineOut" class="out" aria-live="polite"></div>
        <hr>
        <p>Léa doit re-miner les blocs 7, 8 et 9 de sa copie, seule avec <strong>1 ordinateur</strong>. Pendant ce temps, Marc, Sofia et Karim, avec <strong>3 ordinateurs</strong>, continuent d'ajouter des blocs.</p>
        <button type="button" id="race">Lancer la course : Léa contre le réseau</button>
        <div id="raceOut" class="out" aria-live="polite"></div>`);
      const $ = (s) => root.querySelector(s);
      root.querySelectorAll('[name=diff]').forEach((r) => r.addEventListener('change', () => { difficulty = +r.value; $('#hash').innerHTML = hashHTML(block.hash, difficulty); }));

      $('#mine').addEventListener('click', () => {
        if (stopMining) { stopMining(); stopMining = null; $('#mine').textContent = 'Reprendre le minage'; return; }
        const p = prefix(difficulty);
        block.nonce = 0;
        const t0 = performance.now();
        mesh.setState('warn');
        $('#mine').textContent = 'Arrêter';
        $('#mineOut').innerHTML = '';
        root.querySelectorAll('[name=diff]').forEach((r) => { r.disabled = true; });
        stopMining = ctx.engine.onFrame((dt) => {
          mesh.rotation.y += dt * 0.004;
          for (let k = 0; k < 80; k++) {
            block.hash = computeHash(block);
            if (block.hash.startsWith(p)) {
              stopMining(); stopMining = null;
              mesh.setState('ok');
              ctx.engine.tween(400, (t) => { mesh.rotation.y *= 1 - t; });
              sparks(ctx.engine, ctx.group, mesh.position.clone(), C.ok, 90);
              const sealed = makeSprite([{ text: 'SCELLÉ ✓', size: 80, color: CSS.ok, font: FONT_TITLE, weight: 900 }], 2.6);
              sealed.position.copy(mesh.position).add(new THREE.Vector3(0, 1.7, 0));
              ctx.group.add(sealed);
              ctx.engine.tween(700, (t) => sealed.scale.set(2.6 * (0.6 + 0.4 * t), 0.65 * (0.6 + 0.4 * t), 1));
              ctx.done('mine');
              $('#mine').textContent = 'Miner à nouveau';
              root.querySelectorAll('[name=diff]').forEach((r) => { r.disabled = false; });
              $('#nonce').textContent = block.nonce;
              $('#hash').innerHTML = hashHTML(block.hash, difficulty);
              scramble($('#hash'), 300);
              $('#mineOut').innerHTML = `<p class="ok">✓ Trouvé après <strong>${(block.nonce + 1).toLocaleString('fr-FR')} essais</strong> (${((performance.now() - t0) / 1000).toFixed(1)} s).</p>
                <p>Pour vérifier, les autres nœuds n'ont besoin que d'<strong>un seul calcul</strong> : ils recalculent l'empreinte avec le nonce ${block.nonce} et voient qu'elle commence bien par ${p}.</p>`;
              return;
            }
            block.nonce++;
          }
          $('#nonce').textContent = block.nonce.toLocaleString('fr-FR');
          $('#hash').innerHTML = hashHTML(block.hash, difficulty);
        });
        ctx.track(() => stopMining?.());
      });

      $('#race').addEventListener('click', (e) => {
        e.currentTarget.disabled = true;
        const rows = new THREE.Group();
        rows.position.copy(center);
        ctx.group.add(rows);
        const size = 0.42, spacing = 0.6, x0 = -4.6;
        const makeRow = (y, states) => states.map((s, i) => {
          const m = new BlockMesh(size, false);
          m.setState(s);
          m.position.set(x0 + i * spacing, y, 0);
          rows.add(m);
          return m;
        });
        const lea = makeRow(1.15, ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'bad', 'bad', 'bad']);
        const net = makeRow(0.1, Array(9).fill('ok'));
        const l1 = makeSprite([{ text: 'Léa', size: 60, color: CSS.bad }], 1.6); l1.position.set(x0 - 1.3, 1.15, 0); rows.add(l1);
        const l2 = makeSprite([{ text: 'Réseau', size: 60, color: CSS.ok }], 1.6); l2.position.set(x0 - 1.3, 0.1, 0); rows.add(l2);
        let resealed = 0, netCount = 9, tLea = 0, tNet = 0;
        const out = $('#raceOut');
        const show = () => { out.innerHTML = `<p>Copie de Léa : 9 blocs, dont <strong>${resealed}/3</strong> re-minés.<br>Chaîne du réseau : <strong>${netCount} blocs</strong>.</p>`; };
        show();
        const stop = ctx.engine.onFrame((dt) => {
          tLea += dt; tNet += dt;
          if (tNet >= 1000 && netCount < 18) {
            tNet = 0;
            const m = new BlockMesh(size, false);
            m.setState('ok');
            m.position.set(x0 + netCount * spacing, 0.1, 0);
            rows.add(m);
            ctx.engine.tween(300, (k) => m.scale.setScalar(Math.max(k, 0.01)));
            netCount++;
            show();
          }
          if (tLea >= 3000 && resealed < 3) {
            tLea = 0;
            lea[6 + resealed].setState('warn');
            resealed++;
            show();
            if (resealed === 3) {
              stop();
              ctx.done('race');
              out.innerHTML += `<p class="verdict">Léa a enfin re-miné ses 3 blocs… mais pendant ce temps le réseau en a ajouté ${netCount - 9}. Sa chaîne (9 blocs) est <strong>plus courte</strong> que celle du réseau (${netCount} blocs). Les nœuds suivent la chaîne qui contient le plus de travail : la copie de Léa est ignorée. <strong>Son alibi tombe.</strong></p>`;
            }
          }
        });
        ctx.track(stop);
      });
    },
  },

  // ---------------------------------------------------------------- 6
  {
    id: 'proces', title: 'Le procès', tag: 'Notion 6 · Deux mécanismes de consensus', area: 'nodes',
    missions: [['pow', 'Lancer une manche en preuve de travail'], ['pos', 'Passer en preuve d’enjeu et tirer un validateur'], ['slash', 'Voir ce que Léa perd si elle triche en preuve d’enjeu']],
    story: `<p>L'avocat de Léa attaque : « Qui a décidé que la chaîne des autres était la bonne ? » Réponse : une <strong>règle commune</strong>, le <strong>consensus</strong>, que tous les nœuds appliquent pour choisir qui ajoute le bloc suivant.</p>
      <p>Comparez les deux règles les plus connues. Basculez de l'une à l'autre et lancez quelques manches.</p>`,
    retenir: `<strong>Preuve de travail (PoW)</strong> : le premier qui trouve le nonce écrit le bloc. Très sûr, mais énormément d'énergie perdue. <strong>Preuve d'enjeu (PoS)</strong> : un validateur est tiré au sort selon sa caution, et il la perd s'il triche. Économe, mais avantage ceux qui possèdent le plus.`,
    enter(ctx) {
      setupStations(ctx);
      ctx.stations['Léa'].setStatus('COPIE REJETÉE', CSS.bad);
      const S = ctx.stations;
      const honestNames = ['Marc', 'Sofia', 'Karim'];
      let props = new THREE.Group();
      ctx.group.add(props);
      let mode = 'pow';
      let energy = 0;
      const stakes = { Marc: 30, Sofia: 20, Karim: 25, 'Léa': 25 };
      let slashed = false;
      let busy = false;

      const root = ctx.ui.html(`<div class="seg" role="group" aria-label="Mécanisme de consensus">
          <button type="button" data-mode="pow" aria-pressed="true">Preuve de travail (PoW)</button>
          <button type="button" data-mode="pos" aria-pressed="false">Preuve d'enjeu (PoS)</button>
        </div>
        <div id="modeBox"></div>
        <div id="out" class="out" aria-live="polite"></div>
        <table class="cmp">
          <thead><tr><th></th><th>PoW</th><th>PoS</th></tr></thead>
          <tbody>
            <tr><th>Le droit d'écrire vient de…</th><td>la puissance de calcul</td><td>la caution en jetons</td></tr>
            <tr><th>Avantage</th><td>éprouvé depuis 2009 (Bitcoin)</td><td>très peu d'énergie (Ethereum depuis 2022)</td></tr>
            <tr><th>Limite</th><td>consommation d'énergie énorme</td><td>les plus riches ont plus de chances</td></tr>
            <tr><th>Le tricheur…</th><td>gaspille son électricité</td><td>perd sa caution</td></tr>
          </tbody>
        </table>`);
      const out = root.querySelector('#out');
      const box = root.querySelector('#modeBox');

      function trimChains() {
        for (const n of NAMES) if (S[n].chain.blocks.length >= 13) S[n].setChain(clone(n === 'Léa' ? ctx.tampered : ctx.honest));
      }
      function appendHonest(name) {
        trimChains();
        const ref = S.Marc.chain.blocks;
        const ops = ['Sofia → Karim : 10 jetons', 'Karim → Marc : 5 jetons', 'Marc → Sofia : 12 jetons', 'Sofia → Léa : 8 jetons'];
        const blk = nextBlock(ref, ops[ref.length % ops.length]);
        honestNames.forEach((n) => S[n].chain.append({ ...blk }));
      }

      function buildPow() {
        props.removeFromParent(); props = new THREE.Group(); ctx.group.add(props);
        const bars = {};
        for (const n of NAMES) {
          const geo = new THREE.BoxGeometry(0.35, 1, 0.35); geo.translate(0, 0.5, 0);
          const bar = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: C.warn, emissive: 0x3a2c08 }));
          bar.position.copy(S[n].position).add(new THREE.Vector3(1.7, -1.2, 1.1));
          bar.scale.y = 0.01;
          props.add(bar);
          bars[n] = bar;
        }
        box.innerHTML = `<p>Les 4 ordinateurs cherchent le nonce en même temps. Le premier qui trouve écrit le bloc.</p>
          <button type="button" class="primary" id="round">Lancer une manche de minage</button>
          <p>Énergie dépensée (simulée) : <b id="energy">${energy.toFixed(1)}</b> kWh</p>`;
        box.querySelector('#round').addEventListener('click', () => {
          if (busy) return;
          busy = true;
          const speed = Object.fromEntries(NAMES.map((n) => [n, 0.5 + Math.random()]));
          const prog = Object.fromEntries(NAMES.map((n) => [n, 0]));
          const stop = ctx.engine.onFrame((dt) => {
            let winner = null;
            for (const n of NAMES) {
              prog[n] = Math.min(1, prog[n] + (dt / 2200) * speed[n]);
              bars[n].scale.y = Math.max(0.01, prog[n] * 2.1);
              energy += dt * 0.0012;
              if (prog[n] >= 1 && !winner) winner = n;
            }
            box.querySelector('#energy').textContent = energy.toFixed(1);
            if (!winner) return;
            stop();
            busy = false;
            S[winner].flash(winner === 'Léa' ? C.bad : C.ok);
            if (winner === 'Léa') {
              const own = S['Léa'].chain.blocks;
              S['Léa'].chain.append(nextBlock(own, 'Émile → Léa : 1 000 jetons'));
              honestNames.forEach((n) => S[n].flash(C.bad));
              addLine(out, `<strong>Léa</strong> a trouvé le nonce la première, mais son bloc s'appuie sur sa copie falsifiée : les trois autres nœuds le <strong>refusent</strong>.`);
            } else {
              appendHonest(winner);
              addLine(out, `<strong>${winner}</strong> a trouvé le nonce le premier : son bloc est ajouté par tous les nœuds honnêtes. Le calcul des 3 autres ordinateurs a été dépensé pour rien.`);
            }
            ctx.done('pow');
            ctx.later(600).then((ok) => { if (ok) Object.values(bars).forEach((b) => { b.scale.y = 0.01; }); });
          });
          ctx.track(stop);
        });
      }

      function buildPos() {
        props.removeFromParent(); props = new THREE.Group(); ctx.group.add(props);
        const cyl = {};
        const labels = {};
        for (const n of NAMES) {
          const geo = new THREE.CylinderGeometry(0.35, 0.35, 1, 24); geo.translate(0, 0.5, 0);
          const c = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.6, roughness: 0.35 }));
          c.position.copy(S[n].position).add(new THREE.Vector3(1.7, -1.2, 1.1));
          c.scale.y = (n === 'Léa' && slashed ? 5 : stakes[n]) / 15;
          props.add(c);
          cyl[n] = c;
          const s = makeSprite([{ text: `${n === 'Léa' && slashed ? 5 : stakes[n]} jetons`, size: 72, color: CSS.warn }], 1.8);
          s.position.copy(c.position).add(new THREE.Vector3(0, c.scale.y + 0.45, 0));
          props.add(s);
          labels[n] = s;
        }
        box.innerHTML = `<p>Chacun a déposé une <strong>caution</strong> (les pièces dorées). Plus la caution est grosse, plus on a de chances d'être tiré au sort pour écrire le bloc.</p>
          <div class="row"><button type="button" class="primary" id="draw">Tirer au sort le validateur</button>
          <button type="button" id="fraud" ${slashed ? 'disabled' : ''}>Léa propose un bloc frauduleux</button></div>`;
        box.querySelector('#draw').addEventListener('click', async () => {
          if (busy) return;
          busy = true;
          const pool = NAMES.filter((n) => !(n === 'Léa' && slashed));
          const total = pool.reduce((s, n) => s + stakes[n], 0);
          let r = Math.random() * total;
          const pick = pool.find((n) => (r -= stakes[n]) < 0) || pool[0];
          for (let k = 0; k < 8; k++) {
            S[pool[k % pool.length]].flash(C.warn, 200);
            if (!(await ctx.later(160))) return;
          }
          busy = false;
          if (pick === 'Léa') { ctx.done('pos'); slash(); return; }
          S[pick].flash(C.ok);
          appendHonest(pick);
          ctx.done('pos');
          addLine(out, `<strong>${pick}</strong> (caution ${stakes[pick]} jetons) est tiré au sort. Les autres vérifient son bloc et l'acceptent. Presque aucune énergie n'a été dépensée.`);
        });
        box.querySelector('#fraud')?.addEventListener('click', slash);
        function slash() {
          if (slashed) return;
          slashed = true;
          S['Léa'].flash(C.bad);
          ctx.engine.tween(900, (k) => {
            cyl['Léa'].scale.y = (25 - 20 * k) / 15;
            labels['Léa'].position.y = cyl['Léa'].position.y + cyl['Léa'].scale.y + 0.45;
          });
          labels['Léa'].userData.draw([{ text: '5 jetons (−20)', size: 72, color: CSS.bad }]);
          box.querySelector('#fraud').disabled = true;
          ctx.done('slash');
          addLine(out, `<strong>Léa</strong> propose un bloc qui s'appuie sur sa copie falsifiée. Les autres validateurs le vérifient et le refusent : <strong>20 de ses 25 jetons de caution sont confisqués</strong>. Tricher lui coûte cher.`, 'bad');
        }
      }

      root.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => {
        if (busy) return;
        mode = b.dataset.mode;
        root.querySelectorAll('[data-mode]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        (mode === 'pow' ? buildPow : buildPos)();
      }));
      buildPow();
    },
  },

  // ---------------------------------------------------------------- 7
  {
    id: 'reconstitution', title: 'La reconstitution', tag: 'Notion 7 · Vie d’une transaction et attaque', area: 'nodes',
    missions: [['life', 'Rejouer les 5 étapes du vrai paiement d’Émile'], ['double', 'Rejouer la double dépense de Léa et voir comment elle est bloquée']],
    story: `<p>L'ordinateur d'Émile, au centre, a gardé son dernier paiement, <strong>signé</strong> de sa main numérique. Pour clore l'affaire, vous le rejouez étape par étape, à partir de l'état des copies juste avant : 6 blocs.</p>
      <p>Puis vous rejouez une autre ruse de Léa : dépenser deux fois les mêmes jetons.</p>`,
    retenir: `Une transaction est <strong>créée</strong>, <strong>propagée</strong>, <strong>vérifiée</strong> par chaque nœud, <strong>incluse</strong> dans un bloc miné, puis <strong>confirmée</strong> par les blocs suivants. Une <strong>double dépense</strong> est refusée : les jetons sont déjà inscrits comme dépensés.`,
    enter(ctx) {
      setupStations(ctx, { lea: 'honest', slice: 6, emile: true });
      const S = ctx.stations;
      const E = ctx.emile;
      const stages = ['Créer la transaction', 'La propager', 'La faire vérifier', 'L’inclure dans un bloc', 'Attendre les confirmations'];
      let stage = 0;
      const root = ctx.ui.html(`<ol class="stages" id="stages">${['Création', 'Propagation', 'Validation', 'Inclusion dans un bloc', 'Confirmation'].map((s) => `<li>${s}</li>`).join('')}</ol>
        <button type="button" class="primary" id="nextStage">1. ${stages[0]}</button>
        <div id="out" class="out" aria-live="polite"></div>
        <hr>
        <h3>La double dépense</h3>
        <p>Léa possède 440 jetons (500 reçus d'Émile, 60 donnés à Sofia). Elle envoie <strong>les mêmes 440 jetons</strong> à Marc <em>et</em> à Karim, en même temps.</p>
        <button type="button" id="attack" disabled>Rejouer la double dépense</button>
        <div id="out2" class="out" aria-live="polite"></div>`);
      const $ = (s) => root.querySelector(s);
      const out = $('#out');
      const btn = $('#nextStage');
      let tx = null;
      let label = null;

      btn.addEventListener('click', async () => {
        btn.disabled = true;
        root.querySelectorAll('#stages li').forEach((li, k) => li.classList.toggle('done', k <= stage));
        const ok = await runStage(stage);
        if (!ok) return;
        stage++;
        if (stage < stages.length) { btn.textContent = `${stage + 1}. ${stages[stage]}`; btn.disabled = false; } else {
          btn.textContent = 'Paiement confirmé ✓';
          $('#attack').disabled = false;
        }
      });

      async function runStage(k) {
        if (k === 0) {
          tx = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 14), new THREE.MeshBasicMaterial({ color: C.packet }));
          tx.position.copy(E.anchor(1.6));
          ctx.group.add(tx);
          label = makeSprite([{ text: 'Émile → Léa : 500 jetons', size: 44, color: CSS.warn }, { text: 'signé par Émile', size: 34, weight: 400, color: CSS.muted }], 4, { h: 160 });
          label.position.copy(tx.position).add(new THREE.Vector3(0, 0.9, 0));
          ctx.group.add(label);
          await ctx.engine.tween(500, (t) => tx.scale.setScalar(Math.max(t, 0.01)));
          addLine(out, `<strong>Création</strong> : Émile écrit « Émile → Léa : 500 jetons » et le <strong>signe</strong> avec sa clé secrète. Seul lui pouvait le faire.`);
          return ctx.alive();
        }
        if (k === 1) {
          label.visible = false;
          tx.visible = false;
          await Promise.all(NAMES.map((n) => sendPacket(ctx.engine, ctx.group, E.anchor(1.6), S[n].anchor(), { arc: 1.8 }).then(() => S[n].flash(C.warn))));
          addLine(out, `<strong>Propagation</strong> : la transaction part de l'ordinateur d'Émile et circule jusqu'aux 4 nœuds.`);
          return ctx.alive();
        }
        if (k === 2) {
          for (const n of NAMES) {
            S[n].flash(C.ok);
            addLine(out, `<strong>${n}</strong> vérifie : signature d'Émile correcte, et Émile possède bien 500 jetons ✓`);
            if (!(await ctx.later(450))) return false;
          }
          return true;
        }
        if (k === 3) {
          S.Karim.flash(C.warn, 1400);
          addLine(out, `<strong>Inclusion</strong> : Karim trouve le nonce le premier. Il place la transaction dans le <strong>bloc 7</strong>, que tous ajoutent à leur copie.`);
          await Promise.all(NAMES.map((n) => S[n].chain.append({ ...ctx.honest[6] })));
          return ctx.alive();
        }
        if (k === 4) {
          for (const j of [7, 8]) {
            if (!(await ctx.later(500))) return false;
            await Promise.all(NAMES.map((n) => S[n].chain.append({ ...ctx.honest[j] })));
            addLine(out, `Bloc ${j + 1} ajouté par-dessus : <strong>${j - 5} confirmation${j - 5 > 1 ? 's' : ''}</strong>.`);
          }
          addLine(out, `Plus il y a de blocs au-dessus du bloc 7, plus il est difficile à modifier. Le vrai montant était donc bien <strong>500 jetons</strong>, pas 50 000.`, 'verdict');
          ctx.done('life');
          return ctx.alive();
        }
        return true;
      }

      $('#attack').addEventListener('click', async (e) => {
        e.currentTarget.disabled = true;
        const out2 = $('#out2');
        const L = S['Léa'];
        const A = 'Léa → Marc : 440 jetons';
        const B = 'Léa → Karim : 440 jetons';
        addLine(out2, `Léa envoie au même moment <strong>A</strong> « ${A} » vers Marc et Sofia, et <strong>B</strong> « ${B} » vers Karim.`);
        await Promise.all([
          sendPacket(ctx.engine, ctx.group, L.anchor(), S.Marc.anchor()),
          sendPacket(ctx.engine, ctx.group, L.anchor(), S.Sofia.anchor()),
          sendPacket(ctx.engine, ctx.group, L.anchor(), S.Karim.anchor(), { color: 0xb48cf2 }),
        ]);
        if (!ctx.alive()) return;
        S.Sofia.flash(C.ok, 1200);
        addLine(out2, `Sofia mine le <strong>bloc 10</strong> avec la transaction A. Tous les nœuds l'ajoutent.`);
        const blk = nextBlock(S.Marc.chain.blocks, A);
        await Promise.all(NAMES.map((n) => S[n].chain.append({ ...blk })));
        if (!(await ctx.later(400))) return;
        const bad = await sendPacket(ctx.engine, ctx.group, S.Karim.anchor(), S.Sofia.anchor(), { color: 0xb48cf2, keep: true });
        if (!ctx.alive()) return;
        bad.material.color.setHex(C.bad);
        sparks(ctx.engine, ctx.group, bad.position.clone(), C.bad, 80);
        NAMES.forEach((n) => S[n].flash(C.bad));
        addLine(out2, `Karim relaie la transaction B. Chaque nœud vérifie : les 440 jetons de Léa sont <strong>déjà dépensés dans le bloc 10</strong>. B est <strong>refusée partout</strong>.`, 'bad');
        await ctx.engine.tween(800, (t) => bad.scale.setScalar(Math.max(1 - t, 0.01)));
        ctx.done('double');
        addLine(out2, `Limite : si Léa contrôlait plus de la moitié de la puissance de calcul du réseau (« attaque des 51 % »), elle pourrait réécrire les blocs récents. C'est pour cela qu'on attend plusieurs confirmations.`, 'note');
      });
    },
  },

  // ---------------------------------------------------------------- 8
  {
    id: 'verdict', title: 'Le verdict', tag: 'Conclusion', area: 'nodes',
    missions: [['accuse', 'Désigner le coupable']],
    story: `<p>Vous avez toutes les preuves. Qui a falsifié le registre d'Émile ?</p>
      <p>Cliquez sur l'ordinateur du coupable, ou choisissez son nom.</p>`,
    retenir: `Une blockchain ne se modifie jamais : <strong>on la complète</strong>. Grâce aux empreintes, aux copies partagées et au consensus, <strong>personne ne peut tricher seul</strong>, sans avoir besoin de faire confiance à un banquier ou à un notaire.`,
    enter(ctx) {
      setupStations(ctx);
      ctx.board.markGuilty(false);
      const root = ctx.ui.html(`<div class="row">${NAMES.map((n) => `<button type="button" data-n="${n}">${n}</button>`).join('')}</div>
        <div id="out" class="out" aria-live="polite"></div>`);
      const out = root.querySelector('#out');
      const accuse = (n) => {
        out.innerHTML = '';
        if (n === 'Léa') {
          ctx.stations['Léa'].setStatus('COUPABLE', CSS.bad);
          ctx.board.markGuilty(true);
          ctx.ui.stamp();
          ctx.done('accuse');
          ctx.engine.flyTo([0, 3.2, -25.5], [0, 2.3, -41.5], 1600);
          ctx.stations['Léa'].flash(C.bad, 1500);
          ['Marc', 'Sofia', 'Karim'].forEach((m) => ctx.stations[m].flash(C.ok, 1500));
          out.innerHTML = `<p class="verdict ok"><strong>Affaire résolue.</strong> Léa a modifié le bloc 7 de sa copie pour changer 500 en 50 000 jetons.</p>
            <h3>Ce que l'enquête vous a appris</h3>
            <ol class="recap">
              <li><strong>Un bloc</strong> garde des données, son empreinte, l'empreinte du bloc précédent et un nonce.</li>
              <li><strong>L'empreinte</strong> change complètement à la moindre modification, et chaque bloc recopie celle du précédent.</li>
              <li><strong>Falsifier</strong> le bloc 7 a brisé son sceau et cassé tous les blocs suivants : c'était visible.</li>
              <li><strong>Le réseau</strong> : chaque nœud a sa copie ; celle de Léa était la seule différente, donc rejetée.</li>
              <li><strong>Le minage</strong> : re-sceller ses blocs seule était trop lent face au reste du réseau.</li>
              <li><strong>Le consensus</strong> : en PoW la triche coûte de l'énergie, en PoS elle coûte sa caution.</li>
              <li><strong>Une transaction</strong> est créée, propagée, vérifiée, incluse puis confirmée ; la double dépense est refusée.</li>
            </ol>
            <p class="note">Regardez le mur des preuves : chaque fil rouge mène à Léa.</p>
            <button type="button" class="primary" data-goto="0">Recommencer l'enquête</button>`;
        } else {
          ctx.stations[n].flash(C.warn);
          out.innerHTML = `<p class="verdict bad"><strong>Non.</strong> La copie de ${n} est identique à celles de la majorité et sa chaîne est valide du premier au dernier bloc.</p>
            <button type="button" data-goto="4">Revoir l'étape 4 : les témoins</button>`;
        }
      };
      ctx.onStationClick = accuse;
      root.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => accuse(b.dataset.n)));
    },
  },
];
