import { capitalize, cn } from '@/lib/cn';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import type { PlanetKind } from '@/lib/pixel-planets';

type Props = {
  index: number;
  slug: string;
  title: string;
  sub?: string;
  className?: string;
  planet?: PlanetKind;
};

// Intent: one upright display style, with accent reserved for the final period.
// Status: R2. Next: visual review. Blockers: none. Confidence: shared by all six sections.
export function SectionHeader({ index, slug, title, sub, className, planet }: Props) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const hasPeriod = title.endsWith('.');
  return (
    <header className={cn('mb-10 md:mb-14', className)}>
      <p data-reveal className="eyebrow">
        {planet && <PixelPlanet kind={planet} size={28} className="shrink-0" />}
        <span>
          <span className="eyebrow-muted">{pad(index)}</span> · {capitalize(slug)}
        </span>
      </p>
      <h2 data-reveal className="editorial-h2 mt-3 [--reveal-delay:60ms]">
        {hasPeriod ? title.slice(0, -1) : title}
        {hasPeriod && <span className="text-accent">.</span>}
      </h2>
      {sub && (
        <p className="mt-2 max-w-[65ch] text-lg text-ink">{sub}</p>
      )}
    </header>
  );
}
