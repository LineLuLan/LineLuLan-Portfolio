// Intent: prove Line's transcript navigation, accessible chart and responsive section geometry.
// Status: browser regression gate. Next: run with PORTFOLIO_TEST_URL. Blockers: local server required.
// Confidence: live DOM bounds, keyboard focus, all ten palettes and no-JavaScript rendering.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3019';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('line.motion', 'off'));
  await page.goto(`${base}/transcript`);
  await page.locator('.boot-splash').waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(errors, [], 'Transcript must hydrate without replacing server HTML');
  assert.equal(await page.title(), 'Transcript · Line');
  assert.equal(await page.locator('h1').innerText(), 'Transcript.');
  assert.equal(await page.locator('.transcript-semester').count(), 7);
  assert.equal(await page.locator('.transcript-course-table tbody tr').count(), 29);
  assert.match(await page.locator('.transcript-overview').innerText(), /3\.56 \/ 4\.0/);
  assert.match(await page.locator('.transcript-overview').innerText(), /86\.0 \/ 100/);
  assert.equal(await page.locator('.transcript-semester h2').first().innerText(), 'Semester 2 · 2025–2026');
  assert.equal(await page.locator('.transcript-trend table tbody tr').count(), 4);
  const dot = page.locator('.transcript-trend-desktop circle').first();
  await dot.focus();
  assert.ok(await dot.evaluate((element) => element === document.activeElement));
  assert.equal(await dot.locator('..').locator('.transcript-chart-tooltip').evaluate((element) => getComputedStyle(element).visibility), 'visible');
  assert.match(await dot.locator('title').textContent(), /GPA 3\.07/);

  // Sweep each responsive breakpoint and intermediate widths on both routes.
  const widths = [...new Set([...Array.from({ length: 85 }, (_, index) => 320 + index * 20), 375, 639, 640, 767, 768, 899, 900, 1023, 1024, 1279, 1280, 1440, 1920])];
  for (const route of ['/transcript', '/']) {
    await page.goto(`${base}${route}`);
    await page.locator('.boot-splash').waitFor({ state: 'detached' });
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route}: horizontal overflow at ${width}px`);
    }
  }
  for (const [width, height] of [[1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    const dimensions = await page.evaluate(() => {
      const rect = (element) => {
        const { top, bottom, left, right, width, height } = element.getBoundingClientRect();
        return { top, bottom, left, right, width, height };
      };
      const cards = [...document.querySelectorAll('.dabm-card')].map((element) => ({
        ...rect(element), children: [...element.children].map(rect),
      }));
      const path = document.querySelector('.dabm-path');
      const pathBounds = rect(path);
      const points = [...path.querySelector('polyline').points].map((point) => ({ x: pathBounds.left + point.x / 1000 * pathBounds.width, y: pathBounds.top + point.y / 500 * pathBounds.height }));
      const nodes = [...document.querySelectorAll('.dabm-node')].map(rect);
      return {
        budget: innerHeight - document.querySelector('[data-site-header]').getBoundingClientRect().height,
        framework: rect(document.querySelector('#framework')), frameworkContent: rect(document.querySelector('#framework > .container-x')),
        experience: rect(document.querySelector('#experience')), directory: rect(document.querySelector('.experience-directory')),
        panel: rect(document.querySelector('.experience-panel:not([hidden])')), eyebrow: rect(document.querySelector('.experience-directory .eyebrow')),
        cards, nodes, points,
      };
    });
    assert.ok(dimensions.framework.height <= dimensions.budget + 1);
    assert.ok(dimensions.experience.height <= dimensions.budget + 1);
    assert.ok(dimensions.frameworkContent.bottom <= dimensions.framework.bottom);
    for (let index = 0; index < 4; index++) {
      const card = dimensions.cards[index];
      for (const child of card.children) assert.ok(child.top >= card.top && child.bottom <= card.bottom, 'Framework text must fit inside its card');
      assert.ok(Math.abs(dimensions.nodes[index].left + dimensions.nodes[index].width / 2 - dimensions.points[index].x) < 1);
      assert.ok(Math.abs(dimensions.nodes[index].top + dimensions.nodes[index].height / 2 - dimensions.points[index].y) < 1);
    }
    const gaps = [dimensions.cards[2].top - dimensions.cards[0].bottom, dimensions.cards[3].top - dimensions.cards[1].bottom];
    assert.ok(gaps.every((gap) => gap >= 40));
    assert.ok(Math.abs(dimensions.directory.height - dimensions.panel.height) < 1);
    assert.ok(Math.abs(dimensions.panel.top - dimensions.eyebrow.top) < 1);
    console.log(`${width}x${height}: Framework ${dimensions.framework.height}px section / ${dimensions.frameworkContent.height.toFixed(2)}px content / ${gaps.join(', ')}px card gaps; Experience ${dimensions.experience.height}px section / ${dimensions.panel.height}px panel; top alignment ${Math.abs(dimensions.panel.top - dimensions.eyebrow.top)}px.`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('tab', { name: /Teaching Assistant/ }).click();
  await page.getByRole('link', { name: 'View full transcript' }).click();
  await page.waitForURL(`${base}/transcript`);
  await page.getByRole('heading', { name: 'Transcript.', exact: true }).waitFor();
  for (const mode of ['light', 'dark']) for (const accent of ['kafka', 'nebula', 'aurora', 'mars', 'rose']) {
    await page.evaluate(({ mode, accent }) => {
      for (const [key, value] of [['line.mode', mode], ['line.accent', accent]]) {
        localStorage.setItem(key, value);
        dispatchEvent(new StorageEvent('storage', { key, newValue: value, storageArea: localStorage }));
      }
    }, { mode, accent });
    await page.waitForFunction(({ mode, accent }) => document.documentElement.dataset.mode === mode && document.documentElement.dataset.accent === accent, { mode, accent });
    for (const width of [320, 768, 1440, 2000]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${mode}/${accent}: overflow at ${width}px`);
      assert.ok(await page.locator('.transcript-trend svg:visible .transcript-axis[text-anchor="middle"]').evaluateAll((labels) => {
        const boxes = labels.map((label) => label.getBoundingClientRect());
        return boxes.every((box, index) => boxes.slice(index + 1).every((other) =>
          box.right <= other.left || other.right <= box.left || box.bottom <= other.top || other.bottom <= box.top));
      }), 'Chart semester labels must not overlap');
    }
    const colors = await page.evaluate(() => ({
      series: getComputedStyle(document.querySelector('.transcript-series-semester')).color,
      accent: getComputedStyle(document.querySelector('.transcript-back')).color,
    }));
    assert.equal(colors.series, colors.accent);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: join(tmpdir(), 'line-transcript-desktop.png') });
  await page.setViewportSize({ width: 375, height: 844 });
  await page.screenshot({ path: join(tmpdir(), 'line-transcript-mobile.png') });
  assert.equal(await page.locator('.transcript-course-table tbody tr').first().evaluate((element) => getComputedStyle(element).display), 'grid');
  await page.getByRole('link', { name: 'Back to experience' }).click();
  await page.waitForURL(`${base}/#experience`);
  await page.getByRole('heading', { name: "Where I've worked." }).waitFor();
  assert.deepEqual(errors, []);

  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  await noJS.goto(`${base}/transcript`);
  assert.equal(await noJS.locator('.transcript-course-table tbody tr').count(), 29);
  assert.ok(await noJS.getByRole('heading', { name: 'Transcript.' }).isVisible());
  assert.ok(await noJS.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await noJS.close();
  console.log(`PASS: hydration, static transcript, keyboard chart values, IU round-trip, all ten palettes, ${widths.length} widths per route (320–2000px), desktop section geometry and no-JS results.`);
} finally { await browser.close(); }
