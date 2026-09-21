import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export const dynamic = "force-dynamic";

let cachedTransporter: Transporter | null = null;

async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host, port, secure: port === 465, auth: { user, pass },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
    tls: { rejectUnauthorized: false },
  });
  return cachedTransporter;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    fullName, email, phone, idNumber, gender, age, nationality, address,
    nextOfKinName, nextOfKinRelationship, nextOfKinPhone, nextOfKinEmail,
    selectedCourses, message,
  } = body;

  if (!fullName || !email || !phone || !selectedCourses?.length) {
    return NextResponse.json(
      { ok: false, error: "Full name, email, phone and at least one course are required." },
      { status: 422 }
    );
  }

  const coursesStr = Array.isArray(selectedCourses) ? selectedCourses.join(", ") : selectedCourses;

  const student = await db.student.create({
    data: {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      idNumber: idNumber?.trim() || null,
      gender: gender || null,
      age: age?.toString() || null,
      nationality: nationality?.trim() || null,
      address: address?.trim() || null,
      nextOfKinName: nextOfKinName?.trim() || null,
      nextOfKinRelationship: nextOfKinRelationship?.trim() || null,
      nextOfKinPhone: nextOfKinPhone?.trim() || null,
      nextOfKinEmail: nextOfKinEmail?.trim() || null,
      selectedCourses: coursesStr,
      program: coursesStr,
      message: message?.trim() || null,
      status: "applied",
    },
  });

  const transporter = await getTransporter();
  const toEmail = process.env.CONTACT_TO_EMAIL || "info@ndayenisolutions.co.za";
  const fromEmail = process.env.SMTP_USER || "info@ndayenisolutions.co.za";

  const subject = `New Training Application: ${coursesStr.split(",")[0]} — from ${fullName}`;

  const fields = [
    ["Name", fullName], ["Email", email], ["Phone", phone],
    ["ID Number", idNumber], ["Gender", gender], ["Age", age],
    ["Nationality", nationality], ["Address", address],
    ["Courses", coursesStr],
    ["Next of Kin", nextOfKinName], ["Kin Relationship", nextOfKinRelationship],
    ["Kin Phone", nextOfKinPhone], ["Kin Email", nextOfKinEmail],
    ["Message", message],
  ];

  const textBody = [
    "New training application — Ndayeni Solutions Digital Academy",
    "",
    ...fields.filter(([,v]) => v).map(([k,v]) => `${k.padEnd(16)} ${v}`),
    "",
    "---",
    `Submitted: ${new Date().toISOString()}`,
    `Reply to: ${email}`,
  ].join("\n");

  const htmlRows = fields.filter(([,v]) => v).map(([k,v]) =>
    `<tr><td style="padding:6px 0;color:#64748b;vertical-align:top;width:120px;">${escapeHtml(k)}</td><td style="padding:6px 0;color:#0f172a;">${escapeHtml(String(v))}</td></tr>`
  ).join("");

  const htmlBody = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
        <div style="margin-bottom:20px;padding-bottom:12px;border-bottom:2px solid #1e90ff;">
          <h2 style="margin:0;color:#071515;font-size:18px;">New Training Application</h2>
          <p style="margin:4px 0 0;color:#64748b;font-size:12px;">Ndayeni Solutions Digital Academy</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">${htmlRows}</table>
        <div style="margin-top:20px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;">
          Submitted: ${new Date().toISOString()}<br>
          Reply to: <a href="mailto:${escapeHtml(email)}" style="color:#1e90ff;">${escapeHtml(email)}</a>
        </div>
      </div>
    </div>`;

  let emailSent = false;
  if (transporter) {
    try {
      await transporter.sendMail({ from: `"Digital Academy" <${fromEmail}>`, to: toEmail, replyTo: email, subject, text: textBody, html: htmlBody });
      emailSent = true;
    } catch (err) {
      console.error("[academy/apply] Email failed:", err);
    }
  }

  return NextResponse.json({ ok: true, studentId: student.id, emailSent });
}

export async function GET() {
  return NextResponse.json({ endpoint: "/api/academy/apply", method: "POST" });
}
