# Design brief — Theme 01 "Orbit"

Status: draft v1 · 2026-11-05 · owner Line · written by the supervisor session.
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
| `--color-muted` | `#5E5A6E` | secondary text (contrast 6.9:1 on paper) |
| `--color-accent` | `#8F2D9A` | links, accent line, buttons (6.5:1 on paper) |
| `--color-accent-hover` | `#6F2278` | hover |
| `--color-on-accent` | `#FFFFFF` | text on accent |
| `--color-line` | `#D6D2DE` | hairlines, borders |
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

Rules: no inline hex in components. No glow, blur, grain, scanline, or glass. One accent only; pink `#E07B97` appears only inside pixel art and tints, never as text.

## 4. Typography

- `--font-sans`: Manrope (next/font/google, weights 400 500 700 800, `display: swap`).
- `--font-mono`: JetBrains Mono (400 500) for eyebrows, labels, dates, chips.
- `--font-serif`: DM Serif Display (400, italic) for the accent line in the hero and section headings only.
- Scale (Tailwind `fontSize`): `xs 12/1.5`, `sm 14/1.55`, `base 16/1.65`, `lg 18/1.6`, `xl 22/1.4`, `2xl 28/1.25`, `3xl 36/1.15`, `4xl 48/1.08`, `display clamp(2.8rem, 6.4vw, 6rem)/1.05`.
- Hero H1: sans 800, letter-spacing `-0.06em`; the second line is serif italic in accent.
- Section H2: sans 500, `-0.03em`, 36–48px, with the final word in serif italic accent when it reads naturally.
- Eyebrow: mono 11px uppercase, letter-spacing `0.22em`, muted, preceded by `NN /` index.
- Body max width `65ch`. Minimum body size 16px on all breakpoints.

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

Hero artwork (`components/hero/OrbitArtwork.tsx`): three concentric hairline ellipses on the right half of the hero on desktop, each carrying one pixel planet; the ring group rotates slowly (120 s linear) with CSS; static under reduced motion or `data-motion="off"`; hidden under 1024px (the hero becomes content-first on phones). A faint 24px grid (`--color-line` at 35%) sits behind the hero only.

Companion (`components/pixel/OrbitCompanion.tsx`, phase 4): a 32px pixel satellite fixed at bottom-right that swaps to the active section's planet with a 160ms hop. No roaming, no speech. Hidden on phones under 480px wide.

## 6. Layout and sections

Container: `max-w-[1200px]`, side padding 24px (phones) / 40px / 64px. Sections are separated by a full-width hairline, not by cards. Vertical rhythm: 96px desktop, 64px phones.

### Header (`components/layout/Header.tsx`)
Sticky top, paper background with a bottom hairline. Left: pixel Saturn mark + `Line`. Center/right: links `about · stack · work · framework · record · contact` (mono, lowercase). Right: `Open CV` outline button + 36px round pixel avatar. Under 900px: links collapse into a disclosure button (`aria-expanded`), Escape closes and returns focus. Header hides on scroll down and reappears on scroll up (desktop, fine pointer only).

### 01 whoami (Hero)
Desktop grid: left 1.25fr, right 1fr. Left: eyebrow `01 / 07 · AI / ML ENGINEER · DATA ENGINEERING · 2026`, H1 two lines (copy in section 8), then a profile row: 64px pixel avatar, name `Trần Nam Anh`, alias + title in mono, positioning sentence (max 42ch), action row `Open CV` (filled accent) · `Let's connect` (outline) · `GitHub` · `LinkedIn` (text links with arrow). Right: `OrbitArtwork`. Below both: stats row (4 cells, hairline top, numbers sans 700 40px, labels mono uppercase). Boot splash stays but restyled: paper background, ink `linelulan` with an accent pixel Saturn as the dot; same CSS-driven behavior as today (visible in SSR, self-dismissing, reduced-motion safe). No typewriter, no stars, no sparks.

### 02 about
Two columns on desktop: left `narrative.intro` + `narrative.mission` as two paragraphs (18px); right a definition list from `profile.facts` (mono keys, ink values, hairlines between rows). Below: `What I bring` as a 4-up grid of panels (pixel planet 24px top-left, title sans 700, one-line description), then `Currently exploring` chips (mono, outline, hover accent).

### 03 stack
Four tiers in order core / llm / working / exploring. Each tier: eyebrow with index and the tier caption, then rows `category (mono, muted, 160px column) · chips`. Chips: 13px mono, outline `--color-line`, radius control, hover accent border. No terminal `cat x.log` commands.

### 04 work
Eyebrow + H2 `selected projects.` + one-sentence intro right-aligned on desktop. Filter pills (`aria-pressed`). Project list: wide rows (full container width, tinted backgrounds cycling tint-a / tint-c / tint-b, radius `--theme-radius`, hairline border). Row grid on desktop: left (role eyebrow mono, pixel planet 20px + name sans 700 32px, state dot + domains), middle (tagline + 3–6 tech chips), right (`Visit ↗` filled when demo/github/paper exists; `Details` text link opens the existing modal). On phones the row stacks. Classified slots render after the live rows as a compact muted list `In orbit · LGL-██ · WLD-██ · EDU-██ · STU-██` with no interaction. The modal (`ProjectModal`) is restyled: panel on paper, hairlines, same sections, focus handling kept.

### 05 framework (DABM)
Eyebrow + H2 `DABM.` + sub `Data · Agent · Behavioral · Modeling` in mono accent. 2×2 quadrant panels, each with a pixel planet glyph, letter in mono accent, label, body. Right of the grid on wide screens: `Apply to a project` dropdown + the DABM tags for the chosen project (existing logic untouched).

### 06 record
Three sub-blocks (organizations / education / achievements), each: eyebrow, then rows `date range (mono, 140px column) · title (ink) · org (muted)`. Interactive rows are buttons that open the existing `EventModal`; the others are plain rows. Ongoing shows `— Present`. Placeholder days (`-01`) display month + year only.

### 07 contact
A full-width tint-a band. Left: H2 `Let's build something.`, one sentence, email as a large link, GitHub / LinkedIn / Kaggle links with arrows, `Open CV`. Right: the existing form restyled (labels above inputs, inputs on paper with hairline, accent submit). Footer line under the band: `© 2026 Trần Nam Anh (Line) · Built with intention.` and `theme 01 · orbit` in mono.

## 7. Motion and accessibility

- `<MotionConfig reducedMotion="user">` stays. Scroll reveals: opacity + 12px rise, 400ms, once. Nothing above the fold depends on JS to be visible (keep the SSR-visible hero and the noscript fallback).
- `html[data-motion="off"]` disables all animation and transition durations.
- Contrast: every text/background pair ≥ 4.5:1; a script `scripts/check-contrast.mjs` reads `app/themes.css` and fails the build locally if a pair drops below.
- Focus ring: 2px accent, 2px offset, on every interactive element. Skip link stays. Modals keep focus capture and return.
- Headings form a single outline: one H1 (hero), H2 per section, H3 inside.
- Touch targets ≥ 44px. No hover-only information.

## 8. Copy decisions (Line confirms)

Hero H1 options: (A) `Build things that survive` / `contact with reality.` · (B) `Data in.` / `Decisions out.` · (C) `Models you can defend.` / `Pipelines you can trust.` Default A (it is already Line's own line from the narrative).

Section headings: `01 whoami` · `02 about — jack of all trades.` · `03 stack — tools of the trade.` · `04 work — selected projects.` · `05 framework — DABM.` · `06 record — experience.` · `07 contact — let's build something.` (unchanged, now rendered as eyebrow + H2 with the trailing phrase in serif italic accent).

## 9. Phases (one worker packet each)

| Phase | Scope | Validate |
|---|---|---|
| P1 Foundation | themes registry, themes.css, Tailwind remap, fonts, ThemeProvider + pre-paint script + ThemeDock, PixelPlanet + planet set, Header, Footer, boot splash restyle, remove StarField/GrainOverlay/ClickSpark/GlitchText/TerminalPrompt/useTypewriter and the glass/neon CSS | tsc, lint, build, contrast script, screenshot |
| P2 Sections A | Hero + OrbitArtwork, About, Stack | same + mobile screenshot |
| P3 Sections B | Work rows + modal, DABM, Record + modal, Contact band + form | same + Playwright 4-condition probe |
| P4 Polish | OrbitCompanion, header hide/reveal, Lighthouse ≥ 95, docs refresh (README/PLANNING/TRACKING/HANDOFF), delete dead files | Lighthouse + a11y audit |

Each phase lands on branch `redesign/theme-planets`; `main` stays untouched until Line approves the whole redesign. Backup of the pre-redesign site: branch `backup/pre-ui-refactor-2026-11-05`, tag `v1.1.0-pre-ui-refactor`.
