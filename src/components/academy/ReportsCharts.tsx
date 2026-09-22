"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  RefreshCw,
  Users,
  type LucideIcon,
} from "lucide-react";

interface ReportsChartsProps {
  /** Optional: stats pre-fetched by the parent. If not provided, fetch internally. */
  stats?: Record<string, number>;
}

interface TrendPoint {
  month: string; // "YYYY-MM"
  count: number;
}

interface TopCourse {
  courseId: string;
  title: string;
  code: string;
  enrolled: number;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  excused: number;
  rate: number;
}

interface AssessmentSummary {
  pass: number;
  "not-yet-competent": number;
  rate: number;
}

interface ReportsData {
  ok: boolean;
  stats: Record<string, number>;
  trends: {
    enrollments: TrendPoint[];
    completions: TrendPoint[];
    applications: TrendPoint[];
    certificates: TrendPoint[];
  };
  statusBreakdown: Record<string, number>;
  topCourses: TopCourse[];
  attendanceSummary: AttendanceSummary;
  assessmentSummary: AssessmentSummary;
}

// ─── Visual constants ───
const BRAND_NAVY = "#1e3a5f";
const ACCENT_TEAL = "#14b8a6";
const AXIS_COLOR = "#9ca3af";
const GRID_COLOR = "#1f2937";

// Status → hex color mapping (mirrors the admin page's badge palette intent).
const STATUS_HEX_COLORS: Record<string, string> = {
  applied: "#eab308",
  "under-review": "#3b82f6",
  "info-required": "#f97316",
  accepted: "#06b6d4",
  enrolled: "#6366f1",
  active: "#22c55e",
  completed: "#10b981",
  rejected: "#ef4444",
  withdrawn: "#9ca3af",
  deferred: "#a855f7",
  terminated: "#6b7280",
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Format a "YYYY-MM" month key as "MMM YY" (e.g. "Sep 24"). */
function formatMonth(key: string): string {
  const [year, month] = key.split("-");
  const m = parseInt(month ?? "", 10);
  if (!m || m < 1 || m > 12) return key;
  return `${MONTH_NAMES[m - 1]} ${year?.slice(2) ?? ""}`;
}

/** Humanize a status slug ("under-review" → "Under Review"). */
function humanizeStatus(status: string): string {
  return status
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Truncate a string to `max` chars, appending an ellipsis if cut. */
function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

// ─── Custom tooltip (typed, no `any`) ───
interface TooltipItem {
  name?: string | number;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string | number;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-dark-card/95 backdrop-blur-sm border border-dark-border/60 rounded-lg px-3 py-2 text-xs shadow-xl">
      {label !== undefined && label !== "" && (
        <div className="text-warm-white font-semibold mb-1">{String(label)}</div>
      )}
      <div className="space-y-1">
        {payload.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-sm flex-shrink-0"
              style={{ backgroundColor: item.color || "#9ca3af" }}
            />
            <span className="text-text-muted">{item.name}</span>
            <span className="text-warm-white font-medium ml-auto tabular-nums">
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI card ───
interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  from: string;
  to: string;
}

function KpiCard({ label, value, icon: Icon, from, to }: KpiCardProps) {
  return (
    <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{
                backgroundImage: `linear-gradient(to right, ${from}, ${to})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {value}
            </div>
            <div className="text-text-muted text-xs sm:text-sm mt-1 truncate">
              {label}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-brand-light" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Skeleton card (loading shimmer) ───
function SkeletonCard() {
  return (
    <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50">
      <CardContent className="p-4 sm:p-6">
        <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse mb-4" />
        <div className="h-[250px] w-full bg-white/5 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

// ─── Main component ───
export default function ReportsCharts({ stats }: ReportsChartsProps) {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState<boolean>(!stats);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/reports", { cache: "no-store" });
      const text = await res.text();
      if (!text) throw new Error("Server returned an empty response.");
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("Server returned invalid JSON.");
      }
      if (!res.ok) {
        const errObj = json as { error?: string };
        throw new Error(errObj.error || `Request failed (${res.status}).`);
      }
      const reportsData = json as ReportsData;
      if (!reportsData.ok) {
        throw new Error("Reports endpoint returned ok=false.");
      }
      setData(reportsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If parent supplied stats, we don't fetch (per spec).
    if (stats) return;
    fetchData();
  }, [stats, fetchData]);

  // ─── KPI values: prefer parent stats, fall back to fetched data ───
  const statsBlock = stats ?? data?.stats ?? {};
  const enrolledStudents = Number(statsBlock.enrolledStudents ?? 0);
  const activeStudents = Number(statsBlock.activeStudents ?? 0);
  const completedStudents = Number(statsBlock.completedStudents ?? 0);
  const totalStudents = enrolledStudents + activeStudents + completedStudents;
  const completionRate = totalStudents > 0
    ? Number(((completedStudents / totalStudents) * 100).toFixed(1))
    : 0;
  const attendanceRate = data?.attendanceSummary.rate ?? 0;
  const assessmentRate = data?.assessmentSummary.rate ?? 0;

  const kpis: KpiCardProps[] = [
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: Users,
      from: "#1e3a5f",
      to: "#4fb0ff",
    },
    {
      label: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      icon: CheckCircle,
      from: "#10b981",
      to: "#14b8a6",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate.toFixed(1)}%`,
      icon: Calendar,
      from: "#06b6d4",
      to: "#3b82f6",
    },
    {
      label: "Assessment Pass Rate",
      value: `${assessmentRate.toFixed(1)}%`,
      icon: Award,
      from: "#f59e0b",
      to: "#f97316",
    },
  ];

  // ─── Chart datasets (only when data is present) ───
  const trendData = data
    ? data.trends.enrollments.map((p, i) => ({
        month: formatMonth(p.month),
        Enrolments: p.count,
        Completions: data.trends.completions[i]?.count ?? 0,
      }))
    : [];

  const statusData = data
    ? Object.entries(data.statusBreakdown)
        .filter(([, c]) => c > 0)
        .map(([status, count]) => ({
          status: humanizeStatus(status),
          count,
          fill: STATUS_HEX_COLORS[status] || BRAND_NAVY,
        }))
    : [];

  const topCoursesData = data
    ? data.topCourses.map(c => ({
        name: truncate(c.title || c.code || "Untitled", 18),
        enrolled: c.enrolled,
      }))
    : [];

  const attendanceData = data
    ? [
        { name: "Present", value: data.attendanceSummary.present, color: "#10b981" },
        { name: "Absent", value: data.attendanceSummary.absent, color: "#ef4444" },
        { name: "Excused", value: data.attendanceSummary.excused, color: "#f59e0b" },
      ]
    : [];

  // ─── Error state ───
  if (error) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-xl p-6 border border-red-500/30 bg-red-500/5 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-semibold mb-1">Failed to load reports</p>
          <p className="text-text-muted text-sm mb-4">{error}</p>
          <Button
            onClick={fetchData}
            className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map(k => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : !data ? (
          <Card className="sm:col-span-2 bg-dark-card/80 backdrop-blur-sm border-dark-border/50">
            <CardContent className="p-6 text-center text-text-muted text-sm">
              No reports data available.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ── Chart 1: Enrolments vs Completions (LineChart) ── */}
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-warm-white font-semibold text-sm mb-4">
                  Enrolments vs Completions (last 12 months)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      stroke={GRID_COLOR}
                      strokeOpacity={0.3}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                      stroke={AXIS_COLOR}
                      angle={-25}
                      textAnchor="end"
                      height={50}
                      interval={0}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                      stroke={AXIS_COLOR}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: AXIS_COLOR }}
                      iconType="circle"
                    />
                    <Line
                      type="monotone"
                      dataKey="Enrolments"
                      stroke={BRAND_NAVY}
                      strokeWidth={2}
                      dot={{ r: 3, fill: BRAND_NAVY }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Completions"
                      stroke={ACCENT_TEAL}
                      strokeWidth={2}
                      dot={{ r: 3, fill: ACCENT_TEAL }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ── Chart 2: Status Distribution (horizontal BarChart) ── */}
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-warm-white font-semibold text-sm mb-4">
                  Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={statusData}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      stroke={GRID_COLOR}
                      strokeOpacity={0.3}
                      strokeDasharray="3 3"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                      stroke={AXIS_COLOR}
                    />
                    <YAxis
                      type="category"
                      dataKey="status"
                      tick={{ fill: AXIS_COLOR, fontSize: 10 }}
                      stroke={AXIS_COLOR}
                      width={90}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ── Chart 3: Top Courses by Enrolment (vertical BarChart) ── */}
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-warm-white font-semibold text-sm mb-4">
                  Top Courses by Enrolment
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={topCoursesData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      stroke={GRID_COLOR}
                      strokeOpacity={0.3}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: AXIS_COLOR, fontSize: 10 }}
                      stroke={AXIS_COLOR}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                      stroke={AXIS_COLOR}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar
                      dataKey="enrolled"
                      fill={BRAND_NAVY}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ── Chart 4: Attendance Summary (donut PieChart) ── */}
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-warm-white font-semibold text-sm mb-4">
                  Attendance Summary (last 30 days)
                </h3>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {attendanceData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: AXIS_COLOR }}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center text overlay (aligned to pie center, offset for legend below) */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    style={{ paddingBottom: "32px" }}
                  >
                    <div className="text-2xl font-bold text-warm-white">
                      {attendanceRate.toFixed(1)}%
                    </div>
                    <div className="text-text-muted text-[10px] uppercase tracking-wide">
                      attendance
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
