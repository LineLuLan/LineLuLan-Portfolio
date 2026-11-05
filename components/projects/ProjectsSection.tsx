'use client';

// Intent: present Line's five projects and classified summary in one desktop screen.
// Status: implemented. Next: viewport probe. Blockers: browser unavailable. Confidence: typed filters and content budget.
import { useMemo, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
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
  const { reducedMotion } = useTheme();
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
      <div className="mb-6 grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,36ch)]">
        <SectionHeader index={4} slug="work" title="Selected projects." planet={SECTION_PLANET.work} className="mb-0 md:mb-0" />
        <p className="text-lg text-ink lg:text-right">
          Real things I&apos;ve shipped, from clinical ML research to production LLM systems.
        </p>
      </div>

      <div className="mb-4">
        <FilterPills active={filter} onChange={setFilter} />
      </div>

      <motion.ol layout={!reducedMotion} className="grid list-none gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.li
              key={p.slug}
              layout={!reducedMotion}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.25, delay: i * 0.05 }}
              className="min-w-0 list-none"
            >
              <ProjectListItem index={i} project={p} onOpen={setOpen} />
            </motion.li>
          ))}
          {filter === 'all' && (
            <motion.li key="in-orbit" layout={!reducedMotion} initial={false} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }} className="min-w-0 list-none">
              <InOrbitList projects={projects.filter((p) => p.state === 'classified')} />
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ol>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
