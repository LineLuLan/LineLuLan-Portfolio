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
  stats: [
    { value: 2, suffix: '+', label: 'years in tech' },
    { value: 3.69, suffix: '/4.0', label: 'current GPA', decimals: 2 },
    { value: 1, suffix: '', label: 'paper in progress', pad: 2 },
    { value: 6, suffix: '+', label: 'projects shipped' },
  ],
  whatIBring: [
    {
      title: 'ML Engineering',
      description:
        'End-to-end pipelines — from raw data to deployed models. Comfortable across PyTorch, scikit-learn, and the messy middle.',
    },
    {
      title: 'Applied AI · LLM',
      description:
        'Multi-provider experience (OpenAI, Anthropic, Gemini). I build agent systems that actually do work, not just look smart in demos.',
    },
    {
      title: 'Research & Causal',
      description:
        'Causal inference and Bayesian thinking for problems where prediction is not enough. Currently applying this to dengue shock progression.',
    },
    {
      title: 'Production Builder',
      description:
        'I ship. From Next.js frontends to backend services on Vercel / Supabase / Neon. Code that runs, not slides that pitch.',
    },
  ],
  exploring: [
    'AI Agents',
    'Causal Inference',
    'Game Theory',
    'Simulation',
    'Dengue Modeling',
    'MLOps',
  ],
  narrative: {
    intro:
      "I'm a Vietnamese data scientist & AI engineer who doesn't fit neatly into one box. Coming from a Data Science program but living half my time in production code, half in research papers.",
    mission:
      "Right now I'm splitting effort between dengue shock prediction research with Hospital for Tropical Diseases, co-founding 100B Studio, and leading GDGoC HCMIU. The thread tying it together: build things that survive contact with reality.",
  },
};
