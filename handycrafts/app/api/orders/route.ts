import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { itemLabel, maxQty, priceFor } from "@/lib/catalog";
import { sendOrderMails } from "@/lib/mail";
import { manageAllowed } from "@/lib/manage-auth";
import { deliveryLabel, type Delivery, type Order, type OrderItem } from "@/lib/order-types";
import { createOrder, getDraft, listOrders, nextOrderNumber } from "@/lib/orders";
import { notifyAll } from "@/lib/push";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function GET() {
  if (!(await manageAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders() });
}

function siteUrl(req: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return new URL(req.url).origin;
}

export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) {
      return NextResponse.json({ error: "Невалидна заявка." }, { status: 403 });
    }
    if (!(await allow("order", req, 6, 3600))) {
      return NextResponse.json(
        { error: "Твърде много поръчки за кратко. Обади ни се или опитай след малко." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Празна поръчка." }, { status: 400 });
    }
    // Honeypot: real people never see or fill this field.
    if (cleanText(body.website, 100)) return NextResponse.json({ id: randomUUID(), number: "HC-0" });

    const customer = body.customer || {};
    const name = cleanText(customer.name, 80);
    const phone = cleanText(customer.phone, 30);
    const email = cleanText(customer.email, 120);
    const city = cleanText(customer.city, 60);
    const address = cleanText(customer.address, 200);
    const delivery = String(customer.delivery || "") as Delivery;

    if (name.length < 3) return NextResponse.json({ error: "Напиши име и фамилия." }, { status: 400 });
    if (!/^\+?[0-9 ()-]{8,20}$/.test(phone)) {
      return NextResponse.json({ error: "Напиши телефон, на който да те потърсим." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Имейлът не изглежда верен." }, { status: 400 });
    }
    if (!(delivery in deliveryLabel) || !city || address.length < 3) {
      return NextResponse.json({ error: "Попълни град и офис или адрес за доставка." }, { status: 400 });
    }

    const rawItems: unknown[] = Array.isArray(body.items) ? body.items.slice(0, 10) : [];
    if (rawItems.length === 0) {
      return NextResponse.json({ error: "Количката е празна." }, { status: 400 });
    }

    const items: OrderItem[] = [];
    for (const raw of rawItems) {
      const entry = raw as { draftId?: unknown; qty?: unknown; cm?: unknown };
      const draft = await getDraft(String(entry.draftId || ""));
      if (!draft) {
        return NextResponse.json(
          { error: "Една от визуализациите е изтекла. Махни я от количката и я направи отново." },
          { status: 400 }
        );
      }
      // The size can change after the preview, the product cannot.
      const cm = Number(entry.cm) || draft.cm;
      const price = priceFor(draft.product, cm);
      if (price === null) return NextResponse.json({ error: "Непознат размер." }, { status: 400 });
      const qty = Math.min(maxQty, Math.max(1, Math.floor(Number(entry.qty) || 1)));
      items.push({
        draftId: draft.id,
        product: draft.product,
        subject: draft.subject || "person",
        label: itemLabel(draft.product, draft.subject),
        cm,
        price,
        qty,
        clothes: draft.clothes,
        pose: draft.pose,
        photo: draft.photo,
        preview: draft.preview,
      });
    }

    const now = new Date().toISOString();
    const order: Order = {
      id: randomUUID(),
      number: await nextOrderNumber(),
      createdAt: now,
      updatedAt: now,
      status: "new",
      payment: "cod",
      customer: { name, phone, email, city, delivery, address },
      note: cleanText(body.note, 600),
      internalNote: "",
      items,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    };

    await createOrder(order);

    const base = siteUrl(req);
    await Promise.allSettled([
      notifyAll({
        title: `Нова поръчка ${order.number}`,
        body: `${name} · ${items.map((i) => `${i.label} ${i.cm} см`).join(", ")} · ${order.total} €`,
        url: `/manage/${order.id}`,
      }),
      sendOrderMails(order, base),
    ]);

    return NextResponse.json({ id: order.id, number: order.number });
  } catch (error) {
    console.error("ORDER_CREATE", error);
    return NextResponse.json(
      { error: "Поръчката не се записа. Пиши ни на handycraftshelp@gmail.com." },
      { status: 500 }
    );
  }
}
