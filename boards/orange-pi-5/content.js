// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: Orange Pi 5 user manual v0.7 (26-pin table, section 3.16; wiringOP sections 3.17–3.19)
// and the wiringOP source (wPi numbers, pinToGpio_5). RKNN usage follows Rockchip's rknn-toolkit-lite2.
import { ledParts, ledWires, BUTTON, buttonWires, PULLUP, pullupWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-orange-pi-5',
  title: 'Orange Pi 5: Eight Cores and an NPU',
  accent: '#e8761e',
  logicVolts: 3.3,
  shell: 'orangepi@orangepi5: ~',
  terminalHint: 'Connected over SSH. Press Run to start the script.',
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'GPIO (3.3 V)', i2c: 'I²C', spi: 'SPI', uart: 'Serial',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Orange Pi 5, top view, millimetres, 100 × 62 mm. Pin names, wPi numbers and functions follow the
// manual's 26-pin table and wiringOP. The header and parts are placed from photos and are stylised.
export const BOARD = {
  name: 'Orange Pi 5',
  width: 100,
  depth: 62,
  thickness: 1.6,
  cornerRadius: 3,
  pcbColor: '#20242c',
  holes: [{ x: 3.5, z: 3.5, r: 1.5 }, { x: 96.5, z: 3.5, r: 1.5 }, { x: 3.5, z: 58.5, r: 1.5 }, { x: 96.5, z: 58.5, r: 1.5 }],
  silkscreen: [{ text: 'Orange Pi 5', x: 72, z: 8, size: 2.6, weight: 700, align: 'center' }],
  components: [
    { id: 'soc', kind: 'chip', label: 'Rockchip RK3588S', desc: 'Four Cortex-A76 cores up to 2.4 GHz, four Cortex-A55 cores, a Mali-G610 GPU and a 6 TOPS NPU.', shape: 'box', x: 50, z: 30, w: 16, d: 16, h: 1.4, color: '#c9ced6', text: 'RK3588S', textColor: 'rgba(30,30,30,.7)' },
    { id: 'ram', kind: 'chip', label: 'LPDDR4X memory', desc: 'Sold with 4, 8, 16 or 32 GB.', shape: 'box', x: 72, z: 30, w: 12, d: 14, h: 1.1, color: '#2a2930' },
    { id: 'usbc', kind: 'usbc', label: 'USB-C power', desc: 'The board takes 5 V, 4 A here.', shape: 'box', x: 4, z: 12, w: 7.4, d: 9, h: 3.2, color: '#c3c8d0', metal: true },
    { id: 'hdmi', kind: 'hdmi', label: 'HDMI output', desc: 'Up to 8K at 60 Hz.', shape: 'box', x: 4, z: 26, w: 11.2, d: 15, h: 6, color: '#bfc5ce' },
    { id: 'eth', kind: 'ethernet', label: 'Gigabit Ethernet', desc: 'The most reliable way onto your network for the first login.', shape: 'box', x: 8, z: 46, w: 16, d: 16, h: 13, color: '#c3c8d0' },
    { id: 'usb3', kind: 'usb', label: 'USB ports', desc: 'USB 3.0 and USB 2.0 for a keyboard, a drive or a camera.', shape: 'box', x: 95, z: 40, w: 14, d: 15, h: 8, color: '#c3c8d0', metal: true },
    { id: 'm2', label: 'M.2 slot', desc: 'On the underside: an NVMe or SATA SSD. The fastest storage this board offers.', shape: 'box', x: 72, z: 46, w: 22, d: 6, h: 1.6, color: '#20242c', under: true },
    { id: 'sd', label: 'microSD card slot', desc: 'The operating system usually starts here.', shape: 'box', x: 96, z: 16, w: 12, d: 12, h: 1.4, color: '#c3c6ca', under: true },
    { id: 'pwr', kind: 'ledsmd', accent: '#3fe06b', lit: true, label: 'Status LED', desc: 'Lights when the system is powered and running.', shape: 'box', x: 18, z: 8, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
  ],
  headers: [{
    id: 'gpio', label: '26-pin GPIO header', short: 'GPIO', desc: 'Seventeen 3.3 V GPIO pins plus power. Numbered like a Raspberry Pi header, but it is shorter and the signals differ, so Pi HATs do not fit.',
    layout: 'dual', style: 'male', pitch: 2.54, x: 34, z: 56.5, step: [2.54, 0], rowStep: [0, 2.54],
    pins: pinTable('3.3V||power3; 5V||power5; GPIO1_B7|wPi 0, I2C5 SDA|i2c; 5V||power5; GPIO1_B6|wPi 1, I2C5 SCL|i2c; GND||gnd; GPIO1_C6|wPi 2|gpio; GPIO4_A3|wPi 3, UART0 TX|uart; GND||gnd; GPIO4_A4|wPi 4, UART0 RX|uart; GPIO4_B2|wPi 5|gpio; GPIO0_D5|wPi 6|gpio; GPIO4_B3|wPi 7|gpio; GND||gnd; GPIO0_D4|wPi 8|gpio; GPIO1_D3|wPi 9|gpio; 3.3V||power3; GPIO1_D2|wPi 10|gpio; GPIO1_C1|wPi 11, SPI4 MOSI|spi; GND||gnd; GPIO1_C0|wPi 12, SPI4 MISO|spi; GPIO2_D4|wPi 13|gpio; GPIO1_C2|wPi 14, SPI4 CLK|spi; GPIO1_C4|wPi 15, SPI4 CS1|spi; GND||gnd; GPIO1_A3|wPi 16|gpio'),
  }],
};

// ---------- shared circuit pieces ----------
const BB = { x: 8, z: 70 };
const LED_WIRING = [{ pin: 'gpio:7', to: '330 Ω resistor → LED **long leg**' }, { pin: 'gpio:9', to: 'Top **−** rail → LED short leg' }];

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Orange Pi 5',
    short: 'Meet the board',
    summary: 'A Linux single-board computer with eight cores and a 6 TOPS neural processor.',
    icon: 'board',
    focus: { components: ['soc'] },
    callouts: [
      { component: 'soc', icon: 'chip', title: 'RK3588S', text: 'Eight cores and an NPU.' },
      { component: 'm2', icon: 'memory', title: 'M.2 slot', text: 'Add an SSD underneath.' },
      { pin: 'gpio:1', icon: 'pin', title: '26-pin header', text: '17 GPIO pins at 3.3 V.' },
      { component: 'usbc', icon: 'power', title: 'USB-C power', text: '5 V, 4 A.' },
    ],
    overview: [
      'Think of a **Raspberry Pi** with much more muscle. The **RK3588S** has four fast and four efficient cores, and a **6 TOPS NPU** for neural networks, so it can run object detection without a graphics card.',
      'The price of that power is a smaller community. Most Pi tutorials still help, but pin libraries, camera drivers and HATs are different, and you will read the manual more often.',
      { tips: [['target', 'Click a part or a pin'], ['info', 'Pi HATs do not fit: this header has 26 pins'], ['memory', 'An NVMe SSD makes it feel like a desktop']] },
      { note: 'The GPIO pins are **3.3 V**. Five volts on a pin will damage the chip.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Chip', 'Rockchip RK3588S'], ['CPU', '4 × Cortex-A76 + 4 × Cortex-A55'], ['NPU', '6 TOPS'], ['Memory', '4–32 GB LPDDR4X'], ['Storage', 'microSD, M.2 slot'], ['GPIO', '26-pin header, 3.3 V']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Orange Pi 5'], ['1', '5 V, 4 A USB-C power supply'], ['1', 'microSD card, 32 GB or larger'], ['1', 'Heatsink or fan', 'The chip runs hot under load.']],
  },

  {
    id: 'setup',
    title: 'Flash an image and log in',
    short: 'Set up Linux',
    summary: 'Write Orange Pi’s Linux image to a microSD card, boot and log in over SSH.',
    icon: 'board',
    focus: { components: ['sd', 'eth', 'usbc'] },
    callouts: [
      { component: 'sd', icon: 'memory', title: 'microSD', text: 'Holds the operating system.' },
      { component: 'eth', icon: 'globe', title: 'Ethernet', text: 'Plug in for the first login.' },
      { component: 'usbc', icon: 'power', title: 'Power', text: 'Connect this last.' },
    ],
    overview: [
      { steps: [
        'Download the **Orange Pi 5** Debian or Ubuntu image from orangepi.org.',
        'Write it to the card with **balenaEtcher**.',
        'Insert the card, connect Ethernet and then power.',
        'Find the board’s address in your router, then log in as **orangepi**.',
      ] },
      'Change the default password straight away with `passwd`. The manual lists the password for your image.',
      { tips: [['terminal', 'Click the commands in Try it'], ['globe', 'Your router lists the board’s IP address'], ['info', 'Make sure you download the image for this exact model']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'ssh orangepi@192.168.1.60', note: 'log in', out: ['orangepi@orangepi5:~$'] },
        { cmd: 'lscpu | grep "Model name"', note: 'see the two kinds of core', out: ['Model name:  Cortex-A55', 'Model name:  Cortex-A76'] },
        { cmd: 'gpio readall', note: 'see the pin table', out: ['Shows every pin with its wPi number and level.'] },
      ],
    },
    kit: [['1', 'Computer with a card reader'], ['1', 'Ethernet cable']],
  },

  {
    id: 'blink',
    title: 'Blink an LED with wiringOP',
    short: 'Blink an LED',
    summary: 'wiringOP-Python switches pin 7, which it calls wPi 2.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['gpio:7', 'gpio:9'] },
    circuit: { breadboard: BB, parts: ledParts(330), wires: ledWires('gpio:7', 'gpio:9') },
    callouts: [
      { pin: 'gpio:7', icon: 'pin', title: 'Pin 7 · wPi 2', text: 'Your code switches it.' },
      { pin: 'gpio:9', icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while the pin is HIGH.' },
    ],
    overview: [
      'Three numbers can name the same pin. **Pin 7** is its place on the header, **GPIO1_C6** its name on the chip, and **wPi 2** the number used by wiringOP. `gpio readall` prints the full table on your board.',
      'wiringOP needs root, so scripts run with `sudo`.',
      { tips: [['terminal', '`gpio readall` shows all three numbers'], ['resistor', 'Try other resistors'], ['code', 'Stop the script with Ctrl+C']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.py', lang: 'python', trace: { on: 10, off: 12 }, source: `
import time
import wiringpi
from wiringpi import GPIO

LED = 2                          # wPi 2 is header pin 7
wiringpi.wiringPiSetup()
wiringpi.pinMode(LED, GPIO.OUTPUT)

while True:
    wiringpi.digitalWrite(LED, GPIO.HIGH)
    time.sleep(1)
    wiringpi.digitalWrite(LED, GPIO.LOW)
    time.sleep(1)
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on pin 7', delay: 1, volts: 3.3 },
    run: { cmd: 'sudo python3 blink.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'LED'], ['1', '330 Ω resistor', 'Orange-orange-brown.'], ['5', 'Female-to-male jumper wires'], ['1', 'Half-size breadboard']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button and a 10 kΩ pull-up resistor on pin 11 switch the LED.',
    icon: { type: 'button' },
    focus: { pins: ['gpio:11', 'gpio:7', 'gpio:9', 'gpio:1'] },
    circuit: { breadboard: BB, parts: [...ledParts(330), PULLUP, BUTTON], wires: [...ledWires('gpio:7', 'gpio:9'), ...pullupWires('gpio:1'), ...buttonWires('gpio:11')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { part: 'res2', icon: 'resistor', title: 'Pull-up', text: 'Holds the pin HIGH.' },
      { pin: 'gpio:11', icon: 'pin', title: 'Pin 11 · wPi 5', text: 'LOW while pressed.' },
      { pin: 'gpio:1', icon: 'power', title: '3.3V', text: 'Feeds the top + rail.' },
    ],
    overview: [
      'An input pin left unconnected picks up noise and reads at random. The **10 kΩ pull-up** holds it HIGH until the button connects it to ground, so it reads **LOW while pressed**.',
      { tips: [['button', 'Hold the button in the 3D view'], ['resistor', 'The pull-up goes to 3.3 V, never to 5 V'], ['led', 'The LED from the last lesson stays']] },
    ],
    wiring: [...LED_WIRING, { pin: 'gpio:1', to: 'Top **+** rail → 10 kΩ resistor → column 20' }, { pin: 'gpio:11', to: 'Column 20, one side of the button' }],
    code: [{ file: 'button.py', lang: 'python', trace: { wait: 11, pressed: 12, released: 12 }, source: `
import time
import wiringpi
from wiringpi import GPIO

LED, BUTTON = 2, 5               # header pins 7 and 11
wiringpi.wiringPiSetup()
wiringpi.pinMode(LED, GPIO.OUTPUT)
wiringpi.pinMode(BUTTON, GPIO.INPUT)

while True:
    pressed = wiringpi.digitalRead(BUTTON) == GPIO.LOW
    wiringpi.digitalWrite(LED, GPIO.HIGH if pressed else GPIO.LOW)
    time.sleep(0.02)
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on pin 7' },
    run: { cmd: 'sudo python3 button.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'Tactile push button'], ['1', '10 kΩ resistor', 'Brown-black-orange.'], ['3', 'More jumper wires']],
  },

  {
    id: 'npu',
    title: 'Run a model on the NPU',
    short: 'NPU inference',
    summary: 'Load a YOLOv5 model converted to RKNN format and detect objects on the NPU.',
    icon: { glyph: 'camera' },
    focus: { components: ['soc'] },
    callouts: [{ component: 'soc', icon: 'chip', title: 'NPU', text: 'Three cores, 6 TOPS in total.' }],
    overview: [
      'An **NPU** only does neural-network arithmetic, but it does that far faster than the CPU and uses less power. Models must first be converted on a PC to Rockchip’s `.rknn` format. On the board, **rknn-toolkit-lite2** loads the file and runs it.',
      { steps: [
        'Install `rknn-toolkit-lite2` on the board, and check that the NPU driver is present.',
        'Get a `yolov5s.rknn` built for **RK3588** from Rockchip’s **rknn_model_zoo**.',
        'Feed it a 640 × 640 image and post-process the outputs into boxes, as the model-zoo example does.',
      ] },
      { tips: [['chip', '`core_mask` picks which NPU cores to use'], ['info', 'Models are chip-specific: rebuild for each target'], ['camera', 'A USB webcam is the easiest camera to start with']] },
      { note: 'The code here shows the shape of the program. Turning raw outputs into boxes needs the post-processing code from the model zoo.' },
    ],
    code: [{ file: 'detect.py', lang: 'python', source: `
import cv2
from rknnlite.api import RKNNLite

rknn = RKNNLite()
rknn.load_rknn('yolov5s.rknn')
rknn.init_runtime(core_mask=RKNNLite.NPU_CORE_0_1_2)

image = cv2.cvtColor(cv2.imread('desk.jpg'), cv2.COLOR_BGR2RGB)
image = cv2.resize(image, (640, 640))
outputs = rknn.inference(inputs=[image[None, ...]])
print('output tensors:', [o.shape for o in outputs])
rknn.release()
` }],
    sim: {
      type: 'detect', fps: 30, start: ['Loading yolov5s.rknn on the NPU'], caption: 'Press Run: a simulated view of what the post-processed boxes look like.',
      objects: [{ label: 'person', box: [0.12, 0.18, 0.3, 0.72], score: 0.91, color: '#e2483c' }, { label: 'laptop', box: [0.52, 0.5, 0.36, 0.32], score: 0.84, color: '#3b78d6' }],
    },
    run: { cmd: 'python3 detect.py', stop: [] },
    kit: [['1', 'Heatsink and fan', 'Needed for sustained loads.'], ['1', 'USB webcam', 'Optional.']],
  },
];
