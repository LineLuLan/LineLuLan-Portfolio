'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHASES = [
  { text: 'LINE', duration: 1100 },
  { text: 'WELCOME', duration: 1300 },
] as const;

const SUBTITLE_AT = 2000;
const LEAVE_AT = 2600;
const TOTAL = 3300;

type Props = {
  onDismiss: () => void;
};

export function BootSplash({ onDismiss }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    let elapsed = 0;
    PHASES.slice(0, -1).forEach((phase, i) => {
      elapsed += phase.duration;
      timers.push(window.setTimeout(() => setPhaseIndex(i + 1), elapsed));
    });
    timers.push(window.setTimeout(() => setShowSubtitle(true), SUBTITLE_AT));
    timers.push(window.setTimeout(() => setLeaving(true), LEAVE_AT));
    timers.push(window.setTimeout(onDismiss, TOTAL));

    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onDismiss]);

  const current = PHASES[phaseIndex] ?? PHASES[0]!;

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          onClick={onDismiss}
          role="dialog"
          aria-label="Boot sequence"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void px-6 font-sans"
        >
          {/* Cinematic word reveal */}
          <div className="relative flex h-32 items-center justify-center md:h-40">
            <AnimatePresence mode="wait">
              <motion.h2
                key={current.text}
                initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="boot-glitch text-balance text-center font-sans text-5xl font-semibold tracking-[0.35em] md:text-7xl"
                data-text={current.text}
              >
                {current.text}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Subtitle (typewriter-ish reveal) */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={showSubtitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-10 font-mono text-[11px] uppercase tracking-[0.4em] text-text-tertiary"
          >
            {'// entering site'}
            <span
              aria-hidden
              className="ml-1 inline-block h-3 w-2 -translate-y-px bg-accent-pink align-middle"
              style={{ animation: 'blink 1s steps(2) infinite' }}
            />
          </motion.p>

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

          {/* Ambient corner brackets — cinematic frame */}
          <span aria-hidden className="pointer-events-none absolute left-6 top-6 h-6 w-6 border-l border-t border-accent-pink/30" />
          <span aria-hidden className="pointer-events-none absolute right-6 top-6 h-6 w-6 border-r border-t border-accent-pink/30" />
          <span aria-hidden className="pointer-events-none absolute left-6 bottom-6 h-6 w-6 border-l border-b border-accent-pink/30" />
          <span aria-hidden className="pointer-events-none absolute right-6 bottom-6 h-6 w-6 border-r border-b border-accent-pink/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
