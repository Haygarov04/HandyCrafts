import { randomUUID } from "crypto";
import { catalog, isProductId, type ProductId } from "@/lib/catalog";
import { saveFile, sniffImage } from "@/lib/files";
import { deliveryLabel, isSource, isStatus, type Delivery, type Order } from "@/lib/order-types";
import { nextOrderNumber } from "@/lib/orders";
import { cleanText } from "@/lib/security";

// Orders that came in through Facebook, TikTok, the phone… and are typed into the panel by hand.
// Nothing is required: whatever is left empty just shows as "—".

const MAX_PHOTO = 8 * 1024 * 1024;
const isDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

function number(value: FormDataEntryValue | null, max: number) {
  const n = Number(String(value ?? "").replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.min(max, Math.max(0, Math.round(n * 100) / 100)) : 0;
}

/** "2026-10-11" → noon that day in Sofia as ISO, so the date never slips to the day before. */
function onDay(day: string) {
  return new Date(`${day}T12:00:00+03:00`).toISOString();
}

/** Builds a new hand-made order, or applies the form to an existing one. Returns an error message on bad input. */
export async function manualOrderFromForm(form: FormData, existing?: Order): Promise<Order | string> {
  const text = (name: string, max = 200) => cleanText(form.get(name), max);
  const now = new Date().toISOString();

  const product: ProductId = isProductId(text("product")) ? (text("product") as ProductId) : "figurine";
  const subject = text("subject") === "pet" ? "pet" : "person";
  const people = Math.min(3, Math.max(1, Math.round(number(form.get("people"), 3)) || 1));
  const cm = Math.round(number(form.get("cm"), 100));
  const qty = Math.max(1, Math.round(number(form.get("qty"), 99)) || 1);
  const price = number(form.get("price"), 100000);
  const delivery = (text("delivery") in deliveryLabel ? text("delivery") : "econt") as Delivery;
  const rawStatus = text("status");
  const status = isStatus(rawStatus) ? rawStatus : "confirmed";
  const day = text("date");
  if (day && !isDay(day)) return "Невалидна дата.";
  const rawSource = text("source");
  const source = isSource(rawSource) ? rawSource : "other";
  const kind = product === "kit" ? "Оцвети сам" : "Фигурка";
  const label = text("label", 120) || (product === "keychain" ? "Ключодържател" : people > 1 ? `${kind} · ${people} души` : kind);

  let photo = existing?.items[0]?.photo;
  const file = form.get("photo");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_PHOTO) return "Снимката е над 8 MB.";
    const bytes = Buffer.from(await file.arrayBuffer());
    const contentType = sniffImage(bytes);
    if (!contentType) return "Качи снимка в JPG, PNG или WEBP.";
    photo = await saveFile(`manual/${existing?.id || "new"}-${randomUUID()}`, "photo", bytes, contentType);
  }

  const createdAt = day ? onDay(day) : existing?.createdAt || now;
  const order: Order = {
    ...(existing || {
      id: randomUUID(),
      number: await nextOrderNumber(),
      payment: "cod" as const,
      lang: "bg" as const,
      emails: [],
    }),
    createdAt,
    updatedAt: now,
    status,
    manual: true,
    source,
    customer: {
      name: text("name", 80) || "Ръчна поръчка",
      phone: text("phone", 40),
      email: text("email", 120),
      city: text("city", 80),
      delivery,
      address: text("address", 200),
    },
    note: text("note", 2000),
    internalNote: existing?.internalNote ?? "",
    items: [
      {
        draftId: "",
        product,
        subject: product === "keychain" ? "pet" : subject,
        people: product !== "keychain" && subject === "person" ? people : undefined,
        label,
        cm,
        price,
        qty,
        clothes: "",
        pose: "",
        photo,
        preview: photo,
      },
    ],
    total: Math.round(price * qty * 100) / 100,
  };
  // Revenue counts on the day an order is completed. One typed in as already done counts on its own date.
  if (status !== "completed") delete order.completedAt;
  else if (existing?.status === "completed" && existing.completedAt) order.completedAt = existing.completedAt;
  else order.completedAt = existing ? now : createdAt;
  return order;
}

/** Sizes that exist in the shop, for the form's suggestions. */
export const knownSizes = [...new Set([...catalog.figurine.sizes, ...catalog.keychain.sizes].map((size) => size.cm))].sort((a, b) => a - b);
