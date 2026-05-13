import { TerminalBreadcrumb } from '@/components/layout/TerminalBreadcrumb';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { AboutSection } from '@/components/about/AboutSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { DABMSection } from '@/components/dabm/DABMSection';
import { ChroniclesSection } from '@/components/chronicles/ChroniclesSection';
import { ContactSection } from '@/components/contact/ContactSection';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { StarField } from '@/components/ui/StarField';
import { ClickSpark } from '@/components/ui/ClickSpark';

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <StarField />
      <GrainOverlay intensity="light" className="fixed" />
      <ClickSpark />
      <TerminalBreadcrumb />
      <main className="relative">
        <Hero />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <DABMSection />
        <ChroniclesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
