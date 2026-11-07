'use client';

// Intent: keep navigation fully visible and close the disclosure on global section navigation.
// Status: R2. Next: browser checks. Blockers: none. Confidence: independent static review.
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { AVATAR_PATH, CV_PATH, SECTIONS, SECTION_ORDER, type SectionId } from '@/lib/constants';
import { capitalize, cn } from '@/lib/cn';
import { ReadingProgress } from './ReadingProgress';
import { VisitorChip } from '@/components/visitors/VisitorChip';

// The brand is the whoami link; seven section links share one desktop row.
const navigation = SECTION_ORDER.filter((id) => id !== 'whoami');

export function Header() {
  const home = usePathname() === '/';
  const [active, setActive] = useState<SectionId>('whoami');
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    document.addEventListener('sectionnavigate', closeMenu);
    return () => document.removeEventListener('sectionnavigate', closeMenu);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_ORDER.forEach((id) => {
      const element = document.getElementById(SECTIONS[id].id);
      if (!element) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
      );
      observer.observe(element);
      observers.push(observer);
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const links = navigation.map((id) => (
    <li key={id}>
      <Link
        href={`${home ? '' : '/'}#${SECTIONS[id].id}`}
        aria-current={active === id ? 'location' : undefined}
        onClick={() => setOpen(false)}
        className={cn(
          'nav-link relative flex min-h-11 items-center whitespace-nowrap border-b-2 border-transparent px-2 font-sans text-[15px] font-medium hover:text-accent xl:px-3',
          active === id ? 'text-accent' : 'text-ink',
        )}
      >
        {capitalize(SECTIONS[id].label)}
      </Link>
    </li>
  ));

  return (
    <header
      data-site-header
      className="hairline sticky top-0 z-40 border-b bg-paper"
    >
      <div className="container-x flex min-h-20 flex-wrap items-center justify-between gap-2 py-3">
        <Link href={home ? '#hero' : '/'} aria-label="Line, back to top" className="flex min-h-11 shrink-0 items-center gap-2">
          <PixelPlanet kind="saturn" size={28} />
          <span className="font-sans text-xl font-bold text-ink">Line</span>
          <span className="hidden font-mono text-sm text-muted">linelulan.vercel.app</span>
        </Link>
        <nav aria-label="Sections" className="hidden nav:block">
          <ul className="flex items-center">{links}</ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <VisitorChip />
          <a href={CV_PATH} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-[var(--theme-control-radius)] bg-accent px-4 font-mono text-sm text-on-accent hover:bg-accent-hover">
            Open CV
          </a>
          <Image src={AVATAR_PATH} alt="Line's pixel avatar" width={40} height={40} className="hidden h-10 w-10 rounded-full ring-2 ring-accent/40 min-[440px]:block" />
          <button
            ref={menuButton}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="motion-control hairline min-h-11 rounded-[var(--theme-control-radius)] border px-2 font-mono text-sm text-ink hover:border-accent nav:hidden"
          >
            Menu
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" aria-label="Mobile sections" hidden={!open} className="hairline border-t nav:hidden">
        <ul className="container-x flex flex-col py-2">{links}</ul>
      </nav>
      <ReadingProgress />
    </header>
  );
}
