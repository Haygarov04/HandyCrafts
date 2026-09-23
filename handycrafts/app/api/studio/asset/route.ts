import { NextResponse } from "next/server";
import { pullRemote } from "@/lib/orders";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url") || "";
  const file = await pullRemote(url).catch(() => null);
  if (!file) return NextResponse.json({ error: "Файлът не се зарежда." }, { status: 400 });
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, max-age=600",
    },
  });
}
