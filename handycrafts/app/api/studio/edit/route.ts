import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { translator } from "@/lib/api-lang";
import { editPrompt } from "@/lib/figurine";
import { EDIT_LIMIT, readEdit } from "@/lib/handy-ai";
import { pullImage, readStoredFile, saveFile, sniffImage } from "@/lib/files";
import { incr } from "@/lib/kv";
import { getDraft, saveDraft } from "@/lib/orders";
import { allow, cleanText, sameOrigin } from "@/lib/security";
import { editImage, streamToBuffer, type ImageInput } from "@/lib/xai-image";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_BYTES = 8 * 1024 * 1024;

/** Draws a change Handy AI approved: only with a ticket from /api/studio/assistant, optionally with one more photo. */
export async function POST(req: Request) {
  const tr = translator(req);
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const key = process.env.XAI_API_KEY;
    if (!key) return NextResponse.json({ error: tr("Промените не са включени.", "Edits aren't switched on.") }, { status: 503 });

    if (!(await allow("preview-edit-day", req, Number(process.env.EDIT_PER_VISITOR_DAILY || 12), 86400))) {
      return NextResponse.json(
        { error: tr("За днес промените свършиха. Добави фигурката в количката и опиши останалото в бележката — ще го довършим на ръка.", "No more changes today. Add the figurine to your cart and describe the rest in the note — we'll finish it by hand.") },
        { status: 429 }
      );
    }
    if (!(await allow("preview-edit", req, Number(process.env.EDIT_HOURLY_LIMIT || 6), 3600))) {
      return NextResponse.json(
        { error: tr("Направи много промени за кратко. Опитай пак след около час или ни пиши.", "That's a lot of changes in a short time. Try again in about an hour or write to us.") },
        { status: 429 }
      );
    }
    const day = new Date().toISOString().slice(0, 10);
    if ((await incr(`previews:${day}`, 60 * 60 * 26)) > Number(process.env.PREVIEW_DAILY_LIMIT || 150)) {
      return NextResponse.json({ error: tr("За днес визуализациите свършиха. Пиши ни.", "We've reached today's preview limit. Write to us.") }, { status: 429 });
    }

    const form = await req.formData();
    const ticket = readEdit(String(form.get("ticket") || ""));
    if (!ticket) return NextResponse.json({ error: tr("Опитай пак да опишеш промяната.", "Please describe the change again.") }, { status: 400 });
    // Each ticket draws once.
    const ticketId = String(form.get("ticket")).split(".")[1];
    if ((await incr(`edit-ticket:${ticketId}`, 20 * 60)) > 1) {
      return NextResponse.json({ error: tr("Тази промяна вече е направена.", "This change has already been made.") }, { status: 409 });
    }
    const base = await getDraft(ticket.d);
    if (!base) return NextResponse.json({ error: tr("Визуализацията е изтекла. Направи нова.", "The preview has expired. Make a new one.") }, { status: 404 });
    if ((base.edits?.length || 0) >= EDIT_LIMIT) {
      return NextResponse.json({ error: tr("Стигнахме лимита промени за тази визуализация.", "We've reached the change limit for this preview.") }, { status: 429 });
    }
    const request = cleanText(ticket.i, 300);

    let extra: ImageInput | null = null;
    const file = form.get("photo");
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_BYTES) return NextResponse.json({ error: tr("Снимката е над 8 MB.", "The photo is over 8 MB.") }, { status: 400 });
      const bytes = Buffer.from(await file.arrayBuffer());
      const contentType = sniffImage(bytes);
      if (!contentType) return NextResponse.json({ error: tr("Качи снимка в JPG, PNG или WEBP.", "Please upload a JPG, PNG or WEBP photo.") }, { status: 400 });
      extra = { bytes, contentType };
    }

    const current = await readStoredFile(base.preview);
    if (!current) return NextResponse.json({ error: tr("Визуализацията е изтекла. Направи нова.", "The preview has expired. Make a new one.") }, { status: 404 });
    const images: ImageInput[] = [{ bytes: await streamToBuffer(current.body), contentType: current.contentType }];
    // A face or person sent earlier in the chat must stay: later edits compare with that photo, not the first one.
    const original = await readStoredFile(base.likeness || base.photo);
    if (original) images.push({ bytes: await streamToBuffer(original.body), contentType: original.contentType });
    if (extra) images.push(extra);

    const prompt = editPrompt({ product: base.product, subject: base.subject || "person", request, extraPhoto: Boolean(extra), hasOriginal: Boolean(original) });
    const source = await editImage(key, prompt, images);
    const preview = source ? await pullImage(source) : null;
    if (!preview) {
      return NextResponse.json({ error: tr("Промяната не се получи. Опитай да я опишеш по друг начин.", "That change didn't work. Try describing it another way.") }, { status: 502 });
    }

    const id = randomUUID();
    const previewRef = await saveFile(`drafts/${id}`, "preview", preview.bytes, preview.contentType);
    const extraRef = extra ? await saveFile(`drafts/${id}`, "extra", extra.bytes, extra.contentType) : null;
    await saveDraft({
      ...base,
      id,
      createdAt: new Date().toISOString(),
      preview: previewRef,
      root: base.root || base.id,
      cartAt: undefined,
      // The panel shows what the customer wrote, not the instruction sent to the model.
      edits: [...(base.edits || []), cleanText(ticket.m, 300)].slice(-20),
      extras: extraRef ? [...(base.extras || []), extraRef].slice(-5) : base.extras,
      likeness: extraRef || base.likeness,
    });
    return NextResponse.json({ draftId: id, previewUrl: `/api/studio/draft/${id}`, editsLeft: Math.max(0, EDIT_LIMIT - (base.edits?.length || 0) - 1) });
  } catch (error) {
    console.error("PREVIEW_EDIT", error);
    return NextResponse.json({ error: tr("Нещо се обърка. Опитай пак.", "Something went wrong. Please try again.") }, { status: 500 });
  }
}
