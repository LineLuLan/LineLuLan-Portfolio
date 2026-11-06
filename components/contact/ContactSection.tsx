'use client';

// Intent: center Line's invitation and form around a quiet, themed planet scene.
// Status: implemented. Next: viewport acceptance. Blockers: none. Confidence: unchanged form behavior.
import { ArrowUpRight } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SiteIcon } from '@/components/ui/SiteIcon';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { CV_PATH, SOCIAL } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';
import { ContactForm } from './ContactForm';
import { ContactScene } from './ContactScene';
import { CopyEmail } from './CopyEmail';

const socialClass = 'inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline bg-panel px-3 text-sm text-ink hover:border-accent hover:text-accent';

export function ContactSection() {
  return (
    <SectionWrapper id="contact" ariaLabel="Contact" withTopRule className="bg-tint-a lg:flex lg:items-center">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <ContactScene />
          <SectionHeader index={8} slug="contact" planet={SECTION_PLANET.contact} title="Let's build something." className="mb-3 md:mb-3" />
          <div data-reveal>
            <p className="text-[17px] leading-7 text-ink">Hiring for an AI / ML or data role, or have a research idea worth testing? My inbox is open.</p>
            <CopyEmail email={SOCIAL.email} />
            <ul className="mt-4 flex flex-wrap gap-2">
              <li data-reveal-child><a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className={socialClass}><SiteIcon href={SOCIAL.github} size={18} />GitHub</a></li>
              <li data-reveal-child className="[--reveal-order:1]"><a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className={socialClass}><SiteIcon href={SOCIAL.linkedin} size={18} />LinkedIn</a></li>
              <li data-reveal-child className="[--reveal-order:2]"><a href={SOCIAL.kaggle} target="_blank" rel="noopener noreferrer" className={socialClass}><SiteIcon href={SOCIAL.kaggle} size={18} />Kaggle</a></li>
              <li data-reveal-child className="[--reveal-order:3]"><a href={SOCIAL.openreview} target="_blank" rel="noopener noreferrer" className={socialClass}><SiteIcon href={SOCIAL.openreview} size={18} />OpenReview</a></li>
              <li data-reveal-child className="[--reveal-order:4]"><a href={CV_PATH} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cv_open', { from: 'contact_section' })} className={socialClass}>Open CV<ArrowUpRight size={16} aria-hidden /></a></li>
            </ul>
          </div>
        </div>
        <div data-reveal="showcase" className="min-w-0 [--reveal-delay:80ms]"><ContactForm /></div>
      </div>
    </SectionWrapper>
  );
}
