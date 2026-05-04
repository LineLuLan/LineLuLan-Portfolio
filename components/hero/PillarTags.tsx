'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

type Props = {
  pillars: string[];
  className?: string;
};

export function PillarTags({ pillars, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <ul className={cn('flex flex-wrap gap-2 font-mono text-xs', className)}>
      {pillars.map((label, i) => (
        <motion.li
          key={label}
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
          className="rounded-full border border-border-subtle bg-card px-3 py-1 text-text-secondary transition-colors hover:border-accent-pink/40 hover:text-text-primary"
        >
          {label}
        </motion.li>
      ))}
    </ul>
  );
}
