"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Send, GraduationCap, Monitor, Cpu, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const programs = [
  {
    icon: Monitor,
    title: "Basic Computer Literacy",
    desc: "Start from zero — learn to use a computer, navigate the internet, send emails and work with files.",
    duration: "3–5 days",
    level: "Beginner",
  },
  {
    icon: Cpu,
    title: "Microsoft Office & Productivity",
    desc: "Master Word, Excel, PowerPoint and Outlook. Learn to create documents, spreadsheets and presentations efficiently.",
    duration: "5 days",
    level: "Beginner–Intermediate",
  },
  {
    icon: ShieldCheck,
    title: "Basic Cybersecurity Awareness",
    desc: "Understand online threats, phishing, passwords and how to protect yourself and your business from cyber attacks.",
    duration: "2 days",
    level: "All levels",
  },
  {
    icon: GraduationCap,
    title: "Web & Graphic Design Fundamentals",
    desc: "Introduction to website design, branding principles and basic graphic design tools for aspiring creatives.",
    duration: "5 days",
    level: "Intermediate",
  },
];

export default function TrainingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    address: "",
    program: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/academy/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setSubmitted(true);
      setForm({ fullName: "", email: "", phone: "", idNumber: "", address: "", program: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-deep">
      {/* Simple top bar */}
      <header className="sticky top-0 z-50 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <span className="text-dark-deep font-bold text-base">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-warm-white font-semibold text-sm sm:text-base leading-tight">Ndayeni Digital Academy</span>
              <span className="text-text-muted text-[9px] sm:text-[10px] tracking-[0.15em] uppercase leading-tight">A division of Ndayeni Solutions Pty Ltd</span>
            </div>
          </Link>
          <Link href="/" className="text-text-muted hover:text-brand text-xs sm:text-sm transition-colors">
            ← Back to website
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[150px]" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/4 rounded-full blur-[120px]" aria-hidden="true" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border-brand/20">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span className="text-text-muted text-xs sm:text-sm font-medium">Ndayeni Solutions Digital Academy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
              <span className="text-warm-white">Build Your </span>
              <span className="text-gradient-brand">Digital Future</span>
            </h1>
            <p className="text-text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Practical, hands-on digital skills training for individuals and teams.
              From basic computer literacy to web design — designed around your actual needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#programs" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/30 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group">
                  View Programs
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#apply" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-brand/30 text-brand hover:bg-brand/10 hover:border-brand/60 transition-all duration-500 px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full">
                  Apply Now
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section id="programs" className="relative py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Our Programs</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                <span className="text-warm-white">Choose Your </span>
                <span className="text-gradient-brand">Path</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {programs.map((p) => (
                <div key={p.title} className="glass rounded-2xl p-5 sm:p-6 border-brand/10 hover:border-brand/30 transition-all duration-500 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <p.icon className="w-6 h-6 text-brand" />
                  </div>
                  <h3 className="text-warm-white font-bold text-base sm:text-lg mb-2">{p.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-accent font-medium">⏱ {p.duration}</span>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-muted">{p.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" className="relative py-12 sm:py-20 md:py-28">
          <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
          <div className="absolute top-20 right-[10%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-brand/4 rounded-full blur-[100px]" aria-hidden="true" />

          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Apply Now</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                <span className="text-warm-white">Start Your </span>
                <span className="text-gradient-brand">Application</span>
              </h2>
              <p className="text-text-muted text-sm sm:text-base">
                Fill in the form below and we&apos;ll get back to you within 2 business days.
              </p>
            </div>

            {submitted ? (
              <div className="glass rounded-2xl p-6 sm:p-8 lg:p-10 border-brand/20 glow-brand text-center">
                <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-8 h-8 text-brand" />
                </div>
                <h3 className="text-warm-white font-bold text-xl sm:text-2xl mb-3">Application Received!</h3>
                <p className="text-text-muted text-sm sm:text-base mb-6">
                  Thank you for applying to the Ndayeni Solutions Digital Academy.
                  We&apos;ve received your application and will contact you within 2 business days
                  to discuss next steps.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="border-brand/30 text-brand hover:bg-brand/10 px-6 py-4 rounded-full">
                  Submit Another Application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border-brand/10 relative overflow-hidden">
                <div aria-hidden="true" className="absolute inset-0 rounded-2xl border-glow-animate pointer-events-none" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Full Name *</Label>
                    <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 h-11 text-sm" />
                  </div>
                  <div>
                    <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Email Address *</Label>
                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 h-11 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Phone Number *</Label>
                    <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+27 83 800 6989" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 h-11 text-sm" />
                  </div>
                  <div>
                    <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">ID Number</Label>
                    <Input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} placeholder="Optional" className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 h-11 text-sm" />
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Address</Label>
                  <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Suburb, City, Province" className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 h-11 text-sm" />
                </div>

                <div className="mb-4">
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-2 block">Program of Interest *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {programs.map(p => (
                      <button
                        key={p.title}
                        type="button"
                        onClick={() => setForm({ ...form, program: p.title })}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2.5 border text-sm transition-all ${
                          form.program === p.title
                            ? "bg-brand/15 border-brand/40 text-warm-white"
                            : "bg-dark-deep/60 border-dark-border/50 text-text-muted hover:border-brand/30 hover:text-warm-white"
                        }`}
                      >
                        {form.program === p.title && <Check className="w-3.5 h-3.5 text-brand" />}
                        {p.title}
                      </button>
                    ))}
                  </div>
                  {!form.program && <p className="text-text-muted/60 text-xs mt-1.5">Please select a program</p>}
                </div>

                <div className="mb-5">
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Message (Optional)</Label>
                  <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about yourself, your goals, or any questions..." rows={3} className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 resize-none text-sm" />
                </div>

                {error && (
                  <div className="mb-4 px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    ⚠ {error}
                  </div>
                )}

                <Button type="submit" disabled={submitting || !form.program} className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-2xl hover:shadow-brand/30 transition-all duration-500 font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl group min-h-[48px]">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-dark-deep/30 border-t-dark-deep rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-dark-deep border-t border-dark-border/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Ndayeni Solutions Pty Ltd — Digital Academy Division
          </p>
          <p className="text-text-muted/50 text-xs mt-1">
            Based in Midrand · Servicing nationwide · <Link href="/" className="text-brand hover:underline">Back to website</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
