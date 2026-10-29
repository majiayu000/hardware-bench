import { SITE, BOARD, PIN_TYPES, LESSONS } from 'content';
import ZH from 'content-zh';
import { findPin } from './board-geometry.js';
import { createSim, ledCurrent, ledVerdict } from './sims.js';
import { highlightLines, icon } from './ui.js';
import { create2dViewer } from './view2d.js';
import { t, lang, setLang, addDict, observe } from './i18n.js';
import { startGuide } from './guide.js';
import { LINKS } from '../boards/boards.js';

addDict(ZH);

const $ = (sel) => document.querySelector(sel);
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);
// Lesson text supports `code` and **bold**; everything else is escaped.
const inline = (s) => escape(t(s)).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const pad = (n) => String(n).padStart(2, '0');

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(`${SITE.id}:${key}`);
      return v == null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`${SITE.id}:${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn(`Could not save "${key}"; it will reset on reload.`, err);
    }
  },
};

const settings = { callouts: true, grid: true, turntable: false, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, ...store.get('settings', {}) };
const state = { index: 0, tab: 'overview', done: new Set(store.get('done', [])), viewer: null, is3d: false, sim: null, term: null, routed: null, params: {}, selected: null, thumbs: {} };
const lesson = () => LESSONS[state.index];
const circuitParts = () => lesson().circuit?.parts ?? [];
const partSpec = (id) => circuitParts().find((p) => p.id === id);
const pinLabel = (pin) => (pin.alt ? `${pin.name} · ${t(pin.alt)}` : pin.name);
function pinText(key) {
  const found = findPin(BOARD, key);
  if (!found) throw new Error(`Unknown pin "${key}"`);
  return { ...found, text: t('{h} pin {n}', { h: t(found.header.short ?? found.header.label), n: found.pin.n }), label: pinLabel(found.pin) };
}

// ---------- theme ----------

function applyTheme(theme) {
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}
// The theme is shared by the hub and every board.
const THEME_KEY = 'learn-hardware:theme';
const savedTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
applyTheme(savedTheme());
$('#themeToggle').addEventListener('click', () => {
  const current = document.documentElement.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (err) {
    console.warn('Could not save the theme.', err);
  }
});

// ---------- parameters set from part popovers ----------

const DEFAULTS = { distance: 40, value: 0.5, angle: 90 };
// Range controls shown as sliders in part popovers: label and how to print the value.
const RANGES = { distance: ['Object distance', (v) => `${v} cm`, 1], value: ['Knob position', (v) => `${Math.round(v * 100)}%`, 0.01], angle: ['Servo angle', (v) => `${v}°`, 1] };
function param(id, key) {
  const k = `${id}.${key}`;
  if (k in state.params) return state.params[k];
  return partSpec(id)?.[key] ?? DEFAULTS[key];
}
function setParam(id, key, value) {
  state.params[`${id}.${key}`] = value;
  if (key !== 'distance') state.viewer?.setPart(id, { [key]: value });
  state.sim?.paramChanged?.(id, key, value);
  renderPopover();
}

// ---------- viewer ----------

const tooltip = $('#tooltip');
function describe(info) {
  if (info?.kind === 'pin') {
    const role = lesson().wiring?.find((w) => w.pin === info.key);
    const { text, label } = pinText(info.key);
    return `<b>${escape(text)}</b>${escape(label)}${role ? `<br>→ ${inline(role.to)}` : ''}`;
  }
  if (info?.kind === 'component') return `<b>${escape(info.label)}</b>${escape(info.desc ?? '')}`;
  if (info?.kind === 'part' && info.id !== 'breadboard') {
    const p = partSpec(info.id);
    return p ? `<b>${escape(p.label ?? p.id)}</b>${escape(p.desc ?? 'Click for details')}` : null;
  }
  return null;
}
function showTooltip(info) {
  const html = describe(info);
  if (!html) { tooltip.hidden = true; return; }
  tooltip.innerHTML = html;
  tooltip.hidden = false;
  const flip = info.x > $('.stage').clientWidth - 280;
  tooltip.style.left = `${info.x}px`;
  tooltip.style.top = `${info.y}px`;
  tooltip.style.transform = flip ? 'translate(calc(-100% - 12px), 12px)' : 'translate(12px, 12px)';
}

function onSelect(info) {
  if (!info || info.kind === 'board' || info.id === 'breadboard') { selectRef(null); return; }
  if (info.kind === 'pin') selectRef({ pin: info.key });
  else if (info.kind === 'component') selectRef({ component: info.id });
  else selectRef({ part: info.id });
}
function selectRef(ref) {
  state.selected = ref;
  state.viewer?.select(ref);
  renderPopover();
}
function onPress(id, pressed) {
  const spec = partSpec(id);
  if (spec?.type !== 'button' && spec?.type !== 'casebutton') return false;
  if (!state.sim?.input?.(id, pressed)) state.viewer.setPart(id, { pressed });
  return true;
}

const lessonFocus = () => ({ pins: lesson().focus?.pins ?? [], components: lesson().focus?.components ?? [] });
const focusBoard = (sel) => state.viewer?.highlight(sel ?? lessonFocus());

async function initViewer() {
  const container = $('#viewport');
  const handlers = { accent: SITE.accent, onHover: showTooltip, onSelect, onPress, onInteract: setInteracting };
  try {
    const { webglAvailable, createBoardScene } = await import('./board3d.js');
    $('#stageLoading')?.remove();
    if (!webglAvailable()) throw new Error('WebGL unavailable');
    state.viewer = createBoardScene(container, BOARD, handlers);
    state.is3d = true;
    $('#toolbar').title = t('Drag to orbit · right-drag or WASD to pan · Q/E to turn · scroll to zoom');
  } catch (err) {
    console.warn('3D viewer disabled:', err);
    const reason = err.message === 'WebGL unavailable'
      ? t('this browser has WebGL (hardware acceleration) turned off.')
      : t('the 3D engine failed to load ({err}).', { err: err.message });
    container.innerHTML = '';
    state.viewer = create2dViewer(container, BOARD, t('Showing a flat top view: {reason}', { reason }));
    Object.assign(state.viewer.handlers, handlers);
    document.body.classList.add('no-3d');
  }
  state.viewer.setOptions(settings);
  state.viewer.onFrame(updateOverlay);
  showLessonScene();
  if (state.is3d) {
    // Render lesson thumbnails one per frame after the scene is up, so the first view is not delayed.
    const queue = LESSONS.filter((l) => l.icon && !l.icon.glyph);
    const next = () => {
      const l = queue.shift();
      if (!l) return;
      state.thumbs[l.id] = state.viewer.thumbnail(l.icon, l.circuit);
      if (!queue.length && $('#sidePop').dataset.view === 'lessons') openSidePop('lessons');
      setTimeout(next, 30);
    };
    setTimeout(next, 300);
  }
}

function showLessonScene() {
  const v = state.viewer;
  if (!v) return;
  v.setCircuit(lesson().circuit ?? null, lesson().view);
  for (const p of circuitParts()) {
    if (p.type === 'resistor') v.setPart(p.id, { ohms: param(p.id, 'ohms') });
    if (p.type === 'led') v.setPart(p.id, { color: param(p.id, 'color') });
  }
  focusBoard();
  selectRef(null);
  buildCallouts();
}

// ---------- overlay: numbered marks and their key, bubbles, popover, minimap ----------

// Callouts are drawn like an assembly diagram: a numbered mark on the part and a matching row in the key.
const overlay = { interacting: false, settle: 0, bubbles: {} };
const calloutRef = (c) => (c.pin ? { pin: c.pin } : c.part ? { part: c.part } : { component: c.component });

function buildCallouts() {
  const list = settings.callouts ? lesson().callouts ?? [] : [];
  $('#marks').innerHTML = list.map((c, i) => `<button type="button" class="mark" data-i="${i}" aria-label="${escape(t(c.title))}">${i + 1}</button>`).join('');
  $('#keyList').innerHTML = list.map((c, i) => `<li data-i="${i}"><span class="mark-num">${i + 1}</span>${c.icon ? `<span class="key-ico">${icon(c.icon, 15)}</span>` : ''}<span><b>${escape(c.title)}</b> ${inline(c.text ?? '')}</span></li>`).join('');
  $('#key').hidden = list.length === 0;
  overlay.bubbles = {};
  $('#bubbles').innerHTML = '';
  placeKey();
}
// On a wide stage the key is a column on the right and the 3D view centres the board beside it;
// on a narrow one it is a collapsed panel over the bottom of the view.
function placeKey() {
  const key = $('#key');
  const wide = $('.stage').clientWidth >= 760;
  key.classList.toggle('side', wide);
  if (!wide) key.open = false;
  state.viewer?.setOptions({ inset: wide && !key.hidden ? key.offsetWidth + 24 : 0 });
}
new ResizeObserver(() => placeKey()).observe($('.stage'));
function hiliteMark(i) {
  document.querySelectorAll('.mark, #keyList li').forEach((el) => el.classList.toggle('hot', el.dataset.i === String(i)));
}
$('#marks').addEventListener('click', (ev) => {
  const i = ev.target.closest('.mark')?.dataset.i;
  if (i == null) return;
  const ref = calloutRef(lesson().callouts[i]);
  selectRef(ref);
  state.viewer?.zoomTo(ref);
});
for (const id of ['#marks', '#keyList']) {
  $(id).addEventListener('pointerover', (ev) => { const i = ev.target.closest('[data-i]')?.dataset.i; if (i != null) hiliteMark(i); });
  $(id).addEventListener('pointerout', () => hiliteMark(null));
}
$('#keyList').addEventListener('click', (ev) => {
  const i = ev.target.closest('[data-i]')?.dataset.i;
  if (i != null) state.viewer?.zoomTo(calloutRef(lesson().callouts[i]));
});

function setInteracting(active) {
  overlay.interacting = active;
  clearTimeout(overlay.settle);
  $('#minimap').classList.toggle('show', active && state.is3d);
  if (!active) overlay.settle = setTimeout(() => $('#minimap').classList.remove('show'), 1200);
}

const MARK_GAP = 26; // centre-to-centre distance that keeps two 26 px marks from overlapping
function updateOverlay() {
  const list = settings.callouts ? lesson().callouts ?? [] : [];
  const placed = [];
  list.forEach((c, i) => {
    const mark = $(`.mark[data-i="${i}"]`);
    const p = state.viewer.project(calloutRef(c));
    if (!mark) return;
    mark.hidden = !p;
    if (!p) return;
    // Neighbouring pins share a spot: push a mark out of the ones already placed, by exactly the
    // overlap, so it slides smoothly as the camera moves instead of jumping (straight up if they coincide).
    let { x, y } = p;
    for (let pass = 0; pass < 3; pass += 1) {
      for (const q of placed) {
        const d = Math.hypot(x - q.x, y - q.y);
        if (d >= MARK_GAP) continue;
        const [ux, uy] = d > 0.5 ? [(x - q.x) / d, (y - q.y) / d] : [0, -1];
        x = q.x + ux * MARK_GAP;
        y = q.y + uy * MARK_GAP;
      }
    }
    placed.push({ x, y });
    // `translate` (not `transform`) so the hover `scale` grows the mark in place instead of scaling its offset.
    mark.style.translate = `${x}px ${y}px`;
  });
  for (const [id, text] of Object.entries(overlay.bubbles)) {
    const el = $(`#bubbles [data-id="${CSS.escape(id)}"]`);
    const p = state.viewer.project({ part: id });
    if (el && p) el.style.transform = `translate(${p.x}px, ${p.y - 14}px) translate(-50%, -100%)`;
    if (el && el.textContent !== text) el.textContent = text;
  }
  if ($('#minimap').classList.contains('show')) drawMinimap();
}

function setBubble(id, text) {
  if (!id) return;
  if (text == null) {
    delete overlay.bubbles[id];
    $(`#bubbles [data-id="${CSS.escape(id)}"]`)?.remove();
    return;
  }
  if (!(id in overlay.bubbles)) $('#bubbles').insertAdjacentHTML('beforeend', `<span class="bubble" data-id="${escape(id)}"></span>`);
  overlay.bubbles[id] = text;
}

function drawMinimap() {
  const view = state.viewer.mapView();
  const canvas = $('#minimap');
  const g = canvas.getContext('2d');
  const xs = view.rects.flatMap((r) => [r.x, r.x + r.w]);
  const zs = view.rects.flatMap((r) => [r.z, r.z + r.d]);
  const [minX, maxX, minZ, maxZ] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)];
  const s = Math.min((canvas.width - 24) / (maxX - minX), (canvas.height - 24) / (maxZ - minZ));
  const X = (x) => 12 + (x - minX) * s + ((canvas.width - 24) - (maxX - minX) * s) / 2;
  const Z = (z) => 12 + (z - minZ) * s + ((canvas.height - 24) - (maxZ - minZ) * s) / 2;
  g.clearRect(0, 0, canvas.width, canvas.height);
  for (const r of view.rects) {
    g.fillStyle = r.kind === 'board' ? BOARD.pcbColor : '#efe9dc';
    g.strokeStyle = '#24222c';
    g.fillRect(X(r.x), Z(r.z), r.w * s, r.d * s);
    g.strokeRect(X(r.x), Z(r.z), r.w * s, r.d * s);
  }
  const cx = X(view.target.x);
  const cz = Z(view.target.z);
  g.fillStyle = 'rgb(197 26 74 / 25%)';
  g.beginPath();
  g.moveTo(cx - Math.sin(view.heading) * 40, cz - Math.cos(view.heading) * 40);
  g.arc(cx - Math.sin(view.heading) * 40, cz - Math.cos(view.heading) * 40, 34, Math.PI / 2 - view.heading - 0.45, Math.PI / 2 - view.heading + 0.45);
  g.fill();
}

function renderPopover() {
  const pop = $('#partPop');
  const ref = state.selected;
  if (!ref) { pop.hidden = true; pop.innerHTML = ''; return; }
  let title;
  let desc;
  let controls = '';
  if (ref.pin) {
    const { text, label } = pinText(ref.pin);
    const role = lesson().wiring?.find((w) => w.pin === ref.pin);
    title = `${text} · ${label}`;
    desc = role ? t('Connects to {to}', { to: t(role.to) }) : 'Not used in this lesson.';
  } else if (ref.component) {
    const c = BOARD.components.find((x) => x.id === ref.component);
    title = c.label;
    desc = c.desc;
  } else {
    const p = partSpec(ref.part);
    title = p.label ?? p.id;
    desc = p.desc ?? '';
    for (const [key, opts] of Object.entries(p.controls ?? {})) {
      const cur = param(p.id, key);
      if (RANGES[key]) {
        const [min, max] = opts;
        const [defaultLabel, fmt, step] = RANGES[key];
        const label = p.controlLabel ?? defaultLabel;
        controls += `<label class="pop-label">${label}</label><div class="slider-row"><span></span><input type="range" min="${min}" max="${max}" step="${step}" value="${cur}" data-param="${key}"><output>${fmt(cur)}</output></div>`;
      } else {
        const fmt = (v) => (key === 'ohms' ? (v >= 1000 ? `${v / 1000} kΩ` : `${v} Ω`) : v);
        controls += `<label class="pop-label">${key === 'ohms' ? 'Resistance' : 'Colour'}</label><div class="seg">${opts.map((v) => `<button type="button" data-param="${key}" data-v="${v}" aria-pressed="${v === cur}">${escape(fmt(v))}</button>`).join('')}</div>`;
      }
      if (key === 'ohms' && p.drives) controls += `<p class="pop-note">${ledVerdict(ledCurrent(SITE.logicVolts ?? 3.3, param(p.drives, 'color') ?? 'red', cur), SITE.pinLimitMa)}</p>`;
      if (key === 'color') controls += `<p class="pop-note">${ledVerdict(ledCurrent(SITE.logicVolts ?? 3.3, cur, circuitParts().find((r) => r.drives === p.id) ? param(circuitParts().find((r) => r.drives === p.id).id, 'ohms') : 330), SITE.pinLimitMa)}</p>`;
    }
  }
  const canRun = lesson().sim && lesson().run;
  pop.innerHTML = `<div class="pop-head"><b>${escape(title)}</b><button type="button" class="icon-btn sm" data-act="close" aria-label="Close">${icon('close', 16)}</button></div>
    <p>${inline(desc ?? '')}</p>${controls}
    <div class="pop-actions"><button type="button" class="chip-btn" data-act="zoom">${icon('target', 14)} Zoom to it</button>${canRun ? `<button type="button" class="chip-btn accent" data-act="run">${icon('play', 14)} Run to see it</button>` : ''}${ref.pin ? `<button type="button" class="chip-btn" data-act="pinout">Pinout</button>` : ''}</div>`;
  pop.hidden = false;
}

$('#partPop').addEventListener('click', (ev) => {
  const t = ev.target.closest('button');
  if (!t) return;
  const ref = state.selected;
  if (t.dataset.param) {
    const key = t.dataset.param;
    setParam(ref.part, key, key === 'ohms' ? Number(t.dataset.v) : t.dataset.v);
    return;
  }
  if (t.dataset.act === 'close') selectRef(null);
  if (t.dataset.act === 'zoom') state.viewer.zoomTo(ref);
  if (t.dataset.act === 'pinout') go(state.index, 'wiring');
  if (t.dataset.act === 'run') {
    go(state.index, 'try');
    route();
    $('#termMount [data-act="run"]:not([disabled])')?.click();
  }
});
$('#partPop').addEventListener('input', (ev) => {
  const key = ev.target.dataset.param;
  if (!key) return;
  const v = Number(ev.target.value);
  ev.target.nextElementSibling.textContent = RANGES[key][1](v);
  state.params[`${state.selected.part}.${key}`] = v;
  if (key !== 'distance') state.viewer.setPart(state.selected.part, { [key]: v });
  state.sim?.paramChanged?.(state.selected.part, key, v);
});

// ---------- toolbar, keys, side rail ----------

$('#toolbar').addEventListener('click', (ev) => {
  const act = ev.target.closest('[data-act]')?.dataset.act;
  const v = state.viewer;
  if (act === 'rotl') v.rotateBy(-Math.PI / 4);
  if (act === 'rotr') v.rotateBy(Math.PI / 4);
  if (act === 'zin') v.zoomBy(0.8);
  if (act === 'zout') v.zoomBy(1.25);
  if (act === 'reset') v.resetView();
  if (act === 'labels') toggleSetting('callouts');
});
document.addEventListener('keydown', (ev) => {
  if (ev.target.closest('input, textarea, button, select') || ev.metaKey || ev.ctrlKey) return;
  const k = ev.key.toLowerCase();
  const v = state.viewer;
  const moves = { w: [0, 1], s: [0, -1], a: [-1, 0], d: [1, 0] };
  if (moves[k]) { v.pan(...moves[k]); setInteracting(true); setInteracting(false); }
  if (k === 'q') v.rotateBy(-Math.PI / 8);
  if (k === 'e') v.rotateBy(Math.PI / 8);
  if (k === 'escape') { selectRef(null); closeSidePop(); }
  if (ev.key === 'ArrowRight') go(state.index + 1, 'overview');
  if (ev.key === 'ArrowLeft') go(state.index - 1, 'overview');
});

function toggleSetting(key) {
  settings[key] = !settings[key];
  store.set('settings', settings);
  state.viewer?.setOptions(settings);
  if (key === 'callouts') buildCallouts();
  if ($('#sidePop').dataset.view === 'settings') openSidePop('settings');
}

const SIDE_VIEWS = {
  lessons: () => `<h4>Lessons <small>${state.done.size}/${LESSONS.length} done</small></h4><ol class="lesson-grid">${LESSONS.map((l, i) => `<li><button type="button" data-lesson="${i}" ${i === state.index ? 'aria-current="true"' : ''}>${state.thumbs[l.id] ? `<img src="${state.thumbs[l.id]}" alt="">` : `<span class="glyph">${icon(lessonGlyph(l), 24)}</span>`}<span class="t"><span class="num">${pad(i + 1)}</span>${escape(l.short ?? l.title)}</span>${state.done.has(l.id) ? '<span class="ok">✓</span>' : ''}</button></li>`).join('')}</ol>`,
  components: () => {
    const items = [...circuitParts().map((p) => ({ ref: `part:${p.id}`, label: p.label ?? p.id, desc: p.desc })), ...BOARD.components.map((c) => ({ ref: `component:${c.id}`, label: c.label, desc: c.desc }))];
    return `<h4>Components <small>${items.length} in view</small></h4><ul class="pop-list">${items.map((it) => `<li><button type="button" data-ref="${escape(it.ref)}"><span class="num">${icon('target', 14)}</span><span><b>${escape(it.label)}</b><small>${escape(it.desc ?? '')}</small></span></button></li>`).join('')}</ul>`;
  },
  settings: () => `<h4>Settings</h4>${[['callouts', 'Numbered labels', 'Numbers on the parts and the key that explains them'], ['grid', 'Floor grid', 'The faint grid under the board'], ['turntable', 'Turntable', 'Slowly turn the scene when idle'], ['reducedMotion', 'Reduce motion', 'Jump instead of animating']].map(([k, t, d]) => `<label class="toggle"><span><b>${t}</b><small>${d}</small></span><input type="checkbox" data-setting="${k}" ${settings[k] ? 'checked' : ''}></label>`).join('')}<button type="button" class="btn ghost" data-act="reset-progress">Reset progress</button><a class="pop-link" href="${LINKS.issues}" target="_blank" rel="noopener">Found a mistake? Tell us</a>`,
};
function openSidePop(view) {
  const pop = $('#sidePop');
  pop.dataset.view = view;
  pop.innerHTML = SIDE_VIEWS[view]();
  pop.hidden = false;
  document.querySelectorAll('.topnav [data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
}
function closeSidePop() {
  $('#sidePop').hidden = true;
  $('#sidePop').dataset.view = '';
  document.querySelectorAll('.topnav [data-view]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
}
$('.topnav').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (!b) return;
  if ($('#sidePop').dataset.view === b.dataset.view) closeSidePop(); else openSidePop(b.dataset.view);
});
$('#sidePop').addEventListener('click', (ev) => {
  const b = ev.target.closest('button');
  if (b?.dataset.lesson) { closeSidePop(); go(Number(b.dataset.lesson), 'overview'); }
  if (b?.dataset.ref) {
    const [kind, ...id] = b.dataset.ref.split(':');
    const ref = { [kind]: id.join(':') };
    selectRef(ref);
    state.viewer.zoomTo(ref);
  }
  if (b?.dataset.act === 'reset-progress') { state.done.clear(); store.set('done', []); renderRail(); updateDone(); openSidePop('settings'); }
});
$('#sidePop').addEventListener('change', (ev) => { if (ev.target.dataset.setting) toggleSetting(ev.target.dataset.setting); });

// ---------- lesson rail & progress ----------

const ICON_FOR = { board: 'chip', led: 'led', resistor: 'resistor', button: 'button', rgbled: 'led', pot: 'knob', module: 'sensor', camera: 'camera' };
const lessonGlyph = (l) => l.icon?.glyph ?? ICON_FOR[l.icon === 'board' ? 'board' : l.icon?.type] ?? 'chip';
// The step bar: one numbered square per lesson, filled when done.
function renderRail() {
  $('#lessonRail').innerHTML = LESSONS.map((l, i) => `<li><button type="button" class="step${state.done.has(l.id) ? ' done' : ''}" data-i="${i}" title="${escape(t(l.title))}" ${i === state.index ? 'aria-current="true"' : ''}>${i + 1}</button></li>`).join('');
  updateDone();
}
function updateDone() {
  $('#progressFill').style.width = `${(state.done.size / LESSONS.length) * 100}%`;
  $('#progressCount').textContent = `${state.done.size}/${LESSONS.length}`;
}
function markDone(id, on = true) {
  if (on) state.done.add(id); else state.done.delete(id);
  store.set('done', [...state.done]);
  document.querySelector(`.step[data-i="${LESSONS.findIndex((l) => l.id === id)}"]`)?.classList.toggle('done', on);
  updateDone();
}
$('#lessonRail').addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-i]');
  if (btn) go(Number(btn.dataset.i), 'overview');
});

// ---------- tab content ----------

function renderBlocks(blocks = []) {
  return blocks.map((b) => {
    if (typeof b === 'string') return `<p>${inline(b)}</p>`;
    if (b.h) return `<h3>${inline(b.h)}</h3>`;
    if (b.steps) return `<ol class="steps">${b.steps.map((s) => `<li>${inline(s)}</li>`).join('')}</ol>`;
    if (b.tips) return `<ul class="tips">${b.tips.map(([ic, s]) => `<li><span class="tip-ico">${icon(ic, 18)}</span><span>${inline(s)}</span></li>`).join('')}</ul>`;
    if (b.note) return `<div class="note${b.tone === 'warn' ? ' warn' : ''}">${inline(b.note)}</div>`;
    if (b.specs) return `<div class="spec-grid">${b.specs.map(([k, v]) => `<div><small>${inline(k)}</small><span>${inline(v)}</span></div>`).join('')}</div>`;
    if (b.cmd) return codeBlock({ file: 'terminal', lang: 'bash', source: b.cmd });
    throw new Error(`Unknown content block: ${JSON.stringify(b)}`);
  }).join('');
}

let codeSeq = 0;
function codeBlock(file, { id = `code-${codeSeq += 1}`, compact = false } = {}) {
  const lines = highlightLines(file.source.trim(), file.lang);
  return `<div class="code${compact ? ' compact' : ''}"><div class="code-head"><span data-no-i18n>${escape(file.file)}</span><button type="button" data-copy="${id}" aria-label="Copy code">${icon('copy', 14)} Copy</button></div>
    <pre id="${id}" data-raw="${escape(file.source.trim())}">${lines.map((l, i) => `<span class="ln" data-line="${i + 1}"><i>${i + 1}</i>${l || ' '}</span>`).join('')}</pre></div>`;
}

function pinoutMarkup(header, onKeys) {
  const cell = (pin) => `<button type="button" class="pin-cell${onKeys.has(`${header.id}:${pin.n}`) ? ' on' : ''}" data-pin="${escape(`${header.id}:${pin.n}`)}" aria-label="Pin ${pin.n}, ${escape(pinLabel(pin))}"><i class="pin-dot t-${pin.type}"></i>${pin.n}</button>`;
  const label = (pin, side) => `<span class="pin-label ${side}${onKeys.has(`${header.id}:${pin.n}`) ? ' on' : ''}">${escape(pinLabel(pin))}</span>`;
  const byN = new Map(header.pins.map((p) => [p.n, p]));
  const rows = [];
  if (header.layout === 'dual') {
    for (let n = 1; n <= header.pins.length; n += 2) rows.push(label(byN.get(n), 'left') + cell(byN.get(n)) + cell(byN.get(n + 1)) + label(byN.get(n + 1), 'right'));
  } else {
    for (const p of header.pins) rows.push(`${cell(p)}${label(p, 'right')}<span></span>`);
  }
  return `<h3>${escape(header.label)}</h3><div class="pinout ${header.layout === 'dual' ? 'dual' : 'single'}">${rows.join('')}</div>`;
}

const TABS = {
  overview: { label: 'Overview', has: () => true, render: (l) => renderBlocks(l.overview) },
  wiring: {
    label: (l) => (l.wiring ? 'Wiring' : 'Pinout'),
    has: (l) => Boolean(l.wiring) || BOARD.headers.length > 0,
    render(l) {
      const pins = lessonFocus().pins;
      let html = '';
      if (l.wiring) {
        html += `<table class="wires"><thead><tr><th>Board</th><th>Connect to</th></tr></thead><tbody>${l.wiring.map((w) => {
          const { pin, text, label } = pinText(w.pin);
          return `<tr><td><i class="pin-dot t-${pin.type}"></i>${escape(text)}<br><small style="color:var(--muted)">${escape(label)}</small></td><td>${inline(w.to)}</td></tr>`;
        }).join('')}</tbody></table>`;
      }
      html += renderBlocks(l.wiringNotes);
      const ids = new Set(pins.map((k) => k.split(':')[0]));
      const headers = BOARD.headers.filter((h) => ids.size === 0 || ids.has(h.id));
      const used = new Set(headers.flatMap((h) => h.pins.map((p) => p.type)));
      html += `<div class="legend">${Object.entries(PIN_TYPES).filter(([t]) => used.has(t)).map(([t, name]) => `<span><i class="t-${t}"></i>${escape(name)}</span>`).join('')}</div>`;
      return html + headers.map((h) => pinoutMarkup(h, new Set(pins))).join('');
    },
  },
  code: { label: 'Code', has: (l) => Boolean(l.code?.length), render: (l) => l.code.map((f) => codeBlock(f)).join('') + renderBlocks(l.codeNotes) },
  try: { label: 'Try it', has: (l) => Boolean(l.sim), render: () => '<div id="tryStart"></div><div id="simMount"></div><div id="runCode"></div><div id="termMount"></div>' },
  kit: {
    label: 'Kit',
    has: (l) => Boolean(l.kit?.length),
    render: (l) => `<table class="kv"><tbody>${l.kit.map(([qty, item, note]) => `<tr><th>${escape(qty)}</th><td><strong>${inline(item)}</strong>${note ? `<br><span style="color:var(--muted)">${inline(note)}</span>` : ''}</td></tr>`).join('')}</tbody></table>`,
  },
};

const tabLabel = (id, l) => (typeof TABS[id].label === 'function' ? TABS[id].label(l) : TABS[id].label);

// ---------- terminal & try-it ----------

function runFile(l) { return l.code?.find((f) => f.file === l.run?.file) ?? l.code?.[0]; }

function trace(label) {
  const box = $('#runCode pre');
  if (!box) return;
  box.querySelectorAll('.current').forEach((el) => el.classList.remove('current'));
  const line = label && runFile(lesson())?.trace?.[label];
  if (!line) return;
  const el = box.querySelector(`[data-line="${line}"]`);
  el?.classList.add('current');
  if (el) box.scrollTop = el.offsetTop - box.clientHeight / 2;
}

function mountTry(l) {
  const run = l.run;
  const file = runFile(l);
  if (file && run) $('#runCode').innerHTML = codeBlock(file, { id: 'run-code', compact: true });
  // Runnable lessons start with three plain steps and a big Run button that drives the terminal's.
  if (run) {
    $('#tryStart').innerHTML = `<div class="try-start"><ol>${['Press **Run** to upload the code.', 'Change things in the panel below, or click and hold parts in the 3D view.', 'Read what the board prints at the bottom.'].map((s) => `<li>${inline(s)}</li>`).join('')}</ol>
      <button type="button" class="btn" id="tryGo">▶ Run</button></div>`;
    $('#tryGo').addEventListener('click', () => $(`#termMount [data-act="${state.term?.isRunning() ? 'stop' : 'run'}"]`)?.click());
  }
  const mount = $('#termMount');
  mount.innerHTML = `<div class="term"><div class="term-head"><span class="state">${escape(SITE.shell ?? 'terminal')}</span><span class="term-actions">
      ${run ? '<button type="button" class="primary" data-act="run">▶ Run</button><button type="button" data-act="stop" disabled>■ Stop</button>' : ''}<button type="button" data-act="clear">Clear</button></span></div>
    <pre class="term-out" aria-live="polite"></pre></div>`;
  const out = mount.querySelector('.term-out');
  const status = mount.querySelector('.state');
  const runBtn = mount.querySelector('[data-act="run"]');
  const stopBtn = mount.querySelector('[data-act="stop"]');
  let running = false;
  let pending = [];
  const term = {
    log(text, cls) {
      const line = document.createElement('span');
      if (cls) line.className = cls;
      line.textContent = `${text}\n`;
      out.append(line);
      while (out.childNodes.length > 400) out.firstChild.remove();
      out.scrollTop = out.scrollHeight;
    },
    setRunning(v) {
      running = v;
      status.classList.toggle('running', v);
      if (runBtn) { runBtn.disabled = v; stopBtn.disabled = !v; }
      const go = $('#tryGo');
      if (go) { go.textContent = t(v ? '■ Stop' : '▶ Run'); go.classList.toggle('ghost', v); }
      document.body.classList.toggle('sim-running', v);
    },
    isRunning: () => running,
    destroy() { pending.forEach(clearTimeout); pending = []; document.body.classList.remove('sim-running'); },
  };
  mount.addEventListener('click', (ev) => {
    const act = ev.target.closest('[data-act]')?.dataset.act;
    if (act === 'clear') out.textContent = '';
    if (act === 'run') {
      term.log(`$ ${run.cmd}`, 'p');
      (run.preamble ?? SITE.runPreamble ?? []).forEach((line) => term.log(line, 'm'));
      if (!state.done.has(l.id)) markDone(l.id);
      if (state.sim?.start) {
        term.setRunning(true);
        state.sim.start();
      } else {
        (run.output ?? []).forEach((line, i) => pending.push(setTimeout(() => term.log(line), 80 + i * 60)));
      }
    }
    if (act === 'stop') {
      term.setRunning(false);
      state.sim?.stop?.();
      term.log('^C', 'e');
      (run.stop ?? []).forEach((line) => term.log(line, 'e'));
    }
  });
  term.log(SITE.terminalHint ?? 'Ready.', 'm');
  state.term = term;
  state.sim = createSim(l.sim.type, $('#simMount'), {
    config: l.sim, board: BOARD, escape, log: term.log, setRunning: term.setRunning, isRunning: term.isRunning,
    focus: focusBoard, zoomTo: (ref) => state.viewer?.zoomTo(ref), part: (id, s) => { if (id) state.viewer?.setPart(id, s); },
    trace, bubble: setBubble, param, t, inline,
    resetView: () => state.viewer?.resetView(),
    // Numeric state a part starts in, from its spec (e.g. a socket lever's `open`).
    partDefaults: (id) => Object.fromEntries(['open', 'angle', 'value', 'spin'].filter((k) => k in (partSpec(id) ?? {})).map((k) => [k, partSpec(id)[k]])),
  });
}

function teardownTry() {
  state.sim?.destroy?.();
  state.sim = null;
  state.term?.destroy();
  state.term = null;
  for (const id of Object.keys(overlay.bubbles)) setBubble(id, null);
}

// ---------- page ----------

function render(lessonChanged) {
  const l = lesson();
  const tabs = lessonTabs(l);
  if (!tabs.includes(state.tab)) state.tab = 'overview';
  teardownTry();
  document.title = `${t(l.title)} · ${t(SITE.title)}`;
  $('#lessonEyebrow').textContent = `Lesson ${pad(state.index + 1)} of ${pad(LESSONS.length)}`;
  $('#lessonTitle').textContent = l.title;
  $('#lessonSummary').innerHTML = inline(l.summary);
  $('#tabs').innerHTML = tabs.map((id) => `<button type="button" role="tab" class="tab" data-tab="${id}" aria-selected="${id === state.tab}">${escape(tabLabel(id, l))}</button>`).join('');
  const body = $('#tabBody');
  body.innerHTML = TABS[state.tab].render(l);
  body.scrollTop = 0;
  if (state.tab === 'try') mountTry(l);
  renderFooter(l, tabs);
  if (lessonChanged) {
    state.params = {};
    renderRail();
    showLessonScene();
  } else {
    updateDone();
    focusBoard();
  }
  tooltip.hidden = true;
}

function go(index, tab = state.tab) {
  const l = LESSONS[Math.max(0, Math.min(LESSONS.length - 1, index))];
  location.hash = tab === 'overview' ? l.id : `${l.id}/${tab}`;
}

function route() {
  const [id, tab] = location.hash.slice(1).split('/');
  const i = LESSONS.findIndex((l) => l.id === id);
  const prev = state.index;
  state.index = i >= 0 ? i : 0;
  state.tab = tab || 'overview';
  // go() + route() can render before the hashchange event arrives; skip the repeat.
  const key = `${state.index}/${state.tab}`;
  if (key === state.routed) return;
  const lessonChanged = state.routed === null || prev !== state.index;
  state.routed = key;
  render(lessonChanged);
}

$('#tabs').addEventListener('click', (ev) => {
  const tab = ev.target.closest('[data-tab]')?.dataset.tab;
  if (tab) go(state.index, tab);
});
$('#tabBody').addEventListener('click', async (ev) => {
  const copy = ev.target.closest('[data-copy]');
  if (!copy) return;
  try {
    await navigator.clipboard.writeText(document.getElementById(copy.dataset.copy).dataset.raw);
    copy.lastChild.textContent = ' Copied';
  } catch {
    copy.lastChild.textContent = ' Copy failed';
  }
  setTimeout(() => { copy.lastChild.textContent = ' Copy'; }, 1400);
});
// Hovering a pin in the pinout lights that pin on the board.
$('#tabBody').addEventListener('pointerover', (ev) => {
  const key = ev.target.closest('.pin-cell')?.dataset.pin;
  if (key) focusBoard({ pins: [key], components: [] });
});
$('#tabBody').addEventListener('pointerout', (ev) => {
  if (ev.target.closest('.pin-cell') && !ev.relatedTarget?.closest?.('.pin-cell')) focusBoard();
});
// The footer walks through the lesson one tab at a time; the last tab finishes the lesson.
const lessonTabs = (l) => Object.entries(TABS).filter(([, tab]) => tab.has(l)).map(([id]) => id);
function renderFooter(l, tabs) {
  const i = tabs.indexOf(state.tab);
  const lastLesson = state.index === LESSONS.length - 1;
  $('#prevBtn').textContent = i > 0 ? t('← {tab}', { tab: t(tabLabel(tabs[i - 1], l)) }) : t('← Previous lesson');
  $('#prevBtn').disabled = i === 0 && state.index === 0;
  $('#nextBtn').textContent = i < tabs.length - 1 ? t('Next: {tab} →', { tab: t(tabLabel(tabs[i + 1], l)) })
    : lastLesson ? t('Finish the course ✓') : t('Finish lesson, go to the next →');
}
$('#prevBtn').addEventListener('click', () => {
  const tabs = lessonTabs(lesson());
  const i = tabs.indexOf(state.tab);
  if (i > 0) go(state.index, tabs[i - 1]); else go(state.index - 1, 'overview');
});
$('#nextBtn').addEventListener('click', () => {
  const tabs = lessonTabs(lesson());
  const i = tabs.indexOf(state.tab);
  if (i < tabs.length - 1) { go(state.index, tabs[i + 1]); return; }
  markDone(lesson().id);
  if (state.index < LESSONS.length - 1) go(state.index + 1, 'overview');
});

// ---------- boot ----------

document.documentElement.style.setProperty('--accent', SITE.accent);
observe(document.body);
$('#langToggle').textContent = lang === 'zh' ? 'EN' : '中';
$('#langToggle').addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh'));
$('#siteTitle').textContent = SITE.title;
document.querySelectorAll('[data-icon]').forEach((el) => { el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon, Number(el.dataset.size ?? 20))); });
window.addEventListener('hashchange', route);
route();

// ---------- how-to-use guide: shown once on the first visit to any board, and on the ? button ----------

const GUIDE_KEY = 'learn-hardware:guided';
const GUIDE = [
  { el: '#lessonRail', title: 'Lessons', text: 'Each square is one lesson. Yellow is where you are and green ones are done. Click any square to jump to it.' },
  { el: '#tabs', title: 'Steps in a lesson', text: 'Every lesson has the same steps: read the overview, check the wiring, look at the code, then try it. Go left to right.' },
  { el: '.stage', title: 'The 3D view', text: 'Drag to turn the scene and scroll to zoom. Click any part, pin or wire to see what it is.' },
  { el: '#key', title: 'Numbered labels', text: 'Each yellow number sits on a part. The key explains what that part does in this lesson.' },
  { el: '#nextBtn', title: 'Next step', text: 'Finished a step? Press this. It walks you through the whole lesson and then on to the next one.' },
  { el: '#helpBtn', title: 'Need this again?', text: 'Press ? at any time to replay this guide.' },
];
function showGuide() {
  closeSidePop();
  selectRef(null);
  startGuide(GUIDE.map((g) => ({ ...g, title: t(g.title), text: t(g.text) })), { next: t('Next'), back: t('Back'), skip: t('Skip'), done: t('Start learning') }, () => {
    try { localStorage.setItem(GUIDE_KEY, '1'); } catch (err) { console.warn('Could not remember that the guide was shown.', err); }
  });
}
$('#helpBtn').addEventListener('click', showGuide);
initViewer().then(() => {
  let seen = null;
  try { seen = localStorage.getItem(GUIDE_KEY); } catch { seen = '1'; } // storage blocked: do not show it on every load
  if (!seen) setTimeout(showGuide, 900);
});
