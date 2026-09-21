import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";

export const dynamic = "force-dynamic";

// ─── GET — basic dashboard stats (auth required) ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  // Application status buckets
  const [
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    enrolledStudents,
    activeStudents,
    completedStudents,
    certificatesIssued,
  ] = await Promise.all([
    // All student records that originated as applications
    db.student.count(),
    // "Pending" = applied | under-review | info-required
    db.student.count({
      where: { status: { in: ["applied", "under-review", "info-required"] } },
    }),
    db.student.count({ where: { status: "accepted" } }),
    db.student.count({ where: { status: "rejected" } }),
    db.student.count({ where: { status: "enrolled" } }),
    db.student.count({ where: { status: "active" } }),
    db.student.count({ where: { status: "completed" } }),
    db.certificate.count(),
  ]);

  return NextResponse.json({
    ok: true,
    stats: {
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      enrolledStudents,
      activeStudents,
      completedStudents,
      certificatesIssued,
    },
  });
}
