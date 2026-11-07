// Intent: trace Line's Pisces reference (669x616, y down) without changing its orientation.
// Status: eight section stars plus the reference's knot and faint field stars.
// Next: keep geometry and labels checked together. Blockers: none. Confidence: supplied coordinates.
import type { SectionId } from '@/lib/constants';
import type { Constellation } from '@/lib/constellation-fit';

export const PISCES = {
  width: 669,
  height: 616,
  planets: {
    whoami: { x: 170, y: 88, side: 'left' },
    about: { x: 185, y: 155, side: 'right' },
    experience: { x: 160, y: 328, side: 'left' },
    stack: { x: 52, y: 495, side: 'bottom' },
    work: { x: 235, y: 435, side: 'bottom' },
    framework: { x: 445, y: 435, side: 'top', labelGap: 24 },
    record: { x: 553, y: 440, side: 'top' },
    contact: { x: 598, y: 492, side: 'bottom' },
  } satisfies Record<SectionId, Constellation['planets'][string]>,
  minor: {
    a: { x: 240, y: 115 }, b: { x: 232, y: 205 }, c: { x: 290, y: 430 },
    d: { x: 500, y: 445 }, e: { x: 595, y: 458 }, f: { x: 553, y: 515 },
    g: { x: 505, y: 512 }, h: { x: 480, y: 480 },
    faint1: { x: 100, y: 430 }, faint2: { x: 110, y: 470 }, faint3: { x: 330, y: 300 },
  },
  lines: [
    // Ordered as a path from star 1 to star 8 so the lines draw in that order.
    ['whoami', 'about'], ['about', 'a'], ['about', 'b'], ['b', 'experience'],
    ['experience', 'stack'], ['stack', 'work'], ['work', 'c'], ['c', 'framework'],
    ['framework', 'd'], ['d', 'record'], ['record', 'e'], ['e', 'contact'],
    ['contact', 'f'], ['f', 'g'], ['g', 'h'], ['h', 'd'],
  ],
} satisfies Constellation;
