import { NextResponse } from "next/server";
import { currentCm, itemLabel, maxQty, normalizePeople, priceFor } from "@/lib/catalog";
import { getLead, isLeadId, saveLead, type Lead } from "@/lib/leads";
import { deliveryLabel, type Delivery } from "@/lib/order-types";
import { getDraft } from "@/lib/orders";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

/** Saves what someone has typed at checkout so far, once there is a phone or an email to reach them on. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new NextResponse(null, { status: 403 });
  if (!(await allow("lead", req, 60, 3600))) return new NextResponse(null, { status: 429 });

  const body = await req.json().catch(() => null);
  const id = String(body?.id || "");
  if (!body || !isLeadId(id) || cleanText(body.website, 100)) return new NextResponse(null, { status: 204 });

  const raw = body.customer || {};
  const phone = cleanText(raw.phone, 30);
  const email = cleanText(raw.email, 120);
  const reachable = phone.replace(/\D/g, "").length >= 8 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!reachable) return new NextResponse(null, { status: 204 });

  const existing = await getLead(id);
  if (existing?.status === "won") return new NextResponse(null, { status: 204 });

  const items: Lead["items"] = [];
  for (const entry of (Array.isArray(body.items) ? body.items.slice(0, 10) : []) as { draftId?: unknown; qty?: unknown; cm?: unknown }[]) {
    const draft = await getDraft(String(entry?.draftId || ""));
    if (!draft) continue;
    const cm = currentCm(draft.product, Number(entry.cm) || draft.cm);
    const people = normalizePeople(draft.product, draft.subject || "person", draft.people);
    const price = priceFor(draft.product, cm, people);
    if (price === null) continue;
    items.push({
      draftId: draft.id,
      product: draft.product,
      subject: draft.subject || "person",
      people,
      label: itemLabel(draft.product, draft.subject, people),
      cm,
      qty: Math.min(maxQty, Math.max(1, Math.floor(Number(entry.qty) || 1))),
      price,
      preview: draft.preview,
    });
  }
  if (items.length === 0) return new NextResponse(null, { status: 204 });

  const delivery = String(raw.delivery || "") as Delivery;
  const now = new Date().toISOString();
  await saveLead({
    id,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    status: existing?.status || "open",
    lang: body.lang === "en" ? "en" : "bg",
    // Keep what we already have (an email left in the studio) when the checkout field is still empty.
    customer: {
      name: cleanText(raw.name, 80) || existing?.customer.name || "",
      phone: phone || existing?.customer.phone || "",
      email: email || existing?.customer.email || "",
      city: cleanText(raw.city, 60) || existing?.customer.city || "",
      delivery: delivery in deliveryLabel ? delivery : "econt",
      address: cleanText(raw.address, 200) || existing?.customer.address || "",
    },
    items,
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    internalNote: existing?.internalNote,
    emails: existing?.emails,
    optOut: existing?.optOut,
    source: existing?.source,
  });
  return new NextResponse(null, { status: 204 });
}
