import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { currentCm, itemLabel, normalizePeople, priceFor } from "@/lib/catalog";
import { previewEmail } from "@/lib/lead-mail";
import { getLead, isLeadId, saveLead, type Lead } from "@/lib/leads";
import { mailReady, sendEmail } from "@/lib/mail";
import { getDraft } from "@/lib/orders";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

/** Emails a studio preview to the customer and keeps their email, so an unfinished order can still be followed up. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new NextResponse(null, { status: 403 });
  if (!(await allow("lead-preview", req, 10, 3600))) {
    return NextResponse.json({ error: "Опитай пак след малко." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const lang = body?.lang === "en" ? "en" : "bg";
  const email = cleanText(body?.email, 120);
  if (cleanText(body?.website, 100)) return NextResponse.json({ ok: true });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: lang === "en" ? "Check the email address." : "Провери имейла." }, { status: 400 });
  }
  const draft = await getDraft(String(body?.draftId || ""));
  if (!draft) {
    return NextResponse.json({ error: lang === "en" ? "The preview has expired." : "Визуализацията е изтекла." }, { status: 404 });
  }

  const people = normalizePeople(draft.product, draft.subject || "person", draft.people);
  const asked = currentCm(draft.product, Number(body?.cm));
  const cm = priceFor(draft.product, asked, people) === null ? currentCm(draft.product, draft.cm) : asked;
  const item: Lead["items"][number] = {
    draftId: draft.id,
    product: draft.product,
    subject: draft.subject || "person",
    people,
    label: itemLabel(draft.product, draft.subject, people),
    cm,
    qty: 1,
    price: priceFor(draft.product, cm, people) ?? 0,
    preview: draft.preview,
  };

  // Reuse the browser's open lead so checkout later updates the same record; start fresh after an order.
  const requested = String(body?.id || "");
  const existing = isLeadId(requested) ? await getLead(requested) : null;
  const lead: Lead =
    existing && existing.status !== "won"
      ? existing
      : {
          id: isLeadId(requested) && !existing ? requested : randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "open",
          lang,
          customer: { name: "", phone: "", email: "", city: "", delivery: "econt", address: "" },
          items: [],
          total: 0,
          source: "studio",
        };

  lead.customer.email = email;
  lead.lang = lang;
  lead.optOut = false;
  lead.items = [item, ...lead.items.filter((entry) => entry.draftId !== draft.id)].slice(0, 10);
  lead.total = lead.items.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  lead.updatedAt = new Date().toISOString();

  // The preview itself is the first email; the reminders that follow pick up from it.
  if (mailReady()) {
    const ok = await sendEmail({ to: email, ...previewEmail(lead) });
    if (!(lead.emails || []).length) {
      lead.emails = [{ step: 0, at: new Date().toISOString(), ok }];
      lead.source = "studio";
    }
  }
  await saveLead(lead);
  return NextResponse.json({ ok: true, id: lead.id });
}
