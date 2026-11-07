// Intent: list only Line's real tools, grouped by use, with practices separate from products.
// Status: R10 (2026-11-07) adds the agentic-coding harness tier from the Line Harness repo and
// merges backend + cloud into one shipping tier so the grid stays six cards. Next: content review.
// Confidence: tools taken from Line's own setup (line-harness README) and shipped projects.
import type { SkillTier } from '@/types';

export const skills: SkillTier[] = [
  {
    id: 'harness', label: 'Agentic coding', caption: 'The harness I build with every day',
    items: [
      { name: 'Claude Code', icon: 'claude' }, { name: 'Codex CLI', icon: 'openai' },
      { name: 'MCP', icon: 'modelcontextprotocol' }, { name: 'context7' }, { name: 'codegraph' },
      { name: 'Playwright' }, { name: 'Promptfoo' }, { name: 'Langfuse' },
    ],
    practices: ['Supervisor–worker', 'Task packets', 'Review gates'],
  },
  {
    id: 'agents', label: 'LLMs in production', caption: 'Multi-provider, evaluated, observed',
    items: [
      { name: 'OpenAI' }, { name: 'Anthropic', icon: 'anthropic' },
      { name: 'Google Gemini', icon: 'googlegemini' }, { name: 'Groq' },
      { name: 'Cerebras' }, { name: 'OpenRouter', icon: 'openrouter' },
    ],
    practices: ['Evals', 'Tool-use validation', 'Multi-agent'],
  },
  {
    id: 'languages', label: 'Languages', caption: 'What I write every day',
    items: [
      { name: 'Python', icon: 'python' }, { name: 'TypeScript', icon: 'typescript' },
      { name: 'SQL' }, { name: 'JavaScript', icon: 'javascript' },
      { name: 'PowerShell' }, { name: 'R', icon: 'r' }, { name: 'Java', icon: 'openjdk' },
    ],
  },
  {
    id: 'ml', label: 'ML & modeling', caption: 'Training, distilling, benchmarking',
    items: [
      { name: 'PyTorch', icon: 'pytorch' }, { name: 'Hugging Face', icon: 'huggingface' },
      { name: 'scikit-learn', icon: 'scikitlearn' }, { name: 'XGBoost' }, { name: 'LightGBM' },
      { name: 'OpenCV', icon: 'opencv' }, { name: 'PyMC' },
    ],
  },
  {
    id: 'data', label: 'Data engineering', caption: 'Pipelines and storage',
    items: [
      { name: 'pandas', icon: 'pandas' }, { name: 'Polars', icon: 'polars' },
      { name: 'NumPy', icon: 'numpy' }, { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Redis', icon: 'redis' }, { name: 'MongoDB', icon: 'mongodb' },
      { name: 'MySQL', icon: 'mysql' },
    ],
    practices: ['Vector databases', 'Async pipelines'],
  },
  {
    id: 'ship', label: 'Ship & run', caption: 'From commit to production',
    items: [
      { name: 'Docker', icon: 'docker' }, { name: 'GitHub Actions', icon: 'githubactions' },
      { name: 'GitHub', icon: 'github' }, { name: 'Vercel', icon: 'vercel' },
      { name: 'Next.js', icon: 'nextdotjs' },
      { name: 'Neon', icon: 'neon' }, { name: 'Supabase', icon: 'supabase' },
      { name: 'pnpm', icon: 'pnpm' },
    ],
    practices: ['CI/CD', 'Automated testing'],
  },
];

export const methods = [
  'Knowledge distillation', 'Bayesian modeling', 'Time-series forecasting',
  'Recommender systems', 'Reinforcement learning',
];
