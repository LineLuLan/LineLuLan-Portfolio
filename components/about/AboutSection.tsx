import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { profile } from '@/content/profile';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { WhatIBring } from './WhatIBring';
import { ExploringTags } from './ExploringTags';

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
      <SectionHeader index={2} slug="about" title="Where research meets production." planet={SECTION_PLANET.about} />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-[65ch] space-y-4">
          <p className="text-lg leading-relaxed text-ink">{profile.narrative.intro}</p>
          <p className="text-lg leading-relaxed text-ink">{profile.narrative.mission}</p>
        </div>
        <dl>
          {profile.facts.map((fact) => (
            <div key={fact.key} className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 border-t hairline py-3">
              <dt className="eyebrow self-start">{IDENTITY_LABEL[fact.key] ?? fact.key}</dt>
              <dd className="text-base text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <WhatIBring items={profile.whatIBring} />
      <ExploringTags tags={profile.exploring} />
    </SectionWrapper>
  );
}
