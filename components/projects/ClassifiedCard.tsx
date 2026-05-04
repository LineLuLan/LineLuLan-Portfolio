'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { GlitchText } from '@/components/ui/GlitchText';
import { StatusDot } from '@/components/ui/StatusDot';
import type { Project } from '@/types';

export function ClassifiedCard({ project }: { project: Project }) {
  return (
    <GlassCard state="classified" interactive className="relative h-full overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          slot · {project.slug}
        </span>
        <StatusDot state="classified" />
      </div>
      <div className="my-6 flex items-center justify-center">
        <GlitchText
          text={project.codename ?? '████-██'}
          className="text-lg tracking-widest"
        />
      </div>
      <div className="mt-auto space-y-1 border-t border-border-subtle pt-3 text-center font-mono text-[10px]">
        <p className="text-text-tertiary">{project.tagline}</p>
        {project.eta && <p className="text-text-tertiary">eta: {project.eta}</p>}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(199,21,133,0.04)_8px,rgba(199,21,133,0.04)_10px)]"
      />
    </GlassCard>
  );
}
