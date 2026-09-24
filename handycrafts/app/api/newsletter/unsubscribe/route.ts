import { NextResponse } from "next/server";
import { normalizeEmail, tokenValid, unsubscribe } from "@/lib/newsletter";

export const runtime = "nodejs";

// POST only, so link scanners in mail apps can't unsubscribe people by opening the link.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  if (!email || !tokenValid(email, String(body?.token || ""))) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await unsubscribe(email);
  return NextResponse.json({ ok: true });
}
