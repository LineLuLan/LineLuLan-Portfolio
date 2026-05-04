import { cn } from '@/lib/cn';
import type { DABMMapping } from '@/types';

type Props = {
  mapping?: Partial<DABMMapping>;
  size?: 'sm' | 'md';
  className?: string;
};

const LETTERS = ['D', 'A', 'B', 'M'] as const;

export function DABMTags({ mapping, size = 'md', className }: Props) {
  return (
    <ul className={cn('grid gap-1.5 font-mono', size === 'sm' ? 'text-xs' : 'text-sm', className)}>
      {LETTERS.map((letter) => {
        const text = mapping?.[letter];
        return (
          <li key={letter} className="flex items-baseline gap-2">
            <span className="text-accent-pink">[{letter}]</span>
            <span className={cn('text-text-secondary', !text && 'text-text-tertiary')}>
              {text ?? '▓▓▓▓▓▓'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
