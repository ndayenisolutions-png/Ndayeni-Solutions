import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/academy-auth";
import { getSession } from "@/lib/academy-session";

export const dynamic = "force-dynamic";

// GET — list all academy users (admin only)
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const users = await db.academyUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, users });
}

// POST — create a new academy user (super only)
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  if (session.role !== "super") return NextResponse.json({ ok: false, error: "Only super users can create new users." }, { status: 403 });

  const { email, password, name, role } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ ok: false, error: "Email, password and name required." }, { status: 422 });
  }

  const existing = await db.academyUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) return NextResponse.json({ ok: false, error: "A user with this email already exists." }, { status: 409 });

  const user = await db.academyUser.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      name: name.trim(),
      role: role || "admin",
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, user });
}

// DELETE — remove a user (super only, cannot delete self)
export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  if (session.role !== "super") return NextResponse.json({ ok: false, error: "Only super users can delete users." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "User ID required." }, { status: 422 });
  if (id === session.userId) return NextResponse.json({ ok: false, error: "Cannot delete your own account." }, { status: 422 });

  await db.academyUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
