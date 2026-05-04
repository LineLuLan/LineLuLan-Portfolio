import { cn } from '@/lib/cn';
import type { ProjectState } from '@/types';

const colorMap: Record<ProjectState | 'default', string> = {
  live: 'bg-success',
  wip: 'bg-warning',
  classified: 'bg-accent-magenta',
  paused: 'bg-text-tertiary',
  default: 'bg-text-tertiary',
};

const labelMap: Record<ProjectState | 'default', string> = {
  live: 'live',
  wip: 'modeling',
  classified: 'classified',
  paused: 'paused',
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
    <span className={cn('inline-flex items-center gap-2 text-xs font-mono', className)}>
      <span
        aria-label={`${text} status`}
        className={cn('inline-block h-2 w-2 rounded-full dot-pulse', colorMap[state])}
      />
      {withLabel && <span className="text-text-secondary">●  {text}</span>}
    </span>
  );
}
