// Everything specific to this board lives in this file: site metadata, the 3D board model and the
// lessons. The 40-pin header map is shared with the Raspberry Pi course.
// Sources: Raspberry Pi Zero 2 W product brief and mechanical drawing, Raspberry Pi documentation
// (Imager, GPIO header) and the gpiozero documentation.
import { PIN_TYPES as PI_PIN_TYPES, PI_PINS } from '../raspberry-pi/content.js';

export const SITE = {
  id: 'learn-pi-zero-2w',
  title: 'Raspberry Pi Zero 2 W: A Tiny Linux Computer',
  accent: '#b0124a',
  logicVolts: 3.3,
  shell: 'pi@zero: ~',
  terminalHint: 'Connected over SSH. Press Run to start the script.',
};

export const PIN_TYPES = PI_PIN_TYPES;

// Raspberry Pi Zero 2 W, top view, millimetres: 65 × 30 mm with the 40-pin header along the top
// edge (same footprint as on full-size Pis) and the ports along the bottom edge. Outline, holes and
// header from the mechanical drawing; the parts are placed from photos and are stylised.
export const BOARD = {
  name: 'Raspberry Pi Zero 2 W',
  width: 65,
  depth: 30,
  thickness: 1.4,
  cornerRadius: 3,
  pcbColor: '#2a7d55',
  holes: [{ x: 3.5, z: 3.5, r: 1.375 }, { x: 61.5, z: 3.5, r: 1.375 }, { x: 3.5, z: 26.5, r: 1.375 }, { x: 61.5, z: 26.5, r: 1.375 }],
  silkscreen: [{ text: 'Raspberry Pi Zero 2 W', x: 46, z: 14, size: 1.8, align: 'center' }],
  components: [
    { id: 'soc', kind: 'chip', label: 'RP3A0 system-in-package', desc: 'A quad-core 64-bit Arm Cortex-A53 at 1 GHz with 512 MB of memory stacked in the same package. This is the whole computer.', shape: 'box', x: 30, z: 16, w: 12, d: 12, h: 1.3, color: '#c9ced6', text: 'RP3A0', textColor: 'rgba(30,30,30,0.7)' },
    { id: 'wifi', kind: 'shield', label: 'Wi-Fi and Bluetooth', desc: '2.4 GHz 802.11 b/g/n Wi-Fi and Bluetooth 4.2 under a metal can, with the antenna printed on the board beside it.', shape: 'box', x: 13, z: 14, w: 8, d: 8, h: 1.3, color: '#c7c9cc', metal: true },
    { id: 'hdmi', kind: 'hdmi', label: 'Mini HDMI', desc: 'Display output. Needs a mini-HDMI to HDMI cable or adapter.', shape: 'box', x: 12.4, z: 27.5, w: 11.2, d: 7.5, h: 3.2, color: '#bfc5ce' },
    { id: 'otg', kind: 'usb', label: 'Micro USB (data)', desc: 'USB On-The-Go: plug a keyboard or USB hub in here through an OTG adapter.', shape: 'box', x: 41.4, z: 28, w: 8, d: 5.6, h: 2.8, color: '#bfc5ce' },
    { id: 'pwr', kind: 'usb', label: 'Micro USB (power)', desc: 'Power goes in here: 5 V, 2.5 A is recommended.', shape: 'box', x: 54, z: 28, w: 8, d: 5.6, h: 2.8, color: '#bfc5ce' },
    { id: 'csi', kind: 'fpc', label: 'Camera connector (CSI-2)', desc: 'Takes a camera with the narrow 22-pin "Zero" ribbon cable.', shape: 'box', x: 63.4, z: 15, w: 3, d: 17, h: 1.4, color: '#e9e3d3' },
    { id: 'act', kind: 'ledsmd', accent: '#3fe06b', lit: true, label: 'ACT LED', desc: 'Green activity LED: flickers while the microSD card is read.', shape: 'box', x: 58.5, z: 24, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'sd', label: 'microSD card slot', desc: 'On the left end, underneath. The operating system lives on the card.', shape: 'box', x: 6, z: 15, w: 12, d: 12, h: 1.4, color: '#c3c6ca', under: true },
  ],
  headers: [{
    id: 'gpio', label: '40-pin GPIO header', short: 'GPIO',
    desc: 'The same 40 pins as on every modern Raspberry Pi, but without a header fitted: solder one on, or buy the Zero 2 WH. Signals are 3.3 V.',
    layout: 'dual', style: 'male', pitch: 2.54, x: 8.37, z: 4.77, step: [2.54, 0], rowStep: [0, -2.54], pins: PI_PINS,
  }],
};

// ---------- shared circuit pieces ----------
// The breadboard sits to the left of the board; its column 30 end is closest to the GPIO header.
const BB = { x: -94, z: -8 };
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c24', b: 'c28', ohms: 330, label: '330 Ω resistor', desc: 'Limits the current through the LED. Try other values.', controls: { ohms: [220, 330, 1000, 10000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e28', cathode: 'e29', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to GND.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'gpio:11', to: 'bb:a24', color: '#f0a33a' }, { from: 'bb:a29', to: 'gpio:9', color: '#2b2a30' }];
const LED_WIRING = [{ pin: 'gpio:11', to: '330 Ω resistor → LED **long leg**' }, { pin: 'gpio:9', to: 'LED **short leg**' }];

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Zero 2 W',
    short: 'Meet the board',
    summary: 'A whole Linux computer the size of a stick of gum, with Wi-Fi and the standard 40 GPIO pins.',
    icon: 'board',
    focus: { components: ['soc'] },
    callouts: [
      { component: 'soc', icon: 'chip', title: 'RP3A0', text: '4 cores and 512 MB in one package.' },
      { component: 'wifi', icon: 'wifi', title: 'Wi-Fi', text: '2.4 GHz and Bluetooth 4.2.' },
      { component: 'pwr', icon: 'power', title: 'Power', text: 'The micro USB at the end.' },
      { component: 'otg', icon: 'usb', title: 'USB data', text: 'The middle micro USB.' },
      { pin: 'gpio:1', icon: 'pin', title: 'GPIO', text: '40 pins, no header fitted.' },
    ],
    overview: [
      'The **Zero 2 W** packs the processor of a Pi 3 into 65 × 30 mm. It runs the same Raspberry Pi OS and the same Python code as its big siblings, so it is ideal for projects that must be small or cheap: a camera in a birdhouse, a sensor logger, a retro game box.',
      'Its two micro USB ports look alike. The one at the **end** is **power only**; the one in the **middle** is for **data**.',
      { note: 'The GPIO header is not fitted. Solder on a 2 × 20 header (or buy the **Zero 2 WH**, which has one) before plugging in jumper wires.', tone: 'warn' },
      { tips: [['target', 'Click a pin to see its GPIO number'], ['wifi', 'Use it headless, over Wi-Fi and SSH'], ['power', '5 V, 2.5 A supply recommended']] },
      { h: 'Specifications' },
      { specs: [['Processor', 'RP3A0: quad-core Arm Cortex-A53, 1 GHz'], ['Memory', '512 MB'], ['Wireless', '2.4 GHz Wi-Fi 802.11 b/g/n, Bluetooth 4.2 / BLE'], ['Ports', 'Mini HDMI, micro USB OTG, micro USB power, CSI-2 camera'], ['GPIO', '40-pin header footprint (unpopulated)'], ['Size', '65 × 30 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Raspberry Pi Zero 2 W (or WH, with header)'], ['1', 'microSD card, 16 GB or larger'], ['1', '5 V micro USB power supply']],
  },

  {
    id: 'setup',
    title: 'Set it up headless',
    short: 'Install the OS',
    summary: 'Write Raspberry Pi OS Lite with Wi-Fi and SSH already configured, then log in from your computer.',
    icon: 'board',
    focus: { components: ['pwr', 'wifi'] },
    callouts: [
      { component: 'sd', icon: 'memory', title: 'microSD', text: 'Under the left end.' },
      { component: 'pwr', icon: 'power', title: 'Power', text: 'Plug in last.' },
      { component: 'act', icon: 'led', title: 'ACT', text: 'Flickers while it boots.' },
    ],
    overview: [
      'With only 512 MB of memory the Zero 2 W is happiest without a desktop. **Raspberry Pi OS Lite** gives you just the command line, and you connect to it over Wi-Fi.',
      { steps: [
        'In **Raspberry Pi Imager** choose **Raspberry Pi Zero 2 W**, then **Raspberry Pi OS Lite (64-bit)**, then your card.',
        'In the OS customisation settings set a hostname (`zero`), username and password, your **Wi-Fi** name and password, and **enable SSH**.',
        'Write the card, put it in the Zero and plug the power into the **end** micro USB port.',
        'After a minute or two, connect with `ssh pi@zero.local` (use your own username).',
      ] },
      { note: 'The Zero 2 W only sees **2.4 GHz** Wi-Fi.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'ssh pi@zero.local', note: 'from your laptop', out: ['pi@zero.local\'s password: ********', 'pi@zero:~ $'] },
        { cmd: 'free -h', note: 'memory in use', out: ['               total        used        free      shared  buff/cache   available', 'Mem:           416Mi        92Mi       214Mi       1.2Mi       160Mi       324Mi', 'Swap:          415Mi          0B       415Mi'] },
        { cmd: 'nproc', note: 'how many cores', out: ['4'] },
        { cmd: 'sudo apt update && sudo apt full-upgrade -y', note: 'install updates', out: ['Reading package lists... Done', 'Calculating upgrade... Done', '0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.'] },
      ],
    },
    kit: [['1', 'Computer with a microSD card reader'], ['1', '2.4 GHz Wi-Fi network']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'Switch GPIO17 on and off from Python with gpiozero.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['gpio:11', 'gpio:9'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'gpio:11', icon: 'pin', title: 'GPIO17 · pin 11', text: 'Your code switches it.' },
      { pin: 'gpio:9', icon: 'ground', title: 'GND · pin 9', text: 'Current returns here.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click it to try other values.' },
    ],
    overview: [
      'Exactly the same circuit and code as on a Raspberry Pi 5: the header is identical, and **gpiozero** is already installed on Raspberry Pi OS.',
      { tips: [['pin', 'gpiozero uses GPIO numbers (17), not pin numbers (11)'], ['led', '`led.blink()` blinks in the background'], ['resistor', '330 Ω keeps the current low']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.py', lang: 'python', trace: { on: 7, off: 10 }, source: `
from gpiozero import LED
from time import sleep

led = LED(17)          # GPIO17 = physical pin 11

while True:
    led.on()
    print("LED on")
    sleep(1)
    led.off()
    print("LED off")
    sleep(1)
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on GPIO17', delay: 1, volts: 3.3 },
    run: { cmd: 'python3 blink.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'LED'], ['1', '330 Ω resistor'], ['2', 'Female-to-male jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'React to a button on GPIO27 with gpiozero’s event callbacks.',
    icon: { type: 'button' },
    focus: { pins: ['gpio:11', 'gpio:9', 'gpio:13', 'gpio:14'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e19', 'e21', 'f19', 'f21'], label: 'Push button', desc: 'Hold it down in the 3D view: it connects column 19 to column 21.' }],
      wires: [...LED_WIRES, { from: 'gpio:13', to: 'bb:a19', color: '#3b78d6' }, { from: 'bb:a21', to: 'gpio:14', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'gpio:13', icon: 'pin', title: 'GPIO27 · input', text: 'Pulled up inside the chip.' },
    ],
    overview: [
      '`Button(27)` turns on the pin’s internal pull-up resistor. Instead of checking the pin in a loop, hand gpiozero two functions: one for `when_pressed`, one for `when_released`.',
      { tips: [['button', 'Hold the button in the 3D view'], ['code', '`pause()` keeps the script waiting for events'], ['led', 'The LED stays wired from the last lesson']] },
    ],
    wiring: [...LED_WIRING, { pin: 'gpio:13', to: 'Column 19, one side of the button' }, { pin: 'gpio:14', to: 'Column 21, the other side' }],
    code: [{ file: 'button.py', lang: 'python', trace: { wait: 18, pressed: 8, released: 12 }, source: `
from gpiozero import LED, Button
from signal import pause

led = LED(17)
button = Button(27)    # GPIO27 = physical pin 13

def pressed():
    led.on()
    print("Pressed!")

def released():
    led.off()
    print("Released")

button.when_pressed = pressed
button.when_released = released

pause()
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on GPIO17' },
    run: { cmd: 'python3 button.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'web',
    title: 'Control it from your phone',
    short: 'Web control',
    summary: 'A small Flask web server on the Zero switches the LED from any browser on your network.',
    icon: 'circuit',
    focus: { pins: ['gpio:11', 'gpio:9'], components: ['wifi'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'wifi', icon: 'wifi', title: 'Wi-Fi', text: 'Your phone reaches the Zero here.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Switched by a web request.' },
    ],
    overview: [
      'A Linux computer with Wi-Fi can serve web pages. Each link on the page requests a URL, and the matching Python function switches the LED. Flask uses only a few tens of megabytes, so it runs comfortably in 512 MB.',
      { steps: ['Install Flask: `sudo apt install python3-flask`.', 'Run `python3 app.py`.', 'Open `http://zero.local:5000` on a phone on the same Wi-Fi.'] },
      { note: 'Flask’s built-in server is for your home network only. Do not expose it to the internet.' },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'app.py', lang: 'python', trace: { serve: 19, on: 14, off: 16 }, source: `
from flask import Flask
from gpiozero import LED

app = Flask(__name__)
led = LED(17)

@app.route("/")
def index():
    return '<h1>Zero LED</h1><a href="/led/on">On</a> | <a href="/led/off">Off</a>'

@app.route("/led/<state>")
def set_led(state):
    if state == "on":
        led.on()
    else:
        led.off()
    return f'LED is {state}. <a href="/">Back</a>'

app.run(host="0.0.0.0", port=5000)
` }],
    sim: { type: 'web', url: 'http://zero.local:5000', led: 'led1', label: 'LED on GPIO17', title: 'Zero LED', start: [' * Serving Flask app \'app\'', ' * Running on http://192.168.1.57:5000', 'Press CTRL+C to quit'] },
    run: { cmd: 'python3 app.py', stop: [] },
    kit: [['1', 'Phone or laptop on the same Wi-Fi']],
  },
];
