// Everything specific to this device lives in this file: site metadata, the 3D model and the
// lessons. The engine is generic.
// Sources: M5Stack CoreS3 documentation (specifications, PORT.A pin map), the M5Unified and M5GFX
// library documentation, and the arduino-esp32 board list.

export const SITE = {
  id: 'learn-m5stack-cores3',
  title: 'M5Stack CoreS3: A Gadget in a Box',
  accent: '#e8641e',
  logicVolts: 3.3,
  shell: 'Serial Monitor · 115200 baud',
  terminalHint: 'CoreS3 connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to M5Stack CoreS3…', 'Hard resetting via RTS pin...'],
};

export const PIN_TYPES = {};

// M5Stack CoreS3, front view lying flat, millimetres: the 54 × 54 × 15.5 mm main unit, screen up,
// USB-C on the bottom edge and PORT.A (red) on the left side. Positions of the screen, camera,
// sensors and ports are taken from product photos and are stylised. The device has no pin headers:
// add-ons plug into PORT.A or the M5-Bus on the back.
export const BOARD = {
  name: 'M5Stack CoreS3',
  width: 54,
  depth: 54,
  thickness: 15.5,
  cornerRadius: 6,
  pcbColor: '#2b2c31',
  traces: false,
  holes: [],
  silkscreen: [{ text: 'M5STACK', x: 27, z: 50, size: 2.2, weight: 700, align: 'center' }],
  components: [
    { id: 'lcd', label: '2.0″ touch screen', desc: '320 × 240 IPS screen with a capacitive touch panel (FT6336U).', shape: 'box', x: 27, z: 26, w: 44, d: 36, h: 0.4, color: '#0b0d12' },
    { id: 'cam', label: 'Camera (GC0308)', desc: 'A 0.3-megapixel camera above the screen, enough for colour tracking and QR codes.', shape: 'cylinder', x: 22, z: 4.5, w: 3.2, h: 0.6, color: '#1b1c22', accent: '#3a6dd0' },
    { id: 'prox', kind: 'chip', label: 'Light and proximity sensor (LTR-553)', desc: 'Measures ambient light and whether something is close to the front of the device.', shape: 'box', x: 32, z: 4.5, w: 4, d: 2, h: 0.4, color: '#1b1c22' },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power, charging and uploads. The ESP32-S3’s native USB appears as a serial port.', shape: 'box', x: 27, z: 53.4, w: 9, d: 3, h: 3.2, color: '#c3c6ca', metal: true },
    { id: 'porta', label: 'PORT.A (red, I²C)', desc: 'A 4-pin HY2.0 Grove socket: GND, 5V, G2 (SDA) and G1 (SCL). M5 "Unit" sensors plug in here.', shape: 'box', x: 0.8, z: 38, w: 3, d: 8, h: 5, color: '#e2483c' },
    { id: 'power', kind: 'button', label: 'Power button', desc: 'On the side: press to turn on, hold it down to turn off.', shape: 'box', x: 53.4, z: 14, w: 2, d: 6, h: 3, color: '#c9ced6' },
    { id: 'sd', label: 'microSD slot', desc: 'On the side, for photos, logs and files.', shape: 'box', x: 53.4, z: 34, w: 2, d: 12, h: 1.4, color: '#14151a' },
  ],
  headers: [],
};

// ---------- shared pieces ----------
// The screen is a part so lessons can draw on it. ENV is an M5 Unit lying beside the device.
const SCREEN = (id, lines) => ({ id, type: 'screen', at: { x: 27, z: 26 }, w: 42, d: 32, y: 1, lines, label: 'Screen', desc: 'What the sketch draws, 320 × 240 pixels.' });
const ENV = { id: 'env', type: 'block', table: true, at: { x: -30, z: 38 }, w: 24, d: 32, h: 8, color: '#e8e6df', text: 'ENV IV', textColor: '#3a3d45', label: 'ENV IV unit', desc: 'An M5 Unit with an SHT40 (temperature, humidity, address 0x44) and a BMP280 (pressure, 0x76), on a Grove cable to PORT.A.' };
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn esp32:esp32:m5stack_cores3 ${sketch}`;
const show = (lines) => ({ scr: { lines } });

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the CoreS3',
    short: 'Meet the device',
    summary: 'An ESP32-S3 in a finished case with a touch screen, camera, motion sensor, speaker, microphones and a battery.',
    icon: 'board',
    focus: { components: ['lcd'] },
    callouts: [
      { component: 'lcd', icon: 'target', title: 'Touch screen', text: '320 × 240, capacitive.' },
      { component: 'cam', icon: 'camera', title: 'Camera', text: '0.3 MP.' },
      { component: 'porta', icon: 'plug', title: 'PORT.A', text: 'I²C Grove socket.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Power and uploads.' },
      { component: 'power', icon: 'button', title: 'Power', text: 'Side button.' },
    ],
    overview: [
      'Most boards need a breadboard, a screen and a battery before they become a gadget. The **CoreS3** already is one: an **ESP32-S3** with Wi-Fi in a 54 mm cube, with a touch screen, a camera, a motion sensor, a speaker, two microphones and a 500 mAh battery inside.',
      'Sensors and actuators from M5’s **Unit** range plug into the red **PORT.A** with one Grove cable, so many projects need no wiring at all.',
      { tips: [['target', 'Click the parts of the device'], ['code', 'One library, **M5Unified**, drives everything'], ['plug', 'PORT.A carries 5 V and I²C']] },
      { h: 'Specifications' },
      { specs: [['Chip', 'ESP32-S3, dual-core 240 MHz, Wi-Fi'], ['Memory', '16 MB flash, 8 MB PSRAM'], ['Screen', '2.0″ IPS, 320 × 240, capacitive touch'], ['Sensors', 'BMI270 motion sensor, BMM150 compass, LTR-553 light/proximity'], ['Audio', '1 W speaker, two microphones'], ['Camera', 'GC0308, 0.3 MP'], ['Battery', '500 mAh'], ['Size', '54 × 54 × 15.5 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'M5Stack CoreS3'], ['1', 'USB-C data cable']],
  },

  {
    id: 'setup',
    title: 'Set up Arduino',
    summary: 'Install the ESP32 boards and the M5Unified library, then pick M5Stack CoreS3.',
    icon: 'board',
    focus: { components: ['usb'] },
    callouts: [{ component: 'usb', icon: 'usb', title: 'USB-C', text: 'Appears as a serial port.' }],
    overview: [
      { steps: [
        'In the Arduino IDE **Boards Manager**, install **esp32** by Espressif.',
        'In the **Library Manager**, install **M5Unified** (it brings **M5GFX** with it).',
        'Choose **Tools → Board → esp32 → M5CoreS3** and the new port.',
        'Every sketch starts with `#include <M5Unified.h>` and `M5.begin()` in `setup()`.',
      ] },
      { note: 'If an upload will not start, hold the reset button on the bottom for about 3 seconds until the green light comes on, then upload again.' },
      { tips: [['code', '`M5.update()` in `loop()` reads the touch screen and buttons'], ['terminal', 'Click the commands in Try it'], ['info', 'M5Unified also runs on other M5 devices']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli core install esp32:esp32', note: 'ESP32 boards', out: ['Platform esp32:esp32 installed'] },
        { cmd: 'arduino-cli lib install M5Unified', note: 'the M5 library', out: ['Installed M5GFX', 'Installed M5Unified'] },
        { cmd: 'arduino-cli board list', note: 'find the port', out: ['Port         Protocol Type              Board Name FQBN Core', '/dev/ttyACM0 serial   Serial Port (USB) Unknown'] },
      ],
    },
    kit: [['1', 'Computer with the Arduino IDE or arduino-cli']],
  },

  {
    id: 'hello',
    title: 'Draw on the screen',
    summary: 'Print text in different sizes and colours with `M5.Display`, and count seconds.',
    icon: 'circuit',
    focus: { components: ['lcd'] },
    circuit: { parts: [SCREEN('scr', ['Hello, CoreS3!', 'Uptime: 0 s'])] },
    callouts: [{ part: 'scr', icon: 'target', title: 'M5.Display', text: '320 × 240 pixels, (0, 0) top left.' }],
    overview: [
      '`M5.Display` is a full graphics library: text, lines, circles, images. Coordinates start at the **top-left corner**, x to the right and y down.',
      'To change a number, draw the new text over the old one with a background colour, so the old digits disappear.',
      { tips: [['code', '`setTextSize(2)` doubles the font'], ['led', 'Colours like `TFT_ORANGE` are predefined'], ['clock', '`millis()` counts milliseconds since start']] },
    ],
    code: [{ file: 'hello.ino', lang: 'cpp', trace: { hello: 7, tick: 14 }, source: `
#include <M5Unified.h>

void setup() {
  M5.begin();
  M5.Display.setTextSize(2);
  M5.Display.setTextColor(TFT_ORANGE, TFT_BLACK);
  M5.Display.drawString("Hello, CoreS3!", 10, 10);
}

void loop() {
  M5.update();
  char text[24];
  snprintf(text, sizeof(text), "Uptime: %lu s  ", millis() / 1000);
  M5.Display.drawString(text, 10, 50);
  delay(1000);
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: the screen in the 3D view counts the seconds.', rest: show([]),
      steps: [
        { set: show(['Hello, CoreS3!', 'Uptime: 0 s']), ms: 1000, trace: 'hello' },
        { set: show(['Hello, CoreS3!', 'Uptime: 1 s']), ms: 1000, trace: 'tick' },
        { set: show(['Hello, CoreS3!', 'Uptime: 2 s']), ms: 1000, trace: 'tick' },
        { set: show(['Hello, CoreS3!', 'Uptime: 3 s']), ms: 1000, trace: 'tick' },
      ],
    },
    run: { cmd: UPLOAD('hello'), stop: [] },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'touch',
    title: 'Use the touch screen',
    short: 'Touch',
    summary: 'Read where the screen was tapped and draw a dot there.',
    icon: 'circuit',
    focus: { components: ['lcd'] },
    circuit: { parts: [SCREEN('scr', ['Tap the screen'])] },
    callouts: [{ part: 'scr', icon: 'target', title: 'Touch panel', text: 'Reports x and y of each tap.' }],
    overview: [
      'After `M5.update()`, `M5.Touch.getDetail()` describes the current touch: where it is, and whether it was just pressed, released or held. The touch panel uses the same coordinates as the screen.',
      { tips: [['target', 'x: 0–319, y: 0–239'], ['code', '`wasPressed()` is true once per tap'], ['button', '`isPressed()` stays true while a finger is down']] },
    ],
    code: [{ file: 'touch.ino', lang: 'cpp', trace: { tap: 13 }, source: `
#include <M5Unified.h>

void setup() {
  M5.begin();
  M5.Display.setTextSize(2);
  M5.Display.drawString("Tap the screen", 10, 10);
}

void loop() {
  M5.update();
  auto t = M5.Touch.getDetail();
  if (t.wasPressed()) {
    M5.Display.fillCircle(t.x, t.y, 6, TFT_ORANGE);
    Serial.printf("Tap at %d, %d\\n", t.x, t.y);
  }
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: three taps land on the screen.', rest: show(['Tap the screen']),
      steps: [
        { set: show(['Tap the screen']), ms: 1200 },
        { set: show(['Tap the screen', '   o']), ms: 1200, log: 'Tap at 52, 70', trace: 'tap' },
        { set: show(['Tap the screen', '   o', '          o']), ms: 1200, log: 'Tap at 180, 110', trace: 'tap' },
        { set: show(['Tap the screen', '   o', '          o', '      o']), ms: 1200, log: 'Tap at 120, 160', trace: 'tap' },
      ],
    },
    run: { cmd: UPLOAD('touch'), stop: [] },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'imu',
    title: 'Sense tilt',
    summary: 'The BMI270 motion sensor reports acceleration in g; tilt the device and watch the numbers.',
    icon: 'circuit',
    focus: { components: ['lcd'] },
    circuit: { parts: [SCREEN('scr', ['ax  0.00', 'ay  0.00', 'az  1.00'])] },
    callouts: [{ part: 'scr', icon: 'target', title: 'Readings', text: 'In g: 1 g is gravity.' }],
    overview: [
      'Lying flat, the device feels **1 g** of gravity on its z axis and nothing on x or y. Tilt it and gravity shares itself between the axes, so you can tell which way is down: the basis of spirit levels, step counters and screen rotation.',
      { tips: [['code', '`M5.Imu.getAccel(&ax, &ay, &az)` reads all three'], ['target', 'Flat: ax ≈ 0, ay ≈ 0, az ≈ 1'], ['info', 'The gyroscope (`getGyro`) measures turning speed']] },
    ],
    code: [{ file: 'tilt.ino', lang: 'cpp', trace: { read: 12 }, source: `
#include <M5Unified.h>

void setup() {
  M5.begin();
  M5.Display.setTextSize(3);
}

void loop() {
  M5.update();
  float ax, ay, az;
  M5.Imu.update();
  M5.Imu.getAccel(&ax, &ay, &az);
  M5.Display.setCursor(10, 10);
  M5.Display.printf("ax %5.2f\\nay %5.2f\\naz %5.2f", ax, ay, az);
  delay(100);
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: the device lies flat, tilts to the right, then stands on its edge.',
      steps: [
        { set: show(['ax  0.01', 'ay -0.02', 'az  1.00']), ms: 1500, trace: 'read' },
        { set: show(['ax  0.50', 'ay  0.00', 'az  0.86']), ms: 1500, trace: 'read' },
        { set: show(['ax  0.98', 'ay  0.01', 'az  0.12']), ms: 1500, trace: 'read' },
      ],
    },
    run: { cmd: UPLOAD('tilt'), stop: [] },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'porta',
    title: 'Plug in a Unit',
    summary: 'Scan PORT.A for I²C devices: an ENV IV unit answers at 0x44 and 0x76.',
    icon: 'circuit',
    focus: { components: ['porta'] },
    circuit: { parts: [SCREEN('scr', ['I2C scan', '0x44', '0x76']), ENV] },
    callouts: [
      { component: 'porta', icon: 'plug', title: 'PORT.A', text: 'GND, 5V, G2 (SDA), G1 (SCL).' },
      { part: 'env', icon: 'thermo', title: 'ENV IV', text: 'Two sensors, two addresses.' },
    ],
    overview: [
      'PORT.A is an **I²C** socket: SDA on **G2** and SCL on **G1**, plus 5 V and GND. The Units made for the red PORT.A speak I²C, and each has an address. An **I²C scanner** tries every address and lists who answers: the first thing to run when a new sensor seems dead.',
      'The ENV IV unit holds two chips: an **SHT40** (temperature and humidity) at **0x44** and a **BMP280** (pressure) at **0x76**. Its library then reads them for you.',
      { tips: [['plug', 'The Grove plug only fits one way'], ['code', '`Wire.begin(2, 1)` selects SDA = G2, SCL = G1'], ['info', 'Install "M5Unit-ENV" for the sensor readings']] },
    ],
    code: [{ file: 'scan.ino', lang: 'cpp', trace: { found: 13 }, source: `
#include <M5Unified.h>
#include <Wire.h>

void setup() {
  M5.begin();
  Wire.begin(2, 1);   // PORT.A: SDA = G2, SCL = G1
  M5.Display.setTextSize(2);
  M5.Display.println("I2C scan");
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) {
      M5.Display.printf("0x%02X\\n", addr);
      Serial.printf("Found a device at 0x%02X\\n", addr);
    }
  }
}

void loop() {}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: the scanner tries every address and lists the two that answer.',
      steps: [
        { set: show(['I2C scan']), ms: 1000 },
        { set: show(['I2C scan', '0x44']), ms: 1000, log: 'Found a device at 0x44', trace: 'found' },
        { set: show(['I2C scan', '0x44', '0x76']), ms: 2000, log: 'Found a device at 0x76', trace: 'found' },
      ],
    },
    run: { cmd: UPLOAD('scan'), stop: [] },
    kit: [['1', 'M5Stack ENV IV unit', 'Comes with its Grove cable.']],
  },
];
