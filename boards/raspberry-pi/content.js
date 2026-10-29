// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons (text, circuits, callouts, code). The engine is generic.

export const SITE = {
  id: 'learn-raspberry-pi',
  title: 'Raspberry Pi 5: A Computer with Pins',
  accent: '#c51a4a',
  logicVolts: 3.3,
  shell: 'pi@raspberrypi: ~',
  terminalHint: 'Connected over SSH. Press Run to start the script.',
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'GPIO', i2c: 'I²C', spi: 'SPI', uart: 'UART', id: 'HAT ID EEPROM',
};

// The official 40-pin header, physical pin order: "NAME/ALT type".
export const PI_PINS = ('3V3 power3|5V power5|GPIO2/SDA i2c|5V power5|GPIO3/SCL i2c|GND gnd|GPIO4 gpio|GPIO14/TXD uart|GND gnd|GPIO15/RXD uart|'
  + 'GPIO17 gpio|GPIO18/PWM0 gpio|GPIO27 gpio|GND gnd|GPIO22 gpio|GPIO23 gpio|3V3 power3|GPIO24 gpio|GPIO10/MOSI spi|GND gnd|'
  + 'GPIO9/MISO spi|GPIO25 gpio|GPIO11/SCLK spi|GPIO8/CE0 spi|GND gnd|GPIO7/CE1 spi|GPIO0/ID_SD id|GPIO1/ID_SC id|GPIO5 gpio|GND gnd|'
  + 'GPIO6 gpio|GPIO12/PWM0 gpio|GPIO13/PWM1 gpio|GND gnd|GPIO19/PWM1 gpio|GPIO16 gpio|GPIO26 gpio|GPIO20 gpio|GND gnd|GPIO21 gpio')
  .split('|').map((s, i) => {
    const [label, type] = s.split(' ');
    const [name, alt] = label.split('/');
    return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
  });

// Raspberry Pi 5, top view, millimetres. Pin numbers and functions follow the official header;
// component placement is stylised and not for mechanical design.
export const BOARD = {
  name: 'Raspberry Pi 5',
  width: 85,
  depth: 56,
  thickness: 1.6,
  cornerRadius: 3,
  pcbColor: '#2a7d55',
  holes: [{ x: 3.5, z: 3.5, r: 1.375 }, { x: 61.5, z: 3.5, r: 1.375 }, { x: 3.5, z: 52.5, r: 1.375 }, { x: 61.5, z: 52.5, r: 1.375 }],
  silkscreen: [
    { text: 'Raspberry Pi 5', x: 22, z: 41.5, size: 2.6 },
    { text: 'GPIO', x: 8, z: 7.6, size: 1.4 },
    { text: 'HDMI0', x: 25.8, z: 47.8, size: 1.2, align: 'center' },
    { text: 'HDMI1', x: 39.2, z: 47.8, size: 1.2, align: 'center' },
    { text: 'PWR IN', x: 11.2, z: 47.8, size: 1.2, align: 'center' },
  ],
  smd: [{ x: 20, z: 43, w: 14, d: 5, count: 12 }, { x: 56, z: 41, w: 7, d: 8, count: 8 }, { x: 24, z: 14, w: 14, d: 5, count: 10 }, { x: 68, z: 22, w: 5, d: 16, count: 8 }, { x: 40, z: 16, w: 8, d: 4, count: 6 }],
  components: [
    { id: 'soc', kind: 'chip', label: 'BCM2712 processor', desc: 'Quad-core Arm Cortex-A76 at 2.4 GHz with a VideoCore VII GPU. This is the computer.', shape: 'box', x: 29, z: 30, w: 15, d: 15, h: 1.4, color: '#cfd3da', text: 'BCM2712', textColor: 'rgba(30,30,30,0.7)' },
    { id: 'ram', kind: 'chip', label: 'LPDDR4X memory', desc: 'Working memory: 2, 4, 8 or 16 GB depending on the model.', shape: 'box', x: 45, z: 30, w: 11, d: 14, h: 1.1, color: '#1b1b1b', text: 'RAM' },
    { id: 'rp1', kind: 'chip', label: 'RP1 I/O controller', desc: 'Raspberry Pi’s own chip that drives the GPIO header, USB, Ethernet and camera ports.', shape: 'box', x: 61, z: 31, w: 8, d: 8, h: 1, color: '#222222', text: 'RP1' },
    { id: 'wifi', kind: 'shield', label: 'Wi-Fi and Bluetooth', desc: 'Dual-band 802.11ac Wi-Fi and Bluetooth 5.0 under a metal shield.', shape: 'box', x: 13, z: 19, w: 10, d: 9, h: 1.5, color: '#c7c9cc' },
    { id: 'pmic', kind: 'chip', label: 'Power management chip', desc: 'Turns the 5 V input into the voltages the board needs.', shape: 'box', x: 14, z: 38, w: 6, d: 6, h: 0.9, color: '#262626' },
    { id: 'usbc', kind: 'usbc', label: 'USB-C power input', desc: 'Power goes in here. Use a 5 V / 5 A (27 W) USB-C supply for full USB current.', shape: 'box', x: 11.2, z: 53.2, w: 9, d: 7.5, h: 3.2, color: '#bfc5ce' },
    { id: 'hdmi0', kind: 'hdmi', label: 'Micro HDMI 0', desc: 'Main display output, up to 4K at 60 Hz. Use this one for a single monitor.', shape: 'box', x: 25.8, z: 53, w: 7.5, d: 6.5, h: 3.4, color: '#bfc5ce' },
    { id: 'hdmi1', kind: 'hdmi', label: 'Micro HDMI 1', desc: 'Second display output, also up to 4K at 60 Hz.', shape: 'box', x: 39.2, z: 53, w: 7.5, d: 6.5, h: 3.4, color: '#bfc5ce' },
    { id: 'cam1', kind: 'fpc', label: 'CAM/DISP 1 connector', desc: 'Second 4-lane MIPI connector for a camera or a DSI display.', shape: 'box', x: 47, z: 47, w: 3.2, d: 13, h: 2.6, color: '#e9e3d3' },
    { id: 'cam0', kind: 'fpc', label: 'CAM/DISP 0 connector', desc: '4-lane MIPI connector for a camera or DSI display. Takes the narrow 22-pin ribbon cable.', shape: 'box', x: 52, z: 47, w: 3.2, d: 13, h: 2.6, color: '#e9e3d3' },
    { id: 'eth', kind: 'ethernet', label: 'Gigabit Ethernet', desc: 'Wired network. Supports Power over Ethernet with a PoE+ HAT.', shape: 'box', x: 76.5, z: 45.7, w: 21, d: 16, h: 13.5, color: '#bfc5ce' },
    { id: 'usb3', kind: 'usb', accent: '#3f7be0', label: 'USB 3.0 ports', desc: 'Two fast USB 3.0 ports (blue inside). Use them for SSDs and cameras.', shape: 'box', x: 79, z: 27.5, w: 17.5, d: 13.1, h: 16, color: '#bfc5ce' },
    { id: 'usb2', kind: 'usb', accent: '#2b2a33', label: 'USB 2.0 ports', desc: 'Two USB 2.0 ports for a keyboard, mouse and other slow devices.', shape: 'box', x: 79, z: 10, w: 17.5, d: 13.1, h: 16, color: '#bfc5ce' },
    { id: 'fan', kind: 'jst', label: 'Fan connector', desc: '4-pin PWM fan header for the Active Cooler or the official case fan.', shape: 'box', x: 66.5, z: 7.5, w: 6, d: 4, h: 4, color: '#e9e3d3' },
    { id: 'pcie', kind: 'fpc', label: 'PCIe connector', desc: 'Single-lane PCIe 2.0 for an NVMe SSD or AI accelerator HAT (via an adapter).', shape: 'box', x: 2.6, z: 28, w: 2.8, d: 14, h: 2, color: '#e9e3d3' },
    { id: 'power', kind: 'button', label: 'Power button', desc: 'Press to turn the Pi on, press twice to shut down cleanly.', shape: 'box', x: 2.2, z: 44, w: 3, d: 4, h: 2.4, color: '#2a2a2a' },
    { id: 'sd', label: 'microSD card slot', desc: 'Underneath the board. The operating system lives on the card in here.', shape: 'box', x: 7, z: 28, w: 12, d: 12, h: 1.4, color: '#c3c6ca', under: true },
  ],
  headers: [{
    id: 'gpio', label: '40-pin GPIO header', short: 'GPIO',
    desc: 'Pins that talk to the outside world. Signals are 3.3 V: never connect 5 V to a GPIO pin.',
    layout: 'dual', pitch: 2.54, x: 8.37, z: 4.77, step: [2.54, 0], rowStep: [0, -2.54], pins: PI_PINS,
  }],
};

const VENV_NOTE = { note: 'Raspberry Pi OS protects its system Python, so install extra libraries into a virtual environment: `python3 -m venv --system-site-packages ~/env`, then `source ~/env/bin/activate`. The `--system-site-packages` flag keeps the pre-installed `gpiozero` and `picamera2` available.' };

// The breadboard sits to the left of the Pi; its column 30 end is closest to the GPIO header.
const BB = { x: -94, z: -8 };
const LED_PARTS = [
  { id: 'res1', type: 'resistor', a: 'c24', b: 'c28', ohms: 330, label: '330 Ω resistor', desc: 'Limits the current through the LED. Try other values.', controls: { ohms: [220, 330, 1000, 10000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e28', cathode: 'e29', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to GND.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
const LED_WIRES = [{ from: 'gpio:11', to: 'bb:a24', color: '#f0a33a' }, { from: 'bb:a29', to: 'gpio:9', color: '#2b2a30' }];
const BME_CIRCUIT = {
  breadboard: BB,
  parts: [{ id: 'bme', type: 'module', preset: 'breakout', pins: ['j21', 'j22', 'j23', 'j24'], label: 'BME280', color: '#5b2a86', desc: 'Temperature, humidity and pressure sensor on the I²C bus.' }],
  wires: [{ from: 'gpio:1', to: 'bb:f21', color: '#e2483c' }, { from: 'gpio:9', to: 'bb:f22', color: '#2b2a30' }, { from: 'gpio:5', to: 'bb:f23', color: '#f2c12e' }, { from: 'gpio:3', to: 'bb:f24', color: '#3b78d6' }],
};

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the board',
    summary: 'A Raspberry Pi is a whole computer on a card. Find your way around its ports, chips and pins.',
    icon: 'board',
    view: { az: 0.5 },
    focus: { components: ['soc'] },
    callouts: [
      { component: 'soc', icon: 'chip', title: 'Processor', text: 'BCM2712 runs Linux and your code.' },
      { component: 'ram', icon: 'memory', title: 'Memory', text: '2–16 GB of working memory.' },
      { pin: 'gpio:1', icon: 'pin', title: 'GPIO header', text: '40 pins for LEDs, buttons and sensors.' },
      { component: 'usbc', icon: 'power', title: 'Power in', text: '5 V / 5 A over USB-C.' },
      { component: 'usb3', icon: 'usb', title: 'USB 3.0', text: 'Fast ports for drives and cameras.' },
      { component: 'eth', icon: 'globe', title: 'Ethernet', text: 'Gigabit wired network.' },
    ],
    overview: [
      'An Arduino runs one small program on a microcontroller. A Raspberry Pi runs a full operating system (Linux), so it can browse the web, run Python, serve web pages and drive cameras, all while switching LEDs on its **GPIO pins**.',
      { tips: [['chip', 'A complete computer, not a microcontroller'], ['target', 'Click any part in the 3D view to learn what it does'], ['rotr', 'Drag to orbit, Q / E to turn, scroll to zoom']] },
      { note: 'GPIO pins work at **3.3 V**. Connecting 5 V straight to a GPIO pin can permanently damage the Pi.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Processor', 'BCM2712, 4 × Cortex-A76 @ 2.4 GHz'], ['Memory', '2, 4, 8 or 16 GB LPDDR4X'], ['Graphics', 'VideoCore VII, 2 × 4Kp60 HDMI'], ['Wireless', 'Dual-band Wi-Fi, Bluetooth 5.0'], ['USB', '2 × USB 3.0, 2 × USB 2.0'], ['Network', 'Gigabit Ethernet, PoE+ with HAT'], ['Camera / display', '2 × 4-lane MIPI'], ['Storage', 'microSD, PCIe 2.0 ×1'], ['GPIO', '40 pins, 3.3 V logic'], ['Power', '5 V / 5 A USB-C']] },
    ],
    sim: { type: 'tour' },
    run: {
      cmd: 'pinout',
      output: ['Description        : Raspberry Pi 5B', 'SoC                : BCM2712', 'RAM                : 8GB', 'Storage            : MicroSD', 'USB ports          : 4 (of which 2 USB3)', 'Ethernet ports     : 1 (1000Mbps max. speed)', 'Wi-fi              : True', 'Bluetooth          : True', '', 'J8:', '   3V3  (1) (2)  5V', ' GPIO2  (3) (4)  5V', ' GPIO3  (5) (6)  GND', ' GPIO4  (7) (8)  GPIO14', '   GND  (9) (10) GPIO15', 'GPIO17 (11) (12) GPIO18', '   …'],
    },
    kit: [
      ['1', 'Raspberry Pi 5', 'Any memory size works for these lessons.'],
      ['1', 'Official 27 W USB-C power supply', 'Weaker supplies work but limit USB current.'],
      ['1', 'microSD card, 32 GB or larger', 'A1/A2 rated cards feel noticeably faster.'],
      ['1', 'Active Cooler or a case with a fan', 'The Pi 5 throttles when it gets hot.'],
      ['1', 'Breadboard and jumper wires (female-to-male)', 'Needed from lesson 4 on.'],
    ],
  },

  {
    id: 'setup',
    title: 'Install the operating system',
    short: 'Install the OS',
    summary: 'Flash Raspberry Pi OS onto a microSD card, boot the Pi and log in from your own computer.',
    icon: { glyph: 'power' },
    focus: { components: ['usbc', 'wifi'] },
    callouts: [
      { component: 'sd', icon: 'memory', title: 'microSD slot', text: 'Underneath: the OS boots from the card.' },
      { component: 'usbc', icon: 'power', title: 'Power', text: 'Plug in last; the Pi boots at once.' },
      { component: 'wifi', icon: 'wifi', title: 'Wi-Fi', text: 'Joins the network you set in Imager.' },
      { component: 'power', icon: 'button', title: 'Power button', text: 'Press twice to shut down cleanly.' },
    ],
    overview: [
      'You will run the Pi **headless**: no monitor or keyboard, just power and Wi-Fi. You control it from your laptop over SSH.',
      { steps: [
        'Install **Raspberry Pi Imager** on your computer from raspberrypi.com/software.',
        'Choose device **Raspberry Pi 5**, OS **Raspberry Pi OS (64-bit)**, and your microSD card.',
        'When asked to apply OS customisation, click **Edit settings**: set a hostname (`raspberrypi`), a username and password, your Wi-Fi name and password, and on the Services tab **enable SSH**.',
        'Write the card, put it in the Pi (slot underneath, contacts facing up) and plug in power.',
        'Wait a minute or two for the first boot, then connect from your computer with `ssh pi@raspberrypi.local`, replacing `pi` with your username.',
      ] },
      { note: 'If `raspberrypi.local` is not found, look up the Pi’s IP address in your router’s device list and use `ssh pi@<that address>` instead.' },
      { h: 'Keep it up to date' },
      { cmd: 'sudo apt update && sudo apt full-upgrade -y' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'ssh pi@raspberrypi.local', note: 'from your laptop', out: ['The authenticity of host \'raspberrypi.local\' can\'t be established.', 'Are you sure you want to continue connecting (yes/no)? yes', 'pi@raspberrypi.local\'s password: ********', 'pi@raspberrypi:~ $'] },
        { cmd: 'hostname -I', note: 'the Pi’s IP address', out: ['192.168.1.42'] },
        { cmd: 'grep PRETTY_NAME /etc/os-release', note: 'which OS is installed', out: ['PRETTY_NAME="Debian GNU/Linux 13 (trixie)"'] },
        { cmd: 'sudo apt update && sudo apt full-upgrade -y', note: 'install updates', out: ['Hit:1 http://deb.debian.org/debian trixie InRelease', 'Hit:2 http://archive.raspberrypi.com/debian trixie InRelease', 'Reading package lists... Done', 'Calculating upgrade... Done', '0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.'] },
      ],
    },
    kit: [['1', 'Computer with a microSD card reader', 'Windows, macOS or Linux.'], ['1', 'Wi-Fi network', 'Or an Ethernet cable to your router.']],
  },

  {
    id: 'terminal',
    title: 'Find your way in the terminal',
    short: 'Terminal basics',
    summary: 'The handful of shell commands you will use in every project.',
    icon: { glyph: 'terminal' },
    focus: { components: ['soc', 'ram'] },
    callouts: [
      { component: 'soc', icon: 'terminal', title: 'Your commands', text: 'Run on this processor, over SSH.' },
      { component: 'ram', icon: 'memory', title: 'free -h', text: 'Shows how much memory is in use.' },
      { component: 'wifi', icon: 'wifi', title: 'SSH link', text: 'Your laptop talks to the Pi over Wi-Fi.' },
    ],
    overview: [
      'The terminal is a text conversation with the Pi. You type a command, press Enter, and it answers. Every command on this site runs there.',
      { specs: [['`pwd` · `ls` · `cd`', 'Where am I, what is here, go elsewhere'], ['`mkdir name`', 'Make a folder'], ['`nano file.py`', 'Edit a file (Ctrl+O save, Ctrl+X quit)'], ['`python3 file.py`', 'Run a Python script'], ['Ctrl+C', 'Stop whatever is running'], ['`sudo …`', 'Run as administrator'], ['Tab', 'Auto-complete names'], ['↑', 'Bring back the last command']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'pwd', note: 'current folder', out: ['/home/pi'] },
        { cmd: 'mkdir projects && cd projects', note: 'make a folder and enter it', out: [] },
        { cmd: 'echo \'print("Hello from the Pi!")\' > hello.py', note: 'write a one-line script', out: [] },
        { cmd: 'python3 hello.py', note: 'run it', out: ['Hello from the Pi!'] },
        { cmd: 'vcgencmd measure_temp', note: 'CPU temperature', out: ['temp=47.2\'C'] },
        { cmd: 'free -h', note: 'memory in use', out: ['               total        used        free      shared  buff/cache   available', 'Mem:           7.9Gi       612Mi       6.6Gi        36Mi       790Mi       7.3Gi', 'Swap:          511Mi          0B       511Mi'] },
      ],
    },
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'Your first circuit: switch a GPIO pin on and off from Python to make an LED blink.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['gpio:11', 'gpio:9'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { pin: 'gpio:11', icon: 'pin', title: 'GPIO17 · pin 11', text: 'Your code switches it HIGH and LOW.' },
      { pin: 'gpio:9', icon: 'ground', title: 'GND · pin 9', text: 'Current returns to the Pi here.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Stops the LED drawing too much current.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights whenever GPIO17 is HIGH.' },
    ],
    overview: [
      'A GPIO pin set as an **output** is either HIGH (3.3 V) or LOW (0 V). Connect an LED and a resistor between the pin and ground, switch the pin HIGH, and current flows: the LED lights up.',
      { tips: [['pin', 'Digital output with `led.on()` and `led.off()`'], ['resistor', 'Click the resistor to try other values'], ['led', 'Click the LED to change its colour']] },
      { steps: ['Wire the LED and resistor as shown, with the Pi switched off.', 'Save the code as `blink.py` with `nano blink.py`.', 'Run it with `python3 blink.py`. Stop it with Ctrl+C.'] },
    ],
    wiring: [{ pin: 'gpio:11', to: '330 Ω resistor → LED **long leg** (anode)' }, { pin: 'gpio:9', to: 'LED **short leg** (cathode)' }],
    wiringNotes: [{ note: 'Always put a resistor (220–470 Ω) in series with an LED. Without it the LED draws too much current from the pin.', tone: 'warn' }, 'gpiozero uses **GPIO numbers** (17), not physical pin numbers (11). The table above shows both.'],
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
    codeNotes: ['`gpiozero` also has a shortcut: `led.blink(on_time=1, off_time=1)` blinks in the background so your script can do other things.'],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on GPIO17', delay: 1, volts: 3.3 },
    run: { cmd: 'python3 blink.py', stop: ['Traceback (most recent call last):', 'KeyboardInterrupt'] },
    kit: [['1', 'LED (any colour)'], ['1', '330 Ω resistor', 'Orange-orange-brown bands.'], ['1', 'Breadboard'], ['2', 'Female-to-male jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'Use a GPIO pin as an input and react to a button press.',
    icon: { type: 'button' },
    focus: { pins: ['gpio:11', 'gpio:9', 'gpio:13', 'gpio:14'] },
    circuit: {
      breadboard: BB,
      parts: [...LED_PARTS, { id: 'btn1', type: 'button', legs: ['e19', 'e21', 'f19', 'f21'], label: 'Push button', desc: 'Hold it down in the 3D view: it connects column 19 to column 21.' }],
      wires: [...LED_WIRES, { from: 'gpio:13', to: 'bb:a19', color: '#3b78d6' }, { from: 'bb:a21', to: 'gpio:14', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Click and hold it in the scene.' },
      { pin: 'gpio:13', icon: 'pin', title: 'GPIO27 · input', text: 'Reads LOW while the button is held.' },
      { pin: 'gpio:14', icon: 'ground', title: 'GND · pin 14', text: 'The button connects the pin to here.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Your code lights it on each press.' },
    ],
    overview: [
      'As an **input**, a pin reads the voltage on it. gpiozero’s `Button` turns on the pin’s internal **pull-up resistor**, so the pin sits at 3.3 V until the button connects it to ground.',
      { tips: [['button', 'Click and hold the button in the 3D view'], ['code', 'React to presses with `when_pressed`'], ['led', 'The LED from lesson 4 stays in place']] },
      'Instead of checking the button in a loop, attach functions to `when_pressed` and `when_released`. gpiozero calls them for you.',
    ],
    wiring: [
      { pin: 'gpio:13', to: 'Column 19, one side of the push button' },
      { pin: 'gpio:14', to: 'Column 21, the other side of the push button' },
      { pin: 'gpio:11', to: '330 Ω resistor → LED long leg (from lesson 4)' },
      { pin: 'gpio:9', to: 'LED short leg (from lesson 4)' },
    ],
    wiringNotes: ['The button straddles the centre channel. Legs facing each other across the channel are always connected; pressing joins the left pair to the right pair.'],
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

pause()                # keep the script alive, waiting for events
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on GPIO17' },
    run: { cmd: 'python3 button.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'Tactile push button (6 mm)'], ['2', 'More female-to-male jumper wires']],
  },

  {
    id: 'rgb',
    title: 'Mix colours with PWM',
    short: 'Mix colours',
    summary: 'Dim LEDs with pulse-width modulation and mix red, green and blue into any colour.',
    icon: { type: 'rgbled' },
    focus: { pins: ['gpio:12', 'gpio:16', 'gpio:18', 'gpio:20'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'rgb1', type: 'rgbled', legs: ['e25', 'e26', 'e27', 'e28'], label: 'RGB LED', desc: 'Legs, left to right: red, common cathode (longest), green, blue.' },
        { id: 'rr', type: 'resistor', a: 'b19', b: 'b25', ohms: 220, label: '220 Ω · red' },
        { id: 'rg', type: 'resistor', a: 'c21', b: 'c27', ohms: 220, label: '220 Ω · green' },
        { id: 'rb', type: 'resistor', a: 'd23', b: 'd28', ohms: 220, label: '220 Ω · blue' },
      ],
      wires: [{ from: 'gpio:12', to: 'bb:a19', color: '#e2483c' }, { from: 'gpio:16', to: 'bb:a21', color: '#3fae5a' }, { from: 'gpio:18', to: 'bb:a23', color: '#3b78d6' }, { from: 'bb:a26', to: 'gpio:20', color: '#2b2a30' }],
    },
    callouts: [
      { part: 'rgb1', icon: 'led', title: 'RGB LED', text: 'Three LEDs under one milky lens.' },
      { pin: 'gpio:12', icon: 'wave', title: 'GPIO18 · red', text: 'PWM sets each channel 0–1.' },
      { part: 'rr', icon: 'resistor', title: '220 Ω each', text: 'One resistor per colour.' },
      { pin: 'gpio:20', icon: 'ground', title: 'GND', text: 'Shared by all three colours.' },
    ],
    overview: [
      'A GPIO pin can only be on or off. **PWM** switches it very fast and varies how long it stays on. Your eye averages the flicker, so 30 % on looks like 30 % brightness.',
      { tips: [['wave', 'One PWM pin per colour, 0 to 1 each'], ['led', 'Light mixes: red + green makes yellow'], ['knob', 'Drag the sliders in Try it to mix your own']] },
      { note: 'These lessons use a **common-cathode** RGB LED (the longest leg goes to GND). For a common-anode LED, connect the long leg to 3V3 and create it with `RGBLED(..., active_high=False)`.' },
    ],
    wiring: [{ pin: 'gpio:12', to: '220 Ω resistor → **red** leg' }, { pin: 'gpio:16', to: '220 Ω resistor → **green** leg' }, { pin: 'gpio:18', to: '220 Ω resistor → **blue** leg' }, { pin: 'gpio:20', to: 'Longest leg (common cathode)' }],
    code: [{ file: 'colours.py', lang: 'python', trace: { set: 16 }, source: `
from gpiozero import RGBLED
from time import sleep

led = RGBLED(red=18, green=23, blue=24)

colours = {
    "red": (1, 0, 0),
    "green": (0, 1, 0),
    "blue": (0, 0, 1),
    "magenta": (1, 0, 1),
    "warm white": (1, 0.6, 0.2),
}

while True:
    for name, colour in colours.items():
        led.color = colour
        print(name, colour)
        sleep(1)
` }],
    codeNotes: ['Try `led.pulse()` for a smooth breathing effect, or set `led.red = 0.3` to change a single channel.'],
    sim: { type: 'rgb', led: 'rgb1', sequence: [['red', [1, 0, 0]], ['green', [0, 1, 0]], ['blue', [0, 0, 1]], ['magenta', [1, 0, 1]], ['warm white', [1, 0.6, 0.2]]] },
    run: { cmd: 'python3 colours.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'RGB LED, common cathode', '4 legs; the longest is the cathode.'], ['3', '220 Ω resistors', 'Red-red-brown bands.'], ['4', 'Female-to-male jumper wires']],
  },

  {
    id: 'distance',
    title: 'Measure distance with ultrasound',
    short: 'Measure distance',
    summary: 'Bounce sound off objects with an HC-SR04 sensor and turn the echo time into centimetres.',
    icon: { type: 'module', preset: 'hcsr04' },
    focus: { pins: ['gpio:2', 'gpio:6', 'gpio:7', 'gpio:15'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'us1', type: 'module', preset: 'hcsr04', pins: ['j24', 'j25', 'j26', 'j27'], label: 'HC-SR04', desc: 'Ultrasonic rangefinder. Pins: VCC, TRIG, ECHO, GND.', controls: { distance: [2, 250] } },
        { id: 'r1', type: 'resistor', a: 'h26', b: 'h29', ohms: 1000, label: '1 kΩ divider resistor', desc: 'Top half of the voltage divider on ECHO.' },
        { id: 'r2', type: 'resistor', a: 'i29', b: 'bn29', ohms: 2000, label: '2 kΩ divider resistor', desc: 'Bottom half of the divider, to ground.' },
      ],
      wires: [
        { from: 'gpio:2', to: 'bb:f24', color: '#e2483c' }, { from: 'gpio:7', to: 'bb:f25', color: '#f2c12e' }, { from: 'bb:f29', to: 'gpio:15', color: '#3fae5a' },
        { from: 'bb:g27', to: 'bb:bn27', color: '#2b2a30' }, { from: 'bb:bn20', to: 'gpio:6', color: '#2b2a30' },
      ],
    },
    callouts: [
      { part: 'us1', icon: 'ruler', title: 'HC-SR04', text: 'Click it to move the object in front.' },
      { pin: 'gpio:7', icon: 'pin', title: 'TRIG · GPIO4', text: 'A 10 µs pulse sends the chirp.' },
      { pin: 'gpio:15', icon: 'wave', title: 'ECHO · GPIO22', text: 'High for as long as the echo takes.' },
      { part: 'r1', icon: 'resistor', title: 'Voltage divider', text: '1 kΩ + 2 kΩ turn 5 V into ~3.3 V.' },
      { pin: 'gpio:2', icon: 'power', title: '5 V', text: 'The sensor needs 5 V to work.' },
    ],
    overview: [
      'The HC-SR04 sends a short ultrasonic chirp when its **TRIG** pin is pulsed, then holds **ECHO** high until the sound comes back. Sound travels about 343 m/s, so distance = echo time × 343 m/s ÷ 2.',
      { tips: [['ruler', 'Click the sensor to move the object in front of it'], ['code', '`DistanceSensor` does the timing for you'], ['resistor', 'A divider protects the 3.3 V input']] },
      { note: 'The sensor runs on 5 V and its ECHO pin outputs 5 V. Feed ECHO through a **voltage divider** (1 kΩ + 2 kΩ) so the Pi only sees about 3.3 V.', tone: 'warn' },
    ],
    wiring: [
      { pin: 'gpio:2', to: 'Sensor **VCC**' },
      { pin: 'gpio:6', to: 'Ground rail: sensor **GND** and the bottom of the 2 kΩ resistor' },
      { pin: 'gpio:7', to: 'Sensor **TRIG**' },
      { pin: 'gpio:15', to: 'Middle of the divider: sensor **ECHO** → 1 kΩ → here → 2 kΩ → GND' },
    ],
    code: [{ file: 'distance.py', lang: 'python', trace: { read: 8 }, source: `
from gpiozero import DistanceSensor
from time import sleep

# max_distance is in metres; readings beyond it are capped
sensor = DistanceSensor(echo=22, trigger=4, max_distance=2)

while True:
    print(f"Distance: {sensor.distance * 100:.1f} cm")
    sleep(0.5)
` }],
    codeNotes: ['Readings jump around a little; that is normal. For a steadier number, average the last few readings or raise `queue_len` when you create the sensor.'],
    sim: { type: 'distance', sensor: 'us1', max: 200, limitNote: 'Past max_distance (200 cm) gpiozero reports the maximum.' },
    run: { cmd: 'python3 distance.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'HC-SR04 ultrasonic sensor'], ['1', '1 kΩ resistor', 'Brown-black-red.'], ['1', '2 kΩ resistor', 'Red-black-red, or two 1 kΩ in series.'], ['5', 'Jumper wires']],
  },

  {
    id: 'i2c',
    title: 'Read a sensor over I²C',
    short: 'Read a sensor',
    summary: 'Connect a BME280 environmental sensor with two data wires and read temperature, humidity and pressure.',
    icon: { type: 'module', preset: 'breakout', label: 'BME280' },
    focus: { pins: ['gpio:1', 'gpio:3', 'gpio:5', 'gpio:9'] },
    circuit: BME_CIRCUIT,
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'BME280', text: 'Temperature, humidity and pressure.' },
      { pin: 'gpio:3', icon: 'wave', title: 'SDA · data', text: 'Carries the readings.' },
      { pin: 'gpio:5', icon: 'clock', title: 'SCL · clock', text: 'The Pi sets the pace.' },
      { pin: 'gpio:1', icon: 'power', title: '3V3', text: 'Powers the sensor.' },
    ],
    overview: [
      '**I²C** is a two-wire bus: SDA carries data, SCL carries the clock. Many sensors can share the same two pins because each one has its own address.',
      { steps: [
        'Enable I²C: run `sudo raspi-config`, choose **Interface Options → I2C → Yes**.',
        'Wire the sensor (Pi switched off), then check it shows up with `i2cdetect -y 1`. You should see `76` or `77`.',
        'Create a virtual environment and install the driver: `pip install RPi.bme280`.',
        'Run the script with the environment active.',
      ] },
      VENV_NOTE,
    ],
    wiring: [{ pin: 'gpio:1', to: 'Sensor **VIN** / VCC (3.3 V)' }, { pin: 'gpio:3', to: 'Sensor **SDA**' }, { pin: 'gpio:5', to: 'Sensor **SCL**' }, { pin: 'gpio:9', to: 'Sensor **GND**' }],
    wiringNotes: ['Most BME280 breakout boards already have pull-up resistors on SDA and SCL, and the Pi has its own, so no extra parts are needed.'],
    code: [{ file: 'weather.py', lang: 'python', trace: { read: 10 }, source: `
import time
import smbus2
import bme280

ADDRESS = 0x76          # use 0x77 if i2cdetect showed 77
bus = smbus2.SMBus(1)
calibration = bme280.load_calibration_params(bus, ADDRESS)

while True:
    data = bme280.sample(bus, ADDRESS, calibration)
    print(f"{data.temperature:.2f} °C  {data.humidity:.1f} %  {data.pressure:.1f} hPa")
    time.sleep(1)
` }],
    sim: { type: 'env', sensor: 'bme' },
    run: { cmd: 'python3 weather.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'BME280 breakout board', 'Check it is a BME280 (with humidity), not a BMP280.'], ['4', 'Female-to-male jumper wires']],
  },

  {
    id: 'camera',
    title: 'Take a photo',
    short: 'Use the camera',
    summary: 'Plug in a Camera Module and capture images from the command line and from Python.',
    icon: { type: 'camera' },
    focus: { components: ['cam0'] },
    circuit: { parts: [{ id: 'cam', type: 'camera', at: { x: 62, z: 92 }, connector: 'cam0', label: 'Camera Module 3', desc: 'Connected to CAM/DISP 0 with the narrow Pi 5 ribbon cable.' }] },
    callouts: [
      { part: 'cam', icon: 'camera', title: 'Camera Module 3', text: '12 MP sensor with autofocus.' },
      { component: 'cam0', icon: 'plug', title: 'CAM/DISP 0', text: 'Lift the latch, slide the ribbon in.' },
      { component: 'soc', icon: 'chip', title: 'Image processing', text: 'The Pi turns raw data into a JPEG.' },
    ],
    overview: [
      'Camera Modules connect to the **CAM/DISP** connectors with a flat ribbon cable. The Pi 5 uses a narrower 22-pin connector than older Pis, so you need a **Pi 5 camera cable** (22-pin to 15-pin).',
      { steps: [
        'Shut down the Pi (`sudo shutdown now`) and unplug the power.',
        'Lift the dark latch on CAM/DISP 0, slide the cable in with the gold contacts facing away from the latch, and press the latch closed.',
        'Power on and test with `rpicam-hello`. A preview window opens if you have a display; over SSH it just reports the camera.',
        'Take a still with `rpicam-still -o test.jpg`, or use the Python script.',
      ] },
      { note: 'The ribbon cable is fragile. Never plug or unplug it while the Pi has power.', tone: 'warn' },
    ],
    code: [{ file: 'photo.py', lang: 'python', trace: { start: 5, capture: 7 }, source: `
from picamera2 import Picamera2
from time import sleep

picam2 = Picamera2()
picam2.start()
sleep(2)                        # let auto-exposure settle
picam2.capture_file("photo.jpg")
picam2.stop()
print("Saved photo.jpg")
` }],
    codeNotes: ['Copy the photo to your computer with `scp pi@raspberrypi.local:photo.jpg .` (run that on your computer, not the Pi).'],
    sim: { type: 'camera', start: ['Camera Module 3 detected', 'Waiting 2 s for auto-exposure…'] },
    run: { cmd: 'python3 photo.py' },
    kit: [['1', 'Raspberry Pi Camera Module 3'], ['1', 'Raspberry Pi 5 camera cable', '22-pin to 15-pin, 200 mm or longer.']],
  },

  {
    id: 'web',
    title: 'Control it from your phone',
    short: 'Web control',
    summary: 'Run a tiny Flask web server on the Pi and switch the LED from any browser on your network.',
    icon: 'circuit',
    focus: { pins: ['gpio:11', 'gpio:9'], components: ['wifi'] },
    circuit: { breadboard: BB, parts: LED_PARTS, wires: LED_WIRES },
    callouts: [
      { component: 'wifi', icon: 'wifi', title: 'Wi-Fi', text: 'Your phone reaches the Pi over the network.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Switched by a web request.' },
      { pin: 'gpio:11', icon: 'pin', title: 'GPIO17', text: 'Same pin as lesson 4.' },
    ],
    overview: [
      'Because the Pi runs Linux and has Wi-Fi, it can serve a web page. Each button on the page requests a URL, and the matching Python function switches the LED.',
      { steps: ['Install Flask: `sudo apt install python3-flask`.', 'Keep the LED from lesson 4 wired to GPIO17.', 'Run `python3 app.py`, then open `http://raspberrypi.local:5000` on a phone connected to the same Wi-Fi.'] },
      { note: 'Flask’s built-in server is for development on your home network. Do not expose it to the internet.' },
    ],
    wiring: [{ pin: 'gpio:11', to: '330 Ω resistor → LED long leg' }, { pin: 'gpio:9', to: 'LED short leg' }],
    code: [{ file: 'app.py', lang: 'python', trace: { serve: 19, on: 14, off: 16 }, source: `
from flask import Flask
from gpiozero import LED

app = Flask(__name__)
led = LED(17)

@app.route("/")
def index():
    return '<h1>Pi LED</h1><a href="/led/on">On</a> | <a href="/led/off">Off</a>'

@app.route("/led/<state>")
def set_led(state):
    if state == "on":
        led.on()
    else:
        led.off()
    return f'LED is {state}. <a href="/">Back</a>'

app.run(host="0.0.0.0", port=5000)
` }],
    codeNotes: ['`host="0.0.0.0"` makes the server reachable from other devices, not just from the Pi itself.'],
    sim: { type: 'web', url: 'http://raspberrypi.local:5000', led: 'led1', label: 'LED on GPIO17', title: 'Pi LED', start: [' * Serving Flask app \'app\'', ' * Running on http://192.168.1.42:5000', 'Press CTRL+C to quit'] },
    run: { cmd: 'python3 app.py', stop: [] },
    kit: [['1', 'Phone or laptop on the same Wi-Fi']],
  },

  {
    id: 'project',
    title: 'Build a weather station',
    short: 'Build a project',
    summary: 'Combine the BME280, Flask and systemd into a live weather dashboard that starts on boot.',
    icon: 'circuit',
    focus: { pins: ['gpio:1', 'gpio:3', 'gpio:5', 'gpio:9'], components: ['wifi'] },
    circuit: BME_CIRCUIT,
    callouts: [
      { part: 'bme', icon: 'thermo', title: 'Sensor', text: 'Read every time the page asks.' },
      { component: 'soc', icon: 'code', title: 'Flask + systemd', text: 'Serves the page and starts on boot.' },
      { component: 'wifi', icon: 'globe', title: 'Dashboard', text: 'Open it from any device on the network.' },
    ],
    overview: [
      'This project joins three earlier lessons: the I²C sensor from lesson 8, the web server from lesson 10, and a **systemd service** so it starts by itself whenever the Pi boots.',
      { steps: [
        'Wire the BME280 exactly as in lesson 8.',
        'Make a folder `~/weather` with `station.py` and `templates/index.html` from the Code tab.',
        'Test it by hand: `~/env/bin/python station.py`, then open `http://raspberrypi.local:5000`.',
        'Install the service file: `sudo cp weather-station.service /etc/systemd/system/`.',
        'Start it now and on every boot: `sudo systemctl enable --now weather-station`.',
        'Check on it with `systemctl status weather-station` and read its logs with `journalctl -u weather-station -f`.',
      ] },
      VENV_NOTE,
      { h: 'Ideas to extend it' },
      { steps: ['Log a reading every minute to a CSV file and chart the last 24 hours.', 'Light the RGB LED from lesson 6 blue when it is cold and red when it is hot.', 'Add the camera and serve a fresh sky photo every ten minutes.'] },
    ],
    wiring: [{ pin: 'gpio:1', to: 'BME280 **VIN**' }, { pin: 'gpio:3', to: 'BME280 **SDA**' }, { pin: 'gpio:5', to: 'BME280 **SCL**' }, { pin: 'gpio:9', to: 'BME280 **GND**' }],
    code: [
      { file: 'station.py', lang: 'python', trace: { reading: 16 }, source: `
from flask import Flask, jsonify, render_template
import smbus2
import bme280

ADDRESS = 0x76
bus = smbus2.SMBus(1)
calibration = bme280.load_calibration_params(bus, ADDRESS)
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/reading")
def reading():
    data = bme280.sample(bus, ADDRESS, calibration)
    return jsonify(
        temperature=round(data.temperature, 2),
        humidity=round(data.humidity, 1),
        pressure=round(data.pressure, 1),
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
` },
      { file: 'templates/index.html', lang: 'javascript', source: `
<!doctype html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Weather station</title>
<h1>Weather station</h1>
<p>Temperature: <b id="temperature">–</b> °C</p>
<p>Humidity: <b id="humidity">–</b> %</p>
<p>Pressure: <b id="pressure">–</b> hPa</p>
<script>
  async function refresh() {
    const reading = await fetch("/api/reading").then((res) => res.json());
    for (const key of ["temperature", "humidity", "pressure"]) {
      document.getElementById(key).textContent = reading[key];
    }
  }
  refresh();
  setInterval(refresh, 2000);
</script>
` },
      { file: 'weather-station.service', lang: 'ini', source: `
[Unit]
Description=Weather station
After=network-online.target

[Service]
User=pi
WorkingDirectory=/home/pi/weather
ExecStart=/home/pi/env/bin/python station.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
` },
    ],
    codeNotes: ['Change `pi` and `/home/pi` in the service file if you picked a different username in Raspberry Pi Imager.'],
    sim: { type: 'dashboard', url: 'http://raspberrypi.local:5000', sensor: 'bme', start: ['● weather-station.service - Weather station', '     Active: active (running)'] },
    run: { cmd: 'sudo systemctl start weather-station', file: 'station.py', stop: [] },
    kit: [['1', 'BME280 breakout board', 'From lesson 8.'], ['1', 'Case with a vent', 'Keep the sensor away from the Pi’s warm processor for accurate temperatures.']],
  },
];
