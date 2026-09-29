import { NextResponse } from "next/server";
import { fileResponse, readStoredFile } from "@/lib/files";
import { getLead } from "@/lib/leads";
import { manageAllowed } from "@/lib/manage-auth";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: Context) {
  if (!(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const index = Number(new URL(req.url).searchParams.get("item") || 0);
  const lead = await getLead((await context.params).id);
  const ref = lead?.items[index]?.preview;
  const file = ref ? await readStoredFile(ref) : null;
  if (!file) return NextResponse.json({ error: "Файлът липсва." }, { status: 404 });
  return fileResponse(file, "private, max-age=3600");
}
