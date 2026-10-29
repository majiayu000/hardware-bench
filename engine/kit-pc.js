// PC-building models: on-board structures of a motherboard (component kinds) and the parts a
// learner installs (CPU, cooler, memory, SSD, graphics card, front-panel and power plugs).
// Same illustration style as kit.js. Parts are drawn in world space; board3d.js moves a part's
// group along its `insert` vector for the assembly animation (lift 1 = floating, 0 = seated).

// ---------- on-board structures (used by boardComponent in kit.js) ----------
// Each receives o = { THREE, c, center, H, d, top, topY, add, group, toon, flat, Box, textTexture }.
export const PC_KINDS = {
  // CPU socket: frame, pin field and the pin-1 triangle. The load plate is the `socketlid` part.
  socket({ THREE, c, center, d, topY, add, toon, flat }) {
    add(new THREE.BoxGeometry(c.w * 0.72, 0.5, d * 0.72), '#b9a170', center.x, topY + 0.2, center.z);
    const mark = new THREE.Mesh(new THREE.CircleGeometry(1.6, 3), flat(toon('#e7c35e')));
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(center.x - c.w * 0.42, topY + 0.05, center.z + d * 0.42);
    return [mark];
  },
  // Long slot (DIMM or PCIe): a groove along the top and a latch at one or both ends.
  // Long axis is x, or z when the slot is deeper than wide (DIMM slots beside the socket).
  slot({ c, center, d, topY, add, Box }) {
    const alongZ = d > c.w;
    add(alongZ ? Box(c.w * 0.32, 0.6, d * 0.97, 0.2) : Box(c.w * 0.97, 0.6, d * 0.32, 0.2), '#141318', center.x, topY + 0.1, center.z);
    const ends = c.latches === 'both' ? [-1, 1] : c.latches === 'end' ? [1] : [];
    const tall = (c.h ?? 4) * 1.6;
    for (const s of ends) {
      if (alongZ) add(Box(c.w * 1.1, tall, 3.4, 0.6), c.accent ?? '#d9d4c7', center.x, topY - (c.h ?? 4) * 0.3, center.z + s * (d / 2 + 1.4));
      else add(Box(3.4, tall, d * 1.1, 0.6), c.accent ?? '#d9d4c7', center.x + s * (c.w / 2 + 1.4), topY - (c.h ?? 4) * 0.3, center.z);
    }
    return [];
  },
  // M.2 socket plus the standoff the SSD screws onto, `reach` mm away along x.
  m2slot({ THREE, c, center, topY, add, top }) {
    add(new THREE.CylinderGeometry(1.8, 1.8, 2.4, 16), '#d9c26f', center.x + (c.reach ?? 80), top + 1.2, center.z);
    add(new THREE.CylinderGeometry(0.9, 0.9, 0.4, 12), '#8c8a84', center.x + (c.reach ?? 80), top + 2.6, center.z);
    void topY;
    return [];
  },
  // Finned heatsink; fins run along x (or z with c.fins === 'z').
  heatsink({ c, center, d, topY, add, Box }) {
    const alongX = c.fins !== 'z';
    const n = Math.max(3, Math.round((alongX ? d : c.w) / 3.2));
    for (let i = 0; i < n; i += 1) {
      const t = (i + 0.5) / n - 0.5;
      const geo = alongX ? Box(c.w * 0.96, 2.2, 1.1, 0.3) : Box(1.1, 2.2, d * 0.96, 0.3);
      add(geo, c.accent ?? c.color, center.x + (alongX ? 0 : t * c.w), topY + 1.1, center.z + (alongX ? t * d : 0));
    }
    return [];
  },
  // Power connector with a grid of square sockets on top: c.grid = [cols, rows].
  atx({ THREE, c, center, d, topY, toon, flat }) {
    const [cols, rows] = c.grid ?? [12, 2];
    const holes = [];
    const mat = flat(toon('#050507'));
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(c.w / cols * 0.62, d / rows * 0.62), mat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(center.x - c.w / 2 + (i + 0.5) * (c.w / cols), topY + 0.04, center.z - d / 2 + (j + 0.5) * (d / rows));
        holes.push(m);
      }
    }
    return holes;
  },
  // Rear I/O stack under a cover.
  iocluster({ c, center, d, topY, H, add, Box }) {
    for (let i = 0; i < 4; i += 1) add(Box(c.w * 0.9, 0.6, 1.2, 0.2), '#2b2a33', center.x, topY - H * (0.2 + i * 0.18), center.z + d / 2 + 0.2);
    return [];
  },
};
export const PC_KIND_NAMES = Object.keys(PC_KINDS);

// ---------- parts a learner installs ----------
// Each is (spec, ctx, k): ctx gives positions (comp, pin, board), k is the kit API.
// ctx.comp(id) → { x, z, w, d, top, h } in world units; ctx.pin(key) → { pos, pitch }.
const label = (k, text, w, color = '#f4f1ea') => {
  const m = new k.THREE.Mesh(new k.THREE.PlaneGeometry(w, w / 4), k.flat(new k.THREE.MeshBasicMaterial({ map: k.textTexture(text, color), transparent: true })));
  m.rotation.x = -Math.PI / 2;
  return m;
};
const tag = (meshes, id, extra = {}) => meshes.forEach((m) => { m.userData = { kind: 'part', id, ...extra }; });

// A cable of `n` strands leaving `start` upwards, then heading off along `exit` (dx, dz).
function cable(k, start, exit, colors, { spread = 1.6, rise = 14, reach = 70, radius = 0.7 } = {}) {
  const { THREE } = k;
  const group = new THREE.Group();
  const [ex, ez] = exit;
  const len = Math.hypot(ex, ez) || 1;
  const dir = new THREE.Vector3(ex / len, 0, ez / len);
  const side = new THREE.Vector3(-dir.z, 0, dir.x);
  colors.forEach((col, i) => {
    const off = side.clone().multiplyScalar((i - (colors.length - 1) / 2) * spread);
    const a = start.clone().add(off);
    const pts = [a, a.clone().add(new THREE.Vector3(0, rise, 0)), a.clone().add(new THREE.Vector3(0, rise + 6, 0)).addScaledVector(dir, reach * 0.35), a.clone().add(new THREE.Vector3(0, rise - 4, 0)).addScaledVector(dir, reach)];
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, radius, 8, false), k.toon(col));
    tube.castShadow = true;
    group.add(tube);
  });
  return group;
}

export const PC_PARTS = {
  // Load plate and lever of an LGA socket. State: open 0 (latched) … 1 (fully open).
  socketlid(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const s = ctx.comp(spec.socket);
    const group = new THREE.Group();
    const hinge = new THREE.Group();
    hinge.position.set(s.x, s.top + s.h + 0.6, s.z - s.d / 2);
    const plate = new THREE.Group();
    for (const [w, d, x, z] of [[s.w, 3, 0, 1.5], [s.w, 3, 0, s.d - 1.5], [3, s.d, -s.w / 2 + 1.5, s.d / 2], [3, s.d, s.w / 2 - 1.5, s.d / 2]]) {
      const bar = k.shape(k.Box(w, 1, d, 0.4), '#c9ced6', ink);
      bar.position.set(x, 0, z);
      plate.add(bar);
    }
    hinge.add(plate);
    const leverPivot = new THREE.Group();
    leverPivot.position.set(s.x + s.w / 2 + 3, s.top + s.h + 1, s.z + s.d / 2 - 2);
    const lever = k.shape(new THREE.CylinderGeometry(0.8, 0.8, s.d * 1.05, 10), '#c9ced6', ink);
    lever.rotation.x = Math.PI / 2;
    lever.position.z = -s.d * 0.5;
    const handle = k.shape(k.Box(1.6, 1.6, 6, 0.6), '#c9ced6', ink);
    handle.position.set(-2, 0, 1.5);
    leverPivot.add(lever, handle);
    group.add(hinge, leverPivot);
    tag([...plate.children, lever, handle], spec.id);
    const set = (v) => {
      const lev = Math.min(1, v * 2);
      const lid = Math.max(0, v * 2 - 1);
      leverPivot.rotation.z = lev * 2.3;
      hinge.rotation.x = -lid * 1.9;
    };
    set(spec.open ?? 0);
    return { group, ink, pickables: [...plate.children, lever], anchor: new THREE.Vector3(s.x + s.w / 2 + 3, s.top + s.h + 3, s.z), insert: [0, 50, 0], setState({ open } = {}) { if (open != null) set(open); } };
  },

  // Processor: green substrate with a silver heat spreader and the pin-1 triangle.
  cpu(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const s = ctx.comp(spec.socket);
    const y = s.top + s.h + 0.9;
    const sub = k.shape(k.Box(s.w * 0.8, 1.2, s.d * 0.8, 0.3), '#2c7a4e', ink);
    sub.position.set(s.x, y, s.z);
    const ihs = k.shape(k.Box(s.w * 0.62, 1.6, s.d * 0.58, 0.6), '#d5d9e0', ink);
    ihs.position.set(s.x, y + 1.3, s.z);
    const tri = new THREE.Mesh(new THREE.CircleGeometry(1.4, 3), k.flat(k.toon('#e7c35e')));
    tri.rotation.x = -Math.PI / 2;
    tri.position.set(s.x - s.w * 0.36, y + 0.62, s.z + s.d * 0.36);
    const text = label(k, spec.label ?? 'CPU', s.w * 0.45, 'rgba(60,60,70,0.7)');
    text.position.set(s.x, y + 2.12, s.z);
    const group = new THREE.Group();
    group.add(sub, ihs, tri, text);
    tag([sub, ihs], spec.id);
    return { group, ink, pickables: [sub, ihs], anchor: new THREE.Vector3(s.x, y + 3, s.z), insert: [0, 45, 0], setState() {} };
  },

  // Tower cooler: base, heat pipes, fin stack and a fan whose blades spin while powered.
  cooler(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const s = ctx.comp(spec.socket);
    const y0 = s.top + s.h + 4.8;
    const group = new THREE.Group();
    const base = k.shape(k.Box(38, 6, 38, 1.5), '#c9ced6', ink);
    base.position.set(s.x, y0 + 3, s.z);
    group.add(base);
    for (const dx of [-9, -3, 3, 9]) group.add(k.rod(new THREE.Vector3(s.x + dx, y0 + 5, s.z), new THREE.Vector3(s.x + dx, y0 + 128, s.z), 1.5, k.toon('#d9935a')));
    const fins = k.shape(k.Box(118, 112, 48, 2), '#d6dae1', ink);
    fins.position.set(s.x, y0 + 74, s.z);
    group.add(fins);
    for (let i = 0; i < 14; i += 1) {
      const line = new THREE.Mesh(k.Box(118.4, 0.6, 48.4, 0.1), k.flat(k.toon('#aeb4bd')));
      line.position.set(s.x, y0 + 22 + i * 7.6, s.z);
      group.add(line);
    }
    const fan = new THREE.Group();
    fan.position.set(s.x, y0 + 72, s.z + 24 + 6);
    const frame = k.shape(k.Box(120, 120, 12, 6), spec.color ?? '#2b2a33', ink);
    const ring = new THREE.Mesh(new THREE.CircleGeometry(55, 48), k.flat(k.toon('#14131a')));
    ring.position.z = 6.1;
    const rotor = new THREE.Group();
    rotor.position.z = 6.4;
    const hub = k.shape(new THREE.CylinderGeometry(17, 17, 2, 32), spec.accent ?? '#c65a3b', ink);
    hub.rotation.x = Math.PI / 2;
    rotor.add(hub);
    for (let i = 0; i < 7; i += 1) {
      const blade = k.shape(k.Box(14, 34, 1.2, 0.6), spec.blade ?? '#3a3a44', ink);
      blade.position.set(Math.sin((i / 7) * Math.PI * 2) * 34, Math.cos((i / 7) * Math.PI * 2) * 34, 0);
      blade.rotation.z = -(i / 7) * Math.PI * 2 + 0.35;
      rotor.add(blade);
    }
    fan.add(frame, ring, rotor);
    group.add(fan);
    tag([base, fins, frame], spec.id);
    let rpm = 0;
    let target = 0;
    return {
      group, ink, pickables: [base, fins, frame], anchor: new THREE.Vector3(s.x, y0 + 134, s.z), insert: [0, 90, 0],
      setState({ spin } = {}) { if (spin != null) target = spin; },
      tick(dt) { rpm += (target - rpm) * Math.min(1, dt * 1.5); rotor.rotation.z -= rpm * dt * 14; },
    };
  },

  // Memory module standing in a DIMM slot, with a coloured heat spreader.
  dimm(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const s = ctx.comp(spec.slot);
    const y = s.top + s.h;
    const group = new THREE.Group();
    const alongZ = s.d > s.w;
    const len = alongZ ? s.d : s.w;
    const B = (l, h, t, r) => (alongZ ? k.Box(t, h, l, r) : k.Box(l, h, t, r));
    const pcb = k.shape(B(len * 0.96, 31, 1.3, 0.4), '#2c7a4e', ink);
    pcb.position.set(s.x, y + 15.5, s.z);
    const spreader = k.shape(B(len * 0.94, 30, 6, 1.4), spec.color ?? '#2b2a33', ink);
    spreader.position.set(s.x, y + 18, s.z);
    const stripe = new THREE.Mesh(B(len * 0.9, 2.2, 6.2, 0.5), k.flat(k.toon(spec.accent ?? '#e05a3a')));
    stripe.position.set(s.x, y + 32, s.z);
    group.add(pcb, spreader, stripe);
    tag([pcb, spreader], spec.id);
    const off = len * 0.25;
    return { group, ink, pickables: [pcb, spreader], anchor: new THREE.Vector3(s.x + (alongZ ? 0 : off), y + 34, s.z + (alongZ ? off : 0)), insert: [0, 55, 0], setState() {} };
  },

  // M.2 SSD lying flat from its socket to the standoff.
  m2(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const s = ctx.comp(spec.slot);
    const len = spec.length ?? 80;
    const y = s.top + 2.6;
    const group = new THREE.Group();
    const pcb = k.shape(k.Box(len, 0.9, 22, 0.3), '#1f1e24', ink);
    pcb.position.set(s.x + len / 2 - 2, y, s.z);
    group.add(pcb);
    for (const [dx, w] of [[14, 11], [32, 14], [52, 14]]) {
      const chip = k.shape(k.Box(w, 1.2, 14, 0.4), '#2b2a33', ink);
      chip.position.set(s.x + dx, y + 1, s.z);
      group.add(chip);
    }
    const sticker = label(k, spec.label ?? 'NVMe SSD', 30, 'rgba(240,235,225,0.85)');
    sticker.position.set(s.x + 42, y + 1.65, s.z);
    group.add(sticker);
    tag([pcb], spec.id);
    return { group, ink, pickables: [pcb], anchor: new THREE.Vector3(s.x + len / 2, y + 3, s.z), insert: [-30, 14, 0], setState() {} };
  },

  // Graphics card standing in a PCIe x16 slot, fans facing the viewer, bracket at the rear I/O.
  gpu(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const s = ctx.comp(spec.slot);
    const len = spec.length ?? 240;
    const tall = 112;
    const thick = 40;
    const x0 = s.x - s.w / 2 - 20;
    const y = s.top + s.h;
    const group = new THREE.Group();
    const shroud = k.shape(k.Box(len, tall - 8, thick, 6), spec.color ?? '#2b2a33', ink);
    shroud.position.set(x0 + len / 2, y + tall / 2 + 4, s.z + thick / 2 - 2);
    const pcb = k.shape(k.Box(len - 6, 4, thick * 0.3, 1), '#1f5a3a', ink);
    pcb.position.set(x0 + len / 2, y + 2, s.z);
    const bracket = k.shape(k.Box(2, tall + 10, thick, 0.6), '#c9ced6', ink);
    bracket.position.set(x0 - 1, y + tall / 2, s.z + thick / 2 - 2);
    group.add(shroud, pcb, bracket);
    for (const fx of [0.3, 0.72]) {
      const ring = new THREE.Mesh(new THREE.CircleGeometry(34, 40), k.flat(k.toon('#14131a')));
      ring.position.set(x0 + len * fx, y + tall / 2 + 4, s.z + thick - 1.9);
      const hub = new THREE.Mesh(new THREE.CircleGeometry(10, 24), k.flat(k.toon(spec.accent ?? '#c65a3b')));
      hub.position.copy(ring.position).add(new THREE.Vector3(0, 0, 0.1));
      group.add(ring, hub);
    }
    const plug = k.shape(k.Box(22, 7, 10, 1), '#24232b', ink);
    plug.position.set(x0 + len - 40, y + tall + 7, s.z + thick / 2 - 2);
    group.add(plug);
    tag([shroud, bracket], spec.id);
    return { group, ink, pickables: [shroud, bracket], anchor: new THREE.Vector3(x0 + len * 0.5, y + tall + 10, s.z + thick / 2), insert: [0, 120, 0], setState() {} };
  },

  // Female DuPont housing pushed onto header pins (`on`), with its cable leaving along `exit`.
  plug(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const pins = spec.on.map((key) => ctx.pin(key));
    const xs = pins.map((p) => p.pos.x);
    const zs = pins.map((p) => p.pos.z);
    const pitch = pins[0].pitch;
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
    const cz = (Math.max(...zs) + Math.min(...zs)) / 2;
    const w = Math.max(...xs) - Math.min(...xs) + pitch * 0.96;
    const d = Math.max(...zs) - Math.min(...zs) + pitch * 0.96;
    const y0 = pins[0].pos.y + 2.6;
    const tall = 13;
    const housing = k.shape(k.Box(w, tall, d, 0.5), spec.housing ?? '#1f1e23', ink);
    housing.position.set(cx, y0 + tall / 2, cz);
    const group = new THREE.Group();
    group.add(housing);
    if (spec.label) {
      const text = label(k, spec.label, Math.max(w, 9) * 1.6, '#f4f1ea');
      text.position.set(cx, y0 + tall + 0.05, cz);
      text.scale.setScalar(0.6);
      group.add(text);
    }
    const colors = spec.colors ?? spec.on.map(() => spec.color ?? '#e2483c');
    group.add(cable(k, new THREE.Vector3(cx, y0 + tall, cz), spec.exit ?? [0, 1], colors, { spread: Math.min(pitch, 2), reach: spec.reach ?? 70 }));
    tag([housing], spec.id);
    return { group, ink, pickables: [housing], anchor: new THREE.Vector3(cx, y0 + tall + 2, cz), insert: [0, 30, 0], setState() {} };
  },

  // Power supply plug pushed onto a board connector component (24-pin ATX, 8-pin EPS…).
  powerplug(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const s = ctx.comp(spec.connector);
    const y0 = s.top + s.h - 2;
    const housing = k.shape(k.Box(s.w + 1.2, 14, s.d + 1.2, 0.8), '#24232b', ink);
    housing.position.set(s.x, y0 + 7, s.z);
    const latch = k.shape(k.Box(4, 9, 2, 0.5), '#24232b', ink);
    latch.position.set(s.x, y0 + 8, s.z + s.d / 2 + 1.6);
    const group = new THREE.Group();
    group.add(housing, latch);
    const n = Math.min(12, spec.strands ?? 8);
    const palette = spec.colors ?? ['#d6453a', '#2b2a30', '#f2c12e', '#2b2a30', '#d6453a', '#2b2a30', '#e3892a', '#2b2a30', '#3fae5a', '#3b78d6', '#8a8a8a', '#f4f1ea'];
    group.add(cable(k, new THREE.Vector3(s.x, y0 + 14, s.z), spec.exit ?? [1, 0], palette.slice(0, n), { spread: (s.w - 3) / n, radius: 1, rise: 18, reach: spec.reach ?? 90 }));
    tag([housing, latch], spec.id);
    return { group, ink, pickables: [housing], anchor: new THREE.Vector3(s.x, y0 + 16, s.z), insert: [0, 40, 0], setState() {} };
  },

  // Front of the PC case: power LED and drive-activity LED. State: { power, hdd }.
  casepanel(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const at = ctx.board(spec.at.x, spec.at.z);
    const slab = k.shape(k.Box(spec.w ?? 70, 110, 10, 3), spec.color ?? '#2f2e36', ink);
    slab.position.set(at.x, 55, at.z);
    const group = new THREE.Group();
    group.add(slab);
    const leds = {};
    for (const [key, color, dx] of [['power', '#3fe06b', -12], ['hdd', '#ff9a2e', 12]]) {
      const mat = k.toon('#3a3a44', { emissive: '#000000' });
      const led = k.shape(new THREE.CylinderGeometry(2.4, 2.4, 1.6, 20), null, ink, { mat });
      led.rotation.x = Math.PI / 2;
      led.position.set(at.x + dx, 88, at.z + 5.4);
      group.add(led);
      leds[key] = { mat, color };
    }
    const text = new THREE.Mesh(new THREE.PlaneGeometry(36, 9), k.flat(new THREE.MeshBasicMaterial({ map: k.textTexture(spec.label ?? 'FRONT PANEL'), transparent: true })));
    text.position.set(at.x, 100, at.z + 5.1);
    group.add(text);
    tag([slab], spec.id);
    const light = (key, on) => { const l = leds[key]; l.mat.color.set(on ? l.color : '#3a3a44'); l.mat.emissive.set(on ? l.color : '#000000').multiplyScalar(on ? 0.7 : 0); };
    return { group, ink, pickables: [slab], anchor: new THREE.Vector3(at.x, 112, at.z), insert: [0, 0, 40], setState({ power, hdd } = {}) { if (power != null) light('power', power); if (hdd != null) light('hdd', hdd); } };
  },

  // A case push button mounted on the case panel; press it in the scene. State: { pressed }.
  casebutton(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const at = ctx.board(spec.at.x, spec.at.z);
    const r = spec.size ?? 9;
    const cap = k.shape(new THREE.CylinderGeometry(r, r, 4, 32), spec.color ?? '#d9d4c7', ink);
    cap.rotation.x = Math.PI / 2;
    const rest = at.z + 7;
    cap.position.set(at.x, spec.y ?? 60, rest);
    const text = new THREE.Mesh(new THREE.PlaneGeometry(r * 2.6, r * 0.65), k.flat(new THREE.MeshBasicMaterial({ map: k.textTexture(spec.label ?? 'POWER', '#f4f1ea'), transparent: true })));
    text.position.set(at.x, (spec.y ?? 60) - r - 5, at.z + 5.1);
    const group = new THREE.Group();
    group.add(cap, text);
    tag([cap], spec.id);
    return { group, ink, pickables: [cap], anchor: new THREE.Vector3(at.x, (spec.y ?? 60) + r + 2, rest + 2), insert: [0, 0, 40], setState({ pressed } = {}) { if (pressed != null) cap.position.z = pressed ? rest - 2.5 : rest; } };
  },
  // A generic boxy part built from rounded boxes, for anything without its own model (a power
  // supply, a bare motherboard, a case panel, a keycap…). `at: { x, z }` is the centre in board
  // coordinates, `y` the height of its base above the board top (`table: true` measures from the
  // table instead), `w`, `d`, `h` its size, `text` printed on top, `boxes` extra boxes placed relative
  // to it ({ x, z, y, w, d, h, color, text }, `y` above its top), `opacity` for glass, and
  // `insert: [dx, dy, dz]` the direction it is put in.
  block(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const at = ctx.board(spec.at.x, spec.at.z);
    const base = (spec.table ? 0 : ctx.top) + (spec.y ?? 0);
    const group = new THREE.Group();
    const meshes = [];
    const box = (b, x, y, z) => {
      const m = k.shape(k.Box(b.w, b.h, b.d, Math.min(b.w, b.d, b.h) * (b.round ?? 0.12)), b.color ?? '#2b2a33', ink);
      if (b.opacity != null) Object.assign(m.material, { transparent: true, opacity: b.opacity, depthWrite: false });
      m.position.set(x, y + b.h / 2, z);
      group.add(m);
      meshes.push(m);
      if (b.text) {
        const size = Math.min(b.w, b.d * 4) * 0.8;
        const label = new THREE.Mesh(new THREE.PlaneGeometry(size, size / 4), k.flat(new THREE.MeshBasicMaterial({ map: k.textTexture(b.text, b.textColor ?? '#f4f1ea'), transparent: true })));
        label.rotation.x = -Math.PI / 2;
        label.position.set(x, y + b.h + 0.05, z);
        group.add(label);
      }
    };
    box(spec, at.x, base, at.z);
    for (const b of spec.boxes ?? []) box(b, at.x + (b.x ?? 0), base + spec.h + (b.y ?? 0), at.z + (b.z ?? 0));
    tag(meshes, spec.id);
    const top = Math.max(spec.h, ...(spec.boxes ?? []).map((b) => spec.h + (b.y ?? 0) + b.h));
    return { group, ink, pickables: meshes, anchor: new THREE.Vector3(at.x, base + top + 2, at.z), insert: spec.insert ?? [0, 60, 0] };
  },

  // A case fan. `at`, `y`, `table` as for block; `size` (mm, default 120); `facing`: 'up' (lying
  // flat), 'x', '-x', 'z' or '-z' (standing, blowing that way); `rgb`: true adds an LED ring.
  // State: { spin } 0–1, { color } (CSS colour, or null for off) for an RGB fan.
  fan(spec, ctx, k) {
    const { THREE } = k;
    const ink = k.inkMaterial();
    const at = ctx.board(spec.at.x, spec.at.z);
    const s = spec.size ?? 120;
    const base = (spec.table ? 0 : ctx.top) + (spec.y ?? 0);
    const fan = new THREE.Group();
    const frame = k.shape(k.Box(s, s, 25, s * 0.05), spec.color ?? '#2b2a33', ink);
    const ring = new THREE.Mesh(new THREE.CircleGeometry(s * 0.46, 48), k.flat(k.toon('#14131a')));
    ring.position.z = 12.6;
    const back = ring.clone();
    back.position.z = -12.6;
    back.rotation.y = Math.PI;
    const rotor = new THREE.Group();
    rotor.position.z = 12.9;
    const hub = k.shape(new THREE.CylinderGeometry(s * 0.14, s * 0.14, 2, 32), spec.accent ?? '#3a6dd0', ink);
    hub.rotation.x = Math.PI / 2;
    rotor.add(hub);
    for (let i = 0; i < 7; i += 1) {
      const blade = k.shape(k.Box(s * 0.12, s * 0.28, 1.2, 0.6), spec.blade ?? '#3a3a44', ink);
      blade.position.set(Math.sin((i / 7) * Math.PI * 2) * s * 0.28, Math.cos((i / 7) * Math.PI * 2) * s * 0.28, 0);
      blade.rotation.z = -(i / 7) * Math.PI * 2 + 0.35;
      rotor.add(blade);
    }
    fan.add(frame, ring, back, rotor);
    const glowMat = k.toon('#4a4a52', { emissive: '#000000' });
    if (spec.rgb) {
      for (const z of [12.8, -12.8]) {
        const leds = new THREE.Mesh(new THREE.TorusGeometry(s * 0.465, 1.6, 8, 48), k.flat(glowMat));
        leds.position.z = z;
        fan.add(leds);
      }
    }
    const facing = spec.facing ?? 'up';
    const [rx, ry] = { up: [-Math.PI / 2, 0], z: [0, 0], '-z': [0, Math.PI], x: [0, Math.PI / 2], '-x': [0, -Math.PI / 2] }[facing];
    fan.rotation.set(rx, ry, 0, 'YXZ');
    fan.position.set(at.x, base + (facing === 'up' ? 12.5 : s / 2), at.z);
    const group = new THREE.Group();
    group.add(fan);
    tag([frame], spec.id);
    let rpm = 0;
    let target = spec.spin ?? 0;
    return {
      group, ink, pickables: [frame], anchor: new THREE.Vector3(at.x, base + (facing === 'up' ? 27 : s + 2), at.z), insert: spec.insert ?? [0, 60, 0],
      setState({ spin, color } = {}) {
        if (spin != null) target = spin;
        if (color !== undefined) { glowMat.color.set(color ?? '#4a4a52'); glowMat.emissive.set(color ?? '#000000').multiplyScalar(color ? 0.9 : 0); }
      },
      tick(dt) { rpm += (target - rpm) * Math.min(1, dt * 1.5); rotor.rotation.z -= rpm * dt * 14; },
    };
  },
};
export const PC_PART_NAMES = Object.keys(PC_PARTS);
