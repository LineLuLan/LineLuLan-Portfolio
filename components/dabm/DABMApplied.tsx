'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
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
        <GlassCard className="p-6">
          <DABMTags mapping={project.dabm} />
          {!project.dabm && (
            <p className="font-mono text-xs text-text-tertiary">
              No DABM mapping yet — project still classified.
            </p>
          )}
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
