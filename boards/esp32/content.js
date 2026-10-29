// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine (app.js, board3d.js, sims.js) is generic.

export const SITE = {
  id: 'learn-esp32',
  title: 'ESP32 DevKitC: Wi-Fi in MicroPython',
  accent: '#e7352c',
  logicVolts: 3.3,
  shell: 'Serial · MicroPython REPL · 115200 baud',
  terminalHint: 'Board connected over USB. Press Run to send the script with mpremote.',
};

export const PIN_TYPES = {
  power5: '5 V power',
  power3: '3.3 V power',
  gnd: 'Ground',
  gpio: 'GPIO (in/out)',
  input: 'Input only',
  strap: 'Strapping pin',
  uart: 'UART0 (USB serial)',
  flash: 'SPI flash, do not use',
  reset: 'Reset (EN)',
};

// ESP32-DevKitC V4 with ESP32-WROOM-32E, top view, millimetres, USB on the left and the
// module antenna on the right (the official photo rotated so J2 runs along the top edge).
//
// Exact, from Espressif's "ESP32-DevKitC V4 Dimensions" drawing: PCB 48.26 × 27.94 mm,
// 19 pins per header at 2.54 mm pitch, rows 25.40 mm apart, pins 1.27 mm in from the edges,
// antenna overhang 6.04 mm. Module size 18.0 × 25.5 × 3.1 mm from the WROOM-32E datasheet.
// Pin numbers, names and functions follow the J2/J3 tables in the DevKitC V4 user guide.
// The small parts (USB, CP2102N, AMS1117, buttons, LED) are placed from the photo and are
// stylised: do not use this file for mechanical design. The board has no mounting holes.
// Pin tables in physical order: "NAME|ALT|type" separated by "; ".
const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

export const BOARD = {
  name: 'ESP32-DevKitC V4',
  width: 48.26,
  depth: 27.94,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1f2230',
  holes: [],
  components: [
    { id: 'module', kind: 'shield', label: 'ESP32-WROOM-32E module', desc: 'The ESP32 chip, 4 MB of flash and a 40 MHz crystal under a metal shield. Dual-core, up to 240 MHz, with Wi-Fi and Bluetooth.', shape: 'box', x: 38.35, z: 13.97, w: 19.1, d: 18, h: 3.1, color: '#c8cacc', metal: true, text: 'ESP32', textColor: 'rgba(30,30,30,0.7)' },
    { id: 'antenna', label: 'PCB antenna', desc: 'The zig-zag copper trace at the end of the module that sends and receives Wi-Fi and Bluetooth. It hangs over the board edge so nothing blocks it.', shape: 'box', x: 51.15, z: 13.97, w: 6.4, d: 18, h: 0.8, color: '#23262b' },
    { id: 'usb', kind: 'usbc', label: 'Micro-USB port', desc: 'Powers the board and carries the serial connection to your computer. Use a data cable, not a charge-only one.', shape: 'box', x: 1.6, z: 13.97, w: 5.6, d: 7.6, h: 2.8, color: '#c3c6ca', metal: true },
    { id: 'bridge', kind: 'chip', label: 'USB-to-UART bridge (CP2102N)', desc: 'Turns USB into the serial signals on the ESP32’s TX and RX pins. It is how esptool and the MicroPython prompt reach the chip.', shape: 'box', x: 10.5, z: 14.5, w: 5, d: 5, h: 0.9, color: '#232323', text: 'CP2102N' },
    { id: 'ldo', kind: 'chip', label: '3.3 V regulator (AMS1117-3.3)', desc: 'Turns the 5 V from USB into the 3.3 V the ESP32 runs on. It also feeds the 3V3 header pin.', shape: 'box', x: 18.6, z: 13, w: 6.5, d: 7, h: 1.6, color: '#2a2a2a', text: '3V3' },
    { id: 'led', label: '5 V power-on LED', desc: 'Lights when USB or an external 5 V supply powers the board. There is no user-controllable LED on this board.', shape: 'box', x: 12.3, z: 5.8, w: 1.6, d: 0.8, h: 0.6, color: '#ff4a3d' },
    { id: 'en', kind: 'button', label: 'EN button (reset)', desc: 'Restarts the ESP32. Your program runs again from the beginning.', shape: 'box', x: 3.6, z: 6, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'boot', kind: 'button', label: 'Boot button', desc: 'Hold Boot, tap EN, then let go to put the chip into firmware download mode. It is wired to GPIO0.', shape: 'box', x: 3.6, z: 22.3, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
  ],
  headers: [
    {
      id: 'j2',
      label: 'J2 header (3V3 … 5V)',
      short: 'J2',
      desc: 'The 19-pin row on the EN-button side. Pin 1 (3V3) is at the antenna end. All signals are 3.3 V.',
      layout: 'single',
      style: 'male',
      pitch: 2.54,
      x: 46.99,
      z: 1.27,
      step: [-2.54, 0],
            pins: pinTable('3V3|3.3 V power supply|power3; EN|CHIP_PU, Reset|reset; VP|GPIO36, ADC1_CH0, S_VP|input; VN|GPIO39, ADC1_CH3, S_VN|input; '
        + 'IO34|GPIO34, ADC1_CH6, VDET_1|input; IO35|GPIO35, ADC1_CH7, VDET_2|input; IO32|GPIO32, ADC1_CH4, TOUCH_CH9, XTAL_32K_P|gpio; IO33|GPIO33, ADC1_CH5, TOUCH_CH8, XTAL_32K_N|gpio; '
        + 'IO25|GPIO25, ADC2_CH8, DAC_1|gpio; IO26|GPIO26, ADC2_CH9, DAC_2|gpio; IO27|GPIO27, ADC2_CH7, TOUCH_CH7|gpio; IO14|GPIO14, ADC2_CH6, TOUCH_CH6, MTMS|gpio; '
        + 'IO12|GPIO12, ADC2_CH5, TOUCH_CH5, MTDI|strap; GND||gnd; IO13|GPIO13, ADC2_CH4, TOUCH_CH4, MTCK|gpio; D2|GPIO9, D2|flash; '
        + 'D3|GPIO10, D3|flash; CMD|GPIO11, CMD|flash; 5V|5 V power supply|power5'),
    },
    {
      id: 'j3',
      label: 'J3 header (GND … CLK)',
      short: 'J3',
      desc: 'The 19-pin row on the Boot-button side. Pin 1 (GND) is at the antenna end. All signals are 3.3 V.',
      layout: 'single',
      style: 'male',
      pitch: 2.54,
      x: 46.99,
      z: 26.67,
      step: [-2.54, 0],
            pins: pinTable('GND||gnd; IO23|GPIO23|gpio; IO22|GPIO22|gpio; TX|GPIO1, U0TXD|uart; '
        + 'RX|GPIO3, U0RXD|uart; IO21|GPIO21|gpio; GND||gnd; IO19|GPIO19|gpio; '
        + 'IO18|GPIO18|gpio; IO5|GPIO5|strap; IO17|GPIO17|gpio; IO16|GPIO16|gpio; '
        + 'IO4|GPIO4, ADC2_CH0, TOUCH_CH0|gpio; IO0|GPIO0, ADC2_CH1, TOUCH_CH1, Boot|strap; IO2|GPIO2, ADC2_CH2, TOUCH_CH2|strap; IO15|GPIO15, ADC2_CH3, TOUCH_CH3, MTDO|strap; '
        + 'D1|GPIO8, D1|flash; D0|GPIO7, D0|flash; CLK|GPIO6, CLK|flash'),
    },
  ],
};

// Breadboards are aligned so header pin n sits in column 26 − n: in front of J3, or behind J2.
const FRONT = { x: -19.97, z: 36 };
const BACK = { x: -19.97, z: -62 };
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c24', b: 'c20', ohms: 330, label: '330 Ω resistor', desc: 'Limits the current through the LED. Try other values.', controls: { ohms: [220, 330, 1000, 10000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e20', cathode: 'e19', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to GND.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'j3:2', to: 'bb:a24', color: '#f0a33a' }, { from: 'bb:a19', to: 'j3:1', color: '#2b2a30' }];
const DHT_CIRCUIT = {
  breadboard: FRONT,
  parts: [{ id: 'dht', type: 'module', preset: 'dht22', pins: ['c12', 'c13', 'c14'], label: 'DHT22', desc: '3-pin DHT22 module: VCC, DATA, GND. The pull-up resistor is on the module.' }],
  wires: [{ from: 'j2:1', to: 'bb:a12', color: '#e2483c' }, { from: 'j3:13', to: 'bb:a13', color: '#f2c12e' }, { from: 'bb:a14', to: 'j3:7', color: '#2b2a30' }],
};

const STOP_NOTE = 'Press **Ctrl+C** to stop a script started with `mpremote run`. The board keeps whatever the pins were last set to until you reset it with the **EN** button.';

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the ESP32 board',
    short: 'Meet the board',
    summary: 'A microcontroller with Wi-Fi on a breadboard-friendly board. Find the module, the buttons and the two pin headers.',
    focus: { components: ['module'] },
    icon: 'board',
    callouts: [
      { component: 'module', icon: 'chip', title: 'ESP32 module', text: 'CPU, flash, Wi-Fi and Bluetooth in one can.' },
      { component: 'antenna', icon: 'wifi', title: 'PCB antenna', text: 'Keep metal and hands away from it.' },
      { component: 'usb', icon: 'usb', title: 'Micro-USB', text: 'Power and the serial link to your computer.' },
      { component: 'en', icon: 'button', title: 'EN button', text: 'Restarts your program.' },
      { pin: 'j2:1', icon: 'pin', title: 'J2 header', text: '19 pins; pin 1 (3V3) at the antenna end.' },
      { pin: 'j3:1', icon: 'pin', title: 'J3 header', text: '19 pins; pin 1 (GND) at the antenna end.' },
    ],
    overview: [
      'The ESP32-DevKitC V4 is a small carrier board for the **ESP32-WROOM-32E** module. It runs one program at a time, starts in under a second, and talks Wi-Fi and Bluetooth. You will program it in **MicroPython**, a compact Python that runs directly on the chip.',
      { h: 'What you are looking at' },
      { steps: [
        'The silver can on the right is the **ESP32-WROOM-32E module**. The ESP32 chip, flash memory and crystal are inside; the dark strip beyond it is the **PCB antenna**.',
        'The **Micro-USB port** on the left powers the board and connects it to your computer through the **CP2102N** USB-to-UART chip.',
        'Two buttons: **EN** restarts the chip, **Boot** (on GPIO0) is for firmware download mode.',
        'Two rows of 19 pins, **J2** and **J3**, carry power, ground and the GPIO pins. Pin 1 of both rows is at the antenna end.',
      ] },
      { note: 'The ESP32 is a **3.3 V** chip. Never connect 5 V to a GPIO pin: the datasheet’s absolute maximum is 3.6 V.', tone: 'warn' },
      { h: 'Pins to leave alone' },
      { steps: [
        '**D0, D1, D2, D3, CMD, CLK** (GPIO6–11) talk to the on-module flash. Using them crashes the board.',
        '**IO0, IO2, IO5, IO12, IO15** are **strapping pins**: the chip reads them at reset to decide how to boot. Fine for later projects, but avoid them for your first circuits.',
        '**VP, VN, IO34, IO35** (GPIO36, 39, 34, 35) are **input only** and have no internal pull-up or pull-down resistors.',
        '**TX** and **RX** carry the USB serial link you use to program the board.',
      ] },
      { h: 'Specifications' },
      { specs: [
        ['Module', 'ESP32-WROOM-32E (ESP32-D0WD-V3 chip)'],
        ['CPU', 'Xtensa dual-core 32-bit LX6, up to 240 MHz'],
        ['Memory', '520 KB SRAM, 4 MB SPI flash (ESP32-DevKitC-32E)'],
        ['Wi-Fi', '802.11 b/g/n, 2.4 GHz'],
        ['Bluetooth', 'Bluetooth 4.2 BR/EDR and Bluetooth LE'],
        ['Logic level', '3.3 V (absolute maximum 3.6 V)'],
        ['Analog', '12-bit ADC (ADC1 and ADC2), 2 × 8-bit DAC on GPIO25/26'],
        ['USB', 'Micro-USB via CP2102N USB-to-UART bridge'],
        ['Board size', '48.26 × 27.94 mm, plus 6 mm of antenna overhang'],
      ] },
    ],
    sim: { type: 'tour' },
    run: {
      cmd: 'mpremote exec "import sys; print(sys.platform)"',
      output: ['esp32'],
    },
    kit: [
      ['1', 'ESP32-DevKitC V4', 'The ESP32-DevKitC-32E variant has the ESP32-WROOM-32E module and 4 MB of flash.'],
      ['1', 'USB cable, Standard-A to Micro-B', 'It must carry data. Many phone-charging cables do not.'],
      ['1', 'Computer with Windows, macOS or Linux', 'With Python 3 installed.'],
      ['1', 'Breadboard and male-to-male jumper wires', 'Needed from lesson 4 on.'],
    ],
  },

  {
    id: 'setup',
    title: 'Flash MicroPython',
    short: 'Flash MicroPython',
    summary: 'Install the tools, erase the board and write the MicroPython firmware so it greets you with a `>>>` prompt.',
    focus: { components: ['usb', 'bridge', 'boot', 'en'] },
    icon: { glyph: 'usb' },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'Data cable', text: 'Charge-only cables will not work.' },
      { component: 'bridge', icon: 'code', title: 'CP2102N', text: 'Shows up as a serial port on your computer.' },
      { component: 'boot', icon: 'button', title: 'Boot', text: 'Hold it if esptool cannot connect.' },
      { component: 'en', icon: 'button', title: 'EN', text: 'Tap to restart after flashing.' },
    ],
    overview: [
      'A new board usually ships with a test program. You will replace it with the **MicroPython firmware**, a one-time step. After that you send Python scripts over USB with **mpremote**.',
      { steps: [
        'Install the two command-line tools: `pip install esptool mpremote` (on Windows the flasher may be called `esptool` instead of `esptool.py`).',
        'Plug the board in with a data USB cable. A new serial port appears: `COM…` on Windows, `/dev/ttyUSB0` on Linux, `/dev/cu.…` on macOS. If none appears, install the Silicon Labs **CP210x** USB-to-UART driver.',
        'Download the latest stable `.bin` for **ESP32_GENERIC** from micropython.org/download.',
        'Erase the flash: `esptool.py erase_flash`.',
        'Write the firmware at address `0x1000`: `esptool.py --baud 460800 write_flash 0x1000 <file>.bin`.',
        'Open the prompt with `mpremote`. Press Enter and you should see `>>>`. Leave with **Ctrl+]**.',
      ] },
      { note: 'If esptool cannot connect, put the chip into download mode by hand: hold **Boot**, tap **EN**, release **Boot**, then run the command again. If flashing fails partway, drop `--baud 460800` to use the slower default speed.' },
      { note: 'If several serial devices are attached, name the port: `esptool.py --port /dev/ttyUSB0 …` or `mpremote connect /dev/ttyUSB0`.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'pip install esptool mpremote', note: 'install the tools', out: ['Collecting esptool', 'Collecting mpremote', '…', 'Successfully installed esptool mpremote'] },
        { cmd: 'esptool.py erase_flash', note: 'wipe the board', out: [
          'Serial port /dev/ttyUSB0',
          'Connecting....',
          'Detecting chip type... ESP32',
          'Erasing flash (this may take a while)...',
          'Chip erase completed successfully',
          'Hard resetting via RTS pin...',
        ] },
        { cmd: 'esptool.py --baud 460800 write_flash 0x1000 ESP32_GENERIC.bin', note: 'write MicroPython', out: [
          'Connecting....',
          'Detecting chip type... ESP32',
          'Writing at 0x00001000...',
          '…',
          'Hash of data verified.',
          'Hard resetting via RTS pin...',
        ] },
        { cmd: 'mpremote', note: 'open the MicroPython prompt', out: [
          'Connected to MicroPython at /dev/ttyUSB0',
          'Use Ctrl-] or Ctrl-x to exit this shell',
          '>>>',
        ] },
      ],
    },
    kit: [
      ['1', 'MicroPython firmware for ESP32_GENERIC', 'From micropython.org/download. Pick a stable release, not a preview build.'],
    ],
  },

  {
    id: 'repl',
    title: 'Talk to the board',
    short: 'Talk to the board',
    summary: 'Run Python on the chip from your computer, and learn where scripts live and how to make one start on power-up.',
    focus: { components: ['module', 'en'] },
    icon: { glyph: 'terminal' },
    callouts: [
      { component: 'module', icon: 'terminal', title: 'MicroPython', text: 'Runs your code directly on the chip.' },
      { component: 'usb', icon: 'usb', title: 'REPL link', text: 'mpremote talks to the board over USB.' },
      { component: 'en', icon: 'button', title: 'EN = hard reset', text: 'main.py runs again after a reset.' },
    ],
    overview: [
      'MicroPython gives you a **REPL**: type a line of Python, the ESP32 runs it and prints the answer. Everything goes over the USB serial link at **115200 baud**.',
      { specs: [
        ['`mpremote`', 'Open the interactive `>>>` prompt'],
        ['`mpremote exec "…"`', 'Run one line of Python on the board'],
        ['`mpremote run file.py`', 'Send a script from your computer and run it, without saving it on the board'],
        ['`mpremote cp file.py :main.py`', 'Save a script on the board as `main.py`, which runs on every power-up'],
        ['`mpremote ls`', 'List files on the board'],
        ['`mpremote reset`', 'Restart the board, like pressing EN'],
        ['Ctrl+C', 'Stop the running script'],
      ] },
      'The board has a small file system in its flash. At start-up MicroPython runs `boot.py`, then `main.py` if it exists. In the lessons you will use `mpremote run` while you experiment, and copy a script to `main.py` once it works.',
      { note: 'If a `main.py` you saved misbehaves, connect with `mpremote`, press **Ctrl+C** to stop it, then remove it with `mpremote rm :main.py`.' },
    ],
    code: [{ file: 'hello.py', lang: 'python', source: `
import sys
import time

print("Hello from", sys.platform)
for i in range(3):
    print("tick", i)
    time.sleep(1)
print("done")
` }],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'mpremote exec "print(1 + 1)"', note: 'Python runs on the chip', out: ['2'] },
        { cmd: 'mpremote run hello.py', note: 'run a script from your computer', out: ['Hello from esp32', 'tick 0', 'tick 1', 'tick 2', 'done'] },
        { cmd: 'mpremote exec "import os; print(os.listdir())"', note: 'files stored on the board', out: ['[\'boot.py\']'] },
        { cmd: 'mpremote cp hello.py :main.py', note: 'run it on every power-up', out: ['cp hello.py :main.py'] },
        { cmd: 'mpremote reset', note: 'restart, like pressing EN', out: [] },
      ],
    },
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    short: 'Blink an LED',
    summary: 'Your first circuit: switch GPIO23 on and off with `machine.Pin` to make an LED blink.',
    focus: { pins: ['j3:2', 'j3:1'] },
    icon: { type: 'led', color: 'red' },
    circuit: { breadboard: FRONT, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'j3:2', icon: 'pin', title: 'IO23 · J3 pin 2', text: 'Your code switches it HIGH and LOW.' },
      { pin: 'j3:1', icon: 'ground', title: 'GND · J3 pin 1', text: 'Current returns to the board here.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click it to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Click it to change its colour.' },
    ],
    overview: [
      'A pin set as an **output** is either HIGH (3.3 V) or LOW (0 V). Put an LED and a resistor between the pin and ground, switch the pin HIGH, and current flows: the LED lights.',
      'This board has no LED you can control (the red one only shows power), so you add your own on **IO23**, the second pin of J3.',
      { steps: [
        'Unplug the USB cable and wire the LED as shown on the Wiring tab.',
        'Save the code as `blink.py` on your computer.',
        'Plug in and run `mpremote run blink.py`. Press Ctrl+C to stop.',
      ] },
    ],
    wiring: [
      { pin: 'j3:2', to: '330 Ω resistor → LED **long leg** (anode)' },
      { pin: 'j3:1', to: 'LED **short leg** (cathode)' },
    ],
    wiringNotes: [
      { note: 'Always put a resistor (220–470 Ω) in series with an LED. Without it the LED pulls far more current than the pin should supply.', tone: 'warn' },
      'MicroPython uses **GPIO numbers**: `Pin(23)` is the pin labelled **IO23**, which is pin 2 on header J3. The physical position has nothing to do with the number.',
    ],
    code: [{ file: 'blink.py', lang: 'python', trace: { on: 7, off: 10 }, source: `
from machine import Pin
import time

led = Pin(23, Pin.OUT)   # IO23 = J3 pin 2

while True:
    led.on()
    print("LED on")
    time.sleep(1)
    led.off()
    print("LED off")
    time.sleep(1)
` }],
    codeNotes: [
      '`led.value(1)` and `led.value(0)` do the same as `on()` and `off()`; `led.value()` with no argument reads the pin back.',
      'By default an ESP32 pin is set to drive strength `Pin.DRIVE_2`, which MicroPython rates at about 20 mA. An LED with 330 Ω draws only a few milliamps.',
      STOP_NOTE,
    ],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on IO23', delay: 1, volts: 3.3 },
    run: { cmd: 'mpremote run blink.py', stop: [] },
    kit: [
      ['1', 'LED (any colour)', '5 mm or 3 mm.'],
      ['1', '330 Ω resistor', 'Orange-orange-brown bands.'],
      ['1', 'Breadboard'],
      ['2', 'Female-to-male jumper wires'],
    ],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'Use a pin as an input with the internal pull-up resistor, and light the LED while the button is held.',
    focus: { pins: ['j3:3', 'j3:7', 'j3:2', 'j3:1'] },
    icon: { type: 'button' },
    circuit: {
      breadboard: FRONT,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e15', 'e17', 'f15', 'f17'], label: 'Push button', desc: 'Hold it down in the 3D view: it joins column 15 to column 17.' }],
      wires: [...LED_WIRES, { from: 'j3:3', to: 'bb:a15', color: '#3b78d6' }, { from: 'bb:j17', to: 'j3:7', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Click and hold it in the scene.' },
      { pin: 'j3:3', icon: 'pin', title: 'IO22 · input', text: 'PULL_UP keeps it at 1 until pressed.' },
      { pin: 'j3:7', icon: 'ground', title: 'GND · J3 pin 7', text: 'Pressing connects IO22 to here.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while the button is held.' },
    ],
    overview: [
      'As an **input**, a pin reports whether its voltage is high or low. `Pin.PULL_UP` switches on a resistor inside the ESP32 that holds the pin at 3.3 V. Pressing the button connects the pin to ground, so it reads **0 when pressed** and 1 when released.',
      'The script checks the button every 20 ms and only reacts when the value changes. That short pause also hides the few milliseconds of **bounce** when the metal contacts close.',
      { note: 'Keep the LED from the last lesson on the breadboard. This circuit adds a button on **IO22**.' },
    ],
    wiring: [
      { pin: 'j3:3', to: 'One leg of the push button (column 15)' },
      { pin: 'j3:7', to: 'Diagonally opposite leg of the push button (column 17, far side of the channel)' },
      { pin: 'j3:2', to: '330 Ω resistor → LED long leg (from lesson 4)' },
      { pin: 'j3:1', to: 'LED short leg (from lesson 4)' },
    ],
    wiringNotes: [
      'Breadboard buttons have four legs in two connected pairs. Use legs on **diagonally opposite** corners to be sure the button sits between the two wires.',
      { note: 'Do not use **IO34, IO35, VP or VN** for a button with `Pin.PULL_UP`: those pins are input only and have no internal pull resistors, so the pin would float.', tone: 'warn' },
    ],
    code: [{ file: 'button.py', lang: 'python', trace: { wait: 9, pressed: 12, released: 15 }, source: `
from machine import Pin
import time

led = Pin(23, Pin.OUT)
button = Pin(22, Pin.IN, Pin.PULL_UP)   # IO22 = J3 pin 3

last = button.value()
while True:
    now = button.value()
    if now != last:
        if now == 0:          # pulled to GND = pressed
            led.on()
            print("Pressed!")
        else:
            led.off()
            print("Released")
        last = now
    time.sleep_ms(20)
` }],
    codeNotes: ['MicroPython can also call a function for you when the pin changes: `button.irq(handler, trigger=Pin.IRQ_FALLING)`. Polling is easier to follow for a first program.', STOP_NOTE],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on IO23' },
    run: { cmd: 'mpremote run button.py', stop: [] },
    kit: [
      ['1', 'Tactile push button (6 mm)'],
      ['2', 'More male-to-male jumper wires'],
    ],
  },

  {
    id: 'rgb',
    title: 'Mix colours with PWM',
    short: 'Mix colours',
    summary: 'Dim LEDs with `machine.PWM` and blend red, green and blue into any colour.',
    focus: { pins: ['j2:9', 'j2:10', 'j2:11', 'j2:14'] },
    icon: { type: 'rgbled' },
    circuit: {
      breadboard: BACK,
      parts: [
        { id: 'rgb1', type: 'rgbled', legs: ['i21', 'i22', 'i23', 'i24'], label: 'RGB LED', desc: 'Legs: red, common cathode (longest), green, blue.' },
        { id: 'rr', type: 'resistor', a: 'h17', b: 'h21', ohms: 220, label: '220 Ω · red' },
        { id: 'rg', type: 'resistor', a: 'g16', b: 'g23', ohms: 220, label: '220 Ω · green' },
        { id: 'rb', type: 'resistor', a: 'f15', b: 'f24', ohms: 220, label: '220 Ω · blue' },
      ],
      wires: [{ from: 'j2:9', to: 'bb:j17', color: '#e2483c' }, { from: 'j2:10', to: 'bb:j16', color: '#3fae5a' }, { from: 'j2:11', to: 'bb:j15', color: '#3b78d6' }, { from: 'bb:j22', to: 'j2:14', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'rgb1', icon: 'led', title: 'RGB LED', text: 'Three LEDs under one milky lens.' },
      { pin: 'j2:9', icon: 'wave', title: 'IO25 · red', text: 'PWM duty sets the brightness.' },
      { part: 'rr', icon: 'resistor', title: '220 Ω each', text: 'One resistor per colour.' },
      { pin: 'j2:14', icon: 'ground', title: 'GND · J2 pin 14', text: 'Shared by all three colours.' },
    ],
    overview: [
      'A pin can only be fully on or fully off. **PWM** (pulse-width modulation) switches it on and off a thousand times a second and varies the share of time it is on. Your eye averages the flicker, so 25 % on looks like a dim LED.',
      'In MicroPython the share is `duty_u16`, from `0` (always off) to `65535` (always on). The ESP32 has 16 PWM channels and can put PWM on any output pin.',
      'An RGB LED is three LEDs in one package. The small `set_color()` function in the script takes three numbers between `0` and `1` and turns them into duty values.',
      { note: 'This lesson uses a **common-cathode** RGB LED: the longest leg goes to GND. For a common-anode LED, connect the long leg to **3V3** instead and invert each duty value (`65535 - duty`).' },
    ],
    wiring: [
      { pin: 'j2:9', to: '220 Ω resistor → **red** leg' },
      { pin: 'j2:10', to: '220 Ω resistor → **green** leg' },
      { pin: 'j2:11', to: '220 Ω resistor → **blue** leg' },
      { pin: 'j2:14', to: 'Longest leg (common cathode)' },
    ],
    wiringNotes: ['IO25, IO26 and IO27 sit next to each other on J2, with a GND pin three places further along.'],
    code: [{ file: 'colours.py', lang: 'python', trace: { set: 23 }, source: `
from machine import Pin, PWM
import time

red = PWM(Pin(25), freq=1000, duty_u16=0)
green = PWM(Pin(26), freq=1000, duty_u16=0)
blue = PWM(Pin(27), freq=1000, duty_u16=0)

def set_color(r, g, b):          # each 0.0 – 1.0
    red.duty_u16(int(r * 65535))
    green.duty_u16(int(g * 65535))
    blue.duty_u16(int(b * 65535))

colours = [
    ("red", (1, 0, 0)),
    ("green", (0, 1, 0)),
    ("blue", (0, 0, 1)),
    ("magenta", (1, 0, 1)),
    ("warm white", (1, 0.6, 0.2)),
]

while True:
    for name, colour in colours:
        set_color(*colour)
        print(name, colour)
        time.sleep(1)
` }],
    codeNotes: ['Run the script once, press Ctrl+C, then type `set_color(0.2, 0, 0.6)` at the `>>>` prompt in `mpremote` to try your own colours. The sliders in Try it do the same.', STOP_NOTE],
    sim: {
      type: 'rgb',
      led: 'rgb1',
      repl: 'set_color({r}, {g}, {b})',
      sequence: [['red', [1, 0, 0]], ['green', [0, 1, 0]], ['blue', [0, 0, 1]], ['magenta', [1, 0, 1]], ['warm white', [1, 0.6, 0.2]]],
    },
    run: { cmd: 'mpremote run colours.py', stop: [] },
    kit: [
      ['1', 'RGB LED, common cathode', 'Four legs; the longest is the cathode.'],
      ['3', '220 Ω resistors', 'Red-red-brown bands.'],
      ['4', 'Female-to-male jumper wires'],
    ],
  },

  {
    id: 'knob',
    title: 'Read a knob with the ADC',
    short: 'Read a knob',
    summary: 'Turn a potentiometer and measure its voltage with `machine.ADC` on an input-only pin.',
    focus: { pins: ['j2:1', 'j2:5', 'j2:14'] },
    icon: { type: 'pot' },
    circuit: {
      breadboard: BACK,
      parts: [{ id: 'pot1', type: 'pot', legs: ['f22', 'f21', 'f20'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 3V3 and GND; the middle leg outputs the voltage in between.', controls: { value: [0, 1] } }],
      wires: [{ from: 'j2:1', to: 'bb:j22', color: '#e2483c' }, { from: 'j2:5', to: 'bb:j21', color: '#f2c12e' }, { from: 'bb:j20', to: 'j2:14', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'j2:5', icon: 'wave', title: 'IO34 · ADC1_CH6', text: 'Measures the wiper voltage.' },
      { pin: 'j2:1', icon: 'power', title: '3V3 · J2 pin 1', text: 'Never 5 V on an ADC pin.' },
      { pin: 'j2:14', icon: 'ground', title: 'GND · J2 pin 14', text: 'The other end of the track.' },
    ],
    overview: [
      'A **potentiometer** is a resistor with a sliding contact. With its outer legs on 3.3 V and GND, the middle leg (the wiper) outputs any voltage in between as you turn it.',
      'The ESP32’s **ADC** turns that voltage into a number. `read_u16()` gives 0–65535; `read_uv()` gives a calibrated value in microvolts.',
      { h: 'Two ESP32 details' },
      { steps: [
        '**Attenuation.** Without it the ADC only measures up to about 1 V. `atten=ADC.ATTN_11DB` stretches the range; MicroPython documents it as linear from about 150 mV to 2450 mV, so readings bunch up at the very ends of the knob.',
        '**ADC1 vs ADC2.** Wi-Fi uses ADC2, and MicroPython raises an error if you read an ADC2 pin while Wi-Fi is on. **IO34** is on ADC1 (channel 6), so this circuit keeps working in the Wi-Fi lessons.',
      ] },
      { note: 'Wire the potentiometer to **3V3**, never to 5V. The ADC pin must stay below the 3.6 V absolute maximum.', tone: 'warn' },
    ],
    wiring: [
      { pin: 'j2:1', to: 'Potentiometer **outer leg** (either one)' },
      { pin: 'j2:5', to: 'Potentiometer **middle leg** (wiper)' },
      { pin: 'j2:14', to: 'Potentiometer **other outer leg**' },
    ],
    wiringNotes: ['IO34 is input only. That is fine here: the pin only measures, and the potentiometer sets its voltage, so no pull resistor is needed.'],
    code: [{ file: 'knob.py', lang: 'python', trace: { read: 7 }, source: `
from machine import ADC, Pin
import time

pot = ADC(Pin(34), atten=ADC.ATTN_11DB)   # IO34 = ADC1_CH6

while True:
    raw = pot.read_u16()          # 0 - 65535
    mv = pot.read_uv() // 1000    # calibrated millivolts
    print("raw:", raw, " voltage:", mv, "mV")
    time.sleep(0.5)
` }],
    codeNotes: ['Use the reading for something: `PWM(Pin(23), freq=1000, duty_u16=pot.read_u16())` makes the knob dim the LED from lesson 4.', STOP_NOTE],
    sim: { type: 'knob', pot: 'pot1', label: 'IO34 voltage', vmax: 3.3, every: 0.5 },
    run: { cmd: 'mpremote run knob.py', stop: [] },
    kit: [
      ['1', '10 kΩ potentiometer', 'A breadboard-friendly trimmer or a rotary pot with legs.'],
      ['3', 'Female-to-male jumper wires'],
    ],
  },

  {
    id: 'dht',
    title: 'Measure temperature and humidity',
    short: 'Read a sensor',
    summary: 'Read a DHT22 sensor with MicroPython’s built-in `dht` module.',
    focus: { pins: ['j2:1', 'j3:13', 'j3:7'] },
    icon: { type: 'module', preset: 'dht22' },
    circuit: DHT_CIRCUIT,
    callouts: [
      { part: 'dht', icon: 'thermo', title: 'DHT22', text: 'Temperature and humidity on one wire.' },
      { pin: 'j3:13', icon: 'wave', title: 'IO4 · data', text: 'The sensor answers here.' },
      { pin: 'j2:1', icon: 'power', title: '3V3', text: 'Keeps the data line at 3.3 V.' },
      { pin: 'j3:7', icon: 'ground', title: 'GND · J3 pin 7', text: 'Sensor ground.' },
    ],
    overview: [
      'The **DHT22** (also sold as AM2302) measures temperature and relative humidity and sends both over a single data wire. MicroPython includes a driver, so no extra library is needed.',
      'Call `measure()` to take a reading, then read `temperature()` in °C and `humidity()` in %. The sensor needs about **2 seconds** between readings.',
      { note: 'Power the sensor from **3V3** so its data line stays at 3.3 V, which is safe for the ESP32.', tone: 'warn' },
    ],
    wiring: [
      { pin: 'j2:1', to: 'DHT22 **VCC** (+)' },
      { pin: 'j3:13', to: 'DHT22 **DATA** (out)' },
      { pin: 'j3:7', to: 'DHT22 **GND** (−)' },
    ],
    wiringNotes: [
      'A bare 4-pin DHT22 needs a **10 kΩ pull-up** resistor between DATA and VCC; its third pin is not connected. Most 3-pin breakout modules already have the resistor.',
      'IO4 is an ordinary GPIO: it is not a strapping pin and is not used by the flash.',
    ],
    code: [{ file: 'climate.py', lang: 'python', trace: { read: 8 }, source: `
from machine import Pin
import dht
import time

sensor = dht.DHT22(Pin(4))     # IO4 = J3 pin 13

while True:
    sensor.measure()
    t = sensor.temperature()   # °C
    h = sensor.humidity()      # %
    print("{:.1f} °C  {:.1f} %".format(t, h))
    time.sleep(2)
` }],
    codeNotes: [
      'If `measure()` raises `OSError`, the sensor did not answer: check the wiring and the pull-up resistor.',
      'For the cheaper, blue DHT11, use `dht.DHT11(Pin(4))`. It reports whole degrees and is less accurate.',
      STOP_NOTE,
    ],
    sim: { type: 'env', sensor: 'dht', fields: ['temp', 'hum'], every: 2, tempDigits: 1 },
    run: { cmd: 'mpremote run climate.py', stop: [] },
    kit: [
      ['1', 'DHT22 / AM2302 sensor', 'A 3-pin module is easiest.'],
      ['1', '10 kΩ resistor', 'Brown-black-orange. Only for a bare 4-pin sensor.'],
      ['3', 'Female-to-male jumper wires'],
    ],
  },

  {
    id: 'web',
    title: 'Control it over Wi-Fi',
    short: 'Wi-Fi control',
    summary: 'Join your Wi-Fi network and serve a tiny web page that switches the LED from your phone.',
    focus: { pins: ['j3:2', 'j3:1'], components: ['antenna'] },
    icon: 'circuit',
    circuit: { breadboard: FRONT, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'antenna', icon: 'wifi', title: 'Wi-Fi', text: '2.4 GHz only.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Switched by a web request.' },
      { pin: 'j3:2', icon: 'pin', title: 'IO23', text: 'Same pin as lesson 4.' },
    ],
    overview: [
      'This is what the ESP32 is famous for. `network.WLAN` joins your Wi-Fi as a client, and a plain `socket` waits for browsers to connect. Each button on the page requests a path, `/led/on` or `/led/off`, and the script switches the LED to match.',
      { steps: [
        'Keep the LED from lesson 4 on **IO23**.',
        'Put your Wi-Fi name and password into `SSID` and `PASSWORD` in the script.',
        'Run `mpremote run server.py` and wait for the address to be printed.',
        'Open that address on a phone or laptop on the same Wi-Fi.',
      ] },
      { note: 'The ESP32 only supports **2.4 GHz** Wi-Fi. If it never connects, check that your network has a 2.4 GHz band.' },
      { note: 'This server has no password. Use it only on your home network and never forward it to the internet.' },
    ],
    wiring: [
      { pin: 'j3:2', to: '330 Ω resistor → LED long leg' },
      { pin: 'j3:1', to: 'LED short leg' },
    ],
    code: [{ file: 'server.py', lang: 'python', trace: { serve: 14, on: 25, off: 27 }, source: `
import network, socket, time
from machine import Pin

SSID = "your-wifi"
PASSWORD = "your-password"
PAGE = '<h1>ESP32 LED</h1><a href="/led/on">On</a> | <a href="/led/off">Off</a>'

led = Pin(23, Pin.OUT)
wlan = network.WLAN(network.WLAN.IF_STA)
wlan.active(True)
wlan.connect(SSID, PASSWORD)
while not wlan.isconnected():
    time.sleep(0.5)
print("Open http://%s/ in your browser" % wlan.ipconfig("addr4")[0])

server = socket.socket()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(socket.getaddrinfo("0.0.0.0", 80)[0][-1])
server.listen(2)
while True:
    client, addr = server.accept()
    parts = client.recv(1024).decode().split(" ")
    path = parts[1] if len(parts) > 1 else "/"
    if path == "/led/on":
        led.on()
    elif path == "/led/off":
        led.off()
    print(addr[0], "GET", path)
    client.send("HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n" + PAGE)
    client.close()
` }],
    codeNotes: [
      '`wlan.ipconfig("addr4")` returns the address and netmask; `[0]` keeps the address. Older MicroPython releases use `wlan.ifconfig()[0]` instead.',
      'Your router decides the address, so yours will differ from the one in Try it.',
      STOP_NOTE,
    ],
    sim: {
      type: 'web',
      url: 'http://192.168.1.42/',
      led: 'led1',
      label: 'LED on IO23',
      title: 'ESP32 LED',
      start: ['Open http://192.168.1.42/ in your browser'],
      request: '{client} GET {path}',
    },
    run: { cmd: 'mpremote run server.py', stop: [] },
    kit: [
      ['1', '2.4 GHz Wi-Fi network', 'With its name and password.'],
      ['1', 'Phone or laptop on the same network'],
    ],
  },

  {
    id: 'project',
    title: 'Build a Wi-Fi thermometer',
    short: 'Build a project',
    summary: 'Combine the DHT22 and the web server into a live dashboard, and make it start whenever the board gets power.',
    focus: { pins: ['j2:1', 'j3:13', 'j3:7'], components: ['module', 'antenna'] },
    icon: 'circuit',
    circuit: DHT_CIRCUIT,
    callouts: [
      { part: 'dht', icon: 'thermo', title: 'Sensor', text: 'Read each time the page asks.' },
      { component: 'antenna', icon: 'globe', title: 'Dashboard', text: 'Served over your Wi-Fi.' },
      { component: 'module', icon: 'code', title: 'main.py', text: 'Starts by itself at power-up.' },
    ],
    overview: [
      'This project joins two earlier lessons: the **DHT22** from lesson 8 and the **web server** from lesson 9. The board serves a page, and the page asks `/api/reading` for fresh numbers every 3 seconds.',
      { steps: [
        'Wire the DHT22 exactly as in lesson 8.',
        'Put your Wi-Fi details into `station.py`, and save `index.html` next to it.',
        'Test it: `mpremote cp index.html :index.html + run station.py`, then open the printed address.',
        'Make it permanent: `mpremote cp station.py :main.py`, then press **EN**. From now on it starts on any USB power supply, no computer needed.',
      ] },
      { note: 'To get back to a clean board, connect with `mpremote`, press Ctrl+C, then run `mpremote rm :main.py`.' },
      { h: 'Ideas to extend it' },
      { steps: [
        'Light the RGB LED from lesson 6 blue when it is cold and red when it is warm.',
        'Use the knob from lesson 7 to set a temperature alarm threshold.',
        'Save a reading every minute to a file on the board and draw a chart of the last hour.',
      ] },
    ],
    wiring: [
      { pin: 'j2:1', to: 'DHT22 **VCC**' },
      { pin: 'j3:13', to: 'DHT22 **DATA**' },
      { pin: 'j3:7', to: 'DHT22 **GND**' },
    ],
    code: [
      { file: 'station.py', lang: 'python', trace: { reading: 24 }, source: `
import dht, json, network, socket, time
from machine import Pin

SSID = "your-wifi"
PASSWORD = "your-password"

sensor = dht.DHT22(Pin(4))
wlan = network.WLAN(network.WLAN.IF_STA)
wlan.active(True)
wlan.connect(SSID, PASSWORD)
while not wlan.isconnected():
    time.sleep(0.5)
print("Dashboard at http://%s/" % wlan.ipconfig("addr4")[0])

server = socket.socket()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(socket.getaddrinfo("0.0.0.0", 80)[0][-1])
server.listen(2)
while True:
    client, addr = server.accept()
    parts = client.recv(1024).decode().split(" ")
    path = parts[1] if len(parts) > 1 else "/"
    if path == "/api/reading":
        sensor.measure()
        body = json.dumps({"temperature": sensor.temperature(), "humidity": sensor.humidity()})
        kind = "application/json"
    else:
        with open("index.html") as f:
            body = f.read()
        kind = "text/html"
    print(addr[0], "GET", path)
    client.send("HTTP/1.1 200 OK\\r\\nContent-Type: %s\\r\\n\\r\\n" % kind)
    client.send(body)
    client.close()
` },
      { file: 'index.html', lang: 'javascript', source: `
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ESP32 thermometer</title>
<h1>ESP32 thermometer</h1>
<p>Temperature: <b id="temperature">–</b> °C</p>
<p>Humidity: <b id="humidity">–</b> %</p>
<script>
  async function refresh() {
    const reading = await fetch("/api/reading").then((res) => res.json());
    for (const key of ["temperature", "humidity"]) {
      document.getElementById(key).textContent = reading[key];
    }
  }
  refresh();
  setInterval(refresh, 3000);
</script>
` },
    ],
    codeNotes: ['The page waits 3 seconds between requests because the DHT22 needs about 2 seconds between measurements.', STOP_NOTE],
    sim: {
      type: 'dashboard',
      url: 'http://192.168.1.42/',
      sensor: 'dht',
      title: 'ESP32 thermometer',
      fields: ['temperature', 'humidity'],
      every: 3,
      start: ['Dashboard at http://192.168.1.42/'],
      request: '{client} GET {path}',
    },
    run: { cmd: 'mpremote cp index.html :index.html + run station.py', file: 'station.py', stop: [] },
    kit: [
      ['1', 'DHT22 sensor', 'From lesson 8.'],
      ['1', 'USB power supply (5 V)', 'Any phone charger, once `main.py` is on the board.'],
    ],
  },
];
