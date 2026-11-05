import { cn } from '@/lib/cn';
import { SECTION_TOTAL } from '@/lib/constants';
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

// 2-line section header:
//   02 / 07 · about                                  (eyebrow, mono small)
//   jack of all trades.                              (display heading, sans large)
export function SectionHeader({ index, slug, title, sub, className, planet }: Props) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const lastWordAt = title.trimEnd().lastIndexOf(' ') + 1;
  return (
    <header className={cn('mb-10 md:mb-14', className)}>
      <p className="eyebrow">
        {planet && <PixelPlanet kind={planet} size={28} className="shrink-0" />}
        <span>
          {pad(index)} / {pad(SECTION_TOTAL)} · {slug}
        </span>
      </p>
      <h2 className="editorial-h2 mt-3">
        {title.slice(0, lastWordAt)}
        <span className="serif-accent">{title.slice(lastWordAt)}</span>
      </h2>
      {sub && (
        <p className="mt-2 max-w-[65ch] text-lg text-muted">{sub}</p>
      )}
    </header>
  );
}
