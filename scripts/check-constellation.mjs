// Intent: prove Line's constellation geometry using the component's actual fit implementation.
// Status: regression gate. Next: rerun after coordinate/label edits. Blockers: none.
// Confidence: exhaustive bounds and pairwise box assertions, no browser required.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
    exports, process: { env: {} }, require: (id) => {
      assert.ok(id in dependencies, `Unexpected dependency: ${id}`);
      return dependencies[id];
    },
  });
  return exports;
}
const layout = JSON.parse(readFileSync(new URL('../lib/orbit-layout.json', import.meta.url), 'utf8'));
const { SECTION_ORDER, SECTIONS } = load('../lib/constants.ts');
const { PISCES } = load('../components/hero/pisces.ts');
const { orbitFrame, fitConstellation } = load('../lib/constellation-fit.ts');
const frame = orbitFrame(layout, SECTION_ORDER.map((id) => ({ id, label: SECTIONS[id].label })));
assert.equal(frame.width, 730, 'Keep the existing figure width');
assert.equal(frame.height, 524, 'Keep the existing figure height');
assert.equal(SECTION_ORDER.length, 8);
assert.equal(Object.keys(layout.planets).length, 8);
assert.equal(layout.planets.experience.kind, 'satellite');
const fit = fitConstellation(PISCES, frame, SECTION_ORDER.map((id) => ({ id, label: SECTIONS[id].label, size: layout.planets[id].size })), layout.hoverScale);
const inside = (box, name) => {
  assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= frame.width && box.y + box.height <= frame.height, `${name} outside viewBox: ${JSON.stringify(box)}`);
};
const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
assert.deepEqual(Array.from(fit.planets, (p) => p.id), Array.from(SECTION_ORDER));
assert.deepEqual(Array.from(fit.planets, (p) => p.number), [1, 2, 3, 4, 5, 6, 7, 8]);
for (const [id, star] of Object.entries(fit.stars)) inside({ x: star.x - 3, y: star.y - 3, width: 6, height: 6 }, `star ${id}`);
for (const planet of fit.planets) {
  inside(planet.sprite, `${planet.id} sprite (hovered)`);
  inside(planet.label, `${planet.id} label`);
  for (const [id, star] of Object.entries(fit.stars)) {
    assert.ok(!overlaps(planet.label, { x: star.x - 3, y: star.y - 3, width: 6, height: 6 }), `${planet.id} label overlaps ${id} star/line endpoint`);
  }
  for (const other of fit.planets) {
    assert.ok(!overlaps(planet.label, other.sprite), `${planet.id} label overlaps ${other.id} sprite`);
    if (planet !== other) assert.ok(!overlaps(planet.label, other.label), `${planet.id} label overlaps ${other.id} label`);
  }
}
for (const [from, to] of PISCES.lines) assert.ok(fit.stars[from] && fit.stars[to], `Missing segment endpoint ${from}/${to}`);
console.log(`PASS: ${fit.planets.length} numbered section planets, ${Object.keys(fit.stars).length} stars and ${PISCES.lines.length} segments fit ${frame.width}×${frame.height}; no label/sprite or label/label overlaps.`);
