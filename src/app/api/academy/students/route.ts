import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";

export const dynamic = "force-dynamic";

// GET — list all students (admin only)
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where = status && status !== "all" ? { status } : {};
  const students = await db.student.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { certificates: true },
  });

  return NextResponse.json({ ok: true, students });
}

// POST — create or update a student
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const body = await req.json();
  const { action, id, ...data } = body;

  if (action === "create") {
    const student = await db.student.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        idNumber: data.idNumber || null,
        address: data.address || null,
        program: data.program,
        status: data.status || "registered",
        progress: data.progress || 0,
        enrolledAt: data.status === "registered" || data.status === "in-progress" ? new Date() : null,
      },
    });
    return NextResponse.json({ ok: true, student });
  }

  if (action === "update") {
    if (!id) return NextResponse.json({ ok: false, error: "Student ID required." }, { status: 422 });

    const updateData: Record<string, unknown> = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.idNumber !== undefined) updateData.idNumber = data.idNumber;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.program !== undefined) updateData.program = data.program;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.notes !== undefined) updateData.notes = data.notes;

    // Set timestamps based on status changes
    if (data.status === "registered" || data.status === "in-progress") {
      updateData.enrolledAt = updateData.enrolledAt || new Date();
    }
    if (data.status === "completed") {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    const student = await db.student.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ ok: true, student });
  }

  if (action === "delete") {
    if (!id) return NextResponse.json({ ok: false, error: "Student ID required." }, { status: 422 });
    await db.student.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 422 });
}
