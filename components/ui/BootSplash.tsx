'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FADE_IN = 500;
const HOLD = 900;
const FADE_OUT = 600;

type Props = {
  onDismiss: () => void;
};

export function BootSplash({ onDismiss }: Props) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), FADE_IN + HOLD);
    const t2 = window.setTimeout(onDismiss, FADE_IN + HOLD + FADE_OUT);

    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT / 1000, ease: 'easeOut' }}
          onClick={onDismiss}
          role="dialog"
          aria-label="Loading"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void px-6"
        >
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: FADE_IN / 1000, ease: 'easeOut' }}
            className="font-mono text-2xl font-medium tracking-tight text-text-primary md:text-3xl"
          >
            linelulan<span className="text-accent-pink">.</span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
