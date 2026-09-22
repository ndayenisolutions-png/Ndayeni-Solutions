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
  const { action, studentId, date, status, notes } = body;

  // ── bulk attendance capture (action: "bulk") ──
  if (action === "bulk") {
    const bulkDate = body.date;
    const records = body.records;

    // Validate date: must be a parseable YYYY-MM-DD string
    if (
      typeof bulkDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(bulkDate) ||
      Number.isNaN(new Date(bulkDate).getTime())
    ) {
      return NextResponse.json(
        { ok: false, error: "A valid date (YYYY-MM-DD) is required." },
        { status: 422 }
      );
    }

    // Validate records is a non-empty array (max 200)
    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { ok: false, error: "records must be a non-empty array." },
        { status: 422 }
      );
    }
    if (records.length > 200) {
      return NextResponse.json(
        { ok: false, error: "records cannot exceed 200 entries." },
        { status: 422 }
      );
    }

    const validStatuses = ["present", "absent", "excused"];
    const skipped: Array<{ studentId: string | null; reason: string }> = [];
    const valid: Array<{ studentId: string; status: string; notes: string | null }> = [];

    // Validate each record's studentId + status (skip + collect reasons)
    for (const r of records) {
      if (!r || typeof r.studentId !== "string" || !r.studentId) {
        skipped.push({ studentId: null, reason: "studentId is required." });
        continue;
      }
      if (typeof r.status !== "string" || !validStatuses.includes(r.status)) {
        skipped.push({
          studentId: r.studentId,
          reason: `status must be one of: ${validStatuses.join(", ")}.`,
        });
        continue;
      }
      valid.push({
        studentId: r.studentId,
        status: r.status,
        notes: typeof r.notes === "string" ? r.notes : null,
      });
    }

    // Fetch all valid student IDs in one shot to validate existence
    const validIds = valid.map((v) => v.studentId);
    const existingStudents =
      validIds.length > 0
        ? await db.student.findMany({ where: { id: { in: validIds } }, select: { id: true } })
        : [];
    const existingIdsSet = new Set(existingStudents.map((s) => s.id));

    // Split valid records into upserts vs skips (missing students)
    const toUpsert: typeof valid = [];
    for (const v of valid) {
      if (!existingIdsSet.has(v.studentId)) {
        skipped.push({ studentId: v.studentId, reason: "Student not found." });
      } else {
        toUpsert.push(v);
      }
    }

    // Atomic bulk upsert within a transaction
    let savedCount = 0;
    let present = 0;
    let absent = 0;
    let excused = 0;
    const dayStart = new Date(`${bulkDate}T00:00:00.000Z`);
    const dayEnd = new Date(`${bulkDate}T23:59:59.999Z`);

    if (toUpsert.length > 0) {
      await db.$transaction(async (tx) => {
        // Find existing records for these students on this date (no unique constraint, so manual dedupe)
        const existing = await tx.attendance.findMany({
          where: {
            studentId: { in: toUpsert.map((v) => v.studentId) },
            date: { gte: dayStart, lte: dayEnd },
          },
        });
        const existingByStudent = new Map(existing.map((e) => [e.studentId, e.id]));

        for (const v of toUpsert) {
          const data = {
            studentId: v.studentId,
            date: dayStart,
            status: v.status,
            notes: v.notes,
          };
          const existingId = existingByStudent.get(v.studentId);
          if (existingId) {
            await tx.attendance.update({ where: { id: existingId }, data });
          } else {
            await tx.attendance.create({ data });
          }
          savedCount++;
          if (v.status === "present") present++;
          else if (v.status === "absent") absent++;
          else if (v.status === "excused") excused++;
        }

        // Single audit log entry for the whole bulk operation
        await tx.auditLog.create({
          data: {
            userId: session.userId,
            action: "attendance.bulk",
            details: `Bulk attendance for ${bulkDate}: ${savedCount} records (${present} present, ${absent} absent, ${excused} excused)`,
          },
        });
      });
    }

    return NextResponse.json({ ok: true, saved: savedCount, skipped });
  }

  // ── single-record upsert (existing behavior, unchanged) ──
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
