import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProfileLinks } from './ProfileLinks';
import { ContactForm } from './ContactForm';
import { CVDownload } from './CVDownload';

export function ContactSection() {
  return (
    <SectionWrapper id="contact" ariaLabel="Contact" width="sm">
      <SectionHeader index="06 / 06" path="~/net/ping" caption="ping" />
      <p className="mb-6 max-w-xl text-sm text-text-secondary text-balance">
        Got an opportunity, a question, or just want to compare notes on causal inference? Send a packet.
      </p>

      <div className="space-y-4">
        <ProfileLinks />
        <ContactForm />
        <CVDownload />
      </div>
    </SectionWrapper>
  );
}
