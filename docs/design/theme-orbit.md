# Design brief — Theme 01 "Orbit"

Status: R2 implemented · 2026-11-06; browser/build acceptance pending supervisor review
This file is the brief every implementation packet reads. Reference: tamir39.com (Swiss / Editorial art direction, theme dock, wide project rows). The implementation is original; nothing is copied from that repository.

## 1. Goals

1. Professional, readable for everyone: recruiters scan in 10–30 s, engineers go deeper, screen readers get the full story. Readability beats effects every time.
2. A distinct character: pixel-art planets on warm paper with Kafka purple as the default of five accents. Nobody should mistake it for the reference site.
3. A theme system: Orbit is theme 01. Later themes plug into the same tokens and the same dock without touching sections.
4. Keep the 7-section content model and the typed `content/*.ts` data. Restyle everything; reorganize inside sections only where it improves scanning.

Non-goals: interactive playground (phase 2), cursor decorations, roaming AI mascot, framework upgrades (stay on Next 14 + Tailwind 3 + framer-motion 11).

## 2. Theme architecture

- `lib/themes.ts`: the Orbit family registry plus typed `modes`, `accents`, validators, defaults and paper colors. Existing `line.theme` and `line.motion` remain; `line.mode` and `line.accent` persist the new independent choices.
- `app/themes.css`: `:root` is light Kafka for SSR/no-JS; `html[data-mode]` supplies base tokens and `color-scheme`, and combined mode/accent selectors supply accent tokens. The family remains `data-theme="orbit"`. Planet pink has a brighter dark variant.
- The pre-paint script derives validation lists from the registry. Stored light/dark wins; absent/invalid mode follows `prefers-color-scheme`. Absent/invalid accent uses Kafka. Storage denial is harmless. Mode and motion each track explicit versus system sources.
- `ThemeProvider` adopts pre-paint attributes, exposes theme/mode/accent/motion setters, follows live OS changes when no explicit preference exists, synchronizes storage changes/removals/clear across tabs, and updates the theme-color meta to the active paper.
- `ThemeDock`: fixed bottom-left 44px trigger labelled with mode/accent. The panel contains Light/Dark segmented buttons, five labelled round accent swatches with an active check and visible focus, and the existing Motion switch. Tab/Enter/Space, Escape with focus return, and outside click remain supported.
- Tailwind: `tailwind.config.ts` maps semantic names to the tokens below. Old names (`void`, `midnight`, `card`, `accent-purple/magenta/pink`, `text-*`, `border-*`, `rule-*`) are removed once no component uses them.

## 3. Tokens (Orbit, light)

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#F8F7F4` | page background |
| `--color-surface` | `#EFEDE8` | section bands, inputs |
| `--color-panel` | `#FFFFFF` | cards |
| `--color-ink` | `#1A1726` | headings, body |
| `--color-muted` | `#45414F` | secondary text (contrast 9.24:1 on paper) |
| `--color-accent` | `#8F2D9A` | links, accent line, buttons (6.5:1 on paper) |
| `--color-accent-hover` | `#6F2278` | hover |
| `--color-on-accent` | `#FFFFFF` | text on accent |
| `--color-line` | `#CBC6D4` | hairlines, borders |
| `--color-tint-a` | `#EFE6F6` | lavender tint (project rows, contact band) |
| `--color-tint-b` | `#F7E6EC` | blush tint |
| `--color-tint-c` | `#E8EAF2` | mist tint |
| `--color-selection` | `#E9D5F5` | ::selection, pressed chips |
| `--color-success` | `#2F6B4A` | form success |
| `--theme-radius` | `6px` | cards |
| `--theme-control-radius` | `4px` | buttons, chips |
| `--theme-shadow` | `0 1px 0 var(--color-line)` | base surface; local hover elevation lives in effects.css |
| `--theme-duration` | `180ms` | transitions |
| `--theme-ease` | `cubic-bezier(0.2, 0, 0, 1)` | transitions |
| `--pixel` | `4px` | pixel-art cell size |

Rules: no inline hex in components. Only the orbit avatar uses a soft tint-a glow; no blur, grain, scanline, or glass. One accent only; pink `#E07B97` appears only inside pixel art and tints, never as text.

### Mode and accent palettes (2026-11-06)

All supplied values pass the 4.5:1 text gate without adjustments. Each of the ten combinations checks 12 pairs, including muted/panel; the no-JS root is checked separately.

| Base token | Light | Dark |
|---|---|---|
| `paper` | `#F8F7F4` | `#0F0D17` |
| `surface` | `#EFEDE8` | `#161322` |
| `panel` | `#FFFFFF` | `#1C1929` |
| `ink` | `#1A1726` | `#EEEBF5` |
| `muted` | `#45414F` | `#B4AFC4` |
| `line` | `#CBC6D4` | `#3A3550` |
| `tint-b` | `#F7E6EC` | `#2A1B26` |
| `tint-c` | `#E8EAF2` | `#1B1E2E` |
| `success` | `#2F6B4A` | `#6FD3A8` |
| `on-accent` | `#FFFFFF` | `#14111E` |

| Mode | Accent | Accent | Hover | Tint A | Selection |
|---|---|---|---|---|---|
| light | kafka | `#8F2D9A` | `#6F2278` | `#EFE6F6` | `#E9D5F5` |
| light | nebula | `#2952CC` | `#1F3FA3` | `#E4EAFB` | `#D3DDF9` |
| light | aurora | `#1F7A5A` | `#175E45` | `#E2F2EB` | `#CDEBDD` |
| light | mars | `#B4471F` | `#8F3818` | `#F8E7DF` | `#F3D3C4` |
| light | rose | `#B8306A` | `#922553` | `#F7E3EC` | `#F1CCDC` |
| dark | kafka | `#D08BE0` | `#E3B0EE` | `#2A1F38` | `#4A2D5A` |
| dark | nebula | `#8FA8FF` | `#B5C6FF` | `#1C2340` | `#2E3A6B` |
| dark | aurora | `#6FD3A8` | `#9BE3C4` | `#16302A` | `#22503F` |
| dark | mars | `#FF9A6B` | `#FFBA97` | `#33201A` | `#5A3324` |
| dark | rose | `#F28BB4` | `#F7B2CE` | `#331A26` | `#5A2B40` |

Browser and Apple icons are static 32?32 and 180?180 PNGs generated from `public/avatar-pixel.png`: center-sampled nearest-neighbor pixels inside a circular transparent mask, without interpolation. Next.js file conventions replace the former Saturn generators; no request-time image work or new dependency is required.

## 4. Typography

- `--font-sans`: Manrope, weights 400/500/700/800, for body text and tool chips.
- `--font-display`: Space Grotesk, weights 500/700, for all headings. Both fonts use Latin, Latin-ext and Vietnamese subsets with `display: swap`.
- `--font-mono`: JetBrains Mono 400/500 for metadata, eyebrows and dates.
- Hero H1: upright display 700, `clamp(2.5rem, 1.5rem + 3vw, 4.25rem)`, line-height 1.02, tracking -0.035em. “Chill in coding” is ink; “feel in styling.” is accent (Line, 2026-11-06). The availability chip shows live Vietnam time (GMT+7).
- Section H2: upright display 700, `clamp(2rem, 1.4rem + 2.2vw, 3rem)`, line-height 1.1, tracking -0.03em. Only the final period is accent.
- Eyebrow: mono 14px/1.5, weight 500, tracking 0.02em, ink. Section format: planet, muted two-digit index, then a capitalized label.
- Labels use sentence case, retaining official brand capitalization. Body paragraphs use ink; metadata uses muted. No italic styles.

## 5. Pixel planet system

`components/pixel/PixelPlanet.tsx`: renders an inline SVG from a 16×16 (or 12×12) string grid where each character maps to a token color (`.` transparent, `i` ink, `a` accent, `p` pink, `l` lavender, `m` mist, `s` surface, `w` white). `<rect>` per cell, `shape-rendering="crispEdges"`, `aria-hidden` unless a `label` prop is given. Size prop in px (multiples of the grid). Colors come from CSS vars so themes recolor them.

Planet set (`lib/pixel-planets.ts`), one per section plus extras:

| Section | Planet | Character |
|---|---|---|
| 01 whoami | Saturn (ringed) | the signature; also the dock symbol and favicon |
| 02 about | Earth-like (two tones + a cloud) | |
| 03 experience | Satellite | |
| 04 stack | Mars (small, crater) | |
| 05 work | Jupiter (banded) | |
| 06 framework | Neptune (deep accent) | |
| 07 record | Moon (crescent) | |
| 08 contact | Comet (streak) | |

Hero artwork (`components/hero/OrbitSystem.tsx`): exactly three ellipses tilted -12 degrees, ry/rx 0.62, rx 140/215/310. The outer radius was tuned from 290 within the approved +20 bound. Shared constants live in `lib/orbit-layout.json`.

- Ring 1: Earth 36px at 0 degrees, Satellite 32px at 90 degrees and Moon 32px at 180 degrees, 60-second revolution.
- Ring 2: Mars 40px at 90 degrees and Neptune 44px at 270 degrees, 90-second revolution.
- Ring 3: Saturn 52px at 30 degrees, Jupiter 52px at 150 degrees and Comet 44px at 270 degrees, 130-second revolution.
- The center avatar has radius 56px, a 2px accent ring and a soft tint-a radial glow. Ring strokes are 1.5px line color.
- Nested static SVG transforms define the ellipse; CSS rotates each planet and counter-rotates its sprite, maintaining upright, unsquashed artwork without JS. Hover/focus pauses every ring. Planet hover/focus scales to 1.12, highlights its ring and reveals a panel label in mono 14px ink.
- The calculated 730×524 viewBox includes the full orbit, hit targets, labels, hover scaling and 16px padding.
- `pnpm check:orbit` reads the same layout JSON and actual painted sprite cells. It sweeps 2340 seconds at 0.25-second intervals (9361 samples), requiring at least 8px clearance from the avatar and between planets, including the entire hover-scale range. Labels are excluded because motion pauses while they are shown.
- The hero grid uses line color at 22%. Pixel stars twinkle between opacity 0.35 and 1 over staggered 3–6-second cycles.

Companion (`components/pixel/OrbitCompanion.tsx`): a 32px active-section planet in a 44px section link at bottom-right, with a 160ms hop. Hidden below 480px.

### Pisces constellation (2026-11-07)

Hovering the figure aligns its eight planets with Line's 669×616 Pisces reference. `components/hero/pisces.ts` records the original orientation, section stars, minor stars, segments and label sides. `lib/constellation-fit.ts` uniformly fits that data into the unchanged viewBox; `node scripts/check-constellation.mjs` checks numbering, all bounds, label collisions and line-endpoint clearance. Experience uses ring index 0, phase 90°, size 32px; the painted-cell sweep supports its existing 12×12 satellite grid.

The server renders eight real anchors. The client pauses the existing CSS timelines before measuring each upright home group's `getScreenCTM()`, converts destinations into that local coordinate system, and transitions only an inner flight group (700ms, 40ms stagger). CSS transitions reverse from the current position. Return flights finish before the original orbit timelines resume. No anchor is replaced: keyboard focus enters constellation mode, Escape retains focus in orbit mode, and leaving the figure ends constellation mode. Hover enter/leave uses a 120ms debounce. On no-hover/touch devices, the first tap aligns, a second tap on a planet navigates, and an empty-space tap returns. The existing compact phone artwork remains unchanged below the figure's 768px breakpoint.

Rings fade out and the avatar fades to 0.15. After the last planet arrives, accent segments draw over 400ms, minor stars appear and numbered mono labels fade in. Hover/focus emphasizes the label and directly connected segments. Motion Off switches instantly and freezes orbit timelines without resetting their phase. Captions are “Hover to align the planets · click to jump”, “Tap to align the planets” on touch, and “Pisces · follow the stars 1 to 8” when aligned.

Chromium measured identical before/after hero heights: 819px at 1440×900 and 999px at 1920×1080; the figure remains 381.72px tall. Checks cover 85 widths from 320–2000px, persistent keyboard focus, touch interception, interrupted flights, instant Motion Off and hydration. These measurements use fallback fonts because Google Fonts requests are blocked in the local environment. API references checked 2026-11-07: [SVG coordinate matrices](https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getScreenCTM) and [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/transition). No dependencies or external runtime requests were added.

## 6. Layout and sections

Container: `max-w-[1200px]`; side padding 24px (phones) / 40px / 64px. Sections retain the full-width hairline. Shared headings leave 24px before the following content, with compact 16px Record and 12px Contact compositions.

Desktop slide layout: one media query, `(min-width: 1024px) and (min-height: 720px)`, gives every non-hero section `min-height: calc(100svh - var(--header-h))`, border-box sizing and 32px top/bottom padding. Content stays top-aligned; Contact centers its content and shares the final screen with the footer. Outside that query, padding is 56px top/bottom with no minimum height. Minimum height lets smaller screens or enlarged text grow naturally instead of clipping. The hero retains its own layout. `AnchorScroll` measures the sticky header with ResizeObserver into `--header-h`; the default is 81px, with existing narrow-header fallbacks. `--header-height` aliases it for the hero.

At 1440×900 with an 81px header, sections target 819px total: 64px padding, 1px rule and up to 754px content. Content may grow beyond the minimum at shorter desktop heights or with enlarged text, preserving its padding and access to every control. Browser checks cover desktop section budgets, all 21 Record milestones, Work slides and narrow-screen overflow.

### Header (`components/layout/Header.tsx`)
Sticky top, paper background with a bottom hairline. Left: pixel Saturn mark + `Line`. Center/right: links `About · Stack · Work · Framework · Record · Contact`. Right: `Open CV` outline button + 36px round pixel avatar. Under 900px: links collapse into a disclosure button (`aria-expanded`), Escape closes and returns focus. The header stays fully visible at every scroll position.

### 01 whoami (Hero)
Desktop hero: text and orbit in a 1.5:1 grid, with stats below. At >=1024px its minimum height is `100svh - --header-height`, and the full content group is vertically centered. The eyebrow is `01 AI / ML Engineer · Data Engineering`. The profile row contains name and title; the avatar remains in the header and orbit. Positioning is ink, 18px/22px. All four actions remain: Open CV, Let's connect, GitHub and LinkedIn. Stats use sentence-case labels. Hero text uses CSS reveals and is server-rendered; the splash dismisses even without JS.

### 02 about
Two columns at lg: left `narrative.intro` + `narrative.mission` as 17px/28px paragraphs followed by `Currently exploring` (15px sans chips); right a definition list from `profile.facts` with approximately 44px rows (wrapping grows naturally). Below: `What I bring` uses one/two/four columns at base/md/lg, 16px padding, 24px pixel planets, display 18px bold titles, ink 15px/24px descriptions and accent mono 13px proof rows. All supplied copy remains.

### 03 stack
Six groups: Languages; ML & modeling; LLM & agents; Data engineering; Backend & MLOps; Cloud & web. Cards form one/two/three columns by breakpoint, with 20px padding, display 18px titles and 14px muted captions. Named simple-icons imports supply 18px logos. Official custom SVG marks supply OpenAI, Groq, Cerebras, Java, MySQL, LightGBM (cropped mark only), and PyMC; original tree/arrow and database motifs supply XGBoost and SQL. Each path below 3:1 against the active white/dark panel (or the light warm-paper chip background) uses currentColor (ink), selected by CSS from precomputed light/dark flags. OpenAI always uses ink. No monograms remain. Source geometry was supplied on 2026-11-06: LobeHub (MIT), Iconify logos (CC0), microsoft/LightGBM docs (MIT), and pymc-devs/brand. Tool chips are sans 14px with 36px minimum height and 6px gaps. Practices use 13px chips. Methods is one inline chip row below the grid on desktop, wrapping on smaller screens.

### 04 work (2026-11-06)
The unchanged section heading and right-hand introduction lead into a circular draggable carousel. Listed order is GoiBERT-M (lead, Saturn), EnStudy-Hub (Earth), Ezidatic (Neptune), Panic Hub (Jupiter). Dengue remains available by direct URL but is unlisted; classified slots and filters are removed. The active card is centered; neighbors peek at 88% scale and 55% opacity. Cards use semantic tints, theme radius, 32px padding, a 72px planet, role/index eyebrow, 36px display title, 18px tagline, up to five shared stack-logo chips, external links, and an Open project link.

Arrow buttons, dots, keyboard arrows, neighbor selection, and horizontal touch drag select projects. Drag advances at more than 25% of slide width or velocity above 500px/s. Counter and progress reflect the active item. Inactive content is aria-hidden and inert; pointer-only overlays select neighbors. Motion Off makes transitions instant while preserving drag. Mobile cards are 86vw inside a clipped viewport. Measured Chromium content at 1440x900: 641px, with an 819px section including its screen-height minimum.

### Project story pages
Validation note (2026-11-06): Chromium interaction checks passed for routes, metadata, 404s, return-to-home focus, keyboard controls, touch drag with motion on/off, backward-wrap animation, and page overflow at 320/375/390/768/1024/1440px. The local dev server could not fetch Google Fonts (`EACCES`), so the reported section measurements and screenshots use fallback fonts. Final configured-font typography and non-Chromium browser acceptance remain unverified. No package changes were made.

`/projects/[slug]` statically enumerates all five real projects, including unlisted Dengue, and returns notFound for unknown slugs. Metadata derives from name/tagline. Each story reuses Header, Footer, ThemeDock, the shared stack chips, and the external action set (Paper, Live demo, GitHub, Watch video). Header links use /#section on story routes and plain #section on home. AnchorScroll rebinds on pathname changes, waits for fonts/load, and restores section position and focus.

The hero contains an All projects link, planet, 56px desktop name, tagline, role/year/status and actions. Existing problem/data/approach/results/why fields become numbered chapters only when present, at a maximum 68ch reading width. Chapters reveal once and respect Motion Off. Panic Hub embeds its supplied video in a lazy 16:9 youtube-nocookie frame with encrypted-media and picture-in-picture only. DABM mappings, stack, existing collaborators, the fuller-case-study note and circular previous/next links follow. Public previous/next links only advertise listed projects. No new long-form claims were added.

### 05 framework (DABM, 2026-11-06)
The personal process replaces the project picker. The lead is "Data first. Systems that behave. Models you can trust." (28px display), followed by the supplied 17px introduction. Four numbered steps, Data / Agent / Behavior / Modeling, use the exact supplied sentences, 22px display titles, pixel letter badges, and Earth / Saturn / Jupiter / Neptune nodes. The layout stacks on phones, uses two columns at md, and four at lg, where a dashed orbit line draws once behind the nodes. Steps stagger in, with instant rendering when motion is off. The closing link returns to Work. Measured Chromium content at 1440x900: 589px, with an 819px section.

### 06 record (2026-11-06)
One chronological list of all 21 milestones replaces year tabs. At lg, the SVG road has up to six nodes per row across four rows, alternating direction with smooth semicircular turns. Desktop labels stay centered over their own nodes with widths bounded by the available column, including at 1024px. Below lg, the same buttons follow a gentle vertical curve with left/right HTML labels. The server supplies its calendar date as a stable hydration prop; dates after that boundary have a dashed approach and a `Next` label. The travelled path uses accent, draws once in 1.2 seconds, and nodes pop in with a 45ms stagger. Motion Off renders the path and markers immediately; ongoing roles pulse only with motion enabled.

Each 18px marker sits inside a 44px button and uses its type token: education ink with tint-c ring, role accent, award success, event muted, project accent outline. Moon / Earth / Saturn / Comet / Jupiter glyphs repeat in the five-type legend. Labels use 12px mono dates and 14px, two-line titles no wider than 190px. On desktop labels alternate above/below by column, keeping matching columns on the same side across rows to prevent collisions.

Hover, keyboard focus, or a touch tap opens an adjacent panel with the date range, full title, organization, description and optional link. Escape dismisses even when the card opened by hover while focus stayed outside Record; keyboard dismissal restores the node. Touch taps toggle, and Tab follows chronological order with the open card's controls immediately after its node. The unused EventModal was removed. All 20 milestone titles remain in server-rendered HTML, with no-JS styles restoring the road and markers.

Chromium measured 722.8px content inside an 819px section at 1440x900. The 580px road leaves room for the unchanged heading and legend. Geometry/date/SSR regressions run in `scripts/check-navigation-motion.mjs`; browser coverage is `node components/chronicles/career-path.browser.test.mjs` with the local dev server on port 3000.

### 07 contact (2026-11-06)
Contact alone vertically centers its content inside the desktop screen section and keeps the full-width tint-a band. Above the left-column copy, an aria-hidden 196px scene contains a 180px pixel Saturn, tilted orbit with two moons, a crossing comet with pixel trail, and twinkling stars. Gentle CSS motion obeys the shared Motion Off switch. Artwork occupies its own space so it never sits behind the text.

The heading remains `Let's build something.` and the 17px ink invitation is `Hiring for an AI / ML or data role, or have a research idea worth testing? My inbox is open.` The panel email card uses a 24px display-font mailto link and a Copy button. Success announces `Copied` politely for two seconds. Missing or rejected Clipboard API access selects the address and announces manual-copy instructions. Social buttons use siGithub, lucide Linkedin, and siKaggle with visible labels; Open CV retains `cv_open` tracking from `contact_section`.

The existing ContactForm is unchanged, including submission, validation, error and success behavior. Chromium measured 536.8px content inside an 819px section at 1440x900, with 141.6px/140.6px top/bottom gaps (the difference includes the top border). Record and Contact passed keyboard, hover, touch, clipboard success/failure, Motion Off and 320/375/768/1024/1440/1920px overflow checks. Motion On path completion, dark token rendering, and all 20 titles with JavaScript disabled also pass. The local font faces are Next.js fallback faces, so these dimensions still need confirmation with the deployed Google fonts. Live form submission and non-Chromium engines are not covered by this rewrite's browser test.

## 7. Motion, navigation and accessibility

- Motion is explicit-or-on (Line, 2026-11-07). Stored `line.motion=on|off` wins; missing, invalid or inaccessible storage defaults to On regardless of OS reduced motion. The pre-paint script sets effective `data-motion` and `data-motion-source=user|default`. Cross-tab storage changes stay synchronized; removal/clear restores On/default.
- The dock's switch state reflects the effective value. Its obsolete “(system)” suffix comparison requires a one-line follow-up outside this task's file scope.
- MotionConfig uses `always` when off and `never` when on. Framer opacity transitions also receive zero durations when off. Redundant OS reduced-motion CSS fallbacks are removed; effective `data-motion="off"` remains the motion gate.
- `html[data-motion="off"]` disables CSS animations and transitions. Section eyebrows and titles reveal once with a 16px rise over 500ms and 60ms stagger; cards and Stack groups stagger by 50ms. Primary buttons lift 2px on fine-pointer hover when motion is on.
- `AnchorScroll` handles same-page anchors globally. Hero goes to zero; every other destination uses `max(0, sectionTop - headerHeight)` without centering. Navigation pushes the hash, closes the mobile menu, and focuses the section without another scroll. Hash loads wait for load/fonts/layout; browser history uses the same rule. Modifier clicks retain native behavior. CSS `scroll-margin-top: var(--header-h)` supplies the no-JS fallback.
- Contrast: all checked text/background pairs reach 4.5:1 or better across all ten mode/accent combinations and the no-JS root.
- Focus: 2px accent ring on interactive elements; destination sections are programmatically focusable without a visible section outline. Skip link and modal focus handling remain.
- Headings: one H1, section H2s, card/subsection H3s. CSS and noscript fallbacks keep content available without JS.

### Polished and playful effects (2026-11-06)

The selected direction adds subtle depth within the existing palette. `app/effects.css` owns the shared surface, control, navigation and atmospheric effects; no dependencies or content were added.

- The hero has a low-opacity accent atmosphere. Its two background shapes drift only at tablet/desktop widths with Motion On. The 550ms hero reveals start during the existing splash fade, so their entrance is visible.
- `OrbitStage` wraps the server-rendered SVG with spring-driven movement, bounded to 5px translation and 3 degrees of tilt. It responds to a fine mouse pointer, settles on exit, and resets for keyboard focus or Motion Off. Planet links and the verified orbital geometry remain intact.
- Capability, stack and project cards gain restrained elevation and a 3px hover lift. Decorative card planets tilt slightly; primary controls use 0.96 press feedback. Static tool chips change color without moving. Touch and Motion Off keep the static feedback.
- Header links have animated underlines. `ReadingProgress` draws a 2px page-progress line using motion values, with direct updates when motion is off. The header remains visible.
- The appearance panel enters in 200ms and exits in 120ms. Exiting content becomes inert immediately, Escape restores trigger focus, and interrupted transitions recover. Mobile navigation and milestone details use short entrances.

Verified against the production build with configured Google fonts: TypeScript, ESLint, contrast (11 palettes), orbit geometry, navigation/motion checks, carousel unit checks, both project/career Chromium suites, and a local effects probe. The probe covered pointer reset, keyboard targets, interrupted dock transitions, live Motion Off, system reduced motion, 320–1920px overflow, dark/accent changes, and no-JavaScript hero/splash behavior. The career suite now checks label collisions at each desktop width. No live message delivery or deployment was performed.

### Expressive motion refinement (2026-11-07)

The stronger motion request keeps the same copy, tokens and pixel-space identity:

- `ConstellationField` connects gently drifting pixel stars, with nearby points and lines responding to the mouse inside the hero. It caps its backing resolution at 1.5× and drawing at 30fps, suspends offscreen/background work, and disappears with Motion Off. The existing static stars remain as the fallback.
- `MobileOrbit` supplies a compact, decorative avatar/planet composition below the hero actions on screens below 768px. The full linked desktop orbit retains its existing geometry and keyboard behavior.
- `RevealWords` adds staggered, clipped word entrances to the hero and section headings. Text stays server-rendered and readable without JavaScript; Motion Off bypasses the animation.
- `ProjectSurface` gives the active project a spring-driven tilt of up to 3.5 degrees and a localized accent light. Pointer-down, exit and keyboard focus reset the effect; touch gestures and inactive slides keep stable geometry. Motion Off clears transforms immediately.
- Mode and accent buttons use a 600ms circular View Transition from the selected control. Rapid changes skip the preceding transition, Motion Off cancels it, and browsers without the API switch immediately.

Verified with the production build: TypeScript/lint, contrast, navigation/motion, orbit geometry, carousel state, both existing Chromium browser suites, and an effects probe for canvas suspension, pointer/focus resets, theme interruption/fallbacks, no-JavaScript text and 320–1920px layout. The live Windows preview also verified the mobile orbit and no horizontal overflow with a visible scrollbar. First-load homepage JavaScript is 196kB; no dependencies were added.

### Spacing and component reveals (2026-11-07)

Primary hero actions and social links occupy separate groups with 16px between them. The availability badge has vertical padding when it wraps. Stats sit 32px after the hero content and 24px below their rule; smaller suffixes, tablet gaps and responsive numeral sizes keep GPA on one line. Shared section headings use a 24px content gap, with the intentional compact Record and Contact exceptions. Mobile project cards use 20px padding, expanding to 32px from `sm`; About labels use 84px on phones and 100px above. The Contact scene is 160px tall on phones and 196px from `md`.

`AnchorScroll` and `app/reveals.css` coordinate component reveals for About copy/facts/exploration, capability and stack cards, methods, Work introduction/carousel, framework introduction/link, mobile orbit/stats, and Contact invitation/form. Only offscreen blocks are armed. Capability/stack cards lift through perspective with a brief accent sweep; facts slide in; the carousel/form use a clipped, scaled entrance; chips and stat groups build in sequence. Entrances last 600–700ms, with quick blur resolution, parent delay capped at 120ms and child stagger capped at 250ms (the complete sequence stays below a second). Section words unfold through perspective over 600ms. Motion is reduced in size on phones, and clipping is removed when a showcase finishes. Destination entrances wait for section-link scrolling to settle. Initially visible content is never hidden, nested movement is avoided, focus reveals immediately, and Motion Off clears pending states without replay on re-enabling. Existing framework steps and timeline motion keep their own behavior. No-JavaScript markup remains visible.

### Experience, Framework and coverflow (2026-11-07, R5)

The section registry now has eight entries: About 02, Experience 03, Stack 04, Work 05, Framework 06, Record 07 and Contact 08. The hero deliberately filters out Experience and retains its seven verified planets; the companion uses the satellite for Experience. Seven navigation links stay on one row from 900px, with the header domain hidden to make room.

Experience uses Line's six supplied organizations and eight roles. Desktop organization tabs form a vertical list; below 1024px they become a horizontally scrollable row. Arrow keys follow orientation, Home/End jump, and only the selected tab is in the tab order. All role panels remain in server HTML. Roles use a grouped dot-and-line timeline, external SiteIcon links, bullets and skill chips. Dates count inclusive calendar months, merge overlapping promotion months, and render equal start/end dates as one month. A server-supplied month keeps hydration stable; the browser refreshes Present against the current month. Panel changes fade and slide only with Motion On.

Framework now follows a descending D-left, A-right, B-left, M-right zigzag. The four planet nodes share coordinates with a rounded SVG polyline, which draws on entry. Cards use the existing staggered data-reveal system. The desktop process height follows viewport height, and mobile uses one column with a vertical line. The lead, introduction, step copy and closing Work link remain intact.

Work uses 1400px perspective and a continuously sampled drag distance: centered cards have zero rotation/depth, full scale and opacity; neighbors reach opposite 28-degree rotation, 0.86 scale, -140px depth, 0.55 opacity and 1px blur. Spring settling retains circular recycling and the active card's existing pointer tilt/light. During drag, clamped text movement is 1x and the planet is 1.6x. Fine pointers see a following Drag/Release pill away from links and buttons; touch hides it. A nine-second accent conic ring marks the active card. Dominant horizontal wheel input accumulates to 80px and advances once per gesture, including momentum. Motion Off removes rotation, blur, parallax and ring animation, including before hydration; ordinary drag, keyboard and button navigation remain available.

Chromium acceptance on 2026-11-07 measured Experience at 618.1px and Framework at 731.5px inside an 819px screen at 1440x900. At 1920x1080, Framework measured 911.5px inside 999px. All six Experience panels fit the 740px content budget. Checked widths span 320–2000px with no page overflow or desktop header wrap. These local measurements use fallback font faces; configured-font and non-Chromium rendering remain to be checked. Tests are `components/experience/experience-dates.test.mjs`, `components/experience/experience.browser.test.mjs`, and `components/projects/carousel-state.test.mjs`, alongside the existing navigation, orbit and contrast gates. No packages or theme tokens changed.

### Experience photo stories (2026-11-07, R6)

Organization summaries and dated photo highlights now sit alongside the role timeline, with all story copy and image metadata in server HTML. At desktop widths, Experience fills `100svh - --header-h`; the right panel scrolls with edge fades while the organization list stays in place. Below 1024px, stories flow naturally. One shared native modal supports keyboard navigation, focus containment/restoration, backdrop/Escape dismissal and motion preferences. Record's three photo milestones use fixed 16:9 thumbnails; the KFC win is dated July 2026, with 20 milestones retained.

Chromium measured every organization at 819px section height at 1440×900 and 999px at 1920×1080. The new `experience-photos.browser.test.mjs` covers photo loading, panel scroll/reset, modal interactions, SSR and 320–2000px overflow. No packages or photo assets changed. API references checked 2026-11-07: [Next 14 Image](https://nextjs.org/docs/14/app/api-reference/components/image), [React lazy](https://react.dev/reference/react/lazy), and [native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).

### Transcript and section spacing (2026-11-07)

Framework keeps its shared node/connector coordinates, with symmetric card insets creating 40px same-column gaps. Body copy remains at least 15px. Experience places its header above the desktop tab list; the detail panel starts at the eyebrow and fills the same height as that left column. Mobile retains header, horizontal tabs, then flowing content. Line's expanded role copy and the IU academic-record link are in `content/experience.ts`.

`/transcript` is a server-rendered academic record using the shared Header, Footer, appearance controls and tokens. It shows portal cumulative stats, two directly labelled GPA series with keyboard tooltips and a hidden data table, letter counts, and newest-first course tables that stack on phones. Refresh with `pnpm import:transcript` (optional source path after the command); the dependency-free importer reads UTF-16LE HTML and writes `content/transcript.json`. It preserves published final-result columns, including P/NA with null scores. Five entirely blank 2026–2027 course rows are omitted to honor the requested 29 courses / 7 semesters. The latest published totals are 3.56/4.0, 86.0/100 and 72 credits; no GPA or credit totals are recomputed. Update the real-file test expectations when new results arrive.

Chromium measured Framework at 819px section / 731.55px content and Experience at 819px section / 754px panel at 1440×900, with 0px eyebrow/panel misalignment. At 1920×1080 the sections are 999px, Framework content is 911.55px and the panel is 934px. Both card-column gaps are 40px. `components/transcript/transcript.browser.test.mjs` checks 93 widths per route from 320–2000px, all ten palettes, hydration, keyboard values, IU navigation and no-JS results. Measurements use locally available fallback fonts; configured-font and non-Chromium rendering remain outside that coverage. Importer tests, TypeScript, lint, navigation/motion, orbit and contrast checks pass. No packages, remote data requests or client chart runtime were added. API references checked 2026-11-07: [Next 14 pages](https://nextjs.org/docs/14/app/building-your-application/routing/pages-and-layouts) and [static metadata](https://nextjs.org/docs/14/app/building-your-application/optimizing/metadata).

Production build also passes and marks `/transcript` static: 210B route-specific JavaScript / 155kB first-load JavaScript including the shared site shell. Both existing Experience browser suites pass after updating content counts and waiting for hydration in the reduced-motion photo case. Independent review found no remaining material defects. Native screen-reader behavior is not verified; shorter desktop viewports such as 1280×720 scroll Framework vertically to preserve readable content.

### Visitors (2026-11-07)

The global header chip opens a lazy-loaded map and top-five country panel. Total means accumulated daily unique visits, starting at zero. One shared poller posts every 45 seconds while visible; presence lasts 90 seconds. `localStorage['line.visitor']` stores a random UUID with a memory fallback. No raw IDs, IPs, user agents or cookies are stored by the server. The short-lived hashes are identifiers, not a claim of irreversible anonymization.

Redis uses only `REDIS_URL`, set by the Vercel ↔ Redis Cloud integration, with node-redis over TCP. Missing configuration uses empty memory storage in development; production returns 503/`{configured:false}`. A configured but unavailable database returns 503/`{configured:true,error:'unavailable'}`; the existing network-error behavior hides the chip. One lazy module-level client shares its in-flight connection promise. An error listener logs only a fixed message, never the URL. Socket connection timeout is 3s, the complete connection/handshake deadline is 4s, and the command deadline is 1.5s (at most about 5.5s combined, excluding event-loop delays). Deadline expiry destroys the socket. Offline queuing and background reconnects are disabled; a later request can reconnect through the same shared deadline.

Storage uses exact SET membership rather than approximate cardinality. IDs and rate fields use the first 9 bytes of SHA-256 encoded as 12 base64url characters; counting is exact for these stored hashes. Keys and admission policy:

- `v:t` and `v:c` retain total visits and country totals. Country codes normally produce about 250 small fields, including unknown-country fallback; the existing two-letter validation permits at most 676 codes.
- `v:d:<YYYYMMDD>` stores at most 50,000 ID hashes. `SISMEMBER` precedes the capacity check; only a successful new `SADD` can count. `EXPIREAT` is the next UTC midnight plus 3600s, so two day keys coexist only during the first hour. New IDs beyond the daily cap are neither added nor counted for the rest of that day. Existing members still update presence.
- `v:r:<YYYYMMDDHH>` is one hash per UTC hour, with at most 10,000 fields derived from `SHA256(ip + UTC-hour)` and an expiry of the end of that hour plus 60s. Only IDs not already in the daily set consult the rate budget. Each field allows 30 new daily IDs per hour. Existing fields remain usable when the field cap is full; new fields are rejected for that hour. Rate-limited IDs are still recorded in the capped daily set and remain excluded from totals for the rest of the day, even after changing IP or entering a new hour. Their heartbeats consume no further budget.
- `v:o` contains at most 5,000 ID hashes with timestamps. Every call prunes entries older than 90s before checking capacity. Existing members can refresh when full; new members wait for space without affecting their daily count. Non-bot POSTs set a 180s expiry. Bots and GET only prune this set and read statistics.

The caps trade excess-traffic coverage for a predictable storage budget: visitors beyond the daily or rate limits stop being counted rather than risking the 30 MB plan. The memory store uses the same policies, with injectable small caps for boundary tests. Estimated worst case: a 50,000-member daily set × ~70 B ≈ 3.5 MB, or ~7 MB for two sets during the first hour; a 10,000-field rate hash × ~60 B ≈ 0.6 MB, or ~1.2 MB for two hashes during the one-minute overlap; a 5,000-member online set × ~100 B ≈ 0.5 MB; counters are negligible. Total is about 9 MB, targeting less than 10 MB of the 30 MB plan. These are sizing estimates, not measured allocator usage; confirm `MEMORY USAGE` and database baseline overhead in the supervisor's live smoke test. The hard limits apply to cardinality, independent of expiry cleanup timing.

Every POST uses one atomic EVAL round trip. Internal Redis commands for an admitted new ID with new online presence: 18 with a new rate field, 17 with an existing field; a counted visitor's normal heartbeat uses 8; a new ID exceeding its existing field's 30-ID limit uses 15; a new IP rejected by the rate-field cap uses 14; a new ID rejected by the daily cap uses 10. These last three counts assume new online presence with room available. Online presence already existing saves one cardinality check; a full online set skips `ZADD`. Bot POSTs and GET use one EVAL containing 4 commands. Polling costs nominally 80 POSTs per visible tab-hour plus mount/resume requests; live TCP latency and billing remain unmeasured. Local tests cover memory semantics and mocked client failures; Lua execution is reserved for the supervisor's live smoke test because no local Redis/Lua runtime is installed.

`pnpm build:world-dots` generates 2924 points and 231 anchors (26640 bytes), using local polygon bounds when country-json has gaps and circular longitude bounds at the date line. A real polygon land sample preserves Fiji in the coarse grid. Unmatched names: England, Netherlands Antilles, Northern Ireland, Scotland, Wales. No bounds: Cocos (Keeling) Islands; Holy See (Vatican City State); Micronesia, Federated States of; Pitcairn; United States Minor Outlying Islands; Virgin Islands, British; Virgin Islands, U.S. These retain counts/list rows without map anchors. Centers snapped to land are approximate. References checked 2026-11-07: supervisor-provided node-redis 5.12.1 Context7 documentation and installed client source/types; [node-redis](https://github.com/redis/node-redis), [Redis EXPIREAT](https://redis.io/docs/latest/commands/expireat/). Before rollout, smoke-test a dedicated Redis instance. Rollback only this tracker diff, preserving pre-existing dependency changes.

## 8. Copy decisions (Line confirms)

Hero H1 options: (A) `Build things that survive` / `contact with reality.` · (B) `Data in.` / `Decisions out.` · (C) `Models you can defend.` / `Pipelines you can trust.` Default A (it is already Line's own line from the narrative).

Section headings: “Where research meets production.” · “Tools I ship with.” · “Selected projects.” · “The DABM framework.” · “Experience and milestones.” · “Let's build something.”

## 9. Phases (one worker packet each)

| Phase | Scope | Validate |
|---|---|---|
| P1 Foundation — done | themes registry, themes.css, Tailwind remap, fonts, ThemeProvider + pre-paint script + ThemeDock, PixelPlanet + planet set, Header, Footer, boot splash restyle, remove StarField/GrainOverlay/ClickSpark/GlitchText/TerminalPrompt/useTypewriter and the glass/neon CSS | tsc, lint, build, contrast script, screenshot |
| P2 Sections A — done | Hero + OrbitArtwork, About, Stack | same + mobile screenshot |
| P3 Sections B — done | Work rows + modal, DABM, Record + modal, Contact band + form | same + Playwright 4-condition probe |
| P4 Polish — done | OrbitCompanion, header hide/reveal, Lighthouse ≥ 95, docs refresh (README/PLANNING/TRACKING/HANDOFF), delete dead files | Lighthouse + a11y audit |

Each phase lands on branch `redesign/theme-planets`; `main` stays untouched until Line approves the whole redesign. Backup of the pre-redesign site: branch `backup/pre-ui-refactor-2026-11-05`, tag `v1.1.0-pre-ui-refactor`.

## Experience logo sources (fetched 2026-11-07)

- Twohearts: favicon from https://twohearts.vn/favicon.svg
- Hospital for Tropical Diseases HCMC: site icon from https://bvbnd.vn
- 100B Studio: icon from https://100b.studio/icon.png
- International University, VNU-HCM: 'Logo IUHCM.png' from Wikimedia Commons (CC BY-SA 4.0)
- GDGoC: Google Developer Groups favicon from https://gdg.community.dev
- Luyện thi Khai Tâm: site icon from https://luyenthikhaitam.com (logo confirmed by Line)

Logos are trademarks of their owners and are shown only to identify where Line worked.
