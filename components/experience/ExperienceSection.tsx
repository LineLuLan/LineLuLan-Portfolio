// Intent: expose all employment content in server HTML with accessible client tabs.
// Status: implemented. Next: Line's content review. Blockers: none. Confidence: typed packet data.
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { experience } from '@/content/experience';
import { ExperienceTabs } from './ExperienceTabs';

export function ExperienceSection() {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return (
    <SectionWrapper id="experience" ariaLabel="Experience" withTopRule>
      <SectionHeader index={3} slug="experience" title="Where I've worked." planet={SECTION_PLANET.experience} />
      <ExperienceTabs orgs={experience} today={today} />
    </SectionWrapper>
  );
}
