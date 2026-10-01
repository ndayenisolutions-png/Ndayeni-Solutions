import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "IT Support & Outsourcing",
  description:
    "Outsourced IT support for small businesses, shops, NGOs and schools in Midrand and across Gauteng. Remote and on-site helpdesk, monitoring, patching and vendor management from R1,500/month.",
  alternates: { canonical: "/services/it-support-outsourcing" },
};

export default function ITSupportOutsourcingPage() {
  return (
    <ServicePageTemplate
      slug="it-support-outsourcing"
      title="IT Support & Outsourcing"
      shortTitle="IT Support"
      tagline="Your outsourced IT department — on call, on budget, on your side."
      description="For small businesses that can't justify a full-time IT hire, we become your on-call IT department. We monitor your computers, helpdesk your users, patch your software and manage your vendors — for a predictable monthly fee instead of a salary."
      heroImage="/section-images/techhelp.jpg"
      icon="headphones"
      accentColor="brand"
      longDescription={[
        "Outsourced IT support means handing the day-to-day running of your technology to a partner who treats it like their own. Instead of paying a full-time salary, UIF, benefits and training for an in-house technician — often R25,000–R40,000 a month before overheads — you pay a fraction of that for a whole team's worth of skills, available on demand. For a 10-person business in Midrand, Centurion or Sandton, that's usually the difference between a working IT setup and a perpetually broken one.",
        "Response time matters more than anything else in IT support. We aim for first response on critical issues (server down, internet down, can't process payments) within an hour during business hours, and same-day on-site for problems that can't be solved remotely. Most day-to-day issues — password resets, printer driver problems, email configuration, slow computers — are handled remotely and resolved in under 30 minutes. For non-urgent requests like new user setup, software requests or general questions, we respond within one business day.",
        "Remote support is our first move because it's faster and cheaper for you. Using secure remote desktop tools, we can see what your user sees and walk them through the fix without a callout fee. On-site visits happen when a problem needs physical hands — a dead server, a network point to be patched in, a multi-floor Wi-Fi install, or a printer that needs opening up. Most of our retainer clients get one scheduled on-site visit per month plus on-demand emergency callouts when needed.",
        "We support both Windows and Mac environments, plus the common stack of Microsoft 365 (or Google Workspace), accounting packages like Pastel and Xero, point-of-sale systems, practice management software for medical and legal practices, and the long tail of niche apps small businesses rely on. If we haven't seen your specific software, we'll work with the vendor's support team on your behalf — that vendor management is part of the service, not an extra.",
        "Our approach is honest and budget-aware. We won't recommend a R50,000 server when a R8,000 NAS plus cloud backup will do the job. We won't push you onto a 3-year contract if month-to-month suits your stage better. And if your in-house bookkeeper or junior admin can handle 80% of issues with a 30-minute training session, we'll train them — not lock you into depending on us.",
      ]}
      whatWeDo={[
        {
          title: "Server & workstation monitoring",
          description:
            "Lightweight agents watch your servers and computers 24/7 for disk space, RAM, CPU, services down, and failed backups. We get alerts before you notice a problem.",
        },
        {
          title: "Helpdesk support (remote + on-site)",
          description:
            "Phone, email and WhatsApp support for your team. Most issues resolved remotely within 30 minutes; on-site visits when needed, usually same-day in Gauteng.",
        },
        {
          title: "Software updates & patching",
          description:
            "Windows, Microsoft Office, browser, antivirus and key application updates applied out-of-hours so they don't interrupt your working day. Patching logs kept on file.",
        },
        {
          title: "Antivirus & endpoint security",
          description:
            "Business-grade AV deployment, monitoring and alerting. We catch infections early and quarantine infected devices before they spread across the network.",
        },
        {
          title: "Backup setup & monitoring",
          description:
            "Local + cloud backup strategy (3-2-1 rule), tested restores, and monitored daily. If a backup fails, we know within hours — not after you've lost data.",
        },
        {
          title: "Cloud migration (Microsoft 365 / Google Workspace)",
          description:
            "Move your email, files and collaboration tools to the cloud without losing data or downtime. Domain verification, email migration, DNS records, user training included.",
        },
        {
          title: "Annual IT audits",
          description:
            "Once a year we walk through every device, user, license and vendor with you. You get a plain-English report of what's healthy, what's at risk and what to budget for next year.",
        },
      ]}
      whoItsFor={[
        "Small businesses (5–30 employees) without a dedicated IT person",
        "Shops and retailers that need point-of-sale uptime and card-machine connectivity",
        "NGOs and NPOs that need reliable IT but can't absorb a full-time salary",
        "Schools, training centres and creches with computer labs and admin offices",
        "Medical practices and property agencies with POPIA-sensitive client data",
      ]}
      process={[
        {
          step: "01",
          title: "Free IT audit",
          description:
            "We inventory your devices, users, software, network and backups — at no cost. You get a short report of what's healthy, what's at risk, and what to fix first.",
        },
        {
          step: "02",
          title: "Recommend a support plan",
          description:
            "Based on the audit, we propose a Basic, Business or Business Plus plan (see Care Plans on the homepage). Or a custom scope if your needs fall between tiers.",
        },
        {
          step: "03",
          title: "Onboard devices & users",
          description:
            "We install monitoring agents, set up your helpdesk channel (email + WhatsApp + phone), configure backups, and walk your team through how to log support requests.",
        },
        {
          step: "04",
          title: "Ongoing monitoring & support",
          description:
            "Day-to-day helpdesk, monthly maintenance visits, patching out of hours, and proactive fixes before they become outages. Monthly health report on the 1st.",
        },
      ]}
      faqs={[
        {
          question: "What are your response times?",
          answer:
            "Critical issues (server, internet, or POS down) get first response within 1 hour during business hours (08:00–17:00, Mon–Fri). Non-critical requests are answered within 1 business day. Most remote issues are resolved within 30 minutes of starting. On-site visits in Midrand and surrounding Gauteng are usually same-day for critical issues, next-day for scheduled work.",
        },
        {
          question: "Do you offer after-hours support?",
          answer:
            "Yes — for retainer clients on Business and Business Plus plans, we have an after-hours emergency line for genuine business-down situations (server offline, can't process payments, security incident). Routine issues outside business hours are queued for the next morning. After-hours callouts carry a R650 emergency callout fee on Basic plan; included up to a capped number per quarter on higher plans.",
        },
        {
          question: "Do I have to sign a contract?",
          answer:
            "Month-to-month is the default for support retainers — you can cancel with 30 days' notice. We also offer discounted 12-month contracts (one month free) for clients who prefer the savings and the predictable line item. Project work (migrations, installations) is scoped and quoted separately and is not a retainer.",
        },
        {
          question: "What's included in the monthly fee?",
          answer:
            "Helpdesk support (remote + on-site as per plan), monitoring, patching, antivirus management, backup monitoring, vendor liaison, and a monthly health report. Hardware, software licenses, and major project work (e.g. a server replacement or full network rebuild) are billed separately and always quoted in advance.",
        },
        {
          question: "Can you support both Mac and Windows?",
          answer:
            "Yes. We support mixed environments — common in design studios, agencies and schools. Our monitoring agents, AV, and remote tools work across both platforms. We also handle Microsoft 365 and Google Workspace, which run identically on either OS.",
        },
        {
          question: "Do you manage third-party vendors for us?",
          answer:
            "Yes. Vendor management is included — we'll log tickets with your ISP, POS provider, accounting software vendor, cloud host, etc., and translate their jargon into plain English for you. This alone saves most clients several hours a month and avoids the cost of misdiagnosed vendor issues.",
        },
        {
          question: "Is my data secure with you?",
          answer:
            "We treat data security as a POPIA compliance issue, not just a technical one. Remote sessions are encrypted, agent access is least-privilege and audited, and we never store client data on our own infrastructure unless explicitly asked to set up a backup target. We're happy to sign your data processing agreement and provide a POPIA-aligned information security summary on request.",
        },
      ]}
      pricingGuidance="From R1,500/month for a Basic support plan (single-device or home office). Per-incident ad-hoc support from R450. Most small businesses (5–20 devices) land on the Business plan at R1,499–R2,999/month. Free quote for your specific setup — usually returned within one business day."
      serviceArea="Based in Kaalfontein, Midrand — we provide on-site IT support across greater Gauteng. Most on-site visits happen in Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale and Pretoria. For clients outside Gauteng, we offer remote-only retainers with quarterly on-site visits by arrangement."
      relatedServices={[
        { slug: "computer-repairs", title: "Computer Repairs & Hardware" },
        { slug: "networking-wifi", title: "Networking & Wi-Fi" },
        { slug: "cctv-security", title: "CCTV & Security Technology" },
      ]}
    />
  );
}
