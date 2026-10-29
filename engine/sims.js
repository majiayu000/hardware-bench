// "Try it" simulations, plus the small shared UI helpers they use (icons, code highlighting).
// Each sim renders into `el`, mirrors its state onto the 3D scene and the code view, and may
// expose start/stop (the terminal's Run/Stop), input (press-and-hold parts in the scene),
// paramChanged (popover controls) and destroy.
//
// ctx = { config, board, escape, log(text, cls), setRunning(bool), isRunning(), focus(sel|null),
//         zoomTo(ref), part(id, state), trace(label), bubble(id, text|null), param(partId, key) }

import { PC_SIMS } from './sims-pc.js';

const timeNow = () => new Date().toLocaleTimeString('en-GB');
const jitter = (v, amount) => v + (Math.random() - 0.5) * amount;

function timers() {
  const ids = new Set();
  return {
    every(ms, fn) { const id = setInterval(fn, ms); ids.add(id); return id; },
    after(ms, fn) { const id = setTimeout(() => { ids.delete(id); fn(); }, ms); ids.add(id); return id; },
    clear() { for (const id of ids) { clearInterval(id); clearTimeout(id); } ids.clear(); },
  };
}

// Typical forward voltages; current through an LED and its series resistor from a logic pin.
const LED_VF = { red: 2.0, orange: 2.0, yellow: 2.1, green: 2.2, blue: 3.0, white: 3.0 };
export function ledCurrent(volts, color, ohms) {
  return Math.max(0, (volts - (LED_VF[color] ?? 2.0)) / ohms) * 1000;
}
export function ledVerdict(mA, pinLimit = 16) {
  if (mA > pinLimit) return `About ${mA.toFixed(1)} mA: more than a pin should supply.`;
  if (mA >= 5) return `About ${mA.toFixed(1)} mA: bright and safe.`;
  if (mA >= 1) return `About ${mA.toFixed(1)} mA: dimmer, still safe.`;
  return `About ${mA.toFixed(1)} mA: barely glows.`;
}
const brightness = (mA) => Math.min(1, (mA / 10) ** 0.6);

const replace = (tpl, vals) => Object.entries(vals).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, v), tpl);
const requestLine = (config, path) => replace(config.request ?? '{client} - - [{time}] "GET {path} HTTP/1.1" 200 -', { client: '192.168.1.23', time: timeNow(), path });

function ledMarkup(label, color = '#ff3b3b') {
  return `<div class="led" style="--led:${color}" aria-hidden="true"></div><div><strong>${label}</strong><div class="sim-state">LOW · off</div></div>`;
}

const SIMS = {
  // Click a part to light it up on the board.
  tour(el, ctx) {
    const { board, escape } = ctx;
    const items = [
      ...board.headers.map((h) => ({ key: `h:${h.id}`, label: h.label, desc: h.desc, sel: { pins: h.pins.map((p) => `${h.id}:${p.n}`) }, ref: { pin: `${h.id}:1` } })),
      ...board.components.map((c) => ({ key: `c:${c.id}`, label: c.label, desc: c.desc, sel: { components: [c.id] }, ref: { component: c.id } })),
    ];
    el.innerHTML = `<div class="sim"><div class="tour">${items.map((i) => `<button type="button" data-key="${i.key}" aria-pressed="false">${escape(i.label)}</button>`).join('')}</div><p class="tour-desc">Pick a part to find it on the board.</p></div>`;
    const desc = el.querySelector('.tour-desc');
    el.querySelector('.tour').addEventListener('click', (ev) => {
      const btn = ev.target.closest('button');
      if (!btn) return;
      const item = items.find((i) => i.key === btn.dataset.key);
      const wasOn = btn.getAttribute('aria-pressed') === 'true';
      el.querySelectorAll('.tour button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      if (wasOn) { ctx.focus(null); desc.textContent = 'Pick a part to find it on the board.'; return; }
      btn.setAttribute('aria-pressed', 'true');
      ctx.focus(item.sel);
      ctx.zoomTo(item.ref);
      desc.innerHTML = `<strong>${escape(item.label)}.</strong> ${escape(item.desc ?? '')}`;
    });
    return { destroy() { ctx.focus(null); } };
  },

  // Clickable shell commands with canned output.
  commands(el, ctx) {
    const { config, escape } = ctx;
    const t = timers();
    el.innerHTML = `<div class="sim"><div class="cmd-list">${config.commands.map((c, i) => `<button type="button" data-i="${i}"><span data-no-i18n>$ ${escape(c.cmd)}</span><small>${escape(c.note ?? '')}</small></button>`).join('')}</div><p class="sim-caption">Click a command to run it in the terminal below.</p></div>`;
    el.querySelector('.cmd-list').addEventListener('click', (ev) => {
      const btn = ev.target.closest('button');
      if (!btn) return;
      t.clear();
      const c = config.commands[Number(btn.dataset.i)];
      ctx.log(`$ ${c.cmd}`, 'p');
      (c.out ?? []).forEach((line, i) => t.after(60 + i * 70, () => ctx.log(line)));
    });
    return { destroy: t.clear };
  },

  // config: led, resistor (part ids), label, delay (s), volts
  led(el, ctx) {
    const { config } = ctx;
    const t = timers();
    let delay = config.delay ?? 1;
    const color = () => ctx.param(config.led, 'color') ?? 'red';
    const mA = () => ledCurrent(config.volts ?? 3.3, color(), ctx.param(config.resistor, 'ohms') ?? 330);
    el.innerHTML = `<div class="sim"><div class="sim-row">${ledMarkup(ctx.escape(config.label ?? 'LED'))}</div>
      <div class="slider-row" style="margin-top:16px"><label for="sleepRange">delay</label><input id="sleepRange" type="range" min="0.1" max="2" step="0.1" value="${delay}"><output>${delay.toFixed(1)}s</output></div>
      <p class="sim-caption">Press Run, then drag the slider: it changes the delay in the code. Click the LED or resistor in the 3D view to swap parts.</p></div>`;
    const led = el.querySelector('.led');
    const state = el.querySelector('.sim-state');
    let on = false;
    const paint = () => {
      led.style.setProperty('--led', `var(--led-${color()}, #ff3b3b)`);
      led.classList.toggle('lit', on);
      state.textContent = on ? `HIGH · ${mA().toFixed(1)} mA` : 'LOW · off';
      ctx.part(config.led, { on, level: brightness(mA()), color: color() });
      ctx.bubble(config.led, ctx.isRunning() ? (on ? `HIGH · ${mA().toFixed(1)} mA` : 'LOW') : null);
    };
    function tick() {
      on = !on;
      paint();
      ctx.trace(on ? 'on' : 'off');
      ctx.log(on ? 'LED on' : 'LED off');
      t.after(delay * 1000, tick);
    }
    el.querySelector('input').addEventListener('input', (ev) => {
      delay = Number(ev.target.value);
      ev.target.nextElementSibling.textContent = `${delay.toFixed(1)}s`;
    });
    paint();
    return {
      start() { t.clear(); on = false; tick(); },
      stop() { t.clear(); on = false; paint(); ctx.trace(null); },
      paramChanged: paint,
      destroy() { t.clear(); on = false; ctx.part(config.led, { on: false }); },
    };
  },

  // config: button, led (part ids), label
  button(el, ctx) {
    const { config } = ctx;
    el.innerHTML = `<div class="sim"><div class="sim-row"><button class="push" type="button" aria-label="Push button">PUSH</button>${ledMarkup(ctx.escape(config.label ?? 'LED'))}</div><p class="sim-caption">Hold this button, or the one in the 3D view. Nothing listens to the pin until the script is running.</p></div>`;
    const led = el.querySelector('.led');
    const state = el.querySelector('.sim-state');
    const btn = el.querySelector('.push');
    let down = false;
    const press = (v) => {
      if (v === down) return;
      down = v;
      btn.classList.toggle('down', v);
      ctx.part(config.button, { pressed: v });
      if (!ctx.isRunning()) return;
      led.classList.toggle('lit', v);
      state.textContent = v ? 'HIGH · on' : 'LOW · off';
      ctx.part(config.led, { on: v, level: 0.8 });
      ctx.bubble(config.button, v ? 'pressed' : 'released');
      ctx.trace(v ? 'pressed' : 'released');
      ctx.log(v ? 'Pressed!' : 'Released');
    };
    btn.addEventListener('pointerdown', (ev) => { ev.preventDefault(); btn.setPointerCapture(ev.pointerId); press(true); });
    btn.addEventListener('pointerup', () => press(false));
    btn.addEventListener('pointercancel', () => press(false));
    btn.addEventListener('keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); press(true); } });
    btn.addEventListener('keyup', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') press(false); });
    return {
      start() { ctx.trace('wait'); ctx.bubble(config.button, 'released'); },
      stop() { press(false); led.classList.remove('lit'); state.textContent = 'LOW · off'; ctx.part(config.led, { on: false }); ctx.bubble(config.button, null); ctx.trace(null); },
      input(id, pressed) { if (id !== config.button) return false; press(pressed); return true; },
      destroy() { ctx.part(config.led, { on: false }); ctx.part(config.button, { pressed: false }); },
    };
  },

  // config: led (part id), sequence [[name, [r, g, b]]], repl (template with {r} {g} {b}),
  //         scale (print slider values ×scale as integers, e.g. 255), log (template with {name} {rgb})
  rgb(el, ctx) {
    const { config } = ctx;
    const t = timers();
    const c = { r: 0, g: 0, b: 0 };
    const repl = (r, g, b) => replace(config.repl ?? 'led.color = ({r}, {g}, {b})', { r, g, b });
    const fmt = (v) => (config.scale ? String(Math.round(v * config.scale)) : v.toFixed(2));
    el.innerHTML = `<div class="sim"><div class="sim-row" style="align-items:flex-start">
        <div class="led lit" style="--led:#000"></div>
        <div style="flex:1;min-width:200px">${['r', 'g', 'b'].map((k) => `<div class="slider-row"><label for="rgb-${k}">${{ r: 'red', g: 'green', b: 'blue' }[k]}</label><input id="rgb-${k}" data-k="${k}" type="range" min="0" max="1" step="0.01" value="0"><output>0.00</output></div>`).join('')}</div>
      </div><p class="sim-caption">The sliders act like the interactive prompt: each change runs <code>${ctx.escape(repl('r', 'g', 'b'))}</code>. Run plays the script.</p></div>`;
    const led = el.querySelector('.led');
    let logTimer = 0;
    function paint(log) {
      const to255 = (v) => Math.round(v * 255);
      led.style.setProperty('--led', `rgb(${to255(c.r)} ${to255(c.g)} ${to255(c.b)})`);
      led.classList.toggle('lit', c.r + c.g + c.b > 0);
      for (const k of ['r', 'g', 'b']) {
        const input = el.querySelector(`[data-k="${k}"]`);
        input.value = c[k];
        input.nextElementSibling.textContent = c[k].toFixed(2);
      }
      ctx.part(config.led, { rgb: [c.r, c.g, c.b] });
      ctx.bubble(config.led, c.r + c.g + c.b > 0 ? `(${c.r.toFixed(2)}, ${c.g.toFixed(2)}, ${c.b.toFixed(2)})` : null);
      if (log) {
        clearTimeout(logTimer);
        logTimer = setTimeout(() => ctx.log(`>>> ${repl(fmt(c.r), fmt(c.g), fmt(c.b))}`, 'p'), 250);
      }
    }
    el.addEventListener('input', (ev) => {
      const k = ev.target.dataset.k;
      if (!k) return;
      c[k] = Number(ev.target.value);
      paint(true);
    });
    paint(false);
    return {
      start() {
        t.clear();
        let i = 0;
        const step = () => {
          const [name, rgb] = config.sequence[i % config.sequence.length];
          [c.r, c.g, c.b] = rgb;
          paint(false);
          ctx.trace('set');
          ctx.log(replace(config.log ?? '{name} ({rgb})', { name, rgb: rgb.join(', ') }));
          i += 1;
          t.after(1000, step);
        };
        step();
      },
      stop() { t.clear(); c.r = c.g = c.b = 0; paint(false); ctx.trace(null); },
      destroy() { t.clear(); clearTimeout(logTimer); ctx.part(config.led, { rgb: [0, 0, 0] }); },
    };
  },

  // config: sensor (part id with a `distance` control), max (cm), limitNote
  distance(el, ctx) {
    const { config } = ctx;
    const t = timers();
    const max = config.max ?? 200;
    let cm = ctx.param(config.sensor, 'distance') ?? 40;
    el.innerHTML = `<div class="sim">
      <div class="range-scene"><div class="sensor"></div><div class="beam"></div><div class="wall"></div></div>
      <div class="slider-row" style="margin-top:14px"><label for="objRange">object</label><input id="objRange" type="range" min="2" max="250" step="1" value="${cm}"><output>${cm} cm</output></div>
      <div class="readouts"><div class="readout"><small>distance</small><strong class="r-dist">–</strong></div><div class="readout"><small>echo time</small><strong class="r-echo">–</strong></div></div>
      <p class="sim-caption">Move the object here or from the sensor in the 3D view. ${ctx.escape(config.limitNote ?? `Past ${max} cm the reading stays at the maximum.`)}</p></div>`;
    const scene = el.querySelector('.range-scene');
    const input = el.querySelector('input');
    function layout() {
      const x = 44 + (cm / 250) * (scene.clientWidth - 60);
      el.querySelector('.wall').style.left = `${x}px`;
      el.querySelector('.beam').style.width = `${x - 44}px`;
    }
    function measure() {
      const reading = Math.min(jitter(cm, 0.8), max);
      el.querySelector('.r-dist').textContent = `${reading.toFixed(1)} cm`;
      el.querySelector('.r-echo').textContent = `${((reading * 2) / 34300 * 1000).toFixed(2)} ms`;
      ctx.bubble(config.sensor, `${reading.toFixed(1)} cm`);
      return reading;
    }
    const setCm = (v) => {
      cm = v;
      input.value = v;
      input.nextElementSibling.textContent = `${v} cm`;
      layout();
      if (ctx.isRunning()) measure();
    };
    input.addEventListener('input', (ev) => setCm(Number(ev.target.value)));
    const ro = new ResizeObserver(layout);
    ro.observe(scene);
    return {
      start() { t.clear(); t.every(500, () => { ctx.trace('read'); ctx.log(`Distance: ${measure().toFixed(1)} cm`); }); },
      stop() { t.clear(); ctx.bubble(config.sensor, null); ctx.trace(null); },
      paramChanged(id, key, value) { if (id === config.sensor && key === 'distance') setCm(Number(value)); },
      destroy() { t.clear(); ro.disconnect(); },
    };
  },

  // config: sensor (part id), fields (subset of temp/hum/pres), every (s), tempDigits
  env(el, ctx) {
    const { config } = ctx;
    const t = timers();
    const s = { temp: 22.8, hum: 46, pres: 1012.4, breath: 0 };
    const fields = config.fields ?? ['temp', 'hum', 'pres'];
    const meta = { temp: ['temperature', '°C', config.tempDigits ?? 2], hum: ['humidity', '%', 1], pres: ['pressure', 'hPa', 1] };
    el.innerHTML = `<div class="sim"><div class="readouts">${fields.map((f) => `<div class="readout"><small>${meta[f][0]}</small><strong data-f="${f}">–</strong></div>`).join('')}</div>
      <div class="sim-row" style="margin-top:14px"><button class="chip-btn" type="button">Breathe on the sensor</button></div>
      <p class="sim-caption">Warm, damp breath pushes temperature and humidity up for a few seconds.</p></div>`;
    el.querySelector('button').addEventListener('click', () => { s.breath = 1; if (!ctx.isRunning()) ctx.log('(nothing happens: the script is not running)', 'm'); });
    function sample() {
      s.breath = Math.max(0, s.breath - 0.12);
      const r = { temp: jitter(s.temp + s.breath * 3.2, 0.06), hum: jitter(s.hum + s.breath * 28, 0.3), pres: jitter(s.pres, 0.08) };
      for (const f of fields) el.querySelector(`[data-f="${f}"]`).textContent = `${r[f].toFixed(1)} ${meta[f][1]}`;
      return r;
    }
    return {
      start() {
        t.clear();
        const tick = () => {
          const r = sample();
          const line = fields.map((f) => `${r[f].toFixed(meta[f][2])} ${meta[f][1]}`).join('  ');
          ctx.trace('read');
          ctx.bubble(config.sensor, fields.slice(0, 2).map((f) => `${r[f].toFixed(1)} ${meta[f][1]}`).join(' · '));
          ctx.log(line);
        };
        tick();
        t.every((config.every ?? 1) * 1000, tick);
      },
      stop() { t.clear(); ctx.bubble(config.sensor, null); ctx.trace(null); },
      destroy: t.clear,
    };
  },

  // config: pot (part id), label, vmax (V), every (s), max (ADC full scale, default 65535),
  //         log (template with {raw} {mv}), led (part id whose brightness follows the knob)
  // config: pot (part id; leave it out for a reading with no part, like a microphone level), led,
  // servo (part ids driven by the reading), invert (outputs fall as the reading rises), slider (its
  // label), readout: 'raw' (hide the voltage), label, vmax, max, every, log, caption
  knob(el, ctx) {
    const { config } = ctx;
    const out = (v) => (config.invert ? 1 - v / 100 : v / 100);
    const drive = (v) => {
      if (config.led) ctx.part(config.led, { on: out(v) > 0.02, level: out(v) });
      if (config.servo) ctx.part(config.servo, { angle: Math.round(out(v) * 180) });
    };
    const t = timers();
    const vmax = config.vmax ?? 3.3;
    let pos = Math.round((ctx.param(config.pot, 'value') ?? 0.5) * 100);
    el.innerHTML = `<div class="sim">
      <div class="slider-row"><label for="knobRange">${ctx.escape(config.slider ?? 'knob')}</label><input id="knobRange" type="range" min="0" max="100" step="1" value="${pos}"><output>${pos}%</output></div>
      <div class="readouts" style="margin-top:12px">${config.readout === 'raw' ? '' : `<div class="readout"><small>${ctx.escape(config.label ?? 'pin voltage')}</small><strong class="r-v">–</strong></div>`}<div class="readout"><small>${ctx.escape(config.readout === 'raw' ? config.label ?? 'raw reading' : 'raw reading')}</small><strong class="r-raw">–</strong></div></div>
      <p class="sim-caption">${ctx.escape(config.caption ?? 'Turn the knob here or in the 3D view. The simulator shows ideal readings; real ADCs are less accurate near the ends of their range.')}</p></div>`;
    const input = el.querySelector('input');
    function measure() {
      const volts = Math.max(0, Math.min(vmax, jitter((pos / 100) * vmax, 0.01)));
      const raw = Math.round((volts / vmax) * (config.max ?? 65535));
      const mv = Math.round(volts * 1000);
      if (config.readout !== 'raw') el.querySelector('.r-v').textContent = `${mv} mV`;
      el.querySelector('.r-raw').textContent = String(raw);
      ctx.bubble(config.pot, `${mv} mV`);
      return { raw, mv };
    }
    const setPos = (v) => {
      pos = v;
      input.value = v;
      input.nextElementSibling.textContent = `${v}%`;
      ctx.part(config.pot, { value: v / 100 });
      if (ctx.isRunning()) { drive(v); measure(); }
    };
    input.addEventListener('input', (ev) => setPos(Number(ev.target.value)));
    return {
      start() {
        t.clear();
        const tick = () => {
          const r = measure();
          ctx.trace('read');
          drive(pos);
          ctx.log(replace(config.log ?? 'raw: {raw}  voltage: {mv} mV', { raw: r.raw, mv: r.mv }));
        };
        tick();
        t.every((config.every ?? 0.5) * 1000, tick);
      },
      stop() { t.clear(); ctx.bubble(config.pot, null); ctx.trace(null); if (config.led) ctx.part(config.led, { on: false }); },
      paramChanged(id, key, value) { if (id === config.pot && key === 'value') setPos(Math.round(Number(value) * 100)); },
      destroy: t.clear,
    };
  },

  // config: start (log lines), file (saved name)
  camera(el, ctx) {
    const { config } = ctx;
    const t = timers();
    el.innerHTML = '<div class="sim"><canvas class="photo" width="640" height="480" aria-label="Captured photo"></canvas><p class="sim-caption">Press Run to take a photo with the script.</p></div>';
    const canvas = el.querySelector('canvas');
    function draw() {
      const g = canvas.getContext('2d');
      const { width: w, height: h } = canvas;
      const hue = Math.floor(Math.random() * 360);
      const sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, `hsl(${hue} 70% 72%)`);
      sky.addColorStop(1, `hsl(${(hue + 40) % 360} 60% 88%)`);
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);
      g.fillStyle = `hsl(${(hue + 180) % 360} 80% 92%)`;
      g.beginPath(); g.arc(w * (0.2 + Math.random() * 0.6), h * 0.3, 46, 0, Math.PI * 2); g.fill();
      for (let layer = 0; layer < 3; layer += 1) {
        g.fillStyle = `hsl(${(hue + 120) % 360} ${30 + layer * 10}% ${42 - layer * 10}%)`;
        g.beginPath();
        g.moveTo(0, h);
        for (let x = 0; x <= w; x += 20) g.lineTo(x, h * (0.55 + layer * 0.12) + Math.sin(x / (60 + layer * 30) + hue) * 24);
        g.lineTo(w, h);
        g.fill();
      }
      g.fillStyle = 'rgba(0,0,0,.55)';
      g.fillRect(0, h - 34, w, 34);
      g.fillStyle = '#fff';
      g.font = '18px "IBM Plex Mono", monospace';
      g.fillText(`${config.file ?? 'photo.jpg'} · ${timeNow()}`, 14, h - 11);
    }
    return {
      start() {
        t.clear();
        ctx.trace('start');
        (config.start ?? ['Camera detected', 'Waiting 2 s for auto-exposure…']).forEach((line) => ctx.log(line, 'm'));
        t.after(1400, () => { ctx.trace('capture'); draw(); ctx.log(`Saved ${config.file ?? 'photo.jpg'}`); ctx.setRunning(false); });
      },
      stop() { t.clear(); ctx.trace(null); },
      destroy: t.clear,
    };
  },

  // config: url, led (part id), label, title, start (log lines), request (log template)
  web(el, ctx) {
    const { config } = ctx;
    el.innerHTML = `<div class="sim"><div class="sim-row" style="align-items:flex-start">
      <div class="browser" style="flex:1;min-width:220px"><div class="browser-bar"><i></i><i></i><i></i><span>${ctx.escape(config.url)}</span></div><div class="browser-body"></div></div>
      ${ledMarkup(ctx.escape(config.label ?? 'LED'))}
      </div><p class="sim-caption">This is the page your phone sees. Each click sends an HTTP request to the board.</p></div>`;
    const body = el.querySelector('.browser-body');
    const led = el.querySelector('.led');
    const state = el.querySelector('.sim-state');
    function page() {
      body.innerHTML = ctx.isRunning()
        ? `<h4>${ctx.escape(config.title ?? 'LED control')}</h4><div class="sim-row"><button class="btn" data-s="on" type="button">On</button><button class="btn ghost" data-s="off" type="button">Off</button></div>`
        : '<p style="margin:0;color:var(--muted)">This site can’t be reached. Start the server with Run.</p>';
    }
    const setLed = (on) => {
      led.classList.toggle('lit', on);
      state.textContent = on ? 'HIGH · on' : 'LOW · off';
      ctx.part(config.led, { on, level: 0.8 });
    };
    body.addEventListener('click', (ev) => {
      const s = ev.target.closest('button')?.dataset.s;
      if (!s) return;
      setLed(s === 'on');
      ctx.trace(s);
      ctx.bubble(config.led, `GET /led/${s}`);
      ctx.log(requestLine(config, `/led/${s}`));
    });
    page();
    return {
      start() { ctx.trace('serve'); (config.start ?? [' * Running on http://192.168.1.42:5000', 'Press CTRL+C to quit']).forEach((l) => ctx.log(l, 'm')); page(); },
      stop() { page(); setLed(false); ctx.bubble(config.led, null); ctx.trace(null); },
      destroy() { ctx.part(config.led, { on: false }); },
    };
  },

  // config: url, sensor (part id), title, fields (temperature/humidity/pressure), every (s), start, request
  dashboard(el, ctx) {
    const { config } = ctx;
    const t = timers();
    const every = config.every ?? 2;
    const fields = config.fields ?? ['temperature', 'humidity', 'pressure'];
    const units = { temperature: '°C', humidity: '%', pressure: 'hPa' };
    const history = [];
    let temp = 22.6;
    el.innerHTML = `<div class="sim"><div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span>${ctx.escape(config.url)}</span></div><div class="browser-body"></div></div><p class="sim-caption">The page asks the board for a new reading every ${every} seconds.</p></div>`;
    const body = el.querySelector('.browser-body');
    function render(r) {
      if (!ctx.isRunning() || !r) {
        body.innerHTML = '<p style="margin:0;color:var(--muted)">This site can’t be reached. Start it with Run.</p>';
        return;
      }
      const min = Math.min(...history) - 0.2;
      const max = Math.max(...history) + 0.2;
      const pts = history.map((v, i) => `${(i / Math.max(1, history.length - 1)) * 300},${44 - ((v - min) / (max - min)) * 40}`).join(' L');
      body.innerHTML = `<h4>${ctx.escape(config.title ?? 'Weather station')}</h4><div class="readouts">${fields.map((f) => `<div class="readout"><small>${f}</small><strong>${r[f]} ${units[f]}</strong></div>`).join('')}</div>
        <svg class="spark" viewBox="0 0 300 48" preserveAspectRatio="none" aria-label="Temperature trend"><path d="M${pts}"/></svg>`;
    }
    function poll() {
      temp = jitter(temp, 0.25);
      const r = { temperature: temp.toFixed(1), humidity: jitter(45, 1).toFixed(1), pressure: jitter(1012.6, 0.3).toFixed(1) };
      history.push(temp);
      if (history.length > 30) history.shift();
      render(r);
      ctx.trace('reading');
      ctx.bubble(config.sensor, `${r.temperature} °C`);
      ctx.log(requestLine(config, '/api/reading'));
    }
    render();
    return {
      start() {
        t.clear();
        (config.start ?? []).forEach((line) => ctx.log(line, 'm'));
        poll();
        t.every(every * 1000, poll);
      },
      stop() { t.clear(); render(); ctx.bubble(config.sensor, null); ctx.trace(null); },
      destroy: t.clear,
    };
  },
  // config: buzzer (part id), melody [[name, hz, ms]] (hz 0 = rest), pin, log (template with {pin} {hz} {name}).
  // Optional real sound through Web Audio.
  buzzer(el, ctx) {
    const { config } = ctx;
    const t = timers();
    let audio = null;
    let osc = null;
    el.innerHTML = `<div class="sim"><div class="sim-row"><div class="readouts"><div class="readout"><small>note</small><strong class="r-note">–</strong></div><div class="readout"><small>frequency</small><strong class="r-hz">–</strong></div></div></div>
      <div class="sim-row" style="margin-top:12px"><button class="chip-btn" type="button" aria-pressed="false">Sound off</button></div>
      <p class="sim-caption">Press Run to play the melody. Turn the sound on to hear it (quietly).</p></div>`;
    const btn = el.querySelector('button');
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      btn.textContent = on ? 'Sound on' : 'Sound off';
      if (on && !audio) audio = new AudioContext();
    });
    const quiet = () => { osc?.stop(); osc = null; };
    function play(i) {
      const [name, hz, ms] = config.melody[i % config.melody.length];
      const rest = hz === 0;
      el.querySelector('.r-note').textContent = rest ? 'rest' : name;
      el.querySelector('.r-hz').textContent = rest ? '–' : `${hz} Hz`;
      ctx.part(config.buzzer, { on: !rest });
      ctx.bubble(config.buzzer, rest ? null : `${name} · ${hz} Hz`);
      ctx.trace(rest ? 'rest' : 'tone');
      ctx.log(rest ? 'rest' : replace(config.log ?? 'tone({pin}, {hz})  {name}', { pin: config.pin ?? 8, hz, name }));
      quiet();
      if (!rest && audio && btn.getAttribute('aria-pressed') === 'true') {
        const gain = audio.createGain();
        gain.gain.value = 0.04;
        osc = audio.createOscillator();
        osc.type = 'square';
        osc.frequency.value = hz;
        osc.connect(gain).connect(audio.destination);
        osc.start();
      }
      t.after(ms * 0.9, () => { quiet(); ctx.part(config.buzzer, { on: false }); });
      t.after(ms, () => play(i + 1));
    }
    return {
      start() { t.clear(); play(0); },
      stop() { t.clear(); quiet(); ctx.part(config.buzzer, { on: false }); ctx.bubble(config.buzzer, null); ctx.trace(null); },
      destroy() { t.clear(); quiet(); audio?.close(); ctx.part(config.buzzer, { on: false }); },
    };
  },

  // config: servo (part id with an `angle` control), min, max, step (deg), every (ms)
  servo(el, ctx) {
    const { config } = ctx;
    const t = timers();
    let angle = ctx.param(config.servo, 'angle') ?? 90;
    let dir = 1;
    el.innerHTML = `<div class="sim"><div class="readouts"><div class="readout"><small>angle</small><strong class="r-a">–</strong></div></div>
      <div class="slider-row" style="margin-top:12px"><label for="servoRange">write()</label><input id="servoRange" type="range" min="0" max="180" step="1" value="${angle}"><output>${angle}°</output></div>
      <p class="sim-caption">Run sweeps the servo from ${config.min ?? 0}° to ${config.max ?? 180}° and back. When stopped, the slider (or the servo's popover) moves it directly.</p></div>`;
    const input = el.querySelector('input');
    const set = (a) => {
      angle = a;
      input.value = a;
      input.nextElementSibling.textContent = `${a}°`;
      el.querySelector('.r-a').textContent = `${a}°`;
      ctx.part(config.servo, { angle: a });
      ctx.bubble(config.servo, `${a}°`);
    };
    input.addEventListener('input', (ev) => { if (!ctx.isRunning()) { set(Number(ev.target.value)); ctx.log(`myServo.write(${angle})`, 'p'); } });
    set(angle);
    return {
      start() {
        t.clear();
        t.every(config.every ?? 30, () => {
          let next = angle + dir * (config.step ?? 2);
          if (next >= (config.max ?? 180) || next <= (config.min ?? 0)) dir = -dir;
          next = Math.max(config.min ?? 0, Math.min(config.max ?? 180, next));
          set(next);
          ctx.trace('write');
          if (next % 30 === 0) ctx.log(`angle: ${next}`);
        });
      },
      stop() { t.clear(); ctx.trace(null); },
      paramChanged(id, key, value) { if (id === config.servo && key === 'angle' && !ctx.isRunning()) set(Number(value)); },
      destroy: t.clear,
    };
  },

  // Parking sensor. config: sensor (module with a `distance` control), buzzer, led (part ids), near (cm), max (cm)
  parking(el, ctx) {
    const { config } = ctx;
    const t = timers();
    let cm = ctx.param(config.sensor, 'distance') ?? 60;
    let lastBeep = 0;
    let lastLog = 0;
    el.innerHTML = `<div class="sim">
      <div class="range-scene"><div class="sensor"></div><div class="beam"></div><div class="wall"></div></div>
      <div class="slider-row" style="margin-top:14px"><label for="objRange">object</label><input id="objRange" type="range" min="2" max="150" step="1" value="${cm}"><output>${cm} cm</output></div>
      <div class="readouts"><div class="readout"><small>distance</small><strong class="r-dist">–</strong></div><div class="readout"><small>beep every</small><strong class="r-beep">–</strong></div></div>
      <p class="sim-caption">Move the object closer: the beeps speed up, and under ${config.near ?? 15} cm the LED lights and the tone holds.</p></div>`;
    const scene = el.querySelector('.range-scene');
    const input = el.querySelector('input');
    const layout = () => {
      const x = 44 + (cm / 150) * (scene.clientWidth - 60);
      el.querySelector('.wall').style.left = `${x}px`;
      el.querySelector('.beam').style.width = `${x - 44}px`;
    };
    const setCm = (v) => { cm = v; input.value = v; input.nextElementSibling.textContent = `${v} cm`; layout(); };
    input.addEventListener('input', (ev) => setCm(Number(ev.target.value)));
    const ro = new ResizeObserver(layout);
    ro.observe(scene);
    function tick() {
      const now = performance.now();
      const reading = Math.min(jitter(cm, 0.6), config.max ?? 200);
      const near = reading < (config.near ?? 15);
      const gap = near ? 0 : Math.min(1000, reading * 10);
      el.querySelector('.r-dist').textContent = `${reading.toFixed(0)} cm`;
      el.querySelector('.r-beep').textContent = near ? 'solid' : `${gap.toFixed(0)} ms`;
      ctx.bubble(config.sensor, `${reading.toFixed(0)} cm`);
      ctx.part(config.led, { on: near, level: 0.9 });
      ctx.trace('read');
      if (near || now - lastBeep > gap) {
        lastBeep = now;
        ctx.part(config.buzzer, { on: true });
        ctx.trace('beep');
        t.after(near ? 90 : 60, () => { if (!near) ctx.part(config.buzzer, { on: false }); });
      }
      if (now - lastLog > 500) { lastLog = now; ctx.log(`Distance: ${reading.toFixed(0)} cm`); }
    }
    return {
      start() { t.clear(); t.every(80, tick); },
      stop() { t.clear(); ctx.part(config.buzzer, { on: false }); ctx.part(config.led, { on: false }); ctx.bubble(config.sensor, null); ctx.trace(null); },
      paramChanged(id, key, value) { if (id === config.sensor && key === 'distance') setCm(Number(value)); },
      destroy() { t.clear(); ro.disconnect(); },
    };
  },

  // LEDs (and an optional buzzer) stepping through timed states, like a traffic light.
  // config: lamps [led ids], steps [{ set: { ledId: on }, tone (Hz), ms, log, trace }], buzzer (id),
  //         button (id): Run then waits in `idle` until the button is pressed and plays the steps once.
  sequence(el, ctx) {
    const { config, escape } = ctx;
    const t = timers();
    const lamps = config.lamps ?? [];
    let audio = null;
    let osc = null;
    let busy = false;
    let down = false;
    el.innerHTML = `<div class="sim"><div class="sim-row">${config.button ? '<button class="push" type="button" aria-label="Push button">PUSH</button>' : ''}
      <div class="lamps">${lamps.map((id) => `<div class="led" data-id="${escape(id)}" style="--led:var(--led-${ctx.param(id, 'color') ?? 'red'})" aria-hidden="true"></div>`).join('')}</div>
      <strong class="seq-state" data-no-i18n>${escape(ctx.t('Stopped'))}</strong></div>
      ${config.buzzer ? '<div class="sim-row" style="margin-top:12px"><button class="chip-btn" data-act="sound" type="button" aria-pressed="false">Sound off</button></div>' : ''}
      <p class="sim-caption">${escape(config.caption ?? 'Press Run to start the sequence.')}</p></div>`;
    const stateEl = el.querySelector('.seq-state');
    const soundBtn = el.querySelector('[data-act="sound"]');
    const push = el.querySelector('.push');
    soundBtn?.addEventListener('click', () => {
      const on = soundBtn.getAttribute('aria-pressed') !== 'true';
      soundBtn.setAttribute('aria-pressed', String(on));
      soundBtn.textContent = on ? 'Sound on' : 'Sound off';
      if (on && !audio) audio = new AudioContext();
    });
    const quiet = () => { osc?.stop(); osc = null; if (config.buzzer) { ctx.part(config.buzzer, { on: false }); ctx.bubble(config.buzzer, null); } };
    function apply(set = {}) {
      for (const [id, on] of Object.entries(set)) {
        ctx.part(id, { on, level: 0.9, color: ctx.param(id, 'color') });
        el.querySelector(`.led[data-id="${CSS.escape(id)}"]`)?.classList.toggle('lit', on);
      }
    }
    function tone(hz, ms) {
      ctx.part(config.buzzer, { on: true });
      ctx.bubble(config.buzzer, `${hz} Hz`);
      if (audio && soundBtn.getAttribute('aria-pressed') === 'true') {
        const gain = audio.createGain();
        gain.gain.value = 0.04;
        osc = audio.createOscillator();
        osc.type = 'square';
        osc.frequency.value = hz;
        osc.connect(gain).connect(audio.destination);
        osc.start();
      }
      t.after(ms * 0.9, quiet);
    }
    function idle() {
      busy = false;
      apply(config.idle);
      ctx.trace('wait');
      stateEl.textContent = ctx.t('Waiting for the button');
    }
    function play(i) {
      const step = config.steps[i];
      apply(step.set);
      if (step.tone) tone(step.tone, step.ms);
      if (step.log) { ctx.log(step.log); stateEl.textContent = step.log; }
      ctx.trace(step.trace ?? null);
      t.after(step.ms, () => {
        if (i + 1 < config.steps.length) play(i + 1);
        else if (config.button) idle();
        else play(0);
      });
    }
    function press(v) {
      if (v === down) return;
      down = v;
      push?.classList.toggle('down', v);
      ctx.part(config.button, { pressed: v });
      if (!v || !ctx.isRunning() || busy) return;
      busy = true;
      ctx.trace('pressed');
      play(0);
    }
    if (push) {
      push.addEventListener('pointerdown', (ev) => { ev.preventDefault(); push.setPointerCapture(ev.pointerId); press(true); });
      push.addEventListener('pointerup', () => press(false));
    }
    const off = () => { t.clear(); quiet(); apply(Object.fromEntries(lamps.map((id) => [id, false]))); };
    return {
      start() { off(); if (config.button) idle(); else play(0); },
      stop() { off(); busy = false; ctx.trace(null); stateEl.textContent = ctx.t('Stopped'); },
      input(id, pressed) { if (id !== config.button) return false; press(pressed); return true; },
      destroy() { off(); audio?.close(); },
    };
  },

  // A dot-matrix display playing frames, drawn in the panel. config: frames [{ rows: ['0070…'] (one
  // string per row, one digit 0–7 per LED), ms, log, trace }], color, caption.
  matrix(el, ctx) {
    const { config, escape } = ctx;
    const t = timers();
    const rows = config.frames[0].rows.length;
    const cols = config.frames[0].rows[0].length;
    el.innerHTML = `<div class="sim"><div class="dotmatrix" style="--cols:${cols};--led:${escape(config.color ?? '#5aa9ff')}">${'<i></i>'.repeat(rows * cols)}</div>
      <p class="sim-caption">${escape(config.caption ?? 'Press Run to play the frames.')}</p></div>`;
    const dots = el.querySelectorAll('.dotmatrix i');
    const show = (frame) => frame.rows.forEach((row, r) => [...row].forEach((v, c) => { dots[r * cols + c].style.opacity = String(0.12 + (Number(v) / 7) * 0.88); }));
    const blank = () => dots.forEach((d) => { d.style.opacity = '0.12'; });
    function play(i) {
      const f = config.frames[i % config.frames.length];
      show(f);
      if (f.log) ctx.log(f.log);
      ctx.trace(f.trace ?? null);
      t.after(f.ms ?? 1000, () => play(i + 1));
    }
    blank();
    return {
      start() { t.clear(); play(0); },
      stop() { t.clear(); blank(); ctx.trace(null); },
      destroy: t.clear,
    };
  },
};

Object.assign(SIMS, PC_SIMS);

export function createSim(type, el, ctx) {
  const factory = SIMS[type];
  if (!factory) throw new Error(`Unknown sim type "${type}"`);
  return factory(el, ctx);
}

export const SIM_TYPES = Object.keys(SIMS);
// Sims started by the terminal's Run button (their lessons need run.cmd).
export const RUNNABLE = ['led', 'button', 'rgb', 'distance', 'env', 'knob', 'camera', 'web', 'dashboard', 'buzzer', 'servo', 'parking', 'sequence', 'matrix'];
// Labels each sim passes to ctx.trace(); a code file's `trace` maps them to line numbers.
// A sequence also uses the `trace` of each of its steps, and a matrix the `trace` of each frame.
export const TRACE_LABELS = {
  led: ['on', 'off'], button: ['wait', 'pressed', 'released'], rgb: ['set'], distance: ['read'], env: ['read'],
  knob: ['read'], camera: ['start', 'capture'], web: ['serve', 'on', 'off'], dashboard: ['reading'],
  buzzer: ['tone', 'rest'], servo: ['write'], parking: ['read', 'beep'], sequence: ['wait', 'pressed'], matrix: [],
};
