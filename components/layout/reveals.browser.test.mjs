// Run against a built local server: node components/layout/reveals.browser.test.mjs
// Checks reveal behavior, focus, fallbacks and responsive spacing without sending external requests.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const base = process.env.PORTFOLIO_TEST_URL ?? 'http://127.0.0.1:3000';
const origin = new URL(base).origin;
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname), 'Use a localhost preview for this suite.');
const browser = await chromium.launch({ headless: true });
const errors = [];
const screenshots = new URL('../../shots/', import.meta.url);

async function localPage(options = {}) {
  const page = await browser.newPage(options);
  await page.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
  page.on('pageerror', (error) => errors.push(error.message));
  return page;
}

async function ready(page) {
  await page.waitForFunction(() => document.querySelector('[data-reveal-state]'));
  await page.locator('.boot-splash').waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
}

async function sectionAtHeader(page, id) {
  await page.waitForFunction((sectionId) => {
    const section = document.getElementById(sectionId);
    const header = document.querySelector('[data-site-header]');
    return Math.abs(section.getBoundingClientRect().top - header.getBoundingClientRect().height) < 3;
  }, id);
}

async function restingEffects(locator) {
  return locator.evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return {
      tag: element.tagName,
      opacity: style.opacity,
      neutralTransform: style.transform === 'none' || new DOMMatrix(style.transform).isIdentity,
      filter: style.filter,
      clipPath: style.clipPath,
    };
  }));
}

function assertResting(effects, label) {
  assert.ok(effects.length > 0, `${label}: no elements were checked.`);
  assert.ok(effects.every((effect) => effect.opacity === '1' && effect.neutralTransform && effect.filter === 'none' && effect.clipPath === 'none'), `${label}: effects were not cleared: ${JSON.stringify(effects)}`);
}

async function visibleRevealsSettled(page, sectionId) {
  await page.waitForFunction((id) => [...document.querySelectorAll(`#${id} [data-reveal]`)].every((element) => {
    const bounds = element.getBoundingClientRect();
    return bounds.top >= innerHeight - 24 || bounds.bottom <= 0 || element.dataset.revealState === 'shown';
  }), sectionId);
}

try {
  await mkdir(screenshots, { recursive: true });
  const page = await localPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => localStorage.setItem('line.motion', 'on'));
  await page.goto(base);
  await ready(page);

  const initial = await page.locator('[data-reveal]').evaluateAll((elements) => elements
    .filter((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top < innerHeight && bounds.bottom > document.querySelector('[data-site-header]').clientHeight;
    })
    .map((element) => ({ state: element.dataset.revealState, opacity: getComputedStyle(element).opacity })));
  assert.ok(initial.length > 0, 'Exercise at least one initially visible reveal component.');
  assert.ok(initial.every(({ state, opacity }) => state === 'shown' && opacity === '1'), `Initially visible content was hidden: ${JSON.stringify(initial)}`);
  await page.waitForFunction(() => [...document.querySelectorAll('h1 .reveal-word')].every((word) => getComputedStyle(word).opacity === '1'));
  await page.waitForFunction(() => document.querySelector('[aria-label="Quick stats"]').textContent.includes('3.56'));
  await page.screenshot({ path: fileURLToPath(new URL('spacing-hero-desktop.png', screenshots)) });

  const card = page.locator('#stack .surface-card').first();
  assert.equal(await card.getAttribute('data-reveal-state'), 'pending');
  assert.equal(await card.evaluate((element) => getComputedStyle(element).opacity), '0');
  assert.ok(await card.locator('[data-reveal-child]').count() > 1, 'Exercise a component with staggered child content.');
  await card.evaluate((element) => {
    window.__stackRevealStarts = 0;
    window.__childRevealDelays = [];
    window.__childStaggerSeen = false;
    element.addEventListener('animationstart', (event) => {
      if (event.target === element && event.animationName === 'component-reveal') window.__stackRevealStarts++;
    });
    const observeChildren = new MutationObserver(() => {
      if (element.dataset.revealState !== 'entering') return;
      observeChildren.disconnect();
      const children = [...element.querySelectorAll('[data-reveal-child]')];
      window.__childRevealDelays = children.map((child) => getComputedStyle(child).animationDelay);
      function sample() {
        const opacity = children.map((child) => Number(getComputedStyle(child).opacity));
        if (opacity[0] > opacity.at(-1) + 0.05) window.__childStaggerSeen = true;
        if (element.dataset.revealState === 'entering') requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    observeChildren.observe(element, { attributes: true, attributeFilter: ['data-reveal-state'] });
  });
  const navigation = page.getByRole('navigation', { name: 'Sections', exact: true });
  await navigation.getByRole('link', { name: 'Stack', exact: true }).click();
  await sectionAtHeader(page, 'stack');
  await page.waitForFunction(() => document.querySelector('#stack .surface-card').dataset.revealState === 'shown');
  assert.equal(await card.evaluate((element) => getComputedStyle(element).opacity), '1');
  assert.equal(await page.evaluate(() => window.__stackRevealStarts), 1);
  assert.ok(await page.evaluate(() => new Set(window.__childRevealDelays).size > 1), 'Child entrances should have a visible sequence.');
  assert.equal(await page.evaluate(() => window.__childStaggerSeen), true, 'Earlier child content should become visible before later content.');
  assertResting(await restingEffects(card.locator('[data-reveal-child]')), 'Settled card children');
  await page.waitForFunction(() => !document.querySelector('#stack [data-reveal-state="entering"]'));
  await page.screenshot({ path: fileURLToPath(new URL('spacing-stack-desktop.png', screenshots)) });
  await page.getByRole('link', { name: 'Line, back to top', exact: true }).click();
  await page.waitForFunction(() => scrollY < 1);
  assert.equal(await card.getAttribute('data-reveal-state'), 'shown');
  assert.equal(await card.evaluate((element) => getComputedStyle(element).opacity), '1');
  await navigation.getByRole('link', { name: 'Stack', exact: true }).click();
  await sectionAtHeader(page, 'stack');
  assert.equal(await card.getAttribute('data-reveal-state'), 'shown');
  assert.equal(await page.evaluate(() => window.__stackRevealStarts), 1, 'Revisiting a component must not replay its reveal.');
  console.log('PASS: initially visible components stay readable; cards and staggered children reveal once and settle without residual effects.');

  const formReveal = page.locator('#contact [data-reveal]').filter({ has: page.locator('form') });
  assert.equal(await formReveal.getAttribute('data-reveal-state'), 'pending');
  // Focus is synchronous, so a keyboard destination must be readable before its reveal could play.
  const focused = await page.getByRole('textbox', { name: 'From', exact: true }).evaluate((input) => {
    input.focus({ preventScroll: true });
    const reveal = input.closest('[data-reveal]');
    return { state: reveal.dataset.revealState, opacity: getComputedStyle(reveal).opacity, focused: input === document.activeElement };
  });
  assert.deepEqual(focused, { state: 'shown', opacity: '1', focused: true });
  assertResting(await restingEffects(formReveal), 'Focused form wrapper');
  const formChildren = formReveal.locator('[data-reveal-child]');
  if (await formChildren.count()) assertResting(await restingEffects(formChildren), 'Focused form children');
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('textbox', { name: 'Subject', exact: true }).evaluate((input) => input === document.activeElement), true);
  assert.equal(await formReveal.evaluate((element) => getComputedStyle(element).opacity), '1');
  console.log('PASS: focus immediately reveals pending form content and keyboard traversal remains usable.');

  await page.goto(base);
  await ready(page);
  assert.ok(await page.locator('[data-reveal-state="pending"]').count() > 0);
  await page.getByRole('button', { name: /^Appearance, current/ }).click();
  const motionSwitch = page.getByRole('switch', { name: /Motion/ });
  await motionSwitch.click();
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'off' && !document.querySelector('[data-reveal-state="pending"], [data-reveal-state="entering"]'));
  assertResting(await restingEffects(page.locator('[data-reveal], [data-reveal-child], .reveal-word')), 'Motion Off content');
  await motionSwitch.click();
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'on');
  assert.equal(await page.locator('[data-reveal-state="pending"], [data-reveal-state="entering"]').count(), 0, 'Motion On must not re-hide content shown by Motion Off.');
  assertResting(await restingEffects(page.locator('[data-reveal], [data-reveal-child]')), 'Content after re-enabling motion');
  // Keep layout assertions deterministic while checking the static equivalent of the same content.
  await motionSwitch.click();
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'off');
  await page.keyboard.press('Escape');
  console.log('PASS: Motion Off clears all pending reveals and Motion On does not hide them again.');

  const desktopSections = await page.locator('section.screen-section').evaluateAll((sections) => sections.map((section) => {
    const footer = document.querySelector('[data-site-footer]');
    const budget = innerHeight - document.querySelector('[data-site-header]').getBoundingClientRect().height -
      (section.id === 'contact' ? footer.getBoundingClientRect().height : 0);
    return {
      id: section.id,
      content: Math.round(section.firstElementChild.getBoundingClientRect().height * 10) / 10,
      height: Math.round(section.getBoundingClientRect().height * 10) / 10,
      budget: Math.round(budget * 10) / 10,
    };
  }));
  console.log(`Desktop sections at 1440×900: ${JSON.stringify(desktopSections)}`);
  for (const section of desktopSections) {
    assert.ok(section.height <= section.budget + 1, `Desktop section exceeds its screen budget: ${JSON.stringify(section)}`);
  }

  for (const width of [320, 375, 451, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => {
      const actions = document.querySelector('[data-hero-actions]');
      const socials = document.querySelector('[data-hero-socials]');
      const actionBounds = actions.getBoundingClientRect();
      const socialBounds = socials.getBoundingClientRect();
      const stats = [...document.querySelectorAll('[aria-label="Quick stats"] > [role="listitem"]')].map((item) => {
        const value = item.querySelector('div > span');
        const number = value.firstElementChild;
        const suffix = number.nextElementSibling;
        const bounds = item.getBoundingClientRect();
        const valueBounds = value.getBoundingClientRect();
        const numberBounds = number.getBoundingClientRect();
        const suffixBounds = suffix?.getBoundingClientRect();
        return {
          text: value.textContent,
          fits: valueBounds.left >= bounds.left - 1 && valueBounds.right <= bounds.right + 1,
          oneLine: !suffixBounds || (suffixBounds.left >= numberBounds.right - 1 && suffixBounds.top < numberBounds.bottom),
          noOverflow: item.scrollWidth <= item.clientWidth,
        };
      });
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        groupGap: socialBounds.top - actionBounds.bottom,
        groupAlignment: Math.abs(actionBounds.left - socialBounds.left),
        actionCount: actions.querySelectorAll('a').length,
        socialCount: socials.querySelectorAll('a').length,
        stats,
      };
    });
    assert.ok(layout.scrollWidth <= layout.clientWidth, `Horizontal overflow at ${width}px: ${JSON.stringify(layout)}`);
    assert.equal(layout.actionCount, 2);
    assert.equal(layout.socialCount, 3);
    assert.ok(layout.groupGap >= 12 && layout.groupAlignment <= 1, `Hero action grouping at ${width}px: ${JSON.stringify(layout)}`);
    assert.equal(layout.stats.length, 4);
    assert.ok(layout.stats.every(({ fits, oneLine, noOverflow }) => fits && oneLine && noOverflow), `Stats wrap or overflow at ${width}px: ${JSON.stringify(layout.stats)}`);
    if (width === 375) {
      await page.getByRole('link', { name: 'Line, back to top', exact: true }).click();
      await page.waitForFunction(() => scrollY < 1);
      await page.screenshot({ path: fileURLToPath(new URL('spacing-hero-mobile.png', screenshots)) });
    }
  }
  console.log('PASS: 320–1920px layouts have no document overflow, separate hero action groups and single-line stat values.');

  const mobile = await localPage({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
  await mobile.addInitScript(() => localStorage.setItem('line.motion', 'on'));
  await mobile.goto(base);
  await ready(mobile);
  await mobile.evaluate(() => {
    window.__entranceOverflows = [];
    window.__entranceVariants = new Set();
    window.__sampleEntrances = true;
    function sample() {
      if (!window.__sampleEntrances) return;
      const root = document.documentElement;
      if (root.scrollWidth > root.clientWidth && window.__entranceOverflows.length < 5) {
        window.__entranceOverflows.push({ scrollWidth: root.scrollWidth, clientWidth: root.clientWidth, scrollY });
      }
      document.querySelectorAll('[data-reveal-state="entering"]').forEach((element) => window.__entranceVariants.add(element.dataset.reveal));
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  // Exercise transforms while entering, not only their finished layout.
  for (const selector of ['[aria-label="Quick stats"]', '#about dl[data-reveal]', '#stack .surface-card', '#work [data-reveal]:has([aria-roledescription="carousel"])']) {
    const target = mobile.locator(selector).first();
    await target.scrollIntoViewIfNeeded();
    await mobile.waitForFunction((targetSelector) => document.querySelector(targetSelector)?.dataset.revealState === 'shown', selector);
  }
  const mobileFrames = await mobile.evaluate(() => {
    window.__sampleEntrances = false;
    return { overflows: window.__entranceOverflows, variants: [...window.__entranceVariants] };
  });
  assert.deepEqual(mobileFrames.overflows, [], `Mobile entrance overflow: ${JSON.stringify(mobileFrames.overflows)}`);
  assert.ok(mobileFrames.variants.length >= 3, `Exercise multiple entrance variants: ${JSON.stringify(mobileFrames.variants)}`);
  await mobile.close();
  console.log('PASS: mobile component entrances preserve document width throughout their animations.');

  for (const reducedMotion of ['no-preference', 'reduce']) {
    const noJS = await localPage({ javaScriptEnabled: false, reducedMotion, viewport: { width: 375, height: 812 } });
    await noJS.goto(base);
    await noJS.evaluate(() => document.fonts.ready);
    const visible = await noJS.locator('[data-reveal]').evaluateAll((elements) => elements.every((element) => {
      const styles = getComputedStyle(element);
      return styles.opacity === '1' && styles.visibility === 'visible' && element.getClientRects().length > 0 &&
        [...element.querySelectorAll('.reveal-word')].every((word) => getComputedStyle(word).opacity === '1');
    }));
    assert.equal(visible, true, `No-JavaScript content is hidden with ${reducedMotion}.`);
    assertResting(await restingEffects(noJS.locator('[data-reveal], [data-reveal-child]')), `No-JavaScript ${reducedMotion}`);
    await noJS.close();
  }

  // A short, local recording demonstrates the same observed entrance behavior.
  const preview = await localPage({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: fileURLToPath(screenshots), size: { width: 1280, height: 800 } },
  });
  await preview.addInitScript(() => localStorage.setItem('line.motion', 'on'));
  await preview.goto(base);
  await ready(preview);
  await preview.waitForFunction(() => [...document.querySelectorAll('h1 .reveal-word')].every((word) => getComputedStyle(word).opacity === '1'));
  for (const [name, id] of [['About', 'about'], ['Stack', 'stack'], ['Work', 'work']]) {
    await preview.getByRole('navigation', { name: 'Sections', exact: true }).getByRole('link', { name, exact: true }).click();
    await sectionAtHeader(preview, id);
    await visibleRevealsSettled(preview, id);
    await preview.waitForTimeout(350); // Leave a brief settled frame for the local preview.
  }
  const video = preview.video();
  await preview.context().close();
  const videoPath = fileURLToPath(new URL('component-entrances-preview.webm', screenshots));
  await video.saveAs(videoPath);
  await video.delete();
  console.log(`Local entrance preview: ${videoPath}`);
  assert.deepEqual(errors, []);
  console.log('PASS: no-JavaScript component content is readable in both motion preferences; no uncaught page errors.');
} finally {
  await browser.close();
}
