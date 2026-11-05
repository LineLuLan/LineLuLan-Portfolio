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
      <SectionHeader index={3} slug="stack" title="Tools I ship with." planet={SECTION_PLANET.stack} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((tier, index) => (
          <SkillTier key={tier.id} tier={tier} index={index} />
        ))}
      </div>
      <div className="mt-6">
        <h3 className="font-display text-[20px] font-bold text-ink">Methods</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {methods.map((method) => <li key={method} className="rounded bg-tint-c px-3 py-2 font-sans text-[14px] text-ink">{method}</li>)}
        </ul>
      </div>
    </SectionWrapper>
  );
}
