import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { SOCIAL } from '@/lib/constants';
import { ThemeStamp } from './ThemeStamp';

const iconLink = 'hairline grid h-11 w-11 place-items-center rounded-[var(--theme-control-radius)] border text-muted hover:border-accent hover:text-accent';

export function Footer() {
  return (
    <footer data-site-footer className="hairline border-t pb-24 pt-10 md:py-6">
      <div className="container-x flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-muted" suppressHydrationWarning>
          © {new Date().getFullYear()} Trần Nam Anh (Line) · Built with intention.
        </p>
        <div className="flex flex-col gap-3 md:items-end">
          <ThemeStamp />
          <div className="flex items-center gap-2">
            <a href={`mailto:${SOCIAL.email}`} aria-label="Email" className={iconLink}>
              <Mail size={16} aria-hidden />
            </a>
            <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLink}>
              <Github size={16} aria-hidden />
            </a>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLink}>
              <Linkedin size={16} aria-hidden />
            </a>
            <Link href="#hero" aria-label="Back to top" className={iconLink}>
              <ArrowUp size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
