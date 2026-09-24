import { manageAllowed } from "@/lib/manage-auth";
import { listSubscribers } from "@/lib/newsletter";

export const runtime = "nodejs";

/** CSV export of the newsletter list for /manage. */
export async function GET() {
  if (!(await manageAllowed())) return new Response("Няма достъп.", { status: 401 });
  const rows = await listSubscribers();
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv = ["email,lang,source,subscribed_at", ...rows.map((r) => [r.email, r.lang, r.source, r.at].map(quote).join(","))].join("\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="handycrafts-subscribers.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
