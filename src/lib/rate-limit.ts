// ─────────────────────────────────────────────────────────────────
// In-memory sliding-window rate limiter
// ─────────────────────────────────────────────────────────────────
//
// WHY IN-MEMORY (not Redis / database)?
//   - No external service dependency — works on Vercel out of the box.
//   - Vercel serverless functions are short-lived, so per-instance memory is
//     reset frequently — meaning a determined attacker COULD eventually
//     exhaust the limit by hitting different instances. That's an acceptable
//     trade-off for blocking the obvious abuse (script kiddies, credential
//     stuffing bots, spam form submissions). For higher-stakes protection,
//     consider Upstash Redis (rate-limiting-by-key) — but this is enough
//     for POPIA / Cybercrimes Act "appropriate technical measures".
//
// HOW IT WORKS:
//   - Each call to `checkRateLimit(key, limit, windowMs)` returns
//     { ok: true } OR { ok: false, retryAfterSeconds }.
//   - Internally tracks request timestamps per key in a Map.
//   - Old timestamps outside the window are pruned automatically.
//   - The Map is shared across all calls in the same function instance.

type RateLimitEntry = { timestamps: number[] };
const rateLimitStore = new Map<string, RateLimitEntry>();

// Prune entries older than the window from a key's history.
function pruneOldTimestamps(key: string, windowMs: number): void {
  const entry = rateLimitStore.get(key);
  if (!entry) return;
  const cutoff = Date.now() - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
  if (entry.timestamps.length === 0) {
    rateLimitStore.delete(key);
  }
}

// Periodic cleanup of stale keys to prevent memory growth.
// Runs every call but only does work when the store is large.
const MAX_STORE_SIZE = 10000;
function maybeCleanupStore(): void {
  if (rateLimitStore.size < MAX_STORE_SIZE) return;
  // Drop oldest 50% of entries (simple eviction — sufficient for our volume).
  const keys = Array.from(rateLimitStore.keys());
  for (let i = 0; i < keys.length / 2; i++) {
    rateLimitStore.delete(keys[i]);
  }
}

/**
 * Check whether a request is within its rate limit.
 *
 * @param key     Unique identifier for the rate-limit bucket (e.g. `login:192.168.1.1` or `apply:email@example.com`)
 * @param limit   Maximum number of requests allowed in the window
 * @param windowMs  Window size in milliseconds (e.g. 15 * 60 * 1000 for 15 minutes)
 * @returns       `{ ok: true }` if allowed, OR `{ ok: false, retryAfterSeconds }` if rate-limited
 *
 * Side-effect: records the current timestamp in the bucket if allowed.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSeconds: number } {
  maybeCleanupStore();
  pruneOldTimestamps(key, windowMs);

  const entry = rateLimitStore.get(key) ?? { timestamps: [] };
  if (entry.timestamps.length >= limit) {
    // Find the oldest timestamp still in the window — that's when the limit will reset.
    const oldest = Math.min(...entry.timestamps);
    const retryAfterMs = oldest + windowMs - Date.now();
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return { ok: false, retryAfterSeconds };
  }

  // Allowed — record this request.
  entry.timestamps.push(Date.now());
  rateLimitStore.set(key, entry);
  return { ok: true };
}

/**
 * Peek at the rate-limit state WITHOUT recording a hit.
 * Use this when you need to check if an action is allowed but only want to
 * record the hit conditionally (e.g. failed login lockout — check first,
 * record only if the password is actually wrong).
 */
export function peekRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSeconds: number } {
  maybeCleanupStore();
  pruneOldTimestamps(key, windowMs);

  const entry = rateLimitStore.get(key);
  if (!entry || entry.timestamps.length < limit) {
    return { ok: true };
  }

  const oldest = Math.min(...entry.timestamps);
  const retryAfterMs = oldest + windowMs - Date.now();
  const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return { ok: false, retryAfterSeconds };
}

/**
 * Record a rate-limit hit without checking. Use this for actions that should
 * count toward a limit only on failure (e.g. failed logins).
 */
export function recordRateLimitHit(key: string, windowMs: number): void {
  maybeCleanupStore();
  pruneOldTimestamps(key, windowMs);

  const entry = rateLimitStore.get(key) ?? { timestamps: [] };
  entry.timestamps.push(Date.now());
  rateLimitStore.set(key, entry);
}

/**
 * Helper: extract the client IP from a Next.js request.
 * Checks X-Forwarded-For first (Vercel always sets this), falls back to X-Real-IP.
 * Returns 'unknown' if neither is present (shouldn't happen on Vercel).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // X-Forwarded-For can be a comma-separated list (client, proxy1, proxy2).
    // The first entry is the original client IP.
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

// ─── Preset rate-limit configurations (used across the API) ───
//
// These limits balance "block obvious abuse" with "don't lock out legitimate
// users on flaky connections". They're deliberately generous for the admin
// login (real users mistype passwords) and tighter for public forms (spam).

export const RATE_LIMITS = {
  // Admin login: 5 attempts per 15 minutes per IP.
  // Allows for a few mistyped passwords but blocks brute force.
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  // Forgot password: 3 requests per hour per IP.
  // Prevents email enumeration (testing which emails exist in the system).
  forgotPassword: { limit: 3, windowMs: 60 * 60 * 1000 },
  // Reset password: 5 attempts per hour per IP.
  resetPassword: { limit: 5, windowMs: 60 * 60 * 1000 },
  // Public apply form: 3 applications per hour per IP.
  apply: { limit: 3, windowMs: 60 * 60 * 1000 },
  // Public contact form: 5 messages per hour per IP.
  contact: { limit: 5, windowMs: 60 * 60 * 1000 },
  // Public vacancies list: 60 reads per minute per IP.
  vacanciesRead: { limit: 60, windowMs: 60 * 1000 },
  // Account lockout: 5 failed logins per email per 15 minutes.
  failedLogin: { limit: 5, windowMs: 15 * 60 * 1000 },
} as const;

/**
 * Helper: build a rate-limit response with the standard headers + body.
 */
export function rateLimitedResponse(retryAfterSeconds: number, action: string): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      error: `Too many ${action} attempts. Please try again in ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}.`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
