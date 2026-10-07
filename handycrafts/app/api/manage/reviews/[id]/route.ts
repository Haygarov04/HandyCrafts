import { NextResponse } from "next/server";
import { manageAllowed } from "@/lib/manage-auth";
import { deleteReview, getReview, isReviewStatus, saveReview } from "@/lib/reviews";
import { cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

/** Publish, hide or tidy up a review from the panel. */
export async function PATCH(req: Request, context: Context) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const review = await getReview((await context.params).id);
  if (!review) return NextResponse.json({ error: "Няма такъв отзив." }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (isReviewStatus(body?.status)) review.status = body.status;
  if (typeof body?.name === "string" && body.name.trim()) review.name = cleanText(body.name, 40);
  if (typeof body?.text === "string" && body.text.trim()) review.text = cleanText(body.text, 1200);
  review.updatedAt = new Date().toISOString();
  await saveReview(review);
  return NextResponse.json({ review });
}

export async function DELETE(req: Request, context: Context) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  await deleteReview((await context.params).id);
  return new NextResponse(null, { status: 204 });
}
