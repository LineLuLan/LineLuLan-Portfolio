import Image from 'next/image';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { profile } from '@/content/profile';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
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
        {/* Round portrait sized by viewport height so About keeps one window on any screen;
            a small orbit with two pixel planets circles it (Line, 2026-11-08). */}
        <figure data-reveal="slide" className="about-orbit-figure mx-auto w-[min(300px,100%)] min-w-0 lg:w-[min(260px,30svh)] [--reveal-delay:80ms]">
          <div className="about-orbit">
            <div className="about-orbit-ring" aria-hidden="true" />
            <div className="about-orbit-carrier" aria-hidden="true">
              <span className="about-orbit-planet about-orbit-planet-a"><PixelPlanet kind="saturn" size={22} /></span>
              <span className="about-orbit-planet about-orbit-planet-b"><PixelPlanet kind="moon" size={16} /></span>
            </div>
            <div className="about-orbit-photo">
              <Image
                src="/about/line-portrait.jpg"
                width={1000}
                height={1250}
                sizes="(min-width: 1024px) 220px, 240px"
                alt="Trần Nam Anh (Line) in a Hackathon Vietnam · GDG on Campus t-shirt, making a hand sign outdoors at sunset"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
          <figcaption className="mt-2 text-center font-mono text-[13px] leading-5 text-muted">Line · Ho Chi Minh City</figcaption>
        </figure>
      </div>

      <WhatIBring items={profile.whatIBring} />
    </SectionWrapper>
  );
}
