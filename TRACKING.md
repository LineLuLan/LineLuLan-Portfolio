# Implementation tracking

Updated: 2026-11-05. Owner: Line. Current version: 2.0.0. Implementation is complete on `redesign/theme-planets`; release checks remain separate.

## Redesign phases

- [x] P1 Foundation: theme registry and tokens, fonts, pre-paint preferences, provider, dock, pixel planets, header, footer, splash styling.
- [x] P2 Sections A: hero and orbital artwork, About, Stack.
- [x] P3 Sections B: project rows and modal, DABM, Record and modal, Contact and form.
- [x] P4 Polish: section companion, header hide/reveal, theme stamp, per-theme contrast gate, Saturn icons, alias and dead-rule cleanup, documentation.

## Verify + Deploy

- [ ] Production build: `pnpm build`.
- [x] Contrast: `pnpm check:contrast`; all root and theme tables pass (2026-11-05).
- [x] Four-condition splash probe: JavaScript on/off × normal/reduced motion, plus stored motion off (2026-11-05, local Chromium dev server with fallback fonts; production repeat pending).
- [ ] Lighthouse ≥ 95: performance, accessibility, best practices, SEO.
- [ ] Mobile and desktop QA: 320–1440px, navigation, companion, modals, form, CV.
- [ ] Web3Forms public key set for anhtrannam097@gmail.com and authorized delivery test completed.
- [ ] Line approves and authorizes merge to main.
- [ ] Deploy approved revision to Vercel at linelulan.vercel.app.

TypeScript and lint also gate review: `pnpm exec tsc --noEmit` and `pnpm lint`. Record actual results in the session handoff; unchecked items are not claimed as passed.

## Weekly notes

### 2026-11-05

Orbit replaces the previous visual system with warm paper, a single purple accent, editorial typography, and pixel planets. All seven sections use the shared tokens. The theme dock persists appearance and motion preferences. The finishing layer adds the section companion, desktop header behavior, theme-aware stamp, and generated Saturn icons. Documentation describes the current architecture; release measurements and deployment remain gated by Line.

## Bug log

| Date | Symptom | Cause | Fix |
| --- | --- | --- | --- |
| 2026-11-05 | Intro does not show on reduced-motion machines | Motion preference skips the intro instead of reducing its animation | SSR-visible splash retains its hold delay while CSS shortens animation durations |
| 2026-11-05 | Hero is invisible without JavaScript | Initial animation opacity hides above-the-fold content | SSR-visible hero uses CSS reveals; layout retains a noscript fallback |
| 2026-11-05 | Hydration mismatch from useReducedMotion | Server and first client render choose different content from motion state | Stable initial markup and counter values; motion-dependent updates happen after hydration |
