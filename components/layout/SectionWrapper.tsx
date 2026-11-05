'use client';

// Intent: expose stable, focusable section boxes for header-aware anchor navigation.
// Status: R2. Next: browser checks. Blockers: none. Confidence: shared scroll regression cases.
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';

type Props = {
  id: string;
  ariaLabel?: string;
  className?: string;
  withTopRule?: boolean;
  children: React.ReactNode;
};

export function SectionWrapper({
  id,
  ariaLabel,
  className,
  withTopRule = false,
  children,
}: Props) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      tabIndex={-1}
      className={cn(
        'relative scroll-mt-[var(--header-height)] focus:outline-none',
        id === 'hero' ? 'hero-section py-8 lg:py-6 lg:flex lg:min-h-[calc(100svh-var(--header-height))] lg:items-center' : 'py-16 md:py-24',
        withTopRule && 'border-t hairline',
        className,
      )}
      // Keep the hero server-rendered; its existing client boundary owns click tracking.
      onClick={id === 'hero' ? (event) => {
        if (event.target instanceof Element && event.target.closest('a[data-hero-cv]')) {
          trackEvent('cv_open', { from: 'hero' });
        }
      } : undefined}
    >
      <div className="container-x w-full">{children}</div>
    </section>
  );
}
