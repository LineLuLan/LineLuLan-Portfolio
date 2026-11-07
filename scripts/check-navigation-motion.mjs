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

// Exercise chronological road geometry and the moving calendar boundary before rendering.
const { chronicles } = load('../content/chronicles.ts');
const { careerLayout } = load('../components/chronicles/career-layout.ts');
const layout = careerLayout(chronicles, '2026-11-06');
assert.equal(layout.nodes.length, 20);
assert.equal(new Set(layout.nodes.map(({ event }) => event.id)).size, 20);
assert.ok(layout.nodes.every((node, i, nodes) => !i || nodes[i - 1].event.date <= node.event.date));
assert.deepEqual(Array.from(layout.nodes.filter((node) => node.future), ({ event }) => event.id), ['iu-grad']);
assert.equal(layout.nodes.at(-1).future, true);
for (let row = 0; row < 4; row++) {
  const nodes = layout.nodes.slice(row * 6, row * 6 + 6);
  assert.equal(new Set(nodes.map((node) => node.y)).size, 1);
  assert.equal(nodes[1].x - nodes[0].x, row % 2 ? -168 : 168);
}
assert.equal((layout.desktop.full.match(/ A /g) ?? []).length, 3);
assert.ok(layout.desktop.future.endsWith('L 752 520'));
assert.ok(layout.desktop.travelled.endsWith('920 520'));
assert.equal(layout.mobile.full.split(' C ').length - 1, 19);
const boundary = careerLayout([
  { id: 'tomorrow', date: '2026-11-07' },
  { id: 'today', date: '2026-11-06' },
  { id: 'past', date: '2023-12-31' },
], '2026-11-06');
assert.deepEqual(Array.from(boundary.nodes, (node) => node.future), [false, false, true]);
assert.equal(careerLayout(chronicles, '2030-01-01').desktop.future, '');
assert.equal(careerLayout(chronicles, '2019-01-01').desktop.travelled, '');
assert.equal(careerLayout([], '2026-11-06').nodes.length, 0);

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
for (const motion of ['on', 'off']) {
  const { MotionProvider } = load('../components/layout/MotionProvider.tsx', {
    require(id) {
      if (id === 'react/jsx-runtime') return require(id);
      if (id === '@/components/providers/ThemeProvider') return { useTheme: () => ({ motion }) };
      if (id === 'framer-motion') return { MotionConfig: () => null };
      assert.fail(`Unexpected MotionProvider dependency: ${id}`);
    },
  });
  assert.equal(MotionProvider({ children: null }).props.reducedMotion, motion === 'off' ? 'always' : 'never');
}
const { CareerPath } = load('../components/chronicles/CareerPath.tsx', {
  require(id) {
    if (id === 'react' || id === 'react/jsx-runtime') return require(id);
    const modules = {
      '@/components/providers/ThemeProvider': { useTheme: () => ({ reducedMotion: true }) },
      'framer-motion': { motion: {
        path: ({ initial, whileInView, viewport, transition, ...props }) => React.createElement('path', props),
        span: ({ initial, whileInView, viewport, transition, ...props }) => React.createElement('span', props),
      } },
      '@/lib/dates': { formatChronicleDate: (date) => date },
      '@/components/pixel/PixelPlanet': { PixelPlanet: () => null },
      '@/components/ui/SiteIcon': { SiteIcon: () => null },
      './career-layout': { careerLayout },
      './career-path.css': {},
    };
    assert.ok(id in modules, `Unexpected Record dependency: ${id}`);
    return modules[id];
  },
});
const recordHTML = renderToStaticMarkup(React.createElement(CareerPath, { events: chronicles, today: '2026-11-06' }));
for (const event of chronicles) {
  const escapedTitle = renderToStaticMarkup(React.createElement('span', null, event.title)).slice(6, -7);
  assert.ok(recordHTML.includes(escapedTitle), `SSR must preserve milestone: ${event.id}`);
}
assert.equal((recordHTML.match(/data-milestone=/g) ?? []).length, 20);
assert.equal((recordHTML.match(/aria-expanded="false"/g) ?? []).length, 20);
assert.match(recordHTML, />Next</);
assert.ok(!recordHTML.includes('role="tab"'));

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
    assert.equal(root.dataset.motion, explicit ? stored : 'on');
    assert.equal(root.dataset.motionSource, explicit ? 'user' : 'default');
  }
}
let appearanceCases = 0;
for (const dark of [false, true]) {
  for (const mode of [null, 'light', 'dark', 'invalid', 'denied']) {
    for (const accent of [null, 'kafka', 'nebula', 'aurora', 'mars', 'rose', 'invalid']) {
      const root = { dataset: {} };
      vm.runInNewContext(themeInitScript, {
        document: { documentElement: root },
        window: { matchMedia: (query) => ({ matches: query.includes('color-scheme') && dark }) },
        localStorage: { getItem(key) {
          if (mode === 'denied') throw new Error('Denied');
          return { 'line.mode': mode, 'line.accent': accent }[key] ?? null;
        } },
      });
      const explicit = mode === 'light' || mode === 'dark';
      assert.equal(root.dataset.theme, 'orbit');
      assert.equal(root.dataset.mode, explicit ? mode : dark ? 'dark' : 'light');
      assert.equal(root.dataset.modeSource, explicit ? 'user' : 'system');
      assert.equal(root.dataset.accent, mode !== 'denied' && ['kafka', 'nebula', 'aurora', 'mars', 'rose'].includes(accent) ? accent : 'kafka');
      appearanceCases++;
    }
  }
}
console.log(`PASS: section offsets, Record chronology/road geometry/20 SSR milestones, scroll/focus, 10 motion preferences and ${appearanceCases} pre-paint appearance cases.`);
