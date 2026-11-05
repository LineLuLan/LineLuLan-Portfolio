'use client';

// Intent: connect the four stages of Line's process with a quiet orbital thread.
// Status: implemented. Next: maintain motion-off parity. Blockers: none. Confidence: shared motion preference.
import { useId, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { useTheme } from '@/components/providers/ThemeProvider';
import { dabmSteps } from '@/content/dabm';

export function DABMProcess() {
  const { reducedMotion } = useTheme();
  const maskId = useId();
  const process = useRef<HTMLDivElement>(null);
  const visible = useInView(process, { once: true, amount: 0.2 });
  return (
    <div ref={process} className="relative mt-8">
      <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-4 hidden h-4 w-full text-accent lg:block" viewBox="0 0 1000 16" preserveAspectRatio="none">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="16">
            <motion.path d="M 16 8 H 770" pathLength={1} stroke="white" strokeWidth={4}
              strokeDasharray="1" initial={reducedMotion ? false : { strokeDashoffset: 1 }}
              animate={{ strokeDashoffset: reducedMotion || visible ? 0 : 1 }}
              transition={{ duration: reducedMotion ? 0 : 1.1 }} />
          </mask>
        </defs>
        <path d="M 16 8 H 770" fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="5 7" mask={`url(#${maskId})`} />
      </svg>
      <ol className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {dabmSteps.map((step, index) => (
          <motion.li key={step.letter} initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
            transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.4, delay: index * 0.1 }}
            className="min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex bg-paper p-2"><PixelPlanet kind={step.planet} size={32} /></span>
              <span className="bg-paper px-1 font-mono text-sm text-muted">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center border-2 border-accent bg-tint-a font-mono text-2xl font-bold text-accent [clip-path:polygon(4px_0,calc(100%-4px)_0,calc(100%-4px)_4px,100%_4px,100%_calc(100%-4px),calc(100%-4px)_calc(100%-4px),calc(100%-4px)_100%,4px_100%,4px_calc(100%-4px),0_calc(100%-4px),0_4px,4px_4px)]" aria-hidden="true">{step.letter}</span>
              <h3 className="font-display text-[1.375rem] font-bold text-ink">{step.label}</h3>
            </div>
            <p className="mt-4 text-base leading-relaxed text-ink">{step.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
