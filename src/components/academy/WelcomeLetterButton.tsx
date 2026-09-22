"use client";

import { Button } from "@/components/ui/button";
import { Download, Lock } from "lucide-react";

export interface WelcomeLetterButtonProps {
  studentId: string;
  studentNumber?: string | null;
  status: string; // enrolled | active | completed | applied | etc.
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

// Statuses eligible to receive a welcome letter — mirrors the server-side
// ELIGIBLE_STATUSES check in /api/academy/welcome-letter/route.ts so the
// button accurately reflects availability without a round-trip.
const ELIGIBLE_STATUSES = new Set<string>(["enrolled", "active", "completed"]);

export default function WelcomeLetterButton({
  studentId,
  status,
  variant = "default",
  size = "default",
  className,
}: WelcomeLetterButtonProps) {
  const eligible = ELIGIBLE_STATUSES.has(status);

  if (!eligible) {
    // Render a disabled button with a Lock icon + a native title tooltip
    // (native title works reliably on disabled buttons; pointer-events-based
    // shadcn Tooltip would be suppressed by `disabled:pointer-events-none`).
    return (
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled
        title="Available once the student is enrolled"
      >
        <Lock className="w-4 h-4 mr-2" />
        Welcome Letter (locked)
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={`/api/academy/welcome-letter?studentId=${encodeURIComponent(studentId)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Welcome Letter
      </a>
    </Button>
  );
}
