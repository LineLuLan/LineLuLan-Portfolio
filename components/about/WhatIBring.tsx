'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { WhatIBringItem } from '@/types';

export function WhatIBring({ items }: { items: WhatIBringItem[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-12">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        what i bring
      </p>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.li
            key={item.title}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-40px' }}
          >
            <GlassCard interactive className="h-full p-5">
              <h3 className="font-sans text-sm font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </GlassCard>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
