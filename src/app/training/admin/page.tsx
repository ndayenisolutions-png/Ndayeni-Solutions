"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard, FileText, Users, BookOpen, Calendar, Award,
  BarChart3, Settings, LogOut, Check, X, Search, Plus, Trash2,
  ChevronDown, ShieldCheck, Clock, Download, ArrowLeft, Edit, AlertCircle,
  History, Mail, Eye, KeyRound,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import StudentProfileModal from "@/components/academy/StudentProfileModal";
import WelcomeLetterButton from "@/components/academy/WelcomeLetterButton";
import AttendanceBulkCapture from "@/components/academy/AttendanceBulkCapture";
import AssessmentGradebook from "@/components/academy/AssessmentGradebook";
import UserManagementPanel from "@/components/academy/UserManagementPanel";
import AuditLogViewer from "@/components/academy/AuditLogViewer";
import CSVExportButtons from "@/components/academy/CSVExportButtons";
import ReportsCharts from "@/components/academy/ReportsCharts";

type SessionUser = { id: string; email: string; name: string; role: string };
type Student = Record<string, unknown> & {
  id: string; fullName: string; email: string; phone: string;
  status: string; progress: number; applicationRef?: string;
  studentNumber?: string; selectedCourses?: string; courseId?: string;
  gender?: string; dateOfBirth?: string; nationality?: string;
  idNumber?: string; address?: string; highestEducation?: string;
  employmentStatus?: string; nextOfKinName?: string; nextOfKinPhone?: string;
  nextOfKinEmail?: string; nextOfKinRelationship?: string;
  preferredStartDate?: string; preferredMode?: string;
  previousTraining?: string; relevantExperience?: string;
  notes?: string; createdAt: string; enrolledAt?: string;
  completedAt?: string; certificates?: { id: string; certificateNumber: string }[];
};
type Course = { id: string; code: string; title: string; description: string; duration: string; deliveryMethod: string; entryRequirements?: string; active: boolean; modules: { id: string; title: string }[] };
type AcademyUser = { id: string; email: string; name: string; role: string; active: boolean; createdAt: string };

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "students", label: "Students", icon: Users },
  { id: "courses", label: "Courses & Modules", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: Calendar },
  { id: "assessments", label: "Assessments", icon: Award },
  { id: "certificates", label: "Certificates", icon: Download },
  { id: "users", label: "Users & Permissions", icon: ShieldCheck },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "audit", label: "Audit Log", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

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

const statusOptions = ["applied", "under-review", "info-required", "accepted", "enrolled", "active", "completed", "rejected", "withdrawn", "deferred"];
const roleLabels: Record<string, string> = { super: "Super Admin", admin: "Administrator", admissions: "Admissions", training: "Training Admin", readonly: "Read Only" };

export default function AdminPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<AcademyUser[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Student | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showManualCert, setShowManualCert] = useState(false);
  const [attendanceStudent, setAttendanceStudent] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, unknown>[]>([]);
  const [profileStudentId, setProfileStudentId] = useState<string | null>(null);

  const { toast } = useToast();

  // checkSession is called on page load (refresh). The /api/academy/students
  // endpoint doesn't return the user object — we only learn that the session
  // cookie is valid. So we fall back to a placeholder user. This means
  // UserManagementPanel's "cannot delete self" check will never match the
  // real user ID after a page refresh (id="session"). After a fresh login via
  // handleLogin below, the real user object IS captured (setUser(data.user))
  // and the placeholder is replaced. This is a known limitation documented
  // in worklog.md — acceptable because non-super users cannot delete users
  // anyway (UserManagementPanel gates that path itself).
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/students");
      if (res.ok) {
        const text = await res.text();
        if (!text) { setLoading(false); return; }
        try {
          const data = JSON.parse(text);
          if (data.ok) {
            setUser({ id: "session", email: "admin", name: "Admin", role: "admin" });
            loadDashboard();
          }
        } catch {}
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/academy/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const text = await res.text();
      if (!text) {
        throw new Error("Server returned an empty response. The database may not be configured on this deployment. Please contact support.");
      }
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server error. Please try again.");
      }
      if (!res.ok || !data.ok) throw new Error(data.error || "Invalid credentials.");
      setUser(data.user);
      setLoginForm({ email: "", password: "" });
      loadDashboard();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setLoginError(msg);
      toast({ title: "Login failed", description: msg, variant: "destructive" });
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/academy/logout", { method: "POST" });
    setUser(null);
  };

  const api = async (url: string, opts?: RequestInit) => {
    const res = await fetch(url, opts);
    const text = await res.text();
    if (!text) return { ok: false };
    try { return JSON.parse(text); } catch { return { ok: false }; }
  };

  const loadDashboard = async () => {
    // Independent calls — one failure won't block the others
    api("/api/academy/reports").then(d => { if (d.ok) setStats(d.stats || d); }).catch(() => {});
    api("/api/academy/students").then(d => { if (d.ok) setStudents(d.students || []); }).catch(() => {});
    api("/api/academy/courses").then(d => { if (d.ok) setCourses(d.courses || []); }).catch(() => {});
  };

  const loadUsers = async () => {
    const data = await api("/api/academy/users");
    if (data.ok) setUsers(data.users || []);
  };

  const loadStudents = async () => {
    const data = await api(`/api/academy/students?status=${statusFilter}&q=${search}`);
    if (data.ok) setStudents(data.students || []);
  };

  const updateStudent = async (id: string | undefined, updates: Record<string, unknown>) => {
    try {
      const data = await api("/api/academy/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, ...updates }),
      });
      if (data.ok) {
        toast({ title: "Student updated", description: "Changes saved successfully." });
      } else {
        toast({ title: "Error", description: String(data.error || "Failed to update student."), variant: "destructive" });
      }
      loadStudents();
      setEditing(null);
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to update student.", variant: "destructive" });
    }
  };

  const convertStudent = async (id: string | undefined) => {
    try {
      const data = await api("/api/academy/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert", id }),
      });
      if (data.ok) {
        const s = students.find(x => x.id === id);
        toast({ title: "Student enrolled", description: `${s?.fullName || "Student"} is now enrolled. Welcome letter available.` });
      } else {
        toast({ title: "Error", description: String(data.error || "Failed to enrol student."), variant: "destructive" });
      }
      loadStudents();
      loadDashboard();
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to enrol student.", variant: "destructive" });
    }
  };

  const deleteStudent = async (id: string | undefined) => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    try {
      const data = await api("/api/academy/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (data.ok) {
        toast({ title: "Student deleted", description: "The student record has been removed." });
      } else {
        toast({ title: "Error", description: String(data.error || "Failed to delete student."), variant: "destructive" });
      }
      loadStudents();
      loadDashboard();
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete student.", variant: "destructive" });
    }
  };

  const issueCertificate = async (studentId: string | undefined) => {
    try {
      const data = await api("/api/academy/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      if (data.ok) {
        toast({ title: "Certificate issued", description: "The certificate has been generated and is ready to view." });
        loadStudents();
        if (data.certificate?.id) window.open(`/training/certificate/${data.certificate.id}`, "_blank");
      } else {
        toast({ title: "Error", description: String(data.error || "Failed to issue certificate."), variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to issue certificate.", variant: "destructive" });
    }
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return !q || String(s.fullName || "").toLowerCase().includes(q) || String(s.email || "").toLowerCase().includes(q) || String(s.applicationRef || "").toLowerCase().includes(q) || String(s.studentNumber || "").toLowerCase().includes(q);
  });

  const appliedStudents = students.filter(s => ["applied", "under-review", "info-required"].includes(s.status));
  const appFiltered = appliedStudents.filter(s => {
    const q = search.toLowerCase();
    return !q || String(s.fullName || "").toLowerCase().includes(q) || String(s.email || "").toLowerCase().includes(q);
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-deep"><p className="text-text-muted">Loading...</p></div>;

  // ─── LOGIN ───
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-deep px-4">
        <div className="absolute inset-0 mesh-gradient" />
        <Card className="relative z-10 w-full max-w-md bg-dark-card/80 backdrop-blur-xl border-dark-border/50">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
                <span className="text-dark-deep font-bold text-lg">N</span>
              </div>
              <div><div className="text-warm-white font-semibold text-sm">Digital Academy SMS</div><div className="text-text-muted text-[10px]">Ndayeni Solutions Pty Ltd</div></div>
            </div>
            <h1 className="text-warm-white font-bold text-xl mb-2">Sign In</h1>
            <p className="text-text-muted text-sm mb-6">Student Management System — Admin Access</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div><Label className="text-text-muted text-xs mb-1.5 block">Email</Label><Input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@ndayenisolutions.co.za" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
              <div><Label className="text-text-muted text-xs mb-1.5 block">Password</Label><Input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
              {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
              <Button type="submit" disabled={loginSubmitting} className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold py-5 rounded-xl">{loginSubmitting ? "Signing in…" : "Sign In"}</Button>
              <div className="text-right">
                <Link href="/training/forgot-password" className="text-sm text-brand hover:text-brand-light transition-colors">Forgot password?</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── DASHBOARD ───
  const dashStats = [
    { label: "Total Applications", value: stats.totalApplications ?? students.length, color: "text-brand", icon: FileText },
    { label: "Pending Review", value: stats.pendingApplications ?? appliedStudents.length, color: "text-yellow-400", icon: Clock },
    { label: "Accepted", value: stats.acceptedApplications ?? students.filter(s => s.status === "accepted").length, color: "text-cyan-400", icon: Check },
    { label: "Enrolled / Active", value: stats.enrolledStudents ?? students.filter(s => ["enrolled", "active"].includes(s.status)).length, color: "text-green-400", icon: Users },
    { label: "Completed", value: stats.completedStudents ?? students.filter(s => s.status === "completed").length, color: "text-emerald-400", icon: Award },
    { label: "Certificates Issued", value: stats.certificatesIssued ?? students.filter(s => (s.certificates?.length ?? 0) > 0).length, color: "text-brand-light", icon: Download },
  ];

  const quickActions = [
    { label: "View Applications", view: "applications", icon: FileText },
    { label: "View Students", view: "students", icon: Users },
    { label: "Manage Courses", view: "courses", icon: BookOpen },
    { label: "Issue Certificate", view: "certificates", icon: Award },
    { label: "User Management", view: "users", icon: ShieldCheck },
    { label: "Reports", view: "reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-dark-deep flex">
      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-64 h-screen glass-strong border-r border-dark-border/30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 border-b border-dark-border/30">
          <Link href="/training" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center"><span className="text-dark-deep font-bold text-sm">N</span></div>
            <div><div className="text-warm-white font-semibold text-sm">Digital Academy</div><div className="text-text-muted text-[9px]">SMS Admin</div></div>
          </Link>
        </div>
        <nav className="p-2 space-y-0.5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 130px)" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveView(item.id); if (item.id === "users") loadUsers(); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeView === item.id ? "bg-brand/15 text-brand border border-brand/30" : "text-text-muted hover:text-warm-white hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-dark-border/30">
          <div className="flex items-center justify-between">
            <div className="text-xs"><div className="text-warm-white font-medium">{user.name}</div><div className="text-text-muted">{roleLabels[user.role] || user.role}</div></div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-text-muted hover:text-red-400 text-xs transition-colors"><LogOut className="w-3.5 h-3.5" /> Logout</button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden glass-strong border-b border-dark-border/30 p-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-warm-white p-2"><ChevronDown className={`w-5 h-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} /></button>
          <span className="text-warm-white font-semibold text-sm">{navItems.find(n => n.id === activeView)?.label}</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* DASHBOARD VIEW */}
          {activeView === "dashboard" && (
            <div>
              <h1 className="text-warm-white font-bold text-xl sm:text-2xl mb-6">Dashboard</h1>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <CSVExportButtons />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
                {dashStats.map(s => (
                  <div key={s.label} className="glass rounded-xl p-4 border-brand/10">
                    <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                    <div className="text-2xl font-bold text-warm-white">{s.value}</div>
                    <div className="text-text-muted text-xs">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {/* Student Status Distribution */}
                <div className="glass rounded-xl p-5 border-brand/10">
                  <h3 className="text-warm-white font-semibold text-sm mb-4">Student Status Distribution</h3>
                  <div className="space-y-2.5">
                    {statusOptions.map(status => {
                      const count = students.filter(s => s.status === status).length;
                      const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                      const colors: Record<string, string> = {
                        applied: "bg-yellow-400", "under-review": "bg-blue-400", "info-required": "bg-orange-400",
                        accepted: "bg-cyan-400", enrolled: "bg-indigo-400", active: "bg-green-400",
                        completed: "bg-emerald-400", rejected: "bg-red-400", withdrawn: "bg-gray-400", deferred: "bg-purple-400",
                      };
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <span className="text-text-muted text-xs w-24 capitalize flex-shrink-0">{status}</span>
                          <div className="flex-1 h-6 bg-dark-deep/60 rounded-full overflow-hidden">
                            <div className={`h-full ${colors[status] || "bg-brand"} rounded-full transition-all duration-700`} style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }} />
                          </div>
                          <span className="text-warm-white text-xs font-bold w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Applications Over Time (by month) */}
                <div className="glass rounded-xl p-5 border-brand/10">
                  <h3 className="text-warm-white font-semibold text-sm mb-4">Applications Timeline</h3>
                  {(() => {
                    const months: Record<string, number> = {};
                    students.forEach(s => {
                      const d = new Date(s.createdAt);
                      const key = `${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`;
                      months[key] = (months[key] || 0) + 1;
                    });
                    const entries = Object.entries(months).slice(-6);
                    const max = Math.max(...entries.map(([, v]) => v), 1);
                    return (
                      <div className="flex items-end justify-between gap-2 h-32">
                        {entries.length > 0 ? entries.map(([month, count]) => (
                          <div key={month} className="flex flex-col items-center gap-1 flex-1">
                            <span className="text-warm-white text-xs font-bold">{count}</span>
                            <div className="w-full bg-gradient-to-t from-brand to-brand-light rounded-t-md transition-all duration-700" style={{ height: `${(count / max) * 100}%`, minHeight: "4px" }} />
                            <span className="text-text-muted text-[10px]">{month}</span>
                          </div>
                        )) : <p className="text-text-muted text-sm m-auto">No data yet</p>}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Course Enrollment */}
              <div className="glass rounded-xl p-5 border-brand/10 mb-8">
                <h3 className="text-warm-white font-semibold text-sm mb-4">Course Enrollment</h3>
                <div className="space-y-2.5">
                  {courses.map(c => {
                    const count = students.filter(s => String(s.selectedCourses || s.program || "").includes(c.title) || s.courseId === c.id).length;
                    const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                    return (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-text-muted text-xs w-48 flex-shrink-0 truncate">{c.title}</span>
                        <div className="flex-1 h-6 bg-dark-deep/60 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full transition-all duration-700" style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }} />
                        </div>
                        <span className="text-warm-white text-xs font-bold w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <h2 className="text-warm-white font-semibold text-base mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map(a => (
                  <button key={a.label} onClick={() => { setActiveView(a.view); if (a.view === "users") loadUsers(); }} className="glass rounded-xl p-4 border-brand/10 hover:border-brand/30 transition-all text-left flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform"><a.icon className="w-4 h-4 text-brand" /></div>
                    <span className="text-warm-white text-sm font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* APPLICATIONS VIEW */}
          {activeView === "applications" && (
            <div>
              <h1 className="text-warm-white font-bold text-xl sm:text-2xl mb-6">Applications</h1>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, reference…" className="bg-dark-deep/60 border-dark-border/50 text-warm-white pl-10 h-11" /></div>
              </div>
              <div className="glass rounded-xl border-brand/10 overflow-hidden">
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider"><th className="text-left p-3">Applicant</th><th className="text-left p-3 hidden sm:table-cell">Courses</th><th className="text-left p-3">Status</th><th className="text-left p-3 hidden md:table-cell">Ref</th><th className="text-right p-3">Actions</th></tr></thead>
                  <tbody>
                    {appFiltered.map(s => (
                      <tr key={s.id} className="border-b border-dark-border/20 hover:bg-brand/5">
                        <td className="p-3"><div className="text-warm-white font-medium text-sm">{s.fullName}</div><div className="text-text-muted text-xs">{s.email}</div></td>
                        <td className="p-3 hidden sm:table-cell text-text-muted text-xs">{String(s.selectedCourses || s.program || "").slice(0, 30)}</td>
                        <td className="p-3"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${statusColors[s.status] || ""}`}>{s.status}</span></td>
                        <td className="p-3 hidden md:table-cell text-text-muted text-xs font-mono">{s.applicationRef || "—"}</td>
                        <td className="p-3"><div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditing(s)} className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand" title="View/Edit"><Edit className="w-3.5 h-3.5" /></button>
                          {s.status === "applied" && <button onClick={() => updateStudent(s.id, { status: "under-review" })} className="p-1.5 rounded hover:bg-blue-500/15 text-text-muted hover:text-blue-400" title="Mark Under Review"><Clock className="w-3.5 h-3.5" /></button>}
                          {s.status !== "accepted" && s.status !== "enrolled" && <button onClick={() => updateStudent(s.id, { status: "accepted" })} className="p-1.5 rounded hover:bg-cyan-500/15 text-text-muted hover:text-cyan-400" title="Accept"><Check className="w-3.5 h-3.5" /></button>}
                          {s.status === "accepted" && <button onClick={() => convertStudent(s.id)} className="p-1.5 rounded hover:bg-green-500/15 text-text-muted hover:text-green-400" title="Convert to Student"><Users className="w-3.5 h-3.5" /></button>}
                          <button onClick={() => updateStudent(s.id, { status: "rejected" })} className="p-1.5 rounded hover:bg-red-500/15 text-text-muted hover:text-red-400" title="Reject"><X className="w-3.5 h-3.5" /></button>
                        </div></td>
                      </tr>
                    ))}
                    {appFiltered.length === 0 && <tr><td colSpan={5} className="text-center text-text-muted p-8">No applications found.</td></tr>}
                  </tbody>
                </table></div>
              </div>
            </div>
          )}

          {/* STUDENTS VIEW */}
          {activeView === "students" && (
            <div>
              <h1 className="text-warm-white font-bold text-xl sm:text-2xl mb-6">Students</h1>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" /><Input value={search} onChange={e => { setSearch(e.target.value); }} placeholder="Search by name, email, student number…" className="bg-dark-deep/60 border-dark-border/50 text-warm-white pl-10 h-11" /></div>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); loadStudents(); }} className="bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 h-11 text-sm cursor-pointer">
                  <option value="all">All statuses</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="glass rounded-xl border-brand/10 overflow-hidden">
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider"><th className="text-left p-3">Name</th><th className="text-left p-3 hidden sm:table-cell">Student #</th><th className="text-left p-3 hidden sm:table-cell">Course</th><th className="text-left p-3">Status</th><th className="text-left p-3 hidden md:table-cell">Progress</th><th className="text-right p-3">Actions</th></tr></thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id} className="border-b border-dark-border/20 hover:bg-brand/5">
                        <td className="p-3"><div className="text-warm-white font-medium text-sm">{s.fullName}</div><div className="text-text-muted text-xs">{s.email}</div></td>
                        <td className="p-3 hidden sm:table-cell text-text-muted text-xs font-mono">{s.studentNumber || "—"}</td>
                        <td className="p-3 hidden sm:table-cell text-text-muted text-xs">{String(s.selectedCourses || s.program || "").slice(0, 25)}</td>
                        <td className="p-3"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${statusColors[s.status] || ""}`}>{s.status}</span></td>
                        <td className="p-3 hidden md:table-cell"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-dark-border/50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full" style={{ width: `${s.progress}%` }} /></div><span className="text-text-muted text-xs">{s.progress}%</span></div></td>
                        <td className="p-3"><div className="flex items-center justify-end gap-1">
                          <button onClick={() => setProfileStudentId(s.id)} className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand" title="View Profile"><Eye className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditing(s)} className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                          {s.status !== "completed" && <button onClick={() => issueCertificate(s.id)} className="p-1.5 rounded hover:bg-green-500/15 text-text-muted hover:text-green-400" title="Issue Certificate"><Award className="w-3.5 h-3.5" /></button>}
                          {(s.certificates?.length ?? 0) > 0 && <button onClick={() => window.open(`/training/certificate/${s.certificates![0].id}`, "_blank")} className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand" title="View Certificate"><Download className="w-3.5 h-3.5" /></button>}
                          <button onClick={() => deleteStudent(s.id)} className="p-1.5 rounded hover:bg-red-500/15 text-text-muted hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                          {["enrolled", "active", "completed"].includes(s.status) && <WelcomeLetterButton studentId={s.id} studentNumber={s.studentNumber} status={s.status} variant="ghost" size="sm" />}
                        </div></td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-text-muted p-8">No students found.</td></tr>}
                  </tbody>
                </table></div>
              </div>
            </div>
          )}

          {/* COURSES VIEW */}
          {activeView === "courses" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-warm-white font-bold text-xl sm:text-2xl">Courses & Modules</h1>
                {user.role === "super" && <Button onClick={() => setShowAddCourse(!showAddCourse)} variant="outline" className="border-brand/30 text-brand hover:bg-brand/10 text-xs px-4 py-2 rounded-lg">{showAddCourse ? "Cancel" : "+ Add Course"}</Button>}
              </div>
              {showAddCourse && <AddCourseForm onCreated={() => { setShowAddCourse(false); loadDashboard(); }} />}
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.id} className="glass rounded-xl p-4 border-brand/10">
                    <div className="flex items-start justify-between mb-2">
                      <div><span className="text-brand text-xs font-mono font-bold">{c.code}</span><h3 className="text-warm-white font-bold text-sm mt-0.5">{c.title}</h3><p className="text-text-muted text-xs mt-1">{c.description}</p></div>
                      <div className="flex gap-2 text-xs"><span className="glass rounded-full px-2 py-0.5 text-accent">{c.duration}</span><span className={`rounded-full px-2 py-0.5 ${c.active ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>{c.active ? "Active" : "Inactive"}</span></div>
                    </div>
                    {c.modules?.length > 0 && <div className="mt-2 pt-2 border-t border-dark-border/20"><div className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Modules</div><div className="flex flex-wrap gap-1.5">{c.modules.map(m => <span key={m.id} className="text-xs text-warm-white/80 bg-dark-deep/40 rounded px-2 py-0.5 border border-dark-border/30">{m.title}</span>)}</div></div>}
                  </div>
                ))}
                {courses.length === 0 && <p className="text-text-muted text-center py-8">No courses yet.</p>}
              </div>
            </div>
          )}

          {/* ATTENDANCE VIEW */}
          {activeView === "attendance" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-warm-white">Attendance</h2>
                <p className="text-text-muted text-sm mt-1">Mark attendance for an entire class in one go.</p>
              </div>
              <AttendanceBulkCapture courses={courses} onSaved={() => { loadDashboard(); toast({ title: "Attendance saved", description: "Bulk attendance record updated." }); }} />
            </div>
          )}

          {/* ASSESSMENTS VIEW */}
          {activeView === "assessments" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-warm-white">Assessments</h2>
                <p className="text-text-muted text-sm mt-1">Gradebook view — capture pass / not-yet-competent results per module.</p>
              </div>
              <AssessmentGradebook courses={courses} />
            </div>
          )}

          {/* CERTIFICATES VIEW */}
          {activeView === "certificates" && (
            <div>
              <h1 className="text-warm-white font-bold text-xl sm:text-2xl mb-6">Completion & Certificates</h1>
              {user.role === "super" && (
                <div className="mb-4">
                  <Button onClick={() => setShowManualCert(!showManualCert)} variant="outline" className="border-brand/30 text-brand hover:bg-brand/10 text-xs px-4 py-2 rounded-lg">{showManualCert ? "Cancel" : "+ Generate Certificate for Past Student"}</Button>
                </div>
              )}
              {showManualCert && <ManualCertForm courses={courses} onGenerated={(certId) => { setShowManualCert(false); if (certId) window.open(`/training/certificate/${certId}`, "_blank"); }} />}
              <div className="glass rounded-xl border-brand/10 overflow-hidden">
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider"><th className="text-left p-3">Student</th><th className="text-left p-3 hidden sm:table-cell">Course</th><th className="text-left p-3">Status</th><th className="text-left p-3">Certificate</th><th className="text-right p-3">Actions</th></tr></thead>
                  <tbody>
                    {students.filter(s => ["active", "completed"].includes(s.status)).map(s => (
                      <tr key={s.id} className="border-b border-dark-border/20 hover:bg-brand/5">
                        <td className="p-3"><div className="text-warm-white font-medium text-sm">{s.fullName}</div></td>
                        <td className="p-3 hidden sm:table-cell text-text-muted text-xs">{String(s.selectedCourses || s.program || "").slice(0, 25)}</td>
                        <td className="p-3"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${statusColors[s.status] || ""}`}>{s.status}</span></td>
                        <td className="p-3">{(s.certificates?.length ?? 0) > 0 ? <span className="text-green-400 text-xs font-mono">{s.certificates![0].certificateNumber}</span> : <span className="text-text-muted text-xs">—</span>}</td>
                        <td className="p-3 text-right">
                          {(s.certificates?.length ?? 0) > 0 ? <button onClick={() => window.open(`/training/certificate/${s.certificates![0].id}`, "_blank")} className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand" title="View"><Download className="w-3.5 h-3.5" /></button> : <button onClick={() => issueCertificate(s.id)} className="p-1.5 rounded hover:bg-green-500/15 text-text-muted hover:text-green-400" title="Issue Certificate"><Award className="w-3.5 h-3.5" /></button>}
                        </td>
                      </tr>
                    ))}
                    {students.filter(s => ["active", "completed"].includes(s.status)).length === 0 && <tr><td colSpan={5} className="text-center text-text-muted p-8">No students eligible for certificates.</td></tr>}
                  </tbody>
                </table></div>
              </div>
            </div>
          )}

          {/* USERS VIEW */}
          {activeView === "users" && (
            <UserManagementPanel users={users} currentUser={user} onUsersChanged={loadUsers} />
          )}

          {/* REPORTS VIEW */}
          {activeView === "reports" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-warm-white">Reports & Analytics</h2>
                  <p className="text-text-muted text-sm mt-1">Enrolment trends, completion rates, attendance and assessment summaries.</p>
                </div>
                <CSVExportButtons />
              </div>
              <ReportsCharts />
            </div>
          )}

          {/* AUDIT VIEW */}
          {activeView === "audit" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-warm-white">Audit Log</h2>
                <p className="text-text-muted text-sm mt-1">Every action taken in the system, newest first.</p>
              </div>
              <AuditLogViewer />
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeView === "settings" && (
            <div>
              <h1 className="text-warm-white font-bold text-xl sm:text-2xl mb-6">Settings</h1>
              <div className="glass rounded-xl p-5 border-brand/10 space-y-4">
                <div><h3 className="text-warm-white font-semibold text-sm mb-1">Academy Information</h3><p className="text-text-muted text-xs">Ndayeni Solutions Digital Academy — a division of Ndayeni Solutions Pty Ltd</p></div>
                <div><h3 className="text-warm-white font-semibold text-sm mb-1">Certificate Signing</h3><p className="text-text-muted text-xs">Certificates are signed by: <span className="text-warm-white">Nhlakanipho Ntshangase, Founder & CEO</span></p></div>
                <div><h3 className="text-warm-white font-semibold text-sm mb-1">Application Reference Format</h3><p className="text-text-muted text-xs font-mono">NDA-YYYY-XXXX</p></div>
                <div><h3 className="text-warm-white font-semibold text-sm mb-1">Student Number Format</h3><p className="text-text-muted text-xs font-mono">NSA-YYYY-NNNN</p></div>
                <div><h3 className="text-warm-white font-semibold text-sm mb-1">Status Options</h3><div className="flex flex-wrap gap-1.5 mt-1">{statusOptions.map(s => <span key={s} className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${statusColors[s] || ""}`}>{s}</span>)}</div></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit modal */}
      {editing && <EditModal student={editing} onClose={() => setEditing(null)} onSave={updateStudent} courses={courses} />}

      {/* Student profile modal */}
      <StudentProfileModal
        studentId={profileStudentId}
        onClose={() => setProfileStudentId(null)}
        onEdit={(student) => { setProfileStudentId(null); setEditing(student as unknown as Student); }}
      />
    </div>
  );
}

// ─── Helper Components ───

function AddCourseForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ code: "", title: "", description: "", duration: "", deliveryMethod: "", entryRequirements: "" });
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true); setError(null);
    try {
      const res = await fetch("/api/academy/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", ...form }) });
      const data = await res.json(); if (!res.ok || !data.ok) throw new Error(data.error);
      toast({ title: "Course created", description: `"${form.title || form.code}" has been added.` });
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed.";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally { setCreating(false); }
  };
  return (
    <form onSubmit={handleCreate} className="glass rounded-xl p-4 border-brand/10 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Course code (e.g. NDY-DS05)" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Course title" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g. 2 weeks)" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input value={form.deliveryMethod} onChange={e => setForm({ ...form, deliveryMethod: e.target.value })} placeholder="Delivery method" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input value={form.entryRequirements} onChange={e => setForm({ ...form, entryRequirements: e.target.value })} placeholder="Entry requirements" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Button type="submit" disabled={creating} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold h-11 rounded-lg sm:col-span-1">{creating ? "Creating..." : "Create Course"}</Button>
      {error && <p className="text-red-400 text-sm sm:col-span-3">{error}</p>}
    </form>
  );
}

function AddUserForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true); setError(null);
    try {
      const res = await fetch("/api/academy/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json(); if (!res.ok || !data.ok) throw new Error(data.error);
      toast({ title: "User created", description: `"${form.name}" (${form.role}) can now sign in.` });
      onCreated();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed.";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally { setCreating(false); }
  };
  return (
    <form onSubmit={handleCreate} className="glass rounded-xl p-4 border-brand/10 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Button type="submit" disabled={creating} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold h-11 rounded-lg">{creating ? "Creating..." : "Create User"}</Button>
      {error && <p className="text-red-400 text-sm sm:col-span-4">{error}</p>}
    </form>
  );
}

function ManualCertForm({ onGenerated, courses }: { onGenerated: (certId: string | undefined | null) => void; courses: Course[] }) {
  const [form, setForm] = useState({ fullName: "", idNumber: "", programName: "", issueDate: new Date().toISOString().split("T")[0] });
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true); setError(null);
    try {
      const res = await fetch("/api/academy/certificate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "manual", ...form }) });
      const data = await res.json(); if (!res.ok || !data.ok) throw new Error(data.error);
      toast({ title: "Certificate issued", description: `Manual certificate for "${form.fullName}" has been generated.` });
      onGenerated(data.certificate?.id || null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed.";
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally { setCreating(false); }
  };
  return (
    <form onSubmit={handleCreate} className="glass rounded-xl p-4 border-brand/10 mb-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
      <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Student full name" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} placeholder="ID number" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <select value={form.programName} onChange={e => setForm({ ...form, programName: e.target.value })} required className="bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 h-11 text-sm">
        <option value="">Select course…</option>
        {courses.map(c => <option key={c.id} value={c.title}>{c.title} ({c.code})</option>)}
      </select>
      <Input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Button type="submit" disabled={creating} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold h-11 rounded-lg">{creating ? "Generating..." : "Generate"}</Button>
      {error && <p className="text-red-400 text-sm sm:col-span-5">{error}</p>}
    </form>
  );
}

function EditModal({ student, onClose, onSave, courses }: { student: Student; onClose: () => void; onSave: (id: string | undefined, updates: Record<string, unknown>) => void; courses: Course[] }) {
  const [form, setForm] = useState({
    fullName: student.fullName || "", email: student.email || "", phone: student.phone || "",
    status: student.status || "applied", progress: student.progress || 0,
    notes: student.notes || "", courseId: student.courseId || "",
    idNumber: student.idNumber || "", gender: student.gender || "",
    dateOfBirth: student.dateOfBirth || "", nationality: student.nationality || "",
    address: student.address || "", highestEducation: student.highestEducation || "",
    employmentStatus: student.employmentStatus || "",
    nextOfKinName: student.nextOfKinName || "", nextOfKinRelationship: student.nextOfKinRelationship || "",
    nextOfKinPhone: student.nextOfKinPhone || "", nextOfKinEmail: student.nextOfKinEmail || "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-strong rounded-2xl border-brand/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h3 className="text-warm-white font-bold text-lg">Edit Student</h3><button onClick={onClose} className="text-text-muted hover:text-warm-white"><X className="w-5 h-5" /></button></div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-text-muted text-xs mb-1 block">Full Name</Label><Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
            <div><Label className="text-text-muted text-xs mb-1 block">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-text-muted text-xs mb-1 block">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
            <div><Label className="text-text-muted text-xs mb-1 block">ID Number</Label><Input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-text-muted text-xs mb-1 block">Gender</Label><Input value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
            <div><Label className="text-text-muted text-xs mb-1 block">Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-text-muted text-xs mb-1 block">Status</Label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm">{statusOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><Label className="text-text-muted text-xs mb-1 block">Course</Label><select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm"><option value="">None</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
          </div>
          <div><Label className="text-text-muted text-xs mb-1 block">Progress: {form.progress}%</Label><input type="range" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} className="w-full accent-brand" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-text-muted text-xs mb-1 block">Next of Kin</Label><Input value={form.nextOfKinName} onChange={e => setForm({ ...form, nextOfKinName: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
            <div><Label className="text-text-muted text-xs mb-1 block">Kin Phone</Label><Input value={form.nextOfKinPhone} onChange={e => setForm({ ...form, nextOfKinPhone: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" /></div>
          </div>
          <div><Label className="text-text-muted text-xs mb-1 block">Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="bg-dark-deep/60 border-dark-border/50 text-warm-white resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => onSave(student.id, form)} className="flex-1 bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold py-4 rounded-xl"><Check className="w-4 h-4 mr-2" /> Save</Button>
            <Button onClick={onClose} variant="outline" className="border-dark-border/50 text-text-muted hover:text-warm-white px-6 py-4 rounded-xl">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
