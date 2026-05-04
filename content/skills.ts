import type { SkillTier } from '@/types';

export const skills: SkillTier[] = [
  {
    id: 'core',
    command: 'cat core_stack.log',
    label: 'CORE STACK',
    caption: 'daily reach',
    rows: [
      { category: 'Languages', items: ['Python', 'SQL', 'TypeScript', 'JavaScript'] },
      { category: 'ML / DL', items: ['PyTorch', 'TensorFlow', 'Scikit-learn'] },
      { category: 'Data', items: ['Pandas', 'NumPy'] },
      { category: 'Frontend', items: ['React', 'Next.js'] },
      { category: 'Tools', items: ['Git', 'Jupyter'] },
    ],
  },
  {
    id: 'llm',
    command: 'cat llm_toolbox.log',
    label: 'LLM TOOLBOX',
    caption: 'multi-provider experience',
    rows: [
      { category: 'APIs', items: ['OpenAI', 'Anthropic', 'Gemini', 'OpenRouter'] },
      { category: 'Inference', items: ['Groq', 'Cerebras'] },
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
      { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma'] },
      { category: 'Other lang', items: ['Java', 'R'] },
    ],
  },
  {
    id: 'exploring',
    command: 'cat exploring.log',
    label: 'EXPLORING',
    caption: 'active investment',
    rows: [
      { category: '→', items: ['Agent system & LLM pipeline design'] },
      { category: '→', items: ['Advanced ML/DL techniques'] },
      { category: '→', items: ['Database architecture & management'] },
      { category: '→', items: ['MLOps fundamentals'] },
    ],
  },
];
