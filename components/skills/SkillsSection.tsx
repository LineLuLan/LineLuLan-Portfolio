import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkillTier } from './SkillTier';
import { skills } from '@/content/skills';

export function SkillsSection() {
  return (
    <SectionWrapper id="skills" ariaLabel="Skills" width="md">
      <SectionHeader index="02 / 06" path="~/sys/stack" caption="stack" />
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((tier) => (
          <SkillTier key={tier.id} tier={tier} />
        ))}
      </div>
    </SectionWrapper>
  );
}
