'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

// Decorative, local to the hero. No React updates in the animation loop.
export function ConstellationField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { reducedMotion, mode, accent } = useTheme();

  useEffect(() => {
    const element = canvas.current;
    const section = element?.closest('section');
    const context = element?.getContext('2d');
    if (!element || !section || !context) return;
    if (reducedMotion) {
      context.clearRect(0, 0, element.width, element.height);
      return;
    }

    const color = getComputedStyle(element).getPropertyValue('--color-accent').trim();
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const pointer = { x: -1000, y: -1000 };
    // Stable seeds keep resizing and palette changes from scattering the stars.
    const stars = Array.from({ length: 38 }, (_, index) => ({
      x: ((index * 73 + 19) % 101) / 101,
      y: ((index * 47 + 11) % 97) / 97,
      phase: index * 2.4,
    }));
    let width = 1;
    let height = 1;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let visible = false;

    function draw() {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      context.strokeStyle = color;
      const points = stars.slice(0, width < 768 ? 24 : 38).map((star) => ({
        x: star.x * width + Math.sin(elapsed / 12000 + star.phase) * 18,
        y: star.y * height + Math.cos(elapsed / 16000 + star.phase) * 14,
      }));
      for (let index = 0; index < points.length; index++) {
        const point = points[index]!;
        const proximity = Math.max(0, 1 - Math.hypot(point.x - pointer.x, point.y - pointer.y) / 180);
        for (let next = index + 1; next < points.length; next++) {
          const neighbor = points[next]!;
          const distance = Math.hypot(point.x - neighbor.x, point.y - neighbor.y);
          if (distance > 145) continue;
          context.globalAlpha = (1 - distance / 145) * (0.16 + proximity * 0.35);
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(neighbor.x, neighbor.y);
          context.stroke();
        }
        context.globalAlpha = 0.2 + proximity * 0.5;
        const size = proximity > 0.5 ? 3 : 2;
        context.fillRect(Math.round(point.x), Math.round(point.y), size, size);
      }
      context.globalAlpha = 1;
    }

    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - previous >= 1000 / 30) {
        elapsed += previous ? Math.min(now - previous, 80) : 0;
        previous = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }
    function syncPlayback() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function resize() {
      if (!element || !section || !context) return;
      width = section.clientWidth;
      height = section.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    }
    function follow(event: PointerEvent) {
      if (!section || event.pointerType !== 'mouse' || !finePointer.matches) return;
      const bounds = section.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    }
    function leave() { pointer.x = pointer.y = -1000; }

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      syncPlayback();
    });
    resize();
    resizeObserver.observe(section);
    visibilityObserver.observe(section);
    section.addEventListener('pointermove', follow, { passive: true });
    section.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      section.removeEventListener('pointermove', follow);
      section.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', syncPlayback);
    };
  }, [reducedMotion, mode, accent]);

  return <canvas ref={canvas} className="constellation-field" aria-hidden="true" />;
}
