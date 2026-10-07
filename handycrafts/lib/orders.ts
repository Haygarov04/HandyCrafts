import { getJSON, incr, setJSON, zadd, zrem, zrevrange } from "@/lib/kv";
import type { Order, OrderStatus } from "@/lib/order-types";

export type Draft = {
  id: string;
  createdAt: string;
  product: "figurine" | "keychain";
  subject?: "person" | "pet";
  /** People on one base; missing means 1. */
  people?: number;
  cm: number;
  clothes: string;
  pose: string;
  photo: string;
  preview: string;
  /** The first preview of this try; new tries ("Нов опит") point back to it. */
  root?: string;
  /** When the customer put this preview in the cart. */
  cartAt?: string;
};

const DRAFT_TTL = 60 * 60 * 24 * 30;

export async function saveDraft(draft: Draft) {
  await setJSON(`draft:${draft.id}`, draft, DRAFT_TTL);
  await zadd("drafts", Date.parse(draft.createdAt), draft.id);
}

/** Newest previews first, for the panel. Expired ones are dropped from the index as we go. */
export async function listDrafts(limit = 300) {
  const ids = await zrevrange("drafts", 0, limit - 1);
  const drafts = await Promise.all(ids.map((id) => getJSON<Draft>(`draft:${id}`)));
  await Promise.all(ids.filter((_, i) => !drafts[i]).map((id) => zrem("drafts", id)));
  return drafts.filter((draft): draft is Draft => Boolean(draft));
}

export async function getDraft(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  return getJSON<Draft>(`draft:${id}`);
}

export async function nextOrderNumber() {
  const n = await incr("orders:counter");
  return `HC-${1000 + n}`;
}

export async function createOrder(order: Order) {
  await setJSON(`order:${order.id}`, order);
  await zadd("orders", Date.parse(order.createdAt), order.id);
  return order;
}

export async function getOrder(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  return getJSON<Order>(`order:${id}`);
}

export async function listOrders(limit = 300) {
  const ids = await zrevrange("orders", 0, limit - 1);
  const orders = await Promise.all(ids.map((id) => getJSON<Order>(`order:${id}`)));
  return orders.filter((order): order is Order => Boolean(order));
}

export async function updateOrder(
  id: string,
  change: { status?: OrderStatus; internalNote?: string; tracking?: Order["tracking"] | null }
) {
  const order = await getOrder(id);
  if (!order) return null;
  if (change.status) {
    if (change.status === "completed" && order.status !== "completed") order.completedAt = new Date().toISOString();
    if (change.status !== "completed") delete order.completedAt;
    order.status = change.status;
  }
  if (change.internalNote !== undefined) order.internalNote = change.internalNote;
  if (change.tracking !== undefined) order.tracking = change.tracking || undefined;
  order.updatedAt = new Date().toISOString();
  await setJSON(`order:${id}`, order);
  return order;
}

export async function logEmail(id: string, type: string, ok: boolean) {
  const order = await getOrder(id);
  if (!order) return;
  order.emails = [...(order.emails || []), { type, at: new Date().toISOString(), ok }].slice(-20);
  await setJSON(`order:${id}`, order);
}
