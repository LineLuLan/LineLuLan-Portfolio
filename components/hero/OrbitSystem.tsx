import type { CSSProperties } from 'react';
import { PixelPlanetGlyph } from '@/components/pixel/PixelPlanet';
import { capitalize } from '@/lib/cn';
import { AVATAR_PATH, SECTIONS, SECTION_ORDER } from '@/lib/constants';
import layout from '@/lib/orbit-layout.json';
import type { PlanetKind } from '@/lib/pixel-planets';

const tilt = layout.tilt * Math.PI / 180;
const labelWidth = (label: string) => label.length * 9 + 20;
const orbitSections = SECTION_ORDER.filter((id): id is Exclude<typeof id, 'experience'> => id !== 'experience');
const bounds = orbitSections.map((id) => {
  const { ring, size } = layout.planets[id];
  const { rx } = layout.rings[ring]!;
  const ry = rx * layout.ratio;
  const x = Math.hypot(rx * Math.cos(tilt), ry * Math.sin(tilt));
  const y = Math.hypot(rx * Math.sin(tilt), ry * Math.cos(tilt));
  const hitRadius = Math.max(22, size / 2 + 4);
  const spriteRadius = size / 2 * layout.hoverScale;
  return {
    x: x + Math.max(hitRadius + 1, spriteRadius, labelWidth(capitalize(SECTIONS[id].label)) / 2 + 1),
    top: y + Math.max(hitRadius + 1, spriteRadius),
    bottom: y + size / 2 + 8 + 28 + 1,
  };
});
const halfWidth = Math.ceil(Math.max(...bounds.map(({ x }) => x)) + layout.padding);
const top = Math.ceil(Math.max(...bounds.map((bound) => bound.top)) + layout.padding);
const bottom = Math.ceil(Math.max(...bounds.map((bound) => bound.bottom)) + layout.padding);

// Intent: upright CSS-driven elliptical orbits with native section links and no hydration.
// Status: R2 geometry passes the painted-cell sweep, including hover scale.
// Next: visual review. Blockers: none. Confidence: shared geometry; 2,340-second sweep.
export function OrbitSystem() {
  return (
    <figure className="orbit-figure">
      <svg viewBox={`0 0 ${halfWidth * 2} ${top + bottom}`} role="group" aria-label="Sections as planets" className="orbit-system w-full" style={{ '--orbit-hover-scale': layout.hoverScale } as CSSProperties}>
        <g transform={`translate(${halfWidth} ${top})`}>
        <defs>
          <clipPath id="orbit-avatar"><circle r={layout.avatarRadius} /></clipPath>
          <radialGradient id="orbit-avatar-glow">
            <stop offset="0%" stopColor="var(--color-tint-a)" stopOpacity={0.8} />
            <stop offset="100%" stopColor="var(--color-tint-a)" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle r={layout.avatarRadius + 32} fill="url(#orbit-avatar-glow)" />
        <g transform={`rotate(${layout.tilt})`}>
          {layout.rings.map(({ rx }, ring) => <ellipse key={rx} data-ring={ring} className="orbit-track" rx={rx} ry={rx * layout.ratio} fill="none" stroke="var(--color-line)" strokeWidth={1.5} />)}
        </g>
        <image href={AVATAR_PATH} x={-layout.avatarRadius} y={-layout.avatarRadius} width={layout.avatarRadius * 2} height={layout.avatarRadius * 2} clipPath="url(#orbit-avatar)" preserveAspectRatio="xMidYMid slice" />
        <circle r={layout.avatarRadius} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
        {orbitSections.map((id) => {
          const { ring, phase, size, kind } = layout.planets[id];
          const { rx, period } = layout.rings[ring]!;
          const label = capitalize(SECTIONS[id].label);
          const width = labelWidth(label);
          const hitRadius = Math.max(22, size / 2 + 4);

          return (
            <g key={id} transform={`rotate(${layout.tilt})`} style={{ '--orbit-period': `${period}s` } as CSSProperties}>
              <g transform={`scale(1 ${layout.ratio})`}>
                <g transform={`rotate(${phase})`}>
                  <g className="orbit-revolve">
                    <g transform={`translate(${rx} 0)`}>
                      <g className="orbit-counter-revolve">
                        {/* Inverse transforms keep the sprite, hit target and label upright and round. */}
                        <g transform={`rotate(${-phase})`}>
                          <g transform={`scale(1 ${1 / layout.ratio})`}>
                            <g transform={`rotate(${-layout.tilt})`}>
                              <a href={`#${SECTIONS[id].id}`} aria-label={`Go to ${label}`} className="orbit-planet-link" data-ring={ring} tabIndex={0}>
                                <circle r={hitRadius} fill="transparent" />
                                <circle className="orbit-focus-ring" r={hitRadius} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
                                <g className="orbit-sprite">
                                  <svg x={-size / 2} y={-size / 2} width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
                                    <PixelPlanetGlyph kind={kind as PlanetKind} />
                                  </svg>
                                </g>
                                <g className="orbit-label" transform={`translate(0 ${size / 2 + 8})`} aria-hidden="true">
                                  <rect x={-width / 2} width={width} height={28} rx={4} fill="var(--color-panel)" stroke="var(--color-line)" />
                                  <text y={19} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize={14} fill="var(--color-ink)">{label}</text>
                                </g>
                              </a>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          );
        })}
        </g>
      </svg>
      <figcaption className="orbit-caption">Hover a planet · click to jump</figcaption>
    </figure>
  );
}
