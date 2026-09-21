import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";

export const dynamic = "force-dynamic";

function generateCertNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NSDA-${year}-${random}`;
}

// POST — issue a certificate for a completed student
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const { studentId } = await req.json();
  if (!studentId) return NextResponse.json({ ok: false, error: "Student ID required." }, { status: 422 });

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });

  // Check if certificate already exists
  const existing = await db.certificate.findFirst({ where: { studentId } });
  if (existing) {
    return NextResponse.json({ ok: true, certificate: existing, alreadyExists: true });
  }

  const certificate = await db.certificate.create({
    data: {
      studentId,
      programName: student.program,
      studentName: student.fullName,
      certificateNumber: generateCertNumber(),
    },
  });

  // Ensure student status is completed
  await db.student.update({
    where: { id: studentId },
    data: { status: "completed", completedAt: new Date(), progress: 100 },
  });

  return NextResponse.json({ ok: true, certificate });
}

// GET — view a certificate by ID (public, so students can view their own)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Certificate ID required." }, { status: 422 });

  const cert = await db.certificate.findUnique({ where: { id } });
  if (!cert) return NextResponse.json({ ok: false, error: "Certificate not found." }, { status: 404 });

  return NextResponse.json({ ok: true, certificate: cert });
}
