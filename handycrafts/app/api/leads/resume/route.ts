import { NextResponse } from "next/server";
import { getLead, leadTokenValid } from "@/lib/leads";
import { getDraft } from "@/lib/orders";

export const runtime = "nodejs";

/** Opens a saved checkout from a reminder email, on any device. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  if (!leadTokenValid(id, url.searchParams.get("t") || "")) return NextResponse.json({ error: "invalid" }, { status: 404 });
  const lead = await getLead(id);
  if (!lead || lead.status === "won") return NextResponse.json({ error: "gone" }, { status: 404 });

  const items = [];
  for (const item of lead.items) {
    if (!(await getDraft(item.draftId))) continue;
    items.push({
      draftId: item.draftId,
      product: item.product || "figurine",
      subject: item.subject || "person",
      people: item.people || 1,
      label: item.label,
      cm: item.cm,
      price: item.price,
      qty: item.qty,
      previewUrl: `/api/studio/draft/${item.draftId}`,
    });
  }
  const c = lead.customer;
  return NextResponse.json({
    id: lead.id,
    items,
    customer: { name: c.name, phone: c.phone, email: c.email, city: c.city, delivery: c.delivery, address: c.address },
  });
}
