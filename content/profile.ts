import type { Profile } from '@/types';

export const profile: Profile = {
  name: 'Trần Nam Anh',
  alias: 'Line',
  title: 'AI / Machine Learning Engineer',
  positioning:
    'Working at the intersection of ML, LLMs, and algorithmic reasoning — and I care that each thing I ship has its own shape.',
  framework: {
    short: 'DABM',
    long: 'Data · Agent · Behavioral · Modeling',
    tagline: 'A personal framework combining causal inference, simulation, and AI systems.',
  },
  pillars: ['ML Research', 'Data Engineering', 'LLM Systems'],
  facts: [
    { key: 'location', value: 'Ho Chi Minh City, VN' },
    { key: 'status', value: '4th year · BSc Data Science @ IU VNU-HCM' },
    { key: 'gpa', value: '3.56 / 4.0' },
    { key: 'research', value: 'clinical ML with HTD HCMC · first author' },
    { key: 'building', value: 'Twohearts Technologies · Data Engineer' },
    { key: 'open to', value: 'AI / ML Engineer · Data Engineering roles' },
  ],
  location: 'Ho Chi Minh City, VN',
  status: '4th year · BSc Data Science @ IU VNU-HCM',
  gpa: '3.56 / 4.0',
  research: 'clinical ML with HTD HCMC · first author',
  building: 'Twohearts Technologies · Data Engineer',
  openTo: 'AI / ML Engineer · Data Engineering roles',
  stats: [
    { value: 4, suffix: '+', label: 'years in tech' },
    { value: 1, suffix: '+', label: 'year in industry' },
    { value: 3.56, suffix: '/4.0', label: 'current GPA', decimals: 2 },
    { value: 6, suffix: '+', label: 'projects shipped' },
  ],
  whatIBring: [
    {
      title: 'ML Engineering',
      description:
        'Benchmarking XGBoost, LightGBM, and permutation-invariant nets (Deep Sets, Set Transformer) under nested patient-grouped validation. Numbers I can defend, not just a leaderboard.',
    },
    {
      title: 'Data Engineering',
      description:
        'Deterministic pipelines that extract, harmonize, and validate 3.71M+ lab records under strict privacy constraints. Data quality first, models second.',
    },
    {
      title: 'LLM Systems',
      description:
        'Multi-provider routing (OpenAI, Gemini, Groq, Cerebras), eval harnesses, and tool-use validation for Vietnamese–English agent workflows that run in production.',
    },
    {
      title: 'Research',
      description:
        'Co-developed GoiBERT, compact Vietnamese encoders distilled on 328.6M tokens that beat PhoBERT-v2 at a quarter of the size. First author on clinical ML with HTD HCMC.',
    },
  ],
  exploring: [
    'Multi-agent Systems',
    'Knowledge Distillation',
    'Vietnamese NLP',
    'Clinical ML',
    'Causal Inference',
    'MLOps',
  ],
  narrative: {
    intro:
      'I\'m a Vietnamese AI/ML engineer whose work spans machine learning research, data engineering, and LLM-based application development. I build data pipelines, evaluation frameworks, and benchmarks for models on large-scale clinical datasets, with an emphasis on data quality and system reliability.',
    mission:
      'Right now I\'m a Data Engineer at Twohearts Technologies building validation and evaluation workflows for AI-powered ordering systems, first author on a clinical ML study with the Hospital for Tropical Diseases HCMC, and Vice Lead of GDGoC HCMIU. The thread tying it together: build things that survive contact with reality.',
  },
};
