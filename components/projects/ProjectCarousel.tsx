'use client';

// Intent: keep coverflow motion on one coordinate system and pass server-fetched adoption to cards.
// Status: implemented. Next: gesture acceptance. Blockers: none. Confidence: state boundary and HF tests.
import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useDragControls, useMotionValue, useTransform, type MotionStyle, type MotionValue, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ProjectSlide } from './ProjectSlide';
import { coverflowState, slidePosition, swipeDirection, wheelDirection, wrapIndex } from './carousel-state';
import type { Project } from '@/types';

const spring = { type: 'spring' as const, stiffness: 280, damping: 32 };

function CoverflowSlide({ project, hfDownloads, githubStars, index, count, position, recycled, active, dragX, width, select }: {
  project: Project; index: number; count: number; position: number; recycled: boolean; active: boolean;
  hfDownloads?: number | null;
  githubStars?: number | null;
  dragX: MotionValue<number>; width: MotionValue<number>; select: (index: number) => void;
}) {
  const { reducedMotion } = useTheme();
  const slot = useMotionValue(position);
  useEffect(() => {
    if (recycled || reducedMotion) { slot.jump(position); return; }
    const animation = animate(slot, position, spring);
    return () => animation.stop();
  }, [position, recycled, reducedMotion, slot]);
  const distance = useTransform(() => slot.get() + dragX.get() / (width.get() * 1.04));
  const x = useTransform(slot, (value) => `${value * 104}%`);
  const rotateY = useTransform(distance, (value) => coverflowState(value).rotateY);
  const scale = useTransform(distance, (value) => coverflowState(value).scale);
  const z = useTransform(distance, (value) => coverflowState(value).z);
  const opacity = useTransform(distance, (value) => coverflowState(value).opacity);
  const filter = useTransform(distance, (value) => `blur(${coverflowState(value).blur}px)`);
  const zIndex = useTransform(distance, (value) => 10 - Math.round(Math.abs(value) * 3));
  const visibility = useTransform(distance, (value) => Math.abs(value) > 1.8 ? 'hidden' as const : 'visible' as const);

  return (
    <motion.div role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}: ${project.name}`}
      aria-hidden={!active} className="coverflow-slide relative min-w-0 [grid-area:1/1]"
      style={{ x, '--coverflow-x': x, zIndex, visibility, rotateY: reducedMotion ? 0 : rotateY, scale: reducedMotion ? 1 : scale,
        z: reducedMotion ? 0 : z, opacity: reducedMotion ? (active ? 1 : 0.55) : opacity, filter: reducedMotion ? 'none' : filter } as MotionStyle}>
      <div ref={(element) => { if (element) element.inert = !active; }} className="h-full">
        <ProjectSlide project={project} hfDownloads={hfDownloads} githubStars={githubStars} index={index} active={active} dragX={dragX} />
      </div>
      {!active && <button type="button" tabIndex={-1} aria-label={`Show ${project.name}`} onClick={() => select(index)}
        className="absolute inset-0 cursor-pointer rounded-[var(--theme-radius)]" />}
    </motion.div>
  );
}

export function ProjectCarousel({ projects, hfDownloads = {}, githubStars = {} }: { projects: Project[]; hfDownloads?: Record<string, number | null>; githubStars?: Record<string, number | null> }) {
  const [{ active, previous }, setSelection] = useState({ active: 0, previous: 0 });
  const { reducedMotion } = useTheme();
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const wheel = useRef({ x: 0, last: 0, consumed: false });
  const controls = useDragControls();
  const x = useMotionValue(0);
  const width = useMotionValue(1);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const count = projects.length;
  const transition = reducedMotion ? { duration: 0 } : spring;

  useEffect(() => {
    if (reducedMotion) { x.jump(0); setCursorVisible(false); }
    return () => x.stop();
  }, [reducedMotion, x]);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => width.set(Math.max(1, element.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  const select = useCallback((index: number) => {
    if (!count) return;
    // Do not leave focus on a link that is about to become inert.
    if (track.current?.contains(document.activeElement)) region.current?.focus({ preventScroll: true });
    setSelection((selection) => ({ active: wrapIndex(index, count), previous: selection.active }));
  }, [count]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    function swipe(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.2) return;
      event.preventDefault();
      const gesture = wheel.current;
      if (event.timeStamp - gesture.last > 180) { gesture.x = 0; gesture.consumed = false; }
      gesture.last = event.timeStamp;
      if (gesture.consumed || dragging.current && isDragging) return;
      const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width.get() : 1;
      if (Math.sign(gesture.x) !== Math.sign(event.deltaX)) gesture.x = 0;
      gesture.x += event.deltaX * multiplier;
      const direction = wheelDirection(gesture.x, event.deltaY * multiplier);
      if (direction) { gesture.consumed = true; select(active + direction); }
    }
    element.addEventListener('wheel', swipe, { passive: false });
    return () => element.removeEventListener('wheel', swipe);
  }, [active, select, width, isDragging]);

  function endDrag(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setIsDragging(false);
    const direction = swipeDirection(info.offset.x, info.velocity.x, width.get());
    if (direction) select(active + direction);
    animate(x, 0, transition);
  }

  if (!count) return null;

  return (
    <div ref={region} role="region" aria-roledescription="carousel" aria-label="Projects" tabIndex={0} className="min-w-0"
      onKeyDownCapture={() => { dragging.current = false; }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        select(active + (event.key === 'ArrowRight' ? 1 : -1));
      }}>
      <div ref={viewport} className="carousel-viewport relative -mx-6 overflow-hidden py-4 md:mx-0"
        onPointerLeave={() => setCursorVisible(false)}
        onPointerMove={(event) => {
          const interactive = event.target instanceof Element && !!event.target.closest('a, button');
          const show = !reducedMotion && event.pointerType === 'mouse' && !interactive && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
          setCursorVisible(show);
          const box = event.currentTarget.getBoundingClientRect();
          cursorX.set(event.clientX - box.left + 14);
          cursorY.set(event.clientY - box.top + 14);
        }}>
        <motion.div ref={track} drag="x" dragControls={controls} dragListener={false}
          dragConstraints={{ left: 0, right: 0 }} dragElastic={1} dragMomentum={false}
          style={{ x, touchAction: 'pan-y', perspective: 1400 }}
          onPointerDownCapture={() => { dragging.current = false; }}
          onPointerDown={(event) => {
            if (event.button !== 0 || (event.target instanceof Element && event.target.closest('a, button'))) return;
            controls.start(event);
          }}
          onDragStart={() => { dragging.current = true; setIsDragging(true); x.stop(); }} onDragEnd={endDrag}
          onPointerCancel={() => { setIsDragging(false); animate(x, 0, transition); }}
          onClickCapture={(event) => { if (dragging.current) { event.preventDefault(); event.stopPropagation(); } }}
          className="carousel-track mx-auto grid w-[86vw] cursor-grab active:cursor-grabbing md:w-[72%] lg:w-[64%]">
          {projects.map((project, index) => {
            const position = slidePosition(index, active, count);
            // Recycled offscreen slides change sides instantly instead of crossing the centered story.
            const recycled = Math.abs(position - slidePosition(index, previous, count)) > 1;
            return <CoverflowSlide key={project.slug} project={project} hfDownloads={hfDownloads[project.slug]} githubStars={githubStars[project.slug]} index={index} count={count}
              position={position} recycled={recycled} active={index === active} dragX={x} width={width} select={select} />;
          })}
        </motion.div>
        {cursorVisible && !reducedMotion && <motion.span aria-hidden="true" className="carousel-drag-cursor"
          style={{ x: cursorX, y: cursorY }}>← {isDragging ? 'Release' : 'Drag'} →</motion.span>}
      </div>
      <div className="mx-auto mt-4 grid max-w-xl grid-cols-[2.75rem_1fr_2.75rem] items-center">
        <button type="button" aria-label="Previous project" onClick={() => select(active - 1)} className="motion-control grid size-11 place-items-center rounded-[var(--theme-control-radius)] border hairline text-ink hover:border-accent hover:text-accent"><ArrowLeft size={20} aria-hidden="true" /></button>
        <div className="flex justify-center" aria-label="Choose project">
          {projects.map((project, index) => (
            <button key={project.slug} type="button" aria-label={`Show ${project.name}`} aria-pressed={index === active}
              onClick={() => select(index)} className="motion-control grid h-11 w-6 place-items-center rounded-[var(--theme-control-radius)] hover:bg-tint-a sm:w-11">
              <span className={`size-2 rounded-full ${index === active ? 'bg-accent' : 'border hairline bg-panel'}`} />
            </button>
          ))}
        </div>
        <p className="col-span-3 row-start-2 text-center font-mono text-sm text-muted" aria-live="polite" aria-atomic="true"><span className="sr-only">{projects[active]?.name}, </span>{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
        <button type="button" aria-label="Next project" onClick={() => select(active + 1)} className="motion-control grid size-11 place-items-center rounded-[var(--theme-control-radius)] border hairline text-ink hover:border-accent hover:text-accent"><ArrowRight size={20} aria-hidden="true" /></button>
      </div>
      <div className="mx-auto mt-3 h-px max-w-xl bg-tint-c" aria-hidden="true">
        <motion.div initial={false} animate={{ scaleX: (active + 1) / count }} transition={transition} className="h-full origin-left bg-accent" />
      </div>
    </div>
  );
}
