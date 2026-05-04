'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { DABMQuadrant as Q } from '@/types';

export function DABMQuadrant({ q, index }: { q: Q; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      viewport={{ once: true }}
      className="card-glass glow-hover h-full border border-border-subtle p-5"
    >
      <header className="flex items-baseline gap-2.5 border-b border-border-subtle pb-2.5">
        <span className="font-mono text-base text-accent-pink">[{q.letter}]</span>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-accent-purple">
          {q.label}
        </h3>
      </header>
      <p className="mt-3 text-xs leading-relaxed text-text-secondary text-balance">{q.body}</p>
    </motion.div>
  );
}
