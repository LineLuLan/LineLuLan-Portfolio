'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function ExploringTags({ tags }: { tags: string[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-10">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        currently exploring
      </p>
      <ul className="flex flex-wrap gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em]">
        {tags.map((tag, i) => (
          <motion.li
            key={tag}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            viewport={{ once: true }}
            className="rounded-sm border border-border-subtle px-2.5 py-1 text-text-secondary transition-colors hover:border-accent-pink hover:text-accent-pink"
          >
            {tag}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
