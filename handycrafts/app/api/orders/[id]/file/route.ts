import { NextResponse } from "next/server";
import { crmAllowed } from "@/lib/crm-auth";
import { getOrder, readOrderFile, type OrderFileKind } from "@/lib/orders";

export const runtime = "nodejs";

const kinds = new Set<OrderFileKind>(["photo", "preview", "glb", "stl"]);

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: Context) {
  if (!(await crmAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  const { id } = await context.params;
  const kind = new URL(req.url).searchParams.get("kind") || "";
  if (!kinds.has(kind as OrderFileKind)) {
    return NextResponse.json({ error: "Няма такъв файл." }, { status: 400 });
  }
  const order = await getOrder(id);
  const ref = order?.files[kind as OrderFileKind];
  if (!ref) return NextResponse.json({ error: "Файлът липсва." }, { status: 404 });

  const file = await readOrderFile(ref);
  if (!file) return NextResponse.json({ error: "Файлът не се чете." }, { status: 404 });

  const download = new URL(req.url).searchParams.get("download") === "1";
  const headers = new Headers({
    "Content-Type": file.contentType,
    "Cache-Control": "private, max-age=3600",
  });
  if (download) headers.set("Content-Disposition", `attachment; filename="${kind}"`);
  if ("stream" in file && file.stream) return new Response(file.stream, { headers });
  if ("bytes" in file && file.bytes) {
    return new Response(new Uint8Array(file.bytes), { headers });
  }
  return NextResponse.json({ error: "Файлът не се чете." }, { status: 404 });
}
