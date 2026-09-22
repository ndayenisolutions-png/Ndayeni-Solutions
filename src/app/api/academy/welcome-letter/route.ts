import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import { generateWelcomeLetterPdf } from "@/lib/welcome-letter";

export const dynamic = "force-dynamic";

// Statuses eligible to receive a welcome letter — enforces the "once enrolled" rule.
const ELIGIBLE_STATUSES = new Set<string>(["enrolled", "active", "completed"]);

// ─── GET /api/academy/welcome-letter?studentId=<id> ───
// Returns a downloadable welcome-letter PDF for the given student.
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  if (!studentId) {
    return NextResponse.json(
      {
        ok: false,
        error: "studentId query parameter is required.",
      },
      { status: 422 }
    );
  }

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) {
    return NextResponse.json(
      { ok: false, error: "Student not found." },
      { status: 404 }
    );
  }

  if (!ELIGIBLE_STATUSES.has(student.status)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Welcome letter is only available for enrolled students.",
      },
      { status: 403 }
    );
  }

  // Generate the PDF
  const pdfBuffer = await generateWelcomeLetterPdf({
    fullName: student.fullName,
    studentNumber: student.studentNumber,
    email: student.email,
    phone: student.phone,
    address: student.address,
    program: student.program,
    courseId: student.courseId,
    preferredStartDate: student.preferredStartDate,
    preferredMode: student.preferredMode,
    enrolledAt: student.enrolledAt,
    expectedCompletion: student.expectedCompletion,
    nextOfKinName: student.nextOfKinName,
    nextOfKinPhone: student.nextOfKinPhone,
  });

  // Audit the download
  await db.auditLog.create({
    data: {
      userId: session.userId,
      studentId: student.id,
      action: "welcome_letter.download",
      details: `Downloaded welcome letter for ${student.fullName}`,
    },
  });

  const filenameSuffix = student.studentNumber || student.id;
  // Copy the PDF Buffer into a fresh Uint8Array<ArrayBuffer>. Buffer is a
  // Uint8Array<ArrayBufferLike> subclass (its underlying buffer may be a
  // SharedArrayBuffer), but NextResponse's BodyInit type in TS 5.9 requires
  // a Uint8Array<ArrayBuffer>. This copy is small (a few KB per letter) and
  // keeps the route fully type-safe without `any` casts.
  const responseBody = new Uint8Array(pdfBuffer);
  return new NextResponse(responseBody, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="welcome-letter-${filenameSuffix}.pdf"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
