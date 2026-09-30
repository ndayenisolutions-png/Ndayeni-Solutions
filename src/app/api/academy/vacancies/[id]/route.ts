import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import type { SessionPayload } from "@/lib/academy-auth";

export const dynamic = "force-dynamic";

// ─── Helpers (mirror the patterns in /vacancies/route.ts) ───

function canManage(session: SessionPayload | null): boolean {
  if (!session) return false;
  return ["super", "admin", "admissions", "training"].includes(session.role);
}

function sanitize(s: unknown, maxLen = 5000): string | null {
  if (typeof s !== "string" || !s) return null;
  const cleaned = s.trim().replace(/[\x00-\x1F\x7F]/g, "").slice(0, maxLen);
  return cleaned || null;
}

function parseDate(input: unknown): Date | null {
  if (typeof input !== "string" || !input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

const VALID_EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "internship"];

// ─── GET: public single-vacancy detail ───
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSession(req);
  const adminMode = canManage(session);

  const vacancy = await db.vacancy.findUnique({ where: { id } });
  if (!vacancy) {
    return NextResponse.json({ ok: false, error: "Vacancy not found." }, { status: 404 });
  }

  // Public viewers can only see active + non-expired vacancies.
  const isExpired = vacancy.closingDate.getTime() < Date.now();
  const isVisibleToPublic = vacancy.status === "active" && !isExpired;
  if (!isVisibleToPublic && !adminMode) {
    // 404 (not 403) — don't leak existence of draft/expired vacancies.
    return NextResponse.json({ ok: false, error: "Vacancy not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, vacancy });
}

// ─── PUT: admin-only — update an existing vacancy ───
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }
  if (!canManage(session)) {
    return NextResponse.json({ ok: false, error: "Your role cannot manage vacancies." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await db.vacancy.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Vacancy not found." }, { status: 404 });
  }

  const body = await req.json();
  const updateData: Record<string, unknown> = {};

  // Only update fields that are explicitly provided (partial update).
  if (body.title !== undefined) {
    const v = sanitize(body.title, 200);
    if (!v || v.length < 3) {
      return NextResponse.json({ ok: false, error: "Job title must be at least 3 characters." }, { status: 422 });
    }
    updateData.title = v;
  }
  if (body.department !== undefined) {
    const v = sanitize(body.department, 100);
    if (!v) return NextResponse.json({ ok: false, error: "Department is required." }, { status: 422 });
    updateData.department = v;
  }
  if (body.location !== undefined) {
    const v = sanitize(body.location, 200);
    if (!v) return NextResponse.json({ ok: false, error: "Location is required." }, { status: 422 });
    updateData.location = v;
  }
  if (body.employmentType !== undefined) {
    const v = sanitize(body.employmentType, 30);
    if (!v || !VALID_EMPLOYMENT_TYPES.includes(v)) {
      return NextResponse.json({ ok: false, error: "Invalid employment type." }, { status: 422 });
    }
    updateData.employmentType = v;
  }
  if (body.description !== undefined) {
    const v = sanitize(body.description, 5000);
    if (!v || v.length < 20) {
      return NextResponse.json({ ok: false, error: "Description must be at least 20 characters." }, { status: 422 });
    }
    updateData.description = v;
  }
  if (body.responsibilities !== undefined) updateData.responsibilities = sanitize(body.responsibilities, 5000);
  if (body.requirements !== undefined) updateData.requirements = sanitize(body.requirements, 5000);
  if (body.benefits !== undefined) updateData.benefits = sanitize(body.benefits, 5000);
  if (body.howToApply !== undefined) {
    const v = sanitize(body.howToApply, 500);
    if (!v) return NextResponse.json({ ok: false, error: "How to apply is required." }, { status: 422 });
    updateData.howToApply = v;
  }
  if (body.closingDate !== undefined) {
    const d = parseDate(body.closingDate);
    if (!d) return NextResponse.json({ ok: false, error: "Invalid closing date." }, { status: 422 });
    updateData.closingDate = d;
  }
  if (body.status !== undefined) {
    updateData.status = body.status === "active" ? "active" : "draft";
  }

  const vacancy = await db.vacancy.update({
    where: { id },
    data: updateData,
  });

  await db.auditLog.create({
    data: {
      userId: session.userId,
      action: "vacancy.update",
      details: `Updated vacancy "${vacancy.title}" (id=${id}). Fields changed: ${Object.keys(updateData).join(", ") || "none"}`,
    },
  });

  return NextResponse.json({ ok: true, vacancy });
}

// ─── DELETE: admin-only — permanently delete a vacancy ───
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }
  if (!canManage(session)) {
    return NextResponse.json({ ok: false, error: "Your role cannot manage vacancies." }, { status: 403 });
  }

  const { id } = await params;
  const existing = await db.vacancy.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Vacancy not found." }, { status: 404 });
  }

  await db.vacancy.delete({ where: { id } });

  await db.auditLog.create({
    data: {
      userId: session.userId,
      action: "vacancy.delete",
      details: `Deleted vacancy "${existing.title}" (id=${id})`,
    },
  });

  return NextResponse.json({ ok: true });
}
