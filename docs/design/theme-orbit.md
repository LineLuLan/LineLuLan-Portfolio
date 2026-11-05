# Design brief — Theme 01 "Orbit"

Status: R2 implemented · 2026-11-06; browser/build acceptance pending supervisor review
This file is the brief every implementation packet reads. Reference: tamir39.com (Swiss / Editorial art direction, theme dock, wide project rows). The implementation is original; nothing is copied from that repository.

## 1. Goals

1. Professional, readable for everyone: recruiters scan in 10–30 s, engineers go deeper, screen readers get the full story. Readability beats effects every time.
2. A distinct character: pixel-art planets on warm paper with the Kafka purple as the single accent. Nobody should mistake it for the reference site.
3. A theme system: Orbit is theme 01. Later themes plug into the same tokens and the same dock without touching sections.
4. Keep the 7-section content model and the typed `content/*.ts` data. Restyle everything; reorganize inside sections only where it improves scanning.

Non-goals: dark appearance (phase 2), interactive playground (phase 2), cursor decorations, roaming AI mascot, framework upgrades (stay on Next 14 + Tailwind 3 + framer-motion 11), project detail routes.

## 2. Theme architecture

- `lib/themes.ts`: registry `themes = [{ id: 'orbit', number: '01', name: 'Orbit', symbol: '◐', accent: '#8F2D9A', paper: '#F8F7F4', description: 'Paper · pixel planets · quiet purple' }]`, `ThemeId`, `THEME_STORAGE_KEY = 'line.theme'`, `MOTION_STORAGE_KEY = 'line.motion'`, `isTheme()`.
- `app/themes.css`: `:root` holds the Orbit tokens (so SSR and no-JS get Orbit). `html[data-theme="<id>"]` blocks override per theme. A later theme = one block here + one registry entry.
- Pre-paint script in `app/layout.tsx` `<head>` (inline, no deps): reads the two localStorage keys inside try/catch, sets `data-theme` and `data-motion` on `<html>` before first paint.
- `components/providers/ThemeProvider.tsx`: React context for theme + motion, writes localStorage, syncs across tabs via `storage` event, updates `<meta name="theme-color">`.
- `components/ThemeDock.tsx`: fixed bottom-left tray. Collapsed: one 44px round button showing the active theme symbol. Open: a row of theme swatches (number + symbol + name, `aria-pressed`), plus a motion on/off button. Keyboard: Tab/Enter/Space, Escape closes, click outside closes. Mobile keeps the same geometry.
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

At 1440×900 with an 81px header, sections target 819px total: 80px padding, 1px rule and at most 738px content. Static estimates (including section headings and internal gaps, excluding outer padding/rule): About 700–735px, Stack 640–700px, Work 690–735px, Framework about 650px, Record 650–710px (nine events), Contact about 515px. These are estimates, not browser measurements. Supervisor acceptance must measure 1440×900 and 1920×1080, all Record tabs and Work filters, plus horizontal overflow from 320px to 2000px. At 1366×768, content may grow beyond the minimum while preserving 40px top padding.

### Header (`components/layout/Header.tsx`)
Sticky top, paper background with a bottom hairline. Left: pixel Saturn mark + `Line`. Center/right: links `About · Stack · Work · Framework · Record · Contact`. Right: `Open CV` outline button + 36px round pixel avatar. Under 900px: links collapse into a disclosure button (`aria-expanded`), Escape closes and returns focus. The header stays fully visible at every scroll position.

### 01 whoami (Hero)
Desktop hero: text and orbit in a 1.5:1 grid, with stats below. At >=1024px its minimum height is `100svh - --header-height`, and the full content group is vertically centered. The eyebrow is `01 AI / ML Engineer · Data Engineering`. The profile row contains name and title; the avatar remains in the header and orbit. Positioning is ink, 18px/22px. All four actions remain: Open CV, Let's connect, GitHub and LinkedIn. Stats use sentence-case labels. Hero text uses CSS reveals and is server-rendered; the splash dismisses even without JS.

### 02 about
Two columns at lg: left `narrative.intro` + `narrative.mission` as 17px/28px paragraphs followed by `Currently exploring` (15px sans chips); right a definition list from `profile.facts` with approximately 44px rows (wrapping grows naturally). Below: `What I bring` uses one/two/four columns at base/md/lg, 16px padding, 24px pixel planets, display 18px bold titles, ink 15px/24px descriptions and accent mono 13px proof rows. All supplied copy remains.

### 03 stack
Six groups: Languages; ML & modeling; LLM & agents; Data engineering; Backend & MLOps; Cloud & web. Cards form one/two/three columns by breakpoint, with 20px padding, display 18px titles and 14px muted captions. Named simple-icons imports supply 18px logos. Brands below 2:1 against white use ink; missing logos use monograms. Tool chips are sans 14px with 36px minimum height and 6px gaps. Practices use 13px chips. Methods is one inline chip row below the grid on desktop, wrapping on smaller screens.

### 04 work
Eyebrow + H2 `Selected projects.` + unchanged one-sentence intro right-aligned on desktop. Filter pills (`aria-pressed`) filter five real projects. Cards use one/two/three columns at base/md/lg, backgrounds cycling tint-a / tint-c / tint-b, radius `--theme-radius`, hairline border and 16px padding. Each has an index/role eyebrow, 20px planet, display 22px bold name, two-line tagline, up to four tech chips and a `+N` remainder, then the existing external action and `Details` button. Details opens the unchanged `ProjectModal`, retaining full tech, status, domains and DABM information. The sixth `In orbit` card shows the classified count, names, codenames and ETAs, only for All. The existing ProjectListItem module now renders a card.

### 05 framework (DABM)
Eyebrow + H2 `The DABM framework.` + sub `Data · Agent · Behavioral · Modeling` in mono accent. 2×2 quadrant panels, each with a pixel planet glyph, letter in mono accent, label, body. Right of the grid on wide screens: `Apply to a project` dropdown + the DABM tags for the chosen project (existing logic untouched).

### 06 record
ARIA year tabs: Upcoming, 2026, 2025, 2024, Earlier. Upcoming contains events after today's local calendar date; year tabs descend through years with past/current events from 2024 onward, and Earlier contains 2023 and before. Dates are compared against `new Date()` at render, without freezing the cutoff at module load. The current year is selected by default. Left/Right wrap; Home/End jump; only the active tab is in the tab order. Each tab controls a labelled panel. All milestones remain in server HTML; without JavaScript, labelled panels expand into a complete record. Active events form two columns at lg, with mono 13px dates, ink 16px bold titles, 14px organizations and a type badge. Every row opens the unchanged EventModal. Ongoing roles retain a status dot and `— Present`; placeholder days (`-01`) display month + year only.

### 07 contact
A full-width tint-a band. Left: H2 `Let's build something.`, one sentence, email as a large link, GitHub / LinkedIn / Kaggle links with arrows, `Open CV`. Right: the existing form restyled (labels above inputs, inputs on paper with hairline, accent submit). Footer line under the band: `© 2026 Trần Nam Anh (Line) · Built with intention.` and `theme 01 · orbit` in mono.

## 7. Motion, navigation and accessibility

- Motion is explicit-or-system. Stored `line.motion=on|off` wins; absence/invalid values follow `prefers-reduced-motion`, including live changes. The pre-paint script sets effective `data-motion` and `data-motion-source=user|system`. Cross-tab storage changes stay synchronized.
- The dock says “Motion · On” or “Motion · Off”, appending “ (system)” when applicable. Its switch state reflects the effective value.
- MotionConfig uses `always` when off and `never` when on. Framer opacity transitions also receive zero durations when off. The OS CSS fallback applies only to `html:not([data-motion])`, so explicit On works on Line’s Windows installation.
- `html[data-motion="off"]` disables CSS animations and transitions. Section eyebrows and titles reveal once with a 24px rise and 60ms stagger; cards and Stack groups stagger by 50ms. Primary buttons lift 2px on hover when motion is on.
- `AnchorScroll` handles same-page anchors globally. Hero goes to zero; every other destination uses `max(0, sectionTop - headerHeight)` without centering. Navigation pushes the hash, closes the mobile menu, and focuses the section without another scroll. Hash loads wait for load/fonts/layout; browser history uses the same rule. Modifier clicks retain native behavior. CSS `scroll-margin-top: var(--header-h)` supplies the no-JS fallback.
- Contrast: all checked text/background pairs reach 4.5:1 or better in both token blocks.
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
