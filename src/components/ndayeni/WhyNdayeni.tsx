"use client";

import { useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Wrench,
  Boxes,
  MapPin,
  Store,
  LifeBuoy,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionImages } from "@/lib/section-images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SellingPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const sellingPoints: SellingPoint[] = [
  {
    icon: Wrench,
    title: "Practical Solutions",
    description:
      "We recommend technology based on your actual needs and budget — not on what's most expensive. If a fix solves the problem, that's what you get.",
  },
  {
    icon: Boxes,
    title: "One Technology Partner",
    description:
      "From computers and networks to Wi-Fi, CCTV, printers and websites, you deal with a single provider instead of juggling five different contractors.",
  },
  {
    icon: MapPin,
    title: "Local Support",
    description:
      "Hands-on technical assistance in and around Midrand when remote support isn't enough. We show up, we fix it, we explain it.",
  },
  {
    icon: Store,
    title: "Small Business Focus",
    description:
      "Solutions designed around the needs and budgets of small businesses, shops, offices, NGOs and schools — not enterprise infrastructure.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    description:
      "We don't disappear after installation. We can maintain, monitor and support your systems so they keep running long after the job is done.",
  },
  {
    icon: Wallet,
    title: "Fair, Honest Pricing",
    description:
      "We quote before we work — no surprise charges, no vague invoices. You know exactly what you're paying for and why, every single time.",
  },
];

export default function WhyNdayeni() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Header fade-up animation on scroll
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

  // Cards stagger animation on scroll
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".why-card");
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
  }, []);

  return (
    <section
      id="why"
      ref={sectionRef}
      aria-labelledby="why-ndayeni-heading"
      className="relative py-12 sm:py-20 md:py-28"
    >
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="section-bg-image"
        style={{ backgroundImage: `url(${sectionImages.techhelp})` }}
      />
      <div className="absolute inset-0 section-bg-overlay" aria-hidden="true" style={{ zIndex: 0 }} />

      {/* Decorative blurred orbs */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-brand/4 rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-accent/3 rounded-full blur-[120px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
          style={{ opacity: 0 }}
        >
          <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Why Ndayeni
          </span>
          <h2
            id="why-ndayeni-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6"
          >
            <span className="text-warm-white">One Partner for </span>
            <span className="text-gradient-brand">All Your Technology</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            We don&apos;t just fix things when they break. From computers and
            networks to CCTV and websites, Ndayeni Solutions is the one
            technology partner small businesses and homes can rely on to set
            up, maintain and manage the tech they use every day.
          </p>
        </div>

        {/* Cards — single 3-column grid (2 rows of 3 on desktop) */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {sellingPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card
                key={point.title}
                className="why-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 hover:-translate-y-1 group overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="h-[2px] bg-gradient-to-r from-brand to-brand-light opacity-30 group-hover:opacity-80 transition-opacity duration-500"
                />
                <CardContent className="p-5 sm:p-6 lg:p-8 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand" />
                  </div>
                  <h3 className="text-warm-white font-bold text-lg mb-2 sm:mb-3 group-hover:text-brand transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA band */}
        <div className="mt-10 sm:mt-14 text-center">
          <p className="text-text-muted text-sm sm:text-base mb-5 max-w-xl mx-auto">
            Don&apos;t see what you need? We probably do it anyway. Tell us the
            technology problem you&apos;re trying to solve.
          </p>
          <a href="#contact">
            <Button className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/25 transition-all duration-500 font-semibold px-8 py-5 rounded-full group">
              Request a Quote
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
