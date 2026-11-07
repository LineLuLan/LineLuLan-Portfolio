// Intent: give Line's projects permanent stories with server-cached model adoption near their links.
// Status: implemented. Next: Line's fuller case studies. Blockers: none. Confidence: typed content and HF failure tests.
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeDock } from '@/components/ThemeDock';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { ProjectLinks } from '@/components/projects/ProjectLinks';
import { ProjectTech } from '@/components/projects/ProjectTech';
import { StoryReveal } from '@/components/projects/story/StoryReveal';
import PhotoGallery from '@/components/experience/Lightbox';
import { projects } from '@/content/projects';
import { dabmSteps } from '@/content/dabm';
import { SiteIcon } from '@/components/ui/SiteIcon';
import { getHfStats } from '@/lib/hf-stats';

type Props = { params: { slug: string } };
const chapters = [
  ['problem', 'The problem'], ['dataset', 'The data'], ['method', 'The approach'],
  ['results', 'The results'], ['why', 'Why it matters'],
] as const;
const statuses = { live: 'Live', wip: 'In progress', paused: 'Paused', classified: 'Classified' };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find(({ slug }) => slug === params.slug);
  if (!project) notFound();
  return { title: project.name, description: project.tagline };
}

export default async function ProjectPage({ params }: Props) {
  const project = projects.find(({ slug }) => slug === params.slug);
  if (!project) notFound();
  const hfStats = project.hfModels ? await getHfStats(project.hfModels) : null;
  const modelHref = project.links?.model;
  // Unlisted work has a direct URL but is never advertised by the public project sequence.
  const listed = projects.filter((item) => item.listed !== false);
  const index = listed.findIndex(({ slug }) => slug === project.slug);
  const previous = listed[(index - 1 + listed.length) % listed.length];
  const next = listed[(index + 1) % listed.length];

  return (
    <div className="relative min-h-screen">
      <Header />
      <main id="hero" tabIndex={-1} className="container-x pb-16 pt-8 focus:outline-none">
        <Link href="/#work" className="inline-flex min-h-11 items-center font-mono text-sm text-accent hover:underline">← All projects</Link>
        <header className="mt-8 border-b hairline pb-10">
          <PixelPlanet kind={project.planet} size={96} />
          <h1 className="mt-6 break-words font-display text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-tight text-ink">{project.name}</h1>
          <p className="mt-4 max-w-[68ch] text-xl leading-relaxed text-ink">{project.tagline}</p>
          <p className="my-6 max-w-[68ch] font-mono text-sm leading-relaxed text-muted">{project.role} · {project.year} · {statuses[project.state]}</p>
          <ProjectLinks links={project.links} />
          {hfStats && modelHref && (
            <div className="mt-4 font-mono text-sm">
              <a href={modelHref} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-accent hover:underline">
                <SiteIcon href={modelHref} />
                <span>{hfStats.total.toLocaleString('en-US')} downloads on Hugging Face · {hfStats.likes.toLocaleString('en-US')} likes</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <p className="text-muted">{hfStats.models.map((model) => `${model.name} ${model.allTime.toLocaleString('en-US')}`).join(' · ')}</p>
            </div>
          )}
        </header>
        {/* Intent: show project covers and bounded screenshot previews. Status: implemented. Next: none. Blockers: none. Confidence: shared gallery. */}
        {project.image && (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-[var(--theme-radius)] border hairline bg-panel">
            <Image src={project.image} alt={`${project.name} overview`} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover object-top" />
          </div>
        )}
        {project.slug === 'panic-hub' && (
          <div className="mt-10 aspect-video overflow-hidden rounded-[var(--theme-radius)] border hairline bg-panel">
            <iframe src="https://www.youtube-nocookie.com/embed/Vw9_MV7uf-c" title="Panic Hub project demonstration" loading="lazy"
              allow="encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="h-full w-full border-0" />
          </div>
        )}
        <div className="mt-12 space-y-12">
          {chapters.map(([field, title], chapterIndex) => project[field] && (
            <StoryReveal key={field}>
              <section aria-labelledby={`chapter-${field}`} className="max-w-[68ch]">
                <p className="eyebrow text-muted">{String(chapterIndex + 1).padStart(2, '0')} · {title}</p>
                <h2 id={`chapter-${field}`} className="mt-3 font-display text-3xl font-bold text-ink">{title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink [overflow-wrap:anywhere]">{project[field]}</p>
              </section>
            </StoryReveal>
          ))}
        </div>
        {!!project.gallery?.length && (
          <StoryReveal>
            <section className="mt-12" aria-labelledby="chapter-screenshots">
              <h2 id="chapter-screenshots" className="mt-3 font-display text-3xl font-bold text-ink">Screenshots</h2>
              <PhotoGallery photos={project.gallery} title={`${project.name} screenshots`} cropThumbnails />
            </section>
          </StoryReveal>
        )}
        {project.dabm && (
          <section className="mt-14 border-t hairline pt-10" aria-labelledby="project-dabm">
            <h2 id="project-dabm" className="font-display text-3xl font-bold text-ink">Through the DABM lens</h2>
            <dl className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {dabmSteps.map((step) => (
                <div key={step.letter} className="min-w-0 rounded-[var(--theme-radius)] border hairline bg-panel p-5">
                  <dt className="font-display text-lg font-bold text-ink"><span className="mr-2 font-mono text-accent">{step.letter}</span>{step.label}</dt>
                  <dd className="mt-3 text-base leading-relaxed text-ink">{project.dabm?.[step.letter]}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        {project.tech && (
          <section className="mt-12" aria-labelledby="project-stack">
            <h2 id="project-stack" className="mb-5 font-display text-2xl font-bold text-ink">Stack</h2>
            <ProjectTech tech={project.tech} />
          </section>
        )}
        {!!project.collaborators?.length && (
          <section className="mt-12 max-w-[68ch]" aria-labelledby="project-collaborators">
            <h2 id="project-collaborators" className="font-display text-2xl font-bold text-ink">Collaborators</h2>
            <ul className="mt-5 space-y-3 text-base text-ink">
              {project.collaborators.map((person) => <li key={person.name}>{person.name}{person.role && <span className="text-muted"> · {person.role}</span>}</li>)}
            </ul>
          </section>
        )}
        <p className="mt-14 text-base text-muted">A fuller case study for this project is coming soon.</p>
        <nav aria-label="More projects" className="mt-8 flex flex-wrap justify-between gap-6 border-t hairline pt-6">
          {previous && <Link href={`/projects/${previous.slug}`} className="inline-flex min-h-11 flex-col justify-center text-ink hover:text-accent"><span className="font-mono text-sm text-muted">← Previous project</span><span className="mt-1 font-display text-xl">{previous.name}</span></Link>}
          {next && <Link href={`/projects/${next.slug}`} className="inline-flex min-h-11 flex-col justify-center text-right text-ink hover:text-accent"><span className="font-mono text-sm text-muted">Next project →</span><span className="mt-1 font-display text-xl">{next.name}</span></Link>}
        </nav>
      </main>
      <Footer />
      <ThemeDock />
    </div>
  );
}
