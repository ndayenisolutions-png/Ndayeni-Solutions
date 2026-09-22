"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  KeyRound,
  Trash2,
  Plus,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────

interface AcademyUser {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserManagementProps {
  users: AcademyUser[];
  currentUser: CurrentUser;
  onUsersChanged: () => void;
}

type DialogState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; user: AcademyUser }
  | { type: "reset"; user: AcademyUser }
  | { type: "delete"; user: AcademyUser };

interface AddUserFormState {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface EditUserFormState {
  name: string;
  role: string;
  active: boolean;
}

interface ResetPasswordFormState {
  password: string;
  confirm: string;
}

interface ApiResult {
  ok: boolean;
  error?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  super: "Super Admin",
  admin: "Administrator",
  admissions: "Admissions",
  training: "Training Admin",
  readonly: "Read Only",
};

const ROLE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "super", label: "Super Admin" },
  { value: "admin", label: "Administrator" },
  { value: "admissions", label: "Admissions" },
  { value: "training", label: "Training Admin" },
  { value: "readonly", label: "Read Only" },
];

const ROLE_LEGEND: Array<{ role: string; description: string }> = [
  {
    role: "super",
    description: "Full control — manage users, courses, students, and all settings.",
  },
  {
    role: "admin",
    description: "Manage students, courses, and certificates. Cannot manage users.",
  },
  {
    role: "admissions",
    description: "Process applications, enrol students, and issue welcome letters.",
  },
  {
    role: "training",
    description: "Record attendance, grade assessments, and manage student progress.",
  },
  {
    role: "readonly",
    description: "View-only access to all SMS modules.",
  },
];

function roleBadgeClass(role: string): string {
  if (role === "super") return "bg-brand/15 text-brand border-brand/30";
  if (role === "admin") return "bg-accent/15 text-accent border-accent/30";
  return "bg-white/5 text-text-muted border-dark-border/40";
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── API helpers ─────────────────────────────────────────────────────────

async function postUsers(body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch("/api/academy/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!text) return { ok: res.ok };
    try {
      const data = JSON.parse(text) as { ok?: boolean; error?: string };
      return { ok: res.ok && Boolean(data.ok), error: data.error };
    } catch {
      return { ok: false, error: "Unexpected server response." };
    }
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

async function deleteUserRequest(id: string): Promise<ApiResult> {
  try {
    const res = await fetch(
      `/api/academy/users?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    const text = await res.text();
    if (!text) return { ok: res.ok };
    try {
      const data = JSON.parse(text) as { ok?: boolean; error?: string };
      return { ok: res.ok && Boolean(data.ok), error: data.error };
    } catch {
      return { ok: false, error: "Unexpected server response." };
    }
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function UserManagementPanel({
  users,
  currentUser,
  onUsersChanged,
}: UserManagementProps) {
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });

  const isSuper = currentUser.role === "super";

  const closeDialog = () => setDialog({ type: "none" });
  const handleChanged = () => {
    onUsersChanged();
    closeDialog();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-gradient-brand font-bold text-xl sm:text-2xl">
          Users &amp; Permissions
        </h1>
        {isSuper && (
          <Button
            onClick={() => setDialog({ type: "add" })}
            className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold text-xs px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Users Table */}
      <div className="glass rounded-xl border-brand/10 overflow-hidden">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="border-dark-border/30 hover:bg-transparent">
              <TableHead className="text-text-muted text-xs uppercase tracking-wider p-3">
                Name
              </TableHead>
              <TableHead className="text-text-muted text-xs uppercase tracking-wider p-3 hidden md:table-cell">
                Email
              </TableHead>
              <TableHead className="text-text-muted text-xs uppercase tracking-wider p-3">
                Role
              </TableHead>
              <TableHead className="text-text-muted text-xs uppercase tracking-wider p-3">
                Status
              </TableHead>
              <TableHead className="text-text-muted text-xs uppercase tracking-wider p-3 hidden lg:table-cell">
                Created At
              </TableHead>
              <TableHead className="text-text-muted text-xs uppercase tracking-wider p-3 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow className="border-dark-border/20">
                <TableCell colSpan={6} className="p-6 text-center text-text-muted text-sm">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const canManage = isSuper || currentUser.id === u.id;
                const canDelete = isSuper && u.id !== currentUser.id;
                return (
                  <TableRow key={u.id} className="border-dark-border/20">
                    <TableCell className="p-3">
                      <div className="text-warm-white font-medium flex items-center gap-2">
                        {u.name}
                        {u.id === currentUser.id && (
                          <span className="text-[10px] text-text-muted font-normal">
                            (you)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-3 hidden md:table-cell text-text-muted">
                      {u.email}
                    </TableCell>
                    <TableCell className="p-3">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${roleBadgeClass(
                          u.role,
                        )}`}
                      >
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </TableCell>
                    <TableCell className="p-3">
                      <Badge
                        variant="outline"
                        className={
                          u.active
                            ? "border-green-500/30 bg-green-500/15 text-green-400 text-[10px]"
                            : "border-red-500/30 bg-red-500/15 text-red-400 text-[10px]"
                        }
                      >
                        {u.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-3 hidden lg:table-cell text-text-muted text-xs">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!canManage}
                          onClick={() => setDialog({ type: "edit", user: u })}
                          aria-label={`Edit ${u.name}`}
                          className="text-text-muted hover:text-brand hover:bg-brand/10 h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!canManage}
                          onClick={() => setDialog({ type: "reset", user: u })}
                          aria-label={`Reset password for ${u.name}`}
                          className="text-text-muted hover:text-accent hover:bg-accent/10 h-8 w-8 p-0"
                        >
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!canDelete}
                          onClick={() =>
                            canDelete && setDialog({ type: "delete", user: u })
                          }
                          aria-label={`Delete ${u.name}`}
                          className="text-text-muted hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0 disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Legend + Add User duplicate */}
      <div className="glass rounded-xl border-brand/10 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-brand" />
          <h3 className="text-warm-white font-semibold text-sm">Role Legend</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ROLE_LEGEND.map(({ role, description }) => (
            <div key={role} className="flex items-start gap-2">
              <span
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border flex-shrink-0 mt-0.5 ${roleBadgeClass(
                  role,
                )}`}
              >
                {ROLE_LABELS[role]}
              </span>
              <span className="text-text-muted text-xs leading-relaxed">
                {description}
              </span>
            </div>
          ))}
        </div>
        {isSuper && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setDialog({ type: "add" })}
              className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold text-xs px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {dialog.type === "add" && (
        <AddUserDialog onClose={closeDialog} onChanged={handleChanged} />
      )}
      {dialog.type === "edit" && (
        <EditUserDialog
          user={dialog.user}
          currentUser={currentUser}
          onClose={closeDialog}
          onChanged={handleChanged}
        />
      )}
      {dialog.type === "reset" && (
        <ResetPasswordDialog
          user={dialog.user}
          onClose={closeDialog}
          onChanged={handleChanged}
        />
      )}
      {dialog.type === "delete" && (
        <DeleteUserDialog
          user={dialog.user}
          onClose={closeDialog}
          onChanged={handleChanged}
        />
      )}
    </div>
  );
}

// ─── Add User Dialog ─────────────────────────────────────────────────────

function AddUserDialog({
  onClose,
  onChanged,
}: {
  onClose: () => void;
  onChanged: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<AddUserFormState>({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordLong = form.password.length >= 8;
  const formValid =
    form.name.trim().length > 0 &&
    isValidEmail(form.email) &&
    passwordLong;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formValid) {
      setError(
        "Please fill all fields. Password must be at least 8 characters.",
      );
      return;
    }
    setSubmitting(true);
    const result = await postUsers({
      action: "create",
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Failed to create user.");
      return;
    }
    toast({
      title: "User created",
      description: `${form.name.trim()} (${form.email.trim()}) has been added.`,
    });
    onChanged();
  };

  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="bg-dark-card/95 backdrop-blur-xl border-dark-border/50 text-warm-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-warm-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-brand" />
            Add User
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Create a new academy account. The user will receive the password you
            set.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              required
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
            />
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@ndayenisolutions.co.za"
              required
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
            />
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">
              Password (8+ characters)
            </Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              minLength={8}
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
            />
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">Role</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v })}
            >
              <SelectTrigger className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border/50 text-warm-white">
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-warm-white focus:bg-brand/15 focus:text-brand"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-dark-border/50 text-text-muted hover:text-warm-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !formValid}
              className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold"
            >
              {submitting ? "Creating…" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit User Dialog ────────────────────────────────────────────────────

function EditUserDialog({
  user,
  currentUser,
  onClose,
  onChanged,
}: {
  user: AcademyUser;
  currentUser: CurrentUser;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<EditUserFormState>({
    name: user.name,
    role: user.role,
    active: user.active,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDemoteOpen, setConfirmDemoteOpen] = useState(false);

  const isSelf = currentUser.id === user.id;
  const isSuperEditingSelf = isSelf && currentUser.role === "super";
  const demotingSelf = isSuperEditingSelf && form.role !== "super";

  const doSubmit = async () => {
    setError(null);
    setSubmitting(true);
    const result = await postUsers({
      action: "update",
      id: user.id,
      name: form.name.trim(),
      role: form.role,
      active: form.active,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Failed to update user.");
      return;
    }
    toast({
      title: "User updated",
      description: `${form.name.trim()} has been saved.`,
    });
    onChanged();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demotingSelf) {
      setConfirmDemoteOpen(true);
      return;
    }
    void doSubmit();
  };

  const onConfirmDemote = () => {
    setConfirmDemoteOpen(false);
    void doSubmit();
  };

  return (
    <>
      <Dialog
        open
        onOpenChange={(v) => {
          if (!v) onClose();
        }}
      >
        <DialogContent className="bg-dark-card/95 backdrop-blur-xl border-dark-border/50 text-warm-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-warm-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-brand" />
              Edit User
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              {isSelf
                ? "Editing your own account."
                : `Editing ${user.email}.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label className="text-text-muted text-xs mb-1.5 block">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
              />
            </div>
            <div>
              <Label className="text-text-muted text-xs mb-1.5 block">
                Email
              </Label>
              <Input
                value={user.email}
                disabled
                className="bg-dark-deep/40 border-dark-border/30 text-text-muted h-11"
              />
              <p className="text-[10px] text-text-muted mt-1">
                Email cannot be changed.
              </p>
            </div>
            <div>
              <Label className="text-text-muted text-xs mb-1.5 block">Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v })}
              >
                <SelectTrigger className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-border/50 text-warm-white">
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      disabled={
                        opt.value === "super" && currentUser.role !== "super"
                      }
                      className="text-warm-white focus:bg-brand/15 focus:text-brand"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between glass rounded-lg p-3 border-brand/10">
              <div>
                <Label className="text-warm-white text-sm">Active</Label>
                <p className="text-[11px] text-text-muted">
                  Inactive users cannot sign in.
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
            </div>
            {demotingSelf && (
              <p className="text-orange-400 text-xs">
                <span className="font-bold">Warning:</span> You are about to
                remove your own super admin privileges. You will be asked to
                confirm before saving.
              </p>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-dark-border/50 text-text-muted hover:text-warm-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold"
              >
                {submitting ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Demote-self confirmation (nested AlertDialog) */}
      <AlertDialog
        open={confirmDemoteOpen}
        onOpenChange={setConfirmDemoteOpen}
      >
        <AlertDialogContent className="bg-dark-card/95 backdrop-blur-xl border-dark-border/50 text-warm-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warm-white">
              Remove your own super admin privileges?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text-muted">
              You are about to demote yourself from super admin. After this
              change you may lose access to user management and other
              super-only features. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-dark-border/50 text-text-muted hover:text-warm-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirmDemote();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:opacity-90"
            >
              Yes, demote me
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Reset Password Dialog ───────────────────────────────────────────────

function ResetPasswordDialog({
  user,
  onClose,
  onChanged,
}: {
  user: AcademyUser;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<ResetPasswordFormState>({
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = form.password === form.confirm;
  const passwordLong = form.password.length >= 8;
  const formValid = passwordLong && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!passwordLong) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const result = await postUsers({
      action: "resetPassword",
      id: user.id,
      password: form.password,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Failed to reset password.");
      return;
    }
    toast({
      title: "Password reset successfully",
      description: `A new password has been set for ${user.name}.`,
    });
    onChanged();
  };

  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="bg-dark-card/95 backdrop-blur-xl border-dark-border/50 text-warm-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-warm-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-accent" />
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Set a new password for{" "}
            <span className="text-warm-white font-medium">{user.name}</span> (
            {user.email}). The user will need this new password to sign in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">
              New Password (8+ characters)
            </Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              minLength={8}
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
            />
          </div>
          <div>
            <Label className="text-text-muted text-xs mb-1.5 block">
              Confirm Password
            </Label>
            <Input
              type="password"
              value={form.confirm}
              onChange={(e) =>
                setForm({ ...form, confirm: e.target.value })
              }
              required
              minLength={8}
              className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
            />
            {form.confirm.length > 0 && !passwordsMatch && (
              <p className="text-red-400 text-xs mt-1">
                Passwords do not match.
              </p>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-dark-border/50 text-text-muted hover:text-warm-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !formValid}
              className="bg-gradient-to-r from-accent to-cyan-400 text-dark-deep font-semibold"
            >
              {submitting ? "Resetting…" : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete User Dialog (AlertDialog) ───────────────────────────────────

function DeleteUserDialog({
  user,
  onClose,
  onChanged,
}: {
  user: AcademyUser;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setSubmitting(true);
    const result = await deleteUserRequest(user.id);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Failed to delete user.");
      return;
    }
    toast({
      title: "User deleted",
      description: `${user.name} (${user.email}) has been removed.`,
    });
    onChanged();
  };

  return (
    <AlertDialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <AlertDialogContent className="bg-dark-card/95 backdrop-blur-xl border-dark-border/50 text-warm-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-warm-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-muted">
            Are you sure you want to delete user{" "}
            <span className="text-warm-white font-medium">{user.name}</span> (
            {user.email})? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="glass rounded-lg p-3 border-red-500/20 text-xs text-text-muted">
          All audit log entries created by this user will have their{" "}
          <code className="text-warm-white">userId</code> set to{" "}
          <code className="text-warm-white">null</code>, preserving the audit
          trail but losing the link to the deleted user.
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-dark-border/50 text-text-muted hover:text-warm-white"
            disabled={submitting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void handleDelete();
            }}
            disabled={submitting}
            className="bg-destructive text-white hover:bg-destructive/90 font-semibold"
          >
            {submitting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
