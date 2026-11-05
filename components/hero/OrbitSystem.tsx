import { PixelPlanetGlyph } from '@/components/pixel/PixelPlanet';
import { capitalize } from '@/lib/cn';
import { AVATAR_PATH, SECTIONS, SECTION_ORDER, type SectionId } from '@/lib/constants';
import { SECTION_PLANET } from '@/lib/pixel-planets';

const ORBITS = [
  { rx: 110, ry: 46 },
  { rx: 165, ry: 69 },
  { rx: 220, ry: 92 },
  { rx: 268, ry: 112 },
] as const;

const PLACEMENTS: Record<SectionId, { ring: number; angle: number; size: number }> = {
  whoami: { ring: 3, angle: 20, size: 64 },
  about: { ring: 2, angle: 200, size: 48 },
  stack: { ring: 1, angle: 300, size: 34 },
  work: { ring: 4, angle: 150, size: 64 },
  framework: { ring: 3, angle: 230, size: 52 },
  record: { ring: 2, angle: 60, size: 34 },
  contact: { ring: 4, angle: 330, size: 42 },
};

// Intent: native section navigation that works without hydration; CSS owns all motion.
// Status: R1 implemented. Next: supervisor visual review. Blockers: none.
// Confidence: typed placements; DOM order follows the section registry for keyboard access.
export function OrbitSystem() {
  return (
    <svg viewBox="0 0 560 560" role="group" aria-label="Sections as planets" className="orbit-system w-full overflow-visible">
      <defs>
        <clipPath id="orbit-avatar"><circle cx={280} cy={280} r={48} /></clipPath>
      </defs>
      <image href={AVATAR_PATH} x={232} y={232} width={96} height={96} clipPath="url(#orbit-avatar)" preserveAspectRatio="xMidYMid slice" />
      <circle cx={280} cy={280} r={52} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
      <circle cx={280} cy={280} r={60} fill="none" stroke="var(--color-line)" strokeDasharray="2 4" />
      <g className="orbit-rings">
        <g transform="rotate(-18 280 280)">
          {ORBITS.map(({ rx, ry }) => (
            <ellipse key={rx} cx={280} cy={280} rx={rx} ry={ry} stroke="var(--color-line)" strokeWidth={1} fill="none" />
          ))}
          {SECTION_ORDER.map((id) => {
            const { ring, angle, size } = PLACEMENTS[id];
            const { rx, ry } = ORBITS[ring - 1]!;
            const radians = angle * Math.PI / 180;
            const x = 280 + rx * Math.cos(radians);
            const y = 280 + ry * Math.sin(radians);
            const label = capitalize(SECTIONS[id].label);
            const labelWidth = 10 * label.length + 20;

            return (
              <g key={id} transform={`translate(${x} ${y})`}>
                {/* Cancel the fixed tilt before counter-rotating the sprite and its label. */}
                <g transform="rotate(18)">
                  <g className="orbit-planet">
                    <a href={`#${SECTIONS[id].id}`} aria-label={`Go to ${label}`} className="orbit-planet-link" tabIndex={0}>
                      <circle r={Math.max(22, size / 2 + 4)} fill="transparent" />
                      <circle className="orbit-focus-ring" r={Math.max(22, size / 2 + 4)} fill="none" stroke="var(--color-accent)" strokeWidth={2} />
                      <g className="orbit-sprite">
                        <svg x={-size / 2} y={-size / 2} width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
                          <PixelPlanetGlyph kind={SECTION_PLANET[id]} />
                        </svg>
                      </g>
                      <g className="orbit-label" transform={`translate(0 ${size / 2 + 8})`} aria-hidden="true">
                        <rect x={-labelWidth / 2} width={labelWidth} height={28} rx={4} fill="var(--color-panel)" stroke="var(--color-line)" />
                        <text y={19} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize={15} fill="var(--color-ink)">{label}</text>
                      </g>
                    </a>
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}
