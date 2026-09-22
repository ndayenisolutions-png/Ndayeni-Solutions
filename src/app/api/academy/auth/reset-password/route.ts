import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/academy-auth";

// Force dynamic — never cache this route.
export const dynamic = "force-dynamic";

// Same secret academy-auth.ts uses for session tokens.
const SECRET = process.env.ACADEMY_SECRET || "ndayeni-academy-secret-2024";

interface ResetPayload {
  userId: string;
  expiresAt: number;
}

// ─── Token verification ───────────────────────────────────────────────
// Exported for the forgot-password PAGE (separate frontend task) to call
// from its GET endpoint so the page can decide whether to render the
// reset form or an "invalid/expired" notice before the user even types.
//
// Verifies:
//   1. Token is well-formed (<base64url(json)>.<hmac>).
//   2. HMAC signature matches what we'd compute (no tampering).
//   3. Payload parses to { userId, expiresAt }.
//   4. expiresAt is in the future.
//
// Returns { userId } on success, or null on ANY failure — the caller
// can't distinguish "bad signature" from "expired" from "malformed",
// which is the desired security posture.
export function verifyResetToken(token: string): { userId: string } | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expectedSig = createHmac("sha256", SECRET).update(data).digest("hex");
    if (sig !== expectedSig) return null;

    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString()
    ) as Partial<ResetPayload>;

    if (
      typeof payload.userId !== "string" ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }

    if (payload.expiresAt < Date.now()) return null;

    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// Shared "bad token" response — same status + body for every failure mode,
// so an attacker can't tell signature-mismatch from expiry from no-user.
function invalidTokenResponse() {
  return NextResponse.json(
    { ok: false, error: "Invalid or expired reset link." },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  // ─── Parse body ───
  let token: string;
  let password: string;
  try {
    const body = await req.json();
    token = typeof body?.token === "string" ? body.token : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // ─── Validate the new password ───
  if (!password || password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters." },
      { status: 422 }
    );
  }

  // ─── Verify the token (signature + expiry) ───
  const verified = verifyResetToken(token);
  if (!verified) return invalidTokenResponse();

  try {
    // ─── Look up the user; reject inactive accounts silently ───
    const user = await db.academyUser.findUnique({
      where: { id: verified.userId },
      select: { id: true, active: true },
    });

    if (!user || !user.active) return invalidTokenResponse();

    // ─── Hash + persist the new password ───
    const passwordHash = hashPassword(password);
    await db.academyUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // ─── Audit log ───
    try {
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: "user.password_reset",
          details: "User reset their password via email link",
        },
      });
    } catch (err) {
      // Non-fatal — the password is already updated. Don't roll back.
      console.error("[academy/reset-password] Failed to write AuditLog:", err);
    }

    return NextResponse.json({
      ok: true,
      message: "Your password has been reset. You can now log in.",
    });
  } catch (err) {
    console.error("[academy/reset-password] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/academy/auth/reset-password",
    method: "POST",
  });
}
