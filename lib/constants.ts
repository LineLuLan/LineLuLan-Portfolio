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

// Section anchors + breadcrumb labels (editorial 7-section structure).
// Key is the breadcrumb token; `id` is the DOM anchor used by `getElementById`.
// `hero` stays as DOM id for backwards-compat with the skip link.
export const SECTIONS = {
  whoami: { id: 'hero', slug: 'whoami', label: 'whoami' },
  about: { id: 'about', slug: 'about', label: 'about' },
  stack: { id: 'stack', slug: 'stack', label: 'stack' },
  work: { id: 'work', slug: 'work', label: 'work' },
  framework: { id: 'framework', slug: 'framework', label: 'framework' },
  record: { id: 'record', slug: 'record', label: 'record' },
  contact: { id: 'contact', slug: 'contact', label: 'contact' },
} as const;

export type SectionId = keyof typeof SECTIONS;

export const SECTION_ORDER: SectionId[] = [
  'whoami',
  'about',
  'stack',
  'work',
  'framework',
  'record',
  'contact',
];

export const SECTION_TOTAL = SECTION_ORDER.length;
