import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProfileLinks } from './ProfileLinks';
import { ContactForm } from './ContactForm';
import { CVDownload } from './CVDownload';

export function ContactSection() {
  return (
    <SectionWrapper id="contact" ariaLabel="Contact" width="md" withTopRule>
      <SectionHeader
        index={7}
        slug="contact"
        title="let's build something."
        sub="Got an opportunity, a question, or just want to compare notes on causal inference? Send a packet."
      />

      <div className="space-y-6">
        <ProfileLinks />
        <ContactForm />
        <CVDownload />
      </div>
    </SectionWrapper>
  );
}
