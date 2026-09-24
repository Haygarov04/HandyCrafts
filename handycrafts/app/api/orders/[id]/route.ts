import { NextResponse } from "next/server";
import { manageAllowed } from "@/lib/manage-auth";
import { isStatus } from "@/lib/order-types";
import { sendCustomerEmail, type CustomerEmail } from "@/lib/mail";
import { getOrder, logEmail, updateOrder } from "@/lib/orders";
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
  const id = (await context.params).id;
  const body = await req.json().catch(() => null);
  const change: Parameters<typeof updateOrder>[1] = {};
  if (body?.status !== undefined) {
    if (!isStatus(body.status)) {
      return NextResponse.json({ error: "Непознат статус." }, { status: 400 });
    }
    change.status = body.status;
  }
  if (typeof body?.internalNote === "string") change.internalNote = cleanText(body.internalNote, 2000);
  if (body?.tracking === null) change.tracking = null;
  if (body?.tracking && typeof body.tracking === "object") {
    const number = cleanText(body.tracking.number, 40);
    change.tracking = number ? { courier: body.tracking.courier === "speedy" ? "speedy" : "econt", number } : null;
  }

  const before = await getOrder(id);
  const order = await updateOrder(id, change);
  if (!order) return NextResponse.json({ error: "Няма такава поръчка." }, { status: 404 });

  // A status change emails the customer unless the workshop unticks "notify".
  let emailed: boolean | null = null;
  const statusChanged = change.status && before?.status !== change.status && change.status !== "new";
  const resend = body?.resend === true && order.status !== "new";
  if ((statusChanged && body?.notify !== false) || resend) {
    const type = order.status as CustomerEmail;
    emailed = order.customer.email ? await sendCustomerEmail(order, type) : false;
    if (order.customer.email) await logEmail(id, type, emailed);
  }
  return NextResponse.json({ order, emailed });
}
