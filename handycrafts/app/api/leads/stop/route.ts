import { NextResponse } from "next/server";
import { getLead, leadTokenValid, updateLead } from "@/lib/leads";
import { escapeHtml } from "@/lib/security";

export const runtime = "nodejs";

function page(lang: "bg" | "en", title: string, text: string, form = "") {
  return new NextResponse(
    `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>HandyCrafts</title></head>
<body style="margin:0;background:#f6f1e8;font-family:Arial,Helvetica,sans-serif;color:#161513;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:20px">
<div style="max-width:420px"><h1 style="font-size:26px">${escapeHtml(title)}</h1><p style="color:#6b665e;line-height:1.6">${escapeHtml(text)}</p>${form}
<p style="margin-top:28px"><a href="/" style="color:#161513">handy-crafts.digital</a></p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

async function check(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  const token = url.searchParams.get("t") || "";
  const lead = leadTokenValid(id, token) ? await getLead(id) : null;
  return { id, token, lead };
}

// GET only asks: mail scanners open links on their own, so the stop itself needs a button press (POST).
export async function GET(req: Request) {
  const { id, token, lead } = await check(req);
  if (!lead) return page("bg", "Връзката не е валидна", "Може би вече е изтекла.");
  const en = lead.lang === "en";
  if (lead.optOut) return page(lead.lang, en ? "Done" : "Готово", en ? "You won't get more reminders." : "Няма да получаваш повече напомняния.");
  const form = `<form method="post" action="/api/leads/stop?id=${id}&t=${token}"><button style="margin-top:12px;border:0;border-radius:999px;background:#161513;color:#f6f1e8;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer">${
    en ? "Yes, stop them" : "Да, спри ги"
  }</button></form>`;
  return page(lead.lang, en ? "Stop reminders?" : "Да спрем напомнянията?", en ? "We won't email you about this order again." : "Няма да ти пишем повече за тази поръчка.", form);
}

export async function POST(req: Request) {
  const { id, lead } = await check(req);
  if (!lead) return page("bg", "Връзката не е валидна", "Може би вече е изтекла.");
  await updateLead(id, { optOut: true });
  const en = lead.lang === "en";
  return page(lead.lang, en ? "Done" : "Готово", en ? "You won't get more reminders." : "Няма да получаваш повече напомняния.");
}
