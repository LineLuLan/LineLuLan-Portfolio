# Portfolio Upgrade — Inugami-inspired restructure, keep cyberpunk vibe

## Context

Bạn muốn nâng cấp portfolio (Next.js 14 + Tailwind + Framer Motion, terminal/cyberpunk vibe — purple/magenta/pink Kafka palette) lên cảm giác editorial polished như [inugami.dev](https://inugami.dev) **mà vẫn giữ chữ ký vibe hiện tại**. Inugami là Next.js editorial dark: accent cát ấm #D4A574, font Syne, radius 0, không neon, dự án đánh số 01-10, stats counter, "What I bring" 4-card, stack chia category, Record timeline gộp (Experience + Education + Achievements).

**Quyết định scope (đã chốt):**
- **Restructure** theo nhịp Inugami nhưng **giữ palette tím/magenta/pink + dark void**.
- **Tỉa effects nhẹ**: bỏ scanline overlay + glitch trên section heading. Giữ starfield, grain (nhẹ), click sparks, typewriter ở hero.
- **Adopt enhancements (không copy)**: stats counter hero, numbered projects, "What I bring" 4-card pillar, "Currently exploring" tags, Record-style timeline.
- **Boot/Welcome splash screen** khi vào trang lần đầu (chi tiết ở mục riêng phía dưới).

**Mục tiêu**: trang trông polished/editorial hơn, có structure rõ ràng kiểu Inugami, nhưng người xem vẫn nhận ra ngay là *vibe của bạn* — không bị copy nguyên trang bạn của bạn.

---

## New section order

Từ **6 section** → **7 section**. Section index ở `SectionHeader` cập nhật `XX / 07`.

| # | ID | Label / caption (editorial style) | Status |
|---|---|---|---|
| 01 | `hero` | `whoami` | Enhance (thêm stats row) |
| 02 | `about` | `about — jack of all trades` | **NEW** (tách từ Hero facts + thêm What I bring + Currently exploring) |
| 03 | `stack` | `stack — tools of the trade` | Restyle (categorized chips) |
| 04 | `work` | `work — selected projects` | Restyle (numbered list 01-N) |
| 05 | `dabm` | `framework — DABM` | Keep + minor polish (USP của bạn, không đụng logic) |
| 06 | `record` | `record — experience` | Restructure (gộp chronicles thành Organizations + Education + Achievements) |
| 07 | `contact` | `contact — let's build something` | Keep + micro-copy refresh |

---

## Visual / token changes (giữ palette, sửa cách dùng)

**File: `app/globals.css`**
- Giữ nguyên tokens `--accent-purple/magenta/pink`, `--bg-void/midnight/card`.
- **Bỏ** `.scanline-bg` và `.glitch-on-hover` khỏi các tiêu đề section (giữ class trong CSS để các nơi khác xài; chỉ sửa nơi gọi).
- Thêm token mới cho **editorial structure**:
  - `--rule-strong: rgba(255,255,255,0.16)` (hairline section divider)
  - `--rule-subtle: rgba(255,255,255,0.06)` (in-section divider)
  - `--num-display: var(--accent-pink)` (màu số 01-N của Work)
- Thêm utility:
  - `.editorial-h2` — display heading lớn: `text-3xl md:text-4xl font-semibold tracking-tight text-text-primary` + `font-sans` (giống Inugami: chữ display lớn, không monospace cho section title — nhưng *eyebrow* phía trên vẫn mono để giữ terminal feel).
  - `.eyebrow` — `font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary` với hairline 2 bên.
  - `.section-rule` — `border-t border-[var(--rule-strong)]` dùng cho ranh giới giữa section.

**File: `tailwind.config.ts`** — không đụng config; chỉ extend colors nếu cần `rule-strong/subtle`.

---

## Component changes (chi tiết)

### 1. `app/page.tsx`
Cập nhật thứ tự render: `Hero → About → Stack (Skills) → Work (Projects) → DABM → Record (Chronicles) → Contact`.

### 2. `components/layout/SectionWrapper.tsx`
Thêm prop `withTopRule?: boolean` (mặc định `true` cho section ≥ 02). Render `<hr class="section-rule" />` đầu section → tạo nhịp editorial Inugami.

### 3. `components/ui/SectionHeader.tsx`
Refactor để dùng 2 dòng:
- Eyebrow (mono nhỏ): `01 / 07 · whoami` — giữ feel terminal.
- Display heading: `<h2 class="editorial-h2">about — jack of all trades.</h2>` — chữ to, editorial.
- Bỏ glitch effect khỏi heading.

### 4. `components/hero/Hero.tsx` + `HeroRecruiter.tsx`
- Giữ avatar, name, title, positioning tagline, PillarTags.
- **Thay** `<dl>` facts grid (location/status/gpa/research/...) → **Stats counter row** (4 ô): `2+ years · 3.69 GPA · 1 paper · 6 projects`.
  - Tạo component mới `components/hero/StatsCounters.tsx`: dùng Framer Motion `useInView` + counter từ 0 → target value khi scroll vào view (respect `useReducedMotion`).
  - Format giống Inugami: số to (`text-3xl md:text-4xl font-semibold`) + label nhỏ mono (`uppercase tracking-[0.2em] text-text-tertiary`).
- Giữ CTA row (CV / Contact / GitHub) nhưng đổi style: viền sắc hơn, hover glow nhẹ.

### 5. **NEW** `components/about/AboutSection.tsx`
- Eyebrow: `02 / 07 · about` + heading: `about — jack of all trades.`
- 2 cột (md:grid-cols-2):
  - **Cột trái — Identity grid**: rectangular grid 2×2 với 4 facts từ `profile.facts` (Role / Based / Status / Open to) — kiểu Inugami "Role · Based · Experience · Status".
  - **Cột phải — Narrative**: 2 paragraph kể chuyện (tận dụng `profile.positioning` + `profile.research` + `profile.building`). Tone vẫn của bạn — không bắt chước giọng Inugami.
- **"What I bring"** — grid 2×2 cards (`md:grid-cols-2 lg:grid-cols-4`), mỗi card:
  - Title ngắn (ML Engineering · Applied AI/LLM · Research & Causal · Production Builder)
  - 1 dòng mô tả
  - Style: card-glass + glow-hover (giữ vibe), KHÔNG glitch.
- **"Currently exploring"** — hàng chip nhỏ font-mono uppercase: `AI Agents · Causal Inference · Game Theory · Simulation · Dengue Modeling` (nội dung bạn confirm sau khi review).
- Dữ liệu: extend `content/profile.ts` thêm:
  ```ts
  whatIBring: [{ title, description }, ...]   // 4 items
  exploring: ['AI Agents', 'Causal Inference', ...]   // 4-6 items
  narrative: { intro: string; mission: string }       // 2 paragraphs
  ```

### 6. `components/skills/SkillsSection.tsx` + `SkillTier.tsx`
Restyle theo Inugami "Stack — Tools of the trade":
- Eyebrow: `03 / 07 · stack`, heading: `stack — tools of the trade.`
- Mỗi category render dạng:
  ```
  Languages         Python · TypeScript · SQL · R
  ML & DS           PyTorch · Scikit-learn · PyMC · Pandas
  ...
  ```
  - Label trái: mono nhỏ, color text-tertiary.
  - Tools phải: chip inline-flex, viền hairline, hover → border accent-pink.
- File `content/skills.ts` — kiểm tra schema; có thể cần restructure thành `{ category, tools[] }` từ `SkillTier`. Nếu schema khác, viết adapter trong `SkillsSection`.

### 7. `components/projects/ProjectsSection.tsx` + project cards
Restyle Work section theo Inugami numbered list:
- Eyebrow: `04 / 07 · work`, heading: `work — selected projects.`
- Giữ `FilterPills` filter logic (research/LLM/ML/EdTech/creative/all).
- **Thay** grid `FeaturedProjectCard` + `ProjectCard` → **numbered vertical list** `<ol>`:
  - Mỗi `<li>` flex row:
    - Cột trái cố định ~64px: số `01`, `02`... font-mono lớn (`text-3xl md:text-4xl`), color `var(--num-display)` (accent-pink), opacity 50% → 100% on hover.
    - Cột giữa: project name (large), category · year (mono nhỏ), description 1 dòng, tech pills.
    - Cột phải: link Visit (mũi tên `→`) hoặc nút "Open" mở modal.
- Tạo component mới `components/projects/ProjectListItem.tsx` (replace `ProjectCard` cho non-classified). Vẫn dùng `ProjectModal` để mở chi tiết.
- `ClassifiedCard` → đổi thành `ClassifiedListItem.tsx`: cùng layout numbered nhưng name `████-██`, không link Visit, có badge `[CLASSIFIED]`.
- Featured project (dengue): để **đầu list** với badge `featured` nhỏ trên góc — không tách card lớn riêng nữa (kiểu Inugami không có hero featured).
- Animation: Framer Motion stagger fade-in, giữ AnimatePresence cho filter transitions.

### 8. `components/dabm/DABMSection.tsx`
**Giữ logic + Quadrant + Apply dropdown** (đây là USP, đừng đụng).
Chỉ:
- Đổi `SectionHeader` index → `05 / 07`.
- Eyebrow: `05 / 07 · framework`, heading: `framework — DABM.`
- Sub-heading: `Data · Agent · Behavioral · Modeling` (giữ `neon-text`).

### 9. `components/chronicles/ChroniclesSection.tsx` → đổi tên thành Record
Restructure thành 3 sub-block theo kiểu Inugami "Record":
- Eyebrow: `06 / 07 · record`, heading: `record — experience.`
- Filter events từ `content/chronicles.ts` theo `kind`:
  - **Organizations** (kind: `role` / `work`) — render vertical list: `[Logo/dot] | Org name + role | Date range` (giống Inugami: "Agora — Country Lead / Ambassador, Mar 2026 — Present").
  - **Education** (kind: `education`) — list ngắn.
  - **Achievements** (kind: `award` / `project` / `event`) — list với year ở trái.
- Mỗi block có sub-heading mono nhỏ.
- Vẫn dùng `EventModal` khi click vào item có chi tiết.
- Legend dot icons giữ lại (education ● / role ◆ / award ★ / event ▲ / project ✦) nhưng đặt phía bên trái mỗi item (không phải legend cuối).

### 10. `components/contact/ContactSection.tsx`
- Eyebrow: `07 / 07 · contact`, heading: `contact — let's build something.`
- Giữ `ContactForm` (Web3Forms), `ProfileLinks`, `CVDownload` — chỉ rebalance spacing.

### 11. `components/layout/Footer.tsx`
Đổi micro-copy: `© 2026 Trần Nam Anh (Line) — Built with intention.` (riff trên Inugami "Built with intention" nhưng vẫn là của bạn). Giữ 3 link Email / GitHub / LinkedIn.

### 12. `components/layout/TerminalBreadcrumb.tsx`
Cập nhật danh sách section IDs để khớp 7 section mới: `whoami → about → stack → work → framework → record → contact`.

### 13. `app/page.tsx` overlays
- Giữ `<StarField />`, `<GrainOverlay intensity="light" />`, `<ClickSpark />`.
- **Bỏ** ScanlineOverlay nếu có dùng (rà soát import). Quick grep `ScanlineOverlay` xác nhận trước khi xóa file.

### 14. **NEW** Boot / Welcome splash screen

**Vibe**: terminal boot sequence — giữ chữ ký cyberpunk của bạn, không phải splash kiểu marketing chung chung.

**Component**: `components/ui/BootSplash.tsx` (client component, `'use client'`).

**Behavior**:
1. Hiện full-screen overlay `fixed inset-0 z-[100]` với background `bg-void`.
2. Center column, font-mono, theo 3 phase (tổng ~2.2s):
   - **Phase 1 (0 → 600ms)** — typewriter từng dòng:
     ```
     > initializing kernel...
     > loading whoami...
     > resolving routes... ok
     > status: online
     ```
     Mỗi dòng fade-in stagger 150ms, có cursor block nhấp nháy ở dòng cuối.
   - **Phase 2 (600 → 1400ms)** — reveal "WELCOME" lớn ở giữa với hiệu ứng glitch ngắn (RGB split + slice). Dùng `accent-pink` + text-shadow neon. Bên dưới có dòng sub mono: `// system ready · entering portfolio`.
   - **Phase 3 (1400 → 2200ms)** — fade-out toàn overlay (`opacity 1 → 0`, `transform translateY(-8px)`), unmount khi xong.
3. **One-shot per session**: dùng `sessionStorage.getItem('line.boot.seen')` — nếu đã true thì không render. Set sau khi splash chạy xong. (Dùng sessionStorage, không localStorage, để mỗi tab/session mới vẫn được xem 1 lần — recruiter quay lại sau vẫn thấy.)
4. **Skip button**: góc dưới phải `[ESC] skip` (`font-mono text-xs text-text-tertiary`). Press `Esc` hoặc click → dismiss ngay.
5. **Reduced motion**: nếu `prefers-reduced-motion: reduce`, bỏ qua splash hoàn toàn (render `null` ngay từ đầu) — accessibility-first.
6. **Body scroll lock**: trong khi splash hiện, set `body.style.overflow = 'hidden'`; restore sau khi dismiss.

**Mount point**:
- Tạo `components/ui/BootSplashGate.tsx` — wrapper client component check sessionStorage + reduced motion, conditional render `<BootSplash />`.
- Trong `app/layout.tsx` (hoặc `app/page.tsx` trước `<main>`) thêm `<BootSplashGate />` ở top-level.

**Files**:
- Create: `components/ui/BootSplash.tsx`, `components/ui/BootSplashGate.tsx`.
- Modify: `app/layout.tsx` hoặc `app/page.tsx` (add `<BootSplashGate />`).

**Verification**:
- Lần đầu mở `localhost:3000` → splash chạy đúng 3 phase, fade-out sạch, main page hiện.
- Refresh trong cùng tab → KHÔNG hiện lại (sessionStorage hit).
- Mở tab mới → hiện lại (session mới).
- Press Esc / click skip → dismiss tức thì.
- Bật OS reduced motion → splash skip hoàn toàn, page render thẳng.

---

## Content data updates

### `content/profile.ts` — extend
```ts
export const profile: Profile = {
  ...existing,
  stats: [
    { value: 2,  suffix: '+',  label: 'years in tech' },
    { value: 3.69, suffix: '/4.0', label: 'GPA' },
    { value: 1,  suffix: '',   label: 'published paper' },
    { value: 6,  suffix: '+',  label: 'projects' },
  ],
  whatIBring: [
    { title: 'ML Engineering',    description: '...' },
    { title: 'Applied AI · LLM',  description: '...' },
    { title: 'Research & Causal', description: '...' },
    { title: 'Production Builder', description: '...' },
  ],
  exploring: ['AI Agents', 'Causal Inference', 'Game Theory', 'Simulation', 'Dengue Modeling'],
  narrative: {
    intro: '...',     // 2-3 câu giới thiệu kiểu Inugami "I'm a Vietnamese developer who doesn't fit into one box"
    mission: '...',   // 2-3 câu về cách làm việc / tools / hiện tại đang làm gì
  },
};
```
→ **Plan**: viết draft, mình sẽ confirm/sửa nội dung sau khi sinh code.

### `types/index.ts`
Extend type `Profile` với các field mới ở trên.

---

## Files to be created/modified

**Create (7)**:
- `components/hero/StatsCounters.tsx`
- `components/about/AboutSection.tsx`
- `components/about/WhatIBring.tsx`
- `components/about/ExploringTags.tsx`
- `components/projects/ProjectListItem.tsx`
- `components/ui/BootSplash.tsx`
- `components/ui/BootSplashGate.tsx`

**Modify (~11)**:
- `app/page.tsx` (thứ tự render + section mới)
- `app/globals.css` (token mới + utility editorial)
- `components/layout/SectionWrapper.tsx` (top rule)
- `components/ui/SectionHeader.tsx` (eyebrow + display heading)
- `components/layout/TerminalBreadcrumb.tsx` (section list mới)
- `components/layout/Footer.tsx` (micro-copy)
- `components/hero/Hero.tsx` + `HeroRecruiter.tsx` (stats row, remove facts dl)
- `components/skills/SkillsSection.tsx` + `SkillTier.tsx` (categorized chip)
- `components/projects/ProjectsSection.tsx` (numbered list) + `ClassifiedCard.tsx` → `ClassifiedListItem.tsx`
- `components/chronicles/ChroniclesSection.tsx` + `YearGroupedTimeline.tsx` (3 sub-blocks)
- `components/dabm/DABMSection.tsx` (header index/labels)
- `components/contact/ContactSection.tsx` (header index/labels)
- `content/profile.ts` + `types/index.ts` (data extension)

**Delete (1)**:
- `components/ui/ScanlineOverlay.tsx` nếu không nơi nào dùng (kiểm tra qua grep trước).

---

## Existing utilities to reuse (đừng viết lại)

- `lib/hooks/useReducedMotion.ts` — tất cả animation mới phải check.
- `lib/hooks/useTypewriter.ts` — giữ ở hero subtitle nếu muốn.
- `lib/cn.ts` — class merge helper.
- `lib/analytics.ts` — `trackEvent()` cho CTA + numbered project clicks.
- `components/ui/GlassCard.tsx` — base cho "What I bring" cards.
- `framer-motion` `useInView` — drive stats counter animation.
- `ProjectModal`, `EventModal` — vẫn được trigger từ list mới.
- `FilterPills` — giữ filter projects logic.

---

## Verification (cách test end-to-end)

1. **Install + dev server**: `pnpm install` (nếu cần) → `pnpm dev` → mở `http://localhost:3000`.
2. **Visual smoke test** theo từng section, mỗi section check:
   - Eyebrow + display heading hiện đúng (`XX / 07`).
   - Section rule (`section-rule`) hiển thị nhịp editorial.
3. **Hero**: stats counter chạy 0 → target khi cuộn vào view; respect `prefers-reduced-motion` (set OS reduce motion → số hiện luôn, không animate).
4. **About**: 4 cards "What I bring" + tag chips render; identity grid 2×2 đúng dữ liệu.
5. **Stack**: 6 category × chip render đúng từ `content/skills.ts`; hover chip → border đổi accent-pink.
6. **Work**: numbered list 01-06 hiển thị; click filter `research/LLM/...` → list filter mượt; click 1 project mở `ProjectModal`; classified item hiện `[CLASSIFIED]` không clickable Visit.
7. **DABM**: 4 quadrant + Apply dropdown vẫn hoạt động bình thường (regression check).
8. **Record**: 3 sub-block (Organizations / Education / Achievements) render từ chronicles; click event mở `EventModal`.
9. **Contact**: form gửi test → toast success (cần `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` trong `.env.local`).
10. **Effects pruning**: confirm KHÔNG còn scanline overlay full-screen; KHÔNG có glitch trên section heading; starfield + grain + click spark vẫn chạy.
11. **Responsive**: thu nhỏ < 640px → numbered list 1 cột; stats counter wrap 2×2; identity grid stack.
12. **A11y**: tab qua các CTA, focus ring pink hiện rõ; skip-to-content link hoạt động.
13. **Build**: `pnpm build` → không lỗi TS (extend type `Profile`).
14. **Lighthouse**: chạy nhanh — performance không xuống dưới baseline hiện tại; a11y ≥ 95.

---

## Out of scope (cố tình không làm)

- Không đổi palette sang tan/cát (giữ chữ ký Kafka tím/magenta/pink).
- Không bỏ DABM section (USP của bạn).
- Không refactor sang Astro / framework khác.
- Không thêm dark/light theme toggle (bạn dark-only by design).
- Không touch contact form logic (Web3Forms đã chạy ok).
- Không tạo CMS / blog (Inugami không có; ngoài scope).
