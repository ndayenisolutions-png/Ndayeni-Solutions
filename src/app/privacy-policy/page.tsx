import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Database,
  Workflow,
  Scale,
  Share2,
  Clock,
  ShieldCheck,
  Eye,
  PencilLine,
  Trash2,
  Ban,
  Undo2,
  MessageSquareWarning,
  Cookie,
  Users,
  Globe,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Gavel,
  Building2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Ndayeni Solutions collects, uses and protects your personal information under POPIA (South Africa).",
  alternates: { canonical: "/privacy-policy" },
};

// ─── Page ────────────────────────────────────────────────────────────────
// PUBLIC page — static content only. No "use client" because there is no
// interactivity (the small in-page nav uses native anchor links + smooth
// scroll, which the browser handles via `scroll-behavior: smooth` set in
// globals.css on `html`).

const toc = [
  { id: "intro", label: "1. Introduction & Scope" },
  { id: "what-we-collect", label: "2. Information We Collect" },
  { id: "how-we-use", label: "3. How We Use Your Information" },
  { id: "legal-basis", label: "4. Legal Basis for Processing" },
  { id: "sharing", label: "5. Information Sharing & Third Parties" },
  { id: "retention", label: "6. Data Retention" },
  { id: "security", label: "7. Security Measures" },
  { id: "your-rights", label: "8. Your Rights Under POPIA" },
  { id: "cookies", label: "9. Cookies & Tracking" },
  { id: "children", label: "10. Children's Privacy" },
  { id: "international", label: "11. International Transfers" },
  { id: "changes", label: "12. Changes to This Policy" },
  { id: "contact", label: "13. Contacting Us" },
  { id: "complaints", label: "14. Complaints" },
];

const rights = [
  {
    icon: Eye,
    title: "Right to Access",
    body: "Request a copy of the personal information we hold about you, in an accessible format.",
  },
  {
    icon: PencilLine,
    title: "Right to Correct",
    body: "Ask us to update or correct any personal information that is inaccurate, out of date or incomplete.",
  },
  {
    icon: Trash2,
    title: "Right to Delete",
    body: "Request deletion of your personal information where retention is not required by law or for legitimate purposes.",
  },
  {
    icon: Ban,
    title: "Right to Object",
    body: "Object to processing carried out for direct marketing or under our legitimate interests, subject to conditions.",
  },
  {
    icon: Undo2,
    title: "Right to Withdraw Consent",
    body: "Withdraw your consent at any time. Processing that relied solely on that consent will then stop.",
  },
  {
    icon: MessageSquareWarning,
    title: "Right to Complain",
    body: "Lodge a complaint with the Information Regulator if you are not satisfied with how we have handled your information.",
  },
];

const retentionPeriods = [
  { type: "Enquiries & quotes", period: "12 months after last contact" },
  { type: "Client service records", period: "5 years (SARS record-keeping)" },
  { type: "Training academy records", period: "7 years (SAQA requirements)" },
  { type: "CCTV footage", period: "30–90 days per client contract" },
  { type: "Website & server logs", period: "30 days" },
  { type: "Issued certificates", period: "Permanent (verification purpose)" },
];

const thirdParties = [
  {
    name: "Cloud hosting (Vercel)",
    region: "Global edge network",
    receives: "Application code, basic deployment metadata",
    why: "Hosts the marketing site & web applications",
  },
  {
    name: "Database hosting (Supabase)",
    region: "Selected regional data centre",
    receives: "Structured records you submit (training applications, contact form, academy data)",
    why: "Stores application & academy data in encrypted databases",
  },
  {
    name: "Email / SMTP providers",
    region: "South Africa & EU",
    receives: "Email address, name, message content you send us",
    why: "Delivers our replies, notifications and certificates",
  },
  {
    name: "Payment processors",
    region: "South Africa",
    receives: "Card or EFT details (handled by the processor — not stored by us)",
    why: "Processes course fees and invoices (added as services grow)",
  },
  {
    name: "Google (Analytics & Business Profile)",
    region: "United States with EU controls",
    receives: "Aggregated, pseudonymised usage data — only with your consent",
    why: "Helps us understand site usage and improve discoverability",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col bg-dark-surface">
      {/* ─── Minimal Header (academy pattern) ──────────────────────────────
          Small branded "N" logo gradient + "Ndayeni Solutions" + a
          "Back to Home" link. Same glass-strong border-b treatment used on
          the forgot-password and apply pages for visual consistency. */}
      <header className="sticky top-0 z-50 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <span className="text-dark-deep font-bold text-base">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-warm-white font-semibold text-sm sm:text-base leading-tight">
                Ndayeni Solutions
              </span>
              <span className="text-text-muted text-[9px] sm:text-[10px] tracking-[0.15em] uppercase leading-tight">
                Privacy Policy
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center text-text-muted hover:text-brand text-xs sm:text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* ─── Page Body ──────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* ── Hero ── */}
        <div className="mb-10 sm:mb-12">
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="text-gradient-brand">Privacy Policy</span>
          </h1>
          <p className="text-text-muted text-sm mb-2">
            <span className="text-warm-white/80">Last updated:</span> 22
            September 2025
          </p>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl">
            Your privacy matters to us. This policy explains what we collect,
            why, and your rights under the Protection of Personal Information
            Act (POPIA).
          </p>
        </div>

        {/* ── In-page navigation ── */}
        <nav
          aria-label="Privacy policy sections"
          className="glass rounded-xl p-4 sm:p-5 border-brand/10 mb-10 sm:mb-12"
        >
          <p className="text-warm-white/80 text-xs uppercase tracking-wider mb-3 font-semibold">
            On this page
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 list-decimal list-inside text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-text-muted hover:text-brand transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── 1. Introduction & Scope ── */}
        <section id="intro" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <FileText className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              1. Introduction &amp; Scope
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              Ndayeni Solutions Pty Ltd (&ldquo;Ndayeni Solutions&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a South African registered
              information technology services company based at 4099 Finger Fish
              Street, Kaalfontein, Midrand, 1635. We provide IT support,
              computer repairs, networking &amp; Wi-Fi, CCTV &amp; security,
              printer &amp; office technology, web design, graphic design,
              digital automation and digital skills training to small
              businesses and homes across South Africa.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose and
              protect your personal information when you interact with us
              through our website at{" "}
              <Link
                href="/"
                className="text-brand hover:text-brand-light underline underline-offset-2"
              >
                ndayenisolutions.co.za
              </Link>
              , our contact form, WhatsApp, email or telephone, our digital
              training academy, and during the delivery of our services. It
              applies to website visitors, enquiry contacts, training
              applicants, students and clients.
            </p>
            <p>
              We are committed to protecting your privacy and complying with
              the Protection of Personal Information Act, 2013 (Act No. 4 of
              2013) (&ldquo;POPIA&rdquo;), the Promotion of Access to
              Information Act, 2000 (Act No. 2 of 2000) and other applicable
              South African data protection laws. This policy is reviewed
              regularly and updated as our services evolve.
            </p>
          </div>
        </section>

        {/* ── 2. Information We Collect ── */}
        <section id="what-we-collect" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Database className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              2. Information We Collect
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              We only collect personal information that is necessary for the
              purposes set out in this policy. We group what we collect into
              the following categories:
            </p>
            <div className="space-y-3">
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-1.5">
                  Personal information you provide directly
                </p>
                <p className="text-sm leading-relaxed">
                  Full name, email address, phone number, South African ID or
                  passport number, residential or business address, and
                  related details you give us when you submit a contact form,
                  apply for training, request a quote, become a client or
                  enrol in a course.
                </p>
              </div>
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-1.5">
                  Business information
                </p>
                <p className="text-sm leading-relaxed">
                  Company name, your position or role, business address and
                  related details you provide when you contact us on behalf of
                  an organisation.
                </p>
              </div>
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-1.5">
                  Technical information collected automatically
                </p>
                <p className="text-sm leading-relaxed">
                  IP address, browser type and version, operating system,
                  device information, referring pages and basic usage data
                  collected automatically when you visit our website or use
                  our online services.
                </p>
              </div>
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-1.5">
                  Communication records
                </p>
                <p className="text-sm leading-relaxed">
                  Records of emails, WhatsApp messages, telephone calls and
                  meeting notes you exchange with us. We keep these to deliver
                  and improve our service, to verify your identity and to keep
                  an accurate history of your enquiry or project.
                </p>
              </div>
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-1.5">
                  Special categories of personal information
                </p>
                <p className="text-sm leading-relaxed">
                  We do not collect special personal information (such as
                  health, religion, race, political opinions or biometric
                  data) except where it is strictly necessary for a specific
                  service you have requested. For example, CCTV installation
                  may incidentally capture images of your property. In every
                  such case, we will explain why and obtain your explicit
                  consent before collecting or processing this information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. How We Use Your Information ── */}
        <section id="how-we-use" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Workflow className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              3. How We Use Your Information
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              We process your personal information for the following specific,
              limited purposes:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                Providing the IT services, support and maintenance you have
                requested from us.
              </li>
              <li>
                Responding to your enquiries, requests for quotes and
                follow-up communications.
              </li>
              <li>
                Processing training academy applications, enrolment and student
                administration.
              </li>
              <li>
                Issuing certificates of completion and verifying
                qualifications when you or a third party you authorised
                requests verification.
              </li>
              <li>
                Sending service-related communications such as appointment
                reminders, status updates and security notices.
              </li>
              <li>Billing, invoicing and account administration.</li>
              <li>Improving our services, website and customer experience.</li>
              <li>
                Complying with our legal obligations and keeping records we
                are required to maintain under South African law.
              </li>
            </ul>
            <p>
              We do not use your personal information for any purpose that is
              incompatible with the purposes for which it was originally
              collected. Where we wish to use it for a new purpose, we will
              tell you first and, where required, seek your consent.
            </p>
          </div>
        </section>

        {/* ── 4. Legal Basis for Processing ── */}
        <section id="legal-basis" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Scale className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              4. Legal Basis for Processing
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              Under POPIA (Sections 19 to 21), we may only process your
              personal information if we have a lawful basis to do so. We rely
              on the following lawful bases:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <span className="text-warm-white/90">Consent:</span> you have
                given us clear, informed consent to process your personal
                information for a specific purpose.
              </li>
              <li>
                <span className="text-warm-white/90">
                  Performance of a contract:
                </span>{" "}
                processing is necessary to deliver a service or enter into an
                agreement with you, such as on-site support, CCTV installation
                or training delivery.
              </li>
              <li>
                <span className="text-warm-white/90">Legal obligation:</span>{" "}
                we are required to process the information to comply with a
                law, for example keeping tax records for the South African
                Revenue Service (SARS) or reporting under the Financial
                Intelligence Centre Act (FIC Act) where applicable.
              </li>
              <li>
                <span className="text-warm-white/90">Legitimate interests:</span>{" "}
                processing is necessary for our legitimate interests (or those
                of a third party), such as retaining CCTV footage for client
                security, provided those interests are not overridden by your
                rights.
              </li>
              <li>
                <span className="text-warm-white/90">Vital interests:</span>{" "}
                processing is necessary to protect your vital interests, for
                example using emergency contact information during an incident
                at a training venue or client site.
              </li>
            </ul>
          </div>
        </section>

        {/* ── 5. Information Sharing & Third Parties ── */}
        <section id="sharing" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Share2 className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              5. Information Sharing &amp; Third Parties
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              <span className="text-warm-white/90">
                We do not sell your personal information.
              </span>{" "}
              We only share it in the following circumstances:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                When you have given us your consent to do so.
              </li>
              <li>
                When we are required to by law, regulation or a court order.
              </li>
              <li>
                With service providers and processors who act on our behalf
                under written contract and who are themselves required to
                comply with POPIA, including cloud hosting, email delivery and
                payment processing providers.
              </li>
            </ul>
            <p className="text-warm-white/80 text-sm font-medium pt-2">
              Categories of third parties we work with:
            </p>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="text-left text-text-muted border-b border-dark-border/50">
                    <th className="py-2.5 px-2 font-semibold">Provider</th>
                    <th className="py-2.5 px-2 font-semibold">Region</th>
                    <th className="py-2.5 px-2 font-semibold">
                      What they receive
                    </th>
                    <th className="py-2.5 px-2 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {thirdParties.map((tp) => (
                    <tr
                      key={tp.name}
                      className="border-b border-dark-border/30 align-top"
                    >
                      <td className="py-2.5 px-2 text-warm-white/90 font-medium">
                        {tp.name}
                      </td>
                      <td className="py-2.5 px-2">{tp.region}</td>
                      <td className="py-2.5 px-2">{tp.receives}</td>
                      <td className="py-2.5 px-2">{tp.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Each of these providers is contractually bound to process
              personal information only on our instructions and to safeguard it
              in line with POPIA. Where a provider is located outside South
              Africa, we rely on the safeguards described in Section 11 below.
            </p>
          </div>
        </section>

        {/* ── 6. Data Retention ── */}
        <section id="retention" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Clock className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              6. Data Retention
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              We retain your personal information only for as long as is
              necessary to fulfil the purposes for which it was collected,
              including any legal, accounting or reporting requirements. After
              that, we securely delete it or anonymise it so that it can no
              longer identify you.
            </p>
            <div className="glass rounded-lg p-4 sm:p-5 border-brand/10">
              <p className="text-warm-white/80 text-xs uppercase tracking-wider font-semibold mb-3">
                Specific retention periods
              </p>
              <ul className="space-y-2">
                {retentionPeriods.map((r) => (
                  <li
                    key={r.type}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm"
                  >
                    <span className="text-warm-white/90 font-medium sm:w-1/2">
                      {r.type}
                    </span>
                    <span className="text-text-muted sm:w-1/2">{r.period}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p>
              When retention is no longer required, personal information is
              securely deleted or rendered permanently anonymous using
              industry-standard methods. Backups containing deleted information
              are overwritten on the next scheduled backup rotation.
            </p>
          </div>
        </section>

        {/* ── 7. Security Measures ── */}
        <section id="security" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldCheck className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              7. Security Measures
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              We take the security of your personal information seriously and
              apply a combination of technical, physical and organisational
              measures to protect it against unauthorised access, loss,
              destruction, alteration or disclosure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-2">
                  Technical
                </p>
                <ul className="text-xs space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>TLS encryption for data in transit.</li>
                  <li>Encrypted databases at rest.</li>
                  <li>
                    Secure password hashing using PBKDF2 with unique salts.
                  </li>
                  <li>Strict access controls and least-privilege accounts.</li>
                  <li>Regular security review and dependency updates.</li>
                </ul>
              </div>
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-2">
                  Physical
                </p>
                <ul className="text-xs space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Secure storage of any physical client records.</li>
                  <li>Locked premises and access-controlled workspaces.</li>
                  <li>Secure disposal of printed personal information.</li>
                </ul>
              </div>
              <div className="glass rounded-lg p-4 border-brand/10">
                <p className="text-warm-white font-medium text-sm mb-2">
                  Organisational
                </p>
                <ul className="text-xs space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Staff training on POPIA and data handling.</li>
                  <li>Written confidentiality agreements with all staff.</li>
                  <li>Least-privilege access to systems and records.</li>
                  <li>Documented incident response procedure.</li>
                </ul>
              </div>
            </div>
            <p>
              <span className="text-warm-white/90">Incident response:</span> In
              the event of a confirmed data breach that poses a real risk to
              your rights, we will take reasonable steps to contain the breach,
              notify affected data subjects and notify the Information
              Regulator as required by POPIA (Section 22), as soon as
              reasonably possible after the breach has been confirmed.
            </p>
          </div>
        </section>

        {/* ── 8. Your Rights Under POPIA ── */}
        <section id="your-rights" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Users className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              8. Your Rights Under POPIA
            </h2>
          </div>
          <div className="space-y-5 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              POPIA gives you specific rights over your personal information.
              The cards below summarise each right; you can exercise any of
              them at any time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rights.map((right) => {
                const Icon = right.icon;
                return (
                  <Card
                    key={right.title}
                    className="glass border-brand/10 py-5 gap-3 hover:border-brand/30 transition-colors"
                  >
                    <CardHeader className="px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand/15 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4.5 h-4.5 text-brand" />
                        </div>
                        <CardTitle className="text-warm-white text-base">
                          {right.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5">
                      <CardDescription className="text-text-muted text-sm leading-relaxed">
                        {right.body}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="glass rounded-lg p-4 sm:p-5 border-brand/15">
              <p className="text-warm-white/80 text-sm font-medium mb-2">
                How to exercise your rights
              </p>
              <p className="text-sm leading-relaxed">
                Email us at{" "}
                <a
                  href="mailto:info@ndayenisolutions.co.za?subject=POPIA Request"
                  className="text-brand hover:text-brand-light underline underline-offset-2"
                >
                  info@ndayenisolutions.co.za
                </a>{" "}
                with the subject line &ldquo;POPIA Request&rdquo; and tell us
                which right you wish to exercise. We will verify your identity
                and respond within{" "}
                <span className="text-warm-white/90">30 days</span> as required
                by POPIA (Sections 23 to 24). There is no charge for reasonable
                requests, although a reasonable fee may apply to manifestly
                unfounded or excessive requests.
              </p>
            </div>
          </div>
        </section>

        {/* ── 9. Cookies & Tracking Technologies ── */}
        <section id="cookies" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Cookie className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              9. Cookies &amp; Tracking Technologies
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              We use a minimal set of cookies and similar technologies on our
              website:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <span className="text-warm-white/90">
                  Essential cookies:
                </span>{" "}
                required for the site to function (for example, keeping you
                logged in to the academy admin area or protecting forms). These
                cannot be disabled if you wish to use those features.
              </li>
              <li>
                <span className="text-warm-white/90">Analytics cookies:</span>{" "}
                used to understand how visitors use our site so we can improve
                it. These are only set after you have given your consent.
              </li>
              <li>
                <span className="text-warm-white/90">
                  No advertising cookies:
                </span>{" "}
                we do not use third-party advertising or tracking cookies.
              </li>
            </ul>
            <p>
              You can manage or delete cookies through your browser settings at
              any time. Doing so may affect some features of the site. See your
              browser&rsquo;s help pages for instructions, or visit{" "}
              <a
                href="https://www.allaboutcookies.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-light underline underline-offset-2"
              >
                allaboutcookies.org
              </a>{" "}
              for general guidance.
            </p>
          </div>
        </section>

        {/* ── 10. Children's Privacy ── */}
        <section id="children" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Users className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              10. Children&rsquo;s Privacy
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              Our services are not directed at children under the age of 18,
              and we do not knowingly collect personal information from
              children. Training academy applicants must be 18 or older, or
              have written consent from a parent or legal guardian.
            </p>
            <p>
              If you are a parent or guardian and you believe we have collected
              personal information from your child without consent, please
              contact us using the details in Section 13 and we will take
              reasonable steps to delete that information.
            </p>
          </div>
        </section>

        {/* ── 11. International Transfers ── */}
        <section id="international" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Globe className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              11. International Transfers
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              Some of our service providers process personal information
              outside South Africa. Under POPIA (Sections 73 to 76), we will
              only transfer your personal information to a foreign country if
              that country has an adequate level of data protection, or if the
              transfer is protected by appropriate safeguards such as standard
              contractual clauses or binding corporate rules, or one of the
              other lawful grounds applies.
            </p>
            <p className="text-warm-white/80 text-sm font-medium pt-1">
              Specific providers and their regions:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <span className="text-warm-white/90">Vercel</span> — global
                edge network. Serves the website from the location closest to
                you, under GDPR-aligned data processing terms.
              </li>
              <li>
                <span className="text-warm-white/90">Supabase</span> — chosen
                regional data centre. Stores application and academy data with
                encryption at rest and in transit.
              </li>
              <li>
                <span className="text-warm-white/90">Google</span> — United
                States with EU data-protection controls (Google Analytics and
                Google Business Profile, only used with your consent).
              </li>
            </ul>
          </div>
        </section>

        {/* ── 12. Changes to This Policy ── */}
        <section id="changes" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <RefreshCw className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              12. Changes to This Policy
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our services, POPIA guidance or best practice. When we
              do, we will publish the updated version on this page with a new
              &ldquo;Last updated&rdquo; date at the top.
            </p>
            <p>
              For material changes (such as new categories of information we
              collect or new third parties we share it with), we will also
              post a notice on our homepage for at least 30 days so you have an
              opportunity to review the changes before they take effect.
            </p>
          </div>
        </section>

        {/* ── 13. Contacting Us ── */}
        <section id="contact" className="scroll-mt-24 mb-12 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <Mail className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              13. Contacting Us
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              If you have any questions about this Privacy Policy or wish to
              exercise any of your rights, please contact our Information
              Officer:
            </p>
            <div className="glass rounded-lg p-4 sm:p-5 border-brand/15 space-y-3">
              <p className="text-warm-white font-medium text-sm">
                Nhlakanipho Ntshangase — Information Officer
              </p>
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand flex-shrink-0" />
                Ndayeni Solutions Pty Ltd
              </p>
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                <a
                  href="mailto:info@ndayenisolutions.co.za"
                  className="text-text-muted hover:text-brand transition-colors"
                >
                  info@ndayenisolutions.co.za
                </a>
              </p>
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                <a
                  href="tel:0838006989"
                  className="text-text-muted hover:text-brand transition-colors"
                >
                  083 800 6989
                </a>
              </p>
              <p className="text-sm text-text-muted flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>
                  4099 Finger Fish Street, Kaalfontein,
                  <br className="hidden sm:inline" /> Midrand, 1635, South
                  Africa
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ── 14. Complaints ── */}
        <section id="complaints" className="scroll-mt-24 mb-10 sm:mb-12">
          <div className="flex items-center gap-2.5 mb-4">
            <Gavel className="w-5 h-5 text-brand flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-semibold text-warm-white">
              14. Complaints
            </h2>
          </div>
          <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
            <p>
              We aim to resolve any privacy concern quickly and fairly. Please
              contact us first using the details in Section 13 — we will
              investigate and respond within 30 days.
            </p>
            <p>
              If you are not satisfied with our response, you have the right to
              lodge a complaint with the Information Regulator (South Africa):
            </p>
            <div className="glass rounded-lg p-4 sm:p-5 border-brand/15 space-y-2.5">
              <p className="text-warm-white font-medium text-sm">
                Information Regulator (South Africa)
              </p>
              <p className="text-sm text-text-muted flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>
                  5th Floor, River Side Office Park, 130 Nana Sita Street,
                  Sunnyside, Pretoria
                </span>
              </p>
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                <a
                  href="mailto:complaints@inforegulator.org"
                  className="text-text-muted hover:text-brand transition-colors"
                >
                  complaints@inforegulator.org
                </a>
              </p>
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand flex-shrink-0" />
                <a
                  href="https://inforegulator.org.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-brand transition-colors"
                >
                  inforegulator.org.za
                </a>
              </p>
            </div>
            <p className="text-sm">
              Please attempt to resolve your concern with us first. This gives
              us the opportunity to investigate, explain or put things right
              before the matter is escalated.
            </p>
          </div>
        </section>

        {/* ── CTA box ── */}
        <div className="relative overflow-hidden rounded-2xl glass-strong border-brand/20 glow-brand p-6 sm:p-8 mb-8 text-center">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-brand/10 rounded-full blur-[120px]"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h3 className="text-warm-white font-semibold text-lg sm:text-xl mb-2">
              Need to ask something?
            </h3>
            <p className="text-text-muted text-sm sm:text-base mb-5 max-w-md mx-auto">
              If you have a question about how we handle your personal
              information, we&rsquo;re happy to help.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Contact us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="glass rounded-lg p-4 border-dark-border/50 text-center">
          <p className="text-text-muted text-xs leading-relaxed">
            This policy is provided for general information. For specific legal
            advice on POPIA compliance, consult a qualified attorney.
          </p>
        </div>
      </div>

      {/* ─── Minimal Footer ────────────────────────────────────────────── */}
      <footer className="relative bg-dark-deep border-t border-dark-border/30 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} Ndayeni Solutions Pty Ltd &middot;{" "}
            <ShieldCheck className="w-3 h-3 inline" /> POPIA Aligned
          </p>
        </div>
      </footer>
    </main>
  );
}
