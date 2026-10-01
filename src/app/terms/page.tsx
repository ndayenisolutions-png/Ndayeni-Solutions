import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookMarked,
  Server,
  FileText,
  CreditCard,
  Clock,
  Users,
  ShieldCheck,
  Scale,
  Copyright,
  Lock,
  XCircle,
  Gavel,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms under which Ndayeni Solutions provides IT services, support, and training in South Africa.",
  alternates: { canonical: "/terms" },
};

// ─── Section index ──────────────────────────────────────────────────────
// Rendered as a quick-jump Table of Contents at the top of the page.
const sections = [
  { id: "intro", num: "01", title: "Introduction & Acceptance of Terms" },
  { id: "definitions", num: "02", title: "Definitions" },
  { id: "services", num: "03", title: "Our Services" },
  { id: "quotes", num: "04", title: "Quotes, Estimates & Invoicing" },
  { id: "payment", num: "05", title: "Payment Terms" },
  { id: "sla", num: "06", title: "Service Level Agreements" },
  { id: "client-responsibilities", num: "07", title: "Client Responsibilities" },
  { id: "warranties", num: "08", title: "Warranties & Guarantees" },
  { id: "liability", num: "09", title: "Limitation of Liability" },
  { id: "ip", num: "10", title: "Intellectual Property" },
  { id: "confidentiality", num: "11", title: "Confidentiality & Privacy" },
  { id: "termination", num: "12", title: "Termination & Cancellation" },
  { id: "disputes", num: "13", title: "Dispute Resolution" },
  { id: "changes", num: "14", title: "Changes to Terms & Contact" },
] as const;

export default function TermsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-dark-surface">
      {/* ─── Minimal Academy-Style Header ─────────────────────────────────
          Pattern lifted from /training/forgot-password/page.tsx — small "N"
          gradient logo + "Ndayeni Solutions" wordmark + a "Back to Home" link.
          The full marketing Navbar would overwhelm a legal page. */}
      <header className="sticky top-0 z-50 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <span className="text-dark-deep font-bold text-base">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-warm-white font-semibold text-sm sm:text-base leading-tight">
                Ndayeni Solutions
              </span>
              <span className="text-text-muted text-[9px] sm:text-[10px] tracking-[0.15em] uppercase leading-tight">
                Midrand · South Africa
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-text-muted hover:text-brand text-xs sm:text-sm transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* ─── Main Content ──────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* ── Hero / Title ───────────────────────────────────────────────── */}
        <section className="mb-10 sm:mb-12 text-center">
          <span className="text-xs font-mono text-accent uppercase tracking-[0.2em]">
            Legal
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-brand leading-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-text-muted text-sm sm:text-base">
            Last updated: 22 September 2025
          </p>
          <p className="mt-4 text-warm-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            The terms under which Ndayeni Solutions provides IT services,
            support, training and digital products to clients in South Africa.
          </p>
        </section>

        {/* ── Table of Contents ─────────────────────────────────────────── */}
        <Card className="mb-10 sm:mb-12 bg-dark-card/60 backdrop-blur-sm border-dark-border/50">
          <CardHeader>
            <CardTitle className="text-warm-white text-base sm:text-lg flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-accent" />
              Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-text-muted hover:text-brand transition-colors inline-flex items-baseline gap-2"
                  >
                    <span className="font-mono text-accent text-xs">
                      {s.num}
                    </span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* ─── 1. Introduction & Acceptance of Terms ────────────────────── */}
        <section
          id="intro"
          aria-labelledby="intro-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 01
                  </span>
                  <CardTitle
                    id="intro-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Introduction &amp; Acceptance of Terms
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                These Terms of Service govern all IT services, support,
                training and digital products provided by Ndayeni Solutions Pty
                Ltd, a South African-registered technology company based in
                Kaalfontein, Midrand.
              </p>
              <p>
                By engaging our services — whether by signing a quote,
                accepting a Service Level Agreement, making a payment, or
                otherwise requesting work from us — you confirm that you have
                read, understood and accept these terms on behalf of yourself
                or the entity you represent.
              </p>
              <p>
                Where you have a signed written contract with us that conflicts
                with these terms, the signed contract takes precedence. These
                terms apply only to the extent they are not overridden by that
                written agreement.
              </p>
              <p>
                We provide services to consumers and businesses in South Africa
                and, where applicable, the{" "}
                <span className="text-warm-white">
                  Consumer Protection Act 68 of 2008
                </span>{" "}
                applies to our engagements. Nothing in these terms is intended
                to exclude, restrict or limit any right that may not lawfully
                be excluded under South African law.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 2. Definitions ───────────────────────────────────────────── */}
        <section
          id="definitions"
          aria-labelledby="definitions-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 02
                  </span>
                  <CardTitle
                    id="definitions-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Definitions
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-text-muted text-sm sm:text-base leading-relaxed">
              <p className="mb-4">In these terms, unless the context requires otherwise:</p>
              <dl className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 sm:items-baseline">
                  <dt className="text-warm-white font-semibold text-sm sm:text-base">
                    &ldquo;we&rdquo; / &ldquo;us&rdquo; / &ldquo;our&rdquo;
                  </dt>
                  <dd>
                    means Ndayeni Solutions Pty Ltd, registration in the
                    Republic of South Africa, with its registered office at 4099
                    Finger Fish Street, Kaalfontein, Midrand, 1635.
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 sm:items-baseline">
                  <dt className="text-warm-white font-semibold text-sm sm:text-base">
                    &ldquo;you&rdquo; / &ldquo;client&rdquo;
                  </dt>
                  <dd>
                    means the person or entity that engages us to provide
                    Services, and any authorised representative acting on that
                    entity&rsquo;s behalf.
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 sm:items-baseline">
                  <dt className="text-warm-white font-semibold text-sm sm:text-base">
                    &ldquo;Services&rdquo;
                  </dt>
                  <dd>
                    means the IT support, computer repairs, networking and
                    Wi-Fi, CCTV and security, printer and office technology,
                    web design, graphic design, digital automation, branding
                    and digital skills training services we offer, as further
                    described in Section 3.
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 sm:items-baseline">
                  <dt className="text-warm-white font-semibold text-sm sm:text-base">
                    &ldquo;Quote&rdquo;
                  </dt>
                  <dd>
                    means a written estimate issued by us setting out the scope
                    of work and the estimated or fixed price for the Services.
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 sm:items-baseline">
                  <dt className="text-warm-white font-semibold text-sm sm:text-base">
                    &ldquo;SLA&rdquo;
                  </dt>
                  <dd>
                    means a Service Level Agreement for ongoing IT support,
                    entered into between us and the client, typically under one
                    of our Care Plans.
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 sm:items-baseline">
                  <dt className="text-warm-white font-semibold text-sm sm:text-base">
                    &ldquo;Site&rdquo;
                  </dt>
                  <dd>
                    means the client&rsquo;s premises, or any third-party
                    premises, at which we are required to perform on-site
                    Services.
                  </dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-3 sm:items-baseline">
                  <dt className="text-warm-white font-semibold text-sm sm:text-base">
                    &ldquo;Intellectual Property&rdquo;
                  </dt>
                  <dd>
                    means code, designs, documentation, brand assets and any
                    other original works of authorship created by us in the
                    course of providing the Services.
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </section>

        {/* ─── 3. Our Services ───────────────────────────────────────────── */}
        <section
          id="services"
          aria-labelledby="services-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Server className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 03
                  </span>
                  <CardTitle
                    id="services-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Our Services
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                We provide the following categories of services to small
                businesses, homes, schools, NGOs and individuals across South
                Africa:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>IT support &amp; outsourcing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>Computer repairs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>Networking &amp; Wi-Fi</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>CCTV &amp; security technology</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>Printer &amp; office technology</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>Web design</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>Graphic design</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>Digital automation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono">·</span>
                  <span>Digital skills training</span>
                </li>
              </ul>
              <p>
                We reserve the right to refuse or decline any service request
                at our discretion, including where the requested work falls
                outside our area of expertise, presents unreasonable risk, or
                cannot be performed safely or lawfully.
              </p>
              <p>
                The specific scope, deliverables, timelines and price for any
                engagement are defined in the Quote or signed contract we
                provide. These terms apply as the default baseline where the
                Quote or contract is silent.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 4. Quotes, Estimates & Invoicing ─────────────────────────── */}
        <section
          id="quotes"
          aria-labelledby="quotes-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 04
                  </span>
                  <CardTitle
                    id="quotes-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Quotes, Estimates &amp; Invoicing
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                Quotes are valid for <span className="text-warm-white">30 days</span>{" "}
                from the date of issue unless stated otherwise on the Quote.
              </p>
              <p>
                Quotes are estimates based on the information you have
                provided about your environment, equipment and requirements.
                If the actual scope changes during the work — for example,
                additional hardware is required, or the underlying problem
                differs from what was initially described — the actual cost
                may vary. We will notify you in writing before proceeding with
                any work that materially exceeds the original Quote.
              </p>
              <p>
                Invoices are typically issued before work begins, with a
                deposit where applicable (see Section 5). For established
                clients on standing arrangements, we may invoice on
                completion. Payment terms are stated on each invoice.
              </p>
              <p>
                All prices are quoted in{" "}
                <span className="text-warm-white">South African Rand (ZAR)</span>{" "}
                and exclude Value-Added Tax (VAT). Ndayeni Solutions is a
                registered VAT vendor; VAT will be added to invoices where
                applicable in terms of the Value-Added Tax Act 89 of 1991.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 5. Payment Terms ─────────────────────────────────────────── */}
        <section
          id="payment"
          aria-labelledby="payment-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 05
                  </span>
                  <CardTitle
                    id="payment-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Payment Terms
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Standard terms
                </h3>
                <ul className="space-y-2 pl-1">
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      For one-off work: payment is due{" "}
                      <span className="text-warm-white">within 7 days</span> of
                      the invoice date.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      For SLA and ongoing support (Care Plans): invoiced{" "}
                      <span className="text-warm-white">monthly in advance</span>.
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Deposit requirements
                </h3>
                <ul className="space-y-2 pl-1">
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      Typically <span className="text-warm-white">50%</span>{" "}
                      deposit for hardware procurement (CCTV, networking
                      equipment, peripherals).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      <span className="text-warm-white">100%</span> pre-payment
                      for domain registrations and hosting renewals.
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Accepted payment methods
                </h3>
                <ul className="space-y-2 pl-1">
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>EFT (electronic funds transfer) — preferred.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>Card payments, where available.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>Cash, against an issued receipt.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Late payment
                </h3>
                <p>
                  Overdue amounts will attract interest at{" "}
                  <span className="text-warm-white">1.5% per month</span>{" "}
                  (calculated daily and compounded monthly), in accordance with
                  the{" "}
                  <span className="text-warm-white">
                    Prescribed Rate of Interest Act 55 of 1975
                  </span>
                  , until the account is settled in full.
                </p>
                <p className="mt-2">
                  We may pause or suspend Services if payment is more than{" "}
                  <span className="text-warm-white">14 days</span> overdue,
                  until the outstanding amount (including interest) is settled.
                  We will provide written notice before doing so where
                  reasonably possible.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── 6. Service Level Agreements (SLAs) ───────────────────────── */}
        <section
          id="sla"
          aria-labelledby="sla-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 06
                  </span>
                  <CardTitle
                    id="sla-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Service Level Agreements (SLAs)
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                For clients on an ongoing Care Plan, we commit to the following
                response time targets, measured from the time a support request
                is logged and acknowledged:
              </p>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="min-w-full text-sm border border-dark-border/50 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-brand/10 text-left text-warm-white">
                      <th className="px-3 sm:px-4 py-2 font-semibold">Priority</th>
                      <th className="px-3 sm:px-4 py-2 font-semibold">Description</th>
                      <th className="px-3 sm:px-4 py-2 font-semibold">Response target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/40">
                    <tr>
                      <td className="px-3 sm:px-4 py-2 text-warm-white font-semibold">Critical</td>
                      <td className="px-3 sm:px-4 py-2">System down — business cannot operate</td>
                      <td className="px-3 sm:px-4 py-2 text-accent font-mono">within 4 business hours</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-4 py-2 text-warm-white font-semibold">High</td>
                      <td className="px-3 sm:px-4 py-2">Significant impact on a key user or function</td>
                      <td className="px-3 sm:px-4 py-2 text-accent font-mono">within 1 business day</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-4 py-2 text-warm-white font-semibold">Medium</td>
                      <td className="px-3 sm:px-4 py-2">Minor impact; workaround available</td>
                      <td className="px-3 sm:px-4 py-2 text-accent font-mono">within 2 business days</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-4 py-2 text-warm-white font-semibold">Low</td>
                      <td className="px-3 sm:px-4 py-2">General queries, requests and improvements</td>
                      <td className="px-3 sm:px-4 py-2 text-accent font-mono">within 3 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                On-site visits are typically scheduled within{" "}
                <span className="text-warm-white">1 to 3 business days</span>{" "}
                depending on priority, technician availability and your
                location.
              </p>
              <p>
                After-hours emergency support is available at a premium rate
                for SLA clients only. Non-SLA clients requiring after-hours
                support will be quoted on a per-incident basis.
              </p>
              <p>
                The full SLA document — including priority definitions,
                response vs. resolution targets, exclusions, and credit
                provisions — is provided on Care Plan sign-up and forms part of
                your engagement with us.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 7. Client Responsibilities ───────────────────────────────── */}
        <section
          id="client-responsibilities"
          aria-labelledby="client-responsibilities-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 07
                  </span>
                  <CardTitle
                    id="client-responsibilities-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Client Responsibilities
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>To allow us to perform the Services effectively, you agree to:</p>
              <ul className="space-y-2 pl-1">
                <li className="flex gap-2">
                  <span className="text-accent font-mono shrink-0">·</span>
                  <span>
                    Provide accurate, complete and timely information about
                    your environment, equipment, requirements and history of
                    any prior issues.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono shrink-0">·</span>
                  <span>
                    Ensure we have authorised access to the systems, premises
                    and equipment required to perform the work, including any
                    passwords, keys, fobs or escort arrangements.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono shrink-0">·</span>
                  <span>
                    Maintain your own backups of your data. We will advise on
                    backup strategy where requested, but we do not own your
                    data and accept no responsibility for data you have not
                    backed up.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono shrink-0">·</span>
                  <span>
                    Notify us promptly — ideally in writing — of any issues,
                    security incidents, hardware changes, software changes or
                    staff changes that may affect the Services.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-mono shrink-0">·</span>
                  <span>
                    Provide a safe and lawful working environment for our
                    technicians on Site, including compliance with the
                    Occupational Health and Safety Act 85 of 1993 and any
                    site-specific safety requirements.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* ─── 8. Warranties & Guarantees ──────────────────────────────── */}
        <section
          id="warranties"
          aria-labelledby="warranties-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 08
                  </span>
                  <CardTitle
                    id="warranties-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Warranties &amp; Guarantees
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Workmanship warranty
                </h3>
                <ul className="space-y-2 pl-1">
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      <span className="text-warm-white">30 days</span> on
                      computer repairs and component-level fixes.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      <span className="text-warm-white">90 days</span> on
                      installations (networking, CCTV, office technology).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      <span className="text-warm-white">14 days</span> on
                      software configuration and setup work.
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Hardware warranties
                </h3>
                <p>
                  Hardware supplied by us is covered by the relevant
                  manufacturer&rsquo;s warranty — typically{" "}
                  <span className="text-warm-white">1 to 3 years</span>{" "}
                  depending on the product. We will pass through the
                  manufacturer&rsquo;s warranty and assist with the warranty
                  claim process where possible, but ultimate responsibility for
                  warranty fulfilment rests with the manufacturer.
                </p>
              </div>
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Exclusions
                </h3>
                <p>
                  Warranties do not cover damage resulting from: misuse,
                  neglect or unauthorised modification; power surges or
                  lightning damage (we strongly recommend surge protection and
                  UPS systems — please ask); force majeure events; third-party
                  actions or software; or modifications made by the client or
                  any third party to systems we have configured.
                </p>
              </div>
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  What we do not warrant
                </h3>
                <ul className="space-y-2 pl-1">
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      Data recovery outcomes — all data recovery work is
                      performed on a best-effort basis only.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      Specific search engine rankings or SEO performance.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-mono shrink-0">·</span>
                    <span>
                      Specific business outcomes, revenue or profit resulting
                      from any Service we provide.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── 9. Limitation of Liability ──────────────────────────────── */}
        <section
          id="liability"
          aria-labelledby="liability-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 09
                  </span>
                  <CardTitle
                    id="liability-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Limitation of Liability
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                To the maximum extent permitted by South African law, our
                liability for any claim arising out of or in connection with
                the Services is limited to{" "}
                <span className="text-warm-white">
                  the amount you paid us for the specific Service giving rise
                  to the claim
                </span>
                .
              </p>
              <p>
                We are not liable for any indirect, incidental, special,
                consequential or punitive damages, including loss of profits,
                loss of revenue, loss of business, loss of anticipated savings,
                or loss of data — even if we have been advised of the
                possibility of such loss.
              </p>
              <p>
                We are not liable for any loss of or damage to data where you
                failed to maintain the backups we recommended in writing.
              </p>
              <p>
                In any event, our maximum aggregate liability for any incident
                or series of related incidents is capped at{" "}
                <span className="text-warm-white">ZAR 50,000</span> (fifty
                thousand South African Rand).
              </p>
              <p>
                We strongly recommend that all clients maintain appropriate
                insurance — including cyber liability, business interruption
                and asset insurance — appropriate to their own risk profile and
                the value of the systems and data we are engaged to support.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 10. Intellectual Property ───────────────────────────────── */}
        <section
          id="ip"
          aria-labelledby="ip-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Copyright className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 10
                  </span>
                  <CardTitle
                    id="ip-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Intellectual Property
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                All Intellectual Property created by us in the course of
                providing the Services — including source code, designs,
                documentation and brand assets — is{" "}
                <span className="text-warm-white">
                  transferred to the client upon receipt of full payment
                </span>{" "}
                for the relevant Services. Until full payment is received, we
                retain ownership of all such Intellectual Property.
              </p>
              <p>
                We retain the right to use completed work in our portfolio and
                marketing materials. Work will be anonymised by default unless
                you provide written permission to be identified, or written
                notice declining portfolio use entirely.
              </p>
              <p>
                Third-party software, components, fonts and assets remain the
                property of their respective owners and are licensed under
                their original terms. Where we incorporate open-source
                components into deliverables (for example under the MIT, Apache
                2.0 or GPL licences), those components remain licensed under
                their respective open-source licences and the corresponding
                licence texts are provided with the deliverables where
                applicable.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 11. Confidentiality & Privacy ───────────────────────────── */}
        <section
          id="confidentiality"
          aria-labelledby="confidentiality-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 11
                  </span>
                  <CardTitle
                    id="confidentiality-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Confidentiality &amp; Privacy
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                We treat all client information — including system
                configurations, credentials, business information and personal
                information — as strictly confidential. We will not disclose
                your information to any third party except where required by
                law, or where you have provided written consent.
              </p>
              <p>
                We comply with the{" "}
                <span className="text-warm-white">
                  Protection of Personal Information Act 4 of 2013 (POPIA)
                </span>
                . Full details of how we collect, use, store and protect
                personal information are set out in our Privacy Policy, which
                forms part of these terms by reference.
              </p>
              <p>
                Non-Disclosure Agreements (NDAs) are available on request for
                engagements involving particularly sensitive information, trade
                secrets or regulated data. Please raise this with us before
                work begins.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 12. Termination & Cancellation ──────────────────────────── */}
        <section
          id="termination"
          aria-labelledby="termination-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 12
                  </span>
                  <CardTitle
                    id="termination-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Termination &amp; Cancellation
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                Either party may terminate ongoing Services (including Care
                Plans and SLAs) by giving{" "}
                <span className="text-warm-white">30 days&rsquo; written notice</span>{" "}
                to the other party.
              </p>
              <p>
                For one-off work: cancellations made within{" "}
                <span className="text-warm-white">24 hours</span> of the booked
                appointment may incur a call-out fee to cover technician time
                and travel. Where work has already commenced, you remain liable
                for the work performed up to the cancellation.
              </p>
              <p>
                On termination for any reason: you remain liable for all work
                completed up to the termination date, and we will deliver all
                work-in-progress and Intellectual Property created up to that
                point, subject to receipt of payment for that work.
              </p>
              <p>
                Care Plan refunds are calculated on a{" "}
                <span className="text-warm-white">pro-rata basis</span> for any
                unused months remaining on the plan, less the value of work
                actually performed during the billing period.
              </p>
              <p>
                Nothing in these terms is intended to be unfair to a consumer
                as contemplated by{" "}
                <span className="text-warm-white">
                  Sections 48 and 49 of the Consumer Protection Act 68 of 2008
                </span>
                . Any term found to be unfair, unjust or unreasonable in terms
                of the CPA is severable and will be read down to the maximum
                extent permitted by law.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 13. Dispute Resolution ──────────────────────────────────── */}
        <section
          id="disputes"
          aria-labelledby="disputes-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Gavel className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 13
                  </span>
                  <CardTitle
                    id="disputes-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Dispute Resolution
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <p>
                We aim to resolve all disputes fairly, quickly and at the
                lowest possible cost. If a dispute arises out of or in
                connection with these terms or any Services, the parties agree
                to follow these steps in good faith:
              </p>
              <div className="space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center font-mono text-accent text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-warm-white font-semibold text-sm sm:text-base">
                      Informal resolution
                    </h3>
                    <p className="mt-1">
                      Contact us in writing with details of the dispute. We
                      will acknowledge receipt within a reasonable time and
                      respond substantively within{" "}
                      <span className="text-warm-white">7 business days</span>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center font-mono text-accent text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-warm-white font-semibold text-sm sm:text-base">
                      Mediation
                    </h3>
                    <p className="mt-1">
                      If the dispute remains unresolved, we agree to attempt
                      mediation through an accredited mediator — for example,
                      under the rules of the{" "}
                      <span className="text-warm-white">
                        Arbitration Foundation of South Africa (AFSA)
                      </span>
                      .
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center font-mono text-accent text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-warm-white font-semibold text-sm sm:text-base">
                      Arbitration
                    </h3>
                    <p className="mt-1">
                      If mediation fails or is declined, the dispute will be
                      referred to arbitration conducted in{" "}
                      <span className="text-warm-white">Johannesburg</span>{" "}
                      under the rules of AFSA. The arbitrator&rsquo;s award
                      will be final and binding on both parties.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center font-mono text-accent text-xs font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-warm-white font-semibold text-sm sm:text-base">
                      Court
                    </h3>
                    <p className="mt-1">
                      Only if arbitration fails or is not available will the
                      dispute be referred to the{" "}
                      <span className="text-warm-white">
                        courts of the Republic of South Africa
                      </span>
                      , sitting in Johannesburg, which will have exclusive
                      jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
              <p className="pt-2 border-t border-dark-border/40">
                These terms are governed by, and construed in accordance with,
                the{" "}
                <span className="text-warm-white">
                  laws of the Republic of South Africa
                </span>
                .
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ─── 14. Changes to Terms & Contact ───────────────────────────── */}
        <section
          id="changes"
          aria-labelledby="changes-heading"
          className="scroll-mt-28 mb-8 sm:mb-10"
        >
          <Card className="bg-dark-card/60 backdrop-blur-sm border-dark-border/50 hover:border-brand/30 transition-colors duration-300">
            <CardHeader>
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] sm:text-xs font-mono text-accent uppercase tracking-[0.15em]">
                    Section 14
                  </span>
                  <CardTitle
                    id="changes-heading"
                    className="text-warm-white text-lg sm:text-xl font-bold leading-tight mt-1"
                  >
                    Changes to Terms &amp; Contact
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
              <div>
                <h3 className="text-warm-white font-semibold text-sm sm:text-base mb-2">
                  Changes to these terms
                </h3>
                <p>
                  We may update these Terms of Service from time to time.
                  Changes will be posted on this page with a new{" "}
                  <span className="text-warm-white">&ldquo;Last updated&rdquo;</span>{" "}
                  date at the top. It is your responsibility to review these
                  terms periodically.
                </p>
                <p className="mt-2">
                  Existing signed contracts continue under the terms agreed at
                  the time of signing. Updates to these Terms of Service apply
                  only to new engagements commenced after the updated date,
                  unless explicitly agreed otherwise in writing.
                </p>
              </div>

              {/* ── Contact sub-section (anchor: #contact) ── */}
              <div
                id="contact"
                className="mt-8 pt-6 border-t border-dark-border/50 scroll-mt-28"
              >
                <h3 className="text-warm-white font-semibold text-base sm:text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brand" />
                  Contact us
                </h3>
                <p className="mt-2">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="mailto:info@ndayenisolutions.co.za"
                    className="flex items-center gap-3 p-3 rounded-lg bg-dark-card/80 border border-dark-border/50 hover:border-brand/40 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-warm-white text-sm">
                      info@ndayenisolutions.co.za
                    </span>
                  </a>
                  <a
                    href="tel:+27838006989"
                    className="flex items-center gap-3 p-3 rounded-lg bg-dark-card/80 border border-dark-border/50 hover:border-brand/40 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-warm-white text-sm">083 800 6989</span>
                  </a>
                </div>
                <div className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-dark-card/80 border border-dark-border/50">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-warm-white text-sm leading-relaxed">
                    4099 Finger Fish Street, Kaalfontein,
                    <br className="hidden sm:block" /> Midrand, 1635, South
                    Africa
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ─── CTA box ─────────────────────────────────────────────────── */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-gradient-to-br from-brand/10 to-accent/5 border-brand/30 backdrop-blur-sm">
            <CardContent className="text-center py-8 sm:py-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/20 mb-4">
                <HelpCircle className="w-6 h-6 text-brand" />
              </div>
              <h2 className="text-warm-white text-xl sm:text-2xl font-bold">
                Have a question before signing up?
              </h2>
              <p className="mt-3 text-text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                We&rsquo;re happy to walk you through any of these terms in
                plain language before you engage us. Reach out and a real
                person from our Midrand team will respond.
              </p>
              <Link
                href="/#contact"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold text-sm hover:shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* ─── Disclaimer ──────────────────────────────────────────────── */}
        <div className="mt-8 sm:mt-10 flex items-start gap-3 text-text-muted text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400/70" />
          <p className="leading-relaxed">
            These terms are provided for general information. For specific
            legal advice, consult a qualified South African attorney.
          </p>
        </div>
      </div>

      {/* ─── Minimal Footer ─────────────────────────────────────────────── */}
      <footer className="relative bg-dark-deep border-t border-dark-border/30 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} Ndayeni Solutions Pty Ltd ·{" "}
            <ShieldCheck className="w-3 h-3 inline" /> POPIA Compliant
          </p>
        </div>
      </footer>
    </main>
  );
}
