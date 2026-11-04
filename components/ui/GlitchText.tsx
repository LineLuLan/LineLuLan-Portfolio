'use client';

import { cn } from '@/lib/cn';

type Props = {
  text: string;
  className?: string;
  always?: boolean; // run animation always (default: hover only)
};

export function GlitchText({ text, className, always = false }: Props) {
  return (
    <span
      className={cn(
        'inline-block font-mono text-accent-magenta gpu',
        always ? 'animate-glitch' : 'glitch-on-hover',
        className,
      )}
      aria-label={text}
    >
      {text}
    </span>
  );
}
