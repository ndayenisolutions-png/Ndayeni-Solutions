import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Printer & Office Technology Setup",
  description:
    "Printer supply, setup, network configuration and maintenance for small offices, medical rooms, schools and restaurants in Midrand and across Gauteng. Setup from R1,500, maintenance from R450/month.",
  alternates: { canonical: "/services/printer-office-technology" },
};

export default function PrinterOfficeTechnologyPage() {
  return (
    <ServicePageTemplate
      slug="printer-office-technology"
      title="Printer & Office Technology"
      shortTitle="Printer & Office Tech"
      tagline="Printers, scanners, copiers — the office tech that keeps the workspace moving."
      description="Office tech shouldn't be a daily frustration. We help you choose the right printer for your volume, set it up properly on the network, integrate it with scanning workflows and software, and keep it running with scheduled maintenance — and we're on call when it jams at the worst possible moment."
      heroImage="/section-images/printer.jpg"
      icon="printer"
      accentColor="accent"
      longDescription={[
        "Choosing a printer starts with two honest questions: how much do you print, and what do you print? A home office printing 20 pages a week is best served by a R1,500 inkjet; a legal practice printing 1,000 pages a week of contracts and court documents is throwing money away on anything but a laser multifunction. The mistake we see most often is businesses buying on sticker price and paying for it later in cartridges that run out every fortnight at R600 a pop.",
        "Inkjet, laser, and thermal are the three printing technologies that cover most office needs. Inkjet is cheap to buy (R800–R2,500), good for colour and photos, but expensive per page and the cartridges dry out if not used regularly. Laser is more expensive to buy (R3,500–R12,000 for a multifunction) but dramatically cheaper per page (mono laser at 5–8c/page vs inkjet at 25–40c/page), and the toner doesn't dry out. Thermal is for receipts — kitchen printers in restaurants, POS receipt printers in shops, and patient-label printers in medical rooms.",
        "Multifunction (print + scan + copy + fax) is the right call for most small offices — the scan function alone justifies the price difference, especially for paperless workflows, document archiving, and submitting scanned forms to SARS, medical aids, and clients. A dedicated single-function printer only makes sense for high-volume single-use cases (e.g. a print room printing 5,000 invoices a month, or a colour-proofing studio where the printer needs to be a different model from the scanner).",
        "Network printer setup is where most installs go wrong. USB-connected to one PC, then 'shared' to other PCs through Windows — this works until the host PC is off, asleep, or someone takes it home, and the whole office can't print. Proper network installation puts the printer on the office network (Wi-Fi or cabled) with a static IP, every computer configured to print directly to it, and mobile printing enabled (AirPrint for Macs and iPhones, Mopria for Android). This is what we install — and it stays working.",
        "Scanning workflows are often the hidden value. A printer that scans to a shared folder, to email, to a Google Drive, or directly into your practice management software saves hours a week. We've set up medical practices where patient records scan directly into GoodX or Practiveye, legal practices where signed contracts scan to a matter folder, and restaurants where supplier invoices scan to a shared cloud folder the bookkeeper accesses remotely. The right scan workflow is often the difference between a printer that earns its keep and one that's just a printer.",
      ]}
      whatWeDo={[
        {
          title: "Printer recommendation & supply",
          description:
            "Based on your volume and use-case, we recommend 2–3 printer models across price tiers. We supply HP, Brother, Canon, Epson, Xerox and Samsung — sourced from South African distributors with full local warranty.",
        },
        {
          title: "Wireless & network printer setup",
          description:
            "Printer on the office Wi-Fi or cabled with a static IP. Every PC and Mac configured to print directly to it (no USB sharing). AirPrint and Mopria enabled for mobile printing.",
        },
        {
          title: "Scanner configuration",
          description:
            "Scan-to-email, scan-to-folder, scan-to-USB, scan-to-cloud (Google Drive, OneDrive, Dropbox). Scan-to-application workflows for medical, legal and accounting software.",
        },
        {
          title: "Driver installation",
          description:
            "Manufacturer drivers installed on every workstation, properly versioned. Old drivers cleaned up. Print spooler issues diagnosed and fixed. We document the driver version on each PC for future reference.",
        },
        {
          title: "Print server setup",
          description:
            "For larger offices (10+ users or 2+ printers), a print server centralises print queues, audit logging, and user permissions. Lower admin overhead and better visibility into print costs.",
        },
        {
          title: "Toner & ink supply management",
          description:
            "For retainer clients, we monitor toner levels remotely and proactively order replacements before they run out. OEM and quality compatible toners available — cost per page often halves with the right compatible toner.",
        },
        {
          title: "Repair & maintenance",
          description:
            "Paper jams, streaky output, error codes, fuser failures, drum replacements, scanner ADF jams — we fix them. Routine maintenance (cleaning, drum and fuser service) on a 6-monthly schedule prevents most emergency callouts.",
        },
        {
          title: "Print workflow automation",
          description:
            "Scan-to-email distribution lists, scan-to-shared-folder with auto-naming, batch scan workflows, automatic PDF conversion with OCR, print-to-PDF virtual printers. Reduce manual document handling time by hours a week.",
        },
      ]}
      whoItsFor={[
        "Small offices (5–25 people) without an in-house IT person to manage printers",
        "Legal practices with high-volume document printing and archiving needs",
        "Medical rooms with patient-label and prescription printing requirements",
        "Schools with admin printing and exam paper requirements",
        "Restaurants with kitchen receipt printers (POS-driven thermal printers)",
        "Home offices wanting reliable printing without the hassle of DIY setup",
      ]}
      process={[
        {
          step: "01",
          title: "Needs assessment",
          description:
            "We ask about your volume, what you print (colour or mono, documents or photos, receipts or labels), how many users, and any scan workflow needs. We look at your current pain points — paper jams, slow printing, expensive cartridges, scan bottlenecks.",
        },
        {
          step: "02",
          title: "Equipment recommendation",
          description:
            "Based on the assessment, we recommend 2–3 models across price tiers with a clear breakdown of purchase price vs cost-per-page over 12 months. We supply on your approval — usually 2–3 day lead time.",
        },
        {
          step: "03",
          title: "Setup & configuration",
          description:
            "Printer unboxed, network-configured (Wi-Fi or cabled), drivers installed on every workstation, scan-to-email and scan-to-folder set up, mobile printing enabled. Usually completed same-day for offices, 1–2 hours per printer.",
        },
        {
          step: "04",
          title: "Training & support",
          description:
            "We walk your team through how to print, scan (including the scan-to-email workflow), load paper, replace toner, and clear the most common paper jams. Documentation left behind. 30 days post-installation support included.",
        },
      ]}
      faqs={[
        {
          question: "Should I buy laser or inkjet?",
          answer:
            "If you print regularly (more than 50 pages a week) and mostly black text, buy a mono laser. It's more expensive to buy (R3,500–R5,000 for a multifunction) but the toner lasts thousands of pages and doesn't dry out. If you print colour (flyers, brochures, photos) or only print occasionally (less than 20 pages a week), an inkjet is fine and cheaper to buy. We can run the maths for your specific case during the needs assessment.",
        },
        {
          question: "What's the real cost per page?",
          answer:
            "Mono laser: 5–8 cents per page (toner + drum amortised). Colour laser: 15–25 cents per page. Inkjet (genuine cartridges): 25–40 cents per page. Inkjet (third-party inks): 8–15 cents per page — but you may void your warranty and quality can suffer. We track cost-per-page for retainer clients and flag when a printer's economics no longer make sense.",
        },
        {
          question: "Network or USB printer?",
          answer:
            "Network (Wi-Fi or cabled) is almost always the right answer for any office with more than one user. USB sharing through one PC is fragile — if that PC is off or asleep, nobody can print. Network installation lets every device (PCs, Macs, phones, tablets) print directly to the printer, doesn't depend on any single computer, and supports mobile printing (AirPrint, Mopria).",
        },
        {
          question: "Can you set up scanning to email?",
          answer:
            "Yes — scan-to-email is one of the most common workflows we set up. We configure the printer's address book with recipients, set up SMTP relay through your email provider (Google, Microsoft 365, or local ISP), and configure scan-to-shared-folder for archiving. We also configure scan-to-cloud (Google Drive, OneDrive) for paperless workflows.",
        },
        {
          question: "Does mobile printing work?",
          answer:
            "Yes, when properly configured. AirPrint lets iPhones and iPads print directly from any app (no driver install needed). Mopria does the same for Android. For older printers that don't natively support these, we install a small print server (or use an existing office PC) that bridges mobile devices to the printer. Most modern network printers support both AirPrint and Mopria out of the box — we just enable and test them.",
        },
        {
          question: "Do you offer maintenance contracts?",
          answer:
            "Yes — from R450/month for a single printer covering routine maintenance (6-monthly service, drum and fuser cleaning, paper path cleaning) and discounted callout rates for emergency breakdowns. Toner and consumables are extra. Contracts are month-to-month and cancelable with 30 days' notice. Most clients only take a contract after the first emergency callout bill — the contract typically pays for itself within 6 months for high-volume printers.",
        },
      ]}
      pricingGuidance="From R1,500 for printer setup & configuration on a single printer (network install, drivers on all workstations, scan-to-email, mobile printing). Equipment supply quoted separately — we don't markup printers, you pay what we pay. Maintenance contracts from R450/month per printer covering routine service and discounted callouts. Per-incident repairs from R450 + parts."
      serviceArea="Based in Midrand, we supply, install and maintain office technology across greater Gauteng. Most installs and service visits happen in Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein and Pretoria. For clients outside Gauteng, equipment can be couriered with remote setup support; on-site visits by arrangement."
      relatedServices={[
        { slug: "it-support-outsourcing", title: "IT Support & Outsourcing" },
        { slug: "computer-repairs", title: "Computer Repairs & Hardware" },
        { slug: "networking-wifi", title: "Networking & Wi-Fi" },
      ]}
    />
  );
}
