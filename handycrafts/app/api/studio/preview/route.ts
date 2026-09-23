import { NextResponse } from "next/server";
import { figurinePrompt, isProductId, sizes } from "@/lib/figurine";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  if (b64) return `data:image/png;base64,${b64}`;
  return null;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const product = String(form.get("product") || "");
    const size = String(form.get("size") || "");
    const clothes = String(form.get("clothes") || "").slice(0, 600);
    const pose = String(form.get("pose") || "").slice(0, 400);
    const file = form.get("photo");

    if (!isProductId(product) || !sizes.includes(size as (typeof sizes)[number])) {
      return NextResponse.json({ error: "Избери продукт и размер." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Качи снимка." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Файлът трябва да е снимка." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Снимката е над 8 MB." }, { status: 400 });
    }

    const key = process.env.XAI_API_KEY;
    if (!key) {
      return NextResponse.json(
        {
          connected: false,
          error:
            "Grok още не е свързан. Сложи XAI_API_KEY в handycrafts/.env.local и рестартирай сайта.",
        },
        { status: 200 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
    const dataUri = `data:${mime};base64,${bytes.toString("base64")}`;

    const response = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt: figurinePrompt({ product, size, clothes, pose }),
        image: { url: dataUri, type: "image_url" },
        aspect_ratio: product === "bust" ? "1:1" : "2:3",
        resolution: "1k",
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? JSON.stringify((payload as { error: unknown }).error)
          : "Grok не върна визуализация.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const imageUrl = imageFromResponse(payload);
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Grok отговори, но без картинка. Провери модела и ключа." },
        { status: 502 }
      );
    }

    return NextResponse.json({ connected: true, imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Грешка при визуализацията.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
