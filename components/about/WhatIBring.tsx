// Intent: show Line's four capabilities with concrete proof in readable two-column cards.
// Status: R2. Next: visual review. Blockers: none. Confidence: typed content.
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import type { WhatIBringItem } from '@/types';

const CARD_PLANETS = ['earth', 'mars', 'jupiter', 'neptune'] as const;

export function WhatIBring({ items }: { items: WhatIBringItem[] }) {
  return (
    <div className="mt-12">
      <p className="eyebrow mb-4">What I bring</p>
      <ul className="grid gap-5 md:grid-cols-2">
        {items.map((item, i) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--reveal-delay': `${i * 50}ms` } as React.CSSProperties}
            className="rounded-[var(--theme-radius)] border hairline bg-panel p-7 flex flex-col items-start"
          >
            <PixelPlanet kind={CARD_PLANETS[i % CARD_PLANETS.length] ?? 'earth'} size={32} />
            <h3 className="mt-4 font-display text-[22px] font-bold text-ink">{item.title}</h3>
            <p className="mt-2 text-[17px] leading-7 text-ink">{item.description}</p>
            <p className="mt-auto flex items-center gap-2 pt-5 font-mono text-[13px] text-accent">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-accent" />{item.proof}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
