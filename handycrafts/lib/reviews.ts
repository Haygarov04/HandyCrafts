import { createHmac, timingSafeEqual } from "crypto";
import { del, getJSON, setJSON, zadd, zrem, zrevrange } from "@/lib/kv";
import { localize } from "@/lib/i18n";
import type { Order } from "@/lib/order-types";
import { absolute } from "@/lib/site";

// Reviews customers write from the link in the "completed" email. One per order: the
// review id is the order id. Nothing is shown on the site until the workshop publishes it.

export const reviewStatuses = ["pending", "approved", "hidden"] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];

export const reviewStatusLabel: Record<ReviewStatus, string> = {
  pending: "Чака одобрение",
  approved: "Публикуван",
  hidden: "Скрит",
};

export type Review = {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: ReviewStatus;
  lang: "bg" | "en";
  rating: number;
  text: string;
  /** Shown on the site, e.g. "Десислава". */
  name: string;
  city: string;
  /** What was ordered, e.g. "Фигурка · 10 см". */
  product: string;
};

/** The part of a review the public site gets. */
export type PublicReview = Pick<Review, "id" | "rating" | "text" | "name" | "city" | "product" | "createdAt" | "lang">;

export function isReviewStatus(value: unknown): value is ReviewStatus {
  return (reviewStatuses as readonly unknown[]).includes(value);
}

export async function getReview(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) return null;
  return getJSON<Review>(`review:${id}`);
}

export async function saveReview(review: Review) {
  await setJSON(`review:${review.id}`, review);
  await zadd("reviews", Date.parse(review.createdAt), review.id);
}

export async function listReviews(limit = 300) {
  const ids = await zrevrange("reviews", 0, limit - 1);
  const reviews = await Promise.all(ids.map((id) => getJSON<Review>(`review:${id}`)));
  return reviews.filter((review): review is Review => Boolean(review));
}

export async function deleteReview(id: string) {
  await del(`review:${id}`);
  await zrem("reviews", id);
}

function sign(id: string) {
  const secret = `${process.env.SESSION_SECRET || ""}:${process.env.CRM_PASSWORD || ""}:review`;
  return createHmac("sha256", secret).update(id).digest("hex").slice(0, 32);
}

export function reviewTokenValid(id: string, token: string) {
  const expected = Buffer.from(sign(id));
  const given = Buffer.from(String(token || ""));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** The private link a customer uses to write a review for their order. */
export function reviewUrl(order: Order) {
  const lang = order.lang === "en" ? "en" : "bg";
  return absolute(localize(lang, `/review?o=${order.id}&t=${sign(order.id)}`));
}

/** "Десислава Иванова" → "Десислава И." — enough to feel real, without the full surname. */
export function displayName(full: string) {
  const [first = "", last = ""] = full.trim().split(/\s+/);
  return last ? `${first} ${last[0].toUpperCase()}.` : first;
}
