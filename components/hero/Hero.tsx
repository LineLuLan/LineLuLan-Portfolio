import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { HeroRecruiter } from './HeroRecruiter';

export function Hero() {
  return (
    <SectionWrapper id="hero" ariaLabel="Introduction" width="md" className="pt-10 md:pt-14">
      <p className="mb-8 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-tertiary">
        <span className="h-px w-8 bg-border-subtle" />
        <span>01 / 06 · whoami</span>
        <span className="h-px w-8 bg-border-subtle" />
      </p>
      <HeroRecruiter />
    </SectionWrapper>
  );
}
