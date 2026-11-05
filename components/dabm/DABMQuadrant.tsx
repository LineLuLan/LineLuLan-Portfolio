'use client';

import { capitalize } from '@/lib/cn';
import { useTheme } from '@/components/providers/ThemeProvider';
import { motion } from 'framer-motion';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import type { DABMQuadrant as Q } from '@/types';

const PLANET = { D: 'earth', A: 'saturn', B: 'jupiter', M: 'neptune' } as const;

export function DABMQuadrant({ q, index }: { q: Q; index: number }) {
  const { reducedMotion } = useTheme();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0, delay: 0 } : { delay: index * 0.05, duration: 0.4 }}
      viewport={{ once: true }}
      className="min-w-0 h-full bg-panel hairline border rounded-[var(--theme-radius)] p-5"
    >
      <header className="flex flex-wrap items-center gap-2">
        <PixelPlanet kind={PLANET[q.letter]} size={20} className="shrink-0" />
        <span className="font-mono text-base text-accent">[{q.letter}]</span>
        <h3 className="font-display font-bold text-base text-ink">
          {capitalize(q.label.toLowerCase())}
        </h3>
      </header>
      <p className="mt-3 text-base text-ink leading-relaxed">{q.body}</p>
    </motion.div>
  );
}
