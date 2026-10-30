// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: the MicroPython ESP8266 quick reference and the esp8266/Arduino `nodemcu` variant
// (D0–D10 to GPIO mapping, strapping pins, LED on GPIO2).
import { ledParts, ledWires, BUTTON, buttonWires, POT, potWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-esp8266-nodemcu',
  title: 'ESP8266 NodeMCU: The Original Wi-Fi Board',
  accent: '#2c7fb8',
  logicVolts: 3.3,
  pinLimitMa: 12,
  shell: 'mpremote · /dev/ttyUSB0',
  terminalHint: 'Board connected over USB. Press Run to send the script.',
};

export const PIN_TYPES = {
  power5: '5 V / input power', power3: '3.3 V power', gnd: 'Ground', gpio: 'Digital I/O', analog: 'Analog input',
  strap: 'Boot pin (careful)', flash: 'Flash memory (do not use)', uart: 'Serial', i2c: 'I²C', reset: 'Reset / enable', nc: 'Not connected',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// NodeMCU DevKit v1.0 (the 26 mm wide "Amica" layout), top view, millimetres, Micro-USB on the left.
// Pin order follows the printed pin names; outline and parts are stylised. On the wider "LoLin V3"
// boards the D-numbers are the same but one RSV pin carries USB power.
export const BOARD = {
  name: 'NodeMCU ESP8266',
  width: 49,
  depth: 26,
  thickness: 1.6,
  cornerRadius: 1,
  pcbColor: '#1c2733',
  holes: [{ x: 2, z: 2, r: 1.5 }, { x: 47, z: 2, r: 1.5 }, { x: 2, z: 24, r: 1.5 }, { x: 47, z: 24, r: 1.5 }],
  silkscreen: [{ text: 'NodeMCU', x: 22, z: 19.5, size: 1.8, weight: 700, align: 'center' }],
  components: [
    { id: 'module', kind: 'shield', label: 'ESP-12 module', desc: 'The ESP8266 chip and 4 MB of flash under a metal can: an 80 MHz 32-bit core with 2.4 GHz Wi-Fi.', shape: 'box', x: 33, z: 13, w: 15, d: 12, h: 2.4, color: '#c8cacc' },
    { id: 'antenna', label: 'PCB antenna', desc: 'The zigzag copper trace at the end of the module. Keep metal away from it.', shape: 'box', x: 44, z: 13, w: 6, d: 12, h: 0.3, color: '#16161b' },
    { id: 'usb', kind: 'usb', label: 'Micro-USB port', desc: 'Power and the serial connection to your computer. Use a data cable, not a charge-only one.', shape: 'box', x: 1.8, z: 13, w: 7.4, d: 7.6, h: 2.8, color: '#c3c8d0', metal: true },
    { id: 'bridge', kind: 'chip', label: 'USB-to-UART bridge', desc: 'CP2102 on many boards, CH340 on others. It may need a driver.', shape: 'box', x: 13, z: 13, w: 5, d: 5, h: 0.9, color: '#2a2930' },
    { id: 'ldo', kind: 'chip', label: '3.3 V regulator', desc: 'Turns the 5 V from USB into the 3.3 V the ESP8266 runs on.', shape: 'box', x: 21, z: 8, w: 4.4, d: 3, h: 1, color: '#2a2930' },
    { id: 'flashbtn', kind: 'button', label: 'FLASH button', desc: 'Wired to GPIO0. Holding it during reset enters firmware download mode. In your own code it reads LOW while pressed.', shape: 'box', x: 7, z: 21, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'rstbtn', kind: 'button', label: 'RST button', desc: 'Restarts the chip and your program.', shape: 'box', x: 7, z: 5, w: 4.2, d: 3.2, h: 1.6, color: '#d9d9d9', metal: true },
    { id: 'ledmod', kind: 'ledsmd', accent: '#4aa3ff', label: 'Blue LED (GPIO2)', desc: 'On the module, wired to D4 (GPIO2). It is active-low: writing 0 turns it on.', shape: 'box', x: 27, z: 8, w: 1.2, d: 0.8, h: 0.5, color: '#f1ece2' },
  ],
  headers: [
    { id: 'left', label: 'Analog-side header', short: 'A', desc: 'A0, the pins used by the flash memory, and power. Do not use SD and CLK pins for your own circuits.', z: 1.57,
      pins: pinTable('A0|ADC0|analog; RSV||nc; RSV||nc; SD3|GPIO10|flash; SD2|GPIO9|flash; SD1|flash data|flash; CMD|flash|flash; SD0|flash data|flash; CLK|flash clock|flash; GND||gnd; 3V3||power3; EN|enable|reset; RST|reset|reset; GND||gnd; VIN|5 V in|power5'), x: 42.78, step: [-2.54, 0] },
    { id: 'right', label: 'Digital-side header', short: 'D', desc: 'D0–D8 and the serial pins. The printed D-numbers are not GPIO numbers, and MicroPython uses the GPIO number.', z: 24.43,
      pins: pinTable('D0|GPIO16, wake|gpio; D1|GPIO5, SCL|i2c; D2|GPIO4, SDA|i2c; D3|GPIO0, FLASH button|strap; D4|GPIO2, blue LED|strap; 3V3||power3; GND||gnd; D5|GPIO14|gpio; D6|GPIO12|gpio; D7|GPIO13|gpio; D8|GPIO15, must be LOW at boot|strap; RX|GPIO3|uart; TX|GPIO1|uart; GND||gnd; 3V3||power3'), x: 42.78, step: [-2.54, 0] },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of the digital-side header.
const BB = { x: -20, z: 34 };
const GND = 'right:7';
const LED_WIRING = [{ pin: 'right:8', to: '330 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }];
const WEB_CODE = `
import network, socket
from machine import Pin
import secrets

led = Pin(14, Pin.OUT)            # D5
PAGE = b'<h1>ESP8266 LED</h1><a href="/on">ON</a> <a href="/off">OFF</a>'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(secrets.SSID, secrets.PASSWORD)
while not wlan.isconnected():
    pass
print('Open http://%s/' % wlan.ifconfig()[0])

server = socket.socket()
server.bind(('0.0.0.0', 80))
server.listen(1)
while True:
    client, addr = server.accept()
    request = client.recv(512)
    if b'GET /on' in request:
        led.on()
    elif b'GET /off' in request:
        led.off()
    client.send(b'HTTP/1.0 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n' + PAGE)
    client.close()
`;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the NodeMCU',
    short: 'Meet the board',
    summary: 'The cheap Wi-Fi board that started the maker IoT boom, and the one catch in its pin names.',
    icon: 'board',
    focus: { components: ['module'] },
    callouts: [
      { component: 'module', icon: 'wifi', title: 'ESP-12 module', text: 'ESP8266 with 4 MB of flash.' },
      { pin: 'right:2', icon: 'pin', title: 'D1 is GPIO5', text: 'Printed names are not GPIO numbers.' },
      { pin: 'left:1', icon: 'knob', title: 'A0', text: 'The only analog input.' },
      { component: 'flashbtn', icon: 'button', title: 'FLASH', text: 'Wired to GPIO0.' },
      { component: 'usb', icon: 'usb', title: 'Micro-USB', text: 'Power and serial.' },
    ],
    overview: [
      'The **ESP8266** put Wi-Fi on a chip for a couple of dollars and made home-built connected gadgets ordinary. **NodeMCU** boards add USB and pin headers. Newer ESP32 chips do more, but millions of these boards are in drawers and they still run projects well.',
      { note: 'The printed **D-numbers are not GPIO numbers**. D1 is GPIO5, D4 is GPIO2 and D5 is GPIO14. MicroPython uses the GPIO number, so `Pin(14)` is the pin marked **D5**.' },
      { tips: [['target', 'Click a pin to see its GPIO number'], ['wifi', '2.4 GHz Wi-Fi only'], ['info', 'One core, no Bluetooth']] },
      { note: 'All pins are **3.3 V**. D3, D4 and D8 set the boot mode: anything that pulls them the wrong way at power-on stops the board from starting.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Chip', 'ESP8266, 80 MHz 32-bit core'], ['Flash', '4 MB on most boards'], ['Wireless', '2.4 GHz Wi-Fi'], ['Logic', '3.3 V'], ['Analog', 'One 10-bit input'], ['USB', 'Micro-USB through a serial bridge']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'NodeMCU ESP8266 board'], ['1', 'Micro-USB data cable'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit']],
  },

  {
    id: 'setup',
    title: 'Flash MicroPython',
    summary: 'Write the ESP8266 MicroPython firmware with esptool, then open the prompt with `mpremote`.',
    icon: 'board',
    focus: { components: ['usb', 'bridge', 'flashbtn'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB', text: 'Use a cable that carries data.' },
      { component: 'bridge', icon: 'chip', title: 'Bridge chip', text: 'May need a CP210x or CH340 driver.' },
      { component: 'flashbtn', icon: 'button', title: 'FLASH', text: 'Most boards do not need it.' },
    ],
    overview: [
      { steps: [
        'Install the tools: `uv tool install esptool` and `uv tool install mpremote`.',
        'Download the **ESP8266_GENERIC** firmware (.bin) from micropython.org.',
        'Erase the flash, then write the firmware at address **0**.',
        'Open the REPL with `mpremote` and type `print("hello")`.',
      ] },
      { note: 'If esptool cannot connect, hold **FLASH**, tap **RST**, release **FLASH** and try again.' },
      { tips: [['usb', 'Use a cable that carries data'], ['terminal', 'Click the commands in Try it'], ['info', 'The firmware file name includes a date and version']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'esptool.py --baud 460800 erase_flash', note: 'erase the chip', out: ['Chip is ESP8266EX', 'Erasing flash (this may take a while)...', 'Chip erase completed successfully'] },
        { cmd: 'esptool.py --baud 460800 write_flash --flash_size=detect 0 ESP8266_GENERIC.bin', note: 'write MicroPython', out: ['Hash of data verified.', 'Hard resetting via RTS pin...'] },
        { cmd: 'mpremote exec "import sys; print(sys.platform)"', note: 'check it runs', out: ['esp8266'] },
      ],
    },
    kit: [['1', 'Computer with Python 3']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'An LED on D5, which MicroPython calls GPIO14.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['right:8', GND] },
    circuit: { breadboard: BB, parts: ledParts(330), wires: ledWires('right:8', GND) },
    callouts: [
      { pin: 'right:8', icon: 'pin', title: 'D5 · GPIO14', text: 'Your code switches it.' },
      { pin: GND, icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while the pin is HIGH.' },
    ],
    overview: [
      'D5 is a safe pin: unlike D3, D4 and D8 it has no job at boot. The ESP8266’s pins are weak, so a larger resistor keeps the current well under the limit.',
      { tips: [['led', 'The blue module LED is `Pin(2)`, and 0 turns it on'], ['resistor', 'Try other resistors'], ['code', 'Stop the script with Ctrl+C']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.py', lang: 'python', trace: { on: 7, off: 9 }, source: `
from machine import Pin
import time

led = Pin(14, Pin.OUT)            # D5

while True:
    led.on()
    time.sleep(1)
    led.off()
    time.sleep(1)
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on D5', delay: 1, volts: 3.3 },
    run: { cmd: 'mpremote run blink.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'LED'], ['1', '330 Ω resistor', 'Orange-orange-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button on D6 with the internal pull-up switches the LED.',
    icon: { type: 'button' },
    focus: { pins: ['right:9', 'right:8', GND] },
    circuit: { breadboard: BB, parts: [...ledParts(330), BUTTON], wires: [...ledWires('right:8', GND), ...buttonWires('right:9')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'right:9', icon: 'pin', title: 'D6 · GPIO12', text: 'LOW while pressed.' },
    ],
    overview: [
      '`Pin.PULL_UP` turns on a resistor inside the chip that holds the pin HIGH. The button pulls it to ground, so it reads **0 while pressed**.',
      { tips: [['button', 'Hold the button in the 3D view'], ['led', 'The LED from the last lesson stays'], ['info', 'GPIO16 (D0) has no pull-up, so avoid it here']] },
    ],
    wiring: [...LED_WIRING, { pin: 'right:9', to: 'Column 20, one side of the button' }],
    code: [{ file: 'button.py', lang: 'python', trace: { wait: 9, pressed: 12, released: 15 }, source: `
from machine import Pin
import time

led = Pin(14, Pin.OUT)                     # D5
button = Pin(12, Pin.IN, Pin.PULL_UP)      # D6
was = 1

while True:
    now = button.value()
    if now == 0 and was == 1:
        led.on()
        print('Pressed!')
    elif now == 1 and was == 0:
        led.off()
        print('Released')
    was = now
    time.sleep_ms(20)
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on D5' },
    run: { cmd: 'mpremote run button.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'knob',
    title: 'Read a knob on A0',
    short: 'Read a knob',
    summary: 'The board’s single analog input gives readings from 0 to 1024.',
    icon: { type: 'pot' },
    focus: { pins: ['left:1', 'right:6', 'right:7'] },
    circuit: { breadboard: BB, parts: [POT], wires: potWires('left:1', 'right:6', 'right:7') },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'left:1', icon: 'wave', title: 'A0', text: 'NodeMCU divides 3.3 V down to 1 V.' },
      { pin: 'right:6', icon: 'power', title: '3V3', text: 'Feeds the + rail.' },
    ],
    overview: [
      'The ESP8266 chip itself measures only **0 to 1 V**. NodeMCU boards add a resistor divider in front of A0, so the pin accepts 0 to about 3.3 V. On a bare ESP-12 module that is not true, and you must divide the voltage yourself.',
      { tips: [['knob', 'Click the knob in the 3D view'], ['wave', 'Readings run from 0 to 1024'], ['info', 'Heavy Wi-Fi use makes readings noisier']] },
    ],
    wiring: [{ pin: 'right:6', to: '+ rail → potentiometer outer leg' }, { pin: 'left:1', to: 'Potentiometer **middle leg**' }, { pin: 'right:7', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'knob.py', lang: 'python', trace: { read: 7 }, source: `
from machine import ADC
import time

adc = ADC(0)

while True:
    raw = adc.read()
    print('raw:', raw, ' voltage:', int(raw * 3300 / 1024), 'mV')
    time.sleep(0.5)
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'A0 voltage', vmax: 3.3, max: 1024, every: 0.5 },
    run: { cmd: 'mpremote run knob.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },

  {
    id: 'web',
    title: 'A Wi-Fi light switch',
    short: 'Wi-Fi switch',
    summary: 'The board joins your Wi-Fi and serves a web page that switches the LED from your phone.',
    icon: { glyph: 'wifi' },
    focus: { pins: ['right:8', GND], components: ['module'] },
    circuit: { breadboard: BB, parts: ledParts(330), wires: ledWires('right:8', GND) },
    callouts: [
      { component: 'module', icon: 'wifi', title: 'Wi-Fi', text: 'Joins your 2.4 GHz network.' },
      { pin: 'right:8', icon: 'pin', title: 'D5', text: 'Still drives the LED.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Switched from your phone.' },
    ],
    overview: [
      'Put your Wi-Fi name and password in a separate `secrets.py` on the board, so they stay out of the main script. The program waits for a browser, looks for `/on` or `/off` in the request and sends the same small page back.',
      { tips: [['wifi', 'Phone and board must be on the same network'], ['globe', 'The address is printed when it connects'], ['code', 'Upload `secrets.py` once with `mpremote cp`']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'server.py', lang: 'python', trace: { serve: 19, on: 22, off: 24 }, source: WEB_CODE }, { file: 'secrets.py', lang: 'python', source: `
SSID = 'your-network'
PASSWORD = 'your-password'
` }],
    sim: { type: 'web', url: 'http://192.168.1.52/', led: 'led1', label: 'LED on D5', title: 'ESP8266 LED', start: ['Open http://192.168.1.52/'], request: '{client} GET {path}' },
    run: { cmd: 'mpremote run server.py', file: 'server.py', stop: [] },
    kit: [['1', '2.4 GHz Wi-Fi network'], ['1', 'Phone or laptop on the same network']],
  },
];
