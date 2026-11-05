import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { profile } from '@/content/profile';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { WhatIBring } from './WhatIBring';
import { ExploringTags } from './ExploringTags';

// Intent: fit Line's narrative, facts and capabilities into a desktop screen.
// Status: implemented. Next: viewport probe. Blockers: browser unavailable. Confidence: content budget.

const IDENTITY_LABEL: Record<string, string> = {
  location: 'Based in',
  status: 'Studying',
  gpa: 'GPA',
  research: 'Research',
  building: 'Currently',
  'open to': 'Open to',
};

export function AboutSection() {
  return (
    <SectionWrapper id="about" ariaLabel="About" withTopRule>
      <SectionHeader index={2} slug="about" title="Where research meets production." planet={SECTION_PLANET.about} className="mb-6 md:mb-6" />

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0">
          <p className="text-[17px] leading-7 text-ink">{profile.narrative.intro}</p>
          <p className="mt-3 text-[17px] leading-7 text-ink">{profile.narrative.mission}</p>
          <ExploringTags tags={profile.exploring} />
        </div>
        <dl>
          {profile.facts.map((fact) => (
            <div key={fact.key} className="grid min-h-11 grid-cols-[100px_minmax(0,1fr)] items-baseline gap-3 border-t hairline py-2">
              <dt className="eyebrow self-start">{IDENTITY_LABEL[fact.key] ?? fact.key}</dt>
              <dd className="text-[15px] leading-7 text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <WhatIBring items={profile.whatIBring} />
    </SectionWrapper>
  );
}
