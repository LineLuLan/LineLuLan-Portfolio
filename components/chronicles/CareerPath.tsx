'use client';

// Intent: let pointer, touch and keyboard users explore the same server-rendered milestones.
// Status: implemented. Next: viewport acceptance. Blockers: none. Confidence: geometry and SSR checks.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { formatChronicleDate } from '@/lib/dates';
import type { PlanetKind } from '@/lib/pixel-planets';
import type { ChronicleEvent } from '@/types';
import { careerLayout } from './career-layout';
import './career-path.css';

const TYPES: Record<ChronicleEvent['type'], { label: string; planet: PlanetKind }> = {
  education: { label: 'Education', planet: 'moon' },
  role: { label: 'Role', planet: 'earth' },
  award: { label: 'Award', planet: 'saturn' },
  event: { label: 'Event', planet: 'comet' },
  project: { label: 'Project', planet: 'jupiter' },
};

function dateRange(event: ChronicleEvent) {
  return `${formatChronicleDate(event.date)}${event.ongoing ? ' · Present' : event.endDate ? ` · ${formatChronicleDate(event.endDate)}` : ''}`;
}

export function CareerPath({ events, today }: { events: ChronicleEvent[]; today: string }) {
  const { reducedMotion } = useTheme();
  const [open, setOpen] = useState<string | null>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const layout = careerLayout(events, today);
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const button = buttons.current[open];
      // A hover card can open while focus is elsewhere; preserve that unrelated focus.
      if (button?.parentElement?.contains(document.activeElement)) button.focus();
      setOpen(null);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open]);
  const dismiss = (id: string) => {
    // Return focus without reopening the card through the node's focus handler.
    buttons.current[id]?.focus();
    setOpen(null);
  };
  return (
    <div className="career-path">
      <div className="career-stage" style={{ '--mobile-height': `${layout.mobileHeight}px` } as CSSProperties}
        onPointerLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) setOpen(null); }}>
        {(['desktop', 'mobile'] as const).map((mode) => (
          <svg key={mode} className={`career-road career-road-${mode}`} viewBox={mode === 'desktop' ? '0 0 1000 580' : `0 0 300 ${layout.mobileHeight}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={layout[mode].travelled} className="career-road-base" />
            <path d={layout[mode].future} className="career-road-next" />
            <motion.path d={layout[mode].travelled} className="career-road-travelled"
              initial={reducedMotion ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.05 }} transition={{ duration: reducedMotion ? 0 : 1.2, ease: 'easeInOut' }} />
          </svg>
        ))}
        <ol aria-label="Career milestones, oldest to newest" className="career-nodes">
          {layout.nodes.map(({ event, index, x, y, mx, my, column, row, future }) => (
            <li key={event.id} data-milestone={event.id} data-type={event.type} data-side={index % 2 ? 'right' : 'left'}
              data-label={column % 2 ? 'below' : 'above'} data-column={column} data-bottom={row >= 2 || index === layout.nodes.length - 1} data-open={open === event.id}
              style={{ '--x': `${x / 10}%`, '--y': `${y}px`, '--mx': `${mx / 3}%`, '--my': `${my}px` } as CSSProperties}
              onBlur={(focus) => { if (!focus.currentTarget.contains(focus.relatedTarget)) setOpen(null); }}>
              <button type="button" ref={(element) => { buttons.current[event.id] = element; }} className="career-node"
                aria-expanded={open === event.id} aria-controls={open === event.id ? `career-detail-${event.id}` : undefined}
                onPointerEnter={(pointer) => { if (pointer.pointerType === 'mouse') setOpen(event.id); }}
                onFocus={(focus) => { if (focus.currentTarget.matches(':focus-visible')) setOpen(event.id); }}
                onClick={() => setOpen((current) => current === event.id ? null : event.id)}>
                <motion.span className="career-marker-wrap" initial={reducedMotion ? false : { scale: 0 }} whileInView={{ scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : index * 0.045 }}>
                  <span className="career-marker" data-ongoing={event.type === 'role' && event.ongoing} />
                  <PixelPlanet kind={TYPES[event.type].planet} size={16} className="career-glyph" />
                </motion.span>
                <span className="career-label">
                  <span className="career-date">{future && <span className="text-accent">Next<br /></span>}{formatChronicleDate(event.date)}</span>
                  <span className="career-title">{event.title}</span>
                </span>
              </button>
              {open === event.id && (
                <div id={`career-detail-${event.id}`} role="region" aria-label={event.title} className="career-detail">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-xs text-muted">{dateRange(event)}</p>
                    <button type="button" className="-mr-2 -mt-2 flex min-h-11 min-w-11 items-center justify-center text-ink" aria-label="Close milestone details" onClick={() => dismiss(event.id)}>×</button>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink">{event.title}</h3>
                  {event.org && <p className="mt-1 text-sm text-muted">{event.org}</p>}
                  {event.description && <p className="mt-3 text-sm leading-6 text-ink">{event.description}</p>}
                  {event.link && <a href={event.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">Learn more</a>}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
      <ul aria-label="Milestone types" className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {Object.entries(TYPES).map(([type, { label, planet }]) => <li key={type} className="flex items-center gap-2 text-xs text-muted"><PixelPlanet kind={planet} size={20} />{label}</li>)}
        <li className="flex items-center gap-2 text-xs text-muted"><span className="career-legend-dot" data-kind="active" aria-hidden />Active now</li>
        <li className="flex items-center gap-2 text-xs text-muted"><span className="career-legend-dot" data-kind="award" aria-hidden />Awards &amp; wins</li>
      </ul>
      <noscript><style>{`.career-marker-wrap { transform: none !important; } .career-road-travelled { stroke-dasharray: none !important; }`}</style></noscript>
    </div>
  );
}
