'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EventModal } from './EventModal';
import { chronicles } from '@/content/chronicles';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import type { ChronicleEvent, ChronicleType } from '@/types';

const ICON: Record<ChronicleType, string> = {
  education: '●',
  role: '◆',
  award: '★',
  event: '▲',
  project: '✦',
};

const COLOR: Record<ChronicleType, string> = {
  education: 'text-text-tertiary',
  role: 'text-accent-purple',
  award: 'text-accent-pink',
  event: 'text-accent-magenta',
  project: 'text-accent-pink',
};

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseISO(s: string) {
  const [y, m, d] = s.split('-').map((v) => Number(v));
  return { y, mIdx: (m ?? 1) - 1, d: d ?? 1 };
}

function formatRange(e: ChronicleEvent) {
  const a = parseISO(e.date);
  const start = `${MONTH[a.mIdx]} ${a.y}`;
  if (e.ongoing) return `${start} — Present`;
  if (e.endDate) {
    const b = parseISO(e.endDate);
    return `${start} — ${MONTH[b.mIdx]} ${b.y}`;
  }
  return `${MONTH[a.mIdx]} ${String(a.d).padStart(2, '0')}, ${a.y}`;
}

type BlockProps = {
  eyebrow: string;
  events: ChronicleEvent[];
  onSelect: (e: ChronicleEvent) => void;
};

function RecordBlock({ eyebrow, events, onSelect }: BlockProps) {
  const reduce = useReducedMotion();
  if (events.length === 0) return null;
  return (
    <section className="mt-10 first:mt-0">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        {eyebrow}
      </p>
      <ul className="divide-y divide-rule-subtle border-t border-rule-subtle">
        {events.map((e, i) => {
          const interactive = Boolean(e.description || e.link);
          return (
            <motion.li
              key={e.id}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <button
                type="button"
                onClick={() => interactive && onSelect(e)}
                aria-label={`${e.title} on ${e.date}`}
                disabled={!interactive}
                className={cn(
                  'group grid w-full grid-cols-[18px_1fr_auto] items-baseline gap-4 px-1 py-3 text-left transition-colors',
                  interactive
                    ? 'cursor-pointer hover:bg-accent-pink/[0.03]'
                    : 'cursor-default',
                )}
              >
                <span
                  aria-hidden
                  className={cn('inline-block leading-none', COLOR[e.type])}
                >
                  {ICON[e.type]}
                </span>
                <span className="min-w-0">
                  <span className="text-sm text-text-primary transition-colors group-hover:text-accent-pink">
                    {e.title}
                  </span>
                  {e.org && (
                    <span className="ml-2 font-mono text-[11px] text-text-tertiary">
                      · {e.org}
                    </span>
                  )}
                  {e.description && (
                    <p className="mt-0.5 hidden text-xs text-text-secondary md:block">
                      {e.description}
                    </p>
                  )}
                </span>
                <span
                  className="font-mono text-[11px] text-text-tertiary"
                  suppressHydrationWarning
                >
                  {formatRange(e)}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

export function ChroniclesSection() {
  const [open, setOpen] = useState<ChronicleEvent | null>(null);

  const { organizations, education, achievements } = useMemo(() => {
    const byDateDesc = [...chronicles].sort((a, b) => b.date.localeCompare(a.date));
    return {
      organizations: byDateDesc.filter((e) => e.type === 'role'),
      education: byDateDesc.filter((e) => e.type === 'education'),
      achievements: byDateDesc.filter((e) =>
        e.type === 'award' || e.type === 'event' || e.type === 'project',
      ),
    };
  }, []);

  return (
    <SectionWrapper id="record" ariaLabel="Record" width="lg" withTopRule>
      <SectionHeader index={6} slug="record" title="experience." />

      <RecordBlock eyebrow="organizations" events={organizations} onSelect={setOpen} />
      <RecordBlock eyebrow="education" events={education} onSelect={setOpen} />
      <RecordBlock eyebrow="achievements" events={achievements} onSelect={setOpen} />

      <EventModal event={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
