import Image from 'next/image';
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { profile } from '@/content/profile';
import { AVATAR_PATH, CV_PATH, SOCIAL } from '@/lib/constants';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { OrbitArtwork } from './OrbitArtwork';
import { StatsCounters } from './StatsCounters';

export function Hero() {
  const reveal = (i: number) => ({ '--reveal-delay': `${i * 60}ms` } as CSSProperties);

  return (
    <SectionWrapper id="hero" ariaLabel="Introduction" className="isolate">
      <div aria-hidden className="pixel-grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" />
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div className="min-w-0">
          <p style={reveal(0)} className="reveal-up eyebrow">
            <PixelPlanet kind={SECTION_PLANET.whoami} size={28} className="shrink-0" />
            <span>01 / 07 · AI / ML ENGINEER · DATA ENGINEERING · 2026</span>
          </p>
          <h1 style={reveal(1)} className="reveal-up mt-6 font-sans font-extrabold text-display text-ink">
            Build things that survive
            <span className="serif-accent block">contact with reality.</span>
          </h1>
          <div style={reveal(2)} className="reveal-up mt-8 flex items-center gap-4">
            <Image
              src={AVATAR_PATH}
              alt={`${profile.name} avatar`}
              width={64}
              height={64}
              priority
              className="shrink-0 rounded-full ring-1 ring-line"
            />
            <div>
              <p className="font-sans text-xl font-bold text-ink">{profile.name}</p>
              <p className="font-mono text-sm text-muted">{profile.alias} · {profile.title}</p>
            </div>
          </div>
          <p style={reveal(3)} className="reveal-up mt-6 max-w-[42ch] text-lg text-muted">
            {profile.positioning}
          </p>
          <div style={reveal(4)} className="reveal-up mt-8 flex flex-wrap gap-3">
            <a
              href={CV_PATH}
              target="_blank"
              rel="noopener noreferrer"
              data-hero-cv
              className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] bg-accent px-4 font-mono text-sm text-on-accent hover:bg-accent-hover"
            >
              Open CV
            </a>
            <a href="#contact" className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline px-4 font-mono text-sm text-ink hover:border-accent hover:text-accent">
              Let&apos;s connect
            </a>
            <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] px-2 font-mono text-sm text-ink hover:text-accent">
              GitHub <ArrowUpRight size={16} aria-hidden />
            </a>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] px-2 font-mono text-sm text-ink hover:text-accent">
              LinkedIn <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
        </div>
        <div className="hidden min-w-0 lg:block">
          <OrbitArtwork />
        </div>
      </div>
      <StatsCounters stats={profile.stats} />
    </SectionWrapper>
  );
}
