"use client";

import { useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Star, MapPin, FileCheck, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TrustBadge = {
  icon: LucideIcon;
  label: string;
  iconText: string;
};

// Same icon + label pattern as TrustSignals.tsx — honest, verifiable signals.
const trustBadges: TrustBadge[] = [
  {
    icon: MapPin,
    label: "Real South African business",
    iconText: "text-brand",
  },
  {
    icon: FileCheck,
    label: "Registered Pty Ltd",
    iconText: "text-accent",
  },
  {
    icon: Building2,
    label: "Founder-led since 2023",
    iconText: "text-brand-light",
  },
  {
    icon: MapPin,
    label: "Based in Midrand, Gauteng",
    iconText: "text-accent",
  },
];

// TODO: Replace this URL with the direct Google Business Profile review link once verified (https://search.google.com/local/reviews?place=<PLACE_ID>)
const GOOGLE_REVIEW_URL = "https://www.google.com/search?q=Ndayeni+Solutions+Midrand";

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  // Header fade-up on scroll
  useEffect(() => {
    const el = headerRef.current;
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

  // Main CTA card + trust badges reveal on scroll
  useEffect(() => {
    const card = cardRef.current;
    const trust = trustRef.current;
    const triggers: ScrollTrigger[] = [];

    if (card) {
      gsap.set(card, { opacity: 0, y: 40 });
      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            });
          },
        })
      );
    }

    if (trust) {
      const items = trust.querySelectorAll<HTMLElement>(".trust-badge");
      if (items.length) {
        gsap.set(items, { opacity: 0, y: 24 });
        triggers.push(
          ScrollTrigger.create({
            trigger: trust,
            start: "top 85%",
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
          })
        );
      }
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="relative py-12 sm:py-20 md:py-28"
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-8 sm:mb-14">
          <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Client Feedback
          </span>
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6"
          >
            <span className="text-warm-white">What Clients </span>
            <span className="text-gradient-brand">Say About Us</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto px-2 sm:px-0">
            We&apos;re a young, growing technology business — and our clients&apos;
            words mean everything to us. As we collect real reviews, we&apos;ll
            feature them here. In the meantime, find us on Google and see what
            our community is saying.
          </p>
        </div>

        {/* Honest empty-state + Google review CTA (single centered glass card) */}
        <div ref={cardRef} className="max-w-3xl mx-auto">
          <Card className="glass rounded-xl border-brand/10 overflow-hidden">
            <CardContent className="p-6 sm:p-10 lg:p-12 text-center">
              {/* Star badge in a circular gradient bg (decorative; headline below is descriptive) */}
              <div
                aria-hidden="true"
                className="mx-auto mb-5 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shadow-lg shadow-brand/30"
              >
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-dark-deep fill-dark-deep" />
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-warm-white mb-3 sm:mb-4">
                Be one of our first reviewers on Google
              </h3>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
                If we&apos;ve helped you with IT support, repairs, CCTV, a
                website or training — your honest review helps other South
                Africans find a technology partner they can trust. It takes 60
                seconds.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-2xl hover:shadow-brand/40 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full w-full sm:w-auto"
                >
                  <a
                    href={GOOGLE_REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Leave a Google review
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-brand/30 text-brand hover:bg-brand/10 hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10 transition-all duration-500 px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full w-full sm:w-auto"
                >
                  <Link href="/#about">Read our story</Link>
                </Button>
              </div>

              {/* Trust line */}
              <p className="text-text-muted text-[11px] sm:text-xs mt-5 sm:mt-6">
                POPIA compliant · No spam · Reviews are public
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust strip — 2-col mobile, 4-col sm+ */}
        <div
          ref={trustRef}
          className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="trust-badge glass rounded-xl p-4 sm:p-5 border-brand/10 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-2.5 mx-auto">
                  <Icon
                    className={`w-5 h-5 ${badge.iconText}`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-warm-white font-semibold text-xs sm:text-sm leading-tight">
                  {badge.label}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
