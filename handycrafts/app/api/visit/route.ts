import { after, NextResponse } from "next/server";
import { sendDueReminders } from "@/lib/lead-mail";
import { allow, sameOrigin } from "@/lib/security";
import { isVisitSource, recordVisit } from "@/lib/visits";

export const runtime = "nodejs";

/** Counts one visit per browser session, by source. No personal data is stored. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return new NextResponse(null, { status: 204 });
  if (!(await allow("visit", req, 20, 3600))) return new NextResponse(null, { status: 204 });
  const body = await req.json().catch(() => null);
  const source = isVisitSource(body?.source) ? body.source : "other";
  await recordVisit(source).catch(() => undefined);
  // Visits double as the clock for reminder emails, so they go out within minutes without a frequent cron.
  after(() => sendDueReminders().catch((error) => console.error("LEAD_MAIL", error)));
  return new NextResponse(null, { status: 204 });
}
