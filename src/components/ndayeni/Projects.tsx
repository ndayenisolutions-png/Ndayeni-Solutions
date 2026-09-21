"use client";

import { useRef, useEffect } from "react";
import {
  Cctv,
  Network,
  HardDrive,
  ArrowRight,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Project = {
  icon: LucideIcon;
  title: string;
  category: string;
  description: string;
  /** Tailwind gradient classes, e.g. "from-brand to-brand-light" */
  accent: string;
  /** Tailwind text color class, e.g. "text-brand" */
  accentText: string;
  /** Tailwind low-opacity background tint, e.g. "bg-brand/10" */
  accentBg: string;
  location: string;
  scope: string[];
};

const projects: Project[] = [
  {
    icon: Cctv,
    title: "4-Camera CCTV Installation",
    category: "CCTV & Security",
    description:
      "Full 4-channel CCTV system with NVR, night-vision cameras and remote viewing setup for a small retail store. Cabling, mounting and mobile app configuration included.",
    accent: "from-brand to-brand-light",
    accentText: "text-brand",
    accentBg: "bg-brand/10",
    location: "Midrand",
    scope: ["4 Cameras", "NVR", "Remote Viewing", "Night Vision"],
  },
  {
    icon: Network,
    title: "Small Office Network Setup",
    category: "Networking & Wi-Fi",
    description:
      "Complete office network install — Cat6 cabling, managed PoE switch, business-grade Wi-Fi access points and a secure router configuration for a 10-person office.",
    accent: "from-accent to-cyan-400",
    accentText: "text-accent",
    accentBg: "bg-accent/10",
    location: "Midrand",
    scope: ["Cat6 Cabling", "PoE Switch", "Wi-Fi APs", "Router Config"],
  },
  {
    icon: HardDrive,
    title: "Computer Upgrade — SSD + RAM",
    category: "Computer Repairs",
    description:
      "Revived a slow 5-year-old laptop with a 1TB SSD upgrade and additional RAM. Boot times dropped from 2 minutes to under 20 seconds, with full data migration and backup.",
    accent: "from-brand-light to-yellow-400",
    accentText: "text-brand-light",
    accentBg: "bg-brand-light/10",
    location: "Kaalfontein",
    scope: ["1TB SSD", "RAM Upgrade", "Data Migration", "Backup Setup"],
  },
];

function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;

  return (
    <Card className="project-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 overflow-hidden group hover:-translate-y-1 focus-within:border-brand/40">
      {/* Stylized project image placeholder */}
      <div
        className={`h-40 sm:h-44 relative overflow-hidden bg-gradient-to-br ${project.accent}`}
      >
        <div className="absolute inset-0 bg-dark-deep/60" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className={`w-14 h-14 sm:w-16 sm:h-16 ${project.accentText} opacity-40 group-hover:scale-110 transition-transform duration-500`}
            aria-hidden="true"
          />
        </div>
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 glass rounded-full px-2.5 py-1">
          <MapPin className="w-3 h-3 text-warm-white/70" aria-hidden="true" />
          <span className="text-warm-white/80 text-[10px] font-medium">
            {project.location}
          </span>
        </div>
      </div>

      <CardContent className="p-5 sm:p-6">
        {/* Category pill */}
        <span
          className={`inline-block text-[10px] uppercase tracking-wider font-semibold ${project.accentText} ${project.accentBg} px-2.5 py-1 rounded-full mb-3`}
        >
          {project.category}
        </span>

        {/* Title */}
        <h3 className="text-warm-white font-bold text-base sm:text-lg mb-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Footer: scope chips + arrow hint */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-dark-border/40">
          <div className="flex flex-wrap gap-1.5" aria-label="Project scope">
            {project.scope.map((chip) => (
              <span
                key={chip}
                className="text-[10px] text-warm-white/70 bg-dark-deep/60 border border-brand/15 rounded-full px-2 py-0.5"
              >
                {chip}
              </span>
            ))}
          </div>
          <ArrowRight
            className={`w-4 h-4 ${project.accentText} opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0`}
            aria-hidden="true"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Header scroll-in animation
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

  // Staggered card reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>(".project-card");
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: cards[0],
      start: "top 85%",
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
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="relative py-12 sm:py-20 md:py-28"
    >
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-deep via-dark-surface/30 to-dark-deep" />
        <div className="absolute top-1/3 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/4 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-brand/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
          style={{ opacity: 0 }}
        >
          <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Recent Projects
          </span>
          <h2
            id="projects-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6"
          >
            <span className="text-warm-white">Real Work, </span>
            <span className="text-gradient-brand">Real Results</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            We&apos;re gradually building a portfolio of real installations —
            not just service descriptions. Here&apos;s a sample of the kind of
            technology work we do for homes and small businesses across Midrand
            and beyond.
          </p>
        </div>

        {/* Projects grid — 1 col mobile, 2 col sm, 3 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <p className="text-text-muted text-sm sm:text-base mb-5 max-w-xl mx-auto">
            Every install is photographed and documented. Want to see if we can
            solve your technology problem?
          </p>
          <a href="#contact">
            <Button className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/25 transition-all duration-500 font-semibold px-8 py-5 rounded-full group">
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
