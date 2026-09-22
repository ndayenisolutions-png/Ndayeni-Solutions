"use client";

import { useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Phone,
  Mail,
  Wrench,
  ShieldCheck,
  Users,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: LucideIcon;
  items: FAQItem[];
}

const PHONE_HREF = "tel:0838006989";
const PHONE_DISPLAY = "083 800 6989";
const EMAIL_HREF = "mailto:info@ndayenisolutions.co.za";

const categories: FAQCategory[] = [
  {
    title: "Services & Pricing",
    icon: Wrench,
    items: [
      {
        question: "What areas do you cover?",
        answer:
          "We're based in Kaalfontein, Midrand, and our primary service area covers Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale and Pretoria. For larger projects anywhere in South Africa, we travel — get in touch to discuss.",
      },
      {
        question: "Do you charge a call-out fee?",
        answer:
          "For ad-hoc visits within our primary service area, there's a standard call-out fee of R350 which is waived if you proceed with the recommended work. SLA/Care Plan clients have visits included in their monthly plan. Outside our primary area, travel is quoted per km.",
      },
      {
        question: "What are your payment terms?",
        answer:
          "Standard terms are 7 days from invoice for one-off work. For ongoing support (Care Plans), payment is monthly in advance. Hardware procurement (CCTV, networking equipment) typically requires a 50% deposit; domain registration and hosting renewals are 100% upfront. We accept EFT, card and cash.",
      },
      {
        question: "Do you offer contracts or only ad-hoc work?",
        answer:
          "Both. Many of our small business clients start with ad-hoc work, then move onto a Care Plan (ongoing support) once they see the value. Care Plans include priority response, monthly check-ins, proactive monitoring and discounted rates. We don't lock you in — Care Plans are month-to-month with 30 days' notice.",
      },
    ],
  },
  {
    title: "Technical & Security",
    icon: ShieldCheck,
    items: [
      {
        question: "Do you support both Windows and Mac?",
        answer:
          "Yes. Our technicians are experienced with Windows 10/11, macOS, Linux distributions and ChromeOS. We also support Microsoft 365, Google Workspace and most common business software. If you're running something unusual, ask — if we can't help, we'll refer you to someone who can.",
      },
      {
        question: "How do you handle my data and privacy?",
        answer:
          "We take privacy seriously. We're POPIA-aligned — you can read our full Privacy Policy at /privacy-policy. In short: we only collect what we need, we don't sell your data, we use TLS encryption in transit and encrypted storage at rest, and we don't retain your data longer than necessary. CCTV footage retention is set per client contract (typically 30-90 days).",
      },
      {
        question: "Can you recover data from a dead hard drive?",
        answer:
          "We attempt data recovery on a best-effort basis for logical failures (corrupted file systems, accidental deletion, formatted drives). For physical failures (clicking drives, smoke, water damage), we refer to a specialist clean-room recovery partner. We always provide a quote before any recovery work. Important: always maintain your own backups — we can advise on backup strategies but cannot guarantee recovery outcomes.",
      },
    ],
  },
  {
    title: "Working with Us",
    icon: Users,
    items: [
      {
        question: "How fast is your response time?",
        answer:
          "For SLA/Care Plan clients: critical issues (system down) within 4 business hours; high-priority within 1 business day; standard within 2 business days. For ad-hoc clients, we aim to respond within 1 business day and on-site visits are typically scheduled within 1-3 business days. After-hours emergency support is available for SLA clients at a premium rate.",
      },
      {
        question: "Do you work after hours or weekends?",
        answer:
          "Yes, by arrangement. Standard business hours are Monday-Friday 08:00-17:00. After-hours and weekend work is billed at 1.5x standard rate; public holidays at 2x. SLA/Care Plan clients have an after-hours emergency line included for critical issues.",
      },
      {
        question: "Can you support our existing IT vendor or in-house IT person?",
        answer:
          "Absolutely. We frequently work alongside in-house IT staff or other vendors — we're comfortable either taking the lead or supporting a specific area (e.g., CCTV while your IT handles networking). We bring documentation, clear handovers and good communication to every engagement.",
      },
    ],
  },
];

// Build JSON-LD FAQ structured data for Google rich results / featured snippets.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categories.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }))
  ),
};

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Section header fade-up
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Category groups staggered fade-in
  useEffect(() => {
    const groups = groupsRef.current;
    if (!groups) return;

    const cards = groups.querySelectorAll<HTMLElement>(".faq-category");
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: groups,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
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
  }, []);

  // CTA band fade-in
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 24 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-12 sm:py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      {/* Background — mesh gradient + two soft orbs (matches CarePlans/About pattern) */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[280px] sm:w-[460px] h-[280px] sm:h-[460px] bg-accent/3 rounded-full blur-[120px]" />
      </div>

      {/* JSON-LD FAQ structured data for Google rich results / featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
          style={{ opacity: 0 }}
        >
          {/* Small decorative icon above eyebrow */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <HelpCircle
                className="w-5 h-5 sm:w-6 sm:h-6 text-brand"
                aria-hidden="true"
              />
            </div>
          </div>

          <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Frequently Asked Questions
          </span>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6"
          >
            <span className="text-warm-white">Answers Before </span>
            <span className="text-gradient-brand">You Ask</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto px-2 sm:px-0">
            Quick answers to the questions we hear most. Can&apos;t find what
            you&apos;re looking for? Get in touch — we&apos;ll happily explain
            in plain language.
          </p>
        </div>

        {/* Category groups */}
        <div ref={groupsRef} className="space-y-8 sm:space-y-10">
          {categories.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="faq-category glass rounded-xl border-brand/10 p-4 sm:p-6 lg:p-8"
                style={{ opacity: 0 }}
              >
                {/* Category header row */}
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                    <Icon
                      className="w-5 h-5 text-brand"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-warm-white font-bold text-base sm:text-lg tracking-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Accordion */}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                >
                  {category.items.map((item, itemIndex) => {
                    const value = `faq-${catIndex + 1}-${itemIndex + 1}`;
                    return (
                      <AccordionItem
                        key={value}
                        value={value}
                        className="border-dark-border/40"
                      >
                        <AccordionTrigger className="text-warm-white text-sm sm:text-base font-semibold hover:text-brand-light hover:no-underline py-4 sm:py-5 [&[data-state=open]>svg]:text-brand">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-text-muted text-sm sm:text-base leading-relaxed">
                          <p className="pr-2 sm:pr-6">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA band */}
        <div
          ref={ctaRef}
          className="mt-10 sm:mt-14"
          style={{ opacity: 0 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-brand/20 p-6 sm:p-8 lg:p-10 text-center bg-gradient-to-br from-brand/10 via-dark-card/60 to-accent/10">
            {/* Decorative orb inside CTA */}
            <div
              aria-hidden="true"
              className="absolute -top-10 -right-10 w-40 h-40 bg-brand/10 rounded-full blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
            />

            <div className="relative z-10">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-brand/15 border border-brand/25 flex items-center justify-center">
                  <HelpCircle
                    className="w-5 h-5 text-brand-light"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <h3 className="text-warm-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
                Still have a question?
              </h3>
              <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto mb-5 sm:mb-7">
                Reach out — we&apos;re happy to talk it through before any work
                happens. No obligation, no jargon.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-xl mx-auto">
                <a href={PHONE_HREF} className="flex-1 sm:flex-none">
                  <Button
                    variant="default"
                    className="w-full sm:w-auto bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-lg hover:shadow-brand/25 font-semibold px-6 py-5 rounded-xl h-auto"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    Call {PHONE_DISPLAY}
                  </Button>
                </a>
                <a href={EMAIL_HREF} className="flex-1 sm:flex-none">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-brand/30 text-warm-white hover:bg-brand/10 hover:border-brand/50 hover:text-warm-white font-semibold px-6 py-5 rounded-xl h-auto"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    Email us
                  </Button>
                </a>
                <Link href="/#contact" className="flex-1 sm:flex-none">
                  <Button
                    variant="default"
                    className="w-full sm:w-auto bg-gradient-to-r from-accent to-brand text-dark-deep hover:shadow-lg hover:shadow-accent/25 font-semibold px-6 py-5 rounded-xl h-auto group"
                  >
                    Request a Quote
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
