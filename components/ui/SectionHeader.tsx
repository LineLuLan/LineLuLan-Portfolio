import { cn } from '@/lib/cn';
import { SECTION_TOTAL } from '@/lib/constants';

type Props = {
  index: number;
  slug: string;
  title: string;
  sub?: string;
  className?: string;
};

// 2-line section header:
//   02 / 07 · about                                  (eyebrow, mono small)
//   jack of all trades.                              (display heading, sans large)
export function SectionHeader({ index, slug, title, sub, className }: Props) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <header className={cn('mb-10 md:mb-14', className)}>
      <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        <span className="h-px w-8 bg-border-subtle" aria-hidden />
        <span>
          {pad(index)} / {pad(SECTION_TOTAL)} · {slug}
        </span>
      </p>
      <h2 className="editorial-h2 mt-3">{title}</h2>
      {sub && (
        <p className="mt-2 max-w-2xl text-sm text-text-secondary text-balance">{sub}</p>
      )}
    </header>
  );
}
