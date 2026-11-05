'use client';

import { useCallback, useEffect, useState } from 'react';
import { BootSplash } from './BootSplash';

export function BootSplashGate() {
  const [show, setShow] = useState(true);
  const dismiss = useCallback(() => setShow(false), []);

  // Motion off (set pre-paint on <html>) hides the splash via CSS; skip the JS scroll lock too.
  useEffect(() => {
    if (document.documentElement.dataset.motion === 'off') setShow(false);
  }, []);

  if (!show) return null;

  return <BootSplash onDismiss={dismiss} />;
}
