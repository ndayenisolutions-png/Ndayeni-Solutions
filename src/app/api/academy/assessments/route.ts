import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import type { SessionPayload } from "@/lib/academy-auth";

export const dynamic = "force-dynamic";

/** Roles that can write assessments */
function canWrite(session: SessionPayload | null): boolean {
  if (!session) return false;
  return ["super", "admin", "training"].includes(session.role);
}

// ─── GET — list assessments for a student (?studentId=X) or gradebook matrix (?courseId=X) ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const courseId = searchParams.get("courseId");

  // ── gradebook matrix (?courseId=X) ──
  if (courseId) {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { modules: { where: { active: true }, orderBy: { order: "asc" } } },
    });
    if (!course) return NextResponse.json({ ok: false, error: "Course not found." }, { status: 404 });

    const students = await db.student.findMany({
      where: { courseId, status: { in: ["enrolled", "active", "completed"] } },
      orderBy: { fullName: "asc" },
      select: { id: true, fullName: true, studentNumber: true, email: true, status: true, progress: true },
    });

    const studentIds = students.map((s) => s.id);
    const assessments =
      studentIds.length > 0
        ? await db.assessment.findMany({ where: { studentId: { in: studentIds } } })
        : [];

    // Build a matrix keyed by module title; latest assessment wins when duplicates exist
    const moduleTitles = course.modules.map((m) => m.title);
    const moduleTitleSet = new Set(moduleTitles);

    const matrix = students.map((student) => {
      // Latest-first ordering so the first occurrence wins in the dedupe pass below
      const studentAssessments = assessments
        .filter((a) => a.studentId === student.id && moduleTitleSet.has(a.moduleTitle))
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      const cells: Record<
        string,
        { result: string; mark: string | null; date: string; comments: string | null } | null
      > = {};
      for (const title of moduleTitles) cells[title] = null;

      const seen = new Set<string>();
      for (const a of studentAssessments) {
        if (seen.has(a.moduleTitle)) continue;
        seen.add(a.moduleTitle);
        cells[a.moduleTitle] = {
          result: a.result,
          mark: a.mark,
          date: a.date.toISOString(),
          comments: a.comments,
        };
      }

      return { student, cells };
    });

    // Summary stats: pass-rate is competent cells / total cells (0–100)
    const totalStudents = students.length;
    const totalModules = course.modules.length;
    const totalCells = totalStudents * totalModules;
    let competentCells = 0;
    for (const row of matrix) {
      for (const title of moduleTitles) {
        const cell = row.cells[title];
        if (cell && cell.result === "pass") competentCells++;
      }
    }
    const passRate = totalCells > 0 ? Math.round((competentCells / totalCells) * 100) : 0;

    return NextResponse.json({
      ok: true,
      course,
      students,
      modules: course.modules,
      matrix,
      summary: { totalStudents, totalModules, passRate, competentCells, totalCells },
    });
  }

  // ── single-student list (?studentId=X) — existing behavior, unchanged ──
  const where: Record<string, unknown> = {};
  if (studentId) where.studentId = studentId;

  const records = await db.assessment.findMany({
    where,
    orderBy: { date: "desc" },
    include: { student: { select: { id: true, fullName: true, studentNumber: true, email: true } } },
  });

  return NextResponse.json({ ok: true, assessments: records });
}

// ─── POST — create or update an assessment ───
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  if (!canWrite(session)) {
    return NextResponse.json({ ok: false, error: "Only super/admin/training roles can manage assessments." }, { status: 403 });
  }

  const body = await req.json();
  const { id, studentId, moduleTitle, date, result, mark, comments } = body;

  // Validate
  const validResults = ["pass", "not-yet-competent"];
  if (result && !validResults.includes(result)) {
    return NextResponse.json({ ok: false, error: `result must be one of: ${validResults.join(", ")}.` }, { status: 422 });
  }

  // Update existing assessment
  if (id) {
    const updateData: Record<string, unknown> = {};
    if (moduleTitle !== undefined) updateData.moduleTitle = moduleTitle;
    if (date !== undefined) updateData.date = date ? new Date(date) : new Date();
    if (result !== undefined) updateData.result = result;
    if (mark !== undefined) updateData.mark = mark;
    if (comments !== undefined) updateData.comments = comments;
    if (studentId !== undefined) updateData.studentId = studentId;

    const updated = await db.assessment.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ ok: true, assessment: updated });
  }

  // Create new assessment
  if (!studentId || !moduleTitle || !result) {
    return NextResponse.json(
      { ok: false, error: "studentId, moduleTitle and result are required." },
      { status: 422 }
    );
  }

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });

  const created = await db.assessment.create({
    data: {
      studentId,
      moduleTitle,
      date: date ? new Date(date) : new Date(),
      result,
      mark: mark ?? null,
      comments: comments ?? null,
    },
  });

  return NextResponse.json({ ok: true, assessment: created });
}
