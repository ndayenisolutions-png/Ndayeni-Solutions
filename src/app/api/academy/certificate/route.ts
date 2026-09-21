import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/academy-session";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

const DEFAULT_SIGNATORY = "Nhlakanipho Ntshangase";
const SIGNATORY_TITLE = "Founder & CEO";

/** Generate a unique certificate number: NDA-CERT-2026-00125 */
async function generateCertNumber(): Promise<string> {
  const year = new Date().getFullYear();
  // Count existing certs this year to get a sequential number
  const yearPrefix = `NDA-CERT-${year}-`;
  const existing = await db.certificate.count({
    where: { certificateNumber: { startsWith: yearPrefix } },
  });
  const seq = String(existing + 1).padStart(5, "0");
  return `${yearPrefix}${seq}`;
}

/** Generate a QR code data URL encoding the verification URL */
async function generateQRDataUrl(certificateNumber: string): Promise<string> {
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://ndayenisolutions.co.za"}/training/verify/${certificateNumber}`;
  return QRCode.toDataURL(verifyUrl, { width: 150, margin: 1, color: { dark: "#1e3a5f", light: "#ffffff" } });
}

// ─── GET — view a certificate by ID (public) ───
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const certificateNumber = searchParams.get("certificateNumber");

  const cert =
    id
      ? await db.certificate.findUnique({ where: { id } })
      : certificateNumber
        ? await db.certificate.findUnique({ where: { certificateNumber } })
        : null;

  if (!cert) return NextResponse.json({ ok: false, error: "Certificate not found." }, { status: 404 });

  // Generate QR code data URL
  const qrDataUrl = await generateQRDataUrl(cert.certificateNumber);

  return NextResponse.json({
    ok: true,
    certificate: {
      ...cert,
      signedBy: cert.signedBy || DEFAULT_SIGNATORY,
      signatoryTitle: SIGNATORY_TITLE,
      qrCode: qrDataUrl,
      verifyUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ndayenisolutions.co.za"}/training/verify/${cert.certificateNumber}`,
    },
  });
}

// ─── POST — issue a certificate OR generate a manual one for a past student ───
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });

  const body = await req.json();
  const action = body.action || "issue";

  // ── manual: generate a certificate for a past student ──
  if (action === "manual") {
    // Only super/admin/admissions can issue manual certificates
    if (session.role !== "super" && session.role !== "admin" && session.role !== "admissions") {
      return NextResponse.json({ ok: false, error: "Only super/admin/admissions roles can issue manual certificates." }, { status: 403 });
    }
    const { fullName, programName, issueDate, signedBy, studentId, email, idNumber } = body;
    if (!fullName || !programName) {
      return NextResponse.json(
        { ok: false, error: "fullName and programName are required." },
        { status: 422 }
      );
    }

    // Find or create a student record for this past student
    const student = await (async () => {
      if (studentId) {
        const found = await db.student.findUnique({ where: { id: studentId } });
        if (found) return found;
      }
      const byName = await db.student.findFirst({ where: { fullName: { contains: fullName } } });
      if (byName) return byName;
      return db.student.create({
        data: {
          fullName: String(fullName).trim(),
          email: email?.trim() || `manual-${Date.now()}@ndayeni.local`,
          phone: "",
          program: programName,
          idNumber: idNumber?.trim() || null,
          status: "completed",
          progress: 100,
          completedAt: new Date(),
        },
      });
    })();

    // Check if a certificate already exists for this student+program
    const existing = await db.certificate.findFirst({
      where: { studentId: student.id, programName },
    });
    if (existing) {
      return NextResponse.json({ ok: true, certificate: existing, alreadyExists: true });
    }

    const cert = await db.certificate.create({
      data: {
        studentId: student.id,
        programName,
        studentName: String(fullName).trim(),
        idNumber: idNumber?.trim() || student.idNumber || null,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        certificateNumber: await generateCertNumber(),
        signedBy: signedBy || DEFAULT_SIGNATORY,
        status: "active",
      },
    });

    // Ensure the student status is completed
    await db.student.update({
      where: { id: student.id },
      data: { status: "completed", completedAt: student.completedAt ?? new Date(), progress: 100 },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        studentId: student.id,
        action: "certificate.manual_issue",
        details: `Manually issued certificate ${cert.certificateNumber} to ${student.fullName} for ${programName}`,
      },
    });

    return NextResponse.json({ ok: true, certificate: cert });
  }

  // ── issue (default): issue a certificate for an existing student ──
  const { studentId, signedBy } = body;
  if (!studentId) return NextResponse.json({ ok: false, error: "studentId is required." }, { status: 422 });

  // Only super/admin/admissions can issue
  if (session.role !== "super" && session.role !== "admin" && session.role !== "admissions") {
    return NextResponse.json({ ok: false, error: "Only super/admin/admissions roles can issue certificates." }, { status: 403 });
  }

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ ok: false, error: "Student not found." }, { status: 404 });

  // Check if certificate already exists for this student
  const existing = await db.certificate.findFirst({ where: { studentId } });
  if (existing) {
    return NextResponse.json({ ok: true, certificate: existing, alreadyExists: true });
  }

  const certificate = await db.certificate.create({
    data: {
      studentId,
      programName: student.program,
      studentName: student.fullName,
      idNumber: student.idNumber || null,
      certificateNumber: await generateCertNumber(),
      signedBy: signedBy || DEFAULT_SIGNATORY,
      status: "active",
    },
  });

  // Ensure student status is completed
  await db.student.update({
    where: { id: studentId },
    data: { status: "completed", completedAt: new Date(), progress: 100 },
  });

  await db.auditLog.create({
    data: {
      userId: session.userId,
      studentId,
      action: "certificate.issue",
      details: `Issued certificate ${certificate.certificateNumber} to ${student.fullName}`,
    },
  });

  return NextResponse.json({ ok: true, certificate });
}
