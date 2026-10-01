import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Web Design & Digital Presence",
  description:
    "Fast, mobile-first websites that rank on Google and turn visitors into clients. Built with modern tech (Next.js), SEO optimised, POPIA-compliant contact forms, business email setup. From R6,500.",
  alternates: { canonical: "/services/web-design" },
};

export default function WebDesignPage() {
  return (
    <ServicePageTemplate
      slug="web-design"
      title="Web Design & Digital Presence"
      shortTitle="Web Design"
      tagline="Websites that load fast, rank well, and turn visitors into clients."
      description="We design and build fast, mobile-first websites for South African small businesses — optimised for Google search, with POPIA-compliant contact forms, business email setup, and a Google Business Profile so customers can actually find you."
      heroImage="/section-images/webdesign.png"
      icon="globe"
      accentColor="brand"
      longDescription={[
        "A good small business website in South Africa does three things: it loads in under 2 seconds on a 4G phone (most of your visitors arrive on mobile), it ranks for the search terms your customers actually type (\"plumber Midrand\", \"IT support Centurion\", \"web design Kaalfontein\"), and it gives visitors a clear next step (call, WhatsApp, request a quote). Anything else is decoration. We design for these three things first — the rest is optional polish.",
        "Modern tech matters more than most clients realise. A website built on Next.js (or another modern framework) and deployed on fast edge hosting (Vercel, Netlify, Cloudflare) will load 3–5x faster than the same content on a typical WordPress install with plugins. That speed is a Google ranking factor (Core Web Vitals), a conversion factor (visitors leave slow sites), and a mobile data factor (visitors on prepaid data don't appreciate a 6MB homepage). Modern hosting is also significantly more secure — no plugin updates to manage, no admin panel to be hacked.",
        "DIY site builders (Wix, Squarespace, Shopify, even WordPress with Elementor) have their place — for a sole proprietor who needs a single-page site tonight, they're fine. For a small business with a real product or service to sell, they hit a ceiling: limited SEO control, slow performance, limited integrations, and a generic look that doesn't differentiate. We'll be honest when DIY is the right answer for you — and we'll quote a custom build when it isn't.",
        "Search engine optimisation (SEO) for small businesses is less mysterious than agencies make it sound. The fundamentals: clean technical setup (titles, meta descriptions, structured data, fast loading, mobile-friendly), clear content written around the actual search terms customers use, a Google Business Profile claimed and kept up to date, and a handful of genuine backlinks from local directories, suppliers and partners. We do these fundamentals properly. We don't promise #1 rankings on \"plumber Johannesburg\" — we promise a website that'search-engine-friendly, with the basics done right, that improves over time as content grows.",
        "POPIA compliance is a real consideration for South African websites that collect any personal information (which means any contact form). Contact forms need a privacy policy link, explicit consent checkboxes where personal information is collected, secure transmission (HTTPS, which is standard), secure storage of submissions, and clear data retention practices. We include these in every build — they're not optional extras, they're the baseline of a compliant SA website. We can also help with cookie banners and terms of service if your site needs them.",
      ]}
      whatWeDo={[
        {
          title: "Custom website design",
          description:
            "Bespoke design matched to your brand — not a template. You get design mockups in Figma before any code is written, and we iterate until you're happy with the look.",
        },
        {
          title: "Mobile-first responsive build",
          description:
            "Designed mobile-first (because that's how most visitors arrive), then progressively enhanced for tablet and desktop. Tested on real iPhones, Androids, and slow 3G connections.",
        },
        {
          title: "SEO optimisation",
          description:
            "Title tags, meta descriptions, structured data (Schema.org), semantic HTML, image alt text, sitemap.xml, robots.txt. On-page optimisation for the search terms your customers actually use.",
        },
        {
          title: "Speed optimisation",
          description:
            "Lighthouse score target of 90+ on Performance. Image optimisation (WebP/AVIF), lazy loading, font subsetting, minimal JavaScript, edge hosting. Every millisecond counts for SEO and conversion.",
        },
        {
          title: "Contact form + email setup",
          description:
            "POPIA-compliant contact form with consent checkbox, privacy policy link, and CAPTCHA to prevent spam. Submissions sent to your email and optionally stored in a spreadsheet or CRM for tracking.",
        },
        {
          title: "Google Business Profile setup",
          description:
            "Claiming and verifying your Google Business Profile — essential for appearing in local search and Google Maps results. Service areas, opening hours, photos, posts, and review request setup.",
        },
        {
          title: "Business email (Google Workspace / Microsoft 365)",
          description:
            "Your domain set up with professional email (you@yourbusiness.co.za instead of @gmail.com). Mailbox migration, DNS records, signature templates, calendar sharing and basic security (2FA) included.",
        },
        {
          title: "Analytics setup",
          description:
            "Google Analytics 4 (or Vercel Web Analytics for a privacy-friendly, cookie-free option) configured with the events that matter: form submissions, calls, WhatsApp clicks, directions requests.",
        },
        {
          title: "Ongoing maintenance",
          description:
            "Monthly retainers from R450 covering security updates, content updates, hosting monitoring, backups, and minor changes. Larger content additions and feature builds quoted separately.",
        },
      ]}
      whoItsFor={[
        "Small businesses that need a real web presence that generates leads",
        "Sole proprietors and freelancers who want to look more professional",
        "Professional practices (medical, legal, accounting, architecture)",
        "NGOs and NPOs needing an online presence for donors and beneficiaries",
        "Training providers and education centres with course catalogues",
        "Retailers wanting to drive foot traffic (and optionally e-commerce)",
      ]}
      process={[
        {
          step: "01",
          title: "Discovery call",
          description:
            "We meet (in person in Midrand or via Zoom) for 60–90 minutes. We discuss your business, your customers, your competitors, and your goals. You get a fixed quote and timeline at the end of the call.",
        },
        {
          step: "02",
          title: "Design mockup",
          description:
            "We design 2–3 page mockups in Figma (homepage + one interior page) showing the proposed look. You get 2 rounds of revisions included. Once approved, we move to the build phase.",
        },
        {
          step: "03",
          title: "Build & review",
          description:
            "We build the site on modern tech (Next.js + Tailwind + a CMS if you'll be editing content). You review on a staging URL, request changes, and approve before launch. Usually 1–2 weeks of build time.",
        },
        {
          step: "04",
          title: "Launch + SEO setup",
          description:
            "Domain configured, DNS switched, SSL certificate issued, sitemap submitted to Google Search Console, Google Business Profile claimed, analytics installed. 30 days post-launch support included.",
        },
      ]}
      faqs={[
        {
          question: "How long does a website take to build?",
          answer:
            "A typical 5–8 page small business website takes 2–4 weeks from discovery call to launch. Larger sites (15+ pages, custom integrations, e-commerce) take 6–10 weeks. The biggest variable is content — if you have your photos, copy, and contact details ready, we move fast. If you need help with copywriting or photography, we'll add that to the timeline upfront.",
        },
        {
          question: "What are the ongoing hosting costs?",
          answer:
            "Hosting on Vercel or Netlify is free for small business sites with modest traffic (under 100GB bandwidth a month). Domain renewal is R150–R350/year depending on the extension (.co.za, .com, .africa). Business email (Google Workspace) is $6/user/month (about R110/user/month) — Microsoft 365 is similar. We don't take a cut of any of these — you pay the providers directly.",
        },
        {
          question: "Can I update the content myself?",
          answer:
            "Yes, if you want to. We build with an optional CMS (Sanity, Payload, or a simple in-page editor) that lets you edit text, swap images, and add blog posts without touching code. The CMS adds R2,000–R4,000 to the build cost depending on complexity. Many clients opt out and just send us content updates as part of a monthly maintenance retainer — often cheaper than the CMS option for low-update sites.",
        },
        {
          question: "Mobile-first or responsive — what's the difference?",
          answer:
            "Responsive means a site adjusts to fit any screen size. Mobile-first means the site is designed for mobile first, then progressively enhanced for larger screens. Mobile-first is the modern best practice — most visitors arrive on mobile, and Google indexes mobile content first. All our builds are mobile-first responsive. There's no extra charge for this — it's the standard.",
        },
        {
          question: "Can you set up my domain and business email?",
          answer:
            "Yes. We register (or transfer) your domain (.co.za, .com, .africa), configure DNS records, set up business email on Google Workspace or Microsoft 365 (you@yourbusiness.co.za), install mailboxes on your devices, and set up basic email security (SPF, DKIM, DMARC) to prevent your emails landing in spam. Domain and email subscription costs are billed by the providers directly.",
        },
        {
          question: "Do you build e-commerce sites?",
          answer:
            "Yes — we build on Next.js Commerce, Shopify (with a custom theme), or Medusa depending on your needs. Small catalogues (under 50 products) on Next.js Commerce or Shopify; larger catalogues with complex variants on Shopify or Medusa. E-commerce projects are quoted separately from the standard small business website pricing — typically R15,000–R50,000 depending on scope.",
        },
        {
          question: "Do you offer maintenance plans?",
          answer:
            "Yes. Monthly maintenance from R450 covers security updates, hosting monitoring, daily backups, and minor content changes (a few hours of work per month). Larger changes (new pages, blog posts, feature additions) are quoted separately. Maintenance is month-to-month with 30 days' notice — no lock-in.",
        },
      ]}
      pricingGuidance="From R6,500 for a professional small business website (5–8 pages, custom design, SEO baseline, contact form, mobile-first, 30 days post-launch support). Larger sites, e-commerce, custom integrations, or web apps quoted separately based on scope. Monthly maintenance from R450. Hosting and domain fees are billed by providers (typically R150–R500/month total)."
      serviceArea="We build websites for clients across South Africa — most of our web clients are in Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein, Pretoria, and other Gauteng centres. We also build for clients in KZN, Western Cape, and other provinces — discovery calls happen on Zoom, and the build process is identical. In-person meetings available in Midrand by arrangement."
      relatedServices={[
        { slug: "graphic-design-branding", title: "Graphic Design & Branding" },
        { slug: "digital-automation", title: "Digital Automation & Business Systems" },
        { slug: "it-support-outsourcing", title: "IT Support & Outsourcing" },
      ]}
    />
  );
}
