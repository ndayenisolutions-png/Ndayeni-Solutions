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

function generateRef(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NDA-APP-${year}-${random}`;
}

// Sanitize: trim, remove control chars, cap length
function sanitize(s: string | undefined | null, maxLen = 500): string | null {
  if (!s) return null;
  const cleaned = s.trim().replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen);
  return cleaned || null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // ── SERVER-SIDE VALIDATION (Level 1: Required, Level 2: Format) ──
  const fullName = sanitize(body.fullName, 100);
  const email = body.email?.trim().toLowerCase().slice(0, 200) || "";
  const phone = sanitize(body.phone, 20);
  const idNumber = sanitize(body.idNumber, 50);
  const dateOfBirth = sanitize(body.dateOfBirth);
  const gender = sanitize(body.gender, 20);
  const nationality = sanitize(body.nationality, 50);
  const address = sanitize(body.address, 300);
  const selectedCourses = Array.isArray(body.selectedCourses) ? body.selectedCourses.filter((c: string) => typeof c === "string" && c.trim()) : [];
  const preferredStartDate = sanitize(body.preferredStartDate);
  const preferredMode = sanitize(body.preferredMode, 50);
  const highestEducation = sanitize(body.highestEducation, 50);
  const employmentStatus = sanitize(body.employmentStatus, 50);
  const previousTraining = sanitize(body.previousTraining, 500);
  const relevantExperience = sanitize(body.relevantExperience, 500);
  const nextOfKinName = sanitize(body.nextOfKinName, 100);
  const nextOfKinRelationship = sanitize(body.nextOfKinRelationship, 50);
  const nextOfKinPhone = sanitize(body.nextOfKinPhone, 20);
  const nextOfKinEmail = body.nextOfKinEmail?.trim().toLowerCase().slice(0, 200) || "";
  const message = sanitize(body.message, 1000);
  const termsAgreed = body.termsAgreed === true;

  // Validate required fields
  const errors: string[] = [];
  if (!fullName || fullName.length < 2) errors.push("Please enter your full name (minimum 2 characters).");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
  if (!phone || phone.length < 10) errors.push("Please enter a valid phone number.");
  if (selectedCourses.length === 0) errors.push("Please select at least one course.");
  if (!termsAgreed) errors.push("You must agree to the terms and privacy notice.");

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // ── LEVEL 4: Database — duplicate check (email + course combo) ──
  const coursesStr = selectedCourses.join(", ");
  const existingApp = await db.student.findFirst({
    where: {
      email,
      status: { in: ["applied", "under-review", "accepted", "enrolled", "active"] },
      selectedCourses: { contains: coursesStr.split(",")[0].trim() },
    },
  });

  if (existingApp) {
    return NextResponse.json({
      ok: false,
      error: "An application with these details already exists. Please contact Ndayeni Solutions if you believe this is an error.",
    }, { status: 409 });
  }

  const ref = generateRef();

  const student = await db.student.create({
    data: {
      applicationRef: ref,
      // After validation above (errors returned if any of these are null/empty), they're guaranteed non-null
      fullName: fullName!,
      email,
      phone: phone!,
      idNumber,
      dateOfBirth,
      gender,
      nationality: nationality || "South African",
      address,
      selectedCourses: coursesStr,
      preferredStartDate,
      preferredMode,
      highestEducation,
      employmentStatus,
      previousTraining,
      relevantExperience,
      nextOfKinName,
      nextOfKinRelationship,
      nextOfKinPhone,
      nextOfKinEmail: nextOfKinEmail || null,
      program: coursesStr,
      message,
      termsAgreed: true,
      status: "applied",
    },
  });

  // ── SIMPLE NOTIFICATION EMAIL to info@ndayenisolutions.co.za ──
  const transporter = await getTransporter();
  const toEmail = process.env.CONTACT_TO_EMAIL || "info@ndayenisolutions.co.za";
  const fromEmail = process.env.SMTP_USER || "info@ndayenisolutions.co.za";

  // Simple notification — just tells admin someone applied
  const notifySubject = `New Application: ${fullName} — ${coursesStr.split(",")[0].trim()}`;
  const notifyText = [
    "A new application has been submitted via the Ndayeni Solutions Digital Academy website.",
    "",
    `Applicant: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Course(s): ${coursesStr}`,
    `Reference: ${ref}`,
    "",
    "Log in to the admin to review this application:",
    "https://ndayenisolutions.co.za/training/admin",
  ].join("\n");

  const notifyHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#f8fafc;">
      <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e2e8f0;">
        <div style="margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #1e90ff;">
          <h2 style="margin:0;color:#071515;font-size:16px;">New Application Submitted</h2>
          <p style="margin:4px 0 0;color:#64748b;font-size:11px;">Ndayeni Solutions Digital Academy</p>
        </div>
        <p style="margin:0 0 8px;color:#0f172a;font-size:14px;">A new application has been submitted.</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
          <tr><td style="padding:4px 0;color:#64748b;width:80px;">Applicant:</td><td style="padding:4px 0;color:#0f172a;font-weight:600;">${escapeHtml(fullName!)}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Course(s):</td><td style="padding:4px 0;color:#0f172a;">${escapeHtml(coursesStr)}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Email:</td><td style="padding:4px 0;color:#1e90ff;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Phone:</td><td style="padding:4px 0;color:#0f172a;">${escapeHtml(phone!)}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Ref:</td><td style="padding:4px 0;color:#0f172a;font-family:monospace;">${escapeHtml(ref)}</td></tr>
        </table>
        <div style="background:#f1f5f9;border-radius:8px;padding:12px;text-align:center;">
          <p style="margin:0;color:#64748b;font-size:12px;">Log in to review this application:</p>
          <a href="https://ndayenisolutions.co.za/training/admin" style="color:#1e90ff;font-size:13px;font-weight:600;text-decoration:none;">ndayenisolutions.co.za/training/admin</a>
        </div>
      </div>
    </div>`;

  let emailSent = false;
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Digital Academy" <${fromEmail}>`,
        to: toEmail,
        replyTo: email,
        subject: notifySubject,
        text: notifyText,
        html: notifyHtml,
      });
      emailSent = true;
    } catch (err) {
      console.error("[academy/apply] Notification email failed:", err);
    }
  }

  return NextResponse.json({ ok: true, studentId: student.id, applicationRef: ref, emailSent });
}

export async function GET() {
  return NextResponse.json({ endpoint: "/api/academy/apply", method: "POST" });
}
