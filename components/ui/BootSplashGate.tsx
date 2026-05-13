'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { BootSplash } from './BootSplash';

const KEY = 'line.boot.seen';

export function BootSplashGate() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce) return;
    try {
      if (sessionStorage.getItem(KEY) === '1') return;
    } catch {
      // sessionStorage may be unavailable (privacy mode) — show splash anyway.
    }
    setShow(true);
  }, [reduce]);

  if (!show) return null;

  return (
    <BootSplash
      onDismiss={() => {
        try {
          sessionStorage.setItem(KEY, '1');
        } catch {
          // ignore storage failures
        }
        setShow(false);
      }}
    />
  );
}
