import type { SocialLinks } from '@/types';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://linelulan.vercel.app';

export const SOCIAL: SocialLinks = {
  github: 'https://github.com/LineLuLan',
  linkedin: 'https://www.linkedin.com/in/anhline03',
  kaggle: 'https://www.kaggle.com/lineizumi',
  openreview: 'https://openreview.net/profile?id=~Tran_Nam_Anh3',
  email: 'anhtrannam097@gmail.com',
};

export const CV_PATH = '/line-cv';
export const CV_FILE = '/cv/tran-nam-anh-cv.pdf';
export const AVATAR_PATH = '/avatar-pixel.png';

// Section anchors + breadcrumb labels (eight sections; the hero retains seven orbits).
// Key is the breadcrumb token; `id` is the DOM anchor used by `getElementById`.
// `hero` stays as DOM id for backwards-compat with the skip link.
export const SECTIONS = {
  whoami: { id: 'hero', slug: 'whoami', label: 'whoami' },
  about: { id: 'about', slug: 'about', label: 'about' },
  experience: { id: 'experience', slug: 'experience', label: 'experience' },
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
  'experience',
  'stack',
  'work',
  'framework',
  'record',
  'contact',
];

export const SECTION_TOTAL = SECTION_ORDER.length;
