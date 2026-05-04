import { track } from '@vercel/analytics';

export function trackEvent(name: string, props?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    track(name, props);
  } catch {
    // analytics is best-effort; never throw to caller
  }
}
