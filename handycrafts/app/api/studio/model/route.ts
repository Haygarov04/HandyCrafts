import { NextResponse } from "next/server";
import { faceCloseupPrompt } from "@/lib/figurine";

export const runtime = "nodejs";
export const maxDuration = 90;

const MESHY = "https://api.meshy.ai/openapi/v1/image-to-3d";

function meshyHeaders() {
  return {
    Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
    "Content-Type": "application/json",
  };
}

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

async function faceTexture(imageUrl: string) {
  const key = process.env.XAI_API_KEY;
  if (!key) return imageUrl;
  try {
    const response = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt: faceCloseupPrompt(),
        image: { url: imageUrl, type: "image_url" },
        aspect_ratio: "1:1",
        resolution: "2k",
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) return imageUrl;
    return imageFromResponse(payload) || imageUrl;
  } catch {
    return imageUrl;
  }
}

export async function POST(req: Request) {
  const key = process.env.MESHY_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        connected: false,
        error:
          "Meshy още не е свързан. Сложи MESHY_API_KEY в handycrafts/.env.local. Нужен е план Pro.",
      },
      { status: 200 }
    );
  }

  const body = await req.json().catch(() => null);
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl : "";
  const allowed =
    imageUrl.startsWith("https://") || imageUrl.startsWith("data:image/");

  if (!allowed) {
    return NextResponse.json(
      { error: "Първо трябва одобрена визуализация от Grok." },
      { status: 400 }
    );
  }

  const textureUrl = await faceTexture(imageUrl);
  const response = await fetch(MESHY, {
    method: "POST",
    headers: meshyHeaders(),
    body: JSON.stringify({
      image_url: imageUrl,
      texture_image_url: textureUrl,
      ai_model: "latest",
      model_type: "standard",
      should_texture: true,
      enable_pbr: true,
      image_enhancement: false,
      remove_lighting: true,
      target_formats: ["glb", "stl"],
      moderation: true,
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "Meshy не прие задачата.";
    return NextResponse.json({ error: message }, { status: response.status });
  }

  const id =
    payload && typeof payload === "object" && "result" in payload
      ? String((payload as { result: unknown }).result)
      : "";

  if (!id) {
    return NextResponse.json({ error: "Meshy не върна номер на задача." }, { status: 502 });
  }

  return NextResponse.json({ connected: true, id });
}

export async function GET(req: Request) {
  const key = process.env.MESHY_API_KEY;
  if (!key) {
    return NextResponse.json({ connected: false }, { status: 200 });
  }

  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^[\w-]+$/.test(id)) {
    return NextResponse.json({ error: "Липсва задача." }, { status: 400 });
  }

  const response = await fetch(`${MESHY}/${id}`, { headers: meshyHeaders() });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Задачата не се чете." }, { status: 502 });
  }

  const task = payload as {
    status?: string;
    progress?: number;
    thumbnail_url?: string;
    model_urls?: { glb?: string; stl?: string };
    task_error?: { message?: string };
  };

  return NextResponse.json({
    status: task.status || "PENDING",
    progress: task.progress || 0,
    thumbnailUrl: task.thumbnail_url || "",
    glb: task.model_urls?.glb || "",
    stl: task.model_urls?.stl || "",
    error: task.task_error?.message || "",
  });
}
