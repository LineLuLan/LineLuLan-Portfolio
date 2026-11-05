'use client';

// Intent: centralize anchor navigation, layout measurement, focus and history.
// Status: R2. Next: browser coverage. Blockers: none. Confidence: shared offset regression cases.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToSection } from '@/lib/scroll-to-section';

export function AnchorScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    const measureHeader = () => {
      if (header) root.style.setProperty('--header-h', `${header.getBoundingClientRect().height}px`);
    };
    const observer = new ResizeObserver(measureHeader);
    if (header) observer.observe(header);
    measureHeader();
    const reveals = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.revealed = 'true';
        reveals.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach((element) => reveals.observe(element));
    let disposed = false;
    let navigated = false;
    let frame = 0;
    const target = (hash: string) => {
      try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { return null; }
    };
    const navigate = (section: HTMLElement) => {
      document.dispatchEvent(new Event('sectionnavigate'));
      cancelAnimationFrame(frame);
      // Wait for the mobile disclosure to close before measuring the sticky header.
      frame = requestAnimationFrame(() => {
        measureHeader();
        scrollToSection(section);
      });
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.getAttribute('target') && anchor.getAttribute('target') !== '_self')) return;
      const hash = anchor.getAttribute('href')!;
      const section = target(hash);
      if (!section) return;
      event.preventDefault();
      navigated = true;
      history.pushState(null, '', hash);
      navigate(section);
    };
    const onHistory = () => {
      navigated = true;
      const section = target(window.location.hash || '#hero');
      if (section) navigate(section);
    };
    const initialHash = window.location.hash;
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
    void Promise.all([loaded, document.fonts.ready]).then(() => {
      if (disposed || navigated || !initialHash) return;
      frame = requestAnimationFrame(() => {
        const section = target(initialHash);
        if (section) navigate(section);
      });
    });
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onHistory);
    window.addEventListener('hashchange', onHistory);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      reveals.disconnect();
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onHistory);
    };
  }, [pathname]);
  return null;
}
