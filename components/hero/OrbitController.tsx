'use client';

// Intent: move the same eight anchors between CSS orbits and Pisces without losing focus.
// Status: interruptible CSS flights with frozen orbit timelines and native anchor navigation.
// Next: browser regression after interaction changes. Blockers: none. Confidence: geometry + input checks.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Point } from '@/lib/constellation-fit';

type Mode = 'orbit' | 'constellation';
export function OrbitController({ children, targets }: { children: ReactNode; targets: (Point & { id: string })[] }) {
  const figure = useRef<HTMLElement>(null);
  const current = useRef<Mode>('orbit');
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>();
  const returnTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchPointer = useRef(false);
  const touchStartMode = useRef<Mode>('orbit');
  const [mode, setMode] = useState<Mode>('orbit');

  const switchMode = useCallback((next: Mode) => {
    const element = figure.current;
    if (!element) return;
    clearTimeout(returnTimer.current);
    const instant = document.documentElement.dataset.motion === 'off';
    // Pause before reading matrices. Keep the CSS animation instances alive on return.
    element.dataset.paused = 'true';
    const screen = element.querySelector('svg')?.getScreenCTM();
    if (!screen) return;
    for (const target of targets) {
      const home = element.querySelector<SVGGElement>(`[data-home="${target.id}"]`);
      const flight = home?.querySelector<SVGGElement>('.orbit-flight');
      const matrix = home?.getScreenCTM();
      if (!flight || !matrix) continue;
      // Convert the destination into the upright home group's local space, including
      // parent perspective, CSS scale and the SVG viewBox. The home itself never flies.
      const destination = new DOMPoint(target.x, target.y).matrixTransform(screen).matrixTransform(matrix.inverse());
      flight.style.transform = next === 'constellation' ? `translate(${destination.x}px, ${destination.y}px)` : 'translate(0px, 0px)';
    }
    current.current = next;
    element.dataset.mode = next;
    setMode(next);
    if (next === 'orbit') {
      const resume = () => { element.dataset.paused = 'false'; };
      if (instant) resume();
      else returnTimer.current = setTimeout(resume, 740);
    }
  }, [targets]);

  useEffect(() => {
    const observer = new MutationObserver(() => switchMode(current.current));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    return () => {
      observer.disconnect();
      clearTimeout(hoverTimer.current);
      clearTimeout(returnTimer.current);
    };
  }, [switchMode]);

  function hover(next: Mode, pointerType: string) {
    if (pointerType === 'touch' || !window.matchMedia('(hover: hover)').matches) return;
    clearTimeout(hoverTimer.current);
    if (next === 'orbit' && figure.current?.contains(document.activeElement)) return;
    if (current.current !== next) hoverTimer.current = setTimeout(() => switchMode(next), 120);
  }

  return (
    <figure ref={figure} className="orbit-figure" data-mode={mode} data-paused="false"
      onPointerEnter={(event) => hover('constellation', event.pointerType)}
      onPointerLeave={(event) => hover('orbit', event.pointerType)}
      onPointerDownCapture={(event) => {
        touchPointer.current = event.pointerType === 'touch' || !window.matchMedia('(hover: hover)').matches;
        touchStartMode.current = current.current;
        // AnchorScroll's document capture listener runs before React's; this marker tells it
        // a first tap in orbit mode only aligns the planets and must not navigate.
        event.currentTarget.dataset.tapIntercept = String(touchPointer.current && current.current === 'orbit');
      }}
      onPointerCancel={() => { touchPointer.current = false; }}
      onClickCapture={(event) => {
        const touch = touchPointer.current || (!window.matchMedia('(hover: hover)').matches && event.detail > 0);
        touchPointer.current = false;
        event.currentTarget.dataset.tapIntercept = 'false';
        if (!touch || event.detail === 0) return;
        clearTimeout(hoverTimer.current);
        if (touchStartMode.current === 'orbit') {
          event.preventDefault();
          event.stopPropagation();
          switchMode('constellation');
        } else if (!(event.target as Element).closest('a')) switchMode('orbit');
      }}
      onFocusCapture={(event) => {
        if (!touchPointer.current && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
          clearTimeout(hoverTimer.current);
          switchMode('constellation');
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          clearTimeout(hoverTimer.current);
          switchMode('orbit');
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          clearTimeout(hoverTimer.current);
          switchMode('orbit');
        }
      }}>
      {children}
      <figcaption className="orbit-caption">
        {mode === 'constellation' ? 'Pisces · follow the stars 1 to 8' : <><span className="orbit-caption-hover">Hover to align the planets · click to jump</span><span className="orbit-caption-touch">Tap to align the planets</span></>}
      </figcaption>
    </figure>
  );
}
