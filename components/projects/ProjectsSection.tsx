// Intent: make Line's listed work an entry point to stories with server-cached model adoption.
// Status: implemented. Next: monitor Hub availability. Blockers: none. Confidence: typed content and HF failure tests.
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { ProjectCarousel } from './ProjectCarousel';
import { projects } from '@/content/projects';
import { getHfStats } from '@/lib/hf-stats';

export async function ProjectsSection() {
  const listed = projects.filter((project) => project.listed !== false);
  const hfDownloads = Object.fromEntries(await Promise.all(listed.map(async (project) => [
    project.slug, project.hfModels ? (await getHfStats(project.hfModels))?.total ?? null : null,
  ])));
  return (
    <SectionWrapper id="work" ariaLabel="Work" withTopRule>
      <div className="mb-6 grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,36ch)]">
        <SectionHeader index={5} slug="work" title="Selected projects." planet={SECTION_PLANET.work} className="mb-0 md:mb-0" />
        <p data-reveal className="text-lg text-ink lg:text-right [--reveal-delay:80ms]">
          Real things I&apos;ve shipped, from clinical ML research to production LLM systems.
        </p>
      </div>
      <div data-reveal="showcase"><ProjectCarousel projects={listed} hfDownloads={hfDownloads} /></div>
    </SectionWrapper>
  );
}
