# linelulan-portfolio

Personal portfolio for **Trần Nam Anh — Line**. Data Scientist & AI Engineer.

> *Working at the intersection of ML, LLMs, and algorithmic reasoning — and I care that each thing I ship has its own shape.*

**Live:** https://linelulan.dev (after deploy)

---

## Quickstart

```bash
# 1. Install deps
npm install

# 2. Copy env example and fill in values
cp .env.local.example .env.local
# → set WEB3FORMS_ACCESS_KEY (free at https://web3forms.com)

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

## Stack

- **Next.js 14** (App Router) + **TypeScript** strict mode
- **Tailwind CSS** + CSS custom properties for design tokens
- **Framer Motion** for animations (with `prefers-reduced-motion` guards)
- **Geist** + **JetBrains Mono** via `next/font`
- **Web3Forms** for contact form (no backend needed)
- **Vercel Analytics** (optional, free tier)

## Project structure

```
app/                  # Next.js App Router (pages, layouts, API routes)
components/           # React components grouped by feature
  ├── layout/         # nav, footer, section wrapper, mode toggle
  ├── hero/           # hero section (recruiter + experience modes)
  ├── skills/         # skills section
  ├── projects/       # projects section + cards
  ├── dabm/           # DABM framework section
  ├── chronicles/     # timeline section
  ├── contact/        # contact section + form
  └── ui/             # reusable primitives (GlassCard, StatusDot, etc.)
content/              # ALL content data (typed). Edit here, not in JSX.
  ├── profile.ts      # name, tagline, social links
  ├── skills.ts       # 4 skill tiers
  ├── projects.ts     # featured + classified slots
  ├── dabm.ts         # quadrants + project mappings
  └── chronicles.ts   # 13 timeline events
lib/                  # utilities (cn, constants, hooks)
types/                # TypeScript type definitions
public/               # static assets (avatar, CV, OG image)
```

## Documentation

| File | Purpose |
|---|---|
| [`PLANNING.md`](./PLANNING.md) | Strategy, scope, decisions, architecture rules |
| [`TRACKING.md`](./TRACKING.md) | Living checklist of implementation tasks |
| [`HANDOFF.md`](./HANDOFF.md) | Onboarding — how to add/edit/deploy |
| [`linelulan-portfolio-blueprint.md`](./linelulan-portfolio-blueprint.md) | Full design specification (source of truth) |

## Deploy

1. Push to GitHub.
2. Import in Vercel → auto-detects Next.js.
3. Add env var `WEB3FORMS_ACCESS_KEY` in Vercel project settings.
4. Connect custom domain `linelulan.dev`.
5. Enable Vercel Analytics (free).

## License

Source code: MIT. Content (writing, photos, branding): © 2026 Trần Nam Anh, all rights reserved.
