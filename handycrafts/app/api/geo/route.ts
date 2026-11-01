import { NextResponse } from "next/server";

// The visitor's country from Vercel's edge (empty locally). Used only to offer the English site to
// visitors from abroad — never to redirect, so search engines always see the page they asked for.
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase();
  return NextResponse.json({ country }, { headers: { "Cache-Control": "private, no-store" } });
}
