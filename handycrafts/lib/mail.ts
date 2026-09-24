import nodemailer from "nodemailer";
import { money } from "@/lib/catalog";
import { deliveryLabel, type Order } from "@/lib/order-types";
import { dict } from "@/lib/i18n";
import { escapeHtml } from "@/lib/security";

function transport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function itemsHtml(order: Order) {
  return order.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.label)} ${item.cm} см × ${item.qty} — ${money(item.price * item.qty)}</li>`
    )
    .join("");
}

export async function sendContactMail(input: { name: string; email: string; phone: string; message: string }) {
  const mailer = transport();
  const to = process.env.CONTACT_TO;
  if (!mailer || !to) throw new Error("mail not configured");
  await mailer.sendMail({
    from: `"HandyCrafts 3D" <${process.env.SMTP_USER}>`,
    to,
    replyTo: input.email,
    subject: `Съобщение от сайта — ${input.name}`,
    html: `<p><b>${escapeHtml(input.name)}</b> · ${escapeHtml(input.email)} · ${escapeHtml(input.phone || "-")}</p>
<div style="white-space:pre-wrap">${escapeHtml(input.message)}</div>`,
  });
}

export async function sendOrderMails(order: Order, siteUrl: string) {
  const mailer = transport();
  if (!mailer) return;
  const from = `"HandyCrafts 3D" <${process.env.SMTP_USER}>`;
  const c = order.customer;
  const where = `${deliveryLabel[c.delivery]}, ${c.city}, ${c.address}`;

  const jobs: Promise<unknown>[] = [];
  if (process.env.CONTACT_TO) {
    jobs.push(
      mailer.sendMail({
        from,
        to: process.env.CONTACT_TO,
        replyTo: c.email || undefined,
        subject: `Нова поръчка ${order.number} — ${money(order.total)}`,
        html: `<p><b>${escapeHtml(c.name)}</b>, ${escapeHtml(c.phone)}</p>
<p>${escapeHtml(where)}</p><ul>${itemsHtml(order)}</ul>
<p>Общо (наложен платеж): <b>${money(order.total)}</b></p>
<p><a href="${siteUrl}/manage/${order.id}">Отвори в /manage</a></p>`,
      })
    );
  }
  if (c.email && order.lang === "en") {
    const itemsEn = order.items
      .map((item) => `<li>${escapeHtml(dict.en.itemLabel(item.product, item.subject))} ${item.cm} cm × ${item.qty} — €${item.price * item.qty}</li>`)
      .join("");
    jobs.push(
      mailer.sendMail({
        from,
        to: c.email,
        subject: `Order ${order.number} received — HandyCrafts`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
<p>Hi ${escapeHtml(c.name)},</p>
<p>We've received order <b>${order.number}</b>. We'll call you on ${escapeHtml(c.phone)} to confirm it before we start making it.</p>
<ul>${itemsEn}</ul>
<p>Total: <b>€${order.total}</b> + delivery. Cash on delivery when the parcel arrives.</p>
<p>Delivery: ${escapeHtml(`${dict.en.delivery[c.delivery]}, ${c.city}, ${c.address}`)}</p>
<p>HandyCrafts · Ruse, Bulgaria</p></div>`,
      })
    );
  } else if (c.email) {
    jobs.push(
      mailer.sendMail({
        from,
        to: c.email,
        subject: `Поръчка ${order.number} е приета — HandyCrafts 3D`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6">
<p>Здравей, ${escapeHtml(c.name)}!</p>
<p>Получихме поръчка <b>${order.number}</b>. Ще ти се обадим на ${escapeHtml(c.phone)}, за да я потвърдим, преди да започнем печата.</p>
<ul>${itemsHtml(order)}</ul>
<p>Общо: <b>${money(order.total)}</b> + доставка. Плащане с наложен платеж при получаване.</p>
<p>Доставка: ${escapeHtml(where)}</p>
<p>HandyCrafts 3D · Русе</p></div>`,
      })
    );
  }
  await Promise.allSettled(jobs);
}
