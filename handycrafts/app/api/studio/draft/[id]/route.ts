import { NextResponse } from "next/server";
import { fileResponse, readStoredFile } from "@/lib/files";
import { getDraft } from "@/lib/orders";

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
