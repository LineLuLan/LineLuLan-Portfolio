'use client';

import { ArrowRight, Mail, Star } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusDot } from '@/components/ui/StatusDot';
import { DABMTags } from './DABMTags';
import type { Project } from '@/types';

type Props = {
  project: Project;
  onOpen?: (project: Project) => void;
};

export function FeaturedProjectCard({ project, onOpen }: Props) {
  const advisor = project.collaborators?.find((c) => c.role?.includes('advisor'));
  return (
    <GlassCard
      state="wip"
      className="relative overflow-hidden border-l-2 border-l-accent-magenta p-5 md:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent-magenta">
          <Star size={10} aria-hidden /> featured · {project.domains[0]}
        </span>
        <StatusDot state={project.state} label="modeling" />
      </div>

      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr] md:gap-8">
        <div>
          <h3 className="font-sans text-xl font-semibold text-text-primary">
            {project.name}
          </h3>
          <p className="mt-2 text-sm text-text-secondary text-balance">
            {project.problem ?? project.tagline}
          </p>

          {project.dabm && (
            <div className="mt-5 border-t border-border-subtle pt-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent-pink">
                DABM →
              </p>
              <DABMTags mapping={project.dabm} size="sm" />
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
            {onOpen && (
              <button
                type="button"
                onClick={() => onOpen(project)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-accent-pink/70 bg-accent-pink/10 px-3 py-1.5 text-accent-pink transition-colors hover:bg-accent-pink hover:text-void"
              >
                read more <ArrowRight size={12} aria-hidden />
              </button>
            )}
            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border-subtle px-3 py-1.5 text-text-secondary transition-colors hover:border-accent-pink hover:text-accent-pink"
            >
              <Mail size={12} aria-hidden /> contact for details
            </Link>
          </div>
        </div>

        <dl className="grid gap-1.5 self-start font-mono text-xs">
          {project.collaborators?.[0] && (
            <Row k="collab" v={project.collaborators[0].name} />
          )}
          {project.role && <Row k="role" v={project.role} />}
          {advisor && <Row k="advisor" v={advisor.name} />}
          {project.dataset && <Row k="dataset" v={project.dataset} />}
          {project.results && <Row k="status" v={project.results} />}
        </dl>
      </div>
    </GlassCard>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-2 leading-snug">
      <dt className="text-text-tertiary">{k}</dt>
      <dd className="text-text-secondary">{v}</dd>
    </div>
  );
}
