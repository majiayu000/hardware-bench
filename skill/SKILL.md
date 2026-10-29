---
name: learn-hardware-site
description: Build or extend an interactive, static, bilingual (English / 简体中文) "learn hardware" hub — a home page listing boards plus one hands-on course per development board or kit (Arduino, Raspberry Pi, ESP32, micro:bit, Pico, AI boards, sensor kits…). Each lesson's real circuit (breadboard, parts, jumper wires) is drawn in 3D next to the board, with leader-line callouts, clickable parts with live controls, pin-accurate wiring tables, line-highlighted code, simulated experiments and a fake terminal. Use when the user asks for a beginner tutorial / starter / learning site for a board or kit, wants to add a board to the hub, or wants a site like learn-arduino or learn-raspberry-pi. Not for general documentation sites or software-only tutorials without a physical board.
---

# Learn-hardware site

Produces a dependency-free static **hub**: one site with a home page that lists boards, and a bilingual (English / 简体中文) hands-on course per board. Three.js is vendored, so nothing loads from a CDN. The engine is written and tested in `template/`:

```
template/
  index.html, hub.js     hub home page (board cards, progress, "coming soon")
  engine/                shared engine: app, 3D scene, part kit, sims, i18n, styles, vendor/three
  boards/boards.js       which boards the home page lists
  boards/<id>/           one board: index.html, content.js, zh.js, cover.png
```

Your job is **content** for one board folder: `content.js` (board model, pin map, lessons, circuits, callouts, code) and `zh.js` (its Chinese translations). The boards in the template are complete worked examples; read the closest one first: Arduino Uno, Raspberry Pi 5 and ESP32-DevKitC for electronics courses with a breadboard, `xiao-esp32s3-sense` for a tiny AI board with an onboard camera and microphone (Arduino C++, a no-code model-deployment lesson), `pc-motherboard` for an assembly course (no code: parts drop into sockets and slots, an `assembly` sim plays each step like a video, and a `boot` sim presses the case power button). For other builds, `pc-build`, `keyboard` and `soldering` show assemblies made only from generic `block` parts; `microbit` uses `pad` contacts and the `matrix` sim; `arduino-uno-q`, `pi-ai-hat` and `jetson-orin-nano` show two-processor boards, add-on accelerators and the `detect` / `chat` AI sims. `references/content-schema.md` is the field-by-field contract.

## Workflow

1. **Settle the brief.** Confirm with the user, or pick defaults and say so:
   - the exact board model and revision
   - the language and beginner library (`gpiozero` on Pi, the Arduino core, MicroPython `machine`)
   - the number of lessons (default 8–12)
   - whether it goes into an existing hub (add a board folder) or a new one (copy the whole template)

2. **Collect facts from primary sources before writing:**
   - **Pin table:** every pin's physical number, name, alternate function and voltage.
   - **Electrical limits:** logic level and per-pin current limits.
   - **Mechanical drawing:** board outline, mounting holes and header pin-1 positions.
   - **Library docs:** the current API of every call you use.

   When sources disagree, use this order:
   1. the board vendor's **board-level** guide or pinout, for what is broken out and usable on that board
   2. the chip datasheet, for electrical limits
   3. the library docs, for API behaviour

   Tell the user about each disagreement and which source you followed. Pin numbers, functions, voltages and API calls must be exact. Component placement may be stylised; say so in a comment above `BOARD`. Never guess. Leave out, or flag, anything you cannot verify, including sensor wiring that comes from general knowledge rather than a datasheet.

3. **Create the board folder.**
   - New hub: `cp -R <this-skill-dir>/template <hub-dir>`, then delete example boards you don't want and their entries in `boards/boards.js`. Point `LINKS` in `boards/boards.js` at the new hub's own repository and issue tracker, and replace the canonical / `og:` URLs in every `index.html`, `robots.txt` and `sitemap.xml` with the new site's address.
   - Existing hub: `cp -R <hub>/boards/<closest example> <hub>/boards/<new-id>`.
   - Add the board to `BOARDS` in `boards/boards.js` with its `group` (a section in `GROUPS`: development boards, AI boards, hands-on builds), and its name and blurb to `HUB_ZH`.

4. **Write `content.js`** following the schema:
   - `SITE`, `PIN_TYPES` and `BOARD`, with headers oriented as the schema describes.
   - For each lesson: the text, `circuit`, `callouts`, `icon`, code with `trace`, `sim` and `kit`.
   - Replace the example content entirely; keep its structure.

5. **Translate.** Write `zh.js`: a map from every English string to its Chinese. List what is still missing with:
   ```bash
   bun <this-skill-dir>/scripts/strings.mjs <hub>/boards/<id> --missing
   ```
   Keep `code` spans and **bold** markers. Code, commands, terminal output, pin names and 3D silkscreen stay in English, as on the real hardware.

6. **Update the board's `index.html`:** `<title>` (must equal `SITE.title`), meta description and favicon colour. Leave its import map pointing at `../../engine/` and at `./content.js` / `./zh.js`.

7. **Engine changes are rarely needed.** Every sim string is configurable, and the built-in pin types cover most boards. If you must:
   - **New pin type:** add a token and a `.t-<type>` rule in `engine/styles.css`.
   - **New experiment:** add a factory to `SIMS` in `engine/sims.js`, add it to `RUNNABLE` and `TRACE_LABELS`, and put its UI strings in `UI_ZH` (`engine/i18n.js`).
   - **New part shape:** add a builder to `PARTS` in `engine/kit.js`, add it to `PART_TYPES` and `ICON_HOLES` in `engine/board-geometry.js`, and give it a 2D fill in `boardSvg`.
   - **New on-board component kind:** add a case to `boardComponent` in `engine/kit.js`.
   - **PC-building parts, kinds and sims** live in `engine/kit-pc.js` (`PC_KINDS`, `PC_PARTS`) and `engine/sims-pc.js`. Add new ones there, plus `PART_TYPES` in `engine/board-geometry.js`.

   Keep `app.js` and `board3d.js` generic. Engine changes affect every board: re-run step 8 and 9 for all of them.

8. **Validate until clean:**
   ```bash
   bun <this-skill-dir>/scripts/validate.mjs <hub>/boards/<id>
   ```
   (`node` works too.) The validator checks pins, holes (including double-used holes), wire ends, callout targets, controls, code-trace line numbers and labels, icon names, sim part references, blocks, translation coverage and that translations keep `code` unchanged. Fix every error and read every warning.

9. **Check it in a browser.** ES modules need http, not `file://`:
   ```bash
   python3 -m http.server 5180 --directory <hub>
   ```
   Open `http://localhost:5180/boards/<id>/`. Verify, in **both languages** (the 中 / EN button):
   - every lesson × tab renders with no console errors
   - on a first visit (clear localStorage) the how-to-use guide opens and frames each area; **?** replays it
   - the footer's main button steps through every tab, then finishes the lesson and opens the next
   - Run and Stop work in each Try-it tab, and the code highlight follows along
   - clicking each part opens its popover, and its controls change the 3D part
   - buttons can be held down in the scene
   - the numbered marks sit on the right parts and the key doesn't cover the circuit
   - the 2D fallback works (in a browser without WebGL)
   - a 375 px viewport has no horizontal scroll
   - dark mode looks right
   - in Chinese, `(await import('/engine/i18n.js')).missingTranslations()` in the console lists only code, file names and commands
   - the hub home page shows the new card with its lesson count

   **No GPU?** Headless Chrome can still render the 3D view. Use a fresh profile each run, because cached modules hide edits:
   ```bash
   "<chrome>" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --user-data-dir=<new temp dir> --window-size=1400,860 --virtual-time-budget=15000 --screenshot=<out.png> "http://localhost:5173/#<lesson>"
   ```
   Software rendering is slow: give the first load about 10 s; lesson thumbnails then render one by one in the background. For clicks and holds, drive Chrome over the DevTools protocol (`--remote-debugging-port`). Each callout's `.dot` element sits exactly on its part's anchor, which makes it a reliable click target.

10. **Cover image.** Screenshot the board's first lesson with the callouts hidden, crop it to 16:9 and save it as `boards/<id>/cover.png` (about 720 px wide) for the home page card.

11. **Deploy** the hub folder as plain static files (Vercel, Netlify, GitHub Pages). There is no build step.

## Designing the lessons

Order lessons so each adds one idea and reuses the previous circuit:

tour → setup/toolchain → first output (LED) → input (button) → PWM/analog → a sensor → a bus (I²C/SPI/UART) → a peripheral → connectivity → a capstone that combines earlier lessons.

**Each lesson:**
- Write the English first, short and plain; then translate it into natural Chinese, not word for word.
- One concept, one circuit, one script that runs as-is on the real board (≲ 30 lines).
- `focus.pins`, `wiring`, `circuit.wires` and the code must all agree on the same pins. The validator cross-checks the first three.
- Give it 3–6 callouts: the pins used, ground, and each part. Each callout says what the thing *does* in this lesson.
- Use `tips` in the overview to teach the scene ("Click the resistor to try other values").
- Add `controls` where experimenting teaches something: resistor value, LED colour, object distance, knob position.
- Put safety warnings in `{ note, tone: 'warn' }`, only where they apply.
- The sim must behave like the script: the same messages, timing and limits.
- `kit` lists only what the lesson adds.

**Microcontrollers (Arduino, ESP32, Pico):**
- The terminal is the serial monitor or REPL; set `SITE.shell` to match.
- `run.cmd` is the upload or run command (`arduino-cli upload …`, `mpremote run main.py`).
- Use `lang: 'cpp'` for sketches.
- Boards with **female** headers (Arduino): wires plug straight in; set `style: 'female'` on the header.
- Boards with **male** pins (Pi, DevKitC): wires use female DuPont ends.

## What not to do

- Don't reuse another site's text, artwork or exact visual design. Write original content.
- Don't add a framework, bundler or package.json; the site stays static.
- Don't invent terminal output that looks like a specific real version string. Keep canned output generic or verified.
- Don't hide engine errors: unknown pins, holes, parts, icons, blocks or sim types throw on purpose so mistakes surface in step 8.
