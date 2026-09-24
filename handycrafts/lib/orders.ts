import { getJSON, incr, setJSON, zadd, zrevrange } from "@/lib/kv";
import type { Order, OrderStatus } from "@/lib/order-types";

export type Draft = {
  id: string;
  createdAt: string;
  product: "figurine" | "keychain";
  subject?: "person" | "pet";
  cm: number;
  clothes: string;
  pose: string;
  photo: string;
  preview: string;
};

const DRAFT_TTL = 60 * 60 * 24 * 30;

export async function saveDraft(draft: Draft) {
  await setJSON(`draft:${draft.id}`, draft, DRAFT_TTL);
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
  change: { status?: OrderStatus; internalNote?: string }
) {
  const order = await getOrder(id);
  if (!order) return null;
  if (change.status) order.status = change.status;
  if (change.internalNote !== undefined) order.internalNote = change.internalNote;
  order.updatedAt = new Date().toISOString();
  await setJSON(`order:${id}`, order);
  return order;
}
