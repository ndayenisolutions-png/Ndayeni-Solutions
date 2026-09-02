"use client";

import { useRef, useState, useEffect } from "react";
import {
  Globe,
  Settings,
  Palette,
  GraduationCap,
  Monitor,
  Headphones,
  ArrowRight,
  Check,
  Phone,
  Target,
  Clock,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ServiceDetails = {
  overview: string;
  included: string[];
  idealFor: string;
  timeline: string;
  deliverable: string;
};

type Service = {
  icon: typeof Globe;
  title: string;
  description: string;
  accent: string;
  accentShadow: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  tag: string;
  tagColor: string;
  details: ServiceDetails;
};

const services: Service[] = [
  {
    icon: Globe,
    title: "Web Design & SEO",
    description:
      "Stunning, responsive websites optimized for search engines. We build digital experiences that convert visitors into customers.",
    accent: "from-brand to-brand-light",
    accentShadow: "shadow-brand/20",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    accentBorder: "hover:border-brand/40",
    tag: "Most Popular",
    tagColor: "bg-brand/15 text-brand",
    details: {
      overview:
        "We design and build fast, responsive websites that rank well on Google and convert visitors into customers. Every site is built with modern tech, optimized for speed and SEO from day one, and designed to match your brand identity.",
      included: [
        "Custom responsive design (mobile-first)",
        "On-page SEO optimization",
        "Google My Business setup",
        "Speed optimization (Core Web Vitals)",
        "Analytics dashboard setup",
        "30 days post-launch support",
      ],
      idealFor:
        "Small businesses, startups, and professionals needing a web presence that actually generates leads",
      timeline: "2–4 weeks",
      deliverable: "Live website + source files + SEO baseline report",
    },
  },
  {
    icon: Settings,
    title: "IT Outsourcing",
    description:
      "Scalable IT infrastructure management. Let us handle your technology needs so you can focus on growing your business.",
    accent: "from-accent to-cyan-400",
    accentShadow: "shadow-accent/20",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    accentBorder: "hover:border-accent/40",
    tag: "Enterprise",
    tagColor: "bg-accent/15 text-accent",
    details: {
      overview:
        "Offload your IT management to a team that treats your infrastructure like our own. We handle everything from network monitoring to vendor management, so your team can focus on the work that matters.",
      included: [
        "Network & server monitoring",
        "Cloud infrastructure management",
        "Vendor management",
        "Monthly health reports",
        "Patch & update management",
        "Priority response SLA",
      ],
      idealFor:
        "SMBs without a dedicated IT department, or enterprises needing specialized coverage",
      timeline: "Ongoing (monthly retainer)",
      deliverable: "Managed IT environment + dedicated support channel",
    },
  },
  {
    icon: Headphones,
    title: "IT Technical Support",
    description:
      "24/7 expert support for all your tech challenges. Remote and on-site solutions to keep your operations running smoothly.",
    accent: "from-brand-light to-yellow-400",
    accentShadow: "shadow-brand-light/20",
    accentBg: "bg-brand-light/10",
    accentText: "text-brand-light",
    accentBorder: "hover:border-brand-light/40",
    tag: "Essential",
    tagColor: "bg-brand-light/15 text-brand-light",
    details: {
      overview:
        "When something stops working, you want it fixed quickly and explained in plain language. Our support desk handles everything from a frozen laptop to a misbehaving printer to a stalled email server.",
      included: [
        "Remote & on-site support",
        "Ticket logging & tracking",
        "Printer & peripheral troubleshooting",
        "Email & network issues",
        "Software installation & config",
        "Follow-up & prevention advice",
      ],
      idealFor:
        "Homes and businesses with day-to-day tech headaches that need a reliable fix",
      timeline: "Same-day remote, next-day on-site",
      deliverable: "Resolved ticket + fix documentation",
    },
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description:
      "Eye-catching visual identities and marketing materials. From logos to brand guidelines, we bring your vision to life.",
    accent: "from-brand to-accent",
    accentShadow: "shadow-brand/20",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    accentBorder: "hover:border-brand/40",
    tag: "Creative",
    tagColor: "bg-brand/15 text-brand",
    details: {
      overview:
        "Good branding isn't just a logo — it's a system. We start by understanding who you serve and what makes you different, then design a visual identity that holds together across every touchpoint.",
      included: [
        "Logo design (3 concepts)",
        "Brand color & typography system",
        "Business card & letterhead",
        "Social media templates",
        "Brand guidelines PDF",
        "Source files (AI, SVG, PNG)",
      ],
      idealFor:
        "New businesses needing a complete identity, or existing brands needing a refresh",
      timeline: "1–3 weeks",
      deliverable: "Brand kit + source files + guidelines PDF",
    },
  },
  {
    icon: Monitor,
    title: "Computer Repairs",
    description:
      "Fast, reliable hardware and software repairs. We diagnose and fix issues to get your systems back up and running.",
    accent: "from-accent to-emerald-400",
    accentShadow: "shadow-accent/20",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    accentBorder: "hover:border-accent/40",
    tag: "Quick Fix",
    tagColor: "bg-accent/15 text-accent",
    details: {
      overview:
        "Fast, reliable hardware and software repairs for laptops, desktops, and peripherals. We diagnose the issue honestly, quote before we fix, and get your system back to you as quickly as possible — with the data intact.",
      included: [
        "Hardware diagnosis & repair",
        "Screen & keyboard replacement",
        "Data recovery & backup",
        "OS reinstall & optimization",
        "Virus & malware removal",
        "Hardware upgrade consulting",
      ],
      idealFor:
        "Anyone with a sick laptop, slow desktop, or failing hard drive",
      timeline: "1–3 business days",
      deliverable: "Repaired device + diagnosis report",
    },
  },
  {
    icon: GraduationCap,
    title: "Digital Skills Training",
    description:
      "Empowering individuals and teams with essential digital literacy. Customized training programs for all skill levels.",
    accent: "from-brand-light to-brand",
    accentShadow: "shadow-brand-light/20",
    accentBg: "bg-brand-light/10",
    accentText: "text-brand-light",
    accentBorder: "hover:border-brand-light/40",
    tag: "Growth",
    tagColor: "bg-brand-light/15 text-brand-light",
    details: {
      overview:
        "Empower your team with practical, hands-on digital skills training. We offer customized programs ranging from basic computer literacy to advanced productivity tools, designed around your team's actual workflow.",
      included: [
        "Custom curriculum design",
        "Beginner to advanced modules",
        "Microsoft Office & Google Workspace",
        "Basic cybersecurity awareness",
        "Hands-on practice sessions",
        "Certificate of completion",
      ],
      idealFor:
        "Teams upgrading their digital capabilities, or individuals entering the job market",
      timeline: "1–5 days (customizable)",
      deliverable: "Training completion + reference materials",
    },
  },
];

function ServiceCard({
  service,
  index,
  onOpen,
}: {
  service: Service;
  index: number;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 50 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [index]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div ref={cardRef} style={{ opacity: 0 }}>
      <Card
        role="button"
        tabIndex={0}
        aria-label={`View details for ${service.title}`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        className={`h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 ${service.accentBorder} transition-all duration-500 overflow-hidden group relative cursor-pointer focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-deep hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]`}
      >
        {/* Hover Glow Background */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700`}
        />
        {/* Top Accent Bar */}
        <div
          aria-hidden="true"
          className={`h-[2px] bg-gradient-to-r ${service.accent} opacity-30 group-hover:opacity-80 transition-opacity duration-500`}
        />

        <CardContent className="p-5 sm:p-6 lg:p-8 relative z-10">
          {/* Tag & Arrow */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <span
              className={`text-[10px] tracking-[0.15em] uppercase font-bold ${service.tagColor} px-3 py-1.5 rounded-full`}
            >
              {service.tag}
            </span>
            <div className={`w-8 h-8 rounded-full ${service.accentBg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0`}>
              <ArrowRight className={`w-4 h-4 ${service.accentText}`} />
            </div>
          </div>

          {/* Icon */}
          <div className="relative mb-4 sm:mb-5">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl ${service.accentBg} flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative`}
            >
              <service.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${service.accentText}`} />
              {/* Shadow beneath icon */}
              <div aria-hidden="true" className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-warm-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-brand transition-colors duration-300">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-text-muted text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
            {service.description}
          </p>

          {/* View Details hint */}
          <div className="flex items-center gap-2 text-xs font-medium text-text-muted/80 group-hover:text-brand transition-colors duration-300">
            <span className="uppercase tracking-wider">Tap to view details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Bottom Accent Line */}
          <div
            aria-hidden="true"
            className={`h-[2px] mt-4 sm:mt-5 bg-gradient-to-r ${service.accent} opacity-10 group-hover:opacity-50 transition-opacity duration-700 rounded-full`}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ServiceModal({
  service,
  open,
  onOpenChange,
}: {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!service) return null;

  const metaCards = [
    {
      icon: Target,
      label: "Ideal For",
      value: service.details.idealFor,
      color: "text-brand",
      bg: "bg-brand/10",
    },
    {
      icon: Clock,
      label: "Timeline",
      value: service.details.timeline,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Package,
      label: "Deliverable",
      value: service.details.deliverable,
      color: "text-brand-light",
      bg: "bg-brand-light/10",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-card/95 backdrop-blur-xl border-dark-border/60 max-w-2xl max-h-[90vh] overflow-y-auto p-0 w-[calc(100vw-1.5rem)] sm:w-full mx-auto">
        {/* Header with gradient banner */}
        <div className={`relative h-20 sm:h-24 bg-gradient-to-r ${service.accent} overflow-hidden`}>
          <div className="absolute inset-0 bg-dark-deep/40" aria-hidden="true" />
          <div className="absolute inset-0 opacity-30" aria-hidden="true"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "16px 16px",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-card to-transparent" aria-hidden="true" />
          <DialogHeader className="absolute bottom-3 left-4 sm:left-6 right-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${service.accentBg} backdrop-blur-sm flex items-center justify-center border border-white/10`}>
                <service.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${service.accentText}`} />
              </div>
              <DialogTitle className="text-warm-white text-lg sm:text-2xl font-bold tracking-tight">
                {service.title}
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>

        <div className="px-4 sm:px-6 pb-2">
          <DialogDescription className="text-text-muted text-sm leading-relaxed mt-2">
            {service.details.overview}
          </DialogDescription>
        </div>

        {/* Included checklist */}
        <div className="px-4 sm:px-6 mt-4">
          <h4 className="text-warm-white text-sm font-semibold uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            What&apos;s Included
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {service.details.included.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 glass rounded-lg px-3 py-2.5 border-brand/10"
              >
                <div className={`w-5 h-5 rounded-full ${service.accentBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Check className={`w-3 h-3 ${service.accentText}`} />
                </div>
                <span className="text-warm-white/90 text-sm leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meta cards */}
        <div className="px-4 sm:px-6 mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {metaCards.map((meta) => (
              <div
                key={meta.label}
                className="glass rounded-xl p-4 border-brand/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center`}>
                    <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                  </div>
                  <span className="text-text-muted text-[10px] uppercase tracking-wider font-semibold">
                    {meta.label}
                  </span>
                </div>
                <p className="text-warm-white text-sm leading-snug">{meta.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="px-4 sm:px-6 pt-5 pb-6 mt-2 flex flex-col sm:flex-row gap-3 border-t border-dark-border/40 pt-5">
          <a href="#contact" onClick={() => onOpenChange(false)} className="flex-1">
            <Button
              className={`w-full bg-gradient-to-r ${service.accent} text-dark-deep hover:shadow-lg hover:shadow-brand/25 transition-all duration-500 font-semibold py-5 rounded-xl group`}
            >
              Request this service
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <a href="tel:0631188354" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-brand/30 text-warm-white hover:bg-brand/10 hover:border-brand/60 hover:text-brand transition-all duration-500 py-5 rounded-xl group"
            >
              <Phone className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              Call 063 118 8354
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = (service: Service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedService(null), 200);
    }
  };

  // GSAP section header animation
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

  return (
    <section id="services" className="relative py-12 sm:py-20 md:py-28" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />

      {/* Decorative floating shapes */}
      <div aria-hidden="true" className="absolute top-20 left-10 w-32 h-32 border border-brand/5 rounded-full animate-float-slow" />
      <div aria-hidden="true" className="absolute bottom-20 right-10 w-24 h-24 border border-accent/5 rotate-45 animate-float" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
          style={{ opacity: 0 }}
        >
          <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            What We Do
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            <span className="text-warm-white">Our Core </span>
            <span className="text-gradient-brand">Services</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            From a single sick laptop to a fully managed IT environment, we
            cover the full stack of digital needs for homes and businesses
            across South Africa.
          </p>
        </div>

        {/* Services Grid — 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              onOpen={() => handleOpen(service)}
            />
          ))}
        </div>
      </div>

      <ServiceModal
        service={selectedService}
        open={modalOpen}
        onOpenChange={handleOpenChange}
      />
    </section>
  );
}
