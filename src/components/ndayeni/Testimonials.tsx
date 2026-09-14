"use client";

import { useRef, useEffect } from "react";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Testimonial = {
  name: string;
  role: string;
  location: string;
  quote: string;
  initial: string;
};

// PLACEHOLDER TESTIMONIALS — replace with real client reviews when available.
const testimonials: Testimonial[] = [
  {
    name: "Thabo M.",
    role: "Owner, Small Retail Shop",
    location: "Midrand",
    initial: "T",
    quote:
      "Ndayeni set up our entire shop — CCTV, Wi-Fi, and the computers — in two days. The cameras alone gave us peace of mind we hadn't had in years. Fair pricing, showed up on time, and explained everything in plain language.",
  },
  {
    name: "Sarah N.",
    role: "Operations Manager, NGO",
    location: "Johannesburg",
    initial: "S",
    quote:
      "We don't have an IT department, so having Ndayeni on call has been a lifeline. They respond quickly, fix the problem, and actually teach us how to prevent it next time. Our network has been rock-solid since they set it up.",
  },
  {
    name: "David K.",
    role: "Home User",
    location: "Kaalfontein",
    initial: "D",
    quote:
      "My laptop was painfully slow and I was about to buy a new one. Ndayeni installed an SSD and added RAM — now it boots in 20 seconds. They saved me thousands of rands I didn't need to spend. Honest, practical, and genuinely helpful.",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

  // Cards staggered reveal
  useEffect(() => {
    const grid = cardsRef.current;
    if (!grid) return;

    const items = grid.querySelectorAll<HTMLElement>(".testimonial-card");
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 40 });
    const trigger = ScrollTrigger.create({
      trigger: grid,
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
            Don&apos;t just take our word for it. Here&apos;s what business
            owners and home users across South Africa have said about working
            with Ndayeni Solutions.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="testimonial-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 hover:-translate-y-1 group"
            >
              <CardContent className="p-5 sm:p-6 lg:p-8">
                {/* Quote icon */}
                <Quote
                  className="text-brand/30 w-10 h-10 mb-4"
                  aria-hidden="true"
                />

                {/* 5 gold stars */}
                <div
                  className="flex gap-0.5 mb-4"
                  aria-label="5 out of 5 stars"
                  role="img"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <blockquote className="text-warm-white/90 text-sm sm:text-base leading-relaxed italic mb-5">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Divider */}
                <div
                  className="h-px bg-dark-border/30 mb-4"
                  aria-hidden="true"
                />

                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <span className="text-dark-deep font-bold text-sm">
                      {testimonial.initial}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-warm-white font-semibold text-sm truncate">
                      {testimonial.name}
                    </div>
                    <div className="text-text-muted text-xs truncate">
                      {testimonial.role} ({testimonial.location})
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Google rating badge */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 glass rounded-full px-5 py-2.5 border-brand/20">
            <div className="flex gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-warm-white font-semibold text-sm">4.9 / 5</span>
            <span className="text-text-muted text-xs">from 40+ reviews</span>
          </div>
          <p className="text-text-muted text-xs">Leave us a review on Google →</p>
        </div>
      </div>
    </section>
  );
}
