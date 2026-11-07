// Intent: precompute a compact land grid and country anchors using local geography datasets.
// Status: implemented. Next: regenerate after geography updates. Blockers: none. Confidence: required-code assertions.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import DottedMap from 'dotted-map';

const require = createRequire(import.meta.url);
const bounds = JSON.parse(readFileSync(require.resolve('country-json/src/country-by-geo-coordinates.json'), 'utf8'));
const names = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });
const normalize = (name) => name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/&/g, 'and').replace(/\bsaint\b/g, 'st').replace(/[^a-z]/g, '');
const codes = new Map();
for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
  const code = String.fromCharCode(a, b);
  if (new Intl.Locale(`und-${code}`).region !== code) continue;
  const name = names.of(code);
  if (name && !codes.has(normalize(name))) codes.set(normalize(name), code);
}
const aliases = {
  'Bolivia': 'BO', 'Brunei': 'BN', 'Cape Verde': 'CV', 'Czech Republic': 'CZ',
  'East Timor': 'TL', 'Iran': 'IR', 'Ivory Coast': 'CI', 'Laos': 'LA',
  'Macedonia': 'MK', 'Moldova': 'MD', 'Myanmar': 'MM', 'Palestine': 'PS',
  'Republic of the Congo': 'CG', 'Democratic Republic of the Congo': 'CD',
  'Russia': 'RU', 'South Korea': 'KR', 'North Korea': 'KP', 'Swaziland': 'SZ',
  'Syria': 'SY', 'Taiwan': 'TW', 'Tanzania': 'TZ', 'Turkey': 'TR',
  'United States': 'US', 'United Kingdom': 'GB', 'Vatican': 'VA', 'Vatican City': 'VA', 'Venezuela': 'VE',
  'Vietnam': 'VN', 'Virgin Islands (U.S.)': 'VI', 'Virgin Islands (British)': 'VG',
  'Fiji Islands': 'FJ', 'Holy See (Vatican City State)': 'VA', 'Micronesia, Federated States of': 'FM',
  'The Democratic Republic of Congo': 'CD', 'Virgin Islands, British': 'VG', 'Virgin Islands, U.S.': 'VI',
  'Congo': 'CG', 'Pitcairn': 'PN',
  'Hong Kong': 'HK', 'Macao': 'MO', 'United States Minor Outlying Islands': 'UM',
  'Heard Island and McDonald Islands': 'HM', 'Saint Vincent and the Grenadines': 'VC',
  'South Georgia and the South Sandwich Islands': 'GS',
};
for (const [name, code] of Object.entries(aliases)) codes.set(normalize(name), code);

// The latitude crop omits Antarctica; vertical grid keeps integer coordinates exact.
const map = new DottedMap({ width: 120, grid: 'vertical', region: { lat: { min: -58, max: 84 }, lng: { min: -180, max: 180 } } });
const points = map.getPoints().map(({ x, y }) => [Math.round(x), Math.round(y)]);
assert.ok(points.length > 1000, 'Expected a populated world land grid');
const countries = {};
const unmatched = [];
const missingBounds = [];
const recovered = [];
const polygonCodes = { CG: 'COG', CD: 'COD', FJ: 'FJI', KZ: 'KAZ', LY: 'LBY', MM: 'MMR', RU: 'RUS', RS: 'SRB', LK: 'LKA' };
for (const row of bounds) {
  const code = codes.get(normalize(row.country));
  if (!code) { unmatched.push(row.country); continue; }
  if (code === 'AQ') continue;
  let polygonLand = [];
  let { north, south, west, east } = row;
  if ([north, south, west, east].some((value) => value === null)) {
    if (!polygonCodes[code]) { missingBounds.push(row.country); continue; }
    const polygon = new DottedMap({ width: code === 'RU' || code === 'FJ' ? 720 : 120, countries: [polygonCodes[code]], projection: { name: 'equirectangular' } });
    const region = polygon.image.region;
    polygonLand = polygon.getPoints().map(({ x, y }) => map.getPin({
      lat: region.lat.max - y / polygon.image.height * (region.lat.max - region.lat.min),
      lng: region.lng.min + x / polygon.image.width * (region.lng.max - region.lng.min),
    })).filter(Boolean).map(({ x, y }) => [Math.round(x), Math.round(y)]);
    ({ min: south, max: north } = region.lat);
    ({ min: west, max: east } = region.lng);
    if (east - west > 180) {
      // Find the smallest circular longitude interval containing the polygon's
      // sampled land. Ordinary min/max puts date-line countries near Greenwich.
      const longitudes = [...new Set(polygon.getPoints().map(({ x }) => (west + x / polygon.image.width * (east - west) + 360) % 360))].sort((a, b) => a - b);
      assert.ok(longitudes.length, `Missing polygon samples: ${row.country}`);
      let gap = -1;
      let start = 0;
      for (let i = 0; i < longitudes.length; i++) {
        const next = longitudes[(i + 1) % longitudes.length] + (i === longitudes.length - 1 ? 360 : 0);
        if (next - longitudes[i] > gap) { gap = next - longitudes[i]; start = next % 360; }
      }
      west = start > 180 ? start - 360 : start;
      east = west + 360 - gap;
      if (east > 180) east -= 360;
    }
    recovered.push(row.country);
  }
  [north, south, west, east] = [north, south, west, east].map(Number);
  const lat = (north + south) / 2;
  // Bounds crossing the antimeridian need the wrapped midpoint.
  let lng = west <= east ? (west + east) / 2 : (west + east + 360) / 2;
  if (lng > 180) lng -= 360;
  const pin = map.getPin({ lat, lng });
  if (!pin) { unmatched.push(row.country); continue; }
  const distance = (point) => (point[0] - pin.x) ** 2 + (point[1] - pin.y) ** 2;
  if (polygonLand.length) {
    // Preserve small islands absent from the coarse grid using an actual land
    // sample from the bundled polygon, still rounded to the same 120-column grid.
    const land = polygonLand.reduce((nearest, point) => distance(point) < distance(nearest) ? point : nearest);
    if (!points.some(([x, y]) => x === land[0] && y === land[1])) points.push(land);
  }
  countries[code] = points.reduce((nearest, point) =>
    distance(point) < distance(nearest) ? point : nearest);
}
for (const code of 'US VN CN IN TR JP KR SG DE GB FR AU CA BR ID TH MY PH RU NL'.split(' ')) assert.ok(countries[code], `Missing required anchor: ${code}`);
assert.ok(countries.RU[0] > 75, 'Russia anchor must be in northern Asia');
assert.ok(countries.FJ[0] > 110 || countries.FJ[0] < 10, 'Fiji anchor must be near the date line');
const fijiPin = map.getPin({ lat: -17.154436, lng: 178.5 });
assert.ok(Math.hypot(countries.FJ[0] - fijiPin.x, countries.FJ[1] - fijiPin.y) <= 1.5, 'Fiji must not snap to New Zealand');
const output = JSON.stringify({ width: map.image.width, height: map.image.height, points, countries }) + '\n';
assert.ok(Buffer.byteLength(output) < 60_000, 'Keep map under 60 KB');
writeFileSync(new URL('../content/world-dots.json', import.meta.url), output);
console.log(`World dots: ${points.length} points, ${Object.keys(countries).length} anchors, ${Buffer.byteLength(output)} bytes.`);
console.log(`Unmatched country names: ${unmatched.length ? unmatched.join(', ') : 'none'}`);
console.log(`Bounds recovered from dotted-map polygons: ${recovered.join(', ') || 'none'}`);
console.log(`No bounds available (no map anchor): ${missingBounds.join(', ') || 'none'}`);
