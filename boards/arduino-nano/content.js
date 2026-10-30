// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: Arduino Nano documentation and the ArduinoCore-avr `eightanaloginputs` variant.
import { ledParts, ledWires, BUTTON, buttonWires, POT, potWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-arduino-nano',
  title: 'Arduino Nano: The Uno for Breadboards',
  accent: '#1f8a9e',
  logicVolts: 5,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Nano connected on /dev/ttyUSB0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Arduino Nano…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', pwm: 'Digital I/O with PWM (~)',
  analog: 'Analog input', uart: 'Serial', i2c: 'I²C', spi: 'SPI', reset: 'Reset',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Arduino Nano (ATmega328P), top view, millimetres, Mini-B USB on the left, 45 × 18 mm, rows 15.24 mm
// apart. Pin order follows the Nano pinout; the parts on the board are stylised.
export const BOARD = {
  name: 'Arduino Nano',
  width: 45,
  depth: 18,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1c5f8a',
  holes: [{ x: 1.8, z: 1.8, r: 0.8 }, { x: 43.2, z: 1.8, r: 0.8 }, { x: 1.8, z: 16.2, r: 0.8 }, { x: 43.2, z: 16.2, r: 0.8 }],
  silkscreen: [{ text: 'NANO', x: 34, z: 13, size: 1.8, weight: 700, align: 'center' }],
  components: [
    { id: 'mcu', kind: 'chip', label: 'ATmega328P microcontroller', desc: 'The brain: the same 8-bit chip at 16 MHz as the Uno, in a flat package, with 32 KB of flash and 2 KB of RAM.', shape: 'box', x: 26, z: 9, w: 7.5, d: 7.5, h: 1.1, color: '#2a2930', text: 'ATMEGA328P', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'usb', kind: 'usb', label: 'Mini-B USB port', desc: 'Uploads, serial and 5 V power.', shape: 'box', x: 1.6, z: 9, w: 9, d: 8, h: 4, color: '#c3c8d0', metal: true },
    { id: 'usbchip', kind: 'chip', label: 'USB-to-serial chip', desc: 'FT232 on original boards. Clones usually carry a CH340, which may need a driver.', shape: 'box', x: 13, z: 9, w: 5, d: 5, h: 0.9, color: '#2a2930' },
    { id: 'reset', kind: 'button', label: 'Reset button', desc: 'Restarts your sketch from the top of setup().', shape: 'box', x: 34, z: 5, w: 3.6, d: 3, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'ledL', kind: 'ledsmd', accent: '#ffb02e', label: 'L LED', desc: 'Built-in LED wired to D13: the Blink example flashes it.', shape: 'box', x: 18, z: 3.8, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'pwr', kind: 'ledsmd', accent: '#3fe06b', lit: true, label: 'Power LED', desc: 'Lights whenever the board has power.', shape: 'box', x: 18, z: 14.2, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'icsp', label: 'ICSP pads', desc: 'Six pads for an external programmer. You won’t need them here.', shape: 'box', x: 41, z: 9, w: 5, d: 7.5, h: 0.4, color: '#2a2930' },
  ],
  headers: [
    { id: 'digital', label: 'Digital header', short: 'D', desc: 'D12 down to D2, then GND, RST and the serial pins. It runs along the front in the 3D view.',
      pins: pinTable('D12|MISO|spi; D11|~PWM, MOSI|pwm; D10|~PWM, SS|pwm; D9|~PWM|pwm; D8||gpio; D7||gpio; D6|~PWM|pwm; D5|~PWM|pwm; D4||gpio; D3|~PWM, interrupt|pwm; D2|interrupt|gpio; GND||gnd; RST|reset|reset; RX0|D0, upload|uart; TX1|D1, upload|uart'),
      x: 4.72, z: 16.62 },
    { id: 'analog', label: 'Analog header', short: 'A', desc: 'D13, the eight analog inputs and the power pins. A4 and A5 are the I²C pins; A6 and A7 are analog only.',
      pins: pinTable('D13|SCK, L LED|spi; 3V3|3.3 V out|power3; REF|AREF|analog; A0||analog; A1||analog; A2||analog; A3||analog; A4|SDA (I²C)|i2c; A5|SCL (I²C)|i2c; A6|analog only|analog; A7|analog only|analog; 5V||power5; RST|reset|reset; GND||gnd; VIN|7–12 V in|power5'),
      x: 4.72, z: 1.38 },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, step: [2.54, 0], ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of the board, the digital header facing its a–e rows.
const BB = { x: -13.98, z: 28 };
const GND = 'digital:12';
const LED_WIRING = [{ pin: 'digital:8', to: '220 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }];
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyUSB0 --fqbn arduino:avr:nano:cpu=atmega328 ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Nano',
    short: 'Meet the board',
    summary: 'The Uno’s chip on a board small enough to plug straight into a breadboard.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'ATmega328P', text: 'The same chip as the Uno.' },
      { component: 'usb', icon: 'usb', title: 'Mini-B USB', text: 'Uploads and power.' },
      { pin: 'analog:12', icon: 'power', title: '5V', text: 'Power for your circuit.' },
      { pin: 'digital:11', icon: 'pin', title: 'D2', text: 'Digital pins run along this side.' },
    ],
    overview: [
      'The **Nano** does what an **Uno** does, on a board about a third of the size. Because its pins point down, it sits across the centre channel of a breadboard and every pin gets its own column. For a finished project it can be soldered in place.',
      'Sketches, libraries and pin numbers are the same as on the Uno, and it adds two analog-only inputs, **A6** and **A7**.',
      { tips: [['target', 'Click a pin to see what it can do'], ['code', 'Uno sketches work without changes'], ['info', 'Most Nanos are compatible clones']] },
      { h: 'Specifications' },
      { specs: [['Microcontroller', 'ATmega328P, 16 MHz'], ['Memory', '32 KB flash, 2 KB SRAM, 1 KB EEPROM'], ['Logic', '5 V'], ['Digital pins', '14, of which 6 have PWM'], ['Analog inputs', '8, 10-bit'], ['USB', 'Mini-B']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Arduino Nano (or a compatible board)'], ['1', 'USB-A to Mini-B cable', 'Must carry data.'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit']],
  },

  {
    id: 'setup',
    title: 'Choose the right bootloader',
    short: 'Set up the IDE',
    summary: 'Pick **Arduino Nano**, then the processor option that matches your board.',
    icon: 'board',
    focus: { components: ['usb', 'usbchip', 'ledL'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB', text: 'Use a cable that carries data.' },
      { component: 'usbchip', icon: 'chip', title: 'USB chip', text: 'CH340 clones may need a driver.' },
      { component: 'ledL', icon: 'led', title: 'L LED', text: 'Blink flashes it.' },
    ],
    overview: [
      { steps: [
        'Choose **Tools → Board → Arduino AVR Boards → Arduino Nano**.',
        'Choose the port. If none appears on a clone, install the **CH340** driver.',
        'Under **Tools → Processor** pick **ATmega328P**.',
        'Open **File → Examples → 01.Basics → Blink** and upload.',
      ] },
      'If the upload fails with `not in sync`, your board has the older bootloader: change the processor to **ATmega328P (Old Bootloader)** and try again. Many clones need this.',
      { tips: [['usb', 'Plug in before choosing the port'], ['terminal', 'Click the commands in Try it'], ['info', 'The two options differ only in upload speed']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli core install arduino:avr', note: 'install the AVR core', out: ['Platform arduino:avr installed'] },
        { cmd: UPLOAD('Blink'), note: 'upload with the new bootloader', out: ['Sketch uses … bytes of program storage space.'] },
        { cmd: 'arduino-cli compile --upload -p /dev/ttyUSB0 --fqbn arduino:avr:nano:cpu=atmega328old Blink', note: 'upload with the old bootloader', out: ['Sketch uses … bytes of program storage space.'] },
      ],
    },
    kit: [['1', 'Computer with the Arduino IDE or arduino-cli']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'An LED with a resistor on D5 blinks once a second.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['digital:8', GND] },
    circuit: { breadboard: BB, parts: ledParts(), wires: ledWires('digital:8', GND) },
    callouts: [
      { pin: 'digital:8', icon: 'pin', title: 'D5', text: 'Your sketch switches it.' },
      { pin: GND, icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while D5 is HIGH.' },
    ],
    overview: [
      'HIGH on a Nano is **5 V**, so the resistor matters: without it the LED and the pin can be damaged. At 220 Ω a red LED draws about 14 mA, well inside the pin’s 20 mA.',
      { tips: [['led', '`LED_BUILTIN` is the L LED on D13'], ['resistor', 'Try 470 Ω: dimmer, still visible'], ['code', 'The sketch is the same as on an Uno']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.ino', lang: 'cpp', trace: { on: 9, off: 12 }, source: `
const int LED_PIN = 5;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED on");
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED off");
  delay(1000);
}
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on D5', delay: 1, volts: 5 },
    run: { cmd: UPLOAD('blink'), stop: [] },
    kit: [['1', 'LED'], ['1', '220 Ω resistor', 'Red-red-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button on D2 with the internal pull-up switches the LED.',
    icon: { type: 'button' },
    focus: { pins: ['digital:11', 'digital:8', GND] },
    circuit: { breadboard: BB, parts: [...ledParts(), BUTTON], wires: [...ledWires('digital:8', GND), ...buttonWires('digital:11')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'digital:11', icon: 'pin', title: 'D2', text: 'LOW while pressed.' },
    ],
    overview: [
      '`INPUT_PULLUP` turns on a resistor inside the chip that holds D2 HIGH. The button pulls it to ground, so it reads **LOW while pressed**.',
      { tips: [['button', 'Hold the button in the 3D view'], ['code', '`digitalRead()` returns HIGH or LOW'], ['led', 'The LED from the last lesson stays']] },
    ],
    wiring: [...LED_WIRING, { pin: 'digital:11', to: 'Column 20, one side of the button' }],
    code: [{ file: 'button.ino', lang: 'cpp', trace: { wait: 11, pressed: 13, released: 15 }, source: `
const int LED_PIN = 5, BUTTON_PIN = 2;
int was = HIGH;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int now = digitalRead(BUTTON_PIN);
  if (now == LOW && was == HIGH) {
    digitalWrite(LED_PIN, HIGH); Serial.println("Pressed!");
  } else if (now == HIGH && was == LOW) {
    digitalWrite(LED_PIN, LOW);  Serial.println("Released");
  }
  was = now;
  delay(20);
}
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on D5' },
    run: { cmd: UPLOAD('button'), stop: [] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'dimmer',
    title: 'Dim an LED with a knob',
    short: 'Dim with a knob',
    summary: 'A potentiometer on A0 sets the brightness of the LED through PWM on D5.',
    icon: { type: 'pot' },
    focus: { pins: ['analog:4', 'digital:8', 'analog:12', 'analog:14', GND] },
    circuit: {
      breadboard: BB,
      parts: [...ledParts(), POT],
      wires: [...potWires('analog:4', 'analog:12', 'analog:14'), { from: 'digital:8', to: 'bb:a3', color: '#f0a33a' }, { from: 'bb:a8', to: 'bb:tn8', color: '#2b2a30' }, { from: GND, to: 'bb:tn1', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'analog:4', icon: 'wave', title: 'A0', text: 'Measures 0–5 V.' },
      { pin: 'digital:8', icon: 'pin', title: 'D5 ~PWM', text: 'Switches very fast to dim the LED.' },
    ],
    overview: [
      'Input and output come together here. `analogRead()` gives a number from 0 to 1023. `analogWrite()` wants 0 to 255, so `map()` scales one range onto the other. Pins marked **~** make a fake analog voltage by switching on and off about 1000 times a second (PWM).',
      { tips: [['knob', 'Click the knob in the 3D view'], ['wave', 'Only ~ pins support `analogWrite()`'], ['code', '`map()` scales any range to any other']] },
    ],
    wiring: [{ pin: 'analog:12', to: '+ rail → potentiometer outer leg' }, { pin: 'analog:4', to: 'Potentiometer **middle leg**' }, { pin: 'analog:14', to: '− rail → potentiometer other leg' }, ...LED_WIRING],
    code: [{ file: 'dimmer.ino', lang: 'cpp', trace: { read: 8 }, source: `
const int LED_PIN = 5;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A0);
  int level = map(raw, 0, 1023, 0, 255);
  analogWrite(LED_PIN, level);
  Serial.print("raw: "); Serial.print(raw);
  Serial.print("  level: "); Serial.println(level);
  delay(100);
}
` }],
    sim: { type: 'knob', pot: 'pot1', led: 'led1', label: 'A0 voltage', vmax: 5, max: 1023, every: 0.5 },
    run: { cmd: UPLOAD('dimmer'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },
];
