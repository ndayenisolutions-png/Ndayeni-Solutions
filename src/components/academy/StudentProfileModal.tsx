"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  RefreshCw,
  Shield,
  User,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import WelcomeLetterButton from "./WelcomeLetterButton";

// ─── Types ───

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: string; // present | absent | excused
  notes: string | null;
  createdAt: string;
}

interface AssessmentRecord {
  id: string;
  studentId: string;
  moduleTitle: string;
  date: string;
  result: string; // pass | not-yet-competent
  mark: string | null;
  comments: string | null;
  createdAt: string;
}

interface CertificateRecord {
  id: string;
  studentId: string;
  programName: string;
  studentName: string;
  idNumber: string | null;
  issueDate: string;
  certificateNumber: string;
  signedBy: string | null;
  status: string; // active | revoked | reissued | replaced
}

interface AuditLogRecord {
  id: string;
  userId: string | null;
  studentId: string | null;
  action: string;
  details: string | null;
  timestamp: string;
}

interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  duration: string | null;
  order: number;
  learningObjectives: string | null;
  active: boolean;
}

interface CourseInfo {
  id: string;
  code: string;
  title: string;
  description: string;
  duration: string;
  deliveryMethod: string;
  entryRequirements: string | null;
  fee: string | null;
  active: boolean;
  maxStudents: number | null;
  createdAt: string;
  modules: CourseModule[];
}

interface StudentProfile {
  id: string;
  studentNumber: string | null;
  applicationRef: string | null;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  nationality: string | null;
  address: string | null;
  selectedCourses: string | null;
  courseId: string | null;
  preferredStartDate: string | null;
  preferredMode: string | null;
  highestEducation: string | null;
  employmentStatus: string | null;
  previousTraining: string | null;
  relevantExperience: string | null;
  nextOfKinName: string | null;
  nextOfKinRelationship: string | null;
  nextOfKinPhone: string | null;
  nextOfKinEmail: string | null;
  intake: string | null;
  enrolledAt: string | null;
  trainingStartDate: string | null;
  expectedCompletion: string | null;
  program: string;
  message: string | null;
  termsAgreed: boolean;
  status: string;
  progress: number;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  certificates: CertificateRecord[];
  attendances: AttendanceRecord[];
  assessments: AssessmentRecord[];
  auditLogs: AuditLogRecord[];
  // Computed fields (added by the GET ?id=X branch in students/route.ts)
  attendanceRate: number;
  passRate: number;
  certificateNumber: string | null;
  enrolledDays: number | null;
  expectedCompletionDays: number | null;
}

interface StudentProfileResponse {
  ok: boolean;
  student?: StudentProfile;
  course?: CourseInfo | null;
  error?: string;
}

export interface StudentProfileModalProps {
  studentId: string | null; // when non-null, modal opens
  onClose: () => void; // sets studentId to null in parent
  onEdit?: (student: StudentProfile) => void;
}

// ─── Status color maps (mirror the existing admin/page.tsx maps) ───

const statusColors: Record<string, string> = {
  applied: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "under-review": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "info-required": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  accepted: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  enrolled: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  active: "bg-green-500/15 text-green-400 border-green-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
  withdrawn: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  deferred: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const attendanceStatusColors: Record<string, string> = {
  present: "bg-green-500/15 text-green-400 border-green-500/30",
  absent: "bg-red-500/15 text-red-400 border-red-500/30",
  excused: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const assessmentResultColors: Record<string, string> = {
  pass: "bg-green-500/15 text-green-400 border-green-500/30",
  "not-yet-competent": "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const certificateStatusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  revoked: "bg-red-500/15 text-red-400 border-red-500/30",
  reissued: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  replaced: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

// ─── Helpers ───

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function display(value: string | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : "—";
}

// ─── Reusable bits ───

function StatCard({
  label,
  value,
  icon: Icon,
  accent = "text-brand",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-muted text-xs">{label}</span>
          <Icon className={`w-4 h-4 ${accent}`} />
        </div>
        <div className="text-warm-white font-semibold text-lg break-words">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-text-muted text-[10px] uppercase tracking-wider">
        {label}
      </dt>
      <dd className="text-warm-white text-sm break-words">{display(value)}</dd>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-2">
        <AlertCircle className="w-8 h-8 text-text-muted" />
        <p className="text-text-muted text-sm">{message}</p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full bg-dark-deep/60" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/2 bg-dark-deep/60" />
          <Skeleton className="h-3 w-1/3 bg-dark-deep/60" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl bg-dark-deep/60" />
        ))}
      </div>
    </div>
  );
}

// ─── Tabs ───

function OverviewTab({
  student,
  course,
  statusClass,
}: {
  student: StudentProfile;
  course: CourseInfo | null;
  statusClass: string;
}) {
  const stats: { label: string; value: string; icon: LucideIcon; accent?: string }[] = [
    { label: "Progress", value: `${student.progress}%`, icon: BarChart3, accent: "text-brand" },
    { label: "Attendance Rate", value: `${student.attendanceRate}%`, icon: Calendar, accent: "text-green-400" },
    { label: "Pass Rate", value: `${student.passRate}%`, icon: Award, accent: "text-emerald-400" },
    { label: "Certificate No.", value: student.certificateNumber ?? "—", icon: FileText, accent: "text-brand-light" },
    {
      label: "Enrolled Days",
      value: student.enrolledDays != null ? String(student.enrolledDays) : "—",
      icon: Clock,
      accent: "text-cyan-400",
    },
    {
      label: "Expected Completion",
      value:
        student.expectedCompletionDays != null
          ? `${student.expectedCompletionDays} days`
          : "—",
      icon: Clock,
      accent: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="text-warm-white font-bold text-lg break-words">
                {student.fullName}
              </div>
              <div className="text-text-muted text-xs">
                {student.studentNumber
                  ? `Student No: ${student.studentNumber}`
                  : "No student number assigned"}
                {student.applicationRef && ` · App Ref: ${student.applicationRef}`}
              </div>
            </div>
            <Badge className={`border ${statusClass} capitalize`}>
              {student.status}
            </Badge>
          </div>
          <div className="text-text-muted text-sm">
            Program:{" "}
            <span className="text-warm-white font-medium">{student.program}</span>
            {course && (
              <>
                {" · "}Course:{" "}
                <span className="text-warm-white font-medium">{course.title}</span>
              </>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Progress</span>
              <span className="text-warm-white font-medium">
                {student.progress}%
              </span>
            </div>
            <div className="h-2 bg-dark-deep/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-700"
                style={{ width: `${Math.max(0, Math.min(100, student.progress))}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            accent={s.accent}
          />
        ))}
      </div>
    </div>
  );
}

function PersonalTab({ student }: { student: StudentProfile }) {
  return (
    <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
      <CardContent className="p-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Full Name" value={student.fullName} />
          <InfoRow label="Email" value={student.email} />
          <InfoRow label="Phone" value={student.phone} />
          <InfoRow label="ID Number" value={student.idNumber} />
          <InfoRow label="Date of Birth" value={student.dateOfBirth} />
          <InfoRow label="Gender" value={student.gender} />
          <InfoRow label="Nationality" value={student.nationality} />
          <InfoRow label="Address" value={student.address} />
        </dl>
      </CardContent>
    </Card>
  );
}

function EducationTab({ student }: { student: StudentProfile }) {
  return (
    <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
      <CardContent className="p-4">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Highest Education" value={student.highestEducation} />
          <InfoRow label="Employment Status" value={student.employmentStatus} />
          <InfoRow label="Previous Training" value={student.previousTraining} />
          <InfoRow label="Relevant Experience" value={student.relevantExperience} />
          <InfoRow label="Next of Kin Name" value={student.nextOfKinName} />
          <InfoRow label="Next of Kin Relationship" value={student.nextOfKinRelationship} />
          <InfoRow label="Next of Kin Phone" value={student.nextOfKinPhone} />
          <InfoRow label="Next of Kin Email" value={student.nextOfKinEmail} />
        </dl>
      </CardContent>
    </Card>
  );
}

function CourseTab({
  student,
  course,
}: {
  student: StudentProfile;
  course: CourseInfo | null;
}) {
  return (
    <div className="space-y-4">
      <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
        <CardContent className="p-4">
          <h3 className="text-warm-white font-semibold text-sm mb-3">
            Course Information
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow label="Program" value={student.program} />
            <InfoRow label="Course Title" value={course?.title ?? null} />
            <InfoRow label="Course Code" value={course?.code ?? null} />
            <InfoRow label="Duration" value={course?.duration ?? null} />
            <InfoRow label="Delivery Method" value={course?.deliveryMethod ?? null} />
            <InfoRow label="Entry Requirements" value={course?.entryRequirements ?? null} />
            <InfoRow label="Preferred Start Date" value={student.preferredStartDate} />
            <InfoRow label="Preferred Mode" value={student.preferredMode} />
            <InfoRow label="Intake" value={student.intake} />
            <InfoRow label="Enrolled At" value={formatDate(student.enrolledAt)} />
            <InfoRow label="Training Start Date" value={formatDate(student.trainingStartDate)} />
            <InfoRow label="Expected Completion" value={formatDate(student.expectedCompletion)} />
            <InfoRow label="Completed At" value={formatDate(student.completedAt)} />
          </dl>
        </CardContent>
      </Card>

      {course && course.modules.length > 0 && (
        <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
          <CardContent className="p-4">
            <h3 className="text-warm-white font-semibold text-sm mb-3">
              Course Modules
            </h3>
            <ol className="space-y-1">
              {course.modules.map((m, i) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-dark-border/30 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand/15 text-brand flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-warm-white text-sm font-medium">
                        {m.title}
                      </div>
                      {m.description && (
                        <div className="text-text-muted text-xs mt-0.5">
                          {m.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {m.duration && (
                    <Badge className="bg-dark-deep/60 border-dark-border/50 text-text-muted">
                      {m.duration}
                    </Badge>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AttendanceTab({ student }: { student: StudentProfile }) {
  if (student.attendances.length === 0) {
    return <EmptyState message="No attendance records yet." />;
  }

  return (
    <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-warm-white font-semibold text-sm">
            Recent Attendance
          </h3>
          <span className="text-text-muted text-xs">
            Last {student.attendances.length} records
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-dark-border/40 hover:bg-transparent">
              <TableHead className="text-text-muted text-xs">Date</TableHead>
              <TableHead className="text-text-muted text-xs">Status</TableHead>
              <TableHead className="text-text-muted text-xs">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.attendances.map((a) => {
              const cls =
                attendanceStatusColors[a.status] ||
                "bg-dark-border/50 text-text-muted border-dark-border/50";
              return (
                <TableRow key={a.id} className="border-dark-border/30">
                  <TableCell className="text-warm-white text-sm whitespace-nowrap">
                    {formatDate(a.date)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${cls} capitalize`}>{a.status}</Badge>
                  </TableCell>
                  <TableCell className="text-text-muted text-sm max-w-xs break-words">
                    {display(a.notes)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AssessmentsTab({ student }: { student: StudentProfile }) {
  if (student.assessments.length === 0) {
    return <EmptyState message="No assessment records yet." />;
  }

  return (
    <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-warm-white font-semibold text-sm">
            Recent Assessments
          </h3>
          <span className="text-text-muted text-xs">
            Last {student.assessments.length} records
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-dark-border/40 hover:bg-transparent">
              <TableHead className="text-text-muted text-xs">Module</TableHead>
              <TableHead className="text-text-muted text-xs">Date</TableHead>
              <TableHead className="text-text-muted text-xs">Result</TableHead>
              <TableHead className="text-text-muted text-xs">Mark</TableHead>
              <TableHead className="text-text-muted text-xs">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.assessments.map((a) => {
              const cls =
                assessmentResultColors[a.result] ||
                "bg-dark-border/50 text-text-muted border-dark-border/50";
              return (
                <TableRow key={a.id} className="border-dark-border/30">
                  <TableCell className="text-warm-white text-sm">
                    {a.moduleTitle}
                  </TableCell>
                  <TableCell className="text-warm-white text-sm whitespace-nowrap">
                    {formatDate(a.date)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`border ${cls} capitalize`}>
                      {a.result.replace(/-/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-warm-white text-sm">
                    {display(a.mark)}
                  </TableCell>
                  <TableCell className="text-text-muted text-sm max-w-xs break-words">
                    {display(a.comments)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CertificatesTab({ student }: { student: StudentProfile }) {
  if (student.certificates.length === 0) {
    return <EmptyState message="No certificates issued yet." />;
  }

  return (
    <div className="space-y-3">
      {student.certificates.map((c) => {
        const cls =
          certificateStatusColors[c.status] ||
          "bg-dark-border/50 text-text-muted border-dark-border/50";
        return (
          <Card
            key={c.id}
            className="bg-dark-card/60 backdrop-blur border-dark-border/40"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-warm-white font-semibold text-sm break-all">
                    {c.certificateNumber}
                  </div>
                  <div className="text-text-muted text-xs">{c.programName}</div>
                </div>
                <Badge className={`border ${cls} capitalize`}>{c.status}</Badge>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <dt className="text-text-muted uppercase tracking-wider text-[10px]">
                    Issue Date
                  </dt>
                  <dd className="text-warm-white whitespace-nowrap">
                    {formatDate(c.issueDate)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-text-muted uppercase tracking-wider text-[10px]">
                    Signed By
                  </dt>
                  <dd className="text-warm-white break-words">
                    {display(c.signedBy)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-text-muted uppercase tracking-wider text-[10px]">
                    Student Name
                  </dt>
                  <dd className="text-warm-white break-words">{c.studentName}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-text-muted uppercase tracking-wider text-[10px]">
                    ID Number
                  </dt>
                  <dd className="text-warm-white break-words">
                    {display(c.idNumber)}
                  </dd>
                </div>
              </dl>
              <a
                href={`/training/verify/${encodeURIComponent(c.certificateNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand hover:text-brand-light text-xs font-medium"
              >
                View / Verify <ExternalLink className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function AuditTab({ student }: { student: StudentProfile }) {
  if (student.auditLogs.length === 0) {
    return <EmptyState message="No audit log entries yet." />;
  }

  return (
    <Card className="bg-dark-card/60 backdrop-blur border-dark-border/40">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-warm-white font-semibold text-sm">Audit Trail</h3>
          <span className="text-text-muted text-xs">
            Last {student.auditLogs.length} entries
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-dark-border/40 hover:bg-transparent">
              <TableHead className="text-text-muted text-xs">Timestamp</TableHead>
              <TableHead className="text-text-muted text-xs">Action</TableHead>
              <TableHead className="text-text-muted text-xs">Details</TableHead>
              <TableHead className="text-text-muted text-xs">User ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.auditLogs.map((l) => (
              <TableRow key={l.id} className="border-dark-border/30">
                <TableCell className="text-warm-white text-sm whitespace-nowrap">
                  {formatDateTime(l.timestamp)}
                </TableCell>
                <TableCell>
                  <Badge className="bg-dark-deep/60 border-dark-border/50 text-text-muted font-mono text-[10px] break-all">
                    {l.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-muted text-sm max-w-xs break-words">
                  {display(l.details)}
                </TableCell>
                <TableCell className="text-text-muted text-xs font-mono break-all">
                  {display(l.userId)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Profile content (Tabs + Footer) ───

function ProfileContent({
  student,
  course,
  onEdit,
  onClose,
}: {
  student: StudentProfile;
  course: CourseInfo | null;
  onEdit?: (student: StudentProfile) => void;
  onClose: () => void;
}) {
  const statusClass =
    statusColors[student.status] ||
    "bg-dark-border/50 text-text-muted border-dark-border/50";

  const tabTriggerClass =
    "text-text-muted data-[state=active]:text-warm-white data-[state=active]:bg-brand/15 data-[state=active]:border-brand/30 hover:text-warm-white";

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="bg-dark-deep/60 border border-dark-border/50 h-auto flex-wrap w-full justify-start gap-1 p-1">
        <TabsTrigger value="overview" className={tabTriggerClass}>
          <LayoutDashboard className="w-3.5 h-3.5" /> Overview
        </TabsTrigger>
        <TabsTrigger value="personal" className={tabTriggerClass}>
          <User className="w-3.5 h-3.5" /> Personal
        </TabsTrigger>
        <TabsTrigger value="education" className={tabTriggerClass}>
          <GraduationCap className="w-3.5 h-3.5" /> Education &amp; Kin
        </TabsTrigger>
        <TabsTrigger value="course" className={tabTriggerClass}>
          <BookOpen className="w-3.5 h-3.5" /> Course
        </TabsTrigger>
        <TabsTrigger value="attendance" className={tabTriggerClass}>
          <Calendar className="w-3.5 h-3.5" /> Attendance
        </TabsTrigger>
        <TabsTrigger value="assessments" className={tabTriggerClass}>
          <Award className="w-3.5 h-3.5" /> Assessments
        </TabsTrigger>
        <TabsTrigger value="certificates" className={tabTriggerClass}>
          <FileText className="w-3.5 h-3.5" /> Certificates
        </TabsTrigger>
        <TabsTrigger value="audit" className={tabTriggerClass}>
          <Shield className="w-3.5 h-3.5" /> Audit Trail
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <OverviewTab student={student} course={course} statusClass={statusClass} />
      </TabsContent>

      <TabsContent value="personal" className="mt-4">
        <PersonalTab student={student} />
      </TabsContent>

      <TabsContent value="education" className="mt-4">
        <EducationTab student={student} />
      </TabsContent>

      <TabsContent value="course" className="mt-4">
        <CourseTab student={student} course={course} />
      </TabsContent>

      <TabsContent value="attendance" className="mt-4">
        <AttendanceTab student={student} />
      </TabsContent>

      <TabsContent value="assessments" className="mt-4">
        <AssessmentsTab student={student} />
      </TabsContent>

      <TabsContent value="certificates" className="mt-4">
        <CertificatesTab student={student} />
      </TabsContent>

      <TabsContent value="audit" className="mt-4">
        <AuditTab student={student} />
      </TabsContent>

      <DialogFooter className="mt-6 gap-2 flex-wrap">
        <WelcomeLetterButton
          studentId={student.id}
          studentNumber={student.studentNumber}
          status={student.status}
          variant="default"
          size="sm"
          className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold"
        />
        {onEdit && (
          <Button
            type="button"
            onClick={() => onEdit(student)}
            variant="outline"
            size="sm"
            className="bg-dark-deep/60 border-dark-border/50 text-warm-white hover:bg-dark-deep"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
        <Button
          type="button"
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="text-text-muted hover:text-warm-white"
        >
          <X className="w-4 h-4 mr-2" /> Close
        </Button>
      </DialogFooter>
    </Tabs>
  );
}

// ─── Main modal ───

export default function StudentProfileModal({
  studentId,
  onClose,
  onEdit,
}: StudentProfileModalProps) {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/academy/students?id=${encodeURIComponent(studentId)}`,
        { cache: "no-store" }
      );
      const text = await res.text();
      if (!text) {
        throw new Error("Server returned an empty response.");
      }
      let data: StudentProfileResponse;
      try {
        data = JSON.parse(text) as StudentProfileResponse;
      } catch {
        throw new Error("Server returned an invalid response.");
      }
      if (!res.ok || !data.ok || !data.student) {
        throw new Error(data.error || "Failed to load student.");
      }
      setStudent(data.student);
      setCourse(data.course ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load student.");
      setStudent(null);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      // Reset prior state so a new studentId always shows fresh loading state.
      setStudent(null);
      setCourse(null);
      setError(null);
      fetchStudent();
    }
  }, [studentId, fetchStudent]);

  if (!studentId) return null;

  return (
    <Dialog
      open={studentId !== null}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto bg-dark-card/90 backdrop-blur-xl border-dark-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
            Student Profile
          </DialogTitle>
          <DialogDescription className="text-text-muted text-xs">
            Full academic and personal record
          </DialogDescription>
        </DialogHeader>

        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-warm-white text-sm">{error}</p>
            <Button
              type="button"
              onClick={fetchStudent}
              variant="outline"
              size="sm"
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white hover:bg-dark-deep"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Try again
            </Button>
          </div>
        )}

        {!loading && !error && student && (
          <ProfileContent
            student={student}
            course={course}
            onEdit={onEdit}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
