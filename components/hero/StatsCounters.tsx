'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useInView } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
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
  const { reducedMotion: reduce } = useTheme();
  const [display, setDisplay] = useState(stat.value);

  useEffect(() => {
    if (!start) return;
    if (reduce !== false) {
      setDisplay(stat.value);
      return;
    }
    setDisplay(0);
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
      <span className="flex items-baseline justify-center font-sans text-[36px] font-extrabold leading-none tabular-nums text-ink lg:text-[44px]">
        <span>{format(display, stat.decimals ?? 0, stat.pad ?? 0)}</span>
        {stat.suffix && (
          <span className="text-[0.6em] text-accent">{stat.suffix}</span>
        )}
      </span>
      <span className="eyebrow text-center leading-5">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsCounters({ stats }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div
      ref={ref}
      data-reveal="stats"
      className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 border-t hairline pt-6 md:grid-cols-4 md:gap-x-6 lg:gap-x-10"
      role="list"
      aria-label="Quick stats"
    >
      {stats.map((s, index) => (
        <div key={s.label} role="listitem" data-reveal-child style={{ '--reveal-order': index } as CSSProperties}>
          {s.href ? (
            <a
              href={s.href}
              aria-label={`${s.label} ${format(s.value, s.decimals ?? 0, s.pad ?? 0)}${s.suffix?.replace('/', ' of ') ?? ''}, view ${s.href === '/transcript' ? 'transcript' : s.href === '#record' ? 'career record' : s.href === '#work' ? 'projects' : 'experience'}`}
              className="surface-card block h-full rounded-[var(--theme-radius)] hover:bg-tint-a focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Counter stat={s} start={inView} />
            </a>
          ) : <Counter stat={s} start={inView} />}
        </div>
      ))}
    </div>
  );
}
