'use client';

import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

type Props = {
  text: string;
  className?: string;
  always?: boolean; // run animation always (default: hover only)
};

export function GlitchText({ text, className, always = false }: Props) {
  const reduce = useReducedMotion();
  return (
    <span
      className={cn(
        'inline-block font-mono text-accent-magenta gpu',
        !reduce && (always ? 'animate-glitch' : 'glitch-on-hover'),
        className,
      )}
      aria-label={text}
    >
      {text}
    </span>
  );
}
