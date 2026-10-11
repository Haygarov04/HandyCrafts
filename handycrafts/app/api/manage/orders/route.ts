import { NextResponse } from "next/server";
import { manageAllowed } from "@/lib/manage-auth";
import { manualOrderFromForm } from "@/lib/manual-order";
import { createOrder } from "@/lib/orders";
import { sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

/** An order from Facebook, TikTok, the phone… typed in by hand. No email goes out. */
export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Липсват данни." }, { status: 400 });
  const order = await manualOrderFromForm(form);
  if (typeof order === "string") return NextResponse.json({ error: order }, { status: 400 });
  await createOrder(order);
  return NextResponse.json({ id: order.id });
}
