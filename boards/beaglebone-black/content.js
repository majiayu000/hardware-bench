// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: BeagleBone Black System Reference Manual (P8/P9 connector tables), the BeagleBoard
// cape interface spec, and Adafruit's Adafruit_BBIO guide (GPIO and ADC).
import { ledParts, ledWires, BUTTON, buttonWires, POT, potWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-beaglebone-black',
  title: 'BeagleBone Black: 92 Pins and Linux',
  accent: '#2f6f8f',
  logicVolts: 3.3,
  pinLimitMa: 6,
  shell: 'debian@beaglebone: ~',
  terminalHint: 'Connected over USB at 192.168.7.2. Press Run to start the script.',
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'GPIO (3.3 V)', analog: 'Analog input (1.8 V max)',
  i2c: 'I²C', spi: 'SPI', uart: 'Serial', pwm: 'PWM', reset: 'Reset / power button', flash: 'Used by eMMC or HDMI',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// BeagleBone Black, top view, millimetres, 86.36 × 54.61 mm, Ethernet and power on the left. P8 runs
// along the top edge and P9 along the bottom, pin 1 of both at the Ethernet end. Signal names follow
// the System Reference Manual's connector tables; header and part positions are stylised.
export const BOARD = {
  name: 'BeagleBone Black',
  width: 86.36,
  depth: 54.61,
  thickness: 1.6,
  cornerRadius: 6,
  pcbColor: '#1a1a1e',
  holes: [{ x: 14, z: 3.2, r: 1.6 }, { x: 80, z: 6.4, r: 1.6 }, { x: 14, z: 51.4, r: 1.6 }, { x: 80, z: 48.2, r: 1.6 }],
  silkscreen: [{ text: 'BeagleBone Black', x: 55, z: 38, size: 2.2, weight: 700, align: 'center' }],
  components: [
    { id: 'soc', kind: 'chip', label: 'TI AM3358 processor', desc: 'A 1 GHz Arm Cortex-A8, plus two PRU microcontrollers that run alongside Linux for precise timing.', shape: 'box', x: 50, z: 24, w: 13, d: 13, h: 1.3, color: '#2a2930', text: 'AM3358', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'ram', kind: 'chip', label: '512 MB DDR3 memory', desc: 'The computer’s working memory.', shape: 'box', x: 31, z: 25, w: 10, d: 12, h: 1.1, color: '#2a2930' },
    { id: 'emmc', kind: 'chip', label: '4 GB eMMC', desc: 'Storage soldered to the board. Debian comes installed, so it boots with no card.', shape: 'box', x: 68, z: 26, w: 11, d: 11, h: 1, color: '#2a2930' },
    { id: 'eth', kind: 'ethernet', label: 'Ethernet', desc: '10/100 Mbit network port.', shape: 'box', x: 7.5, z: 15, w: 15, d: 16, h: 13, color: '#c3c8d0' },
    { id: 'jack', kind: 'dcjack', label: '5 V barrel jack', desc: 'Optional 5 V input. USB alone is enough for these lessons.', shape: 'box', x: 7, z: 37, w: 14, d: 9, h: 11, color: '#24232b' },
    { id: 'usbc', kind: 'usb', label: 'Mini-USB client port', desc: 'Power, and a network link to your computer at 192.168.7.2.', shape: 'box', x: 84, z: 41, w: 8, d: 8, h: 4, color: '#c3c8d0', metal: true },
    { id: 'usba', kind: 'usb', label: 'USB host port', desc: 'For a keyboard, a Wi-Fi dongle or a drive.', shape: 'box', x: 81, z: 18, w: 14, d: 13, h: 7, color: '#c3c8d0', metal: true },
    { id: 'hdmi', kind: 'hdmi', label: 'Micro-HDMI', desc: 'Display output.', shape: 'box', x: 84.5, z: 30, w: 7, d: 7, h: 3, color: '#bfc5ce' },
    { id: 'usr', kind: 'ledsmd', accent: '#4aa3ff', label: 'USR0–USR3 LEDs', desc: 'Four blue LEDs. By default they show a heartbeat, card activity, CPU activity and eMMC activity.', shape: 'box', x: 20, z: 10, w: 5, d: 1.2, h: 0.6, color: '#f1ece2' },
    { id: 'boot', kind: 'button', label: 'BOOT button', desc: 'Hold it during power-up to start from the microSD card.', shape: 'box', x: 67, z: 11, w: 3, d: 3, h: 1.5, color: '#d9d9d9', metal: true },
    { id: 'sd', label: 'microSD slot', desc: 'On the underside. Use it to flash a new image.', shape: 'box', x: 76, z: 41, w: 12, d: 12, h: 1.4, color: '#c3c6ca', under: true },
  ],
  headers: [
    { id: 'p8', label: 'P8 header', short: 'P8', desc: 'Mostly GPIO. Pins 27–46 carry the HDMI signals and 3–6, 20–25 the eMMC, so they need extra setup before you can use them.', z: 4.8,
      pins: pinTable('GND||gnd; GND||gnd; GPIO1_6|eMMC|flash; GPIO1_7|eMMC|flash; GPIO1_2|eMMC|flash; GPIO1_3|eMMC|flash; TIMER4|gpio2[2]|gpio; TIMER7|gpio2[3]|gpio; TIMER5|gpio2[5]|gpio; TIMER6|gpio2[4]|gpio; GPIO1_13||gpio; GPIO1_12||gpio; EHRPWM2B|gpio0[23]|pwm; GPIO0_26||gpio; GPIO1_15||gpio; GPIO1_14||gpio; GPIO0_27||gpio; GPIO2_1||gpio; EHRPWM2A|gpio0[22]|pwm; GPIO1_31|eMMC|flash; GPIO1_30|eMMC|flash; GPIO1_5|eMMC|flash; GPIO1_4|eMMC|flash; GPIO1_1|eMMC|flash; GPIO1_0|eMMC|flash; GPIO1_29||gpio; GPIO2_22|HDMI|flash; GPIO2_24|HDMI|flash; GPIO2_23|HDMI|flash; GPIO2_25|HDMI|flash; UART5_CTSN|HDMI|flash; UART5_RTSN|HDMI|flash; UART4_RTSN|HDMI|flash; UART3_RTSN|HDMI|flash; UART4_CTSN|HDMI|flash; UART3_CTSN|HDMI|flash; UART5_TXD|HDMI|flash; UART5_RXD|HDMI|flash; GPIO2_12|HDMI|flash; GPIO2_13|HDMI|flash; GPIO2_10|HDMI|flash; GPIO2_11|HDMI|flash; GPIO2_8|HDMI|flash; GPIO2_9|HDMI|flash; GPIO2_6|HDMI|flash; GPIO2_7|HDMI|flash') },
    { id: 'p9', label: 'P9 header', short: 'P9', desc: 'Power at one end, analog inputs at the other, and I²C, SPI, serial and PWM between. All signals are 3.3 V, and the analog pins 1.8 V.', z: 52.3,
      pins: pinTable('GND||gnd; GND||gnd; DC_3.3V||power3; DC_3.3V||power3; VDD_5V|barrel jack only|power5; VDD_5V|barrel jack only|power5; SYS_5V||power5; SYS_5V||power5; PWR_BUT||reset; SYS_RESETn||reset; UART4_RXD|gpio0[30]|uart; GPIO1_28||gpio; UART4_TXD|gpio0[31]|uart; EHRPWM1A|gpio1[18]|pwm; GPIO1_16||gpio; EHRPWM1B|gpio1[19]|pwm; I2C1_SCL|gpio0[5]|i2c; I2C1_SDA|gpio0[4]|i2c; I2C2_SCL|gpio0[13]|i2c; I2C2_SDA|gpio0[12]|i2c; UART2_TXD|gpio0[3]|uart; UART2_RXD|gpio0[2]|uart; GPIO1_17||gpio; UART1_TXD|gpio0[15]|uart; GPIO3_21||gpio; UART1_RXD|gpio0[14]|uart; GPIO3_19||gpio; SPI1_CS0|gpio3[17]|spi; SPI1_D0|gpio3[15]|spi; SPI1_D1|gpio3[16]|spi; SPI1_SCLK|gpio3[14]|spi; VADC|1.8 V reference|analog; AIN4||analog; AGND|analog ground|gnd; AIN6||analog; AIN5||analog; AIN2||analog; AIN3||analog; AIN0||analog; AIN1||analog; CLKOUT2|gpio0[20]|gpio; GPIO0_7||gpio; GND||gnd; GND||gnd; GND||gnd; GND||gnd') },
  ].map((h) => ({ layout: 'dual', style: 'female', pitch: 2.54, x: 21.5, step: [2.54, 0], rowStep: [0, -2.54], ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of P9.
const BB = { x: 8, z: 62 };
const GND = 'p9:1';
const LED_WIRING = [{ pin: 'p9:12', to: '470 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }];

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the BeagleBone',
    short: 'Meet the board',
    summary: 'A Linux computer built for hardware: 92 header pins and two real-time helper processors.',
    icon: 'board',
    focus: { components: ['soc'] },
    callouts: [
      { component: 'soc', icon: 'chip', title: 'AM3358', text: 'Linux plus two PRU cores.' },
      { pin: 'p8:11', icon: 'pin', title: 'P8', text: 'Mostly GPIO.' },
      { pin: 'p9:39', icon: 'knob', title: 'P9 analog', text: 'Seven inputs, 1.8 V maximum.' },
      { component: 'emmc', icon: 'memory', title: 'eMMC', text: 'Debian comes installed.' },
      { component: 'usbc', icon: 'usb', title: 'Mini-USB', text: 'Power and a network link.' },
    ],
    overview: [
      'The **BeagleBone Black** is slower than a modern Raspberry Pi, but it was built for connecting to hardware. Its two headers bring out **92 pins**, it has **seven analog inputs**, and its two **PRU** processors run beside Linux with exact timing, which is why it turns up in robots and industrial machines.',
      'You do not need a screen or a card: plug in one USB cable and it starts Linux from its own storage.',
      { tips: [['target', 'Click a pin to see its signal name'], ['code', 'Pins are named by header: "P9_12"'], ['info', 'Many P8 pins are taken by HDMI and eMMC']] },
      { note: 'GPIO pins are **3.3 V**, and the analog inputs are **1.8 V maximum**. Do not drive any pin before the board has finished starting up. Too much voltage on these pins can destroy the processor.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Processor', 'TI AM3358, Arm Cortex-A8, 1 GHz'], ['Memory', '512 MB DDR3'], ['Storage', '4 GB eMMC, microSD'], ['Real-time', '2 × PRU 32-bit microcontrollers'], ['Headers', 'P8 and P9, 46 pins each'], ['Analog', '7 inputs, 12-bit, 1.8 V']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'BeagleBone Black'], ['1', 'Mini-USB data cable'], ['1', 'Half-size breadboard'], ['1', 'Jumper wire kit']],
  },

  {
    id: 'setup',
    title: 'Log in over USB',
    summary: 'One USB cable gives you power and a network link at 192.168.7.2.',
    icon: 'board',
    focus: { components: ['usbc', 'usr'] },
    callouts: [
      { component: 'usbc', icon: 'usb', title: 'Mini-USB', text: 'Plug into your computer.' },
      { component: 'usr', icon: 'led', title: 'USR LEDs', text: 'Blinking means Linux is starting.' },
    ],
    overview: [
      { steps: [
        'Plug the Mini-USB port into your computer. The USR LEDs start to flicker.',
        'Wait about a minute for Linux to start.',
        'Log in with `ssh debian@192.168.7.2`. The password is printed in the login message.',
        'Install the pin library: `sudo apt install python3-pip`, then `sudo pip3 install Adafruit_BBIO`.',
      ] },
      'Current images on beagleboard.org are newer than the one on the board. If the software is very old, flash a fresh image to a microSD card first.',
      { tips: [['terminal', 'Click the commands in Try it'], ['usb', 'Use a cable that carries data'], ['info', 'Share your computer’s internet to install packages, or use Ethernet']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'ssh debian@192.168.7.2', note: 'log in', out: ['debian@beaglebone:~$'] },
        { cmd: 'uname -m', note: 'see the architecture', out: ['armv7l'] },
        { cmd: 'sudo pip3 install Adafruit_BBIO', note: 'install the pin library', out: ['Successfully installed Adafruit-BBIO'] },
      ],
    },
    kit: [['1', 'Computer with an SSH client']],
  },

  {
    id: 'blink',
    title: 'Blink an LED',
    summary: 'Adafruit_BBIO switches P9_12 and names each pin by its header.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['p9:12', GND] },
    circuit: { breadboard: BB, parts: ledParts(470), wires: ledWires('p9:12', GND) },
    callouts: [
      { pin: 'p9:12', icon: 'pin', title: 'P9_12', text: 'Your code switches it.' },
      { pin: GND, icon: 'ground', title: 'P9_1 · GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while the pin is HIGH.' },
    ],
    overview: [
      'Pins are named by header and position, so **"P9_12"** is pin 12 on P9. The processor’s pins supply only a few milliamps, so this lesson uses a **470 Ω** resistor.',
      { tips: [['led', 'The USR LEDs can be blinked too: try "USR3"'], ['resistor', 'Try 1 kΩ: dimmer, still visible'], ['code', 'Stop the script with Ctrl+C']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.py', lang: 'python', trace: { on: 8, off: 10 }, source: `
import time
import Adafruit_BBIO.GPIO as GPIO

LED = 'P9_12'
GPIO.setup(LED, GPIO.OUT)

while True:
    GPIO.output(LED, GPIO.HIGH)
    time.sleep(1)
    GPIO.output(LED, GPIO.LOW)
    time.sleep(1)
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on P9_12', delay: 1, volts: 3.3 },
    run: { cmd: 'sudo python3 blink.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'LED'], ['1', '470 Ω resistor', 'Yellow-violet-brown.'], ['3', 'Jumper wires']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button on P9_15 with a pull-up switches the LED.',
    icon: { type: 'button' },
    focus: { pins: ['p9:15', 'p9:12', GND] },
    circuit: { breadboard: BB, parts: [...ledParts(470), BUTTON], wires: [...ledWires('p9:12', GND), ...buttonWires('p9:15')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { pin: 'p9:15', icon: 'pin', title: 'P9_15', text: 'LOW while pressed.' },
    ],
    overview: [
      '`pull_up_down=GPIO.PUD_UP` turns on a resistor inside the chip that holds the pin HIGH. The button pulls it to ground, so it reads **LOW while pressed**.',
      { tips: [['button', 'Hold the button in the 3D view'], ['code', '`GPIO.input()` returns 1 or 0'], ['led', 'The LED from the last lesson stays']] },
    ],
    wiring: [...LED_WIRING, { pin: 'p9:15', to: 'Column 20, one side of the button' }],
    code: [{ file: 'button.py', lang: 'python', trace: { wait: 9, pressed: 10, released: 10 }, source: `
import time
import Adafruit_BBIO.GPIO as GPIO

LED, BUTTON = 'P9_12', 'P9_15'
GPIO.setup(LED, GPIO.OUT)
GPIO.setup(BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
    pressed = GPIO.input(BUTTON) == GPIO.LOW
    GPIO.output(LED, GPIO.HIGH if pressed else GPIO.LOW)
    time.sleep(0.02)
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on P9_12' },
    run: { cmd: 'sudo python3 button.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'Tactile push button'], ['2', 'More jumper wires']],
  },

  {
    id: 'knob',
    title: 'Read a knob at 1.8 V',
    short: 'Read a knob',
    summary: 'A potentiometer between the 1.8 V reference and analog ground, read on AIN0.',
    icon: { type: 'pot' },
    focus: { pins: ['p9:39', 'p9:32', 'p9:34'] },
    circuit: { breadboard: BB, parts: [POT], wires: potWires('p9:39', 'p9:32', 'p9:34') },
    callouts: [
      { part: 'pot1', icon: 'knob', title: 'Potentiometer', text: 'Click it to turn the knob.' },
      { pin: 'p9:39', icon: 'wave', title: 'P9_39 · AIN0', text: 'Measures 0–1.8 V.' },
      { pin: 'p9:32', icon: 'power', title: 'P9_32 · VADC', text: '1.8 V reference. Never 3.3 V!' },
      { pin: 'p9:34', icon: 'ground', title: 'P9_34 · AGND', text: 'Analog ground.' },
    ],
    overview: [
      'Linux boards like the Raspberry Pi have no analog inputs at all. The BeagleBone has seven, but they accept only **1.8 V**. Power the potentiometer from **VADC** (P9_32) and **AGND** (P9_34), and it cannot go over the limit.',
      { tips: [['knob', 'Click the knob in the 3D view'], ['code', '`ADC.read()` returns 0.0 to 1.0'], ['wave', '`ADC.read_raw()` returns 0 to 4095']] },
      { note: 'Never connect 3.3 V to an AIN pin. It can permanently damage the processor.', tone: 'warn' },
    ],
    wiring: [{ pin: 'p9:32', to: '+ rail → potentiometer outer leg' }, { pin: 'p9:39', to: 'Potentiometer **middle leg**' }, { pin: 'p9:34', to: '− rail → potentiometer other leg' }],
    code: [{ file: 'knob.py', lang: 'python', trace: { read: 7 }, source: `
import time
import Adafruit_BBIO.ADC as ADC

ADC.setup()

while True:
    level = ADC.read('P9_39')
    print('raw:', int(level * 4095), ' voltage:', int(level * 1800), 'mV')
    time.sleep(0.5)
` }],
    sim: { type: 'knob', pot: 'pot1', label: 'AIN0 voltage', vmax: 1.8, max: 4095, every: 0.5 },
    run: { cmd: 'sudo python3 knob.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', '10 kΩ potentiometer'], ['5', 'Jumper wires']],
  },
];
