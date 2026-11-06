'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ReadingProgress() {
  const { reducedMotion } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <motion.div aria-hidden="true" className="reading-progress"
      style={{ scaleX: reducedMotion ? scrollYProgress : progress }} />
  );
}
