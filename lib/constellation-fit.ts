// Intent: share orbit framing and uniform Pisces fit between rendering and the static gate.
// Status: unchanged orbit footprint; sprites and label pills retain their original SVG sizes.
// Next: rerun check-constellation after geometry edits. Blockers: none. Confidence: exhaustive bounds gate.
export type Point = { x: number; y: number };
type Side = 'left' | 'right' | 'top' | 'bottom';
export type Constellation = {
  width: number;
  height: number;
  planets: Record<string, Point & { side: Side; labelGap?: number }>;
  minor: Record<string, Point>;
  lines: [string, string][];
};
type OrbitLayout = {
  tilt: number; ratio: number; hoverScale: number; padding: number;
  rings: { rx: number }[];
  planets: Record<string, { ring: number; size: number }>;
};
type Frame = { width: number; height: number; cx: number; cy: number };
// Room kept around the star bounding box for sprites and side labels.
export const FIT_MARGIN = { x: 120, y: 80 };
export const labelWidth = (label: string) => label.length * 9 + 20;

export function orbitFrame(layout: OrbitLayout, sections: { id: string; label: string }[]): Frame {
  const tilt = layout.tilt * Math.PI / 180;
  const bounds = sections.map(({ id, label }) => {
    const { ring, size } = layout.planets[id]!;
    const rx = layout.rings[ring]!.rx;
    const ry = rx * layout.ratio;
    const x = Math.hypot(rx * Math.cos(tilt), ry * Math.sin(tilt));
    const y = Math.hypot(rx * Math.sin(tilt), ry * Math.cos(tilt));
    const hitRadius = Math.max(22, size / 2 + 4);
    return {
      x: x + Math.max(hitRadius + 1, size / 2 * layout.hoverScale, labelWidth(label) / 2 + 1),
      top: y + Math.max(hitRadius + 1, size / 2 * layout.hoverScale),
      bottom: y + size / 2 + 8 + 28 + 1,
    };
  });
  const cx = Math.ceil(Math.max(...bounds.map((b) => b.x)) + layout.padding);
  const cy = Math.ceil(Math.max(...bounds.map((b) => b.top)) + layout.padding);
  return { width: cx * 2, height: cy + Math.ceil(Math.max(...bounds.map((b) => b.bottom)) + layout.padding), cx, cy };
}

export function fitConstellation(data: Constellation, frame: Frame, sections: { id: string; label: string; size: number }[], hoverScale: number) {
  // Reserve label space around the whole reference, then center with a single scale (no flips).
  // Fit the stars' own bounding box, not the reference canvas, so empty margins don't shrink it (Line, 2026-11-07).
  const points = [...Object.values(data.planets), ...Object.values(data.minor)];
  const minX = Math.min(...points.map((p) => p.x)), maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y)), maxY = Math.max(...points.map((p) => p.y));
  const scale = Math.min((frame.width - FIT_MARGIN.x) / (maxX - minX), (frame.height - FIT_MARGIN.y) / (maxY - minY));
  const offset = { x: (frame.width - (maxX - minX) * scale) / 2 - minX * scale, y: (frame.height - (maxY - minY) * scale) / 2 - minY * scale };
  const project = ({ x, y }: Point) => ({ x: offset.x + x * scale, y: offset.y + y * scale });
  const stars = Object.fromEntries(Object.entries({ ...data.planets, ...data.minor }).map(([id, point]) => [id, project(point)]));
  const planets = sections.map(({ id, label, size }, index) => {
    const point = stars[id]!;
    const side = data.planets[id]!.side;
    const text = `${index + 1} ${label.charAt(0).toUpperCase()}${label.slice(1)}`;
    const width = labelWidth(text);
    const height = 28;
    const radius = size / 2 * hoverScale;
    const gap = radius + 10 + (data.planets[id]!.labelGap ?? 0);
    const x = side === 'left' ? point.x - gap - width : side === 'right' ? point.x + gap : point.x - width / 2;
    const y = side === 'top' ? point.y - gap - height : side === 'bottom' ? point.y + gap : point.y - height / 2;
    return { id, number: index + 1, ...point, text, size, label: { x, y, width, height }, sprite: { x: point.x - radius, y: point.y - radius, width: radius * 2, height: radius * 2 } };
  });
  return { stars, planets, scale };
}
