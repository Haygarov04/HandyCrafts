import { NextResponse } from "next/server";
import { deleteLead, isLeadStatus, updateLead } from "@/lib/leads";
import { manageAllowed } from "@/lib/manage-auth";
import { cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";

async function guard(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Невалидна заявка." }, { status: 403 });
  if (!(await manageAllowed())) return NextResponse.json({ error: "Няма достъп." }, { status: 401 });
  return null;
}

export async function PATCH(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const lead = await updateLead(String(body.id || ""), {
    status: isLeadStatus(body.status) ? body.status : undefined,
    internalNote: typeof body.internalNote === "string" ? cleanText(body.internalNote, 1000) : undefined,
    optOut: body.optOut === true ? true : undefined,
  });
  if (!lead) return NextResponse.json({ error: "Няма такъв лийд." }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  await deleteLead(String(body.id || ""));
  return NextResponse.json({ ok: true });
}
