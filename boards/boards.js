// Where readers report mistakes and find the source; used by the hub and each course's Settings.
export const LINKS = {
  repo: 'https://github.com/majiayu000/hardware-bench',
  issues: 'https://github.com/majiayu000/hardware-bench/issues',
};

// Boards shown on the hub home page. `id` is the folder under boards/. Lesson counts and
// progress come from each board's content.js, so only presentation lives here.
export const BOARDS = [
  {
    id: 'arduino-uno', name: 'Arduino Uno', accent: '#e05a3a', level: 'Beginner', language: 'C++',
    blurb: 'Build a desk gadget in every lesson: traffic light, night light, door chime, ruler, dial gauge and a parking sensor.',
  },
  {
    id: 'raspberry-pi', name: 'Raspberry Pi 5', accent: '#c51a4a', level: 'Beginner', language: 'Python',
    blurb: 'A full Linux computer with GPIO pins: Python, cameras, web servers and a weather station.',
  },
  {
    id: 'esp32', name: 'ESP32-DevKitC', accent: '#e7352c', level: 'Beginner', language: 'MicroPython',
    blurb: 'A Wi-Fi microcontroller: flash MicroPython, read sensors and control things from your phone.',
  },
  {
    id: 'pc-motherboard', name: 'PC build: motherboard', accent: '#3a6dd0', level: 'Beginner', language: 'Hands-on',
    blurb: 'Install the CPU, memory, SSD and cooler, wire the tricky front-panel pins, then take it all apart again.',
  },
  {
    id: 'xiao-esp32s3-sense', name: 'XIAO ESP32S3 Sense', accent: '#7cb518', level: 'Beginner', language: 'C++',
    blurb: 'A thumb-sized AI board with a camera and a microphone: sensors, sound levels, photos, Wi-Fi and on-device face detection.',
  },  {
    id: 'arduino-uno-q', name: 'Arduino UNO Q', accent: '#00878f', level: 'Intermediate', language: 'C++ + Python',
    blurb: 'An Uno with a Linux computer on board: sketches and Python talk over Bridge, plus the LED matrix, a phone web UI and on-board AI.',
  },  {
    id: 'pico-2-w', name: 'Raspberry Pi Pico 2 W', accent: '#c51a4a', level: 'Beginner', language: 'MicroPython',
    blurb: 'The cheapest way to start: blink, read buttons and knobs, make sounds, then build a Wi-Fi thermometer.',
  },  {
    id: 'pc-build', name: 'PC build: the whole PC', accent: '#3a6dd0', level: 'Beginner', language: 'Hands-on',
    blurb: 'Power supply, motherboard, graphics card, fans and cables into the case, then the first power-on and taking it apart.',
  },  {
    id: 'pi-ai-hat', name: 'Raspberry Pi 5 + AI HAT+ 2', accent: '#7a3fbf', level: 'Intermediate', language: 'Shell + Python',
    blurb: 'Fit a 40 TOPS Hailo-10H accelerator, detect objects live from the camera and chat with a language model running on the Pi.',
  },  {
    id: 'microbit', name: 'BBC micro:bit V2', accent: '#00a3a6', level: 'Beginner', language: 'MicroPython',
    blurb: 'Everything is built in: scroll text, make faces with the buttons, roll a dice by shaking, play music and send radio messages.',
  },  {
    id: 'nano-esp32', name: 'Arduino Nano ESP32', accent: '#00878f', level: 'Beginner', language: 'C++',
    blurb: 'A breadboard-sized Arduino with Wi-Fi: LEDs, buttons, an RGB LED, sound, an I²C sensor and a Wi-Fi weather station.',
  },  {
    id: 'pc-upgrade', name: 'PC upgrade: graphics card and SSD', accent: '#d0563a', level: 'Beginner', language: 'Hands-on',
    blurb: 'Swap a graphics card, add an M.2 NVMe SSD and a SATA SSD, then check everything works.',
  },  {
    id: 'jetson-orin-nano', name: 'NVIDIA Jetson Orin Nano Super', accent: '#76b900', level: 'Advanced', language: 'Shell + Python',
    blurb: 'A desk-sized AI computer with a CUDA GPU: install JetPack, run language models with Ollama and detect objects from a webcam.',
  },  {
    id: 'keyboard', name: 'Mechanical keyboard build', accent: '#b8569a', level: 'Beginner', language: 'Hands-on',
    blurb: 'Stabilizers, plate, switches and keycaps on a hot-swap kit, then test every key and remap it.',
  },  {
    id: 'soldering', name: 'Soldering basics', accent: '#c2951a', level: 'Beginner', language: 'Hands-on',
    blurb: 'Safety, tinning, a good joint, LEDs and header pins, spotting bad joints and fixing them, on a small LED kit.',
  },
];

// AI boards planned next, in suggested order (researched October 2026).
export const COMING = [
];

// 简体中文 for the hub page.
export const HUB_ZH = {
  'Hardware Bench': '硬件学堂', 'Design inspired by': '设计灵感来自', 'Interactive, illustrated electronics courses for real boards.': '面向真实开发板的图解互动电子课程。',
  'Pick a board. Every lesson shows its circuit in 3D, explains each part, and lets you run the code in a simulator before you wire anything.': '选一块板子开始。每节课都用 3D 展示电路、讲解每个零件，接线之前就能在模拟器里运行代码。',
  Boards: '开发板', 'AI boards coming next': '即将推出：AI 开发板', 'Start learning': '开始学习', 'Continue': '继续学习',
  '{n} lessons': '{n} 节课', '{a} of {b} done': '已完成 {a} / {b}', 'Coming soon': '即将推出',
  Beginner: '入门', Intermediate: '进阶', Advanced: '高阶', Language: '编程语言',
  'Bilingual · English and 简体中文': '双语 · English 和简体中文', 'No account needed: progress stays in this browser.': '无需注册，进度保存在当前浏览器中。',
  'Early release: every pin and command is checked against official documentation, but not every lesson has been run on a real board yet.': '早期版本：每个引脚和命令都对照官方文档核对过，但还不是每节课都在真实板子上跑过。',
  'Found a mistake? Tell us': '发现错误？告诉我们', 'Report a mistake': '报告错误', 'Source code': '源代码',
  'XIAO ESP32S3 Sense': 'XIAO ESP32S3 Sense',
  'Soldering basics': '焊接入门', 'Safety, tinning, a good joint, LEDs and header pins, spotting bad joints and fixing them, on a small LED kit.': '在一个小 LED 套件上学习：安全、上锡、焊出好焊点、焊 LED 和排针、识别并修复不良焊点。',
  'Mechanical keyboard build': '组装机械键盘', 'Stabilizers, plate, switches and keycaps on a hot-swap kit, then test every key and remap it.': '在热插拔套件上装卫星轴、定位板、轴体和键帽，然后测试每个键，再改键。',
  'A desk-sized AI computer with a CUDA GPU: install JetPack, run language models with Ollama and detect objects from a webcam.': '放在桌上的 AI 电脑，带 CUDA GPU：安装 JetPack，用 Ollama 运行语言模型，再用摄像头检测物体。',
  'PC upgrade: graphics card and SSD': '电脑升级：显卡和固态硬盘', 'Swap a graphics card, add an M.2 NVMe SSD and a SATA SSD, then check everything works.': '换一块显卡，加一块 M.2 NVMe 和一块 SATA 固态硬盘，再检查一切正常。',
  'A breadboard-sized Arduino with Wi-Fi: LEDs, buttons, an RGB LED, sound, an I²C sensor and a Wi-Fi weather station.': '插得进面包板、带 Wi-Fi 的 Arduino：LED、按钮、RGB LED、声音、I²C 传感器，最后做一个 Wi-Fi 气象站。',
  'Everything is built in: scroll text, make faces with the buttons, roll a dice by shaking, play music and send radio messages.': '所有东西都是内置的：滚动文字、用按钮变表情、摇一摇掷骰子、播放音乐，还能发无线消息。',
  'Fit a 40 TOPS Hailo-10H accelerator, detect objects live from the camera and chat with a language model running on the Pi.': '装上 40 TOPS 的 Hailo-10H 加速器，用摄像头实时检测物体，再和跑在树莓派上的语言模型对话。',
  'PC build: the whole PC': '装机：整机', 'Power supply, motherboard, graphics card, fans and cables into the case, then the first power-on and taking it apart.': '把电源、主板、显卡、风扇和线材装进机箱，然后第一次开机，再把它拆开。',
  'The cheapest way to start: blink, read buttons and knobs, make sounds, then build a Wi-Fi thermometer.': '最便宜的入门方式：闪灯、读按钮和旋钮、发出声音，最后做一个 Wi-Fi 温度计。',
  'An Uno with a Linux computer on board: sketches and Python talk over Bridge, plus the LED matrix, a phone web UI and on-board AI.': '板载一台 Linux 电脑的 Uno：Arduino 程序和 Python 通过 Bridge 对话，还有 LED 点阵、手机网页控制和板载 AI。',
  'A thumb-sized AI board with a camera and a microphone: sensors, sound levels, photos, Wi-Fi and on-device face detection.': '拇指大小、带摄像头和麦克风的 AI 开发板：传感器、声音强度、拍照、Wi-Fi 和端侧人脸检测。',
  'Build a desk gadget in every lesson: traffic light, night light, door chime, ruler, dial gauge and a parking sensor.': '每节课做一个桌面小装置：红绿灯、小夜灯、门铃、测距尺、指针表和倒车雷达。',
  'A full Linux computer with GPIO pins: Python, cameras, web servers and a weather station.': '带 GPIO 引脚的完整 Linux 电脑：Python、摄像头、网页服务器和气象站。',
  'A Wi-Fi microcontroller: flash MicroPython, read sensors and control things from your phone.': '带 Wi-Fi 的微控制器：烧录 MicroPython、读取传感器，用手机控制设备。',
  'PC build: motherboard': '装机：主板', 'Hands-on': '动手装配',
  'Install the CPU, memory, SSD and cooler, wire the tricky front-panel pins, then take it all apart again.': '安装 CPU、内存、固态硬盘和散热器，接好最容易出错的前面板针脚，再把它们全部拆下来。',
 
};
