import { NextResponse } from "next/server";
import { CRM_COOKIE, crmPassword, passwordMatches, sessionToken } from "@/lib/crm-auth";

export async function POST(req: Request) {
  if (!crmPassword()) {
    return NextResponse.json(
      { error: "Сложи CRM_PASSWORD в променливите, преди магазинът да е публичен." },
      { status: 400 }
    );
  }
  const body = await req.json().catch(() => null);
  const password = String(body?.password || "");
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Грешна парола." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CRM_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
