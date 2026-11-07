// Intent: keep Line's employment record separate from chronological milestones.
// Status: expanded copy 2026-11-07. Next: Line confirms drafted bullets (100B, TA, GDGoC, Khai Tâm).
// Confidence: Twohearts from Line's notes (reviewed numbers only); clinical research from the research summary (aggregates only).
import type { ExperienceOrg } from '@/types';

export const experience: ExperienceOrg[] = [
  {
    id: 'twohearts', org: 'Twohearts Technologies', url: 'https://twohearts.vn', logo: '/experience/logos/twohearts.svg',
    summary: 'Twohearts lets restaurants, cafes, homestays, tours and small brands in Vietnam sell inside ChatGPT for 5–10% per order, instead of the quarter to a third that delivery platforms take. The platform spans five products: ChatOS, VoiceOS, ScanOS, OwnerOS and Customer Intelligence.',
    highlights: [{
      title: 'By the numbers',
      body: '541 backend commits · 249 of 258 harness commits · 6 production prompts approved · 250-case release benchmark.',
    }],
    roles: [{
      title: 'Data Engineer', type: 'Full-time', start: '2026-07', location: 'Ho Chi Minh City',
      bullets: [
        'Built the AI evaluation system for a multi-tenant Vietnamese chat-ordering agent: scenario runtime, sandbox orchestration, a deterministic grader and a certified no-PII benchmark grown from 204 to 250 cases, wired in as the CI release gate.',
        'Owned the optimization campaign for six production prompts; the prompt set was approved for production in August 2026.',
        'Raised multi-turn ordering Outcome + Safety from 17% to 78.75%, and shipped an order-consent guard that cut critical failures from 7 to 0 on the real-backend benchmark.',
        'Built a governed Customer Intelligence platform (identity graph, resolution, compliance, omnichannel capture, profile memory) across eight gated phases with tenant-scoped row-level security.',
        'Created and own the black-box end-to-end testing harness: compose stack, mock providers, five test tiers, mutation testing and SHA-pinned CI gates.',
        'Co-first author of GoiBERT, the in-house family of compact Vietnamese encoders: trained on the LUMI EuroHPC supercomputer, published on Hugging Face and exported to ONNX with exact fp32 parity.',
        'Compared classifier setups with paired statistical tests (task success 71.3% vs 75.2%, p = 0.011).',
      ],
      skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'PyTorch', 'Promptfoo', 'Docker', 'GitHub Actions', 'LLM evaluation'],
      highlights: [{
        title: 'GoiBERT · compact Vietnamese encoders', date: '2026-10',
        body: 'Two-stage knowledge distillation into 26.4M- and 49.4M-parameter encoders. GoiBERT-large averages 81.13 across eight Vietnamese benchmarks, above PhoBERT-v2 (80.71) at about half the parameters, and GoiBERT-base keeps 99% of the score at a quarter of the size. Preprint on arXiv, models public on Hugging Face.',
        link: { href: '/projects/goibert-m', label: 'Read the project story' },
      }, {
        title: 'KFC F&B Track Winner · Agentic AI Build Week', date: '2026-07',
        body: 'KFC Vietnam asked whether a customer could order just by talking, in Vietnamese. In one week the Twohearts team built a live voice agent that takes and confirms the order, streams every turn to a real-time dashboard, and keeps guardrails on what it may promise. Organised by GenAI Fund.',
        photos: [
          { src: '/experience/kfc-winner-team.jpg', width: 1600, height: 1075,
            alt: 'The Twohearts team on stage holding the KFC F&B Track Winner board at Agentic AI Build Week',
            caption: 'The Twohearts team, KFC F&B Track winners' },
          { src: '/experience/kfc-winner-line.jpg', width: 1020, height: 1020,
            alt: 'Line holding the KFC F&B Track Winner board at Galaxy Innovation Hub',
            caption: 'Galaxy Innovation Hub, HCMC' },
        ],
      }],
    }, {
      // Line joined in June 2026; the Data Engineer role became official in July (Line, 2026-11-07).
      title: 'Joined the team', start: '2026-06', end: '2026-07', location: 'Ho Chi Minh City',
      bullets: [
        'Moved the point-of-sale integration from iPOS to CukCuk: compatible auth, multi-tenant menu sync, idempotent import planning and a readback verifier.',
        'Built the first Customer Intelligence phases: identity graph, identity resolution and governed customer facts.',
        'Shipped storefront fixes: data-driven menu merchandising, checkout delivery-time and pickup-pricing corrections, menu contract guards.',
      ],
    }],
  },
  {
    id: 'clinical-research', org: 'Hospital for Tropical Diseases HCMC × International University', initials: 'HTD', logo: '/experience/logos/htd-hcmc.png',
    summary: 'A retrospective study on de-identified electronic health records from a tertiary infectious-disease referral hospital, run with an academic supervisor and the hospital data team. Every figure here is an aggregate; patient-level data never leaves the local machine.',
    roles: [{
      title: 'Lead AI Researcher', type: 'Research', start: '2026-02', location: 'Ho Chi Minh City',
      bullets: [
        'Lead a clinical ML programme on dengue shock prediction from routine laboratory tests across tens of thousands of de-identified encounters (2018–2024), from raw hospital exports to two manuscripts in preparation.',
        'Built the data pipeline from raw Excel exports to typed Parquet: 240 lab test codes mapped to a standard vocabulary (97% row coverage) and an ICD-aware label policy that survives a 2020 coding change.',
        'Designed leakage control as a system: a feature audit with severity tiers, machine-checked fold contracts and a value-shuffle test that exposed care-process signal hiding in the data.',
        'Paper 1: a calibrated LightGBM reached nested AUPRC 0.65 (95% CI 0.64–0.66, prevalence ≈ 0.1) with Brier 0.061 and ECE 0.016, reporting the overfitting gap and weak years instead of hiding them.',
        'Paper 2: a five-member MLP deep ensemble beat the tree champion by +0.034 AUPRC under four pre-registered win gates and won every year in forward-chaining temporal validation; transformers and TabNet did not.',
        'Turned the model into clinical operating points: three-tier triage, selective prediction with abstention and split-conformal prediction sets.',
        'A timing analysis of the timestamped re-export showed most shock patients arrive already in shock, reframing the follow-up study from in-hospital early warning to triage at admission.',
        "Two research repositories with 250+ automated tests and a one-command replay of the whole pipeline; the verification guide is reused in a colleague's thesis.",
      ],
      skills: ['Python', 'pandas', 'scikit-learn', 'LightGBM', 'XGBoost', 'PyTorch', 'Parquet', 'pytest', 'Clinical ML'],
    }],
  },
  {
    id: '100b', org: '100B Studio', url: 'https://100b.studio', logo: '/experience/logos/100b-studio.png',
    summary: '100B Studio is a small product studio. Alongside its own products, the team takes on outsourced builds for clients.',
    roles: [{
      title: 'Co-founder · Data & AI Engineer', start: '2026-04', location: 'Ho Chi Minh City',
      bullets: [
        'Co-founded the studio and help decide which client projects it takes on, from first call to delivery.',
        "Work as the studio's data, AI and data-science engineer on outsourced projects: data pipelines, model prototypes and the analytics behind them.",
        'Turn loose client briefs into scoped milestones, estimates and early demos the client can react to.',
        'Set up the shared engineering habits: code review, automated tests and lightweight delivery checklists.',
      ],
      skills: ['Python', 'Data pipelines', 'LLM integration', 'Next.js', 'PostgreSQL'],
    }],
  },
  {
    id: 'iu', org: 'International University, VNU-HCM', logo: '/experience/logos/iu-vnuhcm.png',
    highlights: [{
      title: 'Academic record',
      body: 'BSc Data Science, 2023 – expected 2028. Course-by-course grades, semester GPA and the cumulative trend.',
      link: { href: '/transcript', label: 'View full transcript' },
    }, {
      title: '3rd Place · IU AI Competition 2025', date: '2025-12',
      body: 'Third prize at the university-wide IU AI Competition with a four-person team.',
      photos: [{ src: '/experience/iu-ai-3rd.jpg', width: 1600, height: 1200,
        alt: 'Line and teammates holding the IU AI Competition third prize board, trophy and medal',
        caption: 'IU AI Competition 2025, third prize' }],
    }],
    roles: [{
      title: 'Teaching Assistant', type: 'Part-time', start: '2026-02', end: '2026-02', location: 'Ho Chi Minh City',
      bullets: [
        'Teaching assistant for Principles of Database Management.',
        'Supported weekly lab sessions on SQL, relational design and normalization.',
        'Prepared practice exercises on joins, indexing and transactions.',
        'Answered student questions and helped review assignments.',
      ],
      skills: ['SQL', 'Relational design', 'Teaching'],
    }],
  },
  {
    id: 'gdgoc', org: 'GDGoC HCMIU', url: 'https://www.facebook.com/gdgoc.hcmiu', logo: '/experience/logos/gdg.png',
    roles: [
      {
        title: 'Advisor', start: '2026-08',
        bullets: [
          'Advise the new core team on AI/ML programmes and event planning.',
          'Mentor the next organisers on running technical events, from speaker outreach to logistics.',
          'Review AI/ML workshop content before it reaches members.',
        ],
      },
      {
        title: 'Vice Lead', start: '2025-08', end: '2026-08',
        highlights: [{
          title: 'Vice Chapter Lead, Gen 5', date: '2025-08',
          photos: [{ src: '/experience/gdgoc-vice-lead.jpg', width: 1067, height: 1600,
            alt: 'Line in the GDGoC HCMIU Vice Chapter Lead announcement poster',
            caption: 'Gen 5 core team announcement' }],
        }, {
          title: 'TechTalk · AI Chatbots × Blockchain', date: '2025-11',
          body: 'Organised the TechTalk as part of DevFest Ho Chi Minh City on Campus at International University.',
          photos: [{ src: '/experience/gdgoc-techtalk.jpg', width: 1600, height: 1200,
            alt: 'Organisers and attendees holding their badges on stage at DevFest on Campus, International University',
            caption: 'DevFest on Campus at IU, organisers and attendees' }],
        }],
        bullets: [
          'Co-directed AI/ML, cloud and data initiatives for 100+ active members.',
          'Organised the TechTalk “AI Chatbots × Blockchain” at DevFest on Campus (Nov 2025).',
          'Planned the event calendar with the Chapter Lead and coordinated the core team across tracks.',
          'Brought in speakers and partners for workshops and TechTalks.',
        ],
        skills: ['Community building', 'Event planning', 'Public speaking'],
      },
      {
        title: 'Member', start: '2024-09', end: '2025-08',
        bullets: ["Joined the chapter's AI/ML track, attending workshops and helping at technical events."],
      },
    ],
  },
  {
    id: 'khai-tam', org: 'Luyện thi Khai Tâm', initials: 'KT', url: 'https://luyenthikhaitam.com', logo: '/experience/logos/khai-tam.webp',
    roles: [{
      title: 'Student Manager', type: 'Part-time', start: '2023-08', location: 'Ho Chi Minh City',
      bullets: [
        'Manage students and class operations at an exam-prep center for high schoolers.',
        'Track attendance and learning progress for each class.',
        'Coordinate schedules between students, parents and teachers.',
        'Handle enrolment questions and onboarding for new students and their families.',
        "Prepare class reports for teachers and the center's management.",
      ],
      skills: ['Operations', 'Communication', 'Reporting'],
      highlights: [{
        title: 'Running the day at the center',
        body: 'Briefing students before class against the weekly timetable of math, science and language sessions.',
        photos: [{ src: '/experience/khai-tam-class.jpg', width: 930, height: 620,
          alt: 'Line briefing a group of students next to the weekly class timetable at Luyện thi Khai Tâm',
          caption: 'Luyện thi Khai Tâm, before class' }],
      }],
    }],
  },
];
