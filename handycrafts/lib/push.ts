import { createHash } from "crypto";
import webpush, { type PushSubscription } from "web-push";
import { hdel, hgetall, hset } from "@/lib/kv";

const KEY = "push:subs";

export function pushReady() {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configure() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:handycraftshelp@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

function idFor(endpoint: string) {
  return createHash("sha256").update(endpoint).digest("hex").slice(0, 32);
}

export function isSubscription(value: unknown): value is PushSubscription {
  const sub = value as PushSubscription;
  return Boolean(
    sub &&
      typeof sub.endpoint === "string" &&
      sub.endpoint.startsWith("https://") &&
      typeof sub.keys?.p256dh === "string" &&
      typeof sub.keys?.auth === "string"
  );
}

export async function addSubscription(sub: PushSubscription, device: string) {
  await hset(KEY, idFor(sub.endpoint), JSON.stringify({ sub, device, at: new Date().toISOString() }));
}

export async function removeSubscription(endpoint: string) {
  await hdel(KEY, idFor(endpoint));
}

export async function subscriptionCount() {
  return Object.keys(await hgetall(KEY)).length;
}

export async function notifyAll(payload: { title: string; body: string; url: string }) {
  if (!pushReady()) return;
  configure();
  const all = await hgetall(KEY);
  await Promise.all(
    Object.entries(all).map(async ([id, raw]) => {
      try {
        const { sub } = JSON.parse(raw) as { sub: PushSubscription };
        await webpush.sendNotification(sub, JSON.stringify(payload), { TTL: 60 * 60 * 24 });
      } catch (error) {
        const code = (error as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) await hdel(KEY, id);
        else console.error("PUSH", code, error);
      }
    })
  );
}
