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
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur p-4"
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
            className="card-glass w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-border-glow p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="project-modal-title" className="font-mono text-2xl text-text-primary">
                  {project.name}
                </h2>
                <div className="mt-2 flex items-center gap-3 font-mono text-xs">
                  <StatusDot state={project.state} />
                  {project.domains.map((d) => (
                    <span key={d} className="rounded-sm border border-border-subtle px-2 py-0.5 text-text-tertiary">
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
                className="rounded p-1 text-text-secondary hover:text-accent-pink"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

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
                      {c.role && <span className="text-text-tertiary"> — {c.role}</span>}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {project.dabm && (
              <div className="mt-6 border-t border-border-subtle pt-6">
                <p className="mb-3 font-mono text-xs text-accent-pink">DABM →</p>
                <DABMTags mapping={project.dabm} />
              </div>
            )}
            {project.why && (
              <p className="mt-6 italic text-text-secondary text-balance">“{project.why}”</p>
            )}

            {project.links && (
              <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm border border-border-subtle px-3 py-1.5 text-text-secondary hover:border-accent-pink hover:text-accent-pink"
                  >
                    <Github size={12} aria-hidden /> github
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm border border-border-subtle px-3 py-1.5 text-text-secondary hover:border-accent-pink hover:text-accent-pink"
                  >
                    <ExternalLink size={12} aria-hidden /> live demo
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
    <div className="mt-6">
      <h3 className="font-mono text-xs uppercase tracking-widest text-accent-pink">{title}</h3>
      <div className="mt-2 text-sm text-text-secondary">{children}</div>
    </div>
  );
}
