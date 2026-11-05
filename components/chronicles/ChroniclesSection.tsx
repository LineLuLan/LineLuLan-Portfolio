// Intent: present Line's full record as one chronological journey, including server HTML.
// Status: implemented. Next: viewport acceptance. Blockers: none. Confidence: regression checks.
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { chronicles } from '@/content/chronicles';
import { CareerPath } from './CareerPath';

export function ChroniclesSection() {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return (
    <SectionWrapper id="record" ariaLabel="Record" withTopRule>
      <SectionHeader index={6} slug="record" title="Experience and milestones." planet={SECTION_PLANET.record} className="mb-4 md:mb-4" />
      <CareerPath events={chronicles} today={today} />
    </SectionWrapper>
  );
}
