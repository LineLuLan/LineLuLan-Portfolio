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
    hfModels: ['TwoheartsTechnologies/GoiBERT-M', 'TwoheartsTechnologies/GoiBERT-S'], // Intent: family stats. Status: enabled. Next: none. Blockers: none. Confidence: verified Hub IDs.
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
    slug: 'line-harness',
    showStars: true,
    planet: 'satellite',
    year: '2026',
    lead: true,
    name: 'Line Harness',
    tagline: 'My daily agent-coding harness: Claude Code plans and reviews, Codex CLI implements, hooks enforce the rules.',
    domains: ['LLM', 'other'],
    state: 'live',
    featured: true,
    problem:
      'Coding agents fail quietly. A worker dies mid-task and nobody notices for an hour, a sandbox rejects every command while the run still exits 0, or the model that wrote the code also grades it. I needed a setup where every delegated change is bounded, observable, and checked by something other than its author.',
    dataset:
      'My own working record: 328 delegated tasks logged in a review ledger from September to November 2026, 168 detached worker runs, and 77 shared skills mirrored on both agents.',
    method:
      'Claude Code is the supervisor: it writes a task packet (goal, success criteria, stop rules) and dispatches it to the Codex CLI through a PowerShell dispatcher that launches workers outside the agent process tree, preflights the Windows sandbox, supports resume, attach and cancel, and posts a toast when a run ends. Every change passes a three-layer review gate (deterministic gates, a fresh-session model review, then the supervisor re-running the change) under tiered model routing. Twelve hooks enforce the rules on every turn: delegation reminder, context-budget guard, a docs-check guard that forces current library docs through context7, and git-push and shell guards. A custom status line shows quotas, context, and live worker runs.',
    results:
      'Across 328 ledgered tasks the gate caught 504 defects: 38 by deterministic gates, 165 by model review, and 301 by supervisor verification, so a worker checking its own output is not enough. Worker cold start dropped from 48.7 s to 12.6 s, and silent sandbox failures now fail within seconds with a clear exit code. Open-sourced with a portable restore script.',
    tech: ['Claude Code', 'Codex CLI', 'PowerShell', 'Node.js', 'MCP', 'context7'],
    role: 'Solo builder · harness design, tooling, review policy',
    links: {
      github: 'https://github.com/LineLuLan/line-harness',
    },
    dabm: {
      D: '328 ledgered tasks · 168 worker runs · 77 shared skills',
      A: 'me, shipping research and product code every day with two agents',
      B: 'where agent work fails silently: dead workers, rejected sandboxes, self-grading',
      M: 'supervisor-worker split · three-layer review gate · rule-enforcing hooks',
    },
    why: 'Shows I can design the system around AI agents (routing, guardrails, observability, review) instead of only prompting them, and that I measure whether it works.',
  },
  // Intent: feature Line's CreditMiner story and screenshots. Status: listed third. Next: none. Blockers: none. Confidence: supplied project facts.
  {
    slug: 'creditminer',
    planet: 'jupiter',
    year: '2026',
    name: 'CreditMiner',
    tagline: 'Predicts credit-card default on 30,000 clients and explains why, from Weka models to a Next.js dashboard.',
    domains: ['ML', 'research'],
    state: 'live',
    featured: true,
    problem:
      'A card issuer wants to know, before the next statement, which clients are likely to default and which behaviours drive that risk. The UCI Default of Credit Card Clients dataset holds 30,000 clients with six months of statements, payments and repayment status; 22.1% defaulted the next month.',
    dataset:
      'UCI dataset 350 (Yeh and Lien, 2009): 29,965 clients after cleaning (35 duplicates removed), with IQR and z-score outlier flags and seven engineered features: utilization, payment ratio, months delayed, longest delay, bill trend and a risk tier.',
    method:
      'A stratified 80/20 split and ten Weka classifier variants (J48, random forest, naive Bayes, logistic regression; baseline, SMOTE and cost-sensitive) with 10-fold cross-validation and permutation importance. Then K-means personas (k = 4 from ten k-means++ restarts) with a PCA view, Apriori rule families and GSP repayment sequences. Every headline number is a traceable fact served by one API to the dashboard, the web report and a 28-page academic PDF.',
    results:
      'Random forest with cost-sensitive learning: holdout F1 0.533, ROC AUC 0.777, PR AUC 0.550. Clients two or more months late on the latest statement default at 69.5%, 3.1x the portfolio rate. Two delaying personas are 30.5% of clients but hold 61.5% of defaults. 183 backend tests, 209 web tests and a Playwright layout and contrast gate.',
    tech: ['Java 21', 'Spring Boot', 'Weka', 'Next.js', 'TypeScript', 'PostgreSQL', 'Playwright'],
    role: 'Team leader and main developer · data, models, API, dashboard, report',
    links: {
      github: 'https://github.com/LineLuLan/CreditMiner',
    },
    image: '/projects/creditminer/overview-dark.jpg',
    gallery: [
      { src: '/projects/creditminer/overview-dark.jpg', width: 1600, height: 1040, alt: 'CreditMiner overview dashboard in dark mode with the hero insight, KPI row, priority default signals and default rate by dimension', caption: 'Overview: hero insight, KPIs and priority signals' },
      { src: '/projects/creditminer/insights-light.jpg', width: 1440, height: 3583, alt: 'Ten ranked insights, each with its evidence chart against the portfolio baseline', caption: 'Ten ranked insights with evidence charts' },
      { src: '/projects/creditminer/personas-light.jpg', width: 1440, height: 2668, alt: 'Four customer personas with share bar, defaults gauge, comparison table and PCA scatter', caption: 'Four personas and how they separate' },
      { src: '/projects/creditminer/rules-light.jpg', width: 1440, height: 3048, alt: 'Association rule families ranked by lift with modifier tables', caption: 'Association rule families ranked by lift' },
      { src: '/projects/creditminer/customers-light.jpg', width: 1600, height: 1040, alt: 'Customer table with risk tier, payment-ratio direction, persona and outlier flags', caption: 'Customer table with risk tiers and flags' },
    ],
    dabm: {
      D: '29,965 clients · six months of statements and repayments',
      A: 'credit managers deciding who to call before the next statement',
      B: 'repayment delays and utilization that signal default',
      M: 'cost-sensitive random forest · K-means personas · Apriori and GSP patterns',
    },
    why: 'Shows the full path from raw data to a decision tool a credit manager could use, with every number traceable and tested.',
  },
  {
    slug: 'student-risk',
    planet: 'moon',
    year: '2026',
    name: 'Student Risk Early Warning',
    tagline: 'Flags at-risk students before final grades and explains why, in a one-screen D3 dashboard.',
    domains: ['ML', 'EdTech'],
    state: 'live',
    featured: true,
    problem:
      'Schools learn a student failed only when the final grade is issued. The question was whether earlier signals (midterm grades, past failures, absences, lifestyle) can flag at-risk students in time to act, and explain why.',
    dataset:
      'UCI Student Performance (Cortez and Silva, 2008): 1,044 students from two Portuguese schools in Mathematics and Portuguese, 33 attributes and three grade periods. A student is at risk when the final grade is below 10 of 20, a 22% minority class.',
    method:
      'Six research questions, one per dashboard card: Pearson correlation and Random Forest importance for key drivers, OLS scatter, K-means personas (k = 3), a 200-tree Random Forest with class weighting against logistic regression and decision-tree baselines, 5-fold cross-validation, subject-stratified models and a gender fairness audit. Recall leads the model card because a missed student is the real cost.',
    results:
      'Random Forest recall 82.6% on a 209-student hold-out (38 of 46 at-risk students caught), F1 80.9%, cross-validated recall 79.1% ± 8.1 pp. The final-grade distribution is bimodal: 53 students (5.1%) withdrew. A Social Risk persona carries 42.1% at-risk in Mathematics versus 21.3% in Portuguese. Six linked D3 charts fit one 1440 x 900 screen with no build step.',
    tech: ['Python', 'scikit-learn', 'pandas', 'D3.js', 'JavaScript', 'Vercel'],
    role: 'Solo · analysis pipeline and dashboard',
    links: {
      github: 'https://github.com/LineLuLan/student-performance-UCI',
      demo: 'https://student-uci-dashboard.vercel.app',
    },
    image: '/projects/student-risk/dashboard-dark.jpg',
    gallery: [
      { src: '/projects/student-risk/dashboard-dark.jpg', width: 1600, height: 764, alt: 'Student Risk Early Warning dashboard in dark mode: KPI bar, key drivers lollipop, G1 versus G3 scatter, K-means personas, Random Forest confusion matrix, grade trajectory and grade distribution', caption: 'Dark mode: six linked charts on one screen' },
      { src: '/projects/student-risk/dashboard-light.jpg', width: 1600, height: 761, alt: 'The same Student Risk Early Warning dashboard in light mode', caption: 'Light mode' },
    ],
    dabm: {
      D: '1,044 students · grades, attendance and lifestyle',
      A: 'teachers and advisers deciding who needs help before finals',
      B: 'midterm drops, past failures and absences that precede failing',
      M: 'class-weighted random forest · K-means personas · fairness audit',
    },
    why: 'Shows model choices driven by the use case: recall over accuracy, honest fairness numbers, and a dashboard a teacher can read in one glance.',
  },
  {
    slug: 'ai-legal-council',
    planet: 'comet',
    year: '2025',
    name: 'AI Legal Council',
    tagline: 'An offline courtroom simulator where an AI judge, opposing counsel and client train Vietnamese law students.',
    domains: ['LLM', 'EdTech'],
    state: 'live',
    featured: true,
    problem:
      'Law training in Vietnam is heavy on theory and short on practice. Existing tools either send sensitive case data to the cloud or stop at static multiple-choice questions, so students rarely rehearse the back-and-forth of a real hearing.',
    dataset:
      'Vietnamese precedents, decrees and circulars from official sources: about 100,000 legal documents cleaned from Word and PDF into instruction, input and output JSON, with 10,000 samples used for supervised fine-tuning.',
    method:
      'A desktop app (Electron) talks to a FastAPI gateway and a local LLM served by Ollama: Qwen2.5 3B Instruct fine-tuned on Vietnamese legal text, with retrieval from a vector database of statutes. An AI council of six agents plays judge, opposing counsel, client and more, while a hard-coded rule engine based on the 2015 Civil Procedure Code keeps them procedurally correct. Strict system prompts force JSON output and make the model ask back instead of inventing facts.',
    results:
      '3rd place at the IU AI Competition 2025 with team Newbie-Coding. The fine-tuned model runs fully offline on an ordinary laptop without a dedicated GPU and reached about 75% accuracy in manual testing; the simulated judge pushes back on weak arguments instead of only quoting the law.',
    tech: ['Python', 'Qwen2.5', 'Ollama', 'FastAPI', 'Electron', 'RAG'],
    role: 'AI engineer · LLM fine-tuning, RAG and the AI backend · team Newbie-Coding',
    links: {
      video: 'https://youtu.be/0yGZIgFPGX0',
    },
    gallery: [
      { src: '/experience/iu-ai-3rd.jpg', width: 1600, height: 1200, alt: 'Line and teammates of team Newbie-Coding holding the IU AI Competition third prize board, trophy and medal', caption: 'IU AI Competition 2025, third prize' },
    ],
    dabm: {
      D: '~100,000 Vietnamese legal documents · 10,000 fine-tuning samples',
      A: 'law students rehearsing hearings without a real courtroom',
      B: 'arguments the opposing side and the judge would challenge',
      M: 'fine-tuned local LLM · retrieval · rule engine · multi-agent council',
    },
    why: 'Shows a privacy-first LLM system built for low-resource settings, where the guardrails matter as much as the model.',
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
    role: 'Lead dev and backend · architecture, FSRS integration, server actions · 100B Studio',
    collaborators: [
      { name: 'Phí Vương Tường Tâm (tamir39)', role: 'UI/UX' },
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
    problem:
      'Simulate a market under panic: dozens of autonomous agents reacting to breaking events in real time, each with its own memory and temperament, without the simulation stalling, contradicting itself or burning through an inference budget.',
    dataset:
      'No fixed dataset: the world state is generated live. Each tick carries the market state, macroeconomic constraints and every agent\'s memory of what it has seen, and LLM-generated events feed back into that state.',
    method:
      'Core simulation logic for a multi-agent environment with 50+ concurrent agents, combining probabilistic decision-making, LLM-driven events and macroeconomic constraints. Inference is routed across Gemini, Groq and Cerebras so each call goes to the fastest affordable provider; agents run asynchronously and every LLM output is validated with Pydantic before it can change the world state, so one malformed answer never corrupts the run.',
    results:
      'Shipped in March 2026 with the 100B Studio team; the recorded demo shows 50+ agents reacting to events live. The validation layer turned free-form model output into typed state changes, which kept a long-running simulation stable.',
    tech: ['Python 3.11', 'PyTorch', 'Pydantic', 'AsyncIO', 'Gemini', 'Groq', 'Cerebras'],
    role: 'AI Architect · simulation logic and LLM routing · 100B Studio',
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
