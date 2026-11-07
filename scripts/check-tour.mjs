// Intent: exercise Line's complete tour, header alignment and modal behavior in a real browser.
// Status: acceptance gate. Next: run against local preview. Blockers: preview required. Confidence: DOM assertions.
// Start a preview on 3017, or supply BASE_URL; this script does not start/stop servers.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://localhost:3017';
const origin = new URL(base).origin;
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname), 'Use a local preview.');
const browser = await chromium.launch({ headless: true });
const errors = [];
const targets = ['hero', 'about', 'experience', 'stack', 'work', 'framework', 'record', 'contact', null];

async function ready(page) {
  await page.locator('.boot-splash').waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('[data-reveal-state]'));
}

async function checkStep(page, index) {
  const card = page.locator(`[data-tour-step="${index + 1}"]`);
  await card.waitFor({ state: 'visible' });
  const target = targets[index];
  if (target) {
    await page.waitForFunction((id) => {
      const section = document.getElementById(id).getBoundingClientRect();
      const header = document.querySelector('[data-site-header]').getBoundingClientRect();
      return Math.abs(section.top - header.bottom) <= 2;
    }, target);
  }
  const geometry = await card.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom,
      width: innerWidth, height: innerHeight,
      headerBottom: document.querySelector('[data-site-header]').getBoundingClientRect().bottom };
  });
  assert.ok(geometry.left >= 0 && geometry.right <= geometry.width + 1 && geometry.top >= geometry.headerBottom - 1 && geometry.bottom <= geometry.height + 1,
    `Step ${index + 1}: card must fit below header: ${JSON.stringify(geometry)}`);
  assert.equal(await card.locator('.tour-counter').textContent(), `${index + 1} / 9`);
  assert.equal(await page.locator('main').evaluate((element) => !!element.closest('[inert]')), true);
  assert.equal(await page.locator('[data-site-header]').evaluate((element) => !!element.closest('[inert]')), true);
  return card;
}

async function checkFocusReturned(page, trigger) {
  await page.locator('[data-tour-root]').waitFor({ state: 'detached' });
  await page.waitForFunction((selector) => document.activeElement === document.querySelector(selector), trigger);
  assert.equal(await page.locator('main').evaluate((element) => !!element.closest('[inert]')), false);
}

async function checkSpotlight(page, id) {
  await page.waitForFunction((target) => {
    const section = document.getElementById(target).getBoundingClientRect();
    const header = document.querySelector('[data-site-header]').getBoundingClientRect();
    const spot = document.querySelector('.tour-spotlight').getBoundingClientRect();
    const top = Math.max(header.bottom, Math.min(innerHeight, section.top));
    const height = Math.max(0, Math.min(innerHeight, section.bottom) - top);
    return Math.abs(spot.top - top) <= 2 && Math.abs(spot.height - height) <= 2;
  }, id);
}

try {
  for (const { viewport, motion } of [
    { viewport: { width: 1440, height: 900 }, motion: 'on' },
    { viewport: { width: 1440, height: 900 }, motion: 'off' },
    { viewport: { width: 390, height: 844 }, motion: 'off' },
  ]) {
    const page = await browser.newPage({ viewport });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    await page.route('**/api/visitors', (route) => route.abort());
    await page.addInitScript((value) => localStorage.setItem('line.motion', value), motion);
    await page.goto(base);
    await ready(page);
    const mobile = viewport.width < 440;
    const trigger = `[data-tour-trigger="${mobile ? 'mobile' : 'avatar'}"]`;
    if (mobile) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    else {
      await page.locator(trigger).focus();
      assert.equal(await page.locator('.tour-tooltip').evaluate((element) => getComputedStyle(element).opacity), '1');
    }
    await page.locator(trigger).click();
    for (let index = 0; index < targets.length; index++) {
      const card = await checkStep(page, index);
      if (targets[index]) await checkSpotlight(page, targets[index]);
      if (index === 0) assert.equal(await card.evaluate((element) => document.activeElement === element), true);
      else assert.equal(await card.getByRole('button', { name: index === 8 ? 'Finish' : 'Next', exact: true }).evaluate((element) => document.activeElement === element), true);
      if (motion === 'off') {
        assert.equal(await card.evaluate((element) => getComputedStyle(element).animationName), 'none');
      }
      await card.getByRole('button', { name: index === 8 ? 'Finish' : 'Next', exact: true }).click();
    }
    await checkFocusReturned(page, trigger);

    await page.locator(trigger).click();
    await checkStep(page, 0);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.getByRole('button', { name: 'Next', exact: true }).evaluate((element) => document.activeElement === element), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.getByRole('button', { name: 'Skip tour', exact: true }).evaluate((element) => document.activeElement === element), true);
    await page.keyboard.press('ArrowRight');
    await checkStep(page, 1);
    await page.keyboard.press('ArrowLeft');
    await checkStep(page, 0);
    assert.equal(await page.getByRole('button', { name: 'Next', exact: true }).evaluate((element) => document.activeElement === element), true);
    await page.keyboard.press('Escape');
    await checkFocusReturned(page, trigger);

    // Shared header entry from a different page consumes only the tour query.
    await page.goto(`${base}/transcript`);
    await page.locator('.boot-splash').waitFor({ state: 'detached' });
    if (mobile) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator(trigger).click();
    await checkStep(page, 0);
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(new URL(page.url()).searchParams.has('tour'), false);
    await page.getByRole('button', { name: 'Skip tour' }).click();
    await checkFocusReturned(page, trigger);
    console.log(`PASS: nine steps, geometry, focus trap/return, keys and cross-route entry at ${viewport.width}x${viewport.height}, motion ${motion}.`);
    await page.close();
  }
  // Resize across the trigger breakpoint while the original opener is inert.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  await page.route('**/api/visitors', (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem('line.motion', 'off'));
  await page.goto(base);
  await ready(page);
  await page.evaluate(() => {
    const existing = document.createElement('div');
    existing.id = 'test-existing-inert';
    existing.inert = true;
    document.body.append(existing);
  });
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('[data-tour-trigger="mobile"]').click();
  await checkStep(page, 0);
  await page.evaluate(() => {
    const late = document.createElement('div');
    late.id = 'test-late-sibling';
    document.body.append(late);
    window.scrollBy({ top: 140, behavior: 'instant' });
  });
  await page.waitForFunction(() => document.getElementById('test-late-sibling').inert);
  await checkSpotlight(page, 'hero');
  await page.setViewportSize({ width: 1440, height: 900 });
  await checkSpotlight(page, 'hero');
  await page.keyboard.press('Escape');
  await checkFocusReturned(page, '[data-tour-trigger="avatar"]');
  assert.equal(await page.locator('#test-existing-inert').evaluate((element) => element.inert), true);
  assert.equal(await page.locator('#test-late-sibling').evaluate((element) => element.inert), false);
  await page.locator('[data-tour-trigger="avatar"]').click();
  await checkStep(page, 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.keyboard.press('Escape');
  await checkFocusReturned(page, '[data-tour-trigger="mobile"]');
  await page.goto(`${base}/?keep=1&tour=1#contact`);
  await checkStep(page, 0);
  assert.equal(new URL(page.url()).search, '?keep=1');
  assert.equal(new URL(page.url()).hash, '#contact');
  await page.keyboard.press('Escape');
  await checkFocusReturned(page, '[data-tour-trigger="mobile"]');
  console.log('PASS: responsive focus return, scroll/resize spotlight, inert restoration and direct-query startup.');
  await page.close();
  assert.deepEqual(errors, [], 'No browser runtime errors.');
} finally {
  await browser.close();
}
