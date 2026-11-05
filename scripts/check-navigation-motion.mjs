// Intent: prove section positioning and pre-paint motion choices without a browser.
// Status: R2 regression gate. Next: browser verification. Blockers: none. Confidence: executable cases.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, ...globals });
  return exports;
}

const { sectionScrollTop } = load('../lib/scroll-to-section.ts');
assert.equal(sectionScrollTop('hero', 400, 600, 80, 900), 0);
assert.equal(sectionScrollTop('about', 1000, 400, 80, 900), 710);
assert.equal(sectionScrollTop('work', 1000, 1200, 80, 900), 920);
assert.equal(sectionScrollTop('about', 50, 400, 80, 900), 0);
assert.equal(sectionScrollTop('about', 1000, 820, 80, 900), 920);

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
  assert.equal(scroll.top, 710);
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
console.log('PASS: 5 section offsets, 2 scroll/focus behaviors and 10 motion preference cases.');
