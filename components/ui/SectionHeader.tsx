import { cn } from '@/lib/cn';

type Props = {
  index: string;
  path: string;
  caption?: string;
  className?: string;
};

// Replaces noisy `$ cd ~/sys/...` prompt with a quieter brand strip:
//   01 / 06   ~/sys/stack                                      stack
// The terminal flavor stays via the path + monospace, but without the redundant $ blink.
export function SectionHeader({ index, path, caption, className }: Props) {
  return (
    <header
      className={cn(
        'mb-7 flex items-baseline justify-between gap-4 border-b border-border-subtle pb-3 font-mono',
        className,
      )}
    >
      <div className="flex items-baseline gap-3 text-xs">
        <span className="text-text-tertiary">{index}</span>
        <span className="text-accent-pink">{path}</span>
      </div>
      {caption && (
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          {caption}
        </span>
      )}
    </header>
  );
}
