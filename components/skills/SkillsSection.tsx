// Intent: organize Line's tools into six scannable groups and a separate methods row.
// Status: R2. Next: browser review. Blockers: none. Confidence: typed inventory and static review.
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillTier } from './SkillTier';
import { skills, methods } from '@/content/skills';
import { SECTION_PLANET } from '@/lib/pixel-planets';

export function SkillsSection() {
  return (
    <SectionWrapper id="stack" ariaLabel="Stack" withTopRule>
      <SectionHeader index={3} slug="stack" title="Tools I ship with." planet={SECTION_PLANET.stack} className="mb-6 md:mb-6" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((tier, index) => (
          <SkillTier key={tier.id} tier={tier} index={index} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h3 className="font-display text-[18px] font-bold text-ink">Methods</h3>
        <ul className="flex flex-wrap gap-1.5">
          {methods.map((method) => <li key={method} className="rounded bg-tint-c px-2 py-1 font-sans text-[13px] text-ink">{method}</li>)}
        </ul>
      </div>
    </SectionWrapper>
  );
}
