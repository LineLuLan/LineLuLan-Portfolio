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

export function wheelDirection(deltaX: number, deltaY: number) {
  if (Math.abs(deltaX) < 80 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return 0;
  return deltaX > 0 ? 1 : -1;
}

export function coverflowState(distance: number) {
  const amount = Math.min(1, Math.abs(distance));
  return {
    rotateY: distance === 0 ? 0 : -Math.sign(distance) * amount * 28,
    scale: 1 - amount * 0.14,
    z: -amount * 140,
    opacity: 1 - amount * 0.45,
    blur: amount,
  };
}
