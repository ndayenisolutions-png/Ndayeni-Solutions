"use client";

import { useRef, useEffect } from "react";
import { Shield, Award, Users, MapPin, ArrowRight, Cpu, Wrench, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const values = [
  { text: "Reliable & trustworthy technology partnerships", icon: Shield },
  { text: "Practical, budget-conscious solutions", icon: Wrench },
  { text: "Client-first approach to every project", icon: Users },
  { text: "Affordable technology for homes & small businesses", icon: Award },
  { text: "Founder-led technical support", icon: Cpu },
  { text: "Local, hands-on assistance when you need it", icon: LifeBuoy },
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
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      },
    });
    return () => { trigger.kill(); };
  }, []);

  // Left column animation
  useEffect(() => {
    const el = leftColRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, x: -40 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" });
      },
    });
    return () => { trigger.kill(); };
  }, []);

  // Right column animation
  useEffect(() => {
    const el = rightColRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, x: 40 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      },
    });
    return () => { trigger.kill(); };
  }, []);

  // Values stagger animation
  useEffect(() => {
    const el = valuesRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".value-item");
    gsap.set(items, { opacity: 0, x: -20 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(items, { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" });
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
            Who We Are
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            <span className="text-warm-white">About </span>
            <span className="text-gradient-brand">Ndayeni Solutions</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center mb-12 sm:mb-20">
          {/* Left - Text Content */}
          <div ref={leftColRef} style={{ opacity: 0 }}>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-warm-white mb-4 sm:mb-6 leading-tight">
              <span>Technology Should </span>
              <span className="text-gradient-brand">Empower</span>, Not Frustrate.
            </h3>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-4">
              Ndayeni Solutions was founded in 2023 by Nhlakanipho Ntshangase,
              a qualified Computer Systems Engineer who saw firsthand how hard
              it is for small businesses and homes to find affordable, reliable
              technology help. One provider who can handle your computers, your
              network, your CCTV and your website — without the jargon.
            </p>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6">
              Based in Kaalfontein, Midrand, we service clients nationwide —
              with Gauteng, Mpumalanga and KwaZulu-Natal making up the bulk of
              our work. We work with small businesses, shops, offices, NGOs,
              schools and home users. We&apos;re founder-led and hands-on — we
              show up, we fix it, and we explain it in plain language. As we
              grow, our team grows, but the commitment to practical, affordable
              technology stays the same.
            </p>

            {/* Values Grid */}
            <div ref={valuesRef} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {values.map((value) => (
                <div
                  key={value.text}
                  className="value-item flex items-center gap-3 glass rounded-lg px-3 py-2.5 border-brand/5 hover:border-brand/15 transition-colors duration-300"
                >
                  <value.icon className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-text-muted text-xs sm:text-sm">{value.text}</span>
                </div>
              ))}
            </div>

            <a href="#contact">
              <Button className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/25 transition-all duration-500 font-semibold px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-full group">
                Request a Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>

          {/* Right - Visual Element */}
          <div ref={rightColRef} style={{ opacity: 0 }}>
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
                    &ldquo;We are dedicated to ensuring that your tech works
                    for you, not against you.&rdquo;
                  </blockquote>
                </div>

                {/* Process Steps */}
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
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-light" />
                    </div>
                    <div>
                      <div className="text-warm-white text-[10px] sm:text-xs font-medium">Midrand, SA</div>
                      <div className="text-text-muted text-[8px] sm:text-[10px]">Location</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
