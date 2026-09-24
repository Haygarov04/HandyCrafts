import { NextResponse } from "next/server";
import { sendContactMail } from "@/lib/mail";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Невалидна заявка." }, { status: 403 });
  if (!(await allow("contact", req, 5, 3600))) {
    return NextResponse.json({ error: "Много съобщения за кратко. Опитай след малко." }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  if (cleanText(body?.website, 100)) return NextResponse.json({ success: true });

  const name = cleanText(body?.name, 80);
  const email = cleanText(body?.email, 120);
  const phone = cleanText(body?.phone, 30);
  const message = cleanText(body?.message, 3000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return NextResponse.json({ error: "Попълни име, имейл и съобщение." }, { status: 400 });
  }

  try {
    await sendContactMail({ name, email, phone, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT", error);
    return NextResponse.json(
      { error: "Не успяхме да изпратим. Пиши ни на handycraftshelp@gmail.com." },
      { status: 500 }
    );
  }
}
