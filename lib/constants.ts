import type { SocialLinks } from '@/types';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://linelulan.dev';

export const SOCIAL: SocialLinks = {
  github: 'https://github.com/LineLuLan',
  linkedin: 'https://www.linkedin.com/in/anhline03',
  kaggle: 'https://www.kaggle.com/lineizumi',
  email: 'tnanh.gdsciu@gmail.com',
};

export const CV_PATH = '/cv/line-resume-2026.pdf';
export const AVATAR_PATH = '/avatar.png';

// Section IDs (used for scroll anchors + breadcrumb)
export const SECTIONS = {
  hero: { id: 'hero', path: '~/usr/line/whoami' },
  skills: { id: 'skills', path: '~/sys/stack' },
  projects: { id: 'projects', path: '~/sys/deployments' },
  dabm: { id: 'dabm', path: '~/lib/dabm' },
  chronicles: { id: 'chronicles', path: '~/var/logs/chronicles' },
  contact: { id: 'contact', path: '~/net/ping' },
} as const;

export type SectionId = keyof typeof SECTIONS;
