import { NextResponse } from "next/server";
import { manageAllowed } from "@/lib/manage-auth";
import { addSubscription, isSubscription, notifyAll, pushReady, removeSubscription } from "@/lib/push";
import { cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

async function guard(req: Request) {
  if (!sameOrigin(req) || !(await manageAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  if (!pushReady()) {
    return NextResponse.json({ error: "Липсват VAPID ключовете във Vercel." }, { status: 503 });
  }
  return null;
}

export async function POST(req: Request) {
  const blocked = await guard(req);
  if (blocked) return blocked;
  const body = await req.json().catch(() => null);

  if (body?.test) {
    await notifyAll({ title: "HandyCrafts", body: "Известията работят.", url: "/manage" });
    return NextResponse.json({ ok: true });
  }
  if (!isSubscription(body?.subscription)) {
    return NextResponse.json({ error: "Невалиден абонамент." }, { status: 400 });
  }
  await addSubscription(body.subscription, cleanText(body.device, 120));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const blocked = await guard(req);
  if (blocked) return blocked;
  const body = await req.json().catch(() => null);
  if (typeof body?.endpoint === "string") await removeSubscription(body.endpoint);
  return NextResponse.json({ ok: true });
}
