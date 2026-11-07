// Intent: count exact daily visitors atomically within fixed storage caps and request deadlines.
// Status: implemented. Next: supervisor's live Redis smoke test. Blockers: none. Confidence: local regression gate.
import { createHash } from 'node:crypto';
import { createClient } from 'redis';
import { isBot, normalizeCountry, topCountries, utcDay, utcHour, type VisitorStats } from './core';

type Visit = { idHash: string; rateHash: string; day: string; country: string; bot: boolean; now: number };
export interface VisitorStore {
  visit(input: Visit): Promise<VisitorStats>;
  stats(now: number): Promise<VisitorStats>;
}

export function makeVisit(id: string, country: string | null, userAgent: string, forwardedFor: string, now: number): Visit {
  const hash = (value: string) => createHash('sha256').update(value).digest().subarray(0, 9).toString('base64url');
  const ip = forwardedFor.split(',')[0]?.trim() || 'unknown';
  return { idHash: hash(id), rateHash: hash(ip + utcHour(now)), day: utcDay(now), country: normalizeCountry(country), bot: isBot(userAgent), now };
}

const DEFAULT_CAPS = { daily: 50_000, rateFields: 10_000, online: 5_000 };

export function visitorKeys(now: number) {
  return {
    total: 'v:t', countries: 'v:c', online: 'v:o',
    day: `v:d:${utcDay(now).replaceAll('-', '')}`,
    rate: `v:r:${utcHour(now).replaceAll('-', '')}`,
  };
}

// Absolute UTC expiries cannot be extended by heartbeats: two day keys overlap for
// at most one hour, and two rate hashes overlap for at most one minute.
export function visitorExpiry(now: number) {
  return {
    day: (Math.floor(now / 86_400_000) + 1) * 86_400 + 3_600,
    rate: (Math.floor(now / 3_600_000) + 1) * 3_600 + 60,
  };
}

const PRUNE_SCRIPT = `redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', '(' .. (tonumber(ARGV[1]) - 90000))`;
const STATS_SCRIPT = `return {redis.call('GET', KEYS[1]) or '0', redis.call('ZCARD', KEYS[3]), redis.call('HGETALL', KEYS[2])}`;
const READ_SCRIPT = `${PRUNE_SCRIPT}\n${STATS_SCRIPT}`;

// One EVAL makes admission, caps and increments atomic. Record limited IDs too,
// so retries/heartbeats cannot count them later that day or consume more budget.
const VISIT_SCRIPT = `
${PRUNE_SCRIPT}
if redis.call('SISMEMBER', KEYS[4], ARGV[2]) == 0 and redis.call('SCARD', KEYS[4]) < tonumber(ARGV[7]) then
  local added = redis.call('SADD', KEYS[4], ARGV[2])
  redis.call('EXPIREAT', KEYS[4], ARGV[5])
  if added == 1 then
    if redis.call('HEXISTS', KEYS[5], ARGV[4]) == 1 or redis.call('HLEN', KEYS[5]) < tonumber(ARGV[8]) then
      local rate = redis.call('HINCRBY', KEYS[5], ARGV[4], 1)
      redis.call('EXPIREAT', KEYS[5], ARGV[6])
      if rate <= 30 then
        redis.call('INCR', KEYS[1])
        redis.call('HINCRBY', KEYS[2], ARGV[3], 1)
      end
    end
  end
end
if redis.call('ZSCORE', KEYS[3], ARGV[2]) or redis.call('ZCARD', KEYS[3]) < tonumber(ARGV[9]) then
  redis.call('ZADD', KEYS[3], ARGV[1], ARGV[2])
end
redis.call('EXPIRE', KEYS[3], 180)
${STATS_SCRIPT}
`;

type RedisClient = ReturnType<typeof createClient>;
let client: RedisClient | undefined;
let connecting: Promise<RedisClient> | undefined;

// Connect timeout alone does not cover the handshake or a server that stops
// replying. Destroy on either deadline; never leave offline commands queued.
async function withDeadline<T>(redis: RedisClient, operation: () => Promise<T>, milliseconds: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          if (redis.isOpen) redis.destroy();
          reject(new Error('Visitor storage unavailable'));
        }, milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function connectedClient(url: string): Promise<RedisClient> {
  if (!client) {
    client = createClient({
      url,
      disableOfflineQueue: true,
      commandsQueueMaxLength: 1_000,
      socket: {
        connectTimeout: 3_000,
        // Retry on the next request through our shared, timed connect promise.
        // No background reconnect can outlive that deadline during a handshake.
        reconnectStrategy: () => false,
      },
    });
    client.on('error', () => console.warn('Visitor Redis connection unavailable'));
  }
  if (connecting) return connecting;
  if (client.isReady) return client;
  // Do not start a second connection while a socket is open but not ready.
  if (client.isOpen) throw new Error('Visitor storage unavailable');
  const redis = client;
  connecting = withDeadline(redis, () => redis.connect(), 4_000);
  try {
    return await connecting;
  } finally {
    connecting = undefined;
  }
}

function decodeStats(reply: unknown): VisitorStats {
  const [total, online, fields] = reply as [string | number, number, string[]];
  const countries = [];
  for (let i = 0; i < fields.length; i += 2) countries.push({ code: fields[i]!, count: Number(fields[i + 1]) });
  return { total: Number(total), online: Number(online), countries: topCountries(countries) };
}

export class RedisVisitorStore implements VisitorStore {
  constructor(private readonly url: string) {}

  private async evaluate(script: string, keys: string[], args: string[]): Promise<VisitorStats> {
    const redis = await connectedClient(this.url);
    return decodeStats(await withDeadline(redis, () => redis.eval(script, { keys, arguments: args }), 1_500));
  }

  async visit(input: Visit): Promise<VisitorStats> {
    if (input.bot) return this.stats(input.now);
    const keys = visitorKeys(input.now);
    const expiry = visitorExpiry(input.now);
    return this.evaluate(VISIT_SCRIPT, [keys.total, keys.countries, keys.online, keys.day, keys.rate],
      [String(input.now), input.idHash, input.country, input.rateHash, String(expiry.day), String(expiry.rate),
        String(DEFAULT_CAPS.daily), String(DEFAULT_CAPS.rateFields), String(DEFAULT_CAPS.online)]);
  }

  async stats(now: number): Promise<VisitorStats> {
    const keys = visitorKeys(now);
    return this.evaluate(READ_SCRIPT, [keys.total, keys.countries, keys.online], [String(now)]);
  }
}

export class MemoryVisitorStore implements VisitorStore {
  private total = 0;
  private countries = new Map<string, number>();
  private seen = new Map<string, { members: Set<string>; expires: number }>();
  private rates = new Map<string, { fields: Map<string, number>; expires: number }>();
  private online = new Map<string, number>();
  private readonly caps: typeof DEFAULT_CAPS;

  constructor(caps: Partial<typeof DEFAULT_CAPS> = {}) {
    this.caps = { ...DEFAULT_CAPS, ...caps };
  }

  private prune(now: number) {
    for (const [key, day] of this.seen) if (day.expires <= now) this.seen.delete(key);
    for (const [key, rate] of this.rates) if (rate.expires <= now) this.rates.delete(key);
    for (const [key, time] of this.online) if (time < now - 90_000) this.online.delete(key);
  }

  async visit(input: Visit): Promise<VisitorStats> {
    this.prune(input.now);
    if (!input.bot) {
      const keys = visitorKeys(input.now);
      const expiry = visitorExpiry(input.now);
      const day = this.seen.get(keys.day) ?? { members: new Set<string>(), expires: expiry.day * 1000 };
      if (!day.members.has(input.idHash) && day.members.size < this.caps.daily) {
        day.members.add(input.idHash);
        this.seen.set(keys.day, day);
        const rate = this.rates.get(keys.rate) ?? { fields: new Map<string, number>(), expires: expiry.rate * 1000 };
        if (rate.fields.has(input.rateHash) || rate.fields.size < this.caps.rateFields) {
          const count = (rate.fields.get(input.rateHash) ?? 0) + 1;
          rate.fields.set(input.rateHash, count);
          this.rates.set(keys.rate, rate);
          if (count <= 30) {
            this.total++;
            this.countries.set(input.country, (this.countries.get(input.country) ?? 0) + 1);
          }
        }
      }
      if (this.online.has(input.idHash) || this.online.size < this.caps.online) this.online.set(input.idHash, input.now);
    }
    return this.stats(input.now);
  }

  async stats(now: number): Promise<VisitorStats> {
    this.prune(now);
    return { total: this.total, online: this.online.size, countries: topCountries(Array.from(this.countries, ([code, count]) => ({ code, count }))) };
  }
}

export function createVisitorStore(env: Record<string, string | undefined>): VisitorStore | null {
  if (env.REDIS_URL) return new RedisVisitorStore(env.REDIS_URL);
  return env.NODE_ENV === 'production' ? null : new MemoryVisitorStore();
}

let store: VisitorStore | null | undefined;
export function getVisitorStore(): VisitorStore | null {
  if (store === undefined) store = createVisitorStore(process.env);
  return store;
}
