'use client';

import { useEffect, useRef } from 'react';
import { X, Github, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DABMTags } from './DABMTags';
import { StatusDot } from '@/components/ui/StatusDot';
import type { Project } from '@/types';

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // Hex-valued theme tokens need color-mix for alpha in Tailwind 3.
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_40%,transparent)] p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-paper hairline border rounded-[var(--theme-radius)] max-h-[85dvh] overflow-y-auto p-6 md:p-8 max-w-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 break-words">
                <h2 id="project-modal-title" className="font-sans text-3xl font-bold text-ink">
                  {project.name}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-sm">
                  <StatusDot state={project.state} />
                  {project.domains.map((d) => (
                    <span key={d} className="inline-flex min-h-9 items-center rounded-[var(--theme-control-radius)] border hairline px-3 text-ink">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[var(--theme-control-radius)] text-muted hover:text-accent"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <dl>
              {project.problem && (
                <Section title="problem">{project.problem}</Section>
              )}
              {project.dataset && <Section title="dataset">{project.dataset}</Section>}
              {project.method && <Section title="method">{project.method}</Section>}
              {project.results && <Section title="results">{project.results}</Section>}
              {project.tech && (
                <Section title="tech stack">{project.tech.join(' · ')}</Section>
              )}
              {project.role && <Section title="role">{project.role}</Section>}
              {project.collaborators && project.collaborators.length > 0 && (
                <Section title="collaborators">
                  <ul className="space-y-1">
                    {project.collaborators.map((c) => (
                      <li key={c.name}>
                        {c.name}
                        {c.role && <span className="text-muted"> — {c.role}</span>}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
              {project.why && <Section title="why">{project.why}</Section>}
            </dl>
            {project.dabm && (
              <div className="mt-6 border-t hairline pt-6">
                <p className="eyebrow mb-3">DABM →</p>
                <DABMTags mapping={project.dabm} />
              </div>
            )}

            {project.links && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline px-4 font-mono text-sm text-ink hover:border-accent hover:text-accent"
                  >
                    <Github size={16} aria-hidden /> GitHub
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline px-4 font-mono text-sm text-ink hover:border-accent hover:text-accent"
                  >
                    <ExternalLink size={16} aria-hidden /> Visit
                  </a>
                )}
                {project.links.paper && (
                  <a
                    href={project.links.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline px-4 font-mono text-sm text-ink hover:border-accent hover:text-accent"
                  >
                    <ExternalLink size={16} aria-hidden /> Paper
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t hairline pt-6">
      <dt className="eyebrow">{title}</dt>
      <dd className="mt-2 text-base text-ink [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}
