'use client';

import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusDot } from '@/components/ui/StatusDot';
import { DABMTags } from './DABMTags';
import type { Project } from '@/types';

type Props = {
  project: Project;
  onOpen?: (project: Project) => void;
};

export function ProjectCard({ project, onOpen }: Props) {
  return (
    <GlassCard
      state={project.state === 'paused' ? 'paused' : project.state}
      interactive
      className="flex h-full flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-sans text-base font-semibold text-text-primary">
          {project.name}
        </h3>
        <StatusDot state={project.state} withLabel={false} />
      </div>
      <p className="mt-2 text-xs text-text-secondary text-balance">{project.tagline}</p>
      {project.dabm && (
        <div className="mt-4 border-t border-border-subtle pt-3">
          <DABMTags mapping={project.dabm} size="sm" />
        </div>
      )}
      {project.tech && project.tech.length > 0 && (
        <p className="mt-3 font-mono text-[10px] text-text-tertiary">
          tech: <span className="text-text-secondary">{project.tech.join(' · ')}</span>
        </p>
      )}
      <div className="mt-auto pt-4">
        {onOpen && (
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-accent-pink hover:underline"
          >
            [ open ] <ArrowRight size={11} aria-hidden />
          </button>
        )}
      </div>
    </GlassCard>
  );
}
