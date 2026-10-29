// Everything specific to this course lives in this file: site metadata and the lessons.
// The Uno model and its pin map are shared with the Arduino Uno course.
// Sources: Arduino language reference (SPI, SD, SoftwareSerial), the HC-SR501, MPU-6050, VS1838B,
// MFRC522, NEO-6M and DS3231 datasheets, and the Adafruit MPU6050, IRremote, MFRC522,
// TinyGPSPlus and RTClib library documentation.
import { BOARD as UNO, PIN_TYPES as UNO_PIN_TYPES } from '../arduino-uno/content.js';

export const SITE = {
  id: 'learn-uno-sensors',
  title: 'Arduino Uno: Sensors and Modules',
  accent: '#7a5bd0',
  logicVolts: 5,
  pinLimitMa: 20,
  shell: 'Serial Monitor · 9600 baud',
  terminalHint: 'Uno connected on /dev/ttyACM0. Press Run to compile and upload.',
  runPreamble: ['Compiling sketch…', 'Uploading to Arduino Uno…', 'Done uploading.'],
};

export const PIN_TYPES = UNO_PIN_TYPES;
export const BOARD = UNO;

// ---------- shared circuit pieces ----------
// Same layout as the Uno course: breadboard to the right, the power header feeding the bottom rails.
// Modules stand in row j facing away from the Uno; their wires use rows g and h.
const BB = { x: 76, z: 0.7 };
const RAILS = [{ from: 'power:5', to: 'bb:bp2', color: '#e2483c' }, { from: 'power:6', to: 'bb:bn2', color: '#2b2a30' }];
const RED = '#e2483c';
const BLACK = '#2b2a30';
const UPLOAD = (sketch) => `arduino-cli compile --upload -p /dev/ttyACM0 --fqbn arduino:avr:uno ${sketch}`;

export const LESSONS = [
  {
    id: 'pir',
    title: 'Motion sensor',
    summary: 'An HC-SR501 PIR sensor notices a warm body moving and tells pin 2.',
    icon: 'circuit',
    focus: { pins: ['dlow:3', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'pir1', type: 'module', preset: 'pir', pins: ['j14', 'j15', 'j16'], label: 'HC-SR501', desc: 'Passive infrared motion sensor. Pins: VCC, OUT, GND.' }],
      wires: [...RAILS, { from: 'bb:h14', to: 'bb:bp14', color: RED }, { from: 'dlow:3', to: 'bb:g15', color: '#f2c12e' }, { from: 'bb:h16', to: 'bb:bn16', color: BLACK }],
    },
    callouts: [
      { part: 'pir1', icon: 'sensor', title: 'HC-SR501', text: 'The white dome is a lens.' },
      { pin: 'dlow:3', icon: 'pin', title: 'Pin 2 · OUT', text: 'HIGH while it sees motion.' },
      { pin: 'power:5', icon: 'power', title: '5 V', text: 'Works from 4.5 to 20 V.' },
    ],
    overview: [
      'Everything warm gives off infrared light. A **PIR** (passive infrared) sensor has two halves that each watch part of the room through the white lens. When a warm body moves, one half sees it before the other, and the sensor sets **OUT** HIGH.',
      '"Passive" means it sends nothing out: it only listens. It notices movement, not presence, so someone sitting still eventually disappears.',
      { tips: [['clock', 'Give it about a minute to settle after power-up'], ['knob', 'Two orange screws set the range and how long OUT stays HIGH'], ['sensor', 'It sees up to about 7 m']] },
      { note: 'OUT is 3.3 V when HIGH. The Uno reads anything above about 3 V as HIGH, so it connects straight to a pin.' },
    ],
    wiring: [{ pin: 'power:5', to: '5 V rail → sensor **VCC**' }, { pin: 'dlow:3', to: 'Sensor **OUT**' }, { pin: 'power:6', to: 'GND rail → sensor **GND**' }],
    wiringNotes: ['The pin names are printed under the dome. Lift it off gently to read them.', 'The jumper by the pins chooses whether more motion keeps OUT HIGH (H, repeat) or not (L, single).'],
    code: [{ file: 'motion.ino', lang: 'cpp', trace: { start: 11, stop: 12 }, source: `
const int PIR_PIN = 2;
bool moving = false;

void setup() {
  pinMode(PIR_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  bool now = digitalRead(PIR_PIN) == HIGH;
  if (now && !moving) Serial.println("Motion detected!");
  if (!now && moving) Serial.println("Motion ended");
  moving = now;
  delay(100);
}
` }],
    codeNotes: ['The sketch prints only when the state changes, not every 100 ms.'],
    sim: {
      type: 'sequence', caption: 'Press Run: someone walks past, stops, then walks past again.', rest: { pir1: { on: false } },
      steps: [
        { set: { pir1: { on: false } }, ms: 1500 },
        { set: { pir1: { on: true } }, ms: 3000, log: 'Motion detected!', trace: 'start' },
        { set: { pir1: { on: false } }, ms: 2500, log: 'Motion ended', trace: 'stop' },
      ],
    },
    run: { cmd: UPLOAD('motion'), stop: [] },
    kit: [['1', 'HC-SR501 PIR motion sensor'], ['3', 'Male-to-female jumper wires']],
  },

  {
    id: 'mpu6050',
    title: 'Tilt and motion',
    short: 'MPU6050',
    summary: 'An MPU-6050 measures acceleration and rotation in three directions; tilt the board and watch the numbers.',
    icon: 'circuit',
    focus: { pins: ['dhigh:9', 'dhigh:10', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'imu1', type: 'module', preset: 'mpu6050', pins: ['j10', 'j11', 'j12', 'j13', 'j14', 'j15', 'j16', 'j17'], label: 'GY-521', desc: 'MPU-6050 accelerometer and gyroscope, I²C address 0x68. Pins: VCC, GND, SCL, SDA, XDA, XCL, AD0, INT.' }],
      wires: [...RAILS, { from: 'bb:h10', to: 'bb:bp10', color: RED }, { from: 'bb:h11', to: 'bb:bn11', color: BLACK }, { from: 'dhigh:10', to: 'bb:g12', color: '#f2c12e' }, { from: 'dhigh:9', to: 'bb:g13', color: '#3b78d6' }],
    },
    callouts: [
      { part: 'imu1', icon: 'chip', title: 'MPU-6050', text: 'Accelerometer + gyroscope.' },
      { pin: 'dhigh:9', icon: 'pin', title: 'SDA', text: 'I²C data.' },
      { pin: 'dhigh:10', icon: 'pin', title: 'SCL', text: 'I²C clock.' },
    ],
    overview: [
      'The MPU-6050 is two sensors in one chip. The **accelerometer** measures acceleration along X, Y and Z, and gravity counts: lying flat it reads about **9.8 m/s²** on Z. The **gyroscope** measures how fast the board is turning, in radians per second.',
      'Tilt it and gravity moves from Z towards X or Y, so the accelerometer also tells you which way is down. That is how a phone knows to rotate the screen.',
      { tips: [['code', 'Readings come back as one `sensors_event_t` per sensor'], ['target', 'Flat and still: X ≈ 0, Y ≈ 0, Z ≈ 9.8'], ['pin', 'AD0 to 5 V moves the address to 0x69']] },
    ],
    wiring: [{ pin: 'power:5', to: '5 V rail → **VCC**' }, { pin: 'power:6', to: 'GND rail → **GND**' }, { pin: 'dhigh:10', to: 'Module **SCL**' }, { pin: 'dhigh:9', to: 'Module **SDA**' }],
    wiringNotes: ['The GY-521 board has its own 3.3 V regulator, so it runs from the Uno’s 5 V. XDA, XCL, AD0 and INT stay unconnected.'],
    code: [{ file: 'tilt.ino', lang: 'cpp', trace: { read: 14 }, source: `
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(9600);
  if (!mpu.begin()) Serial.println("MPU6050 not found");
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  Serial.print("Accel X: "); Serial.print(a.acceleration.x, 1);
  Serial.print("  Y: ");     Serial.print(a.acceleration.y, 1);
  Serial.print("  Z: ");     Serial.print(a.acceleration.z, 1);
  Serial.print("  m/s2   Gyro Z: "); Serial.println(g.gyro.z, 2);
  delay(500);
}
` }],
    codeNotes: ['Install the library with `arduino-cli lib install "Adafruit MPU6050"`.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the board lies flat, tilts right, then tilts forward.',
      steps: [
        { ms: 1000, log: 'Accel X: 0.1  Y: -0.2  Z: 9.8  m/s2   Gyro Z: 0.00', trace: 'read' },
        { ms: 1000, log: 'Accel X: 4.9  Y: -0.1  Z: 8.5  m/s2   Gyro Z: 0.02', trace: 'read' },
        { ms: 1000, log: 'Accel X: 9.6  Y: 0.0  Z: 1.4  m/s2   Gyro Z: -0.01', trace: 'read' },
        { ms: 1000, log: 'Accel X: 0.2  Y: 6.9  Z: 6.8  m/s2   Gyro Z: 0.35', trace: 'read' },
      ],
    },
    run: { cmd: UPLOAD('tilt'), stop: [] },
    kit: [['1', 'GY-521 (MPU-6050) module', 'Solder the pin header on first.'], ['4', 'Jumper wires']],
  },

  {
    id: 'soil',
    title: 'Soil moisture',
    summary: 'A capacitive probe in a plant pot tells A0 how wet the soil is.',
    icon: 'circuit',
    focus: { pins: ['analog:1', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'soil1', type: 'module', preset: 'soil', pins: ['j14', 'j15', 'j16'], label: 'Soil v1.2', desc: 'Capacitive soil moisture sensor. Pins: GND, VCC, AOUT.' }],
      wires: [...RAILS, { from: 'bb:h14', to: 'bb:bn14', color: BLACK }, { from: 'bb:h15', to: 'bb:bp15', color: RED }, { from: 'analog:1', to: 'bb:g16', color: '#3fae5a' }],
    },
    callouts: [
      { part: 'soil1', icon: 'sensor', title: 'Probe', text: 'Push it into the soil up to the line.' },
      { pin: 'analog:1', icon: 'wave', title: 'A0', text: 'Higher reading = drier soil.' },
    ],
    overview: [
      'Water changes how well the probe stores electric charge (its **capacitance**). The board turns that into a voltage on **AOUT**: high in dry air, lower as the soil gets wetter.',
      'The copper is sealed under the board’s coating, so unlike cheap two-prong probes it does not corrode in wet soil.',
      { tips: [['wave', 'Dry air reads about 600, a glass of water about 300'], ['target', 'Write down your own dry and wet readings'], ['sensor', 'Keep the electronics at the top out of the water']] },
    ],
    wiring: [{ pin: 'power:6', to: 'GND rail → probe **GND**' }, { pin: 'power:5', to: '5 V rail → probe **VCC**' }, { pin: 'analog:1', to: 'Probe **AOUT**' }],
    code: [{ file: 'soil.ino', lang: 'cpp', trace: { read: 9 }, source: `
const int SOIL_PIN = A0;
const int DRY = 600, WET = 300;   // measure yours in air and in a glass of water

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(SOIL_PIN);
  int percent = constrain(map(raw, DRY, WET, 0, 100), 0, 100);
  Serial.print("Moisture raw: "); Serial.print(raw);
  Serial.print("  ("); Serial.print(percent); Serial.println(" %)");
  if (percent < 30) Serial.println("Water me!");
  delay(1000);
}
` }],
    codeNotes: ['`map()` turns the DRY…WET range into 0–100 %. `constrain()` stops it going past either end.'],
    sim: { type: 'knob', slider: 'dryness', readout: 'raw', label: 'A0 reading', vmax: 5, max: 1023, every: 1, log: 'Moisture raw: {raw}', caption: 'Press Run, then move the slider: right is drier soil, which gives a higher reading.' },
    run: { cmd: UPLOAD('soil'), stop: [] },
    kit: [['1', 'Capacitive soil moisture sensor v1.2'], ['3', 'Jumper wires'], ['1', 'Plant pot', 'Optional: a glass of water works for testing.']],
  },

  {
    id: 'ir',
    title: 'IR remote',
    summary: 'An infrared receiver on pin 2 decodes the buttons of a small TV-style remote.',
    icon: 'circuit',
    focus: { pins: ['dlow:3', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'ir1', type: 'module', preset: 'irrx', pins: ['j14', 'j15', 'j16'], label: 'VS1838B', desc: '38 kHz infrared receiver. Pins: OUT, GND, VCC (check the labels on yours).' }],
      wires: [...RAILS, { from: 'dlow:3', to: 'bb:g14', color: '#f2c12e' }, { from: 'bb:h15', to: 'bb:bn15', color: BLACK }, { from: 'bb:h16', to: 'bb:bp16', color: RED }],
    },
    callouts: [
      { part: 'ir1', icon: 'sensor', title: 'IR receiver', text: 'The dark dome filters out daylight.' },
      { pin: 'dlow:3', icon: 'pin', title: 'Pin 2', text: 'Receives the decoded pulses.' },
    ],
    overview: [
      'A remote control flashes an infrared LED on and off 38 000 times a second, in a pattern that spells out a code. The receiver only reacts to that 38 kHz flicker, so lamps and sunlight do not confuse it, and it passes the pattern to pin 2.',
      'The **IRremote** library times the pulses and turns them into a protocol name and a **command** number. Each button has its own command.',
      { tips: [['code', 'Print every command once, then use them in `if` or `switch`'], ['sensor', 'Point the remote at the dome from up to about 8 m'], ['info', 'Most small kit remotes use the NEC protocol']] },
    ],
    wiring: [{ pin: 'dlow:3', to: 'Receiver **OUT**' }, { pin: 'power:6', to: 'GND rail → receiver **GND**' }, { pin: 'power:5', to: '5 V rail → receiver **VCC**' }],
    wiringNotes: ['Breakout boards order their pins differently (S, +, − is common). Follow the labels, not this picture.'],
    code: [{ file: 'remote.ino', lang: 'cpp', trace: { read: 13 }, source: `
#include <IRremote.hpp>

const int IR_PIN = 2;

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(IR_PIN, ENABLE_LED_FEEDBACK);   // the L LED blinks on each signal
}

void loop() {
  if (IrReceiver.decode()) {
    Serial.print("Command: 0x");
    Serial.println(IrReceiver.decodedIRData.command, HEX);
    IrReceiver.resume();   // ready for the next button
  }
}
` }],
    codeNotes: ['Install the library with `arduino-cli lib install IRremote`. Holding a button sends repeat frames; check `decodedIRData.flags` to ignore them.'],
    sim: {
      type: 'sequence', caption: 'Press Run: a few remote buttons are pressed in turn.',
      steps: [
        { ms: 1200, log: 'Command: 0x45', trace: 'read' },
        { ms: 1200, log: 'Command: 0x46', trace: 'read' },
        { ms: 1200, log: 'Command: 0x15', trace: 'read' },
        { ms: 1200, log: 'Command: 0x7', trace: 'read' },
      ],
    },
    run: { cmd: UPLOAD('remote'), stop: [] },
    kit: [['1', 'VS1838B IR receiver and remote', 'Usually sold together.'], ['3', 'Jumper wires']],
  },

  {
    id: 'rfid',
    title: 'RFID cards',
    summary: 'An RC522 reader on the SPI pins reads the ID of a card or key fob held over it.',
    icon: 'circuit',
    focus: { pins: ['dhigh:2', 'dhigh:3', 'dhigh:4', 'dhigh:5', 'dhigh:6', 'power:4', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'rfid1', type: 'module', preset: 'rc522', pins: ['j8', 'j9', 'j10', 'j11', 'j12', 'j13', 'j14', 'j15'], label: 'RC522', desc: '13.56 MHz RFID reader. Pins: SDA, SCK, MOSI, MISO, IRQ, GND, RST, 3.3V.' }],
      wires: [
        ...RAILS,
        { from: 'dhigh:3', to: 'bb:g8', color: '#f2c12e' }, { from: 'dhigh:6', to: 'bb:g9', color: '#3b78d6' }, { from: 'dhigh:4', to: 'bb:g10', color: '#3fae5a' },
        { from: 'dhigh:5', to: 'bb:g11', color: '#9b59d0' }, { from: 'bb:h13', to: 'bb:bn13', color: BLACK }, { from: 'dhigh:2', to: 'bb:g14', color: '#f08a24' },
        { from: 'power:4', to: 'bb:h15', color: '#f08a24' },
      ],
    },
    callouts: [
      { part: 'rfid1', icon: 'wifi', title: 'RC522', text: 'The copper loop is the antenna.' },
      { pin: 'dhigh:6', icon: 'pin', title: 'Pins 10–13', text: 'SPI: SS, MOSI, MISO, SCK.' },
      { pin: 'dhigh:2', icon: 'pin', title: 'Pin 9 · RST', text: 'Resets the reader.' },
      { pin: 'power:4', icon: 'power', title: '3.3 V', text: 'Not 5 V: the reader is a 3.3 V chip.' },
    ],
    overview: [
      'An RFID card has a tiny chip and a coil but no battery. The reader’s antenna makes a radio field; when a card comes within a few centimetres, the field powers the chip and it answers with its **UID**, a number unique to that card.',
      'The reader talks to the Uno over **SPI**, a fast four-wire bus: SCK (clock), MOSI (Uno to reader), MISO (reader to Uno) and SS (which device is being addressed). On the Uno those are pins 13, 11, 12 and 10.',
      { tips: [['code', 'Print a card’s UID once, then compare against it'], ['wifi', 'Works at 13.56 MHz with MIFARE cards and fobs'], ['power', 'Power it from 3.3 V, never 5 V']] },
      { note: 'A UID is easy to copy, so it is fine for a hobby door chime or a toy, not for a real lock.', tone: 'warn' },
    ],
    wiring: [
      { pin: 'dhigh:3', to: 'Reader **SDA** (SS)' }, { pin: 'dhigh:6', to: 'Reader **SCK**' }, { pin: 'dhigh:4', to: 'Reader **MOSI**' }, { pin: 'dhigh:5', to: 'Reader **MISO**' },
      { pin: 'dhigh:2', to: 'Reader **RST**' }, { pin: 'power:4', to: 'Reader **3.3V**' }, { pin: 'power:6', to: 'GND rail → reader **GND**' },
    ],
    wiringNotes: ['IRQ stays unconnected.', 'The reader’s signal pins see the Uno’s 5 V logic. Most boards cope, but a level shifter is the careful choice for a project that stays built.'],
    code: [{ file: 'rfid.ino', lang: 'cpp', trace: { read: 16 }, source: `
#include <SPI.h>
#include <MFRC522.h>

const int SS_PIN = 10, RST_PIN = 9;
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Hold a card near the reader");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  Serial.print("Card UID:");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(rfid.uid.uidByte[i], HEX);
  }
  Serial.println();
  rfid.PICC_HaltA();   // stop reading the same card again
}
` }],
    codeNotes: ['Install the library with `arduino-cli lib install MFRC522`.'],
    sim: {
      type: 'sequence', caption: 'Press Run: a card, then a key fob, is held over the reader.',
      steps: [
        { ms: 1500, log: 'Hold a card near the reader' },
        { ms: 1500, log: 'Card UID: 93 4F 2A 1C', trace: 'read' },
        { ms: 1500, log: 'Card UID: 04 A1 7E 52', trace: 'read' },
      ],
    },
    run: { cmd: UPLOAD('rfid'), stop: [] },
    kit: [['1', 'RC522 RFID reader kit', 'Comes with a card and a key fob.'], ['8', 'Jumper wires']],
  },

  {
    id: 'sdcard',
    title: 'microSD logging',
    short: 'microSD',
    summary: 'A microSD module on SPI saves a line of data every few seconds to a file you can open on a computer.',
    icon: 'circuit',
    focus: { pins: ['dhigh:3', 'dhigh:4', 'dhigh:5', 'dhigh:6', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'sd1', type: 'module', preset: 'sdcard', pins: ['j10', 'j11', 'j12', 'j13', 'j14', 'j15'], label: 'microSD', desc: 'microSD card module with a 3.3 V regulator and level shifter. Pins: GND, VCC, MISO, MOSI, SCK, CS.' }],
      wires: [
        ...RAILS, { from: 'bb:h10', to: 'bb:bn10', color: BLACK }, { from: 'bb:h11', to: 'bb:bp11', color: RED },
        { from: 'dhigh:5', to: 'bb:g12', color: '#9b59d0' }, { from: 'dhigh:4', to: 'bb:g13', color: '#3fae5a' }, { from: 'dhigh:6', to: 'bb:g14', color: '#3b78d6' }, { from: 'dhigh:3', to: 'bb:g15', color: '#f2c12e' },
      ],
    },
    callouts: [
      { part: 'sd1', icon: 'memory', title: 'microSD', text: 'FAT32 card, up to 32 GB.' },
      { pin: 'dhigh:3', icon: 'pin', title: 'Pin 10 · CS', text: 'Chip select.' },
      { pin: 'dhigh:6', icon: 'pin', title: 'Pins 11–13', text: 'The shared SPI bus.' },
    ],
    overview: [
      'The Uno forgets everything when it loses power. A microSD card keeps data for years, and you can pull it out and open the file on a computer as a spreadsheet.',
      'The card speaks **SPI**, on the same pins 11, 12 and 13 as the RFID reader; **CS** (chip select) picks which SPI device is listening. The module converts the Uno’s 5 V to the card’s 3.3 V.',
      { tips: [['memory', 'Format the card as FAT32'], ['code', 'Always `close()` the file, or the last lines are lost'], ['info', 'Names are limited to 8 + 3 letters, like LOG.CSV']] },
    ],
    wiring: [
      { pin: 'power:6', to: 'GND rail → module **GND**' }, { pin: 'power:5', to: '5 V rail → module **VCC**' },
      { pin: 'dhigh:5', to: 'Module **MISO**' }, { pin: 'dhigh:4', to: 'Module **MOSI**' }, { pin: 'dhigh:6', to: 'Module **SCK**' }, { pin: 'dhigh:3', to: 'Module **CS**' },
    ],
    code: [{ file: 'logger.ino', lang: 'cpp', trace: { begin: 8, write: 15 }, source: `
#include <SPI.h>
#include <SD.h>

const int CS_PIN = 10;

void setup() {
  Serial.begin(9600);
  if (!SD.begin(CS_PIN)) { Serial.println("No card found"); while (true); }
  Serial.println("Card ready");
}

void loop() {
  File f = SD.open("LOG.CSV", FILE_WRITE);   // opens at the end, creating it if needed
  if (f) {
    f.print(millis() / 1000); f.print(","); f.println(analogRead(A0));
    f.close();
    Serial.println("Saved one line to LOG.CSV");
  }
  delay(5000);
}
` }],
    codeNotes: ['Each line is "seconds,reading", which any spreadsheet opens as two columns.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the logger saves a line every 5 seconds (sped up here).',
      steps: [
        { ms: 1200, log: 'Card ready', trace: 'begin' },
        { ms: 1500, log: 'Saved one line to LOG.CSV', trace: 'write' },
        { ms: 1500, log: 'Saved one line to LOG.CSV', trace: 'write' },
      ],
    },
    run: { cmd: UPLOAD('logger'), stop: [] },
    kit: [['1', 'microSD card module (SPI)'], ['1', 'microSD card, 32 GB or smaller'], ['6', 'Jumper wires']],
  },

  {
    id: 'gps',
    title: 'GPS position',
    summary: 'A NEO-6M GPS module listens to satellites and sends its position to pin 4 as text.',
    icon: 'circuit',
    focus: { pins: ['dlow:5', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'gps1', type: 'module', preset: 'gps', pins: ['j12', 'j13', 'j14', 'j15'], label: 'NEO-6M', desc: 'GPS receiver with a ceramic patch antenna, 9600 baud serial. Pins: VCC, RX, TX, GND.' }],
      wires: [...RAILS, { from: 'bb:h12', to: 'bb:bp11', color: RED }, { from: 'dlow:5', to: 'bb:g14', color: '#3fae5a' }, { from: 'bb:h15', to: 'bb:bn15', color: BLACK }],
    },
    callouts: [
      { part: 'gps1', icon: 'globe', title: 'NEO-6M', text: 'The square tile is the antenna.' },
      { pin: 'dlow:5', icon: 'pin', title: 'Pin 4 · from TX', text: 'GPS text arrives here.' },
      { pin: 'power:5', icon: 'power', title: '5 V', text: 'The module has its own regulator.' },
    ],
    overview: [
      'GPS satellites broadcast the exact time. The receiver hears four or more of them, works out how far away each one is from how late its signal arrives, and from that its own position.',
      'The module sends what it knows as lines of text (NMEA sentences) at 9600 baud. Pins 0 and 1 are busy with USB, so the sketch uses **SoftwareSerial** to listen on pin 4, and **TinyGPSPlus** to pick latitude and longitude out of the text.',
      { tips: [['clock', 'The first fix outdoors can take a minute or more'], ['globe', 'It needs a view of the sky: try a window'], ['led', 'The module LED blinks once it has a fix']] },
    ],
    wiring: [{ pin: 'power:5', to: '5 V rail → module **VCC**' }, { pin: 'dlow:5', to: 'Module **TX**' }, { pin: 'power:6', to: 'GND rail → module **GND**' }],
    wiringNotes: ['Module **RX** stays unconnected: this sketch only listens.', 'Plug the antenna’s small round connector in firmly before powering up.'],
    code: [{ file: 'gps.ino', lang: 'cpp', trace: { wait: 21, fix: 16 }, source: `
#include <SoftwareSerial.h>
#include <TinyGPSPlus.h>

SoftwareSerial gpsSerial(4, 3);   // RX on pin 4, TX on pin 3 (unused)
TinyGPSPlus gps;
unsigned long lastNote = 0;

void setup() {
  Serial.begin(9600);
  gpsSerial.begin(9600);
}

void loop() {
  while (gpsSerial.available()) gps.encode(gpsSerial.read());
  if (gps.location.isUpdated()) {
    Serial.print("Lat: "); Serial.print(gps.location.lat(), 5);
    Serial.print("  Lng: "); Serial.print(gps.location.lng(), 5);
    Serial.print("  satellites: "); Serial.println(gps.satellites.value());
  } else if (millis() - lastNote > 2000) {
    lastNote = millis();
    Serial.println("Waiting for a fix...");
  }
}
` }],
    codeNotes: ['Install the library with `arduino-cli lib install TinyGPSPlus`.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the module searches for satellites, then reports a position.', rest: { gps1: { fix: false } },
      steps: [
        { set: { gps1: { fix: false } }, ms: 1500, log: 'Waiting for a fix...', trace: 'wait' },
        { ms: 1500, log: 'Waiting for a fix...', trace: 'wait' },
        { set: { gps1: { fix: true } }, ms: 1500, log: 'Lat: 48.85837  Lng: 2.29448  satellites: 7', trace: 'fix' },
        { set: { gps1: { fix: false } }, ms: 300 },
        { set: { gps1: { fix: true } }, ms: 1500, log: 'Lat: 48.85838  Lng: 2.29446  satellites: 8', trace: 'fix' },
      ],
    },
    run: { cmd: UPLOAD('gps'), stop: [] },
    kit: [['1', 'NEO-6M GPS module with antenna', 'Often sold as GY-NEO6MV2.'], ['3', 'Jumper wires']],
  },

  {
    id: 'rtc',
    title: 'Real-time clock',
    short: 'Clock',
    summary: 'A DS3231 clock module keeps the date and time, even while the Uno is unplugged.',
    icon: 'circuit',
    focus: { pins: ['dhigh:9', 'dhigh:10', 'power:5', 'power:6'] },
    circuit: {
      breadboard: BB,
      parts: [{ id: 'rtc1', type: 'module', preset: 'ds3231', pins: ['j10', 'j11', 'j12', 'j13', 'j14', 'j15'], label: 'DS3231', desc: 'Precise real-time clock with a coin-cell backup, I²C address 0x68. Pins: 32K, SQW, SCL, SDA, VCC, GND.' }],
      wires: [...RAILS, { from: 'dhigh:10', to: 'bb:g12', color: '#f2c12e' }, { from: 'dhigh:9', to: 'bb:g13', color: '#3b78d6' }, { from: 'bb:h14', to: 'bb:bp14', color: RED }, { from: 'bb:h15', to: 'bb:bn15', color: BLACK }],
    },
    callouts: [
      { part: 'rtc1', icon: 'clock', title: 'DS3231', text: 'The coin cell keeps it ticking.' },
      { pin: 'dhigh:9', icon: 'pin', title: 'SDA', text: 'I²C data.' },
      { pin: 'dhigh:10', icon: 'pin', title: 'SCL', text: 'I²C clock.' },
    ],
    overview: [
      '`millis()` starts from zero at every power-up, so the Uno never knows the real time. A **real-time clock** chip counts seconds on its own, from a coin cell when the main power is off.',
      'The DS3231 has a temperature-compensated crystal, so it drifts by only about a minute a year. As a bonus it can report its own temperature.',
      { tips: [['clock', 'Set the time once; the coin cell keeps it'], ['code', 'The sketch sets it from your computer’s clock at upload'], ['thermo', '`getTemperature()` reads the chip temperature']] },
      { note: 'The DS3231 and the MPU-6050 both use I²C address 0x68. To use both, tie the MPU-6050’s AD0 pin to 5 V to move it to 0x69.' },
    ],
    wiring: [{ pin: 'dhigh:10', to: 'Module **SCL**' }, { pin: 'dhigh:9', to: 'Module **SDA**' }, { pin: 'power:5', to: '5 V rail → module **VCC**' }, { pin: 'power:6', to: 'GND rail → module **GND**' }],
    wiringNotes: [{ note: 'Many ZS-042 boards try to charge the coin cell. With a non-rechargeable CR2032, use an LIR2032 instead or remove the charging resistor.', tone: 'warn' }],
    code: [{ file: 'clock.ino', lang: 'cpp', trace: { tick: 15 }, source: `
#include <RTClib.h>

RTC_DS3231 rtc;

void setup() {
  Serial.begin(9600);
  if (!rtc.begin()) Serial.println("RTC not found");
  if (rtc.lostPower()) rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));   // time of upload
}

void loop() {
  DateTime now = rtc.now();
  char text[20];
  sprintf(text, "%04d-%02d-%02d %02d:%02d:%02d", now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
  Serial.print(text);
  Serial.print("  "); Serial.print(rtc.getTemperature(), 1); Serial.println(" C");
  delay(1000);
}
` }],
    codeNotes: ['Install the library with `arduino-cli lib install RTClib`.', '`lostPower()` is true only when the coin cell ran out, so the time is set once and then left alone.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the clock prints the date, time and its temperature every second.',
      steps: [
        { ms: 1000, log: '2026-10-30 09:15:00  23.5 C', trace: 'tick' },
        { ms: 1000, log: '2026-10-30 09:15:01  23.5 C', trace: 'tick' },
        { ms: 1000, log: '2026-10-30 09:15:02  23.5 C', trace: 'tick' },
        { ms: 1000, log: '2026-10-30 09:15:03  23.8 C', trace: 'tick' },
      ],
    },
    run: { cmd: UPLOAD('clock'), stop: [] },
    kit: [['1', 'DS3231 RTC module (ZS-042)'], ['1', 'CR2032 or LIR2032 coin cell'], ['4', 'Jumper wires']],
  },
];
