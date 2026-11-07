// Intent: share deterministic visitor validation and presentation without server dependencies.
// Status: implemented. Next: none. Blockers: none. Confidence: boundary tests.
export type CountryCount = { code: string; count: number };
export type VisitorStats = { total: number; online: number; countries: CountryCount[] };
export type VisitorResponse = VisitorStats & { configured: true; you: string };

export function validVisitorId(id: unknown): id is string {
  return typeof id === 'string' && id.length >= 8 && id.length <= 64 && !/[^A-Za-z0-9-]/.test(id);
}

export function normalizeCountry(country: string | null): string {
  const code = country?.toUpperCase() ?? '';
  return code.length === 2 && /^[A-Z]{2}$/.test(code) ? code : 'XX';
}

export function isBot(userAgent: string): boolean {
  return /bot|crawl|spider|slurp|preview|headless|lighthouse|curl|wget|python|httpclient/i.test(userAgent);
}

export function utcDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

export function utcHour(now: number): string {
  return new Date(now).toISOString().slice(0, 13).replace('T', '-');
}

export function topCountries(countries: CountryCount[], limit = countries.length): CountryCount[] {
  return [...countries].sort((a, b) => b.count - a.count || a.code.localeCompare(b.code)).slice(0, Math.max(0, limit));
}
