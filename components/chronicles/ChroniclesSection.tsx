'use client';

// Intent: keep every milestone reachable in compact, keyboard-operable year panels.
// Status: implemented. Next: viewport and assistive-tech probe. Blockers: browser unavailable. Confidence: date/keyboard regression cases.
import { useRef, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { motion } from 'framer-motion';
import { formatChronicleDate } from '@/lib/dates';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { EventModal } from './EventModal';
import { chronicles } from '@/content/chronicles';
import { capitalize, cn } from '@/lib/cn';
import type { ChronicleEvent } from '@/types';

function formatRange(e: ChronicleEvent) {
  const start = formatChronicleDate(e.date);
  if (e.ongoing) return `${start} — Present`;
  if (e.endDate) return `${start} — ${formatChronicleDate(e.endDate)}`;
  return start;
}

export function recordTabs(events: ChronicleEvent[], now: Date) {
  // Compare local calendar dates: today's events are current, regardless of UTC offset.
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
  const past = sorted.filter((event) => event.date <= today);
  const years = [...new Set(past.map((event) => event.date.slice(0, 4)))].filter((year) => year >= '2024').sort().reverse();
  return [
    { id: 'upcoming', label: 'Upcoming', events: sorted.filter((event) => event.date > today) },
    ...years.map((year) => ({ id: year, label: year, events: past.filter((event) => event.date.startsWith(year)) })),
    { id: 'earlier', label: 'Earlier', events: past.filter((event) => event.date < '2024-01-01') },
  ];
}

export function nextRecordTab(key: string, index: number, count: number) {
  if (key === 'ArrowRight') return (index + 1) % count;
  if (key === 'ArrowLeft') return (index - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

export function ChroniclesSection() {
  const { reducedMotion } = useTheme();
  const [open, setOpen] = useState<ChronicleEvent | null>(null);
  const [selected, setSelected] = useState(() => String(new Date().getFullYear()));
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = recordTabs(chronicles, new Date());
  const active = tabs.find((tab) => tab.id === selected) ?? tabs[1] ?? tabs[0]!;

  return (
    <SectionWrapper id="record" ariaLabel="Record" withTopRule>
      <SectionHeader index={6} slug="record" title="Experience and milestones." planet={SECTION_PLANET.record} className="mb-6 md:mb-6" />

      <noscript>
        <style>{`#record [role="tablist"] { display: none; } #record [role="tabpanel"][hidden] { display: block; } #record [role="tabpanel"] { margin-top: 24px; } #record [role="tabpanel"] li { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      <div role="tablist" aria-label="Record by year" className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => { buttons.current[index] = element; }}
            id={`record-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active.id === tab.id}
            aria-controls={`record-panel-${tab.id}`}
            tabIndex={active.id === tab.id ? 0 : -1}
            onClick={() => setSelected(tab.id)}
            onKeyDown={(event) => {
              const next = nextRecordTab(event.key, index, tabs.length);
              if (next === null) return;
              event.preventDefault();
              setSelected(tabs[next]!.id);
              buttons.current[next]?.focus();
            }}
            className={cn(
              'inline-flex min-h-11 items-center rounded-[var(--theme-control-radius)] border px-3 font-mono text-sm transition-colors',
              active.id === tab.id ? 'border-accent bg-accent text-on-accent' : 'hairline text-ink hover:border-accent hover:text-accent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} id={`record-panel-${tab.id}`} role="tabpanel" aria-labelledby={`record-tab-${tab.id}`} hidden={active.id !== tab.id} tabIndex={0}>
          <noscript><h3 className="mb-3 font-display text-[18px] font-bold text-ink">{tab.label}</h3></noscript>
            <ul className="grid gap-x-6 lg:grid-cols-2">
              {tab.events.map((event, index) => (
                <motion.li
                  key={event.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="min-w-0"
                >
                  <button type="button" onClick={() => setOpen(event)} className="grid h-full w-full min-w-0 items-start gap-2 border-t hairline py-3 text-left transition-colors hover:bg-surface sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-3">
                    <span className="font-mono text-[13px] leading-5 text-muted">{formatRange(event)}</span>
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                      <span className="block text-[16px] font-bold leading-6 text-ink">{event.title}</span>
                      {event.org && <span className="mt-1 block text-[14px] leading-5 text-muted">{event.org}</span>}
                      <span className="mt-1 inline-flex items-center gap-2 rounded bg-tint-c px-2 py-0.5 font-mono text-[13px] leading-5 text-ink">
                        {event.ongoing && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />}
                        {capitalize(event.type)}
                      </span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          {tab.events.length === 0 && <p className="text-muted">No events in this period.</p>}
        </div>
      ))}

      <EventModal event={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
