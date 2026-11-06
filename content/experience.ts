// Intent: keep Line's employment record separate from chronological milestones.
// Status: supplied copy. Next: Line's content edits. Blockers: none. Confidence: task packet.
import type { ExperienceOrg } from '@/types';

export const experience: ExperienceOrg[] = [
  {
    id: 'twohearts', org: 'Twohearts Technologies', url: 'https://twohearts.vn', logo: '/experience/logos/twohearts.svg',
    summary: 'Twohearts lets restaurants, cafes, homestays, tours and small brands in Vietnam sell inside ChatGPT for 5–10% per order, instead of the quarter to a third that delivery platforms take. The platform spans five products: ChatOS, VoiceOS, ScanOS, OwnerOS and Customer Intelligence.',
    roles: [{
      title: 'Data Engineer', type: 'Full-time', start: '2026-07', location: 'Ho Chi Minh City',
      bullets: [
        'Build data validation and normalization pipelines for AI-powered ordering systems.',
        'Maintain the LLM evaluation harness that checks agent answers and tool calls before release.',
        'Write end-to-end tests with Gherkin scenarios and property-based tests.',
      ],
      skills: ['Python', 'PostgreSQL', 'LLM evaluation', 'Data validation', 'Gherkin'],
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
      title: '3rd Place · IU AI Competition 2025', date: '2025-12',
      body: 'Third prize at the university-wide IU AI Competition with a four-person team.',
      photos: [{ src: '/experience/iu-ai-3rd.jpg', width: 1600, height: 1200,
        alt: 'Line and teammates holding the IU AI Competition third prize board, trophy and medal',
        caption: 'IU AI Competition 2025, third prize' }],
    }],
    roles: [{
      title: 'Teaching Assistant', type: 'Part-time', start: '2026-02', end: '2026-02', location: 'Ho Chi Minh City',
      bullets: ['Teaching assistant for Principles of Database Management.'],
    }],
  },
  {
    id: 'gdgoc', org: 'GDGoC HCMIU', logo: '/experience/logos/gdg.png',
    roles: [
      { title: 'Advisor', start: '2026-08' },
      {
        title: 'Vice Lead', start: '2025-08', end: '2026-08',
        highlights: [{
          title: 'Vice Chapter Lead, Gen 5', date: '2025-08',
          photos: [{ src: '/experience/gdgoc-vice-lead.jpg', width: 1067, height: 1600,
            alt: 'Line in the GDGoC HCMIU Vice Chapter Lead announcement poster',
            caption: 'Gen 5 core team announcement' }],
        }],
        bullets: [
          'Co-directed AI/ML, cloud and data initiatives for 100+ active members.',
          'Hosted the TechTalk “AI Chatbots × Blockchain” (Nov 2025).',
        ],
      },
      { title: 'Member', start: '2024-09', end: '2025-08' },
    ],
  },
  {
    id: 'khai-tam', org: 'Luyện thi Khai Tâm', initials: 'KT',
    roles: [{
      title: 'Student Manager', type: 'Part-time', start: '2023-08', location: 'Ho Chi Minh City',
      bullets: ['Manage students and class operations at an exam-prep center for high schoolers.'],
    }],
  },
];
