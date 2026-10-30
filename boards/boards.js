// Where readers report mistakes and find the source; used by the hub and each course's Settings.
export const LINKS = {
  repo: 'https://github.com/majiayu000/hardware-bench',
  issues: 'https://github.com/majiayu000/hardware-bench/issues',
};

// Boards shown on the hub home page. `id` is the folder under boards/. Lesson counts and
// progress come from each board's content.js, so only presentation lives here.
// Sections on the hub home page, in order; each board names its section with `group`.
export const GROUPS = [
  { id: 'boards', title: 'Development boards' },
  { id: 'projects', title: 'Modules and projects' },
  { id: 'ai', title: 'AI boards' },
  { id: 'builds', title: 'Hands-on builds' },
];

export const BOARDS = [
  {
    id: 'arduino-uno', group: 'boards', name: 'Arduino Uno', accent: '#e05a3a', level: 'Beginner', language: 'C++',
    blurb: 'Build a desk gadget in every lesson: traffic light, night light, door chime, ruler, dial gauge and a parking sensor.',
  },
  {
    id: 'raspberry-pi', group: 'boards', name: 'Raspberry Pi 5', accent: '#c51a4a', level: 'Beginner', language: 'Python',
    blurb: 'A full Linux computer with GPIO pins: Python, cameras, web servers and a weather station.',
  },
  {
    id: 'esp32', group: 'boards', name: 'ESP32-DevKitC', accent: '#e7352c', level: 'Beginner', language: 'MicroPython',
    blurb: 'A Wi-Fi microcontroller: flash MicroPython, read sensors and control things from your phone.',
  },
  {
    id: 'pico-2-w', group: 'boards', name: 'Raspberry Pi Pico 2 W', accent: '#c51a4a', level: 'Beginner', language: 'MicroPython',
    blurb: 'The cheapest way to start: blink, read buttons and knobs, make sounds, then build a Wi-Fi thermometer.',
  },
  {
    id: 'microbit', group: 'boards', name: 'BBC micro:bit V2', accent: '#00a3a6', level: 'Beginner', language: 'MicroPython',
    blurb: 'Everything is built in: scroll text, make faces with the buttons, roll a dice by shaking, play music and send radio messages.',
  },
  {
    id: 'nano-esp32', group: 'boards', name: 'Arduino Nano ESP32', accent: '#00878f', level: 'Beginner', language: 'C++',
    blurb: 'A breadboard-sized Arduino with Wi-Fi: LEDs, buttons, an RGB LED, sound, an I²C sensor and a Wi-Fi weather station.',
  },
  {
    id: 'esp32-c6', group: 'boards', name: 'ESP32-C6-DevKitC-1', accent: '#5b4bd6', level: 'Beginner', language: 'MicroPython',
    blurb: 'A RISC-V board with Wi-Fi 6 and a Thread/Zigbee radio: flash MicroPython, LEDs, a button, the ADC and a Wi-Fi switch.',
  },
  {
    id: 'stm32-nucleo', group: 'boards', name: 'STM32 Nucleo-F401RE', accent: '#03234b', level: 'Intermediate', language: 'C++',
    blurb: 'A 32-bit Arm board with Uno-shaped headers and a built-in debugger: blink, buttons, the 12-bit ADC and an I²C sensor.',
  },
  {
    id: 'pi-zero-2w', group: 'boards', name: 'Raspberry Pi Zero 2 W', accent: '#b0124a', level: 'Beginner', language: 'Python',
    blurb: 'A tiny Linux computer: set it up headless over Wi-Fi, then an LED, a button and a web switch from your phone.',
  },
  {
    id: 'm5stack-cores3', group: 'boards', name: 'M5Stack CoreS3', accent: '#e8641e', level: 'Beginner', language: 'C++',
    blurb: 'An ESP32-S3 in a finished case: draw on the touch screen, read taps and tilt, and plug in sensors without wiring.',
  },
  {
    id: 'arduino-mega', group: 'boards', name: 'Arduino Mega 2560', accent: '#00787a', level: 'Beginner', language: 'C++',
    blurb: 'More of everything than an Uno: the double header, interrupts, extra serial ports, 16 analog inputs and I²C.',
  },
  {
    id: 'arduino-nano', group: 'boards', name: 'Arduino Nano', accent: '#1f8a9e', level: 'Beginner', language: 'C++',
    blurb: 'The Uno’s chip in a breadboard-sized board: IDE setup and bootloaders, LEDs, a button and a PWM dimmer.',
  },
  {
    id: 'esp8266-nodemcu', group: 'boards', name: 'ESP8266 NodeMCU', accent: '#2c7fb8', level: 'Beginner', language: 'MicroPython',
    blurb: 'The original cheap Wi-Fi board: flash MicroPython, LEDs, a button, the analog input and a Wi-Fi light switch.',
  },
  {
    id: 'esp32-s3', group: 'boards', name: 'ESP32-S3-DevKitC-1', accent: '#c8372d', level: 'Intermediate', language: 'C++',
    blurb: 'USB on the chip: mix colours on the RGB LED, make touch buttons from wires and turn the board into a keyboard.',
  },
  {
    id: 'teensy-41', group: 'boards', name: 'Teensy 4.1', accent: '#2d8c3c', level: 'Intermediate', language: 'C++',
    blurb: 'Arduino code at 600 MHz: build USB MIDI instruments and controls, and log data to the built-in microSD socket.',
  },
  {
    id: 'stm32-bluepill', group: 'boards', name: 'STM32 Blue Pill', accent: '#2a5cc4', level: 'Intermediate', language: 'C++',
    blurb: 'Program a bare Arm chip with an ST-LINK: LEDs, a button, the 12-bit ADC and an I²C sensor.',
  },
  {
    id: 'feather-rp2040', group: 'boards', name: 'Adafruit Feather RP2040', accent: '#7a4fd0', level: 'Beginner', language: 'CircuitPython',
    blurb: 'Python on a USB drive: edit code.py and save. NeoPixel, analog input, plug-in sensors and a USB keyboard.',
  },
  {
    id: 'orange-pi-5', group: 'boards', name: 'Orange Pi 5', accent: '#e8761e', level: 'Intermediate', language: 'Python',
    blurb: 'Eight cores and a 6 TOPS NPU: flash Linux, drive GPIO with wiringOP and run a neural network on the NPU.',
  },
  {
    id: 'beaglebone-black', group: 'boards', name: 'BeagleBone Black', accent: '#2f6f8f', level: 'Intermediate', language: 'Python',
    blurb: 'Linux with 92 header pins: log in over USB, GPIO in Python, and the 1.8 V analog inputs a Raspberry Pi lacks.',
  },
  {
    id: 'milkv-duo', group: 'boards', name: 'Milk-V Duo', accent: '#3a9d7a', level: 'Advanced', language: 'C',
    blurb: 'Linux on a thumb-sized RISC-V board: boot, log in over USB, cross-compile C and drive GPIO with wiringX.',
  },
  {
    id: 'tang-nano-9k', group: 'boards', name: 'Tang Nano 9K', accent: '#c0392b', level: 'Advanced', language: 'Verilog',
    blurb: 'Your first FPGA: describe hardware in Verilog, with a blink counter, running lights and logic gates.',
  },
  {
    id: 'uno-modules', group: 'projects', name: 'Arduino Uno: displays and motors', accent: '#2f8f83', level: 'Beginner', language: 'C++',
    blurb: 'The modules every kit includes: OLED, LCD1602, WS2812 LEDs, a relay, a DC motor with its driver, a stepper and a joystick.',
  },
  {
    id: 'uno-sensors', group: 'projects', name: 'Arduino Uno: sensors and modules', accent: '#7a5bd0', level: 'Beginner', language: 'C++',
    blurb: 'Motion, tilt, soil moisture, an IR remote, RFID cards, microSD logging, GPS and a real-time clock.',
  },
  {
    id: 'uno-car', group: 'projects', name: 'Arduino smart car', accent: '#e08a1e', level: 'Intermediate', language: 'C++',
    blurb: 'Two motors and a driver, obstacle avoidance with an ultrasonic sensor, then driving it from your phone over Bluetooth.',
  },
  {
    id: 'esp32-home', group: 'projects', name: 'ESP32 smart home', accent: '#1f8fd6', level: 'Intermediate', language: 'YAML',
    blurb: 'ESPHome and Home Assistant: a lamp relay, a motion sensor, temperature, an automation and an OLED desk screen.',
  },
  {
    id: 'xiao-esp32s3-sense', group: 'ai', name: 'XIAO ESP32S3 Sense', accent: '#7cb518', level: 'Beginner', language: 'C++',
    blurb: 'A thumb-sized AI board with a camera and a microphone: sensors, sound levels, photos, Wi-Fi and on-device face detection.',
  },
  {
    id: 'arduino-uno-q', group: 'ai', name: 'Arduino UNO Q', accent: '#00878f', level: 'Intermediate', language: 'C++ + Python',
    blurb: 'An Uno with a Linux computer on board: sketches and Python talk over Bridge, plus the LED matrix, a phone web UI and on-board AI.',
  },
  {
    id: 'pi-ai-hat', group: 'ai', name: 'Raspberry Pi 5 + AI HAT+ 2', accent: '#7a3fbf', level: 'Intermediate', language: 'Shell + Python',
    blurb: 'Fit a 40 TOPS Hailo-10H accelerator, detect objects live from the camera and chat with a language model running on the Pi.',
  },
  {
    id: 'jetson-orin-nano', group: 'ai', name: 'NVIDIA Jetson Orin Nano Super', accent: '#76b900', level: 'Advanced', language: 'Shell + Python',
    blurb: 'A desk-sized AI computer with a CUDA GPU: install JetPack, run language models with Ollama and detect objects from a webcam.',
  },
  {
    id: 'maixcam', group: 'ai', name: 'Sipeed MaixCAM', accent: '#1f9d8a', level: 'Beginner', language: 'Python',
    blurb: 'A pocket AI camera with a screen: live video, colour tracking and YOLOv5 object detection in a few lines of Python.',
  },
  {
    id: 'nicla-vision', group: 'ai', name: 'Arduino Nicla Vision', accent: '#00979d', level: 'Intermediate', language: 'MicroPython',
    blurb: 'A camera the size of a coin: OpenMV, colour tracking, a laser distance sensor and motion sensing.',
  },
  {
    id: 'pc-motherboard', group: 'builds', name: 'PC build: motherboard', accent: '#3a6dd0', level: 'Beginner', language: 'Hands-on',
    blurb: 'Install the CPU, memory, SSD and cooler, wire the tricky front-panel pins, then take it all apart again.',
  },
  {
    id: 'pc-build', group: 'builds', name: 'PC build: the whole PC', accent: '#3a6dd0', level: 'Beginner', language: 'Hands-on',
    blurb: 'Power supply, motherboard, graphics card, fans and cables into the case, then the first power-on and taking it apart.',
  },
  {
    id: 'pc-upgrade', group: 'builds', name: 'PC upgrade: graphics card and SSD', accent: '#d0563a', level: 'Beginner', language: 'Hands-on',
    blurb: 'Swap a graphics card, add an M.2 NVMe SSD and a SATA SSD, then check everything works.',
  },
  {
    id: 'keyboard', group: 'builds', name: 'Mechanical keyboard build', accent: '#b8569a', level: 'Beginner', language: 'Hands-on',
    blurb: 'Stabilizers, plate, switches and keycaps on a hot-swap kit, then test every key and remap it.',
  },
  {
    id: 'soldering', group: 'builds', name: 'Soldering basics', accent: '#c2951a', level: 'Beginner', language: 'Hands-on',
    blurb: 'Safety, tinning, a good joint, LEDs and header pins, spotting bad joints and fixing them, on a small LED kit.',
  },
  {
    id: 'pc-cooling', group: 'builds', name: 'PC cooling: AIO, fans and RGB', accent: '#2aa7c9', level: 'Beginner', language: 'Hands-on',
    blurb: 'How a liquid cooler works and how to fit it, fan headers and fan curves, and 12 V RGB versus 5 V ARGB.',
  },
  {
    id: 'pi-nvme', group: 'builds', name: 'Raspberry Pi 5: cooler and NVMe SSD', accent: '#c2185b', level: 'Beginner', language: 'Hands-on',
    blurb: 'Fit the Active Cooler and an M.2 HAT+ with an NVMe drive, switch on PCIe Gen 3 and boot from the SSD.',
  },
];

// Boards planned next, shown under their own heading only when the list is not empty.
export const COMING = [
];

// 简体中文 for the hub page.
export const HUB_ZH = {
  'Hardware Bench': '硬件学堂', 'Design inspired by': '设计灵感来自', 'Interactive, illustrated courses for real hardware.': '面向真实硬件的图解互动课程。',
  'Pick a board. Every lesson shows its circuit in 3D, explains each part, and lets you run the code in a simulator before you wire anything.': '选一块板子开始。每节课都用 3D 展示电路、讲解每个零件，接线之前就能在模拟器里运行代码。',
  Boards: '开发板', 'AI boards coming next': '即将推出：AI 开发板', 'Start learning': '开始学习', 'Continue': '继续学习',
  '{n} lessons': '{n} 节课', '{a} of {b} done': '已完成 {a} / {b}', 'Coming soon': '即将推出',
  Beginner: '入门', Intermediate: '进阶', Advanced: '高阶', Language: '编程语言',
  'Bilingual · English and 简体中文': '双语 · English 和简体中文', 'No account needed: progress stays in this browser.': '无需注册，进度保存在当前浏览器中。',
  'Early release: every pin and command is checked against official documentation, but not every lesson has been run on a real board yet.': '早期版本：每个引脚和命令都对照官方文档核对过，但还不是每节课都在真实板子上跑过。',
  'Found a mistake? Tell us': '发现错误？告诉我们', 'Report a mistake': '报告错误', 'Source code': '源代码',
  'XIAO ESP32S3 Sense': 'XIAO ESP32S3 Sense',
  'Development boards': '开发板', 'AI boards': 'AI 开发板', 'Hands-on builds': '动手装配',
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
  'Modules and projects': '模块与项目', YAML: 'YAML',
  'ESP32-C6-DevKitC-1': 'ESP32-C6-DevKitC-1', 'A RISC-V board with Wi-Fi 6 and a Thread/Zigbee radio: flash MicroPython, LEDs, a button, the ADC and a Wi-Fi switch.': '带 Wi-Fi 6 和 Thread/Zigbee 射频的 RISC-V 开发板：烧录 MicroPython，玩 LED、按键、ADC 和 Wi-Fi 开关。',
  'STM32 Nucleo-F401RE': 'STM32 Nucleo-F401RE', 'A 32-bit Arm board with Uno-shaped headers and a built-in debugger: blink, buttons, the 12-bit ADC and an I²C sensor.': '排母布局和 Uno 一样、自带调试器的 32 位 Arm 开发板：闪灯、按键、12 位 ADC 和 I²C 传感器。',
  'Raspberry Pi Zero 2 W': '树莓派 Zero 2 W', 'A tiny Linux computer: set it up headless over Wi-Fi, then an LED, a button and a web switch from your phone.': '迷你 Linux 电脑：通过 Wi-Fi 无屏幕设置，然后玩 LED、按键，再用手机网页开关。',
  'M5Stack CoreS3': 'M5Stack CoreS3', 'An ESP32-S3 in a finished case: draw on the touch screen, read taps and tilt, and plug in sensors without wiring.': '装在成品外壳里的 ESP32-S3：在触摸屏上画画，读取点击和倾斜，不用接线就能插传感器。',
  'Arduino Uno: displays and motors': 'Arduino Uno：屏幕与电机', 'The modules every kit includes: OLED, LCD1602, WS2812 LEDs, a relay, a DC motor with its driver, a stepper and a joystick.': '每个套件里都有的模块：OLED、LCD1602、WS2812 灯珠、继电器、直流电机及驱动、步进电机和摇杆。',
  'Arduino Uno: sensors and modules': 'Arduino Uno：传感器与模块', 'Motion, tilt, soil moisture, an IR remote, RFID cards, microSD logging, GPS and a real-time clock.': '人体感应、倾斜、土壤湿度、红外遥控、RFID 卡、microSD 记录、GPS 和实时时钟。',
  'Arduino smart car': 'Arduino 智能小车', 'Two motors and a driver, obstacle avoidance with an ultrasonic sensor, then driving it from your phone over Bluetooth.': '两个电机加一块驱动板，用超声波传感器避障，再用手机通过蓝牙驾驶。',
  'ESP32 smart home': 'ESP32 智能家居', 'ESPHome and Home Assistant: a lamp relay, a motion sensor, temperature, an automation and an OLED desk screen.': 'ESPHome 与 Home Assistant：继电器控灯、人体传感器、温度、自动化和 OLED 桌面屏。',
  'PC cooling: AIO, fans and RGB': '电脑散热：水冷、风扇与 RGB', 'How a liquid cooler works and how to fit it, fan headers and fan curves, and 12 V RGB versus 5 V ARGB.': '水冷的原理和安装、风扇插座与风扇曲线，以及 12 V RGB 和 5 V ARGB 的区别。',
  'Raspberry Pi 5: cooler and NVMe SSD': '树莓派 5：散热器与 NVMe 固态硬盘', 'Fit the Active Cooler and an M.2 HAT+ with an NVMe drive, switch on PCIe Gen 3 and boot from the SSD.': '装上主动散热器和带 NVMe 硬盘的 M.2 HAT+，开启 PCIe Gen 3，从固态硬盘启动。',
  'Arduino Mega 2560': 'Arduino Mega 2560', 'More of everything than an Uno: the double header, interrupts, extra serial ports, 16 analog inputs and I²C.': '比 Uno 多得多：双排排针、中断、多个串口、16 路模拟输入和 I²C。',
  'Arduino Nano': 'Arduino Nano', 'The Uno’s chip in a breadboard-sized board: IDE setup and bootloaders, LEDs, a button and a PWM dimmer.': '面包板大小的 Uno：IDE 设置与引导程序、LED、按键和 PWM 调光。',
  'ESP8266 NodeMCU': 'ESP8266 NodeMCU', 'The original cheap Wi-Fi board: flash MicroPython, LEDs, a button, the analog input and a Wi-Fi light switch.': '经典的廉价 Wi-Fi 板：烧录 MicroPython，LED、按键、模拟输入和 Wi-Fi 电灯开关。',
  'ESP32-S3-DevKitC-1': 'ESP32-S3-DevKitC-1', 'USB on the chip: mix colours on the RGB LED, make touch buttons from wires and turn the board into a keyboard.': '芯片自带 USB：RGB LED 调色，用导线做触摸按键，把板子变成键盘。',
  'Teensy 4.1': 'Teensy 4.1', 'Arduino code at 600 MHz: build USB MIDI instruments and controls, and log data to the built-in microSD socket.': '600 MHz 的 Arduino 代码：做 USB MIDI 乐器和控制器，把数据记录到板载 microSD。',
  'STM32 Blue Pill': 'STM32 Blue Pill', 'Program a bare Arm chip with an ST-LINK: LEDs, a button, the 12-bit ADC and an I²C sensor.': '用 ST-LINK 给裸 Arm 芯片编程：LED、按键、12 位 ADC 和 I²C 传感器。',
  'Adafruit Feather RP2040': 'Adafruit Feather RP2040', 'Python on a USB drive: edit code.py and save. NeoPixel, analog input, plug-in sensors and a USB keyboard.': 'U 盘里的 Python：改 code.py 保存就运行。NeoPixel、模拟输入、即插传感器和 USB 键盘。',
  'Orange Pi 5': 'Orange Pi 5', 'Eight cores and a 6 TOPS NPU: flash Linux, drive GPIO with wiringOP and run a neural network on the NPU.': '八核加 6 TOPS NPU：刷 Linux，用 wiringOP 控制 GPIO，在 NPU 上跑神经网络。',
  'BeagleBone Black': 'BeagleBone Black', 'Linux with 92 header pins: log in over USB, GPIO in Python, and the 1.8 V analog inputs a Raspberry Pi lacks.': '带 92 个引脚的 Linux：USB 登录，用 Python 控制 GPIO，以及树莓派没有的 1.8 V 模拟输入。',
  'Milk-V Duo': 'Milk-V Duo', 'Linux on a thumb-sized RISC-V board: boot, log in over USB, cross-compile C and drive GPIO with wiringX.': '拇指大小的 RISC-V Linux 板：启动、USB 登录、交叉编译 C，用 wiringX 控制 GPIO。',
  'Tang Nano 9K': 'Tang Nano 9K', 'Your first FPGA: describe hardware in Verilog, with a blink counter, running lights and logic gates.': '你的第一块 FPGA：用 Verilog 描述硬件，计数器闪灯、跑马灯和逻辑门。',
  'Sipeed MaixCAM': 'Sipeed MaixCAM', 'A pocket AI camera with a screen: live video, colour tracking and YOLOv5 object detection in a few lines of Python.': '带屏幕的口袋 AI 相机：几行 Python 实现实时画面、颜色追踪和 YOLOv5 物体识别。',
  'Arduino Nicla Vision': 'Arduino Nicla Vision', 'A camera the size of a coin: OpenMV, colour tracking, a laser distance sensor and motion sensing.': '硬币大小的相机：OpenMV、颜色追踪、激光测距和运动感知。',
  CircuitPython: 'CircuitPython', C: 'C', Verilog: 'Verilog',
  'PC build: motherboard': '装机：主板', 'Hands-on': '动手装配',
  'Install the CPU, memory, SSD and cooler, wire the tricky front-panel pins, then take it all apart again.': '安装 CPU、内存、固态硬盘和散热器，接好最容易出错的前面板针脚，再把它们全部拆下来。',
 
};
