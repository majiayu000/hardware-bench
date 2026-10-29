// Everything specific to this course lives in this file: site metadata and the lessons.
// The ESP32 DevKitC model and its pin map are shared with the ESP32 course.
// Sources: the ESPHome documentation (getting started, GPIO switch and binary sensor, DHT sensor,
// SSD1306 display, Home Assistant time and sensor) and the Home Assistant ESPHome integration docs.
import { BOARD as DEVKIT, PIN_TYPES as DEVKIT_PIN_TYPES } from '../esp32/content.js';

export const SITE = {
  id: 'learn-esp32-home',
  title: 'ESP32 Smart Home with ESPHome',
  accent: '#1f8fd6',
  logicVolts: 3.3,
  shell: 'esphome logs · 115200 baud',
  terminalHint: 'Board connected over USB. Press Run to compile the YAML and flash it.',
  runPreamble: ['INFO Reading configuration desk.yaml...', 'INFO Compiling app...', 'INFO Successfully compiled program.', 'INFO Uploading desk-node over the air'],
};

export const PIN_TYPES = DEVKIT_PIN_TYPES;
export const BOARD = DEVKIT;

// ---------- the circuit ----------
// The breadboard sits in front of J3 so header pin n lines up with column 26 − n (as in the ESP32
// course). The top rails carry 5 V (from the 5V pin) and GND; the DHT22 takes 3.3 V straight from 3V3.
const FRONT = { x: -19.97, z: 36 };
const RED = '#e2483c';
const BLACK = '#2b2a30';
const RAILS = [{ from: 'j2:19', to: 'bb:tp7', color: RED }, { from: 'j3:7', to: 'bb:tn19', color: BLACK }];
const RELAY = { id: 'relay', type: 'module', preset: 'relay', pins: ['c24', 'c25', 'c26'], label: 'Relay', desc: '1-channel relay module rated for 3.3 V logic. Pins: IN, VCC, GND.' };
const RELAY_WIRES = [{ from: 'j3:2', to: 'bb:a24', color: '#f2c12e' }, { from: 'bb:a25', to: 'bb:tp25', color: RED }, { from: 'bb:a26', to: 'bb:tn26', color: BLACK }];
const PIR = { id: 'pir', type: 'module', preset: 'pir', pins: ['c12', 'c13', 'c14'], label: 'HC-SR501', desc: 'PIR motion sensor. Pins: VCC, OUT, GND. OUT is 3.3 V, safe for the ESP32.' };
const PIR_WIRES = [{ from: 'bb:a12', to: 'bb:tp11', color: RED }, { from: 'j3:13', to: 'bb:a13', color: '#3fae5a' }, { from: 'bb:a14', to: 'bb:tn14', color: BLACK }];
const DHT = { id: 'dht', type: 'module', preset: 'dht22', pins: ['c3', 'c4', 'c5'], label: 'DHT22', desc: '3-pin DHT22 module: VCC, DATA, GND. The pull-up resistor is on the module.' };
const DHT_WIRES = [{ from: 'j2:1', to: 'bb:a3', color: '#f08a24' }, { from: 'j3:8', to: 'bb:a4', color: '#3b78d6' }, { from: 'bb:a5', to: 'bb:tn5', color: BLACK }];
const OLED = { id: 'oled', type: 'module', preset: 'oled', pins: ['c19', 'c20', 'c21', 'c22'], label: 'SSD1306', desc: '0.96″ 128 × 64 OLED, I²C address 0x3C. Pins: GND, VCC, SCL, SDA.', state: { lines: ['09:15', 'In  22.4 C', 'Out 14.0 C'] } };
const OLED_WIRES = [{ from: 'bb:a19', to: 'bb:tn20', color: BLACK }, { from: 'bb:a20', to: 'bb:tp20', color: RED }, { from: 'j3:3', to: 'bb:a21', color: '#f2c12e' }, { from: 'j3:6', to: 'bb:a22', color: '#3b78d6' }];
const POWER_PINS = ['j2:19', 'j3:7'];

// The YAML every lesson starts from; each lesson adds a block after it.
const BASE = `esphome:
  name: desk-node

esp32:
  board: esp32dev

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

logger:
api:
ota:
  - platform: esphome`;
const RUN = { cmd: 'esphome run desk.yaml', stop: [] };
const LAMP_YAML = `switch:
  - platform: gpio
    id: lamp
    name: "Desk lamp"
    pin:
      number: GPIO23
      inverted: true      # most relay modules switch on when IN is LOW`;
const DHT_YAML = `sensor:
  - platform: dht
    pin: GPIO19
    model: DHT22
    temperature:
      id: room_temp
      name: "Desk temperature"
    humidity:
      name: "Desk humidity"
    update_interval: 30s`;

export const LESSONS = [
  {
    id: 'setup',
    title: 'ESPHome and Home Assistant',
    short: 'Set up',
    summary: 'Describe the board in a YAML file, let ESPHome write and flash the firmware, and Home Assistant finds it.',
    icon: 'board',
    focus: { components: ['module', 'usb'] },
    callouts: [
      { component: 'module', icon: 'wifi', title: 'ESP32', text: 'Joins your Wi-Fi as a smart-home node.' },
      { component: 'usb', icon: 'usb', title: 'USB', text: 'Only for the very first flash.' },
      { component: 'en', icon: 'button', title: 'EN', text: 'Restarts the node.' },
    ],
    overview: [
      '**Home Assistant** is free software that runs your smart home from a small computer at home (a Raspberry Pi works). **ESPHome** turns an ESP32 into a device it understands, without writing C++: you list the parts in a YAML file, and ESPHome writes, compiles and flashes the firmware.',
      'This course builds one desk node step by step: a lamp on a relay, a motion sensor, a temperature sensor, an automation that ties them together, and finally a small screen with the time and the weather.',
      { steps: [
        'Install ESPHome on your computer, or add the ESPHome add-on in Home Assistant.',
        'Run the wizard: it asks for the board (esp32dev) and your Wi-Fi, and writes `desk.yaml`.',
        'Flash it once over USB with `esphome run desk.yaml`. Later updates go over Wi-Fi.',
        'In Home Assistant, open **Settings → Devices & services**: the new node appears under ESPHome. Click **Configure**.',
      ] },
      { tips: [['code', 'Passwords live in `secrets.yaml`, not in the main file'], ['wifi', 'Wi-Fi must be 2.4 GHz'], ['home', 'Everything runs on your network: no cloud account']] },
    ],
    code: [{ file: 'desk.yaml', lang: 'yaml', source: `
${BASE}
` }],
    codeNotes: ['`api:` lets Home Assistant talk to the node; `ota:` lets later uploads go over Wi-Fi.'],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'pip install esphome', note: 'install ESPHome', out: ['Collecting esphome', 'Successfully installed esphome-2026.10.0'] },
        { cmd: 'esphome wizard desk.yaml', note: 'answer four questions', out: ['(name): desk-node', '(platform): ESP32', '(board): esp32dev', '(ssid): your-wifi', 'DONE! I\'ve now written a new configuration file to desk.yaml'] },
        { cmd: 'esphome run desk.yaml', note: 'compile and flash over USB', out: ['INFO Successfully compiled program.', 'Found multiple options for uploading, please choose one:', '  [1] /dev/ttyUSB0 (CP2102N USB to UART Bridge Controller)', 'INFO Upload successful', '[I][wifi]: WiFi Connected!', '[C][api]: API Server: Address: desk-node.local:6053'] },
      ],
    },
    kit: [['1', 'ESP32 DevKitC and USB cable'], ['1', 'Home Assistant', 'On a Raspberry Pi, a mini PC or a virtual machine.'], ['1', 'Half-size breadboard and jumper wires']],
  },

  {
    id: 'lamp',
    title: 'A lamp switch',
    summary: 'Add a relay on GPIO23 and the lamp shows up as a switch in Home Assistant and on your phone.',
    icon: 'circuit',
    focus: { pins: ['j3:2', ...POWER_PINS] },
    circuit: { breadboard: FRONT, parts: [RELAY], wires: [...RAILS, ...RELAY_WIRES] },
    callouts: [
      { part: 'relay', icon: 'plug', title: 'Relay', text: 'Switches the lamp’s low-voltage supply.' },
      { pin: 'j3:2', icon: 'pin', title: 'IO23', text: 'Drives the relay input.' },
      { pin: 'j2:19', icon: 'power', title: '5V', text: 'Feeds the + rail for the coil.' },
    ],
    overview: [
      'A `switch` with `platform: gpio` is the simplest ESPHome part: one pin, on or off. Its `name` is what Home Assistant shows, and the `id` is how the rest of the YAML refers to it.',
      '`inverted: true` flips the pin, because most relay modules switch on when IN is pulled LOW.',
      { tips: [['plug', 'Wire the lamp through COM and NO'], ['home', 'Add the switch to a dashboard card'], ['code', 'Change the YAML, run again: the update goes over Wi-Fi']] },
      { note: 'Use the relay for low-voltage loads only: a 5 V or 12 V lamp or LED strip with its own supply. Leave mains wiring to an electrician.', tone: 'warn' },
    ],
    wiring: [{ pin: 'j3:2', to: 'Relay **IN**' }, { pin: 'j2:19', to: 'Top + rail (5 V) → relay **VCC**' }, { pin: 'j3:7', to: 'Top − rail → relay **GND**' }],
    wiringNotes: ['Choose a relay module that says it works with **3.3 V** logic. Some 5 V modules never fully switch off when driven by a 3.3 V pin.'],
    code: [{ file: 'desk.yaml', lang: 'yaml', trace: { on: 19, off: 19 }, source: `
${BASE}

${LAMP_YAML}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: someone taps the lamp switch in Home Assistant, twice.', rest: { relay: { on: false } },
      steps: [
        { ms: 1200, log: "[C][switch]: GPIO Switch 'Desk lamp'" },
        { set: { relay: { on: true } }, ms: 2500, log: "[D][switch]: 'Desk lamp' Turning ON.", trace: 'on' },
        { set: { relay: { on: false } }, ms: 2500, log: "[D][switch]: 'Desk lamp' Turning OFF.", trace: 'off' },
      ],
    },
    run: RUN,
    kit: [['1', '1-channel relay module, 3.3 V logic'], ['5', 'Jumper wires']],
  },

  {
    id: 'motion',
    title: 'A motion sensor',
    summary: 'A PIR on GPIO4 becomes a motion sensor in Home Assistant, with its own history.',
    icon: 'circuit',
    focus: { pins: ['j3:13', ...POWER_PINS] },
    circuit: { breadboard: FRONT, parts: [PIR], wires: [...RAILS, ...PIR_WIRES] },
    callouts: [
      { part: 'pir', icon: 'sensor', title: 'HC-SR501', text: 'Sees warm bodies move.' },
      { pin: 'j3:13', icon: 'pin', title: 'IO4', text: 'Reads OUT.' },
    ],
    overview: [
      'A `binary_sensor` is the input twin of a switch: one pin, read as on or off. `device_class: motion` tells Home Assistant to show it as **Detected / Clear** with a motion icon.',
      'Home Assistant keeps a history of every change, so you can see when the room was in use.',
      { tips: [['clock', 'The PIR needs a minute to settle at power-up'], ['knob', 'Set the PIR time screw to its shortest; ESPHome will handle the timing'], ['home', 'Each state change appears in the logbook']] },
    ],
    wiring: [{ pin: 'j2:19', to: 'Top + rail (5 V) → PIR **VCC**' }, { pin: 'j3:13', to: 'PIR **OUT**' }, { pin: 'j3:7', to: 'Top − rail → PIR **GND**' }],
    code: [{ file: 'desk.yaml', lang: 'yaml', trace: { start: 18, stop: 18 }, source: `
${BASE}

binary_sensor:
  - platform: gpio
    pin: GPIO4
    name: "Desk motion"
    device_class: motion
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: someone sits down at the desk, then leaves.', rest: { pir: { on: false } },
      steps: [
        { set: { pir: { on: false } }, ms: 1500, log: "[C][binary_sensor]: GPIO Binary Sensor 'Desk motion'" },
        { set: { pir: { on: true } }, ms: 3000, log: "[D][binary_sensor]: 'Desk motion': Sending state ON", trace: 'start' },
        { set: { pir: { on: false } }, ms: 2500, log: "[D][binary_sensor]: 'Desk motion': Sending state OFF", trace: 'stop' },
      ],
    },
    run: RUN,
    kit: [['1', 'HC-SR501 PIR motion sensor'], ['3', 'Jumper wires']],
  },

  {
    id: 'climate',
    title: 'Temperature and humidity',
    summary: 'A DHT22 on GPIO19 reports temperature and humidity every 30 seconds.',
    icon: 'circuit',
    focus: { pins: ['j2:1', 'j3:8', 'j3:7'] },
    circuit: { breadboard: FRONT, parts: [DHT], wires: [RAILS[1], ...DHT_WIRES] },
    callouts: [
      { part: 'dht', icon: 'thermo', title: 'DHT22', text: 'Two readings from one wire.' },
      { pin: 'j3:8', icon: 'wave', title: 'IO19 · data', text: 'The sensor answers here.' },
      { pin: 'j2:1', icon: 'power', title: '3V3', text: 'Keeps the data line at 3.3 V.' },
    ],
    overview: [
      'The `dht` sensor platform reads both values in one go and creates **two** entities in Home Assistant. Home Assistant stores every reading, so you get a temperature graph for free.',
      { tips: [['thermo', 'Keep the sensor away from the ESP32, which warms up'], ['clock', '30 s is plenty for a room; the DHT22 needs at least 2 s'], ['code', 'The `id` lets the screen lesson reuse the temperature']] },
      { note: 'Power the DHT22 from **3V3**, not the 5 V rail, so its data line never goes above 3.3 V.', tone: 'warn' },
    ],
    wiring: [{ pin: 'j2:1', to: 'DHT22 **VCC**' }, { pin: 'j3:8', to: 'DHT22 **DATA**' }, { pin: 'j3:7', to: 'Top − rail → DHT22 **GND**' }],
    code: [{ file: 'desk.yaml', lang: 'yaml', trace: { read: 17 }, source: `
${BASE}

${DHT_YAML}
` }],
    sim: {
      type: 'sequence', caption: 'Press Run: a reading arrives every 30 seconds (sped up here).',
      steps: [
        { ms: 1800, log: "[D][dht]: Got Temperature=22.4°C Humidity=46.1%", trace: 'read' },
        { ms: 1800, log: "[D][dht]: Got Temperature=22.5°C Humidity=46.0%", trace: 'read' },
        { ms: 1800, log: "[D][dht]: Got Temperature=22.5°C Humidity=45.8%", trace: 'read' },
      ],
    },
    run: RUN,
    kit: [['1', 'DHT22 / AM2302 module', 'The 3-pin module has the pull-up resistor built in.'], ['3', 'Jumper wires']],
  },

  {
    id: 'automation',
    title: 'Lamp follows motion',
    short: 'Automation',
    summary: 'Put all three parts together: motion turns the lamp on, and it switches off two minutes after the room is empty.',
    icon: 'circuit',
    focus: { pins: ['j3:2', 'j3:13', 'j3:8', 'j2:1', ...POWER_PINS] },
    circuit: { breadboard: FRONT, parts: [DHT, PIR, RELAY], wires: [...RAILS, ...DHT_WIRES, ...PIR_WIRES, ...RELAY_WIRES] },
    callouts: [
      { part: 'pir', icon: 'sensor', title: 'Trigger', text: 'Motion starts the automation.' },
      { part: 'relay', icon: 'plug', title: 'Action', text: 'The lamp turns on.' },
      { part: 'dht', icon: 'thermo', title: 'Still reporting', text: 'Unchanged from the last lesson.' },
    ],
    overview: [
      'Automations can run in Home Assistant, or on the node itself. On the node they keep working even when Home Assistant or the Wi-Fi is down, which is what you want for a light.',
      'The `delayed_off: 2min` filter makes the motion sensor stay **on** until the room has been still for two minutes. The automation is then just two lines: turn the lamp on when motion starts, off when it ends.',
      { tips: [['code', '`on_press` and `on_release` are the trigger hooks'], ['clock', 'Each new movement restarts the two minutes'], ['home', 'The lamp switch still works by hand in Home Assistant']] },
    ],
    wiring: [{ pin: 'j3:2', to: 'Relay **IN**' }, { pin: 'j3:13', to: 'PIR **OUT**' }, { pin: 'j3:8', to: 'DHT22 **DATA**' }, { pin: 'j2:1', to: 'DHT22 **VCC**' }, { pin: 'j2:19', to: 'Top + rail: relay and PIR **VCC**' }, { pin: 'j3:7', to: 'Top − rail: every **GND**' }],
    code: [{ file: 'desk.yaml', lang: 'yaml', trace: { start: 43, stop: 45 }, source: `
${BASE}

${LAMP_YAML}

${DHT_YAML}

binary_sensor:
  - platform: gpio
    pin: GPIO4
    name: "Desk motion"
    device_class: motion
    filters:
      - delayed_off: 2min   # stays on until 2 minutes without motion
    on_press:
      - switch.turn_on: lamp
    on_release:
      - switch.turn_off: lamp
` }],
    codeNotes: ['To light the lamp only after dark, add a `condition` that checks the sun, or move the automation into Home Assistant.'],
    sim: {
      type: 'sequence', caption: 'Press Run: someone comes to the desk, works, and leaves (the 2 minutes are shortened).', rest: { pir: { on: false }, relay: { on: false } },
      steps: [
        { set: { pir: { on: false }, relay: { on: false } }, ms: 1500 },
        { set: { pir: { on: true }, relay: { on: true } }, ms: 3000, log: "[D][binary_sensor]: 'Desk motion': Sending state ON", trace: 'start' },
        { set: { pir: { on: false } }, ms: 2000, log: '[D][dht]: Got Temperature=22.6°C Humidity=45.7%' },
        { set: { relay: { on: false } }, ms: 2500, log: "[D][binary_sensor]: 'Desk motion': Sending state OFF", trace: 'stop' },
      ],
    },
    run: RUN,
    kit: [['1', 'Everything from the last three lessons']],
  },

  {
    id: 'screen',
    title: 'Desk screen',
    summary: 'An OLED on I²C shows the time, the room temperature and the outdoor temperature from Home Assistant’s weather.',
    icon: 'circuit',
    focus: { pins: ['j3:3', 'j3:6', 'j3:8', 'j2:1', ...POWER_PINS] },
    circuit: { breadboard: FRONT, parts: [DHT, OLED], wires: [...RAILS, ...DHT_WIRES, ...OLED_WIRES] },
    callouts: [
      { part: 'oled', icon: 'clock', title: 'OLED', text: 'Redrawn every second.' },
      { pin: 'j3:6', icon: 'pin', title: 'IO21 · SDA', text: 'The ESP32’s usual I²C data pin.' },
      { pin: 'j3:3', icon: 'pin', title: 'IO22 · SCL', text: 'The usual I²C clock pin.' },
      { part: 'dht', icon: 'thermo', title: 'Inside', text: 'From the DHT22 on the desk.' },
    ],
    overview: [
      'The node can also **receive** from Home Assistant. `time: platform: homeassistant` keeps the clock in sync, and a `homeassistant` sensor copies any value, here the outdoor temperature from the weather forecast.',
      'The `display` block draws the screen with a short piece of C++ called a **lambda**: `strftime` prints the time, `printf` prints numbers. ESPHome redraws it every second.',
      { tips: [['code', 'Fonts come from Google Fonts at compile time'], ['globe', '`weather.forecast_home` is Home Assistant’s default forecast'], ['clock', 'No Wi-Fi? The clock keeps running from the last sync']] },
    ],
    wiring: [{ pin: 'j3:6', to: 'OLED **SDA**' }, { pin: 'j3:3', to: 'OLED **SCL**' }, { pin: 'j2:19', to: 'Top + rail → OLED **VCC**' }, { pin: 'j3:7', to: 'Top − rail → OLED and DHT22 **GND**' }, { pin: 'j3:8', to: 'DHT22 **DATA**' }, { pin: 'j2:1', to: 'DHT22 **VCC**' }],
    code: [{ file: 'desk.yaml', lang: 'yaml', trace: { draw: 52 }, source: `
${BASE}

${DHT_YAML}
  - platform: homeassistant
    id: outside
    entity_id: weather.forecast_home
    attribute: temperature

time:
  - platform: homeassistant
    id: clock

i2c:
  sda: GPIO21
  scl: GPIO22

font:
  - file: "gfonts://Roboto"
    id: big
    size: 24
  - file: "gfonts://Roboto"
    id: small
    size: 12

display:
  - platform: ssd1306_i2c
    model: "SSD1306 128x64"
    address: 0x3C
    lambda: |-
      it.strftime(0, 0, id(big), "%H:%M", id(clock).now());
      it.printf(0, 34, id(small), "In  %.1f°C", id(room_temp).state);
      it.printf(0, 50, id(small), "Out %.1f°C", id(outside).state);
` }],
    codeNotes: ['The second sensor goes under the same `sensor:` list as the DHT22, which is why it starts with a dash and no new heading.'],
    sim: {
      type: 'sequence', caption: 'Press Run: the screen in the 3D view shows the time and both temperatures.', rest: { oled: { lines: ['', '', ''] } },
      steps: [
        { set: { oled: { lines: ['09:15', 'In  22.4 C', 'Out 14.0 C'] } }, ms: 1500, log: '[I][display]: SSD1306 128x64 ready', trace: 'draw' },
        { set: { oled: { lines: ['09:16', 'In  22.5 C', 'Out 14.0 C'] } }, ms: 1500, trace: 'draw' },
        { set: { oled: { lines: ['09:17', 'In  22.5 C', 'Out 14.2 C'] } }, ms: 1500, trace: 'draw' },
      ],
    },
    run: RUN,
    kit: [['1', '0.96″ SSD1306 OLED, I²C (4 pins)'], ['4', 'Jumper wires']],
  },
];
