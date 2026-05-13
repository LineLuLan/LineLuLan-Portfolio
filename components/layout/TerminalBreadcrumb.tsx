'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SECTIONS, SECTION_ORDER, type SectionId } from '@/lib/constants';
import { cn } from '@/lib/cn';

export function TerminalBreadcrumb() {
  const [active, setActive] = useState<SectionId>('whoami');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_ORDER.forEach((id) => {
      const el = document.getElementById(SECTIONS[id].id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
              setActive(id);
            }
          });
        },
        { threshold: [0.4, 0.6] },
      );
      obs.observe(el);
      observers.push(obs);
    });
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 md:px-6">
        {/* Brand */}
        <Link
          href={`#${SECTIONS.whoami.id}`}
          aria-label="Back to top"
          className="group flex items-center gap-2.5"
        >
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-md border border-accent-pink/40 bg-accent-pink/10 font-mono text-[11px] font-semibold text-accent-pink transition-all group-hover:border-accent-pink group-hover:shadow-[0_0_12px_rgba(224,123,151,0.4)]"
          >
            L
          </span>
          <span className="hidden font-mono text-[11px] sm:inline">
            <span className="text-text-primary">line</span>
            <span className="text-text-tertiary"> · linelulan.dev</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-0.5 font-mono text-[11px]">
            {SECTION_ORDER.map((id, i) => {
              const isActive = active === id;
              return (
                <li key={id} className="relative">
                  <Link
                    href={`#${SECTIONS[id].id}`}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors',
                      isActive
                        ? 'text-accent-pink'
                        : 'text-text-secondary hover:bg-card hover:text-text-primary',
                    )}
                  >
                    <span
                      className={cn(
                        'text-[10px]',
                        isActive ? 'text-accent-pink/70' : 'text-text-tertiary',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{SECTIONS[id].label}</span>
                  </Link>
                  {isActive && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-2 -bottom-[7px] h-[2px] rounded-full bg-accent-pink shadow-[0_0_8px_rgba(224,123,151,0.7)]"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile select */}
        <select
          aria-label="Jump to section"
          value={active}
          onChange={(e) => {
            const next = e.target.value as SectionId;
            const el = document.getElementById(SECTIONS[next].id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="rounded-md border border-border-subtle bg-midnight px-2.5 py-1.5 font-mono text-[11px] text-text-primary md:hidden"
        >
          {SECTION_ORDER.map((id, i) => (
            <option key={id} value={id}>
              {String(i + 1).padStart(2, '0')} · {SECTIONS[id].label}
            </option>
          ))}
        </select>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-border-subtle/50">
        <div
          className="h-full bg-gradient-to-r from-accent-purple via-accent-magenta to-accent-pink shadow-[0_0_8px_rgba(199,21,133,0.5)] transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  );
}
