const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Content uses day 01 as a month-only placeholder; avoid inventing day precision.
export function formatChronicleDate(iso: string) {
  const [year, month, day] = iso.split('-');
  const label = MONTH[Number(month) - 1];
  return iso.endsWith('-01')
    ? `${label} ${year}`
    : `${label} ${day}, ${year}`;
}
