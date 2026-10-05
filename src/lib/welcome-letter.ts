// Welcome letter PDF generator for Ndayeni Solutions Digital Academy SMS.
// Uses pdfkit to produce a real, downloadable A4 PDF for newly enrolled students.
//
// FORMATTING SPEC (applied per user request):
//   Body text:       Helvetica 11pt (within the 11-12pt range)
//   Headings:        Helvetica-Bold 14pt (within the 14-16pt range)
//   Institution name: Helvetica-Bold 18pt (slightly larger than headings)
//   Fine print:      Helvetica 9pt (within the 9-10pt range)
//   Line spacing:    ~1.43 (lineGap=3 on 11pt → 15.76pt total — within 1.15-1.5 range)
//   Paragraph gap:   1 blank line (moveDown(1))
//   Margins:         72pt ≈ 2.54cm (≈ 2.5cm on all sides)

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

// ─── Typography constants (per user spec) ───
const FONT_BODY = "Helvetica";
const FONT_BOLD = "Helvetica-Bold";
const SIZE_INSTITUTION = 18;   // slightly larger than headings
const SIZE_HEADING = 14;      // 14-16pt range
const SIZE_BODY = 11;         // 11-12pt range
const SIZE_FINE_PRINT = 9;    // 9-10pt range

// Line gap for ~1.43 line spacing on 11pt body text.
// Default Helvetica line height ≈ 11 * 1.16 ≈ 12.76pt; with lineGap=3 → 15.76pt.
// 15.76 / 11 = 1.43 — within the 1.15-1.5 range.
const BODY_LINE_GAP = 3;
const BULLET_LINE_GAP = 2;

// Margins: 72pt ≈ 2.54cm ≈ 2.5cm on all sides.
const MARGIN = 72;

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

  // ─── Letterhead (institution name — 18pt bold, slightly larger than headings) ───
  doc
    .font(FONT_BOLD)
    .fontSize(SIZE_INSTITUTION)
    .fillColor(BRAND_NAVY)
    .text("NDAYENI SOLUTIONS DIGITAL ACADEMY", {
      align: "center",
      width: contentWidth,
    });

  // ─── Subheading (11pt, gray) ───
  doc
    .font(FONT_BODY)
    .fontSize(SIZE_BODY)
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

  // ─── Date (right-aligned, 11pt) ───
  doc
    .font(FONT_BODY)
    .fontSize(SIZE_BODY)
    .fillColor(BODY_COLOR)
    .text(today, { align: "right", width: contentWidth });

  // Blank line between paragraphs
  doc.moveDown(1);

  // ─── Student block (left-aligned, 11pt) ───
  doc.font(FONT_BODY).fontSize(SIZE_BODY).fillColor(BODY_COLOR);
  doc.text(student.fullName, { width: contentWidth });
  if (student.studentNumber) {
    doc.text(`Student No: ${student.studentNumber}`, { width: contentWidth });
  }
  doc.text(student.email, { width: contentWidth });
  doc.text(student.phone, { width: contentWidth });
  if (student.address && student.address.trim().length > 0) {
    doc.text(student.address, { width: contentWidth });
  }

  // Blank line between paragraphs
  doc.moveDown(1);

  // ─── Greeting ───
  doc.text(`Dear ${firstName},`, { width: contentWidth });
  doc.moveDown(1);

  doc.text("Welcome to Ndayeni Solutions Digital Academy!", {
    width: contentWidth,
    lineGap: BODY_LINE_GAP,
  });
  doc.moveDown(1);

  doc.text(
    `We are delighted to confirm your enrolment in the ${student.program} programme. Your journey with us begins on ${startDateText}, and we are committed to walking every step of it alongside you — from your first day of class to the day you receive your certificate.`,
    { width: contentWidth, lineGap: BODY_LINE_GAP }
  );
  doc.moveDown(1);

  // ─── Section heading helper (14pt bold, brand navy) ───
  const section = (heading: string): void => {
    doc
      .font(FONT_BOLD)
      .fontSize(SIZE_HEADING)
      .fillColor(BRAND_NAVY)
      .text(heading, { width: contentWidth })
      .moveDown(0.3);
    doc.font(FONT_BODY).fontSize(SIZE_BODY).fillColor(BODY_COLOR);
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
  doc.moveDown(1);

  // ─── WHAT TO EXPECT ───
  section("WHAT TO EXPECT");
  bullet("Industry-aligned course content delivered by experienced trainers");
  bullet("Hands-on practical sessions and real-world projects");
  bullet("Continuous assessment with feedback");
  bullet("A verifiable digital certificate on successful completion");
  bullet("Access to our support team during business hours");
  doc.moveDown(1);

  // ─── WHAT TO BRING ON YOUR FIRST DAY ───
  section("WHAT TO BRING ON YOUR FIRST DAY");
  bullet("A copy of your ID document");
  bullet("A notebook and pen");
  bullet("A laptop (if you have one — let us know if you need to borrow one)");
  bullet("Proof of payment or your bursary letter (if applicable)");
  doc.moveDown(1);

  // ─── CONTACT DETAILS ───
  section("CONTACT DETAILS");
  doc.text(
    "If you have any questions before your first day, please contact us:",
    { width: contentWidth, lineGap: BODY_LINE_GAP }
  );
  bullet("Phone: 083 800 6989");
  bullet("Email: info@ndayenisolutions.co.za");
  bullet("Address: Ndayeni Solutions, South Africa");
  doc.moveDown(1);

  // ─── Closing ───
  doc.text("We look forward to welcoming you in person.", {
    width: contentWidth,
    lineGap: BODY_LINE_GAP,
  });
  doc.moveDown(1);
  doc.text("Warm regards,", { width: contentWidth });

  // Signature space — 30pt gap
  doc.y += 30;

  doc
    .font(FONT_BOLD)
    .fontSize(SIZE_BODY)
    .fillColor(BODY_COLOR)
    .text("Nhlakanipho Ntshangase", { width: contentWidth });
  doc
    .font(FONT_BODY)
    .fontSize(SIZE_BODY)
    .text("Founder & CEO", { width: contentWidth })
    .text("Ndayeni Solutions Digital Academy", { width: contentWidth });

  // ─── Footer / fine print (9pt, gray, centered) ───
  doc.moveDown(1);
  doc
    .fillColor(GRAY)
    .fontSize(SIZE_FINE_PRINT)
    .font(FONT_BODY);
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
