// Shared bits for calling xAI's image edit API (Grok Imagine).

export type ImageInput = { bytes: Buffer; contentType: string };

export function imageFromResponse(payload: unknown): string | null {
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

export async function streamToBuffer(body: BodyInit) {
  return Buffer.from(await new Response(body).arrayBuffer());
}

const asUrl = (image: ImageInput) => ({ url: `data:${image.contentType};base64,${image.bytes.toString("base64")}`, type: "image_url" });

/**
 * Edits one image, or combines two or three (the prompt refers to them as <IMAGE_0>, <IMAGE_1>, …).
 * Returns the URL or data URI of the result, or null when the model gave nothing back.
 */
export async function editImage(key: string, prompt: string, images: ImageInput[]) {
  const response = await fetch(`${process.env.XAI_BASE_URL || "https://api.x.ai"}/v1/images/edits`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.XAI_IMAGE_MODEL || "grok-imagine-image-2.0",
      prompt,
      ...(images.length === 1 ? { image: asUrl(images[0]) } : { images: images.slice(0, 3).map(asUrl) }),
      aspect_ratio: "1:1",
      resolution: process.env.XAI_IMAGE_RESOLUTION || "2k",
    }),
    signal: AbortSignal.timeout(80_000),
  });
  const payload = await response.json().catch(() => null);
  const source = response.ok ? imageFromResponse(payload) : null;
  if (!source) console.error("XAI_EDIT", response.status, JSON.stringify(payload).slice(0, 500));
  return source;
}
