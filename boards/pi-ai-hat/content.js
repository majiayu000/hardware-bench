// Everything specific to this course lives in this file: site metadata, the lessons and the parts.
// The Raspberry Pi 5 model and its pin map are shared with the Raspberry Pi course.
import { BOARD as PI5, PIN_TYPES as PI_PIN_TYPES } from '../raspberry-pi/content.js';

export const SITE = {
  id: 'learn-pi-ai-hat',
  title: 'Raspberry Pi 5 + AI HAT+ 2: Local AI',
  accent: '#7a3fbf',
  logicVolts: 3.3,
  shell: 'pi@raspberrypi: ~',
  terminalHint: 'Connected to the Pi over SSH. Press Run to start the command.',
};

export const PIN_TYPES = PI_PIN_TYPES;
export const BOARD = PI5;

// ---------- parts ----------
// The AI HAT+ 2 is a 65 × 56.5 mm HAT+ board with the Hailo-10H accelerator and 8 GB of its own
// LPDDR4X memory (Raspberry Pi product brief). It sits on spacers above the Pi 5, joined to the
// Pi's PCIe connector by a short ribbon cable, with a stacking header passing the GPIO pins
// through. Heights and the chip layout on the HAT are stylised.
const HOLES = [[3.5, 3.5], [61.5, 3.5], [3.5, 52.5], [61.5, 52.5]];
const COOLER = { id: 'cooler', type: 'block', at: { x: 29, z: 30 }, w: 32, d: 28, h: 7, y: 2.5, color: '#9aa0a8', insert: [0, 40, 0], text: 'COOLER', textColor: '#2b2d33', label: 'Active Cooler', desc: 'A heatsink and fan for the Pi 5’s processor. Fit it first: there is no room once the HAT is on. Its cable goes to the FAN connector.' };
const SPACERS = {
  id: 'spacers', type: 'block', at: { x: HOLES[0][0], z: HOLES[0][1] }, w: 5, d: 5, h: 16, color: '#c9a44c', insert: [0, 40, 0], label: 'Spacers and stacking header', desc: 'Four 16 mm spacers hold the HAT above the cooler; the stacking header carries the 40 GPIO pins up through the HAT.',
  boxes: [...HOLES.slice(1).map(([x, z]) => ({ x: x - HOLES[0][0], z: z - HOLES[0][1], y: -16, w: 5, d: 5, h: 16, color: '#c9a44c' })), { x: 32.5 - HOLES[0][0], z: 3.5 - HOLES[0][1], y: -16, w: 51, d: 5, h: 13, color: '#1c1b22' }],
};
const RIBBON = { id: 'ribbon', type: 'block', at: { x: 1.4, z: 28 }, w: 2, d: 13, h: 17, y: 1, color: '#d8b45a', insert: [-30, 0, 0], label: 'PCIe ribbon cable', desc: 'Carries PCIe from the Pi’s PCIe connector to the HAT. Lift the brown latch, slide the cable in, press the latch down.' };
const HAT = {
  id: 'hat', type: 'block', at: { x: 32.5, z: 28.25 }, w: 65, d: 56.5, h: 1.6, y: 18, color: '#2a7d55', insert: [0, 50, 0], label: 'AI HAT+ 2', desc: 'The Hailo-10H accelerator: 40 TOPS (INT4) with 8 GB of its own memory, so models do not use the Pi’s RAM.',
  boxes: [{ x: -4, z: 2, w: 15, d: 15, h: 1.4, color: '#2a2930', text: 'HAILO-10H' }, { x: 14, z: 2, w: 12, d: 10, h: 1, color: '#2a2930', text: '8GB' }],
};
const CAMERA = { id: 'cam', type: 'camera', at: { x: 62, z: 92 }, connector: 'cam0', label: 'Camera Module 3', desc: 'Connected to CAM/DISP 0 with the narrow Pi 5 ribbon cable.' };
const STACK = [COOLER, SPACERS, RIBBON, HAT];

const SSH = (cmd) => cmd;

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the AI HAT+ 2',
    short: 'Meet the HAT',
    summary: 'An accelerator board that lets a Raspberry Pi 5 run vision models and small language models locally.',
    icon: 'circuit',
    focus: { components: ['pcie', 'soc'] },
    circuit: { parts: STACK },
    callouts: [
      { part: 'hat', icon: 'chip', title: 'Hailo-10H', text: '40 TOPS, 8 GB of its own RAM.' },
      { part: 'ribbon', icon: 'plug', title: 'PCIe ribbon', text: 'The fast link to the Pi.' },
      { part: 'cooler', icon: 'thermo', title: 'Active Cooler', text: 'Keeps the Pi’s processor cool.' },
      { component: 'pcie', icon: 'plug', title: 'PCIe connector', text: 'On the Pi’s edge.' },
    ],
    overview: [
      'The Pi 5’s processor can run small AI models, but slowly. The **AI HAT+ 2** adds a **Hailo-10H**, a chip built only for neural-network maths, connected over **PCIe**. It handles vision models in real time and is the first Raspberry Pi accelerator big enough for **language models**, because it carries **8 GB** of its own memory.',
      'Everything runs on the Pi: no account, no cloud, no internet needed once the models are downloaded.',
      { tips: [['target', 'Click the HAT, the ribbon and the cooler'], ['rotr', 'Drag to look under the HAT'], ['play', 'The next lesson builds the stack step by step']] },
      { h: 'Specifications' },
      { specs: [['Accelerator', 'Hailo-10H'], ['Performance', '40 TOPS (INT4)'], ['Memory', '8 GB LPDDR4X on the HAT'], ['Link', 'PCIe Gen 3 ×1'], ['Needs', 'Raspberry Pi 5, 64-bit Raspberry Pi OS'], ['Runs', 'Vision models, small LLMs and VLMs']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Raspberry Pi 5', '8 GB recommended for running a web UI next to the model.'], ['1', 'Raspberry Pi AI HAT+ 2', 'Comes with the ribbon cable, stacking header and spacers.'], ['1', 'Raspberry Pi Active Cooler'], ['1', '27 W USB-C power supply']],
  },

  {
    id: 'assemble',
    title: 'Build the stack',
    summary: 'Cooler first, then spacers and header, the PCIe ribbon and finally the HAT itself.',
    icon: 'circuit',
    focus: { components: ['pcie', 'soc', 'fan'] },
    circuit: { parts: STACK },
    callouts: [
      { part: 'cooler', icon: 'thermo', title: 'Cooler', text: 'Goes on before anything else.' },
      { part: 'spacers', icon: 'target', title: 'Spacers', text: 'Four corners, plus the header.' },
      { part: 'ribbon', icon: 'plug', title: 'Ribbon', text: 'Contacts face the right way.' },
      { part: 'hat', icon: 'chip', title: 'HAT', text: 'Pressed down onto the header.' },
    ],
    overview: [
      'Do this with the Pi **unplugged**. The order matters because each part covers the one before it.',
      { tips: [['play', 'Press Play in Try it to watch each step'], ['plug', 'Ribbon latches lift up and press down: never pull the cable against a closed latch'], ['info', 'Plug the cooler’s cable into the FAN connector']] },
      { note: 'The PCIe ribbon is fragile. Push it fully in with the contacts facing the board, then close the latch; a cable that is in at an angle is the usual reason the HAT is not detected.', tone: 'warn' },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['cooler'], text: 'Fit the **Active Cooler** over the processor and plug its cable into **FAN**.' },
        { do: 'insert', parts: ['spacers'], text: 'Screw in the four **spacers** and press the **stacking header** onto the GPIO pins.' },
        { do: 'insert', parts: ['ribbon'], text: 'Open the **PCIe** latch, slide in the **ribbon cable**, close the latch.' },
        { do: 'insert', parts: ['hat'], seconds: 1.6, text: 'Feed the ribbon into the HAT, then press the **AI HAT+ 2** onto the header and screw it to the spacers.' },
      ],
    },
    kit: [['–', 'Everything from the AI HAT+ 2 box'], ['1', 'Small Phillips screwdriver']],
  },

  {
    id: 'install',
    title: 'Install the software',
    summary: 'Update Raspberry Pi OS, install the Hailo-10H driver package and check the chip is found.',
    icon: 'circuit',
    focus: { components: ['pcie'] },
    circuit: { parts: STACK },
    callouts: [
      { part: 'hat', icon: 'chip', title: 'Hailo-10H', text: 'hailortcli talks to it.' },
      { component: 'pcie', icon: 'plug', title: 'PCIe', text: 'Set to Gen 3 automatically.' },
    ],
    overview: [
      'Start from an up-to-date **64-bit Raspberry Pi OS** (Trixie). The AI HAT+ 2 has its own driver package, `hailo-h10-all`.',
      { steps: [
        'Update the system and the bootloader, then reboot.',
        'Install `dkms`, then `hailo-h10-all`, then reboot again.',
        'Run `hailortcli fw-control identify`. It should describe the device; `<N/A>` for the serial and part numbers is normal on this HAT.',
      ] },
      { note: '`hailo-h10-all` cannot be installed next to `hailo-all`, the package for the older AI Kit and AI HAT+. If you used one of those before, remove `hailo-all` first.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: SSH('sudo apt update && sudo apt full-upgrade -y'), note: 'update the system', out: ['Reading package lists... Done', '…'] },
        { cmd: SSH('sudo rpi-eeprom-update -a && sudo reboot'), note: 'update the bootloader', out: ['…', 'Connection closed by remote host.'] },
        { cmd: SSH('sudo apt install dkms hailo-h10-all'), note: 'install the driver', out: ['Setting up hailo-h10-all ...', '…'] },
        { cmd: SSH('sudo reboot'), note: 'load it', out: ['Connection closed by remote host.'] },
        { cmd: SSH('hailortcli fw-control identify'), note: 'is it there?', out: ['Identifying board', '…', 'Serial Number: <N/A>', 'Part Number: <N/A>', 'Product Name: <N/A>'] },
        { cmd: SSH('dmesg | grep -i hailo'), note: 'kernel messages', out: ['hailo …: Probing on: …', '…'] },
      ],
    },
    kit: [['1', 'microSD card with 64-bit Raspberry Pi OS', 'Flashed with Raspberry Pi Imager.']],
  },

  {
    id: 'camera',
    title: 'Add the camera',
    summary: 'Connect a Camera Module to CAM/DISP 0 and check it works before adding AI.',
    icon: { type: 'camera' },
    focus: { components: ['cam0'] },
    circuit: { parts: [...STACK, CAMERA] },
    callouts: [
      { part: 'cam', icon: 'camera', title: 'Camera Module 3', text: '12 MP with autofocus.' },
      { component: 'cam0', icon: 'plug', title: 'CAM/DISP 0', text: 'Next to the HAT’s edge.' },
    ],
    overview: [
      'The camera plugs into the Pi, not the HAT. Use the narrow **Pi 5 camera cable**, latch lifted, contacts facing away from the latch. Do it with the power off.',
      '`rpicam-hello` opens a preview; over SSH without a screen, add `-n` and it just checks the camera answers.',
      { tips: [['camera', 'Peel the film off the lens'], ['plug', 'Same connector as the Raspberry Pi course’s camera lesson'], ['info', 'Any official Camera Module works with the demos']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: SSH('sudo apt install rpicam-apps'), note: 'camera tools', out: ['rpicam-apps is already the newest version.'] },
        { cmd: SSH('rpicam-hello --list-cameras'), note: 'is it found?', out: ['Available cameras', '-----------------', '0 : imx708 [4608x2592 10-bit RGGB] (…)'] },
        { cmd: SSH('rpicam-hello -t 5000'), note: '5-second preview', out: ['…', 'Camera started'] },
      ],
    },
    kit: [['1', 'Raspberry Pi Camera Module 3'], ['1', 'Pi 5 camera cable (22-pin to 15-pin)']],
  },

  {
    id: 'detect',
    title: 'Detect objects live',
    short: 'Object detection',
    summary: 'Run a YOLO model on the HAT and watch boxes follow people and things in the camera preview.',
    icon: { type: 'camera' },
    focus: { components: ['cam0'] },
    circuit: { parts: [...STACK, CAMERA] },
    callouts: [
      { part: 'hat', icon: 'chip', title: 'Hailo-10H', text: 'Runs YOLO on every frame.' },
      { part: 'cam', icon: 'camera', title: 'Camera', text: 'Feeds the frames.' },
      { component: 'soc', icon: 'chip', title: 'Pi 5', text: 'Just draws the boxes.' },
    ],
    overview: [
      '**YOLO** ("you only look once") models find many objects in one pass over the image: for each one they give a **label**, a **confidence** from 0 to 1 and a **box**. The rpicam-apps camera tools have the Hailo models built in; a **post-process file** tells them which model to run.',
      'On the AI HAT+ 2 the model runs on the Hailo-10H while the Pi’s own processor stays nearly idle, so the preview keeps up with the camera.',
      { tips: [['camera', 'Walk into the frame and watch the box follow you'], ['code', 'Swap yolov8 for yolov6, yolox or yolov5 to compare'], ['terminal', 'Add -v 2 to print the detections as text']] },
    ],
    code: [{ file: 'terminal', lang: 'bash', trace: { detect: 1 }, source: `
rpicam-hello -t 0 --post-process-file /usr/share/rpi-camera-assets/hailo_yolov8_inference.json
` }],
    codeNotes: ['`-t 0` keeps the preview running until you close it or press **Ctrl+C**.'],
    sim: {
      type: 'detect', fps: 30, start: ['Camera started', 'Loading YOLOv8 on the Hailo-10H…'],
      objects: [
        { label: 'person', box: [0.12, 0.18, 0.28, 0.66], score: 0.91, fill: '#4b5a6e', color: '#ffcc33' },
        { label: 'cup', box: [0.58, 0.55, 0.09, 0.17], score: 0.77, fill: '#c65a3b', color: '#3fe06b' },
        { label: 'laptop', box: [0.7, 0.48, 0.24, 0.24], score: 0.84, fill: '#2b2d33', color: '#5aa9ff' },
      ],
    },
    run: { cmd: 'rpicam-hello -t 0 --post-process-file …/hailo_yolov8_inference.json', stop: [] },
    kit: [['–', 'The camera from the last lesson']],
  },

  {
    id: 'vision',
    title: 'Pose and segmentation',
    summary: 'Two more built-in demos: a skeleton on every person, and a mask over every object.',
    icon: { type: 'camera' },
    focus: { components: ['cam0'] },
    circuit: { parts: [...STACK, CAMERA] },
    callouts: [
      { part: 'hat', icon: 'chip', title: 'Same chip', text: 'Different model, same command.' },
      { part: 'cam', icon: 'camera', title: 'Camera', text: 'Stand back so your whole body fits.' },
    ],
    overview: [
      '**Pose estimation** finds 17 key points on each person (eyes, shoulders, elbows, knees…) and joins them into a skeleton. **Instance segmentation** colours in the exact outline of every object instead of drawing a box.',
      'Both use the same `rpicam-hello` command with a different post-process file.',
      { tips: [['camera', 'Wave your arms for the pose demo'], ['code', 'Segmentation is heavier: the command lowers the frame rate'], ['info', '-n turns the window off, -v 2 prints text']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'rpicam-hello -t 0 --post-process-file /usr/share/rpi-camera-assets/hailo_yolov8_pose.json', note: 'pose', out: ['Camera started', '…'] },
        { cmd: 'rpicam-hello -t 0 --post-process-file /usr/share/rpi-camera-assets/hailo_yolov5_segmentation.json --framerate 20', note: 'segmentation', out: ['Camera started', '…'] },
        { cmd: 'rpicam-hello -t 0 --post-process-file /usr/share/rpi-camera-assets/hailo_yolox_inference.json', note: 'another detector', out: ['Camera started', '…'] },
      ],
    },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'llm',
    title: 'Run a language model',
    short: 'Local LLM',
    summary: 'Install the hailo-ollama server, download a small model and ask it a question with curl.',
    icon: 'circuit',
    focus: { components: ['soc'] },
    circuit: { parts: STACK },
    callouts: [
      { part: 'hat', icon: 'memory', title: '8 GB on the HAT', text: 'The model lives here.' },
      { component: 'eth', icon: 'globe', title: 'Network', text: 'Only for the download.' },
    ],
    overview: [
      'The Hailo **GenAI Model Zoo** package installs `hailo-ollama`, a server that runs language models on the Hailo-10H and answers on port **8000** with an Ollama-style API. Small models such as **Qwen2 1.5B** fit in the HAT’s memory.',
      { steps: [
        'Download `hailo_gen_ai_model_zoo_5.1.1_arm64.deb` from Hailo (the link is in the Raspberry Pi AI documentation) and install it with `dpkg`.',
        'Start the server with `hailo-ollama` and leave it running.',
        'In a second terminal, list the models, pull one, then send a chat request.',
      ] },
      { note: 'Small models are fast but make mistakes. Treat their answers as a draft, never as fact.' },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'sudo dpkg -i hailo_gen_ai_model_zoo_5.1.1_arm64.deb', note: 'install', out: ['Setting up hailo-gen-ai-model-zoo …'] },
        { cmd: 'hailo-ollama', note: 'start the server (keep it open)', out: ['… listening on port 8000'] },
        { cmd: 'curl --silent http://localhost:8000/hailo/v1/list', note: 'available models', out: ['{"models": [ … ]}'] },
        { cmd: 'curl --silent http://localhost:8000/api/pull -H \'Content-Type: application/json\' -d \'{ "model": "qwen2:1.5b", "stream": true }\'', note: 'download one', out: ['{"status":"pulling manifest"}', '…', '{"status":"success"}'] },
      ],
    },
    kit: [['1', 'Internet connection', 'For the downloads only.']],
  },

  {
    id: 'chat',
    title: 'Chat from Python',
    summary: 'Send questions to the local model from a short Python script and print the answers.',
    icon: 'circuit',
    focus: { components: ['soc'] },
    circuit: { parts: STACK },
    callouts: [
      { component: 'soc', icon: 'code', title: 'Python', text: 'Sends the question.' },
      { part: 'hat', icon: 'chip', title: 'Hailo-10H', text: 'Generates the answer.' },
    ],
    overview: [
      'The chat endpoint takes a list of **messages**, each with a `role` (`user` or `assistant`) and `content`. Keep appending to the list and the model remembers the conversation.',
      'With `"stream": false` the server sends the whole answer at once, which keeps the script simple. Streaming instead sends it word by word, the way the Try it panel shows it.',
      { tips: [['code', 'Start `messages` with a `system` message to give the assistant a personality'], ['clock', 'The first answer is slower while the model loads'], ['globe', 'Open WebUI gives the same model a ChatGPT-style page']] },
    ],
    code: [{ file: 'chat.py', lang: 'python', trace: { serve: 3, ask: 9, reply: 12 }, source: `
import requests

URL = "http://localhost:8000/api/chat"
MODEL = "qwen2:1.5b"
messages = []

while True:
    messages.append({"role": "user", "content": input("You: ")})
    reply = requests.post(URL, json={"model": MODEL, "messages": messages, "stream": False}).json()
    answer = reply["message"]["content"]
    messages.append({"role": "assistant", "content": answer})
    print("AI:", answer)
` }],
    codeNotes: ['`hailo-ollama` must already be running in another terminal.'],
    sim: {
      type: 'chat', model: 'qwen2:1.5b', start: ['Connected to hailo-ollama on port 8000'],
      chats: [
        { q: 'Explain what a GPIO pin is in one sentence.', a: 'A GPIO pin is a general-purpose input/output pin that your program can switch on and off or read, to control or sense simple electronics.' },
        { q: 'Translate to French: The cat is on the table.', a: 'Le chat est sur la table.' },
        { q: 'Give me three ideas for a Raspberry Pi project.', a: '1. A weather station that logs temperature and humidity. 2. A camera that tells you when a parcel arrives. 3. A voice assistant that runs offline.' },
      ],
    },
    run: { cmd: 'python3 chat.py', stop: ['KeyboardInterrupt'] },
    kit: [['–', 'Nothing extra: requests comes with Raspberry Pi OS']],
  },
];
