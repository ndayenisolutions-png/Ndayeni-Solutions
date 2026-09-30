import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import type { SessionPayload } from "@/lib/academy-auth";

export const dynamic = "force-dynamic";

// ─── Helpers ───

/** Roles that can create/edit/delete vacancies (mirrors the existing student role gating). */
function canManage(session: SessionPayload | null): boolean {
  if (!session) return false;
  return ["super", "admin", "admissions", "training"].includes(session.role);
}

/** Sanitise a string: trim, remove control chars, cap length (matches apply/route.ts pattern). */
function sanitize(s: unknown, maxLen = 5000): string | null {
  if (typeof s !== "string" || !s) return null;
  const cleaned = s.trim().replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen);
  return cleaned || null;
}

/** Parse a YYYY-MM-DD string into a Date at start-of-day UTC. Returns null if invalid. */
function parseDate(input: unknown): Date | null {
  if (typeof input !== "string" || !input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/** Allowed employment types — enforced server-side, not just in the UI. */
const VALID_EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "internship"];

// ─── GET: public list (active vacancies whose closing date hasn't passed) ───
// Query params:
//   ?admin=true  → returns ALL vacancies (incl. drafts + expired) — admin only
//   ?id=<id>     → returns a single active vacancy (for the detail page)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminMode = searchParams.get("admin") === "true";
  const id = searchParams.get("id");

  // ── Single-vacancy detail lookup (public — only active + not expired) ──
  if (id) {
    const vacancy = await db.vacancy.findUnique({ where: { id } });
    if (!vacancy) {
      return NextResponse.json({ ok: false, error: "Vacancy not found." }, { status: 404 });
    }
    // Public viewers can only see active vacancies whose closing date hasn't passed.
    const session = getSession(req);
    const isAdminView = adminMode && canManage(session);
    const isExpired = vacancy.closingDate.getTime() < Date.now();
    const isVisibleToPublic = vacancy.status === "active" && !isExpired;
    if (!isVisibleToPublic && !isAdminView) {
      // Return 404 (not 403) so the existence of draft/expired vacancies isn't leaked.
      return NextResponse.json({ ok: false, error: "Vacancy not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, vacancy });
  }

  // ── Admin list (all vacancies incl. drafts + expired) ──
  if (adminMode) {
    const session = getSession(req);
    if (!canManage(session)) {
      return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
    }
    const vacancies = await db.vacancy.findMany({
      orderBy: [{ status: "asc" }, { closingDate: "asc" }],
    });
    return NextResponse.json({ ok: true, vacancies });
  }

  // ── Public list (only active + not expired, sorted by closing date ASC) ──
  const now = new Date();
  const vacancies = await db.vacancy.findMany({
    where: {
      status: "active",
      closingDate: { gte: now },
    },
    orderBy: { closingDate: "asc" },
    // Don't leak the long-form fields in the list view — those are fetched on the detail page.
    select: {
      id: true,
      title: true,
      department: true,
      location: true,
      employmentType: true,
      description: true,
      closingDate: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, vacancies });
}

// ─── POST: admin-only — create a new vacancy ───
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }
  if (!canManage(session)) {
    return NextResponse.json({ ok: false, error: "Your role cannot manage vacancies." }, { status: 403 });
  }

  const body = await req.json();
  const title = sanitize(body.title, 200);
  const department = sanitize(body.department, 100);
  const location = sanitize(body.location, 200);
  const employmentType = sanitize(body.employmentType, 30);
  const description = sanitize(body.description, 5000);
  const responsibilities = sanitize(body.responsibilities, 5000);
  const requirements = sanitize(body.requirements, 5000);
  const benefits = sanitize(body.benefits, 5000);
  const howToApply = sanitize(body.howToApply, 500);
  const closingDate = parseDate(body.closingDate);
  const status = body.status === "active" ? "active" : "draft"; // default to draft

  // ── Server-side validation ──
  const errors: string[] = [];
  if (!title || title.length < 3) errors.push("Job title must be at least 3 characters.");
  if (!department) errors.push("Department is required.");
  if (!location) errors.push("Location is required.");
  if (!employmentType || !VALID_EMPLOYMENT_TYPES.includes(employmentType)) {
    errors.push("Employment type must be one of: full-time, part-time, contract, internship.");
  }
  if (!description || description.length < 20) {
    errors.push("Description must be at least 20 characters.");
  }
  if (!howToApply) errors.push("How to apply is required (email address or instructions).");
  if (!closingDate) errors.push("A valid closing date is required (YYYY-MM-DD).");
  else if (closingDate.getTime() < Date.now()) {
    errors.push("Closing date must be in the future.");
  }
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const vacancy = await db.vacancy.create({
    data: {
      title: title!,
      department: department!,
      location: location!,
      employmentType: employmentType!,
      description: description!,
      responsibilities,
      requirements,
      benefits,
      howToApply: howToApply!,
      closingDate: closingDate!,
      status,
    },
  });

  await db.auditLog.create({
    data: {
      userId: session.userId,
      action: "vacancy.create",
      details: `Created vacancy "${vacancy.title}" (${vacancy.employmentType}) in ${vacancy.department} — closing ${vacancy.closingDate.toISOString().slice(0, 10)}`,
    },
  });

  return NextResponse.json({ ok: true, vacancy });
}
