'use client';

import { ArrowUpRight } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { CV_PATH, SOCIAL } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import { ContactForm } from './ContactForm';

export function ContactSection() {
  return (
    <SectionWrapper id="contact" ariaLabel="Contact" withTopRule className="bg-tint-a">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0">
          <SectionHeader
            index={7}
            slug="contact"
            planet={SECTION_PLANET.contact}
            title="Let's build something."
            sub="Got an opportunity, a question, or just want to compare notes on causal inference? Send a packet."
          />
          <a href={`mailto:${SOCIAL.email}`} className="inline-flex min-h-11 max-w-full items-center break-all font-sans text-2xl font-bold text-ink hover:text-accent md:text-3xl">
            {SOCIAL.email}
          </a>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {(['github', 'linkedin', 'kaggle'] as const).map((key) => (
              <li key={key}>
                <a href={SOCIAL[key]} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 font-mono text-sm text-ink hover:text-accent">
                  {{ github: 'GitHub', linkedin: 'LinkedIn', kaggle: 'Kaggle' }[key]}
                  <ArrowUpRight size={16} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={CV_PATH}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cv_open', { from: 'contact_section' })}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline px-4 font-mono text-sm text-ink hover:border-accent hover:text-accent"
          >
            Open CV
          </a>
        </div>
        <ContactForm />
      </div>
    </SectionWrapper>
  );
}
