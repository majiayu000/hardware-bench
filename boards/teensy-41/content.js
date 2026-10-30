// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: PJRC Teensy 4.1 product page and pinout card (rev 4), and the Teensyduino usbMIDI and
// SD documentation.
import { ledParts, ledWires, BUTTON, buttonWires, POT, potWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-teensy-41',
  title: 'Teensy 4.1: A 600 MHz Microcontroller',
  accent: '#2d8c3c',
  logicVolts: 3.3,
  pinLimitMa: 4,
  shell: 'Serial Monitor · USB',
  terminalHint: 'Teensy connected over USB. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Teensy 4.1…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: 'VIN (3.6–5.5 V)', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', pwm: 'Digital I/O with PWM (~)',
  analog: 'Analog input, digital and PWM', i2c: 'I²C', spi: 'SPI',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Teensy 4.1, top view, millimetres, USB on the left, 61 × 17.8 mm, rows 15.24 mm apart. Pin order
// follows the PJRC pinout card, reading away from the USB port. Parts are placed from the card's
// board photo and are stylised.
export const BOARD = {
  name: 'Teensy 4.1',
  width: 61,
  depth: 17.8,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#2d7a3a',
  holes: [],
  silkscreen: [{ text: 'Teensy 4.1', x: 44, z: 5, size: 1.6, weight: 700, align: 'center' }],
  components: [
    { id: 'mcu', kind: 'chip', label: 'i.MX RT1062 processor', desc: 'An Arm Cortex-M7 at 600 MHz with a floating-point unit and 1 MB of RAM. It can run two instructions per clock.', shape: 'box', x: 30, z: 9, w: 10, d: 10, h: 1.2, color: '#2a2930', text: 'IMXRT1062', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'usb', kind: 'usb', label: 'Micro-USB port', desc: 'Power, uploads and USB devices such as serial, MIDI, keyboard and audio.', shape: 'box', x: 2, z: 8.9, w: 7.4, d: 7.6, h: 2.8, color: '#c3c8d0', metal: true },
    { id: 'flash', kind: 'chip', label: '8 MB flash', desc: 'Holds your program. There are also pads underneath for extra RAM or flash chips.', shape: 'box', x: 18, z: 6, w: 5, d: 5, h: 0.9, color: '#2a2930' },
    { id: 'loader', kind: 'chip', label: 'Bootloader chip', desc: 'A small helper chip that loads new programs. It lets a Teensy recover from any bad sketch.', shape: 'box', x: 18, z: 12.4, w: 3.4, d: 3.4, h: 0.8, color: '#2a2930' },
    { id: 'prog', kind: 'button', label: 'Program button', desc: 'Press it to enter programming mode by hand. Normally the Teensy Loader does this for you.', shape: 'box', x: 41, z: 9, w: 3.4, d: 3.4, h: 1.5, color: '#d9d9d9', metal: true },
    { id: 'sd', label: 'microSD socket', desc: 'A 4-bit SDIO socket, much faster than the SPI readers on most boards. Your sketch calls it BUILTIN_SDCARD.', shape: 'box', x: 53, z: 8.9, w: 13, d: 12.4, h: 1.8, color: '#c3c6ca' },
    { id: 'led', kind: 'ledsmd', accent: '#ffb02e', label: 'Orange LED (pin 13)', desc: 'LED_BUILTIN. Pin 13 is also the SPI clock.', shape: 'box', x: 25, z: 3, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
  ],
  headers: [
    { id: 'top', label: 'Pins 23–13 and 41–33', short: 'Top', desc: 'VIN, GND and 3.3 V at the USB end, then the analog pins, then pins 41 to 33. Pin 13 drives the LED.', z: 1.28,
      pins: pinTable('VIN|3.6–5.5 V|power5; GND||gnd; 3.3V|250 mA max|power3; 23|A9, ~PWM|analog; 22|A8, ~PWM|analog; 21|A7|analog; 20|A6|analog; 19|A5, SCL, ~PWM|i2c; 18|A4, SDA, ~PWM|i2c; 17|A3|analog; 16|A2|analog; 15|A1, ~PWM|analog; 14|A0, ~PWM|analog; 13|LED, SCK, ~PWM|spi; GND||gnd; 41|A17|analog; 40|A16|analog; 39|A15|analog; 38|A14|analog; 37|~PWM|pwm; 36|~PWM|pwm; 35||gpio; 34||gpio; 33|~PWM|pwm') },
    { id: 'bottom', label: 'Pins 0–12 and 24–32', short: 'Bottom', desc: 'Digital pins 0–12, then 3.3 V and pins 24–32. Nearly all of them have PWM.', z: 16.52,
      pins: pinTable('GND||gnd; 0|~PWM|pwm; 1|~PWM|pwm; 2|~PWM|pwm; 3|~PWM|pwm; 4|~PWM|pwm; 5|~PWM|pwm; 6|~PWM|pwm; 7|~PWM|pwm; 8|~PWM|pwm; 9|~PWM|pwm; 10|CS, ~PWM|spi; 11|MOSI, ~PWM|spi; 12|MISO, ~PWM|spi; 3.3V||power3; 24|A10, ~PWM|analog; 25|A11, ~PWM|analog; 26|A12|analog; 27|A13|analog; 28|~PWM|pwm; 29|~PWM|pwm; 30||gpio; 31||gpio; 32|~PWM|pwm') },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, x: 1.27, step: [2.54, 0], ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of the bottom row.
const BB = { x: -6, z: 26 };
const GND = 'bottom:1';
const LED_WIRING = [{ pin: 'bottom:4', to: '220 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }];
const UPLOAD = (sketch, usb = 'serial') => `arduino-cli compile --upload --fqbn teensy:avr:teensy41:usb=${usb} ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Teensy 4.1',
    short: 'Meet the board',
    summary: 'Arduino code on a 600 MHz processor, with 55 pins, an SD socket and USB that can be almost anything.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'i.MX RT1062', text: 'Cortex-M7 at 600 MHz.' },
      { component: 'usb', icon: 'usb', title: 'USB', text: 'Serial, MIDI, keyboard, audio.' },
      { component: 'sd', icon: 'memory', title: 'microSD', text: 'Fast 4-bit socket.' },
      { component: 'prog', icon: 'button', title: 'Program button', text: 'Forces programming mode.' },
      { component: 'led', icon: 'led', title: 'LED', text: 'On pin 13.' },
    ],
    overview: [
      'Most Arduino-style boards run at 16 to 240 MHz. **Teensy 4.1** runs at **600 MHz**, with 1 MB of RAM and a floating-point unit, while still using the familiar `setup()` and `loop()`. People use it for audio effects, synthesizers, flight controllers and machine control.',
      'Its other strength is **USB**. One menu setting turns the board into a serial port, a MIDI instrument, a keyboard or an audio interface.',
      { tips: [['target', 'Click a pin to see what it can do'], ['code', 'Most Arduino libraries work unchanged'], ['info', 'The Teensy Loader app does the upload']] },
      { note: 'Pins are **3.3 V only and not 5 V tolerant**. Five volts on any pin will damage the chip. Each pin is also limited to a few milliamps, so use larger resistors.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Processor', 'NXP i.MX RT1062, Arm Cortex-M7, 600 MHz'], ['Memory', '8 MB flash, 1 MB RAM'], ['Pins', '55 digital, 35 with PWM, 18 analog'], ['Serial ports', '8'], ['Storage', 'microSD socket, 4-bit SDIO'], ['Logic', '3.3 V, not 5 V tolerant']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Teensy 4.1 with pins soldered on'], ['1', 'Micro-USB data cable'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit']],
  },

  {
    id: 'setup',
    title: 'Install Teensyduino',
    summary: 'Add PJRC’s board package to the Arduino IDE, choose Teensy 4.1 and press the upload button.',
    icon: 'board',
    focus: { components: ['usb', 'prog', 'led'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB', text: 'Use a cable that carries data.' },
      { component: 'prog', icon: 'button', title: 'Program button', text: 'Press it if the upload waits.' },
      { component: 'led', icon: 'led', title: 'LED', text: 'Blink flashes it.' },
    ],
    overview: [
      { steps: [
        'In the Arduino IDE open **Preferences** and add PJRC’s board-manager URL (see Try it).',
        'In **Boards Manager** install **Teensy**.',
        'Choose **Tools → Board → Teensy → Teensy 4.1**.',
        'Open **File → Examples → 01.Basics → Blink** and upload. The small **Teensy Loader** window appears and the LED starts to blink.',
      ] },
      'The **USB Type** menu under Tools decides what your board looks like to the computer. It stays on **Serial** until the MIDI lesson.',
      { tips: [['usb', 'Plug in before choosing the port'], ['terminal', 'Click the commands in Try it'], ['button', 'The Program button fixes a stuck upload']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli config add board_manager.additional_urls https://www.pjrc.com/teensy/package_teensy_index.json', note: 'add PJRC’s board list', out: [] },
        { cmd: 'arduino-cli core update-index && arduino-cli core install teensy:avr', note: 'install Teensyduino', out: ['Platform teensy:avr installed'] },
        { cmd: UPLOAD('Blink'), note: 'compile + upload Blink', out: ['Sketch uses … bytes of program storage space.'] },
      ],
    },
    kit: [['1', 'Computer with the Arduino IDE or arduino-cli']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'An LED with a resistor on pin 2 blinks once a second.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['bottom:4', GND] },
    circuit: { breadboard: BB, parts: ledParts(470), wires: ledWires('bottom:4', GND) },
    callouts: [
      { pin: 'bottom:4', icon: 'pin', title: 'Pin 2', text: 'Your sketch switches it.' },
      { pin: GND, icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while the pin is HIGH.' },
    ],
    overview: [
      'The sketch is the same as on an Uno. The difference is the current: Teensy 4.1 pins are designed for about **4 mA**, so this lesson starts with a **470 Ω** resistor.',
      { tips: [['led', '`LED_BUILTIN` is pin 13'], ['resistor', 'Try 1 kΩ: dimmer, still visible'], ['code', '`Serial` is USB and ignores the baud rate']] },
    ],
    wiring: [{ pin: 'bottom:4', to: '470 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }],
    code: [{ file: 'blink.ino', lang: 'cpp', trace: { on: 8, off: 11 }, source: `
const int LED_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
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
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on pin 2', delay: 1, volts: 3.3 },
    run: { cmd: UPLOAD('blink'), stop: [] },
    kit: [['1', 'LED'], ['1', '470 Ω resistor', 'Yellow-violet-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'midi',
    title: 'Be a MIDI instrument',
    short: 'USB MIDI',
    summary: 'A button on pin 3 plays a note in any music app, over USB, with no driver.',
    icon: { type: 'button' },
    focus: { pins: ['bottom:5', 'bottom:4', GND] },
    circuit: { breadboard: BB, parts: [...ledParts(470), BUTTON], wires: [...ledWires('bottom:4', GND), ...buttonWires('bottom:5')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'bottom:5', icon: 'pin', title: 'Pin 3', text: 'LOW while pressed.' },
      { component: 'usb', icon: 'usb', title: 'USB MIDI', text: 'The computer sees an instrument.' },
    ],
    overview: [
      'Choose **Tools → USB Type → MIDI** and upload. Your computer now sees the Teensy as a music keyboard, and any app that takes MIDI can hear it, such as GarageBand, Ableton Live or a web synth.',
      'A **note on** message says which note and how hard. A **note off** ends it. If you forget the note off, the sound goes on forever.',
      { tips: [['button', 'Hold the button in the 3D view'], ['code', 'Note 60 is middle C'], ['usb', 'No MIDI driver is needed']] },
    ],
    wiring: [{ pin: 'bottom:4', to: '470 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }, { pin: 'bottom:5', to: 'Column 20, one side of the button' }],
    code: [{ file: 'midi.ino', lang: 'cpp', trace: { wait: 10, pressed: 12, released: 15 }, source: `
const int LED_PIN = 2, BUTTON_PIN = 3, NOTE = 60, CHANNEL = 1;
int was = HIGH;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  int now = digitalRead(BUTTON_PIN);
  if (now == LOW && was == HIGH) {
    usbMIDI.sendNoteOn(NOTE, 100, CHANNEL);
    digitalWrite(LED_PIN, HIGH);
  } else if (now == HIGH && was == LOW) {
    usbMIDI.sendNoteOff(NOTE, 0, CHANNEL);
    digitalWrite(LED_PIN, LOW);
  }
  was = now;
  delay(5);
}
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'Note 60' },
    run: { cmd: UPLOAD('midi', 'midi'), stop: [] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires'], ['1', 'Any music app that accepts MIDI']],
  },

  {
    id: 'knob',
    title: 'A MIDI volume knob',
    short: 'MIDI knob',
    summary: 'A potentiometer on A0 sends control-change messages, like a knob on a real mixer.',
    icon: { type: 'pot' },
    focus: { pins: ['top:13', 'top:3', 'top:2'] },
    circuit: { breadboard: BB, parts: [POT], wires: potWires('top:13', 'top:3', 'top:2') },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'top:13', icon: 'wave', title: 'Pin 14 · A0', text: 'Measures 0–3.3 V.' },
      { pin: 'top:3', icon: 'power', title: '3.3V', text: 'Feeds the + rail. Not 5 V!' },
    ],
    overview: [
      'MIDI values run from 0 to 127, so the 10-bit reading is divided by 8. Controller **7** is channel volume. The sketch only sends a message when the value changes, or it would flood the USB link with thousands of identical messages a second.',
      { tips: [['knob', 'Click the knob in the 3D view'], ['code', 'Keep the USB Type set to MIDI'], ['wave', 'Dividing by 8 also hides small jitter']] },
    ],
    wiring: [{ pin: 'top:3', to: '+ rail → potentiometer outer leg' }, { pin: 'top:13', to: 'Potentiometer **middle leg**' }, { pin: 'top:2', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'volume.ino', lang: 'cpp', trace: { read: 7 }, source: `
const int CHANNEL = 1, CC_VOLUME = 7;
int last = -1;

void setup() {}

void loop() {
  int value = analogRead(A0) / 8;
  if (value != last) {
    usbMIDI.sendControlChange(CC_VOLUME, value, CHANNEL);
    last = value;
  }
  delay(10);
}
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'A0 voltage', readout: 'raw', vmax: 3.3, max: 127, every: 0.5, log: 'CC 7 = {raw}' },
    run: { cmd: UPLOAD('volume', 'midi'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },

  {
    id: 'sdlog',
    title: 'Log to the microSD card',
    short: 'Log to microSD',
    summary: 'The built-in socket stores a line of data every second in a text file.',
    icon: { glyph: 'memory' },
    focus: { components: ['sd'] },
    callouts: [
      { component: 'sd', icon: 'memory', title: 'microSD socket', text: 'No wiring: it is on the board.' },
      { component: 'led', icon: 'led', title: 'LED', text: 'Flashes on each write.' },
    ],
    overview: [
      'On most boards an SD card needs a separate reader wired to SPI. Teensy 4.1 has a socket on the board, connected by four data lines, so you can record audio or fast sensor data. `BUILTIN_SDCARD` tells the `SD` library to use it.',
      { tips: [['memory', 'Format the card as FAT32 or exFAT'], ['code', 'Closing the file saves the data'], ['info', 'Open the card on a computer to see LOG.TXT']] },
      { note: 'Pulling the card out during a write can corrupt it. Wait until the LED stops.', tone: 'warn' },
    ],
    code: [{ file: 'logger.ino', lang: 'cpp', trace: { write: 16 }, source: `
#include <SD.h>

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  if (!SD.begin(BUILTIN_SDCARD)) {
    Serial.println("No SD card");
    while (true) {}
  }
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  File file = SD.open("LOG.TXT", FILE_WRITE);
  if (file) {
    file.println(millis());
    file.close();
  }
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: each second one line is added to LOG.TXT.',
      steps: [{ ms: 1000, log: 'LOG.TXT + 1000', trace: 'write' }, { ms: 1000, log: 'LOG.TXT + 2000', trace: 'write' }, { ms: 1000, log: 'LOG.TXT + 3000', trace: 'write' }],
    },
    run: { cmd: UPLOAD('logger'), stop: [] },
    kit: [['1', 'microSD card']],
  },
];
