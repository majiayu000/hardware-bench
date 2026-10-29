// 3D model kit: breadboard, parts, wires and detailed board components, drawn in a flat
// illustration style (toon shading; outlines come from OutlineEffect in board3d.js).
// Receives THREE from board3d.js so the pure geometry module stays three.js-free.
import { BREADBOARD, LED_COLORS, resistorBands } from './board-geometry.js';
import { PC_KINDS, PC_PARTS } from './kit-pc.js';
import { modulePresets, motorPart, screenPart } from './kit-modules.js';


// Style: toon shading with two light bands plus thick ink outlines drawn by three's OutlineEffect
// (each material can carry userData.outlineParameters). Boxes are bevelled for a chunky look.
export function createModelKit(THREE, { RoundedBoxGeometry } = {}) {
  const INK = '#1f2238';
  const UP = new THREE.Vector3(0, 1, 0);
  const gradient = new THREE.DataTexture(new Uint8Array([150, 255]), 2, 1, THREE.RedFormat);
  gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  const toon = (color, extra = {}) => new THREE.MeshToonMaterial({ color, gradientMap: gradient, ...extra });
  // An "ink" collects a part's materials so selection can recolour all of its outlines at once.
  const inkMaterial = () => ({ mats: [] });
  const flat = (mat) => { mat.userData.outlineParameters = { visible: false }; return mat; };
  const Box = (w, h, d, r = Math.min(w, h, d) * 0.2) => (RoundedBoxGeometry
    ? new RoundedBoxGeometry(w, h, d, 3, Math.max(0.01, Math.min(r, Math.min(w, h, d) / 2 - 0.01)))
    : Box(w, h, d));

  // Toon mesh with an ink outline. A part shares one `ink` so selection can recolour it.
  function shape(geometry, color, ink, { mat } = {}) {
    const mesh = new THREE.Mesh(geometry, mat ?? toon(color));
    mesh.castShadow = true; // shadows land on the floor only; toon bands carry the volume
    if (ink && !ink.mats.includes(mesh.material)) ink.mats.push(mesh.material);
    return mesh;
  }

  function rod(a, b, radius, material) {
    const dir = b.clone().sub(a);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, Math.max(dir.length(), 0.01), 8), material);
    mesh.position.copy(a).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
    mesh.castShadow = true;
    return mesh;
  }

  function textTexture(text, color = '#f4f1ea') {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = color;
    g.font = '600 34px "IBM Plex Mono", monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 128, 34);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  let glowTex;
  function glow(color) {
    if (!glowTex) {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.25, 'rgba(255,255,255,0.5)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, 128, 128);
      glowTex = new THREE.CanvasTexture(c);
    }
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
    sprite.scale.setScalar(24);
    return { sprite, light: new THREE.PointLight(color, 0, 34, 1.6) };
  }

  const centroid = (pts) => pts.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(pts.length);
  const span = (pts, k) => Math.max(...pts.map((p) => p[k])) - Math.min(...pts.map((p) => p[k]));
  const legMat = () => toon('#c9ccd1');
  const tag = (meshes, id) => meshes.forEach((m) => { m.userData = { kind: 'part', id }; });
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  function breadboard(origin) {
    const ink = inkMaterial();
    const { width: w, depth: d, height: h } = BREADBOARD;
    const group = new THREE.Group();
    // Lower slab plus two upper slabs, leaving the centre channel as a real groove.
    const cz = BREADBOARD.channelZ;
    const gap = 2.6;
    const base = shape(Box(w, h - 3, d, 1), '#f3ead6', ink);
    base.position.set(w / 2, (h - 3) / 2, d / 2);
    const upperA = shape(Box(w, 3.6, cz - gap / 2, 0.8), '#f3ead6', ink);
    upperA.position.set(w / 2, h - 1.8, (cz - gap / 2) / 2);
    const upperB = shape(Box(w, 3.6, d - cz - gap / 2, 0.8), '#f3ead6', ink);
    upperB.position.set(w / 2, h - 1.8, cz + gap / 2 + (d - cz - gap / 2) / 2);
    const px = 16;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * px);
    canvas.height = Math.round(d * px);
    const g = canvas.getContext('2d');
    const stripe = (z, color) => { g.fillStyle = color; g.fillRect(5 * px, z * px - 2, (w - 10) * px, 4); };
    stripe(1.8, '#3b6fd6'); stripe(7.8, '#d64040'); stripe(44.2, '#d64040'); stripe(50.3, '#3b6fd6');
    g.fillStyle = '#3c3a36';
    for (const [row, z] of Object.entries(BREADBOARD.rows)) {
      for (let col = 1; col <= BREADBOARD.columns; col += 1) {
        if (row.length === 2 && col % 6 === 0) continue; // rails come in groups of five
        const x = BREADBOARD.firstColumnX + (col - 1) * BREADBOARD.pitch;
        g.fillRect((x - 0.55) * px, (z - 0.55) * px, 1.1 * px, 1.1 * px);
      }
    }
    g.fillStyle = '#9a9384';
    g.font = `600 ${1.7 * px}px "IBM Plex Mono", monospace`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (const row of 'abcdefghij') {
      g.fillText(row, 2.6 * px, BREADBOARD.rows[row] * px);
      g.fillText(row, (w - 2.6) * px, BREADBOARD.rows[row] * px);
    }
    for (const col of [1, 5, 10, 15, 20, 25, 30]) {
      const x = (BREADBOARD.firstColumnX + (col - 1) * BREADBOARD.pitch) * px;
      g.fillText(String(col), x, 8.9 * px);
      g.fillText(String(col), x, 41.3 * px);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const top = new THREE.Mesh(new THREE.PlaneGeometry(w, d), flat(new THREE.MeshBasicMaterial({ map: tex, transparent: true })));
    top.rotation.x = -Math.PI / 2;
    top.position.set(w / 2, h + 0.03, d / 2);
    group.add(base, upperA, upperB, top);
    group.position.copy(origin);
    tag([base, upperA, upperB], 'breadboard');
    return { group, ink, pickables: [base, upperA, upperB], anchor: V(origin.x + w / 2, origin.y + h, origin.z + d / 2), setState() {} };
  }

  function ledBody(mid, baseY, color, ink, opacity = 0.88) {
    const mat = toon(color, { transparent: true, opacity, emissive: '#000000' });
    const body = shape(new THREE.CylinderGeometry(2.5, 2.5, 4.4, 24), color, ink, { mat });
    body.position.set(mid.x, baseY + 2.8, mid.z);
    const dome = shape(new THREE.SphereGeometry(2.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), color, ink, { mat });
    dome.position.set(mid.x, baseY + 5, mid.z);
    const flange = shape(new THREE.CylinderGeometry(2.95, 2.95, 1, 24), color, ink, { mat });
    flange.position.set(mid.x, baseY + 0.5, mid.z);
    const { sprite, light } = glow(color);
    sprite.position.set(mid.x, baseY + 4, mid.z);
    light.position.set(mid.x, baseY + 5, mid.z);
    return { mat, meshes: [body, dome, flange], sprite, light };
  }

  const PARTS = {
    led(spec, ctx) {
      const ink = inkMaterial();
      const a = ctx.hole(spec.anode);
      const k = ctx.hole(spec.cathode);
      const mid = a.clone().add(k).multiplyScalar(0.5);
      const baseY = mid.y + 5;
      let color = LED_COLORS[spec.color ?? 'red'] ?? spec.color;
      const { mat, meshes, sprite, light } = ledBody(mid, baseY, color, ink);
      const lm = legMat();
      const group = new THREE.Group();
      group.add(...meshes, sprite, light, rod(a, V(a.x, baseY + 0.2, a.z), 0.25, lm), rod(k, V(k.x, baseY + 0.2, k.z), 0.25, lm));
      tag(meshes, spec.id);
      return {
        group, ink, pickables: meshes, anchor: V(mid.x, baseY + 7.5, mid.z),
        setState({ on, level = 1, color: next } = {}) {
          if (next) {
            color = LED_COLORS[next] ?? next;
            mat.color.set(color);
            sprite.material.color.set(color);
            light.color.set(color);
          }
          if (on === undefined) return;
          const v = on ? Math.max(0.06, Math.min(1, level)) : 0;
          mat.emissive.set(color).multiplyScalar(v * 0.9);
          sprite.material.opacity = v;
          light.intensity = v * 1300;
        },
      };
    },

    resistor(spec, ctx) {
      const ink = inkMaterial();
      const a = ctx.hole(spec.a);
      const b = ctx.hole(spec.b);
      const pa = V(a.x, a.y + 3.2, a.z);
      const pb = V(b.x, b.y + 3.2, b.z);
      const dir = pb.clone().sub(pa);
      const len = Math.min(6.4, dir.length() - 1.6);
      dir.normalize();
      const center = pa.clone().add(pb).multiplyScalar(0.5);
      const body = shape(new THREE.CapsuleGeometry(1.15, len - 2.3, 4, 16), '#d9c7a0', ink);
      body.position.copy(center);
      body.quaternion.setFromUnitVectors(UP, dir);
      const lm = legMat();
      const group = new THREE.Group();
      group.add(body, rod(a, pa, 0.22, lm), rod(pa, center.clone().addScaledVector(dir, -len / 2), 0.22, lm), rod(b, pb, 0.22, lm), rod(pb, center.clone().addScaledVector(dir, len / 2), 0.22, lm));
      const bands = [-0.3, -0.12, 0.06, 0.3].map((f) => {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.45, 16), toon('#000'));
        m.position.copy(center).addScaledVector(dir, f * len);
        m.quaternion.copy(body.quaternion);
        group.add(m);
        return m;
      });
      const paint = (ohms) => resistorBands(ohms).forEach((c, i) => bands[i].material.color.set(c));
      paint(spec.ohms ?? 330);
      tag([body], spec.id);
      return { group, ink, pickables: [body], anchor: center.clone().add(V(0, 2, 0)), setState({ ohms } = {}) { if (ohms) paint(ohms); } };
    },

    button(spec, ctx) {
      const ink = inkMaterial();
      const holes = spec.legs.map((h) => ctx.hole(h));
      const c = centroid(holes);
      const sx = span(holes, 'x') + 1.6;
      const sz = span(holes, 'z') + 1.6;
      const baseY = c.y + 1.2;
      const base = shape(Box(sx, 3.4, sz), '#2b2a2e', ink);
      base.position.set(c.x, baseY + 1.7, c.z);
      const plate = shape(Box(sx * 0.92, 0.4, sz * 0.92), '#b8bcc2', ink);
      plate.position.set(c.x, baseY + 3.6, c.z);
      const cap = shape(new THREE.CylinderGeometry(2.1, 2.3, 2.4, 24), spec.color ?? '#e2483c', ink);
      const rest = baseY + 4.9;
      cap.position.set(c.x, rest, c.z);
      const lm = legMat();
      const group = new THREE.Group();
      group.add(base, plate, cap, ...holes.map((p) => rod(p, V(p.x, baseY + 0.4, p.z), 0.3, lm)));
      tag([base, plate, cap], spec.id);
      return { group, ink, pickables: [base, plate, cap], anchor: V(c.x, rest + 2, c.z), setState({ pressed } = {}) { if (pressed !== undefined) cap.position.y = pressed ? rest - 0.9 : rest; } };
    },

    rgbled(spec, ctx) {
      const ink = inkMaterial();
      const holes = spec.legs.map((h) => ctx.hole(h));
      const mid = centroid(holes);
      const baseY = mid.y + 5;
      const { mat, meshes, sprite, light } = ledBody(mid, baseY, '#f4f1ea', ink, 0.92);
      const lm = legMat();
      const group = new THREE.Group();
      group.add(...meshes, sprite, light, ...holes.map((p) => rod(p, V(mid.x + (p.x - mid.x) * 0.3, baseY + 0.2, mid.z), 0.22, lm)));
      tag(meshes, spec.id);
      const col = new THREE.Color();
      return {
        group, ink, pickables: meshes, anchor: V(mid.x, baseY + 7.5, mid.z),
        setState({ rgb } = {}) {
          if (!rgb) return;
          col.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace);
          mat.emissive.copy(col).multiplyScalar(0.9);
          sprite.material.color.copy(col);
          light.color.copy(col);
          sprite.material.opacity = Math.max(...rgb);
          light.intensity = Math.max(...rgb) * 1300;
        },
      };
    },

    pot(spec, ctx) {
      const ink = inkMaterial();
      const holes = spec.legs.map((h) => ctx.hole(h));
      const mid = centroid(holes);
      const side = spec.face ?? -1;
      const base = shape(Box(9.8, 5, 9.8), '#2f5fb5', ink);
      base.position.set(mid.x, mid.y + 3.5, mid.z + side * 4);
      const shaft = shape(new THREE.CylinderGeometry(3.4, 3.4, 6, 28), '#2c2b31', ink);
      shaft.position.set(mid.x, mid.y + 9, mid.z + side * 4);
      const mark = new THREE.Mesh(Box(0.7, 0.3, 3), toon('#f4f1ea'));
      mark.position.set(0, 3.05, -1.5);
      shaft.add(mark);
      const lm = legMat();
      const group = new THREE.Group();
      group.add(base, shaft, ...holes.map((p) => rod(p, V(p.x, mid.y + 1.2, mid.z + side * 1.5), 0.3, lm)));
      tag([base, shaft], spec.id);
      const setValue = (v) => { shaft.rotation.y = (0.75 - v * 1.5) * Math.PI; };
      setValue(spec.value ?? 0.5);
      return { group, ink, pickables: [base, shaft], anchor: V(mid.x, mid.y + 12.5, mid.z + side * 4), setState({ value } = {}) { if (value != null) setValue(value); } };
    },

    // A breakout board standing upright on its header pins; `face` = side its parts face (+1 = +z).
    module(spec, ctx) {
      const ink = inkMaterial();
      const holes = spec.pins.map((h) => ctx.hole(h));
      const mid = centroid(holes);
      const pinSpan = span(holes, 'x');
      const preset = PRESETS[spec.preset ?? 'breakout'];
      const w = spec.w ?? preset.w ?? pinSpan + 5;
      const h = spec.h ?? preset.h;
      const t = preset.thickness ?? 1.6;
      const face = spec.face ?? 1;
      const bottom = mid.y + 3;
      const gold = toon('#e2bd5b');
      const group = new THREE.Group();
      // A flat preset lies on its pins across the centre channel (two rows); the others stand on one row.
      if (preset.flat) {
        const d = span(holes, 'z') + 5;
        const pcb = shape(Box(w, t, d), spec.color ?? preset.color, ink);
        pcb.position.set(mid.x, bottom + t / 2, mid.z);
        group.add(pcb, ...holes.map((p) => rod(p, V(p.x, bottom, p.z), 0.32, gold)));
        const pickables = [pcb];
        const live = preset.decorate?.({ group, ink, pickables, mid, bottom, w, d, t, spec }) ?? {};
        if (spec.label) {
          const plate = new THREE.Mesh(new THREE.PlaneGeometry(16, 4), flat(new THREE.MeshBasicMaterial({ map: textTexture(spec.label, preset.labelColor), transparent: true })));
          plate.rotation.x = -Math.PI / 2;
          plate.position.set(mid.x, bottom + t + 0.05, mid.z + d * 0.3);
          group.add(plate);
        }
        tag(pickables, spec.id);
        return { group, ink, pickables, anchor: V(mid.x, bottom + 12, mid.z), setState: live.setState ?? (() => {}), tick: live.tick };
      }
      const pcb = shape(Box(w, h, t), spec.color ?? preset.color, ink);
      pcb.position.set(mid.x, bottom + h / 2, mid.z);
      const header = shape(Box(pinSpan + 2.5, 2.5, 2.5), '#1d1c20', ink);
      header.position.set(mid.x, mid.y + 1.25, mid.z);
      group.add(pcb, header, ...holes.map((p) => rod(p, V(p.x, bottom + 1.5, p.z), 0.32, gold)));
      const pickables = [pcb, header];
      const live = preset.decorate?.({ group, ink, pickables, mid, bottom, h, t, face, spec }) ?? {};
      if (spec.label) {
        const size = Math.min(w * 0.8, 16);
        const plate = new THREE.Mesh(new THREE.PlaneGeometry(size, size / 4), flat(new THREE.MeshBasicMaterial({ map: textTexture(spec.label, preset.labelColor), transparent: true })));
        plate.position.set(mid.x, bottom + h * preset.labelAt, mid.z + face * (t / 2 + 0.05));
        if (face < 0) plate.rotation.y = Math.PI;
        group.add(plate);
      }
      tag(pickables, spec.id);
      const part = { group, ink, pickables, anchor: V(mid.x, bottom + h + 2, mid.z), setState: live.setState ?? (() => {}), tick: live.tick };
      if (spec.state) part.setState(spec.state);
      return part;
    },

    // Camera module on the table, joined to a board connector by a ribbon cable.
    camera(spec, ctx) {
      const ink = inkMaterial();
      const at = ctx.board(spec.at.x, spec.at.z);
      const pcb = shape(Box(25, 1, 24), '#2d7a4b', ink);
      pcb.position.set(at.x, 5, at.z);
      const housing = shape(Box(8.5, 2.6, 8.5), '#1d1c20', ink);
      housing.position.set(at.x, 6.8, at.z - 2);
      const lens = shape(new THREE.CylinderGeometry(3, 3.2, 2.2, 28), '#2b2a2e', ink);
      lens.position.set(at.x, 9, at.z - 2);
      const glass = new THREE.Mesh(new THREE.CircleGeometry(2.2, 28), flat(toon('#4a6f9e')));
      glass.rotation.x = -Math.PI / 2;
      glass.position.set(at.x, 10.12, at.z - 2);
      const group = new THREE.Group();
      group.add(pcb, housing, lens, glass);
      for (const [dx, dz] of [[-10, -9.5], [10, -9.5], [-10, 9.5], [10, 9.5]]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4.5, 10), toon('#d8d3c5'));
        leg.position.set(at.x + dx, 2.25, at.z + dz);
        group.add(leg);
      }
      const from = ctx.component(spec.connector);
      if (from) {
        const end = V(at.x, 5.6, at.z - 12);
        const mid = from.clone().lerp(end, 0.5).add(V(0, 9, 0));
        const pts = new THREE.CatmullRomCurve3([from, from.clone().add(V(0, 5, 2)), mid, end.clone().add(V(0, 3, -3)), end]).getPoints(40);
        const pos = [];
        const idx = [];
        pts.forEach((p, i) => {
          pos.push(p.x - 5.5, p.y, p.z, p.x + 5.5, p.y, p.z);
          if (i) { const n = (i - 1) * 2; idx.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setIndex(idx);
        geo.computeVertexNormals();
        const strip = new THREE.Mesh(geo, toon('#e7e1d2', { side: THREE.DoubleSide }));
        strip.castShadow = true;
        group.add(strip);
      }
      tag([pcb, housing, lens], spec.id);
      return { group, ink, pickables: [pcb, housing, lens], anchor: V(at.x, 12, at.z - 2), setState() {} };
    },
    // Piezo buzzer: + and − legs; sound rings pulse while it plays.
    buzzer(spec, ctx) {
      const ink = inkMaterial();
      const holes = spec.legs.map((h) => ctx.hole(h));
      const mid = centroid(holes);
      const body = shape(new THREE.CylinderGeometry(6, 6, 8, 40), '#24232b', ink);
      body.position.set(mid.x, mid.y + 5, mid.z);
      const port = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.3, 20), flat(toon('#0d0c10')));
      port.position.set(mid.x, mid.y + 9.05, mid.z);
      const plus = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4 / 4 * 1), flat(new THREE.MeshBasicMaterial({ map: textTexture('+'), transparent: true })));
      plus.rotation.x = -Math.PI / 2;
      plus.position.set(mid.x - 3.6, mid.y + 9.06, mid.z);
      const rings = [0, 1, 2].map((i) => {
        const r = new THREE.Mesh(new THREE.TorusGeometry(7 + i * 3, 0.35, 8, 48), flat(new THREE.MeshBasicMaterial({ color: '#1fa39a', transparent: true, opacity: 0 })));
        r.rotation.x = Math.PI / 2;
        r.position.set(mid.x, mid.y + 10 + i * 1.5, mid.z);
        return r;
      });
      const lm = legMat();
      const group = new THREE.Group();
      group.add(body, port, plus, ...rings, ...holes.map((p) => rod(p, V(p.x, mid.y + 1.2, p.z), 0.3, lm)));
      tag([body], spec.id);
      return {
        group, ink, pickables: [body], anchor: V(mid.x, mid.y + 10, mid.z),
        setState({ on } = {}) { if (on !== undefined) rings.forEach((r, i) => { r.material.opacity = on ? 0.75 - i * 0.2 : 0; }); },
      };
    },

    // SG90 micro servo on the table; its three-wire lead (signal, +5 V, GND) runs to `legs`.
    servo(spec, ctx) {
      const ink = inkMaterial();
      const at = ctx.board(spec.at.x, spec.at.z);
      const group = new THREE.Group();
      const body = shape(Box(23, 22, 12.4, 1.2), spec.color ?? '#2f6fd0', ink);
      body.position.set(at.x, 11.3, at.z);
      const tabs = shape(Box(32.5, 2.4, 12.4, 0.6), spec.color ?? '#2f6fd0', ink);
      tabs.position.set(at.x, 16, at.z);
      const boss = shape(new THREE.CylinderGeometry(5.8, 5.8, 4, 32), spec.color ?? '#2f6fd0', ink);
      boss.position.set(at.x - 5.8, 24, at.z);
      const horn = new THREE.Group();
      horn.position.set(at.x - 5.8, 26.6, at.z);
      const arm = shape(Box(16, 1.6, 4.4, 0.8), '#f1ece2', ink);
      arm.position.set(5.5, 0, 0);
      const hub = shape(new THREE.CylinderGeometry(3, 3, 1.8, 24), '#f1ece2', ink);
      horn.add(arm, hub);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(14, 3.5), flat(new THREE.MeshBasicMaterial({ map: textTexture(spec.label ?? 'SG90'), transparent: true })));
      label.position.set(at.x, 9, at.z + 6.25);
      group.add(body, tabs, boss, horn, label);
      const colors = ['#f08a24', '#e2483c', '#6b4a2f'];
      spec.legs.forEach((h, i) => {
        const end = ctx.hole(h);
        const start = V(at.x + 11.5, 6 + i * 1.2, at.z - 1.2 + i * 1.2);
        const mid = start.clone().lerp(end, 0.5).add(V(0, 10, 0));
        const curve = new THREE.CatmullRomCurve3([start, start.clone().add(V(8, 0, 0)), mid, end.clone().add(V(0, 9, 0)), end]);
        const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.7, 8, false), toon(colors[i]));
        tube.castShadow = true;
        group.add(tube);
      });
      tag([body, tabs, boss, arm, hub], spec.id);
      const setAngle = (deg) => { horn.rotation.y = THREE.MathUtils.degToRad(90 - deg); };
      setAngle(spec.angle ?? 90);
      return { group, ink, pickables: [body, tabs, boss, arm, hub], anchor: V(at.x - 5.8, 29, at.z), setState({ angle } = {}) { if (angle != null) setAngle(angle); } };
    },

    // Photoresistor (LDR): a small disc with its serpentine track, on two legs.
    ldr(spec, ctx) {
      const ink = inkMaterial();
      const holes = spec.legs.map((h) => ctx.hole(h));
      const mid = centroid(holes);
      const disc = shape(new THREE.CylinderGeometry(2.6, 2.6, 1.6, 32), '#d8743c', ink);
      disc.position.set(mid.x, mid.y + 7, mid.z);
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d');
      g.strokeStyle = '#6a2c12';
      g.lineWidth = 4;
      g.beginPath();
      for (let i = 0; i < 6; i += 1) { const y = 10 + i * 9; g.moveTo(14, y); g.lineTo(50, y); if (i < 5) g.lineTo(i % 2 ? 14 : 50, y + 9); }
      g.stroke();
      const face = new THREE.Mesh(new THREE.CircleGeometry(2.2, 32), flat(new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })));
      face.rotation.x = -Math.PI / 2;
      face.position.set(mid.x, mid.y + 7.82, mid.z);
      const lm = legMat();
      const group = new THREE.Group();
      group.add(disc, face, ...holes.map((p) => rod(p, V(p.x, mid.y + 6.2, p.z), 0.25, lm)));
      tag([disc], spec.id);
      return { group, ink, pickables: [disc], anchor: V(mid.x, mid.y + 8.5, mid.z), setState() {} };
    },
  };


  const PRESETS = {
    breakout: {
      h: 13, color: '#5b2a86', labelAt: 0.3,
      decorate({ group, ink, mid, bottom, h, t, face }) {
        const chip = shape(Box(2.6, 2.6, 0.9), '#c9cdd3', ink);
        chip.position.set(mid.x, bottom + h * 0.7, mid.z + face * (t / 2 + 0.45));
        group.add(chip);
      },
    },
    hcsr04: {
      w: 45, h: 20, color: '#1f5fae', labelAt: 0.12,
      decorate({ group, ink, pickables, mid, bottom, h, face }) {
        for (const dx of [-13, 13]) {
          const can = shape(new THREE.CylinderGeometry(8, 8, 12, 32, 1, true), null, ink, { threshold: 80, mat: toon('#c9cdd3', { side: THREE.DoubleSide }) });
          can.rotation.x = Math.PI / 2;
          can.position.set(mid.x + dx, bottom + h * 0.55, mid.z + face * 6.8);
          const mesh = new THREE.Mesh(new THREE.CircleGeometry(7.6, 32), flat(toon('#3a3d42')));
          mesh.position.set(mid.x + dx, bottom + h * 0.55, mid.z + face * 12.2);
          if (face < 0) mesh.rotation.y = Math.PI;
          group.add(can, mesh);
          pickables.push(can);
        }
        const xtal = shape(Box(8, 3.4, 2.2), '#d8dbe0', ink);
        xtal.position.set(mid.x, bottom + h * 0.85, mid.z + face * 1.9);
        group.add(xtal);
      },
    },
    dht22: {
      w: 15.1, h: 25, thickness: 7.7, color: '#f1efe8', labelColor: '#5f5a50', labelAt: 0.12,
      decorate({ group, mid, bottom, h, t, face }) {
        for (let i = 0; i < 5; i += 1) {
          const slot = new THREE.Mesh(Box(10, 1.1, 0.4), toon('#b9b5aa'));
          slot.position.set(mid.x, bottom + h * 0.35 + i * 2.6, mid.z + face * (t / 2 + 0.1));
          group.add(slot);
        }
      },
    },
  };

  // Jumper wire. Each end is { pos, kind }: 'pin' = female DuPont over a male header pin (pos = PCB
  // top at the pin); 'hole' = male plug in a breadboard hole or a female header (pos = surface).
  function wire(endA, endB, color) {
    const ink = inkMaterial();
    const group = new THREE.Group();
    const plug = (end) => {
      const tall = end.kind === 'pin' ? 12.5 : 9;
      const y0 = end.kind === 'pin' ? end.pos.y + 0.4 : end.pos.y + 1.4;
      const box = shape(Box(end.kind === 'pin' ? 2.6 : 2.3, tall, end.kind === 'pin' ? 2.6 : 2.3), '#1f1e23', ink);
      box.position.set(end.pos.x, y0 + tall / 2, end.pos.z);
      group.add(box);
      if (end.kind === 'hole') group.add(rod(end.pos, V(end.pos.x, y0, end.pos.z), 0.3, legMat()));
      return V(end.pos.x, y0 + tall, end.pos.z);
    };
    const a = plug(endA);
    const b = plug(endB);
    const dist = a.distanceTo(b);
    const lift = 5 + dist * 0.1;
    const mid = a.clone().lerp(b, 0.5);
    mid.y = Math.max(a.y, b.y) + 4 + dist * 0.18;
    const curve = new THREE.CatmullRomCurve3([a, a.clone().add(V(0, lift, 0)), mid, b.clone().add(V(0, lift, 0)), b], false, 'centripetal');
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 1.05, 12, false), toon(color));
    tube.castShadow = true;
    group.add(tube);
    return { group, ink };
  }

  const api = { THREE, INK, toon, flat, Box, inkMaterial, shape, rod, textTexture, breadboard, wire, parts: PARTS };
  for (const [name, build] of Object.entries(PC_PARTS)) PARTS[name] = (spec, ctx) => build(spec, ctx, api);
  Object.assign(PRESETS, modulePresets(api));
  PARTS.motor = (spec, ctx) => motorPart(spec, ctx, api);
  PARTS.screen = (spec, ctx) => screenPart(spec, ctx, api);
  return api;
}


// A board component with structure by kind. Heights are exaggerated (scale) so the board reads
// as solid at a glance. Port openings face the nearest board edge.
export function boardComponent(kit, c, { W, top, board, scale = 1.4 }) {
  const { THREE, toon, flat, Box, inkMaterial, shape, textTexture } = kit;
  const ink = inkMaterial();
  const group = new THREE.Group();
  const d = c.d ?? c.w;
  const H = (c.h ?? 1) * (c.kind === 'chip' || c.kind === 'ledsmd' ? 1.8 : scale);
  const y0 = c.under ? top - (board.thickness ?? 1.6) - 1.6 - H : top;
  const center = W(c.x, y0 + H / 2, c.z);
  const mat = toon(c.color ?? '#2b2a33', { emissive: '#000000' });
  const body = c.shape === 'cylinder'
    ? shape(new THREE.CylinderGeometry(c.w / 2, c.w / 2, H, 32), null, ink, { mat })
    : shape(Box(c.w, H, d, c.kind === 'crystal' ? d / 2 : Math.min(c.w, d, H) * (['chip', 'dip'].includes(c.kind) ? 0.12 : 0.22)), null, ink, { mat });
  body.position.copy(center);
  group.add(body);
  const edges = [[c.x - c.w / 2, -1, 0], [board.width - c.x - c.w / 2, 1, 0], [c.z - d / 2, 0, -1], [board.depth - c.z - d / 2, 0, 1]];
  const [, ox, oz] = edges.reduce((a, b) => (b[0] < a[0] ? b : a));
  const faceW = oz ? c.w : d;
  const add = (geo, color, x, y, z) => { const m = shape(geo, color, ink); m.position.set(x, y, z); group.add(m); return m; };
  const opening = (fw, fh, dy, color = '#1c1b24') => {
    const t = 1.2;
    const geo = oz ? Box(fw, fh, t, 0.35) : Box(t, fh, fw, 0.35);
    return add(geo, color, center.x + ox * (c.w / 2 - t / 2 + 0.15), center.y + dy, center.z + oz * (d / 2 - t / 2 + 0.15));
  };
  const tongue = (fw, fh, dy, color) => {
    const geo = oz ? Box(fw, fh, 1, 0.2) : Box(1, fh, fw, 0.2);
    return add(geo, color, center.x + ox * (c.w / 2 - 0.2), center.y + dy, center.z + oz * (d / 2 - 0.2));
  };
  const topY = y0 + H;
  switch (c.kind) {
    case 'usb':
      for (const dy of [H * 0.22, -H * 0.22]) {
        opening(faceW * 0.74, H * 0.3, dy);
        tongue(faceW * 0.56, H * 0.08, dy - H * 0.04, c.accent ?? '#2b2a33');
      }
      break;
    case 'ethernet':
      opening(faceW * 0.62, H * 0.52, -H * 0.08);
      for (const [s, col] of [[-1, '#58d36b'], [1, '#f2b233']]) {
        const along = s * faceW * 0.38;
        add(Box(1.8, 1.4, 1.8, 0.3), col, center.x + (oz ? along : ox * (c.w / 2)), center.y + H * 0.34, center.z + (oz ? oz * (d / 2) : along));
      }
      break;
    case 'hdmi':
    case 'usbc':
      opening(faceW * 0.74, H * 0.42, 0);
      break;
    case 'jst':
      opening(faceW * 0.8, H * 0.5, H * 0.1, '#3b3530');
      break;
    case 'fpc':
      add(Box(c.w * 1.08, 0.9, d * 0.94, 0.3), '#3a322b', center.x, topY + 0.3, center.z);
      break;
    case 'button':
      add(new THREE.CylinderGeometry(Math.min(c.w, d) * 0.32, Math.min(c.w, d) * 0.34, 1.6, 24), c.accent ?? '#d9d4c7', center.x, topY + 0.6, center.z);
      break;
    case 'shield':
      add(Box(c.w * 0.86, 0.5, d * 0.86, 0.3), c.color ?? '#d5d8de', center.x, topY + 0.15, center.z).material.color.offsetHSL(0, 0, 0.05);
      break;
    case 'dip': {
      // Through-hole chip: legs down both long sides and a notch at pin 1's end.
      const n = Math.round(c.w / 2.54);
      const leg = toon('#c7ccd3');
      for (let i = 0; i < n; i += 1) {
        for (const s of [-1, 1]) {
          const lx = center.x - c.w / 2 + 1.27 + i * 2.54;
          const lz = center.z + s * (d / 2 + 0.45);
          const m = new THREE.Mesh(Box(0.6, H * 0.75, 0.5, 0.1), leg);
          m.position.set(lx, top + H * 0.38, lz);
          const shoulder = new THREE.Mesh(Box(0.6, 0.4, 1.1, 0.1), leg);
          shoulder.position.set(lx, top + H * 0.62, center.z + s * (d / 2 + 0.2));
          group.add(m, shoulder);
        }
      }
      const notch = new THREE.Mesh(new THREE.CylinderGeometry(d * 0.14, d * 0.14, 0.3, 20, 1, false, 0, Math.PI), flat(toon('#141318')));
      notch.position.set(center.x - c.w / 2 + 0.05, topY + 0.05, center.z);
      notch.rotation.y = Math.PI / 2;
      group.add(notch);
      add(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), '#4a4852', center.x - c.w / 2 + 2.2, topY + 0.05, center.z + d * 0.28);
      break;
    }
    case 'electrolytic': {
      add(new THREE.CylinderGeometry(c.w / 2 - 0.15, c.w / 2 - 0.15, 0.5, 32), '#d9dde3', center.x, topY + 0.2, center.z);
      for (const r of [0, Math.PI / 2]) {
        const score = new THREE.Mesh(Box(c.w * 0.62, 0.15, 0.25, 0.05), flat(toon('#8d929b')));
        score.position.set(center.x, topY + 0.5, center.z);
        score.rotation.y = r + Math.PI / 4;
        group.add(score);
      }
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(c.w / 2 + 0.06, c.w / 2 + 0.06, H * 0.9, 32, 1, true, -0.5, 1), flat(toon(c.accent ?? '#2b2a33', { side: THREE.DoubleSide })));
      stripe.position.copy(center);
      group.add(stripe);
      break;
    }
    case 'usbb':
      opening(faceW * 0.62, H * 0.58, -H * 0.04);
      tongue(faceW * 0.36, H * 0.26, -H * 0.04, '#efe8da');
      break;
    case 'dcjack': {
      const r = Math.min(faceW, H) * 0.36;
      const barrel = shape(new THREE.CylinderGeometry(r, r, 1.6, 32), '#121116', ink);
      barrel.position.set(center.x + ox * (c.w / 2 + 0.2), center.y + H * 0.05, center.z + oz * (d / 2 + 0.2));
      barrel.rotation.set(oz ? Math.PI / 2 : 0, 0, ox ? Math.PI / 2 : 0);
      const pin = shape(new THREE.CylinderGeometry(r * 0.28, r * 0.28, 1.8, 16), '#d9dde3', ink);
      pin.position.copy(barrel.position);
      pin.rotation.copy(barrel.rotation);
      group.add(barrel, pin);
      break;
    }
    case 'regulator':
      add(Box(c.w * 1.02, 0.5, d * 0.36, 0.15), '#c9ced6', center.x, top + 0.3, center.z - d * 0.62);
      for (const s of [-1, 0, 1]) add(Box(0.7, 0.4, 1.6, 0.1), '#c9ced6', center.x + s * c.w * 0.3, top + 0.25, center.z + d * 0.62);
      break;
    case 'ledsmd': {
      const lens = add(Box(c.w * 0.8, 0.5, d * 0.8, 0.15), c.accent ?? '#ffcf3a', center.x, topY + 0.2, center.z);
      if (c.lit) lens.material.emissive = new THREE.Color(c.accent ?? '#ffcf3a').multiplyScalar(0.8);
      break;
    }
    // Grid of tiny LEDs; `grid: [cols, rows]`, `accent` LED colour.
    case 'ledmatrix': {
      const [cols, rows] = c.grid ?? [13, 8];
      const px = c.w / cols;
      const pz = d / rows;
      const led = toon(c.accent ?? '#5aa9ff', { emissive: c.accent ?? '#5aa9ff' });
      led.emissiveIntensity = 0.25;
      for (let i = 0; i < cols; i += 1) {
        for (let j = 0; j < rows; j += 1) {
          const m = new THREE.Mesh(Box(px * 0.55, 0.3, pz * 0.55, 0.05), led);
          m.position.set(center.x - c.w / 2 + (i + 0.5) * px, topY + 0.15, center.z - d / 2 + (j + 0.5) * pz);
          group.add(m);
        }
      }
      break;
    }
    case 'crystal':
      add(Box(c.w * 1.04, 0.5, d * 1.08, d * 0.5), '#9aa0a8', center.x, top + 0.25, center.z);
      break;
    case 'chip': {
      add(new THREE.CylinderGeometry(Math.min(c.w, d) * 0.06, Math.min(c.w, d) * 0.06, 0.2, 16), '#8d8a84', center.x - c.w * 0.36, topY + 0.05, center.z - d * 0.36);
      const pad = toon('#c9b07a');
      for (const [len, along, across] of [[c.w, 'x', 'z'], [d, 'z', 'x']]) {
        const n = Math.max(2, Math.floor(len / 1.4));
        for (let i = 0; i < n; i += 1) {
          for (const s of [-1, 1]) {
            const m = new THREE.Mesh(Box(along === 'x' ? 0.55 : 1.1, 0.35, along === 'x' ? 1.1 : 0.55, 0.1), pad);
            const t = (i + 0.5) / n - 0.5;
            m.position.set(center.x + (along === 'x' ? t * len * 0.9 : s * (c.w / 2 + 0.35)), top + 0.18, center.z + (along === 'z' ? t * len * 0.9 : s * (d / 2 + 0.35)));
            group.add(m);
          }
        }
      }
      break;
    }
    default: {
      const extra = PC_KINDS[c.kind]?.({ THREE, c, center, H, d, top, topY, add, group, toon, flat, Box, textTexture });
      for (const m of extra ?? []) group.add(m);
    }
  }
  if (c.text) {
    const size = c.textSize ?? Math.min(c.w, d * 4) * 0.82;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size / 4), flat(new THREE.MeshBasicMaterial({ map: textTexture(c.text, c.textColor ?? 'rgba(255,255,255,0.85)'), transparent: true })));
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(center.x, topY + (c.kind === 'shield' ? 0.45 : 0.04), center.z);
    group.add(plane);
  }
  return { group, mesh: body, mat, ink, anchor: W(c.x, c.under ? y0 : topY + 0.5, c.z) };
}


