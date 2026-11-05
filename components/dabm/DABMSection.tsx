// Intent: explain Line's personal process without a project selector.
// Status: implemented. Next: content review with Line. Blockers: none. Confidence: supplied copy.
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SECTION_PLANET } from '@/lib/pixel-planets';
import { dabmIntro, dabmLead } from '@/content/dabm';
import { DABMProcess } from './DABMProcess';

export function DABMSection() {
  return (
    <SectionWrapper id="framework" ariaLabel="DABM Framework" withTopRule>
      <SectionHeader index={5} slug="framework" title="The DABM framework." planet={SECTION_PLANET.framework} />
      <p className="max-w-[44ch] font-display text-[1.75rem] leading-snug text-ink">{dabmLead}</p>
      <p className="mt-3 max-w-[68ch] text-[1.0625rem] leading-relaxed text-ink">{dabmIntro}</p>
      <DABMProcess />
      <a href="#work" className="mt-6 inline-flex min-h-11 items-center font-mono text-sm text-accent hover:underline">
        See it applied inside each project <span aria-hidden="true" className="ml-2">&rarr;</span>
      </a>
    </SectionWrapper>
  );
}
