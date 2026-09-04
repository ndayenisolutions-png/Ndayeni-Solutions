"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  ArrowDown,
  Sparkles,
  Zap,
  Users,
  Monitor,
  Wifi,
  Cctv,
  Globe,
  Printer,
  Wrench,
  ShieldCheck,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionImages } from "@/lib/section-images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const stats = [
  { icon: Users, label: "Clients Served", value: "100+" },
  { icon: Zap, label: "IT Issues Resolved", value: "500+" },
  { icon: Sparkles, label: "Projects Completed", value: "50+" },
];

const handleItems: { icon: LucideIcon; label: string }[] = [
  { icon: Monitor, label: "Computers & Repairs" },
  { icon: Wifi, label: "Networking & Wi-Fi" },
  { icon: Cctv, label: "CCTV & Security" },
  { icon: Printer, label: "Printers & Office Tech" },
  { icon: Globe, label: "Websites & Digital" },
  { icon: Wrench, label: "Ongoing IT Support" },
];

const trustBadges = [
  { icon: MapPin, label: "Based in Midrand" },
  { icon: ShieldCheck, label: "Founder-Led Support" },
  { icon: Sparkles, label: "Serving 9 Provinces" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (badgeRef.current) {
      tl.fromTo(badgeRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.2);
    }
    if (headingRef.current) {
      tl.fromTo(headingRef.current, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.4);
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.7);
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.9);
    }
    if (statsRef.current) {
      const items = statsRef.current.querySelectorAll(".stat-item");
      tl.fromTo(items, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 1.1);
    }
    if (panelRef.current) {
      const items = panelRef.current.querySelectorAll(".handle-chip");
      tl.fromTo(items, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, 0.8);
      tl.fromTo(panelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6);
    }
    if (trustRef.current) {
      const items = trustRef.current.querySelectorAll(".trust-item");
      tl.fromTo(items, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, 1.4);
    }
    if (scrollIndicatorRef.current) {
      tl.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 2);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* 3D WebGL Background */}
      <HeroScene />

      {/* Background image (behind 3D scene) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${sectionImages.abstract})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
        }}
      />

      {/* Subtle radial vignette to deepen the edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, transparent 25%, rgba(7,21,21,0.6) 100%)",
        }}
      />

      {/* Soft left-side glow behind the headline for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 35% 50%, rgba(7,21,21,0.75) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade into next section */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-dark-deep via-dark-deep/70 to-transparent z-[4] pointer-events-none" />

      {/* Content — spread across the full block */}
      <motion.div
        ref={contentRef}
        style={{ y, opacity, scale }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-0"
      >
        {/* Badge — centered across the full block */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 glass rounded-full px-4 sm:px-5 py-2 sm:py-2.5 border-brand/20"
            style={{ opacity: 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50 flex-shrink-0" />
            <span className="text-text-muted text-xs sm:text-sm font-medium tracking-wide">
              Technology partner for small businesses &amp; homes across South Africa
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* LEFT — Main hero content (7 cols on desktop) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Main Heading */}
            <h1
              ref={headingRef}
              className="text-[1.75rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-6 tracking-tight"
              style={{ opacity: 0 }}
            >
              <span className="text-warm-white">Technology </span>
              <span className="text-gradient-brand drop-shadow-[0_0_30px_rgba(30,144,255,0.3)]">
                Solutions
              </span>
              <br />
              <span className="text-warm-white">for Small Businesses</span>
              <br />
              <span className="text-warm-white">&amp; </span>
              <span className="text-gradient-teal drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                Homes
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-text-muted text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
              style={{ opacity: 0 }}
            >
              We set up, maintain and manage the technology you rely on — from
              computers and networks to Wi-Fi, CCTV, websites and ongoing IT
              support. Without the jargon or the runaround.
            </p>

            {/* CTA Buttons */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10"
              style={{ opacity: 0 }}
            >
              <a href="#contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-2xl hover:shadow-brand/40 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group relative overflow-hidden w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Request a Quote
                    <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  </span>
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </a>
              <a href="#solutions" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand/30 text-brand hover:bg-brand/10 hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10 transition-all duration-500 px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full w-full sm:w-auto"
                >
                  Book a Service
                </Button>
              </a>
            </div>

            {/* Stats Row */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg sm:max-w-xl mx-auto lg:mx-0"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  aria-label={`${stat.label}: ${stat.value}`}
                  className="stat-item flex flex-col sm:flex-row items-center gap-2 sm:gap-3 glass rounded-xl px-3 py-3 sm:px-4 sm:py-3 border-brand/10 cursor-default text-center sm:text-left"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-brand/20 to-brand-light/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
                  </div>
                  <div>
                    <div className="text-warm-white font-bold text-sm sm:text-lg">
                      {stat.value}
                    </div>
                    <div className="text-text-muted text-[10px] sm:text-xs leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — "What we handle" panel (5 cols desktop) */}
          <div
            ref={panelRef}
            className="lg:col-span-5 hidden lg:block"
            style={{ opacity: 0 }}
          >
            <div className="glass-strong rounded-2xl p-6 lg:p-7 border-brand/15 relative overflow-hidden glow-brand">
              <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h2 className="text-warm-white font-bold text-base sm:text-lg leading-tight">
                    What We Handle
                  </h2>
                  <p className="text-text-muted text-xs">
                    One partner for all your technology
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {handleItems.map((item) => (
                  <div
                    key={item.label}
                    className="handle-chip flex items-center gap-2.5 rounded-xl px-3 py-3 bg-dark-deep/50 border border-brand/10 hover:border-brand/30 hover:bg-brand/5 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4 text-brand-light" />
                    </div>
                    <span className="text-warm-white/90 text-xs sm:text-sm font-medium leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent my-5" />

              <p className="text-text-muted text-xs leading-relaxed">
                Don&apos;t see what you need? We probably do it anyway.{" "}
                <a href="#contact" className="text-brand hover:text-brand-light underline underline-offset-2 font-medium">
                  Just ask us →
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* TRUST BADGES — full-width strip across bottom */}
        <div
          ref={trustRef}
          className="mt-10 sm:mt-12 lg:mt-14"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 flex-wrap">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="trust-item flex items-center gap-2 glass rounded-full px-4 py-2 border-brand/10"
              >
                <badge.icon className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-warm-white/80 text-xs sm:text-sm font-medium">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator — hidden on very small screens */}
      <div
        ref={scrollIndicatorRef}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: 0 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-brand/30 flex items-start justify-center pt-2">
          <div aria-hidden="true" className="w-1 h-2 rounded-full bg-brand animate-pulse-glow" />
        </div>
      </div>
    </section>
  );
}
