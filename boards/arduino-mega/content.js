// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: Arduino Mega 2560 Rev3 documentation and the ArduinoCore-avr `mega` variant (pin numbers,
// PWM, interrupts, Serial1–3, I²C on 20/21, SPI on 50–53).
import { ledParts, ledWires, BUTTON, buttonWires, POT, potWires, BME, bmeWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-arduino-mega',
  title: 'Arduino Mega 2560: When the Uno Runs Out of Pins',
  accent: '#00787a',
  logicVolts: 5,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Mega connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Arduino Mega 2560…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', pwm: 'Digital I/O with PWM (~)',
  analog: 'Analog input', uart: 'Serial', i2c: 'I²C', spi: 'SPI', reset: 'Reset', nc: 'Not connected',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// The double row: 5V, 5V, D22 … D53, GND, GND. D44–46 have PWM; D50–53 are SPI.
const SPI_NAMES = { 50: 'MISO', 51: 'MOSI', 52: 'SCK', 53: 'SS' };
const doubleRow = [
  { n: 1, name: '5V', type: 'power5' }, { n: 2, name: '5V', type: 'power5' },
  ...Array.from({ length: 32 }, (_, i) => {
    const d = 22 + i;
    if (SPI_NAMES[d]) return { n: i + 3, name: `D${d}`, alt: SPI_NAMES[d], type: 'spi' };
    return d >= 44 && d <= 46 ? { n: i + 3, name: `D${d}`, alt: '~PWM', type: 'pwm' } : { n: i + 3, name: `D${d}`, type: 'gpio' };
  }),
  { n: 35, name: 'GND', type: 'gnd' }, { n: 36, name: 'GND', type: 'gnd' },
];

// Arduino Mega 2560 Rev3, top view, millimetres, USB on the left, 101.6 × 53.3 mm. The headers
// nearest the USB port keep the Uno's positions so Uno shields fit; the extended headers and the
// parts are placed from photos and are stylised.
const HEADERS = [
  { id: 'dlow', label: 'PWM pins D0–D7', short: 'PWM', desc: 'Digital pins 0–7. D0 and D1 are Serial, used for uploads. D2 and D3 can trigger interrupts.', style: 'female',
    pins: pinTable('D0|RX0|uart; D1|TX0|uart; D2|~PWM, interrupt|pwm; D3|~PWM, interrupt|pwm; D4|~PWM|pwm; D5|~PWM|pwm; D6|~PWM|pwm; D7|~PWM|pwm'), x: 66.04, z: 2.54, step: [-2.54, 0] },
  { id: 'dhigh', label: 'D8–D13, GND, AREF, SDA, SCL', short: 'PWM', desc: 'Digital pins 8–13 with GND and AREF. D13 drives the L LED. SDA and SCL repeat pins 20 and 21 in the Uno’s position.', style: 'female',
    pins: pinTable('D8|~PWM|pwm; D9|~PWM|pwm; D10|~PWM|pwm; D11|~PWM|pwm; D12|~PWM|pwm; D13|~PWM, L LED|pwm; GND||gnd; AREF|analog reference|analog; SDA|same as D20|i2c; SCL|same as D21|i2c'), x: 44.196, z: 2.54, step: [-2.54, 0] },
  { id: 'comm', label: 'Communication pins D14–D21', short: 'COMM', desc: 'Three extra hardware serial ports and the I²C bus. Interrupts also work on D18–D21.', style: 'female',
    pins: pinTable('D14|TX3|uart; D15|RX3|uart; D16|TX2|uart; D17|RX2|uart; D18|TX1, interrupt|uart; D19|RX1, interrupt|uart; D20|SDA, interrupt|i2c; D21|SCL, interrupt|i2c'), x: 70.1, z: 2.54, step: [2.54, 0] },
  { id: 'power', label: 'Power header', short: 'Power', desc: 'Power for your circuits: 5 V, 3.3 V and ground, plus VIN (the raw supply) and RESET.', style: 'female',
    pins: pinTable('NC||nc; IOREF|logic level (5 V)|power5; RESET||reset; 3.3V||power3; 5V||power5; GND||gnd; GND||gnd; VIN|raw input, 7–12 V|power5'), x: 27.94, z: 50.8, step: [2.54, 0] },
  { id: 'alow', label: 'Analog inputs A0–A7', short: 'A', desc: 'Measure 0–5 V as a number from 0 to 1023.', style: 'female',
    pins: pinTable('A0||analog; A1||analog; A2||analog; A3||analog; A4||analog; A5||analog; A6||analog; A7||analog'), x: 50.8, z: 50.8, step: [2.54, 0] },
  { id: 'ahigh', label: 'Analog inputs A8–A15', short: 'A', desc: 'Eight more analog inputs: sixteen in all, against six on an Uno.', style: 'female',
    pins: pinTable('A8||analog; A9||analog; A10||analog; A11||analog; A12||analog; A13||analog; A14||analog; A15||analog'), x: 73.66, z: 50.8, step: [2.54, 0] },
  { id: 'xd', label: 'Double header D22–D53', short: 'XD', desc: 'Thirty-two extra digital pins in two rows, with 5 V at one end and GND at the other. This is what the Mega is for.', style: 'female', layout: 'dual',
    pins: doubleRow, x: 96.52, z: 3.3, step: [0, 2.54], rowStep: [2.54, 0] },
].map((h) => ({ layout: 'single', pitch: 2.54, ...h }));

export const BOARD = {
  name: 'Arduino Mega 2560 Rev3',
  width: 101.6,
  depth: 53.34,
  thickness: 1.6,
  cornerRadius: 2,
  pcbColor: '#1c7a80',
  heightScale: 1.2,
  holes: [{ x: 13.97, z: 50.8, r: 1.6 }, { x: 15.24, z: 2.54, r: 1.6 }, { x: 66.04, z: 45.72, r: 1.6 }, { x: 90.2, z: 45.72, r: 1.6 }, { x: 90.2, z: 7.6, r: 1.6 }],
  silkscreen: [
    { text: 'MEGA 2560', x: 56, z: 16, size: 5, weight: 700, align: 'center' },
    { text: 'COMMUNICATION', x: 79, z: 8.9, size: 1.3, align: 'center' },
    { text: 'ANALOG IN', x: 72, z: 44.6, size: 1.3, align: 'center' },
    { text: 'POWER', x: 36.8, z: 44.6, size: 1.3, align: 'center' },
  ],
  smd: [{ x: 27, z: 17, w: 9, d: 6, count: 10 }, { x: 16, z: 34, w: 8, d: 6, count: 8 }, { x: 78, z: 38, w: 10, d: 5, count: 6 }],
  components: [
    { id: 'mcu', kind: 'chip', label: 'ATmega2560 microcontroller', desc: 'An 8-bit chip at 16 MHz with 256 KB of flash and 8 KB of RAM: eight times the Uno’s program space.', shape: 'box', x: 60, z: 30, w: 14, d: 14, h: 1.4, color: '#2a2930', text: 'ATMEGA2560', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'usb', kind: 'usbb', label: 'USB-B port', desc: 'Uploads sketches from your computer and powers the board.', shape: 'box', x: 1.9, z: 15.5, w: 16.4, d: 12, h: 10.9, color: '#c3c8d0' },
    { id: 'jack', kind: 'dcjack', label: 'DC power jack', desc: 'Run the board from a 7–12 V adapter or battery pack instead of USB.', shape: 'box', x: 5.2, z: 45.2, w: 14.2, d: 9, h: 11, color: '#24232b' },
    { id: 'usbchip', kind: 'chip', label: 'ATmega16U2 USB chip', desc: 'Turns USB into serial so your computer can talk to the main chip.', shape: 'box', x: 27, z: 11, w: 5.4, d: 5.4, h: 0.9, color: '#2a2930' },
    { id: 'reset', kind: 'button', accent: '#e2483c', label: 'Reset button', desc: 'Restarts your sketch from the top of setup().', shape: 'box', x: 7.6, z: 5.6, w: 6, d: 6, h: 3.4, color: '#c9ced6' },
    { id: 'ledL', kind: 'ledsmd', accent: '#ffb02e', label: 'L LED', desc: 'Built-in LED wired to pin 13: the Blink example flashes it.', shape: 'box', x: 34.4, z: 12.4, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'ledON', kind: 'ledsmd', accent: '#3fe06b', lit: true, label: 'ON LED', desc: 'Lights whenever the board has power.', shape: 'box', x: 40, z: 24, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
  ],
  headers: HEADERS,
};

// ---------- shared circuit pieces ----------
// The breadboard sits to the right of the double header, rows a–e towards the top of the board.
const BB = { x: 109, z: 0.7 };
const GND = 'dhigh:7';
const LED = { breadboard: BB, parts: ledParts(), wires: ledWires('xd:3', GND) };
const LED_WIRING = [{ pin: 'xd:3', to: '220 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }];
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn arduino:avr:mega ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Mega',
    short: 'Meet the board',
    summary: 'An Uno with a much larger chip: 54 digital pins, 16 analog inputs and four serial ports.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'ATmega2560', text: '256 KB of flash, 8 KB of RAM.' },
      { pin: 'xd:3', icon: 'pin', title: 'Double header', text: 'D22 to D53.' },
      { pin: 'comm:1', icon: 'wave', title: 'Communication pins', text: 'Three more serial ports, plus I²C.' },
      { pin: 'ahigh:1', icon: 'knob', title: 'A8–A15', text: 'Eight more analog inputs.' },
      { component: 'usb', icon: 'usb', title: 'USB-B', text: 'Same cable as an Uno.' },
    ],
    overview: [
      'Sketches and shields written for an **Uno** mostly work on a **Mega 2560**, but you get far more room: **54 digital pins** (15 with PWM), **16 analog inputs**, **4 hardware serial ports** and eight times the program memory. It is the usual choice for 3D printers, large LED projects and anything with many sensors.',
      'The chip is still 8-bit at 16 MHz and still works at **5 V**. The Mega is bigger, not faster.',
      { tips: [['target', 'Click a pin to see what it can do'], ['code', 'Pin numbers in sketches match the silkscreen'], ['info', 'Shields that use SPI should take it from the ICSP header']] },
      { note: 'I²C moves to **20 and 21** on the Mega, and SPI to **50–53**. Old sketches and shields that assume A4/A5 or pins 11–13 need changing.' },
      { h: 'Specifications' },
      { specs: [['Microcontroller', 'ATmega2560, 16 MHz'], ['Memory', '256 KB flash, 8 KB SRAM, 4 KB EEPROM'], ['Logic', '5 V'], ['Digital pins', '54, of which 15 have PWM'], ['Analog inputs', '16, 10-bit'], ['Serial ports', '4']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Arduino Mega 2560 Rev3 (or a compatible board)'], ['1', 'USB-A to USB-B cable', 'The square "printer" plug.'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit', 'Male-to-male: the headers are sockets.']],
  },

  {
    id: 'blink',
    title: 'Blink on the double header',
    short: 'Blink an LED',
    summary: 'Pick **Arduino Mega or Mega 2560** in the IDE and blink an LED on D22, a pin no Uno has.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['xd:3', GND] },
    circuit: LED,
    callouts: [
      { pin: 'xd:3', icon: 'pin', title: 'D22', text: 'Your sketch switches it.' },
      { pin: GND, icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while D22 is HIGH.' },
    ],
    overview: [
      { steps: ['In the Arduino IDE choose **Tools → Board → Arduino Mega or Mega 2560**.', 'Choose the port and check that the processor is **ATmega2560**.', 'Wire the LED, upload the sketch and open the Serial Monitor at 9600 baud.'] },
      'Everything you know from the Uno carries over: `pinMode()`, `digitalWrite()` and `delay()`. Only the pin number has changed.',
      { tips: [['led', '`LED_BUILTIN` is the L LED on pin 13'], ['resistor', 'Try 470 Ω: dimmer, still visible'], ['code', 'Pin numbers are just integers: 22 is `22`']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.ino', lang: 'cpp', trace: { on: 9, off: 12 }, source: `
const int LED_PIN = 22;

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
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on D22', delay: 1, volts: 5 },
    run: { cmd: UPLOAD('blink'), stop: [] },
    kit: [['1', 'LED'], ['1', '220 Ω resistor', 'Red-red-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'interrupt',
    title: 'Catch a press with an interrupt',
    short: 'Use an interrupt',
    summary: '`attachInterrupt()` runs a function the moment a button on D2 is pressed, whatever `loop()` is doing.',
    icon: { type: 'button' },
    focus: { pins: ['dlow:3', 'xd:3', GND] },
    circuit: { breadboard: BB, parts: [...ledParts(), BUTTON], wires: [...ledWires('xd:3', GND), ...buttonWires('dlow:3')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'dlow:3', icon: 'pin', title: 'D2', text: 'Interrupt pin, LOW while pressed.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Toggles at once.' },
    ],
    overview: [
      'Checking a button in `loop()` misses presses whenever the sketch is busy. An **interrupt** makes the chip stop what it is doing, run a short function and carry on. The Mega has six interrupt pins: **2, 3, 18, 19, 20 and 21**.',
      'Variables shared with the interrupt function must be `volatile`, and the function must stay short. Never call `delay()` or print inside it.',
      { tips: [['button', 'Hold the button in the 3D view'], ['clock', '`loop()` stays busy on purpose here'], ['code', '`digitalPinToInterrupt()` finds the right number']] },
    ],
    wiring: [...LED_WIRING, { pin: 'dlow:3', to: 'Column 20, one side of the button' }],
    code: [{ file: 'interrupt.ino', lang: 'cpp', trace: { wait: 18, pressed: 8, released: 8 }, source: `
const int LED_PIN = 22, BUTTON_PIN = 2;
volatile bool lit = false;
volatile unsigned long lastPress = 0;

void onPress() {
  if (millis() - lastPress < 50) return;   // ignore switch bounce
  lastPress = millis();
  lit = !lit;
}

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), onPress, FALLING);
}

void loop() {
  digitalWrite(LED_PIN, lit);
  delay(10);
}
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on D22' },
    run: { cmd: UPLOAD('interrupt'), stop: [] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'serial',
    title: 'Use a second serial port',
    short: 'Second serial port',
    summary: 'One jumper from TX1 to RX1 lets the Mega talk to itself on `Serial1`, while USB stays free.',
    icon: 'circuit',
    focus: { pins: ['comm:5', 'comm:6'] },
    circuit: { wires: [{ from: 'comm:5', to: 'comm:6', color: '#3b78d6' }] },
    callouts: [
      { pin: 'comm:5', icon: 'pin', title: 'D18 · TX1', text: 'Serial1 sends here.' },
      { pin: 'comm:6', icon: 'pin', title: 'D19 · RX1', text: 'Serial1 listens here.' },
    ],
    overview: [
      'On an Uno the only hardware serial port is shared with USB, so a GPS or Bluetooth module has to use the slower **SoftwareSerial**. The Mega has three spare ports: `Serial1` on 18/19, `Serial2` on 16/17 and `Serial3` on 14/15.',
      'This test needs no parts. A wire from TX1 to RX1 sends each byte straight back, proving the port works before you connect a real module.',
      { tips: [['terminal', '`Serial` still goes to the computer'], ['plug', 'TX of one device always goes to RX of the other'], ['wave', 'Both ends must use the same baud rate']] },
      { note: 'The Mega’s pins are **5 V**. Many serial modules use 3.3 V logic and need a level shifter or a resistor divider on their RX pin.', tone: 'warn' },
    ],
    wiring: [{ pin: 'comm:5', to: 'Jumper wire to D19 (RX1)' }, { pin: 'comm:6', to: 'Jumper wire from D18 (TX1)' }],
    code: [{ file: 'loopback.ino', lang: 'cpp', trace: { send: 7, echo: 9 }, source: `
void setup() {
  Serial.begin(9600);    // USB
  Serial1.begin(9600);   // pins 18 and 19
}

void loop() {
  Serial1.println("hello from TX1");
  delay(100);
  while (Serial1.available()) Serial.write(Serial1.read());
  delay(1900);
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: each line leaves on TX1, comes back on RX1 and is printed over USB.',
      steps: [{ ms: 800, trace: 'send' }, { ms: 1200, log: 'hello from TX1', trace: 'echo' }],
    },
    run: { cmd: UPLOAD('loopback'), stop: [] },
    kit: [['1', 'Jumper wire']],
  },

  {
    id: 'knob',
    title: 'Read a knob on A8',
    short: 'Read a knob',
    summary: 'A potentiometer on A8 shows that the extra analog inputs work just like A0.',
    icon: { type: 'pot' },
    focus: { pins: ['ahigh:1', 'power:5', 'power:6'] },
    circuit: { breadboard: BB, parts: [POT], wires: potWires('ahigh:1', 'power:5', 'power:6') },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'ahigh:1', icon: 'wave', title: 'A8', text: 'Measures 0–5 V.' },
      { pin: 'power:5', icon: 'power', title: '5V', text: 'Feeds the + rail.' },
    ],
    overview: [
      'Sixteen analog inputs means sixteen knobs, light sensors or soil probes on one board. `analogRead(A8)` works exactly like `analogRead(A0)`: 0 V reads 0 and 5 V reads 1023.',
      { tips: [['knob', 'Click the knob in the 3D view'], ['wave', '5 V ÷ 1024 ≈ 4.9 mV per step'], ['code', '`A0`–`A15` are constants, not plain numbers']] },
    ],
    wiring: [{ pin: 'power:5', to: '+ rail → potentiometer outer leg' }, { pin: 'ahigh:1', to: 'Potentiometer **middle leg**' }, { pin: 'power:6', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'knob.ino', lang: 'cpp', trace: { read: 6 }, source: `
void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A8);
  int mv = raw * 5000L / 1023;
  Serial.print("raw: "); Serial.print(raw);
  Serial.print("  voltage: "); Serial.print(mv); Serial.println(" mV");
  delay(500);
}
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'A8 voltage', vmax: 5, max: 1023, every: 0.5 },
    run: { cmd: UPLOAD('knob'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },

  {
    id: 'sensor',
    title: 'An I²C sensor on 20 and 21',
    short: 'I²C sensor',
    summary: 'A BME280 on the Mega’s I²C pins reports temperature, humidity and air pressure.',
    icon: 'circuit',
    focus: { pins: ['comm:7', 'comm:8', 'power:4', 'power:6'] },
    circuit: { breadboard: BB, parts: [BME], wires: bmeWires('comm:8', 'comm:7', 'power:4', 'power:6') },
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Three readings, one chip.' },
      { pin: 'comm:7', icon: 'pin', title: 'D20 · SDA', text: 'I²C data.' },
      { pin: 'comm:8', icon: 'pin', title: 'D21 · SCL', text: 'I²C clock.' },
    ],
    overview: [
      'The `Wire` library knows where I²C lives on each board, so the code is the same as on an Uno. Only the wires move: **SDA is D20** and **SCL is D21**.',
      { tips: [['code', 'Install "Adafruit BME280 Library"'], ['thermo', 'Pressure falls about 12 hPa per 100 m of height'], ['info', 'Most breakouts answer at 0x76 or 0x77']] },
      { note: 'Use a BME280 breakout made for 5 V logic, with a regulator and level shifters, when connecting it to the Mega’s pins. A bare 3.3 V sensor can be damaged by the Mega’s 5 V pull-ups.', tone: 'warn' },
    ],
    wiring: [{ pin: 'power:4', to: '+ rail → sensor **VIN**' }, { pin: 'power:6', to: '− rail → sensor **GND**' }, { pin: 'comm:8', to: 'Sensor **SCL**' }, { pin: 'comm:7', to: 'Sensor **SDA**' }],
    code: [{ file: 'weather.ino', lang: 'cpp', trace: { read: 11 }, source: `
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void setup() {
  Serial.begin(9600);
  if (!bme.begin(0x76)) Serial.println("BME280 not found (try 0x77)");
}

void loop() {
  Serial.print(bme.readTemperature(), 1); Serial.print(" °C  ");
  Serial.print(bme.readHumidity(), 1);    Serial.print(" %  ");
  Serial.print(bme.readPressure() / 100, 1); Serial.println(" hPa");
  delay(2000);
}
` }],
    sim: { type: 'env', sensor: 'bme', fields: ['temp', 'hum', 'pres'], every: 2, tempDigits: 1 },
    run: { cmd: UPLOAD('weather'), stop: [] },
    kit: [['1', 'BME280 breakout (5 V tolerant)'], ['4', 'Jumper wires']],
  },
];
