'use client';

import { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChronicleEvent } from '@/types';
import { formatChronicleDate } from '@/lib/dates';

type Props = {
  event: ChronicleEvent | null;
  onClose: () => void;
};

export function EventModal({ event, onClose }: Props) {
  const { reducedMotion } = useTheme();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!event) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [event, onClose]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.2 }}
          onClick={onClose}
          // Hex-valued theme tokens need color-mix for alpha in Tailwind 3.
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_40%,transparent)] p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <motion.div
            initial={reducedMotion ? false : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-paper hairline border rounded-[var(--theme-radius)] max-h-[85dvh] overflow-y-auto p-6 md:p-8 max-w-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 break-words">
                <p className="font-mono text-sm text-muted">
                  {formatChronicleDate(event.date)}
                  {event.ongoing ? ' — Present' : event.endDate ? ` — ${formatChronicleDate(event.endDate)}` : ''}
                </p>
                <h2 id="event-modal-title" className="mt-1 font-display text-3xl font-bold text-ink">{event.title}</h2>
                {event.org && (
                  <p className="mt-1 font-mono text-sm text-muted">{event.org}</p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[var(--theme-control-radius)] text-muted hover:text-accent"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            {event.description && (
              <p className="mt-4 text-base text-ink">{event.description}</p>
            )}
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] border hairline px-4 font-mono text-sm text-ink hover:border-accent hover:text-accent"
              >
                <ExternalLink size={16} aria-hidden /> Learn more
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
