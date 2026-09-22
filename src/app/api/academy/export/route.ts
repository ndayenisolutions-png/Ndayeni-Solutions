import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";

export const dynamic = "force-dynamic";

// ─── Types ───

const VALID_TYPES = ["students", "attendance", "certificates"] as const;
type ExportType = (typeof VALID_TYPES)[number];

/** Type guard: narrows `string | null` to the `ExportType` union. */
function isExportType(value: string | null): value is ExportType {
  return value !== null && (VALID_TYPES as readonly string[]).includes(value);
}

// ─── CSV helpers ───

/**
 * Escape a single CSV cell value.
 *  - null / undefined → empty string
 *  - booleans → "Yes" / "No"
 *  - Date → full ISO timestamp string
 *  - everything else → String(value)
 * Wraps the value in double quotes (and doubles any embedded double quotes)
 * when the value contains a comma, a double quote, or a newline.
 */
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";

  let str: string;
  if (typeof value === "boolean") {
    str = value ? "Yes" : "No";
  } else if (value instanceof Date) {
    str = value.toISOString();
  } else {
    str = String(value);
  }

  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Format a Date or date-string as YYYY-MM-DD (date-only). Returns null for null/undefined. */
function dateOnly(value: Date | string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const iso = typeof value === "string" ? value : value.toISOString();
  return iso.slice(0, 10);
}

/** Format a Date or string as a full ISO timestamp. Returns null for null/undefined. */
function timestamp(value: Date | string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return typeof value === "string" ? value : value.toISOString();
}

/** Build a CSV string from a header row plus data rows. Uses `\r\n` line terminator. */
function buildCsv(headers: string[], rows: unknown[][]): string {
  const lines: string[] = [headers.join(",")];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(","));
  }
  return lines.join("\r\n");
}

// ─── GET — CSV export (?type=students|attendance|certificates) ───

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  // Validate the requested export type first (returns 422 for malformed input
  // without leaking any data; valid type values are public knowledge).
  if (!isExportType(type)) {
    return NextResponse.json(
      { ok: false, error: `type must be one of: ${VALID_TYPES.join(", ")}.` },
      { status: 422 }
    );
  }

  const session = getSession(req);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  let csv: string;

  // ── students export — mirrors /api/academy/students GET filtering ──
  if (type === "students") {
    const q = (searchParams.get("q") || "").trim();
    const status = searchParams.get("status");
    const courseId = searchParams.get("courseId");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (courseId && courseId !== "all") where.courseId = courseId;
    if (q) {
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
    });

    const headers = [
      "Student Number", "Application Ref", "Full Name", "Email", "Phone",
      "ID Number", "Gender", "Nationality", "Status", "Program", "Course ID",
      "Preferred Start Date", "Preferred Mode", "Highest Education",
      "Employment Status", "Enrolled At", "Training Start Date",
      "Expected Completion", "Completed At", "Progress %",
      "Next of Kin Name", "Next of Kin Phone", "Next of Kin Email",
      "Next of Kin Relationship", "Address", "Notes", "Created At",
    ];

    const rows = students.map((s) => [
      s.studentNumber,
      s.applicationRef,
      s.fullName,
      s.email,
      s.phone,
      s.idNumber,
      s.gender,
      s.nationality,
      s.status,
      s.program,
      s.courseId,
      dateOnly(s.preferredStartDate),
      s.preferredMode,
      s.highestEducation,
      s.employmentStatus,
      timestamp(s.enrolledAt),
      timestamp(s.trainingStartDate),
      timestamp(s.expectedCompletion),
      timestamp(s.completedAt),
      s.progress,
      s.nextOfKinName,
      s.nextOfKinPhone,
      s.nextOfKinEmail,
      s.nextOfKinRelationship,
      s.address,
      s.notes,
      timestamp(s.createdAt),
    ]);

    csv = buildCsv(headers, rows);

  // ── attendance export — ?studentId= and/or ?date=YYYY-MM-DD ──
  } else if (type === "attendance") {
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;
    if (date) {
      // Treat the supplied date as a UTC day range
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);
      where.date = { gte: start, lte: end };
    }

    const records = await db.attendance.findMany({
      where,
      orderBy: { date: "desc" },
    });

    // Fetch the referenced students in a single parallel query, then build a
    // studentId → { studentNumber, fullName } map to join into each row.
    const studentIds = Array.from(new Set(records.map((r) => r.studentId)));
    const students = await db.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, studentNumber: true, fullName: true },
    });
    const studentMap = new Map(students.map((s) => [s.id, s]));

    const headers = [
      "Attendance ID", "Student ID", "Student Number", "Student Name",
      "Date", "Status", "Notes", "Created At",
    ];

    const rows = records.map((r) => {
      const student = studentMap.get(r.studentId);
      return [
        r.id,
        r.studentId,
        student ? student.studentNumber : null,
        student ? student.fullName : null,
        dateOnly(r.date),
        r.status,
        r.notes,
        timestamp(r.createdAt),
      ];
    });

    csv = buildCsv(headers, rows);

  // ── certificates export — ?studentId= ──
  } else {
    const studentId = searchParams.get("studentId");
    const where: Record<string, unknown> = {};
    if (studentId) where.studentId = studentId;

    const certificates = await db.certificate.findMany({
      where,
      orderBy: { issueDate: "desc" },
      include: {
        student: {
          select: { id: true, studentNumber: true, email: true, idNumber: true },
        },
      },
    });

    const headers = [
      "Certificate Number", "Student Number", "Student Name", "Email",
      "ID Number", "Program", "Issue Date", "Signed By", "Status",
      "Certificate ID",
    ];

    const rows = certificates.map((c) => [
      c.certificateNumber,
      c.student.studentNumber,
      c.studentName,
      c.student.email,
      c.idNumber ?? c.student.idNumber,
      c.programName,
      dateOnly(c.issueDate),
      c.signedBy,
      c.status,
      c.id,
    ]);

    csv = buildCsv(headers, rows);
  }

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}-export-${today}.csv"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
