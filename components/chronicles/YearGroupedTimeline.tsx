'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { ChronicleEvent, ChronicleType } from '@/types';
import { cn } from '@/lib/cn';

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

type Props = {
  events: ChronicleEvent[];
  onSelect?: (e: ChronicleEvent) => void;
};

export function YearGroupedTimeline({ events, onSelect }: Props) {
  const reduce = useReducedMotion();

  const grouped = useMemo(() => {
    const map = new Map<number, ChronicleEvent[]>();
    [...events]
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((e) => {
        const y = new Date(e.date).getFullYear();
        const arr = map.get(y) ?? [];
        arr.push(e);
        map.set(y, arr);
      });
    return Array.from(map.entries());
  }, [events]);

  return (
    <ol className="relative ml-[1px]">
      <span aria-hidden className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-accent-pink/30 via-accent-magenta/20 to-transparent" />
      {grouped.map(([year, items], gi) => (
        <li key={year} className="relative mb-8 pl-8">
          <header className="mb-3 flex items-baseline gap-3">
            <span aria-hidden className="absolute left-0 top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-accent-pink/40 bg-void">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-pink" />
            </span>
            <h3 className="font-mono text-base text-text-primary">{year}</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              {items.length} event{items.length > 1 ? 's' : ''}
            </span>
          </header>
          <ul className="space-y-2">
            {items.map((e, i) => {
              const d = new Date(e.date);
              const monthLabel = `${MONTH[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
              const interactive = Boolean(e.description || e.link);
              return (
                <motion.li
                  key={e.id}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: gi * 0.04 + i * 0.03 }}
                  viewport={{ once: true }}
                >
                  <button
                    type="button"
                    onClick={() => interactive && onSelect?.(e)}
                    aria-label={`${e.title} on ${e.date}`}
                    className={cn(
                      'group grid w-full grid-cols-[18px_64px_1fr] items-start gap-3 rounded-sm px-2 py-1.5 text-left transition-colors',
                      interactive ? 'hover:bg-accent-pink/[0.04]' : 'cursor-default',
                    )}
                  >
                    <span aria-hidden className={cn('mt-0.5 inline-block leading-none', COLOR[e.type])}>
                      {ICON[e.type]}
                    </span>
                    <span className="mt-0.5 font-mono text-[11px] text-text-tertiary">{monthLabel}</span>
                    <span>
                      <span className="text-sm text-text-primary group-hover:text-accent-pink transition-colors">
                        {e.title}
                      </span>
                      {e.org && (
                        <span className="ml-2 font-mono text-[11px] text-text-tertiary">· {e.org}</span>
                      )}
                      {e.description && (
                        <p className="mt-0.5 hidden text-xs text-text-secondary md:block">{e.description}</p>
                      )}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}
