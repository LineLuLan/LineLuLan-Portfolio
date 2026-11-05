'use client';

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
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);

  const setTheme = useCallback((next: ThemeId) => {
    if (!isTheme(next)) return;
    applyTheme(next);
    updateTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Storage is optional. */ }
  }, []);

  const setMotion = useCallback((next: MotionPreference) => {
    document.documentElement.dataset.motion = next;
    updateMotion(next);
    try { localStorage.setItem(MOTION_STORAGE_KEY, next); } catch { /* Storage is optional. */ }
  }, []);

  useEffect(() => {
    // Intent: adopt pre-paint state without overwriting storage with SSR defaults.
    // Status: P1. Next: additional registry themes. Blockers: none. Confidence: tested storage paths.
    const root = document.documentElement;
    const initialTheme = isTheme(root.dataset.theme) ? root.dataset.theme : DEFAULT_THEME;
    const initialMotion = root.dataset.motion === 'off' ? 'off' : 'on';
    updateTheme(initialTheme);
    updateMotion(initialMotion);
    applyTheme(initialTheme);
    root.dataset.motion = initialMotion;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncSystemMotion = () => setSystemReducedMotion(preference.matches);
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
        const next = event.newValue === 'off' ? 'off' : 'on';
        updateMotion(next);
        root.dataset.motion = next;
      }
    };
    window.addEventListener('storage', syncStorage);
    return () => {
      preference.removeEventListener('change', syncSystemMotion);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, motion, setMotion, reducedMotion: motion === 'off' || systemReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
