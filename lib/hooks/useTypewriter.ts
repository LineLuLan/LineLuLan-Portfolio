'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Options = {
  text: string;
  speed?: number; // ms per character
  startDelay?: number;
  enabled?: boolean;
};

export function useTypewriter({ text, speed = 40, startDelay = 0, enabled = true }: Options) {
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduce || !enabled ? text : '');
  const [done, setDone] = useState(reduce || !enabled);

  useEffect(() => {
    if (reduce || !enabled) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    setDisplayed('');
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay, enabled, reduce]);

  return { displayed, done };
}
