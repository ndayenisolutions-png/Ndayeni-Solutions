"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Monitor, FolderTree, FileText, Sheet, Presentation, Globe, Mail,
  ShieldCheck, Cloud, Chrome, Palette, Megaphone, ArrowRight, Clock, Check,
  MapPin, Calendar, Users, FileCheck, Laptop, BookOpen,
} from "lucide-react";

const modules = [
  { icon: Monitor, title: "1. Computer Fundamentals", topics: ["Introduction to computers", "Computer hardware and peripherals", "Operating systems", "Keyboard and mouse skills", "Desktop and Windows navigation", "Basic computer settings"] },
  { icon: FolderTree, title: "2. File & Document Management", topics: ["Creating and managing folders", "Saving, copying, moving and deleting files", "File types and extensions", "USB and external storage", "Basic file organisation and backup"] },
  { icon: FileText, title: "3. Microsoft Word", topics: ["Creating and editing documents", "Text formatting", "Tables and images", "Page layout", "Headers and footers", "CVs, letters and business documents", "Printing and PDF creation"] },
  { icon: Sheet, title: "4. Microsoft Excel", topics: ["Spreadsheets and worksheets", "Data entry and formatting", "Basic formulas and functions", "Sorting and filtering", "Basic charts", "Simple budgets, invoices and business records"] },
  { icon: Presentation, title: "5. Microsoft PowerPoint", topics: ["Creating presentations", "Slide layouts and formatting", "Images, shapes and tables", "Presenting information", "Basic presentation design"] },
  { icon: Globe, title: "6. Internet & Web Skills", topics: ["Using web browsers", "Effective internet searching", "Online research", "Downloading and uploading files", "Using online services", "Evaluating online information"] },
  { icon: Mail, title: "7. Email & Digital Communication", topics: ["Creating and managing email accounts", "Sending and receiving emails", "Attachments", "Email organisation", "Email etiquette", "Professional email communication", "Calendars and online communication"] },
  { icon: ShieldCheck, title: "8. Digital Safety & Cyber Awareness", topics: ["Strong passwords", "Two-factor authentication", "Phishing and scams", "Safe browsing", "Privacy and personal information", "Social engineering awareness", "Safe use of public Wi-Fi and devices"] },
  { icon: Cloud, title: "9. Microsoft 365 & Cloud Productivity", topics: ["OneDrive", "Microsoft Teams", "Word, Excel and PowerPoint online", "Cloud file storage", "File sharing and collaboration", "Basic online teamwork"] },
  { icon: Chrome, title: "10. Google Workspace & Online Productivity", topics: ["Gmail", "Google Drive", "Google Docs", "Google Sheets", "Google Slides", "Google Forms", "Online collaboration"] },
  { icon: Palette, title: "11. Basic Graphic Design", topics: ["Design fundamentals", "Canva", "Creating posters and flyers", "Social media graphics", "Business cards", "Basic logo concepts", "Preparing designs for printing"] },
  { icon: Megaphone, title: "12. Digital Marketing Fundamentals", topics: ["Social media basics", "Facebook business pages", "Instagram basics", "TikTok for business", "Basic content creation", "Basic online advertising concepts", "Introduction to Google Business Profile"] },
];

const programmes = [
  {
    code: "NDY-DS01", title: "End User Computing", modules: "Modules 1–8", duration: "6 weeks",
    delivery: "In-person or hybrid (Midrand + online)",
    entry: "No prior computer experience required — suitable for complete beginners",
    cert: "Certificate of Completion — Ndayeni Solutions Digital Academy",
    desc: "A comprehensive foundation in computing — from switching on a computer to using Word, Excel, the internet, email and staying safe online. Ideal for beginners entering the digital world.",
  },
  {
    code: "NDY-DS02", title: "Cloud & Online Productivity", modules: "Modules 9–10", duration: "1 week",
    delivery: "In-person or online",
    entry: "Basic computer literacy (mouse, keyboard, internet browsing)",
    cert: "Certificate of Completion — Ndayeni Solutions Digital Academy",
    desc: "Master Microsoft 365 (OneDrive, Teams, Office Online) and Google Workspace (Docs, Sheets, Drive). Learn cloud collaboration and online productivity tools used in modern workplaces.",
  },
  {
    code: "NDY-DS03", title: "Basic Graphic Design", modules: "Module 11", duration: "1 week",
    delivery: "In-person (requires computer access during sessions)",
    entry: "Basic computer literacy. No design experience needed.",
    cert: "Certificate of Completion — Ndayeni Solutions Digital Academy",
    desc: "Learn design fundamentals using Canva. Create posters, flyers, social media graphics, business cards and basic logo concepts. Perfect for small business owners and aspiring creatives.",
  },
  {
    code: "NDY-DS04", title: "Digital Marketing Fundamentals", modules: "Module 12", duration: "1 week",
    delivery: "In-person or online",
    entry: "Basic computer literacy and familiarity with social media",
    cert: "Certificate of Completion — Ndayeni Solutions Digital Academy",
    desc: "Understand social media for business — Facebook, Instagram, TikTok, content creation, online advertising basics and Google Business Profile. Ideal for entrepreneurs and small business marketing.",
  },
];

const importantInfo = [
  { icon: MapPin, label: "Training Location", value: "Kaalfontein, Midrand, Gauteng. Online options available for select courses." },
  { icon: Calendar, label: "Training Schedule", value: "Intakes run monthly. Classes are typically Monday–Friday, 9:00 AM – 1:00 PM. Evening and weekend options available on request." },
  { icon: Users, label: "Admission Requirements", value: "Minimum age 16. No formal qualifications required — all are welcome. Basic literacy recommended." },
  { icon: Laptop, label: "What to Bring", value: "Notebook and pen. A laptop if you have one (computers are provided on-site for in-person sessions)." },
  { icon: FileCheck, label: "Certificate Type", value: "Certificate of Completion — issued by Ndayeni Solutions Digital Academy. These are skills courses, not accredited NQF qualifications." },
  { icon: BookOpen, label: "Terms & Conditions", value: "Full payment or deposit is required before training begins. Fees are non-refundable once a course has commenced. See full terms on enrolment." },
];

export default function TrainingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-deep">
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
          <div className="flex items-center gap-4">
            <Link href="/training/apply" className="text-brand hover:text-brand-light text-xs sm:text-sm font-medium transition-colors">Apply →</Link>
            <Link href="/training/admin" className="text-text-muted hover:text-brand text-xs sm:text-sm transition-colors">Admin</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero / Academy Introduction */}
        <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden">
          <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[150px]" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/4 rounded-full blur-[120px]" aria-hidden="true" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border-brand/20">
              <span className="text-text-muted text-xs sm:text-sm font-medium">Ndayeni Solutions Digital Academy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
              <span className="text-warm-white">Build Your </span><span className="text-gradient-brand">Digital Future</span>
            </h1>
            <p className="text-text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
              Practical, hands-on digital skills training programmes. From basic computer literacy
              to digital marketing — designed for individuals, teams and small businesses.
            </p>
            <p className="text-text-muted/70 text-sm max-w-xl mx-auto mb-8">
              Our training is ideal for school-leavers, job seekers, small business owners, office staff,
              and anyone who wants to improve their digital skills — no prior experience needed.
            </p>
            <a href="/training/apply" className="inline-block">
              <Button size="lg" className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/30 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group">
                Apply Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </section>

        {/* Training Programmes */}
        <section className="relative py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Training Programmes</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                <span className="text-warm-white">Our </span><span className="text-gradient-brand">Digital Skills Courses</span>
              </h2>
              <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
                Four structured training programmes covering 12 essential digital skills modules.
                These are skills courses, not accredited NQF qualifications.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {programmes.map((p) => (
                <div key={p.code} className="glass rounded-2xl p-5 sm:p-6 lg:p-8 border-brand/10 hover:border-brand/30 transition-all duration-500 hover:-translate-y-1 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-brand text-xs font-mono font-bold tracking-wider">{p.code}</span>
                      <h3 className="text-warm-white font-bold text-lg sm:text-xl mt-1">{p.title}</h3>
                    </div>
                    <span className="glass rounded-full px-2.5 py-1 text-accent text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.duration}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">{p.desc}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-text-muted/60 w-28 flex-shrink-0">Delivery:</span>
                      <span className="text-text-muted">{p.delivery}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-text-muted/60 w-28 flex-shrink-0">Entry req:</span>
                      <span className="text-text-muted">{p.entry}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-text-muted/60 w-28 flex-shrink-0">Certificate:</span>
                      <span className="text-text-muted">{p.cert}</span>
                    </div>
                  </div>
                  <a href="/training/apply" className="inline-flex items-center gap-1.5 text-brand text-sm font-medium hover:gap-2.5 transition-all">
                    Apply for this course <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="relative py-12 sm:py-16">
          <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Before You Apply</span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-warm-white">Important Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {importantInfo.map((item) => (
                <div key={item.label} className="glass rounded-xl p-4 border-brand/10 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <div>
                    <h4 className="text-warm-white font-semibold text-xs sm:text-sm mb-1">{item.label}</h4>
                    <p className="text-text-muted text-xs leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="relative py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Course Content</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                <span className="text-warm-white">12 Modules </span><span className="text-gradient-brand">Covered</span>
              </h2>
              <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto">
                Each programme draws from these 12 modules. Here&apos;s what you&apos;ll learn in each.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {modules.map((m) => (
                <div key={m.title} className="glass rounded-xl p-5 border-brand/10 hover:border-brand/25 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <m.icon className="w-4.5 h-4.5 text-brand" />
                    </div>
                    <h3 className="text-warm-white font-bold text-sm">{m.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {m.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-text-muted text-xs leading-relaxed">
                        <Check className="w-3 h-3 text-accent/60 flex-shrink-0 mt-0.5" />{t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              <span className="text-warm-white">Ready to </span><span className="text-gradient-brand">Apply?</span>
            </h2>
            <p className="text-text-muted text-sm sm:text-base mb-6">
              Fill in the application form and we&apos;ll get back to you within 2 business days.
            </p>
            <a href="/training/apply" className="inline-block">
              <Button size="lg" className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-xl hover:shadow-brand/30 transition-all duration-500 font-semibold px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full group">
                Start Your Application <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
        </section>
      </main>

      <footer className="relative bg-dark-deep border-t border-dark-border/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-muted text-sm">© {new Date().getFullYear()} Ndayeni Solutions Pty Ltd — Digital Academy Division</p>
          <p className="text-text-muted/50 text-xs mt-1">Based in Midrand · Servicing nationwide · <Link href="/" className="text-brand hover:underline">Back to website</Link></p>
        </div>
      </footer>
    </div>
  );
}
