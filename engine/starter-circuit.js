// The first-lessons breadboard circuits shared by the microcontroller courses: an LED, a push button,
// a potentiometer and a BME280 sensor at fixed holes, wired to whichever header pins a board offers.
// `vcc`, `gnd` and the signal arguments are "<header>:<pin>" references.

export const ledParts = (ohms = 220) => [
  { id: 'res1', type: 'resistor', a: 'c3', b: 'c7', ohms, label: `${ohms} Ω resistor`, desc: 'Limits the LED current. Click it to try other values.', controls: { ohms: [150, 220, 470, 1000] }, drives: 'led1' },
  { id: 'led1', type: 'led', anode: 'e7', cathode: 'e8', color: 'red', label: 'LED', desc: 'Long leg (anode) to the resistor, short leg to the − rail.', controls: { color: ['red', 'yellow', 'green', 'blue', 'white'] } },
];
export const ledWires = (pin, gnd) => [{ from: pin, to: 'bb:a3', color: '#f0a33a' }, { from: 'bb:a8', to: 'bb:tn8', color: '#2b2a30' }, { from: gnd, to: 'bb:tn1', color: '#2b2a30' }];

export const BUTTON = { id: 'btn1', type: 'button', legs: ['e20', 'e22', 'f20', 'f22'], label: 'Push button', desc: 'Hold it down in the 3D view: it joins column 20 to column 22.' };
export const buttonWires = (pin) => [{ from: pin, to: 'bb:a20', color: '#3b78d6' }, { from: 'bb:a22', to: 'bb:tn22', color: '#2b2a30' }];

const rails = (vcc, gnd) => [{ from: vcc, to: 'bb:bp2', color: '#e2483c' }, { from: gnd, to: 'bb:bn2', color: '#2b2a30' }];

export const POT = { id: 'pot1', type: 'pot', legs: ['j14', 'j15', 'j16'], value: 0.5, label: '10 kΩ potentiometer', desc: 'Outer legs on the supply and GND; the middle leg outputs the voltage in between.', controls: { value: [0, 1] } };
export const potWires = (pin, vcc, gnd) => [...rails(vcc, gnd), { from: 'bb:h14', to: 'bb:bp14', color: '#e2483c' }, { from: pin, to: 'bb:g15', color: '#3fae5a' }, { from: 'bb:h16', to: 'bb:bn16', color: '#2b2a30' }];

export const BME = { id: 'bme', type: 'module', preset: 'breakout', pins: ['j21', 'j22', 'j23', 'j24'], label: 'BME280', color: '#5b2a86', desc: 'Temperature, humidity and pressure on I²C (address 0x76 or 0x77). Pins: VIN, GND, SCL, SDA.' };
export const bmeWires = (scl, sda, vcc, gnd) => [...rails(vcc, gnd), { from: 'bb:h21', to: 'bb:bp21', color: '#e2483c' }, { from: 'bb:h22', to: 'bb:bn22', color: '#2b2a30' }, { from: scl, to: 'bb:g23', color: '#f2c12e' }, { from: sda, to: 'bb:g24', color: '#3b78d6' }];

// For Linux boards whose GPIO library has no pull-up setting: a resistor holds the button's column HIGH.
export const PULLUP = { id: 'res2', type: 'resistor', a: 'c14', b: 'c20', ohms: 10000, label: '10 kΩ resistor', desc: 'A pull-up: it holds the pin HIGH until the button pulls it to ground.' };
export const pullupWires = (vcc) => [{ from: vcc, to: 'bb:tp2', color: '#e2483c' }, { from: 'bb:a14', to: 'bb:tp14', color: '#e2483c' }];
