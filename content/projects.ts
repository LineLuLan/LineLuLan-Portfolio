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
