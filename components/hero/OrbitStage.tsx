'use client';

import { useEffect, type PointerEvent, type ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';

const spring = { stiffness: 160, damping: 24, mass: 0.7 };

// Keep the SVG and its links server-rendered; only this wrapper follows the pointer.
export function OrbitStage({ children }: { children: ReactNode }) {
  const { reducedMotion } = useTheme();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    if (!reducedMotion) return;
    [rotateX, rotateY, x, y].forEach((value) => value.jump(0));
  }, [reducedMotion, rotateX, rotateY, x, y]);

  function reset() {
    [rotateX, rotateY, x, y].forEach((value) => value.set(0));
  }

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== 'mouse' ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        event.currentTarget.contains(document.activeElement)) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const vertical = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    rotateX.set(-vertical * 3);
    rotateY.set(horizontal * 3);
    x.set(horizontal * 5);
    y.set(vertical * 5);
  }

  return (
    <div className="orbit-stage" onPointerMove={followPointer} onPointerLeave={reset}
      onPointerCancel={reset} onFocusCapture={reset}>
      <div className="orbit-stage__halo" aria-hidden="true" />
      <motion.div className="orbit-stage__art" style={{ rotateX, rotateY, x, y, transformPerspective: 900 }}>
        {children}
      </motion.div>
    </div>
  );
}
