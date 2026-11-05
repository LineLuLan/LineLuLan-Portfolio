'use client';

import { useMemo, useState } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { DABMQuadrant } from './DABMQuadrant';
import { ApplyDropdown } from './ApplyDropdown';
import { DABMApplied } from './DABMApplied';
import { dabmIntro, dabmQuadrants } from '@/content/dabm';
import { projects } from '@/content/projects';

export function DABMSection() {
  const eligible = useMemo(
    () => projects.filter((p) => p.state !== 'classified' && p.dabm),
    [],
  );
  const [slug, setSlug] = useState(eligible[0]?.slug ?? '');
  const selected = eligible.find((p) => p.slug === slug) ?? eligible[0];

  return (
    <SectionWrapper id="framework" ariaLabel="DABM Framework" withTopRule>
      <SectionHeader index={5} slug="framework" title="DABM." planet={SECTION_PLANET.framework} />

      <div className="mb-8">
        <p className="font-mono text-base text-accent">Data · Agent · Behavioral · Modeling</p>
        <p className="mt-2 max-w-[65ch] text-lg text-muted">{dabmIntro}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {dabmQuadrants.map((q, i) => (
            <DABMQuadrant key={q.letter} q={q} index={i} />
          ))}
        </div>
        {selected && (
          <div className="min-w-0 self-start rounded-[var(--theme-radius)] border hairline bg-panel p-6">
            <ApplyDropdown projects={eligible} selectedSlug={selected.slug} onChange={setSlug} />
            <DABMApplied project={selected} />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
