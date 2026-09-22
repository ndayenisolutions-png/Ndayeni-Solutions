import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import type { SessionPayload } from "@/lib/academy-auth";

export const dynamic = "force-dynamic";

// ─── Helpers ───

/** Generate a unique student number, e.g. NSA-2025-0123 */
async function generateStudentNumber(): Promise<string> {
  const year = new Date().getFullYear();
  // Count students already enrolled this year to pick a sequence number
  const countThisYear = await db.student.count({
    where: {
      studentNumber: { startsWith: `NSA-${year}-` },
    },
  });
  const seq = String(countThisYear + 1).padStart(4, "0");
  return `NSA-${year}-${seq}`;
}

/** Roles that can write student records */
function canWrite(session: SessionPayload | null): boolean {
  if (!session) return false;
  return ["super", "admin", "admissions", "training"].includes(session.role);
}

/** Convenience: write an audit log entry */
function logAudit(opts: {
  userId?: string | null;
  studentId?: string | null;
  action: string;
  details?: string;
}) {
  return db.auditLog.create({
    data: {
      userId: opts.userId ?? null,
      studentId: opts.studentId ?? null,
      action: opts.action,
      details: opts.details ?? null,
    },
  });
}

// ─── GET — single student profile (?id=X) OR list with search/filters ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const { searchParams } = new URL(req.url);

  // ── Profile detail mode: ?id=<studentId> ──
  const idParam = searchParams.get("id");
  if (idParam) {
    const student = await db.student.findUnique({
      where: { id: idParam },
      include: {
        certificates: true,
        attendances: { orderBy: { date: "desc" }, take: 50 },
        assessments: { orderBy: { date: "desc" }, take: 50 },
        auditLogs: { orderBy: { timestamp: "desc" }, take: 30 },
      },
    });

    if (!student) {
      return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });
    }

    // Fetch the course + active modules only when a course is assigned
    const course = student.courseId
      ? await db.course.findUnique({
          where: { id: student.courseId },
          include: { modules: { where: { active: true }, orderBy: { order: "asc" } } },
        })
      : null;

    // ── Computed fields (merged into a copy of the student — do NOT mutate Prisma result) ──
    const attendanceTotal = student.attendances.length;
    const attendancePresent = student.attendances.filter((a) => a.status === "present").length;
    const attendanceRate =
      attendanceTotal > 0
        ? Math.round((attendancePresent / attendanceTotal) * 1000) / 10 // 1 decimal place
        : 0;

    const assessmentTotal = student.assessments.length;
    const assessmentPass = student.assessments.filter((a) => a.result === "pass").length;
    const passRate =
      assessmentTotal > 0
        ? Math.round((assessmentPass / assessmentTotal) * 1000) / 10
        : 0;

    // Most recent active certificate's number (certificates are already included, no extra query)
    const activeCert = student.certificates
      .filter((c) => c.status === "active")
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())[0];
    const certificateNumber = activeCert?.certificateNumber ?? null;

    const enrolledDays = student.enrolledAt
      ? Math.floor((Date.now() - student.enrolledAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const expectedCompletionDays =
      student.enrolledAt && student.expectedCompletion
        ? Math.floor(
            (student.expectedCompletion.getTime() - student.enrolledAt.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

    const computed = {
      attendanceRate,
      passRate,
      certificateNumber,
      enrolledDays,
      expectedCompletionDays,
    };

    return NextResponse.json({
      ok: true,
      student: { ...student, ...computed },
      course,
    });
  }

  // ── List mode: search + filter (preserved, unchanged) ──
  const q = (searchParams.get("q") || "").trim();
  const status = searchParams.get("status");
  const courseId = searchParams.get("courseId");

  // Build the WHERE clause with Prisma
  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status;
  }
  if (courseId && courseId !== "all") {
    where.courseId = courseId;
  }
  if (q) {
    // SQLite via Prisma supports contains with insensitive mode (case-insensitive)
    where.OR = [
      { fullName: { contains: q } },
      { email: { contains: q } },
      { studentNumber: { contains: q } },
      { applicationRef: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const students = await db.student.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { certificates: true },
  });

  return NextResponse.json({ ok: true, students });
}

// ─── POST — multiple actions (create / update / delete / convert) ───
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  if (!canWrite(session)) {
    return NextResponse.json({ ok: false, error: "Your role cannot modify student records." }, { status: 403 });
  }

  const body = await req.json();
  const { action, id, ...data } = body;

  // ── create ──
  if (action === "create") {
    if (!data.fullName || !data.email || !data.program) {
      return NextResponse.json({ ok: false, error: "fullName, email and program are required." }, { status: 422 });
    }
    const status: string = data.status || "registered";
    const student = await db.student.create({
      data: {
        fullName: String(data.fullName).trim(),
        email: String(data.email).trim(),
        phone: data.phone ? String(data.phone).trim() : "",
        idNumber: data.idNumber || null,
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
        nationality: data.nationality || null,
        address: data.address || null,
        program: data.program,
        courseId: data.courseId || null,
        selectedCourses: data.selectedCourses || null,
        status,
        progress: typeof data.progress === "number" ? data.progress : 0,
        notes: data.notes || null,
        enrolledAt: status === "registered" || status === "in-progress" || status === "active" ? new Date() : null,
      },
      include: { certificates: true },
    });

    await logAudit({
      userId: session.userId,
      studentId: student.id,
      action: "student.create",
      details: `Created student ${student.fullName} (${student.email})`,
    });

    return NextResponse.json({ ok: true, student });
  }

  // ── update ──
  if (action === "update") {
    if (!id) return NextResponse.json({ ok: false, error: "Student ID required." }, { status: 422 });

    const existing = await db.student.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    const trackedFields = [
      "fullName", "email", "phone", "idNumber", "dateOfBirth", "gender", "nationality",
      "address", "program", "courseId", "selectedCourses", "preferredStartDate", "preferredMode",
      "highestEducation", "employmentStatus", "previousTraining", "relevantExperience",
      "nextOfKinName", "nextOfKinRelationship", "nextOfKinPhone", "nextOfKinEmail",
      "intake", "trainingStartDate", "expectedCompletion", "notes",
    ];
    for (const f of trackedFields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    if (data.progress !== undefined) updateData.progress = Number(data.progress);
    if (data.status !== undefined) updateData.status = data.status;

    // Status-driven timestamps
    if (data.status === "registered" || data.status === "in-progress" || data.status === "active") {
      if (!existing.enrolledAt) updateData.enrolledAt = new Date();
    }
    if (data.status === "completed") {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    const student = await db.student.update({
      where: { id },
      data: updateData,
      include: { certificates: true },
    });

    // Audit if status changed
    if (data.status && data.status !== existing.status) {
      await logAudit({
        userId: session.userId,
        studentId: id,
        action: "student.status_change",
        details: `Status changed from "${existing.status}" to "${data.status}" for ${student.fullName}`,
      });
    } else {
      // Audit general update (only log once; status change supersedes)
      await logAudit({
        userId: session.userId,
        studentId: id,
        action: "student.update",
        details: `Updated ${student.fullName} (${student.email})`,
      });
    }

    return NextResponse.json({ ok: true, student });
  }

  // ── delete ──
  if (action === "delete") {
    if (!id) return NextResponse.json({ ok: false, error: "Student ID required." }, { status: 422 });
    // Only super/admin can delete
    if (session.role !== "super" && session.role !== "admin") {
      return NextResponse.json({ ok: false, error: "Only super/admin roles can delete students." }, { status: 403 });
    }
    const existing = await db.student.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });

    await db.student.delete({ where: { id } });

    await logAudit({
      userId: session.userId,
      studentId: null, // studentId is set null on cascade via SetNull? Actually onDelete: SetNull on AuditLog
      action: "student.delete",
      details: `Deleted student ${existing.fullName} (${existing.email}) — id=${id}`,
    });

    return NextResponse.json({ ok: true });
  }

  // ── convert: accepted application → enrolled student ──
  if (action === "convert") {
    if (!id) return NextResponse.json({ ok: false, error: "Student ID required." }, { status: 422 });

    const existing = await db.student.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });

    if (existing.status !== "accepted") {
      return NextResponse.json(
        { ok: false, error: `Only "accepted" applications can be converted. Current status: ${existing.status}.` },
        { status: 422 }
      );
    }

    const studentNumber = await generateStudentNumber();
    const student = await db.student.update({
      where: { id },
      data: {
        status: "enrolled",
        studentNumber,
        enrolledAt: new Date(),
      },
      include: { certificates: true },
    });

    await logAudit({
      userId: session.userId,
      studentId: id,
      action: "student.convert",
      details: `Converted accepted application ${existing.applicationRef || id} to enrolled student ${studentNumber} (${student.fullName})`,
    });

    return NextResponse.json({ ok: true, student });
  }

  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 422 });
}
