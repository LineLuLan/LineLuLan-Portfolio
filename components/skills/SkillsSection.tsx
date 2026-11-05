import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillTier } from './SkillTier';
import { skills } from '@/content/skills';
import { SECTION_PLANET } from '@/lib/pixel-planets';

export function SkillsSection() {
  return (
    <SectionWrapper id="stack" ariaLabel="Stack" withTopRule>
      <SectionHeader index={3} slug="stack" title="tools of the trade." planet={SECTION_PLANET.stack} />
      <div className="space-y-10">
        {skills.map((tier) => (
          <SkillTier key={tier.id} tier={tier} />
        ))}
      </div>
    </SectionWrapper>
  );
}
