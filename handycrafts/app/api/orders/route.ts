import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { translator } from "@/lib/api-lang";
import { itemLabel, maxQty, priceFor } from "@/lib/catalog";
import { sendCustomerEmail, sendNewOrderToShop } from "@/lib/mail";
import { manageAllowed } from "@/lib/manage-auth";
import { deliveryLabel, type Delivery, type Order, type OrderItem } from "@/lib/order-types";
import { createOrder, getDraft, listOrders, logEmail, nextOrderNumber } from "@/lib/orders";
import { notifyAll } from "@/lib/push";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function GET() {
  if (!(await manageAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders() });
}


export async function POST(req: Request) {
  const tr = translator(req);
  try {
    if (!sameOrigin(req)) {
      return NextResponse.json({ error: tr("Невалидна заявка.", "Invalid request.") }, { status: 403 });
    }
    if (!(await allow("order", req, 6, 3600))) {
      return NextResponse.json(
        { error: tr("Твърде много поръчки за кратко. Обади ни се или опитай след малко.", "Too many orders in a short time. Call us or try again shortly.") },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: tr("Празна поръчка.", "Empty order.") }, { status: 400 });
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

    if (name.length < 3) return NextResponse.json({ error: tr("Напиши име и фамилия.", "Please enter your full name.") }, { status: 400 });
    if (!/^\+?[0-9 ()-]{8,20}$/.test(phone)) {
      return NextResponse.json({ error: tr("Напиши телефон, на който да те потърсим.", "Please enter a phone number we can call.") }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: tr("Имейлът не изглежда верен.", "That email doesn't look right.") }, { status: 400 });
    }
    if (!(delivery in deliveryLabel) || !city || address.length < 3) {
      return NextResponse.json({ error: tr("Попълни град и офис или адрес за доставка.", "Please fill in the city and the office or delivery address.") }, { status: 400 });
    }

    const rawItems: unknown[] = Array.isArray(body.items) ? body.items.slice(0, 10) : [];
    if (rawItems.length === 0) {
      return NextResponse.json({ error: tr("Количката е празна.", "Your cart is empty.") }, { status: 400 });
    }

    const items: OrderItem[] = [];
    for (const raw of rawItems) {
      const entry = raw as { draftId?: unknown; qty?: unknown; cm?: unknown };
      const draft = await getDraft(String(entry.draftId || ""));
      if (!draft) {
        return NextResponse.json(
          { error: tr("Една от визуализациите е изтекла. Махни я от количката и я направи отново.", "One of the previews has expired. Remove it from the cart and make it again.") },
          { status: 400 }
        );
      }
      // The size can change after the preview, the product cannot.
      const cm = Number(entry.cm) || draft.cm;
      const price = priceFor(draft.product, cm);
      if (price === null) return NextResponse.json({ error: tr("Непознат размер.", "Unknown size.") }, { status: 400 });
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
      lang: body.lang === "en" ? "en" : "bg",
      customer: { name, phone, email, city, delivery, address },
      note: cleanText(body.note, 600),
      internalNote: "",
      items,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    };

    await createOrder(order);

    await Promise.allSettled([
      notifyAll({
        title: `Нова поръчка ${order.number}`,
        body: `${name} · ${items.map((i) => `${i.label} ${i.cm} см`).join(", ")} · ${order.total} €`,
        url: `/manage/${order.id}`,
      }),
      sendNewOrderToShop(order),
      order.customer.email
        ? sendCustomerEmail(order, "received").then((ok) => logEmail(order.id, "received", ok))
        : Promise.resolve(),
    ]);

    return NextResponse.json({ id: order.id, number: order.number });
  } catch (error) {
    console.error("ORDER_CREATE", error);
    return NextResponse.json(
      { error: tr("Поръчката не се записа. Пиши ни на handycraftshelp@gmail.com.", "The order wasn't saved. Please email handycraftshelp@gmail.com.") },
      { status: 500 }
    );
  }
}
