import { Header } from '@/components/layout/Header';
import { ThemeDock } from '@/components/ThemeDock';
import { OrbitCompanion } from '@/components/pixel/OrbitCompanion';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { AboutSection } from '@/components/about/AboutSection';
import { ExperienceSection } from '@/components/experience/ExperienceSection';
import { SkillsSection } from '@/components/skills/SkillsSection';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { DABMSection } from '@/components/dabm/DABMSection';
import { ChroniclesSection } from '@/components/chronicles/ChroniclesSection';
import { ContactSection } from '@/components/contact/ContactSection';

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="relative">
        <Hero />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <DABMSection />
        <ChroniclesSection />
        <ContactSection />
      </main>
      <Footer />
      <ThemeDock />
      <OrbitCompanion />
    </div>
  );
}
