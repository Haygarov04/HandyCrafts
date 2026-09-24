import { NextResponse } from "next/server";
import { translator } from "@/lib/api-lang";
import { sendContactMail } from "@/lib/mail";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const tr = translator(req);
  if (!sameOrigin(req)) return NextResponse.json({ error: tr("Невалидна заявка.", "Invalid request.") }, { status: 403 });
  if (!(await allow("contact", req, 5, 3600))) {
    return NextResponse.json({ error: tr("Много съобщения за кратко. Опитай след малко.", "Too many messages in a short time. Please try again shortly.") }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (cleanText(body?.website, 100)) return NextResponse.json({ success: true });

  const name = cleanText(body?.name, 80);
  const email = cleanText(body?.email, 120);
  const phone = cleanText(body?.phone, 30);
  const message = cleanText(body?.message, 3000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return NextResponse.json({ error: tr("Попълни име, имейл и съобщение.", "Please fill in your name, email and message.") }, { status: 400 });
  }

  try {
    await sendContactMail({ name, email, phone, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT", error);
    return NextResponse.json(
      { error: tr("Не успяхме да изпратим. Пиши ни на handycraftshelp@gmail.com.", "We couldn't send it. Please email handycraftshelp@gmail.com.") },
      { status: 500 }
    );
  }
}
