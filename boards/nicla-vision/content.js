// Everything specific to this board lives in this file: site metadata, the 3D model and the
// lessons. The engine is generic.
// Sources: OpenMV's Arduino Nicla Vision quick reference (camera, LEDs, VL53L1X, IMU, 1.8 V warning)
// and the ArduinoCore-mbed NICLA_VISION variant. Header pins are not modelled pin by pin because
// these lessons use only the parts on the board.

export const SITE = {
  id: 'learn-nicla-vision',
  title: 'Arduino Nicla Vision: A Camera the Size of a Coin',
  accent: '#00979d',
  logicVolts: 3.3,
  shell: 'OpenMV IDE · serial terminal',
  terminalHint: 'Board connected. Press Run to send the script from OpenMV IDE.',
};

export const PIN_TYPES = {};

// Arduino Nicla Vision, top view, millimetres, a 22.86 mm square. Part positions are taken from
// photos and are stylised.
export const BOARD = {
  name: 'Arduino Nicla Vision',
  width: 22.86,
  depth: 22.86,
  thickness: 1.2,
  cornerRadius: 1,
  pcbColor: '#0d6b70',
  heightScale: 1.4,
  holes: [],
  silkscreen: [{ text: 'NICLA', x: 11.4, z: 21, size: 1.1, weight: 700, align: 'center' }],
  components: [
    { id: 'cam', label: 'Camera (GC2145)', desc: 'A 2-megapixel colour camera module.', shape: 'box', x: 11.4, z: 8, w: 8.5, d: 8.5, h: 3.6, color: '#1b1c22', accent: '#3a6dd0' },
    { id: 'tof', kind: 'chip', label: 'Distance sensor (VL53L1CB)', desc: 'Measures distance with an invisible laser pulse, up to about 4 m.', shape: 'box', x: 4, z: 13.5, w: 4.9, d: 2.5, h: 1.5, color: '#2a2930' },
    { id: 'mcu', kind: 'shield', label: 'STM32H747 and Wi-Fi', desc: 'A dual-core chip, Cortex-M7 at up to 480 MHz plus Cortex-M4, next to the Wi-Fi and Bluetooth radio.', shape: 'box', x: 14, z: 16, w: 10, d: 7, h: 1, color: '#c8cacc', metal: true },
    { id: 'imu', kind: 'chip', label: 'Motion sensor (LSM6DSOX)', desc: 'A 6-axis accelerometer and gyroscope.', shape: 'box', x: 4, z: 18, w: 2.5, d: 3, h: 0.9, color: '#2a2930' },
    { id: 'mic', kind: 'chip', label: 'Microphone', desc: 'A digital MEMS microphone.', shape: 'box', x: 19, z: 4, w: 3, d: 2, h: 0.9, color: '#c3c6ca' },
    { id: 'rgb', kind: 'ledsmd', accent: '#7a6bff', label: 'RGB LED', desc: 'A red, green and blue user LED.', shape: 'box', x: 3.6, z: 4, w: 2, d: 2, h: 0.7, color: '#f1ece2' },
    { id: 'usb', kind: 'usb', label: 'Micro-USB port', desc: 'On the back: power, uploads and the OpenMV IDE connection.', shape: 'box', x: 11.4, z: 21.8, w: 8, d: 5.6, h: 2.8, color: '#c3c8d0', metal: true, under: true },
  ],
  headers: [],
};

const RUN = 'Run in OpenMV IDE';

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Nicla Vision',
    short: 'Meet the board',
    summary: 'A camera, a distance sensor, a motion sensor and Wi-Fi on a board smaller than a coin.',
    icon: 'board',
    focus: { components: ['cam'] },
    callouts: [
      { component: 'cam', icon: 'camera', title: 'Camera', text: '2 MP colour.' },
      { component: 'tof', icon: 'ruler', title: 'Distance sensor', text: 'Laser, up to about 4 m.' },
      { component: 'imu', icon: 'target', title: 'Motion sensor', text: '6-axis.' },
      { component: 'mcu', icon: 'chip', title: 'STM32H747', text: 'Cortex-M7 plus Cortex-M4.' },
      { component: 'rgb', icon: 'led', title: 'RGB LED', text: 'For status.' },
    ],
    overview: [
      'The **Nicla Vision** is under 23 mm wide and carries a complete sensing system: camera, time-of-flight distance sensor, microphone, motion sensor and Wi-Fi. It is made for small vision jobs where a Linux board would be too big or use too much power, such as checking parts on a line or spotting something from a drone.',
      'This course uses **OpenMV**, a MicroPython system built for machine vision, with a desktop IDE that shows the live camera view.',
      { tips: [['target', 'Click the parts of the board'], ['code', 'OpenMV firmware runs on the M7 core'], ['info', 'It can also be programmed with Arduino sketches']] },
      { note: 'The analog pins **A0–A2 are 1.8 V only**. Connecting 3.3 V to them will damage the chip.', tone: 'warn' },
      { h: 'Specifications' },
      { specs: [['Chip', 'STM32H747, dual-core Cortex-M7 + M4'], ['Memory', '2 MB flash, 16 MB QSPI flash, 1 MB RAM'], ['Camera', 'GC2145, 2 MP'], ['Sensors', 'Time-of-flight, 6-axis IMU, microphone'], ['Wireless', 'Wi-Fi, Bluetooth LE'], ['Size', '22.86 × 22.86 mm']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Arduino Nicla Vision'], ['1', 'Micro-USB data cable']],
  },

  {
    id: 'setup',
    title: 'Install OpenMV IDE',
    summary: 'The IDE flashes the firmware for you and shows what the camera sees.',
    icon: 'board',
    focus: { components: ['usb'] },
    callouts: [{ component: 'usb', icon: 'usb', title: 'USB', text: 'Use a cable that carries data.' }],
    overview: [
      { steps: [
        'Download **OpenMV IDE** from openmv.io and install it.',
        'Plug in the board. If it starts in Arduino firmware, double-press its reset button so the IDE can find it.',
        'Click the **Connect** icon and let the IDE install the latest firmware.',
        'Open **File → Examples**, pick a camera example and press the green **Run** arrow.',
      ] },
      'The window on the right shows the live image, with a colour histogram below it.',
      { tips: [['usb', 'Plug straight into your computer'], ['terminal', 'The Serial Terminal tab shows `print()` output'], ['code', 'Saving as main.py runs the script at power-on']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'import sys; print(sys.implementation.name)', note: 'in the IDE terminal', out: ['micropython'] },
      ],
    },
    kit: [['1', 'Computer running OpenMV IDE']],
  },

  {
    id: 'camera',
    title: 'See through the camera',
    short: 'Camera',
    summary: 'A small loop keeps taking frames while OpenMV IDE shows them.',
    icon: { glyph: 'camera' },
    focus: { components: ['cam'] },
    callouts: [{ component: 'cam', icon: 'camera', title: 'GC2145', text: 'QVGA is 320 × 240 pixels.' }],
    overview: [
      '`csi.CSI()` opens the camera. **RGB565** uses 2 bytes per pixel, and **QVGA** is 320 × 240, a good size for a microcontroller’s memory. The first `snapshot(time=2000)` gives the automatic exposure two seconds to settle.',
      { tips: [['camera', 'Watch the frame rate in the IDE'], ['code', 'Smaller frames run faster'], ['info', 'Older examples use the `sensor` module instead']] },
    ],
    code: [{ file: 'camera.py', lang: 'python', source: `
import csi

cam = csi.CSI()
cam.reset()
cam.pixformat(csi.RGB565)
cam.framesize(csi.QVGA)
cam.snapshot(time=2000)

while True:
    img = cam.snapshot()
` }],
    sim: { type: 'detect', fps: 30, start: ['Camera ready'], caption: 'Press Run: a simulated view of the live frame.', objects: [] },
    run: { cmd: RUN, stop: [] },
  },

  {
    id: 'blobs',
    title: 'Track a colour',
    summary: '`find_blobs()` finds patches of a colour and marks them on the frame.',
    icon: { glyph: 'target' },
    focus: { components: ['cam'] },
    callouts: [{ component: 'cam', icon: 'camera', title: 'Colour tracking', text: 'Runs on the microcontroller.' }],
    overview: [
      'A neural network is not always needed. OpenMV’s `find_blobs()` searches for pixels inside a **LAB colour** range and groups them into patches. It runs quickly even on a microcontroller.',
      'The IDE’s **Threshold Editor** (Tools → Machine Vision) lets you pick the numbers by eye.',
      { tips: [['target', 'Hold up something bright and red'], ['code', '`b.rect()` gives the patch’s box'], ['info', 'Lighting changes colours: tune the thresholds']] },
    ],
    code: [{ file: 'track.py', lang: 'python', source: `
import csi

RED = (30, 100, 15, 127, 15, 127)

cam = csi.CSI()
cam.reset()
cam.pixformat(csi.RGB565)
cam.framesize(csi.QVGA)
cam.snapshot(time=2000)

while True:
    img = cam.snapshot()
    for b in img.find_blobs([RED], pixels_threshold=200, area_threshold=200):
        img.draw_rectangle(b.rect())
        img.draw_cross(b.cx(), b.cy())
` }],
    sim: { type: 'detect', fps: 30, start: ['Looking for red'], caption: 'Press Run: a simulated view with a box around a red patch.', objects: [{ label: 'red', box: [0.35, 0.3, 0.26, 0.36], score: 0.99, color: '#3fae5a', fill: '#d0342c' }] },
    run: { cmd: RUN, stop: [] },
    kit: [['1', 'A brightly coloured object']],
  },

  {
    id: 'distance',
    title: 'Measure distance with light',
    short: 'Measure distance',
    summary: 'The time-of-flight sensor times a laser pulse and reports the range in millimetres.',
    icon: { glyph: 'ruler' },
    focus: { components: ['tof'] },
    callouts: [{ component: 'tof', icon: 'ruler', title: 'VL53L1CB', text: 'Up to about 4 m.' }],
    overview: [
      'A **time-of-flight** sensor sends an invisible laser pulse and measures how long the light takes to return. Light covers a millimetre in about 3 picoseconds, so this is done by counting single returning photons over many pulses.',
      'The sensor shares an internal I²C bus, number 2, with the power chips on the board.',
      { tips: [['ruler', 'Point it at a wall and move closer'], ['info', 'Dark or shiny surfaces reduce the range'], ['code', '`tof.read()` returns millimetres']] },
    ],
    code: [{ file: 'distance.py', lang: 'python', trace: { read: 8 }, source: `
from machine import I2C
import time
import vl53l1x

tof = vl53l1x.VL53L1X(I2C(2))

while True:
    print('Distance:', tof.read(), 'mm')
    time.sleep_ms(200)
` }],
    sim: { type: 'knob', label: 'Distance', readout: 'raw', vmax: 3.3, max: 4000, every: 0.5, slider: 'Distance to the wall', log: 'Distance: {raw} mm', caption: 'Press Run, then drag the slider to move the wall.' },
    run: { cmd: RUN, stop: [] },
  },

  {
    id: 'imu',
    title: 'Sense tilt and motion',
    short: 'Sense motion',
    summary: 'The IMU reports acceleration: at rest, it measures gravity.',
    icon: { glyph: 'target' },
    focus: { components: ['imu'] },
    callouts: [{ component: 'imu', icon: 'target', title: 'LSM6DSOX', text: 'Accelerometer and gyroscope.' }],
    overview: [
      'An **accelerometer** feels gravity as a steady 1 g, or about 1000 mg. Lying flat, one axis reads about 1000 and the others about 0. Tilt the board and the reading moves between the axes. The **gyroscope** reports how fast it is turning.',
      'Together they can tell a camera when it has been moved, so a project can skip blurred frames.',
      { tips: [['target', 'Tilt the board slowly and watch the numbers'], ['code', '`imu.angular_rate_mdps()` reads the gyroscope'], ['info', 'mg means thousandths of a g']] },
    ],
    code: [{ file: 'motion.py', lang: 'python', trace: { read: 5 }, source: `
import imu
import time

while True:
    x, y, z = imu.acceleration_mg()
    print('x %5d  y %5d  z %5d mg' % (x, y, z))
    time.sleep_ms(200)
` }],
    sim: { type: 'knob', label: 'Tilt', readout: 'raw', vmax: 3.3, max: 1000, every: 0.5, slider: 'Tilt', log: 'z = {raw} mg', caption: 'Press Run, then drag the slider to tilt the board.' },
    run: { cmd: RUN, stop: [] },
  },
];
