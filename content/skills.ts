// Intent: list only Line's real tools, grouped by use, with practices separate from products.
// Status: R2. Next: content review. Blockers: none. Confidence: supervisor-supplied inventory.
import type { SkillTier } from '@/types';

export const skills: SkillTier[] = [
  {
    id: 'languages', label: 'Languages', caption: 'What I write every day',
    items: [
      { name: 'Python', icon: 'python' }, { name: 'SQL' },
      { name: 'TypeScript', icon: 'typescript' }, { name: 'JavaScript', icon: 'javascript' },
      { name: 'R', icon: 'r' }, { name: 'Java', icon: 'openjdk' },
    ],
  },
  {
    id: 'ml', label: 'ML & modeling', caption: 'Training, tuning, benchmarking',
    items: [
      { name: 'PyTorch', icon: 'pytorch' }, { name: 'scikit-learn', icon: 'scikitlearn' },
      { name: 'XGBoost' }, { name: 'LightGBM' }, { name: 'Hugging Face', icon: 'huggingface' },
      { name: 'OpenCV', icon: 'opencv' }, { name: 'PyMC' },
    ],
  },
  {
    id: 'agents', label: 'LLM & agents', caption: 'Multi-provider in production',
    items: [
      { name: 'OpenAI' }, { name: 'Anthropic', icon: 'anthropic' },
      { name: 'Google Gemini', icon: 'googlegemini' }, { name: 'Groq' },
      { name: 'Cerebras' }, { name: 'OpenRouter', icon: 'openrouter' },
    ],
    practices: ['Multi-agent orchestration', 'Eval harnesses', 'Tool-use validation'],
  },
  {
    id: 'data', label: 'Data engineering', caption: 'Pipelines and storage',
    items: [
      { name: 'pandas', icon: 'pandas' }, { name: 'Polars', icon: 'polars' },
      { name: 'NumPy', icon: 'numpy' }, { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' }, { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Redis', icon: 'redis' },
    ],
    practices: ['Vector databases', 'Async pipelines'],
  },
  {
    id: 'backend', label: 'Backend & MLOps', caption: 'Shipping and keeping it running',
    items: [
      { name: 'Docker', icon: 'docker' }, { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' }, { name: 'Prisma', icon: 'prisma' },
      { name: 'Drizzle', icon: 'drizzle' },
    ],
    practices: ['REST APIs', 'CI/CD', 'Automated testing'],
  },
  {
    id: 'cloud', label: 'Cloud & web', caption: 'Where it gets deployed',
    items: [
      { name: 'Vercel', icon: 'vercel' }, { name: 'Supabase', icon: 'supabase' },
      { name: 'Neon', icon: 'neon' }, { name: 'MongoDB Atlas', icon: 'mongodb' },
      { name: 'React', icon: 'react' }, { name: 'Next.js', icon: 'nextdotjs' },
    ],
  },
];

export const methods = [
  'Bayesian modeling', 'Time-series forecasting', 'Recommender systems',
  'Reinforcement learning', 'Statistical modeling (statsmodels)',
];
