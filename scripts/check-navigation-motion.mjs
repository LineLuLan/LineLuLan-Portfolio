// Intent: prove section positioning and pre-paint motion choices without a browser.
// Status: R2 regression gate. Next: browser verification. Blockers: none. Confidence: executable cases.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText, { exports, ...globals });
  return exports;
}

const { sectionScrollTop } = load('../lib/scroll-to-section.ts');
assert.equal(sectionScrollTop('hero', 400, 80), 0);
assert.equal(sectionScrollTop('about', 1000, 80), 920);
assert.equal(sectionScrollTop('work', 1000, 121), 879);
assert.equal(sectionScrollTop('about', 50, 80), 0);
assert.equal(sectionScrollTop('contact', 4000, 81), 3919);

// Exercise Record's date partition and keyboard policy independently of the DOM.
const { chronicles } = load('../content/chronicles.ts');
const { recordTabs, nextRecordTab } = load('../components/chronicles/ChroniclesSection.tsx', { require: () => ({}) });
const tabs = recordTabs(chronicles, new Date(2026, 10, 6));
assert.deepEqual(Array.from(tabs, (tab) => tab.id), ['upcoming', '2026', '2025', '2024', 'earlier']);
assert.deepEqual(Array.from(tabs, (tab) => tab.events.length), [1, 9, 5, 1, 4]);
assert.equal(new Set(tabs.flatMap((tab) => tab.events.map((event) => event.id))).size, chronicles.length);
const boundary = recordTabs([
  { id: 'today', date: '2026-11-06' },
  { id: 'tomorrow', date: '2026-11-07' },
  { id: 'past', date: '2023-12-31' },
], new Date(2026, 10, 6, 12));
assert.deepEqual(Array.from(boundary[0].events, (event) => event.id), ['tomorrow']);
assert.deepEqual(Array.from(boundary[1].events, (event) => event.id), ['today']);
assert.equal(nextRecordTab('ArrowRight', 4, 5), 0);
assert.equal(nextRecordTab('ArrowLeft', 0, 5), 4);
assert.equal(nextRecordTab('Home', 3, 5), 0);
assert.equal(nextRecordTab('End', 1, 5), 4);
assert.equal(nextRecordTab('Tab', 1, 5), null);

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { ChroniclesSection } = load('../components/chronicles/ChroniclesSection.tsx', {
  require(id) {
    if (id === 'react' || id === 'react/jsx-runtime') return require(id);
    const modules = {
      '@/components/providers/ThemeProvider': { useTheme: () => ({ reducedMotion: true }) },
      'framer-motion': { motion: { li: ({ children }) => React.createElement('li', null, children) } },
      '@/lib/dates': { formatChronicleDate: (date) => date },
      '@/components/layout/SectionWrapper': { SectionWrapper: ({ children }) => React.createElement('section', null, children) },
      '@/components/ui/SectionHeader': { SectionHeader: () => null },
      '@/lib/pixel-planets': { SECTION_PLANET: { record: 'moon' } },
      './EventModal': { EventModal: () => null },
      '@/content/chronicles': { chronicles },
      '@/lib/cn': { cn: (...classes) => classes.filter(Boolean).join(' '), capitalize: (text) => text },
    };
    assert.ok(id in modules, `Unexpected Record dependency: ${id}`);
    return modules[id];
  },
});
const recordHTML = renderToStaticMarkup(React.createElement(ChroniclesSection));
for (const event of chronicles) {
  const escapedTitle = renderToStaticMarkup(React.createElement('span', null, event.title)).slice(6, -7);
  assert.ok(recordHTML.includes(escapedTitle), `SSR must preserve milestone: ${event.id}`);
}
assert.match(recordHTML, /<noscript>/);
assert.equal((recordHTML.match(/aria-selected="true"/g) ?? []).length, 1);

for (const motion of ['on', 'off']) {
  let scroll;
  let focus;
  const { scrollToSection } = load('../lib/scroll-to-section.ts', {
    document: {
      documentElement: { dataset: { motion } },
      querySelector: () => ({ getBoundingClientRect: () => ({ height: 80 }) }),
    },
    window: { innerHeight: 900, scrollY: 500, scrollTo: (options) => { scroll = options; } },
  });
  scrollToSection({
    id: 'about',
    getBoundingClientRect: () => ({ top: 500, height: 400 }),
    focus: (options) => { focus = options; },
  });
  assert.equal(scroll.top, 920);
  assert.equal(scroll.behavior, motion === 'on' ? 'smooth' : 'instant');
  assert.equal(focus.preventScroll, true);
}

const { themeInitScript } = load('../lib/themes.ts');
for (const reduced of [false, true]) {
  for (const stored of [null, 'on', 'off', 'invalid', 'denied']) {
    const root = { dataset: {} };
    vm.runInNewContext(themeInitScript, {
      document: { documentElement: root },
      window: { matchMedia: () => ({ matches: reduced }) },
      localStorage: { getItem(key) {
        if (stored === 'denied') throw new Error('Denied');
        return key === 'line.motion' ? stored : null;
      } },
    });
    const explicit = stored === 'on' || stored === 'off';
    assert.equal(root.dataset.motion, explicit ? stored : reduced ? 'off' : 'on');
    assert.equal(root.dataset.motionSource, explicit ? 'user' : 'system');
  }
}
console.log('PASS: 5 section offsets, Record date partitions, 5 keyboard cases, all 20 SSR milestones, 2 scroll/focus behaviors and 10 motion preference cases.');
