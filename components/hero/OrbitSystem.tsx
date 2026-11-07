// Intent: server-render eight native section links, enhanced into Line's Pisces table of contents.
// Status: shared fit and original 730×524 orbit frame; one persistent anchor per section.
// Next: maintain geometry/input regression coverage. Blockers: none. Confidence: shared static checker.
import type { CSSProperties } from 'react';
import { PixelPlanetGlyph } from '@/components/pixel/PixelPlanet';
import { capitalize } from '@/lib/cn';
import { AVATAR_PATH, SECTIONS, SECTION_ORDER } from '@/lib/constants';
import layout from '@/lib/orbit-layout.json';
import { PLANETS, type PlanetKind } from '@/lib/pixel-planets';
import { fitConstellation, labelWidth, orbitFrame } from '@/lib/constellation-fit';
import { PISCES } from './pisces';
import { OrbitController } from './OrbitController';

const sections = SECTION_ORDER.map((id) => ({ id, label: SECTIONS[id].label, size: layout.planets[id].size }));
const frame = orbitFrame(layout, sections);
const fitted = fitConstellation(PISCES, frame, sections, layout.hoverScale);

export function OrbitSystem() {
  return (
    <OrbitController targets={fitted.planets}>
      <svg viewBox={`0 0 ${frame.width} ${frame.height}`} role="group" aria-label="Sections as planets" className="orbit-system w-full" style={{ '--orbit-hover-scale': layout.hoverScale } as CSSProperties}>
        <g className="pisces-lines" aria-hidden="true">
          {PISCES.lines.map(([from, to], index) => {
            const a = fitted.stars[from]!;
            const b = fitted.stars[to]!;
            return <path key={`${from}-${to}`} className="pisces-line" style={{ '--line-index': index } as CSSProperties} data-from={from} data-to={to} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} pathLength={1} fill="none" stroke="var(--color-accent)" strokeWidth={1.5} />;
          })}
        </g>
        <g className="pisces-stars" aria-hidden="true">
          {Object.keys(PISCES.minor).map((id, index) => <circle key={id} className={id.startsWith('faint') ? 'pisces-star pisces-star-faint' : 'pisces-star'} cx={fitted.stars[id]!.x} cy={fitted.stars[id]!.y} r={1.5} fill="var(--color-ink)" style={{ '--star-delay': `${index * 170}ms` } as CSSProperties} />)}
        </g>
        <g transform={`translate(${frame.cx} ${frame.cy})`}>
          <defs>
            <clipPath id="orbit-avatar"><circle r={layout.avatarRadius} /></clipPath>
            <radialGradient id="orbit-avatar-glow">
              <stop offset="0%" stopColor="var(--color-tint-a)" stopOpacity={0.8} />
              <stop offset="100%" stopColor="var(--color-tint-a)" stopOpacity={0} />
            </radialGradient>
          </defs>
          <g className="orbit-avatar">
            <circle r={layout.avatarRadius + 32} fill="url(#orbit-avatar-glow)" />
            <image href={AVATAR_PATH} x={-layout.avatarRadius} y={-layout.avatarRadius} width={layout.avatarRadius * 2} height={layout.avatarRadius * 2} clipPath="url(#orbit-avatar)" preserveAspectRatio="xMidYMid slice" />
            <circle r={layout.avatarRadius} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
          </g>
          <g className="orbit-rings" transform={`rotate(${layout.tilt})`}>
            {layout.rings.map(({ rx }, ring) => <ellipse key={rx} data-ring={ring} className="orbit-track" rx={rx} ry={rx * layout.ratio} fill="none" stroke="var(--color-line)" strokeWidth={1.5} />)}
          </g>
          {SECTION_ORDER.map((id, index) => {
            const { ring, phase, size, kind } = layout.planets[id];
            const { rx, period } = layout.rings[ring]!;
            const label = capitalize(SECTIONS[id].label);
            const width = labelWidth(label);
            const hitRadius = Math.max(22, size / 2 + 4);
            const star = fitted.planets[index]!;
            const dimension = PLANETS[kind as PlanetKind].length;
            return (
              <g key={id} transform={`rotate(${layout.tilt})`} style={{ '--orbit-period': `${period}s`, '--flight-delay': `${index * 40}ms` } as CSSProperties}>
                <g transform={`scale(1 ${layout.ratio})`}><g transform={`rotate(${phase})`}>
                  <g className="orbit-revolve"><g transform={`translate(${rx} 0)`}><g className="orbit-counter-revolve">
                    <g transform={`rotate(${-phase})`}><g transform={`scale(1 ${1 / layout.ratio})`}>
                      <g transform={`rotate(${-layout.tilt})`} data-home={id}>
                        <g className="orbit-flight">
                          <a href={`#${SECTIONS[id].id}`} aria-label={`${index + 1} ${label}`} className="orbit-planet-link" data-section={id} data-ring={ring} tabIndex={0}>
                            <circle r={hitRadius} fill="transparent" />
                            <circle className="orbit-focus-ring" r={hitRadius} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
                            <g className="orbit-sprite"><svg x={-size / 2} y={-size / 2} width={size} height={size} viewBox={`0 0 ${dimension} ${dimension}`} shapeRendering="crispEdges" aria-hidden="true" focusable="false"><PixelPlanetGlyph kind={kind as PlanetKind} /></svg></g>
                            <g className="orbit-label" transform={`translate(0 ${size / 2 + 8})`} aria-hidden="true">
                              <rect x={-width / 2} width={width} height={28} rx={4} fill="var(--color-panel)" stroke="var(--color-line)" />
                              <text y={19} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize={14} fill="var(--color-ink)">{label}</text>
                            </g>
                            <g className="pisces-label" transform={`translate(${star.label.x - star.x} ${star.label.y - star.y})`} aria-hidden="true">
                              <rect width={star.label.width} height={star.label.height} rx={4} fill="var(--color-panel)" stroke="var(--color-line)" />
                              <text x={star.label.width / 2} y={19} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize={14} fill="var(--color-ink)">{star.text}</text>
                            </g>
                          </a>
                        </g>
                      </g>
                    </g></g>
                  </g></g></g>
                </g></g>
              </g>
            );
          })}
        </g>
      </svg>
    </OrbitController>
  );
}
