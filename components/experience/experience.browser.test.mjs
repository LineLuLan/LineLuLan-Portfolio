// Intent: verify Line's eight-section integration, employment tabs and responsive screen budgets.
// Status: browser acceptance. Next: run with PORTFOLIO_TEST_URL or port 3000. Blockers: local server required.
// Confidence: executed viewport, keyboard, SSR and gesture assertions.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('line.motion', 'off'));
  await page.goto(`${base}/#experience`);
  await page.getByRole('dialog', { name: 'Loading' }).waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('.orbit-planet-link').count(), 7);
  const nav = page.getByRole('navigation', { name: 'Sections', exact: true });
  assert.deepEqual(await nav.locator('a').allTextContents(), ['About', 'Experience', 'Stack', 'Work', 'Framework', 'Record', 'Contact']);
  const tabs = page.getByRole('tablist', { name: 'Organizations' });
  assert.equal(await tabs.getAttribute('aria-orientation'), 'vertical');
  assert.equal(await tabs.getByRole('tab').count(), 6);
  assert.equal(await tabs.locator('[tabindex="0"]').count(), 1);
  const first = tabs.getByRole('tab').first();
  await first.focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await tabs.getByRole('tab').nth(1).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End');
  assert.equal(await tabs.getByRole('tab').last().getAttribute('aria-selected'), 'true');
  await page.keyboard.press('ArrowDown');
  assert.equal(await first.getAttribute('aria-selected'), 'true');
  await tabs.getByRole('tab', { name: /GDGoC/ }).click();
  assert.deepEqual(await page.getByRole('tabpanel').locator('.experience-role > h4').allTextContents(), ['Advisor', 'Vice Lead', 'Member']);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute('role')), 'tabpanel');

  for (const [width, height] of [[1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    for (const id of ['experience', 'framework']) {
      const box = await page.locator(`#${id}`).evaluate((element) => ({
        content: element.firstElementChild.getBoundingClientRect().height,
        section: element.getBoundingClientRect().height,
        budget: innerHeight - document.querySelector('[data-site-header]').getBoundingClientRect().height,
      }));
      assert.ok(box.section <= box.budget + 1, `${id} exceeds screen: ${JSON.stringify(box)}`);
      if (width === 1440 && id === 'framework') assert.ok(box.content <= 740, `${id} exceeds 740px: ${box.content}`);
      if (id === 'framework') assert.ok(box.content >= box.budget * 0.7, `Framework underfills: ${JSON.stringify(box)}`);
      console.log(`${width}x${height} ${id}: ${box.content.toFixed(1)}px content / ${box.budget}px screen`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const tab of await tabs.getByRole('tab').all()) {
    await tab.click();
    const height = await page.locator('#experience > .container-x').evaluate((element) => element.getBoundingClientRect().height);
    assert.ok(height <= 755, `Experience panel exceeds 819px screen minus 64px padding: ${height}`);
  }
  await tabs.getByRole('tab', { name: /Teaching Assistant/ }).click();
  assert.ok((await page.getByRole('tabpanel').innerText()).includes('Feb 2026 · 1 mo'));
  assert.ok(!(await page.getByRole('tabpanel').innerText()).includes('Present'));

  const widths = [...new Set([...Array.from({ length: 85 }, (_, i) => 320 + i * 20), 375, 768, 900, 1024, 1440, 1920])].sort((a, b) => a - b);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal page overflow at ${width}`);
    if (width >= 900) {
      assert.ok(await nav.evaluate((element) => new Set([...element.querySelectorAll('a')].map((link) => link.getBoundingClientRect().top)).size === 1), `Nav wraps at ${width}`);
      assert.equal(await page.locator('[data-site-header]').evaluate((element) => element.getBoundingClientRect().height), 81, `Header wraps at ${width}`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector('#experience [role="tablist"]').getAttribute('aria-orientation') === 'horizontal');
  await first.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await tabs.getByRole('tab').nth(1).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End');
  assert.ok(await tabs.evaluate((element) => element.scrollLeft > 0));
  await page.screenshot({ path: join(tmpdir(), 'line-r5-experience-mobile.png') });

  // Verify every organization and all eight roles are present before hydration.
  const noJS = await browser.newPage({ javaScriptEnabled: false, reducedMotion: 'reduce' });
  await noJS.goto(base);
  assert.equal(await noJS.locator('#experience [role="tabpanel"]').count(), 6);
  assert.equal(await noJS.locator('#experience .experience-role > h4').count(), 8);
  assert.equal(await noJS.locator('#experience .experience-role ul.list-disc li').count(), 12);
  assert.equal(await noJS.locator('#experience [role="tab"][aria-selected="true"]').count(), 1);
  for (const slide of await noJS.locator('.coverflow-slide').all()) {
    const style = await slide.evaluate((element) => ({ filter: getComputedStyle(element).filter, transform: getComputedStyle(element).transform }));
    assert.equal(style.filter, 'none');
    assert.ok(!style.transform.startsWith('matrix3d'));
  }
  await noJS.close();

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(`${base}/#work`);
  await reduced.waitForFunction(() => document.documentElement.dataset.motion === 'off');
  assert.equal(await reduced.locator('html').getAttribute('data-motion-source'), 'system');
  assert.equal(await reduced.locator('.carousel-drag-cursor').count(), 0);
  assert.ok(await reduced.locator('.coverflow-slide').evaluateAll((slides) => slides.every((slide) => getComputedStyle(slide).filter === 'none' && !getComputedStyle(slide).transform.startsWith('matrix3d'))));
  await reduced.close();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => {
    localStorage.setItem('line.motion', 'on');
    window.dispatchEvent(new StorageEvent('storage', { key: 'line.motion', newValue: 'on', storageArea: localStorage }));
  });
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'on');
  await page.locator('#work').scrollIntoViewIfNeeded();
  const region = page.getByRole('region', { name: 'Projects', exact: true });
  const active = () => region.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  const initialLabel = await active().getAttribute('aria-label');
  await page.locator('.carousel-viewport').dispatchEvent('wheel', { deltaX: 100, deltaY: 1 });
  await page.waitForFunction((label) => document.querySelector('[aria-roledescription="slide"][aria-hidden="false"]').getAttribute('aria-label') !== label, initialLabel);
  const afterWheel = await active().getAttribute('aria-label');
  for (let i = 0; i < 6; i++) await page.locator('.carousel-viewport').dispatchEvent('wheel', { deltaX: 100, deltaY: 1 });
  assert.equal(await active().getAttribute('aria-label'), afterWheel, 'Wheel momentum advanced more than once');
  await page.locator('.carousel-viewport').dispatchEvent('wheel', { deltaX: 20, deltaY: 120 });
  assert.equal(await active().getAttribute('aria-label'), afterWheel, 'Vertical scrolling changed slide');

  await page.waitForFunction(() => Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('[aria-roledescription="slide"][aria-hidden="false"]')).transform).m41) < 0.1);
  const heading = await active().locator('h3').boundingBox();
  const mouseX = heading.x + heading.width / 2;
  const mouseY = heading.y + heading.height / 2;
  await page.mouse.move(mouseX, mouseY);
  await page.locator('.carousel-drag-cursor').waitFor({ state: 'visible' });
  await page.mouse.down();
  await page.mouse.move(mouseX - 100, mouseY, { steps: 12 });
  assert.ok((await page.locator('.carousel-drag-cursor').innerText()).includes('Release'));
  const during = await active().evaluate((element) => {
    const style = getComputedStyle(element);
    return { transform: style.transform, filter: style.filter, opacity: Number(style.opacity),
      planet: new DOMMatrix(getComputedStyle(element.querySelector('.project-parallax-planet')).transform).m41,
      text: new DOMMatrix(getComputedStyle(element.querySelector('.project-parallax-text')).transform).m41 };
  });
  assert.ok(during.transform.startsWith('matrix3d') && during.opacity < 1 && during.opacity > 0.55);
  assert.ok(during.filter !== 'none' && during.filter !== 'blur(0px)');
  assert.ok(Math.abs(during.planet / during.text - 1.6) < 0.01);
  await page.mouse.up();
  await page.waitForFunction(() => Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.carousel-track')).transform).m41) < 0.1);
  await active().getByRole('link', { name: 'Open project' }).hover();
  assert.equal(await page.locator('.carousel-drag-cursor').count(), 0);
  assert.equal(await active().locator('.project-card').evaluate((element) => getComputedStyle(element, '::before').animationName), 'carousel-ring');
  await page.screenshot({ path: join(tmpdir(), 'line-r5-carousel.png') });

  await page.evaluate(() => {
    localStorage.setItem('line.motion', 'off');
    window.dispatchEvent(new StorageEvent('storage', { key: 'line.motion', newValue: 'off', storageArea: localStorage }));
  });
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'off');
  for (const slide of await region.locator('[aria-roledescription="slide"]').all()) {
    const style = await slide.evaluate((element) => ({ filter: getComputedStyle(element).filter, matrix: getComputedStyle(element).transform }));
    assert.equal(style.filter, 'none');
    assert.ok(!style.matrix.startsWith('matrix3d'));
  }
  assert.equal(await active().locator('.project-card').evaluate((element) => getComputedStyle(element, '::before').animationName), 'none');
  assert.deepEqual(errors, []);
  console.log('PASS: eight sections/seven planets, SSR roles, tabs/focus, all panel budgets, 320–2000px overflow/nav, wheel latch, live 3D/parallax/cursor and Motion Off.');
} finally { await browser.close(); }
