// Intent: keep Line's employment record separate from chronological milestones.
// Status: supplied copy. Next: Line's content edits. Blockers: none. Confidence: task packet.
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
        'Trained in-house Vietnamese encoders and an 8-intent classifier on the LUMI EuroHPC supercomputer and exported them to ONNX with exact fp32 parity.',
        'Compared classifier setups with paired statistical tests (task success 71.3% vs 75.2%, p = 0.011).',
      ],
      skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'PyTorch', 'Promptfoo', 'Docker', 'GitHub Actions', 'LLM evaluation'],
      highlights: [{
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
      ],
    }],
  },
  {
    id: 'clinical-research', org: 'Hospital for Tropical Diseases HCMC × International University', initials: 'HTD', logo: '/experience/logos/htd-hcmc.png',
    roles: [{
      title: 'Lead AI Researcher', type: 'Research', start: '2026-02', location: 'Ho Chi Minh City',
      bullets: [
        'Lead a clinical ML study predicting dengue shock from 3.71M+ laboratory records across ~40,900 patient encounters.',
        'Built a deterministic pipeline for extraction, unit harmonization and validation under strict privacy rules.',
        'Benchmark XGBoost and LightGBM against Deep Sets and Set Transformer with nested patient-grouped validation (0.952 AUROC, 0.798 AUPRC).',
        'First author; paper in preparation.',
      ],
      skills: ['Python', 'XGBoost', 'LightGBM', 'PyTorch', 'Clinical ML'],
    }],
  },
  {
    id: '100b', org: '100B Studio', url: 'https://100b.studio', logo: '/experience/logos/100b-studio.png',
    roles: [{ title: 'Co-founder', start: '2026-04', bullets: ['Co-founded 100B Studio.'] }],
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
        'Answered student questions and helped review assignments.',
      ],
    }],
  },
  {
    id: 'gdgoc', org: 'GDGoC HCMIU', logo: '/experience/logos/gdg.png',
    roles: [
      { title: 'Advisor', start: '2026-08', bullets: ['Advise the new core team on AI/ML programmes and event planning.'] },
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
        ],
      },
      { title: 'Member', start: '2024-09', end: '2025-08', bullets: ["Took part in the chapter's technical events and workshops."] },
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
      ],
    }],
  },
];
