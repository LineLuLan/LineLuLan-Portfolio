'use client';

import { ArrowRight, ExternalLink, Star } from 'lucide-react';
import { StatusDot } from '@/components/ui/StatusDot';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import type { Project } from '@/types';

type Props = {
  index: number;
  project: Project;
  onOpen?: (project: Project) => void;
};

const YEAR_HINT: Record<string, string> = {
  'dengue-shock-prediction': '2026',
};

export function ProjectListItem({ index, project, onOpen }: Props) {
  const isFeatured = Boolean(project.featured);
  const externalHref = project.links?.demo ?? project.links?.github;
  const year = YEAR_HINT[project.slug];

  return (
    <div
      className={cn(
        'group relative grid grid-cols-[56px_1fr_auto] items-start gap-4 border-t border-rule-subtle py-6 md:gap-6',
        'transition-colors',
      )}
    >
      {/* Number column */}
      <span
        aria-hidden
        className="font-mono text-3xl font-semibold leading-none text-num-display/50 transition-colors group-hover:text-num-display md:text-4xl"
      >
        {String(index).padStart(2, '0')}
      </span>

      {/* Content column */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-sans text-lg font-semibold text-text-primary md:text-xl">
            {project.name}
          </h3>
          {isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-sm border border-accent-magenta/60 bg-accent-magenta/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-pink">
              <Star size={9} aria-hidden /> featured
            </span>
          )}
          <span className="flex items-center gap-2 font-mono text-[11px] text-text-tertiary">
            <span>{project.domains[0]}</span>
            {year && (
              <>
                <span aria-hidden>·</span>
                <span>{year}</span>
              </>
            )}
          </span>
          <StatusDot state={project.state} withLabel={false} className="ml-auto md:ml-0" />
        </div>

        <p className="mt-2 max-w-2xl text-sm text-text-secondary text-balance">
          {project.tagline}
        </p>

        {project.tech && project.tech.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 6).map((t) => (
              <li
                key={t}
                className="rounded-sm border border-border-subtle px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Action column */}
      <div className="hidden flex-col items-end gap-2 self-center font-mono text-[11px] md:flex">
        {onOpen && (
          <button
            type="button"
            onClick={() => {
              trackEvent('project_open', { slug: project.slug, index });
              onOpen(project);
            }}
            className="inline-flex items-center gap-1.5 text-text-secondary transition-colors hover:text-accent-pink"
          >
            open <ArrowRight size={11} aria-hidden />
          </button>
        )}
        {externalHref && (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('project_visit', { slug: project.slug, index })}
            className="inline-flex items-center gap-1.5 text-text-tertiary transition-colors hover:text-accent-pink"
          >
            visit <ExternalLink size={11} aria-hidden />
          </a>
        )}
      </div>

      {/* Mobile actions */}
      <div className="col-span-3 -mt-2 flex gap-3 font-mono text-[11px] md:hidden">
        {onOpen && (
          <button
            type="button"
            onClick={() => {
              trackEvent('project_open', { slug: project.slug, index });
              onOpen(project);
            }}
            className="inline-flex items-center gap-1.5 text-accent-pink"
          >
            open <ArrowRight size={11} aria-hidden />
          </button>
        )}
        {externalHref && (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-text-tertiary"
          >
            visit <ExternalLink size={11} aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
