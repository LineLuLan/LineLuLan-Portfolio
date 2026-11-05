'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DABMTags } from '@/components/projects/DABMTags';
import type { Project } from '@/types';

export function DABMApplied({ project }: { project: Project }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={project.slug}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mt-6 border-t hairline pt-6">
          <DABMTags mapping={project.dabm} />
          {!project.dabm && (
            <p className="text-base text-muted">
              No DABM mapping yet — project still classified.
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
