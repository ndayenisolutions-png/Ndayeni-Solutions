import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import nodemailer, { Transporter } from "nodemailer";
import { db } from "@/lib/db";

// Force dynamic — never cache this route.
export const dynamic = "force-dynamic";

// ─── Secrets + token config ───────────────────────────────────────────
// Reuse the same secret academy-auth.ts uses for session tokens so the
// signing key is consistent across the SMS auth surface.
const SECRET = process.env.ACADEMY_SECRET || "ndayeni-academy-secret-2024";
const RESET_TTL_SECONDS = 3600; // 1 hour

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Transport caching ────────────────────────────────────────────────
// Building an SMTP transport is cheap-ish but pointless to repeat per
// request. Cache one transport per worker (same pattern as contact route).
let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;
  if (cachedTransporter) return cachedTransporter;

  // Same TLS-softening logic as the contact route: some hosted SMTP
  // providers (e.g. Afrihost) serve an expired cross-signed intermediate
  // that Node rejects. Set SMTP_REQUIRE_VALID_CERT=true to enforce strict
  // verification. See src/app/api/contact/route.ts for full rationale.
  const requireValidCert = process.env.SMTP_REQUIRE_VALID_CERT === "true";
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    ...(requireValidCert ? {} : { tls: { rejectUnauthorized: false } }),
  });
  cachedTransporter = transporter;
  return transporter;
}

// ─── Token construction ───────────────────────────────────────────────
// Token format: <base64url(json)>.<hmac>
// Payload: { userId, expiresAt(ms) }
// Signature: HMAC-SHA256 of the base64url JSON, hex-digested.
// No DB row needed — the token carries everything + authenticity proof.

interface ResetPayload {
  userId: string;
  expiresAt: number;
}

function createResetToken(userId: string): string {
  const payload: ResetPayload = {
    userId,
    expiresAt: Date.now() + RESET_TTL_SECONDS * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${sig}`;
}

// Tiny HTML-escaper — keeps user.name out of raw HTML.
function htmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The non-enumerating response — always identical whether or not the user
// exists, whether or not the email was actually sent.
function safeOkResponse() {
  return NextResponse.json({
    ok: true,
    message: "If an account with that email exists, a reset link has been sent.",
  });
}

export async function POST(req: NextRequest) {
  // ─── Parse + validate the email ───
  let email: string;
  try {
    const body = await req.json();
    email =
      typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "A valid email is required." },
      { status: 422 }
    );
  }

  if (!email || !emailRe.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required." },
      { status: 422 }
    );
  }

  try {
    const user = await db.academyUser.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, active: true },
    });

    // Only act if the user exists AND is active — inactive accounts can't
    // reset by self-service (an admin should re-enable them first).
    if (user && user.active) {
      const token = createResetToken(user.id);
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://ndayenisolutions.co.za";
      const resetUrl = `${siteUrl}/training/forgot-password?token=${token}`;

      // Plain-text version (always include — accessibility + spam filters).
      const textBody =
        `Hello ${user.name},\n\n` +
        `We received a request to reset your Ndayeni Academy password. ` +
        `Click the link below to set a new password:\n\n` +
        `${resetUrl}\n\n` +
        `This link expires in 1 hour.\n\n` +
        `If you didn't request a reset, you can ignore this email — ` +
        `your password stays unchanged.\n\n` +
        `— Ndayeni Solutions Digital Academy`;

      // HTML version (branded, matches contact-route styling).
      const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc;">
  <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
    <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #c2410c;">
      <h2 style="margin: 0; color: #071515; font-size: 20px;">Ndayeni Academy — Password Reset</h2>
      <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Ndayeni Solutions Digital Academy</p>
    </div>
    <p style="margin: 0 0 16px 0; color: #0f172a; line-height: 1.6;">Hello ${htmlEscape(user.name)},</p>
    <p style="margin: 0 0 16px 0; color: #0f172a; line-height: 1.6;">
      We received a request to reset your Ndayeni Academy password. Click the link below to set a new password:
    </p>
    <p style="margin: 0 0 16px 0;">
      <a href="${htmlEscape(resetUrl)}" style="display: inline-block; background: #c2410c; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset your password</a>
    </p>
    <p style="margin: 0 0 16px 0; color: #64748b; font-size: 13px; word-break: break-all;">
      Or copy this link:<br><a href="${htmlEscape(resetUrl)}" style="color: #c2410c; text-decoration: none;">${htmlEscape(resetUrl)}</a>
    </p>
    <p style="margin: 0 0 16px 0; color: #0f172a; line-height: 1.6;">This link expires in 1 hour.</p>
    <p style="margin: 0 0 16px 0; color: #0f172a; line-height: 1.6;">
      If you didn't request a reset, you can ignore this email — your password stays unchanged.
    </p>
    <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
      — Ndayeni Solutions Digital Academy
    </div>
  </div>
</div>`;

      const transporter = getTransporter();
      if (transporter) {
        const fromEmail =
          process.env.SMTP_FROM_EMAIL ||
          process.env.SMTP_USER ||
          "info@ndayenisolutions.co.za";
        // Per spec: try/catch around sendMail — on failure, log to console
        // but STILL return ok:true (don't leak SMTP errors to the client).
        try {
          await transporter.sendMail({
            from: `"Ndayeni Academy" <${fromEmail}>`,
            to: user.email,
            subject: "Ndayeni Academy — Password Reset",
            text: textBody,
            html: htmlBody,
          });
        } catch (err) {
          console.error(
            `[academy/forgot-password] sendMail failed for ${user.email}:`,
            err
          );
        }
      } else {
        // No SMTP creds in env — log loudly so a dev notices, but still
        // return the non-enumerating ok response.
        console.warn(
          "[academy/forgot-password] No SMTP transport configured — reset email was NOT sent."
        );
      }

      // Audit log — only written when we actually attempted to send.
      try {
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "user.password_reset_requested",
            details: `Password reset link sent to ${user.email}`,
          },
        });
      } catch (err) {
        console.error(
          "[academy/forgot-password] Failed to write AuditLog:",
          err
        );
      }
    }

    // Always the same response — no email enumeration.
    return safeOkResponse();
  } catch (err) {
    // Even on unexpected errors, return the safe response to avoid leaking
    // any signal about whether the account exists.
    console.error("[academy/forgot-password] Unexpected error:", err);
    return safeOkResponse();
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/academy/auth/forgot-password",
    method: "POST",
  });
}
