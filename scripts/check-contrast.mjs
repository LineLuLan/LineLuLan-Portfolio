import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../app/themes.css', import.meta.url), 'utf8');
const root = css.match(/:root\s*\{([^}]+)\}/)?.[1];
if (!root) throw new Error('Missing :root theme tokens in app/themes.css');

const tokens = Object.fromEntries(
  [...root.matchAll(/--color-([\w-]+)\s*:\s*(#[\da-f]{6})\s*;/gi)]
    .map(([, name, value]) => [name, value]),
);

function luminance(hex) {
  if (!hex) throw new Error('Missing or invalid six-digit hex color token');
  const rgb = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

const pairs = [
  ['ink', 'paper'], ['ink', 'surface'], ['ink', 'panel'],
  ['ink', 'tint-a'], ['ink', 'tint-b'], ['ink', 'tint-c'],
  ['muted', 'paper'], ['muted', 'surface'],
  ['accent', 'paper'], ['accent', 'panel'], ['on-accent', 'accent'],
];

const results = pairs.map(([foreground, background]) => {
  const first = luminance(tokens[foreground]);
  const second = luminance(tokens[background]);
  const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  return { pair: `${foreground}/${background}`, ratio: ratio.toFixed(2), pass: ratio >= 4.5 };
});

console.table(results);
if (results.some((result) => !result.pass)) {
  console.error('FAIL: all text/background pairs must reach 4.5:1.');
  process.exitCode = 1;
} else {
  console.log(`PASS: all ${results.length} text/background pairs meet 4.5:1.`);
}
