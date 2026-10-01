"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, KeyRound, Mail } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────
interface ForgotPasswordFormProps {
  initialToken: string | null;
}

type Status = "idle" | "loading" | "success" | "error";

// Same regex the forgot-password API uses — client-side validation should
// match the server's notion of a valid email so we never POST an obviously
// bad value (and therefore never see the 422 path in practice).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// ─── Component ──────────────────────────────────────────────────────────
export default function ForgotPasswordForm({
  initialToken,
}: ForgotPasswordFormProps) {
  const router = useRouter();

  // Treat an empty-string token the same as no token — the spec calls this
  // out explicitly. ?token= (empty value) should land in MODE A.
  const hasToken = Boolean(initialToken && initialToken.length > 0);

  // Shared UI state.
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // MODE A state — email request form.
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  // MODE B state — new password form.
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");

  // ─── MODE A: request reset link ───────────────────────────────────────
  const validateEmail = (value: string): string => {
    if (!value.trim()) return "Email is required.";
    if (!EMAIL_RE.test(value)) return "Please enter a valid email address.";
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Only re-validate on change if a previous error was shown — avoids
    // shouting at the user before they finish typing.
    if (emailError) setEmailError(validateEmail(value));
  };

  const handleModeASubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validateEmail(email);
    if (v) {
      setEmailError(v);
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    try {
      // The forgot-password API NEVER reveals whether the email exists — it
      // returns ok:true for any well-formed address. So per spec, we show
      // the success state on ANY HTTP response (200, 422, 500). The only
      // failure path that surfaces to the user is a network error (catch).
      await fetch("/api/academy/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? `Network error: ${err.message}`
          : "Network error: Unable to reach the server. Please check your connection and try again."
      );
    }
  };

  // Returns the form to its idle state. Per spec, we do NOT clear the
  // email input — the user might want to retry or simply confirm what
  // they typed.
  const handleModeARetry = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  // ─── MODE B: set a new password ────────────────────────────────────────
  const validatePassword = (value: string): string => {
    if (!value) return "Password is required.";
    if (value.length < MIN_PASSWORD_LENGTH)
      return "Password must be at least 8 characters.";
    return "";
  };

  const validateConfirm = (pw: string, cf: string): string => {
    if (!cf) return "Please confirm your password.";
    if (cf !== pw) return "Passwords do not match.";
    return "";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError(validatePassword(value));
    // Re-validate confirm field too — if user fixes the password to match
    // an existing confirm value, we want the error cleared.
    if (confirmError) setConfirmError(validateConfirm(value, confirmPassword));
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmError) setConfirmError(validateConfirm(password, value));
  };

  const handleModeBSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pv = validatePassword(password);
    const cv = validateConfirm(password, confirmPassword);
    if (pv || cv) {
      setPasswordError(pv);
      setConfirmError(cv);
      return;
    }
    // Defensive — the form only renders in MODE B when hasToken is true,
    // but guard anyway in case some future refactor misses a path.
    if (!initialToken) {
      setStatus("error");
      setErrorMessage("This reset link is invalid or has expired.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/academy/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: initialToken, password }),
      });
      // Parse the JSON defensively — the API always returns JSON but a
      // 502/proxy response could return something unexpected.
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = (await res.json()) as { ok?: boolean; error?: string };
      } catch {
        data = {};
      }
      if (!res.ok || data.ok !== true) {
        // The API returns "Invalid or expired reset link." (400) for bad
        // signature / expiry / malformed / user-not-found / user-inactive.
        // We surface that text verbatim, falling back to the canonical
        // message if the response body is empty/malformed.
        setStatus("error");
        setErrorMessage(
          data && typeof data.error === "string" && data.error.length > 0
            ? data.error
            : "This reset link is invalid or has expired."
        );
        return;
      }
      // Success — the token is now spent. Show success state and DO NOT
      // allow re-submit (the success card has no form / submit button).
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? `Network error: ${err.message}`
          : "Network error: Unable to reach the server. Please check your connection and try again."
      );
    }
  };

  // Navigates to /training/forgot-password WITHOUT a token — switches to
  // MODE A so the user can request a fresh link. Per spec, this is the
  // action for the MODE B "Request a new link" button.
  const handleRequestNewLink = () => {
    router.push("/training/forgot-password");
  };

  // ─── MODE A SUCCESS STATE ─────────────────────────────────────────────
  // "If an account with that email exists, a reset link has been sent."
  // + "Check your inbox (and spam folder). The link expires in 1 hour."
  // + "Request another link" button → returns to form.
  if (!hasToken && status === "success") {
    return (
      <Card className="glass-strong rounded-2xl border-brand/20 glow-brand p-6 sm:p-8 gap-0">
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <CardTitle className="text-warm-white font-bold text-xl sm:text-2xl mb-3 p-0">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-text-muted text-sm sm:text-base mb-2 leading-relaxed p-0">
            If an account with that email exists, a reset link has been sent.
          </CardDescription>
          <CardDescription className="text-text-muted/70 text-xs sm:text-sm mb-6 leading-relaxed p-0">
            Check your inbox (and spam folder). The link expires in 1 hour.
          </CardDescription>
          <Button
            onClick={handleModeARetry}
            variant="outline"
            className="border-brand/30 text-brand hover:bg-brand/10 px-6 py-3 rounded-full w-full sm:w-auto"
          >
            Request another link
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ─── MODE B SUCCESS STATE ─────────────────────────────────────────────
  // "Your password has been reset." + "Click here to log in" link to /training/admin.
  // Token is now spent — no form / re-submit option in this state.
  if (hasToken && status === "success") {
    return (
      <Card className="glass-strong rounded-2xl border-brand/20 glow-brand p-6 sm:p-8 gap-0">
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <CardTitle className="text-warm-white font-bold text-xl sm:text-2xl mb-3 p-0">
            Password Reset
          </CardTitle>
          <CardDescription className="text-text-muted text-sm sm:text-base mb-6 leading-relaxed p-0">
            Your password has been reset. You can now log in with your new password.
          </CardDescription>
          <Link href="/training/admin" className="w-full sm:w-auto">
            <Button className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-full w-full sm:w-auto">
              Click here to log in
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // ─── ERROR STATE (shared by both modes) ───────────────────────────────
  // MODE A: only triggered by network errors (API never reveals if email
  // exists). Shows the actual network error message + "Try again" button
  // that returns to the form (preserving the email input).
  // MODE B: triggered by invalid/expired token OR network errors. Shows the
  // server's error message (or "This reset link is invalid or has expired."
  // as the canonical fallback) + "Request a new link" button that navigates
  // to /training/forgot-password without a token (switches to MODE A).
  if (status === "error") {
    return (
      <Card className="glass-strong rounded-2xl border-red-500/20 p-6 sm:p-8 gap-0">
        <CardContent className="p-0 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-warm-white font-bold text-xl sm:text-2xl mb-3 p-0">
            {hasToken ? "Reset Link Invalid" : "Request Failed"}
          </CardTitle>
          <Alert
            variant="destructive"
            className="bg-red-500/10 border-red-500/30 text-red-300 mb-6 text-left w-full"
          >
            <AlertCircle className="text-red-400" />
            <AlertDescription className="text-red-300/90">
              {errorMessage ||
                "This reset link is invalid or has expired."}
            </AlertDescription>
          </Alert>
          {hasToken ? (
            <Button
              onClick={handleRequestNewLink}
              className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-full w-full sm:w-auto"
            >
              Request a new link
            </Button>
          ) : (
            <Button
              onClick={handleModeARetry}
              className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-full w-full sm:w-auto"
            >
              Try again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // ─── MODE A FORM (request reset link) ──────────────────────────────────
  // Heading: "Reset Your Password"
  // Description: "Enter your email below and we'll send you a link to reset your password."
  // Form: Email input (with Mail icon) + "Send Reset Link" button.
  // Loading: spinner + "Sending..."
  if (!hasToken) {
    return (
      <Card className="glass-strong rounded-2xl border-brand/20 glow-brand p-6 sm:p-8 gap-0">
        <CardHeader className="p-0 mb-6 space-y-2">
          <CardTitle className="text-warm-white font-bold text-xl sm:text-2xl p-0">
            <span className="text-gradient-brand">Reset Your Password</span>
          </CardTitle>
          <CardDescription className="text-text-muted text-sm sm:text-base leading-relaxed p-0">
            Enter your email below and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleModeASubmit} className="space-y-4" noValidate>
            <div>
              <Label
                htmlFor="forgot-email"
                className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60 pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="you@example.com"
                  disabled={status === "loading"}
                  required
                  className={`bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm pl-10 ${
                    emailError ? "border-red-500/50" : ""
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-red-400 text-[10px] mt-1" role="alert">
                  {emailError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-lg text-sm w-full h-11"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-dark-deep/30 border-t-dark-deep rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // ─── MODE B FORM (set new password) ────────────────────────────────────
  // Heading: "Set a New Password"
  // Description: "Choose a new password for your account."
  // Form: New Password + Confirm Password (both type=password) + "Reset Password" button.
  // Loading: spinner + "Resetting..."
  return (
    <Card className="glass-strong rounded-2xl border-brand/20 glow-brand p-6 sm:p-8 gap-0">
      <CardHeader className="p-0 mb-6 space-y-2">
        <CardTitle className="text-warm-white font-bold text-xl sm:text-2xl p-0">
          <span className="text-gradient-brand">Set a New Password</span>
        </CardTitle>
        <CardDescription className="text-text-muted text-sm sm:text-base leading-relaxed p-0">
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleModeBSubmit} className="space-y-4" noValidate>
          <div>
            <Label
              htmlFor="forgot-password"
              className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block"
            >
              New Password
            </Label>
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/60 pointer-events-none"
                aria-hidden="true"
              />
              <Input
                id="forgot-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="At least 8 characters"
                disabled={status === "loading"}
                required
                className={`bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm pl-10 ${
                  passwordError ? "border-red-500/50" : ""
                }`}
              />
            </div>
            {passwordError && (
              <p className="text-red-400 text-[10px] mt-1" role="alert">
                {passwordError}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="forgot-confirm"
              className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block"
            >
              Confirm Password
            </Label>
            <Input
              id="forgot-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
              placeholder="Re-enter your new password"
              disabled={status === "loading"}
              required
              className={`bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm ${
                confirmError ? "border-red-500/50" : ""
              }`}
            />
            {confirmError && (
              <p className="text-red-400 text-[10px] mt-1" role="alert">
                {confirmError}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-lg text-sm w-full h-11"
          >
            {status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-dark-deep/30 border-t-dark-deep rounded-full animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
