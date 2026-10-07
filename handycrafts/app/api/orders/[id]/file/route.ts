import { NextResponse } from "next/server";
import { fileResponse, readStoredFile } from "@/lib/files";
import { manageAllowed } from "@/lib/manage-auth";
import { getOrder } from "@/lib/orders";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(req: Request, context: Context) {
  if (!(await manageAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  const params = new URL(req.url).searchParams;
  const kind = params.get("kind");
  const index = Number(params.get("item") || 0);
  if (kind !== "photo" && kind !== "preview" && kind !== "extra") {
    return NextResponse.json({ error: "Няма такъв файл." }, { status: 400 });
  }
  const order = await getOrder((await context.params).id);
  const item = order?.items[index];
  // Extra photos from the studio chat are numbered with ?n=.
  const ref = kind === "extra" ? item?.extras?.[Number(params.get("n") || 0)] : item?.[kind];
  const file = ref ? await readStoredFile(ref) : null;
  if (!order || !file) return NextResponse.json({ error: "Файлът липсва." }, { status: 404 });

  const download = params.get("download") === "1"
    ? `${order.number}-${index + 1}-${kind}${kind === "extra" ? `-${Number(params.get("n") || 0) + 1}` : ""}.${file.contentType.split("/")[1] || "jpg"}`
    : undefined;
  return fileResponse(file, "private, max-age=3600", download);
}
