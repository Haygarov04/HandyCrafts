import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Моля, попълнете име, имейл и съобщение." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = process.env.CONTACT_TO;

    if (!to) {
      return NextResponse.json(
        { error: "Липсва CONTACT_TO в env." },
        { status: 500 }
      );
    }

    await transporter.sendMail({
      from: `"HandyCrafts 3D Website" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `Ново запитване от сайта - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Ново запитване от contact form</h2>
          <p><strong>Име:</strong> ${escapeHtml(name)}</p>
          <p><strong>Имейл:</strong> ${escapeHtml(email)}</p>
          <p><strong>Телефон:</strong> ${escapeHtml(phone || "-")}</p>
          <p><strong>Съобщение:</strong></p>
          <div style="padding:12px; background:#f6f6f6; border-radius:8px; white-space:pre-wrap;">
            ${escapeHtml(message)}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT_API_ERROR:", error);
    return NextResponse.json(
      { error: "Възникна проблем при изпращането." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}