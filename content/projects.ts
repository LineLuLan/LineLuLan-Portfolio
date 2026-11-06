import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'goibert-m',
    planet: 'saturn',
    year: '2026',
    lead: true,
    name: 'GoiBERT-M',
    tagline: 'Compact Vietnamese language encoders trained by two-stage knowledge distillation.',
    domains: ['research', 'LLM'],
    state: 'live',
    featured: true,
    problem: 'Vietnamese NLP needs encoders small enough to serve cheaply without giving up benchmark quality.',
    dataset: '328.6M Vietnamese tokens for distillation; eight Vietnamese NLP benchmarks for evaluation.',
    method: 'Two-stage knowledge distillation into 26.4M-parameter (base) and 49.4M-parameter (large) encoders.',
    results: 'Average 81.13 across eight benchmarks with GoiBERT-large, above BamiBERT (80.65) and PhoBERT-v2 (80.71). 2× GPU throughput at roughly half the parameters and peak memory of BamiBERT; GoiBERT-base keeps 99% of BamiBERT’s score at a quarter of the parameters.',
    tech: ['Python', 'PyTorch', 'HuggingFace', 'Knowledge Distillation'],
    role: 'Co-first author · distillation and evaluation',
    links: {
      paper: 'https://arxiv.org/abs/2610.30067',
      model: 'https://huggingface.co/TwoheartsTechnologies/GoiBERT-M',
    },
    dabm: {
      D: '328.6M Vietnamese tokens · 8 benchmarks',
      A: 'downstream Vietnamese NLP tasks',
      B: 'teacher-to-student signal transfer',
      M: 'two-stage distillation · compact encoders',
    },
    why: 'Careful distillation beats scale for a low-resource language, and research results can ship as usable models.',
  },
  {
    slug: 'enstudy-hub',
    planet: 'earth',
    year: '2026',
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
    planet: 'neptune',
    year: '2026',
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
    slug: 'panic-hub',
    planet: 'jupiter',
    year: '2026',
    name: 'Panic Hub',
    links: { video: 'https://youtu.be/Vw9_MV7uf-c' },
    tagline: 'Real-time agentic AI simulation game with 50+ concurrent LLM-driven agents.',
    domains: ['LLM', 'ML'],
    state: 'live',
    problem: 'Simulate a market under panic: dozens of autonomous agents reacting to LLM-driven events in real time without the simulation falling over.',
    method: 'Core simulation logic for a multi-agent environment with 50+ concurrent agents, combining probabilistic decision-making, LLM-driven events, and macroeconomic constraints. Multi-provider LLM routing across Gemini, Groq, and Cerebras for low-latency, cost-efficient inference; asynchronous execution with Pydantic-validated outputs.',
    results: 'Shipped March 2026.',
    tech: ['Python 3.11', 'PyTorch', 'Pydantic', 'AsyncIO', 'Gemini', 'Groq', 'Cerebras'],
    role: 'AI Architect · simulation logic and LLM routing',
    dabm: {
      D: 'simulated market state · agent memories',
      A: '50+ concurrent autonomous agents',
      B: 'panic propagation under macro constraints',
      M: 'probabilistic decisions · LLM event generation',
    },
    why: 'Proves I can keep a large multi-agent LLM system structured, fast, and cheap under real-time load.',
  },
  {
    slug: 'dengue-shock-prediction',
    planet: 'mars',
    year: '2026',
    listed: false,
    name: 'Dengue Shock Prediction',
    tagline:
      'Leakage-audited clinical prediction from routine dengue lab data, with HTD HCMC.',
    domains: ['research', 'ML'],
    state: 'wip',
    featured: true,
    problem:
      'Predicting post-fever shock progression in dengue patients from routine laboratory data — in collaboration with Hospital for Tropical Diseases HCMC.',
    dataset: 'Tens of thousands of de-identified encounters from 2018–2024; 240 lab codes mapped with 97% row coverage. Deterministic extraction, unit harmonization, and validation under strict privacy constraints.',
    method:
      'Calibrated LightGBM with nested patient-grouped validation and a five-member MLP deep ensemble evaluated under four win gates; leakage audits and 250+ automated tests support the pipeline.',
    results: 'Calibrated LightGBM nested AUPRC 0.65 (95% CI 0.64–0.66; prevalence ≈ 0.1), Brier 0.061, ECE 0.016. Five-member MLP deep ensemble +0.034 AUPRC over the tree champion (0.683 vs 0.649) under four win gates. Two manuscripts in preparation.',
    tech: ['Python', 'XGBoost', 'LightGBM', 'PyTorch', 'Pandas', 'Scikit-learn'],
    role: 'First author · lead AI researcher',
    collaborators: [
      { name: 'Hospital for Tropical Diseases HCMC', role: '2 senior physicians' },
      { name: 'IU Data Science Dept.', role: '2 senior researchers' },
      { name: 'Dr. Nguyễn Thị Thúy Loan', role: 'advisor · Head of DS Dept., IU' },
    ],
    dabm: {
      D: 'tens of thousands of de-identified encounters · 2018–2024 · 240 lab codes · 97% row coverage',
      A: 'physicians making triage decisions',
      B: 'lab ordering patterns · informative missingness',
      M: 'calibrated LightGBM · five-member MLP deep ensemble · nested CV',
    },
    eta: '2027',
    why: 'Early warning systems for dengue can save lives in tropical regions where the disease is endemic.',
  },
];
