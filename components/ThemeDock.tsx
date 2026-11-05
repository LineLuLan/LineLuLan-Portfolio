'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { accents, modes } from '@/lib/themes';

// Intent: expose independent appearance choices without changing section geometry.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: semantic buttons and shared tokens.

export function ThemeDock() {
  const { mode, setMode, accent, setAccent, motion, motionSource, setMotion } = useTheme();
  const [open, setOpen] = useState(false);
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const active = accents.find((entry) => entry.id === accent)!;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !dock.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={dock} className="fixed bottom-4 left-4 z-50">
      <button
        ref={trigger}
        type="button"
        aria-label={`Appearance, current mode: ${mode}, accent: ${active.label}`}
        aria-expanded={open}
        aria-controls="theme-dock-panel"
        onClick={() => setOpen((value) => !value)}
        className="hairline grid h-11 w-11 place-items-center rounded-full border bg-panel text-xl text-accent hover:border-accent"
      >
        <span aria-hidden>◐</span>
      </button>
      {open && (
        <div id="theme-dock-panel" role="group" aria-label="Appearance" className="hairline absolute bottom-14 left-0 flex w-max max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-[var(--theme-radius)] border bg-panel p-3 font-mono text-xs text-ink">
          <div role="group" aria-label="Mode">
            <p className="mb-2 text-muted">Mode</p>
            <div className="flex gap-1">
              {modes.map((entry) => (
                <button key={entry} type="button" aria-pressed={mode === entry} onClick={() => setMode(entry)} className="hairline min-h-11 flex-1 rounded-[var(--theme-control-radius)] border px-3 hover:border-accent aria-pressed:bg-selection">
                  {entry === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
          </div>
          <div role="group" aria-label="Accent">
            <p className="mb-2 text-muted">Accent</p>
            <div className="flex gap-1">
              {accents.map((entry) => (
                <button key={entry.id} type="button" aria-label={`Accent: ${entry.label}`} aria-pressed={accent === entry.id} onClick={() => setAccent(entry.id)} className="grid h-11 w-11 place-items-center rounded-full text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  <span className="grid h-8 w-8 place-items-center rounded-full" style={{ backgroundColor: `var(--swatch-${entry.id})` }}>
                    {accent === entry.id && <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 4 4L19 6" /></svg>}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={motion === 'on'}
            onClick={() => setMotion(motion === 'on' ? 'off' : 'on')}
            className="hairline min-h-11 rounded-[var(--theme-control-radius)] border px-3 hover:border-accent"
          >
            Motion · {motion === 'on' ? 'On' : 'Off'}{motionSource === 'system' ? ' (system)' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
