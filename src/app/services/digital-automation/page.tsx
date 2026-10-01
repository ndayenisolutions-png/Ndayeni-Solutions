import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Digital Automation & Business Systems",
  description:
    "Automate repetitive business processes — customer enquiries, bookings, forms, notifications and document generation. No-code and low-code automation (Zapier, Make, n8n) from R3,500 per build.",
  alternates: { canonical: "/services/digital-automation" },
};

export default function DigitalAutomationPage() {
  return (
    <ServicePageTemplate
      slug="digital-automation"
      title="Digital Automation & Business Systems"
      shortTitle="Digital Automation"
      tagline="Automate the repetitive. Free up your team for what humans do best."
      description="We map your repetitive business processes and build digital workflows that handle them automatically — using modern no-code and low-code tools your business can actually afford and maintain. No custom software development, no enterprise licensing, no lock-in."
      heroImage="/section-images/automation.jpg"
      icon="workflow"
      accentColor="accent"
      longDescription={[
        "Digital automation in practice means connecting the tools you already use — your website form, your email, your spreadsheet, your accounting package, your CRM, your calendar, your chat app — so that information moves between them automatically instead of being captured, copied and pasted by hand. When a customer fills in a website enquiry form, that data can automatically create a lead in your CRM, send a personalised email reply, post a notification in your team WhatsApp group, schedule a follow-up task for the next day, and update a sales pipeline spreadsheet — without anyone touching a keyboard.",
        "No-code and low-code platforms (Zapier, Make, n8n, Microsoft Power Automate, Google Apps Script) are the modern way to build these automations. They use visual builders where you drag, drop and configure pre-built connectors to common apps — no developer required to maintain, no source code to manage, no server to keep patched. The platforms cost from R300-R1,500/month depending on volume, and most small business automations run well within the R300-R600/month tier. We design and build on the platform that fits your stack — and we don't take commissions from any platform.",
        "Custom code is sometimes the right answer — when the no-code platforms genuinely can't do what you need (a niche integration with a local South African system, a workflow with complex conditional logic, an AI-powered categorisation task). In those cases we write small, well-tested custom integrations in TypeScript or Python, deployed on Vercel or a small cloud server. We always start with no-code where possible (faster to build, easier to maintain, lower ongoing cost) and only escalate to custom when no-code genuinely can't do the job.",
        "The ROI of automation for small business is usually measured in hours saved per week — and the calculation is straightforward. If your receptionist spends 6 hours a week copying form submissions into your CRM, scheduling appointments, and sending confirmation emails, that's 24 hours a month at, say, R80/hour — about R1,920/month of staff time on a task that an automation can do for R500/month in platform fees (one-off R3,500 build cost amortised over 12 months). Most of our automation clients see positive ROI within 2–3 months of going live.",
        "AI integration has opened up automation possibilities that weren't practical two years ago. Examples we build today: an AI that categorises incoming customer emails (sales, support, billing, urgent) and routes them to the right channel; an AI that drafts personalised responses to common enquiries for human review before sending; an AI that summarises weekly customer feedback into a one-page management report; an AI that scans invoices received via email, extracts the line items and posts them to a spreadsheet for the bookkeeper. These are not science fiction — they're real workflows we build using OpenAI's API, Anthropic's Claude, or open-source models where data privacy requires on-prem processing.",
      ]}
      whatWeDo={[
        {
          title: "Workflow audit & mapping",
          description:
            "We walk through your business processes and identify the repetitive manual work — the stuff a person does the same way every time. Output: a visual map of opportunities, prioritised by ROI.",
        },
        {
          title: "No-code automation (Zapier, Make, n8n)",
          description:
            "Build automations on the platform that fits your stack and budget. Visual builders, pre-built connectors to thousands of apps. Easy to maintain, easy to extend, no developer required.",
        },
        {
          title: "Custom integrations",
          description:
            "Where no-code can't do the job, we build small custom integrations in TypeScript or Python. Well-tested, properly documented, deployed on Vercel or a small cloud server.",
        },
        {
          title: "Form & survey setup",
          description:
            "Tally, Typeform, Google Forms, or custom web forms — set up with conditional logic, file uploads, payment integration, and the routing automation that takes the submission to the right place.",
        },
        {
          title: "Document generation automation",
          description:
            "Quotes, contracts, invoices, welcome packs, customised proposals — generated automatically from a template + the data from your CRM or a form. No more copy-pasting into Word.",
        },
        {
          title: "Notification & alert setup",
          description:
            "Real-time alerts via email, SMS, WhatsApp, or Microsoft Teams when something important happens — new lead, big order, customer complaint, inventory threshold reached, server issue.",
        },
        {
          title: "Dashboard & reporting",
          description:
            "Automated dashboards (Google Sheets, Looker Studio, Power BI) pulling data from your systems — sales pipeline, enquiry volumes, support response times, inventory levels. No more Friday-afternoon report generation.",
        },
        {
          title: "AI-powered customer service",
          description:
            "Chatbots trained on your business data, intelligent email routing, automated draft responses for human review, document summarisation. Practical AI applications — not gimmicks.",
        },
      ]}
      whoItsFor={[
        "Service businesses handling bookings (beauty, wellness, training, consulting)",
        "Retailers with inventory thresholds and supplier re-ordering requirements",
        "Professional practices with document-heavy workflows (legal, accounting, medical)",
        "Startups needing to scale operations without scaling headcount",
        "Training providers with course enquiries, enrolment workflows, and certificate issuance",
      ]}
      process={[
        {
          step: "01",
          title: "Workflow discovery",
          description:
            "We sit with your team for 60–90 minutes and watch how they work. We identify the repetitive manual tasks — copy-paste work, follow-up emails, manual report generation, status chasing. We prioritise by hours/month saved.",
        },
        {
          step: "02",
          title: "Automation design",
          description:
            "We design the automation flow visually (in a tool like Miro or a flowchart tool) and discuss it with you before any building starts. You see exactly what triggers what, what data goes where, and what happens when something fails.",
        },
        {
          step: "03",
          title: "Build & test",
          description:
            "We build the automation on the chosen platform, test it with real (or sample) data, and run it in shadow mode (live, but not actually sending emails/messages) for a few days to verify edge cases.",
        },
        {
          step: "04",
          title: "Handover + documentation",
          description:
            "We hand over with a written runbook (so you or any future partner can maintain it), a 30-minute walkthrough call, and 30 days of post-handover support included. Ongoing maintenance available on retainer.",
        },
      ]}
      faqs={[
        {
          question: "Do you need to know how to code?",
          answer:
            "No — for your team, that's the whole point of no-code automation. The platforms we use (Zapier, Make, n8n) have visual builders that non-technical staff can configure, maintain and extend. We train your team during handover. For complex custom integrations, we write the code — but you don't need to maintain that code, you just need to know how to use the automation.",
        },
        {
          question: "What automation tools do you use?",
          answer:
            "Zapier (easiest, broadest app ecosystem, slightly more expensive), Make (more powerful, slightly steeper learning curve, cheaper at scale), n8n (self-hostable open-source, most powerful, requires hosting), Microsoft Power Automate (for organisations already on Microsoft 365), Google Apps Script (for Google Workspace automation). We don't take commissions from any platform — we recommend what fits your stack and budget.",
        },
        {
          question: "What about ongoing maintenance?",
          answer:
            "Automations occasionally break when an upstream app changes its API or interface. We offer monthly retainers from R450/month that include monitoring, automatic reconnection of broken integrations, and small refinements. For mission-critical automations (e.g. lead routing, order processing), the retainer is strongly recommended — a broken automation can mean missed enquiries for days before anyone notices.",
        },
        {
          question: "How secure is my data going through these platforms?",
          answer:
            "Zapier, Make, and Microsoft Power Automate are all SOC 2 Type II compliant and GDPR/POPIA-aligned. Data is encrypted in transit and at rest. For sensitive data (medical, financial, legal), we can use n8n self-hosted on your own infrastructure so the data never leaves your network. We document data flows as part of the build, so your POPIA compliance officer knows exactly what personal information passes through which systems.",
        },
        {
          question: "What AI integration options are available?",
          answer:
            "Practical, business-focused AI integrations we build today: customer email categorisation and routing (using OpenAI or Claude), automated draft responses for human review (saves 60–80% of email response time), weekly customer feedback summarisation, document extraction from PDFs and images (invoices, IDs, contracts), and chatbots trained on your specific business knowledge base. We use OpenAI, Anthropic, and open-source models — the choice depends on data sensitivity, cost tolerance, and quality requirements.",
        },
        {
          question: "How long does an automation build take?",
          answer:
            "Simple automations (1–2 step workflows like \"form submission creates a CRM lead and sends an email\") are typically built in 1–2 days. Moderate automations (3–5 step workflows with conditional logic and custom formatting) take 3–5 days. Complex multi-system integrations with custom code can take 2–3 weeks. The discovery and design phase (before any building) is always 1 week regardless of complexity.",
        },
      ]}
      pricingGuidance="From R3,500 per automation build (typical 1–3 step workflow). Workflow audit & discovery from R1,500 — credited in full to your first automation build. Custom multi-system integrations quoted per project after the discovery. Platform subscription fees (Zapier, Make, etc.) are billed by the provider directly — typically R300–R600/month for small business usage. Ongoing maintenance retainer from R450/month."
      serviceArea="Based in Midrand, we work with automation clients across South Africa. Most in-person discovery meetings happen in Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein and Pretoria. For clients outside Gauteng, the entire workflow (discovery, design, build, handover) is run on Zoom with shared screen collaboration — the deliverables are identical."
      relatedServices={[
        { slug: "web-design", title: "Web Design & Digital Presence" },
        { slug: "it-support-outsourcing", title: "IT Support & Outsourcing" },
        { slug: "digital-skills-training", title: "Digital Skills Training" },
      ]}
    />
  );
}
