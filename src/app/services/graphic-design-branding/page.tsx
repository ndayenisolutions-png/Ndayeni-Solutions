import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Graphic Design & Branding",
  description:
    "Logos, brand systems and marketing materials that hold together across every touchpoint. Brand books, business cards, flyers, social media templates and signage concepts from R2,500.",
  alternates: { canonical: "/services/graphic-design-branding" },
};

export default function GraphicDesignBrandingPage() {
  return (
    <ServicePageTemplate
      slug="graphic-design-branding"
      title="Graphic Design & Branding"
      shortTitle="Design & Branding"
      tagline="Brands that hold together across every touchpoint."
      description="A brand is a system — not just a logo. We design identities that work across business cards, signage, social media, vehicles and the web, with a brand book that keeps everything consistent as your team and contractors use it."
      heroImage="/section-images/graphicdesign.jpg"
      icon="palette"
      accentColor="brand"
      longDescription={[
        "A logo is not a brand. A brand is the whole system — the logo, the colour palette, the typography, the voice, the photography style, and the rules for how all of it gets applied across every touchpoint. A logo on its own is a picture; a brand system is what makes that picture recognisable on a business card, a delivery van, a WhatsApp profile, and a billboard. We design systems, not just logos.",
        "Brand consistency is the actual ROI of professional branding. A small business with a consistent visual identity — same colours across the website, social media, signage and printed collateral — looks bigger, more established and more trustworthy than a business with a logo and ad-hoc flyers designed by three different people. Customers don't consciously notice consistency, but they unconsciously register professionalism. That registration translates into price tolerance, lead conversion, and repeat business.",
        "A brand book (or brand guidelines document) is the deliverable that keeps the system working after we hand over. It documents the logo (with clear space rules and what not to do), the colour palette (with hex, RGB and CMYK values), the typography (primary and secondary typefaces, with hierarchy), the photography style (with example shots and direction), the voice (with dos and don'ts), and the application rules for major touchpoints (business card, email signature, social media post, signage, vehicle). Anyone you hire next — designer, signwriter, printer, web developer — can produce on-brand work from this document.",
        "Brand books matter more for small businesses than for corporates, paradoxically. A corporate has an in-house design team keeping things consistent; a small business has a series of contractors over time — the original designer, the signwriter who did the wall, the printer who did the flyers, the social media manager, the next designer — and without a documented system, each one freelances. Three years in, the brand looks like three different companies. A brand book prevents that drift for the cost of one well-scoped project at the start.",
        "We work in Adobe Illustrator and Figma — vector-first, which means everything we deliver scales from a favicon (16 pixels) to a billboard (16 metres) without quality loss. You get the source files (AI, SVG, EPS) plus export-ready versions (PNG, JPG, PDF) for every common use case. We license fonts properly and document the licensing so you know what you can use the typefaces for (some are free for commercial use, some require paid licences — we'll be clear about which is which).",
      ]}
      whatWeDo={[
        {
          title: "Logo design",
          description:
            "3 concept directions in the first round, refined down to a final logo with primary, secondary and icon variants. Delivered in AI, SVG, PNG, and PDF — sized for every use case from favicons to signage.",
        },
        {
          title: "Brand system design (palette, type, voice)",
          description:
            "Colour palette with hex/RGB/CMYK values, typography system (heading + body + accent), brand voice (formal vs. casual, key phrases, words to avoid). The full system, not just a logo.",
        },
        {
          title: "Business cards & stationery",
          description:
            "Business cards, letterheads, email signatures, invoices and quote templates. Print-ready PDFs supplied to your printer of choice (we recommend and work with several good SA printers).",
        },
        {
          title: "Flyer & brochure design",
          description:
            "Marketing materials — flyers, brochures, posters, price lists, product catalogues. Designed to print standards (proper bleeds, CMYK, fonts embedded) and supplied as press-ready PDFs.",
        },
        {
          title: "Social media templates",
          description:
            "Editable templates for Facebook, Instagram, WhatsApp Status, LinkedIn — so your social media manager (or you) can produce on-brand posts without needing a designer for every single one.",
        },
        {
          title: "Brand guidelines document",
          description:
            "A PDF brand book documenting the logo usage, palette, typography, voice, and application rules. Hands-off document — anyone you hire next can produce on-brand work from this.",
        },
        {
          title: "Signage & vehicle branding concepts",
          description:
            "Concepts for reception signage, pavement signs, shopfront signs, vehicle wraps and branding. We design the concepts and visuals; installation is quoted separately with a partner signwriter.",
        },
        {
          title: "Print management",
          description:
            "We brief the printer, check the proofs, and arrange delivery. Proper print management prevents the most common expensive mistakes — RGB artwork sent to a CMYK press, missing bleeds, unoutlined fonts, low-resolution images.",
        },
      ]}
      whoItsFor={[
        "New businesses needing a complete identity from scratch",
        "Existing businesses refreshing an outdated or inconsistent brand",
        "Sole proprietors who want to look more established than their first logo suggests",
        "NGOs and NPOs that need a recognisable identity for donors and beneficiaries",
        "Events, conferences and short-term initiatives needing branded collateral",
      ]}
      process={[
        {
          step: "01",
          title: "Brand discovery",
          description:
            "We meet to discuss your business, your customers, your competitors, and your positioning. We agree on three descriptive words that define the brand personality (e.g. \"professional, warm, locally-rooted\" or \"modern, bold, no-nonsense\").",
        },
        {
          step: "02",
          title: "Concept directions",
          description:
            "We design 3 different concept directions — genuinely different, not variations of one idea. You pick a direction (or merge elements from two). This round usually lands on the final direction; sometimes we rework once.",
        },
        {
          step: "03",
          title: "Refinement",
          description:
            "Two rounds of refinement on the chosen direction. Logo finalised, colour palette locked, typography chosen, supporting elements designed. You get to see the system applied to a business card and a social post.",
        },
        {
          step: "04",
          title: "Final assets + brand book",
          description:
            "We deliver all source files, export-ready files for every common use case, and the brand book PDF. A 30-minute walkthrough call explains the system and how to use the files. 30 days of minor adjustments included.",
        },
      ]}
      faqs={[
        {
          question: "How long does branding take?",
          answer:
            "A full brand system takes 2–4 weeks from discovery to final delivery, depending on how quickly you can give feedback and how many rounds of refinement you want. A logo-only project (no full system, no brand book) can be turned around in 5–8 working days. Rush turnaround available at a 25% premium for genuine deadline-driven projects (event launches, business card reprints).",
        },
        {
          question: "What files do I get?",
          answer:
            "You get: AI and EPS source files (editable in Adobe Illustrator), SVG (web), PNG (transparent background, multiple sizes), JPG (with background, multiple sizes), and PDF (print-ready). For the brand system, you also get a brand guidelines PDF and editable Figma templates for social media. We don't hold files hostage — you own everything we deliver.",
        },
        {
          question: "What about font licensing?",
          answer:
            "Some fonts are free for commercial use (Google Fonts, SIL Open License); others require paid licenses (via MyFonts, Fontspring, or the foundry directly). We use free-for-commercial fonts as the default, and recommend paid fonts only when the free alternatives won't do the job. If we recommend a paid font, we'll tell you the cost upfront — you pay the foundry directly, not us.",
        },
        {
          question: "Can I use the logo on signage and a vehicle wrap?",
          answer:
            "Yes — the source files we deliver are vector (AI, EPS, SVG) which scale to any size without quality loss. The brand book documents the clear space and colour rules for large-format applications. For the actual signage or vehicle wrap installation, we recommend a partner signwriter — we brief them with the design files and check the production proofs to make sure the colours and layout match.",
        },
        {
          question: "Do you offer ongoing design support?",
          answer:
            "Yes — many clients retain us for ongoing design work (monthly social media graphics, campaign flyers, seasonal signage, event collateral). Retainers from R1,500/month for a defined scope of hours. Ad-hoc design work (no retainer) is billed at R350/hour with a 1-hour minimum. All ongoing work uses the brand system we built — so it stays consistent.",
        },
        {
          question: "Can you rebrand without disrupting my current business?",
          answer:
            "Yes — we manage the transition. We design the new brand system, then phase the rollout: digital channels first (website, social media, email signature — quick to change), then printed collateral (business cards, brochures — use up existing stock first), then physical signage (last and most expensive). A typical phased rebrand takes 3–6 months end-to-end with minimal business disruption.",
        },
      ]}
      pricingGuidance="Logo design from R2,500 (3 concepts, refinement, final files). Full brand system from R6,500 (logo + palette + typography + voice + social templates + brand book PDF). Print assets quoted per item (business cards from R1,200 for design + print management; flyers from R850 for design). Vehicle and signage concepts from R2,500 — installation quoted separately by partner signwriters."
      serviceArea="Based in Midrand, we work with branding clients across South Africa. Most in-person meetings happen in Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein and Pretoria. For clients outside Gauteng, the entire process (discovery, concept presentation, refinement, delivery) is run on Zoom — the deliverables are identical."
      relatedServices={[
        { slug: "web-design", title: "Web Design & Digital Presence" },
        { slug: "digital-automation", title: "Digital Automation & Business Systems" },
        { slug: "digital-skills-training", title: "Digital Skills Training" },
      ]}
    />
  );
}
