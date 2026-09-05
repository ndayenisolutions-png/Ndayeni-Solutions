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
  Wifi,
  Cctv,
  Printer,
  Server,
  ChevronDown,
  Workflow,
  type LucideIcon,
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
import { sectionImages } from "@/lib/section-images";

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

type Tier = "primary" | "secondary" | "supporting";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  accentShadow: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  tag: string;
  tagColor: string;
  tier: Tier;
  category: string;
  image: string;
  details: ServiceDetails;
};

type Category = {
  name: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  image: string;
};

const services: Service[] = [
  {
    icon: Headphones,
    title: "IT Support & Outsourcing",
    description:
      "Don't have an IT department? We become yours — on-site and remote support, maintenance and monitoring for small businesses, shops, offices, NGOs and schools.",
    accent: "from-brand to-brand-light",
    accentShadow: "shadow-brand/20",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    accentBorder: "hover:border-brand/40",
    tag: "For Small Businesses",
    tagColor: "bg-brand/15 text-brand",
    tier: "primary",
    category: "IT & Infrastructure",
    image: sectionImages.itsupport,
    details: {
      overview:
        "Offload your day-to-day IT management to a team that treats your technology like our own. We handle everything from computer maintenance to network monitoring, so your team can focus on the work that actually makes you money.",
      included: [
        "On-site & remote support",
        "Computer & network maintenance",
        "Monthly health reports",
        "Patch & update management",
        "Vendor management",
        "Priority response on callouts",
      ],
      idealFor:
        "Small businesses, shops, offices, NGOs and schools without a dedicated IT department",
      timeline: "Ongoing (monthly retainer)",
      deliverable: "Managed IT environment + dedicated support channel",
    },
  },
  {
    icon: Monitor,
    title: "Computer Repairs & Hardware",
    description:
      "Fast, reliable hardware and software repairs for laptops, desktops and peripherals. We diagnose honestly, quote before we fix, and get your systems back to you quickly — with data intact.",
    accent: "from-accent to-emerald-400",
    accentShadow: "shadow-accent/20",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    accentBorder: "hover:border-accent/40",
    tag: "Quick Fix",
    tagColor: "bg-accent/15 text-accent",
    tier: "primary",
    category: "IT & Infrastructure",
    image: sectionImages.repairs,
    details: {
      overview:
        "Fast, reliable hardware and software repairs for laptops, desktops, and peripherals. We diagnose the issue honestly, quote before we fix, and get your system back to you as quickly as possible — with the data intact.",
      included: [
        "Hardware diagnosis & repair",
        "Screen & keyboard replacement",
        "Data recovery & backup",
        "OS reinstall & optimization",
        "Virus & malware removal",
        "Hardware upgrade consulting (SSD, RAM)",
      ],
      idealFor:
        "Anyone with a sick laptop, slow desktop, or failing hard drive",
      timeline: "1–3 business days",
      deliverable: "Repaired device + diagnosis report",
    },
  },
  {
    icon: Wifi,
    title: "Networking & Wi-Fi",
    description:
      "From a single Wi-Fi router to a full Cat6 office network with managed switches and access points — we design, cable, configure and install networks that actually cover your space.",
    accent: "from-brand-light to-yellow-400",
    accentShadow: "shadow-brand-light/20",
    accentBg: "bg-brand-light/10",
    accentText: "text-brand-light",
    accentBorder: "hover:border-brand-light/40",
    tag: "Essential",
    tagColor: "bg-brand-light/15 text-brand-light",
    tier: "primary",
    category: "IT & Infrastructure",
    image: sectionImages.network,
    details: {
      overview:
        "Reliable connectivity is the backbone of any modern business or home. We handle the full scope — site survey, cabling, switch and router configuration, access point placement, and ongoing network support.",
      included: [
        "Site survey & network design",
        "Cat6 / Cat6a cabling & termination",
        "Router & switch configuration",
        "Wi-Fi access point installation",
        "Network security & VLAN setup",
        "Ongoing network support",
      ],
      idealFor:
        "Offices, shops and homes needing reliable, well-covered Wi-Fi and wired networking",
      timeline: "1–3 days (depending on scope)",
      deliverable: "Installed & tested network + configuration documentation",
    },
  },
  {
    icon: Cctv,
    title: "CCTV & Security Technology",
    description:
      "Protect what matters with professionally installed CCTV systems — cameras, NVRs, remote viewing and night vision, configured so you can check in from anywhere on your phone.",
    accent: "from-brand to-accent",
    accentShadow: "shadow-brand/20",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    accentBorder: "hover:border-brand/40",
    tag: "Popular",
    tagColor: "bg-brand/15 text-brand",
    tier: "primary",
    category: "IT & Infrastructure",
    image: sectionImages.cctv,
    details: {
      overview:
        "From a 4-camera home setup to a multi-channel business system, we supply, install and configure CCTV that gives you eyes on your property 24/7. Every install includes remote viewing setup so you can check in from your phone.",
      included: [
        "Site survey & camera placement plan",
        "Camera supply & mounting",
        "NVR / DVR configuration",
        "Night-vision & motion detection setup",
        "Mobile remote viewing app setup",
        "Cabling & power (PoE) installation",
      ],
      idealFor:
        "Shops, offices, homes and premises wanting visible security and remote monitoring",
      timeline: "1–2 days (typical 4–8 camera install)",
      deliverable: "Live CCTV system + mobile app access + documentation",
    },
  },
  {
    icon: Printer,
    title: "Printer & Office Technology",
    description:
      "Printers, scanners, copiers and the tech that keeps an office moving. We supply, set up, configure and maintain office equipment — and fix it when it jams at the worst possible moment.",
    accent: "from-accent to-cyan-400",
    accentShadow: "shadow-accent/20",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    accentBorder: "hover:border-accent/40",
    tag: "Essential",
    tagColor: "bg-accent/15 text-accent",
    tier: "secondary",
    category: "IT & Infrastructure",
    image: sectionImages.printer,
    details: {
      overview:
        "Office technology shouldn't be a daily frustration. We help you choose, set up and maintain the right printer and office equipment for your volume — and we're on call when paper jams, driver issues or connectivity problems strike.",
      included: [
        "Printer & copier supply & setup",
        "Driver installation & network sharing",
        "Wireless printing configuration",
        "Scanner & document workflow setup",
        "Routine maintenance & servicing",
        "Troubleshooting & repairs",
      ],
      idealFor:
        "Small offices and homes that rely on printing, scanning and copying",
      timeline: "Same-day setup, ongoing support",
      deliverable: "Configured office equipment + support channel",
    },
  },
  {
    icon: Globe,
    title: "Web Design & Digital Presence",
    description:
      "Fast, responsive websites optimized for search — built to turn visitors into customers. We also set up your business email, Google profile and online listings.",
    accent: "from-brand to-brand-light",
    accentShadow: "shadow-brand/20",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    accentBorder: "hover:border-brand/40",
    tag: "Most Popular",
    tagColor: "bg-brand/15 text-brand",
    tier: "secondary",
    category: "Digital Business",
    image: sectionImages.webdesign,
    details: {
      overview:
        "We design and build fast, responsive websites that rank well on Google and convert visitors into customers. Every site is built with modern tech, optimized for speed and SEO from day one, and designed to match your brand identity.",
      included: [
        "Custom responsive design (mobile-first)",
        "On-page SEO optimization",
        "Google Business Profile setup",
        "Speed optimization (Core Web Vitals)",
        "Business email setup",
        "30 days post-launch support",
      ],
      idealFor:
        "Small businesses, startups, and professionals needing a web presence that actually generates leads",
      timeline: "2–4 weeks",
      deliverable: "Live website + source files + SEO baseline report",
    },
  },
  {
    icon: Palette,
    title: "Graphic Design & Branding",
    description:
      "Logos, brand systems and marketing materials that hold together across every touchpoint — from your website to your business card to your social media.",
    accent: "from-brand to-accent",
    accentShadow: "shadow-brand/20",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    accentBorder: "hover:border-brand/40",
    tag: "Creative",
    tagColor: "bg-brand/15 text-brand",
    tier: "supporting",
    category: "Digital Business",
    image: sectionImages.graphicdesign,
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
    icon: GraduationCap,
    title: "Digital Skills Training",
    description:
      "Practical, hands-on digital literacy for individuals and teams — from basic computer skills to productivity tools and cybersecurity awareness.",
    accent: "from-brand-light to-brand",
    accentShadow: "shadow-brand-light/20",
    accentBg: "bg-brand-light/10",
    accentText: "text-brand-light",
    accentBorder: "hover:border-brand-light/40",
    tag: "Growth",
    tagColor: "bg-brand-light/15 text-brand-light",
    tier: "supporting",
    category: "Training",
    image: sectionImages.training,
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
  {
    icon: Workflow,
    title: "Digital Automation & Business Systems",
    description:
      "We help businesses simplify repetitive processes and work smarter through digital automation. From customer enquiries and bookings to forms, notifications, document generation and business workflows, we connect the tools you already use to save time and reduce manual work.",
    accent: "from-accent to-brand",
    accentShadow: "shadow-accent/20",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    accentBorder: "hover:border-accent/40",
    tag: "Work Smarter",
    tagColor: "bg-accent/15 text-accent",
    tier: "secondary",
    category: "Digital Automation",
    image: sectionImages.automation,
    details: {
      overview:
        "Most small businesses lose hours every week to repetitive manual work — capturing the same information twice, sending the same follow-ups, generating the same documents by hand. We build digital workflows that handle those tasks automatically, using tools and platforms your business can actually afford and maintain. No custom software development — just smart connections between the tools you already use, designed around how your business actually works.",
      included: [
        "Business Process Automation",
        "Online Forms & Workflows",
        "Customer & Lead Automation",
        "Email & Notification Automation",
        "Booking & Appointment Systems",
        "Document & Invoice Automation",
        "Microsoft 365 Automation",
        "AI-Powered Business Solutions",
      ],
      idealFor:
        "Small businesses, shops, offices and service providers who want to reduce repetitive admin work, respond to customers faster, and stop losing leads to slow manual processes",
      timeline: "1–4 weeks (depending on scope)",
      deliverable: "Configured automation workflows + documentation + training",
    },
  },
];

const categories: Category[] = [
  {
    name: "IT & Infrastructure",
    blurb:
      "The technology that keeps your business running — set up, maintained and supported. Computers, networks, CCTV, printers and ongoing IT support.",
    icon: Server,
    accent: "from-brand to-brand-light",
    accentBg: "bg-brand/10",
    accentText: "text-brand",
    accentBorder: "hover:border-brand/40",
    image: sectionImages.network,
  },
  {
    name: "Digital Business",
    blurb:
      "Your presence online — fast websites, business email and branding that holds together across every touchpoint customers find you on.",
    icon: Globe,
    accent: "from-accent to-cyan-400",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    accentBorder: "hover:border-accent/40",
    image: sectionImages.webdesign,
  },
  {
    name: "Digital Automation",
    blurb:
      "Reduce repetitive work and save time using digital tools — from customer enquiries and bookings to forms, notifications, document generation and business workflows.",
    icon: Workflow,
    accent: "from-accent to-brand",
    accentBg: "bg-accent/10",
    accentText: "text-accent",
    accentBorder: "hover:border-accent/40",
    image: sectionImages.automation,
  },
  {
    name: "Training",
    blurb:
      "Practical digital skills that empower your team and grow your capabilities — from basic computer literacy to productivity tools.",
    icon: GraduationCap,
    accent: "from-brand-light to-yellow-400",
    accentBg: "bg-brand-light/10",
    accentText: "text-brand-light",
    accentBorder: "hover:border-brand-light/40",
    image: sectionImages.training,
  },
];

function ServiceCard({
  service,
  index,
  onOpen,
  animate,
}: {
  service: Service;
  index: number;
  onOpen: () => void;
  animate: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !animate) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.07,
        ease: "power3.out",
      }
    );
  }, [index, animate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <div ref={cardRef} style={animate ? { opacity: 0 } : undefined}>
      <Card
        role="button"
        tabIndex={0}
        aria-label={`View details for ${service.title}`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        className={`h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 ${service.accentBorder} transition-all duration-500 overflow-hidden group relative cursor-pointer focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-deep hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98]`}
      >
        {/* Top Accent Bar */}
        <div
          aria-hidden="true"
          className={`h-[2px] bg-gradient-to-r ${service.accent} opacity-30 group-hover:opacity-80 transition-opacity duration-500`}
        />

        {/* Visible image header band */}
        <div className="card-image-header">
          <img src={service.image} alt="" />
          {/* Tag chip floating on the image */}
          <span
            className={`absolute top-3 left-3 z-10 text-[10px] tracking-[0.15em] uppercase font-bold ${service.tagColor} px-3 py-1.5 rounded-full backdrop-blur-md`}
          >
            {service.tag}
          </span>
        </div>

        <CardContent className="p-5 sm:p-6 lg:p-7 relative z-10">
          {/* Icon */}
          <div className="relative mb-4">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${service.accentBg} flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative`}
            >
              <service.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${service.accentText}`} />
              <div aria-hidden="true" className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-warm-white font-bold text-base sm:text-lg mb-2 group-hover:text-brand transition-colors duration-300">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-text-muted text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
            {service.description}
          </p>

          {/* View Details hint */}
          <div className="flex items-center gap-2 text-xs font-medium text-text-muted/80 group-hover:text-brand transition-colors duration-300">
            <span className="uppercase tracking-wider">View details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Bottom Accent Line */}
          <div
            aria-hidden="true"
            className={`h-[2px] mt-3 sm:mt-4 bg-gradient-to-r ${service.accent} opacity-10 group-hover:opacity-50 transition-opacity duration-700 rounded-full`}
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
              Request a Quote
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <a href="tel:0838006989" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-brand/30 text-warm-white hover:bg-brand/10 hover:border-brand/60 hover:text-brand transition-all duration-500 py-5 rounded-xl group"
            >
              <Phone className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              Call 083 800 6989
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryAccordion({
  category,
  services,
  isOpen,
  onToggle,
  onOpenService,
  animateIndex,
}: {
  category: Category;
  services: Service[];
  isOpen: boolean;
  onToggle: () => void;
  onOpenService: (s: Service) => void;
  animateIndex: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: animateIndex * 0.12,
        ease: "power3.out",
      }
    );
  }, [animateIndex]);

  const Icon = category.icon;

  return (
    <div ref={cardRef} style={{ opacity: 0 }}>
      <Card
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${category.name} — ${services.length} ${services.length === 1 ? "service" : "services"}. ${isOpen ? "Click to collapse" : "Click to view services"}.`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`bg-dark-card/80 backdrop-blur-sm border-dark-border/50 ${category.accentBorder} transition-all duration-500 overflow-hidden group cursor-pointer focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-deep hover:-translate-y-0.5 ${isOpen ? "border-brand/30" : ""}`}
      >
        {/* Top Accent Bar */}
        <div
          aria-hidden="true"
          className={`h-[3px] bg-gradient-to-r ${category.accent} ${isOpen ? "opacity-80" : "opacity-30"} transition-opacity duration-500`}
        />

        <CardContent className="p-5 sm:p-6 lg:p-7 relative z-10">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Icon */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl ${category.accentBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all duration-500 relative`}
            >
              <Icon className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${category.accentText}`} />
              <div aria-hidden="true" className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                <h3 className="text-warm-white font-bold text-lg sm:text-xl lg:text-2xl tracking-tight">
                  {category.name}
                </h3>
                <span className={`text-[10px] tracking-[0.12em] uppercase font-bold ${category.accentBg} ${category.accentText} px-2.5 py-1 rounded-full`}>
                  {services.length} {services.length === 1 ? "service" : "services"}
                </span>
              </div>
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                {category.blurb}
              </p>
            </div>

            {/* Chevron */}
            <div
              className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full ${category.accentBg} flex items-center justify-center transition-all duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`}
            >
              <ChevronDown className={`w-5 h-5 ${category.accentText}`} />
            </div>
          </div>

          {/* Hint when closed */}
          {!isOpen && (
            <div className={`flex items-center gap-2 text-xs font-medium ${category.accentText} mt-4 sm:mt-5 opacity-70 group-hover:opacity-100 transition-opacity`}>
              <span className="uppercase tracking-wider">Click to view services</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expandable services panel — animated with CSS grid trick */}
      <div
        className={`grid transition-all duration-500 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 mt-4 sm:mt-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pt-1">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                onOpen={() => onOpenService(service)}
                animate={isOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenService = (service: Service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedService(null), 200);
    }
  };

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
          className="text-center mb-8 sm:mb-12"
          style={{ opacity: 0 }}
        >
          <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            What We Do
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            <span className="text-warm-white">Our Technology </span>
            <span className="text-gradient-brand">Services</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            We cover the full stack of technology needs for homes and small
            businesses across South Africa. Click a category below to view the
            services under it.
          </p>
        </div>

        {/* Category accordions */}
        <div className="space-y-4 sm:space-y-5 max-w-5xl mx-auto">
          {categories.map((category, index) => {
            const categoryServices = services.filter(
              (s) => s.category === category.name
            );
            return (
              <CategoryAccordion
                key={category.name}
                category={category}
                services={categoryServices}
                isOpen={openCategory === category.name}
                onToggle={() =>
                  setOpenCategory((prev) =>
                    prev === category.name ? null : category.name
                  )
                }
                onOpenService={handleOpenService}
                animateIndex={index}
              />
            );
          })}
        </div>

        {/* Bottom helper CTA */}
        <div className="mt-10 sm:mt-14 text-center max-w-2xl mx-auto">
          <p className="text-text-muted text-sm sm:text-base mb-5">
            Not sure which service you need? Tell us the technology problem
            you&apos;re trying to solve and we&apos;ll figure out the right
            approach.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#solutions" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-brand/30 text-brand hover:bg-brand/10 hover:border-brand/60 transition-all duration-500 font-semibold px-8 py-5 rounded-full group"
              >
                View Business Solutions
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#contact" className="w-full sm:w-auto">
              <Button className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/25 transition-all duration-500 font-semibold px-8 py-5 rounded-full group">
                Request a Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      <ServiceModal
        service={selectedService}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
      />
    </section>
  );
}
