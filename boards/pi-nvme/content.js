// Everything specific to this course lives in this file: site metadata, the lessons and the parts.
// The Raspberry Pi 5 model and its pin map are shared with the Raspberry Pi course.
// Sources: Raspberry Pi documentation (Active Cooler, M.2 HAT+, PCIe Gen 3, boot order and
// EEPROM configuration) and the M.2 HAT+ product brief.
import { BOARD as PI5, PIN_TYPES as PI_PIN_TYPES } from '../raspberry-pi/content.js';

export const SITE = {
  id: 'learn-pi-nvme',
  title: 'Raspberry Pi 5: Cooling and NVMe SSD',
  accent: '#c2185b',
  logicVolts: 3.3,
  shell: 'pi@raspberrypi: ~',
  terminalHint: 'Connected to the Pi over SSH. Click a command to run it.',
};

export const PIN_TYPES = PI_PIN_TYPES;
export const BOARD = PI5;

// ---------- parts ----------
// The M.2 HAT+ is a 65 × 56.5 mm HAT+ board that takes 2230 and 2242 M-key NVMe drives. It sits on
// spacers above the Pi 5 (and its Active Cooler), joined to the Pi's PCIe connector by a ribbon
// cable. Heights are stylised.
const HOLES = [[3.5, 3.5], [61.5, 3.5], [3.5, 52.5], [61.5, 52.5]];
const COOLER = { id: 'cooler', type: 'block', at: { x: 29, z: 30 }, w: 32, d: 28, h: 7, y: 2.5, color: '#9aa0a8', insert: [0, 40, 0], text: 'COOLER', textColor: '#2b2d33', label: 'Active Cooler', desc: 'Aluminium heatsink with a fan. Thermal pads are already stuck on; two spring pins clip it to the board. Its cable goes to the FAN connector.' };
const SPACERS = {
  id: 'spacers', type: 'block', at: { x: HOLES[0][0], z: HOLES[0][1] }, w: 5, d: 5, h: 16, color: '#c9a44c', insert: [0, 40, 0], label: 'Spacers', desc: 'Four 16 mm spacers hold the HAT above the Active Cooler.',
  boxes: HOLES.slice(1).map(([x, z]) => ({ x: x - HOLES[0][0], z: z - HOLES[0][1], y: -16, w: 5, d: 5, h: 16, color: '#c9a44c' })),
};
const RIBBON = { id: 'ribbon', type: 'block', at: { x: 1.4, z: 28 }, w: 2, d: 13, h: 17, y: 1, color: '#d8b45a', insert: [-30, 0, 0], label: 'PCIe ribbon cable', desc: 'Carries PCIe from the Pi’s PCIe connector up to the HAT. Lift the latch, slide the cable in, press the latch down.' };
const HAT = { id: 'hat', type: 'block', at: { x: 32.5, z: 28.25 }, w: 65, d: 56.5, h: 1.6, y: 18, color: '#2a7d55', insert: [0, 50, 0], label: 'M.2 HAT+', desc: 'Turns the Pi’s PCIe lane into an M.2 M-key slot for 2230 or 2242 NVMe SSDs.' };
const SSD = { id: 'ssd', type: 'block', at: { x: 34, z: 32 }, w: 30, d: 22, h: 2.4, y: 19.6, color: '#1d1e24', insert: [30, 0, 0], text: 'NVMe 2230', label: 'NVMe SSD (2230)', desc: 'A small solid-state drive. Slide it into the slot at an angle, press it down and fix it with the screw.' };
const STACK = [COOLER, SPACERS, RIBBON, HAT, SSD];

export const LESSONS = [
  {
    id: 'cooling',
    title: 'Keep the Pi cool',
    short: 'Cooling',
    summary: 'Under load the Pi 5 slows itself down to stay below 85 °C. The Active Cooler keeps it at full speed.',
    icon: 'circuit',
    focus: { components: ['soc', 'fan'] },
    circuit: { parts: [COOLER] },
    callouts: [
      { part: 'cooler', icon: 'thermo', title: 'Active Cooler', text: 'Heatsink + fan over the processor.' },
      { component: 'fan', icon: 'plug', title: 'FAN', text: 'The cooler’s cable plugs in here.' },
      { component: 'soc', icon: 'chip', title: 'BCM2712', text: 'The part that gets hot.' },
    ],
    overview: [
      'The Pi 5’s processor is two to three times faster than the Pi 4’s, and it gets hot. When it reaches about **80 °C** it starts to **throttle**: it lowers its clock speed to stay below **85 °C**. Your program keeps working, just slower.',
      'The **Active Cooler** sits over the processor with thermal pads already attached. Two spring pins clip it into holes in the board, and its fan plugs into the **FAN** connector. The Pi controls the fan speed itself, so it is silent at idle.',
      { steps: ['Peel the protective film off the thermal pads.', 'Line the two spring pins up with their holes and press until they click.', 'Lift the cover off the **FAN** connector and plug in the fan cable.'] },
      { note: 'The spring pins are hard to remove without damaging them. Fit the cooler when you are sure it is staying.', tone: 'warn' },
      { tips: [['thermo', '`vcgencmd measure_temp` shows the temperature'], ['clock', '`get_throttled=0x0` means it never slowed down'], ['info', 'Any case you choose must leave room for the cooler']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'vcgencmd measure_temp', note: 'temperature now', out: ['temp=48.3\'C'] },
        { cmd: 'vcgencmd get_throttled', note: 'has it slowed down?', out: ['throttled=0x0'] },
        { cmd: 'stress-ng --cpu 4 --timeout 60s && vcgencmd measure_temp', note: 'one minute at full load', out: ['stress-ng: info: successful run completed in 60.00s', 'temp=62.1\'C'] },
      ],
    },
    kit: [['1', 'Raspberry Pi 5'], ['1', 'Raspberry Pi Active Cooler'], ['1', '27 W USB-C power supply']],
  },

  {
    id: 'stack',
    title: 'Fit the M.2 HAT+ and SSD',
    short: 'Build the stack',
    summary: 'Cooler, spacers, PCIe ribbon, the M.2 HAT+ and finally the NVMe drive.',
    icon: 'circuit',
    focus: { components: ['pcie', 'soc', 'fan'] },
    circuit: { parts: STACK },
    callouts: [
      { part: 'ssd', icon: 'memory', title: 'NVMe SSD', text: '2230 or 2242 size.' },
      { part: 'hat', icon: 'chip', title: 'M.2 HAT+', text: 'The slot and its power.' },
      { part: 'ribbon', icon: 'plug', title: 'Ribbon', text: 'PCIe from the Pi’s edge.' },
      { part: 'cooler', icon: 'thermo', title: 'Cooler first', text: 'No room for it afterwards.' },
    ],
    overview: [
      'An NVMe SSD is far faster and more reliable than a microSD card: boot in seconds, and no worn-out card after a year of logging. The Pi 5 has one **PCIe** lane on its edge connector, and the **M.2 HAT+** turns it into a standard M.2 slot.',
      { steps: [
        'Unplug the Pi. Fit the **Active Cooler** first.',
        'Screw the four **spacers** into the Pi’s mounting holes.',
        'Open the **PCIe** latch on the Pi, slide in the ribbon the way the HAT’s guide shows, and close the latch.',
        'Connect the other end to the HAT the same way, then screw the HAT onto the spacers.',
        'Slide the **SSD** into the slot at a slight angle, press it flat, and fix it with the small screw.',
      ] },
      { note: 'The ribbon only works one way round and must go in straight. A cable that sits at an angle is the usual reason no drive shows up.', tone: 'warn' },
      { tips: [['play', 'Press Play in Try it'], ['memory', 'Check the drive is M-key and 2230 or 2242 long'], ['power', 'Use the 27 W supply: the SSD adds to the load']] },
    ],
    sim: {
      type: 'assembly',
      steps: [
        { do: 'insert', parts: ['cooler'], text: 'Clip on the **Active Cooler** and plug its fan into **FAN**.' },
        { do: 'insert', parts: ['spacers'], text: 'Screw the four **spacers** into the corner holes.' },
        { do: 'insert', parts: ['ribbon'], text: 'Open the **PCIe** latch, slide the **ribbon** in straight, close the latch.' },
        { do: 'insert', parts: ['hat'], text: 'Connect the ribbon to the **M.2 HAT+** and screw the HAT onto the spacers.' },
        { do: 'insert', parts: ['ssd'], text: 'Slide the **SSD** into the slot, press it down and fit the screw.' },
      ],
    },
    kit: [['1', 'Raspberry Pi M.2 HAT+', 'Comes with the ribbon, spacers and screws.'], ['1', 'NVMe SSD, 2230 or 2242, M-key', '256 GB is plenty for the system and projects.']],
  },

  {
    id: 'check',
    title: 'Find the drive',
    summary: 'Check that Linux sees the SSD, and optionally switch the link to the faster PCIe Gen 3.',
    icon: 'circuit',
    focus: { components: ['pcie'] },
    circuit: { parts: STACK },
    callouts: [
      { part: 'ssd', icon: 'memory', title: '/dev/nvme0n1', text: 'The drive’s name in Linux.' },
      { component: 'pcie', icon: 'plug', title: 'PCIe ×1', text: 'Gen 2 by default, Gen 3 optional.' },
    ],
    overview: [
      'Boot from the microSD card as usual. A recent Raspberry Pi OS finds the HAT by itself: `lsblk` lists the drive as **nvme0n1**.',
      'By default the link runs at **PCIe Gen 2** (about 450 MB/s). Gen 3 roughly doubles that. Raspberry Pi does not certify the Pi 5 for Gen 3, but it works with most drives; if the drive disappears or errors appear, go back to Gen 2.',
      { steps: ['Run `lsblk` and look for `nvme0n1`.', 'To try Gen 3, add `dtparam=pciex1_gen=3` to the end of `/boot/firmware/config.txt` and reboot.', 'Measure the read speed before and after with `hdparm`.'] },
      { tips: [['terminal', 'Click the commands in Try it'], ['clock', 'Gen 3: around 800 MB/s on a good drive'], ['info', '`sudo rpi-eeprom-update -a` brings the bootloader up to date first']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'lsblk', note: 'list the drives', out: ['NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS', 'mmcblk0     179:0    0  29.7G  0 disk', '├─mmcblk0p1 179:1    0   512M  0 part /boot/firmware', '└─mmcblk0p2 179:2    0  29.2G  0 part /', 'nvme0n1     259:0    0 238.5G  0 disk'] },
        { cmd: 'sudo hdparm -t /dev/nvme0n1', note: 'read speed, Gen 2', out: ['/dev/nvme0n1:', ' Timing buffered disk reads: 1300 MB in  3.00 seconds = 433.21 MB/sec'] },
        { cmd: 'echo "dtparam=pciex1_gen=3" | sudo tee -a /boot/firmware/config.txt && sudo reboot', note: 'switch to Gen 3', out: ['dtparam=pciex1_gen=3', 'Connection to raspberrypi.local closed by remote host.'] },
        { cmd: 'sudo hdparm -t /dev/nvme0n1', note: 'read speed, Gen 3', out: ['/dev/nvme0n1:', ' Timing buffered disk reads: 2440 MB in  3.00 seconds = 813.02 MB/sec'] },
      ],
    },
    kit: [['1', 'microSD card with Raspberry Pi OS', 'Used once more to set up the SSD.']],
  },

  {
    id: 'boot',
    title: 'Boot from the SSD',
    summary: 'Copy the system to the SSD, put NVMe first in the boot order, and take the microSD card out.',
    icon: 'circuit',
    focus: { components: ['pcie', 'soc'] },
    circuit: { parts: STACK },
    callouts: [
      { part: 'ssd', icon: 'memory', title: 'New system drive', text: 'Holds the whole OS now.' },
      { component: 'soc', icon: 'chip', title: 'Bootloader', text: 'Lives in the Pi’s EEPROM.' },
    ],
    overview: [
      'The Pi’s bootloader lives in a small memory chip on the board and tries devices in the order set by **BOOT_ORDER**. It is read from right to left: `0xf416` means NVMe (6) first, then microSD (1), then USB (4), then start over (f).',
      { steps: [
        'Copy the system: open **Accessories → SD Card Copier**, copy from the microSD card to the NVMe drive. (Or write a fresh image to the SSD with Raspberry Pi Imager.)',
        'Set the boot order with `sudo raspi-config` → **Advanced Options → Boot Order → NVMe/USB Boot**, or edit it directly as in Try it.',
        'Shut down, remove the microSD card and power on. `findmnt /` should now show `/dev/nvme0n1p2`.',
      ] },
      { note: 'SD Card Copier erases the target drive. Check you picked the NVMe drive, not a USB stick with your files on it.', tone: 'warn' },
      { tips: [['clock', 'Boots in a few seconds, about twice as fast as microSD'], ['memory', 'Keep the old card as a rescue system'], ['code', '`rpi-eeprom-config` shows the current settings']] },
    ],
    sim: {
      type: 'commands',
      commands: [
        { cmd: 'sudo rpi-eeprom-config', note: 'current bootloader settings', out: ['[all]', 'BOOT_UART=1', 'POWER_OFF_ON_HALT=0', 'BOOT_ORDER=0xf41'] },
        { cmd: 'sudo rpi-eeprom-config --edit', note: 'set BOOT_ORDER=0xf416', out: ['Updating bootloader EEPROM', 'BOOT_ORDER=0xf416', 'EEPROM updates pending. Please reboot to apply the update.'] },
        { cmd: 'findmnt /', note: 'after rebooting without the card', out: ['TARGET SOURCE         FSTYPE OPTIONS', '/      /dev/nvme0n1p2 ext4   rw,noatime'] },
      ],
    },
    kit: [['–', 'Nothing new: the stack from lesson 2']],
  },
];
