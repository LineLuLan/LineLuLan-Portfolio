# HANDOFF — Maintainer onboarding

> Read this if you're picking the codebase up for the first time (or coming back after months). It tells you where things live, how to make common changes, and what NOT to do.

---

## How to run locally

```bash
npm install
cp .env.local.example .env.local        # then fill NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
npm run dev                              # → http://localhost:3000
```

Production build smoke:

```bash
npm run build
npm run start
```

---

## Architecture map

```
                         ┌──────────────────┐
                         │   content/*.ts   │  ← strings, data, tiers, events
                         │  (typed source)  │
                         └────────┬─────────┘
                                  │
                                  ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  components/ui/  │ ←─ │ components/<sec>/│ ─→ │   app/page.tsx   │
│  (primitives)    │    │ (feature blocks) │    │ (assembled view) │
└──────────────────┘    └────────┬─────────┘    └──────────────────┘
                                 │                       │
                                 ▼                       ▼
                         ┌──────────────────┐    ┌──────────────────┐
                         │  app/globals.css │    │  app/layout.tsx  │
                         │ (design tokens)  │    │ (fonts, meta)    │
                         └──────────────────┘    └──────────────────┘
```

**Rule of thumb:** if you're editing JSX to change a sentence, you're doing it wrong — find the right `content/*.ts` file.

---

## Common tasks

### How to add a new project

1. Open `content/projects.ts`.
2. Add a new `Project` entry to the `projects` array (see existing Dengue card for full shape).
3. Set `state: 'live'` (was `'classified'` for placeholder).
4. Fill `dabm: { D, A, B, M }`. Each is a string; max 80 chars.
5. Fill `tech` (array of stack), `links.github`, `links.demo` (optional).
6. (Optional) drop a screenshot in `public/projects/<slug>.png` and reference via `image: '/projects/<slug>.png'`.
7. The card auto-renders. The DABM section's "Apply" dropdown picks up the new project.

### How to flip a Classified slot to Live

1. Find the slot (e.g. slot-02) in `content/projects.ts`.
2. Replace the placeholder fields (`tagline`, `state`, `dabm`, `tech`, `links`) with real values.
3. Keep `slug` stable to preserve any deep links.

### How to add a chronicle event

1. Open `content/chronicles.ts`.
2. Append to the `events` array, sorted chronologically by `date` (ISO string `YYYY-MM-DD`).
3. Pick `type: 'education' | 'role' | 'award' | 'event' | 'project'` — controls icon/color.
4. The horizontal timeline auto-positions by date.

### How to change the palette

1. Open `app/globals.css`.
2. Edit the CSS custom properties under `:root` (e.g. `--accent-pink`, `--bg-midnight`).
3. **Do not** edit Tailwind `colors` directly — they reference the vars.
4. Run dev server, eyeball, iterate.

### How to update the CV

1. Replace `public/cv/line-resume-2026.pdf` with new file.
2. If the year changes, also update `lib/constants.ts` → `CV_PATH` to e.g. `/cv/line-resume-2027.pdf` and rename the file.

### How to change profile data (email, LinkedIn, etc.)

1. Open `lib/constants.ts` for URLs/paths.
2. Open `content/profile.ts` for displayed text (name, tagline, location, GPA).

### How to deploy

1. Push to GitHub `main`.
2. In Vercel: import repo → auto-detects Next.js.
3. **Add env var:** `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (get from https://web3forms.com — Web3Forms free plan requires client-side calls, so the key is exposed to the browser by design).
4. (Optional) `NEXT_PUBLIC_SITE_URL=https://linelulan.dev`.
5. Connect domain `linelulan.dev` (Vercel → Domains).
6. Enable Vercel Analytics in project settings.

---

## Forbidden patterns

These will be rejected in code review. They violate the architecture rules in `PLANNING.md` Section C.

- ❌ Hardcoded strings inside JSX (`<h1>Trần Nam Anh</h1>`). → import from `content/profile.ts`.
- ❌ Hardcoded URLs (`<a href="https://github.com/LineLuLan">`). → use `SOCIAL.github` from `lib/constants.ts`.
- ❌ Inline color hex (`color: '#e07b97'`). → use Tailwind class (`text-accent-pink`) or CSS var.
- ❌ Animation without `useReducedMotion` guard. → import `useReducedMotion` from `lib/hooks`.
- ❌ `any` type. → define proper type in `types/index.ts`.
- ❌ New folders like `common/`, `shared/`, `utils/`. → group by feature in `components/<section>/` or put utility in `lib/`.
- ❌ Server-side proxy for Web3Forms on free plan. Web3Forms free tier blocks server-to-server requests; call directly from `ContactForm.tsx` using `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (the key is public by design).
- ❌ New top-level pages without entry in PLANNING.md Section D. → discuss scope before adding routes.

---

## Where to look when something breaks

| Symptom | First place to check |
|---|---|
| Build fails on type error | `types/index.ts` — content shape probably drifted |
| Animation not running | `lib/hooks/useReducedMotion.ts` — user might have reduced motion on |
| Mode toggle doesn't persist | `app/providers.tsx` localStorage key `portfolio-mode` |
| Contact form returns error | `components/contact/ContactForm.tsx` — env var `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` set? Restart dev server after changing `.env.local`. |
| OG image broken | `app/opengraph-image.tsx` runtime — Edge or Node? |
| CV 404 | filename in `public/cv/` matches `lib/constants.ts:CV_PATH`? |
| Font flicker | `app/layout.tsx` — `next/font` variable should be on `<html>` |

---

## Reference

- **Source of truth for design:** `linelulan-portfolio-blueprint.md` (root)
- **Decisions log:** `PLANNING.md`
- **Implementation status:** `TRACKING.md`
