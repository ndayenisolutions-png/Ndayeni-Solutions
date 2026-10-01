"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Check,
  X,
  AlertCircle,
  Loader2,
  Users,
  Save,
} from "lucide-react";

interface AttendanceBulkCaptureProps {
  courses: Array<{
    id: string;
    code: string;
    title: string;
    modules: { id: string; title: string }[];
    active?: boolean;
  }>;
  onSaved?: () => void;
}

type AttendanceStatus = "present" | "absent" | "excused";

interface RosterStudent {
  id: string;
  fullName: string;
  studentNumber?: string | null;
  email?: string | null;
  status: string;
}

interface StudentsResponse {
  ok: boolean;
  students?: RosterStudent[];
  error?: string;
}

interface BulkSaveResponse {
  ok: boolean;
  saved?: number;
  skipped?: Array<{ studentId: string | null; reason: string }>;
  error?: string;
}

interface Entry {
  status: AttendanceStatus;
  notes: string;
}

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; color: string }[] = [
  { value: "present", label: "Present", color: "green" },
  { value: "absent", label: "Absent", color: "red" },
  { value: "excused", label: "Excused", color: "amber" },
];

const RADIO_COLOR_CLASS: Record<string, string> = {
  green:
    "data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500/5 [&_[data-slot=radio-group-indicator]_svg]:fill-green-500 [&_[data-slot=radio-group-indicator]_svg]:text-green-500",
  red: "data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500/5 [&_[data-slot=radio-group-indicator]_svg]:fill-red-500 [&_[data-slot=radio-group-indicator]_svg]:text-red-500",
  amber:
    "data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500/5 [&_[data-slot=radio-group-indicator]_svg]:fill-amber-500 [&_[data-slot=radio-group-indicator]_svg]:text-amber-500",
};

const LABEL_COLOR_CLASS: Record<string, string> = {
  green: "text-green-400",
  red: "text-red-400",
  amber: "text-amber-400",
};

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AttendanceBulkCapture({
  courses,
  onSaved,
}: AttendanceBulkCaptureProps) {
  const activeCourses = useMemo(
    () => courses.filter((c) => c.active !== false),
    [courses]
  );

  const [courseId, setCourseId] = useState<string>("");
  const [date, setDate] = useState<string>(todayISO());
  const [roster, setRoster] = useState<RosterStudent[] | null>(null);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    saved: number;
    skipped: number;
  } | null>(null);

  const loadRoster = useCallback(async () => {
    if (!courseId || !date) {
      setError("Please select both a course and a date.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    setRoster(null);
    setEntries({});
    try {
      const qs = `courseId=${encodeURIComponent(courseId)}`;
      const [enrolledRes, activeRes, completedRes] = await Promise.all([
        fetch(`/api/academy/students?${qs}&status=enrolled`),
        fetch(`/api/academy/students?${qs}&status=active`),
        fetch(`/api/academy/students?${qs}&status=completed`),
      ]);
      const [enrolled, active, completed]: StudentsResponse[] = await Promise.all(
        [enrolledRes.json(), activeRes.json(), completedRes.json()]
      );
      const seen = new Set<string>();
      const merged: RosterStudent[] = [];
      for (const list of [enrolled, active, completed]) {
        if (!list?.ok || !Array.isArray(list.students)) continue;
        for (const s of list.students) {
          if (!s || !s.id || seen.has(s.id)) continue;
          seen.add(s.id);
          merged.push({
            id: s.id,
            fullName: s.fullName,
            studentNumber: s.studentNumber,
            email: s.email,
            status: s.status,
          });
        }
      }
      merged.sort((a, b) => a.fullName.localeCompare(b.fullName));
      const initial: Record<string, Entry> = {};
      for (const s of merged) {
        initial[s.id] = { status: "present", notes: "" };
      }
      setEntries(initial);
      setRoster(merged);
    } catch {
      setError("Failed to load roster. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseId, date]);

  const markAll = (status: AttendanceStatus) => {
    if (!roster || roster.length === 0) return;
    setEntries((prev) => {
      const next: Record<string, Entry> = {};
      for (const s of roster) {
        next[s.id] = {
          status,
          notes: prev[s.id]?.notes ?? "",
        };
      }
      return next;
    });
  };

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        status,
        notes: prev[studentId]?.notes ?? "",
      },
    }));
  };

  const updateNotes = (studentId: string, notes: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status ?? "present",
        notes,
      },
    }));
  };

  const save = async () => {
    if (!roster || roster.length === 0) return;
    if (!date) {
      setError("Please choose a date.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const records = roster
        .map((s) => ({
          studentId: s.id,
          status: entries[s.id]?.status,
          notes: entries[s.id]?.notes ?? "",
        }))
        .filter((r) => !!r.status);
      if (records.length === 0) {
        setError("No attendance entries to save.");
        setSaving(false);
        return;
      }
      const res = await fetch("/api/academy/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk", date, records }),
      });
      const data: BulkSaveResponse = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to save attendance.");
        return;
      }
      setSuccess({
        saved: data.saved ?? 0,
        skipped: data.skipped?.length ?? 0,
      });
      onSaved?.();
    } catch {
      setError("Network error while saving attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="glass rounded-xl p-4 sm:p-5 border-brand/10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <Label className="text-text-muted text-xs mb-1.5 block">Course</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-full bg-dark-deep/60 border-dark-border/50 text-warm-white h-11">
                <SelectValue placeholder="Select course…" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border/50 text-warm-white">
                {activeCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <Label className="text-text-muted text-xs mb-1.5 block">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
            />
          </div>
          <Button
            onClick={loadRoster}
            disabled={!courseId || !date || loading}
            className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold h-11 px-5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </>
            ) : (
              <>
                <Users className="w-4 h-4" /> Load Roster
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
            <Check className="w-3 h-3" /> Saved {success.saved} records
          </Badge>
          {success.skipped > 0 && (
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">
              <AlertCircle className="w-3 h-3" /> {success.skipped} skipped
            </Badge>
          )}
        </div>
      )}

      {/* Empty state — pre-load */}
      {!roster && !loading && !error && (
        <div className="glass rounded-xl border-brand/10 p-8 text-center">
          <Calendar className="w-8 h-8 text-text-muted/50 mx-auto mb-3" />
          <p className="text-text-muted text-sm">
            Select a course and date to load the roster.
          </p>
        </div>
      )}

      {/* Roster table */}
      {roster && (
        <div className="space-y-3">
          {/* Quick actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => markAll("present")}
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
            >
              <Check className="w-3.5 h-3.5" /> Mark all present
            </Button>
            <Button
              onClick={() => markAll("absent")}
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <X className="w-3.5 h-3.5" /> Mark all absent
            </Button>
            <span className="text-text-muted text-xs ml-auto">
              {roster.length} student{roster.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="glass rounded-xl border-brand/10 overflow-hidden">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider hover:bg-transparent">
                  <TableHead className="text-left p-3">Student Name</TableHead>
                  <TableHead className="text-left p-3 hidden sm:table-cell">
                    Student #
                  </TableHead>
                  <TableHead className="text-left p-3 min-w-[260px]">
                    Status
                  </TableHead>
                  <TableHead className="text-left p-3 min-w-[160px]">
                    Notes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-text-muted p-8"
                    >
                      No enrolled students found for this course.
                    </TableCell>
                  </TableRow>
                )}
                {roster.map((s) => {
                  const entry = entries[s.id] ?? {
                    status: "present" as AttendanceStatus,
                    notes: "",
                  };
                  return (
                    <TableRow
                      key={s.id}
                      className="border-b border-dark-border/20 hover:bg-brand/5"
                    >
                      <TableCell className="p-3">
                        <div className="text-warm-white font-medium text-sm">
                          {s.fullName}
                        </div>
                        <div className="text-text-muted text-xs sm:hidden">
                          {s.studentNumber || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="p-3 hidden sm:table-cell text-text-muted text-xs font-mono">
                        {s.studentNumber || "—"}
                      </TableCell>
                      <TableCell className="p-3">
                        <RadioGroup
                          value={entry.status}
                          onValueChange={(v) =>
                            updateStatus(s.id, v as AttendanceStatus)
                          }
                          className="flex flex-row flex-wrap gap-3"
                        >
                          {STATUS_OPTIONS.map((opt) => {
                            const id = `${s.id}-${opt.value}`;
                            return (
                              <div
                                key={opt.value}
                                className="flex items-center gap-1.5"
                              >
                                <RadioGroupItem
                                  value={opt.value}
                                  id={id}
                                  className={RADIO_COLOR_CLASS[opt.color]}
                                />
                                <Label
                                  htmlFor={id}
                                  className={`text-xs cursor-pointer ${LABEL_COLOR_CLASS[opt.color]}`}
                                >
                                  {opt.label}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </TableCell>
                      <TableCell className="p-3">
                        <Input
                          value={entry.notes}
                          onChange={(e) => updateNotes(s.id, e.target.value)}
                          placeholder="Optional note…"
                          className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-9 text-sm"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Save button */}
          {roster.length > 0 && (
            <Button
              onClick={save}
              disabled={saving || !date}
              className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold h-11"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving attendance…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Attendance
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
