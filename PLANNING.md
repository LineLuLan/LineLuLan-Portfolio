# PLANNING — Strategy snapshot

> Snapshot of decisions made for v1. When something changes, edit this file *and* note the change in `TRACKING.md` weekly notes.

---

## A. Project goals

**Owner:** Trần Nam Anh (Line) · 3rd year BSc Data Science @ HCMIU.

**Primary goal:** Land DS/MLE/AI Engineer internships in Vietnam + build community presence.

**Audience hierarchy.**

| Audience | Need | How v1 serves |
|---|---|---|
| Recruiter / HR | 10–30s scan, see fit + proof | Recruiter Mode (default): plain text, metrics first, CV download |
| Engineer / tech lead | Depth, code, thinking | Project case studies + DABM lens + GitHub links |
| Researcher | Rigor, methodology | Featured Dengue research card with advisor + collaborators |
| Community / peers | Personality, taste | Experience Mode: full Kafka VFX, terminal animations |

**Success metric for v1.**
1. Site loads ≤2s LCP on 3G.
2. Recruiter can find email + CV download in ≤10s.
3. Lighthouse ≥95 across the board.
4. Contact form deliverable to inbox in <30s end-to-end.

---

## B. Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 App Router** | RSC, built-in font/image optimization, Vercel integration, OG image route |
| Language | **TypeScript strict** + `noUncheckedIndexedAccess` | Catch content-shape errors before runtime |
| Styling | **Tailwind CSS** + CSS custom properties | Tokens centralized in `globals.css`; Tailwind config maps to vars |
| Animation | **Framer Motion** | Best ergonomics for `whileInView` + `useReducedMotion` |
| Fonts | **Geist + JetBrains Mono** via `next/font` | Self-hosted, zero CLS, no external CDN |
| Icons | **lucide-react** | Tree-shakable, consistent stroke |
| Contact form | **Web3Forms** (changed from blueprint Resend) | Free 250 submissions/month, no signup friction, no API key juggling. If volume grows, swap to Resend — only `app/api/contact/route.ts` changes. |
| Analytics | **Vercel Analytics** | Free, privacy-friendly, native integration |
| Hosting | **Vercel** | Custom domain, edge, preview deploys |
| Email destination | `tnanh.gdsciu@gmail.com` | Locked from blueprint |

**Explicitly NOT used.** Redux/Zustand (tiny state, Context is enough), shadcn/ui (custom design system), Storybook (overhead for 1-page site), Jest (no logic worth unit-testing in v1).

---

## C. Architecture rules

These are **non-negotiable** for the codebase. Violating any of them creates maintenance debt.

1. **Content tách rời UI.** Mọi text, project data, timeline events, skill tiers nằm trong `content/*.ts` typed. Component chỉ render. *Đổi nội dung ⇒ sửa 1 file content, không đụng JSX.*
2. **Design tokens 1 nơi.** `app/globals.css` là source of truth cho mọi color/font/spacing. Tailwind config chỉ ánh xạ tới CSS vars. *Đổi palette ⇒ sửa 1 file globals.css.*
3. **Component theo feature.** `components/<section>/` cho code dùng riêng 1 section + `components/ui/` cho primitives dùng chung (GlassCard, StatusDot, …). *Không có "common" hay "shared" folder mơ hồ.*
4. **Strict TypeScript.** `strict: true`, `noUncheckedIndexedAccess: true`, không `any`. Types tập trung ở `types/index.ts`.
5. **Animation tách hook.** `lib/hooks/useTypewriter.ts`, `lib/hooks/useReducedMotion.ts`. *Component khai báo intent, không inline tween.*
6. **Mọi animation guard `useReducedMotion`.** Người dùng `prefers-reduced-motion: reduce` không gặp typewriter/glitch — chỉ fade.
7. **Mode toggle là 1 boolean.** `'recruiter' | 'experience'`. Persist via `localStorage`. Default `'recruiter'` cho first visit + `prefers-reduced-motion` users.
8. **No hardcoded text in JSX.** Always reference `content/*`. Forbidden patterns: hard-coded email, hard-coded GitHub URL trong `<a href>`. Dùng `lib/constants.ts`.
9. **No inline color hex.** Always reference CSS var (`text-accent-pink`, `bg-midnight`, `border-border-glow`).
10. **Server Action / API route giữ secrets.** `WEB3FORMS_ACCESS_KEY` chỉ tồn tại server-side; FE không gọi Web3Forms trực tiếp.

---

## D. Out-of-scope cho v1

Đồng ý **không** làm trong v1 (theo blueprint Section 13):

- ❌ Project case study route `/projects/[slug]` — modal đủ.
- ❌ Sound effects toggle.
- ❌ Blog `/notes` route.
- ❌ HuggingFace / Google Scholar widgets.
- ❌ VI language toggle.
- ❌ AI chat with portfolio (RAG agent).
- ❌ Theme variants (chỉ midnight cyberpunk).
- ❌ Server-side analytics dimension cho CV downloads (chỉ track event đơn giản).

Khi có nhu cầu, mở GitHub issue, link tới mục này, ưu tiên theo audience demand.

---

## E. Open questions / TBD

| # | Item | Owner | Notes |
|---|---|---|---|
| E1 | Project content cho 5 slot Classified | Line | Theo Section 12 blueprint template; v1 ship với glitch placeholder |
| E2 | OG image final design | Line | Hiện dùng dynamic OG route; có thể upgrade với photo HD |
| E3 | DABM blog post (publish dev.to / self-host) | Line | Nice-to-have, link từ DABM section |
| E4 | First HuggingFace upload | Line | Một fine-tune nhỏ cũng tăng credibility |
| E5 | Domain `linelulan.dev` đã mua chưa? | Line | Không block v1 — Vercel default domain trước, swap sau |

---

## F. Versioning

| Version | Status | Description |
|---|---|---|
| v1.0 | In progress | Full blueprint sections + Dengue featured + 5 classified |
| v1.1 | Planned | Lấp lần lượt 5 project slot với content thật |
| v2.0 | Planned | Project case study route, HuggingFace integration, blog |

---

**Last updated:** 2026-05-05
