import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  createSessionToken,
  sessionCookieHeader,
} from "@/lib/academy-auth";
import {
  checkRateLimit,
  peekRateLimit,
  recordRateLimitHit,
  getClientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // ── RATE LIMITING — 5 attempts per 15 min per IP ──
  // Blocks brute-force credential stuffing attacks. Required by Cybercrimes Act
  // 19 of 2020 + POPIA "appropriate technical measures" against unauthorised access.
  // checkRateLimit records a hit on success — so it counts ALL attempts (success + fail).
  const ip = getClientIp(req);
  const ipLimit = checkRateLimit(`login:${ip}`, RATE_LIMITS.login.limit, RATE_LIMITS.login.windowMs);
  if (!ipLimit.ok) {
    return rateLimitedResponse(ipLimit.retryAfterSeconds, "login");
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password required." },
        { status: 422 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── ACCOUNT LOCKOUT CHECK — peek at failed-attempt counter (don't record) ──
    // Even if an attacker rotates IPs, they can't brute-force a single account
    // because the per-email limit fires first.
    const emailLockout = peekRateLimit(
      `login-failed:${normalizedEmail}`,
      RATE_LIMITS.failedLogin.limit,
      RATE_LIMITS.failedLogin.windowMs
    );
    if (!emailLockout.ok) {
      // Log the lockout event to the audit trail (no userId since they're not authenticated).
      await db.auditLog.create({
        data: {
          userId: null,
          action: "login.locked_out",
          details: `Account lockout triggered for ${normalizedEmail} from IP ${ip} — too many failed attempts`,
        },
      }).catch(() => undefined); // Don't fail the request if audit log write fails.
      return rateLimitedResponse(emailLockout.retryAfterSeconds, "login");
    }

    const user = await db.academyUser.findUnique({
      where: { email: normalizedEmail },
    });

    // Use constant-time password verification (via verifyPassword).
    // Note: verifyPassword is now ASYNC (uses non-blocking pbkdf2).
    const passwordValid = user ? await verifyPassword(password, user.passwordHash) : false;

    if (!user || !passwordValid) {
      // ── RECORD FAILED LOGIN (counts toward the lockout counter) ──
      recordRateLimitHit(
        `login-failed:${normalizedEmail}`,
        RATE_LIMITS.failedLogin.windowMs
      );

      // ── FAILED LOGIN LOGGING ──
      // Record the failure for security monitoring + audit trail.
      // The user.id is null because we don't know if the email exists —
      // the audit trail records the email in details for forensic review.
      await db.auditLog.create({
        data: {
          userId: user?.id ?? null,
          action: "login.failed",
          details: `Failed login attempt for ${normalizedEmail} from IP ${ip}`,
        },
      }).catch(() => undefined);

      // Same error message whether the email exists or not — prevents email
      // enumeration (an attacker can't tell which emails are registered).
      return NextResponse.json(
        { ok: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Check if the user account is active
    if (!user.active) {
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: "login.inactive_account",
          details: `Login attempt for inactive account ${user.email} from IP ${ip}`,
        },
      }).catch(() => undefined);
      return NextResponse.json(
        { ok: false, error: "This account has been deactivated. Contact your administrator." },
        { status: 403 }
      );
    }

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // ── SUCCESSFUL LOGIN LOGGING ──
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "login.success",
        details: `Successful login for ${user.email} from IP ${ip}`,
      },
    }).catch(() => undefined);

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    res.headers.set("Set-Cookie", sessionCookieHeader(token));
    return res;
  } catch (err) {
    console.error("[academy/login] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Authentication error. Please try again." }, // Generic message — don't leak internal details
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ endpoint: "/api/academy/login", method: "POST" });
}
