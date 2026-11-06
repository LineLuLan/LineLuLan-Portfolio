import type { CSSProperties } from 'react';
import { PixelPlanetGlyph } from '@/components/pixel/PixelPlanet';
import { AVATAR_PATH } from '@/lib/constants';

// A compact decorative composition; the full, linked orbit is available on larger screens.
export function MobileOrbit() {
  return (
    <div data-reveal className="mobile-orbit mx-auto w-full max-w-[340px] md:hidden" aria-hidden="true">
      <svg viewBox="0 0 340 174" className="block w-full" focusable="false">
        <defs><clipPath id="mobile-avatar"><circle cx="170" cy="87" r="33" /></clipPath></defs>
        <ellipse cx="170" cy="87" rx="133" ry="52" fill="none" stroke="var(--color-line)" />
        <ellipse cx="170" cy="87" rx="105" ry="39" fill="none" stroke="var(--color-accent)" strokeOpacity="0.18" strokeDasharray="3 7" />
        <circle className="mobile-orbit__pulse" cx="170" cy="87" r="44" fill="none" stroke="var(--color-accent)" strokeOpacity="0.2" />
        <image href={AVATAR_PATH} x="137" y="54" width="66" height="66" clipPath="url(#mobile-avatar)" />
        <circle cx="170" cy="87" r="33" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        {(['saturn', 'earth', 'moon'] as const).map((kind, index) => (
          <g key={kind} transform="translate(170 87)" style={{ '--orbit-period': '24s' } as CSSProperties}>
            <g transform="scale(1 0.391)"><g transform={`rotate(${index * 120 + 15})`}>
              <g className="orbit-revolve"><g transform="translate(133 0)">
                <g className="orbit-counter-revolve"><g transform={`rotate(${-index * 120 - 15})`}>
                  <g transform="scale(1 2.558)">
                    <svg x="-20" y="-20" width="40" height="40" viewBox="0 0 16 16" shapeRendering="crispEdges"><PixelPlanetGlyph kind={kind} /></svg>
                  </g>
                </g></g>
              </g></g>
            </g></g>
          </g>
        ))}
        <path d="M37 25v8m-4-4h8M290 138v8m-4-4h8" stroke="var(--color-accent)" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}
