# TRACKING — Living implementation log

> Update **this file** every time a task starts/finishes. Format: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked.

**Last sync:** 2026-05-05 · **Current phase:** Phase 5 — verified ✅ (build passes, ready for dev/deploy)

---

## Phase 0 — Bootstrap & docs

- [x] Manual scaffold `package.json`, `tsconfig.json`, `next.config.mjs`
- [x] `tailwind.config.ts` mapping to CSS vars
- [x] `postcss.config.mjs`
- [x] `.gitignore`, `.env.local.example`, `.eslintrc.json`
- [x] Copy `Porfolio-Avatar.png` → `public/avatar.png`
- [x] Copy `TranNamAnh_CV.pdf` → `public/cv/line-resume-2026.pdf`
- [x] Write `README.md`
- [x] Write `PLANNING.md`
- [x] Write `TRACKING.md` (this file)
- [x] Write `HANDOFF.md`
- [x] `npm install` (342 deps, no errors)

## Phase 1 — Foundation

- [x] `app/globals.css` with full design tokens (Section 4.1 blueprint)
- [x] `app/layout.tsx` (fonts, metadata, JSON-LD, ModeProvider, Analytics)
- [x] `app/providers.tsx` (`ModeProvider` with localStorage persistence)
- [x] `lib/cn.ts` (clsx + tailwind-merge)
- [x] `lib/constants.ts` (site URL, social links, CV path)
- [x] `lib/analytics.ts` (event helpers)
- [x] `lib/hooks/useMode.ts`
- [x] `lib/hooks/useTypewriter.ts`
- [x] `lib/hooks/useReducedMotion.ts`
- [x] `types/index.ts` (Project, ChronicleEvent, SkillTier, DABMQuadrant, Mode)
- [x] `content/profile.ts`
- [x] `content/skills.ts`
- [x] `content/projects.ts`
- [x] `content/dabm.ts`
- [x] `content/chronicles.ts`

**Milestone P1:** ✅ Foundation files written.

## Phase 2 — UI primitives + Layout + Hero

- [x] `components/ui/GlassCard.tsx`
- [x] `components/ui/StatusDot.tsx`
- [x] `components/ui/TerminalPrompt.tsx`
- [x] `components/ui/GlitchText.tsx`
- [x] `components/ui/ScanlineOverlay.tsx`
- [x] `components/ui/GrainOverlay.tsx`
- [x] `components/layout/SectionWrapper.tsx`
- [x] `components/layout/TerminalBreadcrumb.tsx`
- [x] `components/layout/ModeToggle.tsx`
- [x] `components/layout/Footer.tsx`
- [x] `components/hero/PillarTags.tsx`
- [x] `components/hero/HeroRecruiter.tsx`
- [x] `components/hero/HeroExperience.tsx`
- [x] `components/hero/Hero.tsx`

**Milestone P2:** ✅ Hero polished cả 2 modes; toggle + reduced-motion guard wired.

## Phase 3 — Skills + Projects + DABM

- [x] `components/skills/SkillTier.tsx`
- [x] `components/skills/SkillsSection.tsx`
- [x] `components/projects/DABMTags.tsx`
- [x] `components/projects/FilterPills.tsx`
- [x] `components/projects/ClassifiedCard.tsx` (glitch CSS-only)
- [x] `components/projects/ProjectCard.tsx`
- [x] `components/projects/FeaturedProjectCard.tsx`
- [x] `components/projects/ProjectModal.tsx`
- [x] `components/projects/ProjectsSection.tsx`
- [x] `components/dabm/DABMQuadrant.tsx`
- [x] `components/dabm/ApplyDropdown.tsx`
- [x] `components/dabm/DABMApplied.tsx`
- [x] `components/dabm/DABMSection.tsx`

**Milestone P3:** ✅ 3 sections live, Featured Dengue prod-grade, 5 classified glitch.

## Phase 4 — Chronicles + Contact + assemble

- [x] `components/chronicles/TimelineNode.tsx`
- [x] `components/chronicles/HorizontalTimeline.tsx`
- [x] `components/chronicles/VerticalTimeline.tsx`
- [x] `components/chronicles/EventModal.tsx`
- [x] `components/chronicles/ChroniclesSection.tsx`
- [x] `components/contact/ProfileLinks.tsx`
- [x] `components/contact/CVDownload.tsx`
- [x] `components/contact/ContactForm.tsx`
- [x] `components/contact/ContactSection.tsx`
- [x] `app/api/contact/route.ts` (Web3Forms proxy + rate limit + honeypot)
- [x] `app/opengraph-image.tsx`
- [x] `app/page.tsx` (all sections assembled)

**Milestone P4:** ✅ Full site shippable.

## Phase 5 — Verify + Deploy

- [x] `npm install` (342 packages)
- [x] `npx tsc --noEmit` passes (0 TS errors)
- [x] `npx next build` passes (page bundle 68.7 kB · First Load 156 kB · 5/5 static pages generated)
- [ ] `npm run dev` manual smoke test by owner (open http://localhost:3000)
- [ ] Lighthouse audit ≥95 all categories
- [ ] Mobile QA (320px → 1920px)
- [ ] Push to GitHub
- [ ] Deploy to Vercel (preview)
- [ ] Set `WEB3FORMS_ACCESS_KEY` in Vercel
- [ ] Test contact form end-to-end
- [ ] Connect domain `linelulan.dev`
- [ ] Enable Vercel Analytics

---

## Weekly notes

### Week of 2026-05-05
- **Started + shipped v1 codebase in 1 session.** Auto-mode. All 5 phases of writing code complete. Switched contact form Resend → Web3Forms (free, no API friction).
- **Build:** `next build` exit 0; types strict pass; First Load JS 156 kB; 5/5 static pages generated; `/api/contact` + `/opengraph-image` as dynamic routes.
- **Next:** Owner runs `npm run dev` and walks through functional checklist in `c-h-t-blueprint-v-golden-wilkinson.md` plan file. Then Vercel deploy.
- **Pending content (non-blocking):** 5 project slot real content (currently classified-glitch placeholders).

---

## Bug log

| ID | Date | Symptom | Root cause | Fix commit |
|---|---|---|---|---|
| (none yet) | | | | |
