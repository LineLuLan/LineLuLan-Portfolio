'use client';

import { useEffect } from 'react';

const FADE_IN = 500;
const HOLD = 900;
const FADE_OUT = 600;

type Props = {
  onDismiss: () => void;
};

export function BootSplash({ onDismiss }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, FADE_IN + HOLD + FADE_OUT);
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onDismiss]);

  return (
    <div
      onClick={onDismiss}
      role="dialog"
      aria-label="Loading"
      className="boot-splash fixed inset-0 z-[100] flex items-center justify-center bg-void px-6"
    >
      <span className="boot-splash__text font-mono text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
        linelulan<span className="text-accent-pink">.</span>
      </span>
    </div>
  );
}
