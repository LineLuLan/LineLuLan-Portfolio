import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'dengue-shock-prediction',
    name: 'Dengue Shock Prediction',
    tagline:
      'Predicting post-fever shock progression in dengue patients using time-series clinical data.',
    domains: ['research', 'ML'],
    state: 'wip',
    featured: true,
    problem:
      'Predicting post-fever shock progression in dengue patients using time-series clinical data — in collaboration with Hospital for Tropical Diseases HCMC.',
    dataset: 'IRB-approved hospital records · time-windowed measurements (received).',
    method:
      'Feature engineering on vitals + lab time series; baselines: gradient boosting + survival analysis; aiming for early-warning classifier.',
    results: 'Currently iterating. Early signal: feature engineering + model design phase.',
    tech: ['Python', 'PyTorch', 'Pandas', 'Scikit-learn', 'PyMC'],
    role: 'Co-researcher · feature engineering & modeling',
    collaborators: [
      { name: 'Hospital for Tropical Diseases HCMC', role: '2 senior physicians' },
      { name: 'IU Data Science Dept.', role: '2 senior researchers' },
      { name: 'Dr. Nguyễn Thị Thúy Loan', role: 'advisor · Head of DS Dept., IU' },
    ],
    dabm: {
      D: 'hospital records · time-windowed · IRB-approved',
      A: 'physicians making triage decisions',
      B: 'symptom progression curves over hours',
      M: 'survival models · early-warning classifier',
    },
    eta: 'Q3 2026',
    why: 'Early warning systems for dengue can save lives in tropical regions where the disease is endemic.',
  },
  {
    slug: 'enstudy-hub',
    name: 'EnStudy-Hub',
    tagline: 'FSRS-powered vocabulary trainer for Vietnamese English learners.',
    domains: ['EdTech'],
    state: 'live',
    featured: true,
    problem:
      'Vietnamese English learners lack a localized spaced-repetition tool that handles their own wordlists end-to-end. Existing apps (Anki, Quizlet) are either too friction-heavy or run on outdated SRS algorithms with no first-class Vietnamese UX.',
    dataset:
      'User-imported CSV wordlists + curated Oxford 3000-derived seed (10 topics × 42 lessons for MVP); per-user user_cards rows store live FSRS memory state (stability, difficulty, due date) keyed by card + owner.',
    method:
      'FSRS-4.5 via ts-fsrs for next-review scheduling, replacing the legacy SM-2 family with a parameterized memory model; server-first Next.js 15 App Router on Supabase Postgres with Drizzle ORM, multi-tenant via a topics → collections → lessons → cards ownership chain; review session orchestrated through 4 minigame modes (cloze, MCQ, typing-from-definition, Web Speech listening) with Zustand for transient state.',
    results:
      'Live on Vercel · v0.2.0 shipped 2026-05-13 (dashboard, stats, 4 minigame modes, settings, theme); v1.0.0 in flight with CSV import, per-card actions, inline editing · 108 green vitest unit tests covering schema/queue/FSRS logic.',
    tech: ['Next.js 15', 'TypeScript', 'Supabase', 'Drizzle ORM', 'ts-fsrs', 'Zod', 'Tailwind v4', 'Vitest'],
    role: 'Lead dev · architecture, FSRS integration, server actions, UI',
    collaborators: [
      { name: 'Phí Vương Tường Tâm', role: 'contributor' },
      { name: 'Trần Nam Anh', role: 'contributor' },
      { name: 'Lê Thành Danh', role: 'contributor' },
    ],
    links: {
      github: 'https://github.com/LineLuLan/EnStudy-Hub',
      demo: 'https://en-study-hub.vercel.app',
    },
    dabm: {
      D: 'user CSV wordlists + Oxford 3000 seed · per-user FSRS state',
      A: 'Vietnamese English learners reviewing vocab daily',
      B: 'retention curves · review timing across cards',
      M: 'FSRS-4.5 scheduler · 4 minigame review modes',
    },
    why: 'Brings a modern ML-derived SRS algorithm (FSRS-4.5) into a Vietnamese-language vocabulary workflow so learners can import their own lists and review at the statistically optimal interval — closing the localization and algorithmic gap left by mainstream flashcard apps.',
  },
  {
    slug: 'ezidatic',
    name: 'Ezidatic',
    tagline: 'AI data analyst platform — instant EDA, AutoML, and an agent that talks to your data.',
    domains: ['LLM', 'ML'],
    state: 'wip',
    problem:
      'Students and junior analysts spend hours wiring up ingestion, EDA, preprocessing, and baseline ML before they can ask a real question of their data. Ezidatic collapses that loop into upload → profile → train → chat.',
    dataset:
      'User-uploaded tabular files (CSV/TSV today; Excel, JSON, Parquet via pluggable parsers), capped at 50 MB per upload — no fixed corpus.',
    method:
      'Plug-in registries (Adapter Pattern + Pipeline Architecture) over a FastAPI backend: parsers, preprocessing steps, and AutoML estimators (LightGBM, Random Forest, Logistic Regression) are all hot-swappable. A Router-Worker LLM topology dispatches each question to a specialist agent over a multi-provider stack (Groq → Gemini → OpenRouter → Ollama) with automatic fallback; ChromaDB grounds chat with dataset context and Redis caches LLM responses.',
    results:
      'Sprint 4 in progress — ingestion, EDA, AutoML, and agentic chat working end-to-end on dev; Supabase storage backend, Redis LLM cache, dark-mode UI, and a11y baseline have landed; free-tier deploy + UptimeRobot monitoring runbook in the polish phase.',
    tech: ['Python', 'FastAPI', 'Polars', 'scikit-learn', 'LangChain', 'Next.js', 'PostgreSQL', 'ChromaDB'],
    role: 'Solo builder · architecture, backend, ML pipeline, and frontend',
    links: {
      github: 'https://github.com/LineLuLan/Ezidatic',
    },
    dabm: {
      D: 'user-uploaded tabular datasets + their column profiles',
      A: 'Router-Worker LLM dispatching to EDA / SQL / ML specialist workers',
      B: 'exploratory analysis + supervised classification/regression on arbitrary tabular data',
      M: 'AutoML leaderboard over classical estimators with LLM-driven narration',
    },
    eta: 'Q3 2026',
    why: 'Shows end-to-end Data + AI delivery — from ingestion and AutoML pipelines to a multi-provider LLM agent system, all behind a production-grade extensible architecture that one engineer can ship and maintain.',
  },
  {
    slug: 'slot-02',
    name: 'LegalLLM',
    codename: 'LGL-██',
    tagline: '[CLASSIFIED]',
    domains: ['LLM', 'EdTech'],
    state: 'classified',
    eta: 'TBD',
  },
  {
    slug: 'slot-03',
    name: 'Panic Hub',
    codename: 'PNC-██',
    tagline: '[CLASSIFIED]',
    domains: ['research'],
    state: 'classified',
    eta: 'TBD',
  },
  {
    slug: 'slot-04',
    name: 'Worldforesight',
    codename: 'WLD-██',
    tagline: '[CLASSIFIED]',
    domains: ['ML'],
    state: 'classified',
    eta: 'TBD',
  },
  {
    slug: 'slot-05',
    name: 'Educata',
    codename: 'EDU-██',
    tagline: '[CLASSIFIED]',
    domains: ['EdTech'],
    state: 'classified',
    eta: 'TBD',
  },
  {
    slug: 'slot-06',
    name: '100B Studio',
    codename: 'STU-██',
    tagline: '[CLASSIFIED]',
    domains: ['creative'],
    state: 'classified',
    eta: 'TBD',
  },
];

export const projectFilters = ['all', 'research', 'LLM', 'ML', 'EdTech', 'creative'] as const;
export type ProjectFilter = (typeof projectFilters)[number];
