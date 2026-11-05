'use client';

import { useEffect } from 'react';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';

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
      className="boot-splash fixed inset-0 z-[100] flex items-center justify-center bg-paper px-6"
    >
      <span className="boot-splash__text inline-flex items-baseline gap-1 font-sans text-2xl font-bold tracking-tight text-ink md:text-3xl">
        linelulan<PixelPlanet kind="saturn" size={16} />
      </span>
    </div>
  );
}
