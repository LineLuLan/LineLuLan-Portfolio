// Intent: prove Line's photo stories, modal focus and fixed desktop screen budget.
// Status: regression gate. Next: run against PORTFOLIO_TEST_URL. Blockers: local server required.
// Confidence: real browser assertions, including server HTML and mobile flow.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3018';
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('line.motion', 'off'));
  await page.goto(`${base}/#experience`);
  await page.getByRole('dialog', { name: 'Loading' }).waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
  const tabs = page.getByRole('tablist', { name: 'Organizations' }).getByRole('tab');
  assert.equal(await page.locator('.experience-highlight').count(), 5);
  for (const [width, height] of [[1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    for (const tab of await tabs.all()) {
      await tab.click();
      for (const image of await page.getByRole('tabpanel').locator('.experience-photo-button img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((element) => element.decode());
      }
      const sizes = await page.locator('#experience').evaluate((section) => {
        const panel = section.querySelector('[role="tabpanel"]:not([hidden])');
        return { name: panel.id, height: section.getBoundingClientRect().height,
          budget: innerHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')),
          panel: panel.clientHeight, scroll: panel.scrollHeight };
      });
      assert.ok(Math.abs(sizes.height - sizes.budget) <= 1, JSON.stringify(sizes));
      if (sizes.name.endsWith('twohearts')) assert.ok(sizes.scroll > sizes.panel);
      console.log(`${width}x${height}: ${JSON.stringify(sizes)}`);
    }
  }
  await tabs.first().click();
  const panel = page.getByRole('tabpanel');
  assert.equal(await panel.getAttribute('data-scroll-bottom'), 'true');
  assert.equal(await panel.getAttribute('data-scroll-top'), 'false');
  await panel.focus();
  await page.keyboard.press('PageDown');
  await page.waitForFunction(() => document.querySelector('[role="tabpanel"]:not([hidden])').scrollTop > 0);
  await page.waitForFunction(() => document.querySelector('[role="tabpanel"]:not([hidden])').dataset.scrollTop === 'true');
  await tabs.nth(1).click();
  await tabs.first().click();
  assert.equal(await panel.evaluate((element) => element.scrollTop), 0);
  const photo = panel.locator('.experience-photo-button').first();
  await photo.click();
  const dialog = page.getByRole('dialog', { name: 'Photos: KFC F&B Track Winner · Agentic AI Build Week' });
  await dialog.waitFor();
  assert.equal(await dialog.getAttribute('aria-modal'), 'true');
  await page.keyboard.press('ArrowRight');
  assert.equal(await dialog.locator('img').getAttribute('alt'), 'Line holding the KFC F&B Track Winner board at Galaxy Innovation Hub');
  await page.keyboard.press('ArrowLeft');
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press(i % 2 ? 'Shift+Tab' : 'Tab');
    assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)));
  }
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  assert.ok(await photo.evaluate((element) => element === document.activeElement));
  await photo.click();
  await page.mouse.click(2, 2);
  await dialog.waitFor({ state: 'detached' });

  for (const id of ['agentic-build-week', 'iu-ai-2025', 'gdgoc-vicelead']) {
    const node = page.locator(`[data-milestone="${id}"]`);
    await page.keyboard.press('Tab');
    await node.locator('.career-node').focus();
    const thumb = node.locator('.career-detail .experience-photo-button');
    await thumb.waitFor({ state: 'visible' });
    const bounds = await thumb.boundingBox();
    assert.ok(Math.abs(bounds.width / bounds.height - 16 / 9) < 0.03);
    await thumb.click();
    await page.getByRole('dialog', { name: /^Photos:/ }).waitFor();
    await page.keyboard.press('Escape');
    assert.ok(await thumb.evaluate((element) => element === document.activeElement));
    assert.equal(await node.locator('.career-detail').count(), 1);
    for (const close of ['button', 'backdrop']) {
      await thumb.click();
      const modal = page.getByRole('dialog', { name: /^Photos:/ });
      await modal.waitFor();
      if (close === 'button') await modal.getByRole('button', { name: 'Close photos' }).click();
      else await page.mouse.click(2, 2);
      await modal.waitFor({ state: 'detached' });
      assert.ok(await thumb.evaluate((element) => element === document.activeElement));
    }
    await page.keyboard.press('Escape');
    assert.equal(await node.locator('.career-detail').count(), 0);
  }
  for (const width of [...new Set([...Array.from({ length: 85 }, (_, i) => 320 + i * 20), 1023, 1024])]) {
    await page.setViewportSize({ width, height: 900 });
    for (const index of [0, 3, 4]) {
      await tabs.nth(index).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}, tab ${index}`);
      if (width < 1024) assert.ok(await panel.evaluate((element) => element.scrollHeight <= element.clientHeight + 1));
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await tabs.first().click();
  for (const mode of ['light', 'dark']) {
    for (const accent of ['kafka', 'nebula', 'aurora', 'mars', 'rose']) {
      await page.evaluate(({ mode, accent }) => Object.assign(document.documentElement.dataset, { mode, accent }), { mode, accent });
      await photo.click();
      const modal = page.getByRole('dialog', { name: /^Photos:/ });
      await modal.waitFor();
      const styles = await modal.evaluate((element) => {
        const image = element.querySelector('img').getBoundingClientRect();
        return { animation: getComputedStyle(element.firstElementChild).animationName, width: image.width, height: image.height,
          vw: innerWidth, vh: innerHeight, color: getComputedStyle(element).color };
      });
      assert.equal(styles.animation, 'none');
      assert.ok(styles.width <= styles.vw * 0.9 && styles.height <= styles.vh * 0.85);
      assert.ok(styles.color);
      await page.keyboard.press('Escape');
    }
  }
  await page.evaluate(() => {
    localStorage.setItem('line.motion', 'on');
    window.dispatchEvent(new StorageEvent('storage', { key: 'line.motion', newValue: 'on', storageArea: localStorage }));
  });
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'on');
  await photo.click();
  assert.equal(await page.locator('.experience-lightbox-content').evaluate((element) => getComputedStyle(element).animationName), 'experience-photo-enter');
  await page.keyboard.press('Escape');
  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(`${base}/#experience`);
  await reduced.locator('.boot-splash').waitFor({ state: 'detached' });
  await reduced.waitForFunction(() => document.querySelector('.experience-panel')?.hasAttribute('data-scroll-bottom'));
  await reduced.locator('.experience-panel:not([hidden]) .experience-photo-button').first().click();
  assert.equal(await reduced.locator('.experience-lightbox-content').evaluate((element) => getComputedStyle(element).animationName), 'none');
  await reduced.close();
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(base);
  assert.equal(await noJS.locator('.experience-highlight').count(), 5);
  assert.equal(await noJS.locator('.experience-photo-button img').count(), 4);
  assert.ok((await noJS.locator('.experience-summary').textContent()).includes('Customer Intelligence.'));
  for (const image of await noJS.locator('.experience-photo-button img').all()) {
    assert.ok(await image.getAttribute('alt'));
    assert.ok(await image.getAttribute('width'));
    assert.ok(await image.getAttribute('height'));
    assert.ok(await image.getAttribute('sizes'));
  }
  assert.equal(await noJS.locator('.experience-photo-caption').count(), 4);
  assert.deepEqual(errors, []);
  console.log('PASS: stories/SSR, all desktop tabs, keyboard scrolling/reset, modal navigation/focus/Escape/backdrop, Record photos, 320–2000px overflow and mobile flow.');
} finally { await browser.close(); }
