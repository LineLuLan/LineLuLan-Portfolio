import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillTier } from './SkillTier';
import { skills } from '@/content/skills';

// Skip the "exploring" tier here — it's already surfaced in <ExploringTags /> on About.
const VISIBLE = skills.filter((t) => t.id !== 'exploring');

export function SkillsSection() {
  return (
    <SectionWrapper id="stack" ariaLabel="Stack" width="lg" withTopRule>
      <SectionHeader index={3} slug="stack" title="tools of the trade." />
      <div className="space-y-10">
        {VISIBLE.map((tier) => (
          <SkillTier key={tier.id} tier={tier} />
        ))}
      </div>
    </SectionWrapper>
  );
}
