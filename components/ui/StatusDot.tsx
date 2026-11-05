import { cn } from '@/lib/cn';
import type { ProjectState } from '@/types';

const colorMap: Record<ProjectState | 'default', string> = {
  live: 'bg-success',
  wip: 'bg-accent',
  classified: 'bg-muted',
  paused: 'bg-muted',
  default: 'bg-muted',
};

const labelMap: Record<ProjectState | 'default', string> = {
  live: 'Live',
  wip: 'Modeling',
  classified: 'Classified',
  paused: 'Paused',
  default: '',
};

type Props = {
  state: ProjectState;
  label?: string;
  className?: string;
  withLabel?: boolean;
};

export function StatusDot({ state, label, className, withLabel = true }: Props) {
  const text = label ?? labelMap[state];
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-mono', className)}>
      <span
        aria-hidden
        className={cn('inline-block h-2 w-2 rounded-full', colorMap[state])}
      />
      <span className={withLabel ? 'text-muted' : 'sr-only'}>{text}</span>
    </span>
  );
}
