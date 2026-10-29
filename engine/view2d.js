// 2D fallback viewer: an SVG top view with the same interface as the 3D scene, used when
// WebGL is unavailable. `note` explains why it is showing.
import { boardSvg } from './board-geometry.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function create2dViewer(container, BOARD, note) {
  let anchors = {};
  let svg;
  const listeners = new Set();
  const handlers = {};
  function draw(circuit) {
    const out = boardSvg(BOARD, circuit);
    anchors = out.anchors;
    container.innerHTML = `<div class="board2d">${out.svg}<p class="fallback-note">${esc(note)}</p></div>`;
    svg = container.querySelector('svg');
    const info = (el, ev) => {
      const [kind, ...rest] = el.dataset.key.split(':');
      const id = rest.join(':');
      const r = container.getBoundingClientRect();
      const pos = { x: ev.clientX - r.left, y: ev.clientY - r.top };
      if (kind === 'pin') return { kind, key: id, ...pos };
      if (kind === 'part') return { kind, id, ...pos };
      const c = BOARD.components.find((x) => x.id === id);
      return { kind, id, label: c.label, desc: c.desc, ...pos };
    };
    svg.addEventListener('pointermove', (ev) => { const el = ev.target.closest('[data-key]'); handlers.onHover?.(el ? info(el, ev) : null); });
    svg.addEventListener('pointerleave', () => handlers.onHover?.(null));
    svg.addEventListener('click', (ev) => { const el = ev.target.closest('[data-key]'); handlers.onSelect?.(el ? info(el, ev) : null); });
  }
  (function loop() { for (const fn of listeners) fn(); requestAnimationFrame(loop); }());
  return {
    handlers,
    setCircuit: draw,
    highlight({ pins = [], components = [] }) {
      svg.querySelectorAll('.hl').forEach((el) => el.classList.remove('hl', 'pin-hl'));
      for (const key of pins) svg.querySelector(`[data-key="pin:${CSS.escape(key)}"] rect`)?.classList.add('hl', 'pin-hl');
      for (const id of components) svg.querySelector(`[data-key="component:${CSS.escape(id)}"]`)?.classList.add('hl');
    },
    select(ref) {
      svg.querySelectorAll('.sel').forEach((el) => el.classList.remove('sel'));
      if (ref?.part) svg.querySelector(`[data-part="${CSS.escape(ref.part)}"]`)?.classList.add('sel');
    },
    setPart(id, s) {
      const el = svg?.querySelector(`[data-part="${CSS.escape(id)}"]`);
      if (!el) return;
      if ('on' in s) el.classList.toggle('lit', s.on);
      if (s.rgb) el.style.fill = `rgb(${s.rgb.map((v) => Math.round(80 + v * 175)).join(' ')})`;
      if ('pressed' in s) el.style.opacity = s.pressed ? 0.6 : 1;
    },
    project(ref) {
      const a = anchors[ref.pin ? `pin:${ref.pin}` : ref.part ? `part:${ref.part}` : `component:${ref.component}`];
      if (!a || !svg) return null;
      const p = new DOMPoint(a.x, a.z).matrixTransform(svg.getScreenCTM());
      const r = container.getBoundingClientRect();
      return { x: p.x - r.left, y: p.y - r.top, visible: true };
    },
    onFrame(fn) { listeners.add(fn); },
    zoomTo() {}, rotateBy() {}, zoomBy() {}, pan() {}, resetView() {}, setOptions() {}, mapView: () => null,
  };
}
