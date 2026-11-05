import { PixelPlanetGlyph } from '@/components/pixel/PixelPlanet';
import { PLANETS, type PlanetKind } from '@/lib/pixel-planets';

const ORBITS: { kind: PlanetKind; rx: number; ry: number; size: number; angle: number }[] = [
  { kind: 'jupiter', rx: 200, ry: 80, size: 40, angle: 170 },
  { kind: 'saturn', rx: 150, ry: 60, size: 48, angle: -20 },
  { kind: 'mars', rx: 100, ry: 40, size: 24, angle: 100 },
];

export function OrbitArtwork() {
  return (
    <svg viewBox="0 0 480 480" className="mx-auto w-full max-w-[480px]" aria-hidden="true" focusable="false">
      <g className="orbit-rings">
        <g transform="rotate(-18 240 240)">
          {ORBITS.map(({ kind, rx, ry, size, angle }) => {
            const radians = angle * Math.PI / 180;
            const x = 240 + rx * Math.cos(radians);
            const y = 240 + ry * Math.sin(radians);
            const rows = PLANETS[kind];

            return (
              <g key={kind}>
                <ellipse cx={240} cy={240} rx={rx} ry={ry} stroke="var(--color-line)" strokeWidth={1} fill="none" />
                <g transform={`translate(${x} ${y})`}>
                  {/* Cancel the fixed ellipse tilt, then the animated orbit rotation. */}
                  <g transform="rotate(18)">
                    <g className="orbit-planet">
                      <svg x={-size / 2} y={-size / 2} width={size} height={size} viewBox={`0 0 ${rows[0]?.length ?? 0} ${rows.length}`} shapeRendering="crispEdges">
                        <PixelPlanetGlyph kind={kind} />
                      </svg>
                    </g>
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
