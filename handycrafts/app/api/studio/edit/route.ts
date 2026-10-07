import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { translator } from "@/lib/api-lang";
import { editPrompt } from "@/lib/figurine";
import { pullImage, readStoredFile, saveFile, sniffImage } from "@/lib/files";
import { incr } from "@/lib/kv";
import { getDraft, saveDraft } from "@/lib/orders";
import { allow, cleanText, sameOrigin } from "@/lib/security";
import { editImage, streamToBuffer, type ImageInput } from "@/lib/xai-image";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_BYTES = 8 * 1024 * 1024;

/** The studio chat: changes the current preview with the customer's words, optionally with one more photo. */
export async function POST(req: Request) {
  const tr = translator(req);
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const key = process.env.XAI_API_KEY;
    if (!key) return NextResponse.json({ error: tr("Промените не са включени.", "Edits aren't switched on.") }, { status: 503 });

    if (!(await allow("preview-edit", req, Number(process.env.EDIT_HOURLY_LIMIT || 12), 3600))) {
      return NextResponse.json(
        { error: tr("Направи много промени за кратко. Опитай пак след около час или ни пиши.", "That's a lot of changes in a short time. Try again in about an hour or write to us.") },
        { status: 429 }
      );
    }
    const day = new Date().toISOString().slice(0, 10);
    if ((await incr(`previews:${day}`, 60 * 60 * 26)) > Number(process.env.PREVIEW_DAILY_LIMIT || 300)) {
      return NextResponse.json({ error: tr("За днес визуализациите свършиха. Пиши ни.", "We've reached today's preview limit. Write to us.") }, { status: 429 });
    }

    const form = await req.formData();
    const base = await getDraft(String(form.get("draftId") || ""));
    if (!base) return NextResponse.json({ error: tr("Визуализацията е изтекла. Направи нова.", "The preview has expired. Make a new one.") }, { status: 404 });
    const request = cleanText(form.get("message"), 300);

    let extra: ImageInput | null = null;
    const file = form.get("photo");
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_BYTES) return NextResponse.json({ error: tr("Снимката е над 8 MB.", "The photo is over 8 MB.") }, { status: 400 });
      const bytes = Buffer.from(await file.arrayBuffer());
      const contentType = sniffImage(bytes);
      if (!contentType) return NextResponse.json({ error: tr("Качи снимка в JPG, PNG или WEBP.", "Please upload a JPG, PNG or WEBP photo.") }, { status: 400 });
      extra = { bytes, contentType };
    }
    if (!request && !extra) return NextResponse.json({ error: tr("Напиши какво да променим.", "Tell us what to change.") }, { status: 400 });

    const current = await readStoredFile(base.preview);
    if (!current) return NextResponse.json({ error: tr("Визуализацията е изтекла. Направи нова.", "The preview has expired. Make a new one.") }, { status: 404 });
    const images: ImageInput[] = [{ bytes: await streamToBuffer(current.body), contentType: current.contentType }];
    const original = await readStoredFile(base.photo);
    if (original) images.push({ bytes: await streamToBuffer(original.body), contentType: original.contentType });
    if (extra) images.push(extra);

    const wish = request || tr("използвай новата снимка", "use the new photo");
    const prompt = editPrompt({ product: base.product, subject: base.subject || "person", request: wish, extraPhoto: Boolean(extra), hasOriginal: Boolean(original) });
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
      edits: [...(base.edits || []), wish].slice(-20),
      extras: extraRef ? [...(base.extras || []), extraRef].slice(-5) : base.extras,
    });
    return NextResponse.json({ draftId: id, previewUrl: `/api/studio/draft/${id}` });
  } catch (error) {
    console.error("PREVIEW_EDIT", error);
    return NextResponse.json({ error: tr("Нещо се обърка. Опитай пак.", "Something went wrong. Please try again.") }, { status: 500 });
  }
}
