'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { ProfileStat } from '@/types';

type Props = {
  stats: ProfileStat[];
};

const DURATION = 1200; // ms

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function format(value: number, decimals = 0, pad = 0) {
  if (decimals > 0) return value.toFixed(decimals);
  const s = Math.round(value).toString();
  return pad > 0 ? s.padStart(pad, '0') : s;
}

function Counter({ stat, start }: { stat: ProfileStat; start: boolean }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? stat.value : 0);

  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setDisplay(stat.value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      const p = Math.min(1, elapsed / DURATION);
      setDisplay(stat.value * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, reduce, stat.value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-sans text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
        {format(display, stat.decimals ?? 0, stat.pad ?? 0)}
        {stat.suffix && (
          <span className="text-accent-pink">{stat.suffix}</span>
        )}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsCounters({ stats }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const start = inView || Boolean(reduce);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={start ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 border-t border-rule-subtle pt-8 md:grid-cols-4 md:gap-x-10"
      role="list"
      aria-label="Quick stats"
    >
      {stats.map((s) => (
        <div key={s.label} role="listitem">
          <Counter stat={s} start={start} />
        </div>
      ))}
    </motion.div>
  );
}
