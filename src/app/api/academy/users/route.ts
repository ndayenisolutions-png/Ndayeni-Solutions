import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/academy-auth";
import { getSession } from "@/lib/academy-session";
import type { SessionPayload } from "@/lib/academy-auth";

export const dynamic = "force-dynamic";

const PUBLIC_USER_FIELDS = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
};

/** Super can do everything; admins can update/reset their own password only */
function assertCanManageUser(session: SessionPayload, targetId?: string, targetRole?: string): boolean {
  if (session.role === "super") return true;
  // Allow self-management (e.g. resetting own password)
  if (targetId && targetId === session.userId) return true;
  // Non-super cannot promote someone to super
  if (targetRole === "super" && session.role !== "super") return false;
  return false;
}

// ─── GET — list all academy users (any authenticated user) ───
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const users = await db.academyUser.findMany({
    select: PUBLIC_USER_FIELDS,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, users });
}

// ─── POST — create a user, OR update an existing user, OR reset password ───
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const body = await req.json();
  const action = body.action || "create";

  // ── create ──
  if (action === "create") {
    if (session.role !== "super") {
      return NextResponse.json({ ok: false, error: "Only super users can create new users." }, { status: 403 });
    }
    const { email, password, name, role } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ ok: false, error: "Email, password and name required." }, { status: 422 });
    }
    // Only super can create super users
    if (role === "super" && session.role !== "super") {
      return NextResponse.json({ ok: false, error: "Only super users can assign the super role." }, { status: 403 });
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
      select: PUBLIC_USER_FIELDS,
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: "user.create",
        details: `Created user ${user.email} (role=${user.role})`,
      },
    });

    return NextResponse.json({ ok: true, user });
  }

  // ── update ──
  if (action === "update") {
    const { id, name, role, active } = body;
    if (!id) return NextResponse.json({ ok: false, error: "User ID required." }, { status: 422 });

    // Look up the target user to check existing role
    const target = await db.academyUser.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });

    // Non-super cannot change roles except on themselves, and cannot promote to super
    if (!assertCanManageUser(session, id, role)) {
      return NextResponse.json({ ok: false, error: "You do not have permission to modify this user." }, { status: 403 });
    }
    // Cannot demote yourself if you're the only super? (safety: prevent locking yourself out)
    if (session.userId === id && role && role !== "super" && session.role === "super") {
      const superCount = await db.academyUser.count({ where: { role: "super", active: true } });
      if (superCount <= 1) {
        return NextResponse.json(
          { ok: false, error: "You are the only super user — you cannot change your role." },
          { status: 422 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (role !== undefined) updateData.role = role;
    if (active !== undefined) updateData.active = Boolean(active);

    const user = await db.academyUser.update({
      where: { id },
      data: updateData,
      select: PUBLIC_USER_FIELDS,
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: "user.update",
        details: `Updated user ${user.email} — ${JSON.stringify(updateData)}`,
      },
    });

    return NextResponse.json({ ok: true, user });
  }

  // ── resetPassword ──
  if (action === "resetPassword") {
    const { id, password } = body;
    if (!id || !password) {
      return NextResponse.json({ ok: false, error: "User ID and new password required." }, { status: 422 });
    }
    // Only super, OR user resetting their own password
    if (session.role !== "super" && id !== session.userId) {
      return NextResponse.json({ ok: false, error: "Only super users can reset another user's password." }, { status: 403 });
    }
    const target = await db.academyUser.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });

    await db.academyUser.update({
      where: { id },
      data: { passwordHash: hashPassword(password) },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: "user.reset_password",
        details: `Reset password for ${target.email}${id === session.userId ? " (self)" : ""}`,
      },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 422 });
}

// ─── DELETE — remove a user (super only, cannot delete self) ───
export async function DELETE(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  if (session.role !== "super") return NextResponse.json({ ok: false, error: "Only super users can delete users." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "User ID required." }, { status: 422 });
  if (id === session.userId) return NextResponse.json({ ok: false, error: "Cannot delete your own account." }, { status: 422 });

  const target = await db.academyUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });

  // Prevent deleting the last super user
  if (target.role === "super") {
    const superCount = await db.academyUser.count({ where: { role: "super", active: true } });
    if (superCount <= 1) {
      return NextResponse.json(
        { ok: false, error: "Cannot delete the only remaining super user." },
        { status: 422 }
      );
    }
  }

  await db.academyUser.delete({ where: { id } });

  await db.auditLog.create({
    data: {
      userId: session.userId,
      action: "user.delete",
      details: `Deleted user ${target.email}`,
    },
  });

  return NextResponse.json({ ok: true });
}
