"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, LogOut, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import VacancyManagementPanel from "@/components/academy/VacancyManagementPanel";

type SessionUser = { id: string; email: string; name: string; role: string };

/**
 * Standalone Vacancies Admin — completely decoupled from the SMS at /training/admin.
 *
 * This is a deliberate architectural choice: the SMS will eventually be spun off
 * as its own system, and the public-facing website (with /vacancies + this admin
 * area) should stand on its own. Both apps share the same AcademyUser table +
 * academy-auth.ts session cookie (single sign-on), but the UIs are independent.
 *
 * Auth flow:
 *   1. On mount, call GET /api/academy/vacancies?admin=true (cookie sent automatically)
 *   2. 200 → user has a valid session → render VacancyManagementPanel
 *   3. 401 → user not authenticated → render the inline login form
 *   4. Login form POSTs to /api/academy/login (the SAME endpoint the SMS uses)
 *      → on success, the server sets the academy_session cookie → we refetch
 *      the vacancies → user sees the panel
 *   5. Logout button POSTs to /api/academy/logout → clears cookie → back to login
 */
export default function VacanciesAdminPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Check session on mount — call the admin-only vacancies endpoint
  // (it returns 401 if the academy_session cookie is absent or invalid)
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/vacancies?admin=true");
      if (res.ok) {
        // Valid session. We don't have a /me endpoint to get the user's exact
        // identity on session restore (page refresh) — use a placeholder,
        // matching the pattern from /training/admin/page.tsx. The real user
        // object is captured immediately after login (see handleLogin below).
        setUser({ id: "session", email: "", name: "Admin", role: "admin" });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Login — reuse the existing /api/academy/login endpoint (shared with SMS admin)
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
        setLoginError("Server returned an empty response. The database may not be configured. Please contact support.");
        return;
      }
      const data = JSON.parse(text);
      if (!data.ok) {
        setLoginError(data.error || "Login failed. Check your credentials.");
        return;
      }
      setUser(data.user);
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Network error during login.");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/academy/logout", { method: "POST" });
    } catch {
      // Even if the network call fails, clear local state so the user sees the login form.
    }
    setUser(null);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-deep">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-brand animate-spin" />
          <span className="text-text-muted text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  // ── Not logged in → show inline login form ──
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dark-deep px-4 relative overflow-hidden">
        {/* Decorative mesh background (matches the rest of the site) */}
        <div aria-hidden="true" className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <Card className="relative z-10 w-full max-w-md bg-dark-card/80 backdrop-blur-xl border-dark-border/50">
          <CardContent className="p-6 sm:p-8">
            {/* Brand header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-dark-deep" />
              </div>
              <div>
                <div className="text-warm-white font-semibold text-sm">Vacancies Admin</div>
                <div className="text-text-muted text-[10px]">Ndayeni Solutions Pty Ltd</div>
              </div>
            </div>

            <h1 className="text-warm-white font-bold text-xl mb-2">Sign in to Publish</h1>
            <p className="text-text-muted text-sm mb-6">
              Manage job postings shown on the public{" "}
              <Link href="/vacancies" className="text-brand hover:text-brand-light underline underline-offset-2">
                /vacancies
              </Link>{" "}
              page. Use the same credentials as the SMS admin.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-text-muted text-xs mb-1.5 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@ndayenisolutions.co.za"
                  required
                  autoComplete="email"
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-text-muted text-xs mb-1.5 block">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11"
                />
              </div>
              {loginError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}
              <Button
                type="submit"
                disabled={loginSubmitting}
                className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold py-5 rounded-xl"
              >
                {loginSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-right">
                <Link
                  href="/training/forgot-password"
                  className="text-sm text-brand hover:text-brand-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Discreet back-to-public-vacancies link */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Link
            href="/vacancies"
            className="inline-flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-xs"
          >
            <ArrowLeft className="w-3 h-3" />
            View public vacancies
          </Link>
        </div>
      </main>
    );
  }

  // ── Logged in → show the VacancyManagementPanel ──
  return (
    <main className="min-h-screen bg-dark-deep">
      {/* Sticky header with brand + breadcrumb + logout */}
      <header className="glass-strong border-b border-dark-border/30 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/vacancies"
              className="flex items-center gap-1.5 text-text-muted hover:text-brand transition-colors text-xs sm:text-sm flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View vacancies</span>
              <span className="sm:hidden">Vacancies</span>
            </Link>
            <span className="text-text-muted/30">/</span>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-3.5 h-3.5 text-dark-deep" />
              </div>
              <span className="text-warm-white font-semibold text-sm truncate">Vacancies Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-xs text-right hidden sm:block">
              <div className="text-warm-white font-medium truncate max-w-[180px]">{user.name}</div>
              <div className="text-text-muted capitalize">{user.role}</div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-dark-border/50 text-text-muted hover:bg-white/5 hover:text-red-400 hover:border-red-400/30"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content — the panel handles its own loading/empty/error states */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <VacancyManagementPanel />
      </div>
    </main>
  );
}
