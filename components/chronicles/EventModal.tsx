'use client';

import { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChronicleEvent } from '@/types';

type Props = {
  event: ChronicleEvent | null;
  onClose: () => void;
};

export function EventModal({ event, onClose }: Props) {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="card-glass w-full max-w-md border border-border-glow p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-text-tertiary">{event.date}</p>
                <h2 id="event-modal-title" className="mt-1 text-lg text-text-primary">{event.title}</h2>
                {event.org && (
                  <p className="mt-1 font-mono text-xs text-accent-pink">{event.org}</p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded p-1 text-text-secondary hover:text-accent-pink"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            {event.description && (
              <p className="mt-4 text-sm text-text-secondary">{event.description}</p>
            )}
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-accent-pink hover:underline"
              >
                <ExternalLink size={12} aria-hidden /> learn more
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
