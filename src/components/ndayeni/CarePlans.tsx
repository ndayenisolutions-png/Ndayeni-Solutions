"use client";

import { useRef, useEffect } from "react";
import {
  User,
  Building2,
  Server,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionImages } from "@/lib/section-images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Plan {
  name: string;
  icon: LucideIcon;
  forWhom: string;
  included: string[];
  iconBg: string;
  iconText: string;
  borderClasses: string;
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "outline" | "default";
  ctaClasses: string;
}

const plans: Plan[] = [
  {
    name: "Basic",
    icon: User,
    forWhom: "Individuals & home users",
    included: [
      "Quarterly device health check",
      "Remote support (email & phone)",
      "Software updates & security patches",
      "Basic backup setup & monitoring",
      "Priority response on callouts",
    ],
    iconBg: "bg-brand-light/10",
    iconText: "text-brand-light",
    borderClasses: "hover:border-brand-light/40",
    ctaLabel: "Ask About Basic Plan",
    ctaHref: "#contact",
    ctaVariant: "outline",
    ctaClasses:
      "border-brand-light/30 text-brand-light hover:bg-brand-light/10 hover:border-brand-light/50",
  },
  {
    name: "Business",
    icon: Building2,
    forWhom: "Small businesses & offices",
    included: [
      "Monthly on-site maintenance visit",
      "Remote & on-site support",
      "Network & Wi-Fi monitoring",
      "Computer & printer maintenance",
      "Basic security & antivirus",
      "Priority response SLA",
      "Monthly health report",
    ],
    iconBg: "bg-brand/10",
    iconText: "text-brand",
    borderClasses: "border-brand/40 glow-brand",
    featured: true,
    ctaLabel: "Ask About Business Plan",
    ctaHref: "#contact",
    ctaVariant: "default",
    ctaClasses:
      "bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-lg hover:shadow-brand/25",
  },
  {
    name: "Business Plus",
    icon: Server,
    forWhom: "Multi-device businesses with network/CCTV",
    included: [
      "Bi-weekly on-site maintenance",
      "Critical system monitoring",
      "Network, CCTV & server support",
      "Proactive maintenance & patches",
      "Dedicated support channel",
      "Quarterly strategy review",
      "Discounted callout rates",
    ],
    iconBg: "bg-accent/10",
    iconText: "text-accent",
    borderClasses: "hover:border-accent/40",
    ctaLabel: "Ask About Business Plus",
    ctaHref: "#contact",
    ctaVariant: "outline",
    ctaClasses:
      "border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50",
  },
];

export default function CarePlans() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Section header animation
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

  // Plan cards stagger animation
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll<HTMLElement>(".plan-card");
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
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
      id="care-plans"
      ref={sectionRef}
      className="relative py-12 sm:py-20 md:py-28"
      aria-labelledby="care-plans-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="section-bg-image"
        style={{ backgroundImage: `url(${sectionImages.itsupport2})` }}
      />
      <div className="absolute inset-0 section-bg-overlay" aria-hidden="true" style={{ zIndex: 0 }} />

      {/* Decorative floating shapes */}
      <div
        aria-hidden="true"
        className="absolute top-20 left-10 w-32 h-32 border border-brand/5 rounded-full animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-20 right-10 w-24 h-24 border border-accent/5 rotate-45 animate-float"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
          style={{ opacity: 0 }}
        >
          <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Ndayeni Care Plans
          </span>
          <h2
            id="care-plans-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6"
          >
            <span className="text-warm-white">Ongoing </span>
            <span className="text-gradient-brand">IT Support</span>
            <span className="text-warm-white"> Plans</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            We don&apos;t just fix things when they break. Ndayeni Care Plans give
            you ongoing maintenance and support so your technology keeps working —
            and small problems get caught before they become big ones.
          </p>
        </div>

        {/* Plan cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch"
        >
          {plans.map((plan) => {
            const Icon = plan.icon;
            const featuredClasses = plan.featured
              ? "lg:scale-[1.03] z-10"
              : "";

            return (
              <Card
                key={plan.name}
                className={`plan-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 ${plan.borderClasses} ${featuredClasses} transition-all duration-500 hover:-translate-y-1 group relative`}
                style={{ opacity: 0 }}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <Badge className="bg-brand/20 text-brand border-brand/30 px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                  {/* Top: plan name + icon */}
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${plan.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${plan.iconText}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-warm-white font-bold text-xl sm:text-2xl">
                      {plan.name}
                    </h3>
                  </div>

                  {/* For whom */}
                  <p className="text-text-muted text-sm mb-2">
                    For: {plan.forWhom}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-dark-border/40 my-4" />

                  {/* What's included */}
                  <h4 className="text-warm-white text-xs font-semibold uppercase tracking-[0.15em] mb-3">
                    What&apos;s included
                  </h4>
                  <ul className="space-y-2.5 mb-5 flex-1">
                    {plan.included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.iconText}`}
                          aria-hidden="true"
                        />
                        <span className="text-warm-white/90 text-sm leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing area */}
                  <div className="mb-5 pt-2">
                    <div className="text-text-muted text-xs">
                      Pricing on request
                    </div>
                    <div className="text-text-muted/70 text-xs mt-0.5">
                      Based on your setup &amp; number of devices
                    </div>
                  </div>

                  {/* CTA button */}
                  <a href={plan.ctaHref} className="block mt-auto">
                    <Button
                      variant={plan.ctaVariant}
                      className={`w-full min-h-[44px] font-semibold rounded-xl group ${plan.ctaClasses}`}
                    >
                      {plan.ctaLabel}
                      <ArrowRight
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA band */}
        <div className="mt-10 sm:mt-14 text-center max-w-2xl mx-auto">
          <p className="text-text-muted text-sm sm:text-base mb-5">
            Need ongoing IT support? Every plan is tailored to your actual setup —
            number of devices, sites, and how fast you need us to respond.
          </p>
          <a href="#contact">
            <Button className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/25 transition-all duration-500 font-semibold px-8 py-5 rounded-full group">
              Ask About Our Maintenance Plans
              <ArrowRight
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
