"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogOut, Users, GraduationCap, Award, Check, X, Trash2, Plus, Download, Search,
} from "lucide-react";
import Link from "next/link";

type SessionUser = { id: string; email: string; name: string; role: string };
type Student = {
  id: string; fullName: string; email: string; phone: string; idNumber: string | null;
  address: string | null; program: string; status: string; progress: number;
  enrolledAt: string | null; completedAt: string | null; notes: string | null;
  createdAt: string; certificates: { id: string; certificateNumber: string }[];
};
type AcademyUser = { id: string; email: string; name: string; role: string; createdAt: string };
type CertInfo = { id: string; certificateNumber: string; studentName: string; programName: string; issueDate: string };

const statusColors: Record<string, string> = {
  applied: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  registered: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "in-progress": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
};

export default function AdminPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<AcademyUser[]>([]);
  const [tab, setTab] = useState<"students" | "users">("students");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<Student | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);

  // Check existing session on mount
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/students");
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          // Session is valid — get user info from cookie via a dedicated endpoint
          setUser({ id: "session", email: "admin", name: "Admin", role: "admin" });
          loadStudents();
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch("/api/academy/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error);
      setUser(data.user);
      setLoginForm({ email: "", password: "" });
      loadStudents();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/academy/logout", { method: "POST" });
    setUser(null);
    setStudents([]);
    setUsers([]);
  };

  const loadStudents = async (filter = statusFilter) => {
    try {
      const res = await fetch(`/api/academy/students?status=${filter}`);
      const data = await res.json();
      if (data.ok) setStudents(data.students);
    } catch {}
  };

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/academy/users");
      const data = await res.json();
      if (data.ok) setUsers(data.users);
    } catch {}
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      await fetch("/api/academy/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, ...updates }),
      });
      await loadStudents();
      setEditing(null);
    } catch {}
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    await fetch("/api/academy/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    await loadStudents();
  };

  const issueCertificate = async (studentId: string, studentName: string, programName: string) => {
    try {
      const res = await fetch("/api/academy/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (data.ok) {
        await loadStudents();
        // Open certificate in new tab
        window.open(`/training/certificate/${data.certificate.id}`, "_blank");
      }
    } catch {}
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return !q || s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.program.toLowerCase().includes(q);
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-deep"><p className="text-text-muted">Loading...</p></div>;
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-deep px-4">
        <div className="absolute inset-0 mesh-gradient" />
        <Card className="relative z-10 w-full max-w-md bg-dark-card/80 backdrop-blur-xl border-dark-border/50">
          <CardContent className="p-6 sm:p-8">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
                <span className="text-dark-deep font-bold text-lg">N</span>
              </div>
              <div>
                <div className="text-warm-white font-semibold text-sm">Digital Academy Admin</div>
                <div className="text-text-muted text-[10px]">Ndayeni Solutions Pty Ltd</div>
              </div>
            </Link>
            <h1 className="text-warm-white font-bold text-xl mb-2">Sign In</h1>
            <p className="text-text-muted text-sm mb-6">Access the student management system.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-text-muted text-xs mb-1.5 block">Email</Label>
                <Input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@ndayenisolutions.co.za" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" />
              </div>
              <div>
                <Label className="text-text-muted text-xs mb-1.5 block">Password</Label>
                <Input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" />
              </div>
              {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold py-5 rounded-xl">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-dark-deep">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <span className="text-dark-deep font-bold text-sm">N</span>
            </div>
            <span className="text-warm-white font-semibold text-sm">Digital Academy SMS</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-muted text-xs hidden sm:inline">{user.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-text-muted hover:text-red-400 text-xs transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { icon: GraduationCap, label: "Total Students", value: students.length, color: "text-brand" },
            { icon: Users, label: "In Progress", value: students.filter(s => s.status === "in-progress" || s.status === "registered").length, color: "text-accent" },
            { icon: Award, label: "Completed", value: students.filter(s => s.status === "completed").length, color: "text-brand-light" },
            { icon: Plus, label: "Applied", value: students.filter(s => s.status === "applied").length, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="glass rounded-xl p-4 border-brand/10">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className="text-2xl font-bold text-warm-white">{s.value}</div>
              <div className="text-text-muted text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setTab("students")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "students" ? "bg-brand/15 text-brand border border-brand/30" : "text-text-muted hover:text-warm-white"}`}>
            Students
          </button>
          {user.role === "super" && (
            <button onClick={() => { setTab("users"); loadUsers(); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "users" ? "bg-brand/15 text-brand border border-brand/30" : "text-text-muted hover:text-warm-white"}`}>
              Users
            </button>
          )}
        </div>

        {/* Students tab */}
        {tab === "students" && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or program..." className="bg-dark-deep/60 border-dark-border/50 text-warm-white pl-10 h-11" />
              </div>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); loadStudents(e.target.value); }} className="bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 h-11 text-sm cursor-pointer">
                <option value="all">All statuses</option>
                <option value="applied">Applied</option>
                <option value="registered">Registered</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Student table */}
            <div className="glass rounded-xl border-brand/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider">
                      <th className="text-left p-3 sm:p-4">Name</th>
                      <th className="text-left p-3 sm:p-4 hidden sm:table-cell">Program</th>
                      <th className="text-left p-3 sm:p-4">Status</th>
                      <th className="text-left p-3 sm:p-4 hidden md:table-cell">Progress</th>
                      <th className="text-left p-3 sm:p-4 hidden lg:table-cell">Contact</th>
                      <th className="text-right p-3 sm:p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id} className="border-b border-dark-border/20 hover:bg-brand/5 transition-colors">
                        <td className="p-3 sm:p-4">
                          <div className="text-warm-white font-medium">{s.fullName}</div>
                          <div className="text-text-muted text-xs">{new Date(s.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-3 sm:p-4 hidden sm:table-cell text-text-muted">{s.program}</td>
                        <td className="p-3 sm:p-4">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${statusColors[s.status] || "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-dark-border/50 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full" style={{ width: `${s.progress}%` }} />
                            </div>
                            <span className="text-text-muted text-xs">{s.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 hidden lg:table-cell text-text-muted text-xs">{s.email}<br />{s.phone}</td>
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setEditing(s)} className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand transition-colors" title="Edit">
                              <Users className="w-3.5 h-3.5" />
                            </button>
                            {s.status !== "completed" && (
                              <button onClick={() => issueCertificate(s.id, s.fullName, s.program)} className="p-1.5 rounded hover:bg-green-500/15 text-text-muted hover:text-green-400 transition-colors" title="Issue Certificate">
                                <Award className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {s.certificates.length > 0 && (
                              <button onClick={() => window.open(`/training/certificate/${s.certificates[0].id}`, "_blank")} className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand transition-colors" title="View Certificate">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => deleteStudent(s.id)} className="p-1.5 rounded hover:bg-red-500/15 text-text-muted hover:text-red-400 transition-colors" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="text-center text-text-muted p-8">No students found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === "users" && user.role === "super" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-warm-white font-semibold text-base">Academy Users</h3>
              <Button onClick={() => setShowAddUser(!showAddUser)} variant="outline" className="border-brand/30 text-brand hover:bg-brand/10 text-xs px-4 py-2 rounded-lg">
                {showAddUser ? <><X className="w-3.5 h-3.5 mr-1" /> Cancel</> : <><Plus className="w-3.5 h-3.5 mr-1" /> Add User</>}
              </Button>
            </div>
            {showAddUser && <AddUserForm onCreated={() => { setShowAddUser(false); loadUsers(); }} />}
            <div className="glass rounded-xl border-brand/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4 hidden sm:table-cell">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4 hidden md:table-cell">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-dark-border/20">
                      <td className="p-4 text-warm-white font-medium">{u.name}</td>
                      <td className="p-4 hidden sm:table-cell text-text-muted">{u.email}</td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ${u.role === "super" ? "bg-brand/15 text-brand border-brand/30" : "bg-accent/15 text-accent border-accent/30"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell text-text-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && <EditModal student={editing} onClose={() => setEditing(null)} onSave={updateStudent} />}
    </div>
  );
}

function AddUserForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="glass rounded-xl p-4 border-brand/10 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
      <Button type="submit" disabled={creating} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold h-11 rounded-lg">
        {creating ? "Creating..." : "Create User"}
      </Button>
      {error && <p className="text-red-400 text-sm col-span-full">{error}</p>}
    </form>
  );
}

function EditModal({ student, onClose, onSave }: {
  student: Student;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Student>) => void;
}) {
  const [form, setForm] = useState({
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
    program: student.program,
    status: student.status,
    progress: student.progress,
    notes: student.notes || "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-strong rounded-2xl border-brand/20 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-warm-white font-bold text-lg">Edit Student</h3>
          <button onClick={onClose} className="text-text-muted hover:text-warm-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Full Name</Label>
            <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-text-muted text-xs mb-1.5 block">Email</Label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" />
            </div>
            <div>
              <Label className="text-text-muted text-xs mb-1.5 block">Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-text-muted text-xs mb-1.5 block">Program</Label>
              <Input value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11" />
            </div>
            <div>
              <Label className="text-text-muted text-xs mb-1.5 block">Status</Label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm">
                <option value="applied">Applied</option>
                <option value="registered">Registered</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Progress: {form.progress}%</Label>
            <input type="range" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} className="w-full accent-brand" />
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="bg-dark-deep/60 border-dark-border/50 text-warm-white resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => onSave(student.id, form)} className="flex-1 bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold py-4 rounded-xl">
              <Check className="w-4 h-4 mr-2" /> Save Changes
            </Button>
            <Button onClick={onClose} variant="outline" className="border-dark-border/50 text-text-muted hover:text-warm-white px-6 py-4 rounded-xl">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
