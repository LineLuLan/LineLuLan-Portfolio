'use client';

// Intent: fill the Framework screen with a descending, connected four-stage process.
// Status: implemented. Next: maintain motion-off parity. Blockers: none. Confidence: shared motion preference.
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { useTheme } from '@/components/providers/ThemeProvider';
import { dabmSteps } from '@/content/dabm';
import './dabm-process.css';

export function DABMProcess() {
  const { reducedMotion } = useTheme();
  const process = useRef<HTMLDivElement>(null);
  const visible = useInView(process, { once: true, amount: 0.2 });
  return (
    <div ref={process} className="dabm-process">
      <svg aria-hidden="true" className="dabm-path" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <motion.polyline points="440,100 560,200 440,300 560,400" fill="none" stroke="currentColor"
          strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          initial={false} animate={{ pathLength: reducedMotion || visible ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 1.2 }} />
      </svg>
      <ol className="dabm-steps">
        {dabmSteps.map((step, index) => (
          <li key={step.letter} className="dabm-step">
            <span className="dabm-node"><PixelPlanet kind={step.planet} size={32} /></span>
            <div data-reveal="depth" className="dabm-card surface-card">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-[var(--theme-control-radius)] border border-accent bg-tint-a font-mono text-xl font-bold text-accent" aria-hidden="true">{step.letter}</span>
                <h3 className="font-display text-[1.375rem] font-bold text-ink">{step.label}</h3>
                <span className="ml-auto font-mono text-sm text-muted">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-2 text-base leading-relaxed text-ink">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
