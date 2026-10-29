// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine (app.js, board3d.js, sims.js) is generic.
import { pinPosition } from '../../engine/board-geometry.js';

export const SITE = {
  id: 'learn-xiao-esp32s3-sense',
  title: 'XIAO ESP32S3 Sense: Eyes and Ears',
  accent: '#7cb518',
  logicVolts: 3.3,
  shell: 'Serial Monitor · 115200 baud',
  terminalHint: 'XIAO connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to XIAO_ESP32S3…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: '5 V (USB)',
  power3: '3.3 V power',
  gnd: 'Ground',
  analog: 'GPIO with ADC and touch',
  strap: 'Strapping pin',
  i2c: 'I²C (default Wire pins)',
  uart: 'UART (Serial1)',
  spi: 'SPI, shared with the microSD card',
};

// Pin tables in physical order: "NAME|ALT|type" separated by "; ".
const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Seeed Studio XIAO ESP32S3 Sense, top view, millimetres, turned so the USB-C port is on the left.
// In Seeed's pinout (USB at the top) the left column is D0–D6 and the right column is 5V, GND, 3V3,
// D10–D7; turned this way, the left column becomes the front row and the right column the back row.
// Pin names, GPIO numbers and functions follow the "Pin map" table on Seeed's XIAO ESP32S3 getting-started
// wiki and the arduino-esp32 variant (pins_arduino.h for XIAO_ESP32S3). Board size 21 × 17.8 mm from
// the same wiki. The 2.54 mm pitch and 15.24 mm between the rows come from Seeed's KiCad footprint as
// described in a XIAO footprint guide, not from a Seeed drawing. The camera, microphone and microSD
// slot sit on the Sense expansion board stacked on top; they are drawn on the board and stylised.
// The board has no mounting holes.
const HEADERS = [
  { id: 'left', label: 'Front row: D0 … D6', short: 'D0–D6', desc: 'Seven GPIO pins on the side away from the power pins. All signals are 3.3 V.',
    pins: pinTable('D0|GPIO1, A0, TOUCH1|analog; D1|GPIO2, A1, TOUCH2|analog; D2|GPIO3, A2, TOUCH3, strapping pin|strap; D3|GPIO4, A3, TOUCH4|analog; '
      + 'D4|GPIO5, A4, SDA|i2c; D5|GPIO6, A5, SCL|i2c; D6|GPIO43, TX|uart'),
    x: 2.88, z: 16.53 },
  { id: 'right', label: 'Back row: 5V … D7', short: '5V–D7', desc: 'Power pins and four more GPIOs. On the Sense, D8–D10 are also wired to the microSD slot.',
    pins: pinTable('5V|VBUS, 5 V from USB|power5; GND||gnd; 3V3|3.3 V regulator output|power3; D10|GPIO9, A10, MOSI|spi; '
      + 'D9|GPIO8, A9, MISO|spi; D8|GPIO7, A8, SCK|spi; D7|GPIO44, RX|uart'),
    x: 2.88, z: 1.27 },
].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, step: [2.54, 0], ...h }));

// Small pin names printed next to each pin, on the inside of the board.
const pinLabels = HEADERS.flatMap((h) => h.pins.map((p) => {
  const pos = pinPosition(h, p.n);
  return { text: p.name, x: pos.x, z: pos.z + (pos.z < 5 ? 2.2 : -2.2), size: 0.9, align: 'center' };
}));

export const BOARD = {
  name: 'XIAO ESP32S3 Sense',
  width: 21,
  depth: 17.8,
  thickness: 1.2,
  cornerRadius: 1.2,
  pcbColor: '#2c3038',
  holes: [],
  silkscreen: [...pinLabels, { text: 'XIAO', x: 19.4, z: 8.9, size: 1.3, align: 'center' }],
  components: [
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power, uploads and the serial monitor. It also charges a LiPo battery soldered to the pads underneath.', shape: 'box', x: 1.6, z: 8.9, w: 7.4, d: 9, h: 3.2, color: '#c3c6ca', metal: true },
    { id: 'userled', kind: 'ledsmd', accent: '#ff9a2e', label: 'User LED (orange)', desc: 'Wired to GPIO21 (LED_BUILTIN). It is active-low: writing LOW turns it on.', shape: 'box', x: 6.6, z: 4.4, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'chgled', kind: 'ledsmd', accent: '#ff3b3b', label: 'Charge LED (red)', desc: 'Flashes while a battery charges and goes out when it is full.', shape: 'box', x: 6.6, z: 13.4, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'mic', kind: 'chip', label: 'Digital microphone (PDM)', desc: 'On the Sense board. Clock on GPIO42, data on GPIO41; read it with the ESP_I2S library.', shape: 'box', x: 6.6, z: 8.9, w: 2.6, d: 3.2, h: 1, color: '#c9ced6' },
    { id: 'cam', kind: 'chip', label: 'Camera module', desc: 'On the Sense board: an OV5640 with autofocus on current boards (some ship with an OV3660). It uses 14 GPIOs that are not on the pin rows.', shape: 'box', x: 12, z: 8.9, w: 8, d: 8, h: 5.5, color: '#1d2026' },
    { id: 'lens', label: 'Camera lens', desc: 'Keep fingerprints off it. Remove the protective film before taking photos.', shape: 'cylinder', x: 12, z: 8.9, w: 5.6, h: 8, color: '#101216' },
    { id: 'sd', under: true, label: 'microSD slot', desc: 'On the Sense board, underneath. Takes FAT32 cards up to 32 GB; chip select is GPIO21, shared with the user LED.', shape: 'box', x: 12, z: 8.9, w: 11, d: 12, h: 1.6, color: '#b8bcc4' },
    { id: 'ant', label: 'Antenna connector (U.FL)', desc: 'Clip the supplied Wi-Fi/Bluetooth antenna on here before using Wi-Fi.', shape: 'cylinder', x: 17.4, z: 13.6, w: 2, h: 1.2, color: '#d8b45a' },
    { id: 'boot', kind: 'button', label: 'BOOT button (B)', desc: 'GPIO0. Hold it while plugging in USB to force download mode if an upload fails.', shape: 'box', x: 18.8, z: 4.6, w: 2.6, d: 2.2, h: 1.2, color: '#d9d9d9', metal: true },
    { id: 'reset', kind: 'button', label: 'RESET button (R)', desc: 'Restarts your sketch.', shape: 'box', x: 18.8, z: 13.2, w: 2.6, d: 2.2, h: 1.2, color: '#d9d9d9', metal: true },
  ],
  headers: HEADERS,
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of the D0–D6 row, lined up so pin n of that row is in column n + 4.
const BB = { x: -13.28, z: 26 };
const GND_RAIL = { from: 'right:2', to: 'bb:tn4', color: '#2b2a30' };
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c5', b: 'c9', ohms: 220, label: '220 Ω resistor', desc: 'Limits the LED current. Try other values.', controls: { ohms: [100, 220, 470, 1000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e9', cathode: 'e10', color: 'green', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to the − rail.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'left:1', to: 'bb:a5', color: '#f0a33a' }, { from: 'bb:a10', to: 'bb:tn10', color: '#2b2a30' }, GND_RAIL];
const LED_WIRING = [{ pin: 'left:1', to: '220 Ω resistor → LED **long leg**' }, { pin: 'right:2', to: 'Top **−** rail → LED short leg' }];
const BME_CIRCUIT = {
  breadboard: BB,
  parts: [{ id: 'bme', type: 'module', preset: 'breakout', pins: ['j21', 'j22', 'j23', 'j24'], label: 'BME280', color: '#5b2a86', desc: 'Temperature, humidity and pressure sensor on the I²C bus. Pins: VIN, GND, SCL, SDA.' }],
  wires: [{ from: 'right:3', to: 'bb:f21', color: '#e2483c' }, { from: 'right:2', to: 'bb:f22', color: '#2b2a30' }, { from: 'left:6', to: 'bb:f23', color: '#f2c12e' }, { from: 'left:5', to: 'bb:f24', color: '#3b78d6' }],
};
const BME_WIRING = [{ pin: 'right:3', to: 'Sensor **VIN** (3.3 V)' }, { pin: 'right:2', to: 'Sensor **GND**' }, { pin: 'left:6', to: 'Sensor **SCL**' }, { pin: 'left:5', to: 'Sensor **SDA**' }];

const FQBN = 'esp32:esp32:XIAO_ESP32S3:PSRAM=opi';
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn ${FQBN} ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the XIAO Sense',
    short: 'Meet the board',
    summary: 'A thumb-sized ESP32-S3 with a camera, a microphone and a microSD slot stacked on top.',
    icon: 'board',
    focus: { components: ['cam', 'mic'] },
    callouts: [
      { component: 'lens', icon: 'camera', title: 'Camera', text: 'OV5640 with autofocus on current boards.' },
      { component: 'mic', icon: 'sound', title: 'Microphone', text: 'Digital PDM mic for sound and voice.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Power, uploads and battery charging.' },
      { pin: 'left:1', icon: 'pin', title: 'D0–D6', text: 'GPIOs on the front row.' },
      { pin: 'right:1', icon: 'power', title: '5V · GND · 3V3', text: 'Power pins on the back row.' },
      { component: 'ant', icon: 'wifi', title: 'Antenna', text: 'Clip it on before using Wi-Fi.' },
    ],
    overview: [
      'The **XIAO ESP32S3 Sense** is a 21 × 17.8 mm board built around the ESP32-S3: a dual-core chip with Wi-Fi, Bluetooth and instructions that speed up small neural networks. It has 8 MB of flash and 8 MB of PSRAM, enough to hold camera frames and a compact AI model.',
      'The **Sense** expansion board clips onto the top through a tiny board-to-board connector. It carries the **camera**, a digital **microphone** and a **microSD** slot, which makes this a little device that can see and hear.',
      { tips: [['target', 'Click the lens, the mic or a pin to read about it'], ['rotr', 'Drag to orbit, Q / E to turn, scroll to zoom'], ['info', 'The numbers on the board match the key']] },
      { note: 'All GPIOs are **3.3 V**. Never connect 5 V to a D pin. Do not pry the Sense board straight up: slide it off gently so the connector is not damaged.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Chip', 'ESP32-S3, dual-core, up to 240 MHz'], ['Memory', '8 MB flash, 8 MB PSRAM'], ['Wireless', '2.4 GHz Wi-Fi, Bluetooth 5 (LE)'], ['Camera', 'OV5640 (or OV3660) on the Sense board'], ['Microphone', 'Digital PDM, GPIO42 clock, GPIO41 data'], ['Storage', 'microSD, FAT32, up to 32 GB'], ['Pins', '11 GPIO + 5V, 3V3, GND'], ['Size', '21 × 17.8 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Seeed Studio XIAO ESP32S3 Sense', 'Comes with the camera, the expansion board and an antenna.'], ['1', 'USB-C data cable'], ['1', 'Half-size breadboard and jumper wires', 'Solder the two pin headers on first.']],
  },

  {
    id: 'setup',
    title: 'Set up Arduino',
    summary: 'Add Espressif’s ESP32 boards to Arduino, pick XIAO_ESP32S3, switch on PSRAM and upload a first sketch.',
    icon: 'board',
    focus: { components: ['usb', 'boot', 'userled'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Use a data cable, not a charge-only one.' },
      { component: 'boot', icon: 'button', title: 'BOOT', text: 'Hold while plugging in if uploads fail.' },
      { component: 'userled', icon: 'led', title: 'User LED', text: 'Blink flashes it. LOW = on.' },
    ],
    overview: [
      'The course uses the Arduino IDE (or arduino-cli) with Espressif’s **esp32** board package. Seeed’s camera and microphone examples are written for it.',
      { steps: [
        'Install the Arduino IDE from arduino.cc.',
        'In **File → Preferences → Additional boards manager URLs**, add `https://espressif.github.io/arduino-esp32/package_esp32_index.json`.',
        'Open **Boards Manager**, search for **esp32** and install **esp32 by Espressif Systems**.',
        'Choose **Tools → Board → esp32 → XIAO_ESP32S3** and the new port under **Tools → Port**.',
        'Set **Tools → PSRAM → OPI PSRAM**. The camera needs it; it does no harm elsewhere.',
        'Open **File → Examples → 01.Basics → Blink** and upload. The orange user LED blinks.',
      ] },
      { note: 'Upload stuck or no port? Unplug, hold **BOOT**, plug the cable back in, then release BOOT and upload again.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli config add board_manager.additional_urls https://espressif.github.io/arduino-esp32/package_esp32_index.json', note: 'add the ESP32 boards', out: [] },
        { cmd: 'arduino-cli core update-index && arduino-cli core install esp32:esp32', note: 'install them', out: ['Downloading index: package_esp32_index.json downloaded', 'Installing platform esp32:esp32...', 'Platform esp32:esp32 installed'] },
        { cmd: 'arduino-cli board list', note: 'find the port', out: ['Port         Protocol Type              Board Name   FQBN                     Core', '/dev/ttyACM0 serial   Serial Port (USB) XIAO_ESP32S3 esp32:esp32:XIAO_ESP32S3 esp32:esp32'] },
        { cmd: UPLOAD('blink'), note: 'compile + upload', out: ['Sketch uses … bytes of program storage space.', 'Hard resetting via RTS pin...'] },
      ],
    },
    kit: [['1', 'Computer with a free USB port', 'Windows, macOS or Linux.']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'Wire an LED to D0 and blink it together with the board’s own orange LED.',
    icon: { type: 'led', color: 'green' },
    focus: { pins: ['left:1', 'right:2'], components: ['userled'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'left:1', icon: 'pin', title: 'D0 · GPIO1', text: 'HIGH lights your LED.' },
      { part: 'res1', icon: 'resistor', title: '220 Ω', text: 'Click it to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Click it to change its colour.' },
      { component: 'userled', icon: 'led', title: 'User LED', text: 'Active-low: LOW turns it on.' },
      { pin: 'right:2', icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
    ],
    overview: [
      'In Arduino code the XIAO’s pins are called `D0` to `D10`, matching the labels on the board. `digitalWrite(D0, HIGH)` puts 3.3 V on D0 and lights an LED wired from there to ground.',
      'The orange **user LED** is wired the other way round: it lights when its pin (GPIO21, `LED_BUILTIN`) is **LOW**. The sketch blinks both, so you can see the difference.',
      { tips: [['pin', 'Use the D names; the GPIO numbers are different'], ['resistor', 'Click the resistor to see the LED current'], ['clock', 'Drag the delay slider in Try it']] },
    ],
    wiring: LED_WIRING,
    wiringNotes: ['With 3.3 V and 220 Ω, a green LED draws about 5 mA: clearly visible and gentle on the pin.'],
    code: [{ file: 'blink.ino', lang: 'cpp', trace: { on: 10, off: 14 }, source: `
const int LED_PIN = D0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(LED_BUILTIN, LOW);     // the user LED is active-low
  Serial.println("LED on");
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED off");
  delay(1000);
}
` }],
    codeNotes: ['The Serial Monitor must be set to **115200** baud, the speed in `Serial.begin()`.'],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on pin D0', delay: 1, volts: 3.3 },
    run: { cmd: UPLOAD('blink'), stop: [] },
    kit: [['1', 'LED (any colour)'], ['1', '220 Ω resistor', 'Red-red-brown bands.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a button',
    summary: 'A push button on D1 lights the LED while you hold it.',
    icon: { type: 'button' },
    focus: { pins: ['left:1', 'left:2', 'right:2'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e14', 'e16', 'f14', 'f16'], label: 'Push button', desc: 'Hold it down in the 3D view: pressing joins column 14 to column 16.' }],
      wires: [...LED_WIRES, { from: 'left:2', to: 'bb:a14', color: '#3b78d6' }, { from: 'bb:a16', to: 'bb:tn16', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene while Run is on.' },
      { pin: 'left:2', icon: 'pin', title: 'D1 · input', text: 'Reads LOW while pressed.' },
      { part: 'led1', icon: 'led', title: 'LED on pin D0', text: 'On while the button is held.' },
    ],
    overview: [
      'With `INPUT_PULLUP`, a resistor inside the ESP32-S3 holds D1 at 3.3 V. Pressing the button connects D1 to ground, so the pin reads **LOW while pressed**.',
      { tips: [['button', 'Click and hold the button in the 3D view'], ['code', 'The sketch only reacts when the reading changes'], ['clock', 'A 20 ms pause hides contact bounce']] },
    ],
    wiring: [...LED_WIRING, { pin: 'left:2', to: 'Column 14, one side of the button' }],
    wiringNotes: ['The button straddles the centre channel; column 16 on its other side goes to the − rail.'],
    code: [{ file: 'button.ino', lang: 'cpp', trace: { wait: 12, pressed: 14, released: 14 }, source: `
const int BUTTON_PIN = D1;
const int LED_PIN = D0;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);   // HIGH until pressed
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
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on pin D0' },
    run: { cmd: UPLOAD('button'), stop: [] },
    kit: [['1', 'Tactile push button (6 mm)'], ['2', 'Jumper wires']],
  },

  {
    id: 'knob',
    title: 'Turn a knob',
    summary: 'Read a potentiometer on A3 with the 12-bit ADC and dim the LED to match.',
    icon: { type: 'pot' },
    focus: { pins: ['left:4', 'left:1', 'right:2', 'right:3'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'pot1', type: 'pot', legs: ['c20', 'c21', 'c22'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 3V3 and GND; the middle leg gives a voltage in between.', controls: { value: [0, 1] } }],
      wires: [...LED_WIRES, { from: 'right:3', to: 'bb:tp2', color: '#e2483c' }, { from: 'bb:a20', to: 'bb:tp20', color: '#e2483c' }, { from: 'bb:a22', to: 'bb:tn22', color: '#2b2a30' }, { from: 'left:4', to: 'bb:d21', color: '#f2c12e' }],
    },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'left:4', icon: 'wave', title: 'D3 · A3', text: '`analogRead()` gives 0–4095.' },
      { pin: 'right:3', icon: 'power', title: '3V3', text: 'Feeds the top + rail.' },
      { part: 'led1', icon: 'led', title: 'LED on pin D0', text: 'Brightness follows the knob.' },
    ],
    overview: [
      'The ESP32-S3 measures voltages with a **12-bit** ADC, so `analogRead()` returns **0 to 4095**. With the default settings the reading tops out at about 3.1 V, a little below the 3.3 V rail. `analogReadMilliVolts()` converts the reading to millivolts using the chip’s calibration.',
      '`analogWrite()` then dims the LED on D0 with PWM. It takes 0–255, so the sketch divides the reading by 16.',
      { tips: [['knob', 'Click the potentiometer and drag its slider'], ['wave', 'Watch raw and millivolt readings together'], ['led', 'The LED follows the knob']] },
      { note: 'Skip **D2** for analog work: it is GPIO3, a strapping pin the chip samples at reset.' },
    ],
    wiring: [...LED_WIRING, { pin: 'right:3', to: 'Top **+** rail → potentiometer outer leg' }, { pin: 'left:4', to: 'Potentiometer **middle leg**' }],
    wiringNotes: ['The other outer leg goes to the top − rail. Swap the outer legs if the LED dims the wrong way.'],
    code: [{ file: 'knob.ino', lang: 'cpp', trace: { read: 10 }, source: `
const int KNOB_PIN = A3;      // D3 on the board, GPIO4
const int LED_PIN = D0;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);   // 0 - 4095
}

void loop() {
  int raw = analogRead(KNOB_PIN);
  int mv = analogReadMilliVolts(KNOB_PIN);
  analogWrite(LED_PIN, raw / 16);          // 0 - 255
  Serial.printf("raw: %d  voltage: %d mV\\n", raw, mv);
  delay(250);
}
` }],
    sim: { type: 'knob', pot: 'pot1', led: 'led1', label: 'A3 voltage', vmax: 3.1, max: 4095, every: 0.25 },
    run: { cmd: UPLOAD('knob'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['4', 'Jumper wires']],
  },

  {
    id: 'i2c',
    title: 'Sense the weather',
    summary: 'Connect a BME280 to the I²C pins D4 and D5 and print temperature, humidity and pressure.',
    icon: { type: 'module', preset: 'breakout', label: 'BME280' },
    focus: { pins: ['right:3', 'right:2', 'left:5', 'left:6'] },
    circuit: BME_CIRCUIT,
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Temperature, humidity and pressure.' },
      { pin: 'left:5', icon: 'wave', title: 'D4 · SDA', text: 'Carries the data.' },
      { pin: 'left:6', icon: 'clock', title: 'D5 · SCL', text: 'The XIAO sets the clock.' },
      { pin: 'right:3', icon: 'power', title: '3V3', text: 'Powers the sensor.' },
    ],
    overview: [
      '**I²C** needs just two signal wires: SDA for data and SCL for the clock. On the XIAO, the `Wire` library uses **D4 (SDA)** and **D5 (SCL)** by default, so no pin numbers appear in the code.',
      { steps: ['In **Library Manager**, install **Adafruit BME280 Library** (it asks to add its dependencies: accept).', 'Wire the sensor with USB unplugged.', 'Upload and open the Serial Monitor at 115200 baud.'] },
      { tips: [['thermo', 'Breathe on the sensor in Try it'], ['code', 'Most boards answer at address `0x76`; some use `0x77`'], ['power', 'Power it from 3V3, not 5V']] },
    ],
    wiring: BME_WIRING,
    wiringNotes: ['Breakout boards usually include the pull-up resistors I²C needs, so no extra parts are required.'],
    code: [{ file: 'weather.ino', lang: 'cpp', trace: { read: 15 }, source: `
#include <Wire.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void setup() {
  Serial.begin(115200);
  if (!bme.begin(0x76)) {               // try 0x77 if this fails
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
    kit: [['1', 'BME280 breakout board', 'Check it says BME280 (with humidity), not BMP280.'], ['4', 'Jumper wires']],
  },

  {
    id: 'mic',
    title: 'Listen with the microphone',
    short: 'Sound meter',
    summary: 'Read the Sense board’s digital microphone and turn loudness into LED brightness.',
    icon: 'circuit',
    focus: { components: ['mic'], pins: ['left:1', 'right:2'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'mic', icon: 'sound', title: 'PDM microphone', text: 'Clock GPIO42, data GPIO41.' },
      { part: 'led1', icon: 'led', title: 'LED on pin D0', text: 'Glows brighter when it is loud.' },
      { pin: 'left:1', icon: 'pin', title: 'D0', text: 'PWM sets the brightness.' },
    ],
    overview: [
      'The microphone sends sound as a fast stream of 1-bit pulses (**PDM**). The `ESP_I2S` library that comes with the esp32 package turns it into ordinary 16-bit samples, 16 000 per second.',
      'Sound is a wave around zero, so the sketch measures **loudness** as the average size of 256 samples, ignoring the sign. Quiet rooms give small numbers; a clap gives a big one.',
      { tips: [['sound', 'Drag the loudness slider in Try it'], ['led', 'The LED brightness follows the level'], ['code', 'Open **Tools → Serial Plotter** to see the level as a graph']] },
      { note: 'This uses the esp32 package **3.x**. Older 2.x versions used a different `I2S` library with other function names.' },
    ],
    wiring: LED_WIRING,
    wiringNotes: ['The microphone needs no wiring: it is on the Sense board and uses GPIO41 and GPIO42 internally.'],
    code: [{ file: 'soundmeter.ino', lang: 'cpp', trace: { read: 17 }, source: `
#include <ESP_I2S.h>

I2SClass i2s;
const int LED_PIN = D0;
int16_t samples[256];

void setup() {
  Serial.begin(115200);
  i2s.setPinsPdmRx(42, 41);      // clock, data: wired on the Sense board
  if (!i2s.begin(I2S_MODE_PDM_RX, 16000, I2S_DATA_BIT_WIDTH_16BIT, I2S_SLOT_MODE_MONO)) {
    Serial.println("Microphone failed to start");
    while (true) delay(10);
  }
}

void loop() {
  size_t count = i2s.readBytes((char *)samples, sizeof(samples)) / 2;
  long sum = 0;
  for (size_t i = 0; i < count; i++) sum += abs(samples[i]);
  int level = count ? sum / count : 0;
  analogWrite(LED_PIN, constrain(level / 8, 0, 255));
  Serial.print("level: ");
  Serial.println(level);
}
` }],
    codeNotes: ['Clap detector idea: remember the quiet level, and toggle the LED when `level` jumps to three times that.'],
    sim: { type: 'knob', led: 'led1', slider: 'loudness', readout: 'raw', label: 'sound level', max: 2000, every: 0.2, log: 'level: {raw}', caption: 'Drag the loudness to simulate a quiet room, talking or a clap. The LED follows the level.' },
    run: { cmd: UPLOAD('soundmeter'), stop: [] },
    kit: [['1', 'The LED circuit from lesson 3']],
  },

  {
    id: 'camera',
    title: 'Take a photo',
    summary: 'Start the camera, capture one JPEG and save it to the microSD card.',
    icon: 'board',
    focus: { components: ['cam', 'lens', 'sd'] },
    callouts: [
      { component: 'lens', icon: 'camera', title: 'Camera', text: 'Captures straight to JPEG.' },
      { component: 'sd', icon: 'memory', title: 'microSD (underneath)', text: 'FAT32, up to 32 GB.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Watch the Serial Monitor for “Saved”.' },
    ],
    overview: [
      'The camera writes each frame into **PSRAM** (that is why the setup lesson switched it on), already compressed as a JPEG. The sketch grabs one frame and writes those bytes to a file on the microSD card.',
      { steps: [
        'Format a microSD card as **FAT32** and insert it into the slot under the Sense board.',
        'Open **File → Examples → ESP32 → Camera → CameraWebServer** and copy its `camera_pins.h` into your sketch folder.',
        'Upload with **PSRAM: OPI PSRAM**, open the Serial Monitor, then press RESET to take another photo.',
      ] },
      { tips: [['camera', 'Peel the protective film off the lens'], ['memory', 'Each run overwrites /photo.jpg'], ['chip', 'GPIO21 is the card’s chip select, so the user LED is off-limits here']] },
      { note: 'Streaming video for a long time makes the board **hot**. Let it cool before touching the camera.', tone: 'warn' },
    ],
    code: [{ file: 'photo.ino', lang: 'cpp', trace: { start: 26, capture: 30 }, source: `
#include "esp_camera.h"
#include "FS.h"
#include "SD.h"
#define CAMERA_MODEL_XIAO_ESP32S3
#include "camera_pins.h"         // copied from the CameraWebServer example

void setup() {
  Serial.begin(115200);
  camera_config_t config = {};
  config.pin_d0 = Y2_GPIO_NUM;  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;    config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM; config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;    config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_SVGA;          // 800 x 600
  config.jpeg_quality = 12;                    // lower = better quality
  config.fb_count = 1;
  config.fb_location = CAMERA_FB_IN_PSRAM;

  Serial.println("Starting the camera and the SD card...");
  if (esp_camera_init(&config) != ESP_OK || !SD.begin(21)) {
    Serial.println("Camera or SD card failed");
    return;
  }
  camera_fb_t *fb = esp_camera_fb_get();
  File file = SD.open("/photo.jpg", FILE_WRITE);
  file.write(fb->buf, fb->len);
  file.close();
  esp_camera_fb_return(fb);
  Serial.println("Saved /photo.jpg");
}

void loop() {}
` }],
    codeNotes: ['`esp_camera_fb_return()` hands the frame buffer back to the driver; forget it and the next capture has nowhere to go.'],
    sim: { type: 'camera', start: ['Starting the camera and the SD card...'], file: '/photo.jpg' },
    run: { cmd: UPLOAD('photo') },
    kit: [['1', 'microSD card', 'FAT32, 32 GB or smaller.']],
  },

  {
    id: 'wifi',
    title: 'Weather on your phone',
    short: 'Wi-Fi dashboard',
    summary: 'Join your Wi-Fi and serve the BME280 readings as a live web page.',
    icon: 'circuit',
    focus: { pins: ['right:3', 'right:2', 'left:5', 'left:6'], components: ['ant'] },
    circuit: BME_CIRCUIT,
    callouts: [
      { component: 'ant', icon: 'wifi', title: 'Antenna', text: 'Clip it on or Wi-Fi will be weak.' },
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Same wiring as the weather lesson.' },
      { component: 'usb', icon: 'usb', title: 'Serial Monitor', text: 'Prints the page address.' },
    ],
    overview: [
      'The ESP32-S3 can join a 2.4 GHz Wi-Fi network and run a small **web server**. The sketch serves a page at `/` and the readings as JSON at `/api/reading`; the page asks for new readings every 3 seconds.',
      { steps: ['Clip the antenna onto the U.FL connector.', 'Put your Wi-Fi name and password in the sketch.', 'Upload, read the address in the Serial Monitor and open it on a phone on the same network.'] },
      { tips: [['wifi', '2.4 GHz networks only; 5 GHz will not connect'], ['globe', 'Every page request is logged in the Serial Monitor'], ['code', '`page.h` keeps the HTML out of the main sketch']] },
    ],
    wiring: BME_WIRING,
    code: [
      { file: 'dashboard.ino', lang: 'cpp', trace: { reading: 10 }, source: `
#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_BME280.h>
#include "page.h"

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
  server.on("/", [] { server.send(200, "text/html", PAGE); });
  server.on("/api/reading", reading);
  server.begin();
}

void loop() {
  server.handleClient();
}
` },
      { file: 'page.h', lang: 'cpp', source: `
const char PAGE[] = R"html(<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>XIAO weather</title>
<h1>XIAO weather</h1>
<p>Temperature: <b id="temperature">-</b> °C</p>
<p>Humidity: <b id="humidity">-</b> %</p>
<p>Pressure: <b id="pressure">-</b> hPa</p>
<script>
  async function refresh() {
    const reading = await fetch("/api/reading").then((res) => res.json());
    for (const key in reading) document.getElementById(key).textContent = reading[key];
  }
  refresh();
  setInterval(refresh, 3000);
</script>)html";
` },
    ],
    codeNotes: ['Never share a sketch with your real Wi-Fi password in it. Put the credentials in a separate file you leave out of version control.'],
    sim: { type: 'dashboard', url: 'http://192.168.1.50/', sensor: 'bme', title: 'XIAO weather', every: 3, start: ['Dashboard at http://192.168.1.50/'], request: '{client} GET {path}' },
    run: { cmd: UPLOAD('dashboard'), file: 'dashboard.ino', stop: [] },
    kit: [['1', 'The BME280 circuit from the weather lesson'], ['1', '2.4 GHz Wi-Fi network']],
  },

  {
    id: 'ai',
    title: 'Detect faces with AI',
    short: 'On-device AI',
    summary: 'Flash a ready-made face-detection model from SenseCraft AI and watch it run on the board, no code needed.',
    icon: 'board',
    focus: { components: ['cam', 'lens'] },
    callouts: [
      { component: 'lens', icon: 'camera', title: 'Camera', text: 'Feeds frames to the model.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'The browser flashes the model over it.' },
      { component: 'boot', icon: 'button', title: 'BOOT', text: 'Hold it if the device will not connect.' },
    ],
    overview: [
      'So far you wrote every line yourself. Here the board runs a small **neural network** trained by someone else: it looks at each camera frame and draws a box around every face it finds. The model runs **on the XIAO**; no image leaves the board.',
      { h: 'Deploy a model' },
      { steps: [
        'Open the SenseCraft AI model library at **sensecraft.seeed.cc/ai**.',
        'Under **Supported Devices**, pick **XIAO ESP32S3 Sense**, then open the **Face Detection** model.',
        'Click **Deploy Model**, then **Connect Device**, and plug in the board with a USB-C data cable.',
        'Check the model name, click **Confirm**, choose the board’s serial port and click **Connect**.',
        'Wait a minute or two while the model uploads. The **Preview** then shows the camera with a box around each face.',
      ] },
      { h: 'Tune it' },
      'Below the preview, **Confidence Threshold** decides how sure the model must be before it reports a face: raise it to drop false alarms. **IoU Threshold** sets how much two boxes must overlap to count as the same face.',
      { tips: [['camera', 'Good light helps far more than a better model'], ['chip', 'The ESP32-S3’s vector instructions speed up the maths'], ['info', 'Uploading a model replaces your sketch; re-upload it afterwards']] },
      { note: 'Want to train your own? Seeed’s guides show how to collect images, train a small model on a computer and upload it the same way. Input images must be square and no larger than 240 × 240 (192 × 192 is the default).' },
    ],
    kit: [['1', 'Computer with a web browser and USB-C cable']],
  },
];
