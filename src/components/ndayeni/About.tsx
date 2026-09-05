"use client";

import { useRef, useEffect } from "react";
import {
  Shield,
  Award,
  Users,
  MapPin,
  ArrowRight,
  Cpu,
  Wrench,
  LifeBuoy,
  Target,
  Eye,
  Heart,
  Handshake,
  Clock,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionImages } from "@/lib/section-images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function AnimatedCounter({ target, suffix = "" }: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { textContent: "0" });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            if (el) el.textContent = Math.floor(obj.val) + suffix;
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { icon: Users, value: 100, suffix: "+", label: "Clients Served", color: "text-brand", bg: "from-brand to-brand-light" },
  { icon: Shield, value: 500, suffix: "+", label: "Issues Resolved", color: "text-accent", bg: "from-accent to-cyan-400" },
  { icon: Award, value: 50, suffix: "+", label: "Projects Delivered", color: "text-brand-light", bg: "from-brand-light to-yellow-400" },
  { icon: MapPin, value: 9, suffix: "", label: "Provinces Served", color: "text-brand", bg: "from-brand to-accent" },
];

// Core values — the founder's picks (1, 4, 7) + 3 strong trust-builders
const values: { icon: LucideIcon; title: string; desc: string; accent: string }[] = [
  {
    icon: Wrench,
    title: "Practical Over Flashy",
    desc: "We recommend technology based on your actual needs and budget — never the most expensive option just because. If a R300 fix solves it, that's what you get.",
    accent: "from-brand to-brand-light",
  },
  {
    icon: Handshake,
    title: "Plain Language, No Jargon",
    desc: "We explain what's wrong and what we're doing in words you actually understand. No acronyms, no condescension, no making you feel small for asking.",
    accent: "from-accent to-cyan-400",
  },
  {
    icon: LifeBuoy,
    title: "Teach, Don't Just Fix",
    desc: "When we solve a problem, we show you what caused it and how to prevent it next time. We'd rather build your confidence than keep you dependent on us.",
    accent: "from-brand-light to-yellow-400",
  },
  {
    icon: Shield,
    title: "Transparency First",
    desc: "We quote before we fix. No hidden fees, no surprise charges, no 'while we were in there' add-ons. You approve the price before any work starts.",
    accent: "from-brand to-accent",
  },
  {
    icon: Clock,
    title: "We Show Up",
    desc: "The #1 complaint about IT support is being ghosted. When we say we'll be there — on-site or remote — we're there. And if we can't make it, we tell you early.",
    accent: "from-accent to-emerald-400",
  },
  {
    icon: Heart,
    title: "Rooted in Community",
    desc: "We come from where many of our clients come from. That shapes how we price, how we show up, and how we treat every person who trusts us with their technology — no matter the size of the job.",
    accent: "from-brand to-brand-light",
  },
];

const missionVision = [
  {
    icon: Target,
    label: "Our Mission",
    text: "To make dependable technology accessible to the businesses and homes that need it most — by providing honest, practical IT support that doesn't require a corporate budget to afford.",
    accent: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
  },
  {
    icon: Eye,
    label: "Our Vision",
    text: "To become South Africa's most trusted technology partner for small businesses and homes — and to show, by example, that world-class IT service can come from anywhere.",
    accent: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
];

const processSteps = [
  { step: "01", title: "Assess", desc: "We understand your technology needs" },
  { step: "02", title: "Recommend", desc: "We recommend practical solutions based on your budget" },
  { step: "03", title: "Install", desc: "We supply, configure & install the technology" },
  { step: "04", title: "Support", desc: "We maintain your systems & provide ongoing help" },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Generic fade-up animation helper
  const useFadeUp = (ref: React.RefObject<HTMLDivElement | null>, delay = 0) => {
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { opacity: 0, y: 30 });
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay, ease: "power3.out" });
        },
      });
      return () => { trigger.kill(); };
    }, [ref, delay]);
  };

  useFadeUp(headerRef);
  useFadeUp(storyRef);
  useFadeUp(founderRef, 0.1);
  useFadeUp(missionRef, 0.1);

  // Values stagger animation
  useEffect(() => {
    const el = valuesRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".value-card");
    gsap.set(items, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" });
      },
    });
    return () => { trigger.kill(); };
  }, []);

  // Stats stagger animation
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".stat-card");
    gsap.set(items, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" });
      },
    });
    return () => { trigger.kill(); };
  }, []);

  return (
    <section id="about" className="relative py-12 sm:py-20 md:py-28" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${sectionImages.techtheme})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-deep/55 via-dark-deep/60 to-dark-deep/70" />
        <div className="absolute top-1/2 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
          style={{ opacity: 0 }}
        >
          <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Our Story
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            <span className="text-warm-white">Technology That Works for </span>
            <span className="text-gradient-brand">Everyone</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto px-2 sm:px-0">
            Ndayeni Solutions was built on a simple belief: reliable technology
            shouldn&apos;t be a luxury reserved for big companies with big budgets.
          </p>
        </div>

        {/* The Founding Story */}
        <div ref={storyRef} className="max-w-4xl mx-auto mb-12 sm:mb-20" style={{ opacity: 0 }}>
          <div className="glass rounded-2xl p-5 sm:p-8 lg:p-10 border-brand/10 relative overflow-hidden">
            {/* Quote mark decoration */}
            <Quote className="absolute top-4 right-4 w-16 h-16 text-brand/5" aria-hidden="true" />

            <div className="relative z-10 space-y-4 sm:space-y-5">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-warm-white leading-tight">
                Built where technology was least expected.
              </h3>

              <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                Ndayeni Solutions was founded in 2023 by Nhlakanipho Ntshangase,
                a qualified Computer Systems Engineer whose journey into
                technology started far from the industry&apos;s usual path.
                Having seen firsthand how small businesses, shops and homes
                across South Africa struggle to find affordable, dependable
                tech help — and how often they get overcharged or talked down
                to in the process — he set out to build something different.
              </p>

              <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                The company was founded on a straightforward idea: that the
                businesses and homes that need technology the most are often
                the ones least served by the industry as it stands. Ndayeni
                Solutions exists to change that — by providing honest, practical,
                plain-spoken IT support that treats every client, regardless of
                size, as a partner worth showing up for.
              </p>

              <p className="text-warm-white text-sm sm:text-base leading-relaxed font-medium">
                Today, based in Midrand and serving clients nationwide — with
                Gauteng, Mpumalanga and KwaZulu-Natal at the core — Ndayeni
                Solutions handles everything from computer repairs and office
                networks to CCTV installations and websites. <span className="text-accent">One partner, all your technology, handled properly.</span>
              </p>

              {/* Signature line */}
              <div className="pt-4 border-t border-dark-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center flex-shrink-0">
                    <span className="text-dark-deep font-bold text-base">N</span>
                  </div>
                  <div>
                    <div className="text-warm-white font-semibold text-sm">
                      Nhlakanipho Ntshangase
                    </div>
                    <div className="text-text-muted text-xs">
                      Founder &amp; Computer Systems Engineer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div ref={missionRef} className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-20" style={{ opacity: 0 }}>
          {missionVision.map((mv) => (
            <Card
              key={mv.label}
              className={`bg-dark-card/80 backdrop-blur-sm border ${mv.border} hover:scale-[1.02] transition-all duration-500`}
            >
              <CardContent className="p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${mv.bg} flex items-center justify-center flex-shrink-0`}>
                    <mv.icon className={`w-5 h-5 ${mv.accent}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase text-text-muted">
                    {mv.label}
                  </span>
                </div>
                <p className="text-warm-white text-sm sm:text-base leading-relaxed">
                  {mv.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Core Values */}
        <div className="mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
              What We Stand For
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              <span className="text-warm-white">Our Core </span>
              <span className="text-gradient-brand">Values</span>
            </h3>
          </div>

          <div ref={valuesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {values.map((value) => (
              <Card
                key={value.title}
                className="value-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 hover:-translate-y-1 group overflow-hidden"
              >
                {/* Top accent bar */}
                <div aria-hidden="true" className={`h-[2px] bg-gradient-to-r ${value.accent} opacity-30 group-hover:opacity-80 transition-opacity duration-500`} />
                <CardContent className="p-5 sm:p-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${value.accent} opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <value.icon className={`w-6 h-6 ${value.accent.includes("brand") ? "text-brand" : value.accent.includes("accent") ? "text-accent" : "text-brand-light"}`} />
                  </div>
                  <h4 className="text-warm-white font-bold text-base sm:text-lg mb-2">
                    {value.title}
                  </h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Founder Spotlight + Process */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center mb-12 sm:mb-20">
          {/* Founder Quote Card */}
          <div ref={founderRef} style={{ opacity: 0 }}>
            <div className="glass rounded-2xl p-5 sm:p-8 relative overflow-hidden">
              {/* Background Dot Pattern */}
              <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1e90ff 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <div className="relative z-10">
                {/* Founder Section */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center shadow-lg shadow-brand/20">
                      <span className="text-dark-deep font-bold text-lg sm:text-xl">N</span>
                    </div>
                    <div>
                      <div className="text-brand font-semibold text-base sm:text-lg">
                        Nhlakanipho Ntshangase
                      </div>
                      <div className="text-text-muted text-xs sm:text-sm">
                        Founder &amp; Computer Systems Engineer
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-warm-white text-base sm:text-lg italic leading-relaxed border-l-2 border-brand/30 pl-4">
                    &ldquo;Good technology should make life easier — not more
                    complicated or more expensive. That&apos;s the standard we
                    hold every job to, whether it&apos;s a single laptop or a
                    full office network.&rdquo;
                  </blockquote>
                </div>

                {/* Company Details */}
                <div className="section-divider mb-4 sm:mb-6" />
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand" />
                    </div>
                    <div>
                      <div className="text-warm-white text-[10px] sm:text-xs font-medium">Est. 2023</div>
                      <div className="text-text-muted text-[8px] sm:text-[10px]">Founded</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-warm-white text-[10px] sm:text-xs font-medium">Technology</div>
                      <div className="text-text-muted text-[8px] sm:text-[10px]">Specialization</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-brand-light/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-light" />
                    </div>
                    <div>
                      <div className="text-warm-white text-[10px] sm:text-xs font-medium">Midrand, SA</div>
                      <div className="text-text-muted text-[8px] sm:text-[10px]">Based in</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How We Work — Process */}
          <div>
            <div className="text-center lg:text-left mb-6 sm:mb-8">
              <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">
                How We Work
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-warm-white">
                From first call to ongoing support
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="text-center glass rounded-xl p-2 sm:p-3 border-brand/10"
                >
                  <div className="text-brand text-[10px] sm:text-xs font-bold mb-0.5 sm:mb-1">{step.step}</div>
                  <div className="text-warm-white text-xs sm:text-sm font-semibold">{step.title}</div>
                  <div className="text-text-muted text-[9px] sm:text-[11px] leading-tight mt-0.5">{step.desc}</div>
                </div>
              ))}
            </div>

            <a href="#contact">
              <Button className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/25 transition-all duration-500 font-semibold px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-full group w-full sm:w-auto">
                Work With Us
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              aria-label={`${stat.label}: ${stat.value}${stat.suffix}`}
              className="stat-card relative group"
              style={{ opacity: 0 }}
            >
              <div className="glass rounded-2xl p-3 sm:p-6 text-center border-brand/10 hover:border-brand/30 transition-all duration-500 overflow-hidden hover:-translate-y-1">
                {/* Hover gradient */}
                <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
                <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color} mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`} />
                <div className="text-2xl sm:text-4xl font-bold text-warm-white mb-0.5 sm:mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-text-muted text-xs sm:text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
