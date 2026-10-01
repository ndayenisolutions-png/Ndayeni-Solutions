"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export interface AuditLogViewerProps {
  /** Optional initial studentId filter — pre-fills the Student ID input + active filter. */
  studentId?: string;
  /** Optional initial userId filter — pre-fills the User ID input + active filter. */
  userId?: string;
}

// ─── Types ───
// Mirrors the AuditLog Prisma model as serialized to JSON by /api/academy/audit.
// `timestamp` arrives as an ISO 8601 string; `userId`/`studentId`/`details` are nullable.
interface AuditLogEntry {
  id: string;
  userId: string | null;
  studentId: string | null;
  action: string;
  details: string | null;
  timestamp: string;
}

interface AuditResponse {
  ok?: boolean;
  logs?: AuditLogEntry[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  error?: string;
}

// ─── Helpers ───

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Format an ISO timestamp as "22 Sep 2025, 14:32" (local time, like the rest
 * of the admin page which uses `new Date(s.createdAt)` directly).
 */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hh}:${mm}`;
}

/** Truncate to 100 chars with an ellipsis; null → em dash for table display. */
function truncate(text: string | null, max = 100): string {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/**
 * Action-prefix → badge color. Matches the existing admin page's status color
 * palette (bg-xxx-500/15 text-xxx-400 border-xxx-500/30 pattern).
 *  student.*       → blue
 *  certificate.*   → purple
 *  attendance.*    → green
 *  assessment.*    → amber
 *  user.*          → red
 *  welcome_letter.*→ teal
 *  default         → gray
 */
function actionBadgeClass(action: string): string {
  if (action.startsWith("student.")) {
    return "bg-blue-500/15 text-blue-400 border-blue-500/30 font-mono";
  }
  if (action.startsWith("certificate.")) {
    return "bg-purple-500/15 text-purple-400 border-purple-500/30 font-mono";
  }
  if (action.startsWith("attendance.")) {
    return "bg-green-500/15 text-green-400 border-green-500/30 font-mono";
  }
  if (action.startsWith("assessment.")) {
    return "bg-amber-500/15 text-amber-400 border-amber-500/30 font-mono";
  }
  if (action.startsWith("user.")) {
    return "bg-red-500/15 text-red-400 border-red-500/30 font-mono";
  }
  if (action.startsWith("welcome_letter.")) {
    return "bg-teal-500/15 text-teal-400 border-teal-500/30 font-mono";
  }
  return "bg-gray-500/15 text-gray-400 border-gray-500/30 font-mono";
}

// ─── Component ───

export default function AuditLogViewer({
  studentId,
  userId,
}: AuditLogViewerProps) {
  // Active filters (sent to the API)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [actionFilter, setActionFilter] = useState("");
  const [studentIdFilter, setStudentIdFilter] = useState(studentId ?? "");
  const [userIdFilter, setUserIdFilter] = useState(userId ?? "");

  // Draft filters (controlled inputs — only promoted to active on Apply)
  const [actionDraft, setActionDraft] = useState("");
  const [studentIdDraft, setStudentIdDraft] = useState(studentId ?? "");
  const [userIdDraft, setUserIdDraft] = useState(userId ?? "");

  // Data + UI state
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (actionFilter) params.set("action", actionFilter);
      if (studentIdFilter) params.set("studentId", studentIdFilter);
      if (userIdFilter) params.set("userId", userIdFilter);
      const res = await fetch(`/api/academy/audit?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load audit logs (HTTP ${res.status}).`);
      }
      const text = await res.text();
      if (!text) {
        setLogs([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }
      const data = JSON.parse(text) as AuditResponse;
      if (!data.ok) {
        throw new Error(data.error || "Failed to load audit logs.");
      }
      setLogs(data.logs ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs.");
      setLogs([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, actionFilter, studentIdFilter, userIdFilter]);

  // Auto-load on mount (with any prefilled studentId/userId applied) and re-fetch
  // whenever the active filters / pagination change.
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const applyFilters = () => {
    setActionFilter(actionDraft.trim());
    setStudentIdFilter(studentIdDraft.trim());
    setUserIdFilter(userIdDraft.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setActionDraft("");
    setStudentIdDraft("");
    setUserIdDraft("");
    setActionFilter("");
    setStudentIdFilter("");
    setUserIdFilter("");
    setPage(1);
  };

  const handlePageSizeChange = (val: string) => {
    setPageSize(Number(val));
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="glass rounded-xl p-4 sm:p-5 border-brand/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Action</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50 pointer-events-none" />
              <Input
                value={actionDraft}
                onChange={(e) => setActionDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
                placeholder="e.g. student.update"
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white pl-10 h-10 font-mono text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Student ID</Label>
            <Input
              value={studentIdDraft}
              onChange={(e) => setStudentIdDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              placeholder="Filter by student ID"
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-10 font-mono text-xs"
            />
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">User ID</Label>
            <Input
              value={userIdDraft}
              onChange={(e) => setUserIdDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              placeholder="Filter by user ID"
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-10 font-mono text-xs"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={applyFilters}
            className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold h-10 px-4"
          >
            <Search className="w-3.5 h-3.5" /> Apply Filters
          </Button>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="bg-dark-deep/60 border-dark-border/50 text-warm-white hover:bg-white/5 h-10"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table card */}
      <div className="glass rounded-xl border-brand/10 overflow-hidden">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider hover:bg-transparent">
              <TableHead className="text-left p-3 whitespace-nowrap">Timestamp</TableHead>
              <TableHead className="text-left p-3 whitespace-nowrap">Action</TableHead>
              <TableHead className="text-left p-3">Details</TableHead>
              <TableHead className="text-left p-3 whitespace-nowrap">User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={`skel-${i}`} className="border-b border-dark-border/20">
                  <TableCell className="p-3">
                    <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-5 w-28 bg-white/5 rounded-full animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-4 w-full max-w-md bg-white/5 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}

            {!loading && logs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-text-muted p-8"
                >
                  No audit log entries match these filters.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-b border-dark-border/20 hover:bg-brand/5"
                >
                  <TableCell className="p-3 text-warm-white text-xs whitespace-nowrap font-mono">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge className={actionBadgeClass(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="p-3 text-text-muted text-xs max-w-md truncate"
                    title={log.details ?? undefined}
                  >
                    {truncate(log.details)}
                  </TableCell>
                  <TableCell className="p-3 text-warm-white text-xs font-mono">
                    {log.userId ?? "System"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-dark-border/30">
            <div className="text-text-muted text-xs">
              Page <span className="text-warm-white font-semibold">{page}</span>{" "}
              of{" "}
              <span className="text-warm-white font-semibold">
                {Math.max(totalPages, 1)}
              </span>
              <span className="mx-2 text-text-muted/40">·</span>
              <span>
                {total} {total === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-xs">Rows</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger
                    size="sm"
                    className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-8 w-20"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-card border-dark-border/50 text-warm-white">
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white hover:bg-white/5 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white hover:bg-white/5 disabled:opacity-40"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
