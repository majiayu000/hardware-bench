// Breakout-module presets (displays, motor drivers, sensors) and off-board actuators (motors).
// A preset is { w, h, color, labelAt, decorate(o) } where o = { group, ink, pickables, mid, bottom,
// h, t, face, spec }: the module board stands upright on its pins, facing +z (face 1) or −z.
// decorate may return { setState(state), tick(dt) } so sims can drive what is on it.

export function modulePresets(k) {
  const { THREE, shape, toon, flat, Box } = k;
  // A flat panel just in front of the board, `dy` up from its bottom edge.
  const front = (o, w, h, d, color, dy, dx = 0) => {
    const m = shape(Box(w, h, d, Math.min(w, h, d) * 0.15), color, o.ink);
    m.position.set(o.mid.x + dx, o.bottom + dy, o.mid.z + o.face * (o.t / 2 + d / 2));
    o.group.add(m);
    return m;
  };
  // A canvas-backed screen. draw(g, w, h, state) paints it; the returned setState repaints.
  const screen = (o, w, h, px, bg, dy, draw, dz = 1.25) => {
    const c = document.createElement('canvas');
    c.width = Math.round(w * px);
    c.height = Math.round(h * px);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), flat(new THREE.MeshBasicMaterial({ map: tex })));
    mesh.position.set(o.mid.x, o.bottom + dy, o.mid.z + o.face * (o.t / 2 + dz));
    if (o.face < 0) mesh.rotation.y = Math.PI;
    o.group.add(mesh);
    const g = c.getContext('2d');
    let state = {};
    const paint = () => { g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height); draw(g, c.width, c.height, state); tex.needsUpdate = true; };
    paint();
    return (s) => { state = { ...state, ...s }; paint(); };
  };
  const text = (lines, color, size) => (g, w, h, s) => {
    g.fillStyle = color;
    g.font = `600 ${size(h)}px "IBM Plex Mono", monospace`;
    g.textBaseline = 'top';
    (s.lines ?? lines).forEach((line, i) => g.fillText(line, w * 0.04, h * 0.08 + i * size(h) * 1.25));
  };
  // A small lamp on the board that can be lit.
  const lamp = (o, color, dy, dx = 0) => {
    const mat = toon('#3a3a44', { emissive: '#000000' });
    const m = shape(Box(1.8, 1.2, 1, 0.3), null, o.ink, { mat });
    m.position.set(o.mid.x + dx, o.bottom + dy, o.mid.z + o.face * (o.t / 2 + 0.5));
    o.group.add(m);
    return (on) => { mat.color.set(on ? color : '#3a3a44'); mat.emissive.set(on ? color : '#000000').multiplyScalar(on ? 0.8 : 0); };
  };

  return {
    // 0.96″ 128 × 64 I²C OLED. State: { lines: [...] }.
    oled: {
      w: 27, h: 27, color: '#1f4fa0', labelAt: 0.9,
      decorate(o) {
        front(o, 25, 14, 1, '#14161a', 13);
        const set = screen(o, 22, 11, 12, '#05070a', 13, text(['Hello!'], '#8fd8ff', (h) => h * 0.2));
        return { setState: (s) => { if (s.lines) set({ lines: s.lines }); } };
      },
    },
    // 16 × 2 character LCD with an I²C backpack. State: { lines: [line1, line2] }.
    lcd1602: {
      w: 80, h: 36, color: '#2a7d55', labelAt: 0.94,
      decorate(o) {
        front(o, 71, 24, 4, '#24262b', 18);
        const set = screen(o, 64, 15, 8, '#7fbf2e', 18, (g, w, h, s) => {
          g.fillStyle = '#16290c';
          g.font = `600 ${h * 0.38}px "IBM Plex Mono", monospace`;
          g.textBaseline = 'top';
          (s.lines ?? ['', '']).forEach((line, i) => g.fillText(String(line).padEnd(16).slice(0, 16), w * 0.03, h * 0.08 + i * h * 0.46));
        }, 4.1);
        return { setState: (s) => { if (s.lines) set({ lines: s.lines }); } };
      },
    },
    // WS2812 (NeoPixel) stick of 8 LEDs. State: { pixels: [[r,g,b] 0–1, …] }.
    ws2812: {
      w: 52, h: 10, color: '#1d1c22', labelAt: 0.12,
      decorate(o) {
        const mats = [];
        for (let i = 0; i < 8; i += 1) {
          const mat = toon('#e9e6dd', { emissive: '#000000' });
          const m = shape(Box(5, 5, 1.6, 0.6), null, o.ink, { mat });
          m.position.set(o.mid.x - 21 + i * 6, o.bottom + 6, o.mid.z + o.face * (o.t / 2 + 0.8));
          o.group.add(m);
          mats.push(mat);
        }
        return {
          setState({ pixels } = {}) {
            if (!pixels) return;
            mats.forEach((mat, i) => {
              const [r, g, b] = pixels[i] ?? [0, 0, 0];
              const lit = Math.max(r, g, b) > 0.02;
              mat.color.set(lit ? new THREE.Color(r, g, b) : '#e9e6dd');
              mat.emissive.setRGB(r, g, b).multiplyScalar(lit ? 0.9 : 0);
            });
          },
        };
      },
    },
    // 1-channel 5 V relay module. State: { on }.
    relay: {
      w: 26, h: 34, color: '#1f4fa0', labelAt: 0.12,
      decorate(o) {
        front(o, 15, 18, 15, '#2a5bd0', 20);
        front(o, 15, 7, 7, '#2a7de1', 31);
        const led = lamp(o, '#ff3b3b', 7, 9);
        return { setState: ({ on } = {}) => { if (on != null) led(on); } };
      },
    },
    // TB6612FNG dual motor driver breakout, lying across the centre channel on its two rows of pins.
    driver: {
      flat: true, color: '#c4262e',
      decorate(o) {
        const chip = shape(Box(6.5, 1.4, 5, 0.4), '#1d1c22', o.ink);
        chip.position.set(o.mid.x, o.bottom + o.t + 0.7, o.mid.z - o.d * 0.1);
        o.group.add(chip);
      },
    },
    // ULN2003 stepper driver board with its four phase LEDs. State: { phase } 0–3.
    uln2003: {
      w: 35, h: 32, color: '#2a7d55', labelAt: 0.12,
      decorate(o) {
        front(o, 19, 7, 4, '#1d1c22', 18);
        front(o, 10, 6, 6, '#f1ece2', 28);
        const leds = [0, 1, 2, 3].map((i) => lamp(o, '#ff3b3b', 9, -9 + i * 6));
        return { setState: ({ phase } = {}) => { if (phase != null) leds.forEach((l, i) => l(i === phase % 4)); } };
      },
    },
    // HC-SR501 PIR motion sensor with its white dome. State: { on } lights a status dot.
    pir: {
      w: 32, h: 24, color: '#2a7d55', labelAt: 0.1,
      decorate(o) {
        const dome = shape(new THREE.SphereGeometry(11, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), '#f4f1ea', o.ink);
        dome.rotation.x = o.face * Math.PI / 2;
        dome.position.set(o.mid.x, o.bottom + 13, o.mid.z + o.face * (o.t / 2));
        o.group.add(dome);
        o.pickables.push(dome);
        const led = lamp(o, '#ff3b3b', 3, 13);
        return { setState: ({ on } = {}) => { if (on != null) led(on); } };
      },
    },
    // MPU-6050 accelerometer and gyroscope breakout.
    mpu6050: {
      h: 16, color: '#1f4fa0', labelAt: 0.25,
      decorate(o) { front(o, 4, 4, 1, '#1d1c22', 11); },
    },
    // Capacitive soil-moisture probe: a long fork that goes in the soil.
    soil: {
      w: 22, h: 60, color: '#1d1c22', labelAt: 0.88,
      decorate(o) {
        front(o, 18, 30, 0.4, '#c9a44c', 30);
        front(o, 6, 6, 1, '#2a2930', 50);
      },
    },
    // VS1838B-style IR receiver: a black dome on a small board.
    irrx: {
      w: 12, h: 14, color: '#2b2a30', labelAt: 0.15,
      decorate(o) {
        const d = shape(new THREE.SphereGeometry(3, 20, 10), '#151418', o.ink);
        d.position.set(o.mid.x, o.bottom + 10, o.mid.z + o.face * (o.t / 2 + 2));
        o.group.add(d);
      },
    },
    // RC522 RFID reader with its card. The antenna is the copper loop.
    rc522: {
      w: 40, h: 60, color: '#1f4fa0', labelAt: 0.08,
      decorate(o) {
        front(o, 30, 30, 0.3, '#c9a44c', 38);
        front(o, 26, 26, 0.5, '#1f4fa0', 38);
        front(o, 6, 6, 1, '#1d1c22', 14);
      },
    },
    // Analog thumb joystick with its stick. State: { x, y } −1…1 tilts the stick.
    joystick: {
      w: 26, h: 34, color: '#1d1c22', labelAt: 0.08,
      decorate(o) {
        front(o, 18, 18, 6, '#3a3d45', 20);
        const knob = shape(new THREE.CylinderGeometry(6, 6, 6, 24), '#2b2a30', o.ink);
        knob.rotation.x = Math.PI / 2;
        const rest = new THREE.Vector3(o.mid.x, o.bottom + 20, o.mid.z + o.face * (o.t / 2 + 10));
        knob.position.copy(rest);
        o.group.add(knob);
        o.pickables.push(knob);
        return { setState: ({ x, y } = {}) => { knob.position.copy(rest).add(new THREE.Vector3((x ?? 0) * 3, (y ?? 0) * 3, 0)); } };
      },
    },
    // microSD card module.
    sdcard: {
      w: 24, h: 42, color: '#1f4fa0', labelAt: 0.1,
      decorate(o) { front(o, 16, 16, 2.4, '#b8bcc4', 30); },
    },
    // NEO-6M GPS module with its ceramic patch antenna. State: { fix } lights the fix LED.
    gps: {
      w: 26, h: 36, color: '#1f4fa0', labelAt: 0.08,
      decorate(o) {
        front(o, 16, 16, 4, '#c9b07a', 24);
        front(o, 4, 4, 1, '#c9a44c', 24);
        const led = lamp(o, '#3fe06b', 9, 9);
        return { setState: ({ fix } = {}) => { if (fix != null) led(fix); } };
      },
    },
    // DS3231 real-time clock with its coin cell.
    ds3231: {
      w: 38, h: 22, color: '#1f4fa0', labelAt: 0.15,
      decorate(o) {
        const cell = shape(new THREE.CylinderGeometry(9, 9, 3, 32), '#c9ced6', o.ink);
        cell.rotation.x = Math.PI / 2;
        cell.position.set(o.mid.x, o.bottom + 12, o.mid.z + o.face * (o.t / 2 + 1.5));
        o.group.add(cell);
      },
    },
  };
}

// A motor on the table, its leads running to breadboard holes `legs`. spec.kind: 'tt' (yellow gear
// motor with a wheel, 2 leads; `flip` puts the wheel on the +z side) or 'stepper' (28BYJ-48, 5 leads).
// spec.at, spec.facing ('x' | 'z').
// State: { spin } −1…1.
const LEAD_COLORS = { tt: ['#e2483c', '#1d1c22'], stepper: ['#2f62d6', '#e78bb8', '#f2c12e', '#f08a24', '#e2483c'] };
export function motorPart(spec, ctx, k) {
  const { THREE, shape, toon, Box, inkMaterial } = k;
  const kind = spec.kind ?? 'tt';
  const ink = inkMaterial();
  const at = ctx.board(spec.at.x, spec.at.z);
  const group = new THREE.Group();
  group.position.set(at.x, 0, at.z);
  if ((spec.facing ?? 'x') === 'z') group.rotation.y = Math.PI / 2;
  const pick = [];
  const rotor = new THREE.Group();
  if (kind === 'stepper') {
    const can = shape(new THREE.CylinderGeometry(14, 14, 19, 40), '#c9ced6', ink);
    can.rotation.z = Math.PI / 2;
    can.position.set(0, 14, 0);
    const box = shape(Box(17, 10, 14, 2), '#2a5bd0', ink);
    box.position.set(0, 4, -12);
    const shaft = shape(new THREE.CylinderGeometry(2.5, 2.5, 9, 16), '#d9c26f', ink);
    shaft.rotation.z = Math.PI / 2;
    rotor.position.set(13, 18, 0);
    rotor.add(shaft);
    const pointer = shape(Box(2, 12, 1.5, 0.4), '#e2483c', ink);
    pointer.position.set(5, 5, 0);
    rotor.add(pointer);
    group.add(can, box, rotor);
    pick.push(can, box);
  } else {
    const body = shape(Box(37, 22, 19, 3), '#f2c12e', ink);
    body.position.set(0, 11, 0);
    const can = shape(new THREE.CylinderGeometry(10, 10, 26, 32), '#c9ced6', ink);
    can.rotation.z = Math.PI / 2;
    can.position.set(-29, 11, 0);
    const wheel = shape(new THREE.CylinderGeometry(33, 33, 26, 40), '#2b2a30', ink);
    const hub = shape(new THREE.CylinderGeometry(12, 12, 27, 6), '#f2c12e', ink);
    wheel.rotation.x = Math.PI / 2;
    hub.rotation.x = Math.PI / 2;
    rotor.position.set(8, 33, spec.flip ? 24 : -24);
    rotor.add(wheel, hub);
    group.add(body, can, rotor);
    pick.push(body, can, wheel);
  }
  pick.forEach((m) => { m.userData = { kind: 'part', id: spec.id }; });
  // Leads leave the back of the motor and drop into their holes (positions are world space).
  const back = new THREE.Vector3(kind === 'stepper' ? 0 : -20, 6, kind === 'stepper' ? -19 : 0).applyEuler(group.rotation).add(group.position);
  const leads = new THREE.Group();
  // A stepper's cable ends in a plug on its driver board: spec.plug = { hole, up } is where it lands.
  const ends = spec.plug ? LEAD_COLORS[kind].map(() => ctx.hole(spec.plug.hole).add(new THREE.Vector3(0, spec.plug.up ?? 0, 0))) : (spec.legs ?? []).map((h) => ctx.hole(h));
  ends.forEach((hole, i) => {
    const end = hole.clone().add(new THREE.Vector3(spec.plug ? (i - 2) * 1.4 : 0, 0, 0));
    const start = back.clone().add(new THREE.Vector3(0, i * 1.4, 0));
    const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 12, 0));
    const curve = new THREE.CatmullRomCurve3([start, mid, end.clone().add(new THREE.Vector3(0, 9, 0)), end]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.7, 8, false), toon(LEAD_COLORS[kind][i % LEAD_COLORS[kind].length]));
    tube.castShadow = true;
    leads.add(tube);
  });
  const root = new THREE.Group();
  root.add(group, leads);
  let speed = 0;
  let target = spec.spin ?? 0;
  return {
    group: root, ink, pickables: pick, anchor: new THREE.Vector3(at.x, kind === 'stepper' ? 34 : 70, at.z),
    setState({ spin } = {}) { if (spin != null) target = spin; },
    tick(dt) {
      speed += (target - speed) * Math.min(1, dt * 3);
      if (kind === 'stepper') rotor.rotation.x += speed * dt * 1.2;
      else rotor.rotation.z -= speed * dt * 9;
    },
  };
}

// A display lying flat on a board or device, drawn on a canvas. spec.at (board coords), w, d (mm),
// y (height above the board top), bg, fg. State: { lines: [...] }, one text line per entry.
export function screenPart(spec, ctx, k) {
  const { THREE, flat } = k;
  const at = ctx.board(spec.at.x, spec.at.z);
  const c = document.createElement('canvas');
  c.width = Math.round(spec.w * 12);
  c.height = Math.round(spec.d * 12);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(spec.w, spec.d), flat(new THREE.MeshBasicMaterial({ map: tex })));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(at.x, ctx.top + (spec.y ?? 0.1), at.z);
  mesh.userData = { kind: 'part', id: spec.id };
  const g = c.getContext('2d');
  const size = c.height / 6;
  const paint = (lines) => {
    g.fillStyle = spec.bg ?? '#0b0d12';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = spec.fg ?? '#f4f1ea';
    g.font = `600 ${size}px "IBM Plex Mono", monospace`;
    g.textBaseline = 'top';
    lines.forEach((line, i) => g.fillText(line, size * 0.5, size * 0.4 + i * size * 1.3));
    tex.needsUpdate = true;
  };
  paint(spec.lines ?? []);
  const group = new THREE.Group();
  group.add(mesh);
  return {
    group, ink: k.inkMaterial(), pickables: [mesh], anchor: new THREE.Vector3(at.x, ctx.top + 4, at.z),
    setState({ lines } = {}) { if (lines) paint(lines); },
  };
}
