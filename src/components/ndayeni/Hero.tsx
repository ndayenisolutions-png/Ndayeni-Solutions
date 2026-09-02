"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowDown, Sparkles, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const stats = [
  { icon: Globe, label: "Websites Launched", value: "50+" },
  { icon: Zap, label: "IT Issues Resolved", value: "500+" },
  { icon: Sparkles, label: "Happy Clients", value: "100+" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // GSAP entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (badgeRef.current) {
      tl.fromTo(badgeRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.2);
    }
    if (headingRef.current) {
      const lines = headingRef.current.querySelectorAll("span, br");
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D WebGL Background */}
      <HeroScene />

      {/* Subtle radial vignette to deepen the edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(7,21,21,0.55) 100%)",
        }}
      />

      {/* Soft center glow behind the headline for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at center, rgba(7,21,21,0.7) 0%, transparent 70%)",
        }}
      />

      {/* Bottom fade into next section */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 bg-gradient-to-t from-dark-deep via-dark-deep/70 to-transparent z-[4] pointer-events-none" />

      {/* Content */}
      <motion.div
        ref={contentRef}
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-24 pb-12 sm:pb-0"
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 glass rounded-full px-4 sm:px-5 py-2 sm:py-2.5 mb-6 sm:mb-8 border-brand/20"
          style={{ opacity: 0 }}
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50 flex-shrink-0" />
          <span className="text-text-muted text-xs sm:text-sm font-medium tracking-wide">
            IT &amp; web partner for homes and businesses across South Africa
          </span>
        </div>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="text-[1.75rem] leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 tracking-tight"
          style={{ opacity: 0 }}
        >
          <span className="text-warm-white">Reliable IT &amp; Web</span>
          <br />
          <span className="text-gradient-brand drop-shadow-[0_0_30px_rgba(30,144,255,0.3)]">
            Solutions
          </span>
          <span className="text-warm-white"> for Your</span>
          <br />
          <span className="text-warm-white">Home &amp; </span>
          <span className="text-gradient-teal drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">
            Business
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-text-muted text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
          style={{ opacity: 0 }}
        >
          Ndayeni Solutions is a Midrand-based team designing fast websites,
          managing IT infrastructure, and fixing the tech that keeps your
          business running — without the jargon or the runaround.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16"
          style={{ opacity: 0 }}
        >
          <a href="#contact" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-2xl hover:shadow-brand/40 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group relative overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center">
                Start Your Project
                <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </span>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </a>
          <a href="#services" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="border-brand/30 text-brand hover:bg-brand/10 hover:border-brand/60 hover:shadow-lg hover:shadow-brand/10 transition-all duration-500 px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full w-full sm:w-auto"
            >
              Explore Services
            </Button>
          </a>
        </div>

        {/* Stats Row */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg sm:max-w-2xl mx-auto"
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
