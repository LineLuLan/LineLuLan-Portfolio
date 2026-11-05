'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { FilterPills } from './FilterPills';
import { ProjectListItem } from './ProjectListItem';
import { InOrbitList } from './InOrbitList';
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
    return base.filter((p) => p.state !== 'classified')
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [filter]);

  return (
    <SectionWrapper id="work" ariaLabel="Work" withTopRule>
      <div className="mb-10 grid items-end gap-6 md:mb-14 lg:grid-cols-[1fr_minmax(0,36ch)]">
        <SectionHeader index={4} slug="work" title="selected projects." planet={SECTION_PLANET.work} className="mb-0 md:mb-0" />
        <p className="text-lg text-muted lg:text-right">
          Real things I&apos;ve shipped, from clinical ML research to production LLM systems.
        </p>
      </div>

      <div className="mb-6">
        <FilterPills active={filter} onChange={setFilter} />
      </div>

      <motion.ol layout className="grid list-none gap-4">
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
              <ProjectListItem index={i} project={p} onOpen={setOpen} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>
      <InOrbitList projects={projects.filter((p) => p.state === 'classified')} />

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
