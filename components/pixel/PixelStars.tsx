const STARS = [
  { x: 3, y: 8, size: 2, tone: 'bg-line' },
  { x: 12, y: 21, size: 3, tone: 'bg-line' },
  { x: 21, y: 6, size: 2, tone: 'bg-line' },
  { x: 31, y: 34, size: 2, tone: 'bg-line' },
  { x: 42, y: 15, size: 3, tone: 'bg-line' },
  { x: 51, y: 42, size: 2, tone: 'bg-line' },
  { x: 62, y: 9, size: 2, tone: 'bg-line' },
  { x: 73, y: 29, size: 3, tone: 'bg-line' },
  { x: 84, y: 13, size: 2, tone: 'bg-line' },
  { x: 96, y: 37, size: 2, tone: 'bg-line' },
  { x: 7, y: 63, size: 3, tone: 'bg-line' },
  { x: 27, y: 78, size: 2, tone: 'bg-line' },
  { x: 44, y: 58, size: 2, tone: 'bg-line' },
  { x: 66, y: 72, size: 3, tone: 'bg-line' },
  { x: 81, y: 55, size: 2, tone: 'bg-line' },
  { x: 93, y: 83, size: 2, tone: 'bg-line' },
  { x: 8, y: 40, size: 3, tone: 'bg-accent/40' },
  { x: 18, y: 54, size: 2, tone: 'bg-accent/40' },
  { x: 35, y: 12, size: 2, tone: 'bg-accent/40' },
  { x: 48, y: 83, size: 3, tone: 'bg-accent/40' },
  { x: 58, y: 24, size: 2, tone: 'bg-accent/40' },
  { x: 71, y: 48, size: 3, tone: 'bg-accent/40' },
  { x: 88, y: 6, size: 2, tone: 'bg-accent/40' },
  { x: 97, y: 61, size: 2, tone: 'bg-accent/40' },
] as const;

export function PixelStars() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {STARS.map(({ x, y, size, tone }, index) => (
        <span key={`${x}-${y}`} className={`pixel-star absolute ${tone}`} style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDuration: `${3 + index % 4}s`, animationDelay: `${-index * 0.37}s` }} />
      ))}
    </div>
  );
}
