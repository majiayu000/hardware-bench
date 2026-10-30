// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: Espressif ESP32-S3-DevKitC-1 v1.1 user guide (J1/J3 tables, RGB LED, USB ports) and the
// arduino-esp32 documentation (USB, touch, RGB LED).
import { BUTTON, POT, potWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-esp32-s3',
  title: 'ESP32-S3 DevKitC: USB, Touch and Colour',
  accent: '#c8372d',
  logicVolts: 3.3,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 115200 baud',
  terminalHint: 'Board connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to ESP32-S3…', 'Hard resetting via RTS pin...'],
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', analog: 'ADC and touch', strap: 'Boot pin (careful)',
  uart: 'UART0 (serial)', usb: 'USB D+ / D−', reset: 'Reset (RST)',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// ESP32-S3-DevKitC-1 v1.1 (ESP32-S3-WROOM-1), top view, millimetres, USB ports on the left and the
// module antenna on the right. Pin numbers, names and functions follow the J1 and J3 tables in
// Espressif's user guide; pin 1 of both rows is at the antenna end. The outline and small parts are
// stylised, not for mechanical design.
export const BOARD = {
  name: 'ESP32-S3-DevKitC-1',
  width: 62.7,
  depth: 25.4,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1d1d24',
  holes: [],
  silkscreen: [{ text: 'ESP32-S3-DevKitC-1', x: 21, z: 19.5, size: 1.5, align: 'center' }],
  components: [
    { id: 'module', kind: 'shield', label: 'ESP32-S3-WROOM-1 module', desc: 'The ESP32-S3 chip and flash under a metal can: two 240 MHz cores, Wi-Fi, Bluetooth LE and vector instructions that speed up small neural networks.', shape: 'box', x: 43, z: 12.7, w: 18, d: 18, h: 3.2, color: '#c8cacc', text: 'ESP32-S3', textColor: 'rgba(30,30,30,.7)' },
    { id: 'antenna', label: 'PCB antenna', desc: 'The zigzag copper trace beyond the can. Keep metal and fingers away from it for the best range.', shape: 'box', x: 58.5, z: 12.7, w: 7, d: 18, h: 0.3, color: '#16161b' },
    { id: 'usb', kind: 'usb', label: 'USB port (native)', desc: 'Goes straight to the chip’s own USB on GPIO19/20. With it the board can act as a keyboard, a disk or a MIDI device.', shape: 'box', x: 1.8, z: 7, w: 7.4, d: 7.6, h: 2.8, color: '#c3c8d0', metal: true },
    { id: 'uart', kind: 'usb', label: 'USB-to-UART port', desc: 'Goes through a bridge chip to UART0. Uploads and the Serial Monitor work here by default.', shape: 'box', x: 1.8, z: 18.4, w: 7.4, d: 7.6, h: 2.8, color: '#c3c8d0', metal: true },
    { id: 'bridge', kind: 'chip', label: 'USB-to-UART bridge', desc: 'Turns USB into the serial signals of UART0.', shape: 'box', x: 12, z: 18.4, w: 4, d: 4, h: 0.9, color: '#2a2930' },
    { id: 'rgb', kind: 'ledsmd', accent: '#ff5a4a', label: 'RGB LED (GPIO38)', desc: 'An addressable LED on GPIO38 on v1.1 boards. The first version of the board used GPIO48.', shape: 'box', x: 27, z: 7, w: 2, d: 2, h: 0.8, color: '#f1ece2' },
    { id: 'boot', kind: 'button', label: 'Boot button', desc: 'Wired to GPIO0. Hold it and tap Reset to enter firmware download mode.', shape: 'box', x: 12, z: 6, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'reset', kind: 'button', label: 'Reset button', desc: 'Restarts the chip and your program.', shape: 'box', x: 20, z: 6, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'ldo', kind: 'chip', label: '3.3 V regulator', desc: 'Turns the 5 V from USB into the 3.3 V the chip runs on.', shape: 'box', x: 21, z: 13, w: 4, d: 3, h: 1, color: '#2a2930' },
  ],
  headers: [
    { id: 'j1', label: 'J1 header (3V3 … G)', short: 'J1', desc: 'The 22-pin row along the top edge. Pin 1 (3V3) is at the antenna end. It holds most of the touch and ADC pins.', z: 1.27,
      pins: pinTable('3V3|3.3 V power|power3; 3V3|3.3 V power|power3; RST|EN|reset; 4|GPIO4, TOUCH4, ADC1_CH3|analog; 5|GPIO5, TOUCH5, ADC1_CH4|analog; 6|GPIO6, TOUCH6, ADC1_CH5|analog; 7|GPIO7, TOUCH7, ADC1_CH6|analog; 15|GPIO15, ADC2_CH4|gpio; 16|GPIO16, ADC2_CH5|gpio; 17|GPIO17, U1TXD|gpio; 18|GPIO18, U1RXD|gpio; 8|GPIO8, TOUCH8, ADC1_CH7|analog; 3|GPIO3, TOUCH3, ADC1_CH2|strap; 46|GPIO46|strap; 9|GPIO9, TOUCH9, ADC1_CH8|analog; 10|GPIO10, TOUCH10, ADC1_CH9|analog; 11|GPIO11, TOUCH11|gpio; 12|GPIO12, TOUCH12|gpio; 13|GPIO13, TOUCH13|gpio; 14|GPIO14, TOUCH14|gpio; 5V|5 V power|power5; G|Ground|gnd') },
    { id: 'j3', label: 'J3 header (G … G)', short: 'J3', desc: 'The 22-pin row along the bottom edge. Pin 1 (G) is at the antenna end. Avoid TX/RX and the USB pins 19 and 20.', z: 24.13,
      pins: pinTable('G|Ground|gnd; TX|GPIO43, U0TXD|uart; RX|GPIO44, U0RXD|uart; 1|GPIO1, TOUCH1, ADC1_CH0|analog; 2|GPIO2, TOUCH2, ADC1_CH1|analog; 42|GPIO42|gpio; 41|GPIO41|gpio; 40|GPIO40|gpio; 39|GPIO39|gpio; 38|GPIO38, RGB LED|gpio; 37|GPIO37|gpio; 36|GPIO36|gpio; 35|GPIO35|gpio; 0|GPIO0, Boot|strap; 45|GPIO45|strap; 48|GPIO48|gpio; 47|GPIO47|gpio; 21|GPIO21|gpio; 20|GPIO20, USB D+|usb; 19|GPIO19, USB D−|usb; G|Ground|gnd; G|Ground|gnd') },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, x: 58, step: [-2.54, 0], ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of J3.
const BB = { x: -14, z: 32 };
const UPLOAD = (sketch, opts = '') => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn esp32:esp32:esp32s3${opts} ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the ESP32-S3',
    short: 'Meet the board',
    summary: 'Two 240 MHz cores, Wi-Fi, 14 touch pins, real USB and an RGB LED on one board.',
    icon: 'board',
    focus: { components: ['module'] },
    callouts: [
      { component: 'module', icon: 'wifi', title: 'ESP32-S3 module', text: 'Two cores, Wi-Fi, Bluetooth LE.' },
      { component: 'usb', icon: 'usb', title: 'Native USB', text: 'Can act as a keyboard or a disk.' },
      { component: 'uart', icon: 'usb', title: 'UART USB', text: 'Uploads and the Serial Monitor.' },
      { component: 'rgb', icon: 'led', title: 'RGB LED', text: 'GPIO38 on v1.1 boards.' },
    ],
    overview: [
      'The **ESP32-S3** is the ESP32 family’s general-purpose chip for USB and small AI jobs. Where the original ESP32 needs a separate chip to reach USB, this one has **USB on the chip**, so the board can appear to your computer as a keyboard, a disk or a MIDI device.',
      'This board has two USB ports. Use the **USB-to-UART** port for uploads, and the **native USB** port when your sketch is the USB device.',
      { tips: [['target', 'Click a pin to see what it can do'], ['usb', 'Either port powers the board'], ['info', 'Check your board version: v1.0 has the LED on GPIO48']] },
      { h: 'Specifications' },
      { specs: [['Chip', 'ESP32-S3, dual-core Xtensa LX7, 240 MHz'], ['Wireless', '2.4 GHz Wi-Fi, Bluetooth LE'], ['USB', 'Native USB OTG, plus a USB-to-UART port'], ['Touch', '14 capacitive inputs'], ['Logic', '3.3 V'], ['RGB LED', 'Addressable, GPIO38 (v1.1)']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'ESP32-S3-DevKitC-1'], ['1', 'USB data cable'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit']],
  },

  {
    id: 'setup',
    title: 'Set up the Arduino IDE',
    summary: 'Install Espressif’s board package, pick **ESP32S3 Dev Module** and upload.',
    icon: 'board',
    focus: { components: ['uart', 'boot', 'reset'] },
    callouts: [
      { component: 'uart', icon: 'usb', title: 'UART port', text: 'Plug in here for uploads.' },
      { component: 'boot', icon: 'button', title: 'Boot', text: 'Hold it if an upload will not start.' },
      { component: 'reset', icon: 'button', title: 'Reset', text: 'Restarts your sketch.' },
    ],
    overview: [
      { steps: [
        'In the Arduino IDE open **Preferences** and add Espressif’s board-manager URL (see Try it).',
        'In **Boards Manager** install **esp32 by Espressif Systems**.',
        'Choose **Tools → Board → esp32 → ESP32S3 Dev Module**.',
        'Plug into the **UART** port, choose the port and upload.',
      ] },
      { note: 'If the upload cannot connect, hold **Boot**, tap **Reset**, release **Boot** and try again.' },
      { tips: [['usb', 'Plug in before choosing the port'], ['terminal', 'Click the commands in Try it'], ['clock', 'The first compile takes a while']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli config add board_manager.additional_urls https://espressif.github.io/arduino-esp32/package_esp32_index.json', note: 'add Espressif’s board list', out: [] },
        { cmd: 'arduino-cli core update-index && arduino-cli core install esp32:esp32', note: 'install the ESP32 core', out: ['Platform esp32:esp32 installed'] },
        { cmd: 'arduino-cli board list', note: 'find the board', out: ['/dev/ttyACM0  serial  Serial Port (USB)'] },
      ],
    },
    kit: [['1', 'Computer with the Arduino IDE or arduino-cli']],
  },

  {
    id: 'rgb',
    title: 'Colours on the RGB LED',
    short: 'RGB LED',
    summary: 'The LED on the board mixes any colour from one data pin, with no wiring at all.',
    icon: { glyph: 'wave' },
    focus: { components: ['rgb'], pins: ['j3:10'] },
    callouts: [
      { component: 'rgb', icon: 'led', title: 'RGB LED', text: 'Three LEDs and a tiny controller.' },
      { pin: 'j3:10', icon: 'pin', title: 'GPIO38', text: 'One wire carries all the colours.' },
    ],
    overview: [
      'This is an **addressable** LED: a tiny controller inside receives colour values as a fast stream of pulses on a single pin. `rgbLedWrite()` sends the three values, each from 0 to 255.',
      { tips: [['led', 'Keep values low: 40 is already bright'], ['code', 'Change `RGB_PIN` to 48 on a v1.0 board'], ['knob', 'Drag the sliders in Try it to mix a colour']] },
    ],
    wiring: [{ pin: 'j3:10', to: 'On-board RGB LED, no wiring needed' }],
    code: [{ file: 'colours.ino', lang: 'cpp', trace: { set: 9 }, source: `
const int RGB_PIN = 38;   // 48 on v1.0 boards

const byte COLOURS[][3] = { {40, 0, 0}, {0, 40, 0}, {0, 0, 40}, {30, 12, 0} };

void setup() {}

void loop() {
  for (auto &c : COLOURS) {
    rgbLedWrite(RGB_PIN, c[0], c[1], c[2]);
    delay(1000);
  }
}
` }],
    sim: { type: 'rgb', scale: 255, repl: 'rgbLedWrite(RGB_PIN, {r}, {g}, {b})', log: '{name}', sequence: [['red', [0.16, 0, 0]], ['green', [0, 0.16, 0]], ['blue', [0, 0, 0.16]], ['amber', [0.12, 0.05, 0]]] },
    run: { cmd: UPLOAD('colours'), stop: [] },
  },

  {
    id: 'touch',
    title: 'Touch without a button',
    short: 'Touch a wire',
    summary: 'A bare jumper wire on GPIO4 works as a touch button: `touchRead()` sees your finger.',
    icon: { type: 'button' },
    focus: { pins: ['j1:4'] },
    callouts: [{ pin: 'j1:4', icon: 'pin', title: 'GPIO4 · TOUCH4', text: 'Put a wire here and touch its end.' }],
    overview: [
      'Your body adds capacitance to any wire you touch. The S3’s touch sensors measure it, so no button, resistor or ground wire is needed. Fourteen pins can do this.',
      'On the S3 the reading **rises** when touched (on the original ESP32 it falls). Print a few values, then pick a threshold between "not touched" and "touched".',
      { tips: [['code', 'Readings differ between boards: measure yours'], ['target', 'Foil or a coin makes a bigger touch pad'], ['info', 'Long wires pick up more noise']] },
    ],
    wiring: [{ pin: 'j1:4', to: 'A jumper wire with its other end free' }],
    code: [{ file: 'touch.ino', lang: 'cpp', trace: { read: 6 }, source: `
void setup() {
  Serial.begin(115200);
}

void loop() {
  uint32_t value = touchRead(T4);
  Serial.println(value);
  delay(200);
}
` }],
    sim: { type: 'knob', label: 'Touch reading', readout: 'raw', max: 100000, vmax: 3.3, every: 0.5, slider: 'Finger pressure', log: '{raw}', caption: 'Press Run, then drag the slider to stand in for your finger.' },
    run: { cmd: UPLOAD('touch'), stop: [] },
    kit: [['1', 'Jumper wire']],
  },

  {
    id: 'keyboard',
    title: 'Be a USB keyboard',
    short: 'USB keyboard',
    summary: 'With the native USB port, a press of the Boot button types a line on your computer.',
    icon: { glyph: 'usb' },
    focus: { components: ['usb', 'boot'], pins: ['j3:14', 'j3:1'] },
    circuit: { breadboard: BB, parts: [BUTTON], wires: [{ from: 'j3:14', to: 'bb:a20', color: '#3b78d6' }, { from: 'bb:a22', to: 'bb:tn22', color: '#2b2a30' }, { from: 'j3:1', to: 'bb:tn1', color: '#2b2a30' }] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'Native USB', text: 'Plug into your computer here.' },
      { component: 'boot', icon: 'button', title: 'Boot', text: 'Also GPIO0: no parts needed.' },
      { part: 'btn1', icon: 'button', title: 'Or a button', text: 'Wired to the same GPIO0.' },
    ],
    overview: [
      'This is the job the original ESP32 cannot do. The S3’s USB hardware lets your sketch tell the computer "I am a keyboard", so it needs no driver and works everywhere a keyboard does.',
      { steps: ['Upload the sketch through the **UART** port.', 'Move the cable to the **native USB** port, or plug both in.', 'Click into an empty text editor and press the button.'] },
      { tips: [['usb', 'Tools → USB Mode: USB-OTG (TinyUSB)'], ['code', '`Keyboard.print()` types whole strings'], ['info', 'Macro pads and stream decks work like this']] },
      { note: 'A sketch that types by itself can take over your computer. Only type when a button is pressed, and keep a way to stop it.', tone: 'warn' },
    ],
    wiring: [{ pin: 'j3:14', to: 'Column 20, one side of the button (optional)' }, { pin: 'j3:1', to: 'Top **−** rail → other side of the button' }],
    code: [{ file: 'keyboard.ino', lang: 'cpp', trace: { wait: 14, pressed: 15, released: 16 }, source: `
#include <USB.h>
#include <USBHIDKeyboard.h>

USBHIDKeyboard Keyboard;
const int BUTTON_PIN = 0;   // the Boot button

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Keyboard.begin();
  USB.begin();
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    Keyboard.println("Hello from the ESP32-S3");
    delay(500);
  }
}
` }],
    sim: { type: 'button', button: 'btn1', label: 'Keyboard line' },
    run: { cmd: UPLOAD('keyboard', ':USBMode=default'), stop: [] },
    kit: [['1', 'Tactile push button', 'Optional: Boot does the same job.'], ['3', 'Jumper wires']],
  },

  {
    id: 'knob',
    title: 'Read a knob',
    summary: 'A potentiometer on GPIO1 and the 12-bit ADC give readings from 0 to 4095.',
    icon: { type: 'pot' },
    focus: { pins: ['j3:4', 'j1:1', 'j3:1'] },
    circuit: { breadboard: BB, parts: [POT], wires: potWires('j3:4', 'j1:1', 'j3:1') },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'j3:4', icon: 'wave', title: 'GPIO1', text: 'ADC1: works alongside Wi-Fi.' },
      { pin: 'j1:1', icon: 'power', title: '3V3', text: 'Feeds the + rail. Not 5 V!' },
    ],
    overview: [
      'Use **ADC1** pins (GPIO1–10) for analog readings. ADC2 pins stop working while Wi-Fi is on. `analogReadMilliVolts()` applies the chip’s stored calibration, which makes it more accurate than converting the raw number yourself.',
      { tips: [['knob', 'Click the knob in the 3D view'], ['wave', '12 bits: 4096 steps'], ['power', 'The rails carry 3.3 V in this lesson']] },
    ],
    wiring: [{ pin: 'j1:1', to: '+ rail → potentiometer outer leg' }, { pin: 'j3:4', to: 'Potentiometer **middle leg**' }, { pin: 'j3:1', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'knob.ino', lang: 'cpp', trace: { read: 6 }, source: `
void setup() {
  Serial.begin(115200);
}

void loop() {
  int raw = analogRead(1);
  int mv = analogReadMilliVolts(1);
  Serial.printf("raw: %d  voltage: %d mV\\n", raw, mv);
  delay(500);
}
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'GPIO1 voltage', vmax: 3.3, max: 4095, every: 0.5 },
    run: { cmd: UPLOAD('knob'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },
];
