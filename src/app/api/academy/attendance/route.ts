import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import type { SessionPayload } from "@/lib/academy-auth";

export const dynamic = "force-dynamic";

/** Roles that can write attendance */
function canWrite(session: SessionPayload | null): boolean {
  if (!session) return false;
  return ["super", "admin", "training"].includes(session.role);
}

// ─── GET — list attendance for a student (?studentId=X) or by date (?date=YYYY-MM-DD) ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  // Build a where clause
  const where: Record<string, unknown> = {};
  if (studentId) where.studentId = studentId;
  if (date) {
    // Date is stored as DateTime; treat it as a day range (UTC)
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    where.date = { gte: start, lte: end };
  }

  const records = await db.attendance.findMany({
    where,
    orderBy: { date: "desc" },
    include: { student: { select: { id: true, fullName: true, studentNumber: true, email: true } } },
  });

  return NextResponse.json({ ok: true, attendance: records });
}

// ─── POST — create or update an attendance record ───
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  if (!canWrite(session)) {
    return NextResponse.json({ ok: false, error: "Only super/admin/training roles can manage attendance." }, { status: 403 });
  }

  const body = await req.json();
  const { studentId, date, status, notes } = body;

  if (!studentId || !date || !status) {
    return NextResponse.json(
      { ok: false, error: "studentId, date and status are required." },
      { status: 422 }
    );
  }

  // Validate status enum (present | absent | excused)
  const validStatuses = ["present", "absent", "excused"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ ok: false, error: `status must be one of: ${validStatuses.join(", ")}.` }, { status: 422 });
  }

  // Confirm the student exists
  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });

  // Parse date as the start of the day (UTC) for matching
  const dateObj = new Date(`${date}T00:00:00.000Z`);

  // Upsert: if a record already exists for this student+date, update it; otherwise create
  // (Attendance has no unique constraint on (studentId, date), so we check manually)
  const existing = await db.attendance.findFirst({
    where: {
      studentId,
      date: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lte: new Date(`${date}T23:59:59.999Z`),
      },
    },
  });

  let record;
  if (existing) {
    record = await db.attendance.update({
      where: { id: existing.id },
      data: { status, notes: notes ?? null, date: dateObj },
    });
  } else {
    record = await db.attendance.create({
      data: { studentId, date: dateObj, status, notes: notes ?? null },
    });
  }

  return NextResponse.json({ ok: true, attendance: record });
}
