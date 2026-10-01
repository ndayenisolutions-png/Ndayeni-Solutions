"use client";

import { useRef, useEffect } from "react";
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
  Check,
  Phone,
  MapPin,
  HelpCircle,
  Users,
  Tag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Icon registry ─────────────────────────────────────────────────────────
// Server Components cannot pass function values (like LucideIcon components)
// across the server/client boundary to a "use client" template. Route files
// therefore pass a string key (`icon`) and this registry maps it to the
// actual LucideIcon component on the client side. The 9 keys correspond to
// the 9 service landing pages.
const ICON_REGISTRY: Record<string, LucideIcon> = {
  headphones: Headphones,
  monitor: Monitor,
  wifi: Wifi,
  cctv: Cctv,
  printer: Printer,
  globe: Globe,
  palette: Palette,
  workflow: Workflow,
  "graduation-cap": GraduationCap,
};

// ─── Props ─────────────────────────────────────────────────────────────────
export interface ServicePageTemplateProps {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  heroImage?: string;
  /**
   * String key into an internal icon registry (one of: "headphones",
   * "monitor", "wifi", "cctv", "printer", "globe", "palette", "workflow",
   * "graduation-cap"). Resolved to a LucideIcon component on the client side.
   *
   * Note: the original spec called for `icon: LucideIcon`, but passing a
   * React component function from a Server Component to a "use client"
   * template violates the RSC boundary ("Functions cannot be passed directly
   * to Client Components"). Using a string key is the idiomatic workaround
   * and keeps the route files as Server Components with static metadata.
   */
  icon: string;
  accentColor: "brand" | "accent";
  longDescription: string[];
  whatWeDo: { title: string; description: string }[];
  whoItsFor: string[];
  process: { step: string; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  pricingGuidance: string;
  serviceArea: string;
  relatedServices: { slug: string; title: string }[];
}

// ─── Theme tokens per accent ──────────────────────────────────────────────
type AccentTheme = {
  text: string;
  bg: string;
  border: string;
  gradientText: string;
  gradientBg: string;
  ring: string;
};

const ACCENT_THEMES: Record<"brand" | "accent", AccentTheme> = {
  brand: {
    text: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/30",
    gradientText: "text-gradient-brand",
    gradientBg: "from-brand to-brand-light",
    ring: "ring-brand/30",
  },
  accent: {
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
    gradientText: "text-gradient-accent",
    gradientBg: "from-accent to-cyan-400",
    ring: "ring-accent/30",
  },
};

const SERVICE_AREA_SUBURBS = [
  "Midrand",
  "Centurion",
  "Fourways",
  "Randburg",
  "Sandton",
  "Roodepoort",
  "Kempton Park",
  "Edenvale",
  "Kaalfontein",
  "Pretoria",
];

// ─── Helper hook — fade-up on scroll (WhyNdayeni/CarePlans pattern) ────────
function useScrollFadeUp<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}

// ─── Helper hook — stagger children fade-up ────────────────────────────────
function useScrollStagger(selector: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(selector);
    if (items.length === 0) return;

    gsap.set(items, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [selector]);

  return ref;
}

// ─── Template component ────────────────────────────────────────────────────
export default function ServicePageTemplate(props: ServicePageTemplateProps) {
  const {
    slug,
    title,
    shortTitle,
    tagline,
    description,
    heroImage,
    icon: iconKey,
    accentColor,
    longDescription,
    whatWeDo,
    whoItsFor,
    process,
    faqs,
    pricingGuidance,
    serviceArea,
    relatedServices,
  } = props;

  const Icon = ICON_REGISTRY[iconKey] ?? Sparkles;
  const theme = ACCENT_THEMES[accentColor];

  // Refs for animation
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useScrollFadeUp<HTMLDivElement>();
  const whatWeDoRef = useScrollStagger(".what-card");
  const whoRef = useScrollFadeUp<HTMLDivElement>();
  const processRef = useScrollStagger(".process-card");
  const pricingRef = useScrollFadeUp<HTMLDivElement>();
  const areaRef = useScrollFadeUp<HTMLDivElement>();
  const faqRef = useScrollFadeUp<HTMLDivElement>();
  const relatedRef = useScrollStagger(".related-card");
  const ctaRef = useScrollFadeUp<HTMLDivElement>();

  // Hero entrance
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(".hero-anim");
    gsap.set(items, { opacity: 0, y: 30 });

    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark-deep">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/services"
              className="text-text-muted hover:text-brand text-xs sm:text-sm transition-colors hidden xs:inline"
            >
              All Services
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
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* ─── Hero ────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative py-16 sm:py-24 md:py-28 overflow-hidden"
          aria-labelledby={`service-hero-${slug}`}
        >
          {/* Background image + dark overlay */}
          {heroImage ? (
            <div className="absolute inset-0" aria-hidden="true">
              <img
                src={heroImage}
                alt=""
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-dark-deep/80 via-dark-deep/85 to-dark-deep/95" />
            </div>
          ) : (
            <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
          )}

          {/* Decorative orbs */}
          <div
            aria-hidden="true"
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[150px]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/4 rounded-full blur-[120px]"
          />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="hero-anim inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border-brand/20">
              <span className={`w-7 h-7 rounded-full ${theme.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${theme.text}`} />
              </span>
              <span className="text-text-muted text-xs sm:text-sm font-medium">
                {shortTitle}
              </span>
            </div>

            <h1
              id={`service-hero-${slug}`}
              className="hero-anim text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
            >
              <span className="text-warm-white">{title}</span>
            </h1>

            <p className="hero-anim text-text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              {tagline}
            </p>

            <div className="hero-anim flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a href="/#contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/30 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group"
                >
                  Request a Quote
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="tel:0838006989" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-brand/30 text-warm-white hover:bg-brand/10 hover:border-brand/50 bg-dark-card/40 backdrop-blur-sm transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full"
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Call 083 800 6989
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ─── Intro ────────────────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={introRef}
              className="glass-strong rounded-2xl p-6 sm:p-8 lg:p-10 border-dark-border/50"
              style={{ opacity: 0 }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${theme.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${theme.text}`} />
                </div>
                <div className="flex-1">
                  <p className="text-warm-white text-base sm:text-lg leading-relaxed mb-3">
                    {description}
                  </p>
                  <p className={`${theme.text} text-sm sm:text-base font-medium italic`}>
                    {tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Long description paragraphs */}
            <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
              {longDescription.map((para, i) => (
                <p
                  key={i}
                  className="text-text-muted text-sm sm:text-base leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ─── What We Do ───────────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <span
                className={`${theme.text} text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block`}
              >
                What We Do
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                <span className="text-warm-white">What&apos;s </span>
                <span className={theme.gradientText}>included</span>
              </h2>
              <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
                A breakdown of the specific deliverables you can expect from this service.
              </p>
            </div>

            <div
              ref={whatWeDoRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            >
              {whatWeDo.map((item) => (
                <Card
                  key={item.title}
                  className={`what-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 ${theme.border} hover:${theme.border} transition-all duration-500 hover:-translate-y-1`}
                >
                  <CardContent className="p-5 sm:p-6">
                    <div
                      className={`w-10 h-10 rounded-lg ${theme.bg} flex items-center justify-center mb-4`}
                    >
                      <Check className={`w-5 h-5 ${theme.text}`} />
                    </div>
                    <h3 className="text-warm-white font-semibold text-base sm:text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Who It's For ─────────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16">
          <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={whoRef}
              style={{ opacity: 0 }}
              className="glass rounded-2xl p-6 sm:p-8 lg:p-10 border-dark-border/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg ${theme.bg} flex items-center justify-center`}>
                  <Users className={`w-5 h-5 ${theme.text}`} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-warm-white">
                  Who It&apos;s For
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {whoItsFor.map((aud) => (
                  <div
                    key={aud}
                    className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-dark-deep/40 border border-dark-border/30"
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${theme.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Check className={`w-3.5 h-3.5 ${theme.text}`} />
                    </div>
                    <span className="text-warm-white text-sm sm:text-base leading-relaxed">
                      {aud}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Our Process ──────────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <span
                className={`${theme.text} text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block`}
              >
                Our Process
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                <span className="text-warm-white">How we </span>
                <span className={theme.gradientText}>work</span>
              </h2>
              <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
                A clear, predictable process — no surprises, no vague hand-waving.
              </p>
            </div>

            <div
              ref={processRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              {process.map((step) => (
                <div
                  key={step.step}
                  className="process-card relative glass rounded-2xl p-5 sm:p-6 border-dark-border/40 hover:border-brand/40 transition-all duration-500 hover:-translate-y-1"
                >
                  <div
                    className={`text-4xl sm:text-5xl font-bold ${theme.text} opacity-30 mb-3 leading-none`}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-warm-white font-semibold text-base sm:text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Pricing Guidance ─────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={pricingRef}
              style={{ opacity: 0 }}
              className={`relative glass-strong rounded-2xl p-6 sm:p-8 lg:p-10 border ${theme.border} overflow-hidden`}
            >
              <div
                aria-hidden="true"
                className={`absolute -top-20 -right-20 w-60 h-60 ${theme.bg} rounded-full blur-[100px]`}
              />
              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${theme.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Tag className={`w-7 h-7 sm:w-8 sm:h-8 ${theme.text}`} />
                </div>
                <div className="flex-1">
                  <span
                    className={`${theme.text} text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase block mb-3`}
                  >
                    Pricing Guidance
                  </span>
                  <p className="text-warm-white text-base sm:text-lg leading-relaxed mb-5">
                    {pricingGuidance}
                  </p>
                  <a href="/#contact">
                    <Button
                      size="lg"
                      className={`bg-gradient-to-r ${theme.gradientBg} text-dark-deep hover:shadow-xl hover:shadow-brand/25 transition-all duration-500 font-semibold px-6 py-4 rounded-full group`}
                    >
                      Get an exact quote
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                  <p className="text-text-muted text-xs mt-4 leading-relaxed">
                    Quotes are obligation-free. Final pricing depends on scope, complexity and travel distance from Midrand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Service Area ─────────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={areaRef}
              style={{ opacity: 0 }}
              className="glass rounded-2xl p-6 sm:p-8 lg:p-10 border-dark-border/50"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-lg ${theme.bg} flex items-center justify-center`}>
                  <MapPin className={`w-5 h-5 ${theme.text}`} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-warm-white">
                  Service Area
                </h2>
              </div>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-5">
                {serviceArea}
              </p>
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREA_SUBURBS.map((suburb) => (
                  <Badge
                    key={suburb}
                    variant="outline"
                    className={`bg-dark-deep/40 border-dark-border/40 ${theme.text} hover:${theme.border}`}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {suburb}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={faqRef}
              style={{ opacity: 0 }}
            >
              <div className="text-center mb-8 sm:mb-10">
                <span
                  className={`${theme.text} text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block`}
                >
                  Frequently Asked Questions
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  <span className="text-warm-white">Common </span>
                  <span className={theme.gradientText}>questions</span>
                </h2>
              </div>

              <div className="glass rounded-2xl p-4 sm:p-6 border-dark-border/50">
                <HelpCircle className={`w-5 h-5 ${theme.text} mb-3`} />
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`item-${i}`}
                      className="border-dark-border/40"
                    >
                      <AccordionTrigger className="text-warm-white text-left text-sm sm:text-base hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-text-muted text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Related Services ─────────────────────────────────────────────── */}
        {relatedServices.length > 0 && (
          <section className="relative py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-10">
                <span
                  className={`${theme.text} text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block`}
                >
                  Related Services
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-warm-white">You may also </span>
                  <span className={theme.gradientText}>need</span>
                </h2>
              </div>

              <div
                ref={relatedRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              >
                {relatedServices.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={`/services/${svc.slug}`}
                    className="related-card block group"
                  >
                    <Card className="h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 hover:-translate-y-1">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Sparkles className="w-5 h-5 text-brand" />
                          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="text-warm-white font-semibold text-base sm:text-lg group-hover:text-brand transition-colors">
                          {svc.title}
                        </h3>
                        <p className="text-text-muted text-xs sm:text-sm mt-1.5">
                          Learn more about this service →
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Final CTA band ───────────────────────────────────────────────── */}
        <section className="relative py-16 sm:py-20 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              ref={ctaRef}
              style={{ opacity: 0 }}
              className={`relative rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden bg-gradient-to-br ${theme.gradientBg}`}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-dark-deep/40 backdrop-blur-sm"
              />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-warm-white">
                  Ready to get started?
                </h2>
                <p className="text-warm-white/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8">
                  Tell us what you need. We&apos;ll give you an honest, no-obligation quote — usually within one business day.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <a href="/#contact" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-dark-deep text-warm-white hover:bg-dark-deep/90 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group"
                    >
                      Request a Quote
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
      </main>

      {/* ─── Footer note ─────────────────────────────────────────────────────── */}
      <footer className="relative bg-dark-deep border-t border-dark-border/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to all services
          </Link>
          <p className="text-text-muted/50 text-xs mt-3">
            © {new Date().getFullYear()} Ndayeni Solutions Pty Ltd · Midrand, Gauteng · Servicing nationwide
          </p>
        </div>
      </footer>
    </div>
  );
}
