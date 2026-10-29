// A short guided tour: dims the page, frames one element at a time and explains it in a card.
// steps: [{ el: CSS selector, title, text }]; steps whose element is missing or hidden are skipped.
// labels: { next, back, skip, done } already translated. Calls onClose when the tour ends.

export function startGuide(steps, labels, onClose) {
  const shown = steps.filter((s) => {
    const el = document.querySelector(s.el);
    return el && !el.hidden && el.getClientRects().length > 0;
  });
  if (!shown.length) return;
  const root = document.createElement('div');
  root.className = 'guide';
  root.innerHTML = `<div class="guide-spot"></div><div class="guide-card" role="dialog" aria-modal="true" aria-live="polite">
    <p class="guide-count"></p><h4></h4><p class="guide-text"></p>
    <div class="guide-actions"><button type="button" class="btn ghost" data-act="skip"></button><span></span>
      <button type="button" class="btn ghost" data-act="back"></button><button type="button" class="btn" data-act="next"></button></div></div>`;
  document.body.append(root);
  const spot = root.querySelector('.guide-spot');
  const card = root.querySelector('.guide-card');
  let at = 0;

  function place() {
    const el = document.querySelector(shown[at].el);
    const r = el.getBoundingClientRect();
    const pad = 6;
    Object.assign(spot.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
    // Put the card below the element if it fits, else above, else over its middle; keep it on screen.
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const vw = innerWidth;
    const vh = innerHeight;
    let top = r.bottom + 14;
    if (top + ch > vh - 12) top = r.top - ch - 14;
    if (top < 12) top = Math.max(12, Math.min(vh - ch - 12, r.top + r.height / 2 - ch / 2));
    const left = Math.max(12, Math.min(vw - cw - 12, r.left + r.width / 2 - cw / 2));
    Object.assign(card.style, { left: `${left}px`, top: `${top}px` });
  }
  function show(i) {
    at = i;
    const step = shown[at];
    document.querySelector(step.el).scrollIntoView({ block: 'nearest' });
    card.querySelector('.guide-count').textContent = `${at + 1} / ${shown.length}`;
    card.querySelector('h4').textContent = step.title;
    card.querySelector('.guide-text').textContent = step.text;
    card.querySelector('[data-act="skip"]').textContent = labels.skip;
    card.querySelector('[data-act="back"]').textContent = labels.back;
    card.querySelector('[data-act="back"]').hidden = at === 0;
    card.querySelector('[data-act="next"]').textContent = at === shown.length - 1 ? labels.done : labels.next;
    requestAnimationFrame(place);
    card.querySelector('[data-act="next"]').focus();
  }
  function close() {
    removeEventListener('resize', place);
    removeEventListener('keydown', onKey, true);
    root.remove();
    onClose?.();
  }
  function onKey(ev) {
    if (ev.key === 'Escape') { ev.stopPropagation(); close(); }
    if (ev.key === 'ArrowRight' || ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); if (at < shown.length - 1) show(at + 1); else close(); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); ev.stopPropagation(); if (at > 0) show(at - 1); }
  }
  root.addEventListener('click', (ev) => {
    const act = ev.target.closest('[data-act]')?.dataset.act;
    if (act === 'skip') close();
    if (act === 'back' && at > 0) show(at - 1);
    if (act === 'next') { if (at < shown.length - 1) show(at + 1); else close(); }
  });
  addEventListener('resize', place);
  addEventListener('keydown', onKey, true);
  show(0);
}
