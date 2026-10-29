// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine (app.js, board3d.js, sims.js) is generic.

export const SITE = {
  id: 'learn-nano-esp32',
  title: 'Arduino Nano ESP32: Small Board, Big Projects',
  accent: '#00878f',
  logicVolts: 3.3,
  pinLimitMa: 28,
  shell: 'Serial Monitor · 115200 baud',
  terminalHint: 'Nano ESP32 connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Arduino Nano ESP32…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: '5 V / input power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O (3.3 V, PWM)', analog: 'Analog input',
  uart: 'Serial (RX/TX)', spi: 'SPI', i2c: 'Analog / I²C', reset: 'Reset / boot',
};

// Pin tables in physical order: "NAME|ALT|type" separated by "; ".
const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Arduino Nano ESP32 (ABX00083), top view, millimetres, USB-C on the left. Pin numbers, names and
// functions follow the JP1 (analog) and JP2 (digital) tables in the ABX00083 datasheet; pin 1 of
// both rows is at the USB end. LED_BUILTIN is D13 and the RGB LED is LED_RED / LED_GREEN / LED_BLUE,
// per the arduino_nano_nora variant in arduino-esp32. The 18 × 45 mm Nano outline, 15.24 mm row
// spacing and the parts on the board are stylised.
export const BOARD = {
  name: 'Arduino Nano ESP32',
  width: 45,
  depth: 18,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1f6f7a',
  holes: [{ x: 1.8, z: 1.8, r: 0.8 }, { x: 43.2, z: 1.8, r: 0.8 }, { x: 1.8, z: 16.2, r: 0.8 }, { x: 43.2, z: 16.2, r: 0.8 }],
  silkscreen: [{ text: 'NANO ESP32', x: 30, z: 9, size: 1.6, weight: 700, align: 'center' }],
  components: [
    { id: 'module', kind: 'shield', label: 'u-blox NORA-W106 (ESP32-S3)', desc: 'The ESP32-S3 in a module with Wi-Fi and Bluetooth: two cores at up to 240 MHz, 512 KB of RAM and 8 MB of PSRAM.', shape: 'box', x: 23, z: 9, w: 12, d: 10, h: 1.6, color: '#c8cacc', metal: true, text: 'NORA' },
    { id: 'flash', kind: 'chip', label: '16 MB flash', desc: 'External flash memory for your sketch and files.', shape: 'box', x: 35, z: 9, w: 5, d: 5, h: 0.9, color: '#2a2930' },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power, uploads and the serial monitor.', shape: 'box', x: 1.6, z: 9, w: 7.4, d: 9, h: 3.2, color: '#c3c6ca', metal: true },
    { id: 'rgb', kind: 'ledsmd', accent: '#ff5a4a', label: 'RGB LED', desc: 'LED_RED, LED_GREEN and LED_BLUE. Active-low: LOW turns a colour on.', shape: 'box', x: 10.5, z: 5, w: 1.6, d: 1.6, h: 0.6, color: '#f1ece2' },
    { id: 'ledL', kind: 'ledsmd', accent: '#ffb02e', label: 'Built-in LED (D13)', desc: 'LED_BUILTIN, on D13, which is also the SPI clock pin.', shape: 'box', x: 10.5, z: 13, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'pwr', kind: 'ledsmd', accent: '#3fe06b', lit: true, label: 'Power LED', desc: 'Lights whenever the board has power.', shape: 'box', x: 13, z: 13, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'reset', kind: 'button', label: 'Reset button', desc: 'Restarts your sketch. A double press puts the board into bootloader mode if an upload gets stuck.', shape: 'box', x: 40, z: 9, w: 3, d: 3, h: 1.4, color: '#d9d9d9', metal: true },
    { id: 'buck', kind: 'chip', label: 'Power converter (MP2322)', desc: 'Turns USB or 6–21 V on VIN into 3.3 V. There is no 5 V pin: only VBUS when powered from USB.', shape: 'box', x: 15, z: 5, w: 3, d: 3, h: 0.9, color: '#2a2930' },
  ],
  headers: [
    { id: 'digital', label: 'Digital header (JP2)', short: 'JP2', desc: 'D12 down to D0 plus GND and RST. All pins are 3.3 V and any of them can do PWM.',
      pins: pinTable('D12|CIPO (SPI)|spi; D11|COPI (SPI)|spi; D10|CS (SPI)|spi; D9||gpio; D8||gpio; D7||gpio; D6||gpio; D5||gpio; D4||gpio; D3||gpio; D2||gpio; GND||gnd; RST|reset|reset; D0|RX|uart; D1|TX|uart'),
      x: 4.72, z: 16.62 },
    { id: 'analog', label: 'Analog header (JP1)', short: 'JP1', desc: 'D13, the eight analog inputs A0–A7 and the power pins. A4 and A5 are the I²C pins.',
      pins: pinTable('D13|SCK, LED_BUILTIN|spi; 3V3|3.3 V out|power3; B0|BOOT0|reset; A0||analog; A1||analog; A2||analog; A3||analog; A4|SDA (I²C)|i2c; A5|SCL (I²C)|i2c; A6||analog; A7||analog; VBUS|5 V from USB|power5; B1|BOOT1|reset; GND||gnd; VIN|6–21 V in|power5'),
      x: 4.72, z: 1.38 },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, step: [2.54, 0], ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of the digital header, lined up so digital pin n is in column n + 5.
const BB = { x: -13.98, z: 28 };
const GND_RAIL = { from: 'digital:12', to: 'bb:tn17', color: '#2b2a30' };
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c16', b: 'c20', ohms: 220, label: '220 Ω resistor', desc: 'Limits the LED current. Try other values.', controls: { ohms: [100, 220, 470, 1000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e20', cathode: 'e21', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to the − rail.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'digital:11', to: 'bb:a16', color: '#f0a33a' }, { from: 'bb:a21', to: 'bb:tn21', color: '#2b2a30' }, GND_RAIL];
const LED_WIRING = [{ pin: 'digital:11', to: '220 Ω resistor → LED **long leg**' }, { pin: 'digital:12', to: 'Top **−** rail → LED short leg' }];
const BME = {
  breadboard: BB,
  parts: [{ id: 'bme', type: 'module', preset: 'breakout', pins: ['j21', 'j22', 'j23', 'j24'], label: 'BME280', color: '#5b2a86', desc: 'Temperature, humidity and pressure on I²C. Pins: VIN, GND, SCL, SDA.' }],
  wires: [{ from: 'analog:2', to: 'bb:f21', color: '#e2483c' }, { from: 'analog:14', to: 'bb:f22', color: '#2b2a30' }, { from: 'analog:9', to: 'bb:f23', color: '#f2c12e' }, { from: 'analog:8', to: 'bb:f24', color: '#3b78d6' }],
};
const BME_WIRING = [{ pin: 'analog:2', to: 'Sensor **VIN** (3.3 V)' }, { pin: 'analog:14', to: 'Sensor **GND**' }, { pin: 'analog:9', to: 'Sensor **SCL**' }, { pin: 'analog:8', to: 'Sensor **SDA**' }];
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn arduino:esp32:nano_nora ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Nano ESP32',
    short: 'Meet the board',
    summary: 'The classic Nano shape with an ESP32-S3 inside: Wi-Fi, Bluetooth and 3.3 V pins.',
    icon: 'board',
    focus: { components: ['module'] },
    callouts: [
      { component: 'module', icon: 'chip', title: 'ESP32-S3 module', text: 'Two cores, Wi-Fi and Bluetooth.' },
      { component: 'rgb', icon: 'led', title: 'RGB LED', text: 'Active-low: LOW = on.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Power and uploads.' },
      { pin: 'digital:11', icon: 'pin', title: 'Digital pins', text: 'D0–D13, all 3.3 V.' },
      { pin: 'analog:4', icon: 'wave', title: 'Analog pins', text: 'A0–A7 read 0–3.3 V.' },
    ],
    overview: [
      'The **Nano ESP32** keeps the small Nano footprint, so it plugs straight into a breadboard and fits Nano accessories, but swaps the old 8-bit chip for an **ESP32-S3** with **Wi-Fi** and **Bluetooth**. You program it with the Arduino IDE (or MicroPython).',
      { tips: [['target', 'Click a pin to see what it does'], ['rotr', 'Drag to orbit, scroll to zoom'], ['info', 'The numbers on the board match the key']] },
      { note: 'Every pin is **3.3 V**, and there is **no 5 V pin**: VBUS gives 5 V only while USB is plugged in. Never connect 5 V signals to a pin.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Chip', 'ESP32-S3 (u-blox NORA-W106)'], ['Memory', '512 KB RAM, 8 MB PSRAM, 16 MB flash'], ['Wireless', 'Wi-Fi 4, Bluetooth LE'], ['Pins', '14 digital, 8 analog, all PWM-capable'], ['Logic', '3.3 V'], ['Power in', 'USB-C, or 6–21 V on VIN']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Arduino Nano ESP32', 'Get the version with headers for breadboard use.'], ['1', 'USB-C data cable'], ['1', 'Half-size breadboard and jumper wires']],
  },

  {
    id: 'setup',
    title: 'Set up the Arduino IDE',
    summary: 'Install the Arduino ESP32 board package, pick Arduino Nano ESP32 and upload Blink.',
    icon: 'board',
    focus: { components: ['usb', 'ledL'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Use a data cable.' },
      { component: 'ledL', icon: 'led', title: 'Built-in LED', text: 'Blink flashes it.' },
      { component: 'reset', icon: 'button', title: 'Reset', text: 'Double-press if an upload sticks.' },
    ],
    overview: [
      { steps: [
        'Install the Arduino IDE from arduino.cc.',
        'Open **Boards Manager**, search for **Nano ESP32**, and install **Arduino ESP32 Boards**.',
        'Choose **Tools → Board → Arduino ESP32 Boards → Arduino Nano ESP32** and the new port.',
        'Open **File → Examples → 01.Basics → Blink** and upload. The small LED by the USB port blinks.',
      ] },
      { note: 'If an upload fails, double-press **Reset** quickly: the board enters bootloader mode and shows up on a new port.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli core install arduino:esp32', note: 'Arduino ESP32 Boards', out: ['Downloading packages...', 'Installing platform arduino:esp32...', 'Platform arduino:esp32 installed'] },
        { cmd: 'arduino-cli board list', note: 'find the port', out: ['Port         Protocol Type              Board Name         FQBN                     Core', '/dev/ttyACM0 serial   Serial Port (USB) Arduino Nano ESP32 arduino:esp32:nano_nora arduino:esp32'] },
        { cmd: UPLOAD('blink'), note: 'compile + upload', out: ['Sketch uses … bytes of program storage space.', 'Done uploading.'] },
      ],
    },
    kit: [['1', 'Computer with a free USB port']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'Blink an LED on D2 together with the board’s own LED on D13.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['digital:11', 'digital:12'], components: ['ledL'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'digital:11', icon: 'pin', title: 'D2', text: 'HIGH puts 3.3 V on your LED.' },
      { part: 'res1', icon: 'resistor', title: '220 Ω', text: 'Click it to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Click it to change its colour.' },
      { component: 'ledL', icon: 'led', title: 'LED_BUILTIN', text: 'On D13, blinks along.' },
    ],
    overview: [
      'Same code as on any Arduino: `pinMode()` once, then `digitalWrite()` HIGH and LOW in the loop. HIGH on this board is **3.3 V**.',
      { tips: [['pin', 'Pin names on the board match the code: D2 is 2'], ['resistor', 'Click the resistor to see the current'], ['clock', 'Drag the delay slider in Try it']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.ino', lang: 'cpp', trace: { on: 10, off: 14 }, source: `
const int LED_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED on");
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED off");
  delay(1000);
}
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on D2', delay: 1, volts: 3.3 },
    run: { cmd: UPLOAD('blink'), stop: [] },
    kit: [['1', 'LED'], ['1', '220 Ω resistor', 'Red-red-brown bands.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a button',
    summary: 'A push button on D3 switches the LED on D2.',
    icon: { type: 'button' },
    focus: { pins: ['digital:10', 'digital:11', 'digital:12'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e24', 'e26', 'f24', 'f26'], label: 'Push button', desc: 'Hold it down in the 3D view: pressing joins column 24 to column 26.' }],
      wires: [...LED_WIRES, { from: 'digital:10', to: 'bb:a24', color: '#3b78d6' }, { from: 'bb:a26', to: 'bb:tn26', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene while Run is on.' },
      { pin: 'digital:10', icon: 'pin', title: 'D3 · input', text: 'Reads LOW while pressed.' },
      { part: 'led1', icon: 'led', title: 'LED · D2', text: 'On while the button is held.' },
    ],
    overview: [
      '`INPUT_PULLUP` holds D3 at 3.3 V through a resistor inside the chip; the button connects it to ground, so it reads **LOW while pressed**.',
      { tips: [['button', 'Click and hold the button in the 3D view'], ['code', 'Only react when the reading changes'], ['clock', 'A 20 ms pause hides contact bounce']] },
    ],
    wiring: [...LED_WIRING, { pin: 'digital:10', to: 'Column 24, one side of the button' }],
    wiringNotes: ['Column 26, on the button’s other side, goes to the − rail.'],
    code: [{ file: 'button.ino', lang: 'cpp', trace: { wait: 12, pressed: 14, released: 14 }, source: `
const int BUTTON_PIN = 3;
const int LED_PIN = 2;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  static int last = HIGH;
  int now = digitalRead(BUTTON_PIN);
  if (now != last) {
    digitalWrite(LED_PIN, now == LOW ? HIGH : LOW);
    Serial.println(now == LOW ? "Pressed!" : "Released");
    last = now;
  }
  delay(20);
}
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on D2' },
    run: { cmd: UPLOAD('button'), stop: [] },
    kit: [['1', 'Tactile push button (6 mm)'], ['2', 'Jumper wires']],
  },

  {
    id: 'knob',
    title: 'Dim with a knob',
    summary: 'Read a potentiometer on A0 (0–4095) and dim the LED on D2.',
    icon: { type: 'pot' },
    focus: { pins: ['analog:4', 'analog:2', 'analog:14', 'digital:11', 'digital:12'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'pot1', type: 'pot', legs: ['f8', 'f9', 'f10'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 3.3 V and GND; the middle leg gives a voltage in between.', controls: { value: [0, 1] } }],
      wires: [...LED_WIRES, { from: 'analog:2', to: 'bb:bp2', color: '#e2483c' }, { from: 'analog:14', to: 'bb:bn3', color: '#2b2a30' }, { from: 'bb:j8', to: 'bb:bp8', color: '#e2483c' }, { from: 'bb:j10', to: 'bb:bn10', color: '#2b2a30' }, { from: 'analog:4', to: 'bb:h9', color: '#f2c12e' }],
    },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'analog:4', icon: 'wave', title: 'A0', text: 'analogRead() gives 0–4095.' },
      { pin: 'analog:2', icon: 'power', title: '3V3', text: 'Feeds the bottom + rail.' },
      { part: 'led1', icon: 'led', title: 'LED · D2', text: 'PWM sets its brightness.' },
    ],
    overview: [
      'The ESP32-S3’s ADC is **12-bit**: `analogRead(A0)` returns **0–4095**. `analogWrite()` works on any pin and takes 0–255, so the sketch divides by 16.',
      { tips: [['knob', 'Click the potentiometer and drag its slider'], ['wave', 'analogReadMilliVolts() gives calibrated millivolts'], ['led', 'The LED follows the knob']] },
    ],
    wiring: [...LED_WIRING, { pin: 'analog:2', to: 'Bottom **+** rail → potentiometer outer leg' }, { pin: 'analog:14', to: 'Bottom **−** rail → other outer leg' }, { pin: 'analog:4', to: 'Potentiometer **middle leg**' }],
    code: [{ file: 'knob.ino', lang: 'cpp', trace: { read: 9 }, source: `
const int LED_PIN = 2;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  int raw = analogRead(A0);                // 0 - 4095
  int mv = analogReadMilliVolts(A0);
  analogWrite(LED_PIN, raw / 16);          // 0 - 255
  Serial.printf("raw: %d  voltage: %d mV\\n", raw, mv);
  delay(250);
}
` }],
    sim: { type: 'knob', pot: 'pot1', led: 'led1', label: 'A0 voltage', vmax: 3.1, max: 4095, every: 0.25 },
    run: { cmd: UPLOAD('knob'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },

  {
    id: 'rgb',
    title: 'Mix colours',
    summary: 'Drive an RGB LED from D9, D10 and D11 and fade through a few colours.',
    icon: { type: 'rgbled' },
    focus: { pins: ['digital:4', 'digital:3', 'digital:2', 'digital:12'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'rgb1', type: 'rgbled', legs: ['e8', 'e9', 'e10', 'e11'], label: 'RGB LED', desc: 'Legs: red, common cathode (longest), green, blue.' },
        { id: 'rr', type: 'resistor', a: 'b3', b: 'b8', ohms: 220, label: '220 Ω · red' },
        { id: 'rg', type: 'resistor', a: 'c5', b: 'c10', ohms: 220, label: '220 Ω · green' },
        { id: 'rb', type: 'resistor', a: 'd6', b: 'd11', ohms: 220, label: '220 Ω · blue' },
      ],
      wires: [{ from: 'digital:4', to: 'bb:a3', color: '#e2483c' }, { from: 'digital:3', to: 'bb:a5', color: '#3fae5a' }, { from: 'digital:2', to: 'bb:a6', color: '#3b78d6' }, { from: 'bb:a9', to: 'bb:tn9', color: '#2b2a30' }, GND_RAIL],
    },
    callouts: [
      { part: 'rgb1', icon: 'led', title: 'RGB LED', text: 'Three LEDs under one lens.' },
      { pin: 'digital:4', icon: 'wave', title: 'D9 · D10 · D11', text: 'One PWM pin per colour.' },
      { pin: 'digital:12', icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
    ],
    overview: [
      'Each colour channel gets its own PWM pin and its own resistor. `analogWrite()` sets each from 0 to 255; your eye blends them.',
      { tips: [['led', 'Red + green looks yellow'], ['knob', 'Drag the sliders in Try it'], ['info', 'The board’s own RGB LED works too, but backwards: 0 is full on']] },
      { note: 'The built-in RGB LED is **active-low**: `analogWrite(LED_RED, 255 - value)` gives the same colours on it.' },
    ],
    wiring: [{ pin: 'digital:4', to: '220 Ω → **red** leg' }, { pin: 'digital:3', to: '220 Ω → **green** leg' }, { pin: 'digital:2', to: '220 Ω → **blue** leg' }, { pin: 'digital:12', to: 'Top − rail → longest leg (common cathode)' }],
    code: [{ file: 'colours.ino', lang: 'cpp', trace: { set: 4 }, source: `
const int RED = 9, GREEN = 10, BLUE = 11;

void show(const char *name, int r, int g, int b) {
  analogWrite(RED, r);
  analogWrite(GREEN, g);
  analogWrite(BLUE, b);
  Serial.println(name);
  delay(1000);
}

void setup() {
  Serial.begin(115200);
}

void loop() {
  show("teal", 0, 160, 140);
  show("orange", 255, 90, 0);
  show("violet", 140, 0, 255);
}
` }],
    sim: { type: 'rgb', led: 'rgb1', scale: 255, repl: 'show("mix", {r}, {g}, {b})', log: '{name}', sequence: [['teal', [0, 0.63, 0.55]], ['orange', [1, 0.35, 0]], ['violet', [0.55, 0, 1]]] },
    run: { cmd: UPLOAD('colours'), stop: [] },
    kit: [['1', 'RGB LED, common cathode'], ['3', '220 Ω resistors'], ['5', 'Jumper wires']],
  },

  {
    id: 'sound',
    title: 'Play a melody',
    summary: '`tone()` plays notes on a passive buzzer connected to D5.',
    icon: { type: 'buzzer' },
    focus: { pins: ['digital:8', 'digital:12'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'bz1', type: 'buzzer', legs: ['e13', 'e10'], label: 'Passive piezo buzzer', desc: 'Clicks once per pulse; the frequency is the pitch.' }],
      wires: [{ from: 'digital:8', to: 'bb:a13', color: '#f0a33a' }, { from: 'bb:a10', to: 'bb:tn10', color: '#2b2a30' }, GND_RAIL],
    },
    callouts: [
      { part: 'bz1', icon: 'sound', title: 'Piezo buzzer', text: 'Turns pulses into sound.' },
      { pin: 'digital:8', icon: 'wave', title: 'D5', text: 'tone() sets the pitch.' },
    ],
    overview: [
      '`tone(pin, 440, 300)` toggles the pin 440 times a second for 300 ms: the note A. A melody is just a list of frequencies and pauses.',
      { tips: [['sound', 'Turn the sound on in Try it'], ['wave', 'Double a frequency to go up an octave'], ['code', '0 Hz is a rest']] },
    ],
    wiring: [{ pin: 'digital:8', to: 'Buzzer **+** leg' }, { pin: 'digital:12', to: 'Top − rail → buzzer − leg' }],
    code: [{ file: 'melody.ino', lang: 'cpp', trace: { tone: 11, rest: 12 }, source: `
const int BUZZER_PIN = 5;
const int notes[] = { 392, 392, 440, 392, 523, 494, 0 };

void setup() {
  Serial.begin(115200);
}

void loop() {
  for (int hz : notes) {
    Serial.println(hz);
    if (hz) tone(BUZZER_PIN, hz, 350);
    delay(400);
  }
}
` }],
    sim: { type: 'buzzer', buzzer: 'bz1', pin: 5, log: '{hz}', melody: [['G4', 392, 400], ['G4', 392, 400], ['A4', 440, 400], ['G4', 392, 400], ['C5', 523, 400], ['B4', 494, 400], ['rest', 0, 400]] },
    run: { cmd: UPLOAD('melody'), stop: [] },
    kit: [['1', 'Passive piezo buzzer'], ['2', 'Jumper wires']],
  },

  {
    id: 'i2c',
    title: 'Read a sensor over I²C',
    short: 'I²C sensor',
    summary: 'Wire a BME280 to A4 (SDA) and A5 (SCL) and print the weather.',
    icon: { type: 'module', preset: 'breakout', label: 'BME280' },
    focus: { pins: ['analog:2', 'analog:14', 'analog:8', 'analog:9'] },
    circuit: BME,
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Temperature, humidity and pressure.' },
      { pin: 'analog:8', icon: 'wave', title: 'A4 · SDA', text: 'Carries the data.' },
      { pin: 'analog:9', icon: 'clock', title: 'A5 · SCL', text: 'The clock.' },
    ],
    overview: [
      'Like the classic Nano, the I²C pins are **A4 (SDA)** and **A5 (SCL)**, so `Wire` and sensor libraries work without naming pins.',
      { steps: ['Install **Adafruit BME280 Library** in Library Manager (accept its dependencies).', 'Wire the sensor with USB unplugged.', 'Upload and open the Serial Monitor at 115200 baud.'] },
      { tips: [['thermo', 'Breathe on the sensor in Try it'], ['code', 'Use 0x77 if 0x76 is not found'], ['power', 'Power it from 3V3']] },
    ],
    wiring: BME_WIRING,
    code: [{ file: 'weather.ino', lang: 'cpp', trace: { read: 15 }, source: `
#include <Wire.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void setup() {
  Serial.begin(115200);
  if (!bme.begin(0x76)) {
    Serial.println("No BME280 found: check the wiring");
    while (true) delay(10);
  }
}

void loop() {
  Serial.printf("%.2f °C  %.1f %%  %.1f hPa\\n",
                bme.readTemperature(), bme.readHumidity(), bme.readPressure() / 100.0F);
  delay(1000);
}
` }],
    sim: { type: 'env', sensor: 'bme' },
    run: { cmd: UPLOAD('weather'), stop: [] },
    kit: [['1', 'BME280 breakout board'], ['4', 'Jumper wires']],
  },

  {
    id: 'web',
    title: 'Control the LED over Wi-Fi',
    short: 'Wi-Fi LED',
    summary: 'Join your Wi-Fi and serve a page with buttons that switch the LED on D2.',
    icon: { type: 'led', color: 'blue' },
    focus: { pins: ['digital:11', 'digital:12'], components: ['module'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'module', icon: 'wifi', title: 'Wi-Fi', text: 'The antenna is inside the module.' },
      { part: 'led1', icon: 'led', title: 'LED · D2', text: 'Switched from your phone.' },
    ],
    overview: [
      'The `WebServer` library maps addresses to functions: `/led/on` and `/led/off` each switch the LED and send a short page back.',
      { steps: ['Put your Wi-Fi name and password in the sketch.', 'Upload and read the address in the Serial Monitor.', 'Open it on a phone on the same 2.4 GHz network.'] },
      { tips: [['wifi', '5 GHz networks will not connect'], ['globe', 'Each request is printed in the Serial Monitor'], ['code', 'Keep passwords out of sketches you share']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'webled.ino', lang: 'cpp', trace: { serve: 27, on: 9, off: 14 }, source: `
#include <WiFi.h>
#include <WebServer.h>

WebServer server(80);
const char PAGE[] = "<h1>Nano LED</h1><a href='/led/on'>On</a> <a href='/led/off'>Off</a>";

void ledOn() {
  Serial.println("GET /led/on");
  digitalWrite(2, HIGH);
  server.send(200, "text/html", PAGE);
}
void ledOff() {
  Serial.println("GET /led/off");
  digitalWrite(2, LOW);
  server.send(200, "text/html", PAGE);
}

void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("your-wifi", "your-password");
  while (WiFi.status() != WL_CONNECTED) delay(250);
  Serial.printf("Open http://%s/\\n", WiFi.localIP().toString().c_str());
  server.on("/", [] { server.send(200, "text/html", PAGE); });
  server.on("/led/on", ledOn);
  server.on("/led/off", ledOff);
  server.begin();
}

void loop() {
  server.handleClient();
}
` }],
    sim: { type: 'web', url: 'http://192.168.1.70/', led: 'led1', label: 'LED on D2', title: 'Nano LED', start: ['Open http://192.168.1.70/'], request: 'GET {path}' },
    run: { cmd: UPLOAD('webled'), stop: [] },
    kit: [['1', '2.4 GHz Wi-Fi network'], ['1', 'Phone on the same Wi-Fi']],
  },

  {
    id: 'project',
    title: 'Build a Wi-Fi weather station',
    short: 'Weather station',
    summary: 'The capstone: serve the BME280’s readings as a live page any phone on your network can open.',
    icon: 'circuit',
    focus: { pins: ['analog:2', 'analog:14', 'analog:8', 'analog:9'], components: ['module'] },
    circuit: BME,
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'From the I²C lesson.' },
      { component: 'module', icon: 'wifi', title: 'Web server', text: 'From the Wi-Fi lesson.' },
    ],
    overview: [
      'This combines the **I²C sensor** and the **web server**: `/api/reading` returns the latest values as JSON, ready for a page that asks for them every 3 seconds.',
      { h: 'Make it yours' },
      { steps: ['Light the board’s RGB LED blue when it is cold and red when it is warm.', 'Add the buzzer as a frost alarm.', 'Power it from a USB charger and put it by a window.'] },
    ],
    wiring: BME_WIRING,
    code: [{ file: 'station.ino', lang: 'cpp', trace: { reading: 9 }, source: `
#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_BME280.h>

WebServer server(80);
Adafruit_BME280 bme;

void reading() {
  Serial.printf("%s GET /api/reading\\n", server.client().remoteIP().toString().c_str());
  server.send(200, "application/json",
    "{\\"temperature\\":" + String(bme.readTemperature(), 1) +
    ",\\"humidity\\":" + String(bme.readHumidity(), 1) +
    ",\\"pressure\\":" + String(bme.readPressure() / 100.0F, 1) + "}");
}

void setup() {
  Serial.begin(115200);
  bme.begin(0x76);
  WiFi.begin("your-wifi", "your-password");
  while (WiFi.status() != WL_CONNECTED) delay(250);
  Serial.printf("Dashboard at http://%s/\\n", WiFi.localIP().toString().c_str());
  server.on("/api/reading", reading);
  server.begin();
}

void loop() {
  server.handleClient();
}
` }],
    codeNotes: ['Add a page at `/` that fetches `/api/reading`, as in the XIAO course’s weather lesson.'],
    sim: { type: 'dashboard', url: 'http://192.168.1.70/', sensor: 'bme', title: 'Nano weather', every: 3, start: ['Dashboard at http://192.168.1.70/'], request: '{client} GET {path}' },
    run: { cmd: UPLOAD('station'), stop: [] },
    kit: [['1', 'The BME280 circuit from the I²C lesson'], ['1', 'USB phone charger']],
  },
];
