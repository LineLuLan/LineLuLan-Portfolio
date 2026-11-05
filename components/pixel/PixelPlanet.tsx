import { PLANETS, type PlanetKind } from '@/lib/pixel-planets';

const LEGEND: Record<string, string> = {
  i: 'var(--color-ink)',
  a: 'var(--color-accent)',
  h: 'var(--color-accent-hover)',
  p: 'var(--planet-pink)',
  l: 'var(--color-tint-a)',
  b: 'var(--color-tint-b)',
  m: 'var(--color-tint-c)',
  s: 'var(--color-surface)',
  w: 'var(--color-panel)',
};

type Props = { kind: PlanetKind; size?: number; className?: string; label?: string };

// One <path> per color instead of one <rect> per cell: ~120 nodes → ~5 per sprite (DOM size audit).
const PATH_CACHE = new Map<PlanetKind, { fill: string; d: string }[]>();

function planetPaths(kind: PlanetKind) {
  const cached = PATH_CACHE.get(kind);
  if (cached) return cached;
  const byColor = new Map<string, string[]>();
  PLANETS[kind].forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === '.' || !LEGEND[cell]) return;
      const parts = byColor.get(cell) ?? [];
      parts.push(`M${x} ${y}h1v1h-1z`);
      byColor.set(cell, parts);
    });
  });
  const paths = [...byColor.entries()].map(([cell, parts]) => ({ fill: LEGEND[cell] as string, d: parts.join('') }));
  PATH_CACHE.set(kind, paths);
  return paths;
}

function planetRects(kind: PlanetKind) {
  return planetPaths(kind).map(({ fill, d }) => <path key={fill} fill={fill} d={d} />);
}

export function PixelPlanetGlyph({ kind }: Pick<Props, 'kind'>) {
  return <g>{planetRects(kind)}</g>;
}

export function PixelPlanet({ kind, size = 32, className, label }: Props) {
  const rows = PLANETS[kind];
  const height = rows.length;
  const width = rows[0]?.length ?? 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      {planetRects(kind)}
    </svg>
  );
}
