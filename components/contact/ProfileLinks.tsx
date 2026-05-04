import { ArrowUpRight, Mail } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SOCIAL } from '@/lib/constants';

export function ProfileLinks() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <GlassCard className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent-pink">PRIMARY</p>
        <ul className="mt-3 space-y-2 font-mono text-xs">
          <Row label="email" value={SOCIAL.email} href={`mailto:${SOCIAL.email}`} icon={<Mail size={11} />} />
          <Row label="github" value="@LineLuLan" href={SOCIAL.github} />
          <Row label="linkedin" value="anhline03" href={SOCIAL.linkedin} />
        </ul>
      </GlassCard>
      <GlassCard className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent-pink">PROOF OF WORK</p>
        <ul className="mt-3 space-y-2 font-mono text-xs">
          <Row label="kaggle" value="lineizumi" href={SOCIAL.kaggle} />
        </ul>
      </GlassCard>
    </div>
  );
}

type RowProps = {
  label: string;
  value: string;
  href: string;
  icon?: React.ReactNode;
};

function Row({ label, value, href, icon }: RowProps) {
  const isExternal = href.startsWith('http');
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-text-tertiary">{label}</span>
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="inline-flex items-center gap-1 truncate text-text-primary hover:text-accent-pink"
      >
        <span className="truncate">{value}</span>
        {icon ?? <ArrowUpRight size={11} aria-hidden className="shrink-0" />}
      </a>
    </li>
  );
}
