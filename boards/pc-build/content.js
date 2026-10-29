// Everything specific to this course lives in this file: site metadata, the 3D model and the
// lessons. The engine (app.js, board3d.js, sims) is generic.

export const SITE = {
  id: 'learn-pc-build-full',
  title: 'PC Build: From Parts to First Boot',
  accent: '#3a6dd0',
  logicVolts: 12,
  shell: 'build log',
  terminalHint: 'Each step appears here as it plays; at power-on the start-up self-test (POST) reports here too.',
};

export const PIN_TYPES = {};

// A generic ATX mid-tower case lying on its side, side panel off, seen from above: millimetres,
// the front of the case on the left (x = 0) and the rear on the right, the top edge at the back
// (z = 0) and the floor at the front. The tray is 440 × 460 mm. The motherboard is a standard ATX
// board (305 × 244 mm) with its rear edge against the I/O opening. Sizes are typical for the
// class of part and stylised: real cases, coolers and graphics cards vary, so check your own.
const MOBO = { x: 280, z: 160 };       // motherboard centre on the tray
export const BOARD = {
  name: 'Mid-tower case',
  width: 440,
  depth: 460,
  thickness: 2,
  cornerRadius: 4,
  pcbColor: '#3a3d45',
  heightScale: 1,
  holes: [],
  silkscreen: [{ text: 'MOTHERBOARD TRAY', x: 120, z: 330, size: 9, align: 'center' }],
  components: [
    { id: 'rear', label: 'Rear wall', desc: 'Holds the I/O opening, the rear fan and the expansion-slot covers. Cables to your monitor and the wall plug in here.', shape: 'box', x: 436, z: 230, w: 8, d: 460, h: 165, color: '#2b2d33' },
    { id: 'front', label: 'Front wall', desc: 'Behind the front panel: room for two or three intake fans.', shape: 'box', x: 4, z: 230, w: 8, d: 460, h: 165, color: '#2b2d33' },
    { id: 'top', label: 'Top of the case', desc: 'Usually has vents or room for exhaust fans and a radiator.', shape: 'box', x: 220, z: 4, w: 432, d: 8, h: 165, color: '#2b2d33' },
    { id: 'floor', label: 'Bottom of the case', desc: 'The power supply sits here, near the back, often under a cover called the shroud.', shape: 'box', x: 220, z: 456, w: 432, d: 8, h: 165, color: '#2b2d33' },
    { id: 'shroud', label: 'PSU shroud', desc: 'A cover that hides the power supply and spare cables.', shape: 'box', x: 120, z: 410, w: 230, d: 84, h: 90, color: '#33363d' },
    { id: 'standoffs', label: 'Motherboard standoffs', desc: 'Brass posts that hold the board off the metal tray. Only use the ones that line up with the board’s holes: an extra one can short the board.', shape: 'box', x: MOBO.x, z: MOBO.z, w: 300, d: 238, h: 0.6, color: '#3a3d45' },
    { id: 'grommet1', label: 'Cable grommets', desc: 'Rubber-edged holes that let cables pass to the back of the tray and come out right next to their connector.', shape: 'box', x: 112, z: 120, w: 14, d: 70, h: 1.4, color: '#141518' },
    { id: 'grommet2', label: 'Cable grommet (top)', desc: 'Behind here the CPU power cable reaches the top corner of the board.', shape: 'box', x: 200, z: 22, w: 60, d: 12, h: 1.4, color: '#141518' },
    { id: 'slots', label: 'Expansion slot covers', desc: 'Metal plates at the rear. Remove the ones in front of your graphics card’s ports.', shape: 'box', x: 432, z: 300, w: 4, d: 120, h: 30, color: '#9aa0a8' },
  ],
  headers: [],
};

// ---------- parts ----------
const PSU = { id: 'psu', type: 'block', at: { x: 345, z: 410 }, w: 150, d: 86, h: 140, y: 6, color: '#24252b', insert: [150, 0, 0], text: 'PSU', label: 'Power supply (ATX)', desc: 'Turns mains power into the 12 V, 5 V and 3.3 V the parts need. Fan facing the floor vent if there is one.', boxes: [{ x: -40, z: 0, w: 50, d: 60, h: 2, color: '#14151a' }] };
const IOSHIELD = { id: 'ioshield', type: 'block', at: { x: 430, z: MOBO.z - 50 }, w: 3, d: 160, h: 46, y: 8, color: '#b8bcc4', insert: [80, 0, 0], label: 'I/O shield', desc: 'The metal plate around the rear ports. Many boards have it built in; if yours is loose, press it in from inside before the board goes in.' };
const MOTHERBOARD = {
  id: 'mobo', type: 'block', at: MOBO, w: 305, d: 244, h: 2, y: 7, color: '#1e2126', insert: [0, 120, 0], text: 'ATX', label: 'Motherboard (with CPU, cooler and memory)', desc: 'Build the CPU, memory, SSD and cooler onto the board outside the case first (see the motherboard course), then lower it in.',
  boxes: [
    { x: -20, z: -50, w: 125, d: 75, h: 150, color: '#c9ced6', text: 'COOLER', textColor: '#3a3d45' },
    { x: 70, z: -50, w: 6, d: 135, h: 34, color: '#2b2a33' }, { x: 80, z: -50, w: 6, d: 135, h: 34, color: '#2b2a33' },
    { x: 140, z: -70, w: 24, d: 100, h: 40, color: '#3a3d45' },
    { x: 60, z: 70, w: 46, d: 40, h: 9, color: '#6f747d' },
  ],
};
const GPU = { id: 'gpu', type: 'block', at: { x: 270, z: 255 }, w: 270, d: 42, h: 115, y: 9, color: '#2a2b31', insert: [0, 120, 0], text: 'GPU', label: 'Graphics card', desc: 'Goes in the top full-length PCIe x16 slot, ports facing the rear. Check its length against the case’s limit before you buy.', boxes: [{ x: 0, z: 0, w: 250, d: 30, h: 3, color: '#3a6dd0' }] };
const FAN1 = { id: 'fan1', type: 'fan', at: { x: 24, z: 130 }, facing: 'x', label: 'Front fan (intake)', desc: 'Pulls cool air in through the front. The arrows on the frame show which way air flows.' };
const FAN2 = { id: 'fan2', type: 'fan', at: { x: 24, z: 270 }, facing: 'x', label: 'Front fan (intake)', desc: 'A second intake fan below the first.' };
const FAN3 = { id: 'fan3', type: 'fan', at: { x: 410, z: 75 }, facing: 'x', label: 'Rear fan (exhaust)', desc: 'Pushes warm air out at the back, near the CPU cooler.' };
const FANS = [FAN1, FAN2, FAN3];
const CABLE = (id, label, desc, at, w, d, color = '#1d1e22') => ({ id, type: 'block', at, w, d, h: 10, y: 9, color, insert: [0, 60, 0], label, desc, round: 0.4 });
const CABLES = [
  CABLE('cab24', '24-pin power cable', 'The widest cable. Route it through the grommet beside the board’s right edge.', { x: 120, z: 160 }, 18, 70),
  CABLE('cabcpu', 'CPU power cable (8-pin)', 'Goes up behind the tray and through the top grommet: plug it in before the board is fully screwed down if it is a tight fit.', { x: 175, z: 24 }, 40, 12),
  CABLE('cabgpu', 'Graphics card power cable', 'From the power supply to the top edge of the graphics card.', { x: 250, z: 305 }, 14, 50),
  CABLE('cabfp', 'Front-panel cables', 'Power and reset switches and the LEDs: they plug into the F_PANEL pins at the bottom edge of the board.', { x: 330, z: 296 }, 50, 12, '#3a3d45'),
];
const SIDEPANEL = { id: 'side', type: 'block', at: { x: 220, z: 230 }, w: 444, d: 464, h: 4, y: 166, table: true, color: '#9fc4d8', opacity: 0.28, insert: [0, 140, 0], label: 'Glass side panel', desc: 'Goes on last. Hold it by the edges; tempered glass shatters if a corner hits something hard.' };
const PANEL = { id: 'panel', type: 'casepanel', at: { x: 220, z: 520 }, w: 90, label: 'CASE TOP', desc: 'The case’s power and reset buttons with the power LED (green) and drive LED (amber).' };
const PWRBTN = { id: 'pwrbtn', type: 'casebutton', at: { x: 206, z: 520 }, y: 58, label: 'POWER', desc: 'Press it in the 3D view.' };
const RSTBTN = { id: 'rstbtn', type: 'casebutton', at: { x: 234, z: 520 }, y: 58, size: 6, color: '#9a958a', label: 'RESET', desc: 'Restarts the PC without cutting power.' };

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the case',
    summary: 'Find your way around an empty ATX case before anything goes in.',
    icon: 'board',
    focus: { components: ['standoffs'] },
    callouts: [
      { component: 'standoffs', icon: 'target', title: 'Standoffs', text: 'The board screws onto these.' },
      { component: 'rear', icon: 'plug', title: 'Rear wall', text: 'Ports, rear fan, slot covers.' },
      { component: 'shroud', icon: 'power', title: 'PSU shroud', text: 'Hides the power supply.' },
      { component: 'grommet1', icon: 'wave', title: 'Grommets', text: 'Cables pass through here.' },
      { component: 'front', icon: 'wifi', title: 'Front wall', text: 'Room for intake fans.' },
    ],
    overview: [
      'A PC case is a metal box with fixed places for everything. Lay it **on its side**, with the side panel off, so gravity helps: the motherboard tray becomes a flat table to build on.',
      'The order matters. Big, awkward parts go in first while there is room to reach; cables come last; the glass panel goes on only after the PC has started once.',
      { tips: [['target', 'Click any wall, the shroud or a grommet'], ['rotr', 'Drag to orbit, scroll to zoom'], ['play', 'Later lessons play each step like a video']] },
      { note: 'Work on a hard floor or table, not carpet. Touch the bare metal of the case now and then to discharge static.', tone: 'warn' },
      { h: 'Typical mid-tower' },
      { specs: [['Motherboards', 'ATX, Micro-ATX, Mini-ITX'], ['Graphics card', 'Up to ~350–400 mm long'], ['CPU cooler', 'Up to ~160 mm tall'], ['Power supply', 'ATX, bottom-mounted'], ['Fans', '2–3 front, 1 rear, 2–3 top'], ['Drive bays', 'Often 2.5″ trays behind the tray']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'ATX mid-tower case'], ['1', 'Phillips #2 screwdriver', 'Magnetic tip helps.'], ['1', 'Cable ties or Velcro straps']],
  },

  {
    id: 'plan',
    title: 'Check that it all fits',
    short: 'Plan the build',
    summary: 'Before you buy or build: socket, size, length, height and power all have to agree.',
    icon: 'board',
    focus: { components: ['standoffs', 'shroud'] },
    callouts: [
      { component: 'standoffs', icon: 'chip', title: 'Board size', text: 'ATX, Micro-ATX or Mini-ITX.' },
      { component: 'slots', icon: 'plug', title: 'GPU length', text: 'Measured from the rear wall.' },
      { component: 'shroud', icon: 'power', title: 'Power', text: 'Enough watts, the right plugs.' },
    ],
    overview: [
      'Most failed builds fail on paper first. Check these five things against each product’s specification page:',
      { steps: [
        '**CPU and motherboard** use the same socket, and the board supports that CPU (sometimes only after a BIOS update).',
        '**Memory** type matches the board: DDR4 and DDR5 do not fit each other’s slots.',
        '**Case and motherboard** size: an ATX case takes ATX and smaller boards.',
        '**Graphics card length** and **cooler height** are below the case’s listed limits.',
        '**Power supply** has enough watts for the CPU plus graphics card, with headroom, and the right PCIe power plugs for the card.',
      ] },
      { note: 'A power supply is the one part not to economise on: a poor one can take other parts with it when it fails.', tone: 'warn' },
    ],
    kit: [['1', 'Parts list with each item’s spec page']],
  },

  {
    id: 'psu',
    title: 'Install the power supply',
    short: 'Power supply',
    summary: 'Slide the power supply into the bottom rear and fix it with four screws.',
    icon: 'circuit',
    focus: { components: ['rear', 'shroud'] },
    circuit: { parts: [PSU] },
    callouts: [
      { part: 'psu', icon: 'power', title: 'Power supply', text: 'Bottom rear, four screws.' },
      { component: 'rear', icon: 'plug', title: 'Rear wall', text: 'The switch and socket face out here.' },
    ],
    overview: [
      'The power supply goes in first because it is heavy and its cables have to reach everywhere. Most cases take it from the **rear** or the side, at the bottom.',
      'If the case has a dust filter under the power supply, mount it **fan down** so it breathes fresh air from below. If there is no bottom vent, mount it fan up.',
      { tips: [['play', 'Press Play in Try it'], ['power', 'Modular supplies: plug in only the cables you need'], ['info', 'Keep the switch on the back set to off (O) while building']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['psu'], seconds: 1.8, text: 'Slide the **power supply** in from the rear, fan towards the floor vent.' },
      ],
    },
    kit: [['1', 'ATX power supply'], ['4', 'PSU screws (coarse thread)', 'Usually in the power supply’s box.']],
  },

  {
    id: 'board',
    title: 'Mount the motherboard',
    short: 'Motherboard',
    summary: 'Check the standoffs, fit the I/O shield, lower the board in and screw it down.',
    icon: 'circuit',
    focus: { components: ['standoffs', 'rear'] },
    circuit: { parts: [PSU, IOSHIELD, MOTHERBOARD] },
    callouts: [
      { part: 'mobo', icon: 'chip', title: 'Motherboard', text: 'CPU, cooler and RAM already on.' },
      { part: 'ioshield', icon: 'plug', title: 'I/O shield', text: 'Goes in before the board.' },
      { component: 'standoffs', icon: 'target', title: 'Standoffs', text: 'One under every hole, no extras.' },
    ],
    overview: [
      'Build the CPU, memory, SSD and cooler onto the motherboard **outside** the case, on its box: it is far easier. The motherboard course shows each step.',
      'An ATX board has **nine** screw holes. Make sure there is a standoff under every hole and **none where there is no hole**: a stray standoff can touch the back of the board and short it.',
      { tips: [['play', 'Press Play in Try it'], ['target', 'Lower the board at an angle so the ports slide into the shield'], ['info', 'Screw in diagonal pairs and only finger-tight plus a little']] },
      { note: 'If the I/O shield is separate, press it in from **inside** until all four edges click. Watch for the little springy tabs: they must sit on top of the ports, not inside them.' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['ioshield'], text: 'Press the **I/O shield** into the rear opening from inside until it clicks.' },
        { do: 'insert', parts: ['mobo'], seconds: 2, text: 'Lower the **motherboard** at a slight angle, ports first, then lay it flat on the standoffs.' },
      ],
    },
    kit: [['1', 'Motherboard with CPU, cooler and memory installed'], ['9', 'Motherboard screws (fine thread)']],
  },

  {
    id: 'gpu',
    title: 'Install the graphics card',
    short: 'Graphics card',
    summary: 'Remove two slot covers, press the card into the top PCIe x16 slot and screw it to the rear.',
    icon: 'circuit',
    focus: { components: ['slots'] },
    circuit: { parts: [PSU, IOSHIELD, MOTHERBOARD, GPU] },
    callouts: [
      { part: 'gpu', icon: 'chip', title: 'Graphics card', text: 'Top full-length slot.' },
      { component: 'slots', icon: 'plug', title: 'Slot covers', text: 'Remove the ones it needs.' },
    ],
    overview: [
      'Graphics cards are usually two or three slots thick. Unscrew and remove that many **slot covers** at the rear, in line with the top PCIe x16 slot.',
      'Open the slot’s latch, line up the card’s gold edge, and press straight down until the latch clicks. Then screw the card’s bracket to the rear.',
      { tips: [['play', 'Press Play in Try it'], ['power', 'The card’s power cable comes in the cabling lesson'], ['info', 'Heavy cards sag: use the support bracket if one came with the card or case']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['gpu'], seconds: 1.8, text: 'Line the card up with the top **PCIe x16** slot and press straight down until the latch clicks.' },
      ],
    },
    kit: [['1', 'Graphics card'], ['2', 'Slot-cover screws', 'Re-use the ones you removed.']],
  },

  {
    id: 'fans',
    title: 'Set up airflow',
    short: 'Case fans',
    summary: 'Front fans pull air in, the rear fan pushes it out: a steady stream past every hot part.',
    icon: 'circuit',
    focus: { components: ['front', 'rear'] },
    circuit: { parts: [PSU, IOSHIELD, MOTHERBOARD, GPU, ...FANS] },
    callouts: [
      { part: 'fan1', icon: 'wifi', title: 'Front: intake', text: 'Cool air in.' },
      { part: 'fan3', icon: 'wifi', title: 'Rear: exhaust', text: 'Warm air out.' },
      { part: 'mobo', icon: 'thermo', title: 'Hot parts', text: 'CPU cooler and graphics card.' },
    ],
    overview: [
      'Air should flow one way through the case: **in at the front, out at the back and top**. The CPU cooler and graphics card then always breathe cool air.',
      'Every fan has small **arrows** moulded on its frame: one shows the spin, the other the direction the air goes. Mount front fans blowing **into** the case and the rear fan blowing **out**.',
      'Slightly more intake than exhaust (positive pressure) means air leaks out through gaps instead of dust being sucked in through them.',
      { tips: [['play', 'Press Play in Try it'], ['wifi', 'Look for the airflow arrow before you tighten the screws'], ['power', 'Fans plug into SYS_FAN headers or a fan hub']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['fan1', 'fan2'], text: 'Screw the two **front fans** on, airflow arrow pointing **into** the case.' },
        { do: 'insert', parts: ['fan3'], text: 'Fit the **rear fan** high up, airflow arrow pointing **out** of the case.' },
      ],
    },
    kit: [['3', '120 mm case fans', 'Many cases include some already.'], ['12', 'Fan screws']],
  },

  {
    id: 'cables',
    title: 'Plug in and tidy the cables',
    short: 'Cabling',
    summary: 'Route each power and front-panel cable through the nearest grommet and tie the rest out of the airflow.',
    icon: 'circuit',
    focus: { components: ['grommet1', 'grommet2'] },
    circuit: { parts: [PSU, IOSHIELD, MOTHERBOARD, GPU, ...FANS, ...CABLES] },
    callouts: [
      { part: 'cab24', icon: 'power', title: '24-pin', text: 'Through the right-hand grommet.' },
      { part: 'cabcpu', icon: 'power', title: 'CPU 8-pin', text: 'Through the top grommet.' },
      { part: 'cabgpu', icon: 'power', title: 'GPU power', text: 'Every socket on the card.' },
      { part: 'cabfp', icon: 'button', title: 'Front panel', text: 'F_PANEL at the bottom edge.' },
    ],
    overview: [
      'Each cable comes out of the **grommet closest to its socket** and goes straight in; the slack stays behind the tray. Inside, short and direct means better airflow and an easier time if you need to change something.',
      { steps: [
        '**24-pin** main power to the right edge of the board, until the clip clicks.',
        '**8-pin CPU** power (marked CPU or EPS) to the top-left corner.',
        '**Graphics card** power: fill every socket on the card, using separate cables from the supply if the card draws a lot.',
        '**Front panel**: power switch, reset, power LED and drive LED onto F_PANEL; then front USB and audio. The motherboard course has the pin-by-pin guide.',
        'Fans to SYS_FAN headers. Then strap the slack together behind the tray.',
      ] },
      { note: 'Push every power plug until it clicks. A half-seated GPU or CPU power plug is the most common reason a new PC will not start, and it can get hot.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['cab24'], text: 'Bring the **24-pin** cable through the right-hand grommet and click it in.' },
        { do: 'insert', parts: ['cabcpu'], text: 'Bring the **CPU 8-pin** cable through the top grommet into the corner socket.' },
        { do: 'insert', parts: ['cabgpu'], text: 'Plug **power into the graphics card**: every socket on it.' },
        { do: 'insert', parts: ['cabfp'], text: 'Connect the **front-panel** plugs, USB and audio at the bottom edge of the board.' },
      ],
    },
    kit: [['–', 'Cables from the power supply and the case'], ['5', 'Cable ties or Velcro straps']],
  },

  {
    id: 'boot',
    title: 'First power-on',
    summary: 'Switch on at the back, press the power button and watch the fans start and the self-test pass.',
    icon: 'circuit',
    focus: { components: ['rear'] },
    circuit: { parts: [PSU, IOSHIELD, MOTHERBOARD, GPU, ...FANS, ...CABLES, PANEL, PWRBTN, RSTBTN] },
    callouts: [
      { part: 'pwrbtn', icon: 'button', title: 'Power button', text: 'Press it in the 3D view.' },
      { part: 'panel', icon: 'led', title: 'Power LED', text: 'Lights when it starts.' },
      { part: 'fan1', icon: 'wifi', title: 'Fans', text: 'Should all start spinning.' },
      { part: 'psu', icon: 'power', title: 'PSU switch', text: 'Set to I (on) first.' },
    ],
    overview: [
      'Start the PC **before** putting the side panel on, so you can see that everything spins and lights.',
      { steps: [
        'Connect the monitor to the **graphics card**, not the motherboard’s video ports.',
        'Plug in the power cord and set the supply’s switch to **I**.',
        'Press the case power button. Fans spin, the power LED lights, and after a moment the motherboard’s logo or setup screen appears.',
        'In the BIOS setup, check the CPU, the full amount of memory and your SSD are listed. Then install the operating system from a USB stick.',
      ] },
      { tips: [['button', 'Press the power button in the 3D view or in Try it'], ['clock', 'The first start can take a minute while memory is trained'], ['info', 'Hold power for 4 s to force it off']] },
      { h: 'Nothing happens?' },
      { steps: ['Is the supply switched on and the wall socket live?', 'Are the 24-pin and CPU 8-pin plugs fully clicked in?', 'Is the power switch plug on the right two F_PANEL pins?', 'Fans spin but no picture: is the monitor on the graphics card, and its power plugged in?'] },
    ],
    sim: {
      type: 'boot', power: 'pwrbtn', reset: 'rstbtn', panel: 'panel', fans: ['fan1', 'fan2', 'fan3'],
      post: ['Power supply on: +12 V, +5 V and +3.3 V present', 'CPU check: OK', 'Memory check: OK', 'Graphics check: OK', 'Drive found: NVMe SSD', 'Entering setup…'],
    },
    kit: [['1', 'Monitor, keyboard and mouse'], ['1', 'USB stick with the operating-system installer', '16 GB or larger.']],
  },

  {
    id: 'close',
    title: 'Close the case',
    summary: 'Once it starts reliably, power off, fit the glass side panel and stand the case up.',
    icon: 'circuit',
    focus: { components: ['top'] },
    circuit: { parts: [PSU, IOSHIELD, MOTHERBOARD, GPU, ...FANS, ...CABLES, SIDEPANEL] },
    callouts: [
      { part: 'side', icon: 'target', title: 'Side panel', text: 'Hold by the edges.' },
      { component: 'rear', icon: 'plug', title: 'Rear', text: 'Thumbscrews or a hinge.' },
    ],
    overview: [
      'Shut the PC down, switch the supply off at the back and unplug it. Then check nothing pokes out past the tray edge: a pinched cable stops the panel closing and can break the glass.',
      'Most glass panels hang on two pins at the bottom or slide onto a hinge, then fix with thumbscrews at the back. Tighten them evenly and gently.',
      { tips: [['play', 'Press Play in Try it'], ['info', 'Peel the protective film off both sides of the glass'], ['target', 'Stand the case up with fans clear of walls']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['side'], seconds: 2, text: 'Lower the **glass side panel** onto the case and fix it with the thumbscrews.' },
      ],
    },
    kit: [['–', 'The side panel and its thumbscrews']],
  },

  {
    id: 'teardown',
    title: 'Take it apart again',
    short: 'Disassembly',
    summary: 'Upgrades and repairs: remove everything in reverse order, unplugged and discharged.',
    icon: 'circuit',
    focus: { components: ['standoffs'] },
    circuit: { parts: [PSU, IOSHIELD, MOTHERBOARD, GPU, ...FANS, ...CABLES, SIDEPANEL] },
    callouts: [
      { part: 'side', icon: 'target', title: 'Side panel', text: 'Comes off first.' },
      { part: 'gpu', icon: 'chip', title: 'Graphics card', text: 'Press the slot latch to release.' },
      { part: 'psu', icon: 'power', title: 'Power supply', text: 'Comes out last.' },
    ],
    overview: [
      'Taking a PC apart is the build in reverse. Unplug the power cord, then hold the power button for a few seconds to drain what is left in the supply.',
      { tips: [['play', 'Press Play in Try it'], ['info', 'Photograph the cables before unplugging them'], ['power', 'Keep screws in labelled cups']] },
      { note: 'The graphics card’s slot latch must be pressed before the card will lift out; pulling hard can break the slot.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      mode: 'disassemble',
      steps: [
        { do: 'remove', parts: ['side'], text: 'Remove the thumbscrews and lift off the **side panel**.' },
        { do: 'remove', parts: ['cabgpu', 'cab24', 'cabcpu', 'cabfp'], text: 'Unplug the **power** and **front-panel** cables; squeeze each clip first.' },
        { do: 'remove', parts: ['gpu'], text: 'Unscrew the bracket, press the slot latch and lift out the **graphics card**.' },
        { do: 'remove', parts: ['fan1', 'fan2', 'fan3'], text: 'Unscrew the **case fans** if they need cleaning.' },
        { do: 'remove', parts: ['mobo'], text: 'Remove the nine screws and lift out the **motherboard**.' },
        { do: 'remove', parts: ['ioshield'], text: 'Push the **I/O shield** out from inside.' },
        { do: 'remove', parts: ['psu'], text: 'Unscrew the four screws at the rear and slide out the **power supply**.' },
      ],
      done: 'Empty case: everything is back on the bench.',
    },
    kit: [['1', 'Screwdriver and small cups for screws']],
  },
];
