import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/academy-auth";
import type { SessionPayload } from "@/lib/academy-auth";

/** Extracts and verifies the session from the request cookie. Returns null if not authenticated. */
export function getSession(req: NextRequest): SessionPayload | null {
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  return verifySessionToken(cookie);
}
