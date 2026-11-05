// Intent: keep the stack's named icon imports and brand contrast rule in one place.
// Status: R2. Next: visual review. Blockers: none. Confidence: WCAG luminance calculation.
import { siPython, siPostgresql, siMongodb, siMysql, siTypescript, siJavascript, siR, siPytorch, siScikitlearn, siHuggingface, siOpencv, siPandas, siPolars, siNumpy, siRedis, siDocker, siGit, siGithub, siReact, siNextdotjs, siVercel, siSupabase, siNeon, siPrisma, siDrizzle, siAnthropic, siGooglegemini, siOpenrouter, siOpenjdk } from 'simple-icons';

export const stackIcons = {
  python: siPython,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  mysql: siMysql,
  typescript: siTypescript,
  javascript: siJavascript,
  r: siR,
  pytorch: siPytorch,
  scikitlearn: siScikitlearn,
  huggingface: siHuggingface,
  opencv: siOpencv,
  pandas: siPandas,
  polars: siPolars,
  numpy: siNumpy,
  redis: siRedis,
  docker: siDocker,
  git: siGit,
  github: siGithub,
  react: siReact,
  nextdotjs: siNextdotjs,
  vercel: siVercel,
  supabase: siSupabase,
  neon: siNeon,
  prisma: siPrisma,
  drizzle: siDrizzle,
  anthropic: siAnthropic,
  googlegemini: siGooglegemini,
  openrouter: siOpenrouter,
  openjdk: siOpenjdk,
} as const;

export type StackIconKey = keyof typeof stackIcons;

export function stackIconColor(hex: string): string {
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const luminance = r! * 0.2126 + g! * 0.7152 + b! * 0.0722;
  return 1.05 / (luminance + 0.05) < 2 ? 'var(--color-ink)' : `#${hex}`;
}
