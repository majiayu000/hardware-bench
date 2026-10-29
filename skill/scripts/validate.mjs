#!/usr/bin/env node
// Validates one board of a learn-hardware hub before you open it in a browser.
// Usage: bun scripts/validate.mjs <hub>/boards/<board-id>     (or: node scripts/validate.mjs …)
// The engine is found at <hub>/engine. Also checks that the board's zh.js covers every string.
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { contentStrings, needsTranslation } from './strings.mjs';

const dir = resolve(process.argv[2] ?? '.');
const engine = resolve(dir, '../../engine');
const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

for (const f of ['index.html', 'content.js', 'zh.js']) if (!existsSync(join(dir, f))) err(`missing file ${f} in ${dir}`);
for (const f of ['styles.css', 'app.js', 'board3d.js', 'kit.js', 'board-geometry.js', 'sims.js', 'ui.js', 'i18n.js', 'view2d.js']) {
  if (!existsSync(join(engine, f))) err(`missing engine file ${f} in ${engine}`);
}
if (errors.length) {
  errors.forEach((e) => console.log(`error ${e}`));
  process.exit(1);
}

const load = (base, f) => import(pathToFileURL(join(base, f)).href);
const content = await load(dir, 'content.js');
const { SITE, BOARD, PIN_TYPES, LESSONS } = content;
const ZH = (await load(dir, 'zh.js')).default;
const { SIM_TYPES, RUNNABLE, TRACE_LABELS } = await load(engine, 'sims.js');
const { ICON_NAMES } = await load(engine, 'ui.js');
const geo = await load(engine, 'board-geometry.js');
const { pinPosition, parseHole, partHoles, PART_TYPES, MODULE_PRESETS, BREADBOARD_PARTS, partComponent } = geo;
const { PC_KIND_NAMES } = await load(engine, 'kit-pc.js');
const html = readFileSync(join(dir, 'index.html'), 'utf8');
const css = readFileSync(join(engine, 'styles.css'), 'utf8');
for (const k of ['"content": "./content.js"', '"content-zh": "./zh.js"', '../../engine/app.js']) {
  if (!html.includes(k)) err(`index.html must reference ${k}`);
}

// ---------- translation ----------
const untranslated = contentStrings(content).filter((s) => !(s in ZH) && needsTranslation(s));
if (untranslated.length) warn(`zh.js is missing ${untranslated.length} translation(s); list them with scripts/strings.mjs ${process.argv[2]} --missing`);
for (const [en, zh] of Object.entries(ZH)) {
  const codes = (x) => (x.match(/`[^`]*`/g) ?? []).sort().join('|'); // word order may differ
  if (codes(en) !== codes(zh)) warn(`zh.js changes the \`code\` in "${en.slice(0, 50)}…"; keep code identical`);
}
const checkIcon = (name, where) => { if (name && !ICON_NAMES.includes(name)) err(`${where} icon "${name}" is not one of: ${ICON_NAMES.join(', ')}`); };

// ---------- SITE ----------
for (const k of ['id', 'title', 'accent']) if (!SITE?.[k]) err(`SITE.${k} is required`);
if (SITE?.accent && !/^#[0-9a-f]{6}$/i.test(SITE.accent)) err('SITE.accent must be a #rrggbb colour');
if (SITE?.title && !html.includes(`<title>${SITE.title}</title>`)) warn(`index.html <title> does not match SITE.title "${SITE.title}"`);
if (SITE?.logicVolts == null) warn('SITE.logicVolts is not set; LED current hints assume 3.3 V');

// ---------- PIN_TYPES ----------
if (!PIN_TYPES) err('PIN_TYPES export is required');
for (const t of Object.keys(PIN_TYPES ?? {})) if (!css.includes(`.t-${t} `)) err(`PIN_TYPES.${t} has no .t-${t} colour rule in styles.css`);

// ---------- BOARD ----------
const B = BOARD ?? {};
if (!(B.width > 0 && B.depth > 0)) err('BOARD.width and BOARD.depth must be positive millimetres');
if (!B.name) err('BOARD.name is required');
const inBounds = (x, z, pad) => x >= -pad && x <= B.width + pad && z >= -pad && z <= B.depth + pad;

const componentIds = new Set();
for (const c of B.components ?? []) {
  const where = `component "${c.id}"`;
  if (!c.id) err('a component is missing id');
  if (componentIds.has(c.id)) err(`duplicate component id "${c.id}"`);
  componentIds.add(c.id);
  if (!c.label) err(`${where} needs a label`);
  if (!c.desc) warn(`${where} has no desc (shown in tooltips, popovers and the tour)`);
  for (const k of ['x', 'z', 'w', 'h']) if (typeof c[k] !== 'number') err(`${where} needs numeric ${k}`);
  if (c.shape !== 'cylinder' && typeof c.d !== 'number') err(`${where} is a box and needs numeric d`);
  if (c.shape && !['box', 'cylinder'].includes(c.shape)) err(`${where} shape must be box or cylinder`);
  const KINDS = ['chip', 'shield', 'usb', 'usbc', 'hdmi', 'ethernet', 'jst', 'fpc', 'button', 'dip', 'crystal', 'electrolytic', 'usbb', 'dcjack', 'regulator', 'ledsmd', 'ledmatrix', ...PC_KIND_NAMES];
  if (c.kind && !KINDS.includes(c.kind)) err(`${where} kind must be one of ${KINDS.join(', ')}`);
  if (!inBounds(c.x, c.z, 25)) err(`${where} centre (${c.x}, ${c.z}) is far outside the board`);
}
for (const s of B.silkscreen ?? []) if (!s.text || typeof s.x !== 'number' || typeof s.z !== 'number') err('silkscreen entries need text, x and z');
for (const a of B.smd ?? []) for (const k of ['x', 'z', 'w', 'd']) if (typeof a[k] !== 'number') err(`smd areas need numeric ${k}`);

const pinKeys = new Set();
const headerIds = new Set();
for (const h of B.headers ?? []) {
  const where = `header "${h.id}"`;
  if (!h.id || h.id.includes(':')) err('every header needs an id without ":"');
  if (headerIds.has(h.id)) err(`duplicate header id "${h.id}"`);
  headerIds.add(h.id);
  if (!h.label) err(`${where} needs a label`);
  if (!['dual', 'single'].includes(h.layout)) err(`${where} layout must be "dual" or "single"`);
  if (typeof h.x !== 'number' || typeof h.z !== 'number') err(`${where} needs numeric x/z for pin 1`);
  if (h.style && !['male', 'female', 'pad'].includes(h.style)) err(`${where} style must be "male", "female" or "pad"`);
  const ns = (h.pins ?? []).map((p) => p.n);
  if (JSON.stringify([...ns].sort((a, b) => a - b)) !== JSON.stringify(ns.map((_, i) => i + 1))) err(`${where} pins must be numbered 1..${ns.length} with no gaps or repeats`);
  if (h.layout === 'dual' && ns.length % 2) err(`${where} is dual but has an odd pin count`);
  for (const p of h.pins ?? []) {
    if (!p.name) err(`${where} pin ${p.n} needs a name`);
    if (!(p.type in (PIN_TYPES ?? {}))) err(`${where} pin ${p.n} type "${p.type}" is not in PIN_TYPES`);
    const pos = pinPosition(h, p.n);
    if (!inBounds(pos.x, pos.z, 2)) err(`${where} pin ${p.n} lands at (${pos.x.toFixed(1)}, ${pos.z.toFixed(1)}), off the board`);
    pinKeys.add(`${h.id}:${p.n}`);
  }
}
if (!pinKeys.size && BOARD.headers?.length !== 0) err('BOARD.headers must define at least one pin (or be [] for a board with no pin headers, like a PC case)');

// ---------- circuits ----------
const CONTROL_KEYS = { ohms: ['resistor'], color: ['led'], distance: ['module'], value: ['pot', 'ldr'], angle: ['servo'] };
function checkCircuit(circuit, where) {
  const ids = new Set();
  const used = new Map();
  const isEnd = (ref) => (String(ref).startsWith('bb:') ? Boolean(circuit.breadboard && parseHole(ref.slice(3))) : pinKeys.has(ref));
  for (const p of circuit.parts ?? []) {
    const pw = `${where} part "${p.id}"`;
    if (!p.id || ids.has(p.id) || p.id === 'breadboard') err(`${pw}: ids must be unique and not "breadboard"`);
    ids.add(p.id);
    if (!PART_TYPES.includes(p.type)) { err(`${pw}: type "${p.type}" is not one of ${PART_TYPES.join(', ')}`); continue; }
    if (!p.label) warn(`${pw} has no label (shown in popovers and the parts list)`);
    if (p.type === 'module' && p.preset && !MODULE_PRESETS.includes(p.preset)) err(`${pw}: preset must be one of ${MODULE_PRESETS.join(', ')}`);
    if (p.type === 'servo' && (!p.at || typeof p.at.x !== 'number')) err(`${pw}: servo needs at: { x, z } (it sits on the table)`);
    if (['camera', 'casepanel', 'casebutton', 'block', 'fan'].includes(p.type) && (!p.at || typeof p.at.x !== 'number')) err(`${pw}: ${p.type} needs at: { x, z }`);
    if (p.type === 'block' && !(p.w > 0 && p.d > 0 && p.h > 0)) err(`${pw}: block needs w, d and h`);
    if (p.type === 'camera' && !componentIds.has(p.connector)) err(`${pw}: connector "${p.connector}" is not a board component`);
    const comp = p.type === 'camera' ? null : partComponent(p);
    if (comp && !componentIds.has(comp)) err(`${pw}: "${comp}" is not a board component`);
    if (['cpu', 'cooler', 'socketlid', 'dimm', 'm2', 'gpu', 'powerplug'].includes(p.type) && !comp) err(`${pw}: needs socket, slot or connector`);
    if (p.type === 'plug') {
      if (!Array.isArray(p.on) || !p.on.length) err(`${pw}: plug needs on: [header pin keys]`);
      for (const key of p.on ?? []) {
        if (!pinKeys.has(key)) err(`${pw}: "${key}" is not a pin key`);
        else if (used.has(key)) err(`${pw}: pin ${key} is already used by ${used.get(key)}`);
        else used.set(key, p.id);
      }
    }
    if (BREADBOARD_PARTS.includes(p.type)) {
      if (!circuit.breadboard) err(`${pw}: needs circuit.breadboard`);
      const holes = partHoles(p);
      const expect = { led: 2, resistor: 2, button: 4, rgbled: 4, pot: 3, buzzer: 2, ldr: 2, servo: 3 }[p.type];
      if (expect && holes.length !== expect) err(`${pw}: needs ${expect} holes, got ${holes.length}`);
      for (const h of holes) {
        if (!parseHole(h)) err(`${pw}: "${h}" is not a breadboard hole (a1–j30, or tp/tn/bp/bn + column, rails skip every 6th)`);
        else if (used.has(h)) err(`${pw}: hole ${h} is already used by ${used.get(h)}`);
        else used.set(h, p.id);
      }
    }
    for (const key of Object.keys(p.controls ?? {})) {
      if (!CONTROL_KEYS[key]?.includes(p.type)) err(`${pw}: control "${key}" only works on ${CONTROL_KEYS[key]?.join(' or ') ?? '(unknown)'} parts`);
    }
    if (p.drives && !(circuit.parts ?? []).some((q) => q.id === p.drives && q.type === 'led')) err(`${pw}: drives "${p.drives}" must be an LED in the same circuit`);
  }
  const pinWires = new Map();
  for (const w of circuit.wires ?? []) {
    for (const end of [w.from, w.to]) {
      if (String(end).startsWith('bb:')) continue;
      if (pinWires.has(end)) err(`${where}: header pin ${end} has two jumper wires; route the second through a breadboard rail`);
      pinWires.set(end, true);
    }
    for (const end of [w.from, w.to]) if (!isEnd(end)) err(`${where} wire ${w.from} → ${w.to}: "${end}" is not a pin key or bb:<hole>`);
    for (const end of [w.from, w.to]) {
      const h = String(end).startsWith('bb:') && end.slice(3);
      if (h && used.has(h)) err(`${where} wire end ${end} shares a hole with part ${used.get(h)}`);
      if (h) used.set(h, 'a wire');
    }
  }
  return ids;
}

// ---------- LESSONS ----------
const LANGS = new Set(['python', 'bash', 'ini', 'cpp', 'javascript', 'text']);
const BLOCKS = ['h', 'steps', 'tips', 'note', 'specs', 'cmd'];
function checkBlocks(blocks, where) {
  if (blocks == null) return;
  if (!Array.isArray(blocks)) { err(`${where} must be an array of blocks`); return; }
  blocks.forEach((b, i) => {
    if (typeof b === 'string') return;
    const keys = Object.keys(b ?? {}).filter((k) => k !== 'tone');
    if (keys.length !== 1 || !BLOCKS.includes(keys[0])) err(`${where}[${i}] is not a known block (string, ${BLOCKS.join(', ')})`);
    if (b.tone && b.tone !== 'warn') err(`${where}[${i}] tone must be "warn"`);
    if (b.steps && !Array.isArray(b.steps)) err(`${where}[${i}].steps must be an array`);
    if (b.specs && !b.specs.every((r) => Array.isArray(r) && r.length === 2)) err(`${where}[${i}].specs must be [label, value] pairs`);
    if (b.tips) b.tips.forEach((t, j) => { if (!Array.isArray(t) || t.length !== 2) err(`${where}[${i}].tips[${j}] must be [icon, text]`); else checkIcon(t[0], `${where}[${i}].tips[${j}]`); });
  });
}

if (!Array.isArray(LESSONS) || !LESSONS.length) err('LESSONS must be a non-empty array');
const lessonIds = new Set();
for (const l of LESSONS ?? []) {
  const where = `lesson "${l.id}"`;
  if (!/^[a-z0-9-]+$/.test(l.id ?? '')) err(`lesson id "${l.id}" must be lowercase letters, digits and dashes`);
  if (lessonIds.has(l.id)) err(`duplicate lesson id "${l.id}"`);
  lessonIds.add(l.id);
  for (const k of ['title', 'summary']) if (!l[k]) err(`${where} needs ${k}`);
  if (!l.overview?.length) err(`${where} needs overview content`);
  if ((l.short ?? l.title)?.length > 24) warn(`${where} rail title "${l.short ?? l.title}" is long; set a shorter "short"`);
  checkBlocks(l.overview, `${where}.overview`);
  checkBlocks(l.wiringNotes, `${where}.wiringNotes`);
  checkBlocks(l.codeNotes, `${where}.codeNotes`);

  if (l.icon === 'circuit' && !l.circuit) err(`${where} icon "circuit" needs a circuit`);
  if (l.icon && l.icon !== 'board' && l.icon !== 'circuit') {
    if (l.icon.glyph) checkIcon(l.icon.glyph, `${where}`);
    else if (!PART_TYPES.includes(l.icon.type)) err(`${where} icon must be "board", "circuit", { glyph } or { type: <part type> }`);
  }
  if (!l.icon) warn(`${where} has no icon for its lesson card`);

  const partIds = l.circuit ? checkCircuit(l.circuit, where) : new Set();
  const focusPins = l.focus?.pins ?? [];
  for (const k of focusPins) if (!pinKeys.has(k)) err(`${where} focus pin "${k}" does not exist (use "headerId:n")`);
  for (const id of l.focus?.components ?? []) if (!componentIds.has(id)) err(`${where} focus component "${id}" does not exist`);
  for (const w of l.wiring ?? []) {
    if (!pinKeys.has(w.pin)) err(`${where} wiring pin "${w.pin}" does not exist`);
    else if (!focusPins.includes(w.pin)) warn(`${where} wires ${w.pin} but does not highlight it in focus.pins`);
    if (!w.to) err(`${where} wiring ${w.pin} needs "to"`);
  }
  if (l.wiring && l.circuit) {
    const wired = new Set([...(l.circuit.wires ?? []).flatMap((w) => [w.from, w.to]), ...(l.circuit.parts ?? []).flatMap((p) => p.on ?? [])]);
    for (const w of l.wiring) if (!wired.has(w.pin)) warn(`${where} wiring table lists ${w.pin} but the 3D circuit has no wire on it`);
  }
  for (const [i, c] of (l.callouts ?? []).entries()) {
    const cw = `${where} callout ${i}`;
    const refs = ['pin', 'part', 'component'].filter((k) => c[k]);
    if (refs.length !== 1) err(`${cw} needs exactly one of pin, part, component`);
    if (c.pin && !pinKeys.has(c.pin)) err(`${cw}: pin "${c.pin}" does not exist`);
    if (c.part && !partIds.has(c.part)) err(`${cw}: part "${c.part}" is not in this lesson's circuit`);
    if (c.component && !componentIds.has(c.component)) err(`${cw}: component "${c.component}" does not exist`);
    if (!c.title) err(`${cw} needs a title`);
    if ((c.text ?? '').length > 70) warn(`${cw} text is long for a callout card (${c.text.length} chars)`);
    checkIcon(c.icon, cw);
  }
  if ((l.callouts ?? []).length > 6) warn(`${where} has ${l.callouts.length} callouts; more than 6 crowd the stage`);

  for (const c of l.code ?? []) {
    if (!c.file || !c.source) err(`${where} code entries need file and source`);
    if (!LANGS.has(c.lang)) err(`${where} code "${c.file}" lang must be one of ${[...LANGS].join(', ')}`);
    const lines = (c.source ?? '').trim().split('\n').length;
    for (const [label, line] of Object.entries(c.trace ?? {})) {
      if (!(line >= 1 && line <= lines)) err(`${where} code "${c.file}" trace.${label} = ${line} is outside 1..${lines}`);
      const simLabels = [...(TRACE_LABELS[l.sim?.type] ?? []), ...(l.sim?.type === 'sequence' ? l.sim.steps.map((st) => st.trace).filter(Boolean) : []), ...(l.sim?.type === 'matrix' ? l.sim.frames.map((f) => f.trace).filter(Boolean) : [])];
      if (l.sim && !simLabels.includes(label)) err(`${where} code "${c.file}" trace label "${label}" is not used by sim "${l.sim.type}" (${simLabels.join(', ') || 'none'})`);
    }
  }
  if (l.run?.file && !(l.code ?? []).some((c) => c.file === l.run.file)) err(`${where} run.file "${l.run.file}" is not one of its code files`);

  const s = l.sim;
  if (s) {
    if (!SIM_TYPES.includes(s.type)) err(`${where} sim type "${s.type}" is not one of ${SIM_TYPES.join(', ')}`);
    if (RUNNABLE.includes(s.type) && !l.run?.cmd) err(`${where} sim "${s.type}" is started by the terminal and needs run.cmd`);
    if (RUNNABLE.includes(s.type) && TRACE_LABELS[s.type] && !(l.code ?? []).some((c) => c.trace)) warn(`${where} has no code trace, so no line is highlighted while it runs`);
    if (s.type === 'commands' && !s.commands?.length) err(`${where} commands sim needs commands[]`);
    if (s.type === 'rgb' && !s.sequence?.length) err(`${where} rgb sim needs sequence[]`);
    if (['web', 'dashboard'].includes(s.type) && !s.url) err(`${where} ${s.type} sim needs url`);
    if (s.type === 'assembly') {
      if (!s.steps?.length) err(`${where} assembly sim needs steps[]`);
      if (s.mode && !['assemble', 'disassemble'].includes(s.mode)) err(`${where} assembly mode must be "assemble" or "disassemble"`);
      for (const [i, st] of (s.steps ?? []).entries()) {
        if (!['insert', 'remove', 'set'].includes(st.do)) err(`${where} step ${i + 1}: do must be insert, remove or set`);
        if (!st.text) err(`${where} step ${i + 1} needs text`);
        for (const id of st.parts ?? []) if (!partIds.has(id)) err(`${where} step ${i + 1}: part "${id}" is not in the circuit`);
        if (!st.parts?.length) err(`${where} step ${i + 1} needs parts[]`);
        if (st.do === 'set' && (!st.from || !st.to)) err(`${where} step ${i + 1}: "set" needs from and to`);
        for (const k of st.pins ?? []) if (!pinKeys.has(k)) err(`${where} step ${i + 1}: pin "${k}" does not exist`);
      }
    }
    for (const key of ['power', 'reset', 'panel']) if (s[key] && !partIds.has(s[key])) err(`${where} sim.${key} "${s[key]}" is not a part in this lesson's circuit`);
    for (const id of s.fans ?? []) if (!partIds.has(id)) err(`${where} sim fan "${id}" is not a part in this lesson's circuit`);
    if (s.type === 'sequence') {
      if (!s.steps?.length) err(`${where} sequence sim needs steps[]`);
      for (const [i, st] of (s.steps ?? []).entries()) {
        if (!(st.ms > 0)) err(`${where} sequence step ${i + 1} needs ms > 0`);
        for (const id of Object.keys(st.set ?? {})) if (!partIds.has(id)) err(`${where} sequence step ${i + 1}: part "${id}" is not in the circuit`);
        if (st.tone && !s.buzzer) err(`${where} sequence step ${i + 1} has a tone but the sim has no buzzer`);
      }
      for (const id of [...(s.lamps ?? []), ...Object.keys(s.idle ?? {})]) if (!partIds.has(id)) err(`${where} sequence lamp "${id}" is not in the circuit`);
    }
    if (s.type === 'detect' && !s.objects?.every((o) => o.label && o.box?.length === 4)) err(`${where} detect sim needs objects [{ label, box: [x, y, w, h] }]`);
    if (s.type === 'chat' && (!s.model || !s.chats?.every((c) => c.q && c.a))) err(`${where} chat sim needs model and chats [{ q, a }]`);
    if (s.type === 'matrix') {
      const size = s.frames?.[0]?.rows ? `${s.frames[0].rows.length}x${s.frames[0].rows[0].length}` : '';
      if (!s.frames?.length) err(`${where} matrix sim needs frames[]`);
      for (const [i, f] of (s.frames ?? []).entries()) {
        if (!f.rows?.every((r) => /^[0-7]+$/.test(r))) err(`${where} matrix frame ${i + 1}: rows must be strings of digits 0–7`);
        else if (`${f.rows.length}x${f.rows[0].length}` !== size || f.rows.some((r) => r.length !== f.rows[0].length)) err(`${where} matrix frame ${i + 1} is not ${size}`);
      }
    }
    for (const key of ['led', 'resistor', 'button', 'sensor', 'pot', 'servo', 'buzzer']) {
      if (s[key] && !partIds.has(s[key])) err(`${where} sim.${key} "${s[key]}" is not a part in this lesson's circuit`);
    }
  }
  for (const row of l.kit ?? []) if (!row[0] || !row[1]) err(`${where} kit rows are [qty, item, note?]`);
}

for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`error ${e}`);
console.log(errors.length
  ? `\n✗ ${errors.length} error(s), ${warnings.length} warning(s)`
  : `✓ content OK: ${LESSONS.length} lessons, ${pinKeys.size} pins, ${componentIds.size} components, ${LESSONS.filter((l) => l.circuit).length} circuits, ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
