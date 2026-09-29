import { dict, localize, type Lang } from "@/lib/i18n";
import { incr } from "@/lib/kv";
import { leadToken, listLeads, saveLead, type Lead } from "@/lib/leads";
import { button, layout, mailReady, sendEmail } from "@/lib/mail";
import { listOrders } from "@/lib/orders";
import { escapeHtml } from "@/lib/security";
import { absolute } from "@/lib/site";

// Reminder emails for checkouts that were started but never sent:
// 1 hour after they stopped typing, then after 1 day, then after 3 more days. Never more than three.

const HOUR = 60 * 60 * 1000;
/** Wait before each reminder: the first counts from the last change at checkout, the rest from the previous email. */
export const reminderDelays = [1 * HOUR, 24 * HOUR, 72 * HOUR];

export const reminderLabel = ["Напомняне 1 (след 1 час)", "Напомняне 2 (след 1 ден)", "Напомняне 3 (след 3 дни)"];

/** When the next reminder is due, or null if none will be sent. */
export function nextReminderAt(lead: Lead) {
  if (!lead.customer.email || lead.optOut || lead.status === "won" || lead.status === "lost") return null;
  const sent = lead.emails || [];
  if (sent.length >= reminderDelays.length) return null;
  const from = sent.length ? Date.parse(sent[sent.length - 1].at) : Date.parse(lead.updatedAt);
  return from + reminderDelays[sent.length];
}

export function resumeUrl(lead: Lead) {
  return absolute(localize(lead.lang, `/cart?lead=${lead.id}&t=${leadToken(lead.id)}`));
}

export function stopUrl(lead: Lead) {
  return absolute(`/api/leads/stop?id=${lead.id}&t=${leadToken(lead.id)}`);
}

const copy: Record<Lang, { subject: string; title: string; text: string; cta: string }[]> = {
  bg: [
    {
      subject: "Визуализацията ти е запазена",
      title: "Остана само една стъпка",
      text: "Започна поръчка при нас, но не я изпрати — може би нещо прекъсна. Запазихме визуализацията и данните ти, така че можеш да продължиш от там, където спря.",
      cta: "Довърши поръчката",
    },
    {
      subject: "Имаш ли въпрос за фигурката?",
      title: "Нещо не е ли ясно?",
      text: "Плащаш чак когато получиш пратката и я видиш, с наложен платеж. Всяка фигурка се оцветява на ръка и я изпращаме за 7–12 работни дни. Ако искаш друга поза, дрехи или размер — просто отговори на този имейл и ще го оправим.",
      cta: "Виж поръчката",
    },
    {
      subject: "Последно напомняне за поръчката ти",
      title: "Пазим я още малко",
      text: "Това е последното ни писмо за тази поръчка. Визуализацията остава запазена още няколко дни — ако искаш подаръкът да стигне навреме, сега е моментът.",
      cta: "Поръчай сега",
    },
  ],
  en: [
    {
      subject: "Your preview is saved",
      title: "Just one step left",
      text: "You started an order with us but didn't send it — maybe something got in the way. We saved your preview and details, so you can pick up where you left off.",
      cta: "Finish the order",
    },
    {
      subject: "Any questions about your figurine?",
      title: "Anything unclear?",
      text: "You only pay when the parcel arrives, cash on delivery. Every figurine is painted by hand and ships in 7–12 working days. Want a different pose, outfit or size? Just reply to this email.",
      cta: "See the order",
    },
    {
      subject: "Last reminder about your order",
      title: "We're keeping it a little longer",
      text: "This is our last email about this order. Your preview stays saved for a few more days — if you want the gift to arrive on time, now is the moment.",
      cta: "Order now",
    },
  ],
};

export function reminderEmail(lead: Lead, step: number) {
  const lang = lead.lang;
  const t = dict[lang];
  const c = copy[lang][step];
  const name = lead.customer.name.split(" ")[0];
  const hello = name ? (lang === "en" ? `Hi ${escapeHtml(name)},` : `Здравей, ${escapeHtml(name)},`) : lang === "en" ? "Hi," : "Здравей,";
  const rows = lead.items
    .map(
      (item) => `<tr>
<td width="84" style="padding:10px 12px 10px 0;vertical-align:top"><img src="${absolute(`/api/studio/draft/${item.draftId}`)}" width="76" height="76" alt="" style="display:block;border-radius:12px;object-fit:cover;background:#f6f1e8"></td>
<td style="padding:10px 0;vertical-align:top"><b>${escapeHtml(item.product ? t.itemLabel(item.product, item.subject, item.people) : item.label)}</b><br><span style="color:#8a847b">${item.cm} ${t.cm}${item.qty > 1 ? ` · ${item.qty} ×` : ""}</span></td>
<td align="right" style="padding:10px 0;vertical-align:top;font-weight:700;white-space:nowrap">${t.money(item.price * item.qty)}</td></tr>`
    )
    .join("");
  const body = `<p style="margin:0 0 6px">${hello}</p>
<h1 style="margin:0 0 12px;font-size:24px;line-height:1.25">${escapeHtml(c.title)}</h1>
<p style="margin:0">${escapeHtml(c.text)}</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 0;border-top:1px solid #eee;border-bottom:1px solid #eee">${rows}</table>
${button(c.cta, resumeUrl(lead))}
<p style="margin:18px 0 0;font-size:12px;color:#8a847b">${
    lang === "en" ? "Not interested any more?" : "Не искаш повече напомняния?"
  } <a href="${stopUrl(lead)}" style="color:#8a847b">${lang === "en" ? "Stop these emails" : "Спри тези имейли"}</a></p>`;
  return { subject: c.subject, html: layout(lang, c.text.slice(0, 90), body) };
}

/**
 * Sends every reminder that is due. Safe to call on every visit: it runs at most once every
 * 4 minutes, and each lead records what it was sent.
 */
export async function sendDueReminders() {
  if (!mailReady()) return { sent: 0, skipped: "no mail" };
  if ((await incr("lead-mail:lock", 240)) > 1) return { sent: 0, skipped: "ran recently" };

  const now = Date.now();
  const leads = await listLeads();
  const due = leads.filter((lead) => {
    const at = nextReminderAt(lead);
    return at !== null && at <= now;
  });
  if (due.length === 0) return { sent: 0 };

  // Someone may have ordered from another device: never nudge a customer who already bought.
  const orders = await listOrders(300);
  const digits = (value: string) => value.replace(/\D/g, "").slice(-9);
  let sent = 0;
  for (const lead of due) {
    const ordered = orders.find(
      (order) =>
        order.createdAt >= lead.createdAt &&
        ((lead.customer.email && order.customer.email.toLowerCase() === lead.customer.email.toLowerCase()) ||
          (digits(lead.customer.phone).length === 9 && digits(order.customer.phone) === digits(lead.customer.phone)))
    );
    if (ordered) {
      lead.status = "won";
      lead.orderNumber = ordered.number;
      await saveLead(lead);
      continue;
    }
    const step = (lead.emails || []).length;
    const mail = reminderEmail(lead, step);
    const ok = await sendEmail({ to: lead.customer.email, ...mail });
    lead.emails = [...(lead.emails || []), { step, at: new Date().toISOString(), ok }];
    await saveLead(lead);
    if (ok) sent += 1;
  }
  return { sent };
}
