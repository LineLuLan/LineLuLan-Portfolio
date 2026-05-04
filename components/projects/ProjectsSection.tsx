'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FilterPills } from './FilterPills';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { ProjectCard } from './ProjectCard';
import { ClassifiedCard } from './ClassifiedCard';
import { ProjectModal } from './ProjectModal';
import { projects, type ProjectFilter } from '@/content/projects';
import type { Project } from '@/types';

export function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [open, setOpen] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) =>
      p.domains.includes(filter as Project['domains'][number]),
    );
  }, [filter]);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <SectionWrapper id="projects" ariaLabel="Projects" width="lg">
      <SectionHeader index="03 / 06" path="~/sys/deployments" caption="deployments" />
      <div className="mb-6">
        <FilterPills active={filter} onChange={setFilter} />
      </div>

      <AnimatePresence mode="popLayout">
        {featured && (
          <motion.div
            key={`featured-${featured.slug}`}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <FeaturedProjectCard project={featured} onOpen={setOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {rest.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              {p.state === 'classified' ? (
                <ClassifiedCard project={p} />
              ) : (
                <ProjectCard project={p} onOpen={setOpen} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
