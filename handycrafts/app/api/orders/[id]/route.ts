import { NextResponse } from "next/server";
import { crmAllowed } from "@/lib/crm-auth";
import { orderStatuses, type OrderStatus } from "@/lib/order-types";
import { getOrder, updateOrderStatus } from "@/lib/orders";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Context) {
  if (!(await crmAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  const { id } = await context.params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Няма такава поръчка." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: Request, context: Context) {
  if (!(await crmAllowed())) {
    return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  }
  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const status = String(body?.status || "");
  if (!(orderStatuses as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Непознат статус." }, { status: 400 });
  }
  const order = await updateOrderStatus(id, status as OrderStatus);
  if (!order) return NextResponse.json({ error: "Няма такава поръчка." }, { status: 404 });
  return NextResponse.json({ order });
}
