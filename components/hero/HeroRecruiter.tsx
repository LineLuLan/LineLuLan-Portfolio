'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { FileText, Mail, Github, Linkedin } from 'lucide-react';
import { profile } from '@/content/profile';
import { AVATAR_PATH, CV_PATH, SOCIAL } from '@/lib/constants';
import { PillarTags } from './PillarTags';
import { StatsCounters } from './StatsCounters';
import { trackEvent } from '@/lib/analytics';

export function HeroRecruiter() {
  const reveal = (i: number) => ({ '--reveal-delay': `${i * 60}ms` } as CSSProperties);

  return (
    <div className="mx-auto max-w-2xl text-center">
      <div style={reveal(0)} className="reveal-up mb-6 flex justify-center">
        <Image
          src={AVATAR_PATH}
          alt={`${profile.name} avatar`}
          width={88}
          height={88}
          priority
          className="rounded-full border border-border-subtle bg-midnight ring-1 ring-accent-pink/20"
        />
      </div>

      <h1
        style={reveal(1)}
        className="reveal-up text-balance font-sans text-3xl font-semibold tracking-tight text-text-primary md:text-4xl"
      >
        {profile.name}
      </h1>

      <p style={reveal(2)} className="reveal-up mt-2 font-mono text-sm">
        <span className="neon-text">{profile.alias}</span>
        <span className="mx-2 text-text-tertiary">·</span>
        <span className="text-text-secondary">{profile.title}</span>
      </p>

      <p
        style={reveal(3)}
        className="reveal-up mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-text-secondary"
      >
        {profile.positioning}
      </p>

      <div style={reveal(4)} className="reveal-up mt-6 flex justify-center">
        <PillarTags pillars={profile.pillars} />
      </div>

      <StatsCounters stats={profile.stats} />

      <div
        style={reveal(6)}
        className="reveal-up mt-10 flex flex-wrap justify-center gap-2.5 font-mono text-xs"
      >
        <a
          href={CV_PATH}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('cv_open', { from: 'hero' })}
          className="inline-flex items-center gap-2 rounded-sm border border-accent-pink/70 bg-accent-pink/10 px-3.5 py-2 text-accent-pink transition-all hover:bg-accent-pink hover:text-void hover:shadow-[0_0_18px_rgba(224,123,151,0.35)]"
        >
          <FileText size={12} aria-hidden /> open CV
        </a>
        <Link
          href="#contact"
          className="inline-flex items-center gap-2 rounded-sm border border-border-subtle px-3.5 py-2 text-text-secondary transition-all hover:border-accent-pink hover:text-accent-pink hover:shadow-[0_0_14px_rgba(224,123,151,0.18)]"
        >
          <Mail size={12} aria-hidden /> get in touch
        </Link>
        <a
          href={SOCIAL.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm border border-border-subtle px-3.5 py-2 text-text-secondary transition-all hover:border-accent-pink hover:text-accent-pink hover:shadow-[0_0_14px_rgba(224,123,151,0.18)]"
        >
          <Github size={12} aria-hidden /> github
        </a>
        <a
          href={SOCIAL.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm border border-border-subtle px-3.5 py-2 text-text-secondary transition-all hover:border-accent-pink hover:text-accent-pink hover:shadow-[0_0_14px_rgba(224,123,151,0.18)]"
        >
          <Linkedin size={12} aria-hidden /> linkedin
        </a>
      </div>
    </div>
  );
}
