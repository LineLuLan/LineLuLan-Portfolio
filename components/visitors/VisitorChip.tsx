'use client';

// Intent: add an accessible visitor disclosure without loading map or flags until requested.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: native button semantics.
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useVisitors } from './useVisitors';
import './visitors.css';

const VisitorPanel = dynamic(() => import('./VisitorPanel'), { ssr: false });

export function VisitorChip() {
  const stats = useVisitors();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', keydown);
    document.addEventListener('sectionnavigate', close);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('sectionnavigate', close);
    };
  }, [open, close]);

  useEffect(() => { if (!stats) setOpen(false); }, [stats]);
  if (!stats) return null;
  return (
    <div className="visitor-disclosure">
      <button ref={trigger} type="button" className="visitor-chip" aria-label={`${stats.online.toLocaleString('en-US')} online, view visitors`}
        aria-expanded={open} aria-controls={id} aria-haspopup="dialog" onClick={() => setOpen((value) => !value)}>
        <span className="visitor-dot" aria-hidden="true" />
        <span>{stats.online.toLocaleString('en-US')}</span><span className="visitor-online-label">online</span>
      </button>
      {open && <VisitorPanel id={id} stats={stats} trigger={trigger} onClose={close} />}
    </div>
  );
}
