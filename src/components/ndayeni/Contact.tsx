"use client";

import { useState, useRef, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  Zap,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionImages } from "@/lib/section-images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "083 800 6989",
    sub: "",
    href: "tel:0838006989",
    color: "text-brand",
    bg: "bg-brand/10",
    hoverBg: "hover:bg-brand/15",
    borderHover: "hover:border-brand/30",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info@ndayenisolutions.co.za",
    sub: "",
    href: "mailto:info@ndayenisolutions.co.za",
    color: "text-accent",
    bg: "bg-accent/10",
    hoverBg: "hover:bg-accent/15",
    borderHover: "hover:border-accent/30",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "4099 Finger Fish Street",
    sub: "Kaalfontein, Midrand",
    href: "https://maps.google.com/?q=4099+Finger+Fish+Street+Kaalfontein+Midrand",
    color: "text-brand-light",
    bg: "bg-brand-light/10",
    hoverBg: "hover:bg-brand-light/15",
    borderHover: "hover:border-brand-light/30",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri: 8:00 AM - 5:00 PM",
    sub: "",
    href: "#",
    color: "text-brand",
    bg: "bg-brand/10",
    hoverBg: "hover:bg-brand/15",
    borderHover: "hover:border-brand/30",
  },
];

const interestOptions = [
  "Computer repair",
  "Hardware upgrade",
  "Networking / Wi-Fi",
  "CCTV & security",
  "Printer / office equipment",
  "IT support",
  "Website",
  "Graphic design",
  "Training",
  "Other",
];

const customerTypes = [
  { value: "Business", label: "Business" },
  { value: "Home/individual", label: "Home/Individual" },
  { value: "Organisation", label: "Organisation (NGO / School)" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    customerType: "",
    interests: [] as string[],
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      setRecaptchaReady(true);
      return;
    }

    if (window.grecaptcha) {
      setRecaptchaReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaReady(true);
    script.onerror = () => {
      console.warn("[contact] reCAPTCHA script failed to load — proceeding without it");
      setRecaptchaReady(true);
    };
    document.head.appendChild(script);
  }, []);

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

  useEffect(() => {
    const el = leftColRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, x: -40 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const items = el.querySelectorAll(".contact-info-card");
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" }
        );
        gsap.to(el, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" });
      },
    });
    return () => { trigger.kill(); };
  }, []);

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

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setPreviewUrl(null);

    try {
      let recaptchaToken = "";
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (siteKey && typeof window !== "undefined" && window.grecaptcha?.execute) {
        try {
          recaptchaToken = await window.grecaptcha.execute(siteKey, { action: "contact_form" });
        } catch {
          console.warn("[contact] reCAPTCHA execute failed — sending without token");
        }
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      setSubmitted(true);
      if (typeof data.previewUrl === "string") {
        setPreviewUrl(data.previewUrl);
      }
      setFormData({ name: "", email: "", phone: "", customerType: "", interests: [], message: "" });
      setTimeout(() => {
        setSubmitted(false);
        setPreviewUrl(null);
      }, 15000);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "We couldn't send your message. Please email us directly at info@ndayenisolutions.co.za.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-12 sm:py-20 md:py-28" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="section-bg-image"
        style={{ backgroundImage: `url(${sectionImages.workspace})` }}
      />
      <div className="absolute inset-0 section-bg-overlay" aria-hidden="true" style={{ zIndex: 0 }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" aria-hidden="true" />

      {/* Decorative orbs */}
      <div aria-hidden="true" className="absolute top-20 right-[10%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-brand/4 rounded-full blur-[100px]" />
      <div aria-hidden="true" className="absolute bottom-20 left-[10%] w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] bg-accent/3 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center mb-8 sm:mb-14"
          style={{ opacity: 0 }}
        >
          <span className="text-brand-light text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6">
            <span className="text-warm-white">Request a </span>
            <span className="text-gradient-brand">Quote</span>
          </h2>
          <p className="text-text-muted text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Tell us what technology problem you&apos;re trying to solve. We&apos;ll
            figure out the rest — and get back to you with practical options and
            a clear quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-5 sm:gap-10">
          {/* Contact Info */}
          <div ref={leftColRef} className="lg:col-span-2 space-y-3 sm:space-y-4" style={{ opacity: 0 }}>
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`contact-info-card flex items-start gap-3 sm:gap-4 glass rounded-xl p-3 sm:p-5 group ${info.borderHover} border-transparent transition-all duration-500 block hover:-translate-y-0.5`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${info.bg} ${info.hoverBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300`}
                >
                  <info.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${info.color}`} />
                </div>
                <div>
                  <div className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
                    {info.label}
                  </div>
                  <div className="text-warm-white text-xs sm:text-sm font-medium">
                    {info.value}
                  </div>
                  {info.sub && (
                    <div className="text-text-muted text-[10px] sm:text-xs mt-0.5">
                      {info.sub}
                    </div>
                  )}
                </div>
              </a>
            ))}

            {/* Reassurance Card */}
            <div className="glass rounded-xl p-4 sm:p-6 border-brand/20 glow-brand">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
                <span className="text-warm-white font-semibold text-xs sm:text-sm">
                  Serving clients nationwide
                </span>
              </div>
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                Based in Midrand and working with homes and small businesses
                across all nine provinces. Every enquiry starts with a free
                15-minute scoping call — if we&apos;re not the right fit,
                we&apos;ll tell you who is.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={rightColRef} className="lg:col-span-3" style={{ opacity: 0 }}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border-brand/10 relative overflow-hidden"
            >
              {/* Animated border glow */}
              <div aria-hidden="true" className="absolute inset-0 rounded-2xl border-glow-animate pointer-events-none" />

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
                <div>
                  <label className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2 block">
                    Full Name <span className="text-brand">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                    className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 focus:ring-brand/20 h-11 text-sm"
                  />
                </div>
                <div>
                  <label className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2 block">
                    Email Address <span className="text-brand">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                    className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 focus:ring-brand/20 h-11 text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4 sm:mb-5">
                <label className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+27 83 800 6989"
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 focus:ring-brand/20 h-11 text-sm"
                />
              </div>

              {/* Customer Type — Radio */}
              <div className="mb-4 sm:mb-5">
                <label className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3 block">
                  I am a…
                </label>
                <RadioGroup
                  value={formData.customerType}
                  onValueChange={(val) =>
                    setFormData({ ...formData, customerType: val })
                  }
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3"
                >
                  {customerTypes.map((ct) => (
                    <div
                      key={ct.value}
                      className="flex items-center gap-2.5 glass rounded-lg px-3 py-2.5 border border-dark-border/40 hover:border-brand/30 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={ct.value} id={`ctype-${ct.value}`} />
                      <Label
                        htmlFor={`ctype-${ct.value}`}
                        className="text-warm-white text-xs sm:text-sm font-medium cursor-pointer"
                      >
                        {ct.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Interests — Checkboxes */}
              <div className="mb-4 sm:mb-5">
                <label className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3 block">
                  I&apos;m interested in… <span className="text-text-muted/60 normal-case tracking-normal">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {interestOptions.map((opt) => {
                    const checked = formData.interests.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleInterest(opt)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2.5 border text-xs sm:text-sm transition-all duration-200 text-left ${
                          checked
                            ? "bg-brand/15 border-brand/40 text-warm-white"
                            : "bg-dark-deep/60 border-dark-border/50 text-text-muted hover:border-brand/30 hover:text-warm-white"
                        }`}
                        aria-pressed={checked}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                            checked
                              ? "bg-brand border-brand"
                              : "border-dark-border"
                          }`}
                        >
                          {checked && (
                            <Check className="w-3 h-3 text-dark-deep" />
                          )}
                        </div>
                        <span className="leading-tight">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div className="mb-5 sm:mb-6">
                <label className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-2 block">
                  What do you need help with? <span className="text-brand">*</span>
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell us about the technology problem you're trying to solve — e.g. 'I have a shop and need Wi-Fi, computers and cameras'…"
                  rows={4}
                  required
                  className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 focus:ring-brand/20 resize-none text-sm"
                />
              </div>

              {/* Error message */}
              {submitError && (
                <div className="mb-4 px-3 sm:px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-2">
                  <span className="flex-shrink-0 mt-0.5">⚠</span>
                  <span>{submitError}</span>
                </div>
              )}

              {/* Test-mode preview link */}
              {submitted && previewUrl && (
                <div className="mb-4 px-3 sm:px-4 py-3 rounded-lg bg-brand/10 border border-brand/30 text-brand-light text-xs sm:text-sm flex items-start gap-2">
                  <Mail className="flex-shrink-0 mt-0.5 w-4 h-4" />
                  <span className="flex-1">
                    <span className="block font-medium text-warm-white">
                      Test mode active
                    </span>
                    Your message was captured by the test mail server.{" "}
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-brand-light hover:text-brand font-medium"
                    >
                      View the email preview →
                    </a>
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-2xl hover:shadow-brand/30 transition-all duration-500 font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl group relative overflow-hidden min-h-[48px]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-dark-deep/30 border-t-dark-deep rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : submitted ? (
                    <>
                      <Check className="w-4 h-4" />
                      Request sent — we&apos;ll be in touch
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      Request a Quote
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-light to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>

              {/* reCAPTCHA badge + privacy note */}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-text-muted/40 text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                <span>Protected by reCAPTCHA. Your data is safe with us.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
