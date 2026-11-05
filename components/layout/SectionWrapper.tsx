'use client';

import { motion } from 'framer-motion';
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
    <motion.section
      id={id}
      aria-label={ariaLabel}
      initial={id === 'hero' ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'relative scroll-mt-20 py-16 md:py-24',
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
      <div className="container-x">{children}</div>
    </motion.section>
  );
}
