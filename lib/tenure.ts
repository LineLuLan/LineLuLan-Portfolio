// Intent: whole years since a YYYY-MM month, shared by the server render and the hero's client refresh.
// Status: implemented 2026-11-08. Next: none. Confidence: month arithmetic, no time zones involved.
export function yearsSince(since: string, now = new Date()) {
  const [year, month] = since.split('-').map(Number);
  return Math.max(0, Math.floor((now.getFullYear() * 12 + now.getMonth() - (year! * 12 + month! - 1)) / 12));
}
