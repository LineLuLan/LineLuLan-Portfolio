'use client';

import { MotionConfig } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';

// "Motion: off" in the theme dock must also stop framer-motion (inline-style animations ignore the CSS kill-switch).
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const { motion } = useTheme();
  return <MotionConfig reducedMotion={motion === 'off' ? 'always' : 'never'}>{children}</MotionConfig>;
}
