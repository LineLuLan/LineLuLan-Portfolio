// Intent: prove Line's HF totals, partial failures and server fetch boundaries without network calls.
// Status: regression gate. Next: run with build verification. Blockers: none. Confidence: deterministic API cases.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Match the existing visitors-core tests: transpile TS and isolate external effects.
function load(fetch = () => { throw new Error('Unexpected fetch'); }, timeouts = []) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/hf-stats.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, fetch,
    AbortSignal: { timeout: (ms) => { timeouts.push(ms); return AbortSignal.timeout(ms); } },
    require: (name) => { assert.equal(name, 'server-only'); return {}; },
  });
  return exports;
}

// Hub response shape verified in the task packet on 2026-11-07.
const medium = { id: 'TwoheartsTechnologies/GoiBERT-M', downloads: 129, downloadsAllTime: 133, likes: 4 };
const small = { id: 'TwoheartsTechnologies/GoiBERT-S', downloads: 67, downloadsAllTime: 70, likes: 0 };
const plain = (value) => JSON.parse(JSON.stringify(value));

test('sum two models using all-time downloads and preserve the per-model counts', () => {
  assert.deepEqual(plain(load().aggregateHfStats([medium, small])), {
    total: 203, likes: 4,
    models: [
      { id: medium.id, name: 'GoiBERT-M', downloads: 129, allTime: 133, likes: 4 },
      { id: small.id, name: 'GoiBERT-S', downloads: 67, allTime: 70, likes: 0 },
    ],
  });
});

test('missing all-time count falls back to downloads, while zero remains zero', () => {
  const { downloadsAllTime, ...fallback } = medium;
  const { aggregateHfStats } = load();
  assert.equal(aggregateHfStats([fallback]).total, 129);
  assert.equal(aggregateHfStats([{ ...medium, downloadsAllTime: 0 }]).total, 0);
});

test('one failed model is skipped and all failed or empty returns null', () => {
  const { aggregateHfStats } = load();
  assert.equal(aggregateHfStats([null, small]).total, 70);
  assert.equal(aggregateHfStats([null, undefined]), null);
  assert.equal(aggregateHfStats([]), null);
});

test('malformed counters are skipped rather than displayed as adoption', () => {
  const { aggregateHfStats } = load();
  for (const invalid of [{}, { ...medium, downloads: -1 }, { ...medium, likes: '4' }, { ...medium, downloadsAllTime: NaN }]) {
    assert.equal(aggregateHfStats([invalid]), null);
  }
});

test('fetch uses the Hub expansion, six-hour ISR and a five-second deadline', async () => {
  const calls = [];
  const timeouts = [];
  const { getHfStats } = load(async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => url.includes('GoiBERT-M') ? medium : small };
  }, timeouts);
  assert.equal((await getHfStats([medium.id, small.id])).total, 203);
  assert.deepEqual(timeouts, [5000, 5000]);
  assert.equal(calls.length, 2);
  for (const [index, { url, options }] of calls.entries()) {
    assert.equal(url, `https://huggingface.co/api/models/${[medium.id, small.id][index]}?expand[]=downloads&expand[]=downloadsAllTime&expand[]=likes`);
    assert.equal(options.next.revalidate, 21600);
    assert.ok(options.signal instanceof AbortSignal);
  }
});

test('network, HTTP and JSON failures never throw and preserve surviving models', async () => {
  for (const fail of [
    async () => { throw new Error('Timeout'); },
    async () => ({ ok: false, json: async () => medium }),
    async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } }),
  ]) {
    const { getHfStats } = load((url) => url.includes('GoiBERT-M') ? fail() : Promise.resolve({ ok: true, json: async () => small }));
    assert.equal((await getHfStats([medium.id, small.id])).total, 70);
    assert.equal(await getHfStats([medium.id]), null);
    assert.equal(await getHfStats([]), null);
  }
});
