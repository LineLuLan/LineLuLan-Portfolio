'use client';

// Intent: guide visitors through Line's sections without changing the page's layout or interactions.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: pure navigation tests.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { alignSection } from '@/lib/scroll-to-section';
import { nextStep, previousStep, targetForStep, TOUR_STEPS } from './tour-steps';
import './tour.css';

type Spotlight = { top: number; left: number; width: number; height: number };

function TourOverlay({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [headerBottom, setHeaderBottom] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const previousIndex = useRef<number | null>(null);
  const step = TOUR_STEPS[index]!;

  useLayoutEffect(() => {
    // Effect replay in Strict Mode is still the same step, not a Next action.
    const changedStep = previousIndex.current !== null && previousIndex.current !== index;
    const focusTarget = changedStep ? next.current : card.current;
    previousIndex.current = index;
    focusTarget?.focus({ preventScroll: true });
  }, [index]);

  useLayoutEffect(() => {
    // The portal is a direct body child. Preserve any pre-existing inert state,
    // including sibling portals created while the tour is open.
    const previous = new Map<HTMLElement, boolean>();
    const isolate = () => {
      for (const element of document.body.children) {
        if (!(element instanceof HTMLElement) || element === root.current || previous.has(element)) continue;
        previous.set(element, element.inert);
        element.inert = true;
      }
    };
    isolate();
    const observer = new MutationObserver(isolate);
    observer.observe(document.body, { childList: true });
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !card.current?.contains(event.target)) card.current?.focus({ preventScroll: true });
    };
    document.addEventListener('focusin', containFocus);
    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', containFocus);
      previous.forEach((inert, element) => { element.inert = inert; });
    };
  }, []);

  useLayoutEffect(() => {
    const id = targetForStep(index);
    const target = id ? document.getElementById(id) : null;
    const header = document.querySelector<HTMLElement>('[data-site-header]');
    let frame = 0;
    const measure = () => {
      frame = 0;
      const bottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
      setHeaderBottom(bottom);
      const bounds = target?.getBoundingClientRect();
      if (!bounds) { setSpotlight(null); return; }
      const top = Math.max(bottom, Math.min(window.innerHeight, bounds.top));
      const left = Math.max(0, bounds.left);
      setSpotlight({
        top: top - bottom,
        left,
        width: Math.max(0, Math.min(window.innerWidth, bounds.right) - left),
        height: Math.max(0, Math.min(window.innerHeight, bounds.bottom) - top),
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    document.dispatchEvent(new CustomEvent('sectionnavigate', { detail: { target } }));
    // Let the header disclosure close before measuring the shared alignment offset.
    frame = requestAnimationFrame(() => {
      if (target) alignSection(target);
      measure();
    });
    const resize = new ResizeObserver(schedule);
    if (target) resize.observe(target);
    if (header) resize.observe(header);
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [index]);

  const advance = () => index === TOUR_STEPS.length - 1 ? onFinish() : setIndex(nextStep);
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (['Escape', 'ArrowRight', 'ArrowLeft', 'Tab'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === 'Escape') onFinish();
    if (event.key === 'ArrowRight') advance();
    if (event.key === 'ArrowLeft') setIndex(previousStep);
    if (event.key === 'Tab') {
      const buttons = Array.from(card.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const destination = current < 0 ? (event.shiftKey ? buttons.length - 1 : 0)
        : (current + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length;
      buttons[destination]?.focus({ preventScroll: true });
    }
  };

  return createPortal(
    <div ref={root} className="tour-root" data-no-align data-tour-root onKeyDown={onKeyDown}
      style={{ '--tour-header': `${headerBottom}px` } as CSSProperties}>
      <div className="tour-stage">
        {spotlight && step.target ? <div className="tour-spotlight" aria-hidden="true" style={spotlight} />
          : <div className="tour-dimmer" aria-hidden="true" />}
        <div key={index} ref={card} className={`tour-card${step.target ? '' : ' tour-card-centered'}`}
          role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description"
          tabIndex={-1} data-tour-step={index + 1}>
          <p className="tour-counter">{index + 1} / {TOUR_STEPS.length}</p>
          <h2 id="tour-title">{step.title}</h2>
          <p id="tour-description">{step.body}</p>
          <div className="tour-actions">
            <button type="button" className="tour-skip" onClick={onFinish}>Skip tour</button>
            {index > 0 && <button type="button" onClick={() => setIndex(previousStep)}>Back</button>}
            <button ref={next} type="button" className="tour-next" onClick={advance}>
              {index === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>, document.body,
  );
}

export function GuidedTour() {
  const pathname = usePathname();
  const [running, setRunning] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);

  const finish = useCallback(() => {
    setRunning(false);
    // Restore after the overlay cleanup removes inert. On mobile Header reopens
    // its disclosure so the actual tour button is visible and focusable again.
    requestAnimationFrame(() => {
      const avatar = document.querySelector<HTMLElement>('[data-tour-trigger="avatar"]');
      const opener = trigger.current?.isConnected && trigger.current.getClientRects().length
        ? trigger.current : avatar;
      if (opener?.getClientRects().length) opener.focus({ preventScroll: true });
      else document.dispatchEvent(new Event('tourrestore'));
    });
  }, []);

  useEffect(() => {
    setRunning(false);
    if (pathname !== '/') return;
    let cancelled = false;
    let frame = 0;
    const start = (event?: Event) => {
      trigger.current = (event as CustomEvent<{ trigger?: HTMLElement }> | undefined)?.detail?.trigger ?? null;
      document.dispatchEvent(new CustomEvent('sectionnavigate'));
      setRunning(true);
    };
    document.addEventListener('starttour', start);
    const url = new URL(window.location.href);
    const observer = new MutationObserver(() => tryAutoStart());
    let ready = false;
    const tryAutoStart = () => {
      if (cancelled || !ready || document.querySelector('.boot-splash')) return;
      observer.disconnect();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        url.searchParams.delete('tour');
        history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
        start();
      });
    };
    let onLoad: (() => void) | undefined;
    if (url.searchParams.get('tour') === '1') {
      observer.observe(document.body, { childList: true, subtree: true });
      const loaded = document.readyState === 'complete' ? Promise.resolve()
        : new Promise<void>((resolve) => { onLoad = () => resolve(); window.addEventListener('load', onLoad, { once: true }); });
      void Promise.all([loaded, document.fonts.ready]).then(() => { ready = true; tryAutoStart(); });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('starttour', start);
      if (onLoad) window.removeEventListener('load', onLoad);
    };
  }, [pathname]);

  return running && pathname === '/' ? <TourOverlay onFinish={finish} /> : null;
}
