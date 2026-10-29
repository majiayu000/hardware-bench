// Everything specific to this course lives in this file: site metadata, the 3D model and the lessons.

export const SITE = {
  id: 'learn-keyboard',
  title: 'Mechanical Keyboard: Build Your Own',
  accent: '#b8569a',
  logicVolts: 5,
  shell: 'build log',
  terminalHint: 'Each step appears here as it plays.',
};

export const PIN_TYPES = {};

// A small hot-swap keyboard kit (a 4 × 12 grid of 19.05 mm key units, the usual MX spacing) seen
// from above, millimetres. The base is the PCB in its case; hot-swap sockets sit under every key
// position. Layout, case and part shapes are stylised to show a typical kit, not a specific product.
const U = 19.05;
const COLS = 12;
const ROWS = 4;
const X0 = 12 + U / 2;
const Z0 = 12 + U / 2;
const key = (c, r) => ({ x: X0 + c * U, z: Z0 + r * U });
export const BOARD = {
  name: 'Hot-swap keyboard PCB in its case',
  width: 24 + COLS * U,
  depth: 24 + ROWS * U,
  thickness: 1.6,
  cornerRadius: 6,
  pcbColor: '#1d3a5f',
  holes: [],
  silkscreen: [],
  components: [
    { id: 'case', label: 'Case', desc: 'Holds the PCB and plate. Often aluminium or plastic, with rubber feet underneath.', shape: 'box', x: (24 + COLS * U) / 2, z: 3, w: 24 + COLS * U, d: 6, h: 14, color: '#3a3d45' },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Connects the keyboard to the computer.', shape: 'box', x: 30, z: 1.5, w: 9, d: 7, h: 3.2, color: '#bfc5ce', metal: true },
    { id: 'mcu', kind: 'chip', label: 'Microcontroller', desc: 'Scans every key many times a second and tells the computer which ones are pressed. Many kits run QMK or VIA firmware.', shape: 'box', x: 60, z: 14, w: 7, d: 7, h: 0.9, color: '#2a2930' },
    { id: 'socket', kind: 'chip', label: 'Hot-swap socket', desc: 'One under every key. The switch’s two metal pins push into it, so no soldering is needed.', shape: 'box', ...key(5, 2), w: 9, d: 5, h: 1.5, color: '#2a2930' },
    { id: 'stabholes', label: 'Stabilizer holes', desc: 'Pairs of holes under long keys (space bar, Enter, Shift) where the stabilizer housings clip or screw in.', shape: 'box', x: X0 + 5.5 * U, z: Z0 + 3 * U, w: 30, d: 4, h: 0.3, color: '#141518' },
    { id: 'feet', under: true, label: 'Rubber feet', desc: 'Stop it sliding. Many cases also have flip-out feet to tilt the keyboard.', shape: 'box', x: 30, z: 60, w: 12, d: 8, h: 2, color: '#24232b' },
  ],
  headers: [],
};

// ---------- parts ----------
// Each row of switches is one part: a housing per key plus its red stem.
const switchRow = (id, r, cols, label, desc) => ({
  id, type: 'block', at: { x: X0 + 5.5 * U, z: Z0 + r * U }, w: 1, d: 1, h: 0.1, y: 6, color: '#2b2a30', insert: [0, 40, 0], label, desc,
  boxes: cols.flatMap((c) => [
    { x: (c - 5.5) * U, y: -0.1, w: 14, d: 14, h: 9, color: '#2b2a30' },
    { x: (c - 5.5) * U, y: 8.9, w: 4, d: 4, h: 3.6, color: '#d0563a' },
  ]),
});
const ALL_COLS = Array.from({ length: COLS }, (_, c) => c);
const BOTTOM_COLS = [0, 1, 2, 3, 5.5, 8, 9, 10, 11];      // the space bar spans columns 4–7
const SWITCH_DESC = 'Each switch: two metal pins into the hot-swap socket, the housing clipped into the plate.';
const switches = [0, 1, 2].map((r) => switchRow(`sw${r}`, r, ALL_COLS, `Switches, row ${r + 1}`, SWITCH_DESC));
const SWITCH_BOTTOM = switchRow('swb', 3, BOTTOM_COLS, 'Switches, bottom row', 'The space bar sits on one switch in the middle, held level by its stabilizer.');
const STAB = { id: 'stab', type: 'block', at: { x: X0 + 5.5 * U, z: Z0 + 3 * U }, w: 50, d: 3, h: 2, y: 1, color: '#c9ced6', insert: [0, 40, 0], label: 'Stabilizer', desc: 'A wire and two small housings that keep a long key level wherever you press it. Lube the wire ends to stop rattle.', boxes: [{ x: -12, y: -2, w: 6, d: 12, h: 8, color: '#2b2a30' }, { x: 12, y: -2, w: 6, d: 12, h: 8, color: '#2b2a30' }] };
const PLATE = { id: 'plate', type: 'block', at: { x: (24 + COLS * U) / 2, z: (24 + ROWS * U) / 2 }, w: COLS * U + 6, d: ROWS * U + 6, h: 1.5, y: 5, color: '#9aa0a8', insert: [0, 50, 0], opacity: 0.85, label: 'Plate', desc: 'A metal or plastic sheet with a square hole for every switch. It holds the switches firmly in line.' };
// Keycaps: one per key, accent colour on the outer columns, and one wide space bar.
const cap = (c, r, w = 17.5, color = c === 0 || c === 11 ? '#b8569a' : '#efe9dc') => ({ x: (c - 5.5) * U, z: (r - 1.5) * U, y: -0.1, w, d: 17.5, h: 8, color });
const KEYCAPS = {
  id: 'caps', type: 'block', at: { x: X0 + 5.5 * U, z: Z0 + 1.5 * U }, w: 1, d: 1, h: 0.1, y: 20, color: '#efe9dc', insert: [0, 50, 0], label: 'Keycaps', desc: 'Press straight down onto each switch stem. Pull them off with a wire keycap puller.',
  boxes: [...[0, 1, 2].flatMap((r) => ALL_COLS.map((c) => cap(c, r))), ...BOTTOM_COLS.filter((c) => c !== 5.5).map((c) => cap(c, 3)), cap(5.5, 3, 4 * U - 1.5, '#efe9dc')],
};
const ALL = [STAB, PLATE, ...switches, SWITCH_BOTTOM, KEYCAPS];

export const LESSONS = [
  {
    id: 'meet',
    title: 'What is inside a keyboard',
    short: 'Meet the parts',
    summary: 'PCB, plate, switches, stabilizers and keycaps: five layers stacked in a case.',
    icon: 'circuit',
    focus: { components: ['socket', 'mcu'] },
    circuit: { parts: ALL },
    callouts: [
      { part: 'caps', icon: 'button', title: 'Keycaps', text: 'What your fingers touch.' },
      { part: 'sw1', icon: 'chip', title: 'Switches', text: 'One mechanism per key.' },
      { part: 'plate', icon: 'target', title: 'Plate', text: 'Holds the switches in line.' },
      { component: 'mcu', icon: 'code', title: 'Controller', text: 'Turns key presses into USB.' },
    ],
    overview: [
      'A mechanical keyboard has a separate **switch** under every key: a small spring and contact you can feel and hear. A **hot-swap** board has sockets, so you build and change it with no soldering.',
      'From the bottom up: the **PCB** (the circuit board, with a socket per key and a microcontroller), **stabilizers** for long keys, the **plate**, the **switches**, and the **keycaps**.',
      { tips: [['target', 'Click each layer to read about it'], ['rotr', 'Drag to look from the side and see the layers'], ['play', 'The build lessons play each step like a video']] },
      { h: 'Typical kit' },
      { specs: [['Key spacing', '19.05 mm (0.75 in)'], ['Switch type', 'MX-style, 3-pin or 5-pin'], ['Sockets', 'Hot-swap, no soldering'], ['Firmware', 'Often QMK or VIA'], ['Connection', 'USB-C']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Hot-swap keyboard kit', 'Case, PCB and plate.'], ['1', 'Switch puller and keycap puller', 'Usually included.']],
  },

  {
    id: 'choose',
    title: 'Choose your switches',
    short: 'Switch types',
    summary: 'Linear, tactile or clicky; 3-pin or 5-pin: what each means and which fits your board.',
    icon: 'circuit',
    focus: { components: ['socket'] },
    circuit: { parts: [STAB, PLATE, ...switches, SWITCH_BOTTOM] },
    callouts: [
      { part: 'sw1', icon: 'chip', title: 'Switch', text: 'Feel and sound live here.' },
      { component: 'socket', icon: 'plug', title: 'Hot-swap socket', text: 'Two metal pins go in.' },
    ],
    overview: [
      'Switches differ in **feel**: **linear** switches go straight down smoothly, **tactile** ones have a bump you feel halfway, and **clicky** ones add a click you hear. They also differ in how hard you must press (the spring weight).',
      'Every MX-style switch has **two metal pins** and a plastic centre post. **5-pin** switches add two thin plastic legs for extra steadiness; **3-pin** switches lack them. If your PCB has holes for 5 pins, both kinds fit; on a 3-pin-only board, clip the extra legs off 5-pin switches.',
      { tips: [['info', 'Try a switch tester before buying ninety switches'], ['chip', 'Optical and magnetic switches need their own boards'], ['target', 'Buy a few spares: pins can bend']] },
    ],
    kit: [['1', 'Set of MX-style switches', 'One per key, plus a few spares.']],
  },

  {
    id: 'stabs',
    title: 'Fit the stabilizers',
    short: 'Stabilizers',
    summary: 'Clip or screw the stabilizers for the long keys into the PCB before anything else.',
    icon: 'circuit',
    focus: { components: ['stabholes'] },
    circuit: { parts: [STAB] },
    callouts: [
      { part: 'stab', icon: 'target', title: 'Stabilizer', text: 'Wire plus two housings.' },
      { component: 'stabholes', icon: 'plug', title: 'Mounting holes', text: 'Under the space bar.' },
    ],
    overview: [
      'Keys wider than two units (space bar, Enter, Shift, Backspace) are pressed off-centre, so a **stabilizer** keeps them level. It goes in first, because the plate and switches cover its holes.',
      'Screw-in stabilizers are steadiest; clip-in ones press into place. Put a little dielectric grease or lube where the wire meets the housings to stop rattling.',
      { tips: [['play', 'Press Play in Try it'], ['info', 'The wire faces the bottom of the board on most PCBs'], ['target', 'Press each end: it should move freely, not stick']] },
    ],
    sim: {
      type: 'assembly',
      steps: [{ do: 'insert', parts: ['stab'], text: 'Push the two **stabilizer housings** into their holes (or screw them in), wire towards the bottom edge.' }],
    },
    kit: [['1', 'Set of stabilizers', 'One for each key of 2 units or wider.'], ['–', 'Stabilizer lube (optional)']],
  },

  {
    id: 'plate',
    title: 'Place the plate',
    summary: 'Lay the plate over the PCB so every square hole lines up with a socket.',
    icon: 'circuit',
    focus: { components: ['socket'] },
    circuit: { parts: [STAB, PLATE] },
    callouts: [
      { part: 'plate', icon: 'target', title: 'Plate', text: 'Holes over the sockets.' },
      { component: 'socket', icon: 'plug', title: 'Sockets', text: 'Visible through each hole.' },
    ],
    overview: [
      'The plate holds the switches straight and takes the force of your typing. On some kits it is screwed to the case; on others a few switches in the corners hold plate and PCB together.',
      { tips: [['play', 'Press Play in Try it'], ['info', 'Check the stabilizers poke through their cut-outs'], ['target', 'Corners first, then the middle']] },
    ],
    sim: {
      type: 'assembly',
      steps: [{ do: 'insert', parts: ['plate'], text: 'Lower the **plate** onto the PCB, stabilizers through their cut-outs.' }],
    },
    kit: [['–', 'The plate from the kit']],
  },

  {
    id: 'switches',
    title: 'Press in the switches',
    short: 'Switches',
    summary: 'Line up the two metal pins and press each switch straight down until it clicks into the plate.',
    icon: 'circuit',
    focus: { components: ['socket'] },
    circuit: { parts: [STAB, PLATE, ...switches, SWITCH_BOTTOM] },
    callouts: [
      { part: 'sw0', icon: 'chip', title: 'Top row', text: 'Corners first to lock the plate.' },
      { part: 'swb', icon: 'chip', title: 'Bottom row', text: 'Space bar switch in the middle.' },
    ],
    overview: [
      'Before each switch goes in, check its **two metal pins are straight**. Line them up with the socket holes, then press straight down until the clips snap into the plate. Support the socket from below if your kit says so.',
      { tips: [['play', 'Press Play in Try it'], ['target', 'Start with the four corners to lock plate and PCB together'], ['info', 'A bent pin? Straighten it gently with tweezers before trying again']] },
      { note: 'Never force a switch. If it will not go in, a pin is bent or out of line; forcing it can crush the pin or pull the socket off the PCB.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['sw0'], text: 'Press in the **top row**, starting with the corners.' },
        { do: 'insert', parts: ['sw1'], text: 'Then the **second row**.' },
        { do: 'insert', parts: ['sw2'], text: 'The **third row**.' },
        { do: 'insert', parts: ['swb'], text: 'And the **bottom row**, including the switch under the space bar.' },
      ],
    },
    kit: [['–', 'Your switches'], ['1', 'Tweezers', 'For straightening a bent pin.']],
  },

  {
    id: 'test',
    title: 'Test every key',
    summary: 'Plug it in and press every key in a keyboard tester before the keycaps go on.',
    icon: 'circuit',
    focus: { components: ['usb', 'mcu'] },
    circuit: { parts: [STAB, PLATE, ...switches, SWITCH_BOTTOM] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Plug it in now.' },
      { component: 'mcu', icon: 'code', title: 'Controller', text: 'Reports every press.' },
    ],
    overview: [
      'Test **before** fitting keycaps: a key that does nothing is much easier to fix now. Open any online keyboard tester, or the test mode of VIA or the QMK Configurator, and press each switch with a fingertip or tweezers. Every key should light up once.',
      { steps: ['Plug the keyboard into the computer.', 'Open a keyboard tester.', 'Press every switch and watch for keys that do not register or register twice.'] },
      { tips: [['info', 'Dead key? Pull the switch and check for a bent pin'], ['target', 'A whole row or column dead points to the PCB or firmware: contact the kit’s maker'], ['usb', 'Try another cable if nothing works at all']] },
    ],
    kit: [['1', 'USB-C cable'], ['1', 'Computer with a web browser']],
  },

  {
    id: 'caps',
    title: 'Put on the keycaps',
    short: 'Keycaps',
    summary: 'Press each keycap straight down onto its switch stem, long keys onto their stabilizers too.',
    icon: 'circuit',
    focus: { components: ['case'] },
    circuit: { parts: ALL },
    callouts: [
      { part: 'caps', icon: 'button', title: 'Keycaps', text: 'Straight down, firmly.' },
      { part: 'stab', icon: 'target', title: 'Long keys', text: 'Also clip onto the stabilizer.' },
    ],
    overview: [
      'Keycaps are shaped for each **row** (their **profile**), so put each cap in the row it was made for. Long keys have extra stems that snap onto the stabilizer’s two inserts as well.',
      { tips: [['play', 'Press Play in Try it'], ['info', 'Pull keycaps with a wire puller, straight up'], ['button', 'Accent keys (like Esc and Enter) are a nice touch']] },
    ],
    sim: {
      type: 'assembly',
      steps: [{ do: 'insert', parts: ['caps'], seconds: 1.6, text: 'Press the **keycaps** on row by row; the space bar clicks onto its stabilizer too.' }],
    },
    kit: [['1', 'Keycap set', 'Check it includes the sizes your layout needs.']],
  },

  {
    id: 'remap',
    title: 'Remap the keys',
    summary: 'Change what each key does with VIA or the QMK Configurator, and add layers.',
    icon: 'circuit',
    focus: { components: ['mcu'] },
    circuit: { parts: ALL },
    callouts: [
      { component: 'mcu', icon: 'code', title: 'Firmware', text: 'Stores your layout.' },
      { part: 'caps', icon: 'button', title: 'Any key', text: 'Can do anything.' },
    ],
    overview: [
      'The keymap lives in the keyboard’s **firmware**, not on the computer, so it follows the keyboard everywhere. If your kit supports **VIA**, open it in a browser and click a key to change it; changes save instantly. With **QMK**, build a keymap in the QMK Configurator and flash it.',
      '**Layers** give each key a second job: hold a function key and the number row becomes F1–F12, or the arrow keys appear under your right hand.',
      { tips: [['code', 'Put Backspace where Caps Lock was'], ['info', 'Macros type whole words with one key'], ['button', 'Keep one key mapped to reset, in case you lock yourself out']] },
    ],
    kit: [['–', 'Nothing extra']],
  },
];
