// Intent: offer a concise project introduction with a dedicated story destination.
// Status: implemented. Next: Line's fuller case studies. Blockers: none. Confidence: existing content only.
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { ProjectTech } from './ProjectTech';
import { ProjectLinks } from './ProjectLinks';
import type { Project } from '@/types';

const tints = ['bg-tint-a', 'bg-tint-c', 'bg-tint-b'] as const;

export function ProjectSlide({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`flex h-full min-w-0 flex-col rounded-[var(--theme-radius)] border hairline p-8 ${tints[index % tints.length]}`}>
      <div className="mb-3 flex min-h-[4.5rem] items-center justify-between gap-4">
        <PixelPlanet kind={project.planet} size={72} className="shrink-0" />
        {project.lead && <span className="rounded-[var(--theme-control-radius)] bg-paper px-3 py-1 font-mono text-sm text-accent">Lead project</span>}
      </div>
      <p className="font-mono text-sm text-muted">{String(index + 1).padStart(2, '0')} · {project.role?.split(' · ')[0]}</p>
      <h3 className="mt-2 break-words font-display text-[2.25rem] font-bold leading-tight text-ink">{project.name}</h3>
      <p className="mt-2 text-lg leading-relaxed text-ink">{project.tagline}</p>
      <div className="mt-4">{project.tech && <ProjectTech tech={project.tech.slice(0, 5)} />}</div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <ProjectLinks links={project.links} />
        <Link href={`/projects/${project.slug}`} draggable={false}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] bg-accent px-4 font-mono text-sm text-on-accent hover:underline">
          Open project <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
