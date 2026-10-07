import { NextResponse } from "next/server";
import { itemLabel } from "@/lib/catalog";
import { getOrder } from "@/lib/orders";
import { notifyAll } from "@/lib/push";
import { displayName, getReview, listReviews, reviewTokenValid, saveReview, type PublicReview } from "@/lib/reviews";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

/** Published reviews for the site. Cached for a few minutes, so a newly published one shows up shortly after. */
export async function GET() {
  const reviews = (await listReviews()).filter((review) => review.status === "approved");
  const list: PublicReview[] = reviews.slice(0, 24).map(({ id, rating, text, name, city, product, createdAt, lang }) => ({
    id,
    rating,
    text,
    name,
    city,
    product,
    createdAt,
    lang,
  }));
  return NextResponse.json({ reviews: list }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}

/** A customer sends (or edits) the review for their order from the private link in the email. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new NextResponse(null, { status: 403 });
  if (!(await allow("review", req, 10, 3600))) return NextResponse.json({ error: "Опитай пак след малко." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const lang = body?.lang === "en" ? "en" : "bg";
  const tr = (bg: string, en: string) => (lang === "en" ? en : bg);
  const id = String(body?.o || "");
  if (!reviewTokenValid(id, String(body?.t || ""))) {
    return NextResponse.json({ error: tr("Линкът не е валиден.", "This link isn't valid.") }, { status: 404 });
  }
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: tr("Няма такава поръчка.", "Order not found.") }, { status: 404 });

  const rating = Math.round(Number(body?.rating));
  const text = cleanText(body?.text, 1200);
  const name = cleanText(body?.name, 40) || displayName(order.customer.name);
  if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: tr("Избери оценка.", "Choose a rating.") }, { status: 400 });
  if (text.length < 10) return NextResponse.json({ error: tr("Напиши поне едно изречение.", "Write at least one sentence.") }, { status: 400 });
  if (!body?.consent) {
    return NextResponse.json({ error: tr("Потвърди, че може да го публикуваме.", "Please confirm we may publish it.") }, { status: 400 });
  }

  const existing = await getReview(id);
  const now = new Date().toISOString();
  const first = order.items[0];
  await saveReview({
    id,
    orderNumber: order.number,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    // An edited review goes back for approval.
    status: "pending",
    lang,
    rating,
    text,
    name,
    city: cleanText(order.customer.city.replace(/,.*$/, ""), 60),
    product: first ? `${itemLabel(first.product, first.subject, first.people)} · ${first.cm} см` : "",
  });
  await notifyAll({ title: `Нов отзив ${"★".repeat(rating)}`, body: `${name}: ${text.slice(0, 120)}`, url: "/manage/reviews" }).catch(() => undefined);
  return NextResponse.json({ ok: true, google: process.env.GOOGLE_REVIEW_URL || "" });
}
