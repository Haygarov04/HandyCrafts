import { NextResponse } from "next/server";
import { manageAllowed } from "@/lib/manage-auth";
import { isStatus, type OrderStatus } from "@/lib/order-types";
import { getOrder, updateOrder } from "@/lib/orders";
import { cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Context) {
  if (!(await manageAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  const order = await getOrder((await context.params).id);
  if (!order) return NextResponse.json({ error: "Няма такава поръчка." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: Request, context: Context) {
  if (!sameOrigin(req) || !(await manageAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const change: { status?: OrderStatus; internalNote?: string } = {};
  if (body?.status !== undefined) {
    if (!isStatus(body.status)) {
      return NextResponse.json({ error: "Непознат статус." }, { status: 400 });
    }
    change.status = body.status;
  }
  if (typeof body?.internalNote === "string") change.internalNote = cleanText(body.internalNote, 2000);

  const order = await updateOrder((await context.params).id, change);
  if (!order) return NextResponse.json({ error: "Няма такава поръчка." }, { status: 404 });
  return NextResponse.json({ order });
}
