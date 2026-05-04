import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { SOCIAL } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border-subtle px-5 py-10 md:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-mono text-[11px] text-text-secondary">
            <span className="text-success">●</span> connection ready · response in &lt; 24h
          </p>
          <p className="mt-1 font-mono text-[11px] text-text-tertiary">
            © {new Date().getFullYear()} line · built with caffeine and curiosity
          </p>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={`mailto:${SOCIAL.email}`}
            aria-label="Email"
            className="rounded-md border border-border-subtle p-2 text-text-secondary transition-colors hover:border-accent-pink hover:text-accent-pink"
          >
            <Mail size={14} aria-hidden />
          </a>
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-md border border-border-subtle p-2 text-text-secondary transition-colors hover:border-accent-pink hover:text-accent-pink"
          >
            <Github size={14} aria-hidden />
          </a>
          <a
            href={SOCIAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="rounded-md border border-border-subtle p-2 text-text-secondary transition-colors hover:border-accent-pink hover:text-accent-pink"
          >
            <Linkedin size={14} aria-hidden />
          </a>
          <Link
            href="#hero"
            aria-label="Back to top"
            className="ml-2 rounded-md border border-border-subtle p-2 text-text-secondary transition-colors hover:border-accent-pink hover:text-accent-pink"
          >
            <ArrowUp size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
}
