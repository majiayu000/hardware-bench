// Board geometry and the 2D fallback drawing. Positions are millimetres in the board's top view:
// x right, z down, origin at the PCB's top-left corner. Pure data: the validator imports this under bun.

// ---------- headers & breadboard ----------

// Pin `n` on a header. dual: odd pins on row 1, even on row 2 (Pi style). single: one line along `step`.
export function pinPosition(header, n) {
  const pitch = header.pitch ?? 2.54;
  const [sx, sz] = header.step ?? [pitch, 0];
  const [rx, rz] = header.rowStep ?? [0, -pitch];
  if (header.layout === 'dual') {
    const col = Math.floor((n - 1) / 2);
    const row = (n - 1) % 2;
    return { x: header.x + col * sx + row * rx, z: header.z + col * sz + row * rz };
  }
  return { x: header.x + (n - 1) * sx, z: header.z + (n - 1) * sz };
}

export function findPin(board, key) {
  const [headerId, n] = String(key).split(':');
  const header = board.headers?.find((h) => h.id === headerId);
  const pin = header?.pins.find((p) => p.n === Number(n));
  return pin ? { header, pin } : null;
}

// Half-size breadboard: 30 columns, rows a–j split by a centre channel, a +/− rail pair on each
// long edge (tp/tn on the a-side, bp/bn on the j-side). Local coordinates, top-left origin.
export const BREADBOARD = {
  width: 85.7, depth: 52, height: 8.5, pitch: 2.54, columns: 30, firstColumnX: 6, channelZ: 24.97,
  rows: {
    tn: 3.5, tp: 6.04,
    a: 11, b: 13.54, c: 16.08, d: 18.62, e: 21.16,
    f: 28.78, g: 31.32, h: 33.86, i: 36.4, j: 38.94,
    bp: 45.96, bn: 48.5,
  },
};

export function parseHole(name) {
  const m = /^(tn|tp|bp|bn|[a-j])(\d{1,2})$/.exec(String(name));
  if (!m) return null;
  const col = Number(m[2]);
  if (col < 1 || col > BREADBOARD.columns) return null;
  if (m[1].length === 2 && col % 6 === 0) return null; // rails come in groups of five: no hole at 6, 12, …
  return { row: m[1], col };
}

// Holes that are connected inside the breadboard share a net name.
export function holeNet(name) {
  const h = parseHole(name);
  if (!h) return null;
  if (h.row.length === 2) return `rail:${h.row}`;
  return `${'abcde'.includes(h.row) ? 'top' : 'bot'}:${h.col}`;
}

export function holePosition(breadboard, name) {
  const h = parseHole(name);
  if (!h) return null;
  return { x: breadboard.x + BREADBOARD.firstColumnX + (h.col - 1) * BREADBOARD.pitch, z: breadboard.z + BREADBOARD.rows[h.row] };
}

// A circuit endpoint is a header pin ("gpio:11") or a breadboard hole ("bb:f12").
export function endpoint(board, circuit, ref) {
  if (String(ref).startsWith('bb:')) {
    const p = circuit?.breadboard && holePosition(circuit.breadboard, ref.slice(3));
    return p ? { kind: 'hole', hole: ref.slice(3), ...p } : null;
  }
  const found = findPin(board, ref);
  return found ? { kind: 'pin', key: ref, ...found, ...pinPosition(found.header, found.pin.n) } : null;
}

// Breadboard holes a part plugs into, in its own leg order.
export function partHoles(part) {
  return { led: [part.anode, part.cathode], resistor: [part.a, part.b] }[part.type] ?? part.legs ?? part.pins ?? [];
}

export const LED_COLORS = { red: '#ff2b2b', yellow: '#ffd21f', green: '#29e05a', blue: '#2f7bff', white: '#f2f2ff', orange: '#ff8a1f' };
const BAND = ['#1b1b1b', '#7a4a25', '#d22c2c', '#ef7f1a', '#f2d22b', '#2f9e4a', '#2f62d6', '#7b3fbf', '#8a8a8a', '#f5f5f5'];
export function resistorBands(ohms) {
  const exp = Math.max(0, Math.floor(Math.log10(ohms)) - 1);
  const sig = Math.round(ohms / 10 ** exp);
  return [BAND[Math.floor(sig / 10)], BAND[sig % 10], BAND[exp], '#c9a23a'];
}

export const PART_TYPES = ['led', 'resistor', 'button', 'rgbled', 'pot', 'module', 'camera', 'buzzer', 'servo', 'ldr',
  'socketlid', 'cpu', 'cooler', 'dimm', 'm2', 'gpu', 'plug', 'powerplug', 'casepanel', 'casebutton', 'block', 'fan', 'motor', 'screen'];
// Parts whose legs go into breadboard holes (the rest sit on the board, in slots or on the table).
export const BREADBOARD_PARTS = ['led', 'resistor', 'button', 'rgbled', 'pot', 'module', 'buzzer', 'ldr', 'servo', 'motor'];
// Which board component a slotted part refers to.
export const partComponent = (part) => part.socket ?? part.slot ?? part.connector ?? null;
export const MODULE_PRESETS = ['breakout', 'hcsr04', 'dht22', 'oled', 'lcd1602', 'ws2812', 'relay', 'driver', 'uln2003',
  'pir', 'mpu6050', 'soil', 'irrx', 'rc522', 'joystick', 'sdcard', 'gps', 'ds3231'];

// Holes used when a part is drawn on its own (lesson thumbnails).
export const ICON_HOLES = {
  led: { anode: 'a14', cathode: 'a15' },
  resistor: { a: 'a12', b: 'a16' },
  button: { legs: ['e14', 'e16', 'f14', 'f16'] },
  rgbled: { legs: ['a13', 'a14', 'a15', 'a16'] },
  pot: { legs: ['a14', 'a15', 'a16'] },
  module: { pins: ['a13', 'a14', 'a15', 'a16'] },
  camera: { at: { x: 0, z: 0 } },
  buzzer: { legs: ['a13', 'a16'] },
  servo: { at: { x: 40, z: -30 }, legs: ['a10', 'a11', 'a12'] },
  motor: { at: { x: 40, z: -30 }, legs: ['a10', 'a11'] },
  ldr: { legs: ['a14', 'a16'] },
};

// ---------- 2D fallback (SVG, top view) ----------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Returns { svg, anchors } where anchors maps "pin:…", "component:…", "part:…" to SVG coordinates.
export function boardSvg(board, circuit) {
  const anchors = {};
  const parts = [];
  let [minX, minZ, maxX, maxZ] = [0, 0, board.width, board.depth];
  const grow = (x, z) => { minX = Math.min(minX, x); minZ = Math.min(minZ, z); maxX = Math.max(maxX, x); maxZ = Math.max(maxZ, z); };
  for (const c of board.components) { const d = c.d ?? c.w; grow(c.x - c.w / 2, c.z - d / 2); grow(c.x + c.w / 2, c.z + d / 2); }
  if (circuit?.breadboard) {
    const { x, z } = circuit.breadboard;
    grow(x, z); grow(x + BREADBOARD.width, z + BREADBOARD.depth);
    parts.push(`<rect x="${x}" y="${z}" width="${BREADBOARD.width}" height="${BREADBOARD.depth}" rx="1.5" fill="#f4f0e6" stroke="#24222c" stroke-width=".3"/>`);
    for (const [row, rz] of Object.entries(BREADBOARD.rows)) {
      for (let col = 1; col <= BREADBOARD.columns; col += 1) {
        parts.push(`<rect x="${x + BREADBOARD.firstColumnX + (col - 1) * BREADBOARD.pitch - 0.5}" y="${z + rz - 0.5}" width="1" height="1" fill="#8c867a"/>`);
      }
    }
  }
  parts.push(`<rect x="0" y="0" width="${board.width}" height="${board.depth}" rx="${board.cornerRadius ?? 3}" fill="${board.pcbColor}" stroke="#24222c" stroke-width=".4"/>`);
  for (const h of board.holes ?? []) parts.push(`<circle cx="${h.x}" cy="${h.z}" r="${(h.r ?? 1.4) + 0.9}" fill="#d8c27a"/><circle cx="${h.x}" cy="${h.z}" r="${h.r ?? 1.4}" fill="var(--stage-b)"/>`);
  for (const c of board.components) {
    if (c.under) continue;
    const d = c.d ?? c.w;
    const shape = c.shape === 'cylinder' ? `<circle cx="${c.x}" cy="${c.z}" r="${c.w / 2}"` : `<rect x="${c.x - c.w / 2}" y="${c.z - d / 2}" width="${c.w}" height="${d}" rx="0.6"`;
    parts.push(`${shape} fill="${c.color}" stroke="#24222c" stroke-width=".3" data-key="component:${esc(c.id)}"><title>${esc(c.label)}</title>${c.shape === 'cylinder' ? '</circle>' : '</rect>'}`);
    if (c.text) parts.push(`<text x="${c.x}" y="${c.z + 0.9}" text-anchor="middle" font-size="${Math.min(2.6, c.w / 5)}" font-family="IBM Plex Mono, monospace" fill="${c.textColor ?? 'rgb(255 255 255 / 75%)'}" pointer-events="none">${esc(c.text)}</text>`);
    anchors[`component:${c.id}`] = { x: c.x, z: c.z };
  }
  for (const header of board.headers) {
    const pitch = header.pitch ?? 2.54;
    for (const pin of header.pins) {
      const p = pinPosition(header, pin.n);
      const key = `${header.id}:${pin.n}`;
      anchors[`pin:${key}`] = p;
      parts.push(`<g data-key="pin:${esc(key)}"><rect x="${p.x - pitch / 2}" y="${p.z - pitch / 2}" width="${pitch}" height="${pitch}" fill="#151515"/>${pin.missing ? '' : `<circle cx="${p.x}" cy="${p.z}" r="${pitch * 0.3}" fill="#e2bd5b"/>`}<title>${esc(`Pin ${pin.n} · ${pin.name}`)}</title></g>`);
    }
  }
  const hole = (n) => holePosition(circuit.breadboard, n);
  const where = (part) => {
    if (part.at) return [part.at];
    if (part.on) return part.on.map((key) => { const f = findPin(board, key); return pinPosition(f.header, f.pin.n); });
    const comp = board.components.find((c) => c.id === partComponent(part));
    if (comp) return [{ x: comp.x, z: comp.z }];
    return partHoles(part).map(hole);
  };
  for (const part of circuit?.parts ?? []) {
    const pts = where(part);
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cz = pts.reduce((s, p) => s + p.z, 0) / pts.length;
    anchors[`part:${part.id}`] = { x: cx, z: cz };
    const fill = { led: LED_COLORS[part.color ?? 'red'], resistor: '#d9c7a0', button: '#2b2a2e', rgbled: '#f4f1ea', pot: '#2f5fb5', camera: '#2d7a4b', buzzer: '#24232b', servo: '#2f6fd0', ldr: '#d8743c', motor: '#f2c12e' }[part.type] ?? part.color ?? '#5b2a86';
    const body = part.type === 'led' || part.type === 'rgbled'
      ? `<circle cx="${cx}" cy="${cz}" r="2.6" fill="${fill}" stroke="#24222c" stroke-width=".3" data-part="${esc(part.id)}"/>`
      : `<rect x="${cx - Math.max(3, (Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x))) / 2 + 1.5)}" y="${cz - 2}" width="${Math.max(6, Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x)) + 3)}" height="4" rx="1" fill="${fill}" stroke="#24222c" stroke-width=".3" data-part="${esc(part.id)}"/>`;
    parts.push(`<g data-key="part:${esc(part.id)}">${pts.map((p) => `<line x1="${cx}" y1="${cz}" x2="${p.x}" y2="${p.z}" stroke="#9aa0a6" stroke-width=".4"/>`).join('')}${body}</g>`);
  }
  for (const w of circuit?.wires ?? []) {
    const a = endpoint(board, circuit, w.from);
    const b = endpoint(board, circuit, w.to);
    const bend = (a.z + b.z) / 2;
    parts.push(`<path d="M${a.x} ${a.z} C${a.x} ${bend} ${b.x} ${bend} ${b.x} ${b.z}" fill="none" stroke="${w.color ?? '#e8a23a'}" stroke-width=".9" stroke-linecap="round"/>`);
  }
  const pad = 5;
  return { svg: `<svg viewBox="${minX - pad} ${minZ - pad} ${maxX - minX + pad * 2} ${maxZ - minZ + pad * 2}" role="img" aria-label="${esc(board.name)} top view">${parts.join('')}</svg>`, anchors };
}
