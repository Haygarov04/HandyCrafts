import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { crmAllowed } from "@/lib/crm-auth";
import {
  createOrder,
  listOrders,
  pullRemote,
  saveOrderFile,
  type Order,
  type OrderFileKind,
} from "@/lib/orders";
import { isProductId, products, sizes } from "@/lib/figurine";

export const runtime = "nodejs";

async function keepRemote(orderId: string, kind: OrderFileKind, url: string) {
  if (!url) return undefined;
  if (url.startsWith("data:")) {
    const match = url.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return undefined;
    const bytes = Buffer.from(match[2], "base64");
    if (bytes.length === 0 || bytes.length > 12 * 1024 * 1024) return undefined;
    return saveOrderFile(orderId, kind, bytes, match[1]);
  }
  const pulled = await pullRemote(url).catch(() => null);
  if (pulled) {
    try {
      return await saveOrderFile(orderId, kind, pulled.bytes, pulled.contentType);
    } catch {
      return `remote:${url}`;
    }
  }
  return url.startsWith("https://") ? `remote:${url}` : undefined;
}

async function notify(order: Order) {
  if (!process.env.CONTACT_TO || !process.env.SMTP_HOST || !process.env.SMTP_USER) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: `"HandyCrafts 3D" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO,
    replyTo: order.email,
    subject: `Нова поръчка ${order.id.slice(0, 8)} — ${order.name}`,
    text: `${order.name} поиска ${order.product}, ${order.size}. Поръчката е в CRM.`,
  });
}

export async function GET() {
  if (!(await crmAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const product = String(form.get("product") || "");
    const size = String(form.get("size") || "");
    const people = Number(form.get("people") || 1);
    const clothes = String(form.get("clothes") || "").slice(0, 600);
    const pose = String(form.get("pose") || "").slice(0, 400);
    const box = form.get("box") === "premium" ? "premium" : "standard";
    const photo = form.get("photo");

    if (!name || !email.includes("@")) {
      return NextResponse.json({ error: "Напиши име и валиден имейл." }, { status: 400 });
    }
    if (!isProductId(product) || !sizes.includes(size as (typeof sizes)[number])) {
      return NextResponse.json({ error: "Избери продукт и размер." }, { status: 400 });
    }
    if (!(photo instanceof File) || !photo.type.startsWith("image/") || photo.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Поръчката трябва да е със снимката." }, { status: 400 });
    }

    const id = randomUUID();
    const now = new Date().toISOString();
    const files: Order["files"] = {};
    files.photo = await saveOrderFile(id, "photo", Buffer.from(await photo.arrayBuffer()), photo.type || "image/jpeg");
    files.preview = await keepRemote(id, "preview", String(form.get("previewUrl") || ""));
    files.glb = await keepRemote(id, "glb", String(form.get("glbUrl") || ""));
    files.stl = await keepRemote(id, "stl", String(form.get("stlUrl") || ""));

    const order: Order = {
      id,
      createdAt: now,
      updatedAt: now,
      status: "new",
      name,
      email,
      phone,
      product: products[product].label,
      size,
      people: Math.min(3, Math.max(1, people)),
      clothes,
      pose,
      box,
      rush: form.get("rush") === "true",
      secondCopy: form.get("secondCopy") === "true",
      files,
    };

    await createOrder(order);
    await notify(order).catch(() => undefined);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("ORDER_CREATE", error);
    return NextResponse.json({ error: "Поръчката не се записа." }, { status: 500 });
  }
}
