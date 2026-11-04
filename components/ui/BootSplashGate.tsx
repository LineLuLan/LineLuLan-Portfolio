'use client';

import { useCallback, useState } from 'react';
import { BootSplash } from './BootSplash';

export function BootSplashGate() {
  const [show, setShow] = useState(true);
  const dismiss = useCallback(() => setShow(false), []);

  if (!show) return null;

  return <BootSplash onDismiss={dismiss} />;
}
