import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Mail, MapPin, Briefcase, Calendar, ArrowRight, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers & Vacancies",
  description:
    "Join the Ndayeni Solutions team. We're a Midrand-based technology company always interested in hearing from talented people — IT support, computer repairs, networking, CCTV, web design, training and more.",
  alternates: { canonical: "/vacancies" },
  openGraph: {
    title: "Careers at Ndayeni Solutions",
    description:
      "We're a Midrand-based technology company always interested in hearing from talented people. View current vacancies or send your CV.",
    url: "/vacancies",
    type: "website",
  },
};

const CONTACT_EMAIL = "info@ndayenisolutions.co.za";

// Server component — fetches vacancies directly via Prisma (no API roundtrip,
// no client-side data fetching — best for SEO + first paint).
export default async function VacanciesPage() {
  // Only show active vacancies whose closing date hasn't passed.
  const now = new Date();
  const vacancies = await db.vacancy.findMany({
    where: {
      status: "active",
      closingDate: { gte: now },
    },
    orderBy: { closingDate: "asc" },
    select: {
      id: true,
      title: true,
      department: true,
      location: true,
      employmentType: true,
      description: true,
      closingDate: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen flex flex-col bg-dark-deep">
      {/* ── Hero / Header ── */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        {/* Subtle background tints for depth (CSS only — no images, no JS) */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border-brand/20 mb-6">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span className="text-text-muted text-xs font-medium tracking-wide">
              Careers at Ndayeni Solutions
            </span>
          </div>

          <h1 className="text-warm-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 leading-tight">
            Build a Career in{" "}
            <span className="text-gradient-brand">South African Tech</span>
          </h1>

          <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            We&apos;re a Midrand-based technology company serving small businesses and
            homes across South Africa. We do IT support, computer repairs, networking,
            CCTV, web design, training and automation — and we&apos;re always looking for
            people who care about doing the work right.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="glass rounded-xl p-4 border-brand/10">
              <div className="text-brand-light font-bold text-lg mb-1">Practical</div>
              <div className="text-text-muted text-sm leading-relaxed">
                Real work for real clients from day one — no Corporate Kool-Aid, just
                the satisfaction of fixing things that matter.
              </div>
            </div>
            <div className="glass rounded-xl p-4 border-brand/10">
              <div className="text-brand-light font-bold text-lg mb-1">Founder-led</div>
              <div className="text-text-muted text-sm leading-relaxed">
                Founded in 2023 by Nhlakanipho Ntshangase. You&apos;ll work directly
                with leadership — no layers of middle management.
              </div>
            </div>
            <div className="glass rounded-xl p-4 border-brand/10">
              <div className="text-brand-light font-bold text-lg mb-1">Gauteng &amp; beyond</div>
              <div className="text-text-muted text-sm leading-relaxed">
                Based in Kaalfontein, Midrand. We serve clients across Gauteng and
                travel nationally for the right projects.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vacancies list OR empty state ── */}
      <section className="flex-1 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-warm-white font-bold text-2xl sm:text-3xl">
              {vacancies.length === 0 ? "No Current Vacancies" : "Open Vacancies"}
            </h2>
            {vacancies.length > 0 && (
              <span className="text-text-muted text-sm">
                {vacancies.length} {vacancies.length === 1 ? "position" : "positions"} open
              </span>
            )}
          </div>

          {vacancies.length === 0 ? (
            // ── EMPTY STATE — friendly, with email CTA ──
            <Card className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-7 h-7 text-brand" />
                </div>
                <h3 className="text-warm-white font-bold text-xl sm:text-2xl mb-3">
                  We currently have no vacancies
                </h3>
                <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
                  We&apos;re always interested in hearing from talented people. If
                  you&apos;re a technician, trainer, designer or developer who cares
                  about doing good work for South African small businesses, please send
                  us your CV — we&apos;ll keep it on file and reach out when a suitable
                  role opens up.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button asChild size="lg" className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-8 py-6 rounded-full">
                    <a href={`mailto:${CONTACT_EMAIL}?subject=CV%20Submission%20-%20Career%20Enquiry`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send your CV
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-brand/30 text-brand hover:bg-brand/10 hover:border-brand/60 rounded-full px-8 py-6">
                    <Link href="/#contact">
                      Contact us
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <p className="text-text-muted text-xs mt-8">
                  New opportunities will be posted on this page as they open. Bookmark
                  it or follow us on Google.
                </p>
              </CardContent>
            </Card>
          ) : (
            // ── VACANCY CARDS ──
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {vacancies.map((v) => (
                <Card
                  key={v.id}
                  className="bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-warm-white font-bold text-lg leading-tight">
                        {v.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-brand/15 text-brand border border-brand/30 flex-shrink-0">
                        {v.employmentType}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-muted mb-4">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {v.department}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {v.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Closes {v.closingDate.toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-text-muted text-sm leading-relaxed mb-5 flex-1">
                      {v.description.length > 180
                        ? `${v.description.slice(0, 180).trim()}…`
                        : v.description}
                    </p>

                    <Button asChild className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold rounded-full w-full sm:w-auto sm:self-start">
                      <Link href={`/vacancies/${v.id}`}>
                        View details &amp; apply
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-dark-border/30 bg-dark-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-warm-white font-bold text-xl sm:text-2xl mb-3">
            Don&apos;t see the right role?
          </h2>
          <p className="text-text-muted text-sm sm:text-base mb-6 max-w-xl mx-auto">
            Send us your CV anyway. We keep great candidates on file and reach out
            first when something opens up.
          </p>
          <Button asChild className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold rounded-full px-8 py-5">
            <a href={`mailto:${CONTACT_EMAIL}?subject=CV%20Submission%20-%20General%20Enquiry`}>
              <Mail className="w-4 h-4 mr-2" />
              Email your CV to {CONTACT_EMAIL}
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
