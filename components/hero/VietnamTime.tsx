'use client';

// Intent: show Line's real local time (Vietnam, UTC+7) next to the availability chip.
// Status: implemented 2026-11-06. Next: none. Blockers: none.
// Confidence: Intl timeZone is supported by all evergreen browsers; SSR renders nothing to avoid a stale clock.
import { useEffect, useState } from 'react';

const format = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function VietnamTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(format.format(new Date()));
    tick();
    // Align updates to the start of each minute.
    let interval = 0;
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  if (!time) return null;
  return (
    <span className="block text-muted sm:inline">
      <span aria-hidden className="hidden sm:inline"> · </span>
      <time aria-label={`Local time in Vietnam: ${time}`}>{time}</time> GMT+7
    </span>
  );
}
