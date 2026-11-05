import { PLANETS, type PlanetKind } from '@/lib/pixel-planets';

const LEGEND: Record<string, string> = {
  i: 'var(--color-ink)',
  a: 'var(--color-accent)',
  h: 'var(--color-accent-hover)',
  p: '#E07B97',
  l: 'var(--color-tint-a)',
  b: 'var(--color-tint-b)',
  m: 'var(--color-tint-c)',
  s: 'var(--color-surface)',
  w: 'var(--color-panel)',
};

type Props = { kind: PlanetKind; size?: number; className?: string; label?: string };

function planetRects(kind: PlanetKind) {
  return PLANETS[kind].flatMap((row, y) => [...row].map((cell, x) => cell === '.' ? null : (
    <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={LEGEND[cell]} />
  )));
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
