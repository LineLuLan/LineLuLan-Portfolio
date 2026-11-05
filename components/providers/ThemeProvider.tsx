'use client';

// Intent: share appearance and motion while preserving explicit choices over OS settings.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: preference regression matrix.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  DEFAULT_ACCENT,
  MODE_STORAGE_KEY,
  ACCENT_STORAGE_KEY,
  MOTION_STORAGE_KEY,
  THEME_STORAGE_KEY,
  isTheme,
  isMode,
  isAccent,
  modePaper,
  type Mode,
  type Accent,
  type ThemeId,
} from '@/lib/themes';

type MotionPreference = 'on' | 'off';
type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  accent: Accent;
  setAccent: (accent: Accent) => void;
  motion: MotionPreference;
  motionSource: 'user' | 'system';
  setMotion: (motion: MotionPreference) => void;
  reducedMotion: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
}

function applyMode(mode: Mode) {
  document.documentElement.dataset.mode = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', modePaper[mode]);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, updateTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [mode, updateMode] = useState<Mode>('light');
  const [accent, updateAccent] = useState<Accent>(DEFAULT_ACCENT);
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

  const setMode = useCallback((next: Mode) => {
    if (!isMode(next)) return;
    document.documentElement.dataset.modeSource = 'user';
    applyMode(next);
    updateMode(next);
    try { localStorage.setItem(MODE_STORAGE_KEY, next); } catch { /* Storage is optional. */ }
  }, []);

  const setAccent = useCallback((next: Accent) => {
    if (!isAccent(next)) return;
    document.documentElement.dataset.accent = next;
    updateAccent(next);
    try { localStorage.setItem(ACCENT_STORAGE_KEY, next); } catch { /* Storage is optional. */ }
  }, []);

  useEffect(() => {
    // Intent: adopt pre-paint state without overwriting storage with SSR defaults.
    // Status: implemented. Next: maintain the preference matrix. Blockers: none. Confidence: tested storage paths.
    const root = document.documentElement;
    const initialTheme = isTheme(root.dataset.theme) ? root.dataset.theme : DEFAULT_THEME;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const modeSource = root.dataset.modeSource === 'user' ? 'user' : 'system';
    const initialMode = modeSource === 'user' && isMode(root.dataset.mode)
      ? root.dataset.mode : colorPreference.matches ? 'dark' : 'light';
    const initialAccent = isAccent(root.dataset.accent) ? root.dataset.accent : DEFAULT_ACCENT;
    root.dataset.modeSource = modeSource;
    root.dataset.accent = initialAccent;
    updateMode(initialMode);
    updateAccent(initialAccent);
    applyMode(initialMode);
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
    const syncSystemMode = () => {
      if (root.dataset.modeSource === 'user') return;
      const next = colorPreference.matches ? 'dark' : 'light';
      updateMode(next);
      applyMode(next);
    };
    colorPreference.addEventListener('change', syncSystemMode);

    const syncStorage = (event: StorageEvent) => {
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch { return; }
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        const next = isTheme(event.newValue) ? event.newValue : DEFAULT_THEME;
        updateTheme(next);
        applyTheme(next);
      }
      if (event.key === MODE_STORAGE_KEY || event.key === null) {
        const explicit = isMode(event.newValue);
        const next = explicit ? event.newValue as Mode : colorPreference.matches ? 'dark' : 'light';
        root.dataset.modeSource = explicit ? 'user' : 'system';
        updateMode(next);
        applyMode(next);
      }
      if (event.key === ACCENT_STORAGE_KEY || event.key === null) {
        const next = isAccent(event.newValue) ? event.newValue : DEFAULT_ACCENT;
        root.dataset.accent = next;
        updateAccent(next);
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
      colorPreference.removeEventListener('change', syncSystemMode);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode, accent, setAccent, motion, motionSource, setMotion, reducedMotion: motion === 'off' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
