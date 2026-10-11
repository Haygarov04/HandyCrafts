import { NextResponse } from "next/server";
import { manageAllowed } from "@/lib/manage-auth";
import { manualOrderFromForm } from "@/lib/manual-order";
import { deleteOrder, getOrder, saveOrder } from "@/lib/orders";
import { sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

/** Edit an order that was added by hand. Orders from the site are changed only through their status and notes. */
export async function PUT(req: Request, context: Context) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const existing = await getOrder((await context.params).id);
  if (!existing?.manual) return NextResponse.json({ error: "Няма такава ръчна поръчка." }, { status: 404 });
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Липсват данни." }, { status: 400 });
  const order = await manualOrderFromForm(form, existing);
  if (typeof order === "string") return NextResponse.json({ error: order }, { status: 400 });
  await saveOrder(order);
  return NextResponse.json({ id: order.id });
}

export async function DELETE(req: Request, context: Context) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const existing = await getOrder((await context.params).id);
  if (!existing?.manual) return NextResponse.json({ error: "Само ръчно добавени поръчки се трият." }, { status: 400 });
  await deleteOrder(existing.id);
  return new NextResponse(null, { status: 204 });
}
