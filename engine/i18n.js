// Bilingual text (English / 简体中文). Content and UI are written in English; Chinese comes from
// dictionaries that map the English string to its translation: UI_ZH below for the engine, and
// each board's zh.js for its lessons. Keys may contain {placeholders} for dynamic text.
//
// t() translates at render time (needed for text with inline `code` / **bold** markup).
// observe() translates every other text node as it appears, so engine and sim code can keep
// writing plain English. Code, terminal output and 3D silkscreen stay as on the real hardware.

const KEY = 'learn-hardware:lang';
const stored = (() => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
})();
export const lang = stored ?? (navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en');

export function setLang(next) {
  try {
    localStorage.setItem(KEY, next);
  } catch (err) {
    console.warn('Could not save the language choice; it will reset on reload.', err);
  }
  location.reload();
}

const exact = new Map();
const patterns = [];
const missing = new Set();
const reEscape = (s) => s.replace(/[.*+?^$()|[\]\\]/g, '\\$&');

export function addDict(dict) {
  for (const [en, zh] of Object.entries(dict)) {
    exact.set(en, zh);
    if (/\{\w+\}/.test(en)) {
      const names = [...en.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      const re = new RegExp(`^${reEscape(en).replace(/\\?\{\w+\\?\}/g, '(.+?)')}$`);
      patterns.push({ re, names, zh });
    }
  }
}

const fill = (s, vars) => (vars ? Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, v), s) : s);

function lookup(str) {
  if (exact.has(str)) return exact.get(str);
  for (const p of patterns) {
    const m = p.re.exec(str);
    // Captured parts are translated too, e.g. the {to} in "Connects to {to}".
    if (m) return p.names.reduce((out, name, i) => out.replaceAll(`{${name}}`, exact.get(m[i + 1]) ?? m[i + 1]), p.zh);
  }
  return undefined;
}

export function t(s, vars) {
  if (s == null) return s;
  const str = String(s);
  if (lang !== 'zh') return fill(str, vars);
  const found = lookup(str);
  if (found === undefined && /[a-z]{3}/.test(str) && !/[\u4e00-\u9fff]/.test(str)) missing.add(str);
  return fill(found ?? str, vars);
}

// Untranslated strings seen on screen, for checking translation coverage in the console.
export const missingTranslations = () => [...missing];

const SKIP = 'pre, code, script, style, svg, textarea, .term-out, [data-no-i18n]';

function translateNode(node) {
  const raw = node.nodeValue;
  const text = raw.trim();
  if (!text || !/[A-Za-z]/.test(text) || node.parentElement?.closest(SKIP)) return;
  const out = t(text);
  if (out !== text) node.nodeValue = raw.replace(text, out);
}

export function translateTree(root) {
  if (lang !== 'zh') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) translateNode(n);
}

export function observe(root) {
  if (lang !== 'zh') return;
  document.documentElement.lang = 'zh-CN';
  translateTree(root);
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'characterData') translateNode(r.target);
      for (const n of r.addedNodes) {
        if (n.nodeType === Node.TEXT_NODE) translateNode(n);
        else if (n.nodeType === Node.ELEMENT_NODE) translateTree(n);
      }
    }
  }).observe(root, { childList: true, subtree: true, characterData: true });
}

// Engine UI strings. Board content lives in each board's zh.js.
export const UI_ZH = {
  // chrome
  Progress: '进度', Home: '首页', Lessons: '课程', Parts: '零件', 'Try it': '动手试', Settings: '设置',
  'All boards': '全部板子', Overview: '概览', Wiring: '接线', Pinout: '引脚', Code: '代码', Kit: '材料',
  '← {tab}': '← {tab}', 'Next: {tab} →': '下一步：{tab} →', '← Previous lesson': '← 上一课',
  'Finish the course ✓': '完成全部课程 ✓', 'Finish lesson, go to the next →': '完成本课，进入下一课 →',
  'Press **Run** to upload the code.': '点 **运行** 上传代码。',
  'Change things in the panel below, or click and hold parts in the 3D view.': '在下面的面板里调整，或在 3D 视图里点击、按住零件。',
  'Read what the board prints at the bottom.': '在最下面查看板子输出的内容。',
  Next: '下一步', Back: '上一步', Skip: '跳过', 'Start learning': '开始学习',
  'Steps in a lesson': '一节课的步骤', 'The 3D view': '3D 视图', 'Next step': '下一步', 'Need this again?': '还想再看一遍？',
  'Each square is one lesson. Yellow is where you are and green ones are done. Click any square to jump to it.': '每个方块是一节课。黄色是你现在的位置，绿色是已完成的。点任意方块就能跳过去。',
  'Every lesson has the same steps: read the overview, check the wiring, look at the code, then try it. Go left to right.': '每节课的步骤都一样：先看概览，再看接线、看代码，最后动手试。从左往右走就行。',
  'Drag to turn the scene and scroll to zoom. Click any part, pin or wire to see what it is.': '拖动可以旋转场景，滚轮可以缩放。点击任何零件、引脚或导线，就能看到它是什么。',
  'Each yellow number sits on a part. The key explains what that part does in this lesson.': '每个黄色编号都标在一个零件上。图例会说明它在这节课里的作用。',
  'Finished a step? Press this. It walks you through the whole lesson and then on to the next one.': '看完一步就点这里。它会带你走完整节课，然后进入下一课。',
  'Press ? at any time to replay this guide.': '随时点 ? 就能重新看这份引导。',
  'Lesson {a} of {b}': '第 {a} 课 / 共 {b} 课', '{a} / {b} done': '已完成 {a} / {b}',
  'Loading the 3D view…': '正在加载 3D 视图…',
  'Drag to orbit · right-drag or WASD to pan · Q/E to turn · scroll to zoom': '拖动旋转 · 右键拖动或 WASD 平移 · Q/E 转向 · 滚轮缩放',
  'Showing a flat top view: {reason}': '当前显示平面俯视图：{reason}',
  'this browser has WebGL (hardware acceleration) turned off.': '这个浏览器关闭了 WebGL（硬件加速）。重启浏览器通常能恢复。',
  'the 3D engine failed to load ({err}).': '3D 引擎加载失败（{err}）。',
  // popovers and side panels
  'Zoom to it': '放大查看', 'Run to see it': '运行看看', Resistance: '电阻值', Colour: '颜色',
  'Object distance': '物体距离', 'Knob position': '旋钮位置', 'Servo angle': '舵机角度', 'Light level': '光线强度',
  'Not used in this lesson.': '本课没有用到。', 'Connects to {to}': '连接到 {to}', 'Click for details': '点击查看详情',
  '{h} pin {n}': '{h} 第 {n} 脚',
  Components: '零件', '{n} in view': '画面中 {n} 个', '{a}/{b} done': '已完成 {a}/{b}',
  'Numbered labels': '编号标注', 'Numbers on the parts and the key that explains them': '零件上的编号和对应的图例说明',
  'Hardware Bench': '硬件学堂', Key: '图例',
  'Found a mistake? Tell us': '发现错误？告诉我们',
  objects: '物体', speed: '速度', 'Press Run to start the camera and the model.': '点“运行”启动摄像头和模型。',
  'Start the model with Run, then pick a question. The answers here are examples: a real model words them differently every time.': '先点“运行”启动模型，再选一个问题。这里的回答只是示例：真实的模型每次措辞都会不一样。',
  'Model ready. Pick a question.': '模型已就绪。选一个问题吧。', 'The model is not running. Press Run.': '模型没有运行。请点“运行”。',
  '(nothing happens: the server is not running)': '（没有反应：服务器没有运行）',
  Stopped: '已停止', 'Press Run to play the frames.': '点“运行”播放画面。', 'Waiting for the button': '等待按下按钮', 'Press Run to start the sequence.': '点“运行”开始这个序列。',
  'Floor grid': '地面网格', 'The faint grid under the board': '板子下方的浅色网格',
  Turntable: '自动旋转', 'Slowly turn the scene when idle': '空闲时缓慢旋转场景',
  'Reduce motion': '减少动画', 'Jump instead of animating': '直接跳转，不播放动画', 'Reset progress': '重置进度',
  // tabs
  Board: '板子引脚', 'Connect to': '连接到', Copy: '复制', Copied: '已复制', 'Copy failed': '复制失败',
  '▶ Run': '▶ 运行', '■ Stop': '■ 停止', Clear: '清空',
  // LED current hints
  'About {x} mA: bright and safe.': '约 {x} mA：明亮且安全。', 'About {x} mA: dimmer, still safe.': '约 {x} mA：偏暗，仍然安全。',
  'About {x} mA: barely glows.': '约 {x} mA：几乎不亮。', 'About {x} mA: more than a pin should supply.': '约 {x} mA：超过了引脚的安全电流。',
  // sims
  'Pick a part to find it on the board.': '选一个零件，在板子上找到它。', 'Click a command to run it in the terminal below.': '点击命令，在下方终端里运行。',
  delay: '延时', knob: '旋钮', object: '物体', red: '红', green: '绿', blue: '蓝', yellow: '黄', white: '白',
  'LOW · off': '低电平 · 灭', 'HIGH · on': '高电平 · 亮',
  'Press Run, then drag the slider: it changes the delay in the code. Click the LED or resistor in the 3D view to swap parts.': '点“运行”，再拖动滑块：它改变的是代码里的延时。在 3D 视图里点 LED 或电阻可以更换零件。',
  'Hold this button, or the one in the 3D view. Nothing listens to the pin until the script is running.': '按住这个按钮，或 3D 视图里的按钮。程序运行起来之前，没有人在读这个引脚。',
  'The sliders act like the interactive prompt: each change runs': '滑块相当于交互式命令行：每次拖动都会运行',
  '. Run plays the script.': '。点“运行”播放整个程序。',
  distance: '距离', 'echo time': '回波时间', 'Move the object here or from the sensor in the 3D view.': '在这里或在 3D 视图的传感器上移动物体。',
  temperature: '温度', humidity: '湿度', pressure: '气压', 'Breathe on the sensor': '对传感器哈口气',
  'Warm, damp breath pushes temperature and humidity up for a few seconds.': '温暖潮湿的气息会让温度和湿度上升几秒钟。',
  '(nothing happens: the script is not running)': '（没有反应：程序还没运行）',
  'raw reading': '原始读数', 'pin voltage': '引脚电压',
  'Turn the knob here or in the 3D view. The simulator shows ideal readings; real ADCs are less accurate near the ends of their range.': '在这里或 3D 视图里转动旋钮。模拟器显示的是理想读数，真实的 ADC 在量程两端会不太准。',
  'Press Run to take a photo with the script.': '点“运行”，用程序拍一张照片。',
  'This is the page your phone sees. Each click sends an HTTP request to the board.': '这是手机上看到的页面。每次点击都会向板子发一个 HTTP 请求。',
  'This site can’t be reached. Start the server with Run.': '无法访问此网站。先点“运行”启动服务器。',
  'This site can’t be reached. Start it with Run.': '无法访问此网站。先点“运行”启动它。',
  On: '开', Off: '关', 'LED control': 'LED 控制', 'Weather station': '气象站',
  'The page asks the board for a new reading every {n} seconds.': '页面每 {n} 秒向板子请求一次新读数。',
  note: '音符', frequency: '频率', rest: '休止', 'Sound off': '声音：关', 'Sound on': '声音：开',
  'Press Run to play the melody. Turn the sound on to hear it (quietly).': '点“运行”播放旋律。打开声音可以听到（音量很小）。',
  angle: '角度', pressed: '按下', released: '松开', terminal: '终端',
  'Move the object here or from the sensor in the 3D view. {note}': '在这里或在 3D 视图的传感器上移动物体。{note}',
  'Run sweeps the servo from {a}° to {b}° and back. When stopped, the slider (or the servo\'s popover) moves it directly.': '运行后舵机在 {a}° 和 {b}° 之间来回扫动。停止时，可以用滑块（或舵机的弹窗）直接转动它。',
  'beep every': '蜂鸣间隔', solid: '长鸣',
  // PC sims
  '▶ Play': '▶ 播放', '⏸ Pause': '⏸ 暂停', 'Done!': '完成！', state: '状态', 'power LED': '电源灯', on: '开', off: '关',
  starting: '启动中', restarting: '重启中', 'Power button': '电源按钮', 'Reset button': '重启按钮',
  'Press the buttons here or on the case in the 3D view. Hold Power for 4 seconds to force the PC off.': '可以按这里的按钮，也可以按 3D 视图里机箱上的按钮。按住电源键 4 秒会强制关机。',
  'PWR_SW: pins shorted for a moment → the board wakes the power supply': 'PWR_SW：两个针脚被短暂接通 → 主板唤醒电源',
  'Held for 4 s: forced power off': '按住 4 秒：强制断电', 'Short press while on: the operating system shuts down cleanly': '开机时短按：操作系统正常关机',
  'Shut down': '已关机', 'RESET_SW pressed while off: nothing happens': '关机状态下按 RESET_SW：没有反应',
  'RESET_SW: pins shorted → the board restarts without cutting power': 'RESET_SW：两个针脚接通 → 主板重启，但不断电',
  'Move the object closer: the beeps speed up, and under {n} cm the LED lights and the tone holds.': '把物体移近：蜂鸣会加快，距离小于 {n} cm 时 LED 亮起、蜂鸣变成长音。',
};
addDict(UI_ZH);
