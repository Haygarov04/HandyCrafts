import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { translator } from "@/lib/api-lang";
import { isProductId, isSubjectId, priceFor } from "@/lib/catalog";
import { figurinePrompt } from "@/lib/figurine";
import { pullImage, readStoredFile, saveFile, sniffImage } from "@/lib/files";
import { incr } from "@/lib/kv";
import { getDraft, saveDraft } from "@/lib/orders";
import { allow, cleanText } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_BYTES = 8 * 1024 * 1024;

function imageFromResponse(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as {
    url?: string;
    b64_json?: string;
    image?: { url?: string; b64_json?: string };
    data?: Array<{ url?: string; b64_json?: string }>;
  };
  const url = data.url || data.image?.url || data.data?.[0]?.url;
  if (url) return url;
  const b64 = data.b64_json || data.image?.b64_json || data.data?.[0]?.b64_json;
  return b64 ? `data:image/png;base64,${b64}` : null;
}

async function streamToBuffer(body: BodyInit) {
  return Buffer.from(await new Response(body).arrayBuffer());
}

export async function POST(req: Request) {
  const tr = translator(req);
  try {
    const key = process.env.XAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: tr("Визуализациите още не са включени (липсва XAI_API_KEY).", "Previews aren't switched on yet.") },
        { status: 503 }
      );
    }

    if (!(await allow("preview", req, Number(process.env.PREVIEW_HOURLY_LIMIT || 8), 3600))) {
      return NextResponse.json(
        { error: tr("Направи много визуализации за кратко. Опитай пак след около час.", "You've made a lot of previews in a short time. Please try again in about an hour.") },
        { status: 429 }
      );
    }
    const day = new Date().toISOString().slice(0, 10);
    if ((await incr(`previews:${day}`, 60 * 60 * 26)) > Number(process.env.PREVIEW_DAILY_LIMIT || 300)) {
      return NextResponse.json(
        { error: tr("За днес визуализациите свършиха. Пиши ни и ще я направим ръчно.", "We've reached today's preview limit. Write to us and we'll make it by hand.") },
        { status: 429 }
      );
    }

    const form = await req.formData();
    const product = String(form.get("product") || "");
    const cm = Number(form.get("cm"));
    const subjectRaw = String(form.get("subject") || "person");
    const subject = isSubjectId(subjectRaw) ? subjectRaw : "person";
    const clothes = cleanText(form.get("clothes"), 500);
    const pose = cleanText(form.get("pose"), 300);

    if (!isProductId(product) || priceFor(product, cm) === null) {
      return NextResponse.json({ error: tr("Избери продукт и размер.", "Choose a product and size.") }, { status: 400 });
    }

    // A new photo, or the photo from an earlier try when the customer only regenerates.
    let photoRef = "";
    let photo: { bytes: Buffer; contentType: string } | null = null;
    const file = form.get("photo");
    const previous = await getDraft(String(form.get("draftId") || ""));

    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: tr("Снимката е над 8 MB.", "The photo is over 8 MB.") }, { status: 400 });
      }
      const bytes = Buffer.from(await file.arrayBuffer());
      const contentType = sniffImage(bytes);
      if (!contentType) {
        return NextResponse.json({ error: tr("Качи снимка в JPG, PNG или WEBP.", "Please upload a JPG, PNG or WEBP photo.") }, { status: 400 });
      }
      photo = { bytes, contentType };
    } else if (previous) {
      const stored = await readStoredFile(previous.photo);
      if (stored) {
        photo = { bytes: await streamToBuffer(stored.body), contentType: stored.contentType };
        photoRef = previous.photo;
      }
    }
    if (!photo) {
      return NextResponse.json({ error: tr("Качи снимка.", "Please upload a photo.") }, { status: 400 });
    }

    const response = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.XAI_IMAGE_MODEL || "grok-imagine-image-2.0",
        prompt: figurinePrompt({ product, subject, cm, clothes, pose }),
        image: {
          url: `data:${photo.contentType};base64,${photo.bytes.toString("base64")}`,
          type: "image_url",
        },
        aspect_ratio: "1:1",
        resolution: "2k",
      }),
      signal: AbortSignal.timeout(80_000),
    });
    const payload = await response.json().catch(() => null);
    const source = response.ok ? imageFromResponse(payload) : null;
    if (!source) {
      console.error("XAI_PREVIEW", response.status, JSON.stringify(payload).slice(0, 500));
      return NextResponse.json(
        { error: tr("Визуализацията не се получи. Опитай с друга снимка след малко.", "The preview didn't work. Try another photo in a moment.") },
        { status: 502 }
      );
    }
    const preview = await pullImage(source);
    if (!preview) {
      return NextResponse.json({ error: tr("Визуализацията не се зареди. Опитай пак.", "The preview didn't load. Please try again.") }, { status: 502 });
    }

    const id = randomUUID();
    if (!photoRef) photoRef = await saveFile(`drafts/${id}`, "photo", photo.bytes, photo.contentType);
    const previewRef = await saveFile(`drafts/${id}`, "preview", preview.bytes, preview.contentType);

    await saveDraft({
      id,
      createdAt: new Date().toISOString(),
      product,
      subject,
      cm,
      clothes,
      pose,
      photo: photoRef,
      preview: previewRef,
    });

    return NextResponse.json({ draftId: id, previewUrl: `/api/studio/draft/${id}` });
  } catch (error) {
    console.error("PREVIEW", error);
    return NextResponse.json({ error: tr("Нещо се обърка. Опитай пак.", "Something went wrong. Please try again.") }, { status: 500 });
  }
}
