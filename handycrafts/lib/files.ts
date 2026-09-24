import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";

// Customer photos are personal data, so the Blob store is private and every
// file is streamed through an API route that checks access first.

const root = path.join(process.cwd(), ".data", "files");

export function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function extensionFor(contentType: string) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  return "jpg";
}

export async function saveFile(folder: string, name: string, bytes: Buffer, contentType: string) {
  const file = `${folder}/${name}.${extensionFor(contentType)}`;
  if (hasBlob()) {
    const blob = await put(file, bytes, {
      access: "private",
      contentType,
      addRandomSuffix: true,
    });
    return `blob:${blob.url}`;
  }
  const full = path.join(root, file);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, bytes);
  await writeFile(`${full}.type`, contentType);
  return `local:${file}`;
}

export async function readStoredFile(ref: string) {
  if (ref.startsWith("blob:")) {
    const result = await get(ref.slice(5), { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return {
      body: result.stream as ReadableStream,
      contentType: result.blob.contentType || "application/octet-stream",
    };
  }
  if (!ref.startsWith("local:")) return null;
  const relative = ref.slice(6);
  if (relative.includes("..")) return null;
  const full = path.join(root, relative);
  try {
    const bytes = await readFile(full);
    const contentType = await readFile(`${full}.type`, "utf8").catch(() => "application/octet-stream");
    return { body: new Uint8Array(bytes) as BodyInit, contentType };
  } catch {
    return null;
  }
}

export function fileResponse(file: { body: BodyInit; contentType: string }, cache: string, download?: string) {
  const headers = new Headers({
    "Content-Type": file.contentType,
    "Cache-Control": cache,
    "X-Content-Type-Options": "nosniff",
  });
  if (download) headers.set("Content-Disposition", `attachment; filename="${download}"`);
  return new Response(file.body, { headers });
}

/** Checks the first bytes so only real JPEG, PNG and WEBP files get stored. */
export function sniffImage(bytes: Buffer): string | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP") {
    return "image/webp";
  }
  return null;
}

function privateHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (host.startsWith("[") || host === "169.254.169.254") return true;
  const match = host.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return false;
  const a = Number(match[1]);
  const b = Number(match[2]);
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

/** Downloads an image the AI provider returned (https URL or data URI). */
export async function pullImage(source: string) {
  if (source.startsWith("data:")) {
    const match = source.match(/^data:[^;]+;base64,(.+)$/);
    if (!match) return null;
    const bytes = Buffer.from(match[1], "base64");
    const type = sniffImage(bytes);
    return type && bytes.length < 15 * 1024 * 1024 ? { bytes, contentType: type } : null;
  }
  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || privateHost(url.hostname)) return null;
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000), redirect: "error" });
  if (!response.ok) return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  const type = sniffImage(bytes);
  return type && bytes.length < 15 * 1024 * 1024 ? { bytes, contentType: type } : null;
}
