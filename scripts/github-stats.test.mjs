// Intent: prove GitHub URL, response and cached fetch behavior without network calls.
// Status: regression gate. Next: run with build verification. Blockers: none. Confidence: deterministic API cases.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function load(fetch = () => { throw new Error('Unexpected fetch'); }, token) {
  const exports = {};
  const timeouts = [];
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../lib/github-stats.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, fetch, URL,
    process: { env: { GITHUB_TOKEN: token } },
    AbortSignal: { timeout: (ms) => { timeouts.push(ms); return AbortSignal.timeout(ms); } },
    require: (name) => { assert.equal(name, 'server-only'); return {}; },
  });
  return { ...exports, timeouts };
}

const repo = 'https://github.com/LineLuLan/line-harness';

test('parses only a two-segment HTTPS GitHub repository URL', () => {
  const { parseGithubRepoUrl } = load();
  for (const url of [repo, `${repo}/`, `${repo}.git`, `${repo}.git/`]) {
    assert.equal(parseGithubRepoUrl(url), 'LineLuLan/line-harness');
  }
  for (const url of ['https://gitlab.com/LineLuLan/line-harness', 'http://github.com/LineLuLan/line-harness',
    'https://github.com/LineLuLan', `${repo}/tree/main`, 'not a URL', 'https://github.com/a/.git']) {
    assert.equal(parseGithubRepoUrl(url), null);
  }
});

test('accepts only a nonnegative safe integer star count', () => {
  const { normalizeRepoStars } = load();
  assert.equal(normalizeRepoStars({ stargazers_count: 6 }), 6);
  assert.equal(normalizeRepoStars({ stargazers_count: 0 }), 0);
  for (const value of [null, {}, { stargazers_count: '6' }, { stargazers_count: -1 },
    { stargazers_count: 1.5 }, { stargazers_count: NaN }, { stargazers_count: Number.MAX_SAFE_INTEGER + 1 }]) {
    assert.equal(normalizeRepoStars(value), null);
  }
});

test('fetches GitHub REST with six-hour ISR, timeout and optional authorization', async () => {
  for (const token of [undefined, 'test-token']) {
    const calls = [];
    const { getRepoStars, timeouts } = load(async (url, options) => {
      calls.push({ url, options });
      return { ok: true, json: async () => ({ stargazers_count: 6 }) };
    }, token);
    assert.equal(await getRepoStars(`${repo}.git/`), 6);
    assert.deepEqual(timeouts, [5000]);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.github.com/repos/LineLuLan/line-harness');
    assert.equal(calls[0].options.next.revalidate, 21600);
    assert.equal(calls[0].options.headers.Accept, 'application/vnd.github+json');
    assert.equal(calls[0].options.headers['X-GitHub-Api-Version'], '2022-11-28');
    assert.equal(calls[0].options.headers.Authorization, token ? `Bearer ${token}` : undefined);
    assert.ok(calls[0].options.signal instanceof AbortSignal);
  }
});

test('invalid URLs, HTTP errors, malformed JSON and network failures resolve to null', async () => {
  const { getRepoStars } = load();
  assert.equal(await getRepoStars('https://example.com/a/b'), null);
  for (const fetch of [
    async () => { throw new Error('Timeout'); },
    async () => ({ ok: false, json: async () => ({ stargazers_count: 6 }) }),
    async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } }),
    async () => ({ ok: true, json: async () => ({ stargazers_count: '6' }) }),
  ]) {
    assert.equal(await load(fetch).getRepoStars(repo), null);
  }
});
