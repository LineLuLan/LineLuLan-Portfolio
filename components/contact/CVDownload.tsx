'use client';

import { FileText } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CV_PATH } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

export function CVDownload() {
  return (
    <GlassCard className="flex items-center justify-between gap-4 p-5">
      <p className="font-mono text-xs text-text-secondary">
        Prefer to skip the chat? Open the CV.
      </p>
      <a
        href={CV_PATH}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('cv_open', { from: 'contact_section' })}
        className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-accent-pink/70 bg-accent-pink/10 px-3 py-1.5 font-mono text-xs text-accent-pink transition-colors hover:bg-accent-pink hover:text-void"
      >
        <FileText size={12} aria-hidden /> open CV
      </a>
    </GlassCard>
  );
}
