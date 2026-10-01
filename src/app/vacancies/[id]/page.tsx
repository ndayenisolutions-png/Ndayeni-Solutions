import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle,
  ListChecks,
  Award,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Static params + generateMetadata for SEO ──
// (vacancies don't have static IDs — we let Next.js generate pages on-demand)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vacancy = await db.vacancy.findUnique({
    where: { id },
    select: { title: true, department: true, location: true, description: true, status: true, closingDate: true },
  });

  // 404 if not found, draft, or expired — but only show "not found" (no leaking)
  if (!vacancy) return { title: "Vacancy not found" };
  const isExpired = vacancy.closingDate.getTime() < Date.now();
  if (vacancy.status !== "active" || isExpired) {
    return { title: "Vacancy not found" };
  }

  const description = `${vacancy.title} — ${vacancy.department} in ${vacancy.location}. ${vacancy.description.slice(0, 140)}`;

  return {
    title: `${vacancy.title} | Careers`,
    description,
    alternates: { canonical: `/vacancies/${id}` },
    openGraph: {
      title: `${vacancy.title} — Ndayeni Solutions`,
      description,
      url: `/vacancies/${id}`,
      type: "article",
    },
  };
}

// ── Helper: split a multi-line string into bullet-listable lines ──
function toBullets(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vacancy = await db.vacancy.findUnique({ where: { id } });

  // Public viewers can only see active + non-expired vacancies.
  if (!vacancy) notFound();
  const isExpired = vacancy.closingDate.getTime() < Date.now();
  if (vacancy.status !== "active" || isExpired) notFound();

  const responsibilities = toBullets(vacancy.responsibilities);
  const requirements = toBullets(vacancy.requirements);
  const benefits = toBullets(vacancy.benefits);

  const closingDateStr = vacancy.closingDate.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Build the apply link — if howToApply looks like an email, mailto: it; otherwise show as text.
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vacancy.howToApply);
  const applyHref = isEmail
    ? `mailto:${vacancy.howToApply}?subject=Application: ${encodeURIComponent(vacancy.title)}`
    : null;

  return (
    <main className="min-h-screen flex flex-col bg-dark-deep">
      {/* ── Header ── */}
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/vacancies"
            className="inline-flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All vacancies
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-brand/15 text-brand border border-brand/30">
              {vacancy.employmentType}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
              {vacancy.department}
            </span>
          </div>

          <h1 className="text-warm-white font-bold text-3xl sm:text-4xl tracking-tight mb-4 leading-tight">
            {vacancy.title}
          </h1>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {vacancy.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              {vacancy.department}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Closing {closingDateStr}
            </span>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="flex-1 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50 mb-6">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-brand" />
                <h2 className="text-warm-white font-bold text-lg">About the role</h2>
              </div>
              <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
                {vacancy.description}
              </p>
            </CardContent>
          </Card>

          {responsibilities.length > 0 && (
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50 mb-6">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <ListChecks className="w-5 h-5 text-brand" />
                  <h2 className="text-warm-white font-bold text-lg">Responsibilities</h2>
                </div>
                <ul className="space-y-2.5">
                  {responsibilities.map((r, i) => (
                    <li key={i} className="text-text-muted text-sm leading-relaxed flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {requirements.length > 0 && (
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50 mb-6">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-brand" />
                  <h2 className="text-warm-white font-bold text-lg">Requirements</h2>
                </div>
                <ul className="space-y-2.5">
                  {requirements.map((r, i) => (
                    <li key={i} className="text-text-muted text-sm leading-relaxed flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-light flex-shrink-0 mt-2" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {benefits.length > 0 && (
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50 mb-6">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <h2 className="text-warm-white font-bold text-lg">Benefits</h2>
                </div>
                <ul className="space-y-2.5">
                  {benefits.map((b, i) => (
                    <li key={i} className="text-text-muted text-sm leading-relaxed flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* ── How to apply ── */}
          <Card className="bg-gradient-to-br from-brand/10 to-accent/5 border-brand/30">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-brand" />
                <h2 className="text-warm-white font-bold text-lg">How to apply</h2>
              </div>
              <p className="text-text-muted text-sm leading-relaxed mb-5">
                {isEmail ? (
                  <>Send your CV and a short cover note to <strong className="text-warm-white">{vacancy.howToApply}</strong>. Use the position title as the subject line.</>
                ) : (
                  <span className="whitespace-pre-line">{vacancy.howToApply}</span>
                )}
              </p>
              {applyHref && (
                <Button asChild className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold rounded-full">
                  <a href={applyHref}>
                    <Mail className="w-4 h-4 mr-2" />
                    Apply now via email
                  </a>
                </Button>
              )}
              <p className="text-text-muted text-xs mt-5">
                Applications close on <strong className="text-warm-white">{closingDateStr}</strong>. Only shortlisted candidates will be contacted. Ndayeni Solutions is an equal-opportunity employer.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link
              href="/vacancies"
              className="inline-flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all vacancies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
