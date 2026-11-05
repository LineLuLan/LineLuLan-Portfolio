// Intent: present Line's supplied R2 narrative and evidence without changing project records.
// Status: R2. Next: supervisor copy review. Blockers: none. Confidence: supplied task packet.
import type { Profile } from '@/types';

export const profile: Profile = {
  name: 'Trần Nam Anh',
  alias: 'Line',
  title: 'AI / Machine Learning Engineer',
  positioning:
    'Researcher by training, engineer by habit. I turn ideas from papers into ML and LLM systems that hold up in production.',
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
    { key: 'research', value: 'Clinical ML with HTD HCMC · first author' },
    { key: 'building', value: 'Twohearts Technologies · Data Engineer' },
    { key: 'open to', value: 'AI / ML Engineer · Data Engineering roles' },
  ],
  location: 'Ho Chi Minh City, VN',
  status: '4th year · BSc Data Science @ IU VNU-HCM',
  gpa: '3.56 / 4.0',
  research: 'Clinical ML with HTD HCMC · first author',
  building: 'Twohearts Technologies · Data Engineer',
  openTo: 'AI / ML Engineer · Data Engineering roles',
  availability: 'Open to AI / ML & Data roles · HCMC',
  stats: [
    { value: 4, suffix: '+', label: 'Years in tech' },
    { value: 1, suffix: '+', label: 'Year in industry' },
    { value: 3.56, suffix: '/4.0', label: 'Current GPA', decimals: 2 },
    { value: 6, suffix: '+', label: 'Projects shipped' },
  ],
  whatIBring: [
    {
      title: 'ML modeling & evaluation',
      description: 'Gradient boosting and set-based neural nets, checked with nested, patient-grouped cross-validation.',
      proof: 'Clinical ML · first author',
    },
    {
      title: 'Data engineering',
      description: 'Reproducible pipelines that extract, harmonize and validate clinical lab data under strict privacy rules.',
      proof: '3.71M+ lab records',
    },
    {
      title: 'LLM & agent systems',
      description: 'Multi-provider routing, tool-use validation and eval harnesses for ordering agents in production.',
      proof: 'Live at Twohearts',
    },
    {
      title: 'Applied NLP research',
      description: 'Co-first author of GoiBERT: compact Vietnamese encoders that beat PhoBERT-v2 at a quarter of the size.',
      proof: 'GoiBERT · arXiv',
    },
  ],
  exploring: [
    'Multi-agent systems',
    'Knowledge distillation',
    'Vietnamese NLP',
    'Clinical ML',
    'Causal inference',
    'MLOps',
  ],
  narrative: {
    intro: "I'm Line (Trần Nam Anh), an AI / ML engineer based in Ho Chi Minh City. I work across the whole life of a model: cleaning and validating the data, building and benchmarking the model, then shipping it inside a system people actually use.",
    mission: "Right now I'm a Data Engineer at Twohearts Technologies, building validation and evaluation workflows for AI ordering agents. I'm also first author on a clinical ML study with the Hospital for Tropical Diseases HCMC, and Vice Lead of GDGoC HCMIU.",
  },
};
