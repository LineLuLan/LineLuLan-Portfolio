import type { Profile } from '@/types';

export const profile: Profile = {
  name: 'Trần Nam Anh',
  alias: 'Line',
  title: 'Data Scientist & AI Engineer',
  positioning:
    'Working at the intersection of ML, LLMs, and algorithmic reasoning — and I care that each thing I ship has its own shape.',
  framework: {
    short: 'DABM',
    long: 'Data · Agent · Behavioral · Modeling',
    tagline: 'A personal framework combining causal inference, simulation, and AI systems.',
  },
  pillars: ['ML Engineering', 'Applied AI · LLM', 'Research & Causal'],
  facts: [
    { key: 'location', value: 'Ho Chi Minh City, VN' },
    { key: 'status', value: '3rd year · BSc Data Science @ HCMIU' },
    { key: 'gpa', value: '3.69 / 4.0' },
    { key: 'research', value: 'dengue shock prediction (HTD × IU)' },
    { key: 'building', value: '100B Studio · co-founder' },
    { key: 'open to', value: 'DS / MLE / AI Engineer internships' },
  ],
  location: 'Ho Chi Minh City, VN',
  status: '3rd year · BSc Data Science @ HCMIU',
  gpa: '3.69 / 4.0',
  research: 'dengue shock prediction (HTD × IU)',
  building: '100B Studio · co-founder',
  openTo: 'DS / MLE / AI Engineer internships',
};
