# Line's portfolio

Personal portfolio for Trần Nam Anh (Line), built around the Orbit theme: warm paper, semantic colors, and pixel planets. Seven sections cover profile, skills, projects, DABM, experience, and contact. A theme registry powers the appearance dock and footer stamp; a small planet follows the active section.

**Live:** https://linelulan.vercel.app

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 14 App Router |
| Language | TypeScript strict |
| Styling | Tailwind CSS 3 and CSS custom properties |
| Motion | framer-motion 11, CSS reveals, reduced-motion support |
| Fonts | Manrope, JetBrains Mono, DM Serif Display via next/font |
| Contact | Web3Forms, called from the browser |
| Hosting and analytics | Vercel |

## Quickstart

```sh
pnpm install
cp .env.local.example .env.local
pnpm dev
```

Open http://localhost:3000. Set these public build-time variables in your local environment:

| Variable | Purpose |
| --- | --- |
| NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY | Web3Forms public access key for the intended inbox |
| NEXT_PUBLIC_SITE_URL | Canonical URL; use https://linelulan.vercel.app for Vercel |

```sh
pnpm build
pnpm check:contrast
```

The contact form needs a configured key. Public variables are included in browser assets; never put secrets in them.

## Project structure

```text
app/                    routes, layout, theme tokens, global CSS, generated icons
components/
  about/                narrative, facts, strengths
  chronicles/           experience rows and event modal
  contact/              contact band and form
  dabm/                 framework panels and project mapping
  hero/                 SSR-visible hero, artwork, stats
  layout/               header, footer, section wrapper, motion, theme stamp
  pixel/                planet renderer and active-section companion
  projects/             project rows, filters, modal
  providers/            theme state and persistence
  skills/               skill tiers
  ui/                   section headings, status, boot splash
  ThemeDock.tsx         appearance and motion controls
content/                typed profile, projects, skills, DABM, chronicles
docs/design/            current design authority
lib/                    constants, theme registry, planet grids, helpers
public/                 avatar and CV assets
scripts/                contrast gate
types/                  shared content shapes
```

The `/line-cv` route serves the CV PDF inline through a rewrite in `next.config.mjs`. Public CV paths live in `lib/constants.ts`.

## Common changes

### Add a theme

1. Add a registry entry in `lib/themes.ts` with a unique id, number, name, symbol, accent, paper, and description.
2. Add an `html[data-theme="id"]` block in `app/themes.css`. Omitted tokens inherit the Orbit defaults in `:root`; color tokens use six-digit hex values.
3. Run `pnpm check:contrast` before shipping. It checks the root palette and every theme.
4. Check the dock, footer stamp, keyboard focus, stored preference, and motion settings. Sections use semantic classes and need no palette edits.

### Add a project

Add a typed `Project` to `content/projects.ts`. Keep the slug unique and fill name, tagline, domains, and state; add tech, links, role, and DABM fields as available. Featured entries sort first. Classified entries appear in the compact In orbit list; public entries appear in the filtered rows and project selector.

### Add a chronicle event

Add a `ChronicleEvent` to the `chronicles` array in `content/chronicles.ts`. Use a unique id, ISO date, type, and title. Optional org, description, link, endDate, and ongoing fields control the row and modal. The UI groups by type and sorts newest first. Dates ending in `-01` display month and year.

## Deploy

1. After Line approves the changes and explicitly authorizes the Git actions, merge to the chosen branch and push.
2. Import the repository into Vercel as a Next.js project and use pnpm for installation and builds.
3. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` for the intended inbox and `NEXT_PUBLIC_SITE_URL=https://linelulan.vercel.app`.
4. Deploy the approved revision and confirm the project domain is `linelulan.vercel.app`.
5. Complete the checks in [TRACKING.md](TRACKING.md), including an authorized contact delivery test.

## Documentation

- [Design authority](docs/design/theme-orbit.md)
- [Maintainer guide](HANDOFF.md)
- [Strategy and open questions](PLANNING.md)
- [Verification and deployment checklist](TRACKING.md)

## License

Source code: MIT. Content, writing, images, and branding: © 2026 Trần Nam Anh.
