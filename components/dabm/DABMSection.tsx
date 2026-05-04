'use client';

import { useMemo, useState } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DABMQuadrant } from './DABMQuadrant';
import { ApplyDropdown } from './ApplyDropdown';
import { DABMApplied } from './DABMApplied';
import { dabmIntro, dabmQuadrants } from '@/content/dabm';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';

export function DABMSection() {
  const eligible = useMemo(
    () => projects.filter((p) => p.state !== 'classified' && p.dabm),
    [],
  );
  const [slug, setSlug] = useState(eligible[0]?.slug ?? '');
  const selected = eligible.find((p) => p.slug === slug) ?? eligible[0];

  return (
    <SectionWrapper id="dabm" ariaLabel="DABM Framework" width="md">
      <SectionHeader index="04 / 06" path="~/lib/dabm" caption="framework" />

      <div className="mb-6">
        <p className="font-mono text-base text-text-primary">
          {profile.framework.short}{' '}
          <span className="text-text-tertiary">=</span>{' '}
          <span className="neon-text">{profile.framework.long}</span>
        </p>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary text-balance">{dabmIntro}</p>
      </div>

      <div className="relative">
        <div className="grid gap-3 md:grid-cols-2">
          {dabmQuadrants.map((q, i) => (
            <DABMQuadrant key={q.letter} q={q} index={i} />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex"
        >
          <div className="h-2 w-2 rotate-45 bg-accent-pink/70 shadow-[0_0_18px_rgba(224,123,151,0.45)] animate-pulse-slow" />
        </div>
      </div>

      {selected && (
        <div className="mt-8 border-t border-border-subtle pt-6">
          <ApplyDropdown projects={eligible} selectedSlug={selected.slug} onChange={setSlug} />
          <div className="mt-4">
            <DABMApplied project={selected} />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
