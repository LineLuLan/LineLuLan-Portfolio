# Strategy snapshot — v2

Owner: Trần Nam Anh (Line). Updated: 2026-11-05.

## Goals

Land DS, MLE, and AI Engineer internships in Vietnam and build community presence. Recruiters need a clear 10–30 second scan with proof and a CV. Engineers need project methods, code, and the DABM lens. Researchers need methodology and results. Peers see Line's work and character through the same readable interface.

Success targets remain: LCP at most two seconds on 3G, email and CV discoverable within ten seconds, Lighthouse at least 95 in all four categories, and contact delivery within 30 seconds. These are targets, not measured release results.

## Stack decisions

| Concern | Decision | Reason |
| --- | --- | --- |
| Framework | Next.js 14 App Router | Server rendering, routing, metadata, Vercel integration |
| Language | TypeScript strict and noUncheckedIndexedAccess | Validate content shapes and indexed access |
| Styling | Tailwind 3 with tokens in app/themes.css | Semantic styles shared across themes |
| Motion | framer-motion 11 and CSS | Section reveals and SSR-visible hero |
| Fonts | Manrope, JetBrains Mono, DM Serif Display via next/font | Sans body, mono labels, serif accents |
| Icons | Pixel planets and lucide-react | Section identity and functional controls |
| Form | Client-side Web3Forms with public access key | Browser submission without a backend |
| State | React context | Theme and motion preferences |
| Package manager | pnpm | Shared local and deployment commands |
| Hosting and analytics | Vercel and Vercel Analytics | Preview builds and usage events |
| Domain | linelulan.vercel.app | Current live URL |

## Architecture rules

1. Keep typed content in `content/*.ts` and presentation in feature components. Shared content types live in `types/index.ts`; URLs and route constants live in `lib/constants.ts`.
2. Put theme tokens in `app/themes.css`. Tailwind maps semantic names to those tokens; UI code does not use compatibility aliases.
3. Register themes in `lib/themes.ts`. The pre-paint script applies saved preferences; ThemeProvider owns hydrated state, persistence, and cross-tab synchronization.
4. Group components by feature. Keep reusable presentation primitives in `components/ui/` and small utilities in `lib/`.
5. Use strict TypeScript. Avoid `any` and unchecked optional content.
6. Use MotionConfig and `data-motion` together with the system reduced-motion preference.
7. Render above-the-fold content in SSR. Use CSS reveals there and preserve the CSS-driven splash dismissal.
8. Run the contrast gate before shipping any theme. Every checked text/background pair must reach 4.5:1.
9. Keep public Web3Forms configuration in the client. Do not put private credentials in public environment variables.

## Out of scope

Dark appearance, an interactive playground, project detail routes, and a blog. The project modal remains the detail view. New scope requires a separate decision from Line.

## Open questions

| Item | Owner | Needed |
| --- | --- | --- |
| Web3Forms | Line | Configure and verify a public key for anhtrannam097@gmail.com |
| google-certs | Line | Confirm placeholder month 2025-06 |
| scholarship | Line | Confirm placeholder month 2025-10 |
| twohearts-de | Line | Confirm placeholder month 2026-01 |
| iu-ta | Line | Confirm placeholder month 2026-02 |
| agentic-build-week | Line | Confirm placeholder month 2026-04 |
| Panic Hub | Line | Confirm public project links |

## Versioning

| Version | Date | Scope |
| --- | --- | --- |
| v1.0 | 2026-05 | Dark cyberpunk portfolio |
| v1.1 | 2026-11-05 | Content update and splash fixes |
| v2.0 | 2026-11 | Orbit redesign and theme system |

The design authority is [docs/design/theme-orbit.md](docs/design/theme-orbit.md). Implementation and release checks live in [TRACKING.md](TRACKING.md).
