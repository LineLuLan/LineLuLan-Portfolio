// Intent: keep Line's employment record separate from chronological milestones.
// Status: supplied copy. Next: Line's content edits. Blockers: none. Confidence: task packet.
import type { ExperienceOrg } from '@/types';

export const experience: ExperienceOrg[] = [
  {
    id: 'twohearts', org: 'Twohearts Technologies', url: 'https://twohearts.vn',
    roles: [{
      title: 'Data Engineer', type: 'Full-time', start: '2026-07', location: 'Ho Chi Minh City',
      bullets: [
        'Build data validation and normalization pipelines for AI-powered ordering systems.',
        'Maintain the LLM evaluation harness that checks agent answers and tool calls before release.',
        'Write end-to-end tests with Gherkin scenarios and property-based tests.',
      ],
      skills: ['Python', 'PostgreSQL', 'LLM evaluation', 'Data validation', 'Gherkin'],
    }],
  },
  {
    id: 'clinical-research', org: 'Hospital for Tropical Diseases HCMC × International University', initials: 'HTD',
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
    id: '100b', org: '100B Studio', url: 'https://100b.studio',
    roles: [{ title: 'Co-founder', start: '2026-04', bullets: ['Co-founded 100B Studio.'] }],
  },
  {
    id: 'iu', org: 'International University, VNU-HCM',
    roles: [{
      title: 'Teaching Assistant', type: 'Part-time', start: '2026-02', end: '2026-02', location: 'Ho Chi Minh City',
      bullets: ['Teaching assistant for Principles of Database Management.'],
    }],
  },
  {
    id: 'gdgoc', org: 'GDGoC HCMIU',
    roles: [
      { title: 'Advisor', start: '2026-08' },
      {
        title: 'Vice Lead', start: '2025-08', end: '2026-08',
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
