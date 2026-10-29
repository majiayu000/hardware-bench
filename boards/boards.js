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
  },
];

// AI boards planned next, in suggested order (researched October 2026).
export const COMING = [
  {
    name: 'Raspberry Pi 5 + AI HAT+ 2', level: 'Intermediate', tag: 'Hailo-10H · 40 TOPS',
    blurb: 'Adds an AI accelerator with its own 8 GB of memory to the Pi 5: real-time object detection, plus small language and vision-language models.',
  },
  {
    name: 'NVIDIA Jetson Orin Nano Super', level: 'Advanced', tag: 'GPU · 67 TOPS',
    blurb: 'A CUDA GPU computer for local AI: modern vision models, robotics and on-device LLMs. Needs Linux and deep-learning basics.',
  },
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
  'An Uno with a Linux computer on board: sketches and Python talk over Bridge, plus the LED matrix, a phone web UI and on-board AI.': '板载一台 Linux 电脑的 Uno：Arduino 程序和 Python 通过 Bridge 对话，还有 LED 点阵、手机网页控制和板载 AI。',
  'A thumb-sized AI board with a camera and a microphone: sensors, sound levels, photos, Wi-Fi and on-device face detection.': '拇指大小、带摄像头和麦克风的 AI 开发板：传感器、声音强度、拍照、Wi-Fi 和端侧人脸检测。',
  'Build a desk gadget in every lesson: traffic light, night light, door chime, ruler, dial gauge and a parking sensor.': '每节课做一个桌面小装置：红绿灯、小夜灯、门铃、测距尺、指针表和倒车雷达。',
  'A full Linux computer with GPIO pins: Python, cameras, web servers and a weather station.': '带 GPIO 引脚的完整 Linux 电脑：Python、摄像头、网页服务器和气象站。',
  'A Wi-Fi microcontroller: flash MicroPython, read sensors and control things from your phone.': '带 Wi-Fi 的微控制器：烧录 MicroPython、读取传感器，用手机控制设备。',
  'PC build: motherboard': '装机：主板', 'Hands-on': '动手装配',
  'Install the CPU, memory, SSD and cooler, wire the tricky front-panel pins, then take it all apart again.': '安装 CPU、内存、固态硬盘和散热器，接好最容易出错的前面板针脚，再把它们全部拆下来。',
  'Hailo-10H · 40 TOPS': 'Hailo-10H · 40 TOPS', 'GPU · 67 TOPS': 'GPU · 67 TOPS',
  'Adds an AI accelerator with its own 8 GB of memory to the Pi 5: real-time object detection, plus small language and vision-language models.': '给树莓派 5 加上自带 8 GB 内存的 AI 加速器：实时目标检测，还能跑小型语言模型和视觉语言模型。',
  'A CUDA GPU computer for local AI: modern vision models, robotics and on-device LLMs. Needs Linux and deep-learning basics.': '带 CUDA GPU 的本地 AI 电脑：现代视觉模型、机器人和端侧大模型。需要 Linux 和深度学习基础。',
};
