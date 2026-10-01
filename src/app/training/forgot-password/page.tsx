import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import ForgotPasswordForm from "@/components/academy/ForgotPasswordForm";

// Force dynamic — never cache a route that reads query-string tokens.
// Same posture as the SMS-BE-4 forgot/reset endpoints.
export const dynamic = "force-dynamic";

// ─── Page ────────────────────────────────────────────────────────────────
// PUBLIC page (no auth required to view). Two modes are decided ENTIRELY by
// the presence of a `?token=...` query parameter — the form decides which
// sub-UI to render based on whether `initialToken` is non-empty.
//
//   GET /training/forgot-password              → MODE A (request reset link)
//   GET /training/forgot-password?token=<tok>  → MODE B (set a new password)
//
// The token's validity (HMAC signature + expiry) is verified by the
// /api/academy/auth/reset-password endpoint when the form is submitted —
// the page itself does NOT do server-side token verification before
// rendering the form. This is intentional: it keeps the page static + fast,
// and the API's safe 400 response ("Invalid or expired reset link.")
// drives the error state in the form.
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Next.js 16 — searchParams is async (Promise). Await before reading.
  const sp = await searchParams;
  const token = sp.token || null;

  return (
    <main className="min-h-screen flex flex-col bg-dark-surface">
      {/* ─── Minimal Academy Header ─────────────────────────────────────
          The full marketing Navbar is too noisy for an auth flow. A small
          branded header (logo + "Ndayeni Academy" + back-to-login link)
          mirrors the academy section styling from /training/page.tsx. */}
      <header className="sticky top-0 z-50 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/training"
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <span className="text-dark-deep font-bold text-base">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-warm-white font-semibold text-sm sm:text-base leading-tight">
                Ndayeni Academy
              </span>
              <span className="text-text-muted text-[9px] sm:text-[10px] tracking-[0.15em] uppercase leading-tight">
                Digital Academy
              </span>
            </div>
          </Link>
          <Link
            href="/training/admin"
            className="text-text-muted hover:text-brand text-xs sm:text-sm transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* ─── Form Card ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background flourishes — match the training hero aesthetic. */}
        <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
        <div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[150px]"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/4 rounded-full blur-[120px]"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-md">
          <ForgotPasswordForm initialToken={token} />

          {/* Back to login — visible in both modes. */}
          <div className="mt-6 text-center">
            <Link
              href="/training/admin"
              className="inline-flex items-center text-sm text-text-muted hover:text-warm-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Minimal Footer ───────────────────────────────────────────── */}
      <footer className="relative bg-dark-deep border-t border-dark-border/30 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} Ndayeni Solutions Pty Ltd — Digital
            Academy · <ShieldCheck className="w-3 h-3 inline" /> POPIA
            Compliant
          </p>
        </div>
      </footer>
    </main>
  );
}
