// Intent: prove anonymous visitor counting, expiry and input boundaries without external storage.
// Status: caps and client deadlines covered locally. Next: supervisor's live Lua smoke test. Blockers: no local Lua runtime. Confidence: deterministic clocks and mocked TCP client.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function createLoader({ env = { NODE_ENV: 'development' }, redis, timers = { setTimeout, clearTimeout }, warnings = [] } = {}) {
  const modules = new Map();
  return function load(path) {
    if (modules.has(path)) return modules.get(path);
    const exports = {};
    const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    vm.runInNewContext(ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText, {
      exports, process: { env }, Date, Map, Response, Request, ...timers,
      console: { warn: (message) => warnings.push(message) },
      require: (name) => name === './core' || name === '@/lib/visitors/core'
        ? load('lib/visitors/core.ts') : name === '@/lib/visitors/store'
          ? load('lib/visitors/store.ts') : name === 'redis'
            ? { createClient: redis ?? (() => { throw new Error('Unexpected Redis client creation'); }) } : require(name),
    });
    modules.set(path, exports);
    return exports;
  };
}
const load = createLoader();
const core = load('lib/visitors/core.ts');
const { MemoryVisitorStore, makeVisit, createVisitorStore, visitorKeys, visitorExpiry } = load('lib/visitors/store.ts');
const now = Date.parse('2026-11-07T23:59:00Z');
const visit = (id = 'visitor-0001', time = now, agent = 'Mozilla/5.0', ip = '192.0.2.1') =>
  makeVisit(id, 'vn', agent, ip, time);

test('IDs, countries and bot detection reject malformed input', () => {
  for (const id of ['12345678', 'A'.repeat(64), 'hello-123']) assert.equal(core.validVisitorId(id), true);
  for (const id of [null, 1, {}, 'short', 'a'.repeat(65), 'abcd_123', 'abcdefgh\n']) assert.equal(core.validVisitorId(id), false);
  assert.equal(core.normalizeCountry('vn'), 'VN');
  for (const code of [null, '', 'USA', ' VN', 'V1', 'VN\n']) assert.equal(core.normalizeCountry(code), 'XX');
  for (const agent of ['Googlebot', 'crawler', 'Spider', 'slurp', 'preview', 'HeadlessChrome', 'Lighthouse', 'curl', 'wget', 'python', 'HttpClient']) assert.equal(core.isBot(agent), true);
  assert.equal(core.isBot('Mozilla/5.0'), false);
});

test('UTC keys and stable top-N sorting', () => {
  assert.equal(core.utcDay(now), '2026-11-07');
  assert.equal(core.utcHour(now), '2026-11-07-23');
  assert.equal(core.utcDay(now + 60_000), '2026-11-08');
  const rows = [{ code: 'VN', count: 3 }, { code: 'US', count: 5 }, { code: 'DE', count: 5 }];
  assert.equal(JSON.stringify(core.topCountries(rows, 2)), JSON.stringify([{ code: 'DE', count: 5 }, { code: 'US', count: 5 }]));
  assert.equal(rows[0].code, 'VN', 'Sorting does not mutate the response');
});

test('same ID counts once per UTC day, new day counts again, presence expires', async () => {
  const store = new MemoryVisitorStore();
  assert.equal((await store.stats(now)).total, 0);
  await Promise.all(Array.from({ length: 10 }, () => store.visit(visit())));
  assert.equal((await store.stats(now)).total, 1);
  assert.equal((await store.stats(now)).online, 1);
  const tomorrow = now + 86_400_000;
  assert.equal((await store.visit(visit('visitor-0001', tomorrow))).total, 2);
  assert.equal((await store.stats(tomorrow + 90_001)).online, 0);
});

test('bots do not count or enter presence; limit above 30 blocks new daily counts', async () => {
  const store = new MemoryVisitorStore();
  assert.equal((await store.visit(visit('visitor-0001', now, 'Googlebot'))).total, 0);
  assert.equal((await store.stats(now)).online, 0);
  for (let i = 0; i < 31; i++) await store.visit(visit(`visitor-${i.toString().padStart(4, '0')}`));
  const result = await store.stats(now);
  assert.equal(result.total, 30);
  assert.equal(result.countries[0].count, 30);
  assert.equal((await store.visit(visit('visitor-0030', now + 3_600_000))).total, 31);
});

test('heartbeats of an already counted visitor never consume the shared-IP budget', async () => {
  const store = new MemoryVisitorStore();
  const start = Date.parse('2026-11-07T12:00:00Z');
  for (let i = 0; i < 80; i++) await store.visit(visit('visitor-0001', start + i * 45_000));
  for (let i = 2; i <= 30; i++) await store.visit(visit(`visitor-${i}`, start + 3_599_000));
  assert.equal((await store.stats(start + 3_599_000)).total, 30);
  assert.equal((await store.visit(visit('visitor-0031', start + 3_599_001))).total, 30);
});

test('hash-only storage input and environment selection', () => {
  const input = visit();
  assert.match(input.idHash, /^[A-Za-z0-9_-]{12}$/);
  assert.match(input.rateHash, /^[A-Za-z0-9_-]{12}$/);
  const hash = (value) => require('node:crypto').createHash('sha256').update(value).digest().subarray(0, 9).toString('base64url');
  assert.equal(input.idHash, hash('visitor-0001'));
  assert.equal(input.rateHash, hash('192.0.2.1' + core.utcHour(now)));
  assert.equal(JSON.stringify(input).includes('192.0.2.1'), false);
  assert.equal(JSON.stringify(input).includes('visitor-0001'), false);
  assert.equal(createVisitorStore({ NODE_ENV: 'production' }), null);
  assert.ok(createVisitorStore({ NODE_ENV: 'development' }) instanceof MemoryVisitorStore);
  assert.equal(createVisitorStore({ NODE_ENV: 'production', KV_REST_API_URL: 'https://example.com' }), null);
  assert.ok(createVisitorStore({ NODE_ENV: 'production', REDIS_URL: 'redis://unused.invalid' }));
});

test('compact keys and fixed expiries cross UTC day, month and year boundaries', () => {
  assert.deepEqual({ ...visitorKeys(now) }, {
    total: 'v:t', countries: 'v:c', online: 'v:o', day: 'v:d:20261107', rate: 'v:r:2026110723',
  });
  for (const key of Object.values(visitorKeys(now))) assert.ok(key.startsWith('v:'));
  assert.deepEqual({ ...visitorExpiry(now) }, {
    day: Date.parse('2026-11-08T01:00:00Z') / 1000,
    rate: Date.parse('2026-11-08T00:01:00Z') / 1000,
  });
  const end = Date.parse('2026-12-31T23:59:59.999Z');
  assert.equal(visitorExpiry(end).day, Date.parse('2027-01-01T01:00:00Z') / 1000);
  assert.equal(visitorExpiry(end).rate, Date.parse('2027-01-01T00:01:00Z') / 1000);
});

test('rate-limited IDs stay excluded that day; a new hour admits fresh IDs', async () => {
  const store = new MemoryVisitorStore();
  const start = Date.parse('2026-11-07T12:00:00Z');
  for (let i = 0; i < 31; i++) await store.visit(visit(`visitor-${i}`, start));
  assert.equal((await store.visit(visit('visitor-30', start + 3_600_000))).total, 30);
  assert.equal((await store.visit(visit('visitor-fresh', start + 3_600_001))).total, 31);
  assert.equal((await store.visit(visit('visitor-30', start + 86_400_000))).total, 32);
});

test('daily cap blocks new membership and counts, permits heartbeats and resets next day', async () => {
  const store = new MemoryVisitorStore({ daily: 2 });
  await store.visit(visit('visitor-0001'));
  await store.visit(visit('visitor-0002'));
  assert.equal((await store.visit(visit('visitor-0003'))).total, 2);
  assert.equal(store.seen.get(visitorKeys(now).day).members.size, 2, 'Storage itself stays capped');
  assert.equal((await store.visit(visit('visitor-0001', now + 30_000))).total, 2);
  assert.equal((await store.visit(visit('visitor-0003', now + 60_000))).total, 3);
});

test('rate-field cap rejects new IPs but admits existing fields and resets next hour', async () => {
  const store = new MemoryVisitorStore({ rateFields: 1 });
  const start = Date.parse('2026-11-07T12:00:00Z');
  await store.visit(visit('visitor-0001', start));
  assert.equal((await store.visit(visit('visitor-0002', start, 'Mozilla', '192.0.2.2'))).total, 1);
  assert.equal(store.rates.get(visitorKeys(start).rate).fields.size, 1, 'Rejected IP does not create a field');
  assert.equal((await store.visit(visit('visitor-0003', start))).total, 2);
  assert.equal((await store.visit(visit('visitor-0004', start + 3_600_000, 'Mozilla', '192.0.2.2'))).total, 3);
  assert.equal((await store.visit(visit('visitor-0002', start + 3_600_001, 'Mozilla', '192.0.2.2'))).total, 3);
});

test('online cap permits refresh, prunes before admission, and does not cap total counts', async () => {
  const store = new MemoryVisitorStore({ online: 1 });
  await store.visit(visit('visitor-0001'));
  const blocked = await store.visit(visit('visitor-0002'));
  assert.equal(blocked.total, 2);
  assert.equal(blocked.online, 1);
  await store.visit(visit('visitor-0001', now + 30_000));
  assert.equal((await store.stats(now + 120_000)).online, 1, 'Exactly 90 seconds old is still online');
  assert.equal((await store.visit(visit('visitor-0002', now + 120_001))).online, 1);
  assert.equal((await store.visit(visit('visitor-bot', now + 210_002, 'Googlebot'))).online, 0);
});

test('memory buckets expire at fixed UTC deadlines without heartbeat extensions', async () => {
  const store = new MemoryVisitorStore();
  await store.visit(visit());
  await store.visit(visit('visitor-0002', now + 60_000));
  assert.equal(store.seen.size, 2);
  assert.equal(store.rates.size, 2);
  assert.equal(store.seen.get(visitorKeys(now).day).expires, visitorExpiry(now).day * 1000);
  assert.equal(store.rates.get(visitorKeys(now).rate).expires, visitorExpiry(now).rate * 1000);
  await store.stats(visitorExpiry(now).rate * 1000);
  assert.equal(store.rates.size, 1);
  await store.stats(visitorExpiry(now).day * 1000);
  assert.equal(store.seen.size, 1);
  assert.equal(store.rates.size, 1);
  await store.stats(visitorExpiry(now).day * 1000 + 60_000);
  assert.equal(store.rates.size, 0);
});

const flush = () => new Promise((resolve) => setImmediate(resolve));
function redisHarness({ connect, evaluate, timers } = {}) {
  const calls = [];
  const warnings = [];
  const events = new Map();
  const client = {
    isOpen: false, isReady: false,
    on(event, handler) { events.set(event, handler); return this; },
    async connect() {
      calls.push(['connect']);
      this.isOpen = true;
      try { if (connect) await connect(); } catch (error) { this.isOpen = false; throw error; }
      this.isReady = true;
      return this;
    },
    async eval(script, options) {
      calls.push(['eval', script, options]);
      return evaluate ? evaluate() : ['2', 1, ['VN', '2']];
    },
    destroy() { calls.push(['destroy']); this.isOpen = false; this.isReady = false; },
  };
  const env = { NODE_ENV: 'production', REDIS_URL: 'redis://unused.invalid' };
  const load = createLoader({ env, timers, warnings, redis(options) {
    calls.push(['create', options]);
    assert.ok(!client.isOpen);
    return client;
  } });
  return { load, calls, client, events, warnings, env };
}

test('Redis is lazy, concurrent calls share one connect, EVAL uses compact keys and string arguments', async () => {
  let finishConnect;
  const harness = redisHarness({ connect: () => new Promise((resolve) => { finishConnect = resolve; }) });
  const { createVisitorStore } = harness.load('lib/visitors/store.ts');
  const first = createVisitorStore(harness.env);
  const second = createVisitorStore(harness.env);
  assert.equal(harness.calls.length, 0);
  const requests = [first.visit(visit()), second.visit(visit('visitor-0002'))];
  await flush();
  assert.equal(harness.calls.filter(([name]) => name === 'connect').length, 1);
  assert.equal(typeof harness.events.get('error'), 'function');
  finishConnect();
  const results = await Promise.all(requests);
  assert.equal(results[0].total, 2);
  assert.equal(results[0].countries[0].count, 2);
  const evaluations = harness.calls.filter(([name]) => name === 'eval');
  assert.equal(evaluations.length, 2);
  for (const [, , options] of evaluations) {
    assert.ok(options.keys.every((key) => key.startsWith('v:')));
    assert.ok(options.arguments.every((value) => typeof value === 'string'));
    assert.ok(options.arguments.includes(String(visitorExpiry(now).day)));
    assert.ok(options.arguments.includes(String(visitorExpiry(now).rate)));
  }
  const options = harness.calls.find(([name]) => name === 'create')[1];
  assert.equal(options.disableOfflineQueue, true);
  assert.ok(options.socket.connectTimeout >= 3000 && options.socket.connectTimeout <= 5000);
  assert.equal(options.socket.reconnectStrategy(100, new Error('offline')), false);
  harness.events.get('error')(new Error(harness.env.REDIS_URL));
  assert.equal(harness.warnings.length, 1);
  assert.equal(harness.warnings[0].includes(harness.env.REDIS_URL), false);
});

test('GET and bot POST share one pruning-only Redis script', async () => {
  const harness = redisHarness();
  const store = harness.load('lib/visitors/store.ts').createVisitorStore(harness.env);
  await store.stats(now);
  await store.visit(visit('visitor-bot', now, 'Googlebot'));
  const evaluations = harness.calls.filter(([name]) => name === 'eval');
  assert.equal(evaluations.length, 2);
  assert.equal(evaluations[0][1], evaluations[1][1]);
  const commands = [...evaluations[0][1].matchAll(/redis.call\('([A-Z]+)'/g)].map((match) => match[1]);
  assert.deepEqual(commands, ['ZREMRANGEBYSCORE', 'GET', 'ZCARD', 'HGETALL']);
});

test('failed shared connect returns unavailable and the next request can reconnect', async () => {
  let offline = true;
  const harness = redisHarness({ connect: async () => { if (offline) throw new Error('offline'); } });
  const { GET } = harness.load('app/api/visitors/route.ts');
  const request = () => GET(new Request('http://localhost/api/visitors'));
  const failures = await Promise.all([request(), request()]);
  for (const failure of failures) {
    assert.equal(failure.status, 503);
    assert.deepEqual(await failure.json(), { configured: true, error: 'unavailable' });
  }
  assert.equal(harness.calls.filter(([name]) => name === 'connect').length, 1);
  offline = false;
  const success = await request();
  assert.equal(success.status, 200);
  assert.equal((await success.json()).total, 2);
  assert.equal(harness.calls.filter(([name]) => name === 'create').length, 1);
  assert.equal(harness.calls.filter(([name]) => name === 'connect').length, 2);
});

test('production without configuration returns 503 configured:false for GET and POST', async () => {
  const { GET, POST } = createLoader({ env: { NODE_ENV: 'production' } })('app/api/visitors/route.ts');
  for (const response of [await GET(new Request('http://localhost/api/visitors')), await POST(new Request('http://localhost/api/visitors', {
    method: 'POST', body: JSON.stringify({ id: 'visitor-0001' }),
  }))]) {
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { configured: false });
  }
});

test('connection and command stalls time out, destroy the socket, and return configured unavailable', async () => {
  for (const stage of ['connect', 'evaluate']) {
    const pending = new Map();
    const timers = {
      setTimeout(callback, delay) { const id = {}; pending.set(id, { callback, delay }); return id; },
      clearTimeout(id) { pending.delete(id); },
    };
    const harness = redisHarness({ timers, [stage]: () => new Promise(() => {}) });
    const { GET, POST } = harness.load('app/api/visitors/route.ts');
    const responsePromise = stage === 'connect'
      ? GET(new Request('http://localhost/api/visitors'))
      : POST(new Request('http://localhost/api/visitors', { method: 'POST', body: JSON.stringify({ id: 'visitor-0001' }) }));
    await flush();
    assert.equal(pending.size, 1);
    const { callback, delay } = pending.values().next().value;
    assert.ok(delay > 0 && delay <= 4500);
    callback();
    const response = await responsePromise;
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { configured: true, error: 'unavailable' });
    assert.equal(harness.client.isOpen, false);
    assert.equal(harness.calls.filter(([name]) => name === 'destroy').length, 1);
    assert.equal(pending.size, 0);
  }
});

test('route rejects malformed requests and returns uncached real stats without counting GETs', async () => {
  const { GET, POST } = load('app/api/visitors/route.ts');
  const get = () => GET(new Request('http://localhost/api/visitors', { headers: { 'x-vercel-ip-country': 'vn' } }));
  assert.equal((await (await get()).json()).total, 0);
  for (const body of ['null', '{}', '{', '{"id":"invalid_visitor"}']) {
    const result = await POST(new Request('http://localhost/api/visitors', { method: 'POST', body }));
    assert.equal(result.status, 400);
    assert.equal(result.headers.get('cache-control'), 'no-store');
  }
  const post = (agent = 'Mozilla/5.0') => POST(new Request('http://localhost/api/visitors', {
    method: 'POST', body: JSON.stringify({ id: 'visitor-route-0001' }),
    headers: { 'x-vercel-ip-country': 'vn', 'user-agent': agent, 'x-forwarded-for': '192.0.2.10, 192.0.2.20' },
  }));
  const bot = await post('Googlebot');
  assert.equal((await bot.json()).total, 0);
  const response = await post();
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { configured: true, total: 1, online: 1, countries: [{ code: 'VN', count: 1 }], you: 'VN' });
  await post();
  assert.equal((await (await get()).json()).total, 1);
});

test('two hook consumers share one poller, pause while hidden and recover after errors without storage', async () => {
  const exports = {};
  const document = new EventTarget();
  document.visibilityState = 'visible';
  const intervals = new Map();
  let sequence = 0;
  let fail = false;
  const ids = [];
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../components/visitors/useVisitors.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, document, AbortController, crypto: require('node:crypto').webcrypto,
    localStorage: { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } },
    setTimeout: () => 0, clearTimeout() {},
    setInterval: (callback, delay) => { assert.equal(delay, 45_000); intervals.set(++sequence, callback); return sequence; },
    clearInterval: (id) => intervals.delete(id),
    fetch: async (_url, options) => {
      ids.push(JSON.parse(options.body).id);
      if (fail) throw new Error('Offline');
      return Response.json({ configured: true, total: 1, online: 1, you: 'XX', countries: [] });
    },
    require: (name) => name === 'react' ? { useSyncExternalStore: (subscribe, getSnapshot) => ({ subscribe, getSnapshot }) } : core,
  });
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  const first = exports.useVisitors();
  const second = exports.useVisitors();
  const stopFirst = first.subscribe(() => {});
  const stopSecond = second.subscribe(() => {});
  await flush();
  assert.equal(ids.length, 1);
  assert.equal(intervals.size, 1);
  assert.equal(first.getSnapshot().total, 1);
  document.visibilityState = 'hidden';
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(intervals.size, 0);
  assert.equal(ids.length, 1);
  document.visibilityState = 'visible';
  document.dispatchEvent(new Event('visibilitychange'));
  await flush();
  assert.equal(ids.length, 2, 'Returning to the visible tab posts immediately');
  fail = true;
  intervals.values().next().value();
  await flush();
  assert.equal(first.getSnapshot(), null, 'Network failure hides the chip');
  fail = false;
  intervals.values().next().value();
  await flush();
  assert.equal(first.getSnapshot().online, 1);
  assert.equal(new Set(ids).size, 1, 'Blocked storage still preserves a session UUID');
  assert.ok(core.validVisitorId(ids[0]));
  stopFirst();
  assert.equal(intervals.size, 1);
  stopSecond();
  assert.equal(intervals.size, 0);
});
