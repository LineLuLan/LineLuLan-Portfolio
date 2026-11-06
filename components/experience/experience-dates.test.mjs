// Intent: prove inclusive month durations, grouped roles and one-month date labels.
// Status: regression coverage. Next: browser acceptance. Blockers: none. Confidence: boundary assertions.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const exports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL('./experience-dates.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports });
const { roleDateRange, roleDuration, orgDuration } = exports;
assert.equal(roleDateRange({ start: '2026-02', end: '2026-02' }), 'Feb 2026');
assert.equal(roleDateRange({ start: '2026-07' }), 'Jul 2026 – Present');
assert.equal(roleDuration({ start: '2026-02', end: '2026-02' }, '2026-11'), '1 mo');
assert.equal(roleDuration({ start: '2025-12' }, '2026-01'), '2 mos');
assert.equal(roleDuration({ start: '2025-01', end: '2025-12' }, '2026-11'), '1 yr');
assert.equal(orgDuration([{ start: '2024-08' }], '2026-11'), '2 yrs 4 mos');
assert.equal(orgDuration([
  { start: '2026-08' }, { start: '2025-08', end: '2026-08' }, { start: '2024-09', end: '2025-08' },
], '2026-11'), '2 yrs 3 mos');
assert.equal(orgDuration([{ start: '2026-01', end: '2026-02' }, { start: '2026-05', end: '2026-05' }], '2026-11'), '3 mos');
assert.equal(roleDuration({ start: '2026-12' }, '2026-11'), '0 mos');
console.log('PASS: Experience dates, inclusive months, overlap/gap accounting and present boundary.');
