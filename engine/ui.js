// Shared UI helpers: syntax highlighting and the stroke icon set.

// ---------- code highlighting ----------

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
const KEYWORDS = {
  python: 'and as assert break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield async await',
  bash: 'sudo if then else fi for do done while case esac function export cd echo source',
  javascript: 'async await const let var function return if else for while new import from export true false null',
  cpp: 'void int float double bool char long unsigned const if else for while return true false include define',
};
const COMMENT = { python: '#[^\\n]*', bash: '#[^\\n]*', ini: '[#;][^\\n]*', cpp: '//[^\\n]*', javascript: '//[^\\n]*' };

// Returns one highlighted HTML string per source line.
export function highlightLines(src, lang) {
  const kw = new Set((KEYWORDS[lang] ?? '').split(' ').filter(Boolean));
  const re = new RegExp(`${COMMENT[lang] ? `(${COMMENT[lang]})` : '(\\b\\B)'}|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_]\\w*)`, 'g');
  return src.split('\n').map((line) => {
    let out = '';
    let last = 0;
    for (const m of line.matchAll(re)) {
      const [tok, c, s, n, w] = m;
      out += esc(line.slice(last, m.index));
      if (c) out += `<span class="tok-c">${esc(tok)}</span>`;
      else if (s) out += `<span class="tok-s">${esc(tok)}</span>`;
      else if (n) out += `<span class="tok-n">${tok}</span>`;
      else if (w && kw.has(w)) out += `<span class="tok-k">${w}</span>`;
      else if (w && line[m.index + tok.length] === '(') out += `<span class="tok-f">${w}</span>`;
      else out += esc(tok);
      last = m.index + tok.length;
    }
    return out + esc(line.slice(last));
  });
}

// ---------- icons (24×24 stroke icons used by callouts and lesson text) ----------

const ICON_PATHS = {
  pin: 'M9 3h6v6H9zM12 9v12M8 21h8',
  ground: 'M12 3v9M5 12h14M8 16h8M11 20h2',
  power: 'M13 2 4 14h7l-1 8 9-12h-7z',
  led: 'M8 14V9a4 4 0 0 1 8 0v5M6 14h12M10 14v7M14 14v5M12 2v1M4.5 5.5l.8.8M19.5 5.5l-.8.8',
  resistor: 'M2 12h4l2-4 3 8 3-8 3 8 2-4h3',
  button: 'M5 15h14v4H5zM8 15v-3h8v3M12 12V8M9 5h6',
  chip: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
  wave: 'M2 12h3l2-6 3 12 3-9 2 5 2-2h5',
  wifi: 'M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0M12 19h.01M2 9a14 14 0 0 1 20 0',
  camera: 'M3 8h4l2-3h6l2 3h4v11H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  sensor: 'M5 6h14v12H5zM9 10h6v4H9zM8 18v3M12 18v3M16 18v3',
  thermo: 'M10 13V5a2 2 0 0 1 4 0v8a4 4 0 1 1-4 0zM12 9v7',
  ruler: 'M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
  usb: 'M12 3v14M9 6l3-3 3 3M8 12l4 3 4-5M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  memory: 'M3 7h18v10H3zM7 7v10M11 7v10M15 7v10M5 17v3M19 17v3',
  plug: 'M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v3',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  knob: 'M12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM12 13V8M4 20l2-2M20 20l-2-2',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  terminal: 'M3 5h18v14H3zM7 10l3 2-3 2M12 15h5',
  home: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z',
  book: 'M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z',
  play: 'M5 4h14v16H5zM10 9l5 3-5 3z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  rotl: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4',
  rotr: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4',
  plus: 'M5 12h14M12 5v14',
  minus: 'M5 12h14',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  close: 'M6 6l12 12M18 6 6 18',
  copy: 'M8 8h12v12H8zM4 16V4h12',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  sound: 'M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  servo: 'M4 8h12v10H4zM16 11h4M10 8V5M6 5h8',
  car: 'M3 14l2-5h10l3 5M3 14h18v4H3zM7 18v2M17 18v2M14 9V6',
};
export const ICON_NAMES = Object.keys(ICON_PATHS);
export function icon(name, size = 20) {
  const d = ICON_PATHS[name];
  if (!d) throw new Error(`Unknown icon "${name}"`);
  return `<svg class="ico" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}
