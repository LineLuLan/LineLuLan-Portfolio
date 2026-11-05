// Intent: identify link destinations with monochrome marks, including an original review motif.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: hostname render checks.
import { Globe, Linkedin, Mail } from 'lucide-react';
import { siArxiv, siGithub, siHuggingface, siKaggle, siYoutube, type SimpleIcon } from 'simple-icons';

export const openReviewIcon = {
  title: 'OpenReview',
  viewBox: '0 0 24 24',
  paths: [
    { d: 'M4 2h11l5 5v6h-2V8h-5V4H6v16h6v2H4V2Zm11 2.8V6h1.2L15 4.8ZM8 10h8v2H8v-2Zm0 4h5v2H8v-2Z', fill: 'currentColor' },
    { d: 'm12.5 18 1.4-1.4 2.6 2.6 5.1-5.1 1.4 1.4-6.5 6.5-4-4Z', fill: 'currentColor' },
  ],
};

const siteIcons: Record<string, SimpleIcon> = {
  'github.com': siGithub,
  'kaggle.com': siKaggle,
  'arxiv.org': siArxiv,
  'huggingface.co': siHuggingface,
  'youtube.com': siYoutube,
  'youtu.be': siYoutube,
};

export function SiteIcon({ href, size = 16 }: { href: string; size?: number }) {
  const props = { size, className: 'shrink-0', 'aria-hidden': true } as const;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return <Globe {...props} />;
  }
  if (url.protocol === 'mailto:') return <Mail {...props} />;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return <Globe {...props} />;

  const hostname = url.hostname.replace(/^www\./, '');
  if (hostname === 'linkedin.com') return <Linkedin {...props} />;
  const icon = Object.hasOwn(siteIcons, hostname) ? siteIcons[hostname] : undefined;
  const mark = hostname === 'openreview.net' ? openReviewIcon : icon && {
    viewBox: '0 0 24 24',
    paths: [{ d: icon.path, fill: 'currentColor' }],
  };
  if (!mark) return <Globe {...props} />;

  return (
    <svg viewBox={mark.viewBox} width={size} height={size} className="shrink-0" aria-hidden="true">
      {mark.paths.map((path) => <path key={path.d} d={path.d} fill={path.fill} />)}
    </svg>
  );
}
