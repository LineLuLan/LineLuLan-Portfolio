# Maintainer guide

Line owns this portfolio. The current design authority is [Orbit](docs/design/theme-orbit.md). [TRACKING.md](TRACKING.md) records the remaining release checks.

## Run and verify

Use `pnpm install`, copy `.env.local.example` to `.env.local`, then run `pnpm dev`. Configure the public Web3Forms key and Vercel site URL before building. Do not put secrets in public variables.

Run `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm check:contrast`, and `pnpm build`. Use `pnpm start` to probe the production build.

## Content and routes

| Change | Location |
| --- | --- |
| Profile, narrative, facts, stats | content/profile.ts |
| Skill tiers | content/skills.ts |
| Projects, filters, DABM mappings | content/projects.ts |
| Framework copy | content/dabm.ts |
| Experience and achievements | content/chronicles.ts |
| Shared content shapes | types/index.ts |
| Social URLs, section ids, CV paths | lib/constants.ts |
| Homepage assembly | app/page.tsx |
| CV route rewrite and response headers | next.config.mjs |

Add projects with a stable unique slug and the typed fields in `Project`. Links are optional; classified projects appear in the static In orbit list. Add events to the `chronicles` array with a unique id, date, type, and title. The UI groups events into organizations, education, and achievements and sorts each group newest first. Use description or link for an interactive event; `ongoing` renders Present. Placeholder day `-01` renders only month and year.

The `/line-cv` rewrite serves the PDF inline. When renaming the PDF in `public/cv/`, update `CV_FILE` and the rewrite and header paths in `next.config.mjs` together.

## Theme system

`lib/themes.ts` defines the registry, default theme, validation, and storage keys. `app/themes.css` supplies Orbit in `:root` for SSR and no-JavaScript visits. Each `html[data-theme="id"]` block overrides those tokens. `tailwind.config.ts` maps semantic classes to CSS variables.

The inline pre-paint script in `app/layout.tsx` reads `line.theme` and `line.motion` before rendering the page. It validates theme ids and catches storage failures, then sets `data-theme` and `data-motion` on the root element.

`ThemeProvider` starts with the same default state on the server and first client render. After hydration it adopts the pre-paint attributes. It persists changes, syncs across tabs, tracks system reduced motion, and updates the theme-color metadata. `ThemeDock` selects preferences. `ThemeStamp` reads the registry through the provider; changes after hydration are ordinary state updates.

Add a theme with one registry entry and one CSS block, then run the contrast gate. Use six-digit hex color tokens. The checker prints a root table and a table for every theme, inheriting omitted tokens from the root.

## Layout and motion

Components are grouped by feature. Pixel grids and section assignments live in `lib/pixel-planets.ts`; `PixelPlanet` renders them. The companion mirrors the header's section observer and is hidden below 480px. The header remains visible and includes `ReadingProgress`, a decorative page-progress indicator that uses motion values rather than React scroll state.

`MotionProvider` uses MotionConfig with the system preference and the dock's motion setting. Global CSS handles `data-motion="off"` and reduced motion. The hero is server-rendered and uses CSS reveals timed with the splash fade. The splash dismisses through CSS even without JavaScript. Keep the noscript fallback in the layout. `StatsCounters` reads the shared `ThemeProvider` preference.

`app/effects.css` contains atmosphere, word entrances, card depth, control feedback and disclosure entrances. `ConstellationField` draws the pointer-responsive hero background at up to 30fps/1.5× resolution and suspends offscreen or hidden-tab work. `MobileOrbit` supplies the compact decorative phone artwork. `RevealWords` preserves server-rendered text and skips entrances with Motion Off. `OrbitStage` and `ProjectSurface` add fine-pointer spring movement; keyboard focus, pointer exit and Motion Off reset it, and project pointer-down also resets before dragging. The carousel uses container-relative negative margins on mobile to avoid counting the Windows scrollbar in its width.

`ThemeDock` keeps exiting panels inert and preserves Escape focus return. Mode/accent changes progressively enhance with a circular native View Transition, with interruption and motion-off fallbacks. A revision guard prevents skipped transition callbacks from overwriting a newer selection, including after Motion Off is toggled. `node components/ThemeDock.browser.test.mjs` covers these rapid-choice cases against localhost. Keep hover movement limited to fine pointers, and preserve static border/color feedback with motion disabled. The current direction and verified cases are recorded in the motion section of `docs/design/theme-orbit.md`.

`AnchorScroll` owns once-only component reveals through `app/reveals.css`. It arms only offscreen blocks; initially visible and no-JavaScript content stay readable. Use `data-reveal="depth"` for cards, `slide` for facts, `showcase` for the carousel/form and `stats` for counters. Group children use `data-reveal-child` with `--reveal-order`. The 600–700ms entrances combine perspective, quick blur resolution and restrained clipping; child delays are capped and the full sequence stays under a second. Mobile motion is smaller. Completion waits for child and sheen animations; section-link navigation starts destination reveals on arrival. Focus and Motion Off clear every transform, filter, clip and child effect immediately. Avoid nested reveal roots and existing Framer transform nodes. Keep the separate DABM, timeline and counter animations. Run `node components/layout/reveals.browser.test.mjs` against the local production preview for reveal, focus, preference, section-budget and responsive-spacing coverage.

## Splash regression probe

Section 7 of the design brief requires the hero to remain visible without JavaScript and the splash to work under reduced motion. Probe all four combinations on a fresh load:

| JavaScript | System motion | Expected |
| --- | --- | --- |
| On | Normal | Splash appears, dismisses, and reveals usable hero content |
| Off | Normal | CSS dismisses the splash; the hero remains visible |
| On | Reduced | With no explicit stored override, pre-paint Motion Off skips the splash and leaves the hero usable |
| Off | Reduced | CSS dismissal completes; hero text remains visible |

For each combination, inspect the initial splash and the state after its two-second dismissal window. Check heading visibility, scroll access, and absence of hydration errors when JavaScript is enabled. Separately test stored `line.motion=off`: the splash is hidden, the hero is visible, and motion is disabled. Check desktop and phone widths.

## Forbidden patterns

- No inline hex colors in UI components. Use semantic classes and CSS variables. The pixel-art pink and ImageResponse icon palettes are the design's explicit exceptions.
- No compatibility alias classes.
- No JavaScript-gated above-the-fold content.
- No framer-motion `initial` on the hero.
- No theme ships before the contrast check passes.
- No untyped content or `any`; keep content separate from presentation.
- No private keys in browser code. The Web3Forms access key is public by design.

## Troubleshooting and release

| Symptom | Check |
| --- | --- |
| Theme does not persist | Registry id, pre-paint attributes, browser storage, ThemeProvider |
| Animation stays static | System reduced motion and line.motion |
| Contact fails | Public Web3Forms key, ContactForm validation, network response |
| CV fails | CV_FILE and the PDF asset |
| Icons fail | ImageResponse routes and Saturn grid palette |
| Contrast gate fails | Reported text/background pair in app/themes.css |

Deploy the approved revision to Vercel with the public environment variables and `linelulan.vercel.app` domain. Line authorizes Git writes and deployment. See README for setup and TRACKING for release checks.
