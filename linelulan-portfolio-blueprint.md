# Portfolio Blueprint — `linelulan.dev`

**Owner:** Trần Nam Anh (Line)
**Stack:** Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Vercel
**Aesthetic:** Midnight Cyberpunk × Glassmorphism × Terminal × Kafka palette
**Modes:** Dual (Recruiter ↔ Experience)
**Primary goal:** Land DS/MLE/AI Engineer internships + build community presence
**Status:** Blueprint v1.0 — ready for implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Strategic Foundations](#2-strategic-foundations)
3. [Sitemap & Information Architecture](#3-sitemap--information-architecture)
4. [Design System](#4-design-system)
5. [Section Specifications](#5-section-specifications)
6. [Dual-Mode Toggle](#6-dual-mode-toggle)
7. [Component Library](#7-component-library)
8. [Animation & VFX Guide](#8-animation--vfx-guide)
9. [Tech Stack & File Structure](#9-tech-stack--file-structure)
10. [Implementation Roadmap](#10-implementation-roadmap)
11. [Content Checklist](#11-content-checklist)
12. [Project Slot Template](#12-project-slot-template)
13. [Future Enhancements](#13-future-enhancements)

---

## 1. Executive Summary

### Who this is for
**Trần Nam Anh** (alias **Line**, GitHub `@LineLuLan`) — 3rd-year BSc Data Science student at International University, VNU-HCM (GPA 3.69/4.0, expected graduation Sep 2028). Active researcher, co-founder of 100B Studio, Vice Lead at GDGoC HCMIU.

### Positioning (one-liner)
> *Data Scientist & AI Engineer working at the intersection of ML, LLMs, and algorithmic reasoning — and I care that each thing I ship has its own shape.*

### Signature framework — DABM
**Data · Agent · Behavioral · Modeling**
A personal framework combining causal inference, simulation, and AI systems. Used as a **lens that runs across every project card** and as a **dedicated section** in the portfolio.

### Three pillars
1. **ML Engineering** — production-ready ML systems
2. **Applied AI · LLM** — multi-provider LLM tooling, agent design
3. **Research & Causal** — active research with hospital partnership

### Core differentiator
This portfolio does **not** look like other DS portfolios. It looks like the workstation of someone who reads papers, ships products, and cares about typography. The Kafka aesthetic + DABM framework + dual-mode toggle is the iconic combination.

---

## 2. Strategic Foundations

### Two audiences, one site

| Audience | What they need | How portfolio serves them |
|---|---|---|
| **Recruiter / HR** | Scan in 10–30s, see fit, see proof | Recruiter Mode toggle: clean cards, plain text, metrics first |
| **Tech lead / engineer** | Depth, thinking, code | Project case studies + DABM lens + GitHub links |
| **Researcher** | Rigor, methodology, results | Featured Dengue research card + advisor + collaborators |
| **Community / peers** | Personality, taste, story | Experience Mode: full Kafka VFX, terminal animations |

### Honesty principles (non-negotiable)
1. **No fake metrics.** If a number is unverified, write the qualitative impact instead. One fake stat = total trust loss.
2. **No empty profile theater.** Only show external profiles where there's real content. Ghost profiles = negative signal.
3. **Project states are explicit.** "Live", "WIP", "Classified" — never pretend something shipped when it hasn't.
4. **DABM is a thinking tool, not decoration.** Every project card uses DABM tags meaningfully or not at all.

### What this portfolio is NOT
- Not a CV replacement (CV download remains)
- Not a blog (no `/posts` route)
- Not a maximalist demo reel (Recruiter Mode dominates by default for first-time visitors)

### What it IS
- A **proof-of-thinking artifact**
- A **conversation starter** for interviews
- A **landing page** for opportunities (internship, research, freelance)

---

## 3. Sitemap & Information Architecture

### Single-page application (SPA-style scroll)

```
/                                    ← single route, scroll-driven
├── Hero                             ~/usr/line/whoami
├── Skills                           ~/sys/stack
├── Projects                         ~/sys/deployments
├── DABM Framework                   ~/lib/dabm
├── Chronicles (timeline)            ~/var/logs/chronicles
└── Contact                          ~/net/ping
```

### Why single-page
- Recruiters don't navigate. They scroll.
- Faster perceived performance.
- Easier to maintain narrative flow.
- Better for share/preview links.

### Top navigation
Sticky terminal-style breadcrumb that updates with current section:

```
$ ~/sys/deployments _                                  [recruiter | experience] ⌥
```

- Click a path segment → scroll to that section
- Mode toggle in top-right corner (always visible)
- Subtle scroll progress bar at bottom of breadcrumb

### Section flow rationale (story arc)

```
WHO     → Hero               (positioning + identity)
HOW     → Skills              (capability breadth)
WHAT    → Projects            (proof of work)
WHY     → DABM                (how I think)
WHEN    → Chronicles          (track record)
TALK    → Contact             (next step)
```

This is the order recruiters mentally process information. Following it = lower cognitive load.

---

## 4. Design System

### 4.1 Color tokens

```css
/* globals.css — define in :root */
--bg-void:        #000000;   /* page background */
--bg-midnight:    #0a0a0a;   /* section background */
--bg-card:        rgba(20, 20, 28, 0.6);   /* glassmorphic cards */

--accent-purple:  #8a2be2;   /* primary neon */
--accent-magenta: #c71585;   /* secondary neon */
--accent-pink:    #e07b97;   /* hover/glow (Kafka pastel) */

--text-primary:   #ffffff;   /* headings, terminal */
--text-secondary: #a3a3a3;   /* body */
--text-tertiary:  #6b6b6b;   /* captions, timestamps */

--border-subtle:  rgba(255, 255, 255, 0.08);
--border-glow:    rgba(138, 43, 226, 0.4);

--success:        #4ade80;   /* live status */
--warning:        #fbbf24;   /* WIP status */
--info:           #60a5fa;   /* coming soon */
```

### 4.2 Typography

```css
/* Display / monospace — code, paths, terminal */
font-family: 'JetBrains Mono', 'Fira Code', monospace;

/* Body / sans — descriptions, prose */
font-family: 'Geist', 'Inter', -apple-system, sans-serif;
```

**Type scale:**

| Token | Size | Use |
|---|---|---|
| `text-xs`   | 11px | timestamps, captions |
| `text-sm`   | 13px | body small, terminal output |
| `text-base` | 15px | body default |
| `text-lg`   | 18px | subheadings |
| `text-xl`   | 24px | section titles |
| `text-2xl`  | 36px | Hero subtitle |
| `text-3xl`  | 56px | Hero name |
| `text-4xl`  | 72px+ | featured pull quotes |

**Line-height:** 1.6 for body, 1.2 for headings, 1.5 for monospace.

### 4.3 Spacing system

Tailwind default 4px base. Use only these values: `1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64`.

**Section vertical padding:** `py-24` desktop / `py-16` mobile.
**Card padding:** `p-6` default, `p-8` for featured.
**Gap between cards:** `gap-6` desktop, `gap-4` mobile.

### 4.4 Effects

```css
/* Glassmorphic card */
.card-glass {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
}

/* Soft glow on hover */
.glow-hover:hover {
  border-color: var(--border-glow);
  box-shadow: 0 0 24px rgba(138, 43, 226, 0.15);
  transition: all 200ms ease-out;
}

/* Neon text */
.neon-text {
  color: var(--accent-pink);
  text-shadow: 0 0 8px rgba(224, 123, 151, 0.4);
}

/* Grain overlay (atmosphere) */
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,...'); /* SVG noise */
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: overlay;
}

/* Scanline (terminal feel) — use sparingly */
.scanline::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0,
    transparent 2px,
    rgba(255, 255, 255, 0.02) 2px,
    rgba(255, 255, 255, 0.02) 4px
  );
  pointer-events: none;
}
```

### 4.5 Border radius scale
- `rounded-sm` (4px) — buttons, tags
- `rounded-lg` (8px) — input fields
- `rounded-xl` (12px) — cards (default)
- `rounded-2xl` (16px) — featured cards

### 4.6 Status badges

```
● live          → --success (green dot)
● modeling      → --warning (yellow dot)
● building      → --warning (yellow dot)
● paused        → --text-tertiary (gray dot)
● classified    → --accent-magenta (magenta dot, pulsing)
```

---

## 5. Section Specifications

---

### 5.1 Hero — `~/usr/line/whoami`

#### Recruiter Mode (default for first visit)

**Layout:** Centered column, max-width 720px. Avatar top-left optional.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Trần Nam Anh — Line                                   │
│   Data Scientist & AI Engineer                          │
│                                                         │
│   Working at the intersection of ML, LLMs, and          │
│   algorithmic reasoning — and I care that each thing    │
│   I ship has its own shape.                             │
│                                                         │
│   I think in DABM: Data · Agent · Behavioral · Modeling │
│                                                         │
│   [ ML Engineering ]  [ Applied AI · LLM ]              │
│   [ Research & Causal ]                                 │
│                                                         │
│   > location:    Ho Chi Minh City, VN                   │
│   > status:      3rd year · BSc Data Science @ HCMIU    │
│   > gpa:         3.69 / 4.0                             │
│   > research:    dengue shock prediction (HTD × IU)     │
│   > building:    100B Studio · co-founder               │
│   > open to:     DS / MLE / AI Engineer internships     │
│                                                         │
│   [ download CV ]   [ get in touch ]   [ github ]       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Experience Mode

**Layout:** Same column, but with terminal animations.

```
$ whoami
> compiling destiny from causal chains...
> rendering identity ▓▓▓▓▓▓▓▓▓▓ 100%
> session_id: line_2026_v1

  > NAME      Trần Nam Anh ─ "Line"
  > ROLE      Data Scientist & AI Engineer
  > MISSION   Working at the intersection of
              ML, LLMs, and algorithmic reasoning —
              and I care that each thing I ship
              has its own shape.

  > FRAMEWORK DABM ─ Data · Agent · Behavioral · Modeling
              (causal inference + simulation + AI systems)

  [ML_ENGINEERING] [APPLIED_AI/LLM] [RESEARCH_&_CAUSAL]

  > location:    Ho Chi Minh City, VN
  > status:      3rd year · BSc Data Science @ HCMIU
  > gpa:         3.69 / 4.0
  > research:    dengue_shock_prediction (HTD × IU)
  > building:    100B_Studio · co-founder
  > open_to:     DS · MLE · AI_Engineer · internships

> _
```

#### Animations (Experience Mode)
- "compiling destiny..." typed character-by-character (40ms/char)
- Progress bar fills on first paint (1.2s)
- Lines reveal sequentially (stagger 80ms)
- Terminal cursor blinks at the bottom (500ms interval)
- Pillar tags fade in last with subtle scale (1.0 → 1.0, 0.95 start)

#### Avatar treatment
- Recruiter Mode: clean circle, 96px, top-right of header column
- Experience Mode: same image but with subtle CRT scanline overlay + magenta glow on hover
- Source: GitHub avatar from `@LineLuLan`

---

### 5.2 Skills — `~/sys/stack`

**Layout:** Three-tier stacked column. Each tier is a glassmorphic card with monospace labels.

```
┌─ ~/sys/stack ──────────────────────────────────────────┐
│                                                        │
│   $ cat core_stack.log                                 │
│   ┌──────────────────────────────────────────────┐    │
│   │  CORE STACK · daily reach                    │    │
│   │                                              │    │
│   │  Languages  Python · SQL · TypeScript · JS   │    │
│   │  ML/DL      PyTorch · TensorFlow · Sklearn   │    │
│   │  Data       Pandas · NumPy                   │    │
│   │  Frontend   React · Next.js                  │    │
│   │  Tools      Git · Jupyter                    │    │
│   └──────────────────────────────────────────────┘    │
│                                                        │
│   $ cat llm_toolbox.log                                │
│   ┌──────────────────────────────────────────────┐    │
│   │  LLM TOOLBOX · multi-provider experience     │    │
│   │                                              │    │
│   │  APIs        OpenAI · Anthropic · Gemini ·   │    │
│   │              OpenRouter                       │    │
│   │  Inference   Groq · Cerebras                 │    │
│   │  Open src    HuggingFace                     │    │
│   └──────────────────────────────────────────────┘    │
│                                                        │
│   $ cat working_knowledge.log                          │
│   ┌──────────────────────────────────────────────┐    │
│   │  WORKING KNOWLEDGE · shipped projects        │    │
│   │                                              │    │
│   │  Bayesian        PyMC                        │    │
│   │  Time series     forecasting · statsmodels   │    │
│   │  Computer vision OpenCV                      │    │
│   │  RecSys          collaborative + content     │    │
│   │  RL              policy gradient · Q-learning│    │
│   │  Cloud           Vercel · Supabase · Neon ·  │    │
│   │                  MongoDB Atlas               │    │
│   │  Databases       PostgreSQL · MongoDB ·      │    │
│   │                  Redis · Prisma              │    │
│   │  Other lang      Java · R                    │    │
│   └──────────────────────────────────────────────┘    │
│                                                        │
│   $ cat exploring.log                                  │
│   ┌──────────────────────────────────────────────┐    │
│   │  EXPLORING · active investment               │    │
│   │                                              │    │
│   │  → Agent system & LLM pipeline design        │    │
│   │  → Advanced ML/DL techniques                 │    │
│   │  → Database architecture & management        │    │
│   │  → MLOps fundamentals                        │    │
│   └──────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Visual notes:**
- Each `$ cat ...log` header in --accent-pink, monospace
- Skill names in --text-primary, descriptors in --text-secondary
- Tier labels in --accent-purple
- Cards have hover glow

**Mobile:** Same vertical stack, font-size scales down 1 step.

---

### 5.3 Projects — `~/sys/deployments`

**Layout:** 1 featured card (full-width) + 5 grid cards (3 columns desktop, 2 tablet, 1 mobile).

```
┌─ ~/sys/deployments ────────────────────────────────────┐
│                                                        │
│   filter: [ all ] [ research ] [ LLM ] [ ML ]          │
│           [ EdTech ] [ creative ]                      │
│                                                        │
│  ╔══════════════════════════════════════════════════╗  │
│  ║  ★ FEATURED · RESEARCH                           ║  │
│  ║                                                  ║  │
│  ║  Dengue Shock Prediction                         ║  │
│  ║  ●  modeling                                     ║  │
│  ║                                                  ║  │
│  ║  Predicting post-fever shock progression in      ║  │
│  ║  dengue patients using time-series clinical      ║  │
│  ║  data — in collaboration with Hospital for       ║  │
│  ║  Tropical Diseases HCMC.                         ║  │
│  ║                                                  ║  │
│  ║  collab    HTD HCMC × IU Data Science            ║  │
│  ║  team      2 senior researchers + 2 physicians   ║  │
│  ║  advisor   Dr. Nguyễn Thị Thúy Loan              ║  │
│  ║            (Head of Data Science Dept., IU)      ║  │
│  ║  ethics    IRB-approved, dataset received        ║  │
│  ║  status    feature engineering & model design    ║  │
│  ║                                                  ║  │
│  ║  DABM →                                          ║  │
│  ║   [D] hospital records · time-windowed           ║  │
│  ║   [A] physicians making triage decisions         ║  │
│  ║   [B] symptom progression curves                 ║  │
│  ║   [M] survival models · early warning            ║  │
│  ║                                                  ║  │
│  ║  [ read more →   ] [ contact for details ]       ║  │
│  ╚══════════════════════════════════════════════════╝  │
│                                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │ slot 02    │  │ slot 03    │  │ slot 04    │       │
│  │ [tagline]  │  │ [tagline]  │  │ [tagline]  │       │
│  │ ●  state   │  │ ●  state   │  │ ●  state   │       │
│  │            │  │            │  │            │       │
│  │ DABM       │  │ DABM       │  │ DABM       │       │
│  │ [D][A][B][M] │ [D][A][B][M] │ [D][A][B][M] │       │
│  │            │  │            │  │            │       │
│  │ tech: ...  │  │ tech: ...  │  │ tech: ...  │       │
│  │ [ open → ] │  │ [ open → ] │  │ [ open → ] │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│                                                        │
│  ┌────────────┐  ┌────────────┐                       │
│  │ slot 05    │  │ slot 06    │                       │
│  │ [tagline]  │  │ ▓▓▓▓▓▓▓▓▓▓ │                       │
│  │ ●  state   │  │ classified │                       │
│  │            │  │            │                       │
│  └────────────┘  └────────────┘                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Card states (visual):**

| State | Border | Status dot | Content |
|---|---|---|---|
| **Live** | Solid `--border-glow` | Green pulse | Full content + GitHub + demo |
| **Modeling/Building** | Dashed magenta | Yellow pulse | Tagline + DABM + ETA |
| **Classified** | Animated glitch | Magenta pulse | Codename only + "▓▓▓" placeholder |

**Filter behavior:**
- Pills at top filter cards by domain tag
- Active pill: filled magenta; inactive: outlined
- Smooth fade-out + reflow on filter change (Framer Motion `layout`)

**Card hover:**
- Border glow intensifies
- Subtle 1.02x scale
- Card content shifts up 4px
- Background blur slightly increases

**Card click (Live state):**
- Opens full project case study (modal or `/projects/[slug]` route — recommend modal for SPA feel)
- Modal includes: problem, dataset, method, results, tech stack, GitHub link, lessons learned

---

### 5.4 DABM Framework — `~/lib/dabm`

**Layout:** 2×2 quadrant grid, centered, max-width 960px. Connecting lines between quadrants imply unity.

```
┌─ ~/lib/dabm ────────────────────────────────────────────┐
│                                                         │
│   $ import dabm                                         │
│                                                         │
│   DABM = Data · Agent · Behavioral · Modeling           │
│   A personal framework combining causal inference,      │
│   simulation, and AI systems.                           │
│                                                         │
│         ┌─────────────────┐ ─── ┌─────────────────┐    │
│         │                 │     │                 │    │
│         │      [D]        │     │      [A]        │    │
│         │      DATA       │  ◆  │     AGENT       │    │
│         │                 │     │                 │    │
│         │  Is it raw or   │     │  Autonomous     │    │
│         │  processed?     │     │  entities with  │    │
│         │  What's the     │     │  their own      │    │
│         │  context, the   │     │  logic and      │    │
│         │  preprocessing  │     │  decision-      │    │
│         │  depth, the     │     │  making.        │    │
│         │  reliability?   │     │                 │    │
│         │                 │     │  Used to        │    │
│         │  Is it enough — │     │  simulate       │    │
│         │  and right —    │     │  complex        │    │
│         │  for what we    │     │  systems or     │    │
│         │  want to train? │     │  support        │    │
│         │                 │     │  decisions.     │    │
│         └─────────────────┘     └─────────────────┘    │
│                  │                       │              │
│                  ▼                       ▼              │
│         ┌─────────────────┐     ┌─────────────────┐    │
│         │                 │     │                 │    │
│         │      [B]        │     │      [M]        │    │
│         │   BEHAVIORAL    │  ◆  │    MODELING     │    │
│         │                 │     │                 │    │
│         │  The core       │     │  The standard-  │    │
│         │  layer.         │     │  ization layer. │    │
│         │                 │     │                 │    │
│         │  How components │     │  Turns the      │    │
│         │  interact, how  │     │  whole system   │    │
│         │  flows propa-   │     │  into something │    │
│         │  gate, how the  │     │  we can         │    │
│         │  system actu-   │     │  simulate,      │    │
│         │  ally operates  │     │  optimize, and  │    │
│         │  under load.    │     │  verify against │    │
│         │                 │     │  intent.        │    │
│         └─────────────────┘     └─────────────────┘    │
│                                                         │
│   ─────────────────────────────────────────────         │
│                                                         │
│   Applied to: [ Dengue Shock Prediction  ▼ ]            │
│                                                         │
│   ┌─────────────────────────────────────────────┐      │
│   │  [D] hospital records · time-windowed       │      │
│   │      measurements · IRB-approved dataset    │      │
│   │  [A] physicians making triage decisions     │      │
│   │  [B] symptom progression curves over hours  │      │
│   │  [M] survival models · early-warning        │      │
│   │      classifier                             │      │
│   └─────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Center node:** small pulsing `◆` with magenta glow at the cross-intersection.

**Quadrant interactions:**
- Hover → border glows, slight tilt (Framer `whileHover` rotateX/Y 1deg)
- Click → quadrant expands with deeper explanation (optional v2)

**"Applied to" dropdown:**
- Lists all live projects
- Selecting a project re-fills the bottom strip with that project's DABM mapping
- Smooth crossfade transition (300ms)

**Why quadrants are connected:**
- Diagonal lines between quadrants signal "these aren't independent dimensions"
- Subtle, animated dot traveling along lines (slow, 4s loop)

---

### 5.5 Chronicles — `~/var/logs/chronicles`

**Layout:** Horizontal timeline (desktop) — vertical fallback (mobile <768px).

```
┌─ ~/var/logs/chronicles ────────────────────────────────┐
│                                                        │
│   $ tail -f chronicles.log                             │
│                                                        │
│   2020 ──── 2023 ──── 2024 ──── 2025 ────── 2026 ──→   │
│    ●         ● ●        ●        ● ● ●     ● ● ● ●     │
│    │         │ │        │        │ │ │     │ │ │ │     │
│   HS       Grad IU      GDG     IU  │ │   Vice  │ │ Swift│
│   Gia      9.5 Year1   Member   Khai│ │   Lead  │ │ Conf │
│   Định                          Tâm │ │         │ │     │
│                              TechTalk│IU AI 3rd Dengue 100B
│                                              place Research Studio
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Node visual coding:**

| Type | Icon | Color | Size |
|---|---|---|---|
| Education | ●  | --text-tertiary | small |
| Role/Work | ◆  | --accent-purple | medium |
| Award | ★  | --accent-pink (glow) | large |
| Event/Talk | ▲  | --accent-magenta | medium |
| Project/Research | ✦ | --accent-pink | large |

**Full event list (chronological):**

```
2020 Sep  ●  Started THPT Gia Định
2023 Jun  ●  Graduated HS · GPA 9.5/10 · ĐGNL 820 · THPTQG 25.2
2023 Aug  ◆  Khai Tâm Tutoring Center · part-time educator (ongoing)
2023 Sep  ●  IU — Year 1, BSc Data Science
2024 Sep  ◆  Joined GDGoC HCMIU (member)
2025 Aug  ◆  Promoted to Vice Lead Chapter, GDGoC (Gen 5, term 2025–2026)
2025 Nov  ▲  Hosted TechTalk · AI Chatbots × Blockchain
2025 Dec  ★  3rd Place · IU AI Competition 2025
2026 Feb  ✦  Started Dengue Shock Prediction research (HTD × IU)
2026 Apr  ▲  Speaker · Swift Conference Vietnam (15/4)
2026 Apr  ✦  Co-founded 100B Studio (15/4)
2026 Sep  ◇  GDGoC term ends (planned)
2028 Sep  ◇  IU graduation (expected)
```

**Interactions:**
- Hover node → expand into popover card with title + 1-line description
- Click node → modal with full details (org, role, impact metrics, link if available)
- Recruiter Mode: labels visible by default
- Experience Mode: labels reveal on hover (encourages exploration)

**Animation on scroll into view:**
- Year markers fade in
- Nodes "ping" sequentially left → right (60ms stagger between nodes)
- Connecting line draws from left to "now" (800ms)
- Optional subtle "ping" sound (off by default, no autoplay)

**Mobile fallback:**
- Vertical timeline, time → top to bottom
- Nodes on left, content on right
- Same visual coding

---

### 5.6 Contact — `~/net/ping`

**Layout:** Single column, max-width 640px, centered.

```
┌─ ~/net/ping ───────────────────────────────────────────┐
│                                                        │
│   > awaiting user input_                               │
│                                                        │
│   Got an opportunity, a question, or just want to      │
│   compare notes on causal inference? Send a packet.    │
│                                                        │
│   ┌────────────────────────────────────────────────┐  │
│   │  PRIMARY                                       │  │
│   │                                                │  │
│   │  email     tnanh.gdsciu@gmail.com       ✉      │  │
│   │  github    @LineLuLan                    ↗     │  │
│   │  linkedin  www.linkedin.com/in/anhline03    ↗     │  │
│   └────────────────────────────────────────────────┘  │
│                                                        │
│   ┌────────────────────────────────────────────────┐  │
│   │  PROOF OF WORK                                 │  │
│   │                                                │  │
│   │  kaggle    https://www.kaggle.com/lineizumi    ↗     │  │
│   └────────────────────────────────────────────────┘  │
│                                                        │
│   ─────────────────────────────────────                │
│                                                        │
│   $ send_packet                                        │
│   ┌────────────────────────────────────────────────┐  │
│   │  > from:                                       │  │
│   │  [   your_email                              ] │  │
│   │                                                │  │
│   │  > subject:                                    │  │
│   │  [   what's this about                       ] │  │
│   │                                                │  │
│   │  > message:                                    │  │
│   │  ┌──────────────────────────────────────────┐ │  │
│   │  │                                          │ │  │
│   │  │                                          │ │  │
│   │  │                                          │ │  │
│   │  └──────────────────────────────────────────┘ │  │
│   │                                                │  │
│   │           [ ▶  transmit ]                     │  │
│   └────────────────────────────────────────────────┘  │
│                                                        │
│   ┌────────────────────────────────────────────────┐  │
│   │  [ ↓ download CV ]                             │  │
│   └────────────────────────────────────────────────┘  │
│                                                        │
│   > connection ready · response time < 24h            │
│   > © 2026 line · built with caffeine and curiosity   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Form implementation:**
- Use **Resend** (free tier 100/day, 3000/month) or **Web3Forms** (free, no signup)
- Honeypot field for spam (hidden input, reject if filled)
- Rate limit by IP (1 submit / 30s)
- On success: terminal message replaces form: `> packet transmitted · expect response in 24h`
- On error: `> connection failed · try email directly`

**CV download:**
- Static PDF in `/public/cv/line-resume-2026.pdf`
- Download attribute set, opens in new tab as fallback
- Track downloads via Vercel Analytics event

---

## 6. Dual-Mode Toggle

### Implementation

```tsx
// app/providers.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type Mode = 'recruiter' | 'experience';
const ModeContext = createContext<{ mode: Mode; toggle: () => void } | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('recruiter');

  useEffect(() => {
    // Check localStorage on mount
    const saved = window.localStorage.getItem('portfolio-mode') as Mode;
    if (saved) setMode(saved);
  }, []);

  const toggle = () => {
    const next: Mode = mode === 'recruiter' ? 'experience' : 'recruiter';
    setMode(next);
    window.localStorage.setItem('portfolio-mode', next);
  };

  return (
    <ModeContext.Provider value={{ mode, toggle }}>
      <div data-mode={mode}>{children}</div>
    </ModeContext.Provider>
  );
}

export const useMode = () => {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be inside ModeProvider');
  return ctx;
};
```

### Behavioral differences

| Element | Recruiter Mode | Experience Mode |
|---|---|---|
| Default on first visit | ✅ Yes | ❌ |
| Animations | Reduced (fade only, no typing) | Full (typing, glitch, scanline) |
| Labels in timeline | Always visible | Hover-only |
| Hero introduction | Plain text | Terminal boot sequence |
| Skill section | Lists | Same lists with `$ cat` prefix typed |
| DABM expansion | All visible | Hover to reveal |
| Background grain | Light | Heavier |
| Scanline overlay | Off | On (subtle) |
| Cursor | Default | Custom (blinking caret on text hover) |
| Sound cues | Off | Off (toggleable in v2) |

### Toggle UI

Top-right, sticky:

```
┌─────────────────────────────┐
│  ◯ recruiter   ●  experience │
└─────────────────────────────┘
```

- Pill toggle, magenta active state
- `prefers-reduced-motion: reduce` → forces Recruiter Mode (accessibility)

---

## 7. Component Library

### File structure

```
components/
├── layout/
│   ├── TerminalBreadcrumb.tsx       // top nav
│   ├── ModeToggle.tsx               // dual-mode switch
│   ├── SectionWrapper.tsx           // consistent padding/animation
│   └── Footer.tsx
├── hero/
│   ├── Hero.tsx                     // mode-aware hero
│   ├── HeroRecruiter.tsx
│   ├── HeroExperience.tsx
│   ├── TypewriterText.tsx           // typing animation
│   └── PillarTags.tsx
├── skills/
│   ├── SkillsSection.tsx
│   └── SkillTier.tsx                // reusable card per tier
├── projects/
│   ├── ProjectsSection.tsx
│   ├── FeaturedProjectCard.tsx      // Dengue card
│   ├── ProjectCard.tsx              // grid card
│   ├── ClassifiedCard.tsx           // empty slot
│   ├── ProjectModal.tsx             // case study popup
│   ├── DABMTags.tsx                 // [D][A][B][M] mini-tags
│   └── FilterPills.tsx
├── dabm/
│   ├── DABMSection.tsx
│   ├── DABMQuadrant.tsx
│   ├── ApplyDropdown.tsx            // project selector
│   └── DABMApplied.tsx              // bottom result strip
├── chronicles/
│   ├── ChroniclesSection.tsx
│   ├── HorizontalTimeline.tsx       // desktop
│   ├── VerticalTimeline.tsx         // mobile fallback
│   ├── TimelineNode.tsx
│   └── EventModal.tsx
├── contact/
│   ├── ContactSection.tsx
│   ├── ContactForm.tsx              // server action
│   ├── ProfileLinks.tsx
│   └── CVDownload.tsx
└── ui/
    ├── GlassCard.tsx
    ├── StatusDot.tsx
    ├── TerminalPrompt.tsx           // "$ command"
    ├── GlitchText.tsx               // for classified cards
    ├── ScanlineOverlay.tsx
    └── GrainOverlay.tsx
```

### Key reusable components

#### `<TerminalPrompt>`

```tsx
interface TerminalPromptProps {
  command: string;
  output?: React.ReactNode;
  showCursor?: boolean;
  typed?: boolean;  // animate typing in Experience Mode
}
```

#### `<GlassCard>`

```tsx
interface GlassCardProps {
  children: React.ReactNode;
  glow?: 'purple' | 'magenta' | 'pink' | 'none';
  state?: 'live' | 'wip' | 'classified';
  onClick?: () => void;
  className?: string;
}
```

#### `<DABMTags>`

```tsx
interface DABMTagsProps {
  data?: string;       // "hospital records · time-windowed"
  agent?: string;      // "physicians making triage decisions"
  behavior?: string;   // "symptom progression"
  modeling?: string;   // "survival models"
  size?: 'sm' | 'md';
}

// Renders:
// [D] data text  [A] agent text  [B] behavior text  [M] modeling text
// Empty fields render as: [D] ▓▓▓▓
```

---

## 8. Animation & VFX Guide

### Principles
1. **Animation serves comprehension, not decoration.**
2. **High-impact moments > scattered micro-interactions.**
3. **Respect `prefers-reduced-motion`.**
4. **Never block content visibility for >800ms.**

### Animation budget per section

| Section | On scroll-in | Hero | Constant |
|---|---|---|---|
| Hero | Stagger fade + typewriter (Experience) | N/A (it IS the hero) | Cursor blink |
| Skills | Cards fade up sequentially | N/A | None |
| Projects | Cards fade in with subtle slide | Featured card slight pulse | Status dots pulse |
| DABM | Quadrants assemble (one by one, 100ms stagger) | Center node pulse | Connecting line dot travel (4s loop) |
| Chronicles | Line draws + nodes ping sequentially | None | None |
| Contact | Fade in form fields | None | Cursor blink in inputs |

### Specific motions

#### Typewriter effect (Hero, Experience Mode)

```tsx
// Use Framer Motion's stagger + custom hook
const sentence = "compiling destiny from causal chains...";
const speed = 40; // ms per character

useEffect(() => {
  let i = 0;
  const interval = setInterval(() => {
    setDisplayed(sentence.slice(0, i));
    i++;
    if (i > sentence.length) clearInterval(interval);
  }, speed);
  return () => clearInterval(interval);
}, []);
```

#### Card hover

```tsx
<motion.div
  whileHover={{
    scale: 1.02,
    borderColor: 'var(--accent-pink)',
    boxShadow: '0 0 32px rgba(224, 123, 151, 0.2)',
  }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
/>
```

#### Glitch effect (Classified cards)

CSS-only, lightweight:

```css
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(2px, -1px); }
  60% { transform: translate(-1px, 2px); }
  80% { transform: translate(1px, -2px); }
}

.glitch {
  animation: glitch 0.3s infinite;
  animation-play-state: paused;
}
.glitch:hover {
  animation-play-state: running;
}
```

#### Timeline draw

```tsx
<motion.line
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  transition={{ duration: 1.2, ease: 'easeInOut' }}
  viewport={{ once: true, margin: '-100px' }}
/>
```

#### Scroll-triggered section entrance

```tsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  viewport={{ once: true, margin: '-80px' }}
/>
```

### Reduced-motion guard

```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduce = useReducedMotion();
const animation = shouldReduce
  ? { opacity: 1, y: 0 }
  : { opacity: 0, y: 40, transition: ... };
```

---

## 9. Tech Stack & File Structure

### Dependencies (package.json)

```json
{
  "name": "linelulan-portfolio",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "next-themes": "^0.3.0",
    "geist": "^1.3.0",
    "@vercel/analytics": "^1.3.0",
    "resend": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

### Project structure

```
linelulan-portfolio/
├── app/
│   ├── layout.tsx                  // root layout, fonts, metadata
│   ├── page.tsx                    // single-page: imports all sections
│   ├── globals.css                 // CSS vars, tailwind directives
│   ├── providers.tsx               // ModeProvider wrapper
│   ├── api/
│   │   └── contact/
│   │       └── route.ts            // POST /api/contact (Resend integration)
│   └── opengraph-image.tsx         // dynamic OG image (Next.js 14 feature)
├── components/                      // (see Component Library above)
├── content/
│   ├── projects.ts                 // project slot data
│   ├── chronicles.ts               // timeline events
│   ├── skills.ts                   // skill tiers
│   └── dabm.ts                     // DABM quadrant content
├── lib/
│   ├── cn.ts                       // clsx + tailwind-merge utility
│   ├── analytics.ts                // event tracking helpers
│   └── constants.ts                // social links, email, etc.
├── public/
│   ├── avatar.png                  // GitHub avatar local copy
│   ├── cv/
│   │   └── line-resume-2026.pdf
│   ├── og.png                      // OG image fallback
│   └── fonts/                      // (or use next/font for Geist + JetBrains Mono)
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
├── .env.local                      // RESEND_API_KEY, etc.
└── README.md
```

### Critical config files

#### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        midnight: '#0a0a0a',
        'accent-purple': '#8a2be2',
        'accent-magenta': '#c71585',
        'accent-pink': '#e07b97',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'cursor-blink': 'blink 1s steps(2) infinite',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
    },
  },
  plugins: [],
};

export default config;
```

#### `app/layout.tsx` skeleton

```tsx
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ModeProvider } from './providers';
import './globals.css';

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Line — Data Scientist & AI Engineer',
  description:
    'Working at the intersection of ML, LLMs, and algorithmic reasoning. I think in DABM.',
  metadataBase: new URL('https://linelulan.dev'),
  openGraph: {
    title: 'Line — Data Scientist & AI Engineer',
    description: 'DABM: Data · Agent · Behavioral · Modeling',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${jetbrains.variable}`}>
      <body className="bg-void text-white antialiased">
        <ModeProvider>{children}</ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

### Environment variables

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxx
CONTACT_EMAIL=your-email@domain.com
NEXT_PUBLIC_SITE_URL=https://linelulan.dev
```

### Deployment (Vercel)

1. Push repo to GitHub
2. Import in Vercel dashboard → auto-detects Next.js
3. Add environment variables
4. Add custom domain `linelulan.dev`
5. Enable Vercel Analytics (free)
6. (Optional) Enable Speed Insights

---

## 10. Implementation Roadmap

### Week 1 — Foundation

**Day 1–2:**
- [ ] `npx create-next-app@latest linelulan-portfolio --typescript --tailwind --app`
- [ ] Install dependencies (framer-motion, lucide-react, geist, etc.)
- [ ] Set up `tailwind.config.ts`, `globals.css` with all CSS vars
- [ ] Build `<ModeProvider>` and `<ModeToggle>`
- [ ] Set up base layout with fonts

**Day 3–4:**
- [ ] Build `<TerminalBreadcrumb>` (sticky top nav)
- [ ] Build `<GlassCard>`, `<StatusDot>`, `<TerminalPrompt>` UI primitives
- [ ] Build `<SectionWrapper>` with scroll-trigger animation

**Day 5–7:**
- [ ] Build `<Hero>` with both Recruiter and Experience modes
- [ ] Implement `<TypewriterText>` hook
- [ ] Wire up first scroll-trigger reveal

**Milestone:** Hero section live and polished. Mode toggle works.

---

### Week 2 — Content sections

**Day 8–9:**
- [ ] Build `<SkillsSection>` with 4 tiers
- [ ] Populate `content/skills.ts`

**Day 10–11:**
- [ ] Build `<ProjectsSection>` shell
- [ ] Build `<FeaturedProjectCard>` for Dengue
- [ ] Build `<ProjectCard>` and `<ClassifiedCard>` variants
- [ ] Build `<DABMTags>` mini-component
- [ ] Populate Dengue content; placeholders for other 5 slots

**Day 12–14:**
- [ ] Build `<DABMSection>` with quadrants
- [ ] Build `<ApplyDropdown>` and `<DABMApplied>` strip
- [ ] Add Dengue mapping as default selected

**Milestone:** Projects + DABM live. Featured card looks production-grade.

---

### Week 3 — Timeline + Contact + polish

**Day 15–17:**
- [ ] Build `<HorizontalTimeline>` (desktop)
- [ ] Build `<VerticalTimeline>` mobile fallback
- [ ] Implement node hover popovers and click modals
- [ ] Populate `content/chronicles.ts` with all 13 events

**Day 18–19:**
- [ ] Build `<ContactSection>` with form
- [ ] Set up Resend API route `/api/contact`
- [ ] Add `<CVDownload>` button + place CV PDF in `/public/cv/`
- [ ] Add profile links (GitHub, LinkedIn, Kaggle)

**Day 20–21:**
- [ ] Build `<Footer>`
- [ ] Add `prefers-reduced-motion` guards everywhere
- [ ] Add OG image (dynamic via `app/opengraph-image.tsx`)
- [ ] Lighthouse audit (target: 95+ all categories)
- [ ] Mobile QA pass

**Milestone:** Full site shippable.

---

### Week 4 — Launch & iterate

**Day 22:**
- [ ] Deploy to Vercel
- [ ] Connect `linelulan.dev` domain
- [ ] Verify Resend, analytics
- [ ] Test contact form end-to-end

**Day 23+:**
- [ ] Share with 3 trusted reviewers (1 recruiter, 1 engineer, 1 designer)
- [ ] Iterate based on feedback
- [ ] Fill remaining project slots as content becomes ready

---

## 11. Content Checklist

### ✅ Locked (ready to use)

- [x] Name: Trần Nam Anh — "Line"
- [x] Positioning + tagline
- [x] DABM definition + 4 quadrants copy
- [x] University, GPA, graduation date
- [x] High school details
- [x] All 13 chronicle events with dates
- [x] Skills (all 4 tiers populated)
- [x] LLM toolbox (7 providers)
- [x] Pillar tags (3 pillars)
- [x] GitHub username
- [x] Domain: linelulan.dev
- [x] Tech stack decisions

### 🟡 Partial (need final values)

- [ ] **Email** — for display + contact form sender
- [ ] **LinkedIn URL slug** — `linkedin.com/in/____`
- [ ] **Kaggle username** — for profile link
- [ ] **Avatar** — confirm GitHub avatar URL or upload local copy
- [ ] **CV PDF** — provide file to place in `/public/cv/`

### 🔴 Empty (project slots — fill later)

For each slot, provide:

```
Codename:
Tagline (1 line):
Domain tag(s):
State (live | wip | classified):
Problem:
Dataset (source, size):
Method (model, approach):
Results (metrics):
Tech stack:
Role (solo | team — your part):
Links (github, demo):
DABM mapping:
  [D] data:
  [A] agent:
  [B] behavior:
  [M] modeling:
```

**Slots to fill:**
1. Slot 02 — likely **LegalLLM** (IU AI 2025 winner, LLM tutor for Law students)
2. Slot 03 — Panic Hub (causal user behavior simulation)
3. Slot 04 — Worldforesight
4. Slot 05 — Educata (edtech)
5. Slot 06 — ForPrincess **or** 100B Studio product (your choice)

### 🟢 Recommended additions (when ready)

- [ ] **Photo** — high-quality avatar (the GitHub one is fine, but consider one with cleaner background for OG image)
- [ ] **Demo videos** for projects when shipped (15-30s loops, muted)
- [ ] **Blog post about DABM** (publish to dev.to or self-host) — link from DABM section
- [ ] **First Hugging Face upload** — even a small fine-tuned model gives credibility

---

## 12. Project Slot Template

Use this format every time you fill a project slot. Paste into chat with me and I'll produce the card content.

```markdown
## PROJECT: [name]

**Codename / display name:** ________
**Tagline (max 80 chars):** ________
**Primary domain tag:** [research | LLM | ML | EdTech | creative | other]
**Secondary tag (optional):** ________
**State:** [live | wip | classified]

### Story

**Problem:**
What was the actual problem? 2–3 sentences. No buzzwords.

**Dataset:**
Source: ________
Size: ________ rows / records / tokens / images
Type: tabular | text | image | time-series | graph | other
Notes: how clean? labeled? IRB?

**Method:**
Approach in 2–3 sentences. Mention model family, key technique.
Architecture diagram URL (optional):

**Results:**
What did you measure? Concrete numbers if available.
- Metric 1: ___
- Metric 2: ___
If qualitative only, write: "Currently iterating. Early signal: ___"

**Tech stack:**
Python / PyTorch / etc. — list 3–6.

**Your role:**
Solo / team of N. What part did YOU do?

### Links
- GitHub: ________
- Live demo: ________
- Paper / writeup: ________

### DABM mapping
- [D] Data: ________
- [A] Agent: ________
- [B] Behavior: ________
- [M] Modeling: ________

### Why it matters (1 sentence)
The story / motivation behind this. Personal, honest.
```

---

## 13. Future Enhancements

These are **post-launch** improvements. Don't block v1 on these.

### v1.1 — within first month
- [ ] **Project case study modal** — dedicated route `/projects/[slug]` for SEO + share-ability of single projects
- [ ] **Sound effects toggle** — subtle terminal beeps in Experience Mode (optional, off by default)
- [ ] **Resume version history** — track which CV was downloaded when (analytics dimension)

### v2.0 — quarterly
- [ ] **Blog / `/notes`** — publish DABM essays, project retrospectives. Drives SEO.
- [ ] **Hugging Face integration** — when you upload your first model, surface it in Skills section
- [ ] **Google Scholar widget** — when first paper indexed, auto-pull citations
- [ ] **Public DABM sandbox** — interactive playground where visitors can map their own problem to DABM (huge differentiator)

### v3.0 — opportunistic
- [ ] **Vietnamese (VI) language toggle** — for VN-based recruiters; only when audience demand justifies
- [ ] **Theme variants** — keep midnight as default but offer 1–2 alt aesthetics for different days/moods
- [ ] **AI chat with portfolio** — embed a small RAG agent that answers questions about your projects (peak iconic, requires careful execution)

---

## Appendix A: Tone & Copy Guidelines

### Voice
- **Direct, not bombastic.** "I built X" beats "I had the privilege of architecting X."
- **Concrete over abstract.** Numbers, datasets, names of collaborators. Avoid generic phrases like "various ML techniques."
- **Plain Vietnamese-influenced English is fine.** You don't need to sound like a Stanford grad. Sound like yourself.
- **Self-aware, not self-effacing.** "Currently iterating on inference speed" > "I'm a noob still learning."

### Forbidden phrases
- ❌ "passionate about"
- ❌ "leveraging cutting-edge AI"
- ❌ "synergize", "ecosystem" (unless literally about an ecosystem)
- ❌ "10x developer", "rockstar", "ninja"
- ❌ Any unverified percentage ("improved accuracy by 27%" — only if it's real)

### Preferred phrases
- ✅ "I shipped"
- ✅ "Currently modeling"
- ✅ "Co-authored with [name]"
- ✅ "Trained on N samples; held-out F1: X"
- ✅ "Open question: how do we…"

---

## Appendix B: SEO & Discoverability

### Metadata strategy

```ts
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Line — Data Scientist & AI Engineer',
  description: 'I work at the intersection of ML, LLMs, and algorithmic reasoning. Co-founder at 100B Studio, dengue shock prediction researcher, GDGoC Vice Lead.',
  keywords: ['data science', 'machine learning', 'AI engineer', 'causal inference', 'DABM', 'LLM', 'Vietnam'],
  authors: [{ name: 'Trần Nam Anh', url: 'https://github.com/LineLuLan' }],
  openGraph: { /* ... */ },
  twitter: { card: 'summary_large_image' },
};
```

### Structured data (JSON-LD)

Add to `<head>` for rich snippets:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Trần Nam Anh',
      alternateName: 'Line',
      jobTitle: 'Data Scientist & AI Engineer',
      url: 'https://linelulan.dev',
      sameAs: [
        'https://github.com/LineLuLan',
        // LinkedIn, Kaggle once added
      ],
      alumniOf: 'International University, VNU-HCM',
    }),
  }}
/>
```

---

## Appendix C: Accessibility Checklist

- [ ] All interactive elements keyboard-accessible (tab order logical)
- [ ] Color contrast: text on `--bg-midnight` ≥ 4.5:1
- [ ] `prefers-reduced-motion` respected throughout
- [ ] Focus rings visible (use `--accent-pink` outline)
- [ ] Form labels associated with inputs
- [ ] Skip-to-content link at top
- [ ] Status dots have `aria-label` (e.g., "live project")
- [ ] Modal focus trap when project case study opens
- [ ] Alt text on avatar image

---

## Appendix D: Quick Reference Card

```
SITE              linelulan.dev
GITHUB            github.com/LineLuLan
EMAIL             [TBD]
DEPLOY            Vercel
FRAMEWORK         Next.js 14 App Router
STYLING           Tailwind CSS
ANIMATION         Framer Motion
EMAIL DELIVERY    Resend
ANALYTICS         Vercel Analytics

POSITIONING       Data Scientist & AI Engineer
FRAMEWORK         DABM (Data · Agent · Behavioral · Modeling)
PILLARS           ML Engineering | Applied AI · LLM | Research & Causal

UNIVERSITY        International University, VNU-HCM
MAJOR             BSc Data Science (3rd year)
GPA               3.69 / 4.0
GRADUATION        Sep 2028
ADVISOR           Dr. Nguyễn Thị Thúy Loan

KEY MOMENTS       2025 Aug — Vice Lead GDGoC
                  2025 Dec — IU AI 3rd Place
                  2026 Feb — Dengue research start
                  2026 Apr — Swift Conf speaker
                  2026 Apr — 100B Studio co-founded
```

---

**End of blueprint v1.0**

Build in this order, swap content as it becomes ready, ship to `linelulan.dev`. Every section is independently shippable — you can launch with placeholder slots and improve over time.

If you want any section deeper-specified (component-level pseudocode, SQL for a hypothetical analytics table, copy A/B variants, etc.), ping me with the section name.
