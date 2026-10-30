// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: stm32-base.org STM32F103C8T6 Blue Pill page, the STM32F103x8 datasheet, and the stm32duino
// BLUEPILL_F103C8 variant.
import { ledParts, ledWires, BUTTON, buttonWires, POT, potWires, BME, bmeWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-stm32-bluepill',
  title: 'STM32 Blue Pill: Arm for Very Little Money',
  accent: '#2a5cc4',
  logicVolts: 3.3,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Blue Pill connected through an ST-LINK. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading through ST-LINK…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', analog: 'Analog input (not 5 V tolerant)',
  i2c: 'I²C', reset: 'Reset', flash: 'Crystal or LED (avoid)',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// "Blue Pill" STM32F103C8T6 board, top view, millimetres, Micro-USB on the left, about 53 × 22.8 mm,
// rows 15.24 mm apart. These boards are made by many factories, so parts are stylised. Pin order
// follows the common pinout: the G, G, 3.3, R row on top, PB12 … 3.3 below, both from the USB end.
export const BOARD = {
  name: 'STM32F103C8T6 Blue Pill',
  width: 53,
  depth: 22.8,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1f3f9e',
  holes: [],
  silkscreen: [{ text: 'STM32F103', x: 39, z: 15, size: 1.4, align: 'center' }],
  components: [
    { id: 'mcu', kind: 'chip', label: 'STM32F103C8T6 microcontroller', desc: 'An Arm Cortex-M3 at 72 MHz with 64 KB of flash and 20 KB of RAM.', shape: 'box', x: 28, z: 11.4, w: 7.5, d: 7.5, h: 1.1, color: '#2a2930', text: 'STM32', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'usb', kind: 'usb', label: 'Micro-USB port', desc: 'Gives power. It does not upload sketches until a USB bootloader is installed.', shape: 'box', x: 1.6, z: 11.4, w: 7.4, d: 7.6, h: 2.8, color: '#c3c8d0', metal: true },
    { id: 'swd', label: 'SWD header', desc: 'Four pins at the far end: 3.3V, SWDIO, SWCLK and GND. An ST-LINK connects here to upload and debug.', shape: 'box', x: 51.6, z: 11.4, w: 2.6, d: 10.4, h: 8, color: '#2b2a30' },
    { id: 'boot', label: 'BOOT jumpers', desc: 'BOOT0 and BOOT1 pick where the chip starts. Leave both at 0 to run your program.', shape: 'box', x: 17, z: 7, w: 5, d: 7.6, h: 6, color: '#2b2a30' },
    { id: 'reset', kind: 'button', label: 'Reset button', desc: 'Restarts your sketch.', shape: 'box', x: 17, z: 16, w: 4, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'crystal', kind: 'crystal', label: '8 MHz crystal', desc: 'The clock source. The chip multiplies it up to 72 MHz.', shape: 'box', x: 38, z: 8, w: 8, d: 3.4, h: 2.4, color: '#e3e6eb' },
    { id: 'ledc13', kind: 'ledsmd', accent: '#3fe06b', label: 'User LED (PC13)', desc: 'On PC13 and active-low: writing LOW turns it on.', shape: 'box', x: 46, z: 16, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'pwr', kind: 'ledsmd', accent: '#ff3b3b', lit: true, label: 'Power LED', desc: 'Lights when the board has power.', shape: 'box', x: 12, z: 18, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
  ],
  headers: [
    { id: 'top', label: 'Top row', short: 'Top', desc: 'GND, GND, 3.3 V and reset at the USB end, then PB11 to PC13 and VBAT. PA0–PA7 are the main analog pins.', z: 3.78,
      pins: pinTable('G|GND|gnd; G|GND|gnd; 3.3|3.3 V|power3; R|reset|reset; B11|PB11|gpio; B10|PB10|gpio; B1|PB1, ADC|analog; B0|PB0, ADC|analog; A7|PA7, ADC|analog; A6|PA6, ADC|analog; A5|PA5, ADC|analog; A4|PA4, ADC|analog; A3|PA3, ADC|analog; A2|PA2, ADC|analog; A1|PA1, ADC|analog; A0|PA0, ADC|analog; C15|PC15, 32 kHz crystal|flash; C14|PC14, 32 kHz crystal|flash; C13|PC13, user LED|flash; VB|VBAT|power3') },
    { id: 'bottom', label: 'Bottom row', short: 'Bottom', desc: 'PB12 to PB9 and then 5V, GND and 3.3V at the far end. Most of these pins tolerate 5 V, and PB6 and PB7 are I²C.', z: 19.02,
      pins: pinTable('B12|PB12|gpio; B13|PB13|gpio; B14|PB14|gpio; B15|PB15|gpio; A8|PA8|gpio; A9|PA9, USART1 TX|gpio; A10|PA10, USART1 RX|gpio; A11|PA11, USB D−|gpio; A12|PA12, USB D+|gpio; A15|PA15|gpio; B3|PB3|gpio; B4|PB4|gpio; B5|PB5|gpio; B6|PB6, I²C SCL|i2c; B7|PB7, I²C SDA|i2c; B8|PB8|gpio; B9|PB9|gpio; 5V||power5; G|GND|gnd; 3.3|3.3 V|power3') },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, x: 2.37, step: [2.54, 0], ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits to the right of the board, beyond the SWD header.
const BB = { x: 62, z: -14 };
const GND = 'top:1';
const LED_WIRING = [{ pin: 'top:5', to: '220 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }];
const UPLOAD = (sketch) => `arduino-cli compile --upload --fqbn STMicroelectronics:stm32:GenF1:pnum=BLUEPILL_F103C8,upload_method=swdMethod ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Blue Pill',
    short: 'Meet the board',
    summary: 'A very cheap Arm board that fits a breadboard, and what you need to know before buying one.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'STM32F103C8T6', text: 'Cortex-M3 at 72 MHz.' },
      { component: 'swd', icon: 'plug', title: 'SWD header', text: 'An ST-LINK connects here.' },
      { component: 'boot', icon: 'info', title: 'BOOT jumpers', text: 'Keep both at 0.' },
      { component: 'ledc13', icon: 'led', title: 'PC13 LED', text: 'Active-low.' },
    ],
    overview: [
      'The **Blue Pill** is a bare-bones STM32 board that costs less than a coffee. It has none of the Nucleo’s comforts, such as a debugger or Arduino headers, but it fits on a breadboard and teaches how an Arm chip is really programmed.',
      { note: 'Many Blue Pills sold online carry **cloned or remarked chips**. If uploads fail with a strange ID code, or some peripherals act oddly, the chip may not be genuine. Buy from a seller you trust.' },
      { tips: [['target', 'Click a pin to see its STM32 name'], ['code', 'STM32 names (PA0, PB6) work in sketches'], ['plug', 'You also need an ST-LINK V2 programmer']] },
      { note: 'The board runs at **3.3 V**. Some pins tolerate 5 V, but the analog pins do not. Never feed 5 V into a 3.3 pin.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Microcontroller', 'STM32F103C8T6, Arm Cortex-M3, 72 MHz'], ['Memory', '64 KB flash, 20 KB SRAM'], ['Logic', '3.3 V'], ['Analog', '12-bit ADC'], ['Programmer', 'External, through SWD'], ['Size', '53 × 23 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'STM32F103C8T6 Blue Pill board'], ['1', 'ST-LINK V2 programmer'], ['4', 'Female-to-female jumper wires'], ['1', 'Half-size breadboard and jumper wires']],
  },

  {
    id: 'setup',
    title: 'Connect an ST-LINK',
    summary: 'Four wires from the programmer to the SWD header, then upload from the Arduino IDE.',
    icon: 'board',
    focus: { components: ['swd', 'boot'] },
    callouts: [
      { component: 'swd', icon: 'plug', title: 'SWD header', text: '3.3V, SWDIO, SWCLK, GND.' },
      { component: 'boot', icon: 'info', title: 'BOOT jumpers', text: 'Leave both at 0.' },
      { component: 'ledc13', icon: 'led', title: 'PC13 LED', text: 'Blink flashes it.' },
    ],
    overview: [
      { steps: [
        'Wire the ST-LINK to the SWD header: **3.3V** to 3.3V, **SWDIO** to SWDIO, **SWCLK** to SWCLK, **GND** to GND.',
        'Install **STM32CubeProgrammer** from ST: the Arduino upload uses it.',
        'In the Arduino IDE add ST’s board-manager URL and install **STM32 MCU based boards**.',
        'Choose **Generic STM32F1 series**, then **Board part number → BluePill F103C8**, and **Upload method → STM32CubeProgrammer (SWD)**.',
        'Upload **File → Examples → 01.Basics → Blink**.',
      ] },
      'SWD is the wire protocol Arm chips use for programming and debugging. Two signal wires are enough to load code and even pause the chip mid-program.',
      { note: 'Check the labels on your ST-LINK: the pin order differs between dongles. Connect **only one** power source at a time: leave USB unplugged while the ST-LINK powers the board.', tone: 'warn' },
      { tips: [['plug', 'Keep the four wires short'], ['terminal', 'Click the commands in Try it'], ['info', 'The USB port is for power here']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json', note: 'add ST’s board list', out: [] },
        { cmd: 'arduino-cli core update-index && arduino-cli core install STMicroelectronics:stm32', note: 'install the STM32 core', out: ['Platform STMicroelectronics:stm32 installed'] },
        { cmd: UPLOAD('Blink'), note: 'compile + upload Blink', out: ['Sketch uses … bytes of program storage space.', 'Download verified successfully'] },
      ],
    },
    kit: [['1', 'Computer with the Arduino IDE and STM32CubeProgrammer']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'The built-in LED is backwards, so this lesson blinks it and an LED on PB11 together.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['top:5', GND], components: ['ledc13'] },
    circuit: { breadboard: BB, parts: ledParts(), wires: ledWires('top:5', GND) },
    callouts: [
      { pin: 'top:5', icon: 'pin', title: 'PB11', text: 'HIGH lights your LED.' },
      { component: 'ledc13', icon: 'led', title: 'PC13', text: 'LOW lights the built-in LED.' },
      { pin: GND, icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
    ],
    overview: [
      'On this board the built-in LED connects between 3.3 V and PC13, so **LOW turns it on**. That is the opposite of an Uno. The two LEDs in this sketch therefore blink in turn.',
      'PC13 is also a weak pin, able to sink only a few milliamps, so keep your own LEDs on other pins.',
      { tips: [['led', '`LED_BUILTIN` is PC13 here'], ['code', 'STM32 pin names like PB11 work directly'], ['resistor', 'Try 470 Ω: dimmer, still visible']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.ino', lang: 'cpp', trace: { on: 7, off: 10 }, source: `
void setup() {
  pinMode(PB11, OUTPUT);
  pinMode(PC13, OUTPUT);
}

void loop() {
  digitalWrite(PB11, HIGH);
  digitalWrite(PC13, HIGH);   // built-in LED off
  delay(1000);
  digitalWrite(PB11, LOW);
  digitalWrite(PC13, LOW);    // built-in LED on
  delay(1000);
}
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on PB11', delay: 1, volts: 3.3 },
    run: { cmd: UPLOAD('blink'), stop: [] },
    kit: [['1', 'LED'], ['1', '220 Ω resistor', 'Red-red-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button on PB10 with the internal pull-up switches the LED.',
    icon: { type: 'button' },
    focus: { pins: ['top:6', 'top:5', GND] },
    circuit: { breadboard: BB, parts: [...ledParts(), BUTTON], wires: [...ledWires('top:5', GND), ...buttonWires('top:6')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'top:6', icon: 'pin', title: 'PB10', text: 'LOW while pressed.' },
    ],
    overview: [
      '`INPUT_PULLUP` turns on a resistor inside the STM32 that holds PB10 HIGH. The button pulls it to ground, so it reads **LOW while pressed**.',
      { tips: [['button', 'Hold the button in the 3D view'], ['code', '`digitalRead()` returns HIGH or LOW'], ['led', 'The LED from the last lesson stays']] },
    ],
    wiring: [...LED_WIRING, { pin: 'top:6', to: 'Column 20, one side of the button' }],
    code: [{ file: 'button.ino', lang: 'cpp', trace: { wait: 7, pressed: 8, released: 8 }, source: `
void setup() {
  pinMode(PB11, OUTPUT);
  pinMode(PB10, INPUT_PULLUP);
}

void loop() {
  bool pressed = digitalRead(PB10) == LOW;
  digitalWrite(PB11, pressed ? HIGH : LOW);
  delay(20);
}
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on PB11' },
    run: { cmd: UPLOAD('button'), stop: [] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'knob',
    title: 'Read a knob with the 12-bit ADC',
    short: 'Read a knob',
    summary: 'A potentiometer on PA0 and `analogReadResolution(12)` give readings from 0 to 4095.',
    icon: { type: 'pot' },
    focus: { pins: ['top:16', 'top:3', 'top:2'] },
    circuit: { breadboard: BB, parts: [POT], wires: potWires('top:16', 'top:3', 'top:2') },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'top:16', icon: 'wave', title: 'PA0', text: 'Measures 0–3.3 V.' },
      { pin: 'top:3', icon: 'power', title: '3.3', text: 'Feeds the + rail. Not 5 V!' },
    ],
    overview: [
      'The STM32F103 has a **12-bit** ADC: 4096 steps. Arduino sketches read 10 bits by default for compatibility, and `analogReadResolution(12)` unlocks the full range. To see the numbers in a Serial Monitor you need a USB-serial adapter on PA9 and PA10.',
      { tips: [['wave', '3.3 V ÷ 4096 ≈ 0.8 mV per step'], ['knob', 'Click the knob in the 3D view'], ['power', 'The rails carry 3.3 V in this lesson']] },
      { note: 'PA0–PA7 are **not** 5 V tolerant. Power the potentiometer from **3.3**, never 5V.', tone: 'warn' },
    ],
    wiring: [{ pin: 'top:3', to: '+ rail → potentiometer outer leg' }, { pin: 'top:16', to: 'Potentiometer **middle leg**' }, { pin: 'top:2', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'knob.ino', lang: 'cpp', trace: { read: 7 }, source: `
void setup() {
  Serial.begin(9600);
  analogReadResolution(12);   // 0–4095
}

void loop() {
  int raw = analogRead(PA0);
  int mv = raw * 3300L / 4095;
  Serial.print("raw: "); Serial.print(raw);
  Serial.print("  voltage: "); Serial.print(mv); Serial.println(" mV");
  delay(500);
}
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'PA0 voltage', vmax: 3.3, max: 4095, every: 0.5 },
    run: { cmd: UPLOAD('knob'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires'], ['1', 'USB-serial adapter (3.3 V)']],
  },

  {
    id: 'sensor',
    title: 'An I²C sensor',
    short: 'I²C sensor',
    summary: 'A BME280 on PB6 and PB7 reports temperature, humidity and air pressure.',
    icon: 'circuit',
    focus: { pins: ['bottom:14', 'bottom:15', 'bottom:20', 'bottom:19'] },
    circuit: { breadboard: BB, parts: [BME], wires: bmeWires('bottom:14', 'bottom:15', 'bottom:20', 'bottom:19') },
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Three readings, one chip.' },
      { pin: 'bottom:15', icon: 'pin', title: 'PB7 · SDA', text: 'I²C data.' },
      { pin: 'bottom:14', icon: 'pin', title: 'PB6 · SCL', text: 'I²C clock.' },
    ],
    overview: [
      'The `Wire` library uses **PB6 (SCL)** and **PB7 (SDA)** on this board, so Arduino sensor libraries work unchanged. The chip’s flash is small, though: a big library can fill most of the 64 KB.',
      { tips: [['code', 'Install "Adafruit BME280 Library"'], ['memory', 'Watch the size report after compiling'], ['info', 'Most breakouts answer at 0x76 or 0x77']] },
    ],
    wiring: [{ pin: 'bottom:20', to: '+ rail (3.3 V) → sensor **VIN**' }, { pin: 'bottom:19', to: '− rail → sensor **GND**' }, { pin: 'bottom:14', to: 'Sensor **SCL**' }, { pin: 'bottom:15', to: 'Sensor **SDA**' }],
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
    kit: [['1', 'BME280 breakout (3.3 V)'], ['4', 'Jumper wires']],
  },
];
