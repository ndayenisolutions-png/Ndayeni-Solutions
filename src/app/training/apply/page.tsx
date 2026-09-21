"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Send, ArrowLeft, ArrowRight, Clock, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";

const courses = [
  { code: "NDY-DS01", title: "End User Computing", duration: "6 weeks" },
  { code: "NDY-DS02", title: "Cloud & Online Productivity", duration: "1 week" },
  { code: "NDY-DS03", title: "Basic Graphic Design", duration: "1 week" },
  { code: "NDY-DS04", title: "Digital Marketing Fundamentals", duration: "1 week" },
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const educationLevels = ["No formal education", "Primary school", "Some high school", "Grade 12 / Matric", "Diploma / Certificate", "Degree", "Postgraduate"];
const employmentStatuses = ["Employed full-time", "Employed part-time", "Self-employed", "Unemployed", "Student", "Retired"];
const trainingModes = ["In-person (Midrand)", "Online", "Hybrid (mix of both)"];

const steps = ["Personal", "Course", "Background", "Documents", "Submit"];

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [preferredMode, setPreferredMode] = useState("");
  const [highestEducation, setHighestEducation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", idNumber: "", dateOfBirth: "",
    nationality: "South African", address: "", preferredStartDate: "",
    previousTraining: "", relevantExperience: "",
    nextOfKinName: "", nextOfKinRelationship: "", nextOfKinPhone: "", nextOfKinEmail: "",
    message: "",
  });

  const toggleCourse = (code: string) => {
    setSelectedCourses(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const canProceed = () => {
    if (step === 0) return form.fullName && form.email && form.phone;
    if (step === 1) return selectedCourses.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!termsAgreed) { setError("Please agree to the terms and privacy notice to continue."); return; }
    if (selectedCourses.length === 0) { setError("Please select at least one course."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form, gender, selectedCourses, preferredMode, highestEducation,
          employmentStatus, termsAgreed,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setRef(data.applicationRef || "");
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
          <h1 className="text-warm-white font-bold text-xl sm:text-2xl mb-2">Application Submitted Successfully</h1>
          <p className="text-text-muted text-sm sm:text-base mb-2">
            Thank you for applying to the Ndayeni Solutions Digital Academy.
          </p>
          <p className="text-text-muted text-sm sm:text-base mb-4">
            Your application has been received. Our team will review it and contact you regarding the next steps.
          </p>
          <div className="glass rounded-xl p-4 border-brand/15 mb-6">
            <p className="text-text-muted text-xs mb-1">Application Reference</p>
            <p className="text-warm-white font-mono font-bold text-lg">{ref}</p>
            <p className="text-text-muted/60 text-[10px] mt-1">Keep this number for your records</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/training"><Button variant="outline" className="border-brand/30 text-brand hover:bg-brand/10 px-6 py-4 rounded-full w-full sm:w-auto">Back to Courses</Button></Link>
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
      <header className="sticky top-0 z-50 glass-strong border-b border-dark-border/30 py-3">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/training" className="flex items-center gap-2 text-text-muted hover:text-brand text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </Link>
          <span className="text-warm-white font-semibold text-sm">Application Form</span>
        </div>
      </header>

      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              <span className="text-warm-white">Training </span><span className="text-gradient-brand">Application</span>
            </h1>
            <p className="text-text-muted text-sm">Fields marked with * are required.</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < step ? "bg-brand text-dark-deep" : i === step ? "bg-brand/20 text-brand border border-brand/50" : "bg-dark-card/50 text-text-muted/50 border border-dark-border/30"}`}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1.5 transition-colors ${i <= step ? "text-warm-white" : "text-text-muted/50"}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 mx-2 transition-all duration-300 ${i < step ? "bg-brand" : "bg-dark-border/30"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border-brand/10">
            {/* Step 0: Personal Details */}
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-dark-border/30">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Full Name *</Label><Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Phone *</Label><Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+27 83 800 6989" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">ID / Passport Number</Label><Input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Gender</Label><select value={gender} onChange={e => setGender(e.target.value)} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm cursor-pointer"><option value="">Select…</option>{genderOptions.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Nationality</Label><Input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                </div>
                <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Residential Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Suburb, City, Province" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
              </div>
            )}

            {/* Step 1: Course Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-dark-border/30">Course Information</h3>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-2 block">Select Courses * <span className="normal-case tracking-normal">(you can select more than one)</span></Label>
                  <div className="space-y-2">
                    {courses.map(c => (
                      <button key={c.code} type="button" onClick={() => toggleCourse(c.code)} className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 border transition-all text-left ${selectedCourses.includes(c.code) ? "bg-brand/15 border-brand/40 text-warm-white" : "bg-dark-deep/60 border-dark-border/50 text-text-muted hover:border-brand/30 hover:text-warm-white"}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${selectedCourses.includes(c.code) ? "bg-brand border-brand" : "border-dark-border"}`}>{selectedCourses.includes(c.code) && <Check className="w-3.5 h-3.5 text-dark-deep" />}</div>
                        <div className="flex-1"><span className="font-medium text-sm">{c.title}</span><span className="text-text-muted text-xs ml-2">({c.code})</span></div>
                        <span className="text-text-muted text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Preferred Start Date</Label><Input type="date" value={form.preferredStartDate} onChange={e => setForm({ ...form, preferredStartDate: e.target.value })} className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Preferred Training Mode</Label><select value={preferredMode} onChange={e => setPreferredMode(e.target.value)} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm cursor-pointer"><option value="">Select…</option>{trainingModes.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                </div>
              </div>
            )}

            {/* Step 2: Education & Background */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-dark-border/30">Education & Background</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Highest Level of Education</Label><select value={highestEducation} onChange={e => setHighestEducation(e.target.value)} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm cursor-pointer"><option value="">Select…</option>{educationLevels.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Employment / Student Status</Label><select value={employmentStatus} onChange={e => setEmploymentStatus(e.target.value)} className="w-full h-11 bg-dark-deep/60 border border-dark-border/50 text-warm-white rounded-md px-3 text-sm cursor-pointer"><option value="">Select…</option>{employmentStatuses.map(e => <option key={e} value={e}>{e}</option>)}</select></div>
                </div>
                <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Previous Computer Training (if any)</Label><Textarea value={form.previousTraining} onChange={e => setForm({ ...form, previousTraining: e.target.value })} placeholder="Any computer courses or training you've completed before…" rows={2} className="bg-dark-deep/60 border-dark-border/50 text-warm-white resize-none text-sm" /></div>
                <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Relevant Experience (if any)</Label><Textarea value={form.relevantExperience} onChange={e => setForm({ ...form, relevantExperience: e.target.value })} placeholder="Any work or personal experience with computers, technology, design, marketing, etc." rows={2} className="bg-dark-deep/60 border-dark-border/50 text-warm-white resize-none text-sm" /></div>
              </div>
            )}

            {/* Step 3: Emergency Contact & Documents */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-dark-border/30">Next of Kin / Emergency Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Full Name</Label><Input value={form.nextOfKinName} onChange={e => setForm({ ...form, nextOfKinName: e.target.value })} placeholder="Jane Doe" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Relationship</Label><Input value={form.nextOfKinRelationship} onChange={e => setForm({ ...form, nextOfKinRelationship: e.target.value })} placeholder="e.g. Mother, Spouse, Sibling" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Phone Number</Label><Input type="tel" value={form.nextOfKinPhone} onChange={e => setForm({ ...form, nextOfKinPhone: e.target.value })} placeholder="+27 83 800 6989" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                  <div><Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Email</Label><Input type="email" value={form.nextOfKinEmail} onChange={e => setForm({ ...form, nextOfKinEmail: e.target.value })} placeholder="jane@example.com" className="bg-dark-deep/60 border-dark-border/50 text-warm-white h-11 text-sm" /></div>
                </div>
                <div className="pt-4">
                  <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-dark-border/30 mb-3">Supporting Documents</h3>
                  <div className="glass rounded-xl p-4 border-brand/10 flex items-start gap-3">
                    <FileText className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-warm-white text-sm font-medium mb-1">Bring documents on the day</p>
                      <p className="text-text-muted text-xs leading-relaxed">Please bring a copy of your ID/Passport and any previous qualifications on the first day of training. No need to upload them now — our team will assist you in person.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Declaration & Submit */}
            {step === 4 && (
              <div className="space-y-5">
                <h3 className="text-warm-white font-bold text-sm uppercase tracking-wider pb-2 border-b border-dark-border/30">Declaration & Submit</h3>
                <div>
                  <Label className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5 block">Additional Message (Optional)</Label>
                  <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Anything else you'd like us to know…" rows={2} className="bg-dark-deep/60 border-dark-border/50 text-warm-white resize-none text-sm" />
                </div>
                {/* Summary */}
                <div className="glass rounded-xl p-4 border-brand/10 space-y-1.5">
                  <p className="text-text-muted text-xs uppercase tracking-wider font-semibold mb-2">Application Summary</p>
                  <p className="text-text-muted text-xs"><span className="text-warm-white/80">Name:</span> {form.fullName || "—"}</p>
                  <p className="text-text-muted text-xs"><span className="text-warm-white/80">Email:</span> {form.email || "—"}</p>
                  <p className="text-text-muted text-xs"><span className="text-warm-white/80">Phone:</span> {form.phone || "—"}</p>
                  <p className="text-text-muted text-xs"><span className="text-warm-white/80">Courses:</span> {selectedCourses.join(", ") || "—"}</p>
                  <p className="text-text-muted text-xs"><span className="text-warm-white/80">Preferred start:</span> {form.preferredStartDate || "—"}</p>
                  <p className="text-text-muted text-xs"><span className="text-warm-white/80">Training mode:</span> {preferredMode || "—"}</p>
                </div>
                {/* Declaration */}
                <div className="glass rounded-xl p-4 border-brand/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <button type="button" onClick={() => setTermsAgreed(!termsAgreed)} className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${termsAgreed ? "bg-brand border-brand" : "border-dark-border"}`}>
                      {termsAgreed && <Check className="w-3.5 h-3.5 text-dark-deep" />}
                    </button>
                    <span className="text-text-muted text-xs leading-relaxed">
                      I confirm that the information provided in this application is true and accurate.
                      I agree to the Ndayeni Solutions Digital Academy terms and privacy notice.
                      My personal information will be processed in accordance with the Protection of
                      Personal Information Act (POPIA).
                    </span>
                  </label>
                </div>
                {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">⚠ {error}</div>}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-dark-border/30">
              <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="border-dark-border/50 text-text-muted hover:text-warm-white px-5 py-3 rounded-lg text-sm">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              {step < 4 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-lg text-sm">
                  Next <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting || !termsAgreed} className="bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-lg text-sm min-w-[160px]">
                  {submitting ? (<><div className="w-4 h-4 border-2 border-dark-deep/30 border-t-dark-deep rounded-full animate-spin mr-2" /> Submitting…</>) : (<><Send className="w-4 h-4 mr-1.5" /> Submit Application</>)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark-deep border-t border-dark-border/30 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-text-muted text-xs">© {new Date().getFullYear()} Ndayeni Solutions Pty Ltd — Digital Academy · <ShieldCheck className="w-3 h-3 inline" /> POPIA Compliant</p>
        </div>
      </footer>
    </div>
  );
}
