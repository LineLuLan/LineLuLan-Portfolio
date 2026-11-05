'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { themes } from '@/lib/themes';

export function ThemeStamp() {
  const { theme } = useTheme();
  const active = themes.find((entry) => entry.id === theme)!;

  return <p className="font-mono text-xs text-muted">Theme {active.number} · {active.name}</p>;
}
