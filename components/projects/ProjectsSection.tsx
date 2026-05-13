'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterPills } from './FilterPills';
import { ProjectListItem } from './ProjectListItem';
import { ClassifiedListItem } from './ClassifiedListItem';
import { ProjectModal } from './ProjectModal';
import { projects, type ProjectFilter } from '@/content/projects';
import type { Project } from '@/types';

export function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [open, setOpen] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const base =
      filter === 'all'
        ? projects
        : projects.filter((p) =>
            p.domains.includes(filter as Project['domains'][number]),
          );
    // Featured first, then preserve source order.
    return [...base].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [filter]);

  return (
    <SectionWrapper id="work" ariaLabel="Work" width="lg" withTopRule>
      <SectionHeader index={4} slug="work" title="selected projects." />

      <div className="mb-6">
        <FilterPills active={filter} onChange={setFilter} />
      </div>

      <motion.ol layout className="list-none border-b border-rule-subtle">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="list-none"
            >
              {p.state === 'classified' ? (
                <ClassifiedListItem index={i + 1} project={p} />
              ) : (
                <ProjectListItem index={i + 1} project={p} onOpen={setOpen} />
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
