import { pbkdf2Sync, randomBytes, createHmac } from "crypto";

// ─── Password hashing (pbkdf2 — no external dependency) ───

const ITERATIONS = 10000;
const KEYLEN = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expectedHash] = stored.split(":");
  if (!salt || !expectedHash) return false;
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
  return derived === expectedHash;
}

// ─── Session token (simple HMAC-signed) ───

const SECRET = process.env.ACADEMY_SECRET || "ndayeni-academy-secret-2024";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function createSessionToken(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(data).digest("hex");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const expectedSig = createHmac("sha256", SECRET).update(data).digest("hex");
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    return payload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───

export const SESSION_COOKIE = "academy_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function sessionCookieHeader(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function clearCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
