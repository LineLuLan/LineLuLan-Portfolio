'use client';

import { useEffect, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionTemplate, useSpring } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';

const spring = { stiffness: 180, damping: 26, mass: 0.65 };

export function ProjectSurface({ children, active, className }: { children: ReactNode; active: boolean; className: string }) {
  const { reducedMotion } = useTheme();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const lightX = useSpring(50, spring);
  const lightY = useSpring(50, spring);
  const light = useSpring(0, spring);
  const background = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 65%)`;

  useEffect(() => {
    if (active && !reducedMotion) return;
    [rotateX, rotateY, light].forEach((value) => value.jump(0));
  }, [active, reducedMotion, rotateX, rotateY, light]);

  function reset() {
    [rotateX, rotateY, light].forEach((value) => value.set(0));
  }
  function follow(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !active || event.buttons || event.pointerType !== 'mouse' ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        event.currentTarget.contains(document.activeElement)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    rotateX.set((0.5 - y) * 7);
    rotateY.set((x - 0.5) * 7);
    lightX.set(x * 100);
    lightY.set(y * 100);
    light.set(1);
  }

  return (
    <div className="project-surface h-full" onPointerMove={follow} onPointerLeave={reset}
      onPointerDown={reset} onPointerCancel={reset} onFocusCapture={reset}>
      <motion.article className={className} data-active={active} style={{ rotateX, rotateY, transformPerspective: 1000 }}>
        <motion.div className="project-card__light" style={{ background, opacity: light }} aria-hidden="true" />
        {children}
      </motion.article>
    </div>
  );
}
