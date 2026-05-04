import { cn } from '@/lib/cn';

type Props = {
  intensity?: 'light' | 'heavy';
  className?: string;
};

export function GrainOverlay({ intensity = 'light', className }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 grain-bg mix-blend-overlay',
        intensity === 'light' ? 'opacity-[0.03]' : 'opacity-[0.06]',
        className,
      )}
    />
  );
}
