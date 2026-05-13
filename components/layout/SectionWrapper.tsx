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
  withTopRule?: boolean;
  children: React.ReactNode;
};

export function SectionWrapper({
  id,
  ariaLabel,
  className,
  width = 'md',
  withTopRule = false,
  children,
}: Props) {
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
        'relative scroll-mt-20 px-5 py-16 md:px-6 md:py-24',
        'mx-auto',
        widthClass[width],
        className,
      )}
    >
      {withTopRule && (
        <hr aria-hidden className="section-rule absolute inset-x-5 top-0 md:inset-x-6" />
      )}
      {children}
    </motion.section>
  );
}
