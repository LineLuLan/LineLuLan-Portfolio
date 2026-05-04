// Pure CSS shooting stars + twinkling background. Server-renderable, no JS state.
// To tune density, edit the seed arrays below.

import type { CSSProperties } from 'react';

type ShootingStar = {
  top: string;
  left: string;
  delay: string;
  duration: string;
};

type Twinkle = {
  top: string;
  left: string;
  delay: string;
  duration: string;
};

const SHOOTING_STARS: ShootingStar[] = [
  { top: '8%', left: '95%', delay: '0s', duration: '7s' },
  { top: '14%', left: '92%', delay: '2.4s', duration: '8s' },
  { top: '32%', left: '98%', delay: '5.2s', duration: '6.5s' },
  { top: '5%', left: '85%', delay: '8.6s', duration: '9s' },
  { top: '22%', left: '88%', delay: '11.5s', duration: '7.5s' },
  { top: '40%', left: '95%', delay: '14.8s', duration: '8.5s' },
];

const TWINKLES: Twinkle[] = Array.from({ length: 36 }).map((_, i) => ({
  top: `${(i * 137) % 100}%`,
  left: `${(i * 73) % 100}%`,
  delay: `${(i * 0.41) % 4}s`,
  duration: `${2.5 + ((i * 0.31) % 2.5)}s`,
}));

const NEBULAS = [
  {
    style: {
      top: '-8%',
      left: '20%',
      width: '440px',
      height: '440px',
      background: 'radial-gradient(circle, rgba(138,43,226,0.18), transparent 70%)',
      animationDuration: '26s',
    } as CSSProperties,
  },
  {
    style: {
      top: '38%',
      right: '15%',
      width: '520px',
      height: '520px',
      background: 'radial-gradient(circle, rgba(199,21,133,0.12), transparent 70%)',
      animationDuration: '32s',
      animationDelay: '-8s',
    } as CSSProperties,
  },
  {
    style: {
      bottom: '-10%',
      left: '40%',
      width: '380px',
      height: '380px',
      background: 'radial-gradient(circle, rgba(224,123,151,0.10), transparent 70%)',
      animationDuration: '28s',
      animationDelay: '-14s',
    } as CSSProperties,
  },
];

export function StarField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* nebulas (drifting blurred orbs) */}
      {NEBULAS.map((n, i) => (
        <div key={`n-${i}`} className="nebula-orb" style={n.style} />
      ))}

      {/* twinkling static stars */}
      {TWINKLES.map((t, i) => (
        <span
          key={`t-${i}`}
          className="twinkle-star"
          style={
            {
              top: t.top,
              left: t.left,
              ['--twinkle-delay' as string]: t.delay,
              ['--twinkle-duration' as string]: t.duration,
            } as CSSProperties
          }
        />
      ))}

      {/* shooting stars (diagonal streaks) */}
      {SHOOTING_STARS.map((s, i) => (
        <span
          key={`s-${i}`}
          className="shooting-star"
          style={
            {
              ['--star-top' as string]: s.top,
              ['--star-left' as string]: s.left,
              ['--star-delay' as string]: s.delay,
              ['--star-duration' as string]: s.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
