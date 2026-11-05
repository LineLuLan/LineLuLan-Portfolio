// Intent: prove Line's milestone interactions, responsive budgets and Contact clipboard feedback.
// Status: acceptance coverage. Next: run against local dev server. Blockers: server required. Confidence: browser assertions.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => { if (!localStorage.getItem('line.motion')) localStorage.setItem('line.motion', 'off'); });
  await page.goto('http://127.0.0.1:3000/#record');
  await page.locator('.career-node').first().waitFor();
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'off');
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('.career-node').count(), 20);
  for (const id of ['record', 'contact']) {
    const sizes = await page.locator(`#${id}`).evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const content = element.firstElementChild.getBoundingClientRect();
      return { height: rect.height, content: content.height, topGap: content.top - rect.top, bottomGap: rect.bottom - content.bottom, budget: innerHeight - document.querySelector('[data-site-header]').getBoundingClientRect().height };
    });
    assert.ok(sizes.content <= 740, `${id}: ${JSON.stringify(sizes)}`);
    assert.ok(sizes.height <= sizes.budget + 1, `${id}: ${JSON.stringify(sizes)}`);
    if (id === 'contact') assert.ok(Math.abs(sizes.topGap - sizes.bottomGap) <= 2, JSON.stringify(sizes));
    console.log(`${id}: ${JSON.stringify(sizes)}`);
  }
  const labelCollisions = await page.locator('.career-stage').evaluate((stage) => {
    const rect = stage.getBoundingClientRect();
    const labels = [...stage.querySelectorAll('.career-label')].map((label) => label.getBoundingClientRect());
    return labels.flatMap((a, i) => {
      const collisions = labels.slice(i + 1).filter((b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
      return [...collisions, ...(a.top < rect.top || a.bottom > rect.bottom ? [a] : [])].map(() => i);
    });
  });
  assert.deepEqual(labelCollisions, []);
  const first = page.locator('.career-node').first();
  await first.focus();
  await page.waitForFunction(() => document.querySelector('.career-node').getAttribute('aria-expanded') === 'true');
  await page.keyboard.press('Escape');
  assert.equal(await first.getAttribute('aria-expanded'), 'false');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.career-node').nth(1).evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Escape');
  const linkedNode = page.locator('[data-milestone="goibert-preprint"] .career-node');
  await linkedNode.focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.career-detail button').evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.career-detail a').evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Escape');
  await page.mouse.move(0, 0);
  await page.locator('#record').focus();
  await first.hover();
  assert.equal(await first.getAttribute('aria-expanded'), 'true');
  await page.locator('.career-detail').hover();
  assert.equal(await first.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await first.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('#record').evaluate((element) => element === document.activeElement), true);
  await page.locator('#record').scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(tmpdir(), 'line-record-desktop.png') });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(tmpdir(), 'line-contact-desktop.png') });
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.copiedEmail = text; } } }));
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  assert.equal(await page.evaluate(() => window.copiedEmail), 'anhtrannam097@gmail.com');
  await page.getByRole('button', { name: 'Copied', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Copy', exact: true }).waitFor();
  for (const clipboard of ['missing', 'denied']) {
    await page.evaluate((mode) => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'missing' ? undefined : { writeText: async () => { throw new Error('Denied'); } } }), clipboard);
    await page.getByRole('button', { name: 'Copy', exact: true }).click();
    assert.equal(await page.evaluate(() => window.getSelection().toString()), 'anhtrannam097@gmail.com');
    assert.match(await page.locator('#contact [role="status"]').innerText(), /Email selected/);
  }
  const animationNames = await page.locator('.contact-orbit, .contact-saturn, .contact-comet, .career-marker[data-ongoing="true"]').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).animationName));
  assert.ok(animationNames.every((name) => name === 'none'));
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `Page overflows at ${width}px`);
    for (const id of ['record', 'contact']) {
      const outside = await page.locator(`#${id}`).evaluate((section) => [...section.querySelectorAll('.career-label, .career-node, a, input, textarea')].some((element) => { const rect = element.getBoundingClientRect(); return rect.width && (rect.left < -1 || rect.right > innerWidth + 1); }));
      assert.equal(outside, false, `${id} child overflows at ${width}px`);
    }
  }
  const touch = await browser.newPage({ viewport: { width: 320, height: 800 }, hasTouch: true, isMobile: true });
  await touch.addInitScript(() => localStorage.setItem('line.motion', 'off'));
  await touch.goto('http://127.0.0.1:3000/#record');
  const node = touch.locator('.career-node').first();
  await node.tap();
  assert.equal(await node.getAttribute('aria-expanded'), 'true');
  const detail = await touch.locator('.career-detail').boundingBox();
  assert.ok(detail.x >= 0 && detail.x + detail.width <= 320);
  await node.tap();
  assert.equal(await node.getAttribute('aria-expanded'), 'false');
  await touch.screenshot({ path: join(tmpdir(), 'line-record-mobile.png') });
  await touch.close();
  // Test actual server HTML with JavaScript disabled, beyond the unit-level SSR harness.
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto('http://127.0.0.1:3000/');
  assert.equal(await noJS.locator('.career-title').count(), 20);
  assert.ok((await noJS.locator('.career-title').allTextContents()).every((title) => title.length > 0));
  await noJS.close();
  const animated = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await animated.addInitScript(() => { localStorage.setItem('line.motion', 'on'); localStorage.setItem('line.mode', 'dark'); });
  await animated.goto('http://127.0.0.1:3000/#record');
  await animated.waitForFunction(() => document.documentElement.dataset.motion === 'on' && document.documentElement.dataset.mode === 'dark');
  await animated.locator('#record').scrollIntoViewIfNeeded();
  await animated.waitForFunction(() => document.querySelector('.career-road-desktop .career-road-travelled').getAttribute('stroke-dasharray') === '1px 1px');
  assert.notEqual(await animated.locator('.contact-saturn').evaluate((element) => getComputedStyle(element).animationName), 'none');
  assert.equal(await animated.locator('.career-road-travelled').first().evaluate((element) => getComputedStyle(element).stroke), await animated.locator('.career-marker').nth(2).evaluate((element) => getComputedStyle(element).backgroundColor));
  await animated.close();
  assert.deepEqual(errors, []);
  console.log('PASS: Record keyboard/hover/touch, label geometry, Contact centering/copy/fallback, motion on/off, dark tokens, no-JS SSR, 320–1920px overflow.');
} finally {
  await browser.close();
}
