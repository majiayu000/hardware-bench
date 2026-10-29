#!/usr/bin/env node
// Lists every user-visible string in a board's content.js: the keys its zh.js must translate.
// Code, commands, terminal output, pin names and 3D silkscreen are excluded on purpose:
// they stay as they appear on the real hardware.
//
// Usage: bun scripts/strings.mjs <board-dir>            all strings, one JSON array
//        bun scripts/strings.mjs <board-dir> --missing  only strings zh.js does not translate yet
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

// Part numbers, units and pin names ("GND", "HC-SR04", "32 KB") read the same in Chinese.
// Text inside `backticks` is code and is never translated.
export const needsTranslation = (s) => /[a-z]{3}/.test(s.replace(/`[^`]*`/g, ''));

export function contentStrings({ SITE, BOARD, PIN_TYPES, LESSONS }) {
  const out = new Set();
  const add = (s) => { if (typeof s === 'string' && /[A-Za-z]/.test(s)) out.add(s); };
  const blocks = (list) => (list ?? []).forEach((b) => {
    if (typeof b === 'string') return add(b);
    add(b.h); add(b.note);
    (b.steps ?? []).forEach(add);
    (b.tips ?? []).forEach(([, s]) => add(s));
    (b.specs ?? []).forEach(([k, v]) => { add(k); add(v); });
  });
  ['title', 'terminalHint', 'shell'].forEach((k) => add(SITE[k]));
  Object.values(PIN_TYPES).forEach(add);
  for (const c of BOARD.components ?? []) { add(c.label); add(c.desc); }
  for (const h of BOARD.headers ?? []) { add(h.label); add(h.short); add(h.desc); h.pins.forEach((p) => add(p.alt)); }
  for (const l of LESSONS) {
    add(l.title); add(l.short); add(l.summary);
    blocks(l.overview); blocks(l.wiringNotes); blocks(l.codeNotes);
    (l.wiring ?? []).forEach((w) => add(w.to));
    (l.callouts ?? []).forEach((c) => { add(c.title); add(c.text); });
    (l.circuit?.parts ?? []).forEach((p) => { add(p.label); add(p.desc); add(p.controlLabel); });
    const s = l.sim ?? {};
    ['label', 'caption', 'limitNote', 'title', 'slider'].forEach((k) => add(s[k]));
    (s.commands ?? []).forEach((c) => add(c.note));
    (s.steps ?? []).forEach((st) => add(st.text));
    (s.post ?? []).forEach(add);
    (s.chats ?? []).forEach((c) => { add(c.q); add(c.a); });
    add(s.done);
    (l.kit ?? []).forEach(([qty, item, note]) => { add(qty); add(item); add(note); });
  }
  return [...out];
}

if (import.meta.main ?? process.argv[1]?.endsWith('strings.mjs')) {
  const dir = resolve(process.argv[2] ?? '.');
  const content = await import(pathToFileURL(join(dir, 'content.js')).href);
  let strings = contentStrings(content);
  if (process.argv.includes('--missing')) {
    const zhPath = join(dir, 'zh.js');
    const zh = existsSync(zhPath) ? (await import(pathToFileURL(zhPath).href)).default : {};
    strings = strings.filter((s) => !(s in zh) && needsTranslation(s));
  }
  console.log(JSON.stringify(strings, null, 1));
  console.error(`${strings.length} string(s)`);
}
