// Intent: exercise swipe thresholds, direction and wrapping before UI integration.
// Status: regression coverage. Next: browser gestures. Blockers: none. Confidence: executable boundaries.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('./carousel-state.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports });
const { swipeDirection, wrapIndex, slidePosition } = exports;
const { wheelDirection, coverflowState } = exports;
assert.equal(wheelDirection(81, 10), 1);
assert.equal(wheelDirection(-81, 10), -1);
assert.equal(wheelDirection(79, 0), 0);
assert.equal(wheelDirection(100, 110), 0);
assert.equal(wheelDirection(100, 90), 0);
assert.equal(coverflowState(0).rotateY, 0);
assert.equal(coverflowState(1).rotateY, -28);
assert.equal(coverflowState(-1).rotateY, 28);
assert.ok(Math.abs(coverflowState(0.5).scale - 0.93) < 1e-10);
assert.equal(coverflowState(1).z, -140);
assert.equal(coverflowState(1).opacity, 0.55);
assert.equal(coverflowState(1).blur, 1);
assert.equal(coverflowState(4).scale, 0.86);
assert.equal(swipeDirection(-151, 0, 600), 1);
assert.equal(swipeDirection(151, 0, 600), -1);
assert.equal(swipeDirection(150, 500, 600), 0);
assert.equal(swipeDirection(0, -501, 600), 1);
assert.equal(swipeDirection(0, 501, 600), -1);
assert.equal(swipeDirection(-151, 501, 600), 1);
assert.equal(swipeDirection(20, 100, 600), 0);
assert.equal(wrapIndex(-1, 4), 3);
assert.equal(wrapIndex(4, 4), 0);
assert.equal(slidePosition(3, 0, 4), -1);
assert.equal(slidePosition(0, 3, 4), 1);
assert.equal(slidePosition(2, 2, 4), 0);
console.log('PASS: carousel swipe thresholds, direction, wrapping and adjacent positions.');
