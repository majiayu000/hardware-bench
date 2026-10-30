// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine is generic.
// Sources: Milk-V Duo documentation (GPIO pinout table, setup, wiringX) and the duo-examples repository.
import { ledParts, ledWires, BUTTON, buttonWires, PULLUP, pullupWires } from '../../engine/starter-circuit.js';

export const SITE = {
  id: 'learn-milkv-duo',
  title: 'Milk-V Duo: Linux on a Thumb-Sized RISC-V Board',
  accent: '#3a9d7a',
  logicVolts: 3.3,
  shell: 'root@milkv-duo: ~',
  terminalHint: 'Connected over USB at 192.168.42.1. Press Run to start the program.',
};

export const PIN_TYPES = {
  power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'GPIO', analog: 'ADC (1.8 V max)', reset: 'Reset / enable', nc: 'Not connected',
};

const pinTable = (str) => str.split('; ').map((entry, i) => {
  const [name, alt, type] = entry.split('|');
  return alt ? { n: i + 1, name, alt, type } : { n: i + 1, name, type };
});

// Milk-V Duo (CV1800B), top view, millimetres, USB-C on the left, about 51 × 21 mm, in the Pico's
// shape: pins 1–20 along the front, 21–40 along the back. Names and functions follow the GPIO pinout
// table in the Milk-V docs; parts are stylised.
export const BOARD = {
  name: 'Milk-V Duo',
  width: 51,
  depth: 21,
  thickness: 1.2,
  cornerRadius: 1,
  pcbColor: '#1a1d22',
  holes: [],
  silkscreen: [{ text: 'Milk-V Duo', x: 34, z: 15, size: 1.6, weight: 700, align: 'center' }],
  components: [
    { id: 'soc', kind: 'chip', label: 'CV1800B processor', desc: 'A 1 GHz RISC-V C906 core runs Linux, a 700 MHz one runs a small real-time OS, and 64 MB of memory is built in.', shape: 'box', x: 25, z: 10.5, w: 7, d: 7, h: 1, color: '#2a2930', text: 'CV1800B', textColor: 'rgba(205,205,215,0.6)' },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power, and a USB network link to your computer at 192.168.42.1.', shape: 'box', x: 1.6, z: 10.5, w: 7.4, d: 9, h: 3.2, color: '#c3c8d0', metal: true },
    { id: 'sd', label: 'microSD slot', desc: 'On the underside. The whole operating system lives on the card.', shape: 'box', x: 40, z: 10.5, w: 12, d: 12, h: 1.4, color: '#c3c6ca', under: true },
    { id: 'led', kind: 'ledsmd', accent: '#4aa3ff', label: 'Blue LED (GP25)', desc: 'On GP25, which is not on the header. A script blinks it after a good boot.', shape: 'box', x: 14, z: 6, w: 1.6, d: 0.9, h: 0.6, color: '#f1ece2' },
    { id: 'boot', kind: 'button', label: 'Recovery button', desc: 'Used only when recovering the board.', shape: 'box', x: 14, z: 15, w: 3.2, d: 2.6, h: 1.5, color: '#d9d9d9', metal: true },
  ],
  headers: [
    { id: 'front', label: 'Front row: pins 1–20', short: 'Front', desc: 'GP0–GP15 with four grounds. Pin 1 (GP0) is at the USB end.', x: 1.37, z: 19.39, step: [2.54, 0],
      pins: pinTable('GP0|I2C0 SCL|gpio; GP1|I2C0 SDA|gpio; GND||gnd; GP2|UART4 TX, PWM10|gpio; GP3|UART4 RX, PWM11|gpio; GP4|PWM5|gpio; GP5|PWM6|gpio; GND||gnd; GP6|SPI2 SCK, PWM9|gpio; GP7|SPI2 SDO, PWM8|gpio; GP8|SPI2 SDI, PWM7|gpio; GP9|SPI2 CS, PWM4|gpio; GND||gnd; GP10|I2C1 SDA|gpio; GP11|I2C1 SCL|gpio; GP12|UART0 TX|gpio; GP13|UART0 RX|gpio; GND||gnd; GP14||gpio; GP15||gpio') },
    { id: 'back', label: 'Back row: pins 21–40', short: 'Back', desc: 'GP16–GP27, the two ADC pins and the power pins. Pin 40 (VBUS) is at the USB end.', x: 49.63, z: 1.61, step: [-2.54, 0],
      pins: pinTable('GP16|SPI NOR|gpio; GP17|SPI NOR|gpio; GND||gnd; GP18|SPI NOR|gpio; GP19|SPI NOR|gpio; GP20|SPI NOR|gpio; GP21|SPI NOR|gpio; GND||gnd; GP22||gpio; RUN|reset|reset; GP26|ADC1, 1.8 V|analog; GP27|ADC2, 1.8 V|analog; GND||gnd; NC||nc; NC||nc; 3V3|3.3 V out|power3; 3V3_EN|regulator enable|reset; GND||gnd; VSYS|5 V|power5; VBUS|5 V|power5') },
  ].map((h) => ({ layout: 'single', style: 'male', pitch: 2.54, ...h })),
};

// ---------- shared circuit pieces ----------
// The breadboard sits in front of the front row.
const BB = { x: -14, z: 30 };
const GND = 'front:18';
const LED_WIRING = [{ pin: 'front:20', to: '330 Ω resistor → LED **long leg**' }, { pin: GND, to: 'Top **−** rail → LED short leg' }];

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Duo',
    short: 'Meet the board',
    summary: 'A full Linux system on a board the size of a Pico, built around a RISC-V chip.',
    icon: 'board',
    focus: { components: ['soc'] },
    callouts: [
      { component: 'soc', icon: 'chip', title: 'CV1800B', text: 'Two RISC-V cores, 64 MB of memory.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Power and a network link.' },
      { component: 'sd', icon: 'memory', title: 'microSD', text: 'Holds the operating system.' },
      { component: 'led', icon: 'led', title: 'Blue LED', text: 'Blinks after a good boot.' },
    ],
    overview: [
      '**RISC-V** is an open instruction set: anyone can build a chip with it without paying for a licence. The **Milk-V Duo** is one of the cheapest ways to try it. It runs real **Linux** on a board shaped like a Raspberry Pi Pico.',
      'Memory is tiny by Linux standards, just **64 MB**, so there is no desktop and programs are small. You usually write them in C on a PC, cross-compile them, and copy the result across.',
      { tips: [['target', 'Click a pin to see what it can do'], ['info', 'The 256 MB version needs different software'], ['code', 'Pin numbers match the GP names']] },
      { note: 'Most pins are **3.3 V**. The ADC pins GP26 and GP27 accept only **1.8 V**.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Chip', 'CVITEK CV1800B'], ['CPU', 'RISC-V C906 at 1 GHz, plus one at 700 MHz'], ['Memory', '64 MB DDR2 in the package'], ['Storage', 'microSD'], ['Network', 'USB, or an add-on Ethernet board'], ['Size', '51 × 21 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Milk-V Duo with headers'], ['1', 'microSD card'], ['1', 'USB-C data cable'], ['1', 'Half-size breadboard and jumper wires']],
  },

  {
    id: 'setup',
    title: 'Boot and log in',
    summary: 'Write the image to a card, plug in USB, and SSH to 192.168.42.1.',
    icon: 'board',
    focus: { components: ['sd', 'usb', 'led'] },
    callouts: [
      { component: 'sd', icon: 'memory', title: 'microSD', text: 'Write the image here first.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Your computer sees a network.' },
      { component: 'led', icon: 'led', title: 'Blue LED', text: 'Blinking means Linux is running.' },
    ],
    overview: [
      { steps: [
        'Download the Duo image from Milk-V’s GitHub page. Check it says **64 MB**, or **milkv-duo**.',
        'Write it to the card with **balenaEtcher**.',
        'Insert the card and plug USB into your computer. The blue LED starts to blink.',
        'Log in with `ssh root@192.168.42.1`. The default password is **milkv**.',
      ] },
      'The board pretends to be a USB network adapter, so your computer can reach it directly.',
      { note: 'Set your own password with `passwd` if the board ever joins a shared network.' },
      { tips: [['terminal', 'Click the commands in Try it'], ['usb', 'Use a cable that carries data'], ['info', 'If the LED does not blink, the image is at fault: write it again']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'ping -c 2 192.168.42.1', note: 'check the USB network', out: ['64 bytes from 192.168.42.1: icmp_seq=1 ttl=64'] },
        { cmd: 'ssh root@192.168.42.1', note: 'log in', out: ['[root@milkv-duo]~#'] },
        { cmd: 'uname -m', note: 'see the architecture', out: ['riscv64'] },
      ],
    },
    kit: [['1', 'Computer with a card reader']],
  },

  {
    id: 'blink',
    title: 'Blink with wiringX',
    short: 'Blink an LED',
    summary: 'Cross-compile a small C program on a PC, copy it over and blink an LED on GP15.',
    icon: { type: 'led', color: 'red' },
    focus: { pins: ['front:20', GND] },
    circuit: { breadboard: BB, parts: ledParts(330), wires: ledWires('front:20', GND) },
    callouts: [
      { pin: 'front:20', icon: 'pin', title: 'GP15 · pin 20', text: 'Your program switches it.' },
      { pin: GND, icon: 'ground', title: 'GND', text: 'Feeds the top − rail.' },
      { part: 'res1', icon: 'resistor', title: 'Resistor', text: 'Click to try other values.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Lights while the pin is HIGH.' },
    ],
    overview: [
      '**Cross-compiling** means building on one kind of computer for another. Your PC runs an x86 or Arm compiler, but the program it produces is RISC-V. Milk-V’s **duo-examples** repository downloads the right tools for you.',
      { steps: [
        'On an Ubuntu PC clone **duo-examples** and run `source envsetup.sh`. Choose **milkv-duo**.',
        'Copy the `blink` example, change the pin to 15 and run `make`.',
        'Copy the program across with `scp`, then run it on the board.',
      ] },
      'wiringX numbers match the GP names, so GP15 is `15`.',
      { tips: [['terminal', 'Run the program on the board, over SSH'], ['code', '`wiringXSetup()` needs the board’s name'], ['resistor', 'Try other resistors']] },
    ],
    wiring: LED_WIRING,
    code: [{ file: 'blink.c', lang: 'cpp', trace: { on: 15, off: 18 }, source: `
#include <stdio.h>
#include <unistd.h>
#include <wiringx.h>

int main(void) {
  int led = 15;   // GP15, header pin 20

  if (wiringXSetup("milkv_duo", NULL) == -1) {
    wiringXGC();
    return -1;
  }
  pinMode(led, PINMODE_OUTPUT);

  while (1) {
    digitalWrite(led, HIGH);
    printf("LED on\\n");
    sleep(1);
    digitalWrite(led, LOW);
    printf("LED off\\n");
    sleep(1);
  }
  return 0;
}
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on GP15', delay: 1, volts: 3.3 },
    run: { cmd: './blink', stop: [] },
    kit: [['1', 'LED'], ['1', '330 Ω resistor', 'Orange-orange-brown.'], ['3', 'Jumper wires'], ['1', 'Ubuntu PC, or WSL or a virtual machine']],
  },

  {
    id: 'button',
    title: 'Read a push button',
    short: 'Push a button',
    summary: 'A button and a 10 kΩ pull-up on GP14 switch the LED.',
    icon: { type: 'button' },
    focus: { pins: ['front:19', 'front:20', GND, 'back:16'] },
    circuit: { breadboard: BB, parts: [...ledParts(330), PULLUP, BUTTON], wires: [...ledWires('front:20', GND), ...pullupWires('back:16'), ...buttonWires('front:19')] },
    callouts: [
      { part: 'btn1', icon: 'button', title: 'Push button', text: 'Hold it in the scene.' },
      { part: 'res2', icon: 'resistor', title: 'Pull-up', text: 'Holds the pin HIGH.' },
      { pin: 'front:19', icon: 'pin', title: 'GP14', text: 'LOW while pressed.' },
      { pin: 'back:16', icon: 'power', title: '3V3', text: 'Feeds the top + rail.' },
    ],
    overview: [
      'An input pin left unconnected picks up noise and reads at random. The **10 kΩ pull-up** holds it HIGH until the button connects it to ground, so it reads **LOW while pressed**.',
      { tips: [['button', 'Hold the button in the 3D view'], ['resistor', 'The pull-up goes to 3V3, never to 5 V'], ['code', 'Use `usleep()` for short delays']] },
    ],
    wiring: [...LED_WIRING, { pin: 'back:16', to: 'Top **+** rail → 10 kΩ resistor → column 20' }, { pin: 'front:19', to: 'Column 20, one side of the button' }],
    code: [{ file: 'button.c', lang: 'cpp', trace: { wait: 15, pressed: 16, released: 16 }, source: `
#include <unistd.h>
#include <wiringx.h>

int main(void) {
  int led = 15, button = 14;

  if (wiringXSetup("milkv_duo", NULL) == -1) {
    wiringXGC();
    return -1;
  }
  pinMode(led, PINMODE_OUTPUT);
  pinMode(button, PINMODE_INPUT);

  while (1) {
    int pressed = digitalRead(button) == LOW;
    digitalWrite(led, pressed ? HIGH : LOW);
    usleep(20000);
  }
  return 0;
}
` }],
    sim: { type: 'button', button: 'btn1', led: 'led1', label: 'LED on GP15' },
    run: { cmd: './button', stop: [] },
    kit: [['1', 'Tactile push button'], ['1', '10 kΩ resistor', 'Brown-black-orange.'], ['3', 'More jumper wires']],
  },
];
