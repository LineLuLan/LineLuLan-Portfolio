import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../app/themes.css', import.meta.url), 'utf8');
const root = css.match(/:root\s*\{([^}]+)\}/)?.[1];
if (!root) throw new Error('Missing :root theme tokens in app/themes.css');

function readTokens(block) {
  return Object.fromEntries(
    [...block.matchAll(/--color-([\w-]+)\s*:\s*([^;]+);/g)]
      .map(([, name, value]) => [name, value.trim()]),
  );
}

const defaults = readTokens(root);
const palettes = new Map([[':root', defaults]]);
for (const mode of ['light', 'dark']) {
  const base = css.match(new RegExp(`html\\[data-mode="${mode}"\\]\\s*\\{([^}]+)\\}`))?.[1];
  if (!base) throw new Error(`Missing ${mode} base palette`);
  for (const accent of ['kafka', 'nebula', 'aurora', 'mars', 'rose']) {
    const block = css.match(new RegExp(`html\\[data-mode="${mode}"\\]\\[data-accent="${accent}"\\]\\s*\\{([^}]+)\\}`))?.[1];
    if (!block) throw new Error(`Missing ${mode}/${accent} palette`);
    palettes.set(`${mode}/${accent}`, { ...defaults, ...readTokens(base), ...readTokens(block) });
  }
}

function luminance(hex) {
  if (!/^#[\da-f]{6}$/i.test(hex ?? '')) throw new Error('Missing or invalid six-digit hex color token');
  const rgb = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

const pairs = [
  ['ink', 'paper'], ['ink', 'surface'], ['ink', 'panel'],
  ['ink', 'tint-a'], ['ink', 'tint-b'], ['ink', 'tint-c'],
  ['muted', 'paper'], ['muted', 'surface'], ['muted', 'panel'],
  ['accent', 'paper'], ['accent', 'panel'], ['on-accent', 'accent'],
];

// Intent: gate every mode/accent cascade and the no-JS palette. Status: implemented.
// Next: maintain with palette changes. Blockers: none. Confidence: computed WCAG ratios.
let failed = false;
for (const [name, tokens] of palettes) {
  const results = pairs.map(([foreground, background]) => {
    const first = luminance(tokens[foreground]);
    const second = luminance(tokens[background]);
    const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    return { pair: `${foreground}/${background}`, ratio: ratio.toFixed(2), pass: ratio >= 4.5 };
  });
  console.log(`Theme: ${name}`);
  console.table(results);
  if (results.some((result) => !result.pass)) failed = true;
}

if (failed) {
  console.error('FAIL: all text/background pairs must reach 4.5:1.');
  process.exitCode = 1;
} else {
  console.log(`PASS: all ${pairs.length} text/background pairs meet 4.5:1 across ${palettes.size} palettes.`);
}
