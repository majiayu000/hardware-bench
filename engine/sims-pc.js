// PC-building sims: an assembly "video" player and a power-button / POST test.
// Same interface as sims.js: render into `el`, drive the scene through ctx, return handlers.

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Assembly player. config:
//   mode: 'assemble' (default; the lesson's scene shows the finished state) or 'disassemble'
//   steps: [{ text, do: 'insert' | 'remove' | 'set', parts: [ids], from, to, pins, zoom }]
// 'insert' drops parts in along their insert vector, 'remove' lifts them out, 'set' tweens part
// state (e.g. a socket lever) from `from` to `to`. Outside Try it every part sits in its default
// (seated, spec) state; entering Try it rewinds to the first step.
function assembly(el, ctx) {
  const { config, escape } = ctx;
  const steps = config.steps;
  const ids = [...new Set(steps.flatMap((s) => s.parts))];
  const seated = (id) => ({ shown: true, lift: 0, ...ctx.partDefaults(id) });
  const apply = (st, step, forward) => {
    for (const id of step.parts) {
      if (step.do === 'insert') st[id] = forward ? { ...st[id], shown: true, lift: 0 } : { ...st[id], shown: false, lift: 1 };
      if (step.do === 'remove') st[id] = forward ? { ...st[id], shown: false, lift: 1 } : { ...st[id], shown: true, lift: 0 };
      if (step.do === 'set') st[id] = { ...st[id], ...(forward ? step.to : step.from) };
    }
  };
  // States before each step: snaps[0] is the start, snaps[steps.length] the end.
  const snaps = [];
  let st = Object.fromEntries(ids.map((id) => [id, seated(id)]));
  if (config.mode === 'disassemble') {
    snaps.push(structuredClone(st));
    for (const step of steps) { st = structuredClone(st); apply(st, step, true); snaps.push(st); }
  } else {
    const back = [structuredClone(st)];
    for (let i = steps.length - 1; i >= 0; i -= 1) { st = structuredClone(st); apply(st, steps[i], false); back.unshift(st); }
    snaps.push(...back);
  }

  el.innerHTML = `<div class="sim player">
    <div class="player-caption"><span class="player-num"></span><p></p></div>
    <div class="player-bar" role="toolbar">
      <button type="button" data-act="first" aria-label="Start over">⏮</button>
      <button type="button" data-act="prev" aria-label="Previous step">◀</button>
      <button type="button" class="primary" data-act="play">▶ Play</button>
      <button type="button" data-act="next" aria-label="Next step">▶|</button>
      <span class="player-track"><span class="player-fill"></span></span>
    </div>
    <ol class="player-steps">${steps.map((s, i) => `<li><button type="button" data-step="${i}"><span class="n">${i + 1}</span><span>${ctx.inline(s.text)}</span></button></li>`).join('')}</ol>
  </div>`;
  const caption = el.querySelector('.player-caption p');
  const num = el.querySelector('.player-num');
  const playBtn = el.querySelector('[data-act="play"]');
  let at = 0;
  let playing = false;
  let frame = 0;
  let wait = 0;

  const show = (state) => { for (const id of ids) ctx.part(id, state[id]); };
  function mark(i) {
    el.querySelectorAll('.player-steps button').forEach((b, j) => {
      b.classList.toggle('done', j < i);
      b.setAttribute('aria-current', String(j === i));
    });
    el.querySelector('.player-fill').style.width = `${(i / steps.length) * 100}%`;
    const step = steps[Math.min(i, steps.length - 1)];
    num.textContent = i >= steps.length ? '✓' : `${i + 1} / ${steps.length}`;
    caption.innerHTML = i >= steps.length ? escape(ctx.t(config.done ?? 'Done!')) : ctx.inline(step.text);
  }
  function stopAnim() { cancelAnimationFrame(frame); clearTimeout(wait); }
  function jump(i) {
    stopAnim();
    at = Math.max(0, Math.min(steps.length, i));
    show(snaps[at]);
    mark(at);
    ctx.focus(steps[at]?.pins ? { pins: steps[at].pins, components: [] } : null);
    for (const id of ids) ctx.bubble(id, null);
  }
  // Animate step `i` from snaps[i] to snaps[i + 1].
  function playStep(i, done) {
    const step = steps[i];
    const from = snaps[i];
    const to = snaps[i + 1];
    mark(i);
    ctx.focus(step.pins ? { pins: step.pins, components: [] } : null);
    ctx.zoomTo({ part: step.zoom ?? step.parts[0] });
    ctx.log(`${i + 1}. ${ctx.t(step.text).replace(/[*`]/g, '')}`);
    const target = step.zoom ?? step.parts[0];
    const start = performance.now();
    const dur = (step.seconds ?? 1.3) * 1000;
    for (const id of step.parts) if (to[id].shown) ctx.part(id, { shown: true });
    const tick = (now) => {
      const k = ease(Math.min(1, (now - start) / dur));
      for (const id of step.parts) {
        const out = {};
        for (const [key, v] of Object.entries(to[id])) if (typeof v === 'number') out[key] = from[id][key] + (v - from[id][key]) * k;
        ctx.part(id, out);
      }
      if (k < 1) { frame = requestAnimationFrame(tick); return; }
      ctx.part(target, to[target]);
      for (const id of step.parts) ctx.part(id, to[id]);
      at = i + 1;
      mark(at);
      done?.();
    };
    frame = requestAnimationFrame(tick);
  }
  function play() {
    if (at >= steps.length) jump(0);
    playing = true;
    playBtn.textContent = '⏸ Pause';
    const loop = () => {
      if (!playing) return;
      if (at >= steps.length) { pause(); ctx.resetView(); return; }
      playStep(at, () => { wait = setTimeout(loop, 900); });
    };
    loop();
  }
  function pause() {
    playing = false;
    stopAnim();
    playBtn.textContent = '▶ Play';
  }
  el.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.step) { pause(); jump(Number(b.dataset.step)); playStep(Number(b.dataset.step)); return; }
    const act = b.dataset.act;
    if (act === 'play') { if (playing) pause(); else play(); }
    if (act === 'first') { pause(); jump(0); ctx.resetView(); }
    if (act === 'prev') { pause(); jump(at - 1); }
    if (act === 'next') { pause(); if (at < steps.length) playStep(at); }
  });
  jump(0);
  return {
    destroy() {
      pause();
      for (const id of ids) { ctx.part(id, seated(id)); ctx.bubble(id, null); }
    },
  };
}

// Power-button test. config: power, reset (casebutton part ids), panel (casepanel id),
// fans (part ids that spin), post (log lines), powerPins / resetPins (header pin keys).
function boot(el, ctx) {
  const { config } = ctx;
  const timers = new Set();
  const later = (ms, fn) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const clear = () => { for (const id of timers) clearTimeout(id); timers.clear(); };
  let on = false;
  let downAt = 0;
  let hddTimer = 0;
  el.innerHTML = `<div class="sim"><div class="readouts">
      <div class="readout"><small>state</small><strong class="r-state">off</strong></div>
      <div class="readout"><small>power LED</small><strong class="r-led">off</strong></div>
    </div>
    <div class="sim-row" style="margin-top:14px">
      <button class="chip-btn" type="button" data-btn="power">Power button</button>
      <button class="chip-btn" type="button" data-btn="reset">Reset button</button>
    </div>
    <p class="sim-caption">Press the buttons here or on the case in the 3D view. Hold Power for 4 seconds to force the PC off.</p></div>`;
  const setState = (txt, led) => {
    el.querySelector('.r-state').textContent = ctx.t(txt);
    el.querySelector('.r-led').textContent = ctx.t(led ? 'on' : 'off');
  };
  const hdd = (active) => {
    clearInterval(hddTimer);
    if (!active) { ctx.part(config.panel, { hdd: false }); return; }
    hddTimer = setInterval(() => ctx.part(config.panel, { hdd: Math.random() > 0.45 }), 120);
  };
  const fans = (spin) => (config.fans ?? []).forEach((id) => ctx.part(id, { spin }));
  function powerOn() {
    on = true;
    ctx.focus({ pins: config.powerPins ?? [], components: [] });
    ctx.log(ctx.t('PWR_SW: pins shorted for a moment → the board wakes the power supply'), 'p');
    fans(1);
    ctx.part(config.panel, { power: true });
    setState('starting', true);
    hdd(true);
    (config.post ?? []).forEach((line, i) => later(500 + i * 450, () => ctx.log(ctx.t(line))));
    later(700 + (config.post ?? []).length * 450, () => { setState('on', true); hdd(false); ctx.focus(null); });
  }
  function powerOff(why) {
    clear();
    on = false;
    ctx.log(ctx.t(why), 'e');
    fans(0);
    hdd(false);
    ctx.part(config.panel, { power: false });
    setState('off', false);
  }
  function press(which, pressed) {
    ctx.part(config[which], { pressed });
    if (which === 'power') {
      if (pressed) {
        downAt = performance.now();
        if (on) later(4000, () => { if (downAt) powerOff('Held for 4 s: forced power off'); });
        return;
      }
      const held = performance.now() - downAt;
      downAt = 0;
      if (held >= 4000) return;
      if (!on) powerOn();
      else { ctx.log(ctx.t('Short press while on: the operating system shuts down cleanly'), 'm'); later(1200, () => powerOff('Shut down')); }
    }
    if (which === 'reset' && pressed) {
      ctx.focus({ pins: config.resetPins ?? [], components: [] });
      if (!on) { ctx.log(ctx.t('RESET_SW pressed while off: nothing happens'), 'm'); return; }
      clear();
      ctx.log(ctx.t('RESET_SW: pins shorted → the board restarts without cutting power'), 'p');
      setState('restarting', true);
      hdd(true);
      (config.post ?? []).forEach((line, i) => later(400 + i * 450, () => ctx.log(ctx.t(line))));
      later(600 + (config.post ?? []).length * 450, () => { setState('on', true); hdd(false); ctx.focus(null); });
    }
  }
  const btns = el.querySelectorAll('[data-btn]');
  btns.forEach((b) => {
    b.addEventListener('pointerdown', (ev) => { ev.preventDefault(); b.setPointerCapture(ev.pointerId); press(b.dataset.btn, true); });
    b.addEventListener('pointerup', () => press(b.dataset.btn, false));
  });
  return {
    input(id, pressed) {
      if (id === config.power) { press('power', pressed); return true; }
      if (id === config.reset) { press('reset', pressed); return true; }
      return false;
    },
    destroy() { clear(); hdd(false); fans(0); ctx.part(config.panel, { power: false, hdd: false }); },
  };
}

export const PC_SIMS = { assembly, boot };
