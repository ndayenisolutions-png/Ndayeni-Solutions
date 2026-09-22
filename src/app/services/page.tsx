import type { Metadata } from "next";
import Link from "next/link";
import {
  Headphones,
  Monitor,
  Wifi,
  Cctv,
  Printer,
  Globe,
  Palette,
  Workflow,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Phone,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Technology services for small businesses and homes across South Africa. IT support, computer repairs, networking, CCTV, printers, web design, branding, automation and digital skills training — from Ndayeni Solutions in Midrand.",
  alternates: { canonical: "/services" },
};

interface ServiceSummary {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  accent: "brand" | "accent";
  category: string;
}

const services: ServiceSummary[] = [
  {
    slug: "it-support-outsourcing",
    title: "IT Support & Outsourcing",
    shortTitle: "IT Support",
    description:
      "Your outsourced IT department — on call, on budget, on your side. Remote and on-site helpdesk, monitoring, patching and vendor management for small businesses, shops, NGOs and schools.",
    icon: Headphones,
    accent: "brand",
    category: "IT & Infrastructure",
  },
  {
    slug: "computer-repairs",
    title: "Computer Repairs & Hardware",
    shortTitle: "Computer Repairs",
    description:
      "Fast, honest laptop and desktop repairs — quote before we fix, no surprises. Screens, keyboards, batteries, SSD upgrades, virus removal and best-effort data recovery.",
    icon: Monitor,
    accent: "accent",
    category: "IT & Infrastructure",
  },
  {
    slug: "networking-wifi",
    title: "Networking & Wi-Fi",
    shortTitle: "Networking & Wi-Fi",
    description:
      "Wi-Fi that reaches every corner. From a single-router upgrade to a full Cat6 office network with managed switches, access points and guest VLANs — designed, cabled and installed.",
    icon: Wifi,
    accent: "brand",
    category: "IT & Infrastructure",
  },
  {
    slug: "cctv-security",
    title: "CCTV & Security Technology",
    shortTitle: "CCTV & Security",
    description:
      "Professionally installed CCTV systems with 4K cameras, night vision, motion detection and mobile remote viewing. Designed around your actual risks — not just the easiest places to mount a camera.",
    icon: Cctv,
    accent: "brand",
    category: "IT & Infrastructure",
  },
  {
    slug: "printer-office-technology",
    title: "Printer & Office Technology",
    shortTitle: "Printer & Office Tech",
    description:
      "Printers, scanners, copiers and the office tech that keeps a workspace moving — supplied, set up, configured, maintained and repaired. Network installs, scan-to-email, mobile printing.",
    icon: Printer,
    accent: "accent",
    category: "IT & Infrastructure",
  },
  {
    slug: "web-design",
    title: "Web Design & Digital Presence",
    shortTitle: "Web Design",
    description:
      "Fast, mobile-first websites that rank well on Google and turn visitors into clients. Built on modern tech, with POPIA-compliant forms, business email and Google Business Profile setup.",
    icon: Globe,
    accent: "brand",
    category: "Digital Services",
  },
  {
    slug: "graphic-design-branding",
    title: "Graphic Design & Branding",
    shortTitle: "Design & Branding",
    description:
      "Logos, brand systems and marketing materials that hold together across every touchpoint — from your website to your business card to your social media. Brand book included.",
    icon: Palette,
    accent: "brand",
    category: "Digital Services",
  },
  {
    slug: "digital-automation",
    title: "Digital Automation & Business Systems",
    shortTitle: "Digital Automation",
    description:
      "Automate the repetitive work — customer enquiries, bookings, forms, notifications, document generation. No-code and low-code workflows your business can afford and maintain.",
    icon: Workflow,
    accent: "accent",
    category: "Digital Services",
  },
  {
    slug: "digital-skills-training",
    title: "Digital Skills Training",
    shortTitle: "Digital Skills Training",
    description:
      "Practical, hands-on digital literacy for individuals and teams. Computer basics, Microsoft Office, Google Workspace, email safety and social media for business. Public and on-site courses.",
    icon: GraduationCap,
    accent: "brand",
    category: "Training",
  },
];

const categories = ["IT & Infrastructure", "Digital Services", "Training"] as const;

export default function ServicesIndexPage() {
  return (
    <main className="min-h-screen flex flex-col bg-dark-deep">
      {/* ─── Sticky minimal header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <span className="text-dark-deep font-bold text-base">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-warm-white font-semibold text-sm sm:text-base leading-tight">
                Ndayeni Solutions
              </span>
              <span className="text-text-muted text-[9px] sm:text-[10px] tracking-[0.15em] uppercase leading-tight">
                Technology Services
              </span>
            </div>
          </Link>

          <a href="/#contact">
            <Button
              size="sm"
              className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-lg hover:shadow-brand/25 transition-all duration-500 font-semibold rounded-full"
            >
              Request a Quote
              <ArrowRight className="ml-1 w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[150px]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/4 rounded-full blur-[120px]"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border-brand/20">
            <span className="text-text-muted text-xs sm:text-sm font-medium">
              9 Services · One Partner
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            <span className="text-warm-white">Our </span>
            <span className="text-gradient-brand">Services</span>
          </h1>
          <p className="text-text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Technology solutions for small businesses and homes across South Africa.
            From ongoing IT support to one-off repairs, network installs and brand design —
            we&apos;re the one technology partner you need.
          </p>
          <p className="text-text-muted/70 text-sm max-w-xl mx-auto mt-4">
            Based in Midrand, servicing Gauteng and beyond. Each service has its own dedicated page
            with detailed scope, process, FAQs and indicative pricing.
          </p>
        </div>
      </section>

      {/* ─── Services grouped by category ───────────────────────────────── */}
      <section className="relative py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {categories.map((cat) => {
            const catServices = services.filter((s) => s.category === cat);
            return (
              <div key={cat}>
                <div className="mb-6 sm:mb-8">
                  <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase block mb-2">
                    {cat}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-warm-white">
                    {cat === "IT & Infrastructure" &&
                      "The technology that keeps your business running"}
                    {cat === "Digital Services" &&
                      "Your presence online and your digital operations"}
                    {cat === "Training" &&
                      "Practical digital skills that grow your team"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {catServices.map((svc) => {
                    const Icon = svc.icon;
                    const isAccent = svc.accent === "accent";
                    const accentText = isAccent ? "text-accent" : "text-brand";
                    const accentBg = isAccent ? "bg-accent/10" : "bg-brand/10";
                    const accentBorder = isAccent
                      ? "hover:border-accent/40"
                      : "hover:border-brand/40";
                    return (
                      <Link
                        key={svc.slug}
                        href={`/services/${svc.slug}`}
                        className="block group"
                      >
                        <Card
                          className={`h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 ${accentBorder} transition-all duration-500 hover:-translate-y-1 group-hover:scale-[1.01] overflow-hidden`}
                        >
                          <div
                            aria-hidden="true"
                            className={`h-[2px] bg-gradient-to-r ${isAccent ? "from-accent to-cyan-400" : "from-brand to-brand-light"} opacity-30 group-hover:opacity-80 transition-opacity duration-500`}
                          />
                          <CardContent className="p-5 sm:p-6 lg:p-7 relative z-10">
                            <div className="flex items-start justify-between mb-4">
                              <div
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${accentBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                              >
                                <Icon
                                  className={`w-6 h-6 sm:w-7 sm:h-7 ${accentText}`}
                                />
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-dark-deep/40 border-dark-border/40 text-text-muted"
                              >
                                {svc.shortTitle}
                              </Badge>
                            </div>
                            <h3
                              className={`text-warm-white font-bold text-base sm:text-lg mb-2 group-hover:${accentText} transition-colors`}
                            >
                              {svc.title}
                            </h3>
                            <p className="text-text-muted text-sm leading-relaxed mb-4">
                              {svc.description}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1.5 ${accentText} text-sm font-medium`}
                            >
                              Learn more
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden bg-gradient-to-br from-brand to-brand-light">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-dark-deep/40 backdrop-blur-sm"
            />
            <div className="relative z-10">
              <HelpCircle className="w-10 h-10 text-warm-white/80 mb-4 mx-auto" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-warm-white">
                Not sure what you need?
              </h2>
              <p className="text-warm-white/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8">
                Get a free assessment. We&apos;ll listen to what&apos;s not working,
                recommend the right service (or services) — and tell you honestly
                if we&apos;re not the right partner.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <a href="/#contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-dark-deep text-warm-white hover:bg-dark-deep/90 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group"
                  >
                    Get a free assessment
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
                <a href="tel:0838006989" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-dark-deep/30 text-warm-white hover:bg-dark-deep/20 hover:border-dark-deep/50 bg-transparent transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full"
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    Call 083 800 6989
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer note ─────────────────────────────────────────────────── */}
      <footer className="relative bg-dark-deep border-t border-dark-border/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Link>
          <p className="text-text-muted/50 text-xs mt-3">
            © {new Date().getFullYear()} Ndayeni Solutions Pty Ltd · Midrand, Gauteng · Servicing nationwide
          </p>
        </div>
      </footer>
    </main>
  );
}
