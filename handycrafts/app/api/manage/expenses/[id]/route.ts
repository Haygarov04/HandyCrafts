import { NextResponse } from "next/server";
import { deleteExpense, expenseFromBody, getExpense, saveExpense } from "@/lib/expenses";
import { manageAllowed } from "@/lib/manage-auth";
import { sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PUT(req: Request, context: Context) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const existing = await getExpense((await context.params).id);
  if (!existing) return NextResponse.json({ error: "Няма такъв разход." }, { status: 404 });
  const expense = expenseFromBody(await req.json().catch(() => null), existing);
  if (typeof expense === "string") return NextResponse.json({ error: expense }, { status: 400 });
  await saveExpense(expense);
  return NextResponse.json({ expense });
}

export async function DELETE(req: Request, context: Context) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  await deleteExpense((await context.params).id);
  return new NextResponse(null, { status: 204 });
}
