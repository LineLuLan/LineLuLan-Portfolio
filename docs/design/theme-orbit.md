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
| `--theme-shadow` | `0 1px 0 var(--color-line)` | flat; no glows |
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
- Hero H1: upright display 700, `clamp(2.5rem, 1.5rem + 3vw, 4.25rem)`, line-height 1.02, tracking -0.035em. “Build things that survive” is ink; “contact with reality.” is accent.
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
| 03 stack | Mars (small, crater) | |
| 04 work | Jupiter (banded) | |
| 05 framework | Neptune (deep accent) | |
| 06 record | Moon (crescent) | |
| 07 contact | Comet (streak) | |

Hero artwork (`components/hero/OrbitSystem.tsx`): exactly three ellipses tilted -12 degrees, ry/rx 0.62, rx 140/215/310. The outer radius was tuned from 290 within the approved +20 bound. Shared constants live in `lib/orbit-layout.json`.

- Ring 1: Earth 36px at 0 degrees and Moon 32px at 180 degrees, 60-second revolution.
- Ring 2: Mars 40px at 90 degrees and Neptune 44px at 270 degrees, 90-second revolution.
- Ring 3: Saturn 52px at 30 degrees, Jupiter 52px at 150 degrees and Comet 44px at 270 degrees, 130-second revolution.
- The center avatar has radius 56px, a 2px accent ring and a soft tint-a radial glow. Ring strokes are 1.5px line color.
- Nested static SVG transforms define the ellipse; CSS rotates each planet and counter-rotates its sprite, maintaining upright, unsquashed artwork without JS. Hover/focus pauses every ring. Planet hover/focus scales to 1.12, highlights its ring and reveals a panel label in mono 14px ink.
- The calculated viewBox includes the full orbit, hit targets, labels, hover scaling and 16px padding. Caption: “Hover a planet · click to jump”, mono 13px muted.
- `pnpm check:orbit` reads the same layout JSON and actual painted sprite cells. It sweeps 2340 seconds at 0.25-second intervals (9361 samples), requiring at least 8px clearance from the avatar and between planets, including the entire hover-scale range. Labels are excluded because motion pauses while they are shown.
- The hero grid uses line color at 22%. Pixel stars twinkle between opacity 0.35 and 1 over staggered 3–6-second cycles.

Companion (`components/pixel/OrbitCompanion.tsx`): a 32px active-section planet in a 44px section link at bottom-right, with a 160ms hop. Hidden below 480px.

## 6. Layout and sections

Container: `max-w-[1200px]`, widened to 1440px for About, Stack, Work and Record; side padding 24px (phones) / 40px / 64px. Sections retain the full-width hairline.

Desktop slide layout (2026-11-06): one media query, `(min-width: 1024px) and (min-height: 720px)`, gives every non-hero section `min-height: calc(100svh - var(--header-h))`, border-box sizing and 40px top/bottom padding. Content stays top-aligned. Outside that query, padding is 56px top/bottom with no minimum height. Minimum height lets smaller screens or enlarged text grow naturally instead of clipping. The hero retains its own layout. `AnchorScroll` measures the sticky header with ResizeObserver into `--header-h`; the default is 81px, with existing narrow-header fallbacks. `--header-height` aliases it for the unchanged hero.

At 1440×900 with an 81px header, sections target 819px total: 80px padding, 1px rule and at most 738px content. Static estimates (including section headings and internal gaps, excluding outer padding/rule): About 700–735px, Stack 640–700px, Work 690–735px, Framework about 650px, Record 650–710px (nine events), Contact about 515px. These are estimates, not browser measurements. Supervisor acceptance must measure 1440×900 and 1920×1080, all Record milestones and Work slides, plus horizontal overflow from 320px to 2000px. At 1366×768, content may grow beyond the minimum while preserving 40px top padding.

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
One chronological list of all 20 milestones replaces year tabs. At lg, the SVG road has four rows of five nodes, alternating direction with smooth semicircular turns. Below lg, the same buttons follow a gentle vertical curve with left/right HTML labels. The server supplies its calendar date as a stable hydration prop; dates after that boundary have a dashed approach and a `Next` label. The travelled path uses accent, draws once in 1.2 seconds, and nodes pop in with a 45ms stagger. Motion Off renders the path and markers immediately; ongoing roles pulse only with motion enabled.

Each 18px marker sits inside a 44px button and uses its type token: education ink with tint-c ring, role accent, award success, event muted, project accent outline. Moon / Earth / Saturn / Comet / Jupiter glyphs repeat in the five-type legend. Labels use 12px mono dates and 14px, two-line titles no wider than 190px. On desktop labels alternate above/below by column, keeping matching columns on the same side across rows to prevent collisions.

Hover, keyboard focus, or a touch tap opens an adjacent panel with the date range, full title, organization, description and optional link. Escape dismisses even when the card opened by hover while focus stayed outside Record; keyboard dismissal restores the node. Touch taps toggle, and Tab follows chronological order with the open card's controls immediately after its node. The unused EventModal was removed. All 20 milestone titles remain in server-rendered HTML, with no-JS styles restoring the road and markers.

Chromium measured 722.8px content inside an 819px section at 1440x900. The 580px road leaves room for the unchanged heading and legend. Geometry/date/SSR regressions run in `scripts/check-navigation-motion.mjs`; browser coverage is `node components/chronicles/career-path.browser.test.mjs` with the local dev server on port 3000.

### 07 contact (2026-11-06)
Contact alone vertically centers its content inside the desktop screen section and keeps the full-width tint-a band. Above the left-column copy, an aria-hidden 196px scene contains a 180px pixel Saturn, tilted orbit with two moons, a crossing comet with pixel trail, and twinkling stars. Gentle CSS motion obeys the shared Motion Off switch. Artwork occupies its own space so it never sits behind the text.

The heading remains `Let's build something.` and the 17px ink invitation is `Hiring for an AI / ML or data role, or have a research idea worth testing? My inbox is open.` The panel email card uses a 24px display-font mailto link and a Copy button. Success announces `Copied` politely for two seconds. Missing or rejected Clipboard API access selects the address and announces manual-copy instructions. Social buttons use siGithub, lucide Linkedin, and siKaggle with visible labels; Open CV retains `cv_open` tracking from `contact_section`.

The existing ContactForm is unchanged, including submission, validation, error and success behavior. Chromium measured 536.8px content inside an 819px section at 1440x900, with 141.6px/140.6px top/bottom gaps (the difference includes the top border). Record and Contact passed keyboard, hover, touch, clipboard success/failure, Motion Off and 320/375/768/1024/1440/1920px overflow checks. Motion On path completion, dark token rendering, and all 20 titles with JavaScript disabled also pass. The local font faces are Next.js fallback faces, so these dimensions still need confirmation with the deployed Google fonts. Live form submission and non-Chromium engines are not covered by this rewrite's browser test.

## 7. Motion, navigation and accessibility

- Motion is explicit-or-system. Stored `line.motion=on|off` wins; absence/invalid values follow `prefers-reduced-motion`, including live changes. The pre-paint script sets effective `data-motion` and `data-motion-source=user|system`. Cross-tab storage changes stay synchronized.
- The dock says “Motion · On” or “Motion · Off”, appending “ (system)” when applicable. Its switch state reflects the effective value.
- MotionConfig uses `always` when off and `never` when on. Framer opacity transitions also receive zero durations when off. The OS CSS fallback applies only to `html:not([data-motion])`, so explicit On works on Line’s Windows installation.
- `html[data-motion="off"]` disables CSS animations and transitions. Section eyebrows and titles reveal once with a 24px rise and 60ms stagger; cards and Stack groups stagger by 50ms. Primary buttons lift 2px on hover when motion is on.
- `AnchorScroll` handles same-page anchors globally. Hero goes to zero; every other destination uses `max(0, sectionTop - headerHeight)` without centering. Navigation pushes the hash, closes the mobile menu, and focuses the section without another scroll. Hash loads wait for load/fonts/layout; browser history uses the same rule. Modifier clicks retain native behavior. CSS `scroll-margin-top: var(--header-h)` supplies the no-JS fallback.
- Contrast: all checked text/background pairs reach 4.5:1 or better across all ten mode/accent combinations and the no-JS root.
- Focus: 2px accent ring on interactive elements; destination sections are programmatically focusable without a visible section outline. Skip link and modal focus handling remain.
- Headings: one H1, section H2s, card/subsection H3s. CSS and noscript fallbacks keep content available without JS.

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
