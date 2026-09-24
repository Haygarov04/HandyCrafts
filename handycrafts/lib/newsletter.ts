import { createHmac, timingSafeEqual } from "crypto";
import { hdel, hgetall, hset } from "@/lib/kv";
import type { Lang } from "@/lib/i18n";

const KEY = "newsletter";

export type Subscriber = { email: string; lang: Lang; source: string; at: string };

export function normalizeEmail(value: unknown) {
  const email = String(value ?? "").trim().toLowerCase().slice(0, 120);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

/** Adds or refreshes a subscriber. Returns false if the address was already on the list. */
export async function subscribe(email: string, lang: Lang, source: string) {
  const all = await hgetall(KEY);
  const existed = Boolean(all[email]);
  const previous = existed ? (JSON.parse(all[email]) as Subscriber) : null;
  const entry: Subscriber = { email, lang, source: previous?.source || source, at: previous?.at || new Date().toISOString() };
  await hset(KEY, email, JSON.stringify(entry));
  return !existed;
}

export async function unsubscribe(email: string) {
  await hdel(KEY, email);
}

export async function listSubscribers() {
  const all = await hgetall(KEY);
  return Object.values(all)
    .map((raw) => JSON.parse(raw) as Subscriber)
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

function sign(email: string) {
  const secret = `${process.env.SESSION_SECRET || ""}:${process.env.CRM_PASSWORD || ""}:newsletter`;
  return createHmac("sha256", secret).update(email).digest("hex").slice(0, 32);
}

/** Signed token so only the owner of the inbox can unsubscribe it. */
export function unsubscribeToken(email: string) {
  return sign(email);
}

export function tokenValid(email: string, token: string) {
  const expected = Buffer.from(sign(email));
  const given = Buffer.from(String(token || ""));
  return expected.length === given.length && timingSafeEqual(expected, given);
}
