"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertCircle, Loader2, RotateCcw, Award } from "lucide-react";

interface AssessmentGradebookProps {
  courses: Array<{
    id: string;
    code: string;
    title: string;
    modules: { id: string; title: string }[];
    active?: boolean;
  }>;
}

interface ModuleRow {
  id: string;
  title: string;
}

interface StudentRow {
  id: string;
  fullName: string;
  studentNumber: string | null;
  email: string;
  status: string;
  progress: number;
}

interface Cell {
  result: string;
  mark: string | null;
  date: string;
  comments: string | null;
}

interface MatrixRow {
  student: StudentRow;
  cells: Record<string, Cell | null>;
}

interface Summary {
  totalStudents: number;
  totalModules: number;
  passRate: number;
  competentCells: number;
  totalCells: number;
}

interface GradebookResponse {
  ok: boolean;
  course?: { id: string; code: string; title: string };
  students?: StudentRow[];
  modules?: ModuleRow[];
  matrix?: MatrixRow[];
  summary?: Summary;
  error?: string;
}

interface AssessmentResponse {
  ok: boolean;
  assessment?: { id: string };
  error?: string;
}

type ResultValue = "pass" | "not-yet-competent";

function passRateFor(cells: Record<string, Cell | null>, modules: ModuleRow[]): number {
  if (modules.length === 0) return 0;
  const competent = modules.filter(
    (m) => cells[m.title]?.result === "pass"
  ).length;
  return Math.round((competent / modules.length) * 100);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

// ── Cell renderer with popover form for add/update assessment ──
function CellButton({
  cell,
  studentId,
  moduleTitle,
  onSaved,
}: {
  cell: Cell | null;
  studentId: string;
  moduleTitle: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ResultValue>(
    cell?.result === "not-yet-competent" ? "not-yet-competent" : "pass"
  );
  const [mark, setMark] = useState<string>(cell?.mark ?? "");
  const [comments, setComments] = useState<string>(cell?.comments ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Resync when cell reference changes (after refetch)
  useEffect(() => {
    setResult(cell?.result === "not-yet-competent" ? "not-yet-competent" : "pass");
    setMark(cell?.mark ?? "");
    setComments(cell?.comments ?? "");
    setErr(null);
  }, [cell]);

  const submit = async () => {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/academy/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          moduleTitle,
          result,
          mark: mark.trim() || undefined,
          comments: comments.trim() || undefined,
        }),
      });
      const data: AssessmentResponse = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data.error || "Failed to save assessment.");
        return;
      }
      setOpen(false);
      onSaved();
    } catch {
      setErr("Network error while saving assessment.");
    } finally {
      setSaving(false);
    }
  };

  const tooltip = cell
    ? `${cell.result} • ${formatDate(cell.date)}${cell.mark ? ` • ${cell.mark}` : ""}${cell.comments ? ` • ${cell.comments}` : ""}`
    : `Add assessment for ${moduleTitle}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={tooltip}
          className="w-full h-9 rounded hover:bg-brand/10 transition-colors flex items-center justify-center cursor-pointer"
        >
          {cell ? (
            cell.result === "pass" ? (
              <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
                P
              </Badge>
            ) : (
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">
                NYC
              </Badge>
            )
          ) : (
            <span className="text-text-muted text-sm">—</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-dark-card border-dark-border/50 text-warm-white w-72 p-4"
        align="center"
      >
        <div className="space-y-3">
          <div>
            <div className="text-warm-white font-semibold text-sm">
              {moduleTitle}
            </div>
            <div className="text-text-muted text-xs">
              {cell ? "Update assessment" : "Add assessment"}
            </div>
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">
              Result
            </Label>
            <Select
              value={result}
              onValueChange={(v) => setResult(v as ResultValue)}
            >
              <SelectTrigger className="w-full bg-dark-deep/60 border-dark-border/50 text-warm-white h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border/50 text-warm-white">
                <SelectItem value="pass">Pass (Competent)</SelectItem>
                <SelectItem value="not-yet-competent">
                  Not Yet Competent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">
              Mark (optional)
            </Label>
            <Input
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              placeholder="e.g. 85%"
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-9"
            />
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">
              Comments
            </Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
              placeholder="Trainer comments…"
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white resize-none text-sm min-h-[60px]"
            />
          </div>
          {cell && (
            <div className="text-text-muted text-[10px] border-t border-dark-border/30 pt-2">
              Last: {formatDate(cell.date)}
            </div>
          )}
          {err && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              {err}
            </p>
          )}
          <Button
            onClick={submit}
            disabled={saving}
            className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : cell ? (
              "Update Assessment"
            ) : (
              "Add Assessment"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function AssessmentGradebook({ courses }: AssessmentGradebookProps) {
  const activeCourses = useMemo(
    () => courses.filter((c) => c.active !== false),
    [courses]
  );

  const [courseId, setCourseId] = useState<string>(activeCourses[0]?.id ?? "");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [matrix, setMatrix] = useState<MatrixRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGradebook = useCallback(async (id: string) => {
    if (!id) {
      setStudents([]);
      setModules([]);
      setMatrix([]);
      setSummary(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/academy/assessments?courseId=${encodeURIComponent(id)}`
      );
      const data: GradebookResponse = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to load gradebook.");
        setStudents([]);
        setModules([]);
        setMatrix([]);
        setSummary(null);
        return;
      }
      setStudents(data.students ?? []);
      setModules(data.modules ?? []);
      setMatrix(data.matrix ?? []);
      setSummary(data.summary ?? null);
    } catch {
      setError("Network error while loading gradebook.");
      setStudents([]);
      setModules([]);
      setMatrix([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (courseId) loadGradebook(courseId);
  }, [courseId, loadGradebook]);

  const matrixByStudent = useMemo(() => {
    const map = new Map<string, MatrixRow>();
    for (const row of matrix) map.set(row.student.id, row);
    return map;
  }, [matrix]);

  return (
    <div className="space-y-4">
      {/* Course selector */}
      <div className="glass rounded-xl p-4 sm:p-5 border-brand/10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-text-muted text-xs mb-1.5 block">
              Course
            </Label>
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
          {error && (
            <Button
              onClick={() => loadGradebook(courseId)}
              variant="outline"
              className="border-brand/30 text-brand hover:bg-brand/10 h-11"
            >
              <RotateCcw className="w-4 h-4" /> Try again
            </Button>
          )}
        </div>
      </div>

      {error && !courseId && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Gradebook table */}
      <div className="glass rounded-xl border-brand/10 overflow-hidden">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider hover:bg-transparent">
              <TableHead className="text-left p-3 sticky left-0 bg-dark-card z-10 min-w-[180px]">
                Student
              </TableHead>
              {modules.map((m) => (
                <TableHead
                  key={m.id}
                  className="text-center p-3 min-w-[80px] max-w-[120px] truncate"
                  title={m.title}
                >
                  <span className="block truncate">{m.title}</span>
                </TableHead>
              ))}
              <TableHead className="text-center p-3 min-w-[80px] sticky right-0 bg-dark-card z-10">
                Pass Rate
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="border-b border-dark-border/20">
                  <TableCell className="p-3 sticky left-0 bg-dark-card z-10">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  {modules.length > 0 ? (
                    modules.map((m, j) => (
                      <TableCell key={`${m.id}-${j}`} className="p-3 text-center">
                        <Skeleton className="h-6 w-8 mx-auto rounded-full" />
                      </TableCell>
                    ))
                  ) : (
                    <TableCell className="p-3 text-center">
                      <Skeleton className="h-6 w-8 mx-auto rounded-full" />
                    </TableCell>
                  )}
                  <TableCell className="p-3 text-center sticky right-0 bg-dark-card z-10">
                    <Skeleton className="h-6 w-12 mx-auto" />
                  </TableCell>
                </TableRow>
              ))}

            {!loading && !error && students.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={Math.max(modules.length, 1) + 2}
                  className="text-center text-text-muted p-8"
                >
                  <Award className="w-8 h-8 text-text-muted/50 mx-auto mb-3" />
                  <p className="text-sm">
                    No students enrolled in this course yet.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              students.map((student) => {
                const row = matrixByStudent.get(student.id);
                const cells = row?.cells ?? {};
                const rate = passRateFor(cells, modules);
                const rateColor =
                  rate >= 75
                    ? "text-green-400"
                    : rate >= 50
                      ? "text-yellow-400"
                      : "text-red-400";
                return (
                  <TableRow
                    key={student.id}
                    className="border-b border-dark-border/20 hover:bg-brand/5"
                  >
                    <TableCell className="p-3 sticky left-0 bg-dark-card z-10">
                      <div className="text-warm-white font-medium text-sm">
                        {student.fullName}
                      </div>
                      <div className="text-text-muted text-xs font-mono">
                        {student.studentNumber || "—"}
                      </div>
                    </TableCell>
                    {modules.length === 0 && (
                      <TableCell className="p-3 text-center text-text-muted text-xs">
                        No modules
                      </TableCell>
                    )}
                    {modules.map((m) => {
                      const cell = cells[m.title] ?? null;
                      return (
                        <TableCell key={m.id} className="p-3 text-center">
                          <CellButton
                            cell={cell}
                            studentId={student.id}
                            moduleTitle={m.title}
                            onSaved={() => loadGradebook(courseId)}
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell className="p-3 text-center sticky right-0 bg-dark-card z-10">
                      <span className={`text-sm font-bold ${rateColor}`}>
                        {rate}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {summary && !loading && !error && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-4 border-brand/10">
            <div className="text-text-muted text-xs mb-1">Total Students</div>
            <div className="text-warm-white text-2xl font-bold">
              {summary.totalStudents}
            </div>
          </div>
          <div className="glass rounded-xl p-4 border-brand/10">
            <div className="text-text-muted text-xs mb-1">Total Modules</div>
            <div className="text-warm-white text-2xl font-bold">
              {summary.totalModules}
            </div>
          </div>
          <div className="glass rounded-xl p-4 border-brand/10">
            <div className="text-text-muted text-xs mb-1">Overall Pass Rate</div>
            <div
              className={`text-2xl font-bold ${
                summary.passRate >= 75
                  ? "text-green-400"
                  : summary.passRate >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {summary.passRate}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
