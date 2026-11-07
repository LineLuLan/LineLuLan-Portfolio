// Intent: define tour order, target lookup and bounded navigation before implementation.
// Status: regression gate. Next: browser acceptance. Blockers: none. Confidence: executable cases.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const exports = {};
vm.runInNewContext(ts.transpileModule(
  readFileSync(new URL('../components/tour/tour-steps.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
).outputText, { exports });
const { TOUR_STEPS, nextStep, previousStep, targetForStep } = exports;

test('nine steps visit every section in the supplied order, then finish without a target', () => {
  assert.equal(TOUR_STEPS.length, 9);
  assert.deepEqual(Array.from(TOUR_STEPS, (_, index) => targetForStep(index)),
    ['hero', 'about', 'experience', 'stack', 'work', 'framework', 'record', 'contact', null]);
  assert.equal(TOUR_STEPS[0].title, "Hi, I'm Line");
  assert.equal(TOUR_STEPS[8].title, "That's the tour");
});

test('next/back stay within bounds, including repeated presses at either end', () => {
  let step = 0;
  for (let index = 0; index < 20; index++) step = nextStep(step);
  assert.equal(step, 8);
  for (let index = 0; index < 20; index++) step = previousStep(step);
  assert.equal(step, 0);
  for (let index = 0; index < 8; index++) assert.equal(previousStep(nextStep(index)), index);
});

test('invalid indices cannot resolve a target or escape navigation bounds', () => {
  for (const index of [-1, 9, NaN, Infinity, 1.5]) assert.equal(targetForStep(index), null);
  assert.equal(previousStep(-10), 0);
  assert.equal(nextStep(100), 8);
});
