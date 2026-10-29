// AI sims: a camera frame with object-detection boxes, and a chat with a local language model.
// Same interface as sims.js: render into `el`, drive the scene through ctx, return handlers.

const pick = (list, i) => list[i % list.length];

// Object detection. config: objects [{ label, box: [x, y, w, h] (0–1 of the frame), score, color }],
// fps, log ('{label} {score}' per object), caption. Each tick nudges the boxes and scores a little,
// as a real detector does from frame to frame.
function detect(el, ctx) {
  const { config, escape } = ctx;
  let timer = 0;
  let frame = 0;
  el.innerHTML = `<div class="sim"><canvas class="photo" width="640" height="400" aria-label="Camera view with detections"></canvas>
    <div class="readouts" style="margin-top:12px"><div class="readout"><small>objects</small><strong class="r-n">–</strong></div><div class="readout"><small>speed</small><strong class="r-fps">–</strong></div></div>
    <p class="sim-caption">${escape(ctx.t(config.caption ?? 'Press Run to start the camera and the model.'))}</p></div>`;
  const canvas = el.querySelector('canvas');
  const g = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  function scene() {
    const wall = g.createLinearGradient(0, 0, 0, H);
    wall.addColorStop(0, '#d9d2c3');
    wall.addColorStop(1, '#b9b0a0');
    g.fillStyle = wall;
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#8a7a63';
    g.fillRect(0, H * 0.72, W, H * 0.28);
    for (const o of config.objects) {
      const [x, y, w, h] = o.box;
      g.fillStyle = o.fill ?? '#5b6470';
      g.beginPath();
      g.roundRect(x * W + w * W * 0.1, y * H + h * H * 0.05, w * W * 0.8, h * H * 0.95, 14);
      g.fill();
    }
  }
  function draw(live) {
    scene();
    if (!live) {
      g.fillStyle = 'rgba(0,0,0,.45)';
      g.fillRect(0, 0, W, H);
      return;
    }
    const lines = [];
    config.objects.forEach((o, i) => {
      const wob = Math.sin(frame * 0.7 + i) * 0.006;
      const [x, y, w, h] = o.box.map((v) => v + wob);
      const score = Math.min(0.99, Math.max(0.3, o.score + Math.sin(frame * 1.3 + i * 2) * 0.03));
      g.strokeStyle = o.color ?? '#ffcc33';
      g.lineWidth = 3;
      g.strokeRect(x * W, y * H, w * W, h * H);
      const tag = `${o.label} ${score.toFixed(2)}`;
      g.font = '600 16px "IBM Plex Mono", monospace';
      const tw = g.measureText(tag).width + 12;
      g.fillStyle = o.color ?? '#ffcc33';
      g.fillRect(x * W, y * H - 22, tw, 22);
      g.fillStyle = '#151a21';
      g.fillText(tag, x * W + 6, y * H - 6);
      lines.push((config.log ?? '{label} {score}').replace('{label}', o.label).replace('{score}', score.toFixed(2)));
    });
    el.querySelector('.r-n').textContent = String(config.objects.length);
    el.querySelector('.r-fps').textContent = `${config.fps ?? 30} fps`;
    return lines;
  }
  draw(false);
  return {
    start() {
      clearInterval(timer);
      (config.start ?? []).forEach((l) => ctx.log(l, 'm'));
      const tick = () => {
        frame += 1;
        const lines = draw(true);
        ctx.trace('detect');
        if (frame % 4 === 1) lines.forEach((l) => ctx.log(l));
      };
      tick();
      timer = setInterval(tick, 400);
    },
    stop() { clearInterval(timer); draw(false); ctx.trace(null); },
    destroy() { clearInterval(timer); },
  };
}

// Chat with a local model. config: model, chats [{ q, a }], url, caption. Clicking a question while
// running sends it and streams the answer word by word, like the server's streamed reply.
function chat(el, ctx) {
  const { config, escape } = ctx;
  let timer = 0;
  el.innerHTML = `<div class="sim"><div class="chatbox"><div class="chat-log"></div></div>
    <div class="cmd-list" style="margin-top:12px">${config.chats.map((c, i) => `<button type="button" data-i="${i}"><span>${escape(ctx.t(c.q))}</span></button>`).join('')}</div>
    <p class="sim-caption">${escape(ctx.t(config.caption ?? 'Start the model with Run, then pick a question. The answers here are examples: a real model words them differently every time.'))}</p></div>`;
  const logEl = el.querySelector('.chat-log');
  const bubble = (who, text) => {
    const b = document.createElement('p');
    b.className = `chat-${who}`;
    b.textContent = text;
    logEl.append(b);
    logEl.scrollTop = logEl.scrollHeight;
    return b;
  };
  const idle = () => { logEl.innerHTML = ''; bubble('sys', ctx.t(ctx.isRunning() ? 'Model ready. Pick a question.' : 'The model is not running. Press Run.')); };
  el.querySelector('.cmd-list').addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    if (!ctx.isRunning()) { ctx.log(ctx.t('(nothing happens: the server is not running)'), 'm'); return; }
    clearInterval(timer);
    const c = pick(config.chats, Number(btn.dataset.i));
    bubble('you', ctx.t(c.q));
    ctx.log(`POST ${config.path ?? '/api/chat'}  model=${config.model}`, 'p');
    ctx.trace('ask');
    const words = ctx.t(c.a).split(/(?<=\s)|(?=[　-鿿])/);
    const out = bubble('bot', '');
    let i = 0;
    timer = setInterval(() => {
      out.textContent += words[i] ?? '';
      logEl.scrollTop = logEl.scrollHeight;
      i += 1;
      if (i >= words.length) { clearInterval(timer); ctx.trace('reply'); ctx.log(`done: ${words.length} tokens`); }
    }, 70);
  });
  idle();
  return {
    start() { (config.start ?? []).forEach((l) => ctx.log(l, 'm')); ctx.trace('serve'); idle(); },
    stop() { clearInterval(timer); ctx.trace(null); idle(); },
    destroy() { clearInterval(timer); },
  };
}

export const AI_SIMS = { detect, chat };
