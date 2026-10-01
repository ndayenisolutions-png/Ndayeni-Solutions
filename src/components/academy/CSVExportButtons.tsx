"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export interface CSVExportButtonsProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  /** Optional prefilled courseId filter (applied to the Students export only). */
  courseId?: string;
  /** Optional prefilled status filter (applied to the Students export only). */
  status?: string;
  /** Optional prefilled studentId filter (applied to Attendance + Certificates exports). */
  studentId?: string;
}

type ExportType = "students" | "attendance" | "certificates";

/**
 * Build the `/api/academy/export?type=…&…` URL — only includes query params that
 * are actually provided so the server falls back to its default (unfiltered) scope.
 *
 * - students: courseId + status
 * - attendance: studentId
 * - certificates: studentId
 *
 * Same-origin: the academy_session cookie travels with the request automatically,
 * so no extra auth header is needed. `target="_blank"` opens the CSV download in
 * a new tab where the browser offers to save the file.
 */
function buildExportUrl(
  type: ExportType,
  filters: { courseId?: string; status?: string; studentId?: string }
): string {
  const params = new URLSearchParams({ type });
  if (type === "students") {
    if (filters.courseId) params.set("courseId", filters.courseId);
    if (filters.status) params.set("status", filters.status);
  } else {
    // attendance + certificates accept studentId
    if (filters.studentId) params.set("studentId", filters.studentId);
  }
  return `/api/academy/export?${params.toString()}`;
}

export default function CSVExportButtons({
  variant = "outline",
  size = "sm",
  className,
  courseId,
  status,
  studentId,
}: CSVExportButtonsProps) {
  const filters = { courseId, status, studentId };
  const studentsUrl = buildExportUrl("students", filters);
  const attendanceUrl = buildExportUrl("attendance", filters);
  const certificatesUrl = buildExportUrl("certificates", filters);

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}
    >
      <Button asChild variant={variant} size={size}>
        <a
          href={studentsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Students CSV
        </a>
      </Button>
      <Button asChild variant={variant} size={size}>
        <a
          href={attendanceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Attendance CSV
        </a>
      </Button>
      <Button asChild variant={variant} size={size}>
        <a
          href={certificatesUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Certificates CSV
        </a>
      </Button>
    </div>
  );
}
