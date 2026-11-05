'use client';

// Intent: keep project summaries compact while preserving details and outbound actions.
// Status: implemented. Next: viewport probe. Blockers: browser unavailable. Confidence: existing modal contract.
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
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
      'flex h-full min-w-0 flex-col rounded-[var(--theme-radius)] border hairline p-4',
      TINT[index % 3],
    )}>
      <div className="min-w-0">
        <p className="eyebrow">{String(position).padStart(2, '0')} · {capitalize(role ?? '')}</p>
        <div className="mt-2 flex items-start gap-2">
          <PixelPlanet kind={PLANET[index % PLANET.length] ?? 'jupiter'} size={20} className="mt-1 shrink-0" />
          <h3 className="min-w-0 break-words font-display text-[22px] font-bold leading-7 text-ink">{project.name}</h3>
        </div>
      </div>
      <div className="mt-2 min-w-0">
        <p className="line-clamp-2 text-[15px] leading-6 text-ink">{project.tagline}</p>
        {project.tech && project.tech.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <li key={tech} className="inline-flex min-h-6 max-w-full items-center rounded-[var(--theme-control-radius)] border hairline px-2 font-mono text-[13px] leading-5 text-ink [overflow-wrap:anywhere]">
                {tech}
              </li>
            ))}
            {project.tech.length > 4 && <li className="inline-flex min-h-6 items-center font-mono text-[13px] text-muted">+{project.tech.length - 4}</li>}
          </ul>
        )}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
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
