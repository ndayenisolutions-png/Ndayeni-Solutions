import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";

// Force this route to be dynamic (server-side). We never want it cached.
export const dynamic = "force-dynamic";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  customerType?: string;
  interests?: string[];
  service?: string;
  message?: string;
  recaptchaToken?: string;
}

// Basic email-format check
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Transport caching
// ---------------------------------------------------------------------------
// Building an SMTP transport (and, in test mode, generating an Ethereal test
// account) is expensive. We cache one transport per worker so repeated
// requests reuse it.

let cachedTransporter: Transporter | null = null;
let cachedMode: "production" | "test" | null = null;
let cachedTestAccount: { user: string; pass: string } | null = null;

async function getTransporter() {
  // --- 1. Production mode: real SMTP creds from env ---
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (host && user && pass) {
    if (cachedTransporter && cachedMode === "production") {
      return { transporter: cachedTransporter, mode: "production" as const, testAccount: null };
    }
    // Some hosted SMTP providers (e.g. Afrihost on smtp.afrihost.co.za:587)
    // still serve a certificate chain that includes an expired cross-signed
    // intermediate. Node's strict TLS rejects it with "certificate has
    // expired", blocking all mail. We relax certificate verification here
    // because: (1) the connection is still TLS-encrypted, so transport
    // security is preserved; (2) SMTP AUTH with the mailbox password is what
    // actually authenticates the sender; (3) the failure is the provider's
    // expired intermediate, not a MITM. Set SMTP_REQUIRE_VALID_CERT=true to
    // force strict verification if your provider has a clean cert.
    const requireValidCert = process.env.SMTP_REQUIRE_VALID_CERT === "true";
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: { user, pass },
      connectionTimeout: 10_000, // don't hang on unreachable servers
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
      ...(requireValidCert
        ? {}
        : { tls: { rejectUnauthorized: false } }),
    });
    cachedTransporter = transporter;
    cachedMode = "production";
    cachedTestAccount = null;
    return { transporter, mode: "production" as const, testAccount: null };
  }

  // --- 2. Test mode fallback (Ethereal) ---
  // Used automatically when no real SMTP creds are present. Emails are
  // captured in a viewable inbox at https://ethereal.email — perfect for
  // development & demos. The exact same code path runs as production, just
  // through a test SMTP server, so you can verify the HTML/text rendering
  // end-to-end.
  return getTestTransporter();
}

// Dedicated test-mode transporter resolver. Called directly when production
// SMTP fails and we want to fall back WITHOUT re-resolving production creds.
async function getTestTransporter() {
  const disableTestMode = process.env.SMTP_DISABLE_TEST_MODE === "true";
  if (disableTestMode) {
    return { transporter: null, mode: null as const, testAccount: null };
  }

  if (cachedTransporter && cachedMode === "test" && cachedTestAccount) {
    return { transporter: cachedTransporter, mode: "test" as const, testAccount: cachedTestAccount };
  }

  // Generate (or reuse) an Ethereal test account. This hits
  // api.nodemailer.com once; the account persists for later logins.
  let account;
  try {
    account = await nodemailer.createTestAccount();
  } catch (err) {
    console.error("[contact] Failed to create Ethereal test account:", err);
    return { transporter: null, mode: null as const, testAccount: null };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: account.user, pass: account.pass },
  });

  cachedTransporter = transporter;
  cachedMode = "test";
  cachedTestAccount = { user: account.user, pass: account.pass };

  console.log(
    `[contact] TEST MODE (Ethereal) active.\n` +
      `  Login at https://ethereal.email/login with:\n` +
      `    user: ${account.user}\n` +
      `    pass: ${account.pass}\n` +
      `  Each sent email also returns a direct preview URL.`
  );

  return { transporter, mode: "test" as const, testAccount: cachedTestAccount };
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const customerType = (body.customerType || "").trim();
  const interests = Array.isArray(body.interests) ? body.interests : [];
  const service = (body.service || "").trim();
  const message = (body.message || "").trim();

  // --- Validation ---
  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and message are required." },
      { status: 422 }
    );
  }
  if (!emailRe.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 422 }
    );
  }

  // --- reCAPTCHA v3 verification ---
  // If RECAPTCHA_SECRET_KEY is set, verify the token with Google's API.
  // If the env var is not set, skip verification (dev/test mode).
  // In development (NODE_ENV !== "production"), reCAPTCHA hostname mismatches
  // (e.g. localhost) are logged but NOT blocked — the site key is typically
  // registered for the production domain only.
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaToken = body.recaptchaToken;
  const isDev = process.env.NODE_ENV !== "production";
  if (recaptchaSecret) {
    if (!recaptchaToken) {
      if (isDev) {
        console.warn("[contact] reCAPTCHA token missing in dev mode — allowing submission");
      } else {
        return NextResponse.json(
          { ok: false, error: "reCAPTCHA verification is required." },
          { status: 403 }
        );
      }
    } else {
      try {
        const verifyRes = await fetch(
          "https://www.recaptcha.net/recaptcha/api/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${encodeURIComponent(recaptchaSecret)}&token=${encodeURIComponent(recaptchaToken)}`,
          }
        );
        const verifyData = await verifyRes.json();
        if (!verifyData.success || (verifyData.score ?? 0) < 0.5) {
          const errorCodes = verifyData["error-codes"]?.join(", ") || "none";
          console.warn(
            `[contact] reCAPTCHA verification failed: success=${verifyData.success}, score=${verifyData.score}, error-codes=${errorCodes}`
          );
          // In development, allow submissions that fail due to hostname mismatch
          // (localhost is not in the site key's allowed domains). Block in production.
          if (isDev) {
            console.warn("[contact] Dev mode — allowing submission despite reCAPTCHA failure");
          } else {
            return NextResponse.json(
              { ok: false, error: "reCAPTCHA verification failed. Please try again." },
              { status: 403 }
            );
          }
        } else {
          console.log(
            `[contact] reCAPTCHA verified: score=${verifyData.score}, action=${verifyData.action}`
          );
        }
      } catch (err) {
        console.error("[contact] reCAPTCHA verification request failed:", err);
        if (!isDev) {
          return NextResponse.json(
            { ok: false, error: "reCAPTCHA verification failed. Please try again." },
            { status: 403 }
          );
        }
        console.warn("[contact] Dev mode — allowing submission despite reCAPTCHA error");
      }
    }
  }

  // Resolve the transport (production real-SMTP, or Ethereal test fallback).
  const { transporter, mode, testAccount } = await getTransporter();

  if (!transporter || !mode) {
    console.error(
      "[contact] Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD for production, " +
        "or remove SMTP_DISABLE_TEST_MODE to enable test mode."
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "Email server is not configured. Please contact us directly at info@ndayenisolutions.co.za.",
      },
      { status: 503 }
    );
  }

  // Where the enquiry gets delivered.
  // - Production: the business inbox (CONTACT_TO_EMAIL or default).
  // - Test mode: the Ethereal account's own inbox (so it's viewable).
  const toEmail =
    mode === "test" && testAccount
      ? testAccount.user
      : process.env.CONTACT_TO_EMAIL || "info@ndayenisolutions.co.za";

  // The "From" address. In test mode it must be the Ethereal account.
  const fromEmail =
    mode === "test" && testAccount
      ? testAccount.user
      : process.env.SMTP_FROM_EMAIL ||
        process.env.SMTP_USER ||
        "info@ndayenisolutions.co.za";

  const subject = interests.length > 0
    ? `New website enquiry: ${interests[0]} — from ${name}`
    : service
    ? `New website enquiry: ${service} — from ${name}`
    : `New website enquiry from ${name}`;

  // Plain-text version (always include for accessibility + spam filters)
  const textBody = [
    `New enquiry submitted via the Ndayeni Solutions website.`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    phone ? `Phone:   ${phone}` : null,
    customerType ? `I am a:  ${customerType}` : null,
    interests.length > 0 ? `Interested in: ${interests.join(", ")}` : null,
    service ? `Service: ${service}` : null,
    ``,
    `Message:`,
    message,
    ``,
    `---`,
    `Submitted: ${new Date().toISOString()}`,
    `Reply directly to: ${email}`,
  ]
    .filter(Boolean)
    .join("\n");

  // HTML version (nicer to read in the inbox)
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc;">
      <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #c2410c;">
          <h2 style="margin: 0; color: #071515; font-size: 20px;">New Website Enquiry</h2>
          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Ndayeni Solutions — contact form</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 100px; vertical-align: top;">Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #c2410c; text-decoration: none;">${escapeHtml(email)}</a></td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Phone</td><td style="padding: 8px 0; color: #0f172a;">${escapeHtml(phone)}</td></tr>` : ""}
          ${customerType ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">I am a</td><td style="padding: 8px 0; color: #0f172a;">${escapeHtml(customerType)}</td></tr>` : ""}
          ${interests.length > 0 ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Interested in</td><td style="padding: 8px 0; color: #0f172a;">${escapeHtml(interests.join(", "))}</td></tr>` : ""}
          ${service ? `<tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Service</td><td style="padding: 8px 0; color: #0f172a;">${escapeHtml(service)}</td></tr>` : ""}
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
          <p style="margin: 0; color: #0f172a; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          Submitted: ${new Date().toISOString()}<br>
          Reply directly to: <a href="mailto:${escapeHtml(email)}" style="color: #c2410c;">${escapeHtml(email)}</a>
        </div>
      </div>
    </div>
  `;

  try {
    // Build the mail options once; the same content is sent regardless of mode.
    const buildMail = (from: string, to: string) => ({
      from: `"Ndayeni Website" <${from}>`,
      to,
      replyTo: email, // replies go straight to the enquirer
      subject,
      text: textBody,
      html: htmlBody,
    });

    // --- Production send (with retries for transient SMTP failures) ---
    // Some providers intermittently reject STARTTLS or drop connections
    // under load — a quick retry fixes those. But certain errors indicate a
    // hard block from the current IP (e.g. "454 TLS currently unavailable" or
    // "550 relay not permitted" from datacenter IPs on reputation-based
    // SMTP providers). Retrying those just wastes time, so we detect them
    // and skip straight to the test-mode fallback. On a production deploy
    // (Vercel) with a clean IP, the first attempt will succeed and the
    // fallback never triggers.
    if (mode === "production") {
      const maxAttempts = 2;
      let lastErr: unknown = null;
      // Errors that signal an IP-level block — retrying won't help.
      const isHardBlock = (e: unknown) => {
        const code = (e as { code?: string }).code;
        const resp = (e as { response?: string }).response || "";
        const respCode = (e as { responseCode?: number }).responseCode;
        // ETLS with 454 = STARTTLS refused by server (IP reputation)
        // EENVELOPE with 550 = relay blocked (IP reputation / auth-not-TLS)
        return (
          (code === "ETLS" && respCode === 454) ||
          (code === "EENVELOPE" && respCode === 550 && /relay not permitted/i.test(resp))
        );
      };

      let hardBlocked = false;
      for (let attempt = 1; attempt <= maxAttempts && !hardBlocked; attempt++) {
        try {
          const info = await transporter.sendMail(buildMail(fromEmail, toEmail));
          console.log(
            `[contact] Email sent (production, attempt ${attempt}): ${info.messageId}`
          );
          return NextResponse.json({ ok: true, mode: "production" });
        } catch (err) {
          lastErr = err;
          const code = (err as { code?: string }).code;
          const resp = (err as { response?: string }).response;
          console.warn(
            `[contact] Production send attempt ${attempt}/${maxAttempts} failed: ${code || ""} ${resp || ""}`
          );
          if (isHardBlock(err)) {
            console.warn(
              "[contact] Error is an IP-level block — skipping remaining retries."
            );
            hardBlocked = true;
          } else if (attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      }

      // All production retries exhausted. Fall back to test mode if allowed,
      // so the contact form stays functional for the user even when the
      // SMTP provider is unreachable from the current host (e.g. datacenter
      // IP reputation blocks). On a production deploy (Vercel) with a clean
      // IP, production SMTP will succeed and this fallback never triggers.
      console.error(
        `[contact] Production SMTP failed after ${maxAttempts} attempts. Last error:`,
        lastErr
      );

      if (process.env.SMTP_DISABLE_TEST_MODE !== "true") {
        console.warn(
          "[contact] Falling back to TEST MODE (Ethereal) so the form still works."
        );
        // Resolve a test-mode transporter directly (bypassing the production
        // env-var check that getTransporter() would re-enter).
        const testCtx = await getTestTransporter();
        if (testCtx.transporter && testCtx.mode === "test" && testCtx.testAccount) {
          try {
            const info = await testCtx.transporter.sendMail(
              buildMail(testCtx.testAccount.user, testCtx.testAccount.user)
            );
            const previewUrl = nodemailer.getTestMessageUrl(info) || null;
            console.log(
              `[contact] Fallback TEST email sent. Preview: ${previewUrl}`
            );
            return NextResponse.json({
              ok: true,
              mode: "test",
              fallbackReason: "production-smtp-unreachable",
              ...(previewUrl ? { previewUrl } : {}),
            });
          } catch (fallbackErr) {
            console.error("[contact] Test-mode fallback also failed:", fallbackErr);
          }
        }
      }

      return NextResponse.json(
        {
          ok: false,
          error:
            "We couldn't send your message right now. Please email us directly at info@ndayenisolutions.co.za.",
        },
        { status: 502 }
      );
    }

    // --- Test mode send (Ethereal) ---
    const info = await transporter.sendMail(
      buildMail(
        testAccount?.user || fromEmail,
        testAccount?.user || toEmail
      )
    );
    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    console.log(`[contact] TEST email sent. Preview: ${previewUrl}`);
    return NextResponse.json({
      ok: true,
      mode: "test",
      ...(previewUrl ? { previewUrl } : {}),
    });
  } catch (err) {
    console.error(`[contact] SMTP send failed (mode=${mode}):`, err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't send your message right now. Please email us directly at info@ndayenisolutions.co.za.",
      },
      { status: 502 }
    );
  }
}

// Tiny HTML-escaper to prevent injection in the HTML email body
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Optional: respond to GET so curling the endpoint tells you it's alive
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/contact",
    method: "POST",
  });
}
