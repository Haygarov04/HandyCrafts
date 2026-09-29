import { del, getJSON, setJSON, zadd, zrem, zrevrange } from "@/lib/kv";
import type { Delivery } from "@/lib/order-types";

// Checkouts where someone typed a phone or email but never pressed "Order".
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
  items: { draftId: string; label: string; cm: number; qty: number; price: number; preview?: string }[];
  total: number;
  internalNote?: string;
  orderNumber?: string;
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

export async function updateLead(id: string, change: { status?: LeadStatus; internalNote?: string; orderNumber?: string }) {
  const lead = await getLead(id);
  if (!lead) return null;
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
