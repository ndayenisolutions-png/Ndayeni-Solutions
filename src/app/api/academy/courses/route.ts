import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import type { SessionPayload } from "@/lib/academy-auth";

export const dynamic = "force-dynamic";

/** Super or admin can write */
function canWrite(session: SessionPayload | null): boolean {
  if (!session) return false;
  return session.role === "super" || session.role === "admin";
}

// ─── GET — list all courses with their modules ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";

  const courses = await db.course.findMany({
    where: activeOnly ? { active: true } : {},
    orderBy: { createdAt: "desc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json({ ok: true, courses });
}

// ─── POST — actions on courses & modules ───
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  if (!canWrite(session)) {
    return NextResponse.json({ ok: false, error: "Only super/admin roles can manage courses." }, { status: 403 });
  }

  const body = await req.json();
  const { action } = body;

  // ── create course ──
  if (action === "create") {
    const { code, title, description, duration, deliveryMethod, entryRequirements, fee, maxStudents } = body;
    if (!code || !title || !description) {
      return NextResponse.json({ ok: false, error: "code, title and description are required." }, { status: 422 });
    }
    // Enforce unique code
    const existing = await db.course.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ ok: false, error: `Course code "${code}" already exists.` }, { status: 409 });
    }
    const course = await db.course.create({
      data: {
        code,
        title,
        description,
        duration: duration || "",
        deliveryMethod: deliveryMethod || "",
        entryRequirements: entryRequirements || null,
        fee: fee || null,
        maxStudents: typeof maxStudents === "number" ? maxStudents : null,
      },
      include: { modules: true },
    });
    return NextResponse.json({ ok: true, course });
  }

  // ── update course ──
  if (action === "update") {
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ ok: false, error: "Course ID required." }, { status: 422 });
    const updateData: Record<string, unknown> = {};
    const fields = [
      "code", "title", "description", "duration", "deliveryMethod",
      "entryRequirements", "fee", "maxStudents", "active",
    ];
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    const course = await db.course.update({
      where: { id },
      data: updateData,
      include: { modules: true },
    });
    return NextResponse.json({ ok: true, course });
  }

  // ── delete course ──
  if (action === "delete") {
    const { id } = body;
    if (!id) return NextResponse.json({ ok: false, error: "Course ID required." }, { status: 422 });
    await db.course.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  // ── add module ──
  if (action === "addModule") {
    const { courseId, title, description, duration, order, learningObjectives, active } = body;
    if (!courseId || !title) {
      return NextResponse.json({ ok: false, error: "courseId and title are required." }, { status: 422 });
    }
    const moduleData = await db.module.create({
      data: {
        courseId,
        title,
        description: description || null,
        duration: duration || null,
        order: typeof order === "number" ? order : 0,
        learningObjectives: learningObjectives || null,
        active: typeof active === "boolean" ? active : true,
      },
    });
    return NextResponse.json({ ok: true, module });
  }

  // ── update module ──
  if (action === "updateModule") {
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ ok: false, error: "Module ID required." }, { status: 422 });
    const updateData: Record<string, unknown> = {};
    const fields = ["title", "description", "duration", "order", "learningObjectives", "active"];
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    const moduleData = await db.module.update({ where: { id }, data: updateData });
    return NextResponse.json({ ok: true, module });
  }

  // ── delete module ──
  if (action === "deleteModule") {
    const { id } = body;
    if (!id) return NextResponse.json({ ok: false, error: "Module ID required." }, { status: 422 });
    await db.module.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 422 });
}
