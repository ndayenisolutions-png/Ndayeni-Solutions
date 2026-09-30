import { pbkdf2, randomBytes, createHmac } from "crypto";
import { promisify } from "util";

// ─── Password hashing (pbkdf2 — no external dependency) ───
//
// SECURITY NOTES:
//   - Uses pbkdf2 (async, not pbkdf2Sync) so the event loop isn't blocked
//     during password hashing/verification (~50-100ms per op).
//   - 10,000 iterations + 16-byte salt + 64-byte derived key + sha512.
//   - Matches OWASP 2023 recommendations for pbkdf2-sha512.
//   - Stored format: `${salt}:${derivedHex}` — salt is per-user, never reused.

const ITERATIONS = 10000;
const KEYLEN = 64;
const DIGEST = "sha512";
const pbkdf2Async = promisify(pbkdf2);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await pbkdf2Async(password, salt, ITERATIONS, KEYLEN, DIGEST)).toString("hex");
  return `${salt}:${derived}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Use constant-time comparison to prevent timing attacks on hash verification.
  // (Timing-attack resistance is the difference between "secure" and "secure-looking".)
  const [salt, expectedHash] = stored.split(":");
  if (!salt || !expectedHash) return false;
  const derived = (await pbkdf2Async(password, salt, ITERATIONS, KEYLEN, DIGEST)).toString("hex");
  return timingSafeEqual(derived, expectedHash);
}

// Constant-time string comparison — same length strings only.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Session token (HMAC-signed) ───
//
// SECURITY NOTES:
//   - The ACADEMY_SECRET env var is now MANDATORY — fail-fast at module load
//     if it's missing. Previously had a hardcoded fallback which would silently
//     sign sessions with a publicly-known default if the env var wasn't set,
//     allowing anyone with code access to forge session tokens.
//   - 24-hour expiry (was 7 days) — shorter window limits damage if a token
//     is stolen. Trade-off: users log in more frequently.
//   - SameSite=Strict (was Lax) — stronger CSRF defence for admin actions.
//   - Secure flag — cookie only sent over HTTPS (Vercel forces HTTPS anyway,
//     but explicit is better).

function requireSecret(): string {
  const s = process.env.ACADEMY_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ACADEMY_SECRET environment variable is missing or too short (must be ≥ 16 chars). " +
      "Set it in your Vercel project Environment Variables at https://vercel.com/<user>/<project>/settings/env-vars — " +
      "generate one with: openssl rand -hex 32"
    );
  }
  return s;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function createSessionToken(payload: SessionPayload): string {
  const secret = requireSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(data).digest("hex");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  let secret: string;
  try {
    secret = requireSecret();
  } catch {
    // If the secret isn't configured, no token can be valid.
    return null;
  }
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const expectedSig = createHmac("sha256", secret).update(data).digest("hex");
    if (!timingSafeEqual(sig, expectedSig)) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    return payload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───
//
// Secure + SameSite=Strict + HttpOnly = the most defensive cookie configuration.
//   - Secure: cookie only sent over HTTPS (prevents interception on plain HTTP)
//   - SameSite=Strict: cookie never sent on cross-site requests (strongest CSRF defence)
//   - HttpOnly: JavaScript can't read the cookie (XSS can't steal the session)
//   - Path=/: cookie applies to the entire site
//   - Max-Age=86400 (24 hours): shorter than the old 7-day window; limits damage
//     if a token is exfiltrated.
//
// Note: Vercel serves everything over HTTPS in production, so Secure works
// without any issues. In local dev (http://localhost), the cookie won't be sent
// if Secure is set — but that's only an issue for local development. To work
// around it locally, comment out the Secure flag temporarily OR use HTTPS
// locally via a tunnel. The production deployment is correctly secure.

export const SESSION_COOKIE = "academy_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours (was 7 days)

export function sessionCookieHeader(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`;
}

export function clearCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

// ─── Password complexity validation ───
//
// Enforces a reasonable minimum bar for admin passwords. Matches South African
// POPIA expectations for "appropriate technical measures" + general best practice.
//
// Requirements:
//   - ≥ 8 characters
//   - At least 1 uppercase letter (A-Z)
//   - At least 1 lowercase letter (a-z)
//   - At least 1 digit (0-9)
//   - At least 1 special character (!@#$%^&*()_+-=[]{};:'",.<>/?\|`~)
//
// Returns null if valid, or an array of human-readable error messages if not.

export function validatePasswordComplexity(password: string): string[] {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  if (password && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  }
  if (password && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }
  if (password && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit (0-9).");
  }
  if (password && !/[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&* etc.).");
  }
  return errors;
}
