import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const quantity = String(formData.get("quantity") || "1").trim();
    const description = String(formData.get("description") || "").trim();

    const material = String(formData.get("material") || "").trim();
    const technology = String(formData.get("technology") || "").trim();
    const purpose = String(formData.get("purpose") || "").trim();
    const colorName = String(formData.get("colorName") || "").trim();
    const colorHex = String(formData.get("colorHex") || "").trim();

    const paintingRequested =
      String(formData.get("paintingRequested") || "false") === "true";
    const paintingDetails = String(formData.get("paintingDetails") || "").trim();

    const files = formData.getAll("files") as File[];

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Липсват задължителни полета." },
        { status: 400 }
      );
    }

    if (!files.length) {
      return NextResponse.json(
        { error: "Няма качени файлове." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_BUCKET || "orders";

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Липсват Supabase env променливи." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const uploadedFiles: { name: string; path: string; signedUrl: string }[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const maxSizeBytes = 25 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return NextResponse.json(
          { error: `Файлът "${file.name}" е над 25 MB.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("SUPABASE_UPLOAD_ERROR:", uploadError);
        return NextResponse.json(
          { error: `Проблем при качване на файл: ${file.name}` },
          { status: 500 }
        );
      }

      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60 * 24 * 7);

      if (signedError || !signedData?.signedUrl) {
        console.error("SIGNED_URL_ERROR:", signedError);
        return NextResponse.json(
          { error: `Проблем при създаване на линк за файл: ${file.name}` },
          { status: 500 }
        );
      }

      uploadedFiles.push({
        name: file.name,
        path,
        signedUrl: signedData.signedUrl,
      });
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

    const filesHtml = uploadedFiles
      .map(
        (file) =>
          `<li><strong>${escapeHtml(file.name)}</strong><br /><a href="${file.signedUrl}">${file.signedUrl}</a></li>`
      )
      .join("");

    await transporter.sendMail({
      from: `"HandyCrafts 3D Website" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `Нова поръчка / upload - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Ново запитване от upload страницата</h2>

          <p><strong>Име:</strong> ${escapeHtml(name)}</p>
          <p><strong>Имейл:</strong> ${escapeHtml(email)}</p>
          <p><strong>Телефон:</strong> ${escapeHtml(phone || "-")}</p>
          <p><strong>Количество:</strong> ${escapeHtml(quantity || "-")}</p>

          <hr style="margin: 20px 0;" />

          <p><strong>Материал:</strong> ${escapeHtml(material || "-")}</p>
          <p><strong>Технология:</strong> ${escapeHtml(technology || "-")}</p>
          <p><strong>Приложение:</strong> ${escapeHtml(purpose || "-")}</p>
          <p><strong>Цвят:</strong> ${escapeHtml(colorName || "-")} ${colorHex ? `(${escapeHtml(colorHex)})` : ""}</p>

          <p><strong>Ръчно боядисване:</strong> ${paintingRequested ? "Да" : "Не"}</p>
          <p><strong>Уточнения за боядисване:</strong> ${escapeHtml(paintingDetails || "-")}</p>

          <hr style="margin: 20px 0;" />

          <p><strong>Описание:</strong></p>
          <div style="padding:12px; background:#f6f6f6; border-radius:8px; white-space:pre-wrap;">
            ${escapeHtml(description)}
          </div>

          <hr style="margin: 20px 0;" />

          <p><strong>Качени файлове:</strong></p>
          <ul>
            ${filesHtml}
          </ul>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      uploadedCount: uploadedFiles.length,
    });
  } catch (error) {
    console.error("UPLOAD_API_ERROR:", error);
    return NextResponse.json(
      { error: "Възникна проблем при изпращането на поръчката." },
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