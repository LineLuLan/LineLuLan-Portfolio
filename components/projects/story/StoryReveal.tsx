'use client';

// Intent: reveal story chapters while keeping text server-rendered and motion optional.
// Status: implemented. Next: fuller stories. Blockers: none. Confidence: shared motion preference.
import { motion } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';

export function StoryReveal({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useTheme();
  return (
    <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0 : 0.4 }}>
      {children}
    </motion.div>
  );
}
