'use client';

import { useState } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { YearGroupedTimeline } from './YearGroupedTimeline';
import { EventModal } from './EventModal';
import { chronicles } from '@/content/chronicles';
import type { ChronicleEvent } from '@/types';

export function ChroniclesSection() {
  const [open, setOpen] = useState<ChronicleEvent | null>(null);

  return (
    <SectionWrapper id="chronicles" ariaLabel="Chronicles" width="md">
      <SectionHeader index="05 / 06" path="~/var/logs/chronicles" caption="chronicles" />

      <YearGroupedTimeline events={chronicles} onSelect={setOpen} />

      <div className="mt-8 flex flex-wrap gap-x-4 gap-y-1 border-t border-border-subtle pt-3 font-mono text-[11px] text-text-tertiary">
        <span><span className="text-text-tertiary">●</span> education</span>
        <span><span className="text-accent-purple">◆</span> role / work</span>
        <span><span className="text-accent-pink">★</span> award</span>
        <span><span className="text-accent-magenta">▲</span> event / talk</span>
        <span><span className="text-accent-pink">✦</span> project / research</span>
      </div>

      <EventModal event={open} onClose={() => setOpen(null)} />
    </SectionWrapper>
  );
}
