// A quick look at a finished preview with the xAI vision model. Used to spot a car (or another
// vehicle) in the figurine, which is made and charged separately. Any failure counts as "no".

const models = () => [process.env.XAI_VISION_MODEL, "grok-4.3", "grok-4-fast-non-reasoning"].filter(Boolean) as string[];
let workingModel = "";

/** A small JPEG for the model: cheaper and always a format it reads. */
async function small(bytes: Buffer, contentType: string) {
  try {
    const sharp = (await import("sharp")).default;
    const jpeg = await sharp(bytes).resize(768, 768, { fit: "inside" }).jpeg({ quality: 80 }).toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return /jpe?g|png/.test(contentType) ? `data:${contentType};base64,${bytes.toString("base64")}` : null;
  }
}

/** True when the figurine scene includes a car, motorbike or other vehicle. */
export async function hasVehicle(key: string, image: { bytes: Buffer; contentType: string }) {
  const url = await small(image.bytes, image.contentType);
  if (!url) return false;
  const messages = [
    {
      role: "user",
      content: [
        { type: "image_url", image_url: { url, detail: "low" } },
        {
          type: "text",
          text: 'This is a product photo of a custom figurine. Is a car, motorcycle, scooter, bicycle or any other vehicle part of the figurine scene (not just a tiny background blur)? Reply with JSON only: {"vehicle": true} or {"vehicle": false}.',
        },
      ],
    },
  ];
  // One budget for every model tried, so a slow vision model can't push the preview past its time limit.
  const signal = AbortSignal.timeout(12_000);
  for (const model of workingModel ? [workingModel] : models()) {
    const response = await fetch(`${process.env.XAI_BASE_URL || "https://api.x.ai"}/v1/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, temperature: 0, max_tokens: 20 }),
      signal,
    }).catch(() => null);
    if (!response) continue;
    if (!response.ok) {
      console.error("VISION", model, response.status, (await response.text().catch(() => "")).slice(0, 200));
      continue;
    }
    workingModel = model;
    const data = (await response.json().catch(() => null)) as { choices?: { message?: { content?: string } }[] } | null;
    return /"vehicle"\s*:\s*true/i.test(data?.choices?.[0]?.message?.content || "");
  }
  return false;
}
