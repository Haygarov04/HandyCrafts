"use client";

/** What the server accepts. Anything else is converted to JPEG in the browser first. */
const SERVER_TYPES = /^image\/(jpeg|png|webp)$/;
const SERVER_MAX = 8 * 1024 * 1024;
/** Longest side after conversion — plenty for the preview and for production. */
const MAX_SIDE = 2560;
/** The biggest original we try to open at all. */
export const INPUT_MAX = 50 * 1024 * 1024;

function isHeic(file: File) {
  return /hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

async function decode(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(blob, { imageOrientation: "from-image" });
    } catch {}
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = new window.Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Turns any photo the browser can open (HEIC from iPhone, AVIF, GIF, BMP, huge JPEGs…)
 * into a JPEG/PNG/WEBP under 8 MB. Throws when the file can't be read as an image.
 */
export async function preparePhoto(file: File): Promise<File> {
  if (SERVER_TYPES.test(file.type) && file.size <= SERVER_MAX) return file;

  let image = await decode(file).catch(() => null);
  if (!image && isHeic(file)) {
    // Chrome and Firefox can't open HEIC, so decode it with a small library loaded only when needed.
    const { default: heic2any } = await import("heic2any");
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
    image = await decode(Array.isArray(converted) ? converted[0] : converted);
  }
  if (!image) throw new Error("unreadable");

  const width = "naturalWidth" in image ? image.naturalWidth : image.width;
  const height = "naturalHeight" in image ? image.naturalHeight : image.height;
  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("unreadable");
  // Transparent PNG/GIF areas become white instead of black.
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  if ("close" in image) image.close();

  let blob: Blob | null = null;
  for (const quality of [0.9, 0.8, 0.7, 0.6]) {
    blob = await toJpeg(canvas, quality);
    if (blob && blob.size <= SERVER_MAX) break;
  }
  if (!blob || blob.size > SERVER_MAX) throw new Error("unreadable");
  const name = (file.name || "photo").replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
