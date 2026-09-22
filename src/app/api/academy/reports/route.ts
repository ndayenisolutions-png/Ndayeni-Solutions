import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";

export const dynamic = "force-dynamic";

// All student status values referenced in the prisma/schema.prisma comment block:
//   applied → under-review → info-required → accepted → enrolled → active → completed
//   also: rejected, withdrawn, deferred, terminated
const ALL_STATUSES = [
  "applied", "under-review", "info-required", "accepted", "enrolled",
  "active", "completed", "rejected", "withdrawn", "deferred", "terminated",
] as const;

/** Format a Date as "YYYY-MM" (1-indexed month, zero-padded). */
function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Build the last 12 "YYYY-MM" keys ending with the current month, oldest first. */
function last12Months(): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    months.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  }
  return months;
}

/**
 * Group an array of (possibly null) dates into per-month counts.
 * Only dates whose month-key appears in `months` are tallied — others are dropped,
 * which is a safety net for any row outside the 12-month window.
 */
function bucketByMonth(
  dates: Array<Date | null>,
  months: string[]
): Array<{ month: string; count: number }> {
  const counts = new Map<string, number>(months.map(m => [m, 0]));
  for (const d of dates) {
    if (!d) continue;
    const k = monthKey(d);
    const current = counts.get(k);
    if (current !== undefined) counts.set(k, current + 1);
  }
  return months.map(m => ({ month: m, count: counts.get(m) ?? 0 }));
}

// ─── GET — dashboard stats with trends (auth required) ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  // Window for the 12-month trends: start of the month 11 months ago.
  const elevenMonthsAgo = new Date();
  elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);
  elevenMonthsAgo.setDate(1);
  elevenMonthsAgo.setHours(0, 0, 0, 0);

  // Window for the 30-day attendance summary: midnight 30 days ago.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // Application status buckets (existing 8 counts — preserved verbatim) + new aggregations.
  const [
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    enrolledStudents,
    activeStudents,
    completedStudents,
    certificatesIssued,
    enrolledTrendRows,
    completedTrendRows,
    appliedTrendRows,
    certTrendRows,
    studentsWithStatus,
    studentsWithCourse,
    recentAttendance,
    allAssessments,
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
    // NEW: 12-month trend rows — fetch only the date column for each metric.
    db.student.findMany({
      where: { enrolledAt: { gte: elevenMonthsAgo, not: null } },
      select: { enrolledAt: true },
    }),
    db.student.findMany({
      where: { completedAt: { gte: elevenMonthsAgo, not: null } },
      select: { completedAt: true },
    }),
    db.student.findMany({
      where: { createdAt: { gte: elevenMonthsAgo } },
      select: { createdAt: true },
    }),
    db.certificate.findMany({
      where: { issueDate: { gte: elevenMonthsAgo } },
      select: { issueDate: true },
    }),
    // NEW: status breakdown — single-column scan, group in JS.
    db.student.findMany({ select: { status: true } }),
    // NEW: top courses — students with a courseId, group in JS, fetch titles later.
    db.student.findMany({ where: { courseId: { not: null } }, select: { courseId: true } }),
    // NEW: attendance summary — last 30 days only.
    db.attendance.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      select: { status: true },
    }),
    // NEW: assessment summary — all-time (small dataset).
    db.assessment.findMany({ select: { result: true } }),
  ]);

  // ── Monthly trends (12 months, oldest first) ──
  const months = last12Months();
  const trends = {
    enrollments: bucketByMonth(enrolledTrendRows.map(s => s.enrolledAt), months),
    completions: bucketByMonth(completedTrendRows.map(s => s.completedAt), months),
    applications: bucketByMonth(appliedTrendRows.map(s => s.createdAt), months),
    certificates: bucketByMonth(certTrendRows.map(c => c.issueDate), months),
  };

  // ── Status distribution: init all known statuses to 0, then count ──
  const statusBreakdown: Record<string, number> = {};
  for (const s of ALL_STATUSES) statusBreakdown[s] = 0;
  for (const s of studentsWithStatus) {
    statusBreakdown[s.status] = (statusBreakdown[s.status] ?? 0) + 1;
  }

  // ── Top 5 courses by enrolment ──
  const courseCountMap = new Map<string, number>();
  for (const s of studentsWithCourse) {
    if (!s.courseId) continue;
    courseCountMap.set(s.courseId, (courseCountMap.get(s.courseId) ?? 0) + 1);
  }
  const topCourseEntries = [...courseCountMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topCourseIds = topCourseEntries.map(([id]) => id);
  // Only hit the DB if we actually have at least one course to look up.
  const topCourseRecords = topCourseIds.length > 0
    ? await db.course.findMany({
        where: { id: { in: topCourseIds } },
        select: { id: true, title: true, code: true },
      })
    : [];
  const courseById = new Map(topCourseRecords.map(c => [c.id, c]));
  const topCourses = topCourseEntries.map(([courseId, enrolled]) => {
    const c = courseById.get(courseId);
    return {
      courseId,
      title: c?.title ?? "Unknown course",
      code: c?.code ?? "",
      enrolled,
    };
  });

  // ── Attendance summary (last 30 days) ──
  const attendanceCounts = { present: 0, absent: 0, excused: 0 };
  for (const a of recentAttendance) {
    if (a.status === "present") attendanceCounts.present++;
    else if (a.status === "absent") attendanceCounts.absent++;
    else if (a.status === "excused") attendanceCounts.excused++;
  }
  const attendanceTotal =
    attendanceCounts.present + attendanceCounts.absent + attendanceCounts.excused;
  const attendanceRate =
    attendanceTotal > 0 ? (attendanceCounts.present / attendanceTotal) * 100 : 0;
  const attendanceSummary = {
    present: attendanceCounts.present,
    absent: attendanceCounts.absent,
    excused: attendanceCounts.excused,
    rate: Number(attendanceRate.toFixed(1)),
  };

  // ── Assessment summary (all-time) ──
  const assessmentCounts = { pass: 0, "not-yet-competent": 0 };
  for (const a of allAssessments) {
    if (a.result === "pass") assessmentCounts.pass++;
    else if (a.result === "not-yet-competent") assessmentCounts["not-yet-competent"]++;
  }
  const assessmentTotal =
    assessmentCounts.pass + assessmentCounts["not-yet-competent"];
  const assessmentRate =
    assessmentTotal > 0 ? (assessmentCounts.pass / assessmentTotal) * 100 : 0;
  const assessmentSummary = {
    pass: assessmentCounts.pass,
    "not-yet-competent": assessmentCounts["not-yet-competent"],
    rate: Number(assessmentRate.toFixed(1)),
  };

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
    trends,
    statusBreakdown,
    topCourses,
    attendanceSummary,
    assessmentSummary,
  });
}
