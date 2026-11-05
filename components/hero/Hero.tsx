// Intent: center Line's introduction, orbit and stats within the desktop viewport.
// Status: R2. Next: supervisor viewport screenshots. Blockers: none. Confidence: static layout review.
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { PixelStars } from '@/components/pixel/PixelStars';
import { profile } from '@/content/profile';
import { CV_PATH, SOCIAL } from '@/lib/constants';
import { OrbitSystem } from './OrbitSystem';
import { StatsCounters } from './StatsCounters';

export function Hero() {
  const reveal = (i: number) => ({ '--reveal-delay': `${i * 60}ms` } as CSSProperties);

  return (
    <SectionWrapper id="hero" ariaLabel="Introduction" className="isolate">
      <div aria-hidden className="pixel-grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <PixelStars />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="min-w-0">
          <p style={reveal(0)} className="reveal-up eyebrow">
            <span className="eyebrow-muted shrink-0">01</span>
            <span>AI / ML Engineer · Data Engineering</span>
          </p>
          <h1 style={reveal(1)} className="reveal-up hero-heading mt-4 font-display font-bold text-ink">
            <span className="block [text-wrap:balance]">Build things that survive</span>
            <span className="block text-accent">contact with reality.</span>
          </h1>
          <p style={reveal(2)} className="reveal-up mt-3 inline-flex min-h-10 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline bg-panel px-3 font-mono text-sm text-ink">
            <span className="h-2 w-2 shrink-0 rounded-full bg-success" aria-hidden />
            <span>{profile.availability}</span>
          </p>
          <div style={reveal(3)} className="reveal-up mt-4 flex items-center">
            <div>
              <p className="font-sans text-xl font-bold text-ink">{profile.name}</p>
              <p className="font-mono text-sm text-muted">{profile.alias} · {profile.title}</p>
            </div>
          </div>
          <p style={reveal(4)} className="reveal-up mt-4 max-w-[44ch] text-lg text-ink md:text-xl">
            {profile.positioning}
          </p>
          <div style={reveal(5)} className="reveal-up mt-5 flex flex-wrap gap-3">
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
        <div className="mx-auto hidden w-full min-w-0 max-w-[480px] md:block lg:max-w-[640px]">
          <OrbitSystem />
        </div>
      </div>
      <StatsCounters stats={profile.stats} />
    </SectionWrapper>
  );
}
