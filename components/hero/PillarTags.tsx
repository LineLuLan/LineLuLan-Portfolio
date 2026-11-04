'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  pillars: string[];
  className?: string;
};

export function PillarTags({ pillars, className }: Props) {
  return (
    <ul className={cn('flex flex-wrap gap-2 font-mono text-xs', className)}>
      {pillars.map((label, i) => (
        <li
          key={label}
          style={{ '--reveal-delay': `${500 + i * 80}ms` } as CSSProperties}
          className="reveal-up rounded-full border border-border-subtle bg-card px-3 py-1 text-text-secondary transition-colors hover:border-accent-pink/40 hover:text-text-primary"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}
