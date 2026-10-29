// PC build course on a typical ATX motherboard. Everything board-specific lives in this file.
//
// The board is a generic ATX layout (305 × 244 mm), top view, rear I/O on the left edge.
// Component positions are stylised and do not describe any one product. Header pinouts follow
// Intel's documented standards: front panel (2×5, pin 10 keyed), front USB 2.0 (2×5, pin 9 keyed),
// HD Audio (2×5, pin 8 keyed) and the 4-wire PWM fan header. Some vendors deviate from these,
// so the lessons tell learners to check their board's manual.

export const SITE = {
  id: 'learn-pc-build',
  title: 'PC Build: Motherboard',
  accent: '#3a6dd0',
  logicVolts: 5,
  shell: 'build log',
  terminalHint: 'Each step appears here as it plays; at power-on, the start-up self-test (POST) reports here too.',
};

export const PIN_TYPES = {
  power5: '+5 V', power12: '+12 V', gnd: 'Ground', ledpos: 'LED +', ledneg: 'LED −', switch: 'Switch (no polarity)',
  usb: 'USB data', audio: 'Audio', fan: 'Fan sense / control', nc: 'Not connected', key: 'Key: no pin',
};

const pin = (n, name, alt, type, missing) => ({ n, name, ...(alt ? { alt } : {}), type, ...(missing ? { missing: true } : {}) });
const dual = { layout: 'dual', style: 'male', pitch: 2.54, step: [2.54, 0], rowStep: [0, -2.54] };

const F_PANEL = [
  pin(1, 'HDD_LED+', 'drive activity LED +', 'ledpos'), pin(2, 'PWR_LED+', 'power LED +', 'ledpos'),
  pin(3, 'HDD_LED−', 'drive activity LED −', 'ledneg'), pin(4, 'PWR_LED−', 'power LED −', 'ledneg'),
  pin(5, 'RESET_SW', 'reset switch, ground side', 'switch'), pin(6, 'PWR_SW', 'power switch, signal side', 'switch'),
  pin(7, 'RESET_SW', 'reset switch, signal side', 'switch'), pin(8, 'PWR_SW', 'power switch, ground side', 'switch'),
  pin(9, '+5V', 'not used by most cases', 'power5'), pin(10, 'KEY', 'no pin', 'key', true),
];
const F_USB = [
  pin(1, 'VCC', '+5 V, port 1', 'power5'), pin(2, 'VCC', '+5 V, port 2', 'power5'),
  pin(3, 'D−', 'port 1', 'usb'), pin(4, 'D−', 'port 2', 'usb'), pin(5, 'D+', 'port 1', 'usb'), pin(6, 'D+', 'port 2', 'usb'),
  pin(7, 'GND', '', 'gnd'), pin(8, 'GND', '', 'gnd'), pin(9, 'KEY', 'no pin', 'key', true), pin(10, 'NC', 'not connected', 'nc'),
];
const HD_AUDIO = [
  pin(1, 'PORT1_L', 'microphone left', 'audio'), pin(2, 'GND', '', 'gnd'), pin(3, 'PORT1_R', 'microphone right', 'audio'),
  pin(4, 'PRESENCE#', 'tells the board an HD Audio panel is attached', 'audio'), pin(5, 'PORT2_R', 'headphone right', 'audio'),
  pin(6, 'SENSE1_RETURN', 'microphone jack detect', 'audio'), pin(7, 'SENSE_SEND', 'jack detect', 'audio'),
  pin(8, 'KEY', 'no pin', 'key', true), pin(9, 'PORT2_L', 'headphone left', 'audio'), pin(10, 'SENSE2_RETURN', 'headphone jack detect', 'audio'),
];
const FAN = [pin(1, 'GND', '', 'gnd'), pin(2, '+12V', '', 'power12'), pin(3, 'SENSE', 'tachometer: fan speed', 'fan'), pin(4, 'PWM', 'speed control', 'fan')];

// Small vertical labels above the even row and below the odd row of the front panel header.
const FP_X = 252;
const fpLabels = [
  ...['PLED+', 'PLED−', 'PWR', 'PWR'].map((text, i) => ({ text, x: FP_X + i * 2.54, z: 235, size: 0.95, rotate: -90 })),
  ...['HDD+', 'HDD−', 'RST', 'RST', '+5V'].map((text, i) => ({ text, x: FP_X + i * 2.54, z: 241.8, size: 0.8, align: 'center' })),
];

export const BOARD = {
  name: 'ATX motherboard',
  width: 305,
  depth: 244,
  thickness: 1.6,
  cornerRadius: 1.5,
  pcbColor: '#2a2c33',
  heightScale: 1.1,
  holes: [{ x: 6, z: 6, r: 2 }, { x: 6, z: 160, r: 2 }, { x: 6, z: 238, r: 2 }, { x: 158, z: 6, r: 2 }, { x: 158, z: 238, r: 2 }, { x: 299, z: 238, r: 2 }, { x: 299, z: 6, r: 2 }],
  silkscreen: [
    ...fpLabels,
    { text: 'F_PANEL', x: FP_X + 5, z: 229.5, size: 1.6, align: 'center' },
    { text: 'F_USB1', x: 210, z: 232, size: 1.6, align: 'center' },
    { text: 'HD_AUDIO', x: 35, z: 232, size: 1.6, align: 'center' },
    { text: 'CPU_FAN', x: 143.8, z: 16.5, size: 1.5, align: 'center' },
    { text: 'SYS_FAN1', x: 163.8, z: 233, size: 1.5, align: 'center' },
    { text: 'ATX_8P', x: 30, z: 17, size: 1.6, align: 'center' },
    { text: 'ATX_24P', x: 283, z: 90, size: 1.6, align: 'center', rotate: -90 },
    { text: 'DIMM_A1  A2  B1  B2', x: 181, z: 155, size: 1.6, align: 'center' },
    { text: 'PCIEX16_1', x: 105, z: 143.5, size: 1.6, align: 'center' },
    { text: 'PCIEX4_2', x: 105, z: 203.5, size: 1.6, align: 'center' },
    { text: 'M2_1', x: 100, z: 109, size: 1.6, align: 'center' },
    { text: 'CPU  DRAM  VGA  BOOT', x: 276, z: 30, size: 1.1, align: 'center', rotate: -90 },
    { text: 'ATX', x: 230, z: 120, size: 8, weight: 700, align: 'center' },
  ],
  smd: [{ x: 70, z: 125, w: 30, d: 6, count: 10 }, { x: 215, z: 130, w: 30, d: 20, count: 14 }, { x: 60, z: 190, w: 40, d: 20, count: 14 }, { x: 250, z: 40, w: 20, d: 30, count: 10 }],
  components: [
    { id: 'socket', kind: 'socket', label: 'CPU socket (LGA)', desc: 'Where the processor goes. Hundreds of tiny spring contacts touch the pads under the CPU: never touch them.', shape: 'box', x: 95, z: 75, w: 52, d: 58, h: 2.5, color: '#3a3d45' },
    { id: 'vrm1', kind: 'heatsink', label: 'VRM heatsink', desc: 'Covers the power stages that turn 12 V into the roughly 1 V the CPU runs on.', shape: 'box', x: 95, z: 30, w: 70, d: 14, h: 14, color: '#6f747d', fins: 'z' },
    { id: 'vrm2', kind: 'heatsink', label: 'VRM heatsink', desc: 'More CPU power stages under a heatsink.', shape: 'box', x: 34, z: 80, w: 14, d: 70, h: 14, color: '#6f747d' },
    { id: 'io', kind: 'iocluster', label: 'Rear I/O ports', desc: 'USB, network, audio and video sockets that poke through the back of the case.', shape: 'box', x: 12, z: 90, w: 24, d: 130, h: 22, color: '#3a3d45' },
    { id: 'eps', kind: 'atx', grid: [4, 2], label: '8-pin CPU power (ATX_8P)', desc: 'Extra 12 V power for the processor, from the power supply’s “CPU” cable.', shape: 'box', x: 30, z: 10, w: 17, d: 8.6, h: 9, color: '#24232b' },
    { id: 'dimm1', kind: 'slot', latches: 'both', label: 'Memory slot A1', desc: 'With two memory sticks, leave A1 and B1 empty.', shape: 'box', x: 168, z: 82, w: 6, d: 136, h: 6, color: '#2b2a33', accent: '#b8bcc4' },
    { id: 'dimm2', kind: 'slot', latches: 'both', label: 'Memory slot A2', desc: 'First stick goes here on most boards.', shape: 'box', x: 177, z: 82, w: 6, d: 136, h: 6, color: '#3a3d45', accent: '#b8bcc4' },
    { id: 'dimm3', kind: 'slot', latches: 'both', label: 'Memory slot B1', desc: 'With two memory sticks, leave A1 and B1 empty.', shape: 'box', x: 186, z: 82, w: 6, d: 136, h: 6, color: '#2b2a33', accent: '#b8bcc4' },
    { id: 'dimm4', kind: 'slot', latches: 'both', label: 'Memory slot B2', desc: 'Second stick goes here, for dual-channel memory.', shape: 'box', x: 195, z: 82, w: 6, d: 136, h: 6, color: '#3a3d45', accent: '#b8bcc4' },
    { id: 'atx24', kind: 'atx', grid: [2, 12], label: '24-pin main power (ATX_24P)', desc: 'The power supply’s biggest plug: power for everything on the board.', shape: 'box', x: 290, z: 90, w: 9, d: 52, h: 9, color: '#24232b' },
    { id: 'usb3hdr', kind: 'atx', grid: [2, 10], label: 'USB 3 front-panel header', desc: '19-pin header for the case’s front USB 3 ports.', shape: 'box', x: 290, z: 142, w: 9, d: 22, h: 8, color: '#2f62d6' },
    { id: 'pcie1', kind: 'slot', latches: 'end', label: 'PCIe x16 slot', desc: 'The top full-length slot, closest to the CPU: the graphics card goes here.', shape: 'box', x: 105, z: 150, w: 89, d: 7.5, h: 11, color: '#3a3d45', accent: '#b8bcc4' },
    { id: 'pcie2', kind: 'slot', latches: 'end', label: 'PCIe x16 slot (x4 lanes)', desc: 'Full-length but wired for fewer lanes: fine for extra cards, slower for graphics.', shape: 'box', x: 105, z: 210, w: 89, d: 7.5, h: 11, color: '#2b2a33', accent: '#b8bcc4' },
    { id: 'm2_1', kind: 'm2slot', reach: 80, label: 'M.2 socket', desc: 'For a gumstick-sized NVMe SSD. The brass standoff 80 mm away holds its far end.', shape: 'box', x: 60, z: 122, w: 6, d: 22, h: 3, color: '#24232b' },
    { id: 'chipset', kind: 'heatsink', label: 'Chipset heatsink', desc: 'Covers the chipset, which links the CPU to USB, storage and the slower slots.', shape: 'box', x: 232, z: 180, w: 46, d: 40, h: 9, color: '#6f747d' },
    { id: 'sata1', kind: 'jst', label: 'SATA ports', desc: 'For 2.5-inch SSDs and hard drives with a data cable.', shape: 'box', x: 297, z: 192, w: 9, d: 7, h: 8, color: '#24232b' },
    { id: 'sata2', kind: 'jst', label: 'SATA ports', desc: 'For 2.5-inch SSDs and hard drives with a data cable.', shape: 'box', x: 297, z: 204, w: 9, d: 7, h: 8, color: '#24232b' },
    { id: 'battery', label: 'CMOS battery (CR2032)', desc: 'Keeps the clock and BIOS settings while the PC is unplugged.', shape: 'cylinder', x: 175, z: 196, w: 20, h: 3.2, color: '#c9ced6', text: 'CR2032', textColor: 'rgba(60,60,70,0.7)' },
    { id: 'codec', kind: 'chip', label: 'Audio chip', desc: 'Turns digital sound into the analogue signals on the audio jacks.', shape: 'box', x: 28, z: 212, w: 7, d: 7, h: 0.9, color: '#2b2a33' },
    { id: 'dbgcpu', kind: 'ledsmd', accent: '#ff3b3b', label: 'Debug LED: CPU', desc: 'Stays lit if the board cannot start the processor.', shape: 'box', x: 279, z: 22, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'dbgdram', kind: 'ledsmd', accent: '#ffcf3a', label: 'Debug LED: DRAM', desc: 'Stays lit if no working memory is found.', shape: 'box', x: 279, z: 27, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'dbgvga', kind: 'ledsmd', accent: '#f4f1ea', label: 'Debug LED: VGA', desc: 'Stays lit if no graphics output is found.', shape: 'box', x: 279, z: 32, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'dbgboot', kind: 'ledsmd', accent: '#3fe06b', label: 'Debug LED: BOOT', desc: 'Stays lit if there is no drive to start from.', shape: 'box', x: 279, z: 37, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
  ],
  headers: [
    { id: 'fpanel', label: 'Front panel header (F_PANEL)', short: 'F_PANEL', desc: 'Where the case’s power button, reset button and LEDs plug in.', ...dual, x: FP_X, z: 239, pins: F_PANEL },
    { id: 'fusb', label: 'Front USB 2.0 header (F_USB1)', short: 'F_USB1', desc: 'Two USB 2.0 ports for the case front. Pin 9 is missing on purpose.', ...dual, x: 205, z: 239, pins: F_USB },
    { id: 'hdaudio', label: 'Front audio header (HD_AUDIO)', short: 'HD_AUDIO', desc: 'Headphone and microphone jacks on the case front. Pin 8 is missing on purpose.', ...dual, x: 30, z: 239, pins: HD_AUDIO },
    { id: 'cpufan', label: 'CPU fan header (CPU_FAN)', short: 'CPU_FAN', desc: '4-pin header for the CPU cooler’s fan. The board slows the fan down when the CPU is cool.', layout: 'single', style: 'male', pitch: 2.54, step: [2.54, 0], x: 140, z: 12, pins: FAN },
    { id: 'sysfan', label: 'Case fan header (SYS_FAN1)', short: 'SYS_FAN1', desc: '4-pin header for a case fan. 3-pin fans fit too, without speed control by PWM.', layout: 'single', style: 'male', pitch: 2.54, step: [2.54, 0], x: 160, z: 239, pins: FAN },
  ],
};

// ---------- parts ----------
const LID = { id: 'lid', type: 'socketlid', socket: 'socket', open: 0, label: 'Load plate and lever', desc: 'Holds the CPU down. The lever latches under a hook.' };
const CPU = { id: 'cpu', type: 'cpu', socket: 'socket', label: 'CPU', desc: 'Pads underneath, a metal heat spreader on top. The small gold triangle marks one corner.' };
const RAM_A = { id: 'ramA', type: 'dimm', slot: 'dimm2', label: 'Memory module in A2', desc: 'The notch on its gold edge only lines up one way.', color: '#2b2a33', accent: '#e05a3a' };
const RAM_B = { id: 'ramB', type: 'dimm', slot: 'dimm4', label: 'Memory module in B2', desc: 'Same kit, second stick: two sticks run in dual channel.', color: '#2b2a33', accent: '#e05a3a' };
const SSD = { id: 'ssd', type: 'm2', slot: 'm2_1', label: 'M.2 NVMe SSD', desc: 'Your system drive. It slides in at an angle and is held down by one screw.' };
const COOLER = { id: 'cooler', type: 'cooler', socket: 'socket', spin: 0, label: 'Tower CPU cooler', desc: 'Heat pipes carry heat from the base up to the fins; the fan blows it away.' };
const FANPLUG = { id: 'fanplug', type: 'plug', on: ['cpufan:1', 'cpufan:2', 'cpufan:3', 'cpufan:4'], colors: ['#2b2a30', '#e2483c', '#f2c12e', '#3b78d6'], exit: [0.2, 1], reach: 30, label: 'CPU fan plug', desc: '4 wires: ground, +12 V, speed sense and PWM control.' };
const ATX24 = { id: 'atx24plug', type: 'powerplug', connector: 'atx24', strands: 12, exit: [1, 0.15], reach: 70, label: '24-pin power plug', desc: 'Main power from the supply. The clip goes over the tab on the connector.' };
const EPS = { id: 'epsplug', type: 'powerplug', connector: 'eps', strands: 8, exit: [-0.2, -1], reach: 60, colors: ['#f2c12e', '#f2c12e', '#f2c12e', '#f2c12e', '#2b2a30', '#2b2a30', '#2b2a30', '#2b2a30'], label: '8-pin CPU power plug', desc: 'Usually labelled CPU or EPS on the power supply cable.' };
const GPU = { id: 'gpu', type: 'gpu', slot: 'pcie1', label: 'Graphics card', desc: 'Sits in the top PCIe x16 slot; its bracket screws to the back of the case.' };
const FP = { exit: [0.8, 0.6], reach: 60 };
const PWRSW = { id: 'pwrsw', type: 'plug', on: ['fpanel:6', 'fpanel:8'], colors: ['#3fae5a', '#f4f1ea'], ...FP, label: 'POWER SW', desc: 'From the case power button. A switch has no polarity: either way round works.' };
const RSTSW = { id: 'rstsw', type: 'plug', on: ['fpanel:5', 'fpanel:7'], colors: ['#3b78d6', '#f4f1ea'], ...FP, label: 'RESET SW', desc: 'From the case reset button. No polarity.' };
const PLEDP = { id: 'pledp', type: 'plug', on: ['fpanel:2'], colors: ['#e2483c'], ...FP, label: 'POWER LED +', desc: 'The power light’s positive wire, usually coloured.' };
const PLEDN = { id: 'pledn', type: 'plug', on: ['fpanel:4'], colors: ['#f4f1ea'], ...FP, label: 'POWER LED −', desc: 'The power light’s negative wire, usually white or black.' };
const HDDP = { id: 'hddp', type: 'plug', on: ['fpanel:1'], colors: ['#e3892a'], ...FP, label: 'HDD LED +', desc: 'The drive-activity light’s positive wire.' };
const HDDN = { id: 'hddn', type: 'plug', on: ['fpanel:3'], colors: ['#f4f1ea'], ...FP, label: 'HDD LED −', desc: 'The drive-activity light’s negative wire.' };
const FRONT_PLUGS = [PWRSW, RSTSW, PLEDP, PLEDN, HDDP, HDDN];
const USB2 = { id: 'usb2plug', type: 'plug', on: ['fusb:1', 'fusb:2', 'fusb:3', 'fusb:4', 'fusb:5', 'fusb:6', 'fusb:7', 'fusb:8', 'fusb:10'], colors: ['#e2483c', '#f4f1ea', '#3fae5a', '#2b2a30'], exit: [0.1, 1], reach: 45, label: 'USB 2.0 plug', desc: 'One plug for two front ports. The filled hole matches the missing pin 9.' };
const AUDIO = { id: 'audioplug', type: 'plug', on: ['hdaudio:1', 'hdaudio:2', 'hdaudio:3', 'hdaudio:4', 'hdaudio:5', 'hdaudio:6', 'hdaudio:7', 'hdaudio:9', 'hdaudio:10'], colors: ['#2b2a30', '#e2483c', '#f4f1ea', '#3fae5a'], exit: [0.1, 1], reach: 45, label: 'HD AUDIO plug', desc: 'Front headphone and microphone jacks. The filled hole matches the missing pin 8.' };
const USB3 = { id: 'usb3plug', type: 'powerplug', connector: 'usb3hdr', strands: 5, colors: ['#2f62d6', '#2f62d6', '#2f62d6', '#2f62d6', '#2f62d6'], exit: [1, 0.3], reach: 50, label: 'USB 3 plug', desc: 'Thick blue cable. Push straight in: the thin pins bend easily.' };
const PANEL = { id: 'panel', type: 'casepanel', at: { x: 350, z: 262 }, label: 'CASE FRONT', desc: 'The front of the case: power LED (green) and drive-activity LED (amber).' };
const PWRBTN = { id: 'pwrbtn', type: 'casebutton', at: { x: 338, z: 262 }, y: 58, label: 'POWER', desc: 'Press it in the 3D view. It only closes a contact between pins 6 and 8.' };
const RSTBTN = { id: 'rstbtn', type: 'casebutton', at: { x: 364, z: 262 }, y: 58, size: 6, color: '#9a958a', label: 'RESET', desc: 'Press it in the 3D view while the PC is on.' };
const CASE = [PANEL, PWRBTN, RSTBTN];

const FP_PINS = ['fpanel:1', 'fpanel:2', 'fpanel:3', 'fpanel:4', 'fpanel:5', 'fpanel:6', 'fpanel:7', 'fpanel:8'];

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the motherboard',
    summary: 'Every other part plugs into this board. Learn where each one goes before you build.',
    icon: 'board',
    focus: { components: ['socket'] },
    callouts: [
      { component: 'socket', icon: 'chip', title: 'CPU socket', text: 'The processor sits here.' },
      { component: 'dimm2', icon: 'memory', title: 'Memory slots', text: 'Four DIMM slots beside the socket.' },
      { component: 'pcie1', icon: 'plug', title: 'PCIe x16', text: 'Graphics card slot.' },
      { component: 'm2_1', icon: 'memory', title: 'M.2 socket', text: 'Fast SSD, no cables.' },
      { component: 'atx24', icon: 'power', title: '24-pin power', text: 'Main power from the PSU.' },
      { pin: 'fpanel:6', icon: 'button', title: 'Front panel header', text: 'Case buttons and LEDs.' },
    ],
    overview: [
      'A motherboard connects everything in a PC. The processor, memory, storage and graphics card plug straight into it; the power supply and the case’s buttons, lights and ports connect with cables.',
      { tips: [['target', 'Click any part of the board to see what it does'], ['rotr', 'Drag to orbit, scroll to zoom'], ['info', 'The small print on the board names every header']] },
      'Most mistakes in a first build happen at the small pin headers along the bottom edge, so this course spends extra time there.',
      { h: 'Typical ATX board' },
      { specs: [['Size', '305 × 244 mm (ATX)'], ['CPU', 'One LGA socket'], ['Memory', '4 DIMM slots, dual channel'], ['Storage', 'M.2 NVMe + SATA ports'], ['Expansion', 'PCIe x16 slots'], ['Power in', '24-pin ATX + 8-pin CPU']] },
      { note: 'Layouts differ between boards. Use this course to learn what each part is, then check your board’s manual for exact positions.' },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'ATX motherboard'], ['1', 'Its manual', 'The front panel diagram is the page you will use most.']],
  },

  {
    id: 'prep',
    title: 'Before you start',
    short: 'Prepare safely',
    summary: 'A clean, safe workspace and a few habits that prevent almost every first-build accident.',
    icon: { glyph: 'gear' },
    focus: { components: ['io', 'battery'] },
    callouts: [
      { component: 'io', icon: 'usb', title: 'Rear I/O', text: 'Lines up with the case’s back opening.' },
      { component: 'battery', icon: 'power', title: 'CMOS battery', text: 'Remove it to reset BIOS settings.' },
      { component: 'socket', icon: 'info', title: 'Leave the cover on', text: 'Until the CPU goes in.' },
    ],
    overview: [
      'Build on a large table, not on carpet. Keep the motherboard on its box or anti-static bag while you install the CPU, memory, SSD and cooler: it is much easier outside the case.',
      { steps: [
        'Unplug the power supply from the wall before touching anything inside a PC.',
        'Touch a bare metal part of the case, or wear an anti-static wrist strap, to discharge yourself.',
        'Hold boards and cards by their edges. Never touch gold contacts or socket pins.',
        'Keep the plastic cover on the CPU socket until the moment the CPU goes in.',
        'Have a magnetic-tip Phillips #2 screwdriver and a small bowl for screws.',
      ] },
      { note: 'Nothing on a PC build needs force. If a part does not fit, take it out and check how it lines up.', tone: 'warn' },
      { h: 'Order of work' },
      { steps: ['CPU', 'Memory', 'M.2 SSD', 'CPU cooler', 'Board into the case, then power and front-panel cables', 'Graphics card last'] },
    ],
    kit: [['1', 'Phillips #2 screwdriver', 'Magnetic tip helps.'], ['1', 'Anti-static wrist strap', 'Optional but recommended.'], ['1', 'Cable ties', 'For tidy cables.']],
  },

  {
    id: 'cpu',
    title: 'Install the CPU',
    summary: 'Open the socket, drop the processor in the right way round, and latch it down.',
    icon: 'circuit',
    focus: { components: ['socket'] },
    circuit: { parts: [LID, CPU] },
    callouts: [
      { part: 'cpu', icon: 'chip', title: 'CPU', text: 'Hold it by the edges only.' },
      { part: 'lid', icon: 'gear', title: 'Lever and load plate', text: 'Open fully before the CPU goes in.' },
      { component: 'socket', icon: 'target', title: 'Socket triangle', text: 'Match it with the triangle on the CPU.' },
    ],
    overview: [
      'Modern desktop CPUs have flat pads underneath; the delicate pins are in the socket. A bent socket pin is the most common expensive mistake, so the CPU only ever moves straight down.',
      { tips: [['play', 'Press Play in Try it to watch each step'], ['target', 'Look for the gold triangle on one corner'], ['info', 'The plastic cover pops off when you close the lever']] },
      { note: 'Never slide the CPU across the socket or press on it. Lower it straight in; it drops into place under its own weight.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'set', parts: ['lid'], from: { open: 0 }, to: { open: 1 }, text: 'Push the **lever** down and out from under its hook, then swing the lever and the **load plate** fully open.' },
        { do: 'insert', parts: ['cpu'], text: 'Line up the gold **triangle** on the CPU with the triangle on the socket and match the side notches. Lower it **straight down**.' },
        { do: 'set', parts: ['lid'], from: { open: 1 }, to: { open: 0 }, zoom: 'lid', text: 'Close the load plate and push the lever down under its hook. It needs firm pressure; the plastic cover pops off by itself.' },
      ],
    },
    kit: [['1', 'Desktop CPU', 'Matching the socket on your board.']],
  },

  {
    id: 'ram',
    title: 'Install the memory',
    summary: 'Pick the right two slots for dual channel and press the sticks in until the latches click.',
    icon: 'circuit',
    focus: { components: ['dimm2', 'dimm4'] },
    circuit: { parts: [LID, CPU, RAM_A, RAM_B] },
    callouts: [
      { part: 'ramA', icon: 'memory', title: 'Slot A2', text: 'First stick: second slot from the CPU.' },
      { part: 'ramB', icon: 'memory', title: 'Slot B2', text: 'Second stick: the slot furthest away.' },
      { component: 'dimm1', icon: 'info', title: 'A1 and B1', text: 'Leave empty with two sticks.' },
    ],
    overview: [
      'With two memory sticks, most boards want them in **A2** and **B2**: the second and fourth slots counting from the CPU. That runs them in **dual channel**, which is noticeably faster than putting both in one channel.',
      { tips: [['memory', 'Two sticks: slots A2 and B2'], ['target', 'The notch is off-centre: it only fits one way'], ['button', 'Push until both latches click shut']] },
      { note: 'It takes more force than most people expect. Press straight down on both ends with your thumbs; stop and re-check the notch if it will not go.' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['ramA'], text: 'Open the latches on slot **A2**. Line up the notch on the stick with the key in the slot, then press both ends down until the latches **click**.' },
        { do: 'insert', parts: ['ramB'], text: 'Do the same in slot **B2**, the slot furthest from the CPU.' },
      ],
    },
    kit: [['2', 'DDR memory sticks', 'A matched kit of two, the same generation as your board (DDR4 or DDR5).']],
  },

  {
    id: 'ssd',
    title: 'Install the M.2 SSD',
    short: 'Install the SSD',
    summary: 'Slide the SSD in at an angle, press it flat and secure it with one screw.',
    icon: 'circuit',
    focus: { components: ['m2_1'] },
    circuit: { parts: [LID, CPU, RAM_A, RAM_B, SSD] },
    callouts: [
      { part: 'ssd', icon: 'memory', title: 'NVMe SSD', text: 'Label side up.' },
      { component: 'm2_1', icon: 'plug', title: 'M.2 socket', text: 'Insert at about 30°.' },
    ],
    overview: [
      'An M.2 NVMe SSD needs no cables: power and data go through its gold edge. Many boards cover the slot with a heatsink plate; unscrew it first and peel the film off its thermal pad.',
      { tips: [['target', 'Notch in the edge lines up with the socket key'], ['memory', 'Insert at an angle, then press flat'], ['gear', 'One small screw holds the far end']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['ssd'], seconds: 1.6, text: 'Slide the SSD into the M.2 socket at about **30°**, press the far end down onto the standoff and fit the small screw. Do not overtighten.' },
      ],
    },
    kit: [['1', 'M.2 NVMe SSD (2280 size)'], ['1', 'M.2 screw', 'Usually in the motherboard box.']],
  },

  {
    id: 'cooler',
    title: 'Mount the CPU cooler',
    short: 'Mount the cooler',
    summary: 'Apply thermal paste, fit the cooler evenly, and plug its fan into CPU_FAN.',
    icon: 'circuit',
    focus: { pins: ['cpufan:1', 'cpufan:2', 'cpufan:3', 'cpufan:4'] },
    circuit: { parts: [LID, CPU, RAM_A, RAM_B, SSD, COOLER, FANPLUG] },
    callouts: [
      { part: 'cooler', icon: 'thermo', title: 'Tower cooler', text: 'Fan blows towards the rear of the case.' },
      { pin: 'cpufan:1', icon: 'plug', title: 'CPU_FAN header', text: 'The fan cable plugs in here.' },
      { part: 'fanplug', icon: 'wave', title: '4-pin plug', text: 'The plastic guide only fits one way.' },
    ],
    overview: [
      'Thermal paste fills microscopic gaps between the CPU and the cooler’s base. Too little leaves air gaps; too much just squeezes out. A pea-sized dot in the middle is enough: the cooler’s pressure spreads it.',
      { tips: [['thermo', 'Pea-sized dot of paste, no more'], ['gear', 'Tighten screws a little at a time, diagonally'], ['plug', 'Fan cable goes on CPU_FAN, not a case-fan header']] },
      { note: 'Many coolers come with paste already applied. Peel off any plastic film on the cooler base before mounting.', tone: 'warn' },
      'The board checks **CPU_FAN** at power-on. If nothing is plugged in there, many boards show a CPU fan error and pause.',
    ],
    wiring: [
      { pin: 'cpufan:1', to: 'Fan **black** wire (ground)' }, { pin: 'cpufan:2', to: 'Fan **red** wire (+12 V)' },
      { pin: 'cpufan:3', to: 'Fan **yellow** wire (speed sense)' }, { pin: 'cpufan:4', to: 'Fan **blue** wire (PWM control)' },
    ],
    wiringNotes: ['A 3-pin fan plug fits the first three pins of a 4-pin header. It still runs, but the board controls its speed by changing the voltage instead of with PWM.'],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['cooler'], seconds: 1.8, text: 'Put a **pea-sized** dot of thermal paste on the CPU. Lower the cooler straight down and tighten its screws a few turns at a time, **diagonally**.' },
        { do: 'insert', parts: ['fanplug'], pins: ['cpufan:1', 'cpufan:2', 'cpufan:3', 'cpufan:4'], text: 'Plug the fan cable onto **CPU_FAN**. The plastic guide on the header only lets the plug go on one way.' },
      ],
    },
    kit: [['1', 'CPU cooler', 'Check it supports your socket.'], ['1', 'Thermal paste', 'If the cooler has none pre-applied.']],
  },

  {
    id: 'power',
    title: 'Connect the power cables',
    short: 'Power cables',
    summary: 'Plug in the 24-pin main power and the 8-pin CPU power from the power supply.',
    icon: 'circuit',
    focus: { components: ['atx24', 'eps'] },
    circuit: { parts: [LID, CPU, RAM_A, RAM_B, SSD, ATX24, EPS] },
    callouts: [
      { part: 'atx24plug', icon: 'power', title: '24-pin plug', text: 'Press until the clip snaps over.' },
      { part: 'epsplug', icon: 'power', title: '8-pin CPU plug', text: 'Top-left corner, near the CPU.' },
      { component: 'atx24', icon: 'info', title: 'ATX_24P', text: 'The biggest connector on the board.' },
    ],
    overview: [
      'Two cables from the power supply feed the board. The **24-pin** main plug powers everything; the **8-pin CPU** plug (sometimes 4+4) feeds the processor’s power stages. A PC will not start without both.',
      { tips: [['power', 'Both plugs have a clip: push until it clicks'], ['info', 'CPU and graphics 8-pin plugs look alike but are keyed differently'], ['gear', 'Route the 8-pin cable before the board goes into a tight case']] },
      { note: 'Never force a CPU (EPS) cable into a graphics card or the other way round. The square and rounded holes are different on purpose.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['atx24plug'], text: 'Push the **24-pin** plug straight into ATX_24P until its clip snaps over the tab.' },
        { do: 'insert', parts: ['epsplug'], text: 'Push the **8-pin CPU** plug (labelled CPU or EPS) into ATX_8P at the top-left corner until it clicks.' },
      ],
    },
    kit: [['1', 'ATX power supply', 'With a 24-pin cable and at least one 8-pin CPU cable.']],
  },

  {
    id: 'fpanel',
    title: 'Wire the front panel',
    short: 'Front panel pins',
    summary: 'Connect the case’s power button, reset button and LEDs to the F_PANEL header, pin by pin.',
    icon: 'circuit',
    focus: { pins: FP_PINS },
    circuit: { parts: [...FRONT_PLUGS, ...CASE] },
    callouts: [
      { pin: 'fpanel:6', icon: 'button', title: 'PWR (6, 8)', text: 'Power switch. No polarity.' },
      { pin: 'fpanel:7', icon: 'button', title: 'RST (5, 7)', text: 'Reset switch. No polarity.' },
      { pin: 'fpanel:2', icon: 'led', title: 'PLED + / − (2, 4)', text: 'Power light. + goes on pin 2.' },
      { pin: 'fpanel:1', icon: 'led', title: 'HDD + / − (1, 3)', text: 'Drive light. + goes on pin 1.' },
      { pin: 'fpanel:10', icon: 'info', title: 'Pin 10', text: 'Missing on purpose: the key.' },
    ],
    overview: [
      'The case’s buttons and lights reach the board through tiny plugs on the **F_PANEL** header. It is the fiddliest part of a build because the plugs are small and the labels face down once they are on.',
      { tips: [['button', 'Switches (POWER, RESET) have no + or −'], ['led', 'LEDs only light the right way round'], ['play', 'Press Play in Try it to place each plug']] },
      { h: 'The standard layout' },
      { specs: [['Pins 1 + 3', 'HDD LED: + on 1, − on 3'], ['Pins 2 + 4', 'Power LED: + on 2, − on 4'], ['Pins 5 + 7', 'Reset switch'], ['Pins 6 + 8', 'Power switch'], ['Pin 9', '+5 V, usually unused'], ['Pin 10', 'No pin: the key']] },
      { note: 'This is Intel’s standard layout and most boards follow it, but some brands use their own. Always check the front-panel diagram in your board’s manual.', tone: 'warn' },
      'On the case cables, the **+** wire is usually coloured and the **−** wire white or black. Many plugs also have a tiny triangle or "+" on the plastic.',
    ],
    wiring: [
      { pin: 'fpanel:1', to: '**HDD LED +** (coloured wire)' }, { pin: 'fpanel:2', to: '**POWER LED +** (coloured wire)' },
      { pin: 'fpanel:3', to: '**HDD LED −** (white or black wire)' }, { pin: 'fpanel:4', to: '**POWER LED −** (white or black wire)' },
      { pin: 'fpanel:5', to: '**RESET SW**, either wire' }, { pin: 'fpanel:6', to: '**POWER SW**, either wire' },
      { pin: 'fpanel:7', to: '**RESET SW**, the other wire' }, { pin: 'fpanel:8', to: '**POWER SW**, the other wire' },
    ],
    wiringNotes: ['If the PC does not start, check POWER SW first: being one pin off is the most common reason. If a light stays dark, flip its plug around: LEDs only work one way.'],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['pwrsw'], pins: ['fpanel:6', 'fpanel:8'], text: '**POWER SW** onto pins **6 and 8**. A switch has no polarity: either way round works.' },
        { do: 'insert', parts: ['rstsw'], pins: ['fpanel:5', 'fpanel:7'], text: '**RESET SW** onto pins **5 and 7**, right next to it. Again, either way round.' },
        { do: 'insert', parts: ['pledp'], pins: ['fpanel:2'], text: '**POWER LED +** (the coloured wire) onto pin **2**.' },
        { do: 'insert', parts: ['pledn'], pins: ['fpanel:4'], text: '**POWER LED −** (white or black) onto pin **4**.' },
        { do: 'insert', parts: ['hddp'], pins: ['fpanel:1'], text: '**HDD LED +** onto pin **1**, in the row nearer the board edge.' },
        { do: 'insert', parts: ['hddn'], pins: ['fpanel:3'], text: '**HDD LED −** onto pin **3**. Pin 9 stays empty and pin 10 has no pin at all.' },
      ],
      done: 'All six front-panel plugs are on. Next: try the buttons in the last lessons.',
    },
    kit: [['1', 'Case front-panel cables', 'POWER SW, RESET SW, POWER LED +/−, HDD LED +/−.'], ['1', 'Flashlight', 'The labels are tiny.']],
  },

  {
    id: 'usb-audio',
    title: 'Front USB and audio',
    short: 'USB and audio',
    summary: 'Plug the case’s USB and headphone cables into their keyed headers.',
    icon: 'circuit',
    focus: { pins: ['fusb:1', 'fusb:3', 'fusb:5', 'fusb:7', 'fusb:9', 'hdaudio:1', 'hdaudio:5', 'hdaudio:8', 'hdaudio:9'] },
    circuit: { parts: [USB2, AUDIO, USB3] },
    callouts: [
      { pin: 'fusb:9', icon: 'usb', title: 'F_USB1, pin 9', text: 'Missing pin = the key.' },
      { pin: 'hdaudio:8', icon: 'sound', title: 'HD_AUDIO, pin 8', text: 'Missing pin = the key.' },
      { part: 'usb3plug', icon: 'usb', title: 'USB 3 header', text: 'Blue 19-pin plug, push straight in.' },
    ],
    overview: [
      'USB 2.0 and audio headers look almost the same: two rows of five, with one pin left out. The **missing pin** is the key. The case plug has a filled-in hole in the same place, so it only fits one way round and on the right header.',
      { tips: [['usb', 'USB 2.0: pin 9 is missing'], ['sound', 'HD Audio: pin 8 is missing'], ['info', 'Never force a plug: wrong header or wrong way round']] },
      { note: 'An audio plug forced onto a USB header can short +5 V to ground and damage the board or the front ports.', tone: 'warn' },
      'The **USB 3** cable is thick and blue with a 19-pin plug. Push it straight in; its thin pins bend if you rock it.',
    ],
    wiring: [
      { pin: 'fusb:1', to: '+5 V for front port 1' }, { pin: 'fusb:3', to: 'Port 1 data −' }, { pin: 'fusb:5', to: 'Port 1 data +' }, { pin: 'fusb:7', to: 'Ground' },
      { pin: 'hdaudio:1', to: 'Microphone left' }, { pin: 'hdaudio:5', to: 'Headphone right' }, { pin: 'hdaudio:9', to: 'Headphone left' },
    ],
    wiringNotes: ['If the front headphone jack is silent, check that the plug says **HD AUDIO**. Older AC’97 plugs fit the same header but need a BIOS setting.'],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['usb2plug'], pins: ['fusb:9'], text: 'Line up the plug’s filled hole with the **missing pin 9** on **F_USB1** and push it down.' },
        { do: 'insert', parts: ['audioplug'], pins: ['hdaudio:8'], text: 'Line up the **HD AUDIO** plug’s filled hole with the **missing pin 8** and push it down.' },
        { do: 'insert', parts: ['usb3plug'], text: 'Push the blue **USB 3** plug straight into its header. Its notch only fits one way.' },
      ],
    },
    kit: [['1', 'Case front-panel USB and audio cables']],
  },

  {
    id: 'gpu',
    title: 'Install the graphics card',
    short: 'Graphics card',
    summary: 'Seat the card in the top PCIe x16 slot, screw its bracket, and give it power.',
    icon: 'circuit',
    focus: { components: ['pcie1'] },
    circuit: { parts: [LID, CPU, RAM_A, RAM_B, SSD, GPU] },
    callouts: [
      { part: 'gpu', icon: 'chip', title: 'Graphics card', text: 'Press until the slot latch clicks.' },
      { component: 'pcie1', icon: 'plug', title: 'PCIEX16_1', text: 'The top slot, nearest the CPU.' },
      { component: 'pcie2', icon: 'info', title: 'Second x16 slot', text: 'Fewer lanes: not for the main card.' },
    ],
    overview: [
      'The graphics card goes in last: it is big and gets in the way of everything else. Use the top full-length slot, which has the full 16 PCIe lanes.',
      { tips: [['target', 'Top x16 slot, nearest the CPU'], ['button', 'Press until the latch at the end clicks'], ['power', 'Plug in every power connector the card has']] },
      { steps: ['Remove the case’s slot covers in line with the slot (usually two).', 'Open the latch at the end of the slot.', 'Line the card up and press it straight down until the latch clicks.', 'Screw the card’s bracket to the case.', 'Connect the graphics power cable(s) from the power supply.'] },
      { note: 'Connect your monitor to the graphics card’s ports, not the motherboard’s, or you may see a black screen.' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['gpu'], seconds: 1.8, text: 'Line the card up with **PCIEX16_1** and press it straight down until the latch **clicks**. Then screw its bracket to the case and plug in its power cable.' },
      ],
    },
    kit: [['1', 'Graphics card'], ['1', 'PCIe power cable', 'From the power supply; some cards need two.']],
  },

  {
    id: 'boot',
    title: 'First power-on',
    short: 'Power on',
    summary: 'Press the case power button and see what the front-panel pins actually do.',
    icon: 'circuit',
    focus: { pins: ['fpanel:6', 'fpanel:8'] },
    circuit: { parts: [LID, CPU, RAM_A, RAM_B, SSD, COOLER, FANPLUG, ATX24, EPS, ...FRONT_PLUGS, ...CASE] },
    callouts: [
      { part: 'pwrbtn', icon: 'button', title: 'Power button', text: 'Press it here in the 3D view.' },
      { part: 'rstbtn', icon: 'button', title: 'Reset button', text: 'Restarts without cutting power.' },
      { part: 'panel', icon: 'led', title: 'Case LEDs', text: 'Green power, amber drive activity.' },
      { component: 'dbgdram', icon: 'info', title: 'Debug LEDs', text: 'Show where start-up stopped.' },
    ],
    overview: [
      'The power button is only a switch. Pressing it connects pin 6 to pin 8 for a moment; the board notices and tells the power supply to switch on. That is why the switch has no polarity and why a PC can be started by touching those two pins with a screwdriver.',
      { tips: [['button', 'Click and hold the POWER button in the 3D view'], ['led', 'Watch the case LEDs and the cooler fan'], ['clock', 'Hold POWER for 4 s to force the PC off']] },
      'At power-on the board runs a **POST** (power-on self-test): it checks the CPU, memory and graphics, then looks for a drive to start from. If something fails, a **debug LED** near the 24-pin connector stays lit: CPU, DRAM, VGA or BOOT.',
      { h: 'If nothing happens' },
      { steps: ['Is the power supply switched on at the back, and the wall socket on?', 'Are both the 24-pin and 8-pin CPU plugs fully clicked in?', 'Is POWER SW on pins 6 and 8? Being one pin off is the usual mistake.', 'DRAM light stays on? Re-seat the memory until both latches click.'] },
    ],
    sim: {
      type: 'boot', power: 'pwrbtn', reset: 'rstbtn', panel: 'panel', fans: ['cooler'],
      powerPins: ['fpanel:6', 'fpanel:8'], resetPins: ['fpanel:5', 'fpanel:7'],
      post: ['Power supply on: +12 V, +5 V and +3.3 V present', 'CPU check: OK', 'Memory check: OK, 2 modules in dual channel', 'Graphics check: OK', 'Drive found: NVMe SSD', 'Starting the operating system…'],
    },
    kit: [['1', 'Monitor, keyboard and power cord']],
  },

  {
    id: 'teardown',
    title: 'Take it apart',
    short: 'Disassemble',
    summary: 'Remove everything in the reverse order, safely, without bending a pin or cracking a slot.',
    icon: 'circuit',
    focus: { components: ['socket'] },
    circuit: { parts: [LID, CPU, RAM_A, RAM_B, SSD, COOLER, FANPLUG, ATX24, EPS, GPU, ...FRONT_PLUGS] },
    callouts: [
      { part: 'gpu', icon: 'chip', title: 'Graphics card first', text: 'Press the slot latch before pulling.' },
      { part: 'cooler', icon: 'thermo', title: 'Twist the cooler', text: 'Breaks the thermal-paste seal.' },
      { part: 'atx24plug', icon: 'power', title: 'Squeeze the clip', text: 'Then pull the plug, not the wires.' },
    ],
    overview: [
      'Disassembly is the build in reverse. The two places people break things are the graphics card latch and a CPU stuck to the cooler by dried paste.',
      { tips: [['power', 'Switch off and unplug first; press POWER once to drain'], ['thermo', 'Twist the cooler gently before lifting'], ['play', 'Press Play in Try it to watch the order']] },
      { note: 'Pull plugs by their plastic housings, never by the wires. Squeeze the clip on the 24-pin, 8-pin and graphics plugs first.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      mode: 'disassemble',
      steps: [
        { do: 'remove', parts: ['gpu'], text: 'Unscrew the card’s bracket, press the latch at the end of the slot, and lift the **graphics card** straight out.' },
        { do: 'remove', parts: ['pwrsw', 'rstsw', 'pledp', 'pledn', 'hddp', 'hddn'], zoom: 'pwrsw', text: 'Pull the **front-panel** plugs off one at a time. A photo first makes rebuilding easier.' },
        { do: 'remove', parts: ['atx24plug', 'epsplug'], zoom: 'atx24plug', text: 'Squeeze the clips and pull the **24-pin** and **8-pin** power plugs straight out.' },
        { do: 'remove', parts: ['fanplug'], text: 'Unplug the fan cable from **CPU_FAN**.' },
        { do: 'remove', parts: ['cooler'], seconds: 1.6, text: 'Loosen the cooler screws diagonally, **twist** the cooler slightly to break the paste seal, then lift it off.' },
        { do: 'remove', parts: ['ramA', 'ramB'], zoom: 'ramA', text: 'Push the latches open; the **memory** sticks pop up. Lift them out.' },
        { do: 'remove', parts: ['ssd'], text: 'Remove the screw; the **SSD** springs up to an angle. Slide it out.' },
        { do: 'set', parts: ['lid'], from: { open: 0 }, to: { open: 1 }, text: 'Release the **lever** and open the load plate.' },
        { do: 'remove', parts: ['cpu'], text: 'Lift the **CPU** straight up by its edges. Wipe old paste off with isopropyl alcohol.' },
        { do: 'set', parts: ['lid'], from: { open: 1 }, to: { open: 0 }, text: 'Close the plate and fit the **socket cover** back on to protect the pins.' },
      ],
      done: 'Everything is out. Store the CPU and memory in anti-static bags.',
    },
    kit: [['1', 'Isopropyl alcohol and a lint-free cloth', 'To clean off old thermal paste.'], ['Several', 'Anti-static bags']],
  },
];
