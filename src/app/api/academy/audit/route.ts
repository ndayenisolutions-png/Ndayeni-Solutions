import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";

export const dynamic = "force-dynamic";

// ─── GET — list audit logs with pagination (auth required) ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || "50")));
  const action = searchParams.get("action");
  const studentId = searchParams.get("studentId");
  const userId = searchParams.get("userId");

  // Build WHERE clause
  const where: Record<string, unknown> = {};
  if (action) where.action = { contains: action };
  if (studentId) where.studentId = studentId;
  if (userId) where.userId = userId;

  const [total, logs] = await Promise.all([
    db.auditLog.count({ where }),
    db.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    logs,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  });
}
