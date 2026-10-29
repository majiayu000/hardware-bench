// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine (app.js, board3d.js, sims.js) is generic.
import { pinPosition } from '../../engine/board-geometry.js';

export const SITE = {
  id: 'learn-arduino-uno-q',
  title: 'Arduino UNO Q: Two Brains',
  accent: '#00878f',
  logicVolts: 3.3,
  pinLimitMa: 8,
  shell: 'App Lab · console',
  terminalHint: 'UNO Q connected. Press Run to build the app and start it on the board.',
  runPreamble: ['Building the app…', 'Flashing the sketch to the STM32U585…', 'Starting the Python side…'],
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O (3.3 V)', pwm: 'Digital I/O with PWM (~)',
  analog: 'Analog input', uart: 'Serial (USART1)', i2c: 'I²C', reset: 'Reset', strap: 'Boot strap',
};

// Pin tables in physical order: "NAME|ALT|type" separated by "; ".
const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Arduino UNO Q (ABX00162 / ABX00173), top view, millimetres, USB-C on the left edge.
// The board is 68.58 × 53.34 mm and keeps the UNO R3 outline, holes and header positions
// (datasheet, "Mechanical Information"), so the headers sit exactly where they do on the Uno R3.
// Pin names and functions follow the JDIGITAL and JANALOG pin maps in the ABX00162 datasheet:
// every header pin is 3.3 V logic. LED_BUILTIN is RGB LED 3's red channel (PH10), active-low, per the
// arduino_uno_q variant in ArduinoCore-zephyr. Chip and connector placement is stylised.
const HEADERS = [
  { id: 'dlow', label: 'Digital pins 0–7', short: 'D', desc: 'Digital pins 0–7 (JDIGITAL). All 3.3 V. ~D3 is the one pin that must never see 5 V.',
    pins: pinTable('D0|RX, USART1|uart; D1|TX, USART1|uart; D2||gpio; D3|~PWM, not 5 V-tolerant|pwm; D4||gpio; D5|~PWM|pwm; D6|~PWM|pwm; D7||gpio'),
    x: 66.04, z: 2.54, step: [-2.54, 0] },
  { id: 'dhigh', label: 'Digital pins 8–13, GND, AREF, SDA, SCL', short: 'D', desc: 'Digital pins 8–13 plus GND, AREF and the I²C pins D20 (SDA) and D21 (SCL).',
    pins: pinTable('D8||gpio; D9|~PWM|pwm; D10|~PWM, SPI SS|pwm; D11|~PWM, SPI MOSI|pwm; D12|SPI MISO|gpio; D13|SPI SCK|gpio; GND||gnd; AREF|analog reference|analog; SDA|D20, I²C data|i2c; SCL|D21, I²C clock|i2c'),
    x: 44.196, z: 2.54, step: [-2.54, 0] },
  { id: 'power', label: 'Power header', short: 'Power', desc: 'BOOT, IOREF, RESET, 3.3 V, 5 V, ground and VIN (7–24 V in).',
    pins: pinTable('BOOT|MCU boot strap|strap; IOREF|3.3 V reference, output only|power3; RESET|MCU reset|reset; 3V3|3.3 V out|power3; 5V|5 V system rail|power5; GND||gnd; GND||gnd; VIN|7–24 V input|power5'),
    x: 27.94, z: 50.8, step: [2.54, 0] },
  { id: 'analog', label: 'Analog inputs A0–A5', short: 'A', desc: 'Analog inputs, 0–3.3 V. A0 and A1 also have DACs; never put 5 V on them.',
    pins: pinTable('A0|D14, DAC0|analog; A1|D15, DAC1|analog; A2|D16|analog; A3|D17|analog; A4|D18, I²C3 SDA|analog; A5|D19, I²C3 SCL|analog'),
    x: 50.8, z: 50.8, step: [2.54, 0] },
].map((h) => ({ layout: 'single', style: 'female', pitch: 2.54, ...h }));

const pinLabels = HEADERS.flatMap((h) => h.pins.map((p) => {
  const pos = pinPosition(h, p.n);
  const text = p.type === 'pwm' ? `~${p.name.slice(1)}` : p.name.replace(/^D(?=\d)/, '');
  return { text, x: pos.x, z: pos.z + (pos.z < 10 ? 3.3 : -3.3), size: 1.05, align: 'center' };
}));

export const BOARD = {
  name: 'Arduino UNO Q',
  width: 68.58,
  depth: 53.34,
  thickness: 1.6,
  cornerRadius: 2,
  pcbColor: '#1f2a33',
  heightScale: 1.2,
  holes: [{ x: 13.97, z: 50.8, r: 1.6 }, { x: 15.24, z: 2.54, r: 1.6 }, { x: 66.04, z: 45.72, r: 1.6 }, { x: 66.04, z: 17.78, r: 1.6 }],
  silkscreen: [
    ...pinLabels,
    { text: 'UNO Q', x: 52, z: 41, size: 3.2, weight: 700, align: 'center' },
    { text: 'DIGITAL (PWM ~)', x: 46, z: 8.9, size: 1.3, align: 'center' },
    { text: 'POWER', x: 36.8, z: 44.6, size: 1.3, align: 'center' },
    { text: 'ANALOG IN', x: 57.2, z: 44.6, size: 1.3, align: 'center' },
  ],
  components: [
    { id: 'soc', kind: 'shield', label: 'Qualcomm Dragonwing QRB2210', desc: 'The Linux brain: four Cortex-A53 cores at 2.0 GHz running Debian, plus a GPU. It runs your Python and the AI models.', shape: 'box', x: 22, z: 30, w: 12, d: 12, h: 1.4, color: '#c8cacc', metal: true, text: 'QRB2210', textColor: 'rgba(30,30,30,0.7)' },
    { id: 'ram', kind: 'chip', label: 'LPDDR4X memory', desc: '2 GB (ABX00162) or 4 GB (ABX00173) of RAM for Linux.', shape: 'box', x: 22, z: 19, w: 9, d: 7, h: 0.9, color: '#2a2930' },
    { id: 'emmc', kind: 'chip', label: 'eMMC storage', desc: '16 or 32 GB of built-in storage: the board’s “disk”.', shape: 'box', x: 34, z: 21, w: 8, d: 8, h: 1, color: '#2a2930', text: 'eMMC' },
    { id: 'mcu', kind: 'chip', label: 'STM32U585 microcontroller', desc: 'The real-time brain: a Cortex-M33 that runs your Arduino sketch and drives every header pin, the LED matrix and the ADC.', shape: 'box', x: 34, z: 32, w: 7, d: 7, h: 0.9, color: '#2a2930', text: 'STM32' },
    { id: 'wifi', kind: 'shield', label: 'Wi-Fi 5 and Bluetooth 5.1 module', desc: 'Dual-band Wi-Fi for App Lab, the web UI and updates.', shape: 'box', x: 9, z: 41, w: 9, d: 8, h: 1.4, color: '#c8cacc', metal: true },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power (5 V, 3 A recommended), data to your computer, and a monitor through a USB-C hub with DisplayPort.', shape: 'box', x: 1.6, z: 15.5, w: 7.4, d: 9, h: 3.2, color: '#c3c6ca', metal: true },
    { id: 'matrix', kind: 'ledmatrix', grid: [13, 8], accent: '#5aa9ff', label: 'LED matrix (8 × 13)', desc: '104 blue LEDs driven by the microcontroller. Each pixel has 8 brightness levels (0–7).', shape: 'box', x: 52, z: 25, w: 22, d: 13.5, h: 0.6, color: '#14181d' },
    { id: 'led3', kind: 'ledsmd', accent: '#ff5a4a', label: 'RGB LED 3 (sketch)', desc: 'Driven by the microcontroller. Its red channel is LED_BUILTIN. Active-low: LOW turns it on.', shape: 'box', x: 44, z: 36.5, w: 1.6, d: 1.6, h: 0.6, color: '#f1ece2' },
    { id: 'led4', kind: 'ledsmd', accent: '#5aa9ff', label: 'RGB LED 4 (sketch)', desc: 'A second microcontroller RGB LED: LED4_R, LED4_G, LED4_B.', shape: 'box', x: 47, z: 36.5, w: 1.6, d: 1.6, h: 0.6, color: '#f1ece2' },
    { id: 'led1', kind: 'ledsmd', accent: '#3fe06b', lit: true, label: 'RGB LEDs 1 and 2 (Linux)', desc: 'Driven by the Linux side. LED 2 shows system status: panic, Wi-Fi and Bluetooth.', shape: 'box', x: 10, z: 32, w: 1.6, d: 1.6, h: 0.6, color: '#f1ece2' },
    { id: 'qwiic', kind: 'jst', label: 'Qwiic connector', desc: 'A second 3.3 V I²C bus for plug-in Qwiic sensors, no soldering needed.', shape: 'box', x: 64, z: 33, w: 4.2, d: 6, h: 2.8, color: '#e9e6dd' },
    { id: 'jmedia', under: true, label: 'High-speed headers (underneath)', desc: 'JMEDIA and JMISC carry the camera (MIPI-CSI), display (MIPI-DSI) and audio for carrier boards. 1.8 V: not for jumper wires.', shape: 'box', x: 34, z: 27, w: 30, d: 6, h: 1.4, color: '#24232b' },
  ],
  headers: HEADERS,
};

// ---------- shared circuit pieces ----------
// The breadboard sits to the right, as on the Uno R3 course. The LED is on ~D9 so it can dim.
const BB = { x: 76, z: 0.7 };
const RAILS = [{ from: 'power:4', to: 'bb:bp2', color: '#e2483c' }, { from: 'power:6', to: 'bb:bn2', color: '#2b2a30' }];
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c5', b: 'c9', ohms: 150, label: '150 Ω resistor', desc: 'At 3.3 V a smaller resistor keeps the LED bright while staying gentle on the pin.', controls: { ohms: [100, 150, 330, 1000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e9', cathode: 'e10', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to GND.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'dhigh:2', to: 'bb:a5', color: '#f0a33a' }, { from: 'bb:a10', to: 'dhigh:7', color: '#2b2a30' }];
const LED_WIRING = [{ pin: 'dhigh:2', to: '150 Ω resistor → LED **long leg**' }, { pin: 'dhigh:7', to: 'LED **short leg**' }];
const POT = { id: 'pot1', type: 'pot', legs: ['f20', 'f21', 'f22'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 3.3 V and GND; the middle leg gives a voltage in between.', controls: { value: [0, 1] } };
const POT_WIRES = [...RAILS, { from: 'bb:j20', to: 'bb:bp20', color: '#e2483c' }, { from: 'bb:j22', to: 'bb:bn22', color: '#2b2a30' }, { from: 'bb:h21', to: 'analog:1', color: '#f2c12e' }];
const POT_WIRING = [{ pin: 'power:4', to: '3.3 V → + rail → potentiometer outer leg' }, { pin: 'power:6', to: 'GND rail → potentiometer other outer leg' }, { pin: 'analog:1', to: 'Potentiometer **middle leg**' }];

const BRIDGE_NOTE = { note: 'An App is a folder: `sketch/sketch.ino` runs on the microcontroller, `python/main.py` runs on Linux, and `app.yaml` lists the Bricks it uses. App Lab builds and starts both halves when you press Run.' };

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the UNO Q',
    short: 'Meet the board',
    summary: 'An Uno-shaped board with two brains: a Linux computer for Python and AI, and a microcontroller for the pins.',
    icon: 'board',
    focus: { components: ['soc', 'mcu'] },
    callouts: [
      { component: 'soc', icon: 'chip', title: 'Linux brain', text: 'QRB2210: Python, web pages, AI.' },
      { component: 'mcu', icon: 'chip', title: 'Real-time brain', text: 'STM32U585: your sketch and the pins.' },
      { component: 'matrix', icon: 'led', title: 'LED matrix', text: '8 × 13 blue pixels.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Power, data and display.' },
      { pin: 'dhigh:6', icon: 'pin', title: 'Uno headers', text: 'Same places as an Uno, but 3.3 V.' },
    ],
    overview: [
      'The UNO Q looks like an Uno, but it carries **two computers**. A Qualcomm **QRB2210** runs Debian Linux: it handles Python, web pages, the camera and AI models. An **STM32U585** microcontroller runs an ordinary Arduino sketch and owns the pins, so blinking and reading stay precise even while Linux is busy.',
      'The two talk through **Bridge**, a small remote-call library: Python can call a function in the sketch, and the sketch can send values to Python. Most lessons here use both halves.',
      { tips: [['target', 'Click the two big chips to compare them'], ['rotr', 'Drag to orbit, scroll to zoom'], ['info', 'The numbers on the board match the key']] },
      { note: 'Every header pin is **3.3 V**, unlike the 5 V Uno R3. Never connect 5 V to **~D3**, **A0** or **A1**, and do not power the board from the 3V3 or IOREF pins.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Linux side', 'QRB2210, 4 × Cortex-A53 @ 2.0 GHz'], ['Microcontroller', 'STM32U585, Cortex-M33 @ 160 MHz'], ['Memory', '2 or 4 GB LPDDR4X, 16 or 32 GB eMMC'], ['Wireless', 'Wi-Fi 5, Bluetooth 5.1'], ['Pins', 'Uno layout, 3.3 V logic'], ['Extras', '8 × 13 LED matrix, 4 RGB LEDs, Qwiic'], ['Power', 'USB-C 5 V, or VIN 7–24 V'], ['Size', '68.58 × 53.34 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Arduino UNO Q', '2 GB works; the 4 GB version is better for running App Lab on the board itself.'], ['1', 'USB-C data cable and a 5 V / 3 A supply'], ['1', 'Half-size breadboard and jumper wires']],
  },

  {
    id: 'setup',
    title: 'Set up App Lab',
    summary: 'Install Arduino App Lab, name the board, join Wi-Fi and run your first example App.',
    icon: 'board',
    focus: { components: ['usb', 'led3'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Use a data cable.' },
      { component: 'led3', icon: 'led', title: 'LED_BUILTIN', text: 'The first example blinks it.' },
      { component: 'wifi', icon: 'wifi', title: 'Wi-Fi', text: 'Set up during the first start.' },
    ],
    overview: [
      'Programs for the UNO Q are **Apps**, built in **Arduino App Lab**. An App can hold a sketch for the microcontroller, a Python program for Linux, and ready-made **Bricks** such as a web server or an AI model.',
      { steps: [
        'Install Arduino App Lab from arduino.cc on your computer.',
        'Connect the UNO Q with a USB-C data cable and open App Lab. Accept any update it offers, then restart App Lab.',
        'Give the board a **name** and **password**, and enter your Wi-Fi details.',
        'Open the **Blink LED** example and press **Run**. The red channel of RGB LED 3 blinks.',
      ] },
      { note: 'The LED matrix shows a boot logo for 20–30 seconds while Linux starts. Wait for it to finish before running an App that uses the matrix.' },
      { tips: [['play', 'App Lab’s Run builds both halves and starts them'], ['terminal', 'Logs from Python and the sketch appear in App Lab'], ['wifi', 'With Wi-Fi set up, App Lab can also reach the board over the network']] },
    ],
    kit: [['1', 'Computer running Windows, macOS or Linux']],
  },

  {
    id: 'blink',
    title: 'Blink two LEDs',
    summary: 'Blink your own LED on ~D9 together with the built-in RGB LED, and print to the App Lab monitor.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['dhigh:2', 'dhigh:7'], components: ['led3'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'dhigh:2', icon: 'pin', title: 'Pin ~9', text: 'HIGH puts 3.3 V on your LED.' },
      { part: 'res1', icon: 'resistor', title: '150 Ω', text: 'Click it to try other values.' },
      { part: 'led1', icon: 'led', title: 'Your LED', text: 'Click it to change its colour.' },
      { component: 'led3', icon: 'led', title: 'LED_BUILTIN', text: 'Active-low: LOW turns it on.' },
    ],
    overview: [
      'The sketch side is ordinary Arduino code. `digitalWrite(9, HIGH)` lights the LED on the breadboard. The built-in LED is wired the other way round, so it lights on **LOW**.',
      'There is no USB serial port to the sketch: messages go through Bridge instead. `Monitor.println()` prints to the **monitor** in App Lab.',
      { tips: [['pin', 'Pins are 3.3 V: a 150 Ω resistor keeps a red LED near 9 mA'], ['resistor', 'Click the resistor to see the LED current'], ['clock', 'Drag the delay slider in Try it']] },
    ],
    wiring: LED_WIRING,
    wiringNotes: [{ note: 'The STM32U585 pins can supply only a few milliamps comfortably. Use 150 Ω or more, and drive anything bigger than an LED through a transistor.', tone: 'warn' }],
    code: [{ file: 'sketch.ino', lang: 'cpp', trace: { on: 12, off: 16 }, source: `
#include <Arduino_RouterBridge.h>

const int LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Monitor.begin();
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(LED_BUILTIN, LOW);      // built-in LED: LOW = on
  Monitor.println("LED on");
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(LED_BUILTIN, HIGH);
  Monitor.println("LED off");
  delay(1000);
}
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on ~D9', delay: 1, volts: 3.3 },
    run: { cmd: 'App Lab ▶ Run  (blink-two-leds)', stop: [] },
    kit: [['1', 'LED (any colour)'], ['1', '150 Ω resistor', 'Brown-green-brown bands.'], ['2', 'Jumper wires']],
  },

  {
    id: 'matrix',
    title: 'Draw on the LED matrix',
    short: 'LED matrix',
    summary: 'Light the 8 × 13 matrix pixel by pixel with `Arduino_LED_Matrix` and animate two frames.',
    icon: 'board',
    focus: { components: ['matrix', 'mcu'] },
    callouts: [
      { component: 'matrix', icon: 'led', title: '104 pixels', text: '8 rows × 13 columns.' },
      { component: 'mcu', icon: 'chip', title: 'Microcontroller', text: 'Refreshes the matrix for you.' },
    ],
    overview: [
      'A frame is an array of **104 numbers**, one per pixel, row by row. Each number is a brightness from 0 (off) to 7 (full), the default 3-bit grayscale. `matrix.draw(frame)` shows it until you draw something else.',
      'Writing the frame as 8 lines of 13 numbers makes the picture visible right in the code.',
      { tips: [['led', 'Play the frames in Try it'], ['code', 'Change a 0 to 7 and you switch on one pixel'], ['clock', 'An animation is just frames and delays']] },
    ],
    code: [{ file: 'sketch.ino', lang: 'cpp', trace: { heart: 33, small: 35 }, source: `
#include <Arduino_LED_Matrix.h>

Arduino_LED_Matrix matrix;

uint8_t heart[104] = {
  0,0,0,7,7,0,0,0,7,7,0,0,0,
  0,0,7,7,7,7,0,7,7,7,7,0,0,
  0,0,7,7,7,7,7,7,7,7,7,0,0,
  0,0,7,7,7,7,7,7,7,7,7,0,0,
  0,0,0,7,7,7,7,7,7,7,0,0,0,
  0,0,0,0,7,7,7,7,7,0,0,0,0,
  0,0,0,0,0,7,7,7,0,0,0,0,0,
  0,0,0,0,0,0,7,0,0,0,0,0,0
};
uint8_t small[104] = {
  0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,3,3,0,3,3,0,0,0,0,
  0,0,0,0,3,3,3,3,3,0,0,0,0,
  0,0,0,0,0,3,3,3,0,0,0,0,0,
  0,0,0,0,0,0,3,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0
};

void setup() {
  matrix.begin();
  matrix.setGrayscaleBits(3);   // brightness 0 - 7
  matrix.clear();
}

void loop() {
  matrix.draw(heart);
  delay(600);
  matrix.draw(small);
  delay(400);
}
` }],
    codeNotes: ['`setGrayscaleBits(8)` allows brightness 0–255 per pixel instead of 0–7.'],
    sim: {
      type: 'matrix', caption: 'Press Run to play the heartbeat on the matrix.',
      frames: [
        { ms: 600, trace: 'heart', rows: ['0007700077000', '0077770777700', '0077777777700', '0077777777700', '0007777777000', '0000777770000', '0000077700000', '0000007000000'] },
        { ms: 400, trace: 'small', rows: ['0000000000000', '0000000000000', '0000330330000', '0000333330000', '0000033300000', '0000003000000', '0000000000000', '0000000000000'] },
      ],
    },
    run: { cmd: 'App Lab ▶ Run  (matrix-heart)', stop: [] },
    kit: [['–', 'Nothing extra: the matrix is on the board']],
  },

  {
    id: 'button',
    title: 'Read a button',
    summary: 'A push button on D2 switches the LED on ~D9.',
    icon: { type: 'button' },
    focus: { pins: ['dlow:3', 'power:6', 'dhigh:2', 'dhigh:7'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e14', 'e16', 'f14', 'f16'], label: 'Push button', desc: 'Hold it down in the 3D view: it joins column 14 to column 16.' }],
      wires: [...LED_WIRES, { from: 'dlow:3', to: 'bb:a14', color: '#3b78d6' }, { from: 'bb:j16', to: 'power:6', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene while Run is on.' },
      { pin: 'dlow:3', icon: 'pin', title: 'Pin 2 · input', text: 'Reads LOW while pressed.' },
      { part: 'led1', icon: 'led', title: 'LED · pin ~9', text: 'On while the button is held.' },
    ],
    overview: [
      '`INPUT_PULLUP` turns on a resistor inside the STM32 that holds D2 at 3.3 V. The button connects D2 to ground, so it reads **LOW while pressed**.',
      { tips: [['button', 'Click and hold the button in the 3D view'], ['code', 'Only react when the reading changes'], ['clock', 'A 20 ms pause hides contact bounce']] },
    ],
    wiring: [...LED_WIRING, { pin: 'dlow:3', to: 'Column 14, one side of the button' }, { pin: 'power:6', to: 'Column 16, the other side of the button' }],
    code: [{ file: 'sketch.ino', lang: 'cpp', trace: { wait: 14, pressed: 16, released: 16 }, source: `
#include <Arduino_RouterBridge.h>

const int BUTTON_PIN = 2;
const int LED_PIN = 9;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  Monitor.begin();
}

void loop() {
  static int last = HIGH;
  int now = digitalRead(BUTTON_PIN);
  if (now != last) {
    digitalWrite(LED_PIN, now == LOW ? HIGH : LOW);
    Monitor.println(now == LOW ? "Pressed!" : "Released");
    last = now;
  }
  delay(20);
}
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on ~D9' },
    run: { cmd: 'App Lab ▶ Run  (button)', stop: [] },
    kit: [['1', 'Tactile push button (6 mm)'], ['2', 'Jumper wires']],
  },

  {
    id: 'knob',
    title: 'Turn a knob',
    summary: 'Read a potentiometer on A0 and dim the LED on ~D9 with PWM.',
    icon: { type: 'pot' },
    focus: { pins: ['analog:1', 'power:4', 'power:6', 'dhigh:2', 'dhigh:7'] },
    circuit: { breadboard: BB, parts: [...LED_PARTS, POT], wires: [...LED_WIRES, ...POT_WIRES] },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'analog:1', icon: 'wave', title: 'A0', text: '0–3.3 V in, 0–1023 out.' },
      { pin: 'power:4', icon: 'power', title: '3V3', text: 'Not 5 V: the inputs are 3.3 V.' },
      { part: 'led1', icon: 'led', title: 'LED · pin ~9', text: 'Brightness follows the knob.' },
    ],
    overview: [
      'Power the potentiometer from **3V3**, not 5V: A0 must never see more than about 3.6 V. `analogRead(A0)` turns 0–3.3 V into **0–1023**, and `analogWrite()` on a ~ pin dims the LED with values from 0 to 255.',
      { tips: [['knob', 'Click the potentiometer and drag its slider'], ['wave', 'Watch the numbers in the monitor'], ['led', 'The LED follows the knob']] },
      { note: 'Using 5V for the potentiometer would put 5 V on A0, which can damage the STM32U585.', tone: 'warn' },
    ],
    wiring: [...LED_WIRING, ...POT_WIRING],
    code: [{ file: 'sketch.ino', lang: 'cpp', trace: { read: 12 }, source: `
#include <Arduino_RouterBridge.h>

const int KNOB_PIN = A0;
const int LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Monitor.begin();
}

void loop() {
  int value = analogRead(KNOB_PIN);       // 0 - 1023
  analogWrite(LED_PIN, value / 4);        // 0 - 255
  Monitor.println(value);
  delay(100);
}
` }],
    sim: { type: 'knob', pot: 'pot1', led: 'led1', label: 'A0 voltage', vmax: 3.3, max: 1023, every: 0.25, log: '{raw}' },
    run: { cmd: 'App Lab ▶ Run  (knob)', stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },

  {
    id: 'bridge',
    title: 'Python drives the LED',
    short: 'Bridge: Python → sketch',
    summary: 'Write the blink logic in Python on Linux and let the sketch switch the pin: your first two-brain App.',
    icon: { type: 'led', color: 'green' },
    focus: { pins: ['dhigh:2', 'dhigh:7'], components: ['soc', 'mcu'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'soc', icon: 'code', title: 'main.py', text: 'Decides when to switch.' },
      { component: 'mcu', icon: 'chip', title: 'sketch.ino', text: 'Owns the pin.' },
      { part: 'led1', icon: 'led', title: 'LED · pin ~9', text: 'Switched by a Bridge call.' },
    ],
    overview: [
      'The sketch registers a function with `Bridge.provide("set_led", set_led)`. Python then calls it by name with `Bridge.call("set_led", True)`, and Bridge carries the call and its argument across to the microcontroller.',
      '`App.run(user_loop=loop)` keeps calling your Python `loop()` function, much like a sketch’s `loop()`.',
      BRIDGE_NOTE,
      { tips: [['code', 'Two files: one per brain'], ['clock', 'The timing now lives in Python'], ['terminal', 'Python’s print() shows up in App Lab’s console']] },
    ],
    wiring: LED_WIRING,
    code: [
      { file: 'python/main.py', lang: 'python', trace: { on: 9, off: 9 }, source: `
from arduino.app_utils import *
import time

led_on = False

def loop():
    global led_on
    led_on = not led_on
    Bridge.call("set_led", led_on)
    print("LED on" if led_on else "LED off")
    time.sleep(1)

App.run(user_loop=loop)
` },
      { file: 'sketch/sketch.ino', lang: 'cpp', source: `
#include <Arduino_RouterBridge.h>

const int LED_PIN = 9;

void set_led(bool on) {
  digitalWrite(LED_PIN, on ? HIGH : LOW);
}

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Bridge.begin();
  Bridge.provide("set_led", set_led);
}

void loop() {
}
` },
    ],
    codeNotes: ['The sketch’s `loop()` is empty: all the work happens when Python calls `set_led`.'],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on ~D9', delay: 1, volts: 3.3 },
    run: { cmd: 'App Lab ▶ Run  (python-blink)', file: 'python/main.py', stop: [] },
    kit: [['1', 'The LED circuit from the Blink lesson']],
  },

  {
    id: 'notify',
    title: 'Send readings to Python',
    short: 'Bridge: sketch → Python',
    summary: 'The sketch reads the knob and pushes each value to Python with `Bridge.notify()`.',
    icon: { type: 'pot' },
    focus: { pins: ['analog:1', 'power:4', 'power:6'], components: ['soc', 'mcu'] },
    circuit: { breadboard: BB, parts: [POT], wires: POT_WIRES },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { component: 'mcu', icon: 'chip', title: 'Sketch', text: 'Reads A0 every half second.' },
      { component: 'soc', icon: 'code', title: 'Python', text: 'Receives and prints it.' },
    ],
    overview: [
      'Data can flow the other way too. Python registers a callback with `Bridge.provide("on_knob", on_knob)`; the sketch fires it with `Bridge.notify("on_knob", value)`. `notify` does not wait for an answer, so the sketch keeps its timing.',
      'Once a value reaches Python you have the whole Linux toolbox: save it to a file, chart it on a web page, or feed it to a model.',
      BRIDGE_NOTE,
      { tips: [['knob', 'Turn the knob and watch Python print'], ['code', '`notify` is fire-and-forget; `call` waits for a result'], ['chip', 'The sketch never blocks on Linux']] },
    ],
    wiring: POT_WIRING,
    code: [
      { file: 'python/main.py', lang: 'python', trace: { read: 4 }, source: `
from arduino.app_utils import *

def on_knob(value: int):
    print(f"knob: {value}")

Bridge.provide("on_knob", on_knob)
App.run()
` },
      { file: 'sketch/sketch.ino', lang: 'cpp', source: `
#include <Arduino_RouterBridge.h>

unsigned long last = 0;

void setup() {
  Bridge.begin();
}

void loop() {
  if (millis() - last >= 500) {
    last = millis();
    Bridge.notify("on_knob", analogRead(A0));
  }
}
` },
    ],
    sim: { type: 'knob', pot: 'pot1', label: 'A0 voltage', vmax: 3.3, max: 1023, every: 0.5, log: 'knob: {raw}' },
    run: { cmd: 'App Lab ▶ Run  (knob-to-python)', file: 'python/main.py', stop: [] },
    kit: [['1', 'The potentiometer circuit from the knob lesson']],
  },

  {
    id: 'webui',
    title: 'Control the LED from your phone',
    short: 'Web UI',
    summary: 'Add the WebUI Brick: a page on port 7000 with two buttons that call into the sketch.',
    icon: { type: 'led', color: 'blue' },
    focus: { pins: ['dhigh:2', 'dhigh:7'], components: ['wifi', 'soc'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'wifi', icon: 'wifi', title: 'Wi-Fi', text: 'Your phone reaches the board here.' },
      { component: 'soc', icon: 'globe', title: 'WebUI Brick', text: 'Serves the page on port 7000.' },
      { part: 'led1', icon: 'led', title: 'LED · pin ~9', text: 'Switched from the browser.' },
    ],
    overview: [
      'The **WebUI** Brick runs a web server on the Linux side. It serves the files in the App’s `assets` folder at port **7000**, and `ui.expose_api()` turns a Python function into an address the page can fetch.',
      'Each button on the page fetches `/led/on` or `/led/off`; Python passes the request on to the sketch with Bridge.',
      { steps: ['Add **WebUI** under Bricks in App Lab (it adds `arduino:web_ui` to `app.yaml`).', 'Put the page in `assets/index.html`.', 'Run the App, then open `http://<board name>.local:7000` on a phone on the same Wi-Fi.'] },
    ],
    wiring: LED_WIRING,
    code: [
      { file: 'python/main.py', lang: 'python', trace: { serve: 14, on: 6, off: 11 }, source: `
from arduino.app_utils import *
from arduino.app_bricks.web_ui import WebUI

def led_on():
    print("GET /led/on")
    Bridge.call("set_led", True)
    return {"led": "on"}

def led_off():
    print("GET /led/off")
    Bridge.call("set_led", False)
    return {"led": "off"}

ui = WebUI()                      # serves the assets folder on port 7000
ui.expose_api(method="GET", path="/led/on", function=led_on)
ui.expose_api(method="GET", path="/led/off", function=led_off)
App.run()
` },
      { file: 'assets/index.html', lang: 'javascript', source: `
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UNO Q LED</title>
<h1>UNO Q LED</h1>
<button onclick="fetch('/led/on')">On</button>
<button onclick="fetch('/led/off')">Off</button>
` },
    ],
    codeNotes: ['The sketch is the same `set_led` sketch from the “Python drives the LED” lesson.'],
    sim: { type: 'web', url: 'http://uno-q.local:7000', led: 'led1', label: 'LED on ~D9', title: 'UNO Q LED', start: ['WebUI serving the assets folder on port 7000'], request: 'GET {path}' },
    run: { cmd: 'App Lab ▶ Run  (phone-led)', file: 'python/main.py', stop: [] },
    kit: [['1', 'Phone or laptop on the same Wi-Fi']],
  },

  {
    id: 'ai',
    title: 'Detect objects with AI',
    short: 'Object detection',
    summary: 'Use the Object Detection Brick to find and label things in a photo, entirely on the board.',
    icon: 'board',
    focus: { components: ['soc', 'ram'] },
    callouts: [
      { component: 'soc', icon: 'chip', title: 'QRB2210', text: 'Runs the model on its CPU and GPU.' },
      { component: 'ram', icon: 'memory', title: 'RAM', text: 'Holds the model while it runs.' },
      { component: 'usb', icon: 'camera', title: 'USB-C', text: 'Add a USB webcam for live video.' },
    ],
    overview: [
      'A **Brick** is a ready-made service you add to an App. The **Object Detection** Brick ships a trained model: give it an image and it returns a list of things it recognised, each with a **label**, a **confidence** from 0 to 1 and a box.',
      'Everything runs on the UNO Q itself; no image is sent to the cloud.',
      { steps: [
        'In App Lab, open the **Simple Object Detection** example from the examples list, or create an App and add the **Object Detection** Brick.',
        'Put a photo in the App’s `assets` folder and name it `input_image.png`.',
        'Run the App. The console lists each object, and `output_image.png` gets the boxes drawn in.',
      ] },
      { tips: [['code', 'Raise `confidence` to drop doubtful guesses'], ['camera', 'Other examples use a USB webcam for live detection'], ['chip', 'More RAM helps: prefer the 4 GB board for AI']] },
    ],
    code: [{ file: 'python/main.py', lang: 'python', source: `
from arduino.app_utils import App
from arduino.app_bricks.object_detection import ObjectDetection
from PIL import Image
import time

detector = ObjectDetection()
image = Image.open("assets/input_image.png")

def loop():
    results = detector.detect(image, confidence=0.5)
    for thing in (results or {}).get("detection", []):
        print(thing.get("class_name"), thing.get("confidence"))
    boxed = detector.draw_bounding_boxes(image, results)
    if boxed is not None:
        boxed.save("output_image.png")
    time.sleep(60)

App.run(user_loop=loop)
` }],
    codeNotes: ['`results` is a dictionary whose `"detection"` list holds one entry per object found.'],
    kit: [['1', 'A photo with people, pets or everyday objects'], ['1', 'USB webcam (optional)', 'For the live-camera examples in App Lab.']],
  },
];
