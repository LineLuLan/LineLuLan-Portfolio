'use client';

// Intent: offer a concise project introduction with server-fetched adoption on the existing metadata row.
// Status: implemented. Next: Line's fuller case studies. Blockers: none. Confidence: typed optional counts.
import Link from 'next/link';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { ProjectTech } from './ProjectTech';
import { ProjectLinks } from './ProjectLinks';
import { ProjectSurface } from './ProjectSurface';
import { useTheme } from '@/components/providers/ThemeProvider';
import type { Project } from '@/types';

const tints = ['bg-tint-a', 'bg-tint-c', 'bg-tint-b'] as const;

export function ProjectSlide({ project, hfDownloads, index, active, dragX }: { project: Project; hfDownloads?: number | null; index: number; active: boolean; dragX: MotionValue<number> }) {
  const { reducedMotion } = useTheme();
  const textX = useTransform(dragX, (value) => Math.max(-24, Math.min(24, value)));
  const planetX = useTransform(textX, (value) => value * 1.6);
  const parallax = active && !reducedMotion;
  return (
    <ProjectSurface active={active} className={`surface-card project-card flex h-full min-w-0 flex-col rounded-[var(--theme-radius)] border hairline p-5 sm:p-8 ${tints[index % tints.length]}`}>
      <div className="mb-3 flex min-h-[4.5rem] items-center justify-between gap-4">
        <motion.span className="project-parallax-planet inline-flex" style={{ x: parallax ? planetX : 0 }}><span className="card-planet"><PixelPlanet kind={project.planet} size={72} /></span></motion.span>
        {project.lead && <span className="rounded-[var(--theme-control-radius)] bg-paper px-3 py-1 font-mono text-sm text-accent">Featured project</span>}
      </div>
      <motion.div className="project-parallax-text" style={{ x: parallax ? textX : 0 }}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm text-muted">
        <span>{String(index + 1).padStart(2, '0')} · {project.role?.split(' · ')[0]}</span>
        {hfDownloads != null && <span className="whitespace-nowrap rounded-[var(--theme-control-radius)] bg-paper px-2 text-accent">{hfDownloads.toLocaleString('en-US')} HF downloads</span>}
      </p>
      <h3 className="mt-2 break-words font-display text-[2.25rem] font-bold leading-tight text-ink">{project.name}</h3>
      <p className="mt-2 text-lg leading-relaxed text-ink">{project.tagline}</p>
      <div className="mt-4">{project.tech && <ProjectTech tech={project.tech.slice(0, 5)} />}</div>
      </motion.div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <ProjectLinks links={project.links} />
        <Link href={`/projects/${project.slug}`} draggable={false}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] bg-accent px-4 font-mono text-sm text-on-accent hover:underline">
          Open project <ArrowRight size={16} aria-hidden="true" className="action-arrow" />
        </Link>
      </div>
    </ProjectSurface>
  );
}
