import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const MANAGE_COOKIE = "hc_manage";
const SESSION_DAYS = 30;

function password() {
  return process.env.CRM_PASSWORD || "";
}

function key() {
  // Rotating CRM_PASSWORD or SESSION_SECRET logs every device out.
  return `${process.env.SESSION_SECRET || ""}:${password()}`;
}

function sign(value: string) {
  return createHmac("sha256", key()).update(value).digest("hex");
}

function same(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function manageOpenInDev() {
  return process.env.NODE_ENV !== "production" && !password();
}

export function hasPassword() {
  return Boolean(password());
}

export function passwordMatches(input: string) {
  if (!password()) return false;
  const left = createHmac("sha256", "hc").update(input).digest();
  const right = createHmac("sha256", "hc").update(password()).digest();
  return timingSafeEqual(left, right);
}

export function newSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return { value: `${expires}.${sign(`manage:${expires}`)}`, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export async function manageAllowed() {
  if (manageOpenInDev()) return true;
  if (!password()) return false;
  const value = (await cookies()).get(MANAGE_COOKIE)?.value || "";
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return same(signature, sign(`manage:${expires}`));
}
