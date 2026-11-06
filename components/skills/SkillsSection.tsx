// Intent: organize Line's tools into six scannable groups and a separate methods row.
// Status: R2. Next: browser review. Blockers: none. Confidence: typed inventory and static review.
import type { CSSProperties } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillTier } from './SkillTier';
import { skills, methods } from '@/content/skills';
import { SECTION_PLANET } from '@/lib/pixel-planets';

export function SkillsSection() {
  return (
    <SectionWrapper id="stack" ariaLabel="Stack" withTopRule>
      <SectionHeader index={4} slug="stack" title="Tools I ship with." planet={SECTION_PLANET.stack} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((tier, index) => (
          <SkillTier key={tier.id} tier={tier} index={index} />
        ))}
      </div>
      <div data-reveal className="mt-6 flex flex-wrap items-center gap-3 lg:mt-5">
        <h3 className="font-display text-[18px] font-bold text-ink">Methods</h3>
        <ul className="flex flex-wrap gap-1.5">
          {methods.map((method, index) => <li key={method} data-reveal-child style={{ '--reveal-order': index } as CSSProperties} className="rounded bg-tint-c px-2 py-1 font-sans text-[13px] text-ink">{method}</li>)}
        </ul>
      </div>
    </SectionWrapper>
  );
}
