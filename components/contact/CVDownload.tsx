'use client';

import { Download } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CV_PATH } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

export function CVDownload() {
  return (
    <GlassCard className="flex items-center justify-between gap-4 p-5">
      <p className="font-mono text-xs text-text-secondary">
        Prefer to skip the chat? Grab the CV.
      </p>
      <a
        href={CV_PATH}
        download
        onClick={() => trackEvent('cv_download', { from: 'contact_section' })}
        className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-accent-pink/70 bg-accent-pink/10 px-3 py-1.5 font-mono text-xs text-accent-pink transition-colors hover:bg-accent-pink hover:text-void"
      >
        <Download size={12} aria-hidden /> download CV
      </a>
    </GlassCard>
  );
}
