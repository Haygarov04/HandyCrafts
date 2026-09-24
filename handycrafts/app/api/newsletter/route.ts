import { NextResponse } from "next/server";
import { translator } from "@/lib/api-lang";
import { sendWelcomeEmail } from "@/lib/mail";
import { normalizeEmail, subscribe } from "@/lib/newsletter";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const tr = translator(req);
  if (!sameOrigin(req)) return NextResponse.json({ error: tr("Невалидна заявка.", "Invalid request.") }, { status: 403 });
  if (!(await allow("newsletter", req, 5, 3600))) {
    return NextResponse.json({ error: tr("Опитай пак след малко.", "Please try again shortly.") }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (cleanText(body?.website, 100)) return NextResponse.json({ ok: true });
  const email = normalizeEmail(body?.email);
  if (!email) return NextResponse.json({ error: tr("Имейлът не изглежда верен.", "That email doesn't look right.") }, { status: 400 });

  const lang = body?.lang === "en" ? "en" : "bg";
  const isNew = await subscribe(email, lang, "site");
  if (isNew) await sendWelcomeEmail(email, lang).catch(() => false);
  return NextResponse.json({ ok: true });
}
