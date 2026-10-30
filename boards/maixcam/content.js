// Everything specific to this device lives in this file: site metadata, the 3D model and the
// lessons. The engine is generic.
// Sources: Sipeed MaixCAM wiki and MaixPy documentation (camera, display, find_blobs, YOLOv5, GPIO).
// The device's GPIO header is not modelled because these lessons use only the built-in hardware.

export const SITE = {
  id: 'learn-maixcam',
  title: 'MaixCAM: An AI Camera You Program in Python',
  accent: '#1f9d8a',
  logicVolts: 3.3,
  shell: 'MaixVision · terminal',
  terminalHint: 'Device connected. Press Run to send the script from MaixVision.',
};

export const PIN_TYPES = {};

// MaixCAM, front view lying flat, millimetres, stylised from product photos: the screen faces up and
// the lens is on the far side. The device has no pin headers in this model.
export const BOARD = {
  name: 'MaixCAM',
  width: 62,
  depth: 42,
  thickness: 12,
  cornerRadius: 3,
  pcbColor: '#23262c',
  traces: false,
  holes: [],
  silkscreen: [{ text: 'MaixCAM', x: 31, z: 39, size: 1.8, weight: 700, align: 'center' }],
  components: [
    { id: 'lcd', label: '2.3″ touch screen', desc: 'A colour IPS touch screen that shows the camera view and your drawings.', shape: 'box', x: 31, z: 19, w: 52, d: 32, h: 0.4, color: '#0b0d12' },
    { id: 'lens', label: 'Camera lens', desc: 'On the back. The stock 4 MP sensor is a GC4653, and the lens module can be swapped.', shape: 'cylinder', x: 31, z: 19, w: 14, h: 6, color: '#1b1c22', under: true },
    { id: 'usb', kind: 'usbc', label: 'USB-C port', desc: 'Power and data. A USB network link connects it to MaixVision.', shape: 'box', x: 31, z: 41.4, w: 9, d: 3, h: 3.2, color: '#c3c6ca', metal: true },
    { id: 'sd', label: 'microSD slot', desc: 'The system boots from the card, which holds Linux and the models.', shape: 'box', x: 61.4, z: 19, w: 2, d: 12, h: 1.4, color: '#14151a' },
    { id: 'user', kind: 'button', label: 'User button', desc: 'A button on the side that your programs can use. In the launcher it goes back.', shape: 'box', x: 0.8, z: 12, w: 2, d: 6, h: 3, color: '#c9ced6' },
    { id: 'reset', kind: 'button', label: 'Reset button', desc: 'Restarts the device.', shape: 'box', x: 0.8, z: 26, w: 2, d: 6, h: 3, color: '#c9ced6' },
  ],
  headers: [],
};

// ---------- shared pieces ----------
const SCREEN = (lines) => ({ id: 'scr', type: 'screen', at: { x: 31, z: 19 }, w: 50, d: 30, y: 1, lines, label: 'Screen', desc: 'What your program shows.' });

export const LESSONS = [
  {
    id: 'meet',
    title: 'Meet the MaixCAM',
    short: 'Meet the device',
    summary: 'A pocket Linux camera with a neural processor, a screen and a Python library for all of it.',
    icon: 'board',
    focus: { components: ['lcd'] },
    callouts: [
      { component: 'lcd', icon: 'target', title: 'Touch screen', text: 'Shows what the camera sees.' },
      { component: 'lens', icon: 'camera', title: 'Camera', text: 'On the back.' },
      { component: 'sd', icon: 'memory', title: 'microSD', text: 'Holds Linux and the models.' },
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Power and MaixVision.' },
      { component: 'user', icon: 'button', title: 'User button', text: 'On the side.' },
    ],
    overview: [
      'The **MaixCAM** puts a camera, a touch screen and a 1 TOPS **NPU** around a **SOPHGO SG2002** chip. It runs Linux, but you rarely see it: **MaixPy** gives you a Python library in which reading the camera, running a model and drawing on the screen take a few lines each.',
      'Everything runs on the device: once your program is saved it needs no cloud and no PC.',
      { tips: [['target', 'Click the parts of the device'], ['code', 'MaixPy works only on Sipeed’s MaixCAM devices'], ['info', 'Update the system image before you start']] },
      { h: 'Specifications' },
      { specs: [['Chip', 'SOPHGO SG2002'], ['CPU', '1 GHz RISC-V C906'], ['NPU', '1 TOPS'], ['Memory', '256 MB DDR3'], ['Camera', 'Up to 5 MP, stock 4 MP GC4653'], ['Screen', '2.3″ IPS touch screen']] },
    ],
    sim: { type: 'tour' },
    kit: [['1', 'Sipeed MaixCAM', 'Other SG2002 boards cannot run MaixPy.'], ['1', 'microSD card', 'Usually included.'], ['1', 'USB-C data cable']],
  },

  {
    id: 'setup',
    title: 'Connect MaixVision',
    summary: 'Install the MaixVision IDE on your computer, connect and run a first script.',
    icon: 'board',
    focus: { components: ['usb', 'sd'] },
    callouts: [
      { component: 'usb', icon: 'usb', title: 'USB-C', text: 'Connect to your computer.' },
      { component: 'sd', icon: 'memory', title: 'microSD', text: 'Flash the latest image here.' },
    ],
    overview: [
      { steps: [
        'Follow the MaixPy guide to flash the newest system image onto the card, since factory images can be old.',
        'Install **MaixVision** on your computer from Sipeed’s site.',
        'Plug in USB-C. MaixVision lists the device, and you click **Connect**.',
        'Paste a script and press **Run**. The output appears in MaixVision and the image on both screens.',
      ] },
      'Programs can also be installed as apps, so they appear in the launcher on the device’s screen.',
      { tips: [['usb', 'Use a cable that carries data'], ['wifi', 'MaixVision can also connect over Wi-Fi'], ['terminal', 'Run a script from the toolbar']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'python3 -c "from maix import sys; print(sys.device_id())"', note: 'check the device', out: ['maixcam'] },
        { cmd: 'python3 -c "import maix; print(maix.__version__)"', note: 'check MaixPy', out: ['Prints the installed version.'] },
      ],
    },
    kit: [['1', 'Computer running MaixVision']],
  },

  {
    id: 'camera',
    title: 'Camera to screen',
    short: 'Camera to screen',
    summary: 'Five lines of Python show the live camera image on the display.',
    icon: { glyph: 'camera' },
    focus: { components: ['lcd', 'lens'] },
    circuit: { parts: [SCREEN(['camera', 'live view'])] },
    callouts: [
      { part: 'scr', icon: 'target', title: 'Screen', text: '`disp.show(img)` puts a frame here.' },
      { component: 'lens', icon: 'camera', title: 'Camera', text: '`cam.read()` takes a frame.' },
    ],
    overview: [
      'Every vision program has this shape: take a frame, do something with it, show it. `app.need_exit()` becomes true when you press Stop or the exit button, so the loop ends cleanly.',
      { tips: [['camera', 'The camera sets the frame size'], ['code', 'Draw on `img` before showing it'], ['clock', 'MaixVision shows the frame rate']] },
    ],
    code: [{ file: 'camera.py', lang: 'python', source: `
from maix import camera, display, app

disp = display.Display()
cam = camera.Camera(disp.width(), disp.height())

while not app.need_exit():
    img = cam.read()
    disp.show(img)
` }],
    sim: { type: 'sequence', caption: 'Press Run: frames go from the camera to the screen.', rest: { scr: { lines: ['camera', 'live view'] } }, steps: [{ set: { scr: { lines: ['frame', '1'] } }, ms: 500 }, { set: { scr: { lines: ['frame', '2'] } }, ms: 500 }, { set: { scr: { lines: ['frame', '3'] } }, ms: 500 }] },
    run: { cmd: 'python3 camera.py', stop: [] },
  },

  {
    id: 'blobs',
    title: 'Find a colour',
    summary: '`find_blobs()` finds patches of a chosen colour with no neural network.',
    icon: { glyph: 'target' },
    focus: { components: ['lcd'] },
    callouts: [{ component: 'lcd', icon: 'target', title: 'Green boxes', text: 'Drawn around each red patch.' }],
    overview: [
      'Classic vision is often all you need, and it is far faster than a neural network. The threshold is a box in **LAB colour space**: `[Lmin, Lmax, Amin, Amax, Bmin, Bmax]`, where L is brightness, A runs green to red and B runs blue to yellow.',
      '`pixels_threshold` throws away patches too small to matter.',
      { tips: [['target', 'Hold up something bright and red'], ['code', '`blob[0:4]` is x, y, width and height'], ['info', 'Lighting changes colours: tune the thresholds']] },
    ],
    code: [{ file: 'blobs.py', lang: 'python', source: `
from maix import camera, display, image, app

disp = display.Display()
cam = camera.Camera(320, 240)
thresholds = [[0, 80, 40, 80, 10, 80]]   # red

while not app.need_exit():
    img = cam.read()
    for blob in img.find_blobs(thresholds, pixels_threshold=500):
        img.draw_rect(blob[0], blob[1], blob[2], blob[3], image.COLOR_GREEN)
    disp.show(img)
` }],
    sim: { type: 'detect', fps: 30, start: ['Looking for red'], caption: 'Press Run: a simulated view with boxes around red patches.', objects: [{ label: 'red', box: [0.3, 0.25, 0.28, 0.4], score: 0.99, color: '#3fae5a', fill: '#d0342c' }] },
    run: { cmd: 'python3 blobs.py', stop: [] },
    kit: [['1', 'A brightly coloured object']],
  },

  {
    id: 'detect',
    title: 'Detect objects with YOLOv5',
    short: 'Detect objects',
    summary: 'A model that comes with the system finds people, cups and 78 other things on the NPU.',
    icon: { glyph: 'camera' },
    focus: { components: ['lcd', 'lens'] },
    callouts: [
      { component: 'lcd', icon: 'target', title: 'Boxes and labels', text: 'Drawn on every frame.' },
      { component: 'lens', icon: 'camera', title: 'Camera', text: 'Sized to fit the model.' },
    ],
    overview: [
      '**YOLOv5** looks at a frame once and returns boxes with labels and scores, using the 80 classes of the COCO dataset. `nn.YOLOv5` loads the model and tells the camera what size and format it needs.',
      '`conf_th` drops weak guesses, and `iou_th` removes overlapping boxes around the same object.',
      { tips: [['camera', 'Point it at people or a desk'], ['code', '`detector.labels` turns a class id into a name'], ['info', 'MaixHub lets you train your own model']] },
    ],
    code: [{ file: 'detect.py', lang: 'python', source: `
from maix import camera, display, image, nn, app

detector = nn.YOLOv5(model='/root/models/yolov5s.mud')
cam = camera.Camera(detector.input_width(), detector.input_height(), detector.input_format())
disp = display.Display()

while not app.need_exit():
    img = cam.read()
    for obj in detector.detect(img, conf_th=0.5, iou_th=0.45):
        img.draw_rect(obj.x, obj.y, obj.w, obj.h, color=image.COLOR_RED)
        text = f'{detector.labels[obj.class_id]}: {obj.score:.2f}'
        img.draw_string(obj.x, obj.y, text, color=image.COLOR_RED)
    disp.show(img)
` }],
    sim: { type: 'detect', fps: 25, start: ['Loading yolov5s.mud'], caption: 'Press Run: a simulated view of the labelled boxes.', objects: [{ label: 'person', box: [0.1, 0.15, 0.32, 0.75], score: 0.88, color: '#e2483c' }, { label: 'cup', box: [0.62, 0.55, 0.14, 0.24], score: 0.71, color: '#3b78d6' }] },
    run: { cmd: 'python3 detect.py', stop: [] },
  },
];
