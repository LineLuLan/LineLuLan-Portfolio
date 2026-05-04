'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

type Spark = { id: number; x: number; y: number };

const RAY_ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];

export function ClickSpark() {
  const reduce = useReducedMotion();
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    if (reduce) return;
    let nextId = 0;

    const onClick = (e: MouseEvent) => {
      // Skip clicks on form fields — keeps native UX clean
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      const id = nextId++;
      setSparks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== id));
      }, 550);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [reduce]);

  if (reduce) return null;

  return (
    <>
      {sparks.map((s) => (
        <div
          key={s.id}
          className="click-spark"
          style={{ left: s.x, top: s.y }}
          aria-hidden
        >
          <span className="click-spark__ring" />
          {RAY_ROTATIONS.map((rot) => (
            <span
              key={rot}
              className="click-spark__ray"
              style={{ ['--ray-rot' as string]: `${rot}deg` } as CSSProperties}
            />
          ))}
        </div>
      ))}
    </>
  );
}
