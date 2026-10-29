// Everything specific to this course lives in this file: site metadata and the lessons.
// The Uno model and its pin map are shared with the Arduino Uno course.
// Sources: Arduino language reference (Wire, Stepper), Adafruit SSD1306 and NeoPixel guides,
// the SparkFun TB6612FNG hookup guide, and the 28BYJ-48 / ULN2003 and KY-023 datasheets.
import { BOARD as UNO, PIN_TYPES as UNO_PIN_TYPES } from '../arduino-uno/content.js';

export const SITE = {
  id: 'learn-uno-modules',
  title: 'Arduino Uno: Displays and Motors',
  accent: '#2f8f83',
  logicVolts: 5,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Uno connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Arduino Uno…', 'Done uploading.'],
};

export const PIN_TYPES = UNO_PIN_TYPES;
export const BOARD = UNO;

// ---------- shared circuit pieces ----------
// Same layout as the Uno course: breadboard to the right, the power header feeding the bottom rails.
// Modules stand in row j facing away from the Uno; their wires use rows g and h.
const BB = { x: 76, z: 0.7 };
const RAILS = [{ from: 'power:5', to: 'bb:bp2', color: '#e2483c' }, { from: 'power:6', to: 'bb:bn2', color: '#2b2a30' }];
const RED = '#e2483c';
const BLACK = '#2b2a30';
const I2C_PINS = ['dhigh:9', 'dhigh:10', 'power:5', 'power:6'];
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn arduino:avr:uno ${sketch}`;

export const LESSONS = [
  {
    id: 'libraries',
    title: 'Modules and libraries',
    short: 'Libraries',
    summary: 'Every module in this course comes with a library. Install them once, then each lesson is a short sketch.',
    icon: 'board',
    focus: { pins: I2C_PINS },
    callouts: [
      { pin: 'dhigh:9', icon: 'pin', title: 'SDA', text: 'I²C data, shared by both displays.' },
      { pin: 'dhigh:10', icon: 'pin', title: 'SCL', text: 'I²C clock.' },
      { pin: 'power:5', icon: 'power', title: '5 V', text: 'Feeds the breadboard rail.' },
      { pin: 'power:6', icon: 'ground', title: 'GND', text: 'Every module shares this ground.' },
    ],
    overview: [
      'A **module** is a small board that does one job: a screen, a motor driver, a relay. It already has the support parts it needs, so wiring it is usually power, ground and one to four signal wires.',
      'Most modules come with a **library**: code someone else wrote that turns "draw this text" or "turn 90°" into the exact signals the chip expects. You install a library once and then `#include` it at the top of a sketch.',
      { tips: [['code', 'Install libraries from the Library Manager or with `arduino-cli lib install`'], ['pin', 'I²C modules share the SDA and SCL pins'], ['power', 'Motors need more current than a pin can give']] },
      { h: 'Two ways modules talk' },
      'The displays use **I²C**: two wires (SDA for data, SCL for clock) shared by every I²C device, each with its own address. The LED strip, relay and motors use plain digital pins, some with PWM to set a speed.',
      { note: 'Motors and relays draw far more current than a pin can supply. They always go through a **driver** board, never straight to a pin.', tone: 'warn' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli lib install "Adafruit SSD1306"', note: 'OLED display (installs Adafruit GFX too)', out: ['Downloading Adafruit SSD1306@2.5.13...', 'Installing Adafruit GFX Library...', 'Installed Adafruit SSD1306@2.5.13'] },
        { cmd: 'arduino-cli lib install "LiquidCrystal I2C"', note: 'LCD1602 with an I²C backpack', out: ['Downloading LiquidCrystal I2C@1.1.2...', 'Installed LiquidCrystal I2C@1.1.2'] },
        { cmd: 'arduino-cli lib install "Adafruit NeoPixel"', note: 'WS2812 LED strips', out: ['Downloading Adafruit NeoPixel@1.12.3...', 'Installed Adafruit NeoPixel@1.12.3'] },
        { cmd: 'arduino-cli lib list', note: 'check what is installed', out: ['Name                  Installed', 'Adafruit GFX Library  1.11.11', 'Adafruit NeoPixel     1.12.3', 'Adafruit SSD1306      2.5.13', 'LiquidCrystal I2C     1.1.2'] },
      ],
    },
    kit: [['1', 'Arduino Uno R3 and USB cable'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit', 'Male-to-male plus a few male-to-female for the motor boards.']],
  },

  {
    id: 'oled',
    title: 'OLED screen',
    summary: 'A 0.96″ 128 × 64 OLED on I²C shows a greeting and a seconds counter.',
    icon: 'circuit',
    focus: { pins: I2C_PINS },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'oled1', type: 'module', preset: 'oled', pins: ['j10', 'j11', 'j12', 'j13'], label: 'SSD1306', desc: '128 × 64 OLED, I²C address 0x3C. Pins: GND, VCC, SCL, SDA.', state: { lines: ['Hello, Uno!', 'Uptime: 0 s'] } }],
      wires: [...RAILS, { from: 'bb:h10', to: 'bb:bn10', color: BLACK }, { from: 'bb:h11', to: 'bb:bp11', color: RED }, { from: 'dhigh:10', to: 'bb:g12', color: '#f2c12e' }, { from: 'dhigh:9', to: 'bb:g13', color: '#3b78d6' }],
    },
    callouts: [
      { part: 'oled1', icon: 'chip', title: 'OLED', text: 'Each pixel lights itself; no backlight.' },
      { pin: 'dhigh:9', icon: 'pin', title: 'SDA', text: 'Data, to the OLED SDA pin.' },
      { pin: 'dhigh:10', icon: 'pin', title: 'SCL', text: 'Clock, to the OLED SCL pin.' },
      { pin: 'power:5', icon: 'power', title: '5 V', text: 'The module has its own 3.3 V regulator.' },
    ],
    overview: [
      'An OLED has no backlight: every pixel is a tiny light, so black is truly off and the text looks crisp. This one is 128 pixels wide and 64 tall, driven by an **SSD1306** chip that listens on I²C address **0x3C**.',
      'The library draws into a copy of the screen in the Uno’s memory. Nothing appears until you call `display.display()`, which sends the whole picture over I²C at once.',
      { tips: [['code', '`setCursor(x, y)` picks where the next text goes'], ['clock', '`millis()` counts milliseconds since power-up'], ['info', 'Text size 1 is 6 × 8 pixels per letter']] },
      { note: 'The screen copy takes 1 KB, half of the Uno’s 2 KB of RAM. Keep the rest of the sketch small.', tone: 'warn' },
    ],
    wiring: [{ pin: 'power:5', to: '5 V rail → OLED **VCC**' }, { pin: 'power:6', to: 'GND rail → OLED **GND**' }, { pin: 'dhigh:10', to: 'OLED **SCL**' }, { pin: 'dhigh:9', to: 'OLED **SDA**' }],
    wiringNotes: ['Pin order differs between sellers (some boards start with VCC). Read the labels on your board and match them, not the position.', 'Blank screen? Some boards use address 0x3D. Run the I2C scanner example to find yours.'],
    code: [{ file: 'oled.ino', lang: 'cpp', trace: { hello: 17, tick: 21 }, source: `
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);   // -1: no reset pin

void setup() {
  Serial.begin(9600);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) Serial.println("OLED not found");
  display.setTextColor(SSD1306_WHITE);
}

void loop() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("Hello, Uno!");
  display.print("Uptime: ");
  display.print(millis() / 1000);
  display.println(" s");
  display.display();
  delay(1000);
}
` }],
    codeNotes: ['`display.begin()` returns false when nothing answers at 0x3C. The sketch prints a message instead of failing silently.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the screen in the 3D view counts the seconds.', rest: { oled1: { lines: ['', ''] } },
      steps: [
        { set: { oled1: { lines: ['Hello, Uno!', 'Uptime: 0 s'] } }, ms: 1000, trace: 'hello' },
        { set: { oled1: { lines: ['Hello, Uno!', 'Uptime: 1 s'] } }, ms: 1000, trace: 'tick' },
        { set: { oled1: { lines: ['Hello, Uno!', 'Uptime: 2 s'] } }, ms: 1000, trace: 'tick' },
        { set: { oled1: { lines: ['Hello, Uno!', 'Uptime: 3 s'] } }, ms: 1000, trace: 'tick' },
        { set: { oled1: { lines: ['Hello, Uno!', 'Uptime: 4 s'] } }, ms: 1000, trace: 'tick' },
      ],
    },
    run: { cmd: UPLOAD('oled'), stop: [] },
    kit: [['1', '0.96″ SSD1306 OLED, I²C (4 pins)'], ['6', 'Jumper wires']],
  },

  {
    id: 'lcd',
    title: 'LCD1602 screen',
    summary: 'A 16 × 2 character LCD with an I²C backpack shows a reading and a counter on two lines.',
    icon: 'circuit',
    focus: { pins: I2C_PINS },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'lcd1', type: 'module', preset: 'lcd1602', pins: ['j14', 'j15', 'j16', 'j17'], label: 'LCD1602', desc: '16 × 2 character LCD with a PCF8574 I²C backpack (address 0x27 or 0x3F). Pins: GND, VCC, SDA, SCL.', state: { lines: ['Hardware Bench', 'Count: 0'] } }],
      wires: [...RAILS, { from: 'bb:h14', to: 'bb:bn14', color: BLACK }, { from: 'bb:h15', to: 'bb:bp15', color: RED }, { from: 'dhigh:9', to: 'bb:g16', color: '#3b78d6' }, { from: 'dhigh:10', to: 'bb:g17', color: '#f2c12e' }],
    },
    callouts: [
      { part: 'lcd1', icon: 'chip', title: 'LCD1602', text: '16 letters on each of 2 lines.' },
      { pin: 'dhigh:9', icon: 'pin', title: 'SDA', text: 'Same two I²C pins as the OLED.' },
      { pin: 'power:5', icon: 'power', title: '5 V', text: 'Runs the backlight too.' },
    ],
    overview: [
      'A character LCD shows fixed letter cells instead of free pixels: 16 across, 2 lines down. On its own it needs 6 to 10 wires; the small **I²C backpack** soldered to its back turns that into the same two I²C wires the OLED used.',
      { tips: [['code', '`lcd.setCursor(column, row)` counts from 0'], ['info', 'The blue screw on the backpack sets the contrast'], ['clock', 'Clear only what changes to avoid flicker']] },
      'Text stays on the screen until you overwrite it. When a number gets shorter (10 → 9) the old last digit stays behind, so the sketch pads it with spaces.',
    ],
    wiring: [{ pin: 'power:5', to: '5 V rail → backpack **VCC**' }, { pin: 'power:6', to: 'GND rail → backpack **GND**' }, { pin: 'dhigh:9', to: 'Backpack **SDA**' }, { pin: 'dhigh:10', to: 'Backpack **SCL**' }],
    wiringNotes: ['Backlight on but no letters? Turn the contrast screw slowly until the text appears.', 'If 0x27 shows nothing, try 0x3F: backpacks with the PCF8574A chip use that address.'],
    code: [{ file: 'lcd.ino', lang: 'cpp', trace: { title: 11, count: 17 }, source: `
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);   // address, columns, rows
int count = 0;

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Hardware Bench");
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Count: ");
  lcd.print(count);
  lcd.print("   ");        // wipe leftover digits
  count++;
  delay(1000);
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: line 2 counts up once a second.', rest: { lcd1: { lines: ['', ''] } },
      steps: [
        { set: { lcd1: { lines: ['Hardware Bench', ''] } }, ms: 600, trace: 'title' },
        { set: { lcd1: { lines: ['Hardware Bench', 'Count: 0'] } }, ms: 1000, trace: 'count' },
        { set: { lcd1: { lines: ['Hardware Bench', 'Count: 1'] } }, ms: 1000, trace: 'count' },
        { set: { lcd1: { lines: ['Hardware Bench', 'Count: 2'] } }, ms: 1000, trace: 'count' },
        { set: { lcd1: { lines: ['Hardware Bench', 'Count: 3'] } }, ms: 1000, trace: 'count' },
      ],
    },
    run: { cmd: UPLOAD('lcd'), stop: [] },
    kit: [['1', 'LCD1602 with I²C backpack'], ['4', 'Male-to-female jumper wires', 'The backpack has male pins.']],
  },

  {
    id: 'neopixel',
    title: 'WS2812 LED strip',
    short: 'LED strip',
    summary: 'Eight addressable RGB LEDs on one data wire: a colour runs along the stick.',
    icon: 'circuit',
    focus: { pins: ['dlow:7', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'r330', type: 'resistor', a: 'f10', b: 'f14', ohms: 330, label: '330 Ω resistor', desc: 'Softens the data edges so the first LED is not damaged.' },
        { id: 'px1', type: 'module', preset: 'ws2812', pins: ['j14', 'j15', 'j16'], label: 'WS2812 ×8', desc: 'Eight RGB LEDs, each with its own tiny controller. Pins: DIN, 5V, GND.' },
      ],
      wires: [...RAILS, { from: 'dlow:7', to: 'bb:h10', color: '#3fae5a' }, { from: 'bb:h15', to: 'bb:bp15', color: RED }, { from: 'bb:h16', to: 'bb:bn16', color: BLACK }],
    },
    callouts: [
      { part: 'px1', icon: 'led', title: 'WS2812 ×8', text: 'Every LED has an address: 0 to 7.' },
      { part: 'r330', icon: 'resistor', title: '330 Ω', text: 'Between pin 6 and DIN.' },
      { pin: 'dlow:7', icon: 'pin', title: 'Pin 6 · data', text: 'One wire for all eight LEDs.' },
    ],
    overview: [
      'Each WS2812 LED has a tiny chip inside. The Uno sends a stream of colours down one wire; the first LED keeps the first colour and passes the rest along, so one pin controls the whole strip.',
      { tips: [['led', '`setPixelColor(i, color)` sets LED number i'], ['code', 'Nothing changes until `strip.show()`'], ['power', 'Each LED can draw up to 60 mA at full white']] },
      { note: 'Eight LEDs at full white draw almost 0.5 A, all USB can give. `setBrightness(40)` keeps this stick well under that. Longer strips need their own 5 V supply.', tone: 'warn' },
    ],
    wiring: [{ pin: 'dlow:7', to: '330 Ω → stick **DIN**' }, { pin: 'power:5', to: '5 V rail → stick **5V**' }, { pin: 'power:6', to: 'GND rail → stick **GND**' }],
    wiringNotes: ['The arrow on the stick shows the data direction. Wire **DIN**, not DOUT.', 'For strips longer than about 30 LEDs, add a 1000 µF capacitor across 5 V and GND at the strip.'],
    code: [{ file: 'chase.ino', lang: 'cpp', trace: { show: 17 }, source: `
#include <Adafruit_NeoPixel.h>

const int DATA_PIN = 6;
const int COUNT = 8;
Adafruit_NeoPixel strip(COUNT, DATA_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.setBrightness(40);   // 0–255; keeps the current low
}

void loop() {
  for (int i = 0; i < COUNT; i++) {
    strip.clear();
    uint16_t hue = i * 65536L / COUNT;   // 0–65535 goes once round the colour wheel
    strip.setPixelColor(i, strip.ColorHSV(hue));
    strip.show();
    delay(150);
  }
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: one lit LED walks along the stick, changing colour as it goes.', rest: { px1: { pixels: [] } },
      steps: [
        [1, 0, 0], [1, 0.75, 0], [0.5, 1, 0], [0, 1, 0.25], [0, 1, 1], [0, 0.25, 1], [0.5, 0, 1], [1, 0, 0.75],
      ].map((rgb, i) => ({ set: { px1: { pixels: Array.from({ length: 8 }, (_, j) => (j === i ? rgb : [0, 0, 0])) } }, ms: 300, trace: 'show' })),
    },
    run: { cmd: UPLOAD('chase'), stop: [] },
    kit: [['1', 'WS2812B stick, 8 LEDs', 'Also sold as "NeoPixel stick".'], ['1', '330 Ω resistor', 'Orange-orange-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'relay',
    title: 'Relay switch',
    summary: 'A relay module lets pin 7 switch a separate circuit, like a desk lamp’s low-voltage supply.',
    icon: 'circuit',
    focus: { pins: ['dlow:8', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'rly1', type: 'module', preset: 'relay', pins: ['j14', 'j15', 'j16'], label: 'Relay', desc: '1-channel 5 V relay module with its own transistor and diode. Pins: IN, VCC, GND.' }],
      wires: [...RAILS, { from: 'dlow:8', to: 'bb:g14', color: '#f2c12e' }, { from: 'bb:h15', to: 'bb:bp15', color: RED }, { from: 'bb:h16', to: 'bb:bn16', color: BLACK }],
    },
    callouts: [
      { part: 'rly1', icon: 'plug', title: 'Relay', text: 'A switch moved by an electromagnet.' },
      { pin: 'dlow:8', icon: 'pin', title: 'Pin 7 · IN', text: 'Tells the relay when to click.' },
      { pin: 'power:5', icon: 'power', title: '5 V', text: 'Powers the coil, about 70 mA.' },
    ],
    overview: [
      'A relay is a switch flipped by an electromagnet. The Uno only drives the coil side; the switch side is a separate circuit with screw terminals: **COM** (common), **NO** (normally open, joined to COM while the relay is on) and **NC** (normally closed).',
      'The coil needs about 70 mA, more than a pin can give, so the module has a transistor that the pin switches, and a diode that absorbs the kick when the coil turns off.',
      { tips: [['plug', 'Wire your load through COM and NO'], ['info', 'The red LED shows the coil is on'], ['code', 'Many modules switch on when IN is LOW']] },
      { note: 'Use the relay for low-voltage loads only: a 5 V or 12 V lamp, fan or LED strip with its own supply. Mains wiring is dangerous and not part of this course.', tone: 'warn' },
    ],
    wiring: [{ pin: 'dlow:8', to: 'Relay **IN**' }, { pin: 'power:5', to: '5 V rail → relay **VCC**' }, { pin: 'power:6', to: 'GND rail → relay **GND**' }],
    wiringNotes: ['Screw terminals: your lamp’s supply goes into **COM**, and the lamp’s wire into **NO**, so it is off until the relay clicks.'],
    code: [{ file: 'relay.ino', lang: 'cpp', trace: { on: 12, off: 15 }, source: `
const int RELAY_PIN = 7;
const int ON = LOW;     // most blue relay modules are active-low; swap if yours is not
const int OFF = HIGH;

void setup() {
  digitalWrite(RELAY_PIN, OFF);   // start off before the pin becomes an output
  pinMode(RELAY_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(RELAY_PIN, ON);
  Serial.println("Lamp ON");
  delay(3000);
  digitalWrite(RELAY_PIN, OFF);
  Serial.println("Lamp OFF");
  delay(3000);
}
` }],
    codeNotes: ['Writing OFF before `pinMode()` stops the relay clicking on for a moment at power-up.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the relay LED and the log follow the sketch.', rest: { rly1: { on: false } },
      steps: [
        { set: { rly1: { on: true } }, ms: 3000, log: 'Lamp ON', trace: 'on' },
        { set: { rly1: { on: false } }, ms: 3000, log: 'Lamp OFF', trace: 'off' },
      ],
    },
    run: { cmd: UPLOAD('relay'), stop: [] },
    kit: [['1', '1-channel 5 V relay module'], ['3', 'Jumper wires'], ['1', 'Low-voltage lamp with its own supply', 'Optional: the module clicks and its LED lights without a load.']],
  },

  {
    id: 'dcmotor',
    title: 'DC motor and driver',
    short: 'DC motor',
    summary: 'A TB6612FNG driver lets three pins set a gear motor’s speed and direction.',
    icon: 'circuit',
    focus: { pins: ['dlow:6', 'dlow:8', 'dhigh:1', 'dhigh:7', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'drv1', type: 'module', preset: 'driver', pins: ['e10', 'e11', 'e12', 'e13', 'e14', 'e15', 'e16', 'e17', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17'], label: 'TB6612FNG', desc: 'Dual motor driver. Motor side: VM, VCC, GND, AO1, AO2, BO2, BO1, GND. Logic side: PWMA, AIN2, AIN1, STBY, BIN1, BIN2, PWMB, GND.' },
        { id: 'mot1', type: 'motor', kind: 'tt', at: { x: 178, z: 4 }, legs: ['a13', 'a14'], label: 'TT gear motor', desc: 'A small 3–6 V DC motor with a 1:48 gearbox, the usual robot-car wheel motor.' },
      ],
      wires: [
        ...RAILS, { from: 'bb:bp3', to: 'bb:tp3', color: RED }, { from: 'dhigh:7', to: 'bb:tn1', color: BLACK },
        { from: 'bb:a10', to: 'bb:tp10', color: RED }, { from: 'bb:a11', to: 'bb:tp11', color: RED }, { from: 'bb:a12', to: 'bb:tn13', color: BLACK },
        { from: 'dlow:6', to: 'bb:j10', color: '#3fae5a' }, { from: 'dhigh:1', to: 'bb:j11', color: '#3b78d6' }, { from: 'dlow:8', to: 'bb:j12', color: '#f2c12e' },
        { from: 'bb:j13', to: 'bb:bp13', color: RED }, { from: 'bb:j17', to: 'bb:bn17', color: BLACK },
      ],
    },
    callouts: [
      { part: 'drv1', icon: 'chip', title: 'TB6612FNG', text: 'Two H-bridges: drives two motors.' },
      { part: 'mot1', icon: 'gear', title: 'TT motor', text: 'Its two leads go to AO1 and AO2.' },
      { pin: 'dlow:6', icon: 'wave', title: 'Pin ~5 · PWMA', text: 'Speed, with analogWrite().' },
      { pin: 'dlow:8', icon: 'pin', title: 'Pin 7 · AIN1', text: 'Direction, with AIN2.' },
      { pin: 'dhigh:1', icon: 'pin', title: 'Pin 8 · AIN2', text: 'Opposite of AIN1 to spin.' },
    ],
    overview: [
      'A motor needs hundreds of milliamps and spins backwards when you swap its wires. The driver chip does both jobs: an **H-bridge** of four switches that connects the motor to the supply one way round or the other, at full current.',
      'Three pins control motor A. **AIN1** and **AIN2** set the direction (one HIGH, one LOW; both LOW lets it coast). **PWMA** sets the speed: `analogWrite()` switches the motor on and off fast, and the share of on-time is the speed.',
      { tips: [['wave', '`analogWrite(pin, 0–255)` sets the speed'], ['rotr', 'Swap AIN1 and AIN2 to reverse'], ['power', 'STBY must be HIGH or the chip sleeps']] },
      { note: 'Here VM comes from the Uno’s 5 V so the wiring stays simple; that is fine for a motor spinning freely. Once it drives wheels, power **VM** from a 4×AA pack and join its − to GND, or the Uno may reset when the motor starts.', tone: 'warn' },
    ],
    wiring: [
      { pin: 'dlow:6', to: 'Driver **PWMA**' }, { pin: 'dlow:8', to: 'Driver **AIN1**' }, { pin: 'dhigh:1', to: 'Driver **AIN2**' },
      { pin: 'power:5', to: '5 V rail → **STBY**, **VCC** and **VM** (via the top rail)' }, { pin: 'dhigh:7', to: 'Top **−** rail → driver **GND**' },
    ],
    wiringNotes: ['The driver straddles the centre channel: the motor side in row e, the logic side in row f.', 'Motor leads go to **AO1** and **AO2**. If it spins the wrong way, swap them (or swap the pins in the sketch).'],
    code: [{ file: 'motor.ino', lang: 'cpp', trace: { forward: 18, slow: 20, stop: 22, back: 24 }, source: `
const int PWMA = 5, AIN1 = 7, AIN2 = 8;

// speed: -255 (full reverse) to 255 (full forward); 0 stops
void drive(int speed) {
  digitalWrite(AIN1, speed > 0);
  digitalWrite(AIN2, speed < 0);
  analogWrite(PWMA, abs(speed));
}

void setup() {
  pinMode(PWMA, OUTPUT);
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Forward, full speed"); drive(255);
  delay(2000);
  Serial.println("Forward, half speed"); drive(128);
  delay(2000);
  Serial.println("Stop");                drive(0);
  delay(1000);
  Serial.println("Reverse");             drive(-200);
  delay(2000);
}
` }],
    codeNotes: ['A motor may not start below about 30 % PWM: the gearbox needs a push to get going.'],
    sim: {
      type: 'sequence', caption: 'Press Run: watch the wheel speed up, slow, stop and reverse.', rest: { mot1: { spin: 0 } },
      steps: [
        { set: { mot1: { spin: 1 } }, ms: 2000, log: 'Forward, full speed', trace: 'forward' },
        { set: { mot1: { spin: 0.5 } }, ms: 2000, log: 'Forward, half speed', trace: 'slow' },
        { set: { mot1: { spin: 0 } }, ms: 1000, log: 'Stop', trace: 'stop' },
        { set: { mot1: { spin: -0.8 } }, ms: 2000, log: 'Reverse', trace: 'back' },
      ],
    },
    run: { cmd: UPLOAD('motor'), stop: [] },
    kit: [['1', 'TB6612FNG driver breakout', 'Solder the two 8-pin headers first.'], ['1', 'TT gear motor with wheel'], ['12', 'Jumper wires'], ['1', '4×AA battery pack', 'Optional, for VM once the motor has a load.']],
  },

  {
    id: 'stepper',
    title: 'Stepper motor',
    summary: 'A 28BYJ-48 stepper and its ULN2003 board turn exactly one revolution, then back.',
    icon: 'circuit',
    focus: { pins: ['dhigh:1', 'dhigh:2', 'dhigh:3', 'dhigh:4', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'uln1', type: 'module', preset: 'uln2003', pins: ['j10', 'j11', 'j12', 'j13', 'j14', 'j15'], label: 'ULN2003', desc: 'Stepper driver board: IN1–IN4, then + and −. On the real board the + and − pins sit on a separate pair.' },
        { id: 'stp1', type: 'motor', kind: 'stepper', at: { x: 178, z: 30 }, plug: { hole: 'j12', up: 30 }, label: '28BYJ-48', desc: '5 V geared stepper motor: 2048 steps per turn of the output shaft in full-step mode.' },
      ],
      wires: [
        ...RAILS,
        { from: 'dhigh:1', to: 'bb:g10', color: '#3b78d6' }, { from: 'dhigh:2', to: 'bb:g11', color: '#e78bb8' },
        { from: 'dhigh:3', to: 'bb:g12', color: '#f2c12e' }, { from: 'dhigh:4', to: 'bb:g13', color: '#f08a24' },
        { from: 'bb:h14', to: 'bb:bp14', color: RED }, { from: 'bb:h15', to: 'bb:bn15', color: BLACK },
      ],
    },
    callouts: [
      { part: 'stp1', icon: 'gear', title: '28BYJ-48', text: 'Moves in small, exact steps.' },
      { part: 'uln1', icon: 'chip', title: 'ULN2003', text: 'Four LEDs show which coil is on.' },
      { pin: 'dhigh:1', icon: 'pin', title: 'Pins 8–11', text: 'IN1 to IN4, one per coil.' },
    ],
    overview: [
      'A stepper motor does not just spin: it moves one small **step** each time the next coil is switched on. Count the steps and you know exactly where the shaft is, with no sensor. That is why 3D printers and camera sliders use them.',
      'This motor has four coils and a gearbox; 2048 full steps make one turn of the output shaft. The ULN2003 board switches the coil current, which a pin could not supply.',
      { tips: [['gear', '2048 steps = one full turn'], ['clock', 'About 15 RPM is the top speed'], ['code', 'The pin order in the sketch is 8, 10, 9, 11']] },
      { note: 'The motor draws about 240 mA whenever it holds a position. That is fine from USB for one motor; turn the coils off when it does not need to hold.', tone: 'warn' },
    ],
    wiring: [
      { pin: 'dhigh:1', to: 'ULN2003 **IN1**' }, { pin: 'dhigh:2', to: 'ULN2003 **IN2**' }, { pin: 'dhigh:3', to: 'ULN2003 **IN3**' }, { pin: 'dhigh:4', to: 'ULN2003 **IN4**' },
      { pin: 'power:5', to: '5 V rail → ULN2003 **+**' }, { pin: 'power:6', to: 'GND rail → ULN2003 **−**' },
    ],
    wiringNotes: ['The motor’s white plug only fits one way into the driver board.'],
    code: [{ file: 'stepper.ino', lang: 'cpp', trace: { cw: 14, ccw: 17 }, source: `
#include <Stepper.h>

const int STEPS_PER_TURN = 2048;
// The library energises coils in the order of these pins: IN1, IN3, IN2, IN4
Stepper motor(STEPS_PER_TURN, 8, 10, 9, 11);

void setup() {
  motor.setSpeed(10);   // RPM
  Serial.begin(9600);
}

void loop() {
  Serial.println("One turn clockwise");
  motor.step(STEPS_PER_TURN);
  delay(500);
  Serial.println("One turn back");
  motor.step(-STEPS_PER_TURN);
  delay(500);
}
` }],
    codeNotes: ['`step()` blocks: the sketch does nothing else until the turn is done (about 6 s at 10 RPM).'],
    sim: {
      type: 'sequence', caption: 'Press Run: the shaft turns while the driver LEDs step through the coils.', rest: { stp1: { spin: 0 }, uln1: { phase: -1 } },
      steps: [
        ...[0, 1, 2, 3, 0, 1, 2, 3].map((phase, i) => ({ set: { uln1: { phase }, stp1: { spin: 1 } }, ms: 350, trace: 'cw', ...(i === 0 ? { log: 'One turn clockwise' } : {}) })),
        ...[3, 2, 1, 0, 3, 2, 1, 0].map((phase, i) => ({ set: { uln1: { phase }, stp1: { spin: -1 } }, ms: 350, trace: 'ccw', ...(i === 0 ? { log: 'One turn back' } : {}) })),
      ],
    },
    run: { cmd: UPLOAD('stepper'), stop: [] },
    kit: [['1', '28BYJ-48 stepper motor (5 V)'], ['1', 'ULN2003 driver board'], ['6', 'Male-to-female jumper wires']],
  },

  {
    id: 'joystick',
    title: 'Joystick',
    summary: 'A thumb joystick gives two analog readings and a push button: the start of any remote control.',
    icon: 'circuit',
    focus: { pins: ['analog:1', 'analog:2', 'dlow:3', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'joy1', type: 'module', preset: 'joystick', pins: ['j12', 'j13', 'j14', 'j15', 'j16'], label: 'Joystick', desc: 'Two potentiometers and a push switch under one stick. Pins: GND, +5V, VRx, VRy, SW.' }],
      wires: [...RAILS, { from: 'bb:h12', to: 'bb:bn11', color: BLACK }, { from: 'bb:h13', to: 'bb:bp13', color: RED }, { from: 'analog:1', to: 'bb:g14', color: '#3fae5a' }, { from: 'analog:2', to: 'bb:g15', color: '#3b78d6' }, { from: 'dlow:3', to: 'bb:g16', color: '#f2c12e' }],
    },
    callouts: [
      { part: 'joy1', icon: 'target', title: 'Joystick', text: 'Two knobs at right angles.' },
      { pin: 'analog:1', icon: 'wave', title: 'A0 · VRx', text: 'Left–right: 0 to 1023.' },
      { pin: 'analog:2', icon: 'wave', title: 'A1 · VRy', text: 'Up–down: 0 to 1023.' },
      { pin: 'dlow:3', icon: 'button', title: 'Pin 2 · SW', text: 'Press the stick down to click.' },
    ],
    overview: [
      'Under the stick sit two potentiometers, one for each direction. At rest each reads about **512**, the middle of 0–1023; pushing the stick moves the reading towards 0 or 1023.',
      'Press the stick down and a small switch joins SW to ground. With `INPUT_PULLUP` the pin reads HIGH normally and LOW while pressed, just like a push button.',
      { tips: [['wave', '`analogRead()` gives 0–1023'], ['target', 'Ignore small moves around the centre (a dead zone)'], ['button', 'SW reads LOW when pressed']] },
    ],
    wiring: [{ pin: 'analog:1', to: 'Joystick **VRx**' }, { pin: 'analog:2', to: 'Joystick **VRy**' }, { pin: 'dlow:3', to: 'Joystick **SW**' }, { pin: 'power:5', to: '5 V rail → **+5V**' }, { pin: 'power:6', to: 'GND rail → **GND**' }],
    code: [{ file: 'joystick.ino', lang: 'cpp', trace: { read: 9 }, source: `
const int X_PIN = A0, Y_PIN = A1, SW_PIN = 2;

void setup() {
  pinMode(SW_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int x = analogRead(X_PIN);
  int y = analogRead(Y_PIN);
  bool pressed = digitalRead(SW_PIN) == LOW;
  Serial.print("X: "); Serial.print(x);
  Serial.print("  Y: "); Serial.print(y);
  Serial.println(pressed ? "  button: DOWN" : "  button: up");
  delay(200);
}
` }],
    codeNotes: ['Which way is "up" depends on how the module is mounted. Flip a reading with `1023 - y` if needed.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the stick moves through a few positions and the Serial Monitor shows the readings.', rest: { joy1: { x: 0, y: 0 } },
      steps: [
        { set: { joy1: { x: 0, y: 0 } }, ms: 900, log: 'X: 512  Y: 509  button: up', trace: 'read' },
        { set: { joy1: { x: 1, y: 0 } }, ms: 900, log: 'X: 1023  Y: 511  button: up', trace: 'read' },
        { set: { joy1: { x: 0, y: 1 } }, ms: 900, log: 'X: 514  Y: 1023  button: up', trace: 'read' },
        { set: { joy1: { x: -1, y: 0 } }, ms: 900, log: 'X: 0  Y: 508  button: up', trace: 'read' },
        { set: { joy1: { x: 0, y: -1 } }, ms: 900, log: 'X: 511  Y: 0  button: up', trace: 'read' },
        { set: { joy1: { x: 0, y: 0 } }, ms: 900, log: 'X: 512  Y: 510  button: DOWN', trace: 'read' },
      ],
    },
    run: { cmd: UPLOAD('joystick'), stop: [] },
    kit: [['1', 'Thumb joystick module (KY-023 or similar)'], ['5', 'Male-to-female jumper wires']],
  },
];
