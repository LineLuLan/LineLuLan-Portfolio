# Implementation tracking

Updated: 2026-11-07. Owner: Line. Current version: 2.0.0. Portfolio polish is prepared on `tamir-polish` for a PR into the verified production branch, `main`; merge and release checks remain separate.

## Redesign phases

- [x] P1 Foundation: theme registry and tokens, fonts, pre-paint preferences, provider, dock, pixel planets, header, footer, splash styling.
- [x] P2 Sections A: hero and orbital artwork, About, Stack.
- [x] P3 Sections B: project rows and modal, DABM, Record and modal, Contact and form.
- [x] P4 Polish: section companion, header hide/reveal, theme stamp, per-theme contrast gate, Saturn icons, alias and dead-rule cleanup, documentation.

## Verify + Deploy

- [x] Production build: `pnpm build` (2026-11-07, expressive motion refinement, configured Google fonts).
- [x] Contrast: `pnpm check:contrast`; all root and theme tables pass (2026-11-05).
- [x] Four-condition splash probe: JavaScript on/off × normal/reduced motion, plus stored motion off (2026-11-05, local Chromium dev server with fallback fonts; production repeat pending).
- [ ] Lighthouse ≥ 95: performance, accessibility, best practices, SEO.
- [ ] Mobile and desktop QA: 320–1440px, navigation, companion, modals, form, CV.
- [ ] Web3Forms public key set for anhtrannam097@gmail.com and authorized delivery test completed.
- [ ] Line approves and authorizes merge to main.
- [ ] Deploy approved revision to Vercel at linelulan.vercel.app.

TypeScript and lint also gate review: `pnpm exec tsc --noEmit` and `pnpm lint`. Record actual results in the session handoff; unchecked items are not claimed as passed.

## Weekly notes

### 2026-11-07 — layered entrances and production PR

Upgraded the component motion with perspective card lifts, accent sweeps, directional facts, clipped showcase entrances, 3D word reveals, and sequential chip/stat builds. Destination entrances wait for anchor scrolling to settle. The controller waits for child effects before removing the entrance state, and focus/Motion Off clear every transform, blur and clip. Fixed rapid mode/accent selections so the latest click wins while a View Transition is pending.

Production build/type checking, existing project and career/contact browser suites, navigation/motion, carousel state, contrast and orbit geometry checks pass. The expanded reveal suite verifies child timing, focus/preference cancellation, no-JavaScript rendering and mobile width throughout animation frames, as well as the previous spacing checks. The ThemeDock browser suite passes rapid mode/accent choices and a deliberately held callback interrupted by Motion Off and a newer choice. Recorded local evidence: `shots/component-entrances-preview.webm`. The user requested branch `tamir-polish` and a PR into the current production branch; GitHub deployment evidence confirms `main` as the base.

### 2026-11-07 — spacing and component reveals

Standardized section-heading gaps, separated hero actions/socials, improved availability wrapping and stats spacing, reduced mobile project padding, and adjusted About labels and Contact artwork for narrow screens. About and Stack preserve the 819px desktop section budget at 1440×900; tablet GPA values stay on one line.

Added progressive, once-only component reveals with short bounded staggers. Initially visible content remains visible; keyboard focus and Motion Off immediately show pending blocks, and no-JavaScript rendering stays readable. Existing timeline/framework motion remains independent. Production build/type checks, lint, navigation/motion and carousel-state checks pass. Project, career/contact and new `components/layout/reveals.browser.test.mjs` Chromium suites pass; the new suite covers reveal lifecycle, keyboard focus, motion preferences, no-JS content, section budgets and 320–1920px spacing. Homepage first-load JavaScript remains 196kB; no new dependencies.

### 2026-11-07 — expressive motion refinement

Added a pointer-responsive constellation background, compact animated mobile orbit, staggered word entrances, dimensional project cards with local light, and circular mode/accent transitions. The canvas suspends offscreen/background work; Motion Off and unsupported View Transition browsers retain immediate, readable behavior. Fixed the carousel's viewport-width calculation after the live Windows preview exposed horizontal overflow with a non-overlay scrollbar.

Production build, TypeScript, lint, contrast, navigation/motion, orbit geometry, carousel state and both existing Chromium browser suites pass. A local effects probe also passes for canvas suspension, card focus/reset, rapid theme changes, Motion Off, unsupported View Transitions, no-JavaScript text, and 320–1920px layouts. The live narrow preview confirms equal document/client widths and the visible mobile orbit. Homepage first-load JS is 196kB (194kB before this refinement), with no new dependencies. Deployment, Lighthouse, non-Chromium QA and contact delivery remain pending.

### 2026-11-06 — motion polish

Added the selected polished/playful direction: subtle hero atmosphere, pointer-responsive orbit, coordinated hero entrances, card and control feedback, navigation underlines, reading progress and appearance-panel transitions. Fixed desktop milestone label collisions and refreshed stale career test assertions. The production build, TypeScript, lint, contrast, orbit, navigation/motion and carousel checks pass. Both existing Chromium browser suites pass; an additional local probe verified keyboard, touch, motion preferences, interrupted transitions, dark mode, no-JavaScript hero rendering and 320–1920px layout. Homepage first-load JS is 194kB (previous inspection: 189kB); no new dependency. Deployment, non-Chromium QA, Lighthouse measurement and contact delivery remain pending.

### 2026-11-05

Orbit replaces the previous visual system with warm paper, a single purple accent, editorial typography, and pixel planets. All seven sections use the shared tokens. The theme dock persists appearance and motion preferences. The finishing layer adds the section companion, desktop header behavior, theme-aware stamp, and generated Saturn icons. Documentation describes the current architecture; release measurements and deployment remain gated by Line.

## Bug log

| Date | Symptom | Cause | Fix |
| --- | --- | --- | --- |
| 2026-11-05 | Intro does not show on reduced-motion machines | Motion preference skips the intro instead of reducing its animation | SSR-visible splash retains its hold delay while CSS shortens animation durations |
| 2026-11-05 | Hero is invisible without JavaScript | Initial animation opacity hides above-the-fold content | SSR-visible hero uses CSS reveals; layout retains a noscript fallback |
| 2026-11-05 | Hydration mismatch from useReducedMotion | Server and first client render choose different content from motion state | Stable initial markup and counter values; motion-dependent updates happen after hydration |
