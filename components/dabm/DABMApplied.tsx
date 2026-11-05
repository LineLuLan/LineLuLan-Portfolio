'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { DABMTags } from '@/components/projects/DABMTags';
import type { Project } from '@/types';

export function DABMApplied({ project }: { project: Project }) {
  const { reducedMotion } = useTheme();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.slug}
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.3 }}
      >
        <div className="mt-6 border-t hairline pt-6">
          <DABMTags mapping={project.dabm} />
          {!project.dabm && (
            <p className="text-base text-ink">
              No DABM mapping yet — project still classified.
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
