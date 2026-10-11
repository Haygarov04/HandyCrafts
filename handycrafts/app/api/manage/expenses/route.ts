import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { expenseFromBody, saveExpense } from "@/lib/expenses";
import { manageAllowed } from "@/lib/manage-auth";
import { sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req) || !(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  const expense = expenseFromBody(await req.json().catch(() => null), { id: randomUUID(), createdAt: new Date().toISOString() });
  if (typeof expense === "string") return NextResponse.json({ error: expense }, { status: 400 });
  await saveExpense(expense);
  return NextResponse.json({ expense });
}
