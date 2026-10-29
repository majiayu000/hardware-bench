// Everything specific to this course lives in this file: site metadata and the lessons.
// The Uno model and its pin map are shared with the Arduino Uno course.
// Sources: the SparkFun TB6612FNG hookup guide, the HC-SR04 and HC-05 datasheets, and the
// Arduino language reference (pulseIn, SoftwareSerial).
import { BOARD as UNO, PIN_TYPES as UNO_PIN_TYPES } from '../arduino-uno/content.js';

export const SITE = {
  id: 'learn-uno-car',
  title: 'Arduino Uno: Build a Smart Car',
  accent: '#e08a1e',
  logicVolts: 5,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Uno connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Arduino Uno…', 'Done uploading.'],
};

export const PIN_TYPES = UNO_PIN_TYPES;
export const BOARD = UNO;

// ---------- the car's circuit ----------
// The TB6612FNG straddles the centre channel (motor side in row e, logic side in row f).
// Top rails: the 4×AA motor battery, its − joined to the Uno's GND. Bottom rails: the Uno's 5 V.
const BB = { x: 76, z: 0.7 };
const RED = '#e2483c';
const BLACK = '#2b2a30';
const DRIVER = { id: 'drv', type: 'module', preset: 'driver', pins: ['e10', 'e11', 'e12', 'e13', 'e14', 'e15', 'e16', 'e17', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17'], label: 'TB6612FNG', desc: 'Dual motor driver. Motor side: VM, VCC, GND, AO1, AO2, BO2, BO1, GND. Logic side: PWMA, AIN2, AIN1, STBY, BIN1, BIN2, PWMB, GND.' };
const LEFT = { id: 'motL', type: 'motor', kind: 'tt', at: { x: 182, z: -14 }, legs: ['a13', 'a14'], label: 'Left motor', desc: 'TT gear motor on output A (AO1, AO2).' };
const RIGHT = { id: 'motR', type: 'motor', kind: 'tt', at: { x: 182, z: 62 }, flip: true, legs: ['b15', 'b16'], label: 'Right motor', desc: 'TT gear motor on output B (BO2, BO1).' };
const BATTERY = { id: 'bat', type: 'block', table: true, at: { x: 30, z: 95 }, w: 62, d: 30, h: 16, color: '#24232b', text: '4 × AA', label: '4×AA battery pack', desc: '6 V for the motors. Its red lead goes to the top + rail, the black lead to the top − rail.' };
const SONAR = { id: 'us', type: 'module', preset: 'hcsr04', pins: ['j22', 'j23', 'j24', 'j25'], label: 'HC-SR04', desc: 'Ultrasonic rangefinder, the car’s eyes. Pins: VCC, TRIG, ECHO, GND.', controls: { distance: [2, 200] } };
const BT = { id: 'bt', type: 'module', preset: 'breakout', pins: ['c22', 'c23', 'c24', 'c25', 'c26', 'c27'], face: -1, color: '#1f4fa0', label: 'HC-05', desc: 'Bluetooth serial module. Pins: STATE, RXD, TXD, GND, VCC, EN.' };

const DRIVE_WIRES = [
  { from: 'power:5', to: 'bb:bp2', color: RED }, { from: 'power:6', to: 'bb:bn2', color: BLACK }, { from: 'dhigh:7', to: 'bb:tn1', color: BLACK },
  { from: 'bb:a10', to: 'bb:tp10', color: RED }, { from: 'bb:a11', to: 'bb:bp11', color: '#f08a24' }, { from: 'bb:a12', to: 'bb:tn13', color: BLACK },
  { from: 'dlow:6', to: 'bb:j10', color: '#3fae5a' }, { from: 'dhigh:1', to: 'bb:j11', color: '#3b78d6' }, { from: 'dlow:8', to: 'bb:j12', color: '#f2c12e' },
  { from: 'bb:j13', to: 'bb:bp13', color: RED }, { from: 'dlow:5', to: 'bb:j14', color: '#f2c12e' }, { from: 'dlow:3', to: 'bb:j15', color: '#3b78d6' },
  { from: 'dlow:7', to: 'bb:j16', color: '#3fae5a' }, { from: 'bb:j17', to: 'bb:bn17', color: BLACK },
];
const SONAR_WIRES = [{ from: 'bb:h22', to: 'bb:bp22', color: RED }, { from: 'dhigh:5', to: 'bb:g23', color: '#f2c12e' }, { from: 'dhigh:4', to: 'bb:g24', color: '#3fae5a' }, { from: 'bb:h25', to: 'bb:bn25', color: BLACK }];
const BT_WIRES = [{ from: 'dhigh:3', to: 'bb:a24', color: '#9b59d0' }, { from: 'bb:a25', to: 'bb:tn25', color: BLACK }, { from: 'bb:a26', to: 'bb:bp26', color: RED }];

const DRIVE = { breadboard: BB, parts: [DRIVER, LEFT, RIGHT, BATTERY], wires: DRIVE_WIRES };
const AVOID = { breadboard: BB, parts: [DRIVER, LEFT, RIGHT, BATTERY, SONAR], wires: [...DRIVE_WIRES, ...SONAR_WIRES] };
const FULL = { breadboard: BB, parts: [DRIVER, LEFT, RIGHT, BATTERY, SONAR, BT], wires: [...DRIVE_WIRES, ...SONAR_WIRES, ...BT_WIRES] };
const MOTOR_PINS = ['dlow:6', 'dlow:8', 'dhigh:1', 'dlow:7', 'dlow:5', 'dlow:3', 'power:5', 'power:6', 'dhigh:7'];
const MOTOR_WIRING = [
  { pin: 'dlow:6', to: 'Driver **PWMA** (left speed)' }, { pin: 'dlow:8', to: 'Driver **AIN1**' }, { pin: 'dhigh:1', to: 'Driver **AIN2**' },
  { pin: 'dlow:7', to: 'Driver **PWMB** (right speed)' }, { pin: 'dlow:5', to: 'Driver **BIN1**' }, { pin: 'dlow:3', to: 'Driver **BIN2**' },
  { pin: 'power:5', to: '5 V rail → driver **VCC** and **STBY**' }, { pin: 'dhigh:7', to: 'Top **−** rail: joins the battery − to the Uno’s GND' },
];
// The motor functions every sketch in this course starts with.
const MOTOR_CODE = `const int PWMA = 5, AIN1 = 7, AIN2 = 8;   // left motor
const int PWMB = 6, BIN1 = 4, BIN2 = 2;   // right motor

// speed: -255 (full reverse) to 255 (full forward)
void motor(int pwm, int in1, int in2, int speed) {
  digitalWrite(in1, speed > 0);
  digitalWrite(in2, speed < 0);
  analogWrite(pwm, abs(speed));
}

void drive(int left, int right) {
  motor(PWMA, AIN1, AIN2, left);
  motor(PWMB, BIN1, BIN2, right);
}

void setupMotors() {
  int pins[] = { PWMA, AIN1, AIN2, PWMB, BIN1, BIN2 };
  for (int p : pins) pinMode(p, OUTPUT);
}`;
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn arduino:avr:uno ${sketch}`;
const spin = (l, r) => ({ motL: { spin: l }, motR: { spin: r } });

export const LESSONS = [
  {
    id: 'plan',
    title: 'Plan the car',
    summary: 'Two motors, one driver, a distance sensor and a Bluetooth module: see how everything connects before you build.',
    icon: 'circuit',
    focus: { pins: [...MOTOR_PINS, 'dhigh:3', 'dhigh:4', 'dhigh:5'] },
    circuit: FULL,
    callouts: [
      { part: 'drv', icon: 'chip', title: 'Driver', text: 'One H-bridge per wheel.' },
      { part: 'motL', icon: 'gear', title: 'Left wheel', text: 'Output A.' },
      { part: 'motR', icon: 'gear', title: 'Right wheel', text: 'Output B.' },
      { part: 'us', icon: 'ruler', title: 'Eyes', text: 'Measures the gap ahead.' },
      { part: 'bt', icon: 'wifi', title: 'Ears', text: 'Commands from your phone.' },
      { part: 'bat', icon: 'power', title: 'Motor battery', text: 'Feeds the top rails.' },
    ],
    overview: [
      'A two-wheel car steers like a tank: both wheels forward to go straight, one faster than the other to curve, opposite directions to spin on the spot. A caster wheel or skid at the front keeps it level.',
      'The build grows over three lessons: first the wheels, then the distance sensor so it can avoid walls, then a Bluetooth module so your phone can drive it.',
      { h: 'Power plan' },
      'Motors are electrically noisy and draw a lot of current when they start. Give them their own **4×AA pack** on the top rails, and run the Uno from a USB power bank. One jumper joins the two grounds so the signals have a shared reference.',
      { note: 'Never power the motors from the Uno’s 5 V pin on a moving car. The start-up surge can reset the Uno or overload the USB port.', tone: 'warn' },
      { tips: [['car', 'Most kits use an acrylic chassis with two TT motors'], ['power', 'Batteries for motors, power bank for the Uno'], ['ground', 'Join the grounds, never the + leads']] },
    ],
    wiring: [...MOTOR_WIRING, { pin: 'dhigh:5', to: 'Sensor **TRIG**' }, { pin: 'dhigh:4', to: 'Sensor **ECHO**' }, { pin: 'dhigh:3', to: 'HC-05 **TXD**' }],
    wiringNotes: ['The battery pack is shown on the table; on the car its leads go into the top + and − rails.', 'The three later lessons each add one part of this circuit.'],
    kit: [
      ['1', '2WD car chassis kit', 'Two TT motors with wheels, a caster and a battery holder.'],
      ['1', 'TB6612FNG driver breakout'], ['1', 'HC-SR04 ultrasonic sensor'], ['1', 'HC-05 Bluetooth module'],
      ['1', 'USB power bank', 'Powers the Uno on the move.'], ['4', 'AA batteries'], ['1', 'Mini breadboard and jumper wires'],
    ],
  },

  {
    id: 'drive',
    title: 'Two wheels',
    summary: 'One `drive(left, right)` function makes the car go forward, turn, spin and reverse.',
    icon: 'circuit',
    focus: { pins: MOTOR_PINS },
    circuit: DRIVE,
    callouts: [
      { part: 'motL', icon: 'gear', title: 'Left', text: 'PWMA, AIN1, AIN2.' },
      { part: 'motR', icon: 'gear', title: 'Right', text: 'PWMB, BIN1, BIN2.' },
      { pin: 'dlow:6', icon: 'wave', title: 'Pin ~5', text: 'Left speed.' },
      { pin: 'dlow:7', icon: 'wave', title: 'Pin ~6', text: 'Right speed.' },
    ],
    overview: [
      'Each wheel gets the same three-pin control as in the motor lesson of Displays and Motors: two direction pins and one PWM speed pin. Wrapping them in `drive(left, right)` means the rest of the program only thinks in wheel speeds.',
      { tips: [['rotr', '`drive(150, -150)` spins on the spot'], ['gear', 'If a wheel runs backwards, swap its two motor leads'], ['clock', 'Lift the car off the table for the first test']] },
      'Two motors are never exactly alike, so the car drifts slightly when both get the same number. Lower the faster side by a few steps until it runs straight.',
    ],
    wiring: MOTOR_WIRING,
    code: [{ file: 'drive.ino', lang: 'cpp', trace: { forward: 27, left: 29, spin: 31, back: 33, stop: 35 }, source: `
${MOTOR_CODE}

void setup() {
  setupMotors();
  Serial.begin(9600);
}

void loop() {
  Serial.println("Forward");  drive(200, 200);
  delay(1500);
  Serial.println("Curve left");  drive(100, 200);
  delay(1500);
  Serial.println("Spin right");  drive(150, -150);
  delay(1000);
  Serial.println("Reverse");  drive(-180, -180);
  delay(1500);
  Serial.println("Stop");  drive(0, 0);
  delay(2000);
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: watch both wheels. Equal speeds go straight; different speeds turn.', rest: spin(0, 0),
      steps: [
        { set: spin(0.8, 0.8), ms: 1500, log: 'Forward', trace: 'forward' },
        { set: spin(0.4, 0.8), ms: 1500, log: 'Curve left', trace: 'left' },
        { set: spin(0.6, -0.6), ms: 1000, log: 'Spin right', trace: 'spin' },
        { set: spin(-0.7, -0.7), ms: 1500, log: 'Reverse', trace: 'back' },
        { set: spin(0, 0), ms: 2000, log: 'Stop', trace: 'stop' },
      ],
    },
    run: { cmd: UPLOAD('drive'), stop: [] },
    kit: [['14', 'Jumper wires']],
  },

  {
    id: 'avoid',
    title: 'Avoid obstacles',
    summary: 'Add the HC-SR04: the car drives until something is closer than 20 cm, then backs up and turns away.',
    icon: 'circuit',
    focus: { pins: ['dhigh:5', 'dhigh:4', ...MOTOR_PINS] },
    circuit: AVOID,
    callouts: [
      { part: 'us', icon: 'ruler', title: 'HC-SR04', text: 'Mount it at the front, facing forward.' },
      { pin: 'dhigh:5', icon: 'pin', title: 'Pin 12 · TRIG', text: 'Starts a measurement.' },
      { pin: 'dhigh:4', icon: 'wave', title: 'Pin 11 · ECHO', text: 'Times the echo.' },
    ],
    overview: [
      'The car now runs a simple rule many times a second: **measure, then decide**. Clear road ahead: drive. Something close: stop, reverse a little, spin, and look again.',
      'This kind of program is a small **state machine**: what the car does next depends only on what it sees now. It never plans a route, yet it finds its way out of most rooms.',
      { tips: [['ruler', 'Measure every loop; it takes under 30 ms'], ['target', 'Raise NEAR_CM if it reacts too late at speed'], ['rotr', 'Alternate the turn direction to escape corners']] },
      { note: 'The sensor misses soft and angled things (curtains, chair legs at an angle). Expect the odd bump.', tone: 'warn' },
    ],
    wiring: [{ pin: 'dhigh:5', to: 'Sensor **TRIG**' }, { pin: 'dhigh:4', to: 'Sensor **ECHO**' }, { pin: 'power:5', to: '5 V rail → sensor **VCC**' }, { pin: 'power:6', to: 'GND rail → sensor **GND**' }],
    code: [{ file: 'avoid.ino', lang: 'cpp', trace: { read: 40, go: 41, near: 42 }, source: `
${MOTOR_CODE}

const int TRIG = 12, ECHO = 11;
const int NEAR_CM = 20;

long readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long echo = pulseIn(ECHO, HIGH, 30000);
  return echo == 0 ? 999 : echo * 0.0343 / 2;   // 999: nothing in range
}

void setup() {
  setupMotors();
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  Serial.begin(9600);
}

void loop() {
  long cm = readCm();
  if (cm > NEAR_CM) { drive(180, 180); return; }
  Serial.print("Obstacle at "); Serial.print(cm); Serial.println(" cm: turning");
  drive(-150, -150); delay(400);
  drive(150, -150);  delay(350);
}
` }],
    codeNotes: ['`return` ends this pass of `loop()` early, so the turning code only runs when something is close.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the car drives, meets a wall, backs up, turns and drives on.', rest: spin(0, 0),
      steps: [
        { set: spin(0.7, 0.7), ms: 2000, trace: 'go' },
        { set: spin(0.7, 0.7), ms: 300, trace: 'read' },
        { set: spin(-0.6, -0.6), ms: 600, log: 'Obstacle at 17 cm: turning', trace: 'near' },
        { set: spin(0.6, -0.6), ms: 600, trace: 'near' },
      ],
    },
    run: { cmd: UPLOAD('avoid'), stop: [] },
    kit: [['1', 'HC-SR04 ultrasonic sensor', 'A front bracket keeps it level.'], ['4', 'More jumper wires']],
  },

  {
    id: 'bluetooth',
    title: 'Drive from your phone',
    short: 'Phone control',
    summary: 'An HC-05 Bluetooth module receives one letter per command from a phone app: F, B, L, R or S.',
    icon: 'circuit',
    focus: { pins: ['dhigh:3', ...MOTOR_PINS] },
    circuit: FULL,
    callouts: [
      { part: 'bt', icon: 'wifi', title: 'HC-05', text: 'Classic Bluetooth serial, 9600 baud.' },
      { pin: 'dhigh:3', icon: 'pin', title: 'Pin 10 · from TXD', text: 'Letters from the phone arrive here.' },
      { part: 'us', icon: 'ruler', title: 'Still watching', text: 'Blocks F when something is close.' },
    ],
    overview: [
      'The HC-05 is a wireless serial cable. Pair your phone with it (PIN **1234** or **0000**), open a Bluetooth serial app, and every letter you send comes out of its **TXD** pin as ordinary serial data.',
      'The Uno listens with **SoftwareSerial** on pin 10, so the USB serial port stays free for messages. The sketch keeps the distance check: it refuses to drive forward into a wall.',
      { tips: [['code', 'One letter per command keeps the protocol simple'], ['wifi', 'Use an Android app such as "Serial Bluetooth Terminal"'], ['ruler', 'Safety first: F is ignored below 20 cm']] },
      { note: 'The HC-05 uses classic Bluetooth, which iPhones cannot use for serial apps. On an iPhone, use a BLE module such as the HM-10 instead; the sketch stays the same.', tone: 'warn' },
    ],
    wiring: [{ pin: 'dhigh:3', to: 'HC-05 **TXD**' }, { pin: 'power:5', to: '5 V rail → HC-05 **VCC**' }, { pin: 'dhigh:7', to: 'Top − rail → HC-05 **GND**' }],
    wiringNotes: ['HC-05 **RXD** stays unconnected: the car only listens. To send replies back, add a 1 kΩ + 2 kΩ divider, because RXD expects 3.3 V.', 'The module’s LED blinks fast until paired, then slowly.'],
    code: [{ file: 'remote.ino', lang: 'cpp', trace: { cmd: 45 }, source: `
#include <SoftwareSerial.h>

${MOTOR_CODE}

const int TRIG = 12, ECHO = 11;
SoftwareSerial bt(10, 3);   // RX on pin 10 (from HC-05 TXD), TX on pin 3 (unused)

long readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long echo = pulseIn(ECHO, HIGH, 30000);
  return echo == 0 ? 999 : echo * 0.0343 / 2;
}

void setup() {
  setupMotors();
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  Serial.begin(9600);
  bt.begin(9600);
}

void loop() {
  if (!bt.available()) return;
  char c = bt.read();
  Serial.print("Command: "); Serial.println(c);
  if (c == 'F' && readCm() > 20) drive(200, 200);
  else if (c == 'B') drive(-180, -180);
  else if (c == 'L') drive(-150, 150);
  else if (c == 'R') drive(150, -150);
  else drive(0, 0);   // S, or F with a wall ahead
}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: commands arrive from the phone one by one.', rest: spin(0, 0),
      steps: [
        { set: spin(0.8, 0.8), ms: 1500, log: 'Command: F', trace: 'cmd' },
        { set: spin(-0.6, 0.6), ms: 1000, log: 'Command: L', trace: 'cmd' },
        { set: spin(0.8, 0.8), ms: 1500, log: 'Command: F', trace: 'cmd' },
        { set: spin(-0.7, -0.7), ms: 1200, log: 'Command: B', trace: 'cmd' },
        { set: spin(0, 0), ms: 1500, log: 'Command: S', trace: 'cmd' },
      ],
    },
    run: { cmd: UPLOAD('remote'), stop: [] },
    kit: [['1', 'HC-05 Bluetooth module'], ['1', 'Android phone with a Bluetooth serial app'], ['3', 'More jumper wires']],
  },
];
