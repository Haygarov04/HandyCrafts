import { NextResponse } from "next/server";
import { fileResponse, readStoredFile } from "@/lib/files";
import { getDraft, saveDraft } from "@/lib/orders";
import { allow, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

// The draft id is a random UUID only the customer's browser knows, and only the
// generated preview is served here. The original photo never leaves /manage.
export async function GET(_req: Request, context: Context) {
  const { id } = await context.params;
  const draft = await getDraft(id);
  const file = draft ? await readStoredFile(draft.preview) : null;
  if (!file) return NextResponse.json({ error: "Няма такава визуализация." }, { status: 404 });
  return fileResponse(file, "private, max-age=86400, immutable");
}

/** Notes that the customer put this preview in the cart, so the panel can show where people stop. */
export async function POST(req: Request, context: Context) {
  if (!sameOrigin(req)) return new NextResponse(null, { status: 403 });
  if (!(await allow("draft-cart", req, 30, 3600))) return new NextResponse(null, { status: 429 });
  const { id } = await context.params;
  const draft = await getDraft(id);
  if (draft && !draft.cartAt) await saveDraft({ ...draft, cartAt: new Date().toISOString() });
  return new NextResponse(null, { status: 204 });
}
