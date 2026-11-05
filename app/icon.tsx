import { ImageResponse } from 'next/og';
import { PLANETS } from '@/lib/pixel-planets';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// ImageResponse cannot resolve CSS variables; these are the Orbit Saturn colors.
const colors: Record<string, string> = { a: '#8F2D9A', h: '#6F2278', p: '#E07B97', l: '#EFE6F6' };

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: 32, height: 32, borderRadius: 16, background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 16 16" width={24} height={24} shapeRendering="crispEdges">
        {PLANETS.saturn.flatMap((row, y) => [...row].map((cell, x) => cell === '.' ? null : (
          <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[cell]} />
        )))}
      </svg>
    </div>,
    size,
  );
}
