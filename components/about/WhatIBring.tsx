// Intent: show Line's four capabilities with concrete proof in compact desktop columns.
// Status: R2. Next: visual review. Blockers: none. Confidence: typed content.
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import type { WhatIBringItem } from '@/types';

const CARD_PLANETS = ['earth', 'mars', 'jupiter', 'neptune'] as const;

export function WhatIBring({ items }: { items: WhatIBringItem[] }) {
  return (
    <div className="mt-8 lg:mt-6">
      <p data-reveal className="eyebrow mb-4">What I bring</p>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <li
            key={item.title}
            data-reveal="depth"
            style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
            className="surface-card min-w-0 rounded-[var(--theme-radius)] border hairline bg-panel p-4 flex flex-col items-start"
          >
            <span data-reveal-child className="card-planet"><PixelPlanet kind={CARD_PLANETS[i % CARD_PLANETS.length] ?? 'earth'} size={24} /></span>
            <h3 data-reveal-child className="mt-2 font-display text-[18px] font-bold leading-6 text-ink [--reveal-order:1]">{item.title}</h3>
            <p data-reveal-child className="mt-2 text-[15px] leading-6 text-ink [--reveal-order:2]">{item.description}</p>
            <p data-reveal-child className="mt-auto flex items-center gap-2 pt-3 font-mono text-[13px] leading-5 text-accent [--reveal-order:3]">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-accent" />{item.proof}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
