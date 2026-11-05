// Intent: keep carousel gesture and circular position rules independently testable.
// Status: implemented. Next: maintain boundary tests. Blockers: none. Confidence: unit coverage.
export function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

export function swipeDirection(offset: number, velocity: number, width: number) {
  if (Math.abs(offset) > width * 0.25) return offset < 0 ? 1 : -1;
  if (Math.abs(velocity) > 500) return velocity < 0 ? 1 : -1;
  return 0;
}

export function slidePosition(index: number, active: number, count: number) {
  const position = wrapIndex(index - active, count);
  return position > count / 2 ? position - count : position;
}
