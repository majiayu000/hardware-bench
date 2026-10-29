// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: ST UM1724 (STM32 Nucleo-64 user manual), the STM32F401RE datasheet, and the stm32duino
// variant for NUCLEO_F401RE (Arduino pin D0–D15 / A0–A5 to STM32 port pin mapping).

export const SITE = {
  id: 'learn-stm32-nucleo',
  title: 'STM32 Nucleo-F401RE: Arduino Meets Arm',
  accent: '#03234b',
  logicVolts: 3.3,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Nucleo connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Copying firmware to the NODE_F401RE drive…', 'Done uploading.'],
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', pwm: 'Digital I/O with PWM (~)',
  analog: 'Analog input', uart: 'Serial (USART2, via ST-LINK)', i2c: 'I²C', spi: 'SPI', reset: 'Reset', nc: 'Not connected',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// NUCLEO-F401RE, top view, millimetres, the ST-LINK end (with its USB port) on the left. The board
// is 82.5 × 70 mm (UM1724). The Arduino Uno V3 connectors CN9, CN5, CN6 and CN8 keep the Uno's
// spacing, so Uno shields fit; the STM32 pin behind each Arduino name follows the stm32duino variant.
// The ST morpho headers and all other parts are placed from photos and are stylised.
const HEADERS = [
  { id: 'cn9', label: 'CN9 · digital pins D0–D7', short: 'CN9', desc: 'Arduino digital pins 0–7. D0 and D1 are the serial port to the ST-LINK, which the Serial Monitor uses.',
    pins: pinTable('D0|PA3, USART2 RX|uart; D1|PA2, USART2 TX|uart; D2|PA10|gpio; D3|PB3, ~PWM|pwm; D4|PB5|gpio; D5|PB4, ~PWM|pwm; D6|PB10, ~PWM|pwm; D7|PA8|gpio'),
    x: 80.04, z: 7.62, step: [-2.54, 0] },
  { id: 'cn5', label: 'CN5 · D8–D15, GND, AREF', short: 'CN5', desc: 'Arduino digital pins 8–15 with GND and AREF. D13 also drives the green user LED LD2; D14 and D15 are I²C.',
    pins: pinTable('D8|PA9|gpio; D9|PC7, ~PWM|pwm; D10|PB6, ~PWM, SPI CS|pwm; D11|PA7, ~PWM, SPI MOSI|pwm; D12|PA6, SPI MISO|spi; D13|PA5, SPI SCK, LD2|spi; GND||gnd; AREF||analog; D14|PB9, I²C SDA|i2c; D15|PB8, I²C SCL|i2c'),
    x: 58.196, z: 7.62, step: [-2.54, 0] },
  { id: 'cn6', label: 'CN6 · power', short: 'CN6', desc: 'Power for your circuits: 3.3 V, 5 V and GND, plus VIN for an external 7–12 V supply.',
    pins: pinTable('NC||nc; IOREF|3.3 V|power3; RESET||reset; +3V3||power3; +5V||power5; GND||gnd; GND||gnd; VIN|7–12 V in|power5'),
    x: 41.94, z: 55.88, step: [2.54, 0] },
  { id: 'cn8', label: 'CN8 · analog A0–A5', short: 'CN8', desc: 'Analog inputs, 0–3.3 V read by the 12-bit ADC. Never feed them 5 V.',
    pins: pinTable('A0|PA0|analog; A1|PA1|analog; A2|PA4|analog; A3|PB0|analog; A4|PC1|analog; A5|PC0|analog'),
    x: 64.8, z: 55.88, step: [2.54, 0] },
].map((h) => ({ layout: 'single', style: 'female', pitch: 2.54, ...h }));

export const BOARD = {
  name: 'NUCLEO-F401RE',
  width: 82.5,
  depth: 70,
  thickness: 1.6,
  cornerRadius: 1.5,
  pcbColor: '#f2f2f0',
  silkColor: 'rgba(3,35,75,0.8)',
  holes: [{ x: 27, z: 5, r: 1.6 }, { x: 80, z: 23, r: 1.6 }, { x: 28, z: 64, r: 1.6 }, { x: 80, z: 50, r: 1.6 }],
  silkscreen: [
    { text: 'NUCLEO-F401RE', x: 54, z: 46, size: 2.6, weight: 700, align: 'center' },
    { text: 'ST-LINK', x: 10, z: 46, size: 1.6, align: 'center' },
  ],
  components: [
    { id: 'mcu', kind: 'chip', label: 'STM32F401RE microcontroller', desc: 'An Arm Cortex-M4 at 84 MHz with a floating-point unit, 512 KB of flash and 96 KB of RAM. Your sketch runs here.', shape: 'box', x: 54, z: 32, w: 10, d: 10, h: 1.4, color: '#2a2930', text: 'STM32F401', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'stlink', kind: 'chip', label: 'ST-LINK/V2-1 debugger', desc: 'A second microcontroller that programs and debugs the main one, and passes USART2 through to your computer as a serial port.', shape: 'box', x: 12, z: 30, w: 7, d: 7, h: 1.2, color: '#2a2930', text: 'ST-LINK' },
    { id: 'usb', kind: 'usb', label: 'USB Mini-B port', desc: 'Power, uploads (the board appears as a USB drive) and the serial monitor, all through the ST-LINK.', shape: 'box', x: 3, z: 32, w: 9, d: 8, h: 4, color: '#c3c8d0', metal: true },
    { id: 'b1', kind: 'button', accent: '#2f62d6', label: 'B1 user button', desc: 'The blue button, on PC13 (USER_BTN). It reads LOW while pressed.', shape: 'box', x: 38, z: 24, w: 6, d: 6, h: 3, color: '#c9ced6' },
    { id: 'b2', kind: 'button', accent: '#1d1c22', label: 'B2 reset button', desc: 'The black button: restarts your sketch.', shape: 'box', x: 38, z: 42, w: 6, d: 6, h: 3, color: '#c9ced6' },
    { id: 'ld2', kind: 'ledsmd', accent: '#3fe06b', label: 'LD2 user LED', desc: 'Green LED on D13 (PA5), LED_BUILTIN in sketches.', shape: 'box', x: 64, z: 17, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'ld1', kind: 'ledsmd', accent: '#ff5a3a', label: 'LD1 COM LED', desc: 'Red and green: blinks while the ST-LINK talks to your computer.', shape: 'box', x: 12, z: 20, w: 1.6, d: 1.6, h: 0.6, color: '#f1ece2' },
    { id: 'ld3', kind: 'ledsmd', accent: '#ff3b3b', lit: true, label: 'LD3 power LED', desc: 'Lights when the board has 5 V.', shape: 'box', x: 22, z: 50, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'morpho1', label: 'ST morpho header CN7', desc: 'Two rows of 19 pins that bring out every STM32 pin. Not used in this course: the Arduino connectors are enough.', shape: 'box', x: 47, z: 2.6, w: 48, d: 5.1, h: 8.5, color: '#2b2a30' },
    { id: 'morpho2', label: 'ST morpho header CN10', desc: 'The second morpho header, with the remaining STM32 pins.', shape: 'box', x: 47, z: 67.4, w: 48, d: 5.1, h: 8.5, color: '#2b2a30' },
  ],
  headers: HEADERS,
};

// ---------- shared circuit pieces ----------
// The breadboard sits to the right of the board, rows a–e towards CN9; the power header feeds the
// bottom rails and CN5's GND the top − rail.
const BB = { x: 90, z: 5.8 };
const RAILS = [{ from: 'cn6:4', to: 'bb:bp2', color: '#e2483c' }, { from: 'cn6:6', to: 'bb:bn2', color: '#2b2a30' }];
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c3', b: 'c7', ohms: 220, label: '220 Ω resistor', desc: 'Limits the LED current. Click it to try other values.', controls: { ohms: [150, 220, 470, 1000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e7', cathode: 'e8', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to the − rail.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'cn9:8', to: 'bb:a3', color: '#f0a33a' }, { from: 'bb:a8', to: 'bb:tn8', color: '#2b2a30' }, { from: 'cn5:7', to: 'bb:tn1', color: '#2b2a30' }];
const LED_WIRING = [{ pin: 'cn9:8', to: '220 Ω resistor → LED **long leg**' }, { pin: 'cn5:7', to: 'Top **−** rail → LED short leg' }];
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn STMicroelectronics:stm32:Nucleo_64:pnum=NUCLEO_F401RE ${sketch}`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Nucleo',
    short: 'Meet the board',
    summary: 'A 32-bit Arm board with Arduino-shaped headers and a built-in debugger.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'STM32F401RE', text: 'Cortex-M4, 84 MHz.' },
      { component: 'stlink', icon: 'usb', title: 'ST-LINK', text: 'Programmer, debugger and serial port.' },
      { component: 'b1', icon: 'button', title: 'B1 (blue)', text: 'User button on PC13.' },
      { component: 'ld2', icon: 'led', title: 'LD2', text: 'Green user LED on D13.' },
      { pin: 'cn9:1', icon: 'pin', title: 'Arduino headers', text: 'Same places as on an Uno.' },
    ],
    overview: [
      'STM32 chips are in printers, drones and car dashboards. The **Nucleo-64** boards are ST’s low-cost way in: an **STM32F401RE** (Arm Cortex-M4 at 84 MHz with a floating-point unit) on a board whose headers match the **Arduino Uno**, so Uno shields and tutorials carry over.',
      'The left end of the board is a complete **ST-LINK** debugger. It programs the chip, lets you step through code in a debugger, and passes the chip’s serial port to your computer.',
      { note: 'The STM32 runs at **3.3 V**. Many of its pins tolerate 5 V, but the analog pins do not. Keep all signals at 3.3 V to be safe.', tone: 'warn' },
      { tips: [['target', 'Click a pin to see its STM32 name (PA5, PB9…)'], ['code', 'Arduino names (D13, A0) work in sketches'], ['info', 'The morpho headers bring out every pin']] },
      { h: 'Specifications' },
      { specs: [['Microcontroller', 'STM32F401RET6, Arm Cortex-M4F, 84 MHz'], ['Memory', '512 KB flash, 96 KB SRAM'], ['Logic', '3.3 V'], ['Analog', '12-bit ADC'], ['Connectors', 'Arduino Uno V3 and ST morpho'], ['Programmer', 'On-board ST-LINK/V2-1, USB Mini-B']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'NUCLEO-F401RE'], ['1', 'USB-A to Mini-B cable', 'Must carry data.'], ['1', 'Half-size breadboard and jumper wires']],
  },

  {
    id: 'setup',
    title: 'Set up the Arduino IDE',
    summary: 'Add ST’s board package, pick NUCLEO-F401RE and upload Blink to the green LED.',
    icon: 'board',
    focus: { components: ['usb', 'ld2', 'ld1'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB', text: 'Shows up as a drive called NODE_F401RE.' },
      { component: 'ld2', icon: 'led', title: 'LD2', text: 'Blink flashes it.' },
      { component: 'ld1', icon: 'led', title: 'LD1', text: 'Blinks during uploads.' },
    ],
    overview: [
      { steps: [
        'In the Arduino IDE open **Preferences** and add ST’s board-manager URL (see Try it).',
        'In **Boards Manager** install **STM32 MCU based boards**.',
        'Choose **Tools → Board → Nucleo-64**, then **Board part number → Nucleo F401RE**.',
        'Open **File → Examples → 01.Basics → Blink** and upload. The green LED **LD2** blinks.',
      ] },
      'Uploading copies the program to a USB drive the ST-LINK pretends to be. You can also drag a .bin file onto that drive yourself.',
      { tips: [['usb', 'Plug in before choosing the port'], ['terminal', 'Click the commands in Try it'], ['clock', 'The first compile takes a while']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'arduino-cli config add board_manager.additional_urls https://github.com/stm32duino/BoardManagerFiles/raw/main/package_stmicroelectronics_index.json', note: 'add ST’s board list', out: [] },
        { cmd: 'arduino-cli core update-index && arduino-cli core install STMicroelectronics:stm32', note: 'install the STM32 core', out: ['Downloading index: package_stmicroelectronics_index.json downloaded', 'Installing platform STMicroelectronics:stm32...', 'Platform STMicroelectronics:stm32 installed'] },
        { cmd: UPLOAD('Blink'), note: 'compile + upload Blink', out: ['Sketch uses … bytes of program storage space.', 'Copying Blink.ino.bin to /media/NODE_F401RE…'] },
      ],
    },
    kit: [['1', 'Computer with the Arduino IDE or arduino-cli']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'An LED with a resistor on D7 blinks once a second.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['cn9:8', 'cn5:7'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'cn9:8', icon: 'pin', title: 'D7 · PA8', text: 'Your sketch switches it.' },
      { pin: 'cn5:7', icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while D7 is HIGH.' },
    ],
    overview: [
      'The sketch is the same as on an Uno: `pinMode()`, `digitalWrite()` and `delay()`. The STM32 core translates **D7** to the chip’s real pin, **PA8**. You could write `PA8` instead.',
      'HIGH here is **3.3 V**, not 5 V, so the LED draws a little less current than on an Uno.',
      { tips: [['led', '`LED_BUILTIN` is the green LD2 on D13'], ['code', 'STM32 pin names like PA8 also work'], ['resistor', 'Try 470 Ω: dimmer, still visible']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.ino', lang: 'cpp', trace: { on: 9, off: 12 }, source: `
const int LED_PIN = D7;   // PA8 on the STM32

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
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on D7', delay: 1, volts: 3.3 },
    run: { cmd: UPLOAD('blink'), stop: [] },
    kit: [['1', 'LED'], ['1', '220 Ω resistor', 'Red-red-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button on D2 with the internal pull-up switches the LED.',
    icon: { type: 'button' },
    focus: { pins: ['cn9:3', 'cn9:8', 'cn5:7'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e20', 'e22', 'f20', 'f22'], label: 'Push button', desc: 'Hold it down in the 3D view: it joins column 20 to column 22.' }],
      wires: [...LED_WIRES, { from: 'cn9:3', to: 'bb:a20', color: '#3b78d6' }, { from: 'bb:a22', to: 'bb:tn22', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'cn9:3', icon: 'pin', title: 'D2 · PA10', text: 'LOW while pressed.' },
      { component: 'b1', icon: 'button', title: 'Or use B1', text: '`USER_BTN` works the same way.' },
    ],
    overview: [
      '`INPUT_PULLUP` turns on a resistor inside the STM32 that holds D2 HIGH. The button pulls it to ground, so it reads **LOW while pressed**.',
      'The blue **B1** button on the board is already wired like this on PC13: replace `D2` with `USER_BTN` and you need no breadboard at all.',
      { tips: [['button', 'Hold the button in the 3D view'], ['code', '`digitalRead()` returns HIGH or LOW'], ['led', 'The LED from the last lesson stays']] },
    ],
    wiring: [...LED_WIRING, { pin: 'cn9:3', to: 'Column 20, one side of the button' }],
    code: [{ file: 'button.ino', lang: 'cpp', trace: { wait: 11, pressed: 13, released: 15 }, source: `
const int LED_PIN = D7, BUTTON_PIN = D2;   // or USER_BTN for the blue B1
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
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on D7' },
    run: { cmd: UPLOAD('button'), stop: [] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'knob',
    title: 'Read a knob with the 12-bit ADC',
    short: 'Read a knob',
    summary: 'A potentiometer on A0 and `analogReadResolution(12)` give readings from 0 to 4095.',
    icon: { type: 'pot' },
    focus: { pins: ['cn8:1', 'cn6:4', 'cn6:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'pot1', type: 'pot', legs: ['j14', 'j15', 'j16'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 3.3 V and GND; the middle leg outputs the voltage in between.', controls: { value: [0, 1] } }],
      wires: [...RAILS, { from: 'bb:h14', to: 'bb:bp14', color: '#e2483c' }, { from: 'cn8:1', to: 'bb:g15', color: '#3fae5a' }, { from: 'bb:h16', to: 'bb:bn16', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'cn8:1', icon: 'wave', title: 'A0 · PA0', text: 'Measures 0–3.3 V.' },
      { pin: 'cn6:4', icon: 'power', title: '+3V3', text: 'Feeds the + rail. Not 5 V!' },
    ],
    overview: [
      'The STM32’s ADC has **12 bits**: 4096 steps instead of the Uno’s 1024. Arduino sketches read 10 bits by default for compatibility; one line, `analogReadResolution(12)`, unlocks the full range.',
      { tips: [['wave', '3.3 V ÷ 4096 ≈ 0.8 mV per step'], ['knob', 'Click the knob in the 3D view'], ['power', 'The rails carry 3.3 V in this lesson']] },
      { note: 'The analog pins are **not** 5 V tolerant. Power the potentiometer from **+3V3**, never +5V.', tone: 'warn' },
    ],
    wiring: [{ pin: 'cn6:4', to: '+ rail → potentiometer outer leg' }, { pin: 'cn8:1', to: 'Potentiometer **middle leg**' }, { pin: 'cn6:6', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'knob.ino', lang: 'cpp', trace: { read: 7 }, source: `
void setup() {
  Serial.begin(9600);
  analogReadResolution(12);   // 0–4095
}

void loop() {
  int raw = analogRead(A0);
  int mv = raw * 3300L / 4095;
  Serial.print("raw: "); Serial.print(raw);
  Serial.print("  voltage: "); Serial.print(mv); Serial.println(" mV");
  delay(500);
}
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'A0 voltage', vmax: 3.3, max: 4095, every: 0.5 },
    run: { cmd: UPLOAD('knob'), stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },

  {
    id: 'sensor',
    title: 'An I²C sensor',
    short: 'I²C sensor',
    summary: 'A BME280 on D14/D15 reports temperature, humidity and air pressure.',
    icon: 'circuit',
    focus: { pins: ['cn5:9', 'cn5:10', 'cn6:4', 'cn6:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'bme', type: 'module', preset: 'breakout', pins: ['j21', 'j22', 'j23', 'j24'], label: 'BME280', color: '#5b2a86', desc: 'Temperature, humidity and pressure on I²C (address 0x76 or 0x77). Pins: VIN, GND, SCL, SDA.' }],
      wires: [...RAILS, { from: 'bb:h21', to: 'bb:bp21', color: '#e2483c' }, { from: 'bb:h22', to: 'bb:bn22', color: '#2b2a30' }, { from: 'cn5:10', to: 'bb:g23', color: '#f2c12e' }, { from: 'cn5:9', to: 'bb:g24', color: '#3b78d6' }],
    },
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Three readings, one chip.' },
      { pin: 'cn5:9', icon: 'pin', title: 'D14 · SDA', text: 'PB9, I²C data.' },
      { pin: 'cn5:10', icon: 'pin', title: 'D15 · SCL', text: 'PB8, I²C clock.' },
    ],
    overview: [
      'On the Nucleo the I²C pins sit where the Uno R3 has them, above AREF: **D14 (SDA)** and **D15 (SCL)**. The `Wire` library uses them automatically, so Arduino sensor libraries work unchanged.',
      { tips: [['code', 'Install "Adafruit BME280 Library"'], ['thermo', 'Pressure falls about 12 hPa per 100 m of height'], ['info', 'Most breakouts answer at 0x76 or 0x77']] },
    ],
    wiring: [{ pin: 'cn6:4', to: '+ rail (3.3 V) → sensor **VIN**' }, { pin: 'cn6:6', to: '− rail → sensor **GND**' }, { pin: 'cn5:10', to: 'Sensor **SCL**' }, { pin: 'cn5:9', to: 'Sensor **SDA**' }],
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
