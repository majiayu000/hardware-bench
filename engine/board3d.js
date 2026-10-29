// 3D scene: the board from BOARD, the per-lesson circuit, camera, picking, highlighting and
// thumbnails. Models come from the kit in board-geometry.js. Units are millimetres; board
// coordinates are the top view (x right, z down).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { pinPosition, findPin, BREADBOARD, holePosition, endpoint, ICON_HOLES } from './board-geometry.js';
import { createModelKit, boardComponent } from './kit.js';

export function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

const UP = new THREE.Vector3(0, 1, 0);

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createBoardScene(container, board, { accent = '#c51a4a', onHover, onSelect, onPress, onInteract } = {}) {
  const kit = createModelKit(THREE, { RoundedBoxGeometry });
  const { toon, flat, inkMaterial, shape } = kit;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  const inkRGB = new THREE.Color(kit.INK).toArray();
  const effect = new OutlineEffect(renderer, { defaultThickness: 0.0042, defaultColor: inkRGB, defaultAlpha: 1 });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 6000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.screenSpacePanning = false;

  scene.add(new THREE.HemisphereLight(0xf2f6ff, 0x46685b, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1);
  sun.position.set(-120, 260, 160);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -200, right: 200, top: 200, bottom: -200, near: 1, far: 800 });
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.5;
  scene.add(sun);

  const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), flat(new THREE.ShadowMaterial({ opacity: 0.2 })));
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.position.y = -0.05;
  shadowFloor.receiveShadow = true;
  scene.add(shadowFloor);

  // Cutting-mat grid on the table: 10 mm minor and 50 mm major lines that fade with distance.
  const gridMat = flat(new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { color: { value: new THREE.Color('#ffffff') }, fade: { value: 420 } },
    vertexShader: 'varying vec2 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform vec3 color; uniform float fade; varying vec2 vP;
      float line(vec2 p, float s){ vec2 q = p / s; vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q); return 1.0 - min(min(g.x, g.y), 1.0); }
      void main(){ float a = max(line(vP, 10.0) * 0.13, line(vP, 50.0) * 0.3) * (1.0 - smoothstep(fade * 0.35, fade, length(vP)));
        if (a < 0.003) discard; gl_FragColor = vec4(color, a); }`,
  }));
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), gridMat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = 0.02;
  grid.renderOrder = -1;
  scene.add(grid);

  const root = new THREE.Group();
  scene.add(root);
  const ox = -board.width / 2;
  const oz = -board.depth / 2;
  const t = board.thickness ?? 1.6;
  const LIFT = 4; // the board stands on brass standoffs above the mat
  const top = LIFT + t;
  const W = (x, y, z) => new THREE.Vector3(ox + x, y, oz + z);

  const pickables = [];
  const componentMeshes = new Map();
  const pinMeshes = new Map();
  const anchors = new Map();
  const accentColor = new THREE.Color(accent);

  // ---------- board ----------
  const boardGroup = new THREE.Group();
  root.add(boardGroup);
  const outline = new THREE.Shape();
  {
    const r = board.cornerRadius ?? 3;
    const [w, d] = [board.width, board.depth];
    outline.moveTo(r, 0); outline.lineTo(w - r, 0); outline.quadraticCurveTo(w, 0, w, r);
    outline.lineTo(w, d - r); outline.quadraticCurveTo(w, d, w - r, d); outline.lineTo(r, d);
    outline.quadraticCurveTo(0, d, 0, d - r); outline.lineTo(0, r); outline.quadraticCurveTo(0, 0, r, 0);
    for (const h of board.holes ?? []) {
      const hole = new THREE.Path();
      hole.absarc(h.x, h.z, h.r ?? 1.4, 0, Math.PI * 2, true);
      outline.holes.push(hole);
    }
  }
  const slab = (depth, y, color) => {
    const geo = new THREE.ExtrudeGeometry(outline, { depth, bevelEnabled: false, curveSegments: 24 });
    geo.rotateX(Math.PI / 2);
    geo.translate(ox, y, oz);
    return shape(geo, color, inkMaterial());
  };
  for (const h of board.holes ?? []) {
    const r = (h.r ?? 1.4) * 1.7;
    const post = shape(new THREE.CylinderGeometry(r, r, LIFT - t * 0.5, 6), '#c9a44c', inkMaterial());
    post.position.copy(W(h.x, (LIFT - t * 0.5) / 2, h.z));
    const screw = shape(new THREE.CylinderGeometry(r * 0.8, r * 0.8, 0.9, 20), '#d8dbe0', inkMaterial());
    screw.position.copy(W(h.x, top + 0.45, h.z));
    boardGroup.add(post, screw);
  }
  const pcb = slab(t, top, board.pcbColor ?? '#1f6f43');
  pcb.userData = { kind: 'board', label: board.name };
  boardGroup.add(pcb);

  // Silkscreen outlines, labels and faint traces painted on the PCB top.
  {
    const px = 12;
    const c = document.createElement('canvas');
    c.width = Math.round(board.width * px);
    c.height = Math.round(board.depth * px);
    const g = c.getContext('2d');
    const rand = rng(board.width * 1000 + board.depth);
    g.strokeStyle = 'rgba(255,255,255,0.08)';
    g.lineWidth = 0.35 * px;
    const dirs = [[1, 0], [0, 1], [0.707, 0.707], [-0.707, 0.707]];
    for (let i = 0; i < 70; i += 1) {
      let x = rand() * board.width;
      let z = rand() * board.depth;
      g.beginPath();
      g.moveTo(x * px, z * px);
      for (let s = 0; s < 3; s += 1) {
        const [dx, dz] = dirs[Math.floor(rand() * dirs.length)];
        const len = 3 + rand() * 12;
        x += dx * len;
        z += dz * len;
        g.lineTo(x * px, z * px);
      }
      g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.lineWidth = 0.18 * px;
    for (const comp of board.components ?? []) {
      if (comp.under) continue;
      const d = comp.d ?? comp.w;
      g.strokeRect((comp.x - comp.w / 2 - 0.6) * px, (comp.z - d / 2 - 0.6) * px, (comp.w + 1.2) * px, (d + 1.2) * px);
    }
    g.fillStyle = 'rgba(255,255,255,0.78)';
    g.textBaseline = 'middle';
    for (const s of board.silkscreen ?? []) {
      g.save();
      g.translate(s.x * px, s.z * px);
      g.rotate(((s.rotate ?? 0) * Math.PI) / 180);
      g.font = `${s.weight ?? 600} ${(s.size ?? 1.6) * px}px "IBM Plex Mono", monospace`;
      g.textAlign = s.align ?? 'left';
      g.fillText(s.text, 0, 0);
      g.restore();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const silk = new THREE.Mesh(new THREE.PlaneGeometry(board.width, board.depth), flat(new THREE.MeshBasicMaterial({ map: tex, transparent: true })));
    silk.rotation.x = -Math.PI / 2;
    silk.position.copy(W(board.width / 2, top + 0.02, board.depth / 2));
    boardGroup.add(silk);
  }

  for (const h of board.holes ?? []) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(h.r ?? 1.4, (h.r ?? 1.4) + 1, 32), flat(toon('#d8c27a')));
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(W(h.x, top + 0.03, h.z));
    boardGroup.add(ring);
  }

  // Scattered tiny SMD parts so the board does not look empty.
  {
    const rand = rng(7);
    const colors = ['#2a2826', '#3a3633', '#b88a5a', '#d8cfbf'];
    for (const area of board.smd ?? []) {
      for (let i = 0; i < (area.count ?? 8); i += 1) {
        const size = rand() < 0.3 ? [2.6, 1.1, 1.6] : [1.9, 0.7, 1];
        const m = new THREE.Mesh(new THREE.BoxGeometry(...size), toon(colors[Math.floor(rand() * colors.length)]));
        m.position.copy(W(area.x + (rand() - 0.5) * area.w, top + size[1] / 2, area.z + (rand() - 0.5) * area.d));
        m.rotation.y = rand() < 0.5 ? 0 : Math.PI / 2;
        boardGroup.add(m);
      }
    }
  }

  for (const c of board.components ?? []) {
    const built = boardComponent(kit, c, { W, top, board, scale: board.heightScale ?? 1.4 });
    built.mesh.userData = { kind: 'component', id: c.id, label: c.label, desc: c.desc };
    boardGroup.add(built.group);
    pickables.push(built.mesh);
    componentMeshes.set(c.id, built);
    anchors.set(`component:${c.id}`, built.anchor);
  }

  const baseMat = toon('#1c1b1f');
  const goldMat = toon('#e7c35e');
  const hotMat = new THREE.MeshBasicMaterial({ color: accent });
  const holeMat = flat(new THREE.MeshBasicMaterial({ color: '#050505' }));
  const headerInk = inkMaterial();
  for (const header of board.headers ?? []) {
    const pitch = header.pitch ?? 2.54;
    const female = header.style === 'female';
    // 'pad': flat gold contacts on the board edge (micro:bit rings and strips); padW × padD, optional hole.
    const pad = header.style === 'pad';
    const baseH = female ? 8.5 : pad ? 0.3 : 2.5;
    if (female) {
      const ps = header.pins.map((p) => pinPosition(header, p.n));
      const xs = ps.map((p) => p.x);
      const zs = ps.map((p) => p.z);
      const block = shape(kit.Box(Math.max(...xs) - Math.min(...xs) + pitch, baseH, Math.max(...zs) - Math.min(...zs) + pitch, 0.5), '#24232b', inkMaterial());
      block.position.copy(W((Math.max(...xs) + Math.min(...xs)) / 2, top + baseH / 2, (Math.max(...zs) + Math.min(...zs)) / 2));
      boardGroup.add(block);
    }
    for (const pin of header.pins) {
      const p = pinPosition(header, pin.n);
      const key = `${header.id}:${pin.n}`;
      const base = shape(new THREE.BoxGeometry(pad ? header.padW ?? pitch : pitch, baseH, pad ? header.padD ?? pitch : pitch), null, headerInk, { mat: baseMat });
      base.position.copy(W(p.x, top + baseH / 2, p.z));
      base.userData = { kind: 'pin', key, header: header.id, pin };
      base.visible = !female && !pad; // female headers are drawn as one block; this stays as the hit box
      let tip;
      if (pin.missing) {
        // Key position: the pin is left out on purpose so a plug only fits one way round.
        tip = new THREE.Mesh(new THREE.PlaneGeometry(pitch * 0.5, pitch * 0.5), holeMat);
        tip.rotation.x = -Math.PI / 2;
        tip.position.copy(W(p.x, top + baseH + 0.02, p.z));
      } else if (pad) {
        tip = new THREE.Group();
        const plate = new THREE.Mesh(kit.Box(header.padW ?? pitch, 0.25, header.padD ?? pitch, 0.1), goldMat);
        tip.add(plate);
        if (header.padHole) {
          const hole = new THREE.Mesh(new THREE.CircleGeometry(header.padHole / 2, 24), holeMat);
          hole.rotation.x = -Math.PI / 2;
          hole.position.y = 0.14;
          tip.add(hole);
        }
        tip.position.copy(W(p.x, top + 0.13, p.z));
      } else if (female) {
        tip = new THREE.Mesh(new THREE.PlaneGeometry(pitch * 0.46, pitch * 0.46), holeMat);
        tip.rotation.x = -Math.PI / 2;
        tip.position.copy(W(p.x, top + baseH + 0.02, p.z));
      } else {
        tip = new THREE.Mesh(new THREE.BoxGeometry(0.64, 6, 0.64), goldMat);
        tip.position.copy(W(p.x, top + 3, p.z));
        tip.castShadow = true;
      }
      tip.userData = base.userData;
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12), new THREE.MeshBasicMaterial({ color: accent }));
      marker.position.copy(W(p.x, top + (female ? baseH : pad ? 0 : 6) + 3.5, p.z));
      marker.visible = false;
      boardGroup.add(base, tip, marker);
      pickables.push(base, ...(pad ? tip.children : [tip]));
      if (pad) tip.children.forEach((m) => { m.userData = base.userData; });
      pinMeshes.set(key, { tip: pad ? tip.children[0] : tip, marker, restMat: female ? holeMat : goldMat });
      anchors.set(`pin:${key}`, W(p.x, top + (female ? baseH : 6), p.z));
    }
  }

  // ---------- per-lesson circuit ----------
  const circuitGroup = new THREE.Group();
  root.add(circuitGroup);
  let parts = new Map();
  let circuitPickables = [];

  function circuitCtx(circuit) {
    return {
      hole(name) {
        const p = holePosition(circuit.breadboard, name);
        if (!p) throw new Error(`Unknown breadboard hole "${name}"`);
        return W(p.x, BREADBOARD.height, p.z);
      },
      board: (x, z) => W(x, 0, z),
      top,
      component: (id) => anchors.get(`component:${id}`)?.clone(),
      // A board component's footprint in world units (for parts that sit in slots and sockets).
      comp(id) {
        const c = board.components.find((x) => x.id === id);
        if (!c) throw new Error(`Unknown component "${id}"`);
        const p = W(c.x, 0, c.z);
        return { x: p.x, z: p.z, w: c.w, d: c.d ?? c.w, top, h: (c.h ?? 1) * (board.heightScale ?? 1.4) };
      },
      pin(key) {
        const f = findPin(board, key);
        if (!f) throw new Error(`Unknown pin "${key}"`);
        const p = pinPosition(f.header, f.pin.n);
        return { pos: W(p.x, top, p.z), pitch: f.header.pitch ?? 2.54 };
      },
    };
  }

  function setCircuit(circuit) {
    circuitGroup.traverse((o) => { o.geometry?.dispose(); });
    circuitGroup.clear();
    parts = new Map();
    circuitPickables = [];
    for (const k of [...anchors.keys()]) if (k.startsWith('part:')) anchors.delete(k);
    if (!circuit) return;
    const ctx = circuitCtx(circuit);
    const add = (id, built) => {
      circuitGroup.add(built.group);
      parts.set(id, built);
      circuitPickables.push(...built.pickables);
      anchors.set(`part:${id}`, built.anchor);
    };
    // Lifted a hair off the floor so its base does not z-fight with the shadow plane.
    if (circuit.breadboard) add('breadboard', kit.breadboard(W(circuit.breadboard.x, 0.3, circuit.breadboard.z)));
    for (const spec of circuit.parts ?? []) {
      if (!kit.parts[spec.type]) throw new Error(`Unknown part type "${spec.type}"`);
      const built = kit.parts[spec.type](spec, ctx);
      built.insert = spec.insert ?? built.insert ?? [0, 70, 0];
      add(spec.id, built);
    }
    for (const w of circuit.wires ?? []) {
      const end = (ref) => {
        const e = endpoint(board, circuit, ref);
        if (!e) throw new Error(`Unknown wire endpoint "${ref}"`);
        if (e.kind === 'hole') return { kind: 'hole', pos: W(e.x, BREADBOARD.height, e.z) };
        const female = e.header.style === 'female';
        return { kind: female ? 'hole' : 'pin', pos: W(e.x, female ? top + 8.5 : top, e.z) };
      };
      circuitGroup.add(kit.wire(end(w.from), end(w.to), w.color ?? '#e8a23a').group);
    }
  }

  // ---------- highlighting & selection ----------
  let activePins = [];
  let activeComponents = [];
  let selected = null;

  function highlight({ pins = [], components = [] } = {}) {
    for (const key of activePins) {
      const p = pinMeshes.get(key);
      p.tip.material = p.restMat;
      p.marker.visible = false;
    }
    activePins = pins.filter((k) => pinMeshes.has(k));
    activeComponents = components.filter((id) => componentMeshes.has(id));
    for (const key of activePins) {
      const p = pinMeshes.get(key);
      p.tip.material = hotMat;
      p.marker.visible = true;
    }
    refreshFocusOutlines();
  }

  // Focused board components get an accent outline (a tint would change their colour).
  const focusOutline = { color: accentColor.toArray(), thickness: 0.0065 };
  let outlined = [];
  function refreshFocusOutlines() {
    for (const ink of outlined) setOutline(ink, null);
    outlined = activeComponents.map((id) => componentMeshes.get(id).ink);
    for (const ink of outlined) setOutline(ink, focusOutline);
  }

  const inkOf = (ref) => (ref?.part ? parts.get(ref.part)?.ink : ref?.component ? componentMeshes.get(ref.component)?.ink : null);
  const setOutline = (ink, params) => { for (const m of ink?.mats ?? []) { if (params) m.userData.outlineParameters = params; else delete m.userData.outlineParameters; } };
  function select(ref) {
    setOutline(inkOf(selected), null);
    selected = ref;
    refreshFocusOutlines();
  }

  // ---------- camera ----------
  const DEFAULT_VIEW = { az: 0.5, el: 0.82 };
  let VIEW = DEFAULT_VIEW;
  const anim = { from: null, to: null, t: 1, dur: 0.8 };
  let reducedMotion = false;
  let home = null;
  let intro = null;
  // Share of the free stage the scene may fill. Circuits are wide, so they are framed tighter.
  let FRAME = { x: 0.8, y: 0.78 };
  // Pixels on the right covered by the key; the scene is centred in the space left of it.
  let inset = 0;
  let frameScaleX = 1;

  function moveTo(goal, instant = false) {
    intro = null;
    if (instant || reducedMotion) {
      camera.position.copy(goal.pos);
      controls.target.copy(goal.target);
      anim.t = 1;
      return;
    }
    anim.from = { pos: camera.position.clone(), target: controls.target.clone() };
    anim.to = goal;
    anim.t = 0;
  }

  // Frame everything on the table: the bounding sphere must fit the narrower field of view.
  function fit(instant = false) {
    const box = new THREE.Box3();
    root.updateMatrixWorld(true);
    root.traverse((o) => { if (o.isMesh && !o.isSprite) box.expandByObject(o); });
    // Fit the projected bounding box (not a bounding sphere) so the scene fills the stage.
    const center = box.getCenter(new THREE.Vector3());
    const dir = new THREE.Vector3(Math.sin(VIEW.az) * Math.cos(VIEW.el), Math.sin(VIEW.el), Math.cos(VIEW.az) * Math.cos(VIEW.el));
    const corners = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));
    const probe = camera.clone();
    probe.clearViewOffset();
    let dist = box.getSize(new THREE.Vector3()).length() * 3;
    for (let i = 0; i < 3; i += 1) {
      probe.position.copy(dir).multiplyScalar(dist).add(center);
      probe.lookAt(center);
      probe.updateMatrixWorld();
      const extent = Math.max(...corners.map((c) => { const p = c.clone().project(probe); return Math.max(Math.abs(p.x) / (FRAME.x * frameScaleX), Math.abs(p.y) / FRAME.y); }));
      dist *= extent;
    }
    home = { pos: dir.clone().multiplyScalar(dist).add(center), target: center, dist };
    // Swing in from the side so it is obvious at a glance that the scene is 3D.
    if (!instant && !reducedMotion) {
      intro = { t: 0 };
      anim.t = 1;
      controls.target.copy(center);
      return;
    }
    controls.minDistance = dist * 0.25;
    controls.maxDistance = dist * 2.2;
    moveTo(home, instant);
  }

  function anchorOf(ref) {
    if (ref?.pin) return anchors.get(`pin:${ref.pin}`);
    if (ref?.component) return anchors.get(`component:${ref.component}`);
    if (ref?.part) return anchors.get(`part:${ref.part}`);
    return null;
  }

  function zoomTo(ref) {
    const p = anchorOf(ref);
    if (!p) return;
    const dir = camera.position.clone().sub(controls.target).normalize();
    moveTo({ pos: p.clone().addScaledVector(dir, (home?.dist ?? 200) * 0.42), target: p.clone() });
  }
  function rotateBy(rad) {
    const off = camera.position.clone().sub(controls.target).applyAxisAngle(UP, rad);
    moveTo({ pos: controls.target.clone().add(off), target: controls.target.clone() });
  }
  function zoomBy(factor) {
    const off = camera.position.clone().sub(controls.target);
    off.setLength(THREE.MathUtils.clamp(off.length() * factor, controls.minDistance, controls.maxDistance));
    moveTo({ pos: controls.target.clone().add(off), target: controls.target.clone() });
  }
  function pan(dx, dz) {
    const fwd = controls.target.clone().sub(camera.position).setY(0).normalize();
    const right = new THREE.Vector3().crossVectors(fwd, UP);
    const step = camera.position.distanceTo(controls.target) * 0.06;
    const delta = right.multiplyScalar(dx * step).addScaledVector(fwd, dz * step);
    camera.position.add(delta);
    controls.target.add(delta);
  }

  const pv = new THREE.Vector3();
  function project(ref) {
    const p = anchorOf(ref);
    if (!p) return null;
    pv.copy(p).project(camera);
    const el = renderer.domElement;
    return { x: (pv.x * 0.5 + 0.5) * el.clientWidth, y: (-pv.y * 0.5 + 0.5) * el.clientHeight, visible: pv.z < 1 };
  }

  // Footprints (world x/z) and camera heading for the minimap.
  function mapView() {
    const rects = [{ x: ox, z: oz, w: board.width, d: board.depth, kind: 'board' }];
    const bb = parts.get('breadboard');
    if (bb) rects.push({ x: bb.group.position.x, z: bb.group.position.z, w: BREADBOARD.width, d: BREADBOARD.depth, kind: 'breadboard' });
    const dir = controls.target.clone().sub(camera.position);
    return { rects, target: { x: controls.target.x, z: controls.target.z }, heading: Math.atan2(dir.x, dir.z) };
  }

  // ---------- picking ----------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const el = renderer.domElement;
  let hoverFrame = 0;
  let downAt = null;
  let pressing = null;

  function pick(ev) {
    const rect = el.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const visible = (o) => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
    const hit = raycaster.intersectObjects([...circuitPickables, ...pickables], false).find((h) => visible(h.object));
    const at = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    if (hit && hit.object.userData.kind !== 'board' && hit.object.userData.id !== 'breadboard') return { ...hit.object.userData, ...at };
    // Small parts are hard to hit exactly: accept a click near a part's anchor.
    for (const id of parts.keys()) {
      const p = id !== 'breadboard' && project({ part: id });
      if (p && parts.get(id).group.visible && Math.hypot(p.x - at.x, p.y - at.y) < 16) return { kind: 'part', id, ...at };
    }
    return hit ? { ...hit.object.userData, ...at } : null;
  }
  function onMove(ev) {
    if (hoverFrame) return;
    hoverFrame = requestAnimationFrame(() => {
      hoverFrame = 0;
      const info = pick(ev);
      el.style.cursor = info && info.kind !== 'board' && info.id !== 'breadboard' ? 'pointer' : 'grab';
      onHover?.(info);
    });
  }
  function onDown(ev) {
    downAt = { x: ev.clientX, y: ev.clientY };
    const info = pick(ev);
    // Press-and-hold parts (buttons) react at once and do not orbit the camera.
    if (info?.kind === 'part' && onPress?.(info.id, true)) {
      pressing = info.id;
      controls.enabled = false;
    }
  }
  function onUp(ev) {
    if (pressing) {
      onPress?.(pressing, false);
      pressing = null;
      controls.enabled = true;
      downAt = null;
      return;
    }
    if (!downAt) return;
    const moved = Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y);
    downAt = null;
    if (moved < 5) onSelect?.(pick(ev));
  }
  function onLeave() {
    onHover?.(null);
    if (pressing) onUp({});
  }
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointerleave', onLeave);

  let idleSince = performance.now();
  let turntable = false;
  // Only real camera movement counts as interacting (a plain click must not collapse the labels).
  let dragging = false;
  let moving = false;
  controls.addEventListener('start', () => { anim.t = 1; intro = null; dragging = true; });
  controls.addEventListener('change', () => { if (dragging && !moving) { moving = true; onInteract?.(true); } });
  controls.addEventListener('end', () => {
    dragging = false;
    idleSince = performance.now();
    if (moving) { moving = false; onInteract?.(false); }
  });

  // ---------- sizing & loop ----------
  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    // A wider virtual frame, of which the canvas shows the right-hand part, moves the centre left.
    const k = Math.min(inset, w * 0.4);
    camera.aspect = (w + k) / h;
    if (k) camera.setViewOffset(w + k, h, k, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    frameScaleX = (w - k) / (w + k);
    fit(true);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const frameListeners = new Set();
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    const time = clock.elapsedTime;
    if (intro && home) {
      intro.t = Math.min(1, intro.t + Math.min(dt, 1 / 30) / 1.6); // capped so slow machines still see it
      const e = 1 - (1 - intro.t) ** 3;
      const az = VIEW.az + (1 - e) * 1.3;
      const el = VIEW.el + (1 - e) * 0.25;
      camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(home.dist * (1 + (1 - e) * 0.3)).add(home.target);
      controls.target.copy(home.target);
      if (intro.t >= 1) intro = null;
    }
    if (anim.t < 1) {
      anim.t = Math.min(1, anim.t + dt / anim.dur);
      const e = 1 - (1 - anim.t) ** 3;
      camera.position.lerpVectors(anim.from.pos, anim.to.pos, e);
      controls.target.lerpVectors(anim.from.target, anim.to.target, e);
    }
    controls.autoRotate = turntable && !reducedMotion && anim.t >= 1 && performance.now() - idleSince > 5000;
    controls.autoRotateSpeed = 0.5;
    for (const p of parts.values()) p.tick?.(dt);
    const pulse = 0.5 + 0.5 * Math.sin(time * 4);
    for (const key of activePins) pinMeshes.get(key).marker.scale.setScalar(0.8 + pulse * 0.5);
    const sel = inkOf(selected);
    if (sel) setOutline(sel, { color: accentColor.toArray(), thickness: 0.006 + pulse * 0.004 });
    controls.update();
    effect.render(scene, camera);
    for (const fn of frameListeners) fn();
  });

  // ---------- lesson thumbnails ----------
  let thumbRenderer;
  let thumbEffect;
  // icon: 'board', 'circuit' (the lesson's breadboard and parts, pass `circuit`) or a part spec.
  function thumbnail(icon, circuit, size = [320, 240]) {
    thumbRenderer ??= new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    thumbEffect ??= new OutlineEffect(thumbRenderer, { defaultThickness: 0.009, defaultColor: inkRGB });
    thumbRenderer.setSize(size[0], size[1], false);
    thumbRenderer.outputColorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Scene();
    s.add(new THREE.HemisphereLight(0xffffff, 0x8a8170, 1.6));
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(-1, 2, 1.5);
    s.add(light);
    let obj;
    if (icon === 'board') {
      obj = boardGroup.clone();
    } else if (icon === 'circuit') {
      obj = new THREE.Group();
      const ctx = circuitCtx(circuit);
      // A breadboard circuit is shown on its own; parts that sit on the board are shown on it.
      if (circuit.breadboard) obj.add(kit.breadboard(W(circuit.breadboard.x, 0, circuit.breadboard.z)).group);
      else obj.add(boardGroup.clone());
      for (const spec of circuit.parts ?? []) obj.add(kit.parts[spec.type](spec, ctx).group);
      obj.traverse((o) => { if (o.isPointLight) o.intensity = 0; });
    } else {
      obj = kit.parts[icon.type]({ id: 'icon', ...ICON_HOLES[icon.type], ...icon }, circuitCtx({ breadboard: { x: 0, z: 0 } })).group;
      obj.traverse((o) => { if (o.isPointLight) o.intensity = 0; });
    }
    s.add(obj);
    // Frame visible geometry only: glow sprites and hidden sound rings would shrink small parts.
    const bounds = new THREE.Box3();
    obj.updateMatrixWorld(true);
    obj.traverse((o) => { if (o.isMesh && !o.isSprite && !(o.material.transparent && o.material.opacity === 0)) bounds.expandByObject(o); });
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    const cam = new THREE.PerspectiveCamera(28, size[0] / size[1], 0.1, 4000);
    const [az, elev] = typeof icon === 'string' ? [0.5, 0.82] : [0.6, 0.5];
    const dist = (sphere.radius / Math.sin(THREE.MathUtils.degToRad(14))) * 0.9;
    cam.position.set(Math.sin(az) * Math.cos(elev), Math.sin(elev), Math.cos(az) * Math.cos(elev)).multiplyScalar(dist).add(sphere.center);
    cam.lookAt(sphere.center);
    thumbEffect.render(s, cam);
    return thumbRenderer.domElement.toDataURL('image/png');
  }

  return {
    // view: optional { az, el } camera angle in radians for this lesson.
    setCircuit(circuit, view) {
      VIEW = { ...DEFAULT_VIEW, ...view };
      FRAME = circuit?.breadboard ? { x: 0.9, y: 0.86 } : { x: 0.8, y: 0.78 };
      setCircuit(circuit);
      fit();
    },
    highlight,
    select,
    // shown: visibility; lift: 0 = seated … 1 = floating along the part's insert vector.
    setPart(id, state) {
      const p = parts.get(id);
      if (!p) return;
      if ('shown' in state) p.group.visible = state.shown;
      if ('lift' in state) p.group.position.set(...p.insert.map((v) => v * state.lift));
      p.setState?.(state);
    },
    hasPart: (id) => parts.has(id),
    project,
    zoomTo,
    rotateBy,
    zoomBy,
    pan,
    resetView() { if (home) moveTo(home); },
    mapView,
    thumbnail,
    onFrame(fn) { frameListeners.add(fn); return () => frameListeners.delete(fn); },
    setOptions({ grid: showGrid, turntable: spin, reducedMotion: rm, ink, inset: right } = {}) {
      if (right !== undefined && right !== inset) { inset = right; resize(); }
      if (showGrid !== undefined) grid.visible = showGrid;
      if (spin !== undefined) { turntable = spin; idleSince = performance.now(); }
      if (rm !== undefined) reducedMotion = rm;
      if (ink) gridMat.uniforms.color.value.set(ink);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointerleave', onLeave);
      controls.dispose();
      thumbRenderer?.dispose();
      renderer.dispose();
      el.remove();
    },
  };
}
