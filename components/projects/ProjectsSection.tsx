// Intent: make Line's listed work an entry point to individual project stories.
// Status: implemented. Next: fuller stories from Line. Blockers: none. Confidence: typed content.
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { ProjectCarousel } from './ProjectCarousel';
import { projects } from '@/content/projects';

export function ProjectsSection() {
  return (
    <SectionWrapper id="work" ariaLabel="Work" withTopRule>
      <div className="mb-6 grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,36ch)]">
        <SectionHeader index={4} slug="work" title="Selected projects." planet={SECTION_PLANET.work} className="mb-0 md:mb-0" />
        <p className="text-lg text-ink lg:text-right">
          Real things I&apos;ve shipped, from clinical ML research to production LLM systems.
        </p>
      </div>
      <ProjectCarousel projects={projects.filter((project) => project.listed !== false)} />
    </SectionWrapper>
  );
}
