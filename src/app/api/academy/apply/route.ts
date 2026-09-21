import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export const dynamic = "force-dynamic";

// --- SMTP transport (reuses the same config as the contact form) ---
let cachedTransporter: Transporter | null = null;

async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    tls: { rejectUnauthorized: false },
  });
  return cachedTransporter;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    fullName,
    email,
    phone,
    idNumber,
    address,
    program,
    message,
  } = body;

  // Validation
  if (!fullName || !email || !phone || !program) {
    return NextResponse.json(
      { ok: false, error: "Full name, email, phone and program are required." },
      { status: 422 }
    );
  }

  // Save to database
  const student = await db.student.create({
    data: {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      idNumber: idNumber?.trim() || null,
      address: address?.trim() || null,
      program: program.trim(),
      status: "applied",
      notes: message?.trim() || null,
    },
  });

  // Try to send email notification to info@ndayenisolutions.co.za
  const transporter = await getTransporter();
  const toEmail = process.env.CONTACT_TO_EMAIL || "info@ndayenisolutions.co.za";
  const fromEmail = process.env.SMTP_USER || "info@ndayenisolutions.co.za";

  const subject = `New Training Application: ${program} — from ${fullName}`;
  const textBody = [
    "New training application submitted via the Ndayeni Solutions Digital Academy website.",
    "",
    `Name:       ${fullName}`,
    `Email:      ${email}`,
    `Phone:      ${phone}`,
    idNumber ? `ID Number:  ${idNumber}` : null,
    address ? `Address:    ${address}` : null,
    `Program:    ${program}`,
    message ? `Message:    ${message}` : null,
    "",
    "---",
    `Submitted: ${new Date().toISOString()}`,
    `Reply directly to: ${email}`,
  ].filter(Boolean).join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc;">
      <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #1e90ff;">
          <h2 style="margin: 0; color: #071515; font-size: 20px;">New Training Application</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Ndayeni Solutions Digital Academy</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 100px; vertical-align: top;">Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #1e90ff; text-decoration: none;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Phone</td><td style="padding: 8px 0; color: #0f172a;">${escapeHtml(phone)}</td></tr>
          ${idNumber ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">ID Number</td><td style="padding: 8px 0; color: #0f172a;">${escapeHtml(idNumber)}</td></tr>` : ""}
          ${address ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Address</td><td style="padding: 8px 0; color: #0f172a;">${escapeHtml(address)}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Program</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(program)}</td></tr>
        </table>
        ${message ? `<div style="margin-top: 16px; padding: 12px; background: #f1f5f9; border-radius: 8px;"><p style="margin: 0; color: #0f172a; font-size: 13px;">${escapeHtml(message)}</p></div>` : ""}
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          Submitted: ${new Date().toISOString()}<br>
          Reply directly to: <a href="mailto:${escapeHtml(email)}" style="color: #1e90ff;">${escapeHtml(email)}</a>
        </div>
      </div>
    </div>
  `;

  let emailSent = false;
  let previewUrl: string | null = null;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"Digital Academy" <${fromEmail}>`,
        to: toEmail,
        replyTo: email,
        subject,
        text: textBody,
        html: htmlBody,
      });
      emailSent = true;
      console.log("[academy/apply] Email sent:", info.messageId);
    } catch (err) {
      console.error("[academy/apply] Email failed:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    studentId: student.id,
    emailSent,
  });
}

export async function GET() {
  return NextResponse.json({ endpoint: "/api/academy/apply", method: "POST" });
}
