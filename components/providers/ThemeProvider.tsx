'use client';

// Intent: share effective motion and preserve explicit user choices over OS settings.
// Status: R2. Next: browser checks. Blockers: none. Confidence: pre-paint regression matrix.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  MOTION_STORAGE_KEY,
  THEME_STORAGE_KEY,
  isTheme,
  themes,
  type ThemeId,
} from '@/lib/themes';

type MotionPreference = 'on' | 'off';
type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  motion: MotionPreference;
  motionSource: 'user' | 'system';
  setMotion: (motion: MotionPreference) => void;
  reducedMotion: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  const active = themes.find((entry) => entry.id === theme)!;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', active.paper);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, updateTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [motion, updateMotion] = useState<MotionPreference>('on');
  const [motionSource, updateMotionSource] = useState<'user' | 'system'>('system');

  const setTheme = useCallback((next: ThemeId) => {
    if (!isTheme(next)) return;
    applyTheme(next);
    updateTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Storage is optional. */ }
  }, []);

  const setMotion = useCallback((next: MotionPreference) => {
    document.documentElement.dataset.motion = next;
    document.documentElement.dataset.motionSource = 'user';
    updateMotion(next);
    updateMotionSource('user');
    try { localStorage.setItem(MOTION_STORAGE_KEY, next); } catch { /* Storage is optional. */ }
  }, []);

  useEffect(() => {
    // Intent: adopt pre-paint state without overwriting storage with SSR defaults.
    // Status: P1. Next: additional registry themes. Blockers: none. Confidence: tested storage paths.
    const root = document.documentElement;
    const initialTheme = isTheme(root.dataset.theme) ? root.dataset.theme : DEFAULT_THEME;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialSource = root.dataset.motionSource === 'user' ? 'user' : 'system';
    const initialMotion = initialSource === 'system' ? (preference.matches ? 'off' : 'on') : (root.dataset.motion === 'off' ? 'off' : 'on');
    updateMotionSource(initialSource);
    root.dataset.motionSource = initialSource;
    updateTheme(initialTheme);
    updateMotion(initialMotion);
    applyTheme(initialTheme);
    root.dataset.motion = initialMotion;

    const syncSystemMotion = () => {
      if (root.dataset.motionSource === 'user') return;
      const next = preference.matches ? 'off' : 'on';
      updateMotion(next);
      root.dataset.motion = next;
    };
    syncSystemMotion();
    preference.addEventListener('change', syncSystemMotion);

    const syncStorage = (event: StorageEvent) => {
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch { return; }
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        const next = isTheme(event.newValue) ? event.newValue : DEFAULT_THEME;
        updateTheme(next);
        applyTheme(next);
      }
      if (event.key === MOTION_STORAGE_KEY || event.key === null) {
        const explicit = event.newValue === 'on' || event.newValue === 'off';
        const source = explicit ? 'user' : 'system';
        const next = explicit ? event.newValue as MotionPreference : preference.matches ? 'off' : 'on';
        updateMotion(next);
        updateMotionSource(source);
        root.dataset.motion = next;
        root.dataset.motionSource = source;
      }
    };
    window.addEventListener('storage', syncStorage);
    return () => {
      preference.removeEventListener('change', syncSystemMotion);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, motion, motionSource, setMotion, reducedMotion: motion === 'off' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
