// Intent: verify Line's project navigation, gestures, motion and viewport budgets in Chromium.
// Status: acceptance coverage. Next: run against the local dev server. Blockers: server required. Confidence: browser assertions.
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
  await page.addInitScript(() => {
    if (window === window.top && !localStorage.getItem('line.motion')) localStorage.setItem('line.motion', 'off');
  });
  await page.goto(`${base}/#work`);
  await page.waitForFunction(() => document.querySelector('[aria-hidden="true"] > [inert]'));
  const region = page.getByRole('region', { name: 'Projects', exact: true });
  const active = () => region.locator('[aria-roledescription="slide"][aria-hidden="false"]');
  async function selected(name) {
    await page.waitForFunction((name) => document.querySelector('[aria-roledescription="slide"][aria-hidden="false"]')?.getAttribute('aria-label')?.includes(name), name);
  }
  assert.equal(await region.locator('[aria-roledescription="slide"]').count(), 4);
  assert.equal(await region.locator('[inert]').count(), 3);
  assert.equal(await region.getByText('Dengue Shock Prediction').count(), 0);
  await selected('GoiBERT-M');
  for (const id of ['work', 'framework']) {
    const box = await page.locator(`#${id}`).evaluate((element) => ({
      content: element.firstElementChild.getBoundingClientRect().height,
      height: element.getBoundingClientRect().height,
      budget: innerHeight - document.querySelector('[data-site-header]').getBoundingClientRect().height,
    }));
    assert.ok(box.content <= 740, `${id} content exceeds 740px: ${JSON.stringify(box)}`);
    assert.ok(box.height <= box.budget + 1, `${id} exceeds a screen: ${JSON.stringify(box)}`);
    console.log(`${id}: ${box.content.toFixed(1)}px content, ${box.height}px section`);
  }
  await page.screenshot({ path: join(tmpdir(), 'line-projects-desktop.png') });
  await region.getByRole('button', { name: 'Previous project', exact: true }).click();
  await selected('Panic Hub');
  await region.getByRole('button', { name: 'Next project', exact: true }).click();
  await selected('GoiBERT-M');
  await region.focus();
  await page.keyboard.press('ArrowRight');
  await selected('EnStudy-Hub');
  await region.getByRole('button', { name: 'Show Ezidatic', exact: true }).click();
  await selected('Ezidatic');
  // The visible neighboring surface selects without following its inert links.
  const neighbor = region.locator('[aria-roledescription="slide"]', { hasText: 'Panic Hub' }).locator('button');
  const neighborBox = await neighbor.boundingBox();
  await page.mouse.click(Math.min(neighborBox.x + 20, 1410), neighborBox.y + neighborBox.height / 2);
  await selected('Panic Hub');
  await active().getByRole('link', { name: 'Open project' }).click();
  await page.waitForURL('**/projects/panic-hub');
  assert.equal(await page.locator('h1').innerText(), 'Panic Hub');
  const video = page.locator('iframe');
  assert.equal(await video.getAttribute('src'), 'https://www.youtube-nocookie.com/embed/Vw9_MV7uf-c');
  assert.equal(await video.getAttribute('allow'), 'encrypted-media; picture-in-picture');
  assert.equal(await video.getAttribute('loading'), 'lazy');
  assert.equal(await video.getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin');
  assert.equal(await page.locator('#chapter-dataset').count(), 0);
  assert.equal(await page.locator('header[data-site-header] a').first().getAttribute('href'), '/');
  assert.equal(await page.getByRole('navigation', { name: 'Sections', exact: true }).getByRole('link', { name: 'Work', exact: true }).getAttribute('href'), '/#work');
  await page.getByRole('navigation', { name: 'Sections', exact: true }).getByRole('link', { name: 'Work', exact: true }).click();
  await page.waitForURL(`${base}/#work`);
  await page.waitForFunction(() => Math.abs(document.querySelector('#work').getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().height) < 3);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'work');
  for (const slug of ['goibert-m', 'enstudy-hub', 'ezidatic', 'panic-hub', 'dengue-shock-prediction']) {
    const response = await page.goto(`${base}/projects/${slug}`);
    assert.equal(response.status(), 200);
    assert.ok((await page.title()).includes(await page.locator('h1').innerText()));
    assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
    assert.equal(await page.getByRole('heading', { name: 'Through the DABM lens' }).count(), 1);
    if (slug === 'enstudy-hub') assert.equal(await page.locator('main a[href*="github.com"]').count(), 0);
    assert.equal(await page.getByRole('navigation', { name: 'More projects' }).locator('a[href*="dengue"]').count(), 0);
  }
  assert.equal((await page.goto(`${base}/projects/not-a-project`)).status(), 404);
  // Actual touch events exercise the mobile drag path with motion off and on.
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const phone = await mobile.newPage();
  phone.on('pageerror', (error) => errors.push(error.message));
  await phone.addInitScript(() => {
    if (window !== window.top) return;
    if (!localStorage.getItem('line.motion')) localStorage.setItem('line.motion', 'off');
    localStorage.setItem('line.mode', 'dark');
  });
  await phone.goto(`${base}/#work`);
  await phone.waitForFunction(() => document.querySelector('[inert]'));
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await phone.setViewportSize({ width, height: 900 });
    assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `page overflows at ${width}px`);
  }
  await phone.setViewportSize({ width: 390, height: 844 });
  const cdp = await mobile.newCDPSession(phone);
  for (const motion of ['off', 'on']) {
    if (motion === 'on') {
      await phone.evaluate(() => { localStorage.setItem('line.motion', 'on'); });
    }
    await phone.reload();
    await phone.waitForFunction(() => document.querySelector('[inert]'));
    await phone.getByRole('dialog', { name: 'Loading' }).waitFor({ state: 'detached' });
    assert.equal(await phone.locator('html').getAttribute('data-motion'), motion);
    await phone.waitForFunction(() => Math.abs(document.querySelector('#work').getBoundingClientRect().top - document.querySelector('[data-site-header]').getBoundingClientRect().height) < 3);
    await phone.locator('[aria-roledescription="carousel"]').scrollIntoViewIfNeeded();
    const box = await phone.locator('[aria-roledescription="slide"][aria-hidden="false"]').boundingBox();
    const y = Math.min(600, Math.max(140, box.y + 130));
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y }] });
    for (const x of [285, 245, 205, 165, 125, 85]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await phone.waitForFunction(() => document.querySelector('[aria-roledescription="slide"][aria-hidden="false"]')?.getAttribute('aria-label')?.includes('EnStudy-Hub'));
    assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await phone.screenshot({ path: join(tmpdir(), `line-projects-mobile-${motion}.png`) });
  }
  // With motion enabled, recycled cards must never animate across the centered story.
  await page.evaluate(() => localStorage.setItem('line.motion', 'on'));
  await page.goto(`${base}/#work`);
  await page.waitForFunction(() => document.querySelector('[inert]'));
  assert.equal(await page.locator('html').getAttribute('data-motion'), 'on');
  const recycledFrames = await page.evaluate(async () => {
    const carousel = document.querySelector('[aria-roledescription="carousel"]');
    carousel.querySelector('button[aria-label="Previous project"]').click();
    const frames = [];
    for (let i = 0; i < 24; i++) {
      await new Promise(requestAnimationFrame);
      const slide = carousel.querySelector('[aria-label="3 of 4: Ezidatic"]');
      if (getComputedStyle(slide).visibility === 'visible') frames.push(new DOMMatrix(getComputedStyle(slide).transform).m41);
    }
    return frames;
  });
  assert.ok(recycledFrames.length > 0 && recycledFrames.every((x) => x < 0), `recycled slide crossed center: ${recycledFrames}`);
  await selected('Panic Hub');
  await page.locator('#framework').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => parseFloat(getComputedStyle(document.querySelector('#framework mask path')).strokeDashoffset) === 0);
  assert.equal(await page.locator('#framework mask').getAttribute('maskUnits'), 'userSpaceOnUse');
  assert.ok((await page.locator('#framework a[href="#work"]').innerText()).endsWith('→'));
  await page.screenshot({ path: join(tmpdir(), 'line-framework-desktop.png') });
  assert.deepEqual(errors, []);
  console.log('PASS: routes/404, metadata, embed policy, navigation/focus, carousel arrows/dots/keyboard/neighbor/touch, inert controls, motion on/off, dark mobile and overflow.');
  console.log(`Screenshots: ${tmpdir()}`);
} finally {
  await browser.close();
}
