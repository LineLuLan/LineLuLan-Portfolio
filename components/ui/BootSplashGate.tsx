'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { BootSplash } from './BootSplash';

export function BootSplashGate() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce) return;
    setShow(true);
  }, [reduce]);

  if (!show) return null;

  return <BootSplash onDismiss={() => setShow(false)} />;
}
