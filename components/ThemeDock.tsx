'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { themes } from '@/lib/themes';

export function ThemeDock() {
  const { theme, setTheme, motion, motionSource, setMotion } = useTheme();
  const [open, setOpen] = useState(false);
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const active = themes.find((entry) => entry.id === theme)!;

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
        aria-label={`Appearance, current theme: ${active.name}`}
        aria-expanded={open}
        aria-controls="theme-dock-panel"
        onClick={() => setOpen((value) => !value)}
        className="hairline grid h-11 w-11 place-items-center rounded-full border bg-panel text-xl text-accent hover:border-accent"
      >
        <span aria-hidden>{active.symbol}</span>
      </button>
      {open && (
        <div id="theme-dock-panel" role="group" aria-label="Theme" className="hairline absolute bottom-14 left-0 flex w-max max-w-[calc(100vw-2rem)] flex-wrap gap-2 rounded-[var(--theme-radius)] border bg-panel p-3 font-mono text-xs text-ink">
          {themes.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={theme === entry.id}
              onClick={() => setTheme(entry.id)}
              className="hairline min-h-11 rounded-[var(--theme-control-radius)] border px-3 hover:border-accent aria-pressed:bg-selection"
            >
              {entry.number} · {entry.symbol} · {entry.name}
            </button>
          ))}
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
