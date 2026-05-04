'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

type Width = 'sm' | 'md' | 'lg';

const widthClass: Record<Width, string> = {
  sm: 'max-w-2xl', // ~672px
  md: 'max-w-4xl', // ~896px
  lg: 'max-w-5xl', // ~1024px
};

type Props = {
  id: string;
  ariaLabel?: string;
  className?: string;
  width?: Width;
  children: React.ReactNode;
};

export function SectionWrapper({ id, ariaLabel, className, width = 'md', children }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      aria-label={ariaLabel}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
      className={cn(
        'relative scroll-mt-20 px-5 py-14 md:px-6 md:py-20',
        'mx-auto',
        widthClass[width],
        className,
      )}
    >
      {children}
    </motion.section>
  );
}
