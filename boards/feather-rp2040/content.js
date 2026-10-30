// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: Adafruit Feather RP2040 guide (pinouts) and CircuitPython's adafruit_feather_rp2040
// board definition (pins.c).
import { BME, POT, potWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-feather-rp2040',
  title: 'Adafruit Feather RP2040: Python as a USB Drive',
  accent: '#7a4fd0',
  logicVolts: 3.3,
  shell: 'CIRCUITPY · serial console',
  terminalHint: 'Board connected. Saving code.py restarts it.',
};

export const PIN_TYPES = {
  power5: 'USB or battery power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O with PWM', analog: 'Analog input',
  i2c: 'I²C', spi: 'SPI', uart: 'Serial', reset: 'Reset / enable',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Adafruit Feather RP2040, top view, millimetres, USB-C on the left, 50.8 × 22.8 mm, rows 20.32 mm
// apart. CircuitPython names and GPIO numbers come from pins.c; the long row has 16 pins and the
// short row 12, both read from the USB end. Parts are stylised.
export const BOARD = {
  name: 'Adafruit Feather RP2040',
  width: 50.8,
  depth: 22.8,
  thickness: 1.6,
  cornerRadius: 2,
  pcbColor: '#1f2230',
  holes: [{ x: 2.5, z: 2.5, r: 1.3 }, { x: 48.3, z: 2.5, r: 1.3 }, { x: 2.5, z: 20.3, r: 1.3 }, { x: 48.3, z: 20.3, r: 1.3 }],
  silkscreen: [{ text: 'Feather RP2040', x: 33, z: 18, size: 1.5, weight: 700, align: 'center' }],
  components: [
    { id: 'mcu', kind: 'chip', label: 'RP2040 microcontroller', desc: 'Two Arm Cortex-M0+ cores at up to 133 MHz with 264 KB of RAM, plus the PIO blocks that make custom signals.', shape: 'box', x: 27, z: 11.4, w: 7, d: 7, h: 1.1, color: '#2a2930', text: 'RP2040', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'flash', kind: 'chip', label: '8 MB flash', desc: 'Holds CircuitPython, and shows up on your computer as the CIRCUITPY drive.', shape: 'box', x: 36, z: 11.4, w: 4.5, d: 4, h: 0.9, color: '#2a2930' },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power, charging and data. The board appears as a drive and a serial port.', shape: 'box', x: 1.6, z: 11.4, w: 7.4, d: 9, h: 3.2, color: '#c3c8d0', metal: true },
    { id: 'jst', kind: 'jst', label: 'Battery connector', desc: 'A JST-PH socket for a 3.7 V LiPo. The board charges it from USB.', shape: 'box', x: 4, z: 3.6, w: 7, d: 5, h: 4, color: '#f0ede2' },
    { id: 'qt', kind: 'jst', label: 'STEMMA QT connector', desc: 'A small 4-pin socket on I²C (GPIO2 and GPIO3) with 3.3 V and GND. Sensors plug in with no soldering.', shape: 'box', x: 47.5, z: 11.4, w: 4.5, d: 6, h: 3, color: '#f0ede2' },
    { id: 'neo', kind: 'ledsmd', accent: '#ff5acb', label: 'NeoPixel', desc: 'One addressable RGB LED, called `board.NEOPIXEL`.', shape: 'box', x: 10, z: 16, w: 2, d: 2, h: 0.8, color: '#f1ece2' },
    { id: 'led13', kind: 'ledsmd', accent: '#ff3b3b', label: 'Red LED (D13)', desc: 'The little red LED, called `board.LED`.', shape: 'box', x: 9, z: 7, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'boot', kind: 'button', label: 'BOOTSEL button', desc: 'Hold it while plugging in to reach the bootloader. In CircuitPython it is also `board.BUTTON`, on GPIO4.', shape: 'box', x: 18, z: 16.4, w: 3.2, d: 2.6, h: 1.5, color: '#d9d9d9', metal: true },
    { id: 'reset', kind: 'button', label: 'RESET button', desc: 'Restarts the board. A double press enters the bootloader.', shape: 'box', x: 18, z: 6.4, w: 3.2, d: 2.6, h: 1.5, color: '#d9d9d9', metal: true },
  ],
  headers: [
    { id: 'long', label: 'Long header (16 pins)', short: 'Long', desc: 'Reset, 3.3 V, GND, the analog pins, D24, D25, SPI, serial and D4.', z: 21.56,
      pins: pinTable('RST|reset|reset; 3.3V||power3; 3.3V||power3; GND||gnd; A0|GPIO26|analog; A1|GPIO27|analog; A2|GPIO28|analog; A3|GPIO29|analog; D24|GPIO24|gpio; D25|GPIO25|gpio; SCK|GPIO18|spi; MO|GPIO19, MOSI|spi; MI|GPIO20, MISO|spi; RX|GPIO1|uart; TX|GPIO0|uart; D4|GPIO6|gpio') },
    { id: 'short', label: 'Short header (12 pins)', short: 'Short', desc: 'Battery, enable and USB power, then D13 down to D5, and I²C.', z: 1.24,
      pins: pinTable('BAT|battery +|power5; EN|3.3 V regulator enable|reset; USB|USB 5 V|power5; D13|GPIO13, red LED|gpio; D12|GPIO12|gpio; D11|GPIO11|gpio; D10|GPIO10|gpio; D9|GPIO9|gpio; D6|GPIO8|gpio; D5|GPIO7|gpio; SCL|GPIO3|i2c; SDA|GPIO2|i2c') },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, x: 6.25, step: [2.54, 0], ...h })),
};

// ---------- shared circuit pieces ----------
const BB = { x: -14, z: 30 };

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Feather',
    short: 'Meet the board',
    summary: 'A battery-ready RP2040 board that appears on your computer as a USB drive of Python files.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'chip', title: 'RP2040', text: 'Two Cortex-M0+ cores.' },
      { component: 'jst', icon: 'plug', title: 'Battery socket', text: 'Runs and charges a LiPo.' },
      { component: 'qt', icon: 'plug', title: 'STEMMA QT', text: 'Plug-in I²C sensors.' },
      { component: 'neo', icon: 'led', title: 'NeoPixel', text: 'One RGB LED on the board.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Appears as a drive.' },
    ],
    overview: [
      'Adafruit’s **Feather** boards share one shape, so add-on boards called **FeatherWings** stack on any of them. This one uses the **RP2040**, the chip from the Raspberry Pi Pico, and adds a battery charger, an RGB LED and a plug-in sensor socket.',
      'It runs **CircuitPython**, Adafruit’s friendly version of Python. Plug it in and a drive called **CIRCUITPY** appears. Edit `code.py` with any editor, save it, and the board restarts with your new code. There is nothing to compile or flash.',
      { tips: [['target', 'Click a pin to see its name'], ['code', 'Pin names are in the `board` module'], ['info', 'Libraries are plain files in the `lib` folder']] },
      { h: 'Specifications' },
      { specs: [['Microcontroller', 'RP2040, dual Cortex-M0+, 133 MHz'], ['Memory', '8 MB flash, 264 KB RAM'], ['Logic', '3.3 V'], ['Power', 'USB-C or 3.7 V LiPo, with charger'], ['Sensors', 'STEMMA QT I²C socket'], ['Language', 'CircuitPython']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Adafruit Feather RP2040'], ['1', 'USB-C data cable'], ['1', '3.7 V LiPo battery', 'Optional.']],
  },

  {
    id: 'setup',
    title: 'Install CircuitPython',
    summary: 'Drag one .uf2 file onto the board, then edit `code.py` on the CIRCUITPY drive.',
    icon: 'board',
    focus: { components: ['boot', 'reset', 'usb'] },
    callouts: [
      { component: 'boot', icon: 'button', title: 'BOOTSEL', text: 'Hold it while plugging in.' },
      { component: 'reset', icon: 'button', title: 'RESET', text: 'Double press for the bootloader.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Use a cable that carries data.' },
    ],
    overview: [
      { steps: [
        'Download the **Feather RP2040** .uf2 file from circuitpython.org.',
        'Hold **BOOTSEL** and plug in the USB cable. A drive called **RPI-RP2** appears.',
        'Drag the .uf2 file onto it. The board restarts as **CIRCUITPY**.',
        'Open `code.py` in an editor such as Mu or VS Code, and connect to the serial console to see `print()` output.',
      ] },
      'Saving a file on CIRCUITPY restarts the program. That makes small experiments very quick: change a number, press save, watch.',
      { tips: [['usb', 'Eject the drive before unplugging'], ['terminal', 'Click the commands in Try it'], ['info', 'Adafruit’s library bundle has hundreds of drivers']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'cp adafruit-circuitpython-adafruit_feather_rp2040-en_US.uf2 /Volumes/RPI-RP2/', note: 'install CircuitPython', out: [] },
        { cmd: 'ls /Volumes/CIRCUITPY', note: 'see the new drive', out: ['boot_out.txt  code.py  lib'] },
        { cmd: 'tio /dev/ttyACM0', note: 'open the serial console', out: ['Adafruit CircuitPython on 2040', 'Hello World!'] },
      ],
    },
    kit: [['1', 'Computer with a text editor']],
  },

  {
    id: 'neopixel',
    title: 'Colours on the NeoPixel',
    short: 'NeoPixel',
    summary: 'The `neopixel` library sets the LED on the board to any colour.',
    icon: { glyph: 'wave' },
    focus: { components: ['neo'] },
    callouts: [{ component: 'neo', icon: 'led', title: 'NeoPixel', text: 'Three LEDs and a tiny controller.' }],
    overview: [
      'Copy `neopixel.mpy` from Adafruit’s library bundle into the `lib` folder on the drive. `pixel[0]` is the first (and only) LED, and a colour is three numbers from 0 to 255.',
      { tips: [['led', 'Set `brightness` low: it is very bright'], ['code', 'Save the file to run it'], ['knob', 'Drag the sliders in Try it to mix a colour']] },
    ],
    code: [{ file: 'code.py', lang: 'python', trace: { set: 9 }, source: `
import time
import board
import neopixel

pixel = neopixel.NeoPixel(board.NEOPIXEL, 1, brightness=0.2)

while True:
    for colour in [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 120, 0)]:
        pixel[0] = colour
        time.sleep(1)
` }],
    sim: { type: 'rgb', scale: 255, repl: 'pixel[0] = ({r}, {g}, {b})', log: '{name}', sequence: [['red', [1, 0, 0]], ['green', [0, 1, 0]], ['blue', [0, 0, 1]], ['amber', [1, 0.47, 0]]] },
    run: { cmd: 'cp code.py /Volumes/CIRCUITPY/', stop: [] },
  },

  {
    id: 'knob',
    title: 'Read a knob',
    summary: '`analogio` reads a potentiometer on A0 as a number from 0 to 65535.',
    icon: { type: 'pot' },
    focus: { pins: ['long:5', 'long:2', 'long:4'] },
    circuit: { breadboard: BB, parts: [POT], wires: potWires('long:5', 'long:2', 'long:4') },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'long:5', icon: 'wave', title: 'A0', text: 'Measures 0–3.3 V.' },
      { pin: 'long:2', icon: 'power', title: '3.3V', text: 'Feeds the + rail.' },
    ],
    overview: [
      'The RP2040’s ADC has 12 bits, but CircuitPython scales every reading to **0–65535** so that code works on any board.',
      { tips: [['knob', 'Click the knob in the 3D view'], ['code', '`pot.value / 65535 * 3.3` gives volts'], ['wave', 'The chip has four analog inputs']] },
    ],
    wiring: [{ pin: 'long:2', to: '+ rail → potentiometer outer leg' }, { pin: 'long:5', to: 'Potentiometer **middle leg**' }, { pin: 'long:4', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'code.py', lang: 'python', trace: { read: 8 }, source: `
import time
import board
import analogio

pot = analogio.AnalogIn(board.A0)

while True:
    raw = pot.value
    print('raw:', raw, ' voltage:', int(raw / 65535 * 3300), 'mV')
    time.sleep(0.5)
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'A0 voltage', vmax: 3.3, max: 65535, every: 0.5 },
    run: { cmd: 'cp code.py /Volumes/CIRCUITPY/', stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires'], ['1', 'Half-size breadboard']],
  },

  {
    id: 'sensor',
    title: 'Plug in a sensor',
    short: 'Plug-in sensor',
    summary: 'A BME280 breakout connects through the STEMMA QT socket with a single cable.',
    icon: 'circuit',
    focus: { components: ['qt'], pins: ['short:11', 'short:12', 'long:2', 'long:4'] },
    circuit: {
      breadboard: BB,
      parts: [BME],
      wires: [{ from: 'long:2', to: 'bb:f21', color: '#e2483c' }, { from: 'long:4', to: 'bb:f22', color: '#2b2a30' }, { from: 'short:11', to: 'bb:f23', color: '#f2c12e' }, { from: 'short:12', to: 'bb:f24', color: '#3b78d6' }],
    },
    callouts: [
      { component: 'qt', icon: 'plug', title: 'STEMMA QT', text: 'One cable: power and I²C.' },
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Three readings, one chip.' },
      { pin: 'short:12', icon: 'pin', title: 'SDA', text: 'Or use these pins with wires.' },
    ],
    overview: [
      'The socket carries the same I²C signals as the **SDA** and **SCL** pins. With a STEMMA QT sensor and cable there is nothing to wire, and the 3D view shows the same connection made with jumper wires.',
      'Copy `adafruit_bme280` and `adafruit_bus_device` into `lib`. `board.STEMMA_I2C()` opens the bus.',
      { tips: [['plug', 'QT sockets chain: sensors can be daisy-chained'], ['code', 'Adafruit breakouts answer at 0x77'], ['thermo', 'Pressure falls about 12 hPa per 100 m of height']] },
    ],
    wiring: [{ pin: 'long:2', to: 'Sensor **VIN**' }, { pin: 'long:4', to: 'Sensor **GND**' }, { pin: 'short:11', to: 'Sensor **SCL**' }, { pin: 'short:12', to: 'Sensor **SDA**' }],
    code: [{ file: 'code.py', lang: 'python', trace: { read: 9 }, source: `
import time
import board
from adafruit_bme280 import basic

i2c = board.STEMMA_I2C()
sensor = basic.Adafruit_BME280_I2C(i2c)

while True:
    print('%.1f C  %.1f %%  %.1f hPa' % (sensor.temperature, sensor.humidity, sensor.pressure))
    time.sleep(2)
` }],
    sim: { type: 'env', sensor: 'bme', fields: ['temp', 'hum', 'pres'], every: 2, tempDigits: 1 },
    run: { cmd: 'cp code.py /Volumes/CIRCUITPY/', stop: [] },
    kit: [['1', 'BME280 breakout with STEMMA QT'], ['1', 'STEMMA QT cable']],
  },

  {
    id: 'keyboard',
    title: 'Type with the BOOT button',
    short: 'USB keyboard',
    summary: 'CircuitPython makes the board a USB keyboard: a button press types a line.',
    icon: { glyph: 'usb' },
    focus: { components: ['boot', 'usb'] },
    callouts: [
      { component: 'boot', icon: 'button', title: 'BOOT button', text: 'Readable from your code.' },
      { component: 'usb', icon: 'usb', title: 'USB', text: 'Drive, serial and keyboard at once.' },
    ],
    overview: [
      'The RP2040 has USB built in, so the same cable can be a drive, a serial console and a keyboard together. Copy the `adafruit_hid` folder into `lib`. `board.BUTTON` is the BOOTSEL button, which reads **False while pressed**.',
      { tips: [['usb', 'No extra driver is needed'], ['code', 'The layout class turns text into key presses'], ['info', 'Macro pads work like this']] },
      { note: 'Click into an empty text editor before pressing. A sketch that types by itself can do real damage, so only type on a button press.', tone: 'warn' },
    ],
    code: [{ file: 'code.py', lang: 'python', trace: { wait: 13, pressed: 14, released: 13 }, source: `
import time
import board
import digitalio
import usb_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS

button = digitalio.DigitalInOut(board.BUTTON)
button.switch_to_input(pull=digitalio.Pull.UP)
layout = KeyboardLayoutUS(Keyboard(usb_hid.devices))

while True:
    if not button.value:
        layout.write('Hello from the Feather\\n')
        time.sleep(0.5)
` }],
    sim: { type: 'button', label: 'Keyboard line' },
    run: { cmd: 'cp code.py /Volumes/CIRCUITPY/', stop: [] },
  },
];
