"use client";

import { useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { ShieldCheck, Lock, FileCheck, BadgeCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type TrustSignal = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconText: string;
};

const trustSignals: TrustSignal[] = [
  {
    icon: ShieldCheck,
    title: "POPIA Compliant",
    description:
      "We handle your data in accordance with the Protection of Personal Information Act.",
    iconText: "text-brand",
  },
  {
    icon: Lock,
    title: "Secure by Default",
    description:
      "Every network, CCTV and IT system we install follows security best practices.",
    iconText: "text-accent",
  },
  {
    icon: FileCheck,
    title: "SLA-Backed Support",
    description:
      "Our care plans include response-time SLAs so you know exactly when we'll respond.",
    iconText: "text-brand-light",
  },
  {
    icon: BadgeCheck,
    title: "Verified & Insured",
    description:
      "Registered South African company with qualified, vetted technicians.",
    iconText: "text-brand",
  },
];

export default function TrustSignals() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Stagger the 4 trust badges in on scroll
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(".trust-badge");
    gsap.set(items, { opacity: 0, y: 24 });

    const trigger = ScrollTrigger.create({
      trigger: el,
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
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="trust"
      ref={sectionRef}
      aria-label="Trust & compliance signals"
      className="relative py-10 sm:py-14"
    >
      {/* Background surface */}
      <div
        className="absolute inset-0 bg-dark-surface/50"
        aria-hidden="true"
      />

      {/* Top gradient border */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
      />
      {/* Bottom gradient border */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {trustSignals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div
                key={signal.title}
                className="trust-badge glass rounded-xl p-4 sm:p-5 border-brand/10"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-2.5`}
                >
                  <Icon
                    className={`w-5 h-5 ${signal.iconText}`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-warm-white font-semibold text-xs sm:text-sm">
                  {signal.title}
                </h3>
                <p className="text-text-muted text-[10px] sm:text-xs leading-tight mt-1">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
