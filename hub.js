// Hub home page: board cards with live lesson counts and progress, plus the AI boards coming next.
import { BOARDS, COMING, GROUPS, HUB_ZH, LINKS } from './boards/boards.js';
import { t, lang, setLang, addDict, observe } from './engine/i18n.js';

addDict(HUB_ZH);
document.querySelectorAll('[data-link]').forEach((a) => { a.href = LINKS[a.dataset.link]; });
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function readDone(siteId) {
  try {
    return JSON.parse(localStorage.getItem(`${siteId}:done`) ?? '[]').length;
  } catch {
    return 0;
  }
}

async function renderBoards() {
  const cards = await Promise.all(BOARDS.map(async (b) => [b.group, await card(b)]));
  $('#boards').innerHTML = GROUPS.map((g) => `<h2 class="hub-h">${esc(t(g.title))}</h2>
    <div class="hub-grid">${cards.filter(([group]) => group === g.id).map(([, html]) => html).join('')}</div>`).join('');
}

async function card(b) {
  const { SITE, LESSONS } = await import(`./boards/${b.id}/content.js`);
  const done = readDone(SITE.id);
  const pct = Math.round((done / LESSONS.length) * 100);
  return `<a class="hub-card" href="boards/${b.id}/" style="--card: ${b.accent}">
    <img class="hub-cover" src="boards/${b.id}/cover.png" alt="" loading="lazy">
    <div class="hub-card-body">
      <div class="hub-meta"><span class="chip-tag">${esc(b.level)}</span><span class="chip-tag mono">${esc(b.language)}</span><span class="hub-count">${esc(t('{n} lessons', { n: LESSONS.length }))}</span></div>
      <h3>${esc(b.name)}</h3>
      <p>${esc(b.blurb)}</p>
      <div class="hub-progress"><span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span><small>${esc(t('{a} of {b} done', { a: done, b: LESSONS.length }))}</small></div>
      <span class="btn">${esc(t(done ? 'Continue' : 'Start learning'))} →</span>
    </div>
  </a>`;
}

function renderComing() {
  $('#comingTitle').hidden = $('#coming').hidden = COMING.length === 0;
  $('#coming').innerHTML = COMING.map((c) => `<div class="hub-card soon">
    <div class="hub-card-body">
      <div class="hub-meta"><span class="chip-tag">${esc(c.level)}</span><span class="chip-tag mono">${esc(c.tag)}</span><span class="hub-count">Coming soon</span></div>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.blurb)}</p>
    </div>
  </div>`).join('');
}

function applyTheme(theme) {
  if (theme) document.documentElement.dataset.theme = theme;
}
try {
  applyTheme(localStorage.getItem('learn-hardware:theme'));
} catch (err) {
  console.warn('Could not read the saved theme.', err);
}
$('#themeToggle').addEventListener('click', () => {
  const current = document.documentElement.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('learn-hardware:theme', next);
  } catch (err) {
    console.warn('Could not save the theme.', err);
  }
});

observe(document.body);
document.title = t('Hardware Bench');
$('#langToggle').textContent = lang === 'zh' ? 'EN' : '中';
$('#langToggle').addEventListener('click', () => setLang(lang === 'zh' ? 'en' : 'zh'));
renderComing();
renderBoards();
