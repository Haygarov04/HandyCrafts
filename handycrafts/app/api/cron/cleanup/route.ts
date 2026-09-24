import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { hasBlob } from "@/lib/files";
import { setJSON } from "@/lib/kv";
import { listOrders } from "@/lib/orders";

export const runtime = "nodejs";
export const maxDuration = 60;

const DAY = 24 * 60 * 60 * 1000;
const DRAFT_DAYS = 30;
const ORDER_DAYS = 365;

/**
 * Daily Vercel Cron job (see vercel.json): deletes photos of previews that were
 * never ordered after 30 days and photos of orders after 12 months, as promised
 * in the privacy policy.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!hasBlob()) return NextResponse.json({ skipped: "no blob store" });

  const now = Date.now();
  const orders = await listOrders(5000);
  const keep = new Set<string>();
  let orderFiles = 0;

  for (const order of orders) {
    const old = now - Date.parse(order.createdAt) > ORDER_DAYS * DAY;
    let changed = false;
    for (const item of order.items) {
      for (const kind of ["photo", "preview"] as const) {
        const ref = item[kind];
        if (!ref?.startsWith("blob:")) continue;
        if (old) {
          await del(ref.slice(5)).catch(() => undefined);
          item[kind] = undefined;
          changed = true;
          orderFiles += 1;
        } else {
          keep.add(ref.slice(5));
        }
      }
    }
    if (changed) await setJSON(`order:${order.id}`, order);
  }

  const stale: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "drafts/", cursor, limit: 1000 });
    for (const blob of page.blobs) {
      if (now - new Date(blob.uploadedAt).getTime() > DRAFT_DAYS * DAY && !keep.has(blob.url)) stale.push(blob.url);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  for (let i = 0; i < stale.length; i += 100) await del(stale.slice(i, i + 100));

  return NextResponse.json({ draftFilesDeleted: stale.length, orderFilesDeleted: orderFiles });
}
