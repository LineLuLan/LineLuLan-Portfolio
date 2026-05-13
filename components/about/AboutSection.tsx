import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { profile } from '@/content/profile';
import { WhatIBring } from './WhatIBring';
import { ExploringTags } from './ExploringTags';

// Curated 2×2: based · status · role · open to.
const IDENTITY_KEYS = ['location', 'status', 'building', 'open to'] as const;
const IDENTITY_LABEL: Record<(typeof IDENTITY_KEYS)[number], string> = {
  location: 'based',
  status: 'studies',
  building: 'currently',
  'open to': 'open to',
};

export function AboutSection() {
  const identity = IDENTITY_KEYS.map((k) => {
    const fact = profile.facts.find((f) => f.key === k);
    return fact ? { key: IDENTITY_LABEL[k], value: fact.value } : null;
  }).filter((x): x is { key: string; value: string } => x !== null);

  return (
    <SectionWrapper id="about" ariaLabel="About" width="lg" withTopRule>
      <SectionHeader index={2} slug="about" title="jack of all trades." />

      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        {/* Identity grid 2×2 */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 font-mono text-xs">
          {identity.map((f) => (
            <div key={f.key} className="border-t border-rule-subtle pt-3">
              <dt className="text-[10px] uppercase tracking-[0.25em] text-text-tertiary">
                {f.key}
              </dt>
              <dd className="mt-1.5 text-sm leading-snug text-text-primary">{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* Narrative */}
        <div className="space-y-4 text-text-secondary">
          <p className="text-base leading-relaxed text-balance">
            {profile.narrative.intro}
          </p>
          <p className="text-base leading-relaxed text-balance">
            {profile.narrative.mission}
          </p>
        </div>
      </div>

      <WhatIBring items={profile.whatIBring} />
      <ExploringTags tags={profile.exploring} />
    </SectionWrapper>
  );
}
