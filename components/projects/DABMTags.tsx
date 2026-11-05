import { cn } from '@/lib/cn';
import type { DABMMapping } from '@/types';

type Props = {
  mapping?: Partial<DABMMapping>;
  size?: 'sm' | 'md';
  className?: string;
};

const LETTERS = ['D', 'A', 'B', 'M'] as const;

export function DABMTags({ mapping, className }: Props) {
  return (
    <dl className={cn('grid gap-3', className)}>
      {LETTERS.map((letter) => {
        const text = mapping?.[letter];
        return (
          <div key={letter} className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline gap-2">
            <dt className="font-mono text-sm text-accent">[{letter}]</dt>
            <dd className="text-base text-ink [overflow-wrap:anywhere]">
              {text ?? '▓▓▓▓▓▓'}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
