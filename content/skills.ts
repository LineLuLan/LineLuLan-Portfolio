import type { SkillTier } from '@/types';

export const skills: SkillTier[] = [
  {
    id: 'core',
    command: 'cat core_stack.log',
    label: 'CORE STACK',
    caption: 'daily reach',
    rows: [
      { category: 'Languages', items: ['Python', 'SQL', 'TypeScript', 'JavaScript', 'R'] },
      { category: 'ML / NLP', items: ['PyTorch', 'XGBoost', 'LightGBM', 'Scikit-learn'] },
      { category: 'Data Eng', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'vector databases', 'async pipelines'] },
      { category: 'Backend / Infra', items: ['REST APIs', 'Docker', 'Git/GitHub', 'CI/CD', 'automated testing'] },
      { category: 'Frontend', items: ['React', 'Next.js'] },
    ],
  },
  {
    id: 'llm',
    command: 'cat llm_toolbox.log',
    label: 'LLM TOOLBOX',
    caption: 'multi-provider experience',
    rows: [
      { category: 'APIs', items: ['OpenAI', 'Gemini', 'Groq', 'Cerebras', 'Anthropic', 'OpenRouter'] },
      { category: 'Orchestration', items: ['LLM orchestration', 'multi-agent systems', 'eval harnesses'] },
      { category: 'Open source', items: ['HuggingFace'] },
    ],
  },
  {
    id: 'working',
    command: 'cat working_knowledge.log',
    label: 'WORKING KNOWLEDGE',
    caption: 'shipped projects',
    rows: [
      { category: 'Bayesian', items: ['PyMC'] },
      { category: 'Time series', items: ['forecasting', 'statsmodels'] },
      { category: 'Computer vision', items: ['OpenCV'] },
      { category: 'RecSys', items: ['collaborative', 'content-based'] },
      { category: 'RL', items: ['policy gradient', 'Q-learning'] },
      { category: 'Cloud', items: ['Vercel', 'Supabase', 'Neon', 'MongoDB Atlas'] },
      { category: 'Data tools', items: ['Pandas', 'Polars', 'NumPy', 'Redis', 'Prisma', 'Drizzle'] },
      { category: 'Other lang', items: ['Java'] },
    ],
  },
  {
    id: 'exploring',
    command: 'cat exploring.log',
    label: 'EXPLORING',
    caption: 'active investment',
    rows: [
      { category: '→', items: ['Multi-agent simulation & LLM routing'] },
      { category: '→', items: ['Knowledge distillation for compact encoders'] },
      { category: '→', items: ['Clinical ML & informative missingness'] },
      { category: '→', items: ['MLOps fundamentals'] },
    ],
  },
];
