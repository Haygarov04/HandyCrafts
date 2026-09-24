import { NextResponse } from "next/server";
import { hasPassword, MANAGE_COOKIE, newSession, passwordMatches } from "@/lib/manage-auth";
import { allow, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Невалидна заявка." }, { status: 403 });
  if (!hasPassword()) {
    return NextResponse.json({ error: "Сложи CRM_PASSWORD във Vercel." }, { status: 400 });
  }
  if (!(await allow("login", req, 8, 900))) {
    return NextResponse.json({ error: "Много опити. Изчакай 15 минути." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (!passwordMatches(String(body?.password || ""))) {
    return NextResponse.json({ error: "Грешна парола." }, { status: 401 });
  }
  const session = newSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(MANAGE_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Невалидна заявка." }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(MANAGE_COOKIE);
  return response;
}
