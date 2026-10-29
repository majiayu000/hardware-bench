// Everything specific to this course lives in this file: site metadata, the 3D model and the lessons.

export const SITE = {
  id: 'learn-soldering',
  title: 'Soldering Basics: Your First Kit',
  accent: '#c2951a',
  logicVolts: 3,
  shell: 'workbench log',
  terminalHint: 'Each step appears here as it plays.',
};

export const PIN_TYPES = { pad: 'Through-hole pad' };

// A small through-hole practice kit, top view, millimetres: a coin-cell LED light with a resistor, an
// LED, a push button, a battery holder and a 4-pin header. Pads are on a 2.54 mm grid; the board,
// parts and tools are stylised to teach the technique, not to match a particular kit.
const pads = (id, label, desc, x, z, n, step = [2.54, 0]) => ({
  id, label, short: id.toUpperCase(), desc, layout: 'single', style: 'pad', pitch: 2.54, padW: 1.9, padD: 1.9, padHole: 0.9, x, z, step,
  pins: Array.from({ length: n }, (_, i) => ({ n: i + 1, name: `${id.toUpperCase()}.${i + 1}`, type: 'pad' })),
});
export const BOARD = {
  name: 'LED practice kit PCB',
  width: 50,
  depth: 30,
  thickness: 1.6,
  cornerRadius: 2,
  pcbColor: '#2f7d4f',
  holes: [{ x: 3, z: 3, r: 1.2 }, { x: 47, z: 3, r: 1.2 }, { x: 3, z: 27, r: 1.2 }, { x: 47, z: 27, r: 1.2 }],
  silkscreen: [
    { text: 'R1', x: 9, z: 8.5, size: 1.4, align: 'center' }, { text: 'D1', x: 22.5, z: 8.5, size: 1.4, align: 'center' },
    { text: '+', x: 21, z: 13.5, size: 1.6, align: 'center' }, { text: 'SW1', x: 34, z: 8.5, size: 1.4, align: 'center' },
    { text: 'J1', x: 7, z: 26.5, size: 1.4, align: 'center' }, { text: 'BT1  CR2032', x: 33, z: 27, size: 1.2, align: 'center' },
  ],
  components: [
    { id: 'traces', label: 'Copper traces', desc: 'Thin copper lines under the green solder mask that join the pads into a circuit.', shape: 'box', x: 25, z: 15, w: 30, d: 0.6, h: 0.05, color: '#3f9a63' },
  ],
  headers: [
    pads('r1', 'Resistor pads (R1)', 'Two pads for the resistor. Resistors have no polarity.', 5.2, 11, 2, [7.62, 0]),
    pads('d1', 'LED pads (D1)', 'Two pads for the LED. The + side takes the long leg.', 21.2, 11, 2),
    pads('sw1', 'Button pads (SW1)', 'Two of the four pads for the 6 mm push button; the other two sit behind them.', 31, 11, 2, [6.5, 0]),
    pads('j1', 'Header pads (J1)', 'Four pads for a row of header pins: power and three signals.', 4, 22, 4),
    pads('bt1', 'Battery holder pads (BT1)', 'Two pads for the CR2032 holder.', 26, 22, 2, [14, 0]),
  ],
};

// ---------- parts and tools ----------
const R1 = { id: 'res', type: 'block', at: { x: 9, z: 11 }, w: 6.3, d: 2.4, h: 2.4, y: 1, color: '#d9c7a0', insert: [0, 30, 0], label: 'Resistor (330 Ω)', desc: 'Limits the LED’s current. Bend the legs flat against the body, push them through, and splay them slightly underneath so it stays put.',
  boxes: [{ x: -1.6, y: -2.4, w: 0.6, d: 2.5, h: 2.4, color: '#e2483c' }, { x: -0.6, y: -2.4, w: 0.6, d: 2.5, h: 2.4, color: '#e2483c' }, { x: 0.4, y: -2.4, w: 0.6, d: 2.5, h: 2.4, color: '#7a4a25' }, { x: 2.0, y: -2.4, w: 0.6, d: 2.5, h: 2.4, color: '#c9a44c' }] };
const LED = { id: 'led', type: 'block', at: { x: 22.47, z: 11 }, w: 5, d: 5, h: 6, y: 1, color: '#ff6b5a', insert: [0, 30, 0], round: 0.5, label: 'LED (5 mm)', desc: 'Polarity matters: the long leg is + (anode) and goes in the pad marked +. The flat edge on the rim marks the − side.' };
const BUTTON = { id: 'btn', type: 'block', at: { x: 34.25, z: 11 }, w: 6, d: 6, h: 3.5, y: 0, color: '#2b2a30', insert: [0, 30, 0], label: 'Push button (6 mm)', desc: 'Snaps into its four pads; any way round works on most kits.', boxes: [{ y: 0, w: 3.5, d: 3.5, h: 1.5, color: '#c9ced6' }] };
const HEADER = { id: 'hdr', type: 'block', at: { x: 7.81, z: 22 }, w: 10.2, d: 2.5, h: 2.5, y: 0, color: '#24232b', insert: [0, 30, 0], label: 'Header pins (4)', desc: 'Long side up. Solder one pin, check it stands straight, then do the rest.',
  boxes: [-3.81, -1.27, 1.27, 3.81].map((x) => ({ x, y: 0, w: 0.64, d: 0.64, h: 6, color: '#e7c35e' })) };
const HOLDER = { id: 'holder', type: 'block', at: { x: 33, z: 22 }, w: 22, d: 7, h: 4, y: 0, color: '#2b2a30', insert: [0, 30, 0], label: 'CR2032 battery holder', desc: 'The + tab is marked on the holder and the board: match them.', boxes: [{ y: 0, w: 20, d: 5, h: 0.8, color: '#c9ced6' }] };
const joint = (id, x, z, label) => ({ id, type: 'block', at: { x, z }, w: 1.9, d: 1.9, h: 0.9, y: 0, color: '#d8dbe0', round: 0.45, insert: [0, 12, 0], label, desc: 'A good joint is shiny and shaped like a small volcano, wetting both the pad and the lead.' });
const RJOINTS = [joint('rj1', 5.2, 11, 'Solder joint'), joint('rj2', 12.82, 11, 'Solder joint')];
const LJOINTS = [joint('lj1', 21.2, 11, 'Solder joint'), joint('lj2', 23.74, 11, 'Solder joint')];
const HJOINTS = [4, 6.54, 9.08, 11.62].map((x, i) => joint(`hj${i + 1}`, x, 22, 'Solder joint'));
const IRON = { id: 'iron', type: 'block', at: { x: 9, z: 4 }, w: 4, d: 4, h: 30, y: 6, color: '#2b2a30', insert: [0, 0, -40], label: 'Soldering iron', desc: 'Hold it like a pen. Touch the tip to the pad and the lead together for a second or two before feeding solder.', boxes: [{ y: -36, w: 1.2, d: 1.2, h: 6, color: '#c9ced6' }, { y: -6, w: 6, d: 6, h: 20, color: '#c2951a', round: 0.4 }] };
const WIRE = { id: 'wire', type: 'block', at: { x: 14, z: 6 }, w: 0.8, d: 0.8, h: 24, y: 2, color: '#c9ced6', insert: [0, 0, -40], label: 'Solder wire', desc: 'Feed it into the joint, not onto the iron. Lead-free solder with a flux core is the usual choice.' };
const BRIDGE = { id: 'bridge', type: 'block', at: { x: 7.81, z: 22 }, w: 4.4, d: 1.6, h: 0.8, y: 0, color: '#d8dbe0', round: 0.45, insert: [0, 12, 0], label: 'Solder bridge', desc: 'A blob joining two pads: a short circuit. Remove it with solder wick or the iron.' };
const WICK = { id: 'wick', type: 'block', at: { x: 7.81, z: 22 }, w: 6, d: 2.4, h: 0.6, y: 1.2, color: '#c27a3a', insert: [0, 20, 0], label: 'Solder wick', desc: 'Braided copper. Lay it on the excess solder and press with the iron: the solder soaks into the braid.' };

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the kit and tools',
    short: 'Tools',
    summary: 'A small LED light kit, a soldering iron, solder and a few helpers: what each one is for.',
    icon: 'circuit',
    focus: { pins: ['r1:1', 'r1:2', 'd1:1', 'd1:2'] },
    circuit: { parts: [IRON, WIRE] },
    callouts: [
      { part: 'iron', icon: 'thermo', title: 'Soldering iron', text: 'Melts the solder; never the part.' },
      { part: 'wire', icon: 'wave', title: 'Solder', text: 'Flux-cored, fed into the joint.' },
      { pin: 'r1:1', icon: 'target', title: 'Pads', text: 'Copper rings around each hole.' },
      { pin: 'd1:1', icon: 'led', title: 'Polarity marks', text: 'The + shows where the long leg goes.' },
    ],
    overview: [
      '**Soldering** joins a part’s metal leg to a copper **pad** with a small amount of melted metal, the **solder**. Done well, the joint is strong and conducts perfectly. The kit here is a tiny light: a resistor, an LED, a button, a coin-cell holder and some header pins.',
      { tips: [['target', 'Click the pads and the tools'], ['rotr', 'Drag to look at the pads from a low angle'], ['play', 'Later lessons play each step like a video']] },
      { h: 'Your tools' },
      { specs: [['Iron', 'Temperature-controlled, 30–60 W'], ['Tip', 'Small chisel or conical'], ['Solder', '0.6–0.8 mm, flux core'], ['Cleaning', 'Brass wool or a damp sponge'], ['Helpers', 'Flush cutters, tweezers, solder wick'], ['Safety', 'Glasses, fume fan, a stand']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Through-hole practice kit'], ['1', 'Temperature-controlled soldering iron with a stand'], ['1', 'Flux-cored solder, 0.6–0.8 mm'], ['1', 'Flush cutters']],
  },

  {
    id: 'safety',
    title: 'Work safely',
    summary: 'The tip is around 300–350 °C. Five habits that keep you, your desk and your lungs safe.',
    icon: 'circuit',
    focus: { components: ['traces'] },
    circuit: { parts: [IRON] },
    callouts: [{ part: 'iron', icon: 'thermo', title: 'Hot end', text: 'Always back in the stand.' }],
    overview: [
      { steps: [
        'Put the iron **back in its stand** every time you let go of it. Never lay it on the desk.',
        'Wear **safety glasses**: flux can spit and clipped leads fly.',
        'Use a small **fan or fume extractor** and a ventilated room; do not breathe the flux smoke.',
        'Work on a heat-proof mat, with a tidy desk and no loose cables near the iron.',
        'Wash your hands afterwards, especially before eating, whatever solder you use.',
      ] },
      { note: 'Burns from a soldering iron are usually from grabbing it by the wrong end or brushing against it. Keep the cable out of the way so you cannot pull the iron off its stand.', tone: 'warn' },
    ],
    kit: [['1', 'Safety glasses'], ['1', 'Small fan or fume extractor'], ['1', 'Heat-proof mat']],
  },

  {
    id: 'tin',
    title: 'Tin the tip',
    summary: 'Clean the hot tip and coat it with fresh solder so heat flows into the joint.',
    icon: 'circuit',
    focus: { components: ['traces'] },
    circuit: { parts: [IRON, WIRE] },
    callouts: [
      { part: 'iron', icon: 'thermo', title: 'Tip', text: 'Shiny silver = ready.' },
      { part: 'wire', icon: 'wave', title: 'Solder', text: 'A little, to coat the tip.' },
    ],
    overview: [
      'A dull, black tip will not pass heat to the joint. **Tinning** keeps it working: wipe the hot tip in brass wool or on a damp sponge, then melt a little solder onto it so it shines.',
      'Set the iron to around **330 °C** for lead-free solder (a little lower for leaded). Re-tin before you put the iron back in the stand.',
      { tips: [['play', 'Press Play in Try it'], ['thermo', 'Hotter is not better: it burns the flux before it can work'], ['info', 'A shiny tip makes every joint easier']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['iron'], text: 'Wipe the hot **tip** on brass wool until it is clean.' },
        { do: 'insert', parts: ['wire'], text: 'Touch the **solder** to the tip so it melts and coats it in shiny silver.' },
      ],
    },
    kit: [['1', 'Brass tip cleaner or a damp sponge']],
  },

  {
    id: 'resistor',
    title: 'Solder the resistor',
    short: 'First joints',
    summary: 'Your first two joints: heat the pad and the leg together, feed in solder, then trim.',
    icon: 'circuit',
    focus: { pins: ['r1:1', 'r1:2'] },
    circuit: { parts: [R1, IRON, WIRE, ...RJOINTS] },
    callouts: [
      { part: 'res', icon: 'resistor', title: 'Resistor', text: 'Either way round.' },
      { part: 'rj1', icon: 'target', title: 'The joint', text: 'Shiny, volcano-shaped.' },
      { part: 'iron', icon: 'thermo', title: 'Iron', text: 'Pad and leg together.' },
    ],
    overview: [
      'Every through-hole joint follows the same rhythm, and it takes about **three seconds**:',
      { steps: [
        'Push the part through, flip the board and bend the legs out a little so it does not fall out.',
        'Touch the iron to the **pad and the leg at the same time** for one to two seconds.',
        'Feed solder into the joint (not onto the iron) until it flows around the leg and covers the pad.',
        'Take the solder away, then the iron. Do not move the part while it cools.',
        'Trim the leg just above the joint with flush cutters.',
      ] },
      { tips: [['play', 'Press Play in Try it'], ['target', 'The solder should flow by itself once the pad is hot'], ['thermo', 'More than five seconds of heat can lift a pad']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['res'], text: 'Push the **resistor** through R1 and bend the legs out underneath.' },
        { do: 'insert', parts: ['iron'], text: 'Heat the **pad and the leg** together with the iron.' },
        { do: 'insert', parts: ['wire', 'rj1'], text: 'Feed **solder** into the joint until it flows round the leg.' },
        { do: 'insert', parts: ['rj2'], text: 'Repeat for the **second leg**, then trim both.' },
      ],
    },
    kit: [['1', '330 Ω resistor', 'Orange-orange-brown bands.']],
  },

  {
    id: 'led',
    title: 'Solder the LED',
    summary: 'Get the polarity right first: long leg to +, then solder and trim.',
    icon: 'circuit',
    focus: { pins: ['d1:1', 'd1:2'] },
    circuit: { parts: [R1, ...RJOINTS, LED, ...LJOINTS] },
    callouts: [
      { part: 'led', icon: 'led', title: 'LED', text: 'Long leg to +.' },
      { pin: 'd1:1', icon: 'target', title: '+ pad', text: 'Marked on the board.' },
      { part: 'lj1', icon: 'target', title: 'Joints', text: 'Same three-second rhythm.' },
    ],
    overview: [
      'An LED only works one way round. The **long leg** is **+** (the anode) and goes into the pad marked **+**; the flat edge on the LED’s rim and the shorter leg are **−**. Check before you solder: undoing a joint is the hard part.',
      'Solder one leg first, check the LED sits straight and flat, then do the second.',
      { tips: [['play', 'Press Play in Try it'], ['led', 'Wrong way round? It just stays dark; it is rarely damaged'], ['thermo', 'LEDs dislike heat: be quick on these joints']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['led'], text: 'Push the **LED** in, long leg in the **+** pad.' },
        { do: 'insert', parts: ['lj1'], text: 'Solder **one leg**, check the LED is straight.' },
        { do: 'insert', parts: ['lj2'], text: 'Solder the **other leg** and trim both.' },
      ],
    },
    kit: [['1', '5 mm LED']],
  },

  {
    id: 'header',
    title: 'Solder header pins',
    short: 'Header pins',
    summary: 'Tack one pin, straighten the row, then solder the rest.',
    icon: 'circuit',
    focus: { pins: ['j1:1', 'j1:2', 'j1:3', 'j1:4'] },
    circuit: { parts: [R1, ...RJOINTS, LED, ...LJOINTS, HEADER, ...HJOINTS] },
    callouts: [
      { part: 'hdr', icon: 'pin', title: 'Header', text: 'Long side up.' },
      { part: 'hj1', icon: 'target', title: 'First pin', text: 'Tack it, then straighten.' },
    ],
    overview: [
      'Rows of pins are where joints go wrong: the header leans, or solder **bridges** two neighbouring pins. The trick is to **tack one end pin first**, check the header stands square, re-melt that joint to straighten it if needed, and only then solder the rest.',
      { tips: [['play', 'Press Play in Try it'], ['target', 'Hold the header with tape or a breadboard underneath'], ['info', 'Each joint needs only a little solder']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['hdr'], text: 'Push the **header** in, long pins up.' },
        { do: 'insert', parts: ['hj1'], text: '**Tack one end pin** and check the header stands square.' },
        { do: 'insert', parts: ['hj2', 'hj3', 'hj4'], text: 'Solder the **other three pins**.' },
      ],
    },
    kit: [['1', '4-pin male header']],
  },

  {
    id: 'inspect',
    title: 'Spot a bad joint',
    short: 'Inspect',
    summary: 'Shiny volcano, dull blob or bridge: what each looks like and how to fix it.',
    icon: 'circuit',
    focus: { pins: ['j1:2', 'j1:3'] },
    circuit: { parts: [R1, ...RJOINTS, LED, ...LJOINTS, HEADER, ...HJOINTS, BRIDGE] },
    callouts: [
      { part: 'rj1', icon: 'target', title: 'Good joint', text: 'Shiny, cone-shaped.' },
      { part: 'bridge', icon: 'wave', title: 'Bridge', text: 'Two pads joined: a short.' },
    ],
    overview: [
      'Look at every joint with good light (a magnifier helps). Three kinds to know:',
      { steps: [
        '**Good**: shiny, smooth and shaped like a small volcano or cone, flowing onto both the pad and the leg.',
        '**Cold or dry**: dull, grainy or balled up and not wetting the pad. Re-heat it with a touch of fresh solder.',
        '**Bridge**: solder joining two neighbouring pads. Drag the clean iron between them, or soak it up with wick.',
      ] },
      { tips: [['target', 'Click the bridge across the header pins'], ['info', 'Too little solder: the hole is not filled; add a bit'], ['thermo', 'Lead-free joints look slightly less shiny than leaded ones: that is normal']] },
    ],
    kit: [['1', 'Magnifier or phone camera']],
  },

  {
    id: 'desolder',
    title: 'Fix it with solder wick',
    short: 'Desoldering',
    summary: 'Lay wick on the bridge, press with the iron, and lift the solder away.',
    icon: 'circuit',
    focus: { pins: ['j1:2', 'j1:3'] },
    circuit: { parts: [R1, ...RJOINTS, LED, ...LJOINTS, HEADER, ...HJOINTS, BRIDGE, WICK] },
    callouts: [
      { part: 'wick', icon: 'wave', title: 'Solder wick', text: 'Copper braid soaks it up.' },
      { part: 'bridge', icon: 'target', title: 'Bridge', text: 'Gone after one pass.' },
    ],
    overview: [
      '**Solder wick** (desoldering braid) is fine copper braid with flux in it. Laid on solder and pressed with the iron, it pulls the molten solder into itself by capillary action.',
      { steps: ['Lay a clean end of wick across the bridge.', 'Press the iron on top for two or three seconds until the solder flows into the braid.', 'Lift wick and iron together, then cut off the used end.'] },
      { tips: [['play', 'Press Play in Try it'], ['thermo', 'Lift wick and iron together, or the braid solders itself on'], ['info', 'A solder sucker (pump) also works for clearing holes']] },
    ],
    sim: {
      type: 'assembly',
      mode: 'disassemble',
      steps: [
        { do: 'remove', parts: ['bridge'], text: 'Lay the **wick** on the bridge and press with the iron: the extra solder soaks into the braid.' },
        { do: 'remove', parts: ['wick'], text: 'Lift the **wick** and the iron together; trim the used end.' },
      ],
      done: 'Bridge gone: each pin has its own joint again.',
    },
    kit: [['1', 'Solder wick, 2 mm wide']],
  },

  {
    id: 'finish',
    title: 'Finish and test',
    summary: 'Add the button and battery holder, check every joint, insert the coin cell and press.',
    icon: 'circuit',
    focus: { pins: ['sw1:1', 'sw1:2', 'bt1:1', 'bt1:2'] },
    circuit: { parts: [R1, ...RJOINTS, LED, ...LJOINTS, HEADER, ...HJOINTS, BUTTON, HOLDER] },
    callouts: [
      { part: 'btn', icon: 'button', title: 'Button', text: 'Snaps in, four joints.' },
      { part: 'holder', icon: 'power', title: 'Battery holder', text: '+ matches +.' },
      { part: 'led', icon: 'led', title: 'LED', text: 'Lights while you press.' },
    ],
    overview: [
      'The last two parts use the same rhythm. Then inspect everything once more, slide a **CR2032** coin cell into the holder (+ side up, as marked), and press the button: the LED should light.',
      { h: 'LED stays dark?' },
      { steps: ['Is the LED the right way round (long leg in +)?', 'Is the battery + side matching the holder’s mark?', 'Look for a cold joint or a bridge on the button pads.'] },
      { tips: [['play', 'You have now done every kind of through-hole joint'], ['info', 'Next: try a kit with a chip socket or a small Arduino-compatible board'], ['thermo', 'Turn the iron off and let it cool in its stand']] },
    ],
    kit: [['1', '6 mm push button'], ['1', 'CR2032 holder'], ['1', 'CR2032 coin cell']],
  },
];
