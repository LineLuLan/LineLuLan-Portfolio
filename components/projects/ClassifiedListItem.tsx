'use client';

import { GlitchText } from '@/components/ui/GlitchText';
import { StatusDot } from '@/components/ui/StatusDot';
import type { Project } from '@/types';

type Props = {
  index: number;
  project: Project;
};

export function ClassifiedListItem({ index, project }: Props) {
  return (
    <div className="group relative grid grid-cols-[56px_1fr_auto] items-start gap-4 border-t border-rule-subtle py-6 md:gap-6">
      <span
        aria-hidden
        className="font-mono text-3xl font-semibold leading-none text-text-tertiary/50 transition-colors group-hover:text-accent-magenta md:text-4xl"
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <GlitchText
            text={project.codename ?? '████-██'}
            className="font-sans text-lg font-semibold tracking-widest text-text-secondary md:text-xl"
          />
          <span className="inline-flex items-center rounded-sm border border-accent-magenta/40 bg-accent-magenta/5 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent-magenta">
            classified
          </span>
          <span className="font-mono text-[11px] text-text-tertiary">
            {project.domains[0]}
          </span>
          <StatusDot state="classified" withLabel={false} className="ml-auto md:ml-0" />
        </div>
        <p className="mt-2 font-mono text-xs text-text-tertiary">
          {project.tagline}
          {project.eta && <span className="ml-3">eta: {project.eta}</span>}
        </p>
      </div>

      <span className="hidden self-center font-mono text-[11px] text-text-tertiary md:inline">
        [restricted]
      </span>
    </div>
  );
}
