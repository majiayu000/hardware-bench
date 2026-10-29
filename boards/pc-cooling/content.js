// Everything specific to this course lives in this file: site metadata, the parts and the lessons.
// The case model is shared with the PC build course.
// Sources: Intel and AMD socket mounting notes, typical AIO cooler manuals (Arctic, Corsair, NZXT),
// the Intel 4-wire PWM fan specification, and motherboard manuals for fan and RGB headers.
import { BOARD as CASE, PIN_TYPES as CASE_PIN_TYPES } from '../pc-build/content.js';

export const SITE = {
  id: 'learn-pc-cooling',
  title: 'PC Cooling: Liquid Cooler, Fans and RGB',
  accent: '#2aa7c9',
  logicVolts: 12,
  shell: 'hardware monitor',
  terminalHint: 'Each step appears here as it plays; sensor readings appear here too.',
};

export const PIN_TYPES = CASE_PIN_TYPES;
export const BOARD = CASE;

// ---------- parts ----------
// Positions use the case model: front of the case at x = 0, top edge at z = 0, the tray 440 × 460 mm.
// The radiator is a typical 240 mm unit (275 × 120 × 27 mm) mounted under the top panel.
const PSU = { id: 'psu', type: 'block', at: { x: 345, z: 410 }, w: 150, d: 86, h: 140, y: 6, color: '#24252b', text: 'PSU', label: 'Power supply (ATX)', desc: 'Its fan cable is internal: it controls itself.' };
const MOBO = { id: 'mobo', type: 'block', at: { x: 280, z: 160 }, w: 305, d: 244, h: 2, y: 7, color: '#1e2126', text: 'ATX', label: 'Motherboard', desc: 'Has the fan headers (CPU_FAN, AIO_PUMP, SYS_FAN) and the lighting headers along its edges.',
  boxes: [{ x: 70, z: -50, w: 6, d: 135, h: 34, color: '#2b2a33' }, { x: 80, z: -50, w: 6, d: 135, h: 34, color: '#2b2a33' }, { x: 60, z: 70, w: 46, d: 40, h: 9, color: '#6f747d' }] };
const GPU = { id: 'gpu', type: 'block', at: { x: 270, z: 255 }, w: 270, d: 42, h: 115, y: 9, color: '#2a2b31', text: 'GPU', label: 'Graphics card', desc: 'Has its own fans; the case fans feed it cool air.', boxes: [{ x: 0, z: 0, w: 250, d: 30, h: 3, color: '#3a6dd0' }] };
const PUMP = { id: 'pump', type: 'block', at: { x: 260, z: 110 }, w: 62, d: 62, h: 40, y: 9, color: '#1d1e24', insert: [0, 80, 0], text: 'PUMP', label: 'Pump block', desc: 'Sits on the CPU. Its copper base comes with thermal paste already on it, under a plastic film.', round: 0.25 };
const TUBES = { id: 'tubes', type: 'block', at: { x: 254, z: 64 }, w: 9, d: 30, h: 9, y: 36, color: '#16171c', round: 0.45, insert: [0, 80, 0], label: 'Coolant tubes', desc: 'Sealed rubber hoses: one carries warm coolant to the radiator, the other brings it back. Never bend them sharply.',
  boxes: [{ x: 14, y: -9, w: 9, d: 30, h: 9, color: '#16171c', round: 0.45 }] };
const RAD = { id: 'rad', type: 'block', at: { x: 250, z: 30 }, w: 275, d: 27, h: 120, y: 44, color: '#2b2d33', insert: [0, 120, 0], text: '240 mm', label: 'Radiator', desc: 'Thin metal fins that pass the heat from the coolant to the air the fans push through them.',
  boxes: [{ x: -146, y: -120, w: 18, d: 30, h: 120, color: '#1d1e24' }, { x: 146, y: -120, w: 18, d: 30, h: 120, color: '#1d1e24' }] };
const RFAN1 = { id: 'rfan1', type: 'fan', at: { x: 190, z: 57 }, y: 44, facing: '-z', rgb: true, insert: [0, 120, 0], label: 'Radiator fan', desc: 'Pushes air up through the radiator and out of the top of the case.' };
const RFAN2 = { id: 'rfan2', type: 'fan', at: { x: 310, z: 57 }, y: 44, facing: '-z', rgb: true, insert: [0, 120, 0], label: 'Radiator fan', desc: 'The second radiator fan, same direction as the first.' };
const FAN1 = { id: 'fan1', type: 'fan', at: { x: 24, z: 150 }, facing: 'x', rgb: true, label: 'Front fan (intake)', desc: 'Pulls cool air in through the front.' };
const FAN2 = { id: 'fan2', type: 'fan', at: { x: 24, z: 290 }, facing: 'x', rgb: true, label: 'Front fan (intake)', desc: 'A second intake fan below the first.' };
const FAN3 = { id: 'fan3', type: 'fan', at: { x: 410, z: 110 }, facing: 'x', label: 'Rear fan (exhaust)', desc: 'Pushes warm air out at the back.' };
const BASE = [PSU, MOBO, GPU];
const AIO = [PUMP, TUBES, RAD, RFAN1, RFAN2];
const CASE_FANS = [FAN1, FAN2, FAN3];
const RGB_FANS = ['rfan1', 'rfan2', 'fan1', 'fan2'];
const colors = (c) => Object.fromEntries(RGB_FANS.map((id, i) => [id, { color: Array.isArray(c) ? c[i] : c }]));
const spins = (cpu, sys) => ({ rfan1: { spin: cpu }, rfan2: { spin: cpu }, fan1: { spin: sys }, fan2: { spin: sys }, fan3: { spin: sys } });

export const LESSONS = [
  {
    id: 'aio',
    title: 'How a liquid cooler works',
    short: 'Liquid cooling',
    summary: 'An all-in-one (AIO) cooler moves the CPU’s heat through a sealed loop to a radiator, where fans blow it out of the case.',
    icon: 'circuit',
    focus: { components: ['top'] },
    circuit: { parts: [...BASE, ...AIO, ...CASE_FANS] },
    callouts: [
      { part: 'pump', icon: 'chip', title: 'Pump block', text: 'Takes heat from the CPU.' },
      { part: 'tubes', icon: 'wave', title: 'Tubes', text: 'Coolant out and back.' },
      { part: 'rad', icon: 'thermo', title: 'Radiator', text: 'Hands the heat to the air.' },
      { part: 'rfan1', icon: 'wifi', title: 'Radiator fans', text: 'Blow out through the top.' },
    ],
    overview: [
      'An air cooler carries heat up copper pipes into a tall block of fins right above the CPU. An **AIO** (all-in-one) liquid cooler moves the fins away: a pump on the CPU pushes coolant through two tubes to a **radiator**, and fans on the radiator blow the heat out of the case.',
      'The loop is filled and sealed at the factory, so there is nothing to fill or top up. It mostly helps with hot CPUs and small or crowded cases, and frees space around the memory.',
      { h: 'Where the radiator goes' },
      'At the **top as exhaust** is the usual choice: the warm air leaves the case straight away. The **front as intake** also works and gives the radiator the coolest air, but then the CPU’s heat blows across the graphics card.',
      { note: 'A little air always hides in the loop and rises to the highest point. Keep that point in the **radiator**, never in the pump: mount the radiator higher than the pump, and with a front radiator put the tubes at the bottom.', tone: 'warn' },
      { tips: [['ruler', 'Check the case supports 240, 280 or 360 mm at the top'], ['memory', 'Tall memory can hit top-mounted fans'], ['clock', 'AIOs usually last five to seven years']] },
    ],
    kit: [['1', '240 mm AIO liquid cooler', 'Comes with the fans, the brackets for your socket and pre-applied paste.'], ['1', 'Screwdriver (Phillips #2)']],
  },

  {
    id: 'install',
    title: 'Install the AIO',
    summary: 'Mount the radiator and its fans at the top, then the pump on the CPU, and connect the pump and fans.',
    icon: 'circuit',
    focus: { components: ['top'] },
    circuit: { parts: [...BASE, ...AIO, ...CASE_FANS] },
    callouts: [
      { part: 'rad', icon: 'thermo', title: 'Radiator first', text: 'Easier before the pump is fixed.' },
      { part: 'pump', icon: 'chip', title: 'Pump', text: 'Peel the film off its base!' },
      { part: 'rfan1', icon: 'wifi', title: 'Fans', text: 'Label side towards the radiator.' },
    ],
    overview: [
      { steps: [
        'Fit the **backplate and standoffs** for your socket, following the manual (Intel and AMD use different parts).',
        'Screw the **fans onto the radiator**, airflow arrows pointing through the radiator and out of the case.',
        'Hold the radiator under the top panel, tubes towards the front, and screw it in from outside.',
        '**Peel the plastic film** off the pump’s copper base. The thermal paste is already on it.',
        'Lower the pump onto the CPU and tighten its four screws a little at a time, in a cross pattern, until they stop.',
        'Plug the **pump** into AIO_PUMP (or CPU_FAN) and the **fans** into CPU_FAN, using the splitter that comes with the cooler.',
      ] },
      { note: 'Forgetting the plastic film is the classic AIO mistake: the CPU overheats within minutes. Check it twice.', tone: 'warn' },
      { tips: [['play', 'Press Play in Try it'], ['info', 'Turn the pump so its logo reads the right way up before tightening'], ['wave', 'Tubes should curve gently, not kink']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['rad'], text: 'Mount the **radiator** under the top panel, tubes towards the front.' },
        { do: 'insert', parts: ['rfan1', 'rfan2'], text: 'Screw the **two fans** to the radiator, blowing up and out of the case.' },
        { do: 'insert', parts: ['pump'], text: '**Peel the film**, then seat the **pump** on the CPU; tighten the screws in a cross pattern.' },
        { do: 'insert', parts: ['tubes'], text: 'Check the **tubes** run without kinks and do not press on the memory.' },
      ],
    },
    kit: [['1', 'AIO cooler with its mounting kit'], ['8', 'Long radiator screws', 'In the box: they pass through the fans into the radiator.']],
  },

  {
    id: 'fans',
    title: 'Fan headers and fan curves',
    short: 'Fan control',
    summary: 'Plug each fan into the right header and let the BIOS speed them up only when the CPU gets warm.',
    icon: 'circuit',
    focus: { components: ['front', 'rear', 'top'] },
    circuit: { parts: [...BASE, ...AIO, ...CASE_FANS] },
    callouts: [
      { part: 'rfan1', icon: 'wifi', title: 'CPU_FAN', text: 'Radiator fans follow the CPU temperature.' },
      { part: 'fan1', icon: 'wifi', title: 'SYS_FAN', text: 'Case fans follow the system.' },
      { part: 'pump', icon: 'chip', title: 'AIO_PUMP', text: 'Pump at full, steady speed.' },
    ],
    overview: [
      'Fan headers on the motherboard come in two kinds. **3-pin** headers (12 V, GND, speed sense) control speed by lowering the voltage. **4-pin PWM** headers keep 12 V on and add a control wire that switches the motor on and off thousands of times a second, which works down to lower speeds. A 3-pin fan fits a 4-pin header, and the other way round.',
      'In the BIOS each header gets a **fan curve**: a temperature–speed graph. Quiet at the desktop, louder only under load.',
      { tips: [['thermo', 'Base the radiator fans on the CPU temperature'], ['clock', 'Run the pump at a fixed 100 %'], ['power', 'A header supplies about 1 A: check before splitting to many fans']] },
      { note: 'If the pump is on CPU_FAN, set that header to full speed. Some boards refuse to start without a reading on CPU_FAN, so plug something into it.', tone: 'warn' },
    ],
    sim: {
      type: 'sequence', caption: 'Press Run: the CPU warms up under a game and the fan curve follows.', rest: spins(0, 0),
      steps: [
        { set: spins(0.3, 0.25), ms: 1800, log: 'CPU 38 °C  CPU_FAN 620 RPM  SYS_FAN 540 RPM  pump 2700 RPM', trace: 'idle' },
        { set: spins(0.6, 0.4), ms: 1800, log: 'CPU 62 °C  CPU_FAN 1150 RPM  SYS_FAN 800 RPM  pump 2700 RPM', trace: 'warm' },
        { set: spins(1, 0.7), ms: 1800, log: 'CPU 78 °C  CPU_FAN 1800 RPM  SYS_FAN 1250 RPM  pump 2700 RPM', trace: 'hot' },
        { set: spins(0.35, 0.3), ms: 1800, log: 'CPU 41 °C  CPU_FAN 680 RPM  SYS_FAN 560 RPM  pump 2700 RPM', trace: 'idle' },
      ],
    },
    code: [{ file: 'fan-curve.txt', lang: 'text', trace: { idle: 3, warm: 4, hot: 5 }, source: `
BIOS → Hardware Monitor → CPU_FAN (radiator fans)
  CPU temperature   fan speed
  up to 40 °C       30 %
  60 °C             50 %
  75 °C and above   100 %
AIO_PUMP: full speed (100 %, no curve)
SYS_FAN (case fans): 25 % up to 50 °C, 70 % at 80 °C
` }],
    run: { cmd: 'watch -n 1 sensors', stop: [] },
    kit: [['1', 'Fan splitter cable', 'Often included with the cooler.']],
  },

  {
    id: 'rgb',
    title: 'RGB and ARGB lighting',
    short: 'RGB lighting',
    summary: 'Tell the 12 V RGB plug from the 5 V addressable one before you plug in: the wrong header destroys the LEDs.',
    icon: 'circuit',
    focus: { components: ['front', 'top'] },
    circuit: { parts: [...BASE, ...AIO, ...CASE_FANS] },
    callouts: [
      { part: 'rfan1', icon: 'led', title: 'ARGB fans', text: 'Each LED its own colour.' },
      { part: 'fan1', icon: 'led', title: 'Daisy-chained', text: 'One fan’s plug into the next.' },
      { part: 'mobo', icon: 'plug', title: 'Headers', text: 'ARGB 5 V or RGB 12 V.' },
    ],
    overview: [
      'Lit fans use one of two systems, and their plugs look alike:',
      { specs: [['RGB (12 V)', '4 pins: 12V, G, R, B. Every LED shows the same colour.'], ['ARGB (5 V)', '3 wires in a 4-pin space with one gap: 5V, D (data), GND. Each LED can show its own colour.']] },
      'Motherboards label them **RGB_HEADER** or **JRGB** (12 V) and **ARGB**, **ADD_HEADER** or **JRAINBOW** (5 V). The ARGB plug has a blocked hole so it only fits one way.',
      { note: 'Never plug a 5 V ARGB device into a 12 V RGB header. The extra voltage burns out the LEDs at once, and it is not covered by warranty.', tone: 'warn' },
      { tips: [['led', 'Most fans pass the data on: chain them, then one plug to the board'], ['code', 'Set the colours in the BIOS, the board’s app or OpenRGB'], ['power', 'Lighting and fan speed use separate cables']] },
    ],
    sim: {
      type: 'sequence', caption: 'Press Run: the addressable fans change colour, then each one shows its own.', rest: colors(null),
      steps: [
        { set: colors('#2f8bff'), ms: 1500, log: 'All fans: blue (2F8BFF)', trace: 'data' },
        { set: colors('#ff3b6b'), ms: 1500, log: 'All fans: pink (FF3B6B)', trace: 'data' },
        { set: colors(['#ff3b3b', '#ffb02e', '#3fe06b', '#2f8bff']), ms: 2000, log: 'Each fan its own colour: red, amber, green, blue', trace: 'data' },
        { set: colors(['#2f8bff', '#ff3b3b', '#ffb02e', '#3fe06b']), ms: 1000, trace: 'data' },
        { set: colors(['#3fe06b', '#2f8bff', '#ff3b3b', '#ffb02e']), ms: 1000, trace: 'data' },
      ],
    },
    code: [{ file: 'headers.txt', lang: 'text', trace: { data: 9 }, source: `
RGB header (12 V)        4 pins, all LEDs one colour
  1  +12V
  2  G
  3  R
  4  B

ARGB header (5 V)        3 pins and a gap, each LED its own colour
  1  +5V
  2  D (data)
  3  (no pin: the plug's blocked hole goes here)
  4  GND
` }],
    run: { cmd: 'openrgb --mode static --color 2F8BFF', stop: [] },
    kit: [['1', 'ARGB fans or an ARGB hub', 'Check the plug: 3 wires is ARGB, 4 is RGB.']],
  },
];
