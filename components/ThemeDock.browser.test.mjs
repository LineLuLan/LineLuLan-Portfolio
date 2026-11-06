// Run against a built localhost server: node components/ThemeDock.browser.test.mjs
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3000';
const origin = new URL(base).origin;
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname), 'Use a localhost preview.');
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('line.mode', 'light');
    localStorage.setItem('line.accent', 'kafka');
    localStorage.setItem('line.motion', 'on');
    const start = document.startViewTransition?.bind(document);
    window.__appearanceProbe = { started: 0, completed: 0 };
    if (!start) return;
    // Make the native snapshot/update interval deterministic without replacing its lifecycle.
    document.startViewTransition = (update) => {
      window.__appearanceProbe.started++;
      return start(async () => {
        if (window.__holdAppearance) await new Promise((resolve) => { window.__releaseAppearance = resolve; });
        else await new Promise((resolve) => setTimeout(resolve, 200));
        try { return await update(); }
        finally { window.__appearanceProbe.completed++; }
      });
    };
  });
  await page.goto(base);
  await page.locator('.boot-splash').waitFor({ state: 'detached' });
  assert.equal(await page.evaluate(() => typeof document.startViewTransition), 'function');
  await page.getByRole('button', { name: /^Appearance, current/ }).click();

  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-mode'), 'light', 'Exercise the deferred update interval.');
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  assert.equal(await page.evaluate(() => window.__appearanceProbe.started), 2, 'The second selection must not be ignored.');
  await page.waitForFunction(() => window.__appearanceProbe.completed === 2);
  assert.equal(await page.locator('html').getAttribute('data-mode'), 'light');
  assert.equal(await page.evaluate(() => localStorage.getItem('line.mode')), 'light');

  await page.getByRole('button', { name: 'Accent: Nebula blue', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-accent'), 'kafka', 'Exercise the deferred accent update interval.');
  await page.getByRole('button', { name: 'Accent: Kafka purple', exact: true }).click();
  assert.equal(await page.evaluate(() => window.__appearanceProbe.started), 4);
  await page.waitForFunction(() => window.__appearanceProbe.completed === 4);
  assert.equal(await page.locator('html').getAttribute('data-accent'), 'kafka');
  assert.equal(await page.evaluate(() => localStorage.getItem('line.accent')), 'kafka');
  console.log('PASS: rapid mode and accent choices preserve the latest selection in the DOM and storage.');

  await page.getByRole('switch', { name: /Motion/ }).click();
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'off');
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-mode'), 'dark');
  await page.getByRole('button', { name: 'Accent: Nebula blue', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-accent'), 'nebula');
  assert.equal(await page.evaluate(() => window.__appearanceProbe.started), 4, 'Motion Off must not start a deferred transition.');
  console.log('PASS: Motion Off changes appearance immediately; no uncaught page errors.');

  await page.evaluate(() => { window.__holdAppearance = true; });
  await page.getByRole('switch', { name: /Motion/ }).click();
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-mode'), 'dark');
  await page.waitForFunction(() => typeof window.__releaseAppearance === 'function');
  await page.getByRole('switch', { name: /Motion/ }).click();
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  assert.equal(await page.locator('html').getAttribute('data-mode'), 'dark', 'The newer Motion Off choice is immediate.');
  assert.equal(await page.evaluate(() => window.__appearanceProbe.completed), 4, 'Keep the older update pending through the newer selection.');
  await page.evaluate(() => window.__releaseAppearance());
  await page.waitForFunction(() => window.__appearanceProbe.completed === 5);
  assert.equal(await page.locator('html').getAttribute('data-mode'), 'dark', 'A skipped transition must not overwrite a newer immediate choice.');
  assert.equal(await page.evaluate(() => localStorage.getItem('line.mode')), 'dark');
  assert.equal(await page.evaluate(() => window.__appearanceProbe.started), 5);
  assert.deepEqual(errors, []);
  console.log('PASS: switching Motion Off during a pending update preserves the newer immediate choice.');
} finally {
  await browser.close();
}
