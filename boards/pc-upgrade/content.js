// Everything specific to this course lives in this file: site metadata, the parts and the lessons.
// The motherboard model and its pin map are shared with the motherboard course.
import { BOARD as MOBO, PIN_TYPES as MOBO_PIN_TYPES } from '../pc-motherboard/content.js';

export const SITE = {
  id: 'learn-pc-upgrade',
  title: 'PC Upgrade: Graphics Card and SSD',
  accent: '#d0563a',
  logicVolts: 12,
  shell: 'build log',
  terminalHint: 'Each step appears here as it plays.',
};

export const PIN_TYPES = MOBO_PIN_TYPES;
export const BOARD = MOBO;

// ---------- parts ----------
// Parts already in the PC, so the board looks like a working machine.
const CPU = { id: 'cpu', type: 'cpu', socket: 'socket', label: 'CPU', desc: 'Already installed under the cooler.' };
const COOLER = { id: 'cooler', type: 'cooler', socket: 'socket', label: 'CPU cooler', desc: 'Leave it alone for these upgrades.' };
const RAM_A = { id: 'ramA', type: 'dimm', slot: 'dimm2', label: 'Memory', desc: 'Already installed.', color: '#2b2a33', accent: '#e05a3a' };
const RAM_B = { id: 'ramB', type: 'dimm', slot: 'dimm4', label: 'Memory', desc: 'Already installed.', color: '#2b2a33', accent: '#e05a3a' };
const BASE = [CPU, COOLER, RAM_A, RAM_B];
// The upgrades. Card and drive sizes are typical and stylised.
const OLD_GPU = { id: 'oldgpu', type: 'gpu', slot: 'pcie1', length: 220, color: '#3a3d45', accent: '#8a8f99', label: 'Old graphics card', desc: 'The card coming out. Unplug its power first, then the screw, then the slot latch.' };
const NEW_GPU = { id: 'newgpu', type: 'gpu', slot: 'pcie1', length: 285, color: '#24252b', accent: '#d0563a', label: 'New graphics card', desc: 'Longer and hungrier than the old one: check the case clearance and the power plugs before buying.' };
const GPU_POWER = (id, length) => ({ id, type: 'block', at: { x: 40.5 + length - 40, z: 168 }, w: 16, d: 10, h: 46, y: 140, color: '#1d1e22', insert: [0, 60, 0], label: 'Graphics card power cable', desc: 'From the power supply into the card’s top edge. Squeeze the clip to release it; push until it clicks to connect.', round: 0.4 });
const OLD_POWER = GPU_POWER('oldpower', 220);
const NEW_POWER = GPU_POWER('newpower', 285);
const NVME = { id: 'nvme', type: 'm2', slot: 'm2_1', label: 'M.2 NVMe SSD', desc: 'Fast storage straight on the board: no cables. Goes in at about 30°, then is pressed flat and screwed down.' };
const SATA_SSD = { id: 'satassd', type: 'block', at: { x: 345, z: 200 }, w: 70, d: 100, h: 7, table: true, color: '#3a3d45', insert: [0, 60, 0], text: 'SSD', label: '2.5-inch SATA SSD', desc: 'Slower than NVMe but still far faster than a hard disk. Needs a SATA data cable and a SATA power cable.' };
const SATA_CABLE = { id: 'satacable', type: 'block', at: { x: 318, z: 195 }, w: 46, d: 6, h: 4, y: 12, color: '#d0563a', insert: [0, 50, 0], label: 'SATA data cable', desc: 'L-shaped, keyed plugs: from the SATA port on the board to the drive.', round: 0.4 };

export const LESSONS = [
  {
    id: 'meet',
    title: 'Where upgrades go',
    summary: 'Find the slot for the graphics card, the M.2 socket and the SATA ports before opening anything.',
    icon: 'board',
    focus: { components: ['pcie1', 'm2_1', 'sata1'] },
    callouts: [
      { component: 'pcie1', icon: 'plug', title: 'PCIe x16', text: 'The graphics card.' },
      { component: 'm2_1', icon: 'memory', title: 'M.2 socket', text: 'An NVMe SSD, no cables.' },
      { component: 'sata1', icon: 'plug', title: 'SATA ports', text: '2.5-inch SSDs and hard disks.' },
      { component: 'atx24', icon: 'power', title: 'Power', text: 'Big cards need their own cables.' },
    ],
    overview: [
      'A graphics card and more storage are the two upgrades that make the biggest difference, and both need nothing more than a screwdriver.',
      'Your board’s manual has a layout drawing like this one: find the top **PCIe x16** slot, every **M.2** socket and the **SATA** ports on yours, and note which M.2 sockets share lanes with SATA ports or other slots.',
      { tips: [['target', 'Click the slot, the M.2 socket and the SATA ports'], ['info', 'Some M.2 sockets disable a SATA port when used: the manual lists which'], ['play', 'Later lessons play each step like a video']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Your motherboard’s manual', 'Or the PDF from the manufacturer’s website.']],
  },

  {
    id: 'plan',
    title: 'Check before you buy',
    short: 'Plan the upgrade',
    summary: 'Length, power, plugs and lanes: four checks that save a return trip.',
    icon: 'board',
    focus: { components: ['pcie1', 'm2_1'] },
    callouts: [
      { component: 'pcie1', icon: 'ruler', title: 'Card length', text: 'Against the case’s limit.' },
      { component: 'm2_1', icon: 'memory', title: 'M.2 key and length', text: 'M-key, 2280 is the usual.' },
    ],
    overview: [
      { steps: [
        '**Graphics card length and thickness**: compare with the case’s maximum, minus any front fans or radiator.',
        '**Power supply**: enough watts for the new card (its maker lists a recommended supply) and the right PCIe power plugs, including 12V-2x6 for some newer cards.',
        '**M.2 SSD**: an **M-key NVMe** drive, usually **2280** (22 mm wide, 80 mm long). Check the socket supports NVMe and which PCIe generation it runs at.',
        '**SATA SSD**: needs a free SATA port, a data cable and a SATA power plug from the supply.',
      ] },
      { note: 'Back up anything you cannot lose before working inside the PC. Mistakes with drives are rare, but backups are cheap.', tone: 'warn' },
    ],
    kit: [['1', 'Spec sheets for the card, the SSD, the case and the power supply']],
  },

  {
    id: 'prep',
    title: 'Power down safely',
    summary: 'Shut down, switch off, unplug, drain the power and open the case.',
    icon: 'board',
    focus: { components: ['atx24', 'eps'] },
    callouts: [
      { component: 'atx24', icon: 'power', title: 'Main power', text: 'Dead once unplugged and drained.' },
      { component: 'pcie1', icon: 'plug', title: 'Work area', text: 'The slot you will use.' },
    ],
    overview: [
      { steps: [
        'Shut the operating system down normally.',
        'Switch the power supply off at the back (**O**) and pull the power cord.',
        'Press and hold the case power button for a few seconds to drain what is left.',
        'Lay the case on its side, remove the side panel, and touch bare metal on the case to discharge static.',
      ] },
      { tips: [['info', 'Before removing an old card, uninstall its driver if you are switching brands'], ['target', 'Keep screws in a cup'], ['power', 'Never work inside with the cord plugged in']] },
    ],
    kit: [['1', 'Phillips #2 screwdriver'], ['1', 'Small cup for screws']],
  },

  {
    id: 'remove',
    title: 'Remove the old graphics card',
    short: 'Remove old card',
    summary: 'Unplug its power, unscrew the bracket, release the slot latch and lift it out.',
    icon: 'circuit',
    focus: { components: ['pcie1'] },
    circuit: { parts: [...BASE, OLD_GPU, OLD_POWER] },
    callouts: [
      { part: 'oldpower', icon: 'power', title: 'Power cable', text: 'Squeeze the clip, pull straight.' },
      { part: 'oldgpu', icon: 'chip', title: 'Old card', text: 'Latch first, then lift.' },
      { component: 'pcie1', icon: 'plug', title: 'Slot latch', text: 'At the far end of the slot.' },
    ],
    overview: [
      'The card is held three ways: its **power cable**, a **screw** through its bracket at the rear, and a **latch** at the end of the slot. Release all three before lifting.',
      { tips: [['play', 'Press Play in Try it'], ['info', 'Large cards hide the latch: a long screwdriver or a chopstick helps press it'], ['target', 'Hold the card by its edges, not its fans']] },
      { note: 'Never lever the card out with the latch still closed: it can crack the slot or rip off the latch.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      mode: 'disassemble',
      steps: [
        { do: 'remove', parts: ['oldpower'], text: 'Squeeze the clip and pull the **power cable** straight out of the card.' },
        { do: 'remove', parts: ['oldgpu'], seconds: 1.6, zoom: 'oldgpu', text: 'Remove the bracket screw, press the **slot latch**, and lift the **old card** straight up.' },
      ],
      done: 'Slot empty: ready for the new card.',
    },
    kit: [['1', 'Anti-static bag', 'For storing or selling the old card.']],
  },

  {
    id: 'install',
    title: 'Install the new graphics card',
    short: 'Install new card',
    summary: 'Press the new card into the slot, screw the bracket and plug in every power socket.',
    icon: 'circuit',
    focus: { components: ['pcie1'] },
    circuit: { parts: [...BASE, NEW_GPU, NEW_POWER] },
    callouts: [
      { part: 'newgpu', icon: 'chip', title: 'New card', text: 'Straight down until the latch clicks.' },
      { part: 'newpower', icon: 'power', title: 'Power', text: 'Every socket, fully clicked in.' },
    ],
    overview: [
      'Remove one more slot cover if the new card is thicker. Line the gold edge up with the slot, press straight down until the latch clicks, then screw the bracket in.',
      'Plug in **every** power socket on the card. If the supply has several PCIe cables, use separate cables rather than both ends of one daisy-chained cable for a power-hungry card.',
      { tips: [['play', 'Press Play in Try it'], ['info', 'Use the card’s support bracket if it came with one'], ['power', 'A 12V-2x6 plug must go in fully: no gap at the clip']] },
      { note: 'A power plug that is not fully seated can overheat. Push until it clicks and check there is no gap.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['newgpu'], seconds: 1.8, text: 'Line up the **new card** with the top slot and press straight down until the latch clicks; screw in the bracket.' },
        { do: 'insert', parts: ['newpower'], text: 'Push the **power cable** into the card until it clicks.' },
      ],
    },
    kit: [['1', 'New graphics card'], ['–', 'PCIe power cables from the supply']],
  },

  {
    id: 'nvme',
    title: 'Add an M.2 NVMe SSD',
    short: 'M.2 SSD',
    summary: 'Slide the drive into the M.2 socket at an angle, press it flat and fix it with one screw.',
    icon: 'circuit',
    focus: { components: ['m2_1'] },
    circuit: { parts: [...BASE, NEW_GPU, NEW_POWER, NVME] },
    callouts: [
      { part: 'nvme', icon: 'memory', title: 'NVMe SSD', text: 'Label side up.' },
      { component: 'm2_1', icon: 'plug', title: 'M.2 socket', text: 'Notch matches the key.' },
    ],
    overview: [
      'M.2 drives need no cables: the socket carries both data and power. Many boards hide the socket under a **heatsink** plate: unscrew it, peel the film off its thermal pad, and put it back on top of the drive afterwards.',
      { steps: [
        'Check the standoff is at the **2280** position (80 mm from the socket).',
        'Slide the drive into the socket at about 30°, gold contacts first.',
        'Press the far end down onto the standoff and fix it with the small screw (or the tool-free latch).',
      ] },
      { tips: [['play', 'Press Play in Try it'], ['memory', 'If the graphics card covers the socket, fit the SSD before the card'], ['info', 'The tiny M.2 screw is easy to lose: keep it on a magnet']] },
    ],
    sim: {
      type: 'assembly',
      steps: [{ do: 'insert', parts: ['nvme'], seconds: 1.6, zoom: 'nvme', text: 'Slide the **NVMe SSD** into the socket at an angle, press it flat and screw it down.' }],
    },
    kit: [['1', 'M.2 NVMe SSD (M-key, 2280)'], ['1', 'M.2 screw', 'Usually in the motherboard box.']],
  },

  {
    id: 'sata',
    title: 'Add a 2.5-inch SATA SSD',
    short: 'SATA SSD',
    summary: 'Mount the drive in a bay, then connect a SATA data cable to the board and SATA power from the supply.',
    icon: 'circuit',
    focus: { components: ['sata1'] },
    circuit: { parts: [...BASE, NEW_GPU, NEW_POWER, NVME, SATA_SSD, SATA_CABLE] },
    callouts: [
      { part: 'satassd', icon: 'memory', title: 'SATA SSD', text: 'In a drive bay or tray.' },
      { part: 'satacable', icon: 'plug', title: 'Data cable', text: 'L-shaped plugs, one way only.' },
      { component: 'sata1', icon: 'plug', title: 'SATA port', text: 'Use the lowest-numbered free one.' },
    ],
    overview: [
      'A SATA drive needs **two** connections: a thin **data** cable to the board and a wider **power** plug from the supply. Both plugs are L-shaped, so they only fit one way round.',
      { steps: ['Screw the drive into a 2.5″ tray or bay.', 'Plug the data cable into the drive and into a free SATA port on the board.', 'Plug a SATA power connector from the supply into the drive.'] },
      { tips: [['play', 'Press Play in Try it'], ['plug', 'Check the manual: a used M.2 socket may disable a SATA port'], ['info', 'Ports are numbered on the board: SATA_1, SATA_2…']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['satassd'], text: 'Fit the **SATA SSD** into its tray or bay.' },
        { do: 'insert', parts: ['satacable'], zoom: 'satacable', text: 'Connect the **data cable** from a SATA port to the drive, then plug in SATA power.' },
      ],
    },
    kit: [['1', '2.5-inch SATA SSD'], ['1', 'SATA data cable', 'Usually in the motherboard box.']],
  },

  {
    id: 'check',
    title: 'Check it all works',
    short: 'After the upgrade',
    summary: 'Close up, start the PC, confirm the new parts in setup, then set up drivers and the new drives.',
    icon: 'circuit',
    focus: { components: ['pcie1', 'm2_1', 'sata1'] },
    circuit: { parts: [...BASE, NEW_GPU, NEW_POWER, NVME, SATA_SSD, SATA_CABLE] },
    callouts: [
      { part: 'newgpu', icon: 'chip', title: 'New card', text: 'Monitor cable goes here now.' },
      { part: 'nvme', icon: 'memory', title: 'New drives', text: 'Listed in setup, then initialised.' },
    ],
    overview: [
      { steps: [
        'Fit the side panel, plug the **monitor into the new graphics card**, reconnect power and switch on.',
        'Enter the firmware setup (usually **Del** or **F2** at start-up) and check both new drives are listed.',
        'In the operating system, install the latest driver from the graphics card maker.',
        'New drives start empty: on Windows, open **Disk Management**, initialise them as **GPT** and create a volume; on Linux, partition and format them with a disk tool.',
      ] },
      { tips: [['info', 'Moving your system to the new SSD? Use a cloning tool, then pick the new drive as the first boot device'], ['power', 'No picture? Re-seat the card and its power plugs'], ['memory', 'Drive missing? Check the M.2 screw and the SATA cables']] },
    ],
    kit: [['–', 'Nothing extra']],
  },
];
