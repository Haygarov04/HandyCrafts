import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const CRM_COOKIE = "hc_crm";

export function crmPassword() {
  return process.env.CRM_PASSWORD || "";
}

export function crmOpenInDev() {
  return process.env.NODE_ENV !== "production" && !crmPassword();
}

function digest(value: string) {
  return createHmac("sha256", "handycrafts-crm").update(value).digest();
}

export function passwordMatches(input: string) {
  const expected = crmPassword();
  if (!expected) return false;
  const left = digest(input);
  const right = digest(expected);
  return timingSafeEqual(left, right);
}

export function sessionToken() {
  return digest(crmPassword() || "dev-open").toString("hex");
}

export async function crmAllowed() {
  if (crmOpenInDev()) return true;
  if (!crmPassword()) return false;
  const jar = await cookies();
  const value = jar.get(CRM_COOKIE)?.value || "";
  const expected = sessionToken();
  if (value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
