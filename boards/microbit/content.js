// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin map and the lessons. The engine (app.js, board3d.js, sims.js) is generic.

export const SITE = {
  id: 'learn-microbit',
  title: 'BBC micro:bit V2: Code Your First Gadgets',
  accent: '#00a3a6',
  logicVolts: 3,
  pinLimitMa: 5,
  shell: 'Serial · MicroPython',
  terminalHint: 'micro:bit connected over USB. Press Run to flash the program from the Python Editor.',
  runPreamble: ['Flashing micro:bit…', 'Done: running your program.'],
};

export const PIN_TYPES = { analog: 'Pin with analog, touch and PWM', power3: '3 V power', gnd: 'Ground' };

// BBC micro:bit V2, front face up, millimetres, the edge connector along the front (bottom) edge.
// Pins and their functions follow the micro:bit Foundation's V2 edge-connector page: five large ring
// pads (0, 1, 2, 3V, GND) among 20 small strips on a 1.27 mm pitch. Only the rings are modelled as
// pins, because crocodile clips and jumper wires go there; the small strips need an edge-connector
// breakout. Ring positions, the 51.6 × 42 mm outline and the parts on the board are stylised.
// Most chips sit on the back of the real board; they are drawn underneath here.
export const BOARD = {
  name: 'BBC micro:bit V2',
  width: 51.6,
  depth: 42,
  thickness: 1.6,
  cornerRadius: 3,
  pcbColor: '#1c1d22',
  holes: [],
  silkscreen: [{ text: 'A', x: 6.5, z: 13.5, size: 2.4, weight: 700, align: 'center' }, { text: 'B', x: 45.1, z: 13.5, size: 2.4, weight: 700, align: 'center' },
    { text: '0', x: 4.9, z: 32.5, size: 2, weight: 700, align: 'center' }, { text: '1', x: 15.3, z: 32.5, size: 2, weight: 700, align: 'center' }, { text: '2', x: 25.8, z: 32.5, size: 2, weight: 700, align: 'center' },
    { text: '3V', x: 36.2, z: 32.5, size: 2, weight: 700, align: 'center' }, { text: 'GND', x: 46.6, z: 32.5, size: 1.8, weight: 700, align: 'center' }],
  components: [
    { id: 'display', kind: 'ledmatrix', grid: [5, 5], accent: '#ff4a3a', label: 'LED display (5 × 5)', desc: '25 red LEDs, each with 10 brightness levels (0–9). They can also sense how much light falls on them.', shape: 'box', x: 25.8, z: 19, w: 17, d: 17, h: 0.6, color: '#1c1d22' },
    { id: 'btnA', kind: 'button', accent: '#2b2a30', label: 'Button A', desc: 'button_a in MicroPython.', shape: 'box', x: 6.5, z: 19, w: 6, d: 6, h: 3, color: '#c9ced6' },
    { id: 'btnB', kind: 'button', accent: '#2b2a30', label: 'Button B', desc: 'button_b in MicroPython.', shape: 'box', x: 45.1, z: 19, w: 6, d: 6, h: 3, color: '#c9ced6' },
    { id: 'logo', label: 'Touch logo', desc: 'A touch sensor shaped like the micro:bit face: pin_logo.is_touched().', shape: 'box', x: 25.8, z: 5, w: 9, d: 4, h: 0.3, color: '#c9a44c' },
    { id: 'mic', kind: 'ledsmd', accent: '#ff4a3a', label: 'Microphone and its LED', desc: 'A MEMS microphone; the small LED next to the hole lights while it is listening.', shape: 'box', x: 32.5, z: 5, w: 1.6, d: 1.6, h: 0.6, color: '#f1ece2' },
    { id: 'mcu', under: true, label: 'nRF52833 processor (on the back)', desc: 'A 64 MHz Arm Cortex-M4 with 128 KB RAM and 512 KB flash, plus the Bluetooth radio.', shape: 'box', x: 26, z: 22, w: 7, d: 7, h: 0.9, color: '#2a2930' },
    { id: 'motion', under: true, label: 'Motion sensor (on the back)', desc: 'An accelerometer and compass: tilt, shake and direction.', shape: 'box', x: 14, z: 26, w: 3, d: 3, h: 0.9, color: '#2a2930' },
    { id: 'speaker', under: true, label: 'Speaker (on the back)', desc: 'A built-in speaker for music and sound effects.', shape: 'box', x: 38, z: 25, w: 10, d: 10, h: 3, color: '#2a2930' },
    { id: 'usb', under: true, label: 'Micro-USB port (on the back)', desc: 'Power and programming. The micro:bit shows up on your computer as a drive called MICROBIT.', shape: 'box', x: 25.8, z: 1.5, w: 8, d: 5, h: 2.8, color: '#c3c6ca' },
    { id: 'battery', under: true, label: 'Battery connector (on the back)', desc: 'For a 2 × AAA battery pack (3 V), so the micro:bit runs without a computer.', shape: 'box', x: 38, z: 3, w: 6, d: 4, h: 3, color: '#e9e6dd' },
    { id: 'strips', label: 'Edge-connector strips', desc: 'The 20 thin gold strips between the rings: more pins, reached with an edge-connector breakout board.', shape: 'box', x: 25.8, z: 40.6, w: 50, d: 2.4, h: 0.2, color: '#c9a44c' },
  ],
  headers: [{
    id: 'rings', label: 'Edge connector rings', short: 'Ring', desc: 'The five large pads: pins 0, 1 and 2 plus 3 V and ground. Crocodile clips or 4 mm plugs fit through the holes.',
    layout: 'single', style: 'pad', pitch: 10.4, padW: 7.6, padD: 7, padHole: 4, x: 4.9, z: 37.8, step: [10.4, 0],
    pins: [{ n: 1, name: 'P0', alt: 'pin0: analog, touch, PWM', type: 'analog' }, { n: 2, name: 'P1', alt: 'pin1: analog, touch, PWM', type: 'analog' },
      { n: 3, name: 'P2', alt: 'pin2: analog, touch, PWM', type: 'analog' }, { n: 4, name: '3V', alt: '3 V out (or in from a battery)', type: 'power3' }, { n: 5, name: 'GND', alt: 'ground', type: 'gnd' }],
  }],
};

const BB = { x: -14, z: 52 };
const RUN = { cmd: 'python.microbit.org ▶ Send to micro:bit', stop: [] };
// Matrix frames: one string per row, brightness 0–7 for the panel (the real display goes to 9).
const F = (s, ms, log, trace) => ({ rows: s.split(':').map((r) => r.replace(/9/g, '7')), ms, log, trace });
const IMG = {
  heart: '09090:99999:99999:09990:00900', small: '00000:09090:09990:00900:00000',
  happy: '00000:09090:00000:90009:09990', sad: '00000:09090:00000:09990:90009', yes: '00000:00009:00090:90900:09000',
  H: '90009:90009:99999:90009:90009', i: '00900:00000:00900:00900:00900',
  d4: '00990:09090:99999:00090:00090', d2: '09990:00009:00990:09000:99999', d6: '00990:09000:99990:90009:09990',
  blank: '00000:00000:00000:00000:00000',
};

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the micro:bit',
    short: 'Meet the board',
    summary: 'A pocket-sized computer with lights, buttons, sensors, a speaker and a radio already built in.',
    icon: 'board',
    focus: { components: ['display'] },
    callouts: [
      { component: 'display', icon: 'led', title: 'LED display', text: '25 red lights in a 5 × 5 grid.' },
      { component: 'btnA', icon: 'button', title: 'Buttons A and B', text: 'Your two inputs.' },
      { component: 'logo', icon: 'target', title: 'Touch logo', text: 'Touch it like a button.' },
      { component: 'mic', icon: 'sound', title: 'Microphone', text: 'Hears claps and voices.' },
      { pin: 'rings:1', icon: 'pin', title: 'Rings 0, 1, 2', text: 'Clip on your own parts.' },
    ],
    overview: [
      'The **BBC micro:bit** was made for classrooms, so everything you need for the first projects is already on the board: a **5 × 5 LED display**, two **buttons**, a **touch logo**, a **microphone**, a **speaker**, a **motion sensor**, a **thermometer** and a **radio**.',
      'You will program it in **MicroPython** in the free online editor at python.microbit.org. No installation: the editor sends your program over USB.',
      { tips: [['target', 'Click a part to read about it'], ['rotr', 'Drag to look underneath: most chips are on the back'], ['info', 'The numbers on the board match the key']] },
      { h: 'Specifications' },
      { specs: [['Processor', 'nRF52833, Arm Cortex-M4, 64 MHz'], ['Memory', '128 KB RAM, 512 KB flash'], ['Display', '5 × 5 red LEDs'], ['Sensors', 'Motion, compass, light, temperature, sound'], ['Radio', 'Bluetooth and micro:bit radio'], ['Power', 'USB or 2 × AAA (3 V)']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'BBC micro:bit V2', 'V2 has the speaker, microphone and touch logo.'], ['1', 'Micro-USB data cable'], ['1', '2 × AAA battery pack (optional)']],
  },

  {
    id: 'hello',
    title: 'Say hello',
    summary: 'Your first program: scroll a message across the display.',
    icon: 'board',
    focus: { components: ['display'] },
    callouts: [{ component: 'display', icon: 'led', title: 'Display', text: 'display.scroll() moves text across it.' }],
    overview: [
      'Open **python.microbit.org**, connect the micro:bit with USB, and replace the starter code with the program on the right. Press **Send to micro:bit**: the first time, the browser asks which device to connect to.',
      '`from microbit import *` brings in everything on the board. `display.scroll()` slides text across the 5 × 5 display one column at a time.',
      { tips: [['led', 'Press Run in Try it to see the letters'], ['code', 'Change the text, then send again'], ['clock', 'scroll() waits until the text has passed']] },
      { note: 'The Python Editor needs a browser that supports WebUSB (Chrome or Edge). In others, download the .hex file and drag it onto the MICROBIT drive.' },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { scroll: 4 }, source: `
from microbit import *

while True:
    display.scroll("Hi")
` }],
    sim: { type: 'matrix', color: '#ff4a3a', caption: 'Press Run to send the program.', frames: [F(IMG.H, 700, 'scrolling: Hi', 'scroll'), F(IMG.i, 700, null, 'scroll'), F(IMG.blank, 400, null, 'scroll')] },
    run: RUN,
    kit: [['1', 'Computer with Chrome or Edge']],
  },

  {
    id: 'images',
    title: 'Show a heartbeat',
    summary: 'Built-in pictures and `sleep()` make a simple animation.',
    icon: 'board',
    focus: { components: ['display'] },
    callouts: [{ component: 'display', icon: 'led', title: 'Display', text: 'display.show() shows one picture.' }],
    overview: [
      'MicroPython has dozens of built-in pictures: `Image.HEART`, `Image.HAPPY`, `Image.ARROW_N` and many more. Showing two of them in turn with a pause between makes an animation.',
      '`sleep(500)` waits 500 milliseconds, half a second.',
      { tips: [['led', 'Press Run in Try it'], ['clock', 'Shorter sleeps make a faster heartbeat'], ['code', 'Try Image.DUCK or Image.GHOST']] },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { big: 4, small: 6 }, source: `
from microbit import *

while True:
    display.show(Image.HEART)
    sleep(500)
    display.show(Image.HEART_SMALL)
    sleep(500)
` }],
    sim: { type: 'matrix', color: '#ff4a3a', frames: [F(IMG.heart, 500, null, 'big'), F(IMG.small, 500, null, 'small')] },
    run: RUN,
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'buttons',
    title: 'Use the buttons',
    summary: 'Show a happy face for button A and a sad one for button B.',
    icon: 'board',
    focus: { components: ['btnA', 'btnB'] },
    callouts: [
      { component: 'btnA', icon: 'button', title: 'Button A', text: 'button_a.was_pressed()' },
      { component: 'btnB', icon: 'button', title: 'Button B', text: 'button_b.was_pressed()' },
      { component: 'display', icon: 'led', title: 'Display', text: 'Shows the answer.' },
    ],
    overview: [
      '`was_pressed()` answers “has this button been pressed since I last asked?”. It never misses a quick press, even if your program was busy.',
      'The loop checks both buttons ten times a second and shows a face for whichever one was pressed.',
      { tips: [['button', 'The Try it panel plays an A press, then a B press'], ['code', 'is_pressed() instead tells you if it is held down right now'], ['target', 'pin_logo.is_touched() works the same way for the logo']] },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { a: 5, b: 8 }, source: `
from microbit import *

while True:
    if button_a.was_pressed():
        display.show(Image.HAPPY)
        print("A pressed")
    elif button_b.was_pressed():
        display.show(Image.SAD)
        print("B pressed")
    sleep(100)
` }],
    sim: { type: 'matrix', color: '#ff4a3a', frames: [F(IMG.happy, 1400, 'A pressed', 'a'), F(IMG.sad, 1400, 'B pressed', 'b')] },
    run: RUN,
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'dice',
    title: 'Shake a dice',
    summary: 'The motion sensor spots a shake; `random` picks a number from 1 to 6.',
    icon: 'board',
    focus: { components: ['motion'] },
    callouts: [
      { component: 'motion', icon: 'wave', title: 'Motion sensor', text: 'Recognises a shake.' },
      { component: 'display', icon: 'led', title: 'Display', text: 'Shows the roll.' },
    ],
    overview: [
      'The accelerometer measures how the board is moving. MicroPython turns its readings into **gestures**: `"shake"`, `"up"`, `"face down"`, `"freefall"` and more. `was_gesture("shake")` is true once after each shake.',
      '`random.randint(1, 6)` gives a whole number from 1 to 6, each equally likely.',
      { tips: [['wave', 'In the editor’s simulator you can shake with a button'], ['code', 'accelerometer.get_x() gives the raw tilt instead'], ['led', 'display.show() can show a number too']] },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { roll: 7 }, source: `
from microbit import *
import random

while True:
    if accelerometer.was_gesture("shake"):
        roll = random.randint(1, 6)
        display.show(roll)
        print("rolled", roll)
` }],
    sim: { type: 'matrix', color: '#ff4a3a', caption: 'Each frame is one shake.', frames: [F(IMG.d4, 1200, 'rolled 4', 'roll'), F(IMG.d2, 1200, 'rolled 2', 'roll'), F(IMG.d6, 1200, 'rolled 6', 'roll')] },
    run: RUN,
    kit: [['–', 'Nothing extra (a battery pack makes shaking easier)']],
  },

  {
    id: 'music',
    title: 'Play music',
    summary: 'The built-in speaker plays notes written as text, like "C4:4".',
    icon: 'board',
    focus: { components: ['speaker'] },
    callouts: [{ component: 'speaker', icon: 'sound', title: 'Speaker', text: 'On the back of the board.' }],
    overview: [
      'Each note is written as **name, octave and length**: `"C4:4"` is middle C held for 4 ticks. `music.play()` plays a single note or a whole list.',
      'The speaker is on the back. `speaker.off()` silences it if you connect headphones to pin 0 instead.',
      { tips: [['sound', 'Turn the sound on in Try it to hear it'], ['code', 'music.play(music.BIRTHDAY) plays a built-in tune'], ['clock', 'music.set_tempo(bpm=160) speeds it up']] },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { tone: 7 }, source: `
from microbit import *
import music

tune = ["C4:4", "E4:4", "G4:4", "C5:8"]
for note in tune:
    print(note)
    music.play(note)
` }],
    sim: { type: 'buzzer', log: '{name}', melody: [['C4:4', 262, 500], ['E4:4', 330, 500], ['G4:4', 392, 500], ['C5:8', 523, 1000]] },
    run: RUN,
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'sound',
    title: 'Measure loudness',
    summary: 'The microphone reports a sound level from 0 to 255; show a big square when it gets loud.',
    icon: 'board',
    focus: { components: ['mic'] },
    callouts: [
      { component: 'mic', icon: 'sound', title: 'Microphone', text: 'The hole next to the logo.' },
      { component: 'display', icon: 'led', title: 'Display', text: 'Big square when loud.' },
    ],
    overview: [
      '`microphone.sound_level()` gives the current loudness from **0** (silent) to **255** (very loud). The red LED beside the microphone hole lights while the microphone is in use.',
      'Comparing the level with a threshold turns the micro:bit into a clap detector or a noise meter for the classroom.',
      { tips: [['sound', 'Drag the loudness in Try it'], ['code', 'microphone.was_event(SoundEvent.LOUD) catches claps'], ['led', 'Change 100 to set how loud is “loud”']] },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { read: 4 }, source: `
from microbit import *

while True:
    level = microphone.sound_level()     # 0 - 255
    print(level)
    display.show(Image.SQUARE if level > 100 else Image.SQUARE_SMALL)
    sleep(100)
` }],
    sim: { type: 'knob', slider: 'loudness', readout: 'raw', label: 'sound level', max: 255, every: 0.2, log: '{raw}', caption: 'Drag the loudness to simulate a quiet room, talking or a clap.' },
    run: RUN,
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'temp',
    title: 'Read the temperature',
    summary: '`temperature()` reads the processor’s built-in sensor in whole degrees Celsius.',
    icon: 'board',
    focus: { components: ['mcu'] },
    callouts: [
      { component: 'mcu', icon: 'thermo', title: 'Processor', text: 'Its sensor measures the board.' },
      { component: 'display', icon: 'led', title: 'Display', text: 'Scrolls the reading.' },
    ],
    overview: [
      'The temperature sensor is inside the processor, so it measures the **board**, which is usually a degree or two warmer than the room. Holding the micro:bit in your hand warms it up quickly.',
      { tips: [['thermo', 'Press “Breathe on the sensor” in Try it'], ['code', 'str() turns the number into text for scroll()'], ['info', 'Log readings to a battery-powered micro:bit for a day']] },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { read: 4 }, source: `
from microbit import *

while True:
    t = temperature()
    print(t, "°C")
    display.scroll(str(t))
` }],
    sim: { type: 'env', fields: ['temp'], every: 2, tempDigits: 0 },
    run: RUN,
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'led',
    title: 'Light your own LED',
    summary: 'Connect an LED to pin 0 and switch it with `write_digital()`.',
    icon: { type: 'led', color: 'green' },
    focus: { pins: ['rings:1', 'rings:5'] },
    circuit: {
      breadboard: BB,
      parts: [
        { id: 'res1', type: 'resistor', a: 'c10', b: 'c14', ohms: 100, label: '100 Ω resistor', desc: 'At 3 V a small resistor keeps the LED visible.', controls: { ohms: [47, 100, 220, 470] }, drives: 'led1' },
        { id: 'led1', type: 'led', anode: 'e14', cathode: 'e15', color: 'green', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to GND.', controls: { color: ['red', 'yellow', 'green', 'blue'] } },
      ],
      wires: [{ from: 'rings:1', to: 'bb:a10', color: '#f0a33a' }, { from: 'bb:a15', to: 'rings:5', color: '#2b2a30' }],
    },
    callouts: [
      { pin: 'rings:1', icon: 'pin', title: 'Pin 0', text: 'write_digital(1) puts 3 V on it.' },
      { part: 'led1', icon: 'led', title: 'LED', text: 'Click it to change its colour.' },
      { pin: 'rings:5', icon: 'ground', title: 'GND', text: 'The return path.' },
    ],
    overview: [
      'The big rings are pins you can clip onto. `pin0.write_digital(1)` puts **3 V** on ring 0, `write_digital(0)` turns it off. With crocodile clips you can skip the breadboard; jumper wires need clips or a breakout board.',
      { tips: [['pin', 'Ring 0, ring 1 and ring 2 are pin0, pin1 and pin2'], ['resistor', 'Click the resistor to see the current'], ['clock', 'Drag the delay slider in Try it']] },
      { note: 'micro:bit pins can only supply a few milliamps. LEDs are fine; motors need a driver board.', tone: 'warn' },
    ],
    wiring: [{ pin: 'rings:1', to: '100 Ω resistor → LED **long leg**' }, { pin: 'rings:5', to: 'LED **short leg**' }],
    code: [{ file: 'main.py', lang: 'python', trace: { on: 4, off: 7 }, source: `
from microbit import *

while True:
    pin0.write_digital(1)
    print("LED on")
    sleep(1000)
    pin0.write_digital(0)
    print("LED off")
    sleep(1000)
` }],
    sim: { type: 'led', led: 'led1', resistor: 'res1', label: 'LED on pin 0', delay: 1, volts: 3 },
    run: RUN,
    kit: [['1', 'LED'], ['1', '100 Ω resistor'], ['2', 'Crocodile-clip leads or jumper wires']],
  },

  {
    id: 'radio',
    title: 'Send a radio message',
    summary: 'Two micro:bits on the same radio group: press A on one and a tick appears on the other.',
    icon: 'board',
    focus: { components: ['mcu', 'btnA'] },
    callouts: [
      { component: 'mcu', icon: 'wifi', title: 'Radio', text: 'Built into the processor.' },
      { component: 'btnA', icon: 'button', title: 'Button A', text: 'Sends “hello”.' },
      { component: 'display', icon: 'led', title: 'Display', text: 'Shows a tick on arrival.' },
    ],
    overview: [
      'The micro:bit radio sends short messages to every micro:bit nearby on the same **group** (0–255). Load the same program onto **two** boards: pressing A on either sends `"hello"`, and the other shows a tick.',
      { tips: [['wifi', 'Choose your own group number so other classes do not interfere'], ['code', 'radio.receive() returns None when nothing arrived'], ['info', 'Range is a few tens of metres indoors']] },
    ],
    code: [{ file: 'main.py', lang: 'python', trace: { send: 9, recv: 14 }, source: `
from microbit import *
import radio

radio.config(group=7)
radio.on()

while True:
    if button_a.was_pressed():
        radio.send("hello")
        print("sent: hello")
    message = radio.receive()
    if message:
        print("received:", message)
        display.show(Image.YES)
` }],
    sim: { type: 'matrix', color: '#ff4a3a', caption: 'The panel plays both boards: one sends, the other receives.', frames: [F(IMG.blank, 900, 'sent: hello', 'send'), F(IMG.yes, 1500, 'received: hello', 'recv')] },
    run: RUN,
    kit: [['2', 'BBC micro:bit V2', 'Both run the same program.']],
  },
];
