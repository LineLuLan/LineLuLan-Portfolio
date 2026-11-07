'use client';

// Intent: centralize anchor navigation, interaction alignment, layout measurement, focus and history.
// Status: interaction alignment added. Next: browser coverage. Blockers: none. Confidence: shared offset regression cases.
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { alignSection, scrollToSection } from '@/lib/scroll-to-section';

function observeComponentReveals(root: HTMLElement) {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const pending = new Set<HTMLElement>();
  const revealAnimations = new Set(['component-reveal', 'component-child-reveal', 'component-sheen', 'word-rise']);
  let navigationTarget: HTMLElement | null = null;
  let settleTimer = 0;
  let navigationDeadline = 0;
  const shown = (element: HTMLElement) => {
    element.dataset.revealState = 'shown';
    element.dataset.revealed = 'true';
    pending.delete(element);
    observer.unobserve(element);
  };
  const enter = (element: HTMLElement) => {
    if (!pending.has(element)) return;
    if (root.dataset.motion !== 'on') {
      shown(element);
      return;
    }
    element.dataset.revealState = 'entering';
    element.dataset.revealed = 'true';
    pending.delete(element);
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      if (!pending.has(element)) return;
      // Keep the destination's entrance visible on arrival, instead of spending it mid-scroll.
      if (navigationTarget?.contains(element)) return;
      enter(element);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  // Progressive enhancement: never hide content the reader can already see.
  // A nested marker is handled by its outer block, avoiding compound movement.
  elements.forEach((element) => {
    const alreadyVisible = element.getBoundingClientRect().top < window.innerHeight;
    const nested = element.parentElement?.closest('[data-reveal]');
    if (root.dataset.motion !== 'on' || alreadyVisible || nested || element.dataset.revealed === 'true') {
      shown(element);
    } else {
      element.dataset.revealState = 'pending';
      pending.add(element);
      observer.observe(element);
    }
  });

  const revealFocused = (event: FocusEvent) => {
    let element = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-reveal]') : null;
    while (element) {
      shown(element);
      element = element.parentElement?.closest<HTMLElement>('[data-reveal]') ?? null;
    }
  };
  const finishReveal = (event: AnimationEvent) => {
    if (!(event.target instanceof Element) || !revealAnimations.has(event.animationName)) return;
    const element = event.target.closest<HTMLElement>('[data-reveal-state="entering"]');
    if (!element) return;
    // The outer lift can finish before its last chip or the local sheen. Keep their sequence intact.
    const stillEntering = element.getAnimations({ subtree: true }).some((animation) =>
      'animationName' in animation && revealAnimations.has(String(animation.animationName)) &&
      (animation.playState === 'running' || animation.pending));
    if (!stillEntering) shown(element);
  };
  const finishNavigation = () => {
    const target = navigationTarget;
    navigationTarget = null;
    window.clearTimeout(settleTimer);
    window.clearTimeout(navigationDeadline);
    if (!target) return;
    pending.forEach((element) => {
      if (!target.contains(element)) return;
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight - 24 && bounds.bottom > 0) enter(element);
    });
  };
  const onNavigation = (event: Event) => {
    const target = (event as CustomEvent<{ target?: HTMLElement }>).detail?.target;
    finishNavigation();
    if (!(target instanceof HTMLElement) || root.dataset.motion !== 'on') return;
    navigationTarget = target;
    // scrollend handles current browsers; the short idle timer supports the rest.
    settleTimer = window.setTimeout(finishNavigation, 120);
    navigationDeadline = window.setTimeout(finishNavigation, 1400);
  };
  const onScroll = () => {
    if (!navigationTarget) return;
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(finishNavigation, 120);
  };
  const motionObserver = new MutationObserver(() => {
    if (root.dataset.motion === 'on') return;
    // Turning motion back on never re-hides or replays content already made available.
    elements.forEach(shown);
    finishNavigation();
  });
  motionObserver.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  document.addEventListener('focusin', revealFocused);
  document.addEventListener('animationend', finishReveal);
  document.addEventListener('sectionnavigate', onNavigation);
  document.addEventListener('scrollend', finishNavigation);
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.clearTimeout(settleTimer);
    window.clearTimeout(navigationDeadline);
    elements.forEach(shown);
    observer.disconnect();
    motionObserver.disconnect();
    document.removeEventListener('focusin', revealFocused);
    document.removeEventListener('animationend', finishReveal);
    document.removeEventListener('sectionnavigate', onNavigation);
    document.removeEventListener('scrollend', finishNavigation);
    window.removeEventListener('scroll', onScroll);
  };
}

export function AnchorScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    // The footer height lets Contact and the footer share the last screen (Line, 2026-11-06).
    const footer = document.querySelector<HTMLElement>('[data-site-footer]');
    const measureHeader = () => {
      if (header) root.style.setProperty('--header-h', `${header.getBoundingClientRect().height}px`);
      if (footer) root.style.setProperty('--footer-h', `${footer.getBoundingClientRect().height}px`);
    };
    const observer = new ResizeObserver(measureHeader);
    if (footer) observer.observe(footer);
    if (header) observer.observe(header);
    measureHeader();
    const stopReveals = observeComponentReveals(root);
    let disposed = false;
    let navigated = false;
    let frame = 0;
    const target = (hash: string) => {
      try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { return null; }
    };
    const navigate = (section: HTMLElement) => {
      document.dispatchEvent(new CustomEvent('sectionnavigate', { detail: { target: section } }));
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
      if (!anchor || anchor.closest('[data-tap-intercept="true"]') || anchor.hasAttribute('download') || (anchor.getAttribute('target') && anchor.getAttribute('target') !== '_self')) return;
      const hash = anchor.getAttribute('href')!;
      const section = target(hash);
      if (!section) return;
      event.preventDefault();
      navigated = true;
      history.pushState(null, '', hash);
      navigate(section);
    };
    const onInteractionClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target;
      const section = element.closest<HTMLElement>('section.screen-section[id]');
      if (!section || section.id === 'hero') return;
      if (element.closest('[data-no-align], [role="dialog"], [aria-modal="true"], [data-site-header], [data-site-footer], .dock-trigger, #theme-dock-panel, a[href]')) return;
      const interactive = element.closest<HTMLElement>('button, [role="tab"], [role="button"], summary, input, select, textarea, label, [data-align-section]');
      if (interactive && section.contains(interactive)) alignSection(section);
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
    // Capture: React may remove the clicked control (carousel slides) before a bubbling listener runs.
    document.addEventListener('click', onInteractionClick, true);
    window.addEventListener('popstate', onHistory);
    window.addEventListener('hashchange', onHistory);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      stopReveals();
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('click', onInteractionClick, true);
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onHistory);
    };
  }, [pathname]);
  return null;
}
