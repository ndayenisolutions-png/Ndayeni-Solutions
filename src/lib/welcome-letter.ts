// Welcome letter PDF generator for Ndayeni Solutions Digital Academy SMS.
// Uses pdfkit to produce a real, downloadable A4 PDF for newly enrolled students.

import PDFDocument from "pdfkit";

export interface WelcomeLetterStudent {
  fullName: string;
  studentNumber?: string | null;
  email: string;
  phone: string;
  address?: string | null;
  program: string;
  courseId?: string | null;
  preferredStartDate?: string | null;
  preferredMode?: string | null;
  enrolledAt?: Date | null;
  expectedCompletion?: Date | null;
  nextOfKinName?: string | null;
  nextOfKinPhone?: string | null;
}

// ─── Brand palette ───
const BRAND_NAVY = "#1e3a5f";
const BODY_COLOR = "#0f172a";
const GRAY = "#64748b";
const RULE_COLOR = "#cbd5e1";

// Line gap for 1.4 line spacing on 11pt body text.
// Default Helvetica line height ≈ 11 * 1.16 ≈ 12.76pt; we want 11 * 1.4 = 15.4pt.
const BODY_LINE_GAP = 3;
const BULLET_LINE_GAP = 2;

const MARGIN = 50;

/**
 * Format a Date as a long-form South African English date,
 * e.g. "22 September 2025".
 */
function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Extract the first name from a full name string. */
function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return fullName;
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

/**
 * Generate an A4 portrait welcome-letter PDF for the given student.
 * Resolves to a Buffer containing the PDF bytes.
 */
export async function generateWelcomeLetterPdf(
  student: WelcomeLetterStudent
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margin: MARGIN,
    info: {
      Title: `Welcome Letter — ${student.fullName}`,
      Author: "Ndayeni Solutions Digital Academy",
      Subject: "Student Welcome Letter",
      Creator: "Ndayeni Solutions Digital Academy SMS",
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer | string) => chunks.push(Buffer.from(chunk)));

  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const contentWidth = doc.page.width - MARGIN * 2;
  const firstName = extractFirstName(student.fullName);
  const today = formatLongDate(new Date());

  const enrolledAtText = student.enrolledAt
    ? formatLongDate(student.enrolledAt)
    : "—";
  const expectedCompletionText = student.expectedCompletion
    ? formatLongDate(student.expectedCompletion)
    : "To be confirmed";
  const modeText =
    student.preferredMode && student.preferredMode.trim().length > 0
      ? student.preferredMode.trim()
      : "To be confirmed";
  const startDateText =
    student.preferredStartDate && student.preferredStartDate.trim().length > 0
      ? student.preferredStartDate.trim()
      : student.enrolledAt
        ? formatLongDate(student.enrolledAt)
        : "the next intake";

  // ─── Letterhead ───
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(BRAND_NAVY)
    .text("NDAYENI SOLUTIONS DIGITAL ACADEMY", {
      align: "center",
      width: contentWidth,
    });

  // ─── Subheading ───
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(GRAY)
    .text("IT Training · Software · Web Design · CCTV · Networking", {
      align: "center",
      width: contentWidth,
    })
    .text("POPIA Compliant · Accredited Programmes", {
      align: "center",
      width: contentWidth,
    });

  // ─── Horizontal rule ───
  doc.moveDown(1);
  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(doc.page.width - MARGIN, doc.y)
    .strokeColor(RULE_COLOR)
    .lineWidth(1)
    .stroke();
  doc.moveDown(1);

  // ─── Date (right-aligned) ───
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(BODY_COLOR)
    .text(today, { align: "right", width: contentWidth });

  doc.moveDown(0.5);

  // ─── Student block (left-aligned) ───
  doc.font("Helvetica").fontSize(11).fillColor(BODY_COLOR);
  doc.text(student.fullName, { width: contentWidth });
  if (student.studentNumber) {
    doc.text(`Student No: ${student.studentNumber}`, { width: contentWidth });
  }
  doc.text(student.email, { width: contentWidth });
  doc.text(student.phone, { width: contentWidth });
  if (student.address && student.address.trim().length > 0) {
    doc.text(student.address, { width: contentWidth });
  }

  doc.moveDown(0.5);

  // ─── Greeting ───
  doc.text(`Dear ${firstName},`, { width: contentWidth });
  doc.moveDown(0.5);

  doc.text("Welcome to Ndayeni Solutions Digital Academy!", {
    width: contentWidth,
    lineGap: BODY_LINE_GAP,
  });
  doc.moveDown(0.5);

  doc.text(
    `We are delighted to confirm your enrolment in the ${student.program} programme. Your journey with us begins on ${startDateText}, and we are committed to walking every step of it alongside you — from your first day of class to the day you receive your certificate.`,
    { width: contentWidth, lineGap: BODY_LINE_GAP }
  );
  doc.moveDown(0.5);

  // ─── Section heading helper ───
  const section = (heading: string): void => {
    doc
      .font("Helvetica-Bold")
      .fillColor(BRAND_NAVY)
      .text(heading, { width: contentWidth })
      .moveDown(0.3);
    doc.font("Helvetica").fillColor(BODY_COLOR);
  };

  const bullet = (text: string): void => {
    doc.text(`  •  ${text}`, { width: contentWidth, lineGap: BULLET_LINE_GAP });
  };

  // ─── PROGRAMME DETAILS ───
  section("PROGRAMME DETAILS");
  bullet(`Programme: ${student.program}`);
  bullet(`Mode of delivery: ${modeText}`);
  bullet(`Enrolment date: ${enrolledAtText}`);
  bullet(`Expected completion: ${expectedCompletionText}`);
  doc.moveDown(0.5);

  // ─── WHAT TO EXPECT ───
  section("WHAT TO EXPECT");
  bullet("Industry-aligned course content delivered by experienced trainers");
  bullet("Hands-on practical sessions and real-world projects");
  bullet("Continuous assessment with feedback");
  bullet("A verifiable digital certificate on successful completion");
  bullet("Access to our support team during business hours");
  doc.moveDown(0.5);

  // ─── WHAT TO BRING ON YOUR FIRST DAY ───
  section("WHAT TO BRING ON YOUR FIRST DAY");
  bullet("A copy of your ID document");
  bullet("A notebook and pen");
  bullet("A laptop (if you have one — let us know if you need to borrow one)");
  bullet("Proof of payment or your bursary letter (if applicable)");
  doc.moveDown(0.5);

  // ─── CONTACT DETAILS ───
  section("CONTACT DETAILS");
  doc.text(
    "If you have any questions before your first day, please contact us:",
    { width: contentWidth, lineGap: BODY_LINE_GAP }
  );
  bullet("Phone: 083 800 6989");
  bullet("Email: info@ndayenisolutions.co.za");
  bullet("Address: Ndayeni Solutions, South Africa");
  doc.moveDown(0.5);

  // ─── Closing ───
  doc.text("We look forward to welcoming you in person.", {
    width: contentWidth,
    lineGap: BODY_LINE_GAP,
  });
  doc.moveDown(0.5);
  doc.text("Warm regards,", { width: contentWidth });

  // Signature space — 30pt gap
  doc.y += 30;

  doc
    .font("Helvetica-Bold")
    .fillColor(BODY_COLOR)
    .text("Nhlakanipho Ntshangase", { width: contentWidth });
  doc
    .font("Helvetica")
    .text("Founder & CEO", { width: contentWidth })
    .text("Ndayeni Solutions Digital Academy", { width: contentWidth });

  // ─── Footer (centered, 9pt, gray) ───
  // We let the footer flow naturally after the signatory block — pinning it to
  // an absolute page-bottom position caused PDFKit to spill it onto a second
  // page when the body content fills most of page 1. Flowing it after the
  // signature keeps everything on a single page for typical letters.
  doc.moveDown(0.5);
  doc
    .fillColor(GRAY)
    .fontSize(9)
    .font("Helvetica");
  doc.text(
    "Ndayeni Solutions Digital Academy · POPIA Compliant · https://ndayenisolutions.co.za",
    { align: "center", width: contentWidth }
  );
  doc.text(
    "This letter was generated electronically and is valid without signature.",
    { align: "center", width: contentWidth }
  );

  doc.end();
  return finished;
}
