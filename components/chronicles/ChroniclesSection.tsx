'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { formatChronicleDate } from '@/lib/dates';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { EventModal } from './EventModal';
import { chronicles } from '@/content/chronicles';
import { cn } from '@/lib/cn';
import type { ChronicleEvent } from '@/types';

function formatRange(e: ChronicleEvent) {
  const start = formatChronicleDate(e.date);
  if (e.ongoing) return `${start} — Present`;
  if (e.endDate) return `${start} — ${formatChronicleDate(e.endDate)}`;
  return start;
}

type BlockProps = {
  eyebrow: string;
  events: ChronicleEvent[];
  onSelect: (e: ChronicleEvent) => void;
};

function RecordBlock({ eyebrow, events, onSelect }: BlockProps) {
  if (events.length === 0) return null;
  return (
    <section className="mt-10 first:mt-0">
      <h3 className="eyebrow mb-4">
        {eyebrow}
      </h3>
      <ul>
        {events.map((e, i) => {
          const interactive = Boolean(e.description || e.link);
          const Row = interactive ? 'button' : 'div';
          return (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <Row
                {...(interactive ? { type: 'button' as const, onClick: () => onSelect(e) } : {})}
                className={cn(
                  'group grid w-full grid-cols-[140px_1fr] md:grid-cols-[160px_1fr_auto] gap-4 py-4 border-t hairline items-baseline text-left transition-colors',
                  interactive
                    ? 'cursor-pointer hover:bg-surface'
                    : 'cursor-default',
                )}
              >
                <span className="font-mono text-sm text-muted">{formatRange(e)}</span>
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  <span className="block text-base text-ink">{e.title}</span>
                  {e.org && (
                    <span className="mt-1 block font-mono text-sm text-muted">{e.org}</span>
                  )}
                </span>
                {interactive && <ArrowUpRight size={16} aria-hidden className="hidden text-muted md:block" />}
              </Row>
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
    <SectionWrapper id="record" ariaLabel="Record" withTopRule>
      <SectionHeader index={6} slug="record" title="experience." planet={SECTION_PLANET.record} />

      <RecordBlock eyebrow="organizations" events={organizations} onSelect={setOpen} />
      <RecordBlock eyebrow="education" events={education} onSelect={setOpen} />
      <RecordBlock eyebrow="achievements" events={achievements} onSelect={setOpen} />

      <EventModal event={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
