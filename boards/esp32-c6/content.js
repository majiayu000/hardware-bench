// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: Espressif ESP32-C6-DevKitC-1 user guide (J1/J3 header tables, RGB LED on GPIO8,
// strapping pins), the ESP32-C6 datasheet and the MicroPython ESP32 port documentation.

export const SITE = {
  id: 'learn-esp32-c6',
  title: 'ESP32-C6: Wi-Fi 6 in MicroPython',
  accent: '#5b4bd6',
  logicVolts: 3.3,
  shell: 'Serial · MicroPython REPL · 115200 baud',
  terminalHint: 'Board connected over USB. Press Run to send the script with mpremote.',
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'GPIO (in/out)', analog: 'GPIO with ADC', strap: 'Strapping pin',
  uart: 'UART0 (serial)', usb: 'USB D+ / D−', reset: 'Reset (RST)', nc: 'Not connected',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// ESP32-C6-DevKitC-1 (ESP32-C6-WROOM-1-N8), top view, millimetres, USB ports on the left and the
// module antenna on the right. Pin numbers, names and functions follow the J1 and J3 tables in
// Espressif's user guide; pin 1 of both rows is at the antenna end. The outline, the 25.4 mm row
// spacing and the small parts are stylised (laid out like the ESP32-DevKitC), not for mechanical design.
export const BOARD = {
  name: 'ESP32-C6-DevKitC-1',
  width: 52,
  depth: 27.94,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1d1d24',
  holes: [],
  silkscreen: [{ text: 'ESP32-C6-DevKitC-1', x: 18, z: 21.5, size: 1.5, align: 'center' }],
  components: [
    { id: 'module', kind: 'shield', label: 'ESP32-C6-WROOM-1 module', desc: 'The ESP32-C6 chip and 8 MB of flash under a metal can: a 160 MHz RISC-V core, Wi-Fi 6, Bluetooth LE and an 802.15.4 radio for Thread and Zigbee.', shape: 'box', x: 39, z: 13.97, w: 16, d: 18, h: 3.1, color: '#c8cacc', metal: true, text: 'ESP32-C6' },
    { id: 'antenna', label: 'PCB antenna', desc: 'The zigzag copper trace beyond the can. Keep metal and fingers away from it for the best range.', shape: 'box', x: 49.5, z: 13.97, w: 5, d: 18, h: 0.3, color: '#16161b' },
    { id: 'usb', kind: 'usbc', label: 'USB-C port (native USB)', desc: 'Connects straight to the chip’s own USB (GPIO12/13): power, flashing, serial and JTAG debugging.', shape: 'box', x: 2.4, z: 8, w: 7.4, d: 9, h: 3.2, color: '#c3c6ca', metal: true },
    { id: 'uart', kind: 'usbc', label: 'USB-C port (UART)', desc: 'Goes through a USB-to-UART bridge chip to the chip’s serial port. Either USB port can power and program the board.', shape: 'box', x: 2.4, z: 20, w: 7.4, d: 9, h: 3.2, color: '#c3c6ca', metal: true },
    { id: 'bridge', kind: 'chip', label: 'USB-to-UART bridge', desc: 'Turns USB into the serial signals of UART0 for the second USB port.', shape: 'box', x: 12, z: 20, w: 4, d: 4, h: 0.9, color: '#2a2930' },
    { id: 'rgb', kind: 'ledsmd', accent: '#7a6bff', label: 'RGB LED (GPIO8)', desc: 'An addressable WS2812-style LED on GPIO8. Drive it with MicroPython’s `neopixel` module.', shape: 'box', x: 26, z: 8, w: 2, d: 2, h: 0.8, color: '#f1ece2' },
    { id: 'boot', kind: 'button', label: 'Boot button', desc: 'Hold Boot and tap Reset to enter firmware download mode. It is wired to GPIO9.', shape: 'box', x: 12, z: 6, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'reset', kind: 'button', label: 'Reset button', desc: 'Restarts the chip and your program.', shape: 'box', x: 19, z: 6, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'ldo', kind: 'chip', label: '3.3 V regulator', desc: 'Turns the 5 V from USB into the 3.3 V the chip runs on.', shape: 'box', x: 20, z: 14, w: 4, d: 3, h: 1, color: '#2a2930' },
  ],
  headers: [
    { id: 'j1', label: 'J1 header (3V3 … NC)', short: 'J1', desc: 'The 16-pin row along the top edge. Pin 1 (3V3) is at the antenna end. GPIO0–6 here can read analog voltages.',
      pins: pinTable('3V3|3.3 V power|power3; RST|Reset|reset; 4|GPIO4, ADC1_CH4, MTMS|strap; 5|GPIO5, ADC1_CH5, MTDI|strap; 6|GPIO6, ADC1_CH6|analog; 7|GPIO7|gpio; 0|GPIO0, ADC1_CH0|analog; 1|GPIO1, ADC1_CH1|analog; 8|GPIO8, RGB LED|strap; 10|GPIO10|gpio; 11|GPIO11|gpio; 2|GPIO2, ADC1_CH2|analog; 3|GPIO3, ADC1_CH3|analog; 5V|5 V power|power5; G|Ground|gnd; NC|not connected|nc'),
      z: 1.27 },
    { id: 'j3', label: 'J3 header (G … NC)', short: 'J3', desc: 'The 16-pin row along the bottom edge. Pin 1 (G) is at the antenna end. Avoid TX/RX and the USB pins 12 and 13.',
      pins: pinTable('G|Ground|gnd; TX|GPIO16, U0TXD|uart; RX|GPIO17, U0RXD|uart; 15|GPIO15|strap; 23|GPIO23|gpio; 22|GPIO22|gpio; 21|GPIO21|gpio; 20|GPIO20|gpio; 19|GPIO19|gpio; 18|GPIO18|gpio; 9|GPIO9, Boot|strap; G|Ground|gnd; 13|GPIO13, USB D+|usb; 12|GPIO12, USB D−|usb; G|Ground|gnd; NC|not connected|nc'),
      z: 26.67 },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, x: 46.99, step: [-2.54, 0], ...h })),
};

// ---------- shared circuit pieces ----------
// Breadboards are aligned so header pin n sits in column 26 − n: in front of J3, or behind J1.
const FRONT = { x: -19.97, z: 36 };
const BACK = { x: -19.97, z: -62 };
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c21', b: 'c17', ohms: 330, label: '330 Ω resistor', desc: 'Limits the current through the LED. Try other values.', controls: { ohms: [220, 330, 1000, 10000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e17', cathode: 'e16', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to GND.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'j3:5', to: 'bb:a21', color: '#f0a33a' }, { from: 'bb:a16', to: 'j3:1', color: '#2b2a30' }];
const LED_WIRING = [{ pin: 'j3:5', to: '330 Ω resistor → LED **long leg**' }, { pin: 'j3:1', to: 'LED **short leg**' }];
const STOP_NOTE = 'Press **Ctrl+C** to stop a script started with `mpremote run`. The pins keep their last state until you press **Reset**.';

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the ESP32-C6',
    short: 'Meet the board',
    summary: 'A RISC-V microcontroller with Wi-Fi 6, Bluetooth LE and a Thread/Zigbee radio, on a breadboard-friendly board.',
    icon: 'board',
    focus: { components: ['module'] },
    callouts: [
      { component: 'module', icon: 'chip', title: 'ESP32-C6 module', text: 'RISC-V core, three radios.' },
      { component: 'rgb', icon: 'led', title: 'RGB LED', text: 'Addressable, on GPIO8.' },
      { component: 'usb', icon: 'usb', title: 'Two USB-C ports', text: 'Native USB and UART: either works.' },
      { pin: 'j1:1', icon: 'pin', title: 'J1', text: 'Pin 1 (3V3) at the antenna end.' },
      { pin: 'j3:1', icon: 'pin', title: 'J3', text: 'Pin 1 (GND) at the antenna end.' },
    ],
    overview: [
      'The **ESP32-C6** is Espressif’s first chip with **Wi-Fi 6** (802.11ax on 2.4 GHz). Next to Wi-Fi and **Bluetooth LE** it has an **802.15.4** radio, the one used by **Thread** and **Zigbee**, which makes it a natural fit for Matter smart-home devices.',
      'Inside is a **RISC-V** core at 160 MHz, plus a small low-power core that can watch sensors while the main core sleeps. You will program it in **MicroPython**, as in the ESP32 course.',
      { note: 'Every pin is **3.3 V**. Never connect 5 V to a GPIO pin.', tone: 'warn' },
      { h: 'Pins to leave alone' },
      { steps: ['**12** and **13** are the USB data lines.', '**TX** and **RX** are the serial port behind the UART USB-C port.', '**4, 5, 8, 9, 15** are **strapping pins** read at reset; 8 also drives the RGB LED and 9 the Boot button.'] },
      { h: 'Specifications' },
      { specs: [['Module', 'ESP32-C6-WROOM-1 (8 MB flash)'], ['CPU', 'RISC-V, 160 MHz, plus a 20 MHz low-power core'], ['Memory', '512 KB SRAM'], ['Wireless', 'Wi-Fi 6 (2.4 GHz), Bluetooth 5 LE, 802.15.4 (Thread, Zigbee)'], ['Analog', '12-bit ADC on GPIO0–6'], ['USB', 'Native USB-C plus a USB-to-UART USB-C']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'ESP32-C6-DevKitC-1'], ['1', 'USB-C data cable'], ['1', 'Breadboard and jumper wires', 'Needed from lesson 3.']],
  },

  {
    id: 'setup',
    title: 'Flash MicroPython',
    summary: 'Erase the chip, write the ESP32-C6 MicroPython firmware and say hello at the `>>>` prompt.',
    icon: 'board',
    focus: { components: ['usb', 'boot', 'reset'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Either port works for flashing.' },
      { component: 'boot', icon: 'button', title: 'Boot', text: 'Only if flashing will not start.' },
    ],
    overview: [
      { steps: [
        'Install the tools: `pip install esptool mpremote`.',
        'Download the **ESP32_GENERIC_C6** firmware (.bin) from micropython.org.',
        'Erase the flash, then write the firmware at address **0**.',
        'Open the REPL with `mpremote` and type `print("hello")`.',
      ] },
      { note: 'If esptool cannot connect, hold **Boot**, tap **Reset**, release **Boot** and try again.' },
      { tips: [['usb', 'Use a cable that carries data'], ['terminal', 'Click the commands in Try it'], ['info', 'The firmware file name includes a date and version']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'esptool.py --chip esp32c6 erase_flash', note: 'erase the chip', out: ['Chip is ESP32-C6 (QFN40)', 'Erasing flash (this may take a while)...', 'Chip erase completed successfully'] },
        { cmd: 'esptool.py --chip esp32c6 write_flash 0 ESP32_GENERIC_C6.bin', note: 'write MicroPython', out: ['Writing at 0x00001000... (100 %)', 'Hash of data verified.', 'Hard resetting via RTS pin...'] },
        { cmd: 'mpremote exec "import sys; print(sys.platform)"', note: 'check it runs', out: ['esp32'] },
      ],
    },
    kit: [['1', 'Computer with Python 3']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'Wire an LED to GPIO23 and switch it on and off with `machine.Pin`.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['j3:5', 'j3:1'] },
    circuit: { breadboard: FRONT, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'j3:5', icon: 'pin', title: 'GPIO23 · J3 pin 5', text: 'Your code switches it.' },
      { pin: 'j3:1', icon: 'ground', title: 'G · J3 pin 1', text: 'Current returns here.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click it to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while the pin is HIGH.' },
    ],
    overview: [
      'A pin set as an **output** is HIGH (3.3 V) or LOW (0 V). With an LED and a resistor between the pin and ground, HIGH lights the LED.',
      'The pins are labelled by **GPIO number**, so `Pin(23)` is the pin printed **23**, the fifth on J3.',
      { tips: [['led', 'The on-board RGB LED works too: `neopixel.NeoPixel(Pin(8), 1)`'], ['resistor', '220–470 Ω is right for 3.3 V'], ['code', '`led.toggle()` flips the pin']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.py', lang: 'python', trace: { on: 7, off: 10 }, source: `
from machine import Pin
import time

led = Pin(23, Pin.OUT)

while True:
    led.on()
    print("LED on")
    time.sleep(1)
    led.off()
    print("LED off")
    time.sleep(1)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on GPIO23', delay: 1, volts: 3.3 },
    run: { cmd: 'mpremote run blink.py', stop: [] },
    kit: [['1', 'LED'], ['1', '330 Ω resistor', 'Orange-orange-brown.'], ['2', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button on GPIO19 with the internal pull-up resistor lights the LED while it is held.',
    icon: { type: 'button' },
    focus: { pins: ['j3:9', 'j3:12', 'j3:5', 'j3:1'] },
    circuit: {
      breadboard: FRONT,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e8', 'e10', 'f8', 'f10'], label: 'Push button', desc: 'Hold it down in the 3D view: it joins column 8 to column 10.' }],
      wires: [...LED_WIRES, { from: 'j3:9', to: 'bb:a10', color: '#3b78d6' }, { from: 'bb:a8', to: 'j3:12', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'j3:9', icon: 'pin', title: 'GPIO19 · input', text: 'LOW while pressed.' },
      { pin: 'j3:12', icon: 'ground', title: 'G · J3 pin 12', text: 'The button pulls the pin here.' },
    ],
    overview: [
      'As an **input** with `Pin.PULL_UP`, the pin rests at 3.3 V (reads 1). Pressing the button connects it to ground, so it reads **0 while pressed**.',
      { tips: [['button', 'Hold the button in the 3D view or in Try it'], ['code', '`not button.value()` is True while pressed'], ['clock', 'Polling every 20 ms feels instant']] },
    ],
    wiring: [...LED_WIRING, { pin: 'j3:9', to: 'Column 10, one side of the button' }, { pin: 'j3:12', to: 'Column 8, the other side' }],
    code: [{ file: 'button.py', lang: 'python', trace: { wait: 9, pressed: 11, released: 14 }, source: `
from machine import Pin
import time

led = Pin(23, Pin.OUT)
button = Pin(19, Pin.IN, Pin.PULL_UP)
was = 1

while True:
    now = button.value()
    if now == 0 and was == 1:
        led.on()
        print("Pressed!")
    elif now == 1 and was == 0:
        led.off()
        print("Released")
    was = now
    time.sleep(0.02)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on GPIO23' },
    run: { cmd: 'mpremote run button.py', stop: [] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'knob',
    title: 'Read a knob',
    summary: 'A potentiometer on GPIO2 and the 12-bit ADC turn a position into a number.',
    icon: { type: 'pot' },
    focus: { pins: ['j1:1', 'j1:12', 'j1:15'] },
    circuit: {
      breadboard: BACK,
      parts: [{ id: 'pot1', type: 'pot', legs: ['f13', 'f14', 'f15'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on 3V3 and G; the middle leg outputs the voltage in between.', controls: { value: [0, 1] } }],
      wires: [{ from: 'j1:1', to: 'bb:j13', color: '#e2483c' }, { from: 'j1:12', to: 'bb:j14', color: '#f2c12e' }, { from: 'bb:j15', to: 'j1:15', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'j1:12', icon: 'wave', title: 'GPIO2 · ADC1_CH2', text: 'Measures the wiper.' },
      { pin: 'j1:1', icon: 'power', title: '3V3', text: 'Never 5 V on an ADC pin.' },
    ],
    overview: [
      'The potentiometer’s middle leg gives any voltage between 0 and 3.3 V. On the ESP32-C6 only **GPIO0–6** have an ADC; this lesson uses **GPIO2**.',
      '`read_u16()` scales every reading to 0–65535 whatever the chip’s resolution, and `read_uv()` gives calibrated microvolts.',
      { tips: [['knob', 'Click the knob in the 3D view'], ['wave', '`atten=ADC.ATTN_11DB` measures up to about 3.3 V'], ['power', 'Use 3V3, not 5V']] },
    ],
    wiring: [{ pin: 'j1:1', to: 'Potentiometer **outer leg**' }, { pin: 'j1:12', to: 'Potentiometer **middle leg**' }, { pin: 'j1:15', to: 'Potentiometer **other outer leg**' }],
    code: [{ file: 'knob.py', lang: 'python', trace: { read: 7 }, source: `
from machine import ADC, Pin
import time

pot = ADC(Pin(2), atten=ADC.ATTN_11DB)

while True:
    raw = pot.read_u16()
    mv = pot.read_uv() // 1000
    print("raw:", raw, " voltage:", mv, "mV")
    time.sleep(0.5)
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'knob', pot: 'pot1', label: 'GPIO2 voltage', vmax: 3.3, every: 0.5 },
    run: { cmd: 'mpremote run knob.py', stop: [] },
    kit: [['1', '10 kΩ potentiometer'], ['3', 'Jumper wires']],
  },

  {
    id: 'web',
    title: 'Control it over Wi-Fi',
    short: 'Wi-Fi control',
    summary: 'Join your Wi-Fi and serve a page that switches the LED from your phone.',
    icon: 'circuit',
    focus: { pins: ['j3:5', 'j3:1'], components: ['antenna'] },
    circuit: { breadboard: FRONT, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'antenna', icon: 'wifi', title: 'Wi-Fi 6', text: '2.4 GHz only.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Switched by a web request.' },
    ],
    overview: [
      '`network.WLAN` joins your network and a plain `socket` answers browsers. Each link on the page requests a path, `/led/on` or `/led/off`, and the script switches the LED to match.',
      'Wi-Fi 6 helps most on a busy network: the router can schedule many small devices more efficiently. MicroPython’s networking code is the same as on any ESP32.',
      { note: 'The ESP32-C6 uses **2.4 GHz** Wi-Fi only. This page has no password: keep it on your home network.' },
      { h: 'Thread and Zigbee' },
      'The 802.15.4 radio is not exposed in MicroPython. To build Thread, Zigbee or Matter devices, use Espressif’s ESP-IDF, or ESPHome, which supports the ESP32-C6.',
    ],
    wiring: LED_WIRING,
    code: [{ file: 'server.py', lang: 'python', trace: { serve: 13, on: 23, off: 25 }, source: `
import network, socket, time
from machine import Pin

SSID = "your-wifi"
PASSWORD = "your-password"
PAGE = '<h1>ESP32-C6 LED</h1><a href="/led/on">On</a> | <a href="/led/off">Off</a>'

led = Pin(23, Pin.OUT)
wlan = network.WLAN(network.WLAN.IF_STA)
wlan.active(True)
wlan.connect(SSID, PASSWORD)
while not wlan.isconnected(): time.sleep(0.5)
print("Open http://%s/ in your browser" % wlan.ipconfig("addr4")[0])

server = socket.socket()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(socket.getaddrinfo("0.0.0.0", 80)[0][-1])
server.listen(2)
while True:
    client, addr = server.accept()
    path = (client.recv(1024).decode().split(" ") + ["/", "/"])[1]
    if path == "/led/on":
        led.on()
    elif path == "/led/off":
        led.off()
    print(addr[0], "GET", path)
    client.send("HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n" + PAGE)
    client.close()
` }],
    codeNotes: [STOP_NOTE],
    sim: { type: 'web', url: 'http://192.168.1.48/', led: 'led1', label: 'LED on GPIO23', title: 'ESP32-C6 LED', start: ['Open http://192.168.1.48/ in your browser'], request: '{client} GET {path}' },
    run: { cmd: 'mpremote run server.py', stop: [] },
    kit: [['1', '2.4 GHz Wi-Fi network'], ['1', 'Phone or laptop on the same network']],
  },
];
