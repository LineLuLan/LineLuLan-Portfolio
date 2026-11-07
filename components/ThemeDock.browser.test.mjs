// Run against a built localhost server: node components/ThemeDock.browser.test.mjs
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3000';
const origin = new URL(base).origin;
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname), 'Use a localhost preview.');
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    for (const stored of [null, 'on', 'off', 'invalid', 'denied']) {
      const preference = await browser.newPage({ reducedMotion });
      await preference.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      preference.on('pageerror', (error) => errors.push(error.message));
      await preference.addInitScript((value) => {
        if (value === 'denied') {
          Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } });
        } else if (value !== null) localStorage.setItem('line.motion', value);
      }, stored);
      await preference.goto(base);
      await preference.locator('.boot-splash').waitFor({ state: 'detached' });
      const explicit = stored === 'on' || stored === 'off';
      const expected = { motion: explicit ? stored : 'on', source: explicit ? 'user' : 'default' };
      const motionState = () => preference.evaluate(() => ({ motion: document.documentElement.dataset.motion, source: document.documentElement.dataset.motionSource }));
      assert.deepEqual(await motionState(), expected, `${reducedMotion}, storage ${stored}`);
      await preference.getByRole('button', { name: /^Appearance, current/ }).click();
      assert.equal(await preference.getByRole('switch', { name: /Motion/ }).getAttribute('aria-checked'), String(expected.motion === 'on'));
      await preference.emulateMedia({ reducedMotion: reducedMotion === 'reduce' ? 'no-preference' : 'reduce' });
      await preference.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.deepEqual(await motionState(), expected, 'OS changes must preserve effective motion.');
      await preference.getByRole('switch', { name: /Motion/ }).click();
      const toggled = expected.motion === 'on' ? 'off' : 'on';
      await preference.waitForFunction((value) => document.documentElement.dataset.motion === value && document.documentElement.dataset.motionSource === 'user', toggled);
      if (stored !== 'denied') assert.equal(await preference.evaluate(() => localStorage.getItem('line.motion')), toggled);
      await preference.close();
    }
  }
  console.log('PASS: default/user motion matrix, denied storage, OS-change immunity and manual toggles.');

  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  const reader = await context.newPage();
  reader.on('pageerror', (error) => errors.push(error.message));
  await reader.goto(base);
  await reader.locator('.boot-splash').waitFor({ state: 'detached' });
  const writer = await context.newPage();
  await writer.goto(base);
  for (const value of ['off', 'on', 'invalid', 'off', null, 'off', 'clear']) {
    await writer.evaluate((next) => {
      if (next === 'clear') localStorage.clear();
      else if (next === null) localStorage.removeItem('line.motion');
      else localStorage.setItem('line.motion', next);
    }, value);
    const explicit = value === 'on' || value === 'off';
    await reader.waitForFunction(({ motion, source }) => document.documentElement.dataset.motion === motion && document.documentElement.dataset.motionSource === source,
      { motion: explicit ? value : 'on', source: explicit ? 'user' : 'default' });
  }
  await reader.getByRole('button', { name: /^Appearance, current/ }).click();
  await reader.getByRole('switch', { name: /Motion/ }).click();
  await reader.reload();
  await reader.locator('.boot-splash').waitFor({ state: 'detached' });
  assert.equal(await reader.locator('html').getAttribute('data-motion'), 'off');
  assert.equal(await reader.locator('html').getAttribute('data-motion-source'), 'user');
  await context.close();
  console.log('PASS: cross-tab motion updates, invalid/removal/clear defaults and reload persistence.');

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
