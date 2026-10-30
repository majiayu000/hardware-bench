# content.js schema

Each board lives in `boards/<id>/` of a hub and has four files:
- `content.js` – everything below. It may import helpers from `../../engine/board-geometry.js` (e.g. `pinPosition`) and the shared first-lesson circuits from `../../engine/starter-circuit.js`.
- `zh.js` – `export default { 'English string': '中文', … }` for every user-visible string (`scripts/strings.mjs` lists them). Keys may use `{placeholders}`.
- `index.html` – copy from another board; change `<title>`, description and favicon colour only.
- `cover.png` – 16:9 screenshot for the hub card.


`content.js` exports four values: `SITE`, `PIN_TYPES`, `BOARD` and `LESSONS`. Everything board-specific lives here, and the engine reads nothing else. `scripts/validate.mjs` enforces every rule below. The numbers in the snippets only illustrate the shape of the data; take real values from the board's drawings.

## SITE

```js
export const SITE = {
  id: 'learn-esp32',            // localStorage namespace; lowercase, unique per site
  title: 'Learn ESP32',         // must equal <title> in index.html
  accent: '#e7352c',            // #rrggbb: buttons, highlighted pins, selection
  logicVolts: 3.3,              // GPIO high level; used for LED current hints in popovers
  shell: 'mpremote · /dev/ttyUSB0',   // terminal title bar
  terminalHint: 'Board connected over USB. Press Run to send the script.',
};
```

## PIN_TYPES

Maps a pin category to its legend label. Each key needs a `.t-<key>` rule in `styles.css`.

Built-in keys:
- `power5`, `power3`, `gnd`
- `gpio`, `analog`, `input` (input-only)
- `i2c`, `spi`, `uart`
- `strap` (boot strapping), `flash` (do not use), `reset`, `id`

Keep only the keys your board uses. For a new key, add a `--pin-<key>` token (light and dark) and a `.t-<key>` rule.

## BOARD

Top view, in millimetres:
- the origin is the PCB's top-left corner
- **x** points right, **z** points down
- `h` is the height above the PCB top

```js
export const BOARD = {
  name: 'ESP32-DevKitC V4',
  width: 48.26, depth: 27.94, thickness: 1.6, cornerRadius: 1,
  pcbColor: '#1b1b1b',                         // PCB colour; the board stands on brass standoffs at its `holes`
  silkColor: 'rgba(3,35,75,0.8)',              // optional: silkscreen ink for light-coloured boards
  traces: false,                                // optional: no faint copper traces (a cased device, not a bare PCB)
  heightScale: 1.4,                             // optional: exaggerate component heights for legibility
  holes: [{ x: 2.5, z: 2.5, r: 1.3 }],                       // optional mounting holes
  silkscreen: [{ text: 'ESP32-DevKitC', x: 6, z: 14, size: 1.6, rotate: 0, align: 'left' }],  // optional
  smd: [{ x: 12, z: 14, w: 6, d: 4, count: 8 }],              // optional scattered tiny parts
  components: [ /* see below */ ],
  headers: [ /* see below */ ],
};
```

### components

```js
{ id: 'module', label: 'ESP32-WROOM-32E', desc: 'Dual-core CPU, Wi-Fi and Bluetooth under a metal can.',
  shape: 'box', x: 38, z: 14, w: 18, d: 18, h: 3.1, color: '#c8cacc', text: 'ESP32', textColor: 'rgba(30,30,30,.7)' }
```

| field | notes |
|---|---|
| `id` | unique; used by `focus.components`, callouts and `camera.connector` |
| `label`, `desc` | shown in tooltips, popovers, the Parts list and the `tour` sim; `desc` is one beginner-level sentence |
| `shape` | `box` (needs `w`, `d`, `h`) or `cylinder` (`w` is the diameter) |
| `x`, `z` | centre of the part. Ports may overhang the PCB edge |
| `kind` | adds structure: `chip` (pads, pin-1 dot), `shield` (lid), `usb` (two openings; `accent` colours the tongues), `usbc`, `hdmi`, `ethernet` (opening + LEDs), `jst`, `fpc` (latch), `button` (cap; `accent`), and through-hole: `dip` (legs + notch), `crystal`, `electrolytic` (scored top; `accent` stripe), `usbb`, `dcjack`, `regulator` (tab), `ledsmd` (`accent` lens, `lit: true` glows). Port openings face the nearest board edge. PC boards add `socket` (CPU socket with pin-1 triangle), `slot` (DIMM or PCIe; runs along its longer side, `latches: 'both' \| 'end'`, `accent` latch colour), `m2slot` (`reach`: mm to the standoff), `heatsink` (`fins: 'x' \| 'z'`), `atx` (power connector, `grid: [cols, rows]` of square holes) and `iocluster` (rear ports). `ledmatrix` draws a grid of small LEDs (`grid: [cols, rows]`, `accent` colour) |
| `under: true` | part sits under the PCB (an SD slot, for example). It can still be a callout target |
| `text`, `textSize`, `textColor` | optional marking printed on top; keep chip markings small and grey, like real silkscreen |

Model the parts a beginner should recognise. That is about 8 on a small dev board and up to 16 on a single-board computer; don't pad the list. Parts may overlap or stack (an antenna strip next to a shielded module, for example). The validator does not check for overlap.

### headers

```js
{ id: 'gpio', label: '40-pin GPIO header', short: 'GPIO', desc: '…',
  layout: 'dual',          // 'dual': odd pins on row 1, even on row 2 (Pi style). 'single': one strip
  style: 'male',           // 'male' (gold pins; jumpers use female ends), 'female' (Arduino sockets) or 'pad'
                           // (flat contacts: micro:bit rings, solder pads; add padW, padD and optional padHole, mm)
  pitch: 2.54,
  x: 8.37, z: 4.77,        // centre of physical pin 1
  step: [2.54, 0],         // [dx, dz] to the next column (dual) or next pin (single)
  rowStep: [0, -2.54],     // dual only: odd row → even row
  pins: [{ n: 1, name: '3V3', type: 'power3' }, { n: 3, name: 'GPIO2', alt: 'SDA', type: 'i2c' }, …] }
```

- A board with no pin headers at all (a PC case, a keyboard) uses `headers: []`; its lessons then have no Pinout tab.
- A course for an add-on (a HAT, a graphics card upgrade) can reuse another board's model: `import { BOARD, PIN_TYPES } from '../<board>/content.js'` and re-export them.
- Pins are numbered `1..N` with no gaps, and `n` is the **physical** pin number. Lessons refer to pins as `"<headerId>:<n>"`.
- A keyed position with no pin (PC front-panel, USB and audio headers) is still listed, with `missing: true`: it is drawn as an empty hole and still shows in the pinout table.
- Boards with separate strips (Arduino: power, analog, digital; ESP32 DevKit: J2 and J3) get one `single` header per strip.
- **Orientation:** choose the top view in which the official pinout table reads naturally, then place pin 1 from the mechanical drawing. Vendor photos are often rotated relative to the drawing, so cross-check pin 1 against both (the silkscreen marking or the square pad). Say in a comment above `BOARD` which edge holds the USB connector.
- A long pin list can be written as a compact string and parsed. `template/content.js` does this with `PI_PINS`.

## LESSONS

An array in teaching order. The URL is `#<id>` or `#<id>/<tab>`.

```js
{
  id: 'blink', title: 'Blink an LED', short: 'Blink an LED',     // short: lesson card, ≤ 24 chars
  summary: 'One sentence. Supports `code` and **bold**.',
  icon: { type: 'led', color: 'red' },     // lesson card: 'board' | 'circuit' (the lesson's whole breadboard) | { glyph: <icon> } | { type: <part type>, …part props }
  focus: { pins: ['gpio:11', 'gpio:9'], components: [] },
  view: { az: -0.55, el: 0.66 },          // optional camera angle (radians); front-left is the default
  circuit: { breadboard: { x: -94, z: -8 }, parts: [ … ], wires: [ … ] },   // optional 3D circuit
  callouts: [ { pin: 'gpio:11', icon: 'pin', title: 'GPIO17 · pin 11', text: 'Your code switches it.' } ],
  overview: [ /* blocks */ ],
  wiring: [{ pin: 'gpio:11', to: '330 Ω resistor → LED **long leg**' }],
  wiringNotes: [ /* blocks */ ],
  code: [{ file: 'blink.py', lang: 'python', trace: { on: 7, off: 10 }, source: `…` }],
  codeNotes: [ /* blocks */ ],
  sim: { type: 'led', led: 'led1', resistor: 'res1' },
  run: { cmd: 'python3 blink.py', file: 'blink.py', output: [], stop: ['KeyboardInterrupt'] },
  kit: [['1', 'LED', 'any colour']],
}
```

Tabs appear automatically:
- **Overview:** always.
- **Wiring / Pinout:** always. Shows the headers that hold the focus pins, or all headers.
- **Code:** if the lesson has `code`.
- **Try it:** if it has `sim`.
- **Kit:** if it has `kit`.

`lang` is `python`, `bash`, `cpp`, `javascript`, `ini`, `yaml`, `verilog` or `text`.

### circuit

The circuit is drawn in 3D and in the 2D fallback. Jumper wires get female plugs on male header pins and male plugs in holes.

```js
circuit: {
  breadboard: { x: -94, z: -8 },     // top-left corner, board coordinates (mm); 85.7 × 52 mm half-size board
  parts: [
    { id: 'res1', type: 'resistor', a: 'c24', b: 'c28', ohms: 330, label: '330 Ω resistor', desc: '…',
      controls: { ohms: [220, 330, 1000, 10000] }, drives: 'led1' },
    { id: 'led1', type: 'led', anode: 'e28', cathode: 'e29', color: 'red', label: 'LED',
      controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
  ],
  wires: [{ from: 'gpio:11', to: 'bb:a24', color: '#f0a33a' }, { from: 'bb:a29', to: 'gpio:9', color: '#2b2a30' }],
}
```

**Holes:**
- Terminal holes are `a1`…`j30`.
- Rails are `tp`/`tn` (top +/−, beside row a) and `bp`/`bn` (bottom, beside row j), plus a column number. Rails have no hole at columns 6, 12, 18, 24 and 30.
- Holes a–e in one column are connected, and so are f–j. Each rail is one net.
- Every hole takes one leg or one wire.

| part type | placement | 3D state set by sims |
|---|---|---|
| `led` | `anode`, `cathode`, `color` | `{ on, level, color }` |
| `resistor` | `a`, `b`, `ohms` (bands are drawn from the value) | `{ ohms }` |
| `button` | `legs` ×4, usually straddling the centre channel | `{ pressed }`; the user can press and hold it in the scene |
| `rgbled` | `legs` ×4 (R, common, G, B) | `{ rgb: [r, g, b] }` |
| `pot` | `legs` ×3, `value` 0–1 | `{ value }` |
| `module` | `pins` (one row; two rows for `driver`, which lies flat across the centre channel), `preset`, `label`, `color`, `face` (±1), `state` (initial 3D state) | depends on the preset (below) |
| `camera` | `at: { x, z }` (board coordinates, on the table), `connector`: a component id | none |
| `buzzer` | `legs` ×2 (+, −) | `{ on }` shows sound rings |
| `ldr` | `legs` ×2; `controls: { value: [0, 1] }`, `controlLabel` | none |
| `servo` | `at: { x, z }` on the table, `legs` ×3 (signal, +, −) where its lead plugs in; `controls: { angle: [0, 180] }` | `{ angle }` |
| `motor` | `at: { x, z }` on the table; `kind: 'tt'` (gear motor with a wheel, `legs` ×2, `flip` puts the wheel on the +z side) or `'stepper'` (28BYJ-48, `plug: { hole, up }` where its cable ends on the driver board); `facing: 'x' \| 'z'` | `{ spin }` −1…1 |

**Module presets** (`preset`): `breakout` (generic, default), `hcsr04` (`{ distance }` control), `dht22`, `oled` (`{ lines }`), `lcd1602` (`{ lines: [line1, line2] }`), `ws2812` (8 LEDs, `{ pixels: [[r, g, b] 0–1, …] }`), `relay` (`{ on }`), `driver` (TB6612FNG, flat), `uln2003` (`{ phase }` 0–3 lights one coil LED), `pir` (`{ on }`), `mpu6050`, `soil`, `irrx`, `rc522`, `joystick` (`{ x, y }` −1…1), `sdcard`, `gps` (`{ fix }`), `ds3231`. Pin order is the module's own; name it in `desc`.

**PC build parts** (no breadboard: leave `breadboard` out of the circuit). Each sits on a component or header pins of the board. Every one also takes the generic states `{ shown, lift }` (lift 0 = seated, 1 = held above along its insert direction), which the `assembly` sim drives.

| part type | placement | 3D state |
|---|---|---|
| `socketlid` | `socket`: a `socket` component | `{ open }` 0–1: lever and load plate swing open |
| `cpu` | `socket` | none |
| `cooler` | `socket`; `color`, `accent`, `blade` | `{ spin }` 0/1 |
| `dimm` | `slot`: a DIMM `slot` component; `color`, `accent` (heat-spreader stripe) | none |
| `m2` | `slot`: an `m2slot` component; `length` | none |
| `gpu` | `slot`: a PCIe `slot` component; `length`, `color`, `accent` | none |
| `plug` | `on: ['hdr:6', 'hdr:8']` pins it covers; `colors` (one per wire), `exit: [dx, dz]` cable direction, `reach`, `housing` | none |
| `powerplug` | `connector`: an `atx` component; `strands`, `colors`, `exit`, `reach` | none |
| `casepanel` | `at: { x, z }` on the table; `w`, `color`, `label` | `{ power, hdd }` LEDs |
| `casebutton` | `at`, `y` (height on the panel), `size`, `color`, `label` | `{ pressed }`; pressable in the scene |
| `block` | Any part without its own model, built from rounded boxes: `at: { x, z }`, `w`, `d`, `h`, `y` (base above the board top; `table: true` measures from the table), `color`, `text`, `opacity` (glass), `round`, `boxes: [{ x, z, y, w, d, h, color, text }]` placed relative to it (`y` above its top), `insert: [dx, dy, dz]` | none (`shown` / `lift` only) |
| `fan` | A case fan: `at`, `y`, `table`, `size` (mm), `facing: 'up' \| 'x' \| '-x' \| 'z' \| '-z'`, `color`, `accent`, `rgb: true` (LED ring) | `{ spin }` 0–1, `{ color }` (CSS colour or null) on an RGB fan |
| `screen` | A display lying flat on the board or device: `at: { x, z }`, `w`, `d`, `y` (above the board top, clear of the component under it), `lines`, `bg`, `fg` | `{ lines }` |

Keep the case panel off the line between the camera and the headers it is wired to (beside the board, not in front of it), or it hides the plugs.

**Popover controls:**
- `controls` let the learner change a part from its popover: `ohms` on resistors, `color` on LEDs, `distance: [min, max]` on modules, `value: [0, 1]` on pots.
- `drives: '<led id>'` on a resistor makes its popover show the LED current at `SITE.logicVolts`.

**Layout tips:**
- Put the breadboard beside the board, with the end of the breadboard nearest the header holding the parts, so wires run short and straight.
- Plug wires into the half (a–e or f–j) facing the header.
- Keep parts on rows that the camera sees: the side away from the header, or the near side for standing modules.
- Re-use one `circuit` object across lessons that keep the same wiring.

### callouts

Callouts are 3–6 numbered marks drawn on their anchors, like an assembly diagram. The key in the corner of the 3D view lists each number with its icon, title and text; hovering either one highlights both.

```js
{ pin: 'gpio:11' | part: 'led1' | component: 'soc', icon: 'pin', title: 'GPIO17 · pin 11', text: '≤ 70 characters' }
```

`icon` must be one of the names exported as `ICON_NAMES` from `sims.js`, for example:
- `pin`, `ground`, `power`
- `led`, `resistor`, `button`, `chip`, `sensor`, `camera`, `knob`
- `wave`, `wifi`, `thermo`, `ruler`, `usb`, `memory`, `plug`
- `code`, `globe`, `clock`, `terminal`, `target`, `info`

### Blocks

Used by `overview`, `wiringNotes` and `codeNotes`. Every string accepts `` `code` `` and `**bold**`.

| block | renders |
|---|---|
| `'plain string'` | paragraph |
| `{ h: 'Heading' }` | section heading |
| `{ steps: ['…'] }` | numbered steps |
| `{ tips: [['led', 'Click the LED to change its colour'], …] }` | icon bullets. Use them to teach the scene's interactions |
| `{ note: '…' }`, `{ note: '…', tone: 'warn' }` | callout box. Use `warn` for anything that can damage hardware |
| `{ specs: [['Label', 'Value'], …] }` | grid of spec cards |
| `{ cmd: 'sudo apt update' }` | copyable terminal snippet |

### run, code trace and the terminal

When the user presses ▶ Run:
1. The terminal prints `$ <cmd>` and marks the lesson complete.
2. For sims listed in `RUNNABLE` (exported by `sims.js`), the sim drives everything that follows.
3. For other sims, the lines in `output` are printed.

Run also shows the file `run.file` (default: the first code file) with line numbers. Its `trace` maps the sim's labels to line numbers, so the line that is "executing" is highlighted. Each sim's labels are listed in `TRACE_LABELS` in `sims.js`:

| sim | labels |
|---|---|
| led | `on`, `off` |
| button | `wait`, `pressed`, `released` |
| rgb | `set` |
| distance / env / knob | `read` |
| camera | `start`, `capture` |
| web | `serve`, `on`, `off` |
| dashboard | `reading` |

■ Stop prints `^C` and then the lines in `stop`. Only use stop text you have verified for that toolchain. If unsure, use `stop: []`.

### Sim types

Every string a sim prints can be overridden in its config, so no board's wording is hard-coded.

| type | config | behaviour |
|---|---|---|
| `tour` | — | buttons for each header and component; highlights and zooms to it |
| `commands` | `commands: [{ cmd, note, out }]` | clickable shell commands with canned output |
| `led` | `led`, `resistor`, `label`, `delay`, `volts` | blinks the 3D LED (its brightness follows the chosen resistor and colour); shows a current bubble |
| `button` | `button`, `led`, `label` | press in the panel or in the 3D view; lights the LED while running |
| `rgb` | `led`, `sequence: [[name, [r, g, b]]]`, `repl` (`{r}` `{g}` `{b}` template) | Run plays the sequence; the sliders act as a REPL |
| `distance` | `sensor` (a module with a `distance` control), `max`, `limitNote` | logs `Distance: x cm`, capped at `max`; the object can be moved from the sensor's popover |
| `env` | `sensor`, `fields` (subset of `temp`/`hum`/`pres`), `every`, `tempDigits` | live readings and a "breathe on it" button |
| `knob` | `pot` (optional: leave it out for a reading with no part, such as a microphone level), `label`, `vmax`, `max`, `every`, `log`, `caption`, `slider` (its label); `readout: 'raw'` hides the voltage; optional outputs `led` (brightness) and `servo` (angle), `invert: true` to make them fall as the reading rises | logs `raw: …  voltage: … mV` (or `log` with `{raw}` `{mv}`); the knob, LDR or slider turns in 3D |
| `camera` | `start` (log lines), `file` | Run "captures" a generated photo |
| `web` | `url`, `led`, `label`, `title`, `start`, `request` (`{client}` `{time}` `{path}`) | mock phone browser whose buttons switch the LED |
| `dashboard` | `url`, `sensor`, `title`, `fields`, `every`, `start`, `request` | mock browser with live readings and a sparkline |
| `buzzer` | `buzzer`, `melody: [[name, hz, ms]]` (hz 0 = rest), `pin`, `log` | plays the melody; optional quiet Web Audio sound |
| `servo` | `servo`, `min`, `max`, `step`, `every` | sweeps; slider / popover sets the angle when stopped |
| `parking` | `sensor`, `buzzer`, `led`, `near`, `max` | beeps faster as the object gets closer; LED under `near` |
| `matrix` | `frames: [{ rows: ['0070…'] (one string per row, digits 0–7), ms, log, trace }]`, `color`, `caption` | plays the frames on a dot-matrix panel (LED matrices, the micro:bit display). Each frame's `trace` is a code-trace label |
| `detect` | `objects: [{ label, box: [x, y, w, h] (0–1 of the frame), score, color, fill }]`, `fps`, `start`, `caption` | a camera frame with labelled boxes that jitter like a live detector; logs `label score` |
| `chat` | `model`, `chats: [{ q, a }]`, `path`, `start`, `caption` | a chat window: Run starts the “server”, each question streams its example answer word by word. Trace labels `serve`, `ask`, `reply` |
| `sequence` | `lamps` (LED ids shown in the panel), `steps: [{ set: { ledId: true \| false, partId: { …state } }, tone, ms, log, trace }]`, optional `buzzer`, `button`, `idle`, `rest` (states applied on Stop) | timed light and tone patterns (traffic lights, chimes). Without `button` it loops; with one, Run waits in `idle` and each press plays the steps once. `log` is what the sketch prints; each step's `trace` is a code-trace label |
| `assembly` | `steps: [{ do: 'insert' \| 'remove' \| 'set', parts: [ids], text, zoom, pins, from, to, seconds }]`, `mode: 'assemble' \| 'disassemble'`, `done` | a step-by-step "video" player (play, pause, step, scrub). `insert` lowers parts into place, `remove` lifts them out, `set` tweens state such as `{ open }` from `from` to `to`. `zoom` is the part the camera moves to; `pins` are highlighted. In `assemble` mode the scene outside Try it shows the finished build |
| `boot` | `power`, `reset` (casebutton ids), `panel`, `fans`, `powerPins`, `resetPins`, `post` (log lines) | power and reset buttons, in the panel or in 3D: fans spin, LEDs light, POST lines print; holding power 4 s forces it off |

**Adding a sim type:** add a factory to `SIMS` in the site's `sims.js` that follows the existing ones:
- render into `el`
- use `ctx.log`, `ctx.part`, `ctx.trace`, `ctx.bubble` and `ctx.param`
- return `{ start, stop, input, paramChanged, destroy }`
- clear every timer in `destroy`

Then add the type to `RUNNABLE` and `TRACE_LABELS` in the same file. The validator reads those lists from the site, so you never need to edit the skill itself.
