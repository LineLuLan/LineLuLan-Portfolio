'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { StatusDot } from '@/components/ui/StatusDot';
import { trackEvent } from '@/lib/analytics';
import { capitalize, cn } from '@/lib/cn';
import type { Project } from '@/types';

type Props = {
  index: number;
  project: Project;
  onOpen?: (project: Project) => void;
};

const TINT = ['bg-tint-a', 'bg-tint-c', 'bg-tint-b'] as const;
const PLANET = ['jupiter', 'saturn', 'earth', 'neptune', 'mars'] as const;

export function ProjectListItem({ index, project, onOpen }: Props) {
  const externalHref = project.links?.demo ?? project.links?.github ?? project.links?.paper;
  const externalLabel = project.links?.demo ? 'Visit' : project.links?.github ? 'GitHub' : 'Paper';
  const role = project.role?.split(' · ')[0] || project.domains[0];
  const position = index + 1;

  return (
    <div className={cn(
      'grid items-start gap-6 rounded-[var(--theme-radius)] border hairline p-6 transition-transform md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] md:p-8 md:hover:translate-x-1',
      TINT[index % 3],
    )}>
      <div className="min-w-0">
        <p className="eyebrow">{String(position).padStart(2, '0')} · {capitalize(role ?? '')}</p>
        <div className="mt-3 flex items-start gap-3">
          <PixelPlanet kind={PLANET[index % PLANET.length] ?? 'jupiter'} size={20} className="mt-1 shrink-0" />
          <h3 className="min-w-0 break-words font-display text-2xl font-bold text-ink md:text-3xl">{project.name}</h3>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusDot state={project.state} />
          <span className="font-mono text-sm text-muted">{project.domains.map(capitalize).join(' · ')}</span>
          {project.featured && (
            <span className="inline-flex min-h-9 items-center rounded-[var(--theme-control-radius)] border hairline px-3 font-mono text-sm text-ink">Featured</span>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-base text-ink">{project.tagline}</p>
        {project.tech && project.tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.slice(0, 6).map((tech) => (
              <li key={tech} className="inline-flex min-h-9 max-w-full items-center rounded-[var(--theme-control-radius)] border hairline px-3 font-mono text-sm text-ink [overflow-wrap:anywhere]">
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end">
        {externalHref && (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('project_visit', { slug: project.slug, index: position })}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] bg-accent px-4 font-mono text-sm text-on-accent hover:bg-accent-hover"
          >
            {externalLabel} <ArrowUpRight size={16} aria-hidden />
          </a>
        )}
        {onOpen && (
          <button
            type="button"
            onClick={() => {
              trackEvent('project_open', { slug: project.slug, index: position });
              onOpen(project);
            }}
            className="inline-flex min-h-11 items-center gap-1 font-mono text-sm text-ink hover:text-accent"
          >
            Details <ArrowRight size={16} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
