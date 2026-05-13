'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = [
  { upTo: 25, text: 'INITIALIZING KERNEL' },
  { upTo: 55, text: 'LOADING WHOAMI' },
  { upTo: 85, text: 'RESOLVING ROUTES' },
  { upTo: 100, text: 'LINKING CONSTELLATION' },
];

const DURATION = 2400;
const HOLD = 350;
const FADE = 500;

type Props = {
  onDismiss: () => void;
};

export function BootSplash({ onDismiss }: Props) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    let holdTimer = 0;
    let dismissTimer = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        holdTimer = window.setTimeout(() => setLeaving(true), HOLD);
        dismissTimer = window.setTimeout(onDismiss, HOLD + FADE);
      }
    };
    raf = requestAnimationFrame(tick);

    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      window.clearTimeout(dismissTimer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onDismiss]);

  const status =
    STATUSES.find((s) => pct <= s.upTo) ?? STATUSES[STATUSES.length - 1]!;

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onClick={onDismiss}
          role="dialog"
          aria-label="Boot sequence"
          className="boot-grid fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void px-6"
        >
          {/* Logo box with halo glow */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute inset-0 -m-16 rounded-full blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(224,123,151,0.35), rgba(199,21,133,0.1) 45%, transparent 70%)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative flex h-32 w-32 items-center justify-center border border-accent-pink/40 bg-midnight md:h-40 md:w-40"
            >
              <span
                className="font-mono text-3xl font-semibold tracking-[0.18em] text-accent-pink md:text-4xl"
                style={{ textShadow: '0 0 12px rgba(224,123,151,0.55)' }}
              >
                LINE
              </span>
              <span
                aria-hidden
                className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 bg-accent-pink"
              />
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="mt-10 h-px w-80 bg-rule-subtle md:w-96">
            <div
              className="h-px bg-accent-pink"
              style={{
                width: `${pct}%`,
                boxShadow: '0 0 8px rgba(224,123,151,0.7)',
                transition: 'width 80ms linear',
              }}
            />
          </div>

          {/* Status row */}
          <div className="mt-4 flex w-80 items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-text-tertiary md:w-96">
            <span className="text-accent-pink">
              {String(pct).padStart(3, '0')}%
            </span>
            <span>
              &gt; {status.text}
              <span
                aria-hidden
                className="ml-1 inline-block h-3 w-1.5 -translate-y-px bg-accent-pink align-middle"
                style={{ animation: 'blink 1s steps(2) infinite' }}
              />
            </span>
          </div>

          {/* Skip hint */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary transition-colors hover:text-accent-pink"
          >
            [ESC] skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
