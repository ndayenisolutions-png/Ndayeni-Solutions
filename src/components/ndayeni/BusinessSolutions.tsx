"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  LifeBuoy,
  Home,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sectionImages } from "@/lib/section-images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Discriminated CTA: a card either uses a filled gradient button or an
 * outlined one. Each variant carries only the className tokens it needs.
 */
type SolutionCta =
  | {
      variant: "gradient";
      label: string;
      gradient: string;
      textColor: string;
    }
  | {
      variant: "outline";
      label: string;
      borderColor: string;
      textColor: string;
      hoverBg: string;
    };

type Solution = {
  icon: LucideIcon;
  title: string;
  tag: string;
  accent: string;
  accentBg: string;
  accentText: string;
  intro: string;
  bullets: string[];
  image: string;
  cta: SolutionCta;
};

const solutions: Solution[] = [
  {
    icon: Building2,
    title: "New Office Setup",
    tag: "Scenario 01",
    accent: "from-brand to-brand-light",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    image: sectionImages.office,
    intro:
      "Moving into a new office? We get your entire workspace technology-ready in one go.",
    bullets: [
      "Computers",
      "Network",
      "Wi-Fi",
      "Printers",
      "CCTV",
      "Business email",
      "Software setup",
    ],
    cta: {
      variant: "gradient",
      label: "Request an Office Setup Quote",
      gradient: "from-brand to-brand-light",
      textColor: "text-dark-deep",
    },
  },
  {
    icon: LifeBuoy,
    title: "Small Business IT Support",
    tag: "Scenario 02",
    accent: "from-accent to-cyan-400",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    image: sectionImages.itsupport,
    intro:
      "Don\u2019t have an IT department? We become yours \u2014 on call and on-site when you need us.",
    bullets: [
      "On-site support",
      "Remote support",
      "Computer maintenance",
      "Network support",
      "Printer support",
      "Basic security",
      "Ongoing maintenance",
    ],
    cta: {
      variant: "outline",
      label: "Ask About IT Support",
      borderColor: "border-accent/30",
      textColor: "text-accent",
      hoverBg: "hover:bg-accent/10",
    },
  },
  {
    icon: Home,
    title: "Home Technology Setup",
    tag: "Scenario 03",
    accent: "from-brand-light to-yellow-400",
    accentBg: "bg-brand-light/10",
    accentText: "text-brand-light",
    image: sectionImages.home,
    intro:
      "From reliable Wi-Fi to home CCTV, we set up and sort out the tech in your home.",
    bullets: ["Wi-Fi", "Computers", "Printers", "CCTV", "Device setup"],
    cta: {
      variant: "outline",
      label: "Book a Home Setup",
      borderColor: "border-brand-light/30",
      textColor: "text-brand-light",
      hoverBg: "hover:bg-brand-light/10",
    },
  },
];

function SolutionCard({ solution }: { solution: Solution }) {
  const Icon = solution.icon;

  // Build the Button className based on the discriminated CTA variant.
  const ctaClassName =
    solution.cta.variant === "gradient"
      ? `w-full min-h-[44px] justify-center font-semibold py-5 rounded-xl bg-gradient-to-r ${solution.cta.gradient} ${solution.cta.textColor} hover:shadow-lg hover:shadow-brand/25 transition-all duration-500`
      : `w-full min-h-[44px] justify-center font-semibold py-5 rounded-xl border ${solution.cta.borderColor} ${solution.cta.textColor} ${solution.cta.hoverBg} hover:border-current transition-all duration-500`;

  return (
    <Card className="solution-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 overflow-hidden group relative">
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        className={`h-[2px] bg-gradient-to-r ${solution.accent} opacity-30 group-hover:opacity-80 transition-opacity duration-500`}
      />

      {/* Visible image header band */}
      <div className="card-image-header">
        <img src={solution.image} alt="" />
        {/* Scenario tag floating on the image */}
        <span
          className={`absolute top-3 left-3 z-10 text-[10px] uppercase tracking-wider font-bold ${solution.accentText} ${solution.accentBg} px-2.5 py-1 rounded-full backdrop-blur-md`}
        >
          {solution.tag}
        </span>
      </div>

      <CardContent className="p-5 sm:p-6 lg:p-8 relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${solution.accentBg} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-500`}
        >
          <Icon
            className={`w-6 h-6 sm:w-7 sm:h-7 ${solution.accentText}`}
            aria-hidden="true"
          />
        </div>

        {/* Scenario tag */}
        <span
          className={`text-[10px] uppercase tracking-wider font-semibold ${solution.accentText}`}
        >
          {solution.tag}
        </span>

        {/* Title */}
        <h3 className="text-warm-white font-bold text-lg sm:text-xl mt-1.5 mb-2">
          {solution.title}
        </h3>

        {/* Intro */}
        <p className="text-text-muted text-sm leading-relaxed">
          {solution.intro}
        </p>

        {/* Bullets */}
        <ul className="space-y-2 mt-4 mb-6 flex-1">
          {solution.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-center gap-2.5 text-sm text-warm-white/90"
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full ${solution.accentBg} flex items-center justify-center`}
                aria-hidden="true"
              >
                <Check className={`w-3 h-3 ${solution.accentText}`} />
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* CTA — anchor wrapping Button, per spec */}
        <a href="#contact" aria-label={solution.cta.label} className="block mt-auto">
          <Button
            variant={solution.cta.variant === "outline" ? "outline" : "default"}
            className={ctaClassName}
          >
            {solution.cta.label}
            <ArrowRight
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

export default function BusinessSolutions() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Header: fade + rise, once on enter.
    const header = headerRef.current;
    if (header) {
      gsap.set(header, { opacity: 0, y: 30 });
      triggers.push(
        ScrollTrigger.create({
          trigger: header,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(header, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          },
        })
      );
    }

    // Cards: staggered fade + rise using the `.solution-card` class.
    const grid = gridRef.current;
    if (grid) {
      const cards = grid.querySelectorAll<HTMLElement>(".solution-card");
      gsap.set(cards, { opacity: 0, y: 30 });
      triggers.push(
        ScrollTrigger.create({
          trigger: grid,
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
        })
      );
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="solutions"
      aria-label="Business Solutions"
      className="relative py-12 sm:py-20 md:py-28"
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-deep via-dark-surface/30 to-dark-deep" />
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-12"
          style={{ opacity: 0 }}
        >
          <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Business Solutions
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            <span className="text-warm-white">Solutions for </span>
            <span className="text-gradient-brand">Real Situations</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Instead of figuring out which individual service you need, start
            with the problem you&apos;re trying to solve. Here are the
            technology situations we handle most often.
          </p>
        </div>

        {/* Solution cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {solutions.map((solution) => (
            <SolutionCard key={solution.title} solution={solution} />
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-text-muted text-sm">
            Not sure which one fits?{" "}
            <a
              href="#contact"
              className="text-brand hover:text-brand-light underline underline-offset-4"
            >
              Tell us what you need
            </a>{" "}
            and we&apos;ll figure it out.
          </p>
        </div>
      </div>
    </section>
  );
}
