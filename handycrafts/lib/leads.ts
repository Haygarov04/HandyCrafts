import { createHmac, timingSafeEqual } from "crypto";
import { del, getJSON, setJSON, zadd, zrem, zrevrange } from "@/lib/kv";
import type { Delivery } from "@/lib/order-types";

// Checkouts where someone typed a phone or email but never pressed "Order",
// and previews someone asked us to email them from the studio.
// Kept for 30 days so the shop can call and help, then they expire on their own.

export const leadStatuses = ["open", "contacted", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leadLabel: Record<LeadStatus, string> = {
  open: "Не е търсен",
  contacted: "Свързахме се",
  won: "Поръча",
  lost: "Не иска",
};

export const leadTone: Record<LeadStatus, string> = {
  open: "bg-ember/15 text-ember-deep",
  contacted: "bg-sky-100 text-sky-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-ink/10 text-ink/60",
};

export function isLeadStatus(value: unknown): value is LeadStatus {
  return (leadStatuses as readonly unknown[]).includes(value);
}

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  lang: "bg" | "en";
  customer: { name: string; phone: string; email: string; city: string; delivery: Delivery; address: string };
  items: {
    draftId: string;
    product?: "figurine" | "keychain";
    subject?: "person" | "pet";
    people?: number;
    label: string;
    cm: number;
    qty: number;
    price: number;
    preview?: string;
  }[];
  total: number;
  internalNote?: string;
  orderNumber?: string;
  /** Reminder emails sent so far, oldest first. */
  emails?: { step: number; at: string; ok: boolean }[];
  /** The customer asked for no more reminders. */
  optOut?: boolean;
  /** "studio": left an email under a preview; otherwise started at checkout. */
  source?: "cart" | "studio";
};

const LEAD_TTL = 60 * 60 * 24 * 30;

export function isLeadId(id: string) {
  return /^[a-f0-9-]{36}$/.test(id);
}

export async function getLead(id: string) {
  if (!isLeadId(id)) return null;
  return getJSON<Lead>(`lead:${id}`);
}

export async function saveLead(lead: Lead) {
  await setJSON(`lead:${lead.id}`, lead, LEAD_TTL);
  await zadd("leads", Date.parse(lead.createdAt), lead.id);
}

export async function listLeads(limit = 200) {
  const ids = await zrevrange("leads", 0, limit - 1);
  const leads = await Promise.all(ids.map((id) => getJSON<Lead>(`lead:${id}`)));
  // Expired leads leave their id behind in the index: tidy those up as we go.
  await Promise.all(ids.filter((_, i) => !leads[i]).map((id) => zrem("leads", id)));
  return leads.filter((lead): lead is Lead => Boolean(lead));
}

export async function updateLead(
  id: string,
  change: { status?: LeadStatus; internalNote?: string; orderNumber?: string; optOut?: boolean }
) {
  const lead = await getLead(id);
  if (!lead) return null;
  if (change.optOut !== undefined) lead.optOut = change.optOut;
  if (change.status) lead.status = change.status;
  if (change.internalNote !== undefined) lead.internalNote = change.internalNote;
  if (change.orderNumber) lead.orderNumber = change.orderNumber;
  lead.updatedAt = new Date().toISOString();
  await saveLead(lead);
  return lead;
}

export async function deleteLead(id: string) {
  if (!isLeadId(id)) return;
  await del(`lead:${id}`);
  await zrem("leads", id);
}

function sign(id: string) {
  const secret = `${process.env.SESSION_SECRET || ""}:${process.env.CRM_PASSWORD || ""}:lead`;
  return createHmac("sha256", secret).update(id).digest("hex").slice(0, 32);
}

/** Signed token for links in reminder emails, so only the inbox owner can open or stop them. */
export function leadToken(id: string) {
  return sign(id);
}

export function leadTokenValid(id: string, token: string) {
  const expected = Buffer.from(sign(id));
  const given = Buffer.from(String(token || ""));
  return expected.length === given.length && timingSafeEqual(expected, given);
}
