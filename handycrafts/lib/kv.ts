import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createClient } from "redis";

// Redis in production (REDIS_URL from Vercel), a JSON file in .data/ for local work.

// Vercel's Redis integrations expose REDIS_URL; older Upstash/KV stores use KV_URL.
function redisUrl() {
  return process.env.REDIS_URL || process.env.KV_URL || "";
}

async function connect() {
  const client = createClient({ url: redisUrl() });
  client.on("error", (error) => console.error("REDIS", error));
  await client.connect();
  return client;
}

const globalRef = globalThis as unknown as { hcRedis?: ReturnType<typeof connect> };

export function hasRedis() {
  return Boolean(redisUrl());
}

function redis() {
  globalRef.hcRedis ??= connect().catch((error) => {
    globalRef.hcRedis = undefined;
    throw error;
  });
  return globalRef.hcRedis;
}

type LocalEntry = { value: unknown; expires?: number };
const localFile = path.join(process.cwd(), ".data", "kv.json");
let localQueue: Promise<unknown> = Promise.resolve();

async function readLocal(): Promise<Record<string, LocalEntry>> {
  try {
    const data = JSON.parse(await readFile(localFile, "utf8")) as Record<string, LocalEntry>;
    const now = Date.now();
    for (const key of Object.keys(data)) {
      if (data[key].expires && data[key].expires! < now) delete data[key];
    }
    return data;
  } catch {
    return {};
  }
}

function withLocal<T>(fn: (data: Record<string, LocalEntry>) => T): Promise<T> {
  const run = localQueue.then(async () => {
    const data = await readLocal();
    const result = fn(data);
    await mkdir(path.dirname(localFile), { recursive: true });
    await writeFile(localFile, JSON.stringify(data));
    return result;
  });
  localQueue = run.catch(() => undefined);
  return run;
}

export async function getJSON<T>(key: string): Promise<T | null> {
  if (hasRedis()) {
    const raw = await (await redis()).get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  return withLocal((data) => (data[key]?.value as T) ?? null);
}

export async function setJSON(key: string, value: unknown, ttlSeconds?: number) {
  if (hasRedis()) {
    const client = await redis();
    const raw = JSON.stringify(value);
    await (ttlSeconds ? client.set(key, raw, { EX: ttlSeconds }) : client.set(key, raw));
    return;
  }
  await withLocal((data) => {
    data[key] = { value, expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined };
  });
}

export async function del(key: string) {
  if (hasRedis()) {
    await (await redis()).del(key);
    return;
  }
  await withLocal((data) => {
    delete data[key];
  });
}

export async function incr(key: string, ttlSeconds?: number) {
  if (hasRedis()) {
    const client = await redis();
    const value = await client.incr(key);
    if (value === 1 && ttlSeconds) await client.expire(key, ttlSeconds);
    return value;
  }
  return withLocal((data) => {
    const entry = data[key];
    const value = Number(entry?.value || 0) + 1;
    data[key] = {
      value,
      expires: entry?.expires ?? (ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined),
    };
    return value;
  });
}

export async function zadd(key: string, score: number, member: string) {
  if (hasRedis()) {
    await (await redis()).zAdd(key, { score, value: member });
    return;
  }
  await withLocal((data) => {
    const list = ((data[key]?.value as [number, string][]) || []).filter(([, m]) => m !== member);
    list.push([score, member]);
    data[key] = { value: list };
  });
}

export async function zrevrange(key: string, start: number, stop: number) {
  if (hasRedis()) {
    return (await redis()).zRange(key, start, stop, { REV: true });
  }
  return withLocal((data) => {
    const list = [...((data[key]?.value as [number, string][]) || [])].sort((a, b) => b[0] - a[0]);
    return list.slice(start, stop < 0 ? undefined : stop + 1).map(([, m]) => m);
  });
}

export async function hset(key: string, field: string, value: string) {
  if (hasRedis()) {
    await (await redis()).hSet(key, field, value);
    return;
  }
  await withLocal((data) => {
    const map = (data[key]?.value as Record<string, string>) || {};
    map[field] = value;
    data[key] = { value: map };
  });
}

export async function hgetall(key: string): Promise<Record<string, string>> {
  if (hasRedis()) {
    return { ...(await (await redis()).hGetAll(key)) };
  }
  return withLocal((data) => ({ ...((data[key]?.value as Record<string, string>) || {}) }));
}

export async function hdel(key: string, field: string) {
  if (hasRedis()) {
    await (await redis()).hDel(key, field);
    return;
  }
  await withLocal((data) => {
    const map = (data[key]?.value as Record<string, string>) || {};
    delete map[field];
    data[key] = { value: map };
  });
}
