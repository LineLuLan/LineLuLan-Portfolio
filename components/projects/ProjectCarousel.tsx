'use client';

// Intent: center one story while keeping neighboring projects discoverable by touch and keyboard.
// Status: implemented. Next: maintain gesture coverage. Blockers: none. Confidence: threshold tests.
import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ProjectSlide } from './ProjectSlide';
import { slidePosition, swipeDirection, wrapIndex } from './carousel-state';
import type { Project } from '@/types';

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [{ active, previous }, setSelection] = useState({ active: 0, previous: 0 });
  const { reducedMotion } = useTheme();
  const track = useRef<HTMLDivElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const x = useMotionValue(0);
  const count = projects.length;
  const transition = reducedMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 280, damping: 32 };

  useEffect(() => {
    if (reducedMotion) x.set(0);
    return () => x.stop();
  }, [reducedMotion, x]);

  function select(index: number) {
    // Do not leave focus on a link that is about to become inert.
    if (track.current?.contains(document.activeElement)) region.current?.focus({ preventScroll: true });
    setSelection((selection) => ({ active: wrapIndex(index, count), previous: selection.active }));
  }

  function endDrag(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const direction = swipeDirection(info.offset.x, info.velocity.x, track.current?.clientWidth ?? 0);
    if (direction) select(active + direction);
    animate(x, 0, transition);
  }

  if (!count) return null;

  return (
    <div ref={region} role="region" aria-roledescription="carousel" aria-label="Projects" tabIndex={0}
      className="min-w-0"
      onKeyDownCapture={() => { dragging.current = false; }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        select(active + (event.key === 'ArrowRight' ? 1 : -1));
      }}>
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-2 md:left-auto md:w-full md:translate-x-0">
        <motion.div ref={track} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} dragMomentum={false}
          style={{ x, touchAction: 'pan-y' }}
          onPointerDownCapture={() => { dragging.current = false; }}
          onDragStart={() => { dragging.current = true; x.stop(); }} onDragEnd={endDrag}
          onClickCapture={(event) => { if (dragging.current) { event.preventDefault(); event.stopPropagation(); } }}
          className="mx-auto grid w-[86vw] cursor-grab active:cursor-grabbing md:w-[72%] lg:w-[64%]">
          {projects.map((project, index) => {
            const position = slidePosition(index, active, count);
            // Recycled offscreen slides change sides instantly instead of crossing the centered story.
            const recycled = Math.abs(position - slidePosition(index, previous, count)) > 1;
            const current = index === active;
            return (
              <motion.div key={project.slug} role="group" aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${project.name}`} aria-hidden={!current}
                initial={false}
                animate={{ x: `${position * 104}%`, scale: current ? 1 : 0.88, opacity: current ? 1 : 0.55 }}
                transition={recycled ? { duration: 0 } : transition}
                className="relative min-w-0 [grid-area:1/1]"
                style={{ visibility: Math.abs(position) > 1 ? 'hidden' : 'visible' }}>
                <div ref={(element) => { if (element) element.inert = !current; }} className="h-full">
                  <ProjectSlide project={project} index={index} />
                </div>
                {!current && (
                  <button type="button" tabIndex={-1} aria-label={`Show ${project.name}`} onClick={() => select(index)}
                    className="absolute inset-0 rounded-[var(--theme-radius)]" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <div className="mx-auto mt-4 grid max-w-xl grid-cols-[2.75rem_1fr_2.75rem] items-center">
        <button type="button" aria-label="Previous project" onClick={() => select(active - 1)} className="grid size-11 place-items-center rounded-[var(--theme-control-radius)] border hairline text-ink hover:border-accent hover:text-accent"><ArrowLeft size={20} aria-hidden="true" /></button>
        <div className="flex justify-center" aria-label="Choose project">
          {projects.map((project, index) => (
            <button key={project.slug} type="button" aria-label={`Show ${project.name}`} aria-pressed={index === active}
              onClick={() => select(index)} className="grid size-11 place-items-center rounded-[var(--theme-control-radius)] hover:bg-tint-a">
              <span className={`size-2 rounded-full ${index === active ? 'bg-accent' : 'border hairline bg-panel'}`} />
            </button>
          ))}
        </div>
        <p className="col-span-3 row-start-2 text-center font-mono text-sm text-muted" aria-live="polite" aria-atomic="true"><span className="sr-only">{projects[active]?.name}, </span>{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</p>
        <button type="button" aria-label="Next project" onClick={() => select(active + 1)} className="grid size-11 place-items-center rounded-[var(--theme-control-radius)] border hairline text-ink hover:border-accent hover:text-accent"><ArrowRight size={20} aria-hidden="true" /></button>
      </div>
      <div className="mx-auto mt-3 h-px max-w-xl bg-tint-c" aria-hidden="true">
        <motion.div initial={false} animate={{ scaleX: (active + 1) / count }} transition={transition} className="h-full origin-left bg-accent" />
      </div>
    </div>
  );
}
