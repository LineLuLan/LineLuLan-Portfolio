import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const layout = JSON.parse(readFileSync(new URL('lib/orbit-layout.json', root), 'utf8'));
const source = readFileSync(new URL('lib/pixel-planets.ts', root), 'utf8');
const glyphSource = readFileSync(new URL('components/pixel/PixelPlanet.tsx', root), 'utf8');
const legend = new Set([...glyphSource.matchAll(/^  ([a-z]): /gm)].map((match) => match[1]));
const grids = Object.fromEntries([...source.matchAll(/^  (\w+): \[([\s\S]*?)\n  \]/gm)].map(([, kind, body]) => [kind, [...body.matchAll(/'([^']+)'/g)].map((match) => match[1])]));
const radians = Math.PI / 180;
const tilt = layout.tilt * radians;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const period = layout.rings.reduce((total, ring) => total * ring.period / gcd(total, ring.period), 1);
const step = 0.25;
const gap = layout.clearance;

// Intent: verify actual painted cells through the complete interaction scale range.
// Status: deterministic full-period sweep. Next: rerun after geometry or sprite edits.
// Blockers: none. Confidence: conservative swept-cell bounds at every sampled time.
const planets = Object.entries(layout.planets).map(([id, planet]) => {
  const grid = grids[planet.kind];
  if (!grid || grid.length !== 16 || grid.some((row) => row.length !== 16)) {
    throw new Error(`Missing or invalid 16×16 painted grid: ${planet.kind}`);
  }
  const cells = [];
  const cellSize = planet.size / 16;
  grid.forEach((row, y) => [...row].forEach((color, x) => {
    if (color === '.' || !legend.has(color)) return;
    // Enclose each cell at every scale between rest and hover, including transitions.
    const left = (x - 8) * cellSize;
    const top = (y - 8) * cellSize;
    const right = (x - 7) * cellSize;
    const bottom = (y - 7) * cellSize;
    cells.push([Math.min(left, left * layout.hoverScale), Math.min(top, top * layout.hoverScale), Math.max(right, right * layout.hoverScale), Math.max(bottom, bottom * layout.hoverScale)]);
  }));
  if (!cells.length) throw new Error(`No painted cells: ${planet.kind}`);
  const bounds = [Math.min(...cells.map((cell) => cell[0])), Math.min(...cells.map((cell) => cell[1])), Math.max(...cells.map((cell) => cell[2])), Math.max(...cells.map((cell) => cell[3]))];
  return { id, ...planet, cells, bounds };
});

function rectangleDistance(a, ax, ay, b, bx, by) {
  return Math.hypot(Math.max(a[0] + ax - b[2] - bx, b[0] + bx - a[2] - ax, 0), Math.max(a[1] + ay - b[3] - by, b[1] + by - a[3] - ay, 0));
}

function collision(time, a, b, distance) {
  console.error(`FAIL at t=${time.toFixed(2)}s: ${a} / ${b}, painted clearance ${distance.toFixed(3)}px < ${gap}px (hover scale ${layout.hoverScale}).`);
  process.exit(1);
}

let samples = 0;
for (let time = 0; time <= period; time += step) {
  samples += 1;
  const positions = planets.map((planet) => {
    const ring = layout.rings[planet.ring];
    const angle = (planet.phase + time / ring.period * 360) * radians;
    const x = ring.rx * Math.cos(angle);
    const y = ring.rx * layout.ratio * Math.sin(angle);
    return [x * Math.cos(tilt) - y * Math.sin(tilt), x * Math.sin(tilt) + y * Math.cos(tilt)];
  });
  for (let a = 0; a < planets.length; a += 1) {
    const planet = planets[a];
    const [ax, ay] = positions[a];
    for (const cell of planet.cells) {
      const x = Math.max(cell[0] + ax, Math.min(0, cell[2] + ax));
      const y = Math.max(cell[1] + ay, Math.min(0, cell[3] + ay));
      const distance = Math.hypot(x, y) - layout.avatarRadius;
      if (distance < gap) collision(time, planet.id, 'avatar', distance);
    }
    for (let b = a + 1; b < planets.length; b += 1) {
      const other = planets[b];
      const [bx, by] = positions[b];
      if (rectangleDistance(planet.bounds, ax, ay, other.bounds, bx, by) >= gap) continue;
      for (const cell of planet.cells) {
        for (const otherCell of other.cells) {
          const distance = rectangleDistance(cell, ax, ay, otherCell, bx, by);
          if (distance < gap) collision(time, planet.id, other.id, distance);
        }
      }
    }
  }
}
console.log(`PASS: ${planets.length} painted sprites stay >=${gap}px clear of each other and the r=${layout.avatarRadius}px avatar across ${samples} samples (${period}s at ${step}s); hover scale ${layout.hoverScale}; labels excluded.`);
