import { NextResponse } from "next/server";
import { EDIT_LIMIT, askAssistant, refusal, screen, signEdit, type ChatTurn } from "@/lib/handy-ai";
import { incr } from "@/lib/kv";
import { getDraft } from "@/lib/orders";
import { allow, cleanText, sameOrigin } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * One chat message to Handy AI. Returns its reply and, when the message asks for a change it may
 * make, a signed ticket the studio then sends to /api/studio/edit to draw the new version.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const lang = body?.lang === "en" ? "en" : "bg";
  const tr = (bg: string, en: string) => (lang === "en" ? en : bg);

  if (!(await allow("assistant", req, Number(process.env.ASSISTANT_HOURLY_LIMIT || 30), 3600))) {
    return NextResponse.json({ action: "limit", reply: tr("Много съобщения за кратко 🙂 Опитай пак след малко или ни пиши.", "That's a lot of messages 🙂 Try again in a bit or write to us.") });
  }
  const key = process.env.XAI_API_KEY;
  if (!key) return NextResponse.json({ action: "limit", reply: tr("Handy AI в момента почива. Пиши ни и ще помогнем.", "Handy AI is resting right now. Write to us and we'll help.") });

  const draft = await getDraft(String(body?.draftId || ""));
  if (!draft) return NextResponse.json({ action: "limit", reply: tr("Визуализацията е изтекла — направи нова и продължаваме.", "This preview has expired — make a new one and we'll carry on.") });

  const message = cleanText(body?.message, 400);
  const hasPhoto = body?.hasPhoto === true;
  if (!(hasPhoto && !message)) {
    const reason = screen(message);
    if (reason) return NextResponse.json({ action: "reject", reply: refusal(lang, reason) });
  }

  const editsLeft = Math.max(0, EDIT_LIMIT - (draft.edits?.length || 0));
  const history: ChatTurn[] = (Array.isArray(body?.history) ? body.history : [])
    .slice(-8)
    .map((turn: { role?: unknown; text?: unknown }) => ({ role: turn?.role === "bot" ? "bot" : "you", text: cleanText(turn?.text, 400) }))
    .filter((turn: ChatTurn) => turn.text);

  const day = new Date().toISOString().slice(0, 10);
  if ((await incr(`assistant:${day}`, 60 * 60 * 26)) > Number(process.env.ASSISTANT_DAILY_LIMIT || 1500)) {
    return NextResponse.json({ action: "limit", reply: tr("За днес Handy AI е изморен 🙂 Пиши ни и ще помогнем лично.", "Handy AI is tired for today 🙂 Write to us and we'll help in person.") });
  }

  const result = await askAssistant({ key, lang, product: draft.product, subject: draft.subject || "person", editsLeft, hasPhoto, history, message });
  if (result.action !== "edit") return NextResponse.json({ action: result.action, reply: result.reply, editsLeft });

  if (editsLeft <= 0) {
    return NextResponse.json({
      action: "limit",
      editsLeft: 0,
      reply: tr(
        "Стигнахме лимита промени за тази визуализация. Добави я в количката и опиши останалото в бележката — майсторът ще го довърши на ръка ✋",
        "We've reached the change limit for this preview. Add it to the cart and describe the rest in the order note — we'll finish it by hand ✋"
      ),
    });
  }
  return NextResponse.json({ action: "edit", reply: result.reply, editsLeft, ticket: signEdit(draft.id, result.instruction, message || tr("(снимка)", "(photo)")) });
}
