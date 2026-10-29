// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons (text, circuits, callouts, code). The engine is generic.
import { pinPosition } from '../../engine/board-geometry.js';

export const SITE = {
  id: 'learn-arduino-uno',
  title: 'Arduino Uno: Desk Gadgets',
  accent: '#e05a3a',
  logicVolts: 5,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Uno connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Arduino Uno…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', pwm: 'Digital I/O with PWM (~)',
  analog: 'Analog input', uart: 'Serial (shared with USB)', i2c: 'I²C', reset: 'Reset', nc: 'Not connected',
};

// Pin tables in physical order: "NAME|ALT|type" separated by "; ".
const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Arduino Uno R3, top view, millimetres, USB-B and the DC jack on the left edge.
// Header pin positions follow the Uno R3 drawing (pins on a 0.1" grid, the digital headers
// 0.16" apart between D7 and D8). The ICSP header position and all other parts are stylised:
// they show what a beginner should recognise, not exact mechanical positions.
const HEADERS = [
  { id: 'dlow', label: 'Digital pins 0–7', short: 'D', desc: 'Digital pins 0–7. Pins 0 and 1 are the serial port used for uploading, so leave them free.',
    pins: pinTable('D0|RX|uart; D1|TX|uart; D2|interrupt 0|gpio; D3|~PWM, interrupt 1|pwm; D4||gpio; D5|~PWM|pwm; D6|~PWM|pwm; D7||gpio'),
    x: 66.04, z: 2.54, step: [-2.54, 0] },
  { id: 'dhigh', label: 'Digital pins 8–13, GND, AREF, SDA, SCL', short: 'D', desc: 'Digital pins 8–13 plus GND, AREF and the I²C pins. Pin 13 also drives the built-in L LED.',
    pins: pinTable('D8||gpio; D9|~PWM|pwm; D10|~PWM, SS|pwm; D11|~PWM, MOSI|pwm; D12|MISO|gpio; D13|SCK, L LED|gpio; GND||gnd; AREF|analog reference|analog; SDA|I²C data|i2c; SCL|I²C clock|i2c'),
    x: 44.196, z: 2.54, step: [-2.54, 0] },
  { id: 'power', label: 'Power header', short: 'Power', desc: 'Power for your circuits: 5 V, 3.3 V and ground, plus VIN (the raw supply) and RESET.',
    pins: pinTable('NC||nc; IOREF|logic level (5 V)|power5; RESET||reset; 3.3V||power3; 5V||power5; GND||gnd; GND||gnd; VIN|raw input, 7–12 V|power5'),
    x: 27.94, z: 50.8, step: [2.54, 0] },
  { id: 'analog', label: 'Analog inputs A0–A5', short: 'A', desc: 'Measure voltages from 0 to 5 V as a number from 0 to 1023. A4 and A5 double as I²C.',
    pins: pinTable('A0||analog; A1||analog; A2||analog; A3||analog; A4|SDA|analog; A5|SCL|analog'),
    x: 50.8, z: 50.8, step: [2.54, 0] },
].map((h) => ({ layout: 'single', style: 'female', pitch: 2.54, ...h }));

// Silkscreen pin labels next to every header pin.
const pinLabels = HEADERS.flatMap((h) => h.pins.map((p) => {
  const pos = pinPosition(h, p.n);
  const text = p.type === 'pwm' ? `~${p.name.slice(1)}` : p.name.replace(/^D/, '');
  return { text, x: pos.x, z: pos.z + (pos.z < 10 ? 3.3 : -3.3), size: 1.05, align: 'center' };
}));

export const BOARD = {
  name: 'Arduino Uno R3',
  width: 68.58,
  depth: 53.34,
  thickness: 1.6,
  cornerRadius: 2,
  pcbColor: '#35548f',
  heightScale: 1.2,
  holes: [{ x: 13.97, z: 50.8, r: 1.6 }, { x: 15.24, z: 2.54, r: 1.6 }, { x: 66.04, z: 45.72, r: 1.6 }, { x: 66.04, z: 17.78, r: 1.6 }],
  silkscreen: [
    ...pinLabels,
    { text: 'UNO', x: 47, z: 24, size: 6.2, weight: 700, align: 'center' },
    { text: 'DIGITAL (PWM ~)', x: 46, z: 8.9, size: 1.3, align: 'center' },
    { text: 'POWER', x: 36.8, z: 44.6, size: 1.3, align: 'center' },
    { text: 'ANALOG IN', x: 57.2, z: 44.6, size: 1.3, align: 'center' },
    { text: 'RESET', x: 7.6, z: 9.4, size: 1.1, align: 'center' },
    { text: 'ICSP', x: 64.5, z: 33, size: 1.1, align: 'center' },
    { text: 'ICSP', x: 15.7, z: 12.2, size: 1.0, align: 'center' },
    { text: '+', x: 16.2, z: 41.6, size: 1.4 }, { text: '+', x: 22.8, z: 41.6, size: 1.4 },
    { text: 'L', x: 35.8, z: 12.4, size: 1.1 }, { text: 'TX', x: 35.8, z: 14.9, size: 1.1 }, { text: 'RX', x: 35.8, z: 17.4, size: 1.1 },
    { text: 'ON', x: 61.2, z: 13.6, size: 1.1 },
    { text: 'R3', x: 54.4, z: 29.4, size: 1.6, align: 'center' },
  ],
  smd: [{ x: 27, z: 17, w: 9, d: 6, count: 10 }, { x: 16, z: 34, w: 8, d: 6, count: 8 }, { x: 57, z: 18, w: 7, d: 6, count: 8 }, { x: 40, z: 28, w: 12, d: 3, count: 8 }, { x: 22, z: 27, w: 6, d: 6, count: 6 }],
  components: [
    { id: 'mcu', kind: 'dip', label: 'ATmega328P microcontroller', desc: 'The brain: an 8-bit chip running at 16 MHz with 32 KB of memory for your sketch.', shape: 'box', x: 47.3, z: 37.6, w: 35.6, d: 7.4, h: 3.6, color: '#2a2930', text: 'ATMEGA328P-PU', textSize: 15, textColor: 'rgba(205,205,215,0.55)' },
    { id: 'usb', kind: 'usbb', label: 'USB-B port', desc: 'Uploads sketches from your computer and powers the board.', shape: 'box', x: 1.9, z: 15.5, w: 16.4, d: 12, h: 10.9, color: '#c3c8d0' },
    { id: 'jack', kind: 'dcjack', label: 'DC power jack', desc: 'Run the board from a 7–12 V adapter or battery pack instead of USB.', shape: 'box', x: 5.2, z: 45.2, w: 14.2, d: 9, h: 11, color: '#24232b' },
    { id: 'usbchip', kind: 'chip', label: 'ATmega16U2 USB chip', desc: 'Turns USB into serial so your computer can talk to the main chip.', shape: 'box', x: 27, z: 11, w: 5.4, d: 5.4, h: 0.9, color: '#2a2930' },
    { id: 'crystal', kind: 'crystal', label: '16 MHz crystal', desc: 'Keeps precise time for the USB chip.', shape: 'box', x: 20, z: 21, w: 11, d: 4.6, h: 3.4, color: '#e3e6eb', text: '16.000', textSize: 6, textColor: 'rgba(60,60,70,0.6)' },
    { id: 'reset', kind: 'button', accent: '#e2483c', label: 'Reset button', desc: 'Restarts your sketch from the top of setup().', shape: 'box', x: 7.6, z: 5.6, w: 6, d: 6, h: 3.4, color: '#c9ced6' },
    { id: 'reg', kind: 'regulator', label: '5 V regulator', desc: 'Turns the 7–12 V from the DC jack into the 5 V the board runs on.', shape: 'box', x: 16, z: 38.5, w: 6.5, d: 3.6, h: 1.6, color: '#2a2930' },
    { id: 'cap1', kind: 'electrolytic', label: 'Capacitor', desc: 'Smooths the supply voltage, like a tiny reservoir.', shape: 'cylinder', x: 18.4, z: 45.4, w: 6.3, h: 5.2, color: '#c9ced6', accent: '#2a2930' },
    { id: 'cap2', kind: 'electrolytic', label: 'Capacitor', desc: 'A second supply capacitor next to the regulator.', shape: 'cylinder', x: 25, z: 45.4, w: 6.3, h: 5.2, color: '#c9ced6', accent: '#2a2930' },
    { id: 'opamp', kind: 'chip', label: 'Op-amp', desc: 'Switches the board between USB power and external power, and buffers the L LED.', shape: 'box', x: 24.5, z: 31.5, w: 4.2, d: 3.2, h: 0.9, color: '#2a2930' },
    { id: 'fuse', kind: 'chip', label: 'Resettable fuse', desc: 'Cuts USB power if your circuit draws too much, then resets itself.', shape: 'box', x: 12.6, z: 25.4, w: 3.6, d: 2.2, h: 0.9, color: '#e9dfc9' },
    { id: 'diode', kind: 'chip', label: 'Protection diode', desc: 'Stops a reversed power supply on the DC jack from damaging the board.', shape: 'box', x: 12.6, z: 31.6, w: 3.8, d: 2.2, h: 0.9, color: '#2a2930' },
    { id: 'reg3', kind: 'chip', label: '3.3 V regulator', desc: 'Makes the 3.3 V supply for the 3.3V pin.', shape: 'box', x: 31, z: 44, w: 3, d: 2.2, h: 0.9, color: '#2a2930' },
    { id: 'ledL', kind: 'ledsmd', accent: '#ffb02e', label: 'L LED', desc: 'Built-in LED wired to pin 13: the Blink example flashes it.', shape: 'box', x: 34.4, z: 12.4, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'ledTX', kind: 'ledsmd', accent: '#ffcf3a', label: 'TX LED', desc: 'Flickers when the board sends data to your computer.', shape: 'box', x: 34.4, z: 14.9, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'ledRX', kind: 'ledsmd', accent: '#ffcf3a', label: 'RX LED', desc: 'Flickers when the board receives data, such as an upload.', shape: 'box', x: 34.4, z: 17.4, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'ledON', kind: 'ledsmd', accent: '#3fe06b', lit: true, label: 'ON LED', desc: 'Lights whenever the board has power.', shape: 'box', x: 59.8, z: 13.6, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
  ],
  headers: [
    ...HEADERS,
    { id: 'icsp1', label: 'ICSP header (USB chip)', short: 'ICSP1', desc: 'Programs the ATmega16U2 USB chip. Not used in these lessons.', layout: 'dual', style: 'male', pitch: 2.54,
      x: 13.2, z: 9.6, step: [2.54, 0], rowStep: [0, -2.54], pins: pinTable('MISO||gpio; 5V||power5; SCK||gpio; MOSI||gpio; RESET||reset; GND||gnd') },
    { id: 'icsp', label: 'ICSP header', short: 'ICSP', desc: 'Programs the main chip directly with an external programmer. You won’t need it here.', layout: 'dual', style: 'male', pitch: 2.54,
      x: 63.25, z: 29.97, step: [0, -2.54], rowStep: [2.54, 0], pins: pinTable('MISO||gpio; 5V||power5; SCK||gpio; MOSI||gpio; RESET||reset; GND||gnd') },
  ],
};

// ---------- shared circuit pieces ----------
// The breadboard sits to the right of the Uno, rows a–e towards the digital header.
// The power header feeds the bottom rails; the top − rail is a second ground for the lamps.
const BB = { x: 76, z: 0.7 };
const RAILS = [{ from: 'power:5', to: 'bb:bp2', color: '#e2483c' }, { from: 'power:6', to: 'bb:bn2', color: '#2b2a30' }];

// One LED with its resistor: the pin wire lands in column `c`, the resistor spans c → c+4,
// the LED sits in c+4 (anode) and c+5 (cathode), and a short black jumper takes the cathode column
// to the top − rail (keep c+5 off multiples of 6: the rails have no hole there).
const lamp = (id, color, pin, c, label, wire) => ({
  parts: [
    { id: `r${id}`, type: 'resistor', a: `c${c}`, b: `c${c + 4}`, ohms: 220, label: `220 Ω · ${label}`, desc: 'Keeps the LED current near 13 mA.', controls: { ohms: [150, 220, 470, 1000] }, drives: id },
    { id, type: 'led', anode: `e${c + 4}`, cathode: `e${c + 5}`, color, label: `${label} LED`, desc: 'Long leg (anode) to the resistor, short leg to the ground rail.' },
  ],
  wires: [{ from: pin, to: `bb:a${c}`, color: wire }, { from: `bb:a${c + 5}`, to: `bb:tn${c + 5}`, color: '#2b2a30' }],
});
const RED = lamp('ledR', 'red', 'dhigh:5', 2, 'Red', '#e2483c');
const YELLOW = lamp('ledY', 'yellow', 'dhigh:4', 10, 'Yellow', '#f2c12e');
const GREEN = lamp('ledG', 'green', 'dhigh:3', 18, 'Green', '#3fae5a');
const SIGNAL = {
  parts: [...RED.parts, ...YELLOW.parts, ...GREEN.parts],
  wires: [...RED.wires, ...YELLOW.wires, ...GREEN.wires, { from: 'dhigh:7', to: 'bb:tn1', color: '#2b2a30' }],
};
const SIGNAL_PINS = ['dhigh:3', 'dhigh:4', 'dhigh:5', 'dhigh:7'];
const SIGNAL_WIRING = [
  { pin: 'dhigh:5', to: '220 Ω → **red** LED long leg' },
  { pin: 'dhigh:4', to: '220 Ω → **yellow** LED long leg' },
  { pin: 'dhigh:3', to: '220 Ω → **green** LED long leg' },
  { pin: 'dhigh:7', to: 'Top **−** rail; each short leg reaches it with a jumper' },
];

// A push button straddling the centre channel at columns 25 and 27, read on D2.
const BUTTON = { id: 'btn1', type: 'button', legs: ['e25', 'e27', 'f25', 'f27'], label: 'Push button', desc: 'Hold it down in the 3D view: pressing joins column 25 to column 27.' };
const BUTTON_WIRES = [{ from: 'dlow:3', to: 'bb:a25', color: '#3b78d6' }, { from: 'bb:a27', to: 'bb:tn28', color: '#2b2a30' }];

const SONAR = { id: 'us1', type: 'module', preset: 'hcsr04', pins: ['j12', 'j13', 'j14', 'j15'], label: 'HC-SR04', desc: 'Ultrasonic rangefinder. Pins: VCC, TRIG, ECHO, GND.', controls: { distance: [2, 250] } };
const SONAR_WIRES = [
  { from: 'bb:h12', to: 'bb:bp11', color: '#e2483c' }, { from: 'bb:h15', to: 'bb:bn15', color: '#2b2a30' },
  { from: 'dlow:8', to: 'bb:g13', color: '#f2c12e' }, { from: 'dlow:7', to: 'bb:g14', color: '#3fae5a' },
];

const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn arduino:avr:uno ${sketch}`;

export const LESSONS = [
  {
    id: 'tour',
    title: 'Tour the Uno',
    summary: 'Find the chip, the ports and the three rows of pins you will plug every gadget into.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'ATmega328P', text: 'Runs one sketch, over and over.' },
      { component: 'usb', icon: 'usb', title: 'USB-B', text: 'Power and uploads from your computer.' },
      { pin: 'dhigh:6', icon: 'pin', title: 'Digital row', text: 'Pins 0–13 switch on and off.' },
      { pin: 'analog:1', icon: 'wave', title: 'Analog row', text: 'A0–A5 read a voltage as 0–1023.' },
      { pin: 'power:5', icon: 'plug', title: 'Power row', text: '5 V and GND for the breadboard.' },
    ],
    overview: [
      'This course builds a small gadget in every lesson: a traffic light, a crossing button, a night light, a mood lamp, a door chime, a ruler, a gauge and finally a parking sensor. All of them plug into the three rows of sockets along the edges of the Uno.',
      'Your program is called a **sketch**. It has two functions: `setup()` runs once at power-up, then `loop()` repeats until the power goes off.',
      { tips: [['target', 'Click a part of the board to read what it does'], ['rotr', 'Drag to orbit, Q / E to turn, scroll to zoom'], ['info', 'The numbers on the board match the key beside it']] },
      { note: 'Pins work at **5 V** and can each supply about **20 mA**. Never wire an output pin straight to GND or 5 V.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Microcontroller', 'ATmega328P, 8-bit, 16 MHz'], ['Operating voltage', '5 V'], ['Input voltage', '7–12 V (DC jack or VIN)'], ['Digital pins', '14 (6 with PWM)'], ['Analog inputs', '6, 10-bit (0–1023)'], ['Flash memory', '32 KB'], ['SRAM / EEPROM', '2 KB / 1 KB'], ['USB', 'USB-B, via the ATmega16U2']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Arduino Uno R3 (or a compatible board)'], ['1', 'USB-A to USB-B cable', 'The square "printer" plug.'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit', 'Male-to-male: Uno headers are sockets.']],
  },

  {
    id: 'upload',
    title: 'Upload a sketch',
    summary: 'Install the tools, find the board’s port and flash the built-in Blink example.',
    icon: 'board',
    focus: { components: ['usb', 'usbchip', 'ledL'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB cable', text: 'The sketch travels down it.' },
      { component: 'usbchip', icon: 'code', title: 'ATmega16U2', text: 'Appears as a serial port.' },
      { component: 'ledTX', icon: 'wave', title: 'TX / RX', text: 'Flicker while uploading.' },
      { component: 'ledL', icon: 'led', title: 'L', text: 'Blink flashes this LED.' },
    ],
    overview: [
      'Before building anything, check that your computer can talk to the board. Uploading the Blink example that ships with the Arduino tools proves the whole chain: cable, driver, port and compiler.',
      { steps: [
        'Install the Arduino IDE from arduino.cc/en/software, or arduino-cli if you prefer a terminal.',
        'Plug in the Uno. The green **ON** LED lights.',
        'Pick **Tools → Board → Arduino Uno** and **Tools → Port** (the entry that appeared when you plugged it in).',
        'Open **File → Examples → 01.Basics → Blink** and press **Upload**.',
        'TX and RX flicker; then the small **L** LED blinks once a second.',
      ] },
      { note: 'No port? Swap the USB cable: many cheap cables carry power only.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli core install arduino:avr', note: 'Uno support', out: ['Downloading packages...', 'Installing platform arduino:avr...', 'Platform arduino:avr installed'] },
        { cmd: 'arduino-cli board list', note: 'find the port', out: ['Port         Protocol Type              Board Name  FQBN            Core', '/dev/ttyACM0 serial   Serial Port (USB) Arduino Uno arduino:avr:uno arduino:avr'] },
        { cmd: 'arduino-cli sketch new blink', note: 'make a sketch', out: ['Sketch created in: blink'] },
        { cmd: UPLOAD('blink'), note: 'compile + upload', out: ['Sketch uses 924 bytes (2%) of program storage space. Maximum is 32256 bytes.', 'Global variables use 9 bytes (0%) of dynamic memory.', 'Done uploading.'] },
      ],
    },
    kit: [['1', 'Computer with a free USB port', 'Windows, macOS or Linux.']],
  },

  {
    id: 'traffic',
    title: 'Traffic light',
    summary: 'Three LEDs on pins 10, 11 and 12 cycle green, yellow and red with `digitalWrite()` and `delay()`.',
    icon: 'circuit',
    focus: { pins: SIGNAL_PINS },
    circuit: { breadboard: BB, ...SIGNAL },
    callouts: [
      { part: 'ledR', icon: 'led', title: 'Red · pin 12', text: 'Stop.' },
      { part: 'ledY', icon: 'led', title: 'Yellow · pin 11', text: 'Get ready to stop.' },
      { part: 'ledG', icon: 'led', title: 'Green · pin 10', text: 'Cars go.' },
      { part: 'rledG', icon: 'resistor', title: '220 Ω each', text: 'Click one to try other values.' },
      { pin: 'dhigh:7', icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
    ],
    overview: [
      'A traffic light is three outputs and a timetable. Each LED gets its own pin; the sketch turns exactly one of them on, waits, and moves to the next. Writing the pattern as one small `show()` function keeps `loop()` readable.',
      { tips: [['led', 'A pin set HIGH puts 5 V on its LED'], ['clock', '`delay(ms)` holds the current colour'], ['resistor', 'Every LED needs its own resistor']] },
      { steps: ['Wire with the USB cable unplugged.', 'Check each LED: long leg towards the resistor.', 'Upload, then watch the colours and the Serial Monitor at 9600 baud.'] },
    ],
    wiring: SIGNAL_WIRING,
    wiringNotes: [{ note: 'With 220 Ω, a red LED on 5 V draws about 14 mA: bright, and safely under the 20 mA a pin can supply.', tone: 'warn' }, 'All three short legs share the top − rail, which one wire connects to GND.'],
    code: [{ file: 'traffic.ino', lang: 'cpp', trace: { green: 19, yellow: 21, red: 23 }, source: `
const int RED = 12, YELLOW = 11, GREEN = 10;

void show(int red, int yellow, int green, int ms) {
  digitalWrite(RED, red);
  digitalWrite(YELLOW, yellow);
  digitalWrite(GREEN, green);
  delay(ms);
}

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("GO");
  show(LOW, LOW, HIGH, 4000);
  Serial.println("GET READY TO STOP");
  show(LOW, HIGH, LOW, 1500);
  Serial.println("STOP");
  show(HIGH, LOW, LOW, 4000);
}
` }],
    codeNotes: ['Real lights differ by country. To add a red + yellow phase before green, insert `show(HIGH, HIGH, LOW, 1000);` at the end of `loop()`.'],
    sim: {
      type: 'sequence', lamps: ['ledR', 'ledY', 'ledG'], caption: 'Press Run to start the cycle. Click an LED in the 3D view to read about it.',
      steps: [
        { set: { ledR: false, ledY: false, ledG: true }, ms: 4000, log: 'GO', trace: 'green' },
        { set: { ledG: false, ledY: true }, ms: 1500, log: 'GET READY TO STOP', trace: 'yellow' },
        { set: { ledY: false, ledR: true }, ms: 4000, log: 'STOP', trace: 'red' },
      ],
    },
    run: { cmd: UPLOAD('traffic'), stop: [] },
    kit: [['3', 'LEDs: red, yellow and green'], ['3', '220 Ω resistors', 'Red-red-brown bands.'], ['7', 'Jumper wires']],
  },

  {
    id: 'crossing',
    title: 'Crossing button',
    short: 'Crossing button',
    summary: 'Add a push button on pin 2: pressing it stops the traffic so people can cross.',
    icon: 'circuit',
    focus: { pins: [...SIGNAL_PINS, 'dlow:3'] },
    circuit: { breadboard: BB, parts: [...SIGNAL.parts, BUTTON], wires: [...SIGNAL.wires, ...BUTTON_WIRES] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene while Run is on.' },
      { pin: 'dlow:3', icon: 'pin', title: 'Pin 2 · input', text: 'Reads LOW while pressed.' },
      { part: 'ledR', icon: 'led', title: 'Red', text: 'Cars wait; people walk.' },
      { part: 'ledG', icon: 'led', title: 'Green', text: 'The resting state.' },
    ],
    overview: [
      'The lights now rest on green and only change when someone asks. Pin 2 is an **input** with `INPUT_PULLUP`: a resistor inside the chip holds it HIGH, and the button pulls it down to the ground rail, so it reads **LOW while pressed**.',
      { tips: [['button', 'Press and hold the button in the 3D view'], ['code', '`return` ends this pass of `loop()` early'], ['clock', 'The pauses give drivers time to react']] },
      'Notice that the sketch does not react while the crossing sequence is running: `delay()` keeps the chip busy. That is fine here; later projects use shorter delays.',
    ],
    wiring: [...SIGNAL_WIRING, { pin: 'dlow:3', to: 'Column 25, one side of the button' }],
    wiringNotes: ['The button sits across the centre channel. Pressing it joins column 25 (pin 2) to column 27, which a jumper ties to the − rail.'],
    code: [{ file: 'crossing.ino', lang: 'cpp', trace: { wait: 20, pressed: 22, ask: 23, yellow: 24, walk: 27, green: 29 }, source: `
const int RED = 12, YELLOW = 11, GREEN = 10;
const int BUTTON = 2;

void lights(int red, int yellow, int green) {
  digitalWrite(RED, red);
  digitalWrite(YELLOW, yellow);
  digitalWrite(GREEN, green);
}

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(BUTTON, INPUT_PULLUP);
  Serial.begin(9600);
  lights(LOW, LOW, HIGH);
}

void loop() {
  if (digitalRead(BUTTON) == HIGH) return;   // nobody is waiting

  Serial.println("Button pressed: stopping traffic");
  delay(1000);
  lights(LOW, HIGH, LOW);
  delay(2000);
  lights(HIGH, LOW, LOW);
  Serial.println("WALK");
  delay(5000);
  lights(LOW, LOW, HIGH);
  Serial.println("Cars go");
}
` }],
    sim: {
      type: 'sequence', button: 'btn1', lamps: ['ledR', 'ledY', 'ledG'], idle: { ledR: false, ledY: false, ledG: true },
      caption: 'Press Run, then hold the button here or in the 3D view.',
      steps: [
        { ms: 1000, log: 'Button pressed: stopping traffic', trace: 'ask' },
        { set: { ledG: false, ledY: true }, ms: 2000, trace: 'yellow' },
        { set: { ledY: false, ledR: true }, ms: 5000, log: 'WALK', trace: 'walk' },
        { set: { ledR: false, ledG: true }, ms: 800, log: 'Cars go', trace: 'green' },
      ],
    },
    run: { cmd: UPLOAD('crossing'), stop: [] },
    kit: [['1', 'Tactile push button (6 mm)'], ['2', 'More jumper wires']],
  },

  {
    id: 'nightlight',
    title: 'Night light',
    summary: 'A photoresistor on A0 measures the room; an LED on pin ~9 glows brighter as it gets darker.',
    icon: 'circuit',
    focus: { pins: ['analog:1', 'power:5', 'power:6', 'dhigh:2', 'dhigh:7'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'res1', type: 'resistor', a: 'c5', b: 'c9', ohms: 220, label: '220 Ω resistor', desc: 'Limits the LED current.', controls: { ohms: [150, 220, 470, 1000] }, drives: 'led1' },
        { id: 'led1', type: 'led', anode: 'e9', cathode: 'e10', color: 'white', label: 'Night-light LED', desc: 'Its brightness follows the darkness.', controls: { color: ['white', 'yellow', 'orange', 'blue'] } },
        { id: 'ldr1', type: 'ldr', legs: ['f25', 'f27'], value: 0.6, label: 'Photoresistor (LDR)', desc: 'Its resistance falls as light falls on it.', controls: { value: [0, 1] }, controlLabel: 'Light level' },
        { id: 'r10k', type: 'resistor', a: 'i27', b: 'bn27', ohms: 10000, label: '10 kΩ resistor', desc: 'Turns the LDR’s resistance into a voltage.' },
      ],
      wires: [
        { from: 'dhigh:2', to: 'bb:a5', color: '#f0a33a' }, { from: 'bb:a10', to: 'dhigh:7', color: '#2b2a30' },
        ...RAILS, { from: 'bb:j25', to: 'bb:bp25', color: '#e2483c' }, { from: 'bb:h27', to: 'analog:1', color: '#f2c12e' },
      ],
    },
    callouts: [
      { part: 'ldr1', icon: 'sun', title: 'Photoresistor', text: 'Click it to dim the room.' },
      { part: 'r10k', icon: 'resistor', title: '10 kΩ', text: 'The other half of the divider.' },
      { pin: 'analog:1', icon: 'wave', title: 'A0', text: 'Bright room → high reading.' },
      { part: 'led1', icon: 'led', title: 'LED · pin ~9', text: 'Dark room → bright LED.' },
    ],
    overview: [
      'The Uno measures voltages, not resistance, so the photoresistor shares the 5 V with a fixed 10 kΩ resistor. This **voltage divider** puts a higher voltage on A0 when more light falls on the sensor, and `analogRead()` reports it as 0–1023.',
      'The sketch flips that number around with `map()`: a high light reading gives a low brightness. `analogWrite()` on a **~ pin** then sets the LED from 0 (off) to 255 (full).',
      { tips: [['sun', 'Click the photoresistor and drag the light level'], ['wave', 'Watch the readings scroll in the Serial Monitor'], ['led', 'The LED fades in as the room darkens']] },
    ],
    wiring: [
      { pin: 'power:5', to: '5 V rail → one leg of the photoresistor' },
      { pin: 'analog:1', to: 'Other photoresistor leg and the 10 kΩ resistor' },
      { pin: 'power:6', to: 'GND rail → far end of the 10 kΩ resistor' },
      { pin: 'dhigh:2', to: '220 Ω resistor → LED long leg' },
      { pin: 'dhigh:7', to: 'LED short leg' },
    ],
    code: [{ file: 'nightlight.ino', lang: 'cpp', trace: { read: 9 }, source: `
const int LIGHT_PIN = A0;
const int LED_PIN = 9;     // ~ pin, so analogWrite works

void setup() {
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(LIGHT_PIN);                  // 0 dark ... 1023 bright
  int glow = map(light, 0, 1023, 255, 0);             // darker room, brighter LED
  analogWrite(LED_PIN, glow);
  Serial.print("light ");
  Serial.println(light);
  delay(200);
}
` }],
    codeNotes: ['Want it fully off in daylight? Add `if (light > 700) glow = 0;` before `analogWrite()`.'],
    sim: { type: 'knob', pot: 'ldr1', led: 'led1', invert: true, label: 'A0 voltage', vmax: 5, max: 1023, every: 0.25, log: 'light {raw}', caption: 'Drag the light level here or from the photoresistor’s popover. The LED gets brighter as the reading falls.' },
    run: { cmd: UPLOAD('nightlight'), stop: [] },
    kit: [['1', 'Photoresistor (LDR, 5 mm)'], ['1', '10 kΩ resistor', 'Brown-black-orange.'], ['1', 'White or yellow LED and 220 Ω resistor'], ['6', 'Jumper wires']],
  },

  {
    id: 'mood',
    title: 'Mood lamp',
    summary: 'Fade an RGB LED slowly between colours using three PWM pins.',
    icon: 'circuit',
    focus: { pins: ['dhigh:2', 'dhigh:3', 'dhigh:4', 'dhigh:7'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'rgb1', type: 'rgbled', legs: ['e8', 'e9', 'e10', 'e11'], label: 'RGB LED', desc: 'Legs: red, common cathode (longest), green, blue.' },
        { id: 'rr', type: 'resistor', a: 'b3', b: 'b8', ohms: 220, label: '220 Ω · red' },
        { id: 'rg', type: 'resistor', a: 'c5', b: 'c10', ohms: 220, label: '220 Ω · green' },
        { id: 'rb', type: 'resistor', a: 'd6', b: 'd11', ohms: 220, label: '220 Ω · blue' },
      ],
      wires: [{ from: 'dhigh:2', to: 'bb:a3', color: '#e2483c' }, { from: 'dhigh:3', to: 'bb:a5', color: '#3fae5a' }, { from: 'dhigh:4', to: 'bb:a6', color: '#3b78d6' }, { from: 'bb:a9', to: 'dhigh:7', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'rgb1', icon: 'led', title: 'RGB LED', text: 'Red, green and blue in one lens.' },
      { pin: 'dhigh:2', icon: 'wave', title: '~9 ~10 ~11', text: 'One PWM pin per colour.' },
      { part: 'rg', icon: 'resistor', title: '3 × 220 Ω', text: 'Each colour needs its own.' },
      { pin: 'dhigh:7', icon: 'ground', title: 'GND', text: 'The longest leg.' },
    ],
    overview: [
      'A mood lamp drifts from one colour to the next instead of jumping. The RGB LED holds three LEDs under one diffused lens, and each colour channel gets a brightness from 0 to 255.',
      'To **fade**, the sketch takes 50 small steps from the current colour to the target, about 20 ms apart. Your eye blends the three channels into one colour at every step.',
      { tips: [['led', 'Red + green light looks yellow; all three look white'], ['code', 'Small steps + short delays = smooth fades'], ['knob', 'Drag the sliders in Try it to invent a mood']] },
      { note: 'This uses a **common-cathode** LED (longest leg to GND). For a common-anode LED, put the long leg on 5 V and write `255 - value` to each pin.' },
    ],
    wiring: [{ pin: 'dhigh:2', to: '220 Ω → **red** leg' }, { pin: 'dhigh:3', to: '220 Ω → **green** leg' }, { pin: 'dhigh:4', to: '220 Ω → **blue** leg' }, { pin: 'dhigh:7', to: 'Longest leg (common cathode)' }],
    code: [{ file: 'mood.ino', lang: 'cpp', trace: { set: 7 }, source: `
const int RED = 9, GREEN = 10, BLUE = 11;
int r = 0, g = 0, b = 0;             // the colour showing now

void fadeTo(const char *mood, int tr, int tg, int tb) {
  Serial.println(mood);
  for (int i = 1; i <= 50; i++) {     // 50 steps, about one second
    analogWrite(RED,   r + (tr - r) * i / 50);
    analogWrite(GREEN, g + (tg - g) * i / 50);
    analogWrite(BLUE,  b + (tb - b) * i / 50);
    delay(20);
  }
  r = tr; g = tg; b = tb;
  delay(1500);
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  fadeTo("ocean", 0, 80, 255);
  fadeTo("forest", 20, 200, 40);
  fadeTo("sunset", 255, 70, 0);
  fadeTo("lavender", 150, 60, 255);
}
` }],
    sim: { type: 'rgb', led: 'rgb1', scale: 255, repl: 'fadeTo("mine", {r}, {g}, {b})', log: '{name}', sequence: [['ocean', [0, 0.31, 1]], ['forest', [0.08, 0.78, 0.16]], ['sunset', [1, 0.27, 0]], ['lavender', [0.59, 0.24, 1]]] },
    run: { cmd: UPLOAD('mood'), stop: [] },
    kit: [['1', 'RGB LED, common cathode', 'Four legs; the longest is the cathode.'], ['3', '220 Ω resistors'], ['4', 'Jumper wires']],
  },

  {
    id: 'chime',
    title: 'Door chime',
    summary: 'A button on pin 2 plays a two-note “ding-dong” on a piezo buzzer with `tone()`.',
    icon: 'circuit',
    focus: { pins: ['dlow:3', 'dhigh:1', 'dhigh:7'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'bz1', type: 'buzzer', legs: ['e14', 'e17'], label: 'Passive piezo buzzer', desc: 'Clicks once per pulse; tone() sends hundreds of pulses a second.' }, BUTTON],
      wires: [{ from: 'dhigh:1', to: 'bb:a14', color: '#f0a33a' }, { from: 'bb:a17', to: 'bb:tn17', color: '#2b2a30' }, { from: 'dhigh:7', to: 'bb:tn1', color: '#2b2a30' }, ...BUTTON_WIRES],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Doorbell', text: 'Press it while Run is on.' },
      { part: 'bz1', icon: 'sound', title: 'Piezo buzzer', text: 'Plays the two notes.' },
      { pin: 'dhigh:1', icon: 'wave', title: 'Pin 8', text: '`tone()` sets the pitch in Hz.' },
      { pin: 'dlow:3', icon: 'pin', title: 'Pin 2', text: 'LOW while the button is down.' },
    ],
    overview: [
      'A **passive** piezo buzzer clicks each time its voltage changes. `tone(pin, 659, 400)` toggles the pin 659 times a second for 400 ms, which you hear as the note E. Two notes, high then low, make the classic chime.',
      { tips: [['button', 'Hold the button in the 3D view or in Try it'], ['sound', 'Turn the sound on to hear it'], ['code', 'The `while` loop waits for you to let go']] },
      { note: 'Use a **passive** buzzer. An active one has its own oscillator and can only beep at a single pitch.' },
    ],
    wiring: [{ pin: 'dhigh:1', to: 'Buzzer **+** leg' }, { pin: 'dhigh:7', to: 'Top − rail → buzzer − leg and the button' }, { pin: 'dlow:3', to: 'Column 25, one side of the button' }],
    code: [{ file: 'chime.ino', lang: 'cpp', trace: { wait: 10, pressed: 11, ding: 12, dong: 15 }, source: `
const int BUTTON_PIN = 2;
const int BUZZER_PIN = 8;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);   // HIGH until pressed
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    Serial.println("ding");
    tone(BUZZER_PIN, 659, 400);        // E5
    delay(450);
    Serial.println("dong");
    tone(BUZZER_PIN, 523, 650);        // C5
    delay(700);
    while (digitalRead(BUTTON_PIN) == LOW) {}   // wait for release
  }
}
` }],
    codeNotes: ['Try three notes, or a lower pair such as 440 and 349 Hz for a softer chime.'],
    sim: {
      type: 'sequence', button: 'btn1', buzzer: 'bz1', caption: 'Press Run, then press the button here or in the 3D view. Turn the sound on to hear it.',
      steps: [{ tone: 659, ms: 450, log: 'ding', trace: 'ding' }, { tone: 523, ms: 700, log: 'dong', trace: 'dong' }],
    },
    run: { cmd: UPLOAD('chime'), stop: [] },
    kit: [['1', 'Passive piezo buzzer'], ['1', 'Tactile push button (6 mm)'], ['5', 'Jumper wires']],
  },

  {
    id: 'ruler',
    title: 'Ultrasonic ruler',
    summary: 'Time an echo with `pulseIn()` and print the distance to whatever is in front of the sensor.',
    icon: { type: 'module', preset: 'hcsr04' },
    focus: { pins: ['dlow:8', 'dlow:7', 'power:5', 'power:6'] },
    circuit: { breadboard: BB, parts: [SONAR], wires: [...RAILS, ...SONAR_WIRES] },
    callouts: [
      { part: 'us1', icon: 'ruler', title: 'HC-SR04', text: 'Click it to move the target.' },
      { pin: 'dlow:8', icon: 'pin', title: 'Pin 7 · TRIG', text: 'A 10 µs pulse fires a chirp.' },
      { pin: 'dlow:7', icon: 'wave', title: 'Pin 6 · ECHO', text: 'HIGH until the echo returns.' },
      { pin: 'power:5', icon: 'power', title: '5 V', text: 'The sensor runs at 5 V like the Uno.' },
    ],
    overview: [
      'The sensor is a speaker and a microphone for sound too high to hear. A short pulse on **TRIG** sends a chirp; **ECHO** then stays HIGH until the chirp bounces back. Sound covers 0.0343 cm per microsecond, and the trip is there and back, so the distance is `time × 0.0343 / 2`.',
      { tips: [['ruler', 'Click the sensor and drag the target closer or further'], ['clock', '`pulseIn()` measures the echo in microseconds'], ['power', 'Both parts run at 5 V, so ECHO connects straight to the Uno']] },
      'Hard, flat targets give the steadiest readings. Soft or angled ones scatter the sound.',
    ],
    wiring: [{ pin: 'power:5', to: '5 V rail → sensor **VCC**' }, { pin: 'power:6', to: 'GND rail → sensor **GND**' }, { pin: 'dlow:8', to: 'Sensor **TRIG**' }, { pin: 'dlow:7', to: 'Sensor **ECHO**' }],
    code: [{ file: 'ruler.ino', lang: 'cpp', trace: { read: 10 }, source: `
const int TRIG_PIN = 7;
const int ECHO_PIN = 6;

float readCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);          // 10 µs pulse = one measurement
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long echo = pulseIn(ECHO_PIN, HIGH, 30000);   // µs; 0 if nothing came back
  return echo * 0.0343 / 2;
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.print("Distance: ");
  Serial.print(readCm(), 1);
  Serial.println(" cm");
  delay(500);
}
` }],
    codeNotes: ['Nothing in range? `pulseIn()` gives up after 30 ms and the ruler prints 0.0 cm.'],
    sim: { type: 'distance', sensor: 'us1', max: 250, limitNote: 'The sim stops at 250 cm; the sensor is rated to about 4 m.' },
    run: { cmd: UPLOAD('ruler'), stop: [] },
    kit: [['1', 'HC-SR04 ultrasonic sensor'], ['6', 'Jumper wires']],
  },

  {
    id: 'gauge',
    title: 'Dial gauge',
    summary: 'A servo needle points to wherever you turn a potentiometer, like the dial on a dashboard.',
    icon: 'circuit',
    focus: { pins: ['analog:1', 'dhigh:2', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'pot1', type: 'pot', legs: ['f19', 'f20', 'f21'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 5 V and GND; the middle leg gives a voltage in between.', controls: { value: [0, 1] } },
        { id: 'sv1', type: 'servo', at: { x: 122, z: 84 }, legs: ['j26', 'j27', 'j28'], angle: 90, label: 'SG90 micro servo', desc: 'Orange = signal, red = +5 V, brown = GND.' },
      ],
      wires: [
        ...RAILS, { from: 'bb:j19', to: 'bb:bp19', color: '#e2483c' }, { from: 'bb:j21', to: 'bb:bn21', color: '#2b2a30' }, { from: 'bb:h20', to: 'analog:1', color: '#f2c12e' },
        { from: 'bb:g26', to: 'dhigh:2', color: '#f0a33a' }, { from: 'bb:h27', to: 'bb:bp27', color: '#e2483c' }, { from: 'bb:h28', to: 'bb:bn28', color: '#2b2a30' },
      ],
    },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Knob', text: 'Click it to turn it.' },
      { part: 'sv1', icon: 'servo', title: 'Needle', text: 'Follows the knob, 180° to 0°.' },
      { pin: 'analog:1', icon: 'wave', title: 'A0', text: 'Reads the knob as 0–1023.' },
      { pin: 'dhigh:2', icon: 'pin', title: 'Pin 9 · signal', text: 'Sets the servo angle.' },
    ],
    overview: [
      'This gadget joins an input to a moving output. The potentiometer’s middle leg gives any voltage from 0 to 5 V, `analogRead()` turns that into 0–1023, and `map()` converts it to an angle for the servo.',
      'The range is mapped **backwards** (1023 → 0°) so the needle swings clockwise as you turn the knob clockwise. Swap the last two numbers in `map()` if your needle moves the wrong way.',
      { tips: [['knob', 'Click the potentiometer and drag its slider'], ['servo', 'The needle follows within a few milliseconds'], ['power', 'Big servos need their own supply']] },
      { note: 'A small SG90 is fine on the Uno’s 5 V pin. Larger servos can draw more than USB provides and reset the board.', tone: 'warn' },
    ],
    wiring: [
      { pin: 'power:5', to: '5 V rail → potentiometer outer leg and servo **red**' },
      { pin: 'power:6', to: 'GND rail → potentiometer other outer leg and servo **brown**' },
      { pin: 'analog:1', to: 'Potentiometer **middle leg**' },
      { pin: 'dhigh:2', to: 'Servo **orange** (signal) wire' },
    ],
    code: [{ file: 'gauge.ino', lang: 'cpp', trace: { read: 11 }, source: `
#include <Servo.h>

Servo needle;

void setup() {
  needle.attach(9);
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(A0);                 // 0 - 1023
  int angle = map(knob, 0, 1023, 180, 0);    // backwards: clockwise knob, clockwise needle
  needle.write(angle);
  Serial.print("knob: ");
  Serial.println(knob);
  delay(50);
}
` }],
    codeNotes: ['Print a paper scale for the needle: 0 at 180°, 100 at 0°, and the gauge shows the knob as a percentage.'],
    sim: { type: 'knob', pot: 'pot1', servo: 'sv1', invert: true, label: 'A0 voltage', vmax: 5, max: 1023, every: 0.25, log: 'knob: {raw}', caption: 'Turn the knob here or from the potentiometer’s popover. The needle follows while Run is on.' },
    run: { cmd: UPLOAD('gauge'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['1', 'SG90 micro servo', 'With a horn (the white arm) as the needle.'], ['8', 'Jumper wires']],
  },

  {
    id: 'parking',
    title: 'Parking sensor',
    short: 'Parking sensor',
    summary: 'The capstone: the ruler, a beeper and a warning LED together, beeping faster as something gets closer.',
    icon: 'circuit',
    focus: { pins: ['dlow:8', 'dlow:7', 'dhigh:1', 'dhigh:6', 'power:5', 'power:6', 'power:7'] },
    // The sensor faces away from the camera at the back; the LED and buzzer sit in the front half.
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'res1', type: 'resistor', a: 'h5', b: 'h9', ohms: 220, label: '220 Ω resistor', desc: 'Limits the LED current.', controls: { ohms: [100, 220, 1000, 10000] }, drives: 'led1' },
        { id: 'led1', type: 'led', anode: 'f9', cathode: 'f10', color: 'red', label: 'Warning LED', desc: 'Lights when something is closer than 15 cm.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
        { ...SONAR, pins: ['a12', 'a13', 'a14', 'a15'], face: -1 },
        { id: 'bz1', type: 'buzzer', legs: ['f20', 'f23'], label: 'Passive piezo buzzer', desc: 'Beeps faster as the object gets closer.' },
      ],
      wires: [
        ...RAILS,
        { from: 'bb:bp1', to: 'bb:tp1', color: '#e2483c' }, { from: 'power:7', to: 'bb:tn3', color: '#2b2a30' },
        { from: 'bb:c12', to: 'bb:tp11', color: '#e2483c' }, { from: 'bb:c15', to: 'bb:tn15', color: '#2b2a30' },
        { from: 'dlow:8', to: 'bb:d13', color: '#f2c12e' }, { from: 'dlow:7', to: 'bb:d14', color: '#3fae5a' },
        { from: 'dhigh:6', to: 'bb:j5', color: '#f0a33a' }, { from: 'bb:j10', to: 'bb:bn10', color: '#2b2a30' },
        { from: 'dhigh:1', to: 'bb:j20', color: '#3b78d6' }, { from: 'bb:j23', to: 'bb:bn23', color: '#2b2a30' },
      ],
    },
    callouts: [
      { part: 'us1', icon: 'ruler', title: 'Distance', text: 'Click it to move the object.' },
      { part: 'bz1', icon: 'sound', title: 'Beeper', text: 'Closer = shorter gaps.' },
      { part: 'led1', icon: 'led', title: 'Warning LED', text: 'Solid under 15 cm.' },
      { pin: 'power:7', icon: 'ground', title: 'Second GND', text: 'Feeds the top ground rail.' },
    ],
    overview: [
      'Everything from the earlier gadgets comes together here: the **ruler** measures, the **buzzer** from the chime beeps with a gap that shrinks as the distance shrinks, and a red **LED** comes on when something is very close. It is the same idea as the sensor in a car bumper.',
      { tips: [['ruler', 'Click the sensor and drag the object closer'], ['sound', 'Turn the sound on in Try it'], ['code', '`constrain()` keeps the gap between 60 and 1000 ms']] },
      { h: 'Make it yours' },
      { steps: ['Replace the red LED with the traffic light: green when far, yellow, then red.', 'Add the dial gauge as a needle that shows the distance.', 'Use the crossing button to mute the beeper.'] },
    ],
    wiring: [
      { pin: 'power:5', to: '5 V rail (bottom +), jumpered to the top + rail → sensor VCC' },
      { pin: 'power:6', to: 'Bottom GND rail → LED and buzzer − legs' },
      { pin: 'power:7', to: 'Top GND rail → sensor GND' },
      { pin: 'dlow:8', to: 'Sensor **TRIG**' },
      { pin: 'dlow:7', to: 'Sensor **ECHO**' },
      { pin: 'dhigh:1', to: 'Buzzer **+**' },
      { pin: 'dhigh:6', to: '220 Ω resistor → LED long leg' },
    ],
    code: [{ file: 'parking.ino', lang: 'cpp', trace: { read: 22, beep: 36 }, source: `
const int TRIG_PIN = 7, ECHO_PIN = 6;
const int BUZZER_PIN = 8, LED_PIN = 13;
const int NEAR_CM = 15;

float readCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  return pulseIn(ECHO_PIN, HIGH, 30000) * 0.0343 / 2;
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  float cm = readCm();
  Serial.print("Distance: ");
  Serial.print(cm, 0);
  Serial.println(" cm");

  if (cm == 0) {                         // no echo: nothing in range
    digitalWrite(LED_PIN, LOW);
    delay(200);
  } else if (cm < NEAR_CM) {             // very close: solid tone + LED
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER_PIN, 880);
    delay(100);
  } else {                               // further away: short beep, longer gap
    digitalWrite(LED_PIN, LOW);
    tone(BUZZER_PIN, 880, 60);
    delay(constrain(cm * 10, 60, 1000));
  }
}
` }],
    sim: { type: 'parking', sensor: 'us1', buzzer: 'bz1', led: 'led1', near: 15, max: 400 },
    run: { cmd: UPLOAD('parking'), stop: [] },
    kit: [['1', 'HC-SR04, buzzer, LED and 220 Ω resistor', 'From earlier gadgets.'], ['12', 'Jumper wires']],
  },
];
