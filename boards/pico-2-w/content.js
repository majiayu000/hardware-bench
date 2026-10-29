// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine (app.js, board3d.js, sims.js) is generic.

export const SITE = {
  id: 'learn-pico-2-w',
  title: 'Raspberry Pi Pico 2 W: MicroPython Starter',
  accent: '#c51a4a',
  logicVolts: 3.3,
  pinLimitMa: 12,
  shell: 'Serial · MicroPython REPL',
  terminalHint: 'Pico 2 W connected over USB. Press Run to send the script with mpremote.',
};

export const PIN_TYPES = {
  power5: '5 V / system power', power3: '3.3 V power', gnd: 'Ground', gpio: 'GPIO (3.3 V)', analog: 'GPIO with ADC', reset: 'Reset / enable',
};

// Pin tables in physical order: "NAME|ALT|type" separated by "; ".
const pinTable = (str, first) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return { n: i + 1, name, alt: [`pin ${first + i}`, alt].filter(Boolean).join(', '), type };
});

// Raspberry Pi Pico 2 W, top view, millimetres, turned so the micro-USB port is on the left.
// From the Pico 2 W datasheet: 51 × 21 mm board, 40 pins on a 2.54 mm grid, RP2350 with 4 MB flash,
// CYW43439 wireless, the user LED on the wireless chip's WL_GPIO0, and the pin-by-pin functions.
// In the datasheet's pinout (USB at the top) pins 1–20 run down the left edge and 21–40 back up the
// right edge; turned this way, pins 1–20 become the front row and 21–40 the back row. Pin positions
// (rows 17.78 mm apart, first pin 1.37 mm from the USB end) and the mounting holes follow the Pico
// mechanical drawing, which the Pico 2 W shares. Small parts are stylised.
const HEADERS = [
  { id: 'front', label: 'Front row: pins 1–20', short: 'Front', desc: 'GP0–GP15 with five grounds. Pin 1 (GP0) is at the USB end.',
    pins: pinTable('GP0|UART0 TX, I2C0 SDA|gpio; GP1|UART0 RX, I2C0 SCL|gpio; GND||gnd; GP2|I2C1 SDA|gpio; GP3|I2C1 SCL|gpio; GP4|I2C0 SDA|gpio; GP5|I2C0 SCL|gpio; GND||gnd; '
      + 'GP6|I2C1 SDA|gpio; GP7|I2C1 SCL|gpio; GP8|UART1 TX|gpio; GP9|UART1 RX|gpio; GND||gnd; GP10|SPI1 SCK|gpio; GP11|SPI1 TX|gpio; GP12|SPI1 RX|gpio; GP13|SPI1 CSn|gpio; GND||gnd; GP14||gpio; GP15||gpio', 1),
    x: 1.37, z: 19.39, step: [2.54, 0] },
  { id: 'back', label: 'Back row: pins 21–40', short: 'Back', desc: 'GP16–GP28, the three ADC pins and the power pins. Pin 40 (VBUS) is at the USB end.',
    pins: pinTable('GP16|SPI0 RX|gpio; GP17|SPI0 CSn|gpio; GND||gnd; GP18|SPI0 SCK|gpio; GP19|SPI0 TX|gpio; GP20|I2C0 SDA|gpio; GP21|I2C0 SCL|gpio; GND||gnd; GP22||gpio; RUN|reset when pulled low|reset; '
      + 'GP26|ADC0|analog; GP27|ADC1|analog; AGND|analog ground|gnd; GP28|ADC2|analog; ADC_VREF|ADC reference|power3; 3V3|3.3 V out|power3; 3V3_EN|pull low to switch 3.3 V off|reset; GND||gnd; VSYS|1.8–5.5 V in|power5; VBUS|5 V from USB|power5', 21),
    x: 49.63, z: 1.61, step: [-2.54, 0] },
].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, ...h }));

export const BOARD = {
  name: 'Raspberry Pi Pico 2 W',
  width: 51,
  depth: 21,
  thickness: 1,
  cornerRadius: 1,
  pcbColor: '#2f8f4e',
  holes: [{ x: 2, z: 4.8, r: 1.05 }, { x: 2, z: 16.2, r: 1.05 }, { x: 49, z: 4.8, r: 1.05 }, { x: 49, z: 16.2, r: 1.05 }],
  silkscreen: [{ text: 'Pico 2 W', x: 26, z: 7, size: 2, weight: 700, align: 'center' }, { text: 'BOOTSEL', x: 12.5, z: 15.5, size: 0.9, align: 'center' }, { text: 'LED', x: 8, z: 4.6, size: 0.9, align: 'center' }],
  components: [
    { id: 'usb', kind: 'usb', label: 'Micro-USB port', desc: 'Power and the serial connection for MicroPython. Use a data cable, not a charge-only one.', shape: 'box', x: 0.4, z: 10.5, w: 5.6, d: 8, h: 2.8, color: '#c3c6ca', metal: true },
    { id: 'mcu', kind: 'chip', label: 'RP2350 microcontroller', desc: 'Raspberry Pi’s own chip: two Arm Cortex-M33 cores at 150 MHz (plus two RISC-V cores) and 520 KB of RAM.', shape: 'box', x: 21, z: 11, w: 7, d: 7, h: 0.9, color: '#2a2930', text: 'RP2350' },
    { id: 'flash', kind: 'chip', label: '4 MB flash memory', desc: 'Holds MicroPython and your files, like main.py.', shape: 'box', x: 14, z: 10.5, w: 4, d: 4, h: 0.9, color: '#2a2930' },
    { id: 'wifi', kind: 'shield', label: 'Wireless chip (CYW43439)', desc: '2.4 GHz Wi-Fi and Bluetooth 5.2 under a metal can. It also switches the on-board LED.', shape: 'box', x: 36, z: 10.5, w: 9, d: 9, h: 1.3, color: '#c8cacc', metal: true },
    { id: 'antenna', label: 'Wi-Fi antenna', desc: 'The small antenna at the far end. Keep metal and wires away from it.', shape: 'box', x: 48.2, z: 10.5, w: 3.6, d: 6, h: 0.8, color: '#e9e6dd' },
    { id: 'bootsel', kind: 'button', label: 'BOOTSEL button', desc: 'Hold it while plugging in USB and the Pico shows up as a USB drive for installing firmware.', shape: 'box', x: 12.5, z: 13, w: 3.6, d: 3, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'led', kind: 'ledsmd', accent: '#3fe06b', label: 'On-board LED', desc: 'Wired to the wireless chip, not the RP2350. In MicroPython it is called Pin("LED").', shape: 'box', x: 8, z: 6.4, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'smps', kind: 'chip', label: 'Power converter', desc: 'A buck-boost regulator that turns 1.8–5.5 V into the 3.3 V the chip runs on.', shape: 'box', x: 7.5, z: 15, w: 3, d: 3, h: 0.9, color: '#2a2930' },
  ],
  headers: HEADERS,
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of the board, lined up so front pin n is in column n + 5.
const BB = { x: -17.33, z: 29 };
const GND_RAIL = { from: 'front:18', to: 'bb:tn23', color: '#2b2a30' };
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c25', b: 'c29', ohms: 220, label: '220 Ω resistor', desc: 'Limits the LED current. Try other values.', controls: { ohms: [100, 220, 470, 1000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e29', cathode: 'e30', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to the − rail.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'front:20', to: 'bb:a25', color: '#f0a33a' }, { from: 'bb:a30', to: 'bb:tn29', color: '#2b2a30' }, GND_RAIL];
const LED_WIRING = [{ pin: 'front:20', to: '220 Ω resistor → LED **long leg**' }, { pin: 'front:18', to: 'Top **−** rail → LED short leg' }];
const POT = { id: 'pot1', type: 'pot', legs: ['f14', 'f15', 'f16'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 3V3 and GND; the middle leg gives a voltage in between.', controls: { value: [0, 1] } };
const POT_WIRES = [{ from: 'back:16', to: 'bb:bp2', color: '#e2483c' }, { from: 'front:3', to: 'bb:bn3', color: '#2b2a30' }, { from: 'bb:j14', to: 'bb:bp14', color: '#e2483c' }, { from: 'bb:j16', to: 'bb:bn16', color: '#2b2a30' }, { from: 'back:11', to: 'bb:h15', color: '#f2c12e' }];
const POT_WIRING = [{ pin: 'back:16', to: 'Bottom **+** rail → potentiometer outer leg' }, { pin: 'front:3', to: 'Bottom **−** rail → potentiometer other outer leg' }, { pin: 'back:11', to: 'Potentiometer **middle leg**' }];

const STOP_NOTE = 'Press **Ctrl+C** to stop a script started with `mpremote run`. The pins keep their last state until the next script or a reset.';

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Pico 2 W',
    short: 'Meet the board',
    summary: 'A tiny, cheap microcontroller board with Wi-Fi. Find the chip, the BOOTSEL button and the 40 pins.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'RP2350', text: 'Runs MicroPython and your code.' },
      { component: 'wifi', icon: 'wifi', title: 'Wireless chip', text: 'Wi-Fi and Bluetooth.' },
      { component: 'bootsel', icon: 'button', title: 'BOOTSEL', text: 'For installing firmware.' },
      { component: 'usb', icon: 'usb', title: 'Micro-USB', text: 'Power and the REPL.' },
      { pin: 'front:1', icon: 'pin', title: 'Pin 1 · GP0', text: 'Pins count from the USB end.' },
    ],
    overview: [
      'The **Pico 2 W** is Raspberry Pi’s microcontroller board: no operating system, just your program, starting the moment it gets power. Its **RP2350** chip has two Arm cores, and a separate wireless chip adds Wi-Fi and Bluetooth.',
      'You will program it in **MicroPython**. Pins are called by their GPIO number: `Pin(15)` is **GP15**, which is physical pin 20.',
      { tips: [['target', 'Click a pin to see its GPIO number and physical number'], ['rotr', 'Drag to orbit, scroll to zoom'], ['info', 'The numbers on the board match the key']] },
      { note: 'GPIO pins are **3.3 V**. Never connect 5 V (VBUS or VSYS) to a GP pin.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Chip', 'RP2350, 2 × Cortex-M33 @ 150 MHz'], ['Memory', '520 KB RAM, 4 MB flash'], ['Wireless', '2.4 GHz Wi-Fi, Bluetooth 5.2'], ['GPIO', '26 pins, 3 with ADC'], ['Power in', 'USB, or 1.8–5.5 V on VSYS'], ['Size', '51 × 21 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Raspberry Pi Pico 2 W', 'Get the “WH” version with headers already soldered, or solder them yourself.'], ['1', 'Micro-USB data cable'], ['1', 'Half-size breadboard and jumper wires']],
  },

  {
    id: 'flash',
    title: 'Install MicroPython',
    summary: 'Hold BOOTSEL, drag the MicroPython file onto the Pico, then talk to it with mpremote.',
    icon: 'board',
    focus: { components: ['bootsel', 'usb'] },
    callouts: [
      { component: 'bootsel', icon: 'button', title: 'BOOTSEL', text: 'Hold it while plugging in.' },
      { component: 'usb', icon: 'usb', title: 'Micro-USB', text: 'Shows up as a drive called RP2350.' },
      { component: 'flash', icon: 'memory', title: 'Flash', text: 'Where MicroPython is stored.' },
    ],
    overview: [
      'Installing firmware on a Pico needs no special tools. Held down at power-up, **BOOTSEL** makes the Pico appear as a USB drive; copying a `.uf2` file onto it installs that firmware.',
      { steps: [
        'Download the latest **MicroPython** `.uf2` for **RPI_PICO2_W** from micropython.org/download.',
        'Hold **BOOTSEL**, plug in the USB cable, then let go. A drive named **RP2350** appears.',
        'Drag the `.uf2` onto that drive. The Pico restarts by itself and the drive disappears.',
        'Install mpremote on your computer and connect: `mpremote` opens the `>>>` prompt.',
      ] },
      { note: 'Prefer a code editor? Thonny can do all of this too: choose the **MicroPython (Raspberry Pi Pico)** interpreter.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'pip install mpremote', note: 'install the tool', out: ['Collecting mpremote', '…', 'Successfully installed mpremote'] },
        { cmd: 'mpremote exec "print(1 + 1)"', note: 'Python runs on the chip', out: ['2'] },
        { cmd: 'mpremote exec "import sys; print(sys.implementation.name)"', note: 'which Python?', out: ['micropython'] },
        { cmd: 'mpremote cp blink.py :main.py', note: 'run it on every power-up', out: ['cp blink.py :main.py'] },
      ],
    },
    kit: [['1', 'Computer with Python 3', 'For mpremote; Thonny works too.']],
  },

  {
    id: 'blink',
    title: 'Blink the on-board LED',
    short: 'Blink',
    summary: 'Your first script: switch the built-in LED on and off with `Pin("LED")`.',
    icon: 'board',
    focus: { components: ['led', 'wifi'] },
    callouts: [
      { component: 'led', icon: 'led', title: 'On-board LED', text: 'Pin("LED") in MicroPython.' },
      { component: 'wifi', icon: 'chip', title: 'Wireless chip', text: 'The LED is wired to it.' },
    ],
    overview: [
      'On the Pico 2 W the LED hangs off the **wireless chip**, not a GP pin, so MicroPython gives it a name: `Pin("LED")`. `toggle()` flips it between on and off.',
      { tips: [['led', 'Watch the green LED in the 3D view'], ['clock', 'Change `sleep(0.5)` to blink faster or slower'], ['code', 'Copy it to main.py to blink at every power-up']] },
    ],
    code: [{ file: 'blink.py', lang: 'python', source: `
from machine import Pin
from time import sleep

led = Pin("LED", Pin.OUT)
while True:
    led.toggle()
    print("LED on" if led.value() else "LED off")
    sleep(0.5)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'commands', commands: [{ cmd: 'mpremote run blink.py', note: 'blink the LED', out: ['LED on', 'LED off', 'LED on', 'LED off', '…'] }] },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'led',
    title: 'Wire your own LED',
    summary: 'Connect an LED to GP15 and blink it from the breadboard.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['front:20', 'front:18'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'front:20', icon: 'pin', title: 'GP15 · pin 20', text: 'value(1) puts 3.3 V on it.' },
      { part: 'res1', icon: 'resistor', title: '220 Ω', text: 'Click it to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Click it to change its colour.' },
      { pin: 'front:18', icon: 'ground', title: 'GND · pin 18', text: 'Feeds the top − rail.' },
    ],
    overview: [
      'GP15 is the last pin on the front row, physical pin **20**. Set it as an output and `value(1)` puts 3.3 V on it; current flows through the resistor and the LED to ground.',
      { tips: [['pin', 'Use GP numbers in code, physical numbers to find the pin'], ['resistor', 'Click the resistor to see the current'], ['clock', 'Drag the delay slider in Try it']] },
    ],
    wiring: LED_WIRING,
    wiringNotes: ['With 3.3 V and 220 Ω a red LED draws about 6 mA: clearly bright and easy on the pin.'],
    code: [{ file: 'led.py', lang: 'python', trace: { on: 6, off: 9 }, source: `
from machine import Pin
from time import sleep

led = Pin(15, Pin.OUT)
while True:
    led.value(1)
    print("LED on")
    sleep(1)
    led.value(0)
    print("LED off")
    sleep(1)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on GP15', delay: 1, volts: 3.3 },
    run: { cmd: 'mpremote run led.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'LED (any colour)'], ['1', '220 Ω resistor', 'Red-red-brown bands.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a button',
    summary: 'A push button on GP14 lights the LED while you hold it.',
    icon: { type: 'button' },
    focus: { pins: ['front:19', 'front:20', 'front:18'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e10', 'e12', 'f10', 'f12'], label: 'Push button', desc: 'Hold it down in the 3D view: pressing joins column 10 to column 12.' }],
      wires: [...LED_WIRES, { from: 'front:19', to: 'bb:a10', color: '#3b78d6' }, { from: 'bb:a12', to: 'bb:tn11', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene while Run is on.' },
      { pin: 'front:19', icon: 'pin', title: 'GP14 · pin 19', text: 'Reads 0 while pressed.' },
      { part: 'led1', icon: 'led', title: 'LED · GP15', text: 'On while the button is held.' },
    ],
    overview: [
      '`Pin.PULL_UP` turns on a resistor inside the RP2350 that holds GP14 at 3.3 V, so it reads **1**. Pressing the button connects it to ground: it reads **0 while pressed**.',
      { tips: [['button', 'Click and hold the button in the 3D view'], ['code', 'React only when the value changes'], ['clock', 'A 20 ms pause hides contact bounce']] },
    ],
    wiring: [...LED_WIRING, { pin: 'front:19', to: 'Column 10, one side of the button' }],
    wiringNotes: ['The button straddles the centre channel; column 12 on its other side goes to the − rail.'],
    code: [{ file: 'button.py', lang: 'python', trace: { wait: 9, pressed: 11, released: 11 }, source: `
from machine import Pin
from time import sleep

button = Pin(14, Pin.IN, Pin.PULL_UP)
led = Pin(15, Pin.OUT)

last = 1
while True:
    now = button.value()
    if now != last:
        led.value(1 if now == 0 else 0)
        print("Pressed!" if now == 0 else "Released")
        last = now
    sleep(0.02)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on GP15' },
    run: { cmd: 'mpremote run button.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'Tactile push button (6 mm)'], ['2', 'Jumper wires']],
  },

  {
    id: 'knob',
    title: 'Dim with a knob',
    summary: 'Read a potentiometer on GP26 (ADC0) and set the LED’s brightness with PWM.',
    icon: { type: 'pot' },
    focus: { pins: ['back:11', 'back:16', 'front:3', 'front:20', 'front:18'] },
    circuit: { breadboard: BB, parts: [...LED_PARTS, POT], wires: [...LED_WIRES, ...POT_WIRES] },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'back:11', icon: 'wave', title: 'GP26 · ADC0', text: 'read_u16() gives 0–65535.' },
      { pin: 'back:16', icon: 'power', title: '3V3 · pin 36', text: 'Feeds the bottom + rail.' },
      { part: 'led1', icon: 'led', title: 'LED · GP15', text: 'PWM sets its brightness.' },
    ],
    overview: [
      'Three pins can measure voltage: GP26, GP27 and GP28. `ADC(26).read_u16()` turns 0–3.3 V into **0–65535**, whatever the chip’s real resolution, so code works the same on every board.',
      '**PWM** switches GP15 on and off thousands of times a second; `duty_u16()` sets how much of each cycle it is on, from 0 to 65535. Feed one number into the other and the knob dims the LED.',
      { tips: [['knob', 'Click the potentiometer and drag its slider'], ['wave', 'Watch the raw value and the voltage'], ['led', 'The LED follows the knob']] },
    ],
    wiring: [...LED_WIRING, ...POT_WIRING],
    code: [{ file: 'knob.py', lang: 'python', trace: { read: 9 }, source: `
from machine import ADC, Pin, PWM
from time import sleep

knob = ADC(26)
led = PWM(Pin(15))
led.freq(1000)

while True:
    raw = knob.read_u16()                # 0 - 65535
    led.duty_u16(raw)
    print("raw:", raw, " voltage:", round(raw * 3300 / 65535), "mV")
    sleep(0.25)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'knob', pot: 'pot1', led: 'led1', label: 'GP26 voltage', vmax: 3.3, max: 65535, every: 0.25 },
    run: { cmd: 'mpremote run knob.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },

  {
    id: 'temp',
    title: 'Read the temperature sensor',
    short: 'Temperature',
    summary: 'The RP2350 has a thermometer inside: read it on ADC channel 4, no wiring needed.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'thermo', title: 'Built-in sensor', text: 'ADC channel 4, inside the chip.' },
      { component: 'usb', icon: 'terminal', title: 'REPL', text: 'Readings print here.' },
    ],
    overview: [
      'Besides the three ADC pins, the chip’s ADC has an internal **temperature sensor** on channel 4. Its voltage drops about 1.721 mV for every degree, and the chip reads 0.706 V at 27 °C, which gives the formula in the code.',
      'It measures the **chip**, which runs a little warmer than the room. Hold your finger on the RP2350 and watch it rise.',
      { tips: [['thermo', 'Press “Breathe on the sensor” in Try it'], ['code', 'Readings jump around: average a few for a steadier number'], ['chip', 'Good for “is it getting hot?”, not for a weather station']] },
    ],
    code: [{ file: 'temperature.py', lang: 'python', trace: { read: 7 }, source: `
from machine import ADC
from time import sleep

sensor = ADC(4)                     # the internal temperature sensor

while True:
    volts = sensor.read_u16() * 3.3 / 65535
    celsius = 27 - (volts - 0.706) / 0.001721
    print(f"{celsius:.1f} °C")
    sleep(1)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'env', fields: ['temp'], every: 1, tempDigits: 1 },
    run: { cmd: 'mpremote run temperature.py', stop: ['KeyboardInterrupt'] },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'sound',
    title: 'Play a tune',
    summary: 'Use PWM to make notes on a passive buzzer connected to GP13.',
    icon: { type: 'buzzer' },
    focus: { pins: ['front:17', 'front:18'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'bz1', type: 'buzzer', legs: ['e22', 'e19'], label: 'Passive piezo buzzer', desc: 'Clicks once per PWM cycle; the frequency is the pitch.' }],
      wires: [{ from: 'front:17', to: 'bb:a22', color: '#f0a33a' }, { from: 'bb:a19', to: 'bb:tn19', color: '#2b2a30' }, GND_RAIL],
    },
    callouts: [
      { part: 'bz1', icon: 'sound', title: 'Piezo buzzer', text: 'Turns PWM into sound.' },
      { pin: 'front:17', icon: 'wave', title: 'GP13 · pin 17', text: 'freq() sets the pitch.' },
      { pin: 'front:18', icon: 'ground', title: 'GND', text: 'The buzzer’s − leg.' },
    ],
    overview: [
      'A note is a frequency. With PWM at half duty (32768), `freq(440)` makes the buzzer click 440 times a second: the note A. Setting `duty_u16(0)` makes a rest.',
      { tips: [['sound', 'Turn the sound on in Try it to hear it'], ['wave', 'Double a frequency to go up an octave'], ['code', 'A melody is a list of (note, length) pairs']] },
      { note: 'Use a **passive** buzzer. An active one beeps at a single built-in pitch whatever you send it.' },
    ],
    wiring: [{ pin: 'front:17', to: 'Buzzer **+** leg' }, { pin: 'front:18', to: 'Top − rail → buzzer − leg' }],
    code: [{ file: 'tune.py', lang: 'python', trace: { tone: 10, rest: 13 }, source: `
from machine import Pin, PWM
from time import sleep

buzzer = PWM(Pin(13))
tune = [("C4", 262), ("E4", 330), ("G4", 392), ("C5", 523), ("rest", 0)]

while True:
    for name, hz in tune:
        if hz:
            buzzer.freq(hz)
            buzzer.duty_u16(32768)
        else:
            buzzer.duty_u16(0)
        print(name, hz)
        sleep(0.4)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'buzzer', buzzer: 'bz1', pin: 13, log: '{name} {hz}', melody: [['C4', 262, 400], ['E4', 330, 400], ['G4', 392, 400], ['C5', 523, 400], ['rest', 0, 400]] },
    run: { cmd: 'mpremote run tune.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'Passive piezo buzzer'], ['2', 'Jumper wires']],
  },

  {
    id: 'wifi',
    title: 'Switch the LED over Wi-Fi',
    short: 'Wi-Fi control',
    summary: 'Join your Wi-Fi and serve a tiny web page whose buttons switch the LED on GP15.',
    icon: { type: 'led', color: 'green' },
    focus: { pins: ['front:20', 'front:18'], components: ['wifi', 'antenna'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'antenna', icon: 'wifi', title: 'Antenna', text: '2.4 GHz networks only.' },
      { component: 'wifi', icon: 'chip', title: 'CYW43439', text: 'Handles the radio for you.' },
      { part: 'led1', icon: 'led', title: 'LED · GP15', text: 'Switched from your phone.' },
    ],
    overview: [
      '`network.WLAN` joins your Wi-Fi; `wlan.ifconfig()[0]` is the address your router gave the Pico. A **socket** then listens on port 80, the normal web port.',
      'The page has two links, `/led/on` and `/led/off`. The script looks at which address was asked for and switches the LED to match.',
      { steps: ['Put your Wi-Fi name and password in the script.', 'Run it and wait for the address.', 'Open the address on a phone on the same Wi-Fi.'] },
      { tips: [['wifi', '5 GHz networks will not work'], ['globe', 'Every request is printed in the REPL'], ['code', 'Keep passwords out of files you share']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'web.py', lang: 'python', trace: { serve: 15, on: 22, off: 24 }, source: `
import network, socket, time
from machine import Pin

led = Pin(15, Pin.OUT)
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("your-wifi", "your-password")
while not wlan.isconnected():
    time.sleep(0.5)
print("Open http://" + wlan.ifconfig()[0])

PAGE = """<h1>Pico LED</h1><a href="/led/on">On</a> <a href="/led/off">Off</a>"""
server = socket.socket()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(("0.0.0.0", 80))
server.listen(1)
while True:
    client, addr = server.accept()
    request = client.recv(1024).decode()
    path = request.split(" ")[1]
    if path == "/led/on":
        led.value(1)
    elif path == "/led/off":
        led.value(0)
    print(addr[0], "GET", path)
    client.send("HTTP/1.0 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n" + PAGE)
    client.close()
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'web', url: 'http://192.168.1.60/', led: 'led1', label: 'LED on GP15', title: 'Pico LED', start: ['Open http://192.168.1.60'], request: '{client} GET {path}' },
    run: { cmd: 'mpremote run web.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', '2.4 GHz Wi-Fi network'], ['1', 'Phone on the same Wi-Fi']],
  },

  {
    id: 'project',
    title: 'Build a Wi-Fi thermometer',
    short: 'Wi-Fi thermometer',
    summary: 'The capstone: serve the chip’s temperature as live JSON and a page that shows it.',
    icon: 'board',
    focus: { components: ['mcu', 'wifi'] },
    callouts: [
      { component: 'mcu', icon: 'thermo', title: 'Sensor', text: 'The temperature lesson’s ADC(4).' },
      { component: 'wifi', icon: 'wifi', title: 'Web server', text: 'The Wi-Fi lesson’s socket loop.' },
      { component: 'usb', icon: 'power', title: 'Any USB charger', text: 'Save as main.py to run without a computer.' },
    ],
    overview: [
      'This project joins two earlier lessons: the **temperature sensor** and the **web server**. The page asks `/api/reading` for a new value every 3 seconds.',
      { steps: ['Run it from your computer first and check the readings in the browser.', 'Copy it onto the Pico with `mpremote cp project.py :main.py`.', 'Unplug it from the computer, power it from any USB charger, and it starts on its own.'] },
      { h: 'Make it yours' },
      { steps: ['Light the LED on GP15 when the temperature passes a limit.', 'Add the potentiometer as an adjustable alarm level.', 'Beep the buzzer when the alarm triggers.'] },
    ],
    code: [{ file: 'project.py', lang: 'python', trace: { reading: 24 }, source: `
import network, socket, time, json
from machine import ADC

sensor = ADC(4)
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("your-wifi", "your-password")
while not wlan.isconnected():
    time.sleep(0.5)
print("Dashboard at http://" + wlan.ifconfig()[0] + "/")

def celsius():
    return 27 - (sensor.read_u16() * 3.3 / 65535 - 0.706) / 0.001721

PAGE = open("index.html").read()
server = socket.socket()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(("0.0.0.0", 80))
server.listen(1)
while True:
    client, addr = server.accept()
    path = client.recv(1024).decode().split(" ")[1]
    if path == "/api/reading":
        body, kind = json.dumps({"temperature": round(celsius(), 1)}), "application/json"
    else:
        body, kind = PAGE, "text/html"
    print(addr[0], "GET", path)
    client.send("HTTP/1.0 200 OK\\r\\nContent-Type: " + kind + "\\r\\n\\r\\n" + body)
    client.close()
` }, { file: 'index.html', lang: 'javascript', source: `
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pico thermometer</title>
<h1>Pico thermometer</h1>
<p>Temperature: <b id="temperature">-</b> °C</p>
<script>
  async function refresh() {
    const reading = await fetch("/api/reading").then((res) => res.json());
    document.getElementById("temperature").textContent = reading.temperature;
  }
  refresh();
  setInterval(refresh, 3000);
</script>
` }],
    codeNotes: ['Copy `index.html` onto the Pico too: `mpremote cp index.html :index.html`.', STOP_NOTE],
    sim: { type: 'dashboard', url: 'http://192.168.1.60/', title: 'Pico thermometer', fields: ['temperature'], every: 3, start: ['Dashboard at http://192.168.1.60/'], request: '{client} GET {path}' },
    run: { cmd: 'mpremote cp index.html :index.html + run project.py', file: 'project.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'USB phone charger', 'To run it away from the computer.']],
  },
];
