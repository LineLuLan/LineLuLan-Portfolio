import { cn } from '@/lib/cn';

export function ScanlineOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 scanline-bg opacity-60 mix-blend-overlay',
        className,
      )}
    />
  );
}
