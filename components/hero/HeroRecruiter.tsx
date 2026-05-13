'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Mail, Github } from 'lucide-react';
import { profile } from '@/content/profile';
import { AVATAR_PATH, CV_PATH, SOCIAL } from '@/lib/constants';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { PillarTags } from './PillarTags';
import { StatsCounters } from './StatsCounters';
import { trackEvent } from '@/lib/analytics';

export function HeroRecruiter() {
  const reduce = useReducedMotion();
  const fade = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' as const },
  });

  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.div {...fade(0)} className="mb-6 flex justify-center">
        <Image
          src={AVATAR_PATH}
          alt={`${profile.name} avatar`}
          width={88}
          height={88}
          priority
          className="rounded-full border border-border-subtle bg-midnight ring-1 ring-accent-pink/20"
        />
      </motion.div>

      <motion.h1
        {...fade(1)}
        className="text-balance font-sans text-3xl font-semibold tracking-tight text-text-primary md:text-4xl"
      >
        {profile.name}
      </motion.h1>

      <motion.p {...fade(2)} className="mt-2 font-mono text-sm">
        <span className="neon-text">{profile.alias}</span>
        <span className="mx-2 text-text-tertiary">·</span>
        <span className="text-text-secondary">{profile.title}</span>
      </motion.p>

      <motion.p
        {...fade(3)}
        className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-text-secondary"
      >
        {profile.positioning}
      </motion.p>

      <motion.div {...fade(4)} className="mt-6 flex justify-center">
        <PillarTags pillars={profile.pillars} />
      </motion.div>

      <StatsCounters stats={profile.stats} />

      <motion.div
        {...fade(6)}
        className="mt-10 flex flex-wrap justify-center gap-2.5 font-mono text-xs"
      >
        <a
          href={CV_PATH}
          download
          onClick={() => trackEvent('cv_download', { from: 'hero' })}
          className="inline-flex items-center gap-2 rounded-sm border border-accent-pink/70 bg-accent-pink/10 px-3.5 py-2 text-accent-pink transition-all hover:bg-accent-pink hover:text-void hover:shadow-[0_0_18px_rgba(224,123,151,0.35)]"
        >
          <Download size={12} aria-hidden /> download CV
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
      </motion.div>
    </div>
  );
}
