// Everything specific to this board lives in this file: site metadata, the 3D board model and the
// lessons. The engine is generic.
// Sources: Sipeed Tang Nano 9K wiki and the official TangNano-9K-example repository (the `led` and
// `uart` projects: LED, button and clock pins, active-low LEDs). The two 24-pin headers are not
// modelled pin by pin because these lessons use only the parts on the board.

export const SITE = {
  id: 'learn-tang-nano-9k',
  title: 'Tang Nano 9K: Describe Hardware with Verilog',
  accent: '#c0392b',
  logicVolts: 3.3,
  shell: 'Gowin EDA · programmer',
  terminalHint: 'Board connected over USB. Press Run to build and program the FPGA.',
  runPreamble: ['Synthesizing…', 'Placing and routing…', 'Programming the FPGA…'],
};

export const PIN_TYPES = {};

// Tang Nano 9K, top view, millimetres, USB-C on the left, about 69 × 25 mm. Part positions are taken
// from photos and are stylised. There is one small block per user LED so a sim can light each one.
const LED_X = [46, 49, 52, 55, 58, 61];
export const BOARD = {
  name: 'Tang Nano 9K',
  width: 69,
  depth: 25,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1a1a1e',
  holes: [],
  silkscreen: [{ text: 'Tang Nano 9K', x: 53, z: 6, size: 1.7, weight: 700, align: 'center' }, { text: 'LED0–5', x: 53, z: 20.5, size: 1.1, align: 'center' }],
  components: [
    { id: 'fpga', kind: 'chip', label: 'Gowin GW1NR-9 FPGA', desc: 'Not a processor but 8640 lookup tables and flip-flops, joined by routing that you configure. It becomes whatever circuit you describe.', shape: 'box', x: 34, z: 12.5, w: 11, d: 11, h: 1.2, color: '#2a2930', text: 'GW1NR-9', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power and programming, through the on-board debugger chip.', shape: 'box', x: 2.4, z: 12.5, w: 7.4, d: 9, h: 3.2, color: '#c3c8d0', metal: true },
    { id: 'debug', kind: 'chip', label: 'USB debugger chip', desc: 'Loads your design into the FPGA over JTAG, and passes serial data to your computer.', shape: 'box', x: 12, z: 12.5, w: 5, d: 5, h: 0.9, color: '#2a2930' },
    { id: 'osc', kind: 'chip', label: '27 MHz oscillator', desc: 'The clock on pin 52. Everything that happens in time counts these ticks.', shape: 'box', x: 22, z: 6, w: 3.2, d: 2.5, h: 1, color: '#c8cacc', metal: true },
    { id: 's1', kind: 'button', label: 'S1 button (pin 4)', desc: 'User button on pin 4. It reads 0 while pressed.', shape: 'box', x: 20, z: 21, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 's2', kind: 'button', label: 'S2 button (pin 3)', desc: 'User button on pin 3. It reads 0 while pressed.', shape: 'box', x: 28, z: 21, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'leds', label: 'LED0–LED5', desc: 'Six user LEDs on pins 10, 11, 13, 14, 15 and 16. They are active-low: writing 0 turns one on.', shape: 'box', x: 53.5, z: 17, w: 18, d: 1.4, h: 0.4, color: '#f1ece2' },
    { id: 'sd', label: 'microSD slot', desc: 'On the underside, for designs that read files.', shape: 'box', x: 58, z: 12, w: 12, d: 12, h: 1.4, color: '#c3c6ca', under: true },
  ],
  headers: [],
};

// ---------- shared circuit pieces ----------
// `shown` is the LED's glow: on when the pin is driven to 0.
const LEDS = LED_X.map((x, i) => ({ id: `l${i}`, type: 'block', at: { x, z: 17 }, w: 2, d: 1.2, h: 0.6, y: 0.4, color: '#ff3b30', label: `LED${i}`, desc: `Lights when the FPGA drives its pin to 0.`, state: { shown: false } }));
const lit = (mask) => Object.fromEntries(LED_X.map((_, i) => [`l${i}`, { shown: Boolean(mask & (1 << i)) }]));
const LED_CIRCUIT = { parts: LEDS };
const PROGRAM = (project) => `openFPGALoader -b tangnano9k impl/pnr/${project}.fs`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the FPGA',
    short: 'Meet the board',
    summary: 'A chip with no program: you describe a circuit, and its logic rewires itself to become it.',
    icon: 'board',
    focus: { components: ['fpga'] },
    callouts: [
      { component: 'fpga', icon: 'chip', title: 'GW1NR-9', text: '8640 lookup tables.' },
      { component: 'osc', icon: 'clock', title: '27 MHz clock', text: 'The heartbeat, on pin 52.' },
      { component: 'leds', icon: 'led', title: 'Six LEDs', text: 'Active-low.' },
      { component: 's1', icon: 'button', title: 'S1 and S2', text: 'User buttons on pins 4 and 3.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Power and programming.' },
    ],
    overview: [
      'A microcontroller runs one instruction after another. An **FPGA** runs no instructions. It holds thousands of small logic blocks, and you connect them to build a circuit. Every part of that circuit works **at the same time**, so ten things can happen on the same clock tick.',
      'You describe the circuit in a **hardware description language**, here **Verilog**. It looks like code, but it does not run from top to bottom: each line is a piece of hardware that always exists.',
      { tips: [['chip', 'Click the parts of the board'], ['code', 'Think in wires and registers, not steps'], ['clock', 'Nearly everything happens on a clock edge']] },
      { h: 'Specifications' },
      { specs: [['FPGA', 'Gowin GW1NR-9'], ['Logic', '8640 lookup tables'], ['Clock', '27 MHz, 2 PLLs'], ['User I/O', '6 LEDs, 2 buttons'], ['Programmer', 'On board, over USB-C'], ['Extras', 'HDMI, microSD, LCD and flash connectors']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Sipeed Tang Nano 9K'], ['1', 'USB-C data cable']],
  },

  {
    id: 'setup',
    title: 'Install the tools',
    summary: 'Gowin EDA turns Verilog into a bitstream, and the programmer loads it into the chip.',
    icon: 'board',
    focus: { components: ['usb', 'debug', 'fpga'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Use a cable that carries data.' },
      { component: 'debug', icon: 'chip', title: 'Debugger', text: 'Loads the bitstream.' },
      { component: 'fpga', icon: 'chip', title: 'FPGA', text: 'Becomes your circuit.' },
    ],
    overview: [
      { steps: [
        'Install **Gowin EDA** from Gowin’s site. The Education edition needs no licence file.',
        'Create a project for device **GW1NR-LV9QN88PC6/I5**, the part on this board.',
        'Add your `.v` file and a `.cst` constraints file.',
        'Click **Run All** to build, then load the `.fs` file with the **Programmer** or `openFPGALoader`.',
      ] },
      'A build has three stages. **Synthesis** turns Verilog into logic gates, **place and route** chooses which blocks and wires to use, and the result is a **bitstream** that configures the chip.',
      { note: 'Loading to **SRAM** is quick but forgotten at power-off. Writing to **flash** keeps the design.' },
      { tips: [['terminal', 'Click the commands in Try it'], ['clock', 'A build takes seconds to minutes'], ['info', 'Check the device name printed on your chip']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'openFPGALoader --detect', note: 'find the board', out: ['index 0:', '  model GW1N(R)-9C'] },
        { cmd: PROGRAM('blink'), note: 'load into SRAM', out: ['Load SRAM: DONE'] },
        { cmd: `openFPGALoader -b tangnano9k -f impl/pnr/blink.fs`, note: 'write to flash', out: ['Write Flash: DONE'] },
      ],
    },
    kit: [['1', 'Computer running Windows or Linux']],
  },

  {
    id: 'blink',
    title: 'Blink with a counter',
    short: 'Blink an LED',
    summary: 'There is no `delay()` in hardware: a counter divides the 27 MHz clock down to a blink.',
    icon: { type: 'led', color: 'red' },
    focus: { components: ['leds', 'osc'] },
    circuit: LED_CIRCUIT,
    callouts: [
      { component: 'osc', icon: 'clock', title: '27 MHz', text: 'Ticks 27 million times a second.' },
      { part: 'l0', icon: 'led', title: 'LED0', text: 'Pin 10, lit by a 0.' },
    ],
    overview: [
      'A **register** stores a value and updates only on a clock edge. This one counts ticks. When it reaches 13 499 999, half a second has passed, so it restarts and flips the LED.',
      'The `<=` sign means every register in the block updates together on the edge, using the values from before it. That is what "at the same time" means in hardware.',
      'The `.cst` file connects the names in your Verilog to physical pins.',
      { tips: [['code', '`13_499_999` is 13.5 million ticks, less one'], ['clock', 'Change the number to change the speed'], ['info', 'Error PR2017: set the pin as regular I/O under Dual-Purpose Pin']] },
    ],
    code: [
      { file: 'blink.v', lang: 'verilog', trace: { on: 10, off: 10 }, source: `
module blink (
    input  wire clk,   // 27 MHz
    output reg  led    // 0 = lit
);
    reg [23:0] counter = 0;

    always @(posedge clk) begin
        if (counter == 13_499_999) begin
            counter <= 0;
            led <= ~led;
        end else begin
            counter <= counter + 1;
        end
    end
endmodule
` },
      { file: 'blink.cst', lang: 'text', source: `
IO_LOC "clk" 52;
IO_PORT "clk" IO_TYPE=LVCMOS33 PULL_MODE=UP;
IO_LOC "led" 10;
IO_PORT "led" PULL_MODE=UP DRIVE=8;
` },
    ],
    sim: { type: 'sequence', caption: 'Press Run: the counter overflows every half second and LED0 flips.', rest: lit(0), steps: [{ set: lit(1), ms: 500, log: 'led <= 0: on', trace: 'on' }, { set: lit(0), ms: 500, log: 'led <= 1: off', trace: 'off' }] },
    run: { cmd: PROGRAM('blink'), file: 'blink.v', stop: [] },
  },

  {
    id: 'run',
    title: 'Running lights',
    short: 'Running lights',
    summary: 'Sipeed’s example rotates a single lit LED around all six, using one shift register.',
    icon: 'circuit',
    focus: { components: ['leds', 's1'] },
    circuit: LED_CIRCUIT,
    callouts: [
      { component: 'leds', icon: 'led', title: 'Six LEDs', text: 'One bit each.' },
      { component: 's1', icon: 'button', title: 'S1 resets', text: 'Pin 4, active-low.' },
    ],
    overview: [
      'Now `led` is six bits wide. `{led[4:0], led[5]}` joins two slices of wires into a new value, moving every bit one place along and the top bit round to the bottom. It costs no logic: just wires connected a different way.',
      '`sys_rst_n` restarts the pattern. The `_n` is a habit that marks an active-low signal: this one means reset when the button pulls it to 0.',
      { tips: [['code', '`6\'b111110` is six bits: only LED0 lit'], ['button', 'S1 restarts the pattern'], ['target', 'Try two zeros for two lit LEDs']] },
    ],
    code: [
      { file: 'led.v', lang: 'verilog', trace: { shift: 21 }, source: `
module led (
    input sys_clk,
    input sys_rst_n,
    output reg [5:0] led
);
    reg [23:0] counter;

    always @(posedge sys_clk or negedge sys_rst_n) begin
        if (!sys_rst_n)
            counter <= 24'd0;
        else if (counter < 24'd1349_9999)
            counter <= counter + 1'd1;
        else
            counter <= 24'd0;
    end

    always @(posedge sys_clk or negedge sys_rst_n) begin
        if (!sys_rst_n)
            led <= 6'b111110;
        else if (counter == 24'd1349_9999)
            led[5:0] <= {led[4:0], led[5]};
    end
endmodule
` },
      { file: 'led.cst', lang: 'text', source: `
IO_LOC "led[5]" 16;
IO_LOC "led[4]" 15;
IO_LOC "led[3]" 14;
IO_LOC "led[2]" 13;
IO_LOC "led[1]" 11;
IO_LOC "led[0]" 10;
IO_LOC "sys_rst_n" 4;
IO_LOC "sys_clk" 52;
` },
    ],
    sim: { type: 'sequence', caption: 'Press Run: one zero bit walks around the six LEDs.', rest: lit(0), steps: [0, 1, 2, 3, 4, 5].map((i) => ({ set: lit(1 << i), ms: 400, log: `led = ${(0b111111 ^ (1 << i)).toString(2).padStart(6, '0')}`, trace: 'shift' })) },
    run: { cmd: PROGRAM('led'), file: 'led.v', stop: [] },
  },

  {
    id: 'button',
    title: 'Logic with no clock',
    short: 'Button logic',
    summary: 'An `assign` is a plain wire: the LED follows the buttons instantly, with no clock at all.',
    icon: { type: 'button' },
    focus: { components: ['s1', 's2', 'leds'] },
    circuit: LED_CIRCUIT,
    callouts: [
      { component: 's1', icon: 'button', title: 'S1', text: 'Pin 4.' },
      { component: 's2', icon: 'button', title: 'S2', text: 'Pin 3.' },
      { part: 'l0', icon: 'led', title: 'LED0', text: 'Both buttons together.' },
      { part: 'l1', icon: 'led', title: 'LED1', text: 'Either button.' },
    ],
    overview: [
      'This design has no clock and no registers. `assign` joins gates with wires, so the outputs change the moment the inputs do. This is **combinational** logic, the other half of digital design.',
      'Buttons and LEDs are both active-low, so a 0 means "pressed" and a 0 means "lit". That makes **OR** act as "both pressed" and **AND** as "either pressed". Work through the truth table to see why.',
      { tips: [['code', '`&` is AND, `|` is OR, `~` is NOT'], ['button', 'Each `assign` is a separate gate'], ['target', 'Try `~s1` to invert a button']] },
    ],
    code: [
      { file: 'gates.v', lang: 'verilog', trace: { both: 5, either: 6 }, source: `
module gates (
    input  wire s1, s2,        // 0 = pressed
    output wire [1:0] led      // 0 = lit
);
    assign led[0] = s1 | s2;   // lit when both are pressed
    assign led[1] = s1 & s2;   // lit when either is pressed
endmodule
` },
      { file: 'gates.cst', lang: 'text', source: `
IO_LOC "s1" 4;
IO_LOC "s2" 3;
IO_LOC "led[0]" 10;
IO_LOC "led[1]" 11;
` },
    ],
    sim: { type: 'sequence', caption: 'Press Run: the design tries each button combination.', rest: lit(0), steps: [
      { set: lit(0), ms: 1200, log: 'no buttons pressed: both LEDs off' },
      { set: lit(2), ms: 1200, log: 'S1 pressed: LED1 lit', trace: 'either' },
      { set: lit(2), ms: 1200, log: 'S2 pressed: LED1 lit', trace: 'either' },
      { set: lit(3), ms: 1200, log: 'S1 and S2 pressed: LED0 and LED1 lit', trace: 'both' },
    ] },
    run: { cmd: PROGRAM('gates'), file: 'gates.v', stop: [] },
  },
];
