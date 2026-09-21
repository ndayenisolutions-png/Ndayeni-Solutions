"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Send, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

const courses = [
  { code: "NDY-DS01", title: "End User Computing", duration: "6 weeks" },
  { code: "NDY-DS02", title: "Cloud & Online Productivity", duration: "1 week" },
  { code: "NDY-DS03", title: "Basic Graphic Design", duration: "1 week" },
  { code: "NDY-DS04", title: "Digital Marketing Fundamentals", duration: "1 week" },
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [gender, setGender] = useState("");

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", idNumber: "", age: "", nationality: "South African",
    address: "", nextOfKinName: "", nextOfKinRelationship: "", nextOfKinPhone: "", nextOfKinEmail: "",
    message: "",
  });

  const toggleCourse = (code: string) => {
    setSelectedCourses(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length === 0) { setError("Please select at least one course."); return; }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/academy/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, gender, selectedCourses }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-deep px-4">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="relative z-10 glass-strong rounded-2xl p-6 sm:p-8 lg:p-10 border-brand/20 glow-brand text-center max-w-lg w-full">
          <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-warm-white font-bold text-xl sm:text-2xl mb-3">Application Received!</h1>
          <p className="text-text-muted text-sm sm:text-base mb-2">
            Thank you for applying to the Ndayeni Solutions Digital Academy.
          </p>
          <p className="text-text-muted text-sm sm:text-base mb-6">
            We&apos;ve received your application for: <span className="text-warm-white font-medium">{selectedCourses.join(", ")}</span>.
            We&apos;ll contact you within 2 business days to discuss next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/training">
              <Button variant="outline" className="border-brand/30 text-brand hover:bg-brand/10 px-6 py-4 rounded-full w-full sm:w-auto">
                Back to Courses
              </Button>
            </Link>
            <Button onClick={() => { setSubmitted(false); setSelectedCourses([]); }} variant="outline" className="border-dark-border/50 text-text-muted hover:text-warm-white px-6 py-4 rounded-full">
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-deep">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/training" className="flex items-center gap-2 text-text-muted hover:text-brand text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <span className="text-warm-white font-semibold text-sm">Application Form</span>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              <span className="text-warm-white">Training </span>
              <span className="text-gradient-brand">Application Form</span>
            </h1>
            <p className="text-text-muted text-sm sm:text-base">
              Fill in your details below. Fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border-brand/10 space-y-6">
            {/* Section: Personal Details */}
            <div>
              <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-dark-border/30">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Full Name *</Label>
                  <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Email Address *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Phone Number *</Label>
                  <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+27 83 800 6989" required className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">ID Number</Label>
                  <Input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} placeholder="Optional" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Gender</Label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm cursor-pointer">
                    <option value="">Select…</option>
                    {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Age</Label>
                  <Input type="number" min="16" max="100" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Optional" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Nationality</Label>
                  <Input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} placeholder="South African" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Residential Address</Label>
                <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Suburb, City, Province" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
              </div>
            </div>

            {/* Section: Next of Kin */}
            <div>
              <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-dark-border/30">
                Next of Kin / Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Full Name</Label>
                  <Input value={form.nextOfKinName} onChange={e => setForm({ ...form, nextOfKinName: e.target.value })} placeholder="Jane Doe" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Relationship</Label>
                  <Input value={form.nextOfKinRelationship} onChange={e => setForm({ ...form, nextOfKinRelationship: e.target.value })} placeholder="e.g. Mother, Spouse, Sibling" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Phone Number</Label>
                  <Input type="tel" value={form.nextOfKinPhone} onChange={e => setForm({ ...form, nextOfKinPhone: e.target.value })} placeholder="+27 83 800 6989" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Email</Label>
                  <Input type="email" value={form.nextOfKinEmail} onChange={e => setForm({ ...form, nextOfKinEmail: e.target.value })} placeholder="jane@example.com" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" />
                </div>
              </div>
            </div>

            {/* Section: Course Selection */}
            <div>
              <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-dark-border/30">
                Course Selection *
              </h3>
              <p className="text-text-muted text-xs mb-3">Select one or more courses you&apos;d like to apply for.</p>
              <div className="space-y-2">
                {courses.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => toggleCourse(c.code)}
                    className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 border transition-all duration-200 text-left ${
                      selectedCourses.includes(c.code)
                        ? "bg-brand/15 border-brand/40 text-warm-white"
                        : "bg-dark-deep/60 border-dark-border/50 text-text-muted hover:border-brand/30 hover:text-warm-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedCourses.includes(c.code) ? "bg-brand border-brand" : "border-dark-border"
                    }`}>
                      {selectedCourses.includes(c.code) && <Check className="w-3.5 h-3.5 text-dark-deep" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">{c.title}</span>
                      <span className="text-text-muted text-xs ml-2">({c.code})</span>
                    </div>
                    <span className="text-text-muted text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {c.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Additional Message */}
            <div>
              <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-dark-border/30">
                Additional Information
              </h3>
              <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Message (Optional)</Label>
              <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about yourself, your goals, or any questions you have…" rows={3} className="bg-dark-deep/60 border-dark-border/50 text-warm-white placeholder:text-text-muted/40 focus:border-brand/50 resize-none text-sm" />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                ⚠ {error}
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-2xl hover:shadow-brand/30 transition-all duration-500 font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl group min-h-[48px]">
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-deep/30 border-t-dark-deep rounded-full animate-spin mr-2" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                  Submit Application
                </>
              )}
            </Button>
          </form>
        </div>
      </main>

      <footer className="bg-dark-deep border-t border-dark-border/30 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-text-muted text-xs">© {new Date().getFullYear()} Ndayeni Solutions Pty Ltd — Digital Academy</p>
        </div>
      </footer>
    </div>
  );
}
