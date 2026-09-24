import nodemailer from "nodemailer";
import { dict, localize, type Lang } from "@/lib/i18n";
import type { Order, OrderStatus } from "@/lib/order-types";
import { escapeHtml } from "@/lib/security";
import { unsubscribeToken } from "@/lib/newsletter";
import { absolute } from "@/lib/site";

// Emails go out through Resend (RESEND_API_KEY). SMTP_* is kept as a fallback.

type Mail = { to: string; subject: string; html: string; replyTo?: string };

/** The Resend key, whatever name it was saved under in Vercel. */
export function resendKey() {
  const named = process.env.RESEND_API_KEY || process.env.RESEND_KEY || process.env.RESEND_TOKEN || process.env.RESEND_API_TOKEN;
  if (named) return named.trim();
  // Fall back to any variable whose value looks like a Resend key.
  const found = Object.entries(process.env).find(([name, value]) => /RESEND/i.test(name) && value?.trim().startsWith("re_"));
  return found?.[1]?.trim() || "";
}

/** Which way emails go out right now: shown in /manage settings. */
export function mailRoute() {
  if (resendKey()) return "resend" as const;
  if (process.env.SMTP_HOST && process.env.SMTP_USER) return "smtp" as const;
  return "none" as const;
}

function sender() {
  return process.env.EMAIL_FROM || "HandyCrafts <onboarding@resend.dev>";
}

export function mailReady() {
  return mailRoute() !== "none";
}

export async function sendEmail(mail: Mail): Promise<boolean> {
  const key = resendKey();
  if (key) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender(),
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        reply_to: mail.replyTo || process.env.CONTACT_TO || undefined,
      }),
      signal: AbortSignal.timeout(15_000),
    }).catch((error) => {
      console.error("RESEND", error);
      return null;
    });
    if (response?.ok) return true;
    if (response) console.error("RESEND", response.status, await response.text().catch(() => ""));
    return false;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    try {
      await transport.sendMail({
        from: `"HandyCrafts" <${process.env.SMTP_USER}>`,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        replyTo: mail.replyTo,
      });
      return true;
    } catch (error) {
      console.error("SMTP", error);
      return false;
    }
  }
  return false;
}

/* ---------- layout ---------- */

const ink = "#161513";
const paper = "#f6f1e8";
const ember = "#ff7a00";

function button(label: string, href: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 8px"><tr><td style="border-radius:14px;background:${ember}">
<a href="${href}" style="display:inline-block;padding:14px 26px;font-weight:700;font-size:15px;color:${ink};text-decoration:none;border-radius:14px">${escapeHtml(label)}</a>
</td></tr></table>`;
}

function layout(lang: Lang, preheader: string, body: string) {
  const f = lang === "en"
    ? { tagline: "Figurines and keychains from a photo · Ruse, Bulgaria", questions: "Questions? Just reply to this email." }
    : { tagline: "Фигурки и ключодържатели по снимка · Русе", questions: "Въпроси? Просто отговори на този имейл." };
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:${paper};font-family:Arial,Helvetica,sans-serif;color:${ink}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${paper}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px">
<tr><td align="center" style="padding-bottom:18px">
<a href="${absolute(localize(lang, "/"))}" style="text-decoration:none;color:${ink}">
<img src="${absolute("/icons/icon-192.png")}" width="56" height="56" alt="HandyCrafts" style="display:block;border-radius:50%;margin:0 auto 8px">
<span style="font-size:18px;font-weight:700;letter-spacing:-0.3px">HandyCrafts</span></a>
</td></tr>
<tr><td style="background:#ffffff;border-radius:24px;padding:30px 26px;font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td align="center" style="padding:20px 10px;font-size:12px;line-height:1.6;color:#8a847b">
${escapeHtml(f.questions)}<br>${escapeHtml(f.tagline)}<br>
<a href="${absolute(localize(lang, "/"))}" style="color:#8a847b">handy-crafts.digital</a>
</td></tr></table></td></tr></table></body></html>`;
}

function itemsTable(order: Order, lang: Lang) {
  const t = dict[lang];
  const rows = order.items
    .map(
      (item) => `<tr>
<td width="72" style="padding:10px 12px 10px 0;vertical-align:top"><img src="${absolute(`/api/studio/draft/${item.draftId}`)}" width="64" height="64" alt="" style="display:block;border-radius:12px;object-fit:cover;background:${paper}"></td>
<td style="padding:10px 0;vertical-align:top"><b>${escapeHtml(t.itemLabel(item.product, item.subject))}</b><br><span style="color:#8a847b">${item.cm} ${t.cm} · ${item.qty} × ${t.money(item.price)}</span></td>
<td align="right" style="padding:10px 0;vertical-align:top;font-weight:700;white-space:nowrap">${t.money(item.price * item.qty)}</td></tr>`
    )
    .join("");
  const total = lang === "en" ? "Total" : "Общо";
  const plus = lang === "en" ? "+ delivery, cash on delivery" : "+ доставка, наложен платеж";
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0;border-top:1px solid #eee;border-bottom:1px solid #eee">${rows}</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
<td style="font-size:16px"><b>${total}</b><br><span style="font-size:12px;color:#8a847b">${plus}</span></td>
<td align="right" style="font-size:20px;font-weight:700">${t.money(order.total)}</td></tr></table>`;
}

function address(order: Order, lang: Lang) {
  const c = order.customer;
  const label = lang === "en" ? "Delivery" : "Доставка";
  return `<p style="margin:18px 0 0;padding:14px 16px;background:${paper};border-radius:14px;font-size:14px">
<b>${label}:</b> ${escapeHtml(`${dict[lang].delivery[c.delivery]}, ${c.city}, ${c.address}`)}</p>`;
}

function trackingUrl(order: Order, lang: Lang) {
  const tracking = order.tracking;
  if (!tracking?.number) return "";
  const n = encodeURIComponent(tracking.number);
  return tracking.courier === "speedy"
    ? `https://www.speedy.bg/${lang === "en" ? "en" : "bg"}/track-shipment?shipmentNumber=${n}`
    : `https://www.econt.com/services/track-shipment/${n}`;
}

/* ---------- customer emails ---------- */

export type CustomerEmail = "received" | Exclude<OrderStatus, "new">;

const copy: Record<Lang, Record<CustomerEmail, { subject: string; title: string; text: string }>> = {
  bg: {
    received: {
      subject: "Поръчка {n} е приета",
      title: "Получихме поръчката ти!",
      text: "Ще ти се обадим на {phone} в работно време, за да потвърдим поръчката, преди да започнем изработката.",
    },
    confirmed: {
      subject: "Поръчка {n} е потвърдена",
      title: "Поръчката е потвърдена",
      text: "Благодарим за потвърждението! Фигурката влиза в опашката за изработка. Обичайният срок е 7–12 работни дни.",
    },
    printing: {
      subject: "Изработваме поръчка {n}",
      title: "Фигурката се изработва",
      text: "В момента печатаме и довършваме фигурката на ръка. Ще ти пишем веднага щом тръгне към теб.",
    },
    shipped: {
      subject: "Поръчка {n} е изпратена",
      title: "Фигурката пътува към теб",
      text: "Пратката е предадена на куриера. Плащаш при получаване. Прегледай я пред куриера, преди да платиш.",
    },
    delivered: {
      subject: "Как ти хареса фигурката?",
      title: "Надяваме се да ти хареса!",
      text: "Благодарим, че избра HandyCrafts. Ще се радваме, ако ни оставиш отзив — помага много на малка работилница като нашата.",
    },
    cancelled: {
      subject: "Поръчка {n} е отказана",
      title: "Поръчката е отказана",
      text: "Поръчката беше отказана. Ако това е грешка или искаш да я направиш отново, просто отговори на този имейл.",
    },
  },
  en: {
    received: {
      subject: "Order {n} received",
      title: "We've got your order!",
      text: "We'll call you on {phone} during working hours to confirm the order before we start making it.",
    },
    confirmed: {
      subject: "Order {n} confirmed",
      title: "Your order is confirmed",
      text: "Thanks for confirming! Your figurine is now in the making queue. It usually takes 7–12 working days.",
    },
    printing: {
      subject: "We're making order {n}",
      title: "Your figurine is being made",
      text: "We're printing your figurine and finishing it by hand right now. We'll email you as soon as it ships.",
    },
    shipped: {
      subject: "Order {n} has shipped",
      title: "Your figurine is on its way",
      text: "The parcel is with the courier. You pay when it arrives — check it in front of the courier before paying.",
    },
    delivered: {
      subject: "How do you like your figurine?",
      title: "We hope you love it!",
      text: "Thank you for choosing HandyCrafts. We'd be grateful for a review — it helps a small workshop like ours a lot.",
    },
    cancelled: {
      subject: "Order {n} cancelled",
      title: "Your order is cancelled",
      text: "Your order has been cancelled. If this is a mistake or you'd like to order again, just reply to this email.",
    },
  },
};

export function customerEmail(order: Order, type: CustomerEmail) {
  const lang: Lang = order.lang === "en" ? "en" : "bg";
  const c = copy[lang][type];
  const fill = (text: string) => text.replaceAll("{n}", order.number).replaceAll("{phone}", order.customer.phone);
  const hi = lang === "en" ? `Hi ${order.customer.name},` : `Здравей, ${order.customer.name}!`;
  const numberLine = lang === "en" ? `Order <b>${order.number}</b>` : `Поръчка <b>${order.number}</b>`;

  let extra = "";
  if (type === "shipped") {
    const url = trackingUrl(order, lang);
    if (url && order.tracking) {
      const courier = order.tracking.courier === "speedy" ? "Speedy" : lang === "en" ? "Econt" : "Еконт";
      extra += `<p style="margin:18px 0 0"><b>${lang === "en" ? "Tracking number" : "Товарителница"} (${courier}):</b> ${escapeHtml(order.tracking.number)}</p>`;
      extra += button(lang === "en" ? "Track the parcel" : "Проследи пратката", url);
    }
  }
  if (type === "delivered" && process.env.GOOGLE_REVIEW_URL) {
    extra += button(lang === "en" ? "Leave a review" : "Остави отзив", process.env.GOOGLE_REVIEW_URL);
  }

  const showItems = type !== "delivered";
  const body = `<p style="margin:0 0 6px;font-size:13px;color:#8a847b">${numberLine}</p>
<h1 style="margin:0 0 14px;font-size:24px;line-height:1.25">${escapeHtml(c.title)}</h1>
<p style="margin:0">${escapeHtml(hi)}</p>
<p style="margin:10px 0 0">${escapeHtml(fill(c.text))}</p>
${extra}
${showItems ? itemsTable(order, lang) : ""}
${type === "received" || type === "shipped" ? address(order, lang) : ""}
${type === "delivered" ? button(lang === "en" ? "Make another one" : "Направи още една", absolute(localize(lang, "/studio"))) : ""}`;

  return { subject: fill(c.subject), html: layout(lang, fill(c.text), body) };
}

export async function sendCustomerEmail(order: Order, type: CustomerEmail) {
  if (!order.customer.email) return false;
  const mail = customerEmail(order, type);
  return sendEmail({ to: order.customer.email, ...mail, replyTo: process.env.CONTACT_TO || undefined });
}

/* ---------- emails to the workshop ---------- */

export async function sendNewOrderToShop(order: Order) {
  const to = process.env.CONTACT_TO;
  if (!to) return false;
  const c = order.customer;
  const body = `<p style="margin:0 0 6px;font-size:13px;color:#8a847b">${order.lang === "en" ? "🇬🇧 Английски сайт" : "🇧🇬 Български сайт"}</p>
<h1 style="margin:0 0 14px;font-size:24px">Нова поръчка ${order.number}</h1>
<p style="margin:0"><b>${escapeHtml(c.name)}</b> · <a href="tel:${escapeHtml(c.phone)}">${escapeHtml(c.phone)}</a>${c.email ? ` · ${escapeHtml(c.email)}` : ""}</p>
${order.note ? `<p style="margin:12px 0 0;padding:12px 14px;background:${paper};border-radius:12px"><b>Бележка:</b> ${escapeHtml(order.note)}</p>` : ""}
${itemsTable(order, "bg")}
${address(order, "bg")}
${button("Отвори в /manage", absolute(`/manage/${order.id}`))}`;
  return sendEmail({
    to,
    subject: `Нова поръчка ${order.number} — ${dict.bg.money(order.total)}`,
    html: layout("bg", `${c.name}, ${dict.bg.money(order.total)}`, body),
    replyTo: c.email || undefined,
  });
}

export async function sendContactMail(input: { name: string; email: string; phone: string; message: string }) {
  const to = process.env.CONTACT_TO;
  if (!to || !mailReady()) throw new Error("mail not configured");
  const body = `<h1 style="margin:0 0 14px;font-size:22px">Съобщение от сайта</h1>
<p style="margin:0"><b>${escapeHtml(input.name)}</b> · ${escapeHtml(input.email)}${input.phone ? ` · ${escapeHtml(input.phone)}` : ""}</p>
<p style="margin:14px 0 0;padding:14px 16px;background:${paper};border-radius:14px;white-space:pre-wrap">${escapeHtml(input.message)}</p>`;
  const ok = await sendEmail({
    to,
    subject: `Съобщение от сайта — ${input.name}`,
    html: layout("bg", input.message.slice(0, 90), body),
    replyTo: input.email,
  });
  if (!ok) throw new Error("mail failed");
}

/* ---------- newsletter ---------- */

export function unsubscribeUrl(email: string, lang: Lang) {
  return absolute(localize(lang, `/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubscribeToken(email)}`));
}

export async function sendWelcomeEmail(email: string, lang: Lang) {
  const en = lang === "en";
  const body = `<h1 style="margin:0 0 14px;font-size:24px;line-height:1.25">${en ? "You're on the list ♡" : "Записа се ♡"}</h1>
<p style="margin:0">${
    en
      ? "Thanks for joining! About once a month we'll send gift ideas before the holidays and new pieces from the workshop. Nothing more."
      : "Благодарим! Около веднъж в месеца ще ти пращаме идеи за подаръци преди празниците и нови неща от работилницата. Нищо повече."
  }</p>
${button(en ? "Create a figurine" : "Създай фигурка", absolute(localize(lang, "/studio")))}
<p style="margin:18px 0 0;font-size:12px;color:#8a847b">${
    en ? "Changed your mind?" : "Размисли?"
  } <a href="${unsubscribeUrl(email, lang)}" style="color:#8a847b">${en ? "Unsubscribe" : "Отпиши се"}</a></p>`;
  return sendEmail({
    to: email,
    subject: en ? "Welcome to HandyCrafts" : "Добре дошъл в HandyCrafts",
    html: layout(lang, en ? "Gift ideas about once a month." : "Идеи за подаръци около веднъж в месеца.", body),
  });
}
