'use client';

// Intent: show real country totals and a compact world map in the Orbit disclosure.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: lazy data and flag bundle.
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import * as flags from 'country-flag-icons/react/3x2';
import world from '@/content/world-dots.json';
import { topCountries, type VisitorResponse } from '@/lib/visitors/core';

const names = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });
const countryName = (code: string) => code === 'XX' ? 'Unknown' : names.of(code) ?? 'Unknown';
const anchors: Record<string, number[]> = world.countries;

export default function VisitorPanel({ id, stats, trigger, onClose }: {
  id: string; stats: VisitorResponse; trigger: RefObject<HTMLButtonElement>; onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 80, left: 8, maxHeight: 500 });
  const top = topCountries(stats.countries, 5);
  const max = top[0]?.count ?? 1;
  const you = anchors[stats.you];

  useLayoutEffect(() => {
    const place = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(360, window.innerWidth - 16);
      const top = Math.min(rect.bottom + 8, window.innerHeight - 80);
      setPosition({ top, left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)), maxHeight: window.innerHeight - top - 8 });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [trigger]);

  useEffect(() => {
    closeButton.current?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) onClose();
    };
    document.addEventListener('pointerdown', outside);
    const button = trigger.current;
    const element = panel.current;
    return () => {
      document.removeEventListener('pointerdown', outside);
      // Do not steal focus from a section link or other outside-click target.
      if (document.activeElement === document.body || element?.contains(document.activeElement)) button?.focus({ preventScroll: true });
    };
  }, [onClose, trigger]);

  return createPortal(
    <div ref={panel} id={id} role="dialog" aria-labelledby={`${id}-title`} className="visitor-panel" style={position}
      onKeyDown={(event) => {
        if (event.key === 'Tab') { event.preventDefault(); onClose(); }
      }}>
      <div className="visitor-panel-heading">
        <div><h2 id={`${id}-title`} className="font-sans text-sm text-muted">Visitors</h2>
          <p className="visitor-total font-display text-ink">{stats.total.toLocaleString('en-US')}</p>
        </div>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close visitors" className="visitor-close">×</button>
      </div>
      <svg className="visitor-map" viewBox={`-2 -2 ${world.width + 4} ${world.height + 4}`} role="img" aria-label={`World map of visitors by country${stats.you === 'XX' ? '' : `; you are in ${countryName(stats.you)}`}`}>
        <g fill="var(--color-muted)" opacity="0.35">
          {world.points.map(([x, y], index) => <rect key={index} x={x} y={y} width="0.65" height="0.65" />)}
        </g>
        {stats.countries.map(({ code, count }) => {
          const point = anchors[code];
          return point ? <circle key={code} cx={point[0]} cy={point[1]} r="1.4" fill="var(--color-accent)" opacity={0.35 + 0.65 * Math.log1p(count) / Math.log1p(max)}><title>{countryName(code)}: {count.toLocaleString('en-US')}</title></circle> : null;
        })}
        {you && <circle className="visitor-you-ring" cx={you[0]} cy={you[1]} r="2.6" fill="none" stroke="var(--color-accent)" strokeWidth="0.6"><title>Your country: {countryName(stats.you)}</title></circle>}
      </svg>
      <ol className="visitor-countries" aria-label="Top countries">
        {top.map(({ code, count }) => {
          const Flag = flags[code as keyof typeof flags];
          return <li key={code} className="visitor-country">
            <span className="visitor-country-bar" style={{ width: `${count / max * 100}%` }} aria-hidden="true" />
            {Flag ? <Flag className="visitor-flag" aria-hidden="true" /> : <span className="visitor-flag visitor-unknown" aria-hidden="true">◎</span>}
            <span className="visitor-country-name">{countryName(code)}{code === stats.you && <span className="visitor-you text-muted"> you</span>}</span>
            <span className="font-mono">{count.toLocaleString('en-US')}</span>
          </li>;
        })}
      </ol>
      <p className="visitor-privacy text-muted">Counted anonymously by country. No IPs or cookies stored.</p>
    </div>, document.body,
  );
}
