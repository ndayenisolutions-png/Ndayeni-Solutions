import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Digital Skills Training",
  description:
    "Practical, hands-on digital literacy training for individuals and teams in Midrand. Computer basics, Microsoft Office, Google Workspace, email safety and social media for business. Public courses from R1,500/person.",
  alternates: { canonical: "/services/digital-skills-training" },
};

export default function DigitalSkillsTrainingPage() {
  return (
    <ServicePageTemplate
      slug="digital-skills-training"
      title="Digital Skills Training"
      shortTitle="Digital Skills Training"
      tagline="Practical, hands-on digital literacy — for individuals, teams and organisations."
      description="Practical, hands-on digital skills training for South African individuals and teams. From basic computer literacy to Microsoft Office and Google Workspace productivity — designed for the actual jobs people do, not for exams."
      heroImage="/section-images/training.jpg"
      icon="graduation-cap"
      accentColor="brand"
      longDescription={[
        "Our training approach is hands-on and task-oriented. We don't teach software menus — we teach real-world tasks. In Excel, that means building a budget for a household or a small business, creating a staff shift schedule, or running a simple sales pipeline tracker. In Word, that means writing a professional CV, formatting a contract, or creating a business letter that looks like it came from a real organisation. Learning the menus is a side effect of doing the task — the task is what people remember and apply.",
        "Accreditation status is important to be honest about. Our courses are Ndayeni Solutions Digital Academy programmes — they are not NQF-registered qualifications and they are not SETA-accredited. They are practical skills courses with a Certificate of Completion issued by us. For most learners, that's exactly what they need: practical digital skills that improve employability and productivity. For learners who need an NQF qualification for a specific regulatory or study-pathway reason, we'll happily recommend an accredited public FET college or university programme instead.",
        "Public courses run monthly from our Kaalfontein training venue in Midrand, with intakes typically Monday–Friday 9:00 AM–1:00 PM. Evening and weekend options are available on request. Maximum class size is 12 people — small enough for individual attention, large enough for the peer learning that reinforces the content. We provide the computers (so you don't need to bring a laptop) and the printed course materials. You bring a notebook and pen, and ideally an idea of what you want to use the skills for.",
        "On-site team training is a separate offering — we come to your premises (anywhere in Gauteng) and train your team together, on your equipment, using your actual documents and workflows. This is dramatically more effective than sending individuals to public courses — the team learns together, the examples are real (your spreadsheets, your letters, your customer emails), and the cost per person is lower. Typical formats are 1-day intensives (6 hours) or 2-day deeper courses. We can also deliver hybrid: hands-on in-person sessions supplemented with short recorded refreshers.",
        "Our course catalogue is available on the /training page — twelve modules grouped into four programmes (End User Computing, Cloud & Online Productivity, Basic Graphic Design, and Digital Marketing Fundamentals). The full End User Computing programme runs over 6 weeks (8 modules), the shorter specialist programmes run over 1 week each (1–2 modules each). You can mix and match — we customise the programme to your team's actual needs rather than forcing everyone through the same content.",
      ]}
      whatWeDo={[
        {
          title: "Basic computer literacy",
          description:
            "From switching on a computer for the first time to file management, mouse and keyboard skills, basic Windows navigation, internet browsing and email. Suitable for complete beginners — no prior experience needed.",
        },
        {
          title: "Microsoft Office (Word, Excel, PowerPoint)",
          description:
            "Word for professional documents (CVs, contracts, letters). Excel for budgets, schedules, and basic data analysis. PowerPoint for presentations that don't put the audience to sleep. Taught through real-world tasks.",
        },
        {
          title: "Google Workspace training",
          description:
            "Gmail, Google Calendar, Drive, Docs, Sheets, Slides, Forms — for teams moving to or already on Google Workspace. Collaboration features (real-time editing, comments, suggestions) are a major focus.",
        },
        {
          title: "Email & internet safety",
          description:
            "Strong passwords, two-factor authentication, phishing recognition, safe browsing habits, secure handling of personal information, and what to do (and not do) if you suspect a compromise. Practical cyber awareness.",
        },
        {
          title: "Social media for business",
          description:
            "Facebook business pages, Instagram basics, TikTok for business, content creation fundamentals, online advertising basics, and Google Business Profile setup. For small business owners and marketing staff.",
        },
        {
          title: "Web presence basics",
          description:
            "What makes a good business website, how to brief a web designer, what to ask for, how to maintain the site after launch, and how to use Google Analytics basics to see what's working. Empowers you to buy web services well.",
        },
        {
          title: "Custom team training",
          description:
            "We design training around your team's actual workflows. Send us your spreadsheets, your documents, your processes — and we'll build a programme that uses your real work as the practice material. More effective than generic training.",
        },
        {
          title: "Digital skills for job seekers",
          description:
            "A focused programme for school-leavers, graduates and people re-entering the workforce. Covers the digital skills most employers expect (Office, email, internet research, basic digital professionalism) and CV preparation.",
        },
      ]}
      whoItsFor={[
        "Job seekers wanting to add demonstrable digital skills to their CV",
        "School leavers preparing to enter the workforce or further study",
        "Small business teams needing consistent digital skills across the staff",
        "NGO staff who need to use digital tools effectively for programme delivery",
        "Community organisations running digital literacy initiatives for their beneficiaries",
      ]}
      process={[
        {
          step: "01",
          title: "Needs assessment",
          description:
            "For individuals: you tell us your goals and we recommend a programme. For teams: we meet with you to understand what your team currently does, what they need to do, and what gaps need closing.",
        },
        {
          step: "02",
          title: "Course selection",
          description:
            "We recommend a programme (or design a custom one). For individuals, this is choosing from our 4 standard programmes. For teams, this is selecting modules from the 12-module catalogue and designing the schedule.",
        },
        {
          step: "03",
          title: "Schedule + venue",
          description:
            "Public courses: pick an intake date from our monthly schedule. Team training: agree on dates, venue (your premises or our Kaalfontein venue), and equipment. We confirm with a written training agreement.",
        },
        {
          step: "04",
          title: "Training delivery + resources",
          description:
            "Training delivered as agreed. Printed course materials and digital reference sheets provided. For team training, post-course follow-up (1–2 hours of phone/WhatsApp support) included for 2 weeks.",
        },
      ]}
      faqs={[
        {
          question: "What are the course durations?",
          answer:
            "End User Computing (8 modules) runs over 6 weeks, 4 hours a day (Mon–Fri mornings). Cloud & Online Productivity (2 modules) runs over 1 week. Basic Graphic Design (1 module) runs over 1 week. Digital Marketing Fundamentals (1 module) runs over 1 week. Custom team training: typically 1-day (6 hours) or 2-day (12 hours) intensives, scheduled to fit your operations.",
        },
        {
          question: "Are the courses accredited?",
          answer:
            "No — and we're upfront about this. Our courses are skills courses issued under Ndayeni Solutions Digital Academy. They are not NQF-registered qualifications and they are not SETA-accredited. They are practical, hands-on, employer-recognised skills courses with a Certificate of Completion. If you specifically need an NQF qualification, we recommend public FET colleges or university short courses — and we'll happily refer you to reputable providers.",
        },
        {
          question: "Is a certificate issued at the end?",
          answer:
            "Yes — a Certificate of Completion issued by Ndayeni Solutions Digital Academy, with the learner's name, the programme completed, the date, and a verification number. The certificate is verifiable online at /training/verify/[certificateNumber]. This is a skills certificate, not an NQF qualification — but it's a real, verifiable record of training completed.",
        },
        {
          question: "On-site or venue — which is better?",
          answer:
            "For teams of 5 or more: on-site at your premises is usually better — your team learns together on your equipment using your real documents, and the cost per person is lower than sending individuals to public courses. For individuals or small groups of 2–3: public courses at our Kaalfontein venue are usually better — you get the peer learning of being in a class with other learners, and the venue is set up specifically for training.",
        },
        {
          question: "What's the minimum group size for on-site training?",
          answer:
            "We run on-site team training for groups of 5 to 25 people. Below 5 people, the cost per person makes public courses more economical. Above 25, we recommend splitting the group and running multiple sessions or scheduling consecutive days. Each on-site session requires a training room with a projector or large screen, reliable power, and either a computer per learner or learners paired up two-per-computer.",
        },
        {
          question: "How much does training cost?",
          answer:
            "Public courses: from R1,500 per person for the 1-week specialist programmes (Basic Graphic Design, Cloud & Online Productivity, Digital Marketing). End User Computing (6 weeks, 8 modules) is R4,500 per person. On-site team training: from R8,000 per day for up to 10 people (R800 per additional person, max 25). Custom curriculum design: R2,500 one-off. All prices include materials and certificate issuance. Travel outside Midrand may incur travel costs.",
        },
      ]}
      pricingGuidance="Public courses from R1,500 per person for 1-week specialist programmes. End User Computing (6-week programme) from R4,500 per person. On-site team training from R8,000 per day for up to 10 people, R800 per additional person (max 25). Custom curriculum design R2,500 one-off. Quote tailored to your team's specific needs — get in touch for an exact quote."
      serviceArea="Public courses run from our training venue in Kaalfontein, Midrand. On-site team training is delivered across greater Gauteng — Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein and Pretoria. For on-site training outside Gauteng, we travel and quote travel costs upfront. Public courses are open to learners from anywhere in South Africa."
      relatedServices={[
        { slug: "digital-automation", title: "Digital Automation & Business Systems" },
        { slug: "web-design", title: "Web Design & Digital Presence" },
        { slug: "graphic-design-branding", title: "Graphic Design & Branding" },
      ]}
    />
  );
}
