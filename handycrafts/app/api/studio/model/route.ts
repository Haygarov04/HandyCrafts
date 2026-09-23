import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MESHY = "https://api.meshy.ai/openapi/v1/image-to-3d";

function meshyHeaders() {
  return {
    Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
    "Content-Type": "application/json",
  };
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

  const response = await fetch(MESHY, {
    method: "POST",
    headers: meshyHeaders(),
    body: JSON.stringify({
      image_url: imageUrl,
      texture_image_url: imageUrl,
      ai_model: "latest",
      model_type: "standard",
      should_texture: true,
      enable_pbr: true,
      image_enhancement: true,
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
