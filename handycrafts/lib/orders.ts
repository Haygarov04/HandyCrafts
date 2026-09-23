import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { get, put } from "@vercel/blob";
import {
  orderStatuses,
  type Order,
  type OrderFileKind,
  type OrderStatus,
} from "@/lib/order-types";

export type { Order, OrderFileKind, OrderStatus };
export { orderStatuses, statusLabel } from "@/lib/order-types";

const root = path.join(process.cwd(), ".data");
const dbFile = path.join(root, "orders.json");

function databaseUrl() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
}

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function storageMode() {
  return {
    database: Boolean(databaseUrl()),
    files: useBlob() ? "vercel-blob" : "local",
  };
}

function isStatus(value: string): value is OrderStatus {
  return (orderStatuses as readonly string[]).includes(value);
}

function privateHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host === "::1") return true;
  if (host === "169.254.169.254" || host.endsWith(".internal")) return true;
  const match = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return false;
  const a = Number(match[1]);
  const b = Number(match[2]);
  return a === 10 || a === 127 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

export async function pullRemote(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || privateHost(parsed.hostname)) return null;
  const response = await fetch(parsed, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length === 0 || bytes.length > 40 * 1024 * 1024) return null;
  return {
    bytes,
    contentType: response.headers.get("content-type") || "application/octet-stream",
  };
}

async function saveLocal(ref: string, bytes: Buffer, contentType: string) {
  const relative = ref.slice("local:".length);
  const full = path.join(root, "files", relative);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, bytes);
  await writeFile(`${full}.type`, contentType);
}

export async function saveOrderFile(
  orderId: string,
  kind: OrderFileKind,
  bytes: Buffer,
  contentType: string
) {
  if (useBlob()) {
    const extension =
      kind === "glb" ? "glb" : kind === "stl" ? "stl" : contentType.includes("png") ? "png" : "jpg";
    const blob = await put(`orders/${orderId}/${kind}.${extension}`, bytes, {
      access: "private",
      contentType,
      addRandomSuffix: false,
    });
    return `blob:${blob.url}`;
  }
  const ref = `local:${orderId}/${kind}`;
  await saveLocal(ref, bytes, contentType);
  return ref;
}

export async function readOrderFile(ref: string) {
  if (ref.startsWith("blob:")) {
    const result = await get(ref.slice(5), { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return {
      stream: result.stream,
      contentType: result.blob.contentType || "application/octet-stream",
    };
  }
  if (ref.startsWith("remote:")) {
    const pulled = await pullRemote(ref.slice(7));
    if (!pulled) return null;
    return { bytes: pulled.bytes, contentType: pulled.contentType };
  }
  if (!ref.startsWith("local:")) return null;
  const full = path.join(root, "files", ref.slice("local:".length));
  const bytes = await readFile(full);
  const contentType = await readFile(`${full}.type`, "utf8").catch(() => "application/octet-stream");
  return { bytes, contentType };
}

async function readLocalOrders(): Promise<Order[]> {
  try {
    const parsed = JSON.parse(await readFile(dbFile, "utf8")) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalOrders(orders: Order[]) {
  await mkdir(root, { recursive: true });
  await writeFile(dbFile, JSON.stringify(orders, null, 2));
}

let schemaReady: Promise<void> | null = null;

function sqlClient() {
  return neon(databaseUrl());
}

function ensureSchema() {
  schemaReady ??= (async () => {
    const sql = sqlClient();
    await sql`
      create table if not exists orders (
        id text primary key,
        created_at timestamptz not null,
        updated_at timestamptz not null,
        status text not null,
        name text not null,
        email text not null,
        phone text not null default '',
        product text not null,
        size text not null,
        people integer not null,
        clothes text not null default '',
        pose text not null default '',
        box text not null,
        rush boolean not null,
        second_copy boolean not null,
        photo_ref text,
        preview_ref text,
        glb_ref text,
        stl_ref text
      )
    `;
  })();
  return schemaReady;
}

function rowToOrder(row: Record<string, unknown>): Order {
  const status = String(row.status || "new");
  return {
    id: String(row.id),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
    status: isStatus(status) ? status : "new",
    name: String(row.name || ""),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    product: String(row.product || ""),
    size: String(row.size || ""),
    people: Number(row.people || 1),
    clothes: String(row.clothes || ""),
    pose: String(row.pose || ""),
    box: row.box === "premium" ? "premium" : "standard",
    rush: Boolean(row.rush),
    secondCopy: Boolean(row.second_copy),
    files: {
      photo: row.photo_ref ? String(row.photo_ref) : undefined,
      preview: row.preview_ref ? String(row.preview_ref) : undefined,
      glb: row.glb_ref ? String(row.glb_ref) : undefined,
      stl: row.stl_ref ? String(row.stl_ref) : undefined,
    },
  };
}

export async function listOrders() {
  if (!databaseUrl()) {
    const orders = await readLocalOrders();
    return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  await ensureSchema();
  const rows = await sqlClient()`
    select * from orders order by created_at desc
  `;
  return rows.map((row) => rowToOrder(row as Record<string, unknown>));
}

export async function getOrder(id: string) {
  if (!databaseUrl()) {
    return (await readLocalOrders()).find((order) => order.id === id) || null;
  }
  await ensureSchema();
  const rows = await sqlClient()`select * from orders where id = ${id} limit 1`;
  const row = rows[0];
  return row ? rowToOrder(row as Record<string, unknown>) : null;
}

export async function createOrder(order: Order) {
  if (!databaseUrl()) {
    const orders = await readLocalOrders();
    orders.push(order);
    await writeLocalOrders(orders);
    return order;
  }
  await ensureSchema();
  await sqlClient()`
    insert into orders (
      id, created_at, updated_at, status, name, email, phone, product, size, people,
      clothes, pose, box, rush, second_copy, photo_ref, preview_ref, glb_ref, stl_ref
    ) values (
      ${order.id}, ${order.createdAt}, ${order.updatedAt}, ${order.status}, ${order.name},
      ${order.email}, ${order.phone}, ${order.product}, ${order.size}, ${order.people},
      ${order.clothes}, ${order.pose}, ${order.box}, ${order.rush}, ${order.secondCopy},
      ${order.files.photo || null}, ${order.files.preview || null}, ${order.files.glb || null},
      ${order.files.stl || null}
    )
  `;
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const updatedAt = new Date().toISOString();
  if (!databaseUrl()) {
    const orders = await readLocalOrders();
    const order = orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = updatedAt;
    await writeLocalOrders(orders);
    return order;
  }
  await ensureSchema();
  const rows = await sqlClient()`
    update orders set status = ${status}, updated_at = ${updatedAt}
    where id = ${id}
    returning *
  `;
  const row = rows[0];
  return row ? rowToOrder(row as Record<string, unknown>) : null;
}
