import Image from 'next/image';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { profile } from '@/content/profile';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { WhatIBring } from './WhatIBring';
import { ExploringTags } from './ExploringTags';

// Intent: pair Line's narrative with a real portrait within the desktop screen budget.
// Status: implemented. Next: viewport acceptance. Blockers: sandbox denies Chromium spawn. Confidence: static checks only.

export function AboutSection() {
  return (
    <SectionWrapper id="about" ariaLabel="About" withTopRule>
      <SectionHeader index={2} slug="about" title="Where research meets production." planet={SECTION_PLANET.about} />

      <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0">
          <p data-reveal className="text-[17px] leading-7 text-ink">{profile.narrative.intro}</p>
          <p data-reveal className="mt-4 text-[17px] leading-7 text-ink [--reveal-delay:60ms]">{profile.narrative.mission}</p>
          <ExploringTags tags={profile.exploring} />
        </div>
        <figure data-reveal="slide" className="mx-auto w-full max-w-[360px] min-w-0 lg:max-w-[256px] 2xl:max-w-[360px] [--reveal-delay:80ms]">
          <div className="overflow-hidden rounded-[var(--theme-radius)] border hairline motion-safe:[html[data-motion=on]_&]:transition-shadow motion-safe:[html[data-motion=on]_&]:duration-[var(--theme-duration)] motion-safe:[html[data-motion=on]_&]:ease-[var(--theme-ease)] motion-safe:[html[data-motion=on]_&]:hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_20%,transparent),0_0_24px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]">
            <Image
              src="/about/line-portrait.jpg"
              width={1000}
              height={1250}
              sizes="(min-width: 1536px) 360px, (min-width: 1024px) 256px, (min-width: 408px) 360px, calc(100vw - 48px)"
              alt="Trần Nam Anh (Line) in a Hackathon Vietnam · GDG on Campus t-shirt, making a hand sign outdoors at sunset"
              className="aspect-[4/5] w-full object-cover object-top lg:aspect-square 2xl:aspect-[4/5]"
            />
          </div>
          <figcaption className="mt-2 text-center font-mono text-[13px] leading-5 text-muted">Line · Ho Chi Minh City</figcaption>
        </figure>
      </div>

      <WhatIBring items={profile.whatIBring} />
    </SectionWrapper>
  );
}
