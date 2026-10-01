"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Briefcase, MapPin, Calendar,
  AlertCircle, Loader2,
} from "lucide-react";

// ── Types ──

type Vacancy = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  closingDate: string; // ISO string from the API
  howToApply: string;
  status: "draft" | "active";
  createdAt: string;
  updatedAt: string;
};

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

type FormState = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  closingDate: string; // YYYY-MM-DD
  howToApply: string;
  status: "draft" | "active";
};

const EMPTY_FORM: FormState = {
  title: "",
  department: "",
  location: "",
  employmentType: "full-time",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // default = 30 days from today
  howToApply: "info@ndayenisolutions.co.za",
  status: "draft",
};

// ── Component ──

export default function VacancyManagementPanel() {
  const { toast } = useToast();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state — discriminated by which mode the form is in
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Vacancy | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Load all vacancies (including drafts + expired) ──
  const loadVacancies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/vacancies?admin=true");
      const text = await res.text();
      if (!text) {
        setError("Server returned an empty response. The database may not be configured.");
        return;
      }
      const data = JSON.parse(text);
      if (!data.ok) {
        setError(data.error || "Failed to load vacancies.");
        return;
      }
      setVacancies(data.vacancies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error loading vacancies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVacancies();
  }, [loadVacancies]);

  // ── Client-side validation (mirrors the server checks) ──
  function validateForm(f: FormState): string[] {
    const errs: string[] = [];
    if (!f.title.trim() || f.title.trim().length < 3) errs.push("Title must be at least 3 characters.");
    if (!f.department.trim()) errs.push("Department is required.");
    if (!f.location.trim()) errs.push("Location is required.");
    if (!f.employmentType) errs.push("Employment type is required.");
    if (!f.description.trim() || f.description.trim().length < 20) errs.push("Description must be at least 20 characters.");
    if (!f.howToApply.trim()) errs.push("How to apply is required (email or instructions).");
    if (!f.closingDate) errs.push("Closing date is required.");
    else {
      const d = new Date(f.closingDate);
      if (Number.isNaN(d.getTime())) errs.push("Closing date is invalid.");
      // Note: we don't block past dates client-side in EDIT mode (admin might be editing an old one),
      // but the server enforces future-only on CREATE.
    }
    return errs;
  }

  // ── Open the form for create ──
  function openCreate() {
    setForm(EMPTY_FORM);
    setFormErrors([]);
    setFormMode("create");
    setEditingId(null);
    setFormOpen(true);
  }

  // ── Open the form for edit (pre-fill) ──
  function openEdit(v: Vacancy) {
    setForm({
      title: v.title,
      department: v.department,
      location: v.location,
      employmentType: v.employmentType,
      description: v.description,
      responsibilities: v.responsibilities || "",
      requirements: v.requirements || "",
      benefits: v.benefits || "",
      closingDate: v.closingDate.slice(0, 10), // ISO → YYYY-MM-DD
      howToApply: v.howToApply,
      status: v.status === "active" ? "active" : "draft",
    });
    setFormErrors([]);
    setFormMode("edit");
    setEditingId(v.id);
    setFormOpen(true);
  }

  // ── Submit (create or update) ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(form);
    setFormErrors(errs);
    if (errs.length > 0) return;

    setSubmitting(true);
    try {
      const url =
        formMode === "edit" && editingId
          ? `/api/academy/vacancies/${editingId}`
          : "/api/academy/vacancies";
      const method = formMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : { ok: false, error: "Empty response" };

      if (!res.ok || !data.ok) {
        const serverErrors = data.errors || data.error || "Failed to save vacancy.";
        if (Array.isArray(serverErrors)) {
          setFormErrors(serverErrors);
        } else {
          setFormErrors([typeof serverErrors === "string" ? serverErrors : "Failed to save vacancy."]);
        }
        return;
      }

      toast({
        title: formMode === "edit" ? "Vacancy updated" : "Vacancy created",
        description: `"${data.vacancy.title}" has been ${formMode === "edit" ? "updated" : "created"} successfully.`,
      });
      setFormOpen(false);
      loadVacancies();
    } catch (err) {
      setFormErrors([err instanceof Error ? err.message : "Network error saving vacancy."]);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Toggle status (active ↔ draft) without opening the full edit form ──
  async function toggleStatus(v: Vacancy) {
    const newStatus = v.status === "active" ? "draft" : "active";
    try {
      const res = await fetch(`/api/academy/vacancies/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        toast({ title: "Error", description: data.error || "Failed to update status.", variant: "destructive" });
        return;
      }
      toast({
        title: newStatus === "active" ? "Vacancy published" : "Vacancy unpublished",
        description: `"${v.title}" is now ${newStatus === "active" ? "visible to the public" : "saved as a draft"}.`,
      });
      loadVacancies();
    } catch {
      toast({ title: "Error", description: "Network error updating status.", variant: "destructive" });
    }
  }

  // ── Delete (with confirm) ──
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/academy/vacancies/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        toast({ title: "Error", description: data.error || "Failed to delete vacancy.", variant: "destructive" });
        return;
      }
      toast({
        title: "Vacancy deleted",
        description: `"${deleteTarget.title}" has been permanently deleted.`,
        variant: "destructive",
      });
      setDeleteTarget(null);
      loadVacancies();
    } catch {
      toast({ title: "Error", description: "Network error deleting vacancy.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ──

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-warm-white">Vacancies</h2>
          <p className="text-text-muted text-sm mt-1">
            Create, edit, publish and delete job postings shown on the public{" "}
            <a href="/vacancies" target="_blank" className="text-brand hover:text-brand-light underline underline-offset-2">
              /vacancies
            </a>{" "}
            page.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          New Vacancy
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Couldn&apos;t load vacancies</p>
            <p className="text-red-300/80 mt-1">{error}</p>
            <Button variant="outline" size="sm" className="mt-2 border-red-500/30 text-red-300 hover:bg-red-500/10" onClick={loadVacancies}>
              Try again
            </Button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-brand animate-spin mr-3" />
          <span className="text-text-muted text-sm">Loading vacancies…</span>
        </div>
      )}

      {/* Empty state (when there are zero vacancies) */}
      {!loading && !error && vacancies.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center border-dark-border/30">
          <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-warm-white font-bold text-lg mb-2">No vacancies yet</h3>
          <p className="text-text-muted text-sm mb-5 max-w-md mx-auto">
            Click &quot;New Vacancy&quot; to create your first job posting. It&apos;ll be saved as
            a draft by default — you can publish it when ready.
          </p>
          <Button onClick={openCreate} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Create your first vacancy
          </Button>
        </div>
      )}

      {/* Vacancies table */}
      {!loading && !error && vacancies.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border/30 text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3 hidden sm:table-cell">Department</th>
                <th className="text-left p-3 hidden md:table-cell">Location</th>
                <th className="text-left p-3 hidden lg:table-cell">Closes</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vacancies.map((v) => {
                const isExpired = new Date(v.closingDate).getTime() < Date.now();
                const isDraft = v.status !== "active";
                return (
                  <tr key={v.id} className="border-b border-dark-border/20 hover:bg-brand/5">
                    <td className="p-3">
                      <div className="text-warm-white font-medium">{v.title}</div>
                      <div className="text-text-muted text-xs sm:hidden">
                        {v.department} · {v.location}
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-text-muted text-xs">{v.department}</td>
                    <td className="p-3 hidden md:table-cell text-text-muted text-xs">{v.location}</td>
                    <td className="p-3 hidden lg:table-cell text-text-muted text-xs">
                      <span className={`inline-flex items-center gap-1 ${isExpired ? "text-red-400" : ""}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(v.closingDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="p-3">
                      {isDraft ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-text-muted/15 text-text-muted border border-text-muted/30">Draft</span>
                      ) : isExpired ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">Expired</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">Active</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleStatus(v)}
                          title={isDraft ? "Publish (make visible)" : "Unpublish (hide from public)"}
                          className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand transition-colors"
                        >
                          {isDraft ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => openEdit(v)}
                          title="Edit"
                          className="p-1.5 rounded hover:bg-brand/15 text-text-muted hover:text-brand transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(v)}
                          title="Delete"
                          className="p-1.5 rounded hover:bg-red-500/15 text-text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
            <span>{vacancies.length} total</span>
            <span>{vacancies.filter((v) => v.status === "active" && new Date(v.closingDate).getTime() >= Date.now()).length} active</span>
            <span>{vacancies.filter((v) => v.status !== "active").length} drafts</span>
            <span>{vacancies.filter((v) => v.status === "active" && new Date(v.closingDate).getTime() < Date.now()).length} expired</span>
          </div>
        </div>
      )}

      {/* ── Create / Edit form dialog ── */}
      <Dialog open={formOpen} onOpenChange={(open) => !submitting && setFormOpen(open)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-dark-card border-dark-border/50">
          <DialogHeader>
            <DialogTitle className="text-warm-white">
              {formMode === "edit" ? "Edit Vacancy" : "Create New Vacancy"}
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              {formMode === "edit"
                ? "Update the details below. Changes are live immediately."
                : "Fill in the details below. Saved as a draft by default — publish when ready."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-text-muted text-xs mb-1.5 block">Job Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. IT Support Technician"
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
                required
                maxLength={200}
              />
            </div>

            {/* Department + Employment type (side by side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department" className="text-text-muted text-xs mb-1.5 block">Department *</Label>
                <Input
                  id="department"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Field Services"
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
                  required
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="employmentType" className="text-text-muted text-xs mb-1.5 block">Employment Type *</Label>
                <Select
                  value={form.employmentType}
                  onValueChange={(val) => setForm({ ...form, employmentType: val })}
                >
                  <SelectTrigger className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-card border-dark-border/50">
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location + Closing date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-text-muted text-xs mb-1.5 block">Location *</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Midrand, Gauteng"
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
                  required
                  maxLength={200}
                />
              </div>
              <div>
                <Label htmlFor="closingDate" className="text-text-muted text-xs mb-1.5 block">Closing Date *</Label>
                <Input
                  id="closingDate"
                  type="date"
                  value={form.closingDate}
                  onChange={(e) => setForm({ ...form, closingDate: e.target.value })}
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-text-muted text-xs mb-1.5 block">Description * <span className="text-text-muted/60">(min 20 chars)</span></Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short overview of the role — what the person will do, who they'll work with, why it matters."
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white min-h-[100px]"
                required
                maxLength={5000}
              />
            </div>

            {/* Responsibilities */}
            <div>
              <Label htmlFor="responsibilities" className="text-text-muted text-xs mb-1.5 block">Responsibilities <span className="text-text-muted/60">(one per line)</span></Label>
              <Textarea
                id="responsibilities"
                value={form.responsibilities}
                onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                placeholder={"Diagnose and repair hardware issues\nInstall and configure software\nProvide remote support to clients"}
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white min-h-[100px]"
                maxLength={5000}
              />
            </div>

            {/* Requirements */}
            <div>
              <Label htmlFor="requirements" className="text-text-muted text-xs mb-1.5 block">Requirements <span className="text-text-muted/60">(one per line)</span></Label>
              <Textarea
                id="requirements"
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                placeholder={"2+ years of IT support experience\nCompTIA A+ or equivalent\nValid driver's licence"}
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white min-h-[100px]"
                maxLength={5000}
              />
            </div>

            {/* Benefits */}
            <div>
              <Label htmlFor="benefits" className="text-text-muted text-xs mb-1.5 block">Benefits <span className="text-text-muted/60">(one per line)</span></Label>
              <Textarea
                id="benefits"
                value={form.benefits}
                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                placeholder={"Flexible working hours\nMileage reimbursement for site visits\nAnnual training budget"}
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white min-h-[100px]"
                maxLength={5000}
              />
            </div>

            {/* How to apply */}
            <div>
              <Label htmlFor="howToApply" className="text-text-muted text-xs mb-1.5 block">How to Apply * <span className="text-text-muted/60">(email or instructions)</span></Label>
              <Input
                id="howToApply"
                value={form.howToApply}
                onChange={(e) => setForm({ ...form, howToApply: e.target.value })}
                placeholder="info@ndayenisolutions.co.za"
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
                required
                maxLength={500}
              />
              <p className="text-text-muted text-xs mt-1.5">
                If you enter an email address, the public detail page will show a &quot;Apply now via email&quot; button that opens a prefilled email.
              </p>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status" className="text-text-muted text-xs mb-1.5 block">Status</Label>
              <Select
                value={form.status}
                onValueChange={(val) => setForm({ ...form, status: val as "draft" | "active" })}
              >
                <SelectTrigger className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-border/50">
                  <SelectItem value="draft">Draft (hidden from public)</SelectItem>
                  <SelectItem value="active">Active (visible on /vacancies)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Validation errors */}
            {formErrors.length > 0 && (
              <div className="space-y-1 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                {formErrors.map((err, i) => (
                  <p key={i} className="text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{err}</span>
                  </p>
                ))}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={submitting}
                className="border-dark-border/50 text-text-muted hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {formMode === "edit" ? "Saving…" : "Creating…"}
                  </>
                ) : (
                  formMode === "edit" ? "Save changes" : "Create vacancy"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !deleting && !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-dark-card border-dark-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warm-white">Delete this vacancy?</AlertDialogTitle>
            <AlertDialogDescription className="text-text-muted">
              You&apos;re about to permanently delete{" "}
              <strong className="text-warm-white">{deleteTarget?.title}</strong>. This cannot be
              undone. The vacancy will be removed from both the admin table and the public
              /vacancies page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-dark-border/50 text-text-muted hover:bg-white/5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete permanently
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
