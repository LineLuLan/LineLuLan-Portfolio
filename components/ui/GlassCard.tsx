import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Glow = 'purple' | 'magenta' | 'pink' | 'none';
type State = 'live' | 'wip' | 'classified' | 'paused' | 'default';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  glow?: Glow;
  state?: State;
  as?: 'div' | 'article' | 'section';
  interactive?: boolean;
};

const stateBorder: Record<State, string> = {
  live: 'border-border-glow',
  wip: 'border-warning/40 border-dashed',
  classified: 'border-accent-magenta/40',
  paused: 'border-text-tertiary/30',
  default: 'border-border-subtle',
};

export const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  {
    children,
    className,
    glow = 'none',
    state = 'default',
    as = 'div',
    interactive = false,
    ...rest
  },
  ref,
) {
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      className={cn(
        'card-glass relative border p-6 transition-all duration-300 ease-out',
        stateBorder[state],
        interactive &&
          'hover:-translate-y-0.5 hover:border-accent-pink/40 hover:shadow-[0_8px_32px_-12px_rgba(224,123,151,0.25)]',
        glow !== 'none' && 'hover:shadow-[0_0_32px_rgba(224,123,151,0.18)]',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});
