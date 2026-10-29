// Everything specific to this board lives in this file: site metadata, the 3D board model,
// the pin header map and the lessons. The engine (app.js, board3d.js, sims.js) is generic.

export const SITE = {
  id: 'learn-jetson-orin-nano',
  title: 'NVIDIA Jetson Orin Nano Super: AI on Your Desk',
  accent: '#76b900',
  logicVolts: 3.3,
  shell: 'jetson@ubuntu: ~',
  terminalHint: 'Connected to the Jetson over SSH. Press Run to start the command.',
};

export const PIN_TYPES = { power5: '5 V power', power3: '3.3 V power', gnd: 'Ground', gpio: 'GPIO (3.3 V)', i2c: 'I²C', uart: 'UART', spi: 'SPI' };

// NVIDIA Jetson Orin Nano Super Developer Kit: the module on its carrier board, top view, millimetres,
// the I/O edge (DisplayPort, USB, Ethernet, power) along the back. The 19 V supply, the 8 GB memory and
// the MAXN SUPER mode follow NVIDIA's developer-kit documentation. The kit's 40-pin header follows the
// Raspberry Pi layout for power and ground; only those and the I²C pins are modelled, and the 100 ×
// 79 mm carrier outline, the heatsink and the connector positions are stylised.
const PINS = [
  [1, '3.3V', '', 'power3'], [2, '5V', '', 'power5'], [3, 'I2C SDA', 'I2C bus 7', 'i2c'], [4, '5V', '', 'power5'], [5, 'I2C SCL', 'I2C bus 7', 'i2c'], [6, 'GND', '', 'gnd'],
];
export const BOARD = {
  name: 'Jetson Orin Nano Super Developer Kit',
  width: 100,
  depth: 79,
  thickness: 1.6,
  cornerRadius: 3,
  pcbColor: '#1c1d22',
  holes: [{ x: 4, z: 4, r: 1.4 }, { x: 96, z: 4, r: 1.4 }, { x: 4, z: 75, r: 1.4 }, { x: 96, z: 75, r: 1.4 }],
  silkscreen: [{ text: 'JETSON ORIN NANO', x: 50, z: 74, size: 2.4, weight: 700, align: 'center' }],
  components: [
    { id: 'heatsink', kind: 'heatsink', fins: 'x', label: 'Heatsink and fan', desc: 'Covers the Orin Nano module. The fan speeds up as the GPU works harder.', shape: 'box', x: 50, z: 38, w: 50, d: 46, h: 18, color: '#3a3d45' },
    { id: 'module', under: true, label: 'Orin Nano 8GB module (under the heatsink)', desc: 'The computer itself: a 6-core Arm CPU, a 1024-core Ampere GPU with Tensor Cores, and 8 GB of memory shared by both.', shape: 'box', x: 50, z: 38, w: 70, d: 45, h: 3, color: '#2a2930' },
    { id: 'dp', kind: 'hdmi', label: 'DisplayPort', desc: 'For a monitor during setup. Use a DisplayPort cable or an active adapter.', shape: 'box', x: 22, z: 3, w: 16, d: 7, h: 6, color: '#bfc5ce' },
    { id: 'usb', kind: 'usb', accent: '#3f7be0', label: 'USB 3 ports (×4)', desc: 'Keyboard, mouse, a USB webcam and the USB installer stick.', shape: 'box', x: 44, z: 6, w: 14, d: 13, h: 15, color: '#bfc5ce' },
    { id: 'eth', kind: 'ethernet', label: 'Gigabit Ethernet', desc: 'The most reliable way to download models.', shape: 'box', x: 64, z: 7, w: 16, d: 15, h: 13, color: '#bfc5ce' },
    { id: 'usbc', kind: 'usbc', label: 'USB-C', desc: 'Data only (not power). Plugged into a PC, the Jetson appears at 192.168.55.1 for SSH.', shape: 'box', x: 80, z: 4, w: 9, d: 7, h: 3.2, color: '#bfc5ce' },
    { id: 'power', kind: 'dcjack', label: '19 V power jack', desc: 'Use the 19 V supply from the box.', shape: 'box', x: 92, z: 6, w: 9, d: 12, h: 11, color: '#24232b' },
    { id: 'nvme', label: 'M.2 slots (underneath)', desc: 'For an NVMe SSD: much faster and roomier than a microSD card for AI models.', under: true, shape: 'box', x: 50, z: 60, w: 60, d: 22, h: 3, color: '#24232b' },
    { id: 'csi', kind: 'fpc', label: 'Camera connectors (CSI)', desc: 'Two ribbon-cable camera connectors; a USB webcam also works for these lessons.', shape: 'box', x: 8, z: 50, w: 4, d: 16, h: 2.6, color: '#e9e3d3' },
    { id: 'sd', label: 'microSD slot (on the module)', desc: 'Reached from the side of the module. 64 GB or larger UHS-1 cards if you do not use an SSD.', shape: 'box', x: 76, z: 50, w: 4, d: 12, h: 2, color: '#b8bcc4' },
  ],
  headers: [{
    id: 'gpio', label: '40-pin expansion header (first pins)', short: 'J12',
    desc: 'Laid out like a Raspberry Pi header: 3.3 V and 5 V power, ground, I²C, SPI, UART and GPIO. Only the first six pins are drawn here.',
    layout: 'dual', style: 'male', pitch: 2.54, x: 30, z: 72, step: [2.54, 0], rowStep: [0, -2.54],
    pins: PINS.map(([n, name, alt, type]) => (alt ? { n, name, alt, type } : { n, name, type })),
  }],
};

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the Jetson Orin Nano Super',
    short: 'Meet the kit',
    summary: 'A small computer with a real NVIDIA GPU: the step up for running modern AI models locally.',
    icon: 'board',
    focus: { components: ['heatsink'] },
    callouts: [
      { component: 'heatsink', icon: 'chip', title: 'Orin Nano module', text: 'CPU, GPU and 8 GB under the fan.' },
      { component: 'power', icon: 'power', title: '19 V jack', text: 'Use the supply from the box.' },
      { component: 'dp', icon: 'plug', title: 'DisplayPort', text: 'For the monitor during setup.' },
      { component: 'usbc', icon: 'usb', title: 'USB-C', text: 'Data and SSH, not power.' },
      { component: 'nvme', icon: 'memory', title: 'M.2 slots', text: 'Put models on an NVMe SSD.' },
    ],
    overview: [
      'The **Jetson Orin Nano Super Developer Kit** is NVIDIA’s smallest AI computer. Where a Raspberry Pi needs an add-on accelerator, the Jetson has a **GPU with Tensor Cores** built in, and runs the same **CUDA** software that powers AI on big servers.',
      'It runs Ubuntu-based **Jetson Linux**. Its **8 GB** of memory is shared between CPU and GPU, which sets the size of model you can run: small language models, vision models and robotics pipelines fit well.',
      { tips: [['target', 'Click the heatsink, the jacks and the slots'], ['rotr', 'Drag to look at the I/O edge'], ['info', '“Super” is a newer firmware and power mode that lifts performance on the same hardware']] },
      { note: 'This is an advanced kit: you will use the Linux terminal throughout. The Raspberry Pi course is a good warm-up.' },
      { h: 'Specifications' },
      { specs: [['AI performance', 'Up to 67 TOPS (MAXN SUPER)'], ['GPU', 'NVIDIA Ampere, 1024 CUDA cores, 32 Tensor Cores'], ['CPU', '6-core Arm Cortex-A78AE'], ['Memory', '8 GB LPDDR5, shared'], ['Storage', 'microSD, 2 × M.2 NVMe'], ['Power', '19 V supply in the box']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'NVIDIA Jetson Orin Nano Super Developer Kit', 'Comes with the 19 V supply.'], ['1', 'NVMe SSD (256 GB or more) or a 64 GB microSD card'], ['1', 'DisplayPort monitor, USB keyboard and mouse', 'For setup only.']],
  },

  {
    id: 'install',
    title: 'Install Jetson Linux',
    short: 'Install JetPack',
    summary: 'Check the firmware, write the Jetson ISO to a USB stick and install onto the SSD or microSD.',
    icon: 'board',
    focus: { components: ['usb', 'dp', 'nvme'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB installer', text: 'The ISO on a 16 GB stick.' },
      { component: 'dp', icon: 'plug', title: 'Monitor', text: 'To see the setup screens.' },
      { component: 'nvme', icon: 'memory', title: 'Target', text: 'The SSD or microSD gets wiped.' },
    ],
    overview: [
      'NVIDIA now installs Jetson Linux like a PC operating system: from a **Jetson ISO** on a USB stick, not a pre-made SD-card image. Follow the current **Jetson Orin Nano Developer Kit Quick Start Guide** on docs.nvidia.com; the outline is:',
      { steps: [
        'Connect a monitor, keyboard and the 19 V supply. Press **Esc** at the NVIDIA logo and read the **UEFI firmware version**. If it is older than 36.0, follow NVIDIA’s firmware update path first.',
        'Download the **Jetson ISO** and write it to a 16 GB+ USB stick with **Balena Etcher**.',
        'Insert the stick and the SSD or microSD, power on, press **Esc**, open **Boot Manager** and choose the USB stick.',
        'Answer **Y** when asked to update the firmware (you have 30 seconds), let it reboot, then choose the install entry and the target drive.',
        'On first boot, accept the licence and create your user name and password.',
      ] },
      { note: 'Installing erases the target drive. Do not unplug power while the firmware is updating.', tone: 'warn' },
    ],
    kit: [['1', 'USB flash drive, 16 GB or larger'], ['1', 'PC with Balena Etcher']],
  },

  {
    id: 'super',
    title: 'Switch on MAXN SUPER',
    short: 'Power modes',
    summary: 'Pick the fastest power mode and connect over SSH so the rest of the course runs from your own computer.',
    icon: 'board',
    focus: { components: ['heatsink', 'usbc', 'eth'] },
    callouts: [
      { component: 'heatsink', icon: 'thermo', title: 'Fan', text: 'Works harder in MAXN SUPER.' },
      { component: 'usbc', icon: 'usb', title: 'USB-C', text: '192.168.55.1 from a PC.' },
      { component: 'eth', icon: 'globe', title: 'Network', text: 'hostname -I shows the address.' },
    ],
    overview: [
      'The kit starts in a lower-power mode. Click the power-mode indicator in the top bar of the desktop, open **Power Mode** and choose **MAXN SUPER** for the full 67 TOPS.',
      'From now on you can unplug the monitor and work over **SSH**: from a PC connected by USB-C the Jetson is at **192.168.55.1**; on your network, `hostname -I` shows its address.',
      { tips: [['terminal', 'Run the commands in Try it to connect and join Wi-Fi'], ['thermo', 'MAXN SUPER uses more power: keep the vents clear'], ['code', 'VS Code’s Remote-SSH extension lets you edit files on the Jetson']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'ssh jetson@192.168.55.1', note: 'connect over USB-C', out: ['jetson@192.168.55.1’s password:', 'Welcome to Ubuntu …'] },
        { cmd: 'sudo nmcli device wifi connect your-wifi password your-password', note: 'join Wi-Fi', out: ['Device \'wlP1p1s0\' successfully activated with \'…\'.'] },
        { cmd: 'hostname -I', note: 'find its address', out: ['192.168.1.80 192.168.55.1'] },
      ],
    },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'monitor',
    title: 'Watch the GPU work',
    short: 'Monitor the GPU',
    summary: 'Install jtop to see CPU, GPU, memory, temperature and power in real time.',
    icon: 'board',
    focus: { components: ['module', 'heatsink'] },
    callouts: [
      { component: 'module', icon: 'chip', title: 'GPU', text: 'Watch it fill up under load.' },
      { component: 'heatsink', icon: 'thermo', title: 'Temperature', text: 'jtop shows it live.' },
    ],
    overview: [
      '**jtop** is a dashboard for Jetson: a live view of every CPU core, the GPU, the shared memory, temperatures, fan speed and power draw. Keep it open in a second terminal while models run and you will see the GPU go from idle to 99 %.',
      { tips: [['terminal', 'Press q to quit jtop'], ['memory', 'Memory is shared: a big model leaves less for everything else'], ['thermo', 'Temperatures in the 50s–60s °C under load are normal']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'sudo apt update && sudo apt install python3-pip', note: 'pip', out: ['…'] },
        { cmd: 'sudo pip3 install -U jetson-stats', note: 'install jtop', out: ['Successfully installed jetson-stats-…'] },
        { cmd: 'sudo reboot', note: 'start its service', out: ['Connection closed by remote host.'] },
        { cmd: 'jtop', note: 'open the dashboard', out: ['CPU [ 6 cores ]  GPU [ … ]  RAM [ … / 7.4G ]  Temp  Power …', '(press q to quit)'] },
      ],
    },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'ollama',
    title: 'Run a language model',
    short: 'Ollama',
    summary: 'Install Ollama and chat with a 3-billion-parameter model running on the Jetson’s GPU.',
    icon: 'board',
    focus: { components: ['module'] },
    callouts: [
      { component: 'module', icon: 'chip', title: 'GPU', text: 'Generates the words.' },
      { component: 'nvme', icon: 'memory', title: 'SSD', text: 'Models are gigabytes each.' },
    ],
    overview: [
      '**Ollama** downloads and runs open language models with one command, and keeps a server running on port **11434** that other programs can talk to. Its installer detects the Jetson and uses the GPU.',
      'Models are measured in **parameters**: a 3B (3 billion) model such as **llama3.2:3b** fits comfortably in 8 GB; much bigger ones do not.',
      { tips: [['terminal', 'Type /bye to leave the chat'], ['memory', 'ollama list shows what you have downloaded'], ['info', 'Smaller models are faster but make more mistakes']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'curl -fsSL https://ollama.com/install.sh | sh', note: 'install Ollama', out: ['>>> Installing ollama …', '>>> NVIDIA JetPack ready.', '>>> The Ollama API is now available at 127.0.0.1:11434.'] },
        { cmd: 'ollama run llama3.2:3b', note: 'download and chat', out: ['pulling manifest', '…', 'success', '>>> Send a message (/? for help)'] },
        { cmd: 'ollama list', note: 'installed models', out: ['NAME           ID      SIZE    MODIFIED', 'llama3.2:3b    …       2.0 GB  …'] },
      ],
    },
    kit: [['1', 'Internet connection', 'For the download.']],
  },

  {
    id: 'api',
    title: 'Chat from Python',
    summary: 'Call the Ollama server from a short Python script, so your own programs can use the model.',
    icon: 'board',
    focus: { components: ['module'] },
    callouts: [
      { component: 'module', icon: 'code', title: 'Your script', text: 'Sends JSON to port 11434.' },
      { component: 'heatsink', icon: 'chip', title: 'Ollama', text: 'Runs the model on the GPU.' },
    ],
    overview: [
      'Ollama’s `/api/chat` endpoint takes a model name and a list of **messages**. Append each answer to the list and the model keeps the context of the conversation.',
      { tips: [['code', 'Add a {"role": "system", …} message first to set the tone'], ['clock', 'The first reply is slower while the model loads into memory'], ['globe', 'Open WebUI gives the same model a ChatGPT-style web page']] },
    ],
    code: [{ file: 'chat.py', lang: 'python', trace: { serve: 3, ask: 9, reply: 12 }, source: `
import requests

URL = "http://localhost:11434/api/chat"
MODEL = "llama3.2:3b"
messages = []

while True:
    messages.append({"role": "user", "content": input("You: ")})
    reply = requests.post(URL, json={"model": MODEL, "messages": messages, "stream": False}).json()
    answer = reply["message"]["content"]
    messages.append({"role": "assistant", "content": answer})
    print("AI:", answer)
` }],
    sim: {
      type: 'chat', model: 'llama3.2:3b', path: '/api/chat', start: ['Ollama is running on port 11434'],
      chats: [
        { q: 'What is a Tensor Core, in one sentence?', a: 'A Tensor Core is a part of an NVIDIA GPU built to multiply small matrices very fast, which is most of the work in a neural network.' },
        { q: 'Suggest a name for a robot that waters plants.', a: 'How about “Drizzle”? It is short, friendly, and says exactly what the robot does.' },
        { q: 'Explain CUDA to a ten-year-old.', a: 'CUDA lets a program hand thousands of small jobs to the graphics card at once, like a teacher giving every pupil in the class one sum instead of doing them all alone.' },
      ],
    },
    run: { cmd: 'python3 chat.py', stop: ['KeyboardInterrupt'] },
    kit: [['–', 'Nothing extra']],
  },

  {
    id: 'webui',
    title: 'Add a chat web page',
    short: 'Open WebUI',
    summary: 'Run Open WebUI in Docker to chat with your local models from any browser on your network.',
    icon: 'board',
    focus: { components: ['eth'] },
    callouts: [
      { component: 'eth', icon: 'globe', title: 'Network', text: 'Phones and laptops reach it here.' },
      { component: 'module', icon: 'chip', title: 'Same model', text: 'Open WebUI talks to Ollama.' },
    ],
    overview: [
      '**Open WebUI** is a ChatGPT-style web page for local models. It runs in a **Docker** container next to Ollama and talks to it on port 11434. Once it is up, open `http://<jetson address>:8080` and create the first (admin) account.',
      { tips: [['globe', 'Any device on your network can use it'], ['info', 'The first account created becomes the admin'], ['memory', 'Docker images and models need space: use the SSD']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main', note: 'start Open WebUI', out: ['Unable to find image … locally', '…', 'Status: Downloaded newer image for ghcr.io/open-webui/open-webui:main'] },
        { cmd: 'docker logs -f open-webui', note: 'wait until it is ready', out: ['…', 'Uvicorn running on http://0.0.0.0:8080'] },
      ],
    },
    kit: [['1', 'Phone or laptop on the same network']],
  },

  {
    id: 'vision',
    title: 'Detect objects with the GPU',
    short: 'Object detection',
    summary: 'Run a YOLO model on a USB webcam and watch the GPU label people and things in real time.',
    icon: 'board',
    focus: { components: ['usb', 'module'] },
    callouts: [
      { component: 'usb', icon: 'camera', title: 'USB webcam', text: 'Any UVC webcam works.' },
      { component: 'module', icon: 'chip', title: 'GPU', text: 'Runs YOLO on every frame.' },
    ],
    overview: [
      'The **Ultralytics** package downloads a small **YOLO** model and runs it on the GPU with one call. Each result has a **label**, a **confidence** and a **box**, just like the AI HAT+ 2 course but computed with CUDA.',
      { steps: ['Install Ultralytics with a CUDA-enabled PyTorch for your JetPack version (Ultralytics’ Jetson guide lists the exact wheels).', 'Plug in a USB webcam.', 'Run the script; it prints what it sees.'] },
      { tips: [['camera', 'source=0 is the first camera'], ['chip', 'Watch jtop: the GPU does the work'], ['code', 'Export to TensorRT for even faster frames']] },
    ],
    code: [{ file: 'detect.py', lang: 'python', trace: { detect: 6 }, source: `
from ultralytics import YOLO

model = YOLO("yolo11n.pt")            # downloads the small model the first time

for result in model(source=0, stream=True):
    for box in result.boxes:
        label = model.names[int(box.cls)]
        print(label, round(float(box.conf), 2))
` }],
    sim: {
      type: 'detect', fps: 30, start: ['Loading yolo11n on the GPU…'],
      objects: [
        { label: 'person', box: [0.14, 0.16, 0.3, 0.68], score: 0.93, fill: '#4b5a6e', color: '#76b900' },
        { label: 'dog', box: [0.55, 0.52, 0.22, 0.22], score: 0.82, fill: '#b98a5a', color: '#ffcc33' },
        { label: 'chair', box: [0.78, 0.4, 0.17, 0.34], score: 0.71, fill: '#5b4a3a', color: '#5aa9ff' },
      ],
    },
    run: { cmd: 'python3 detect.py', stop: ['KeyboardInterrupt'] },
    kit: [['1', 'USB webcam']],
  },
];
