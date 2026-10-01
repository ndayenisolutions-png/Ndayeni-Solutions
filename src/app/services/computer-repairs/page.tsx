import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Computer Repairs & Hardware",
  description:
    "Fast, honest laptop and desktop repairs in Midrand. Screens, keyboards, batteries, SSD upgrades, OS reinstalls, virus removal and data recovery. Quote before we fix, no surprise charges.",
  alternates: { canonical: "/services/computer-repairs" },
};

export default function ComputerRepairsPage() {
  return (
    <ServicePageTemplate
      slug="computer-repairs"
      title="Computer Repairs & Hardware"
      shortTitle="Computer Repairs"
      tagline="Fast, honest computer repairs — quote before we fix, no surprises."
      description="Laptop, desktop and peripheral repairs done right — honest diagnosis, written quote before any work begins, and your data treated as the most valuable thing in the device. Most repairs are completed within 1–3 business days."
      heroImage="/section-images/repairs.jpg"
      icon="monitor"
      accentColor="accent"
      longDescription={[
        "A broken computer is rarely just a broken computer — it's weeks of work, family photos, accounting files and contact lists held hostage by a faulty screen or dead hard drive. We treat data recovery as the first priority of every repair. Before any hardware is replaced or any OS is reinstalled, we attempt a backup of your important files and confirm with you what's at stake.",
        "We are brand-agnostic. We repair Dell, HP, Lenovo, Acer, Asus, MSI, Microsoft Surface, Apple MacBook, and the long tail of less-common brands. We also work on custom-built desktops and whitebox workstations. There is no brand restriction and no \"we don't touch that one\" — if the parts are available in South Africa (or we can order them), we'll fix it.",
        "Common repairs we handle weekly: cracked laptop screens and broken hinges, non-responsive keyboards (water damage and worn-out membranes), swollen and dead batteries, lost or broken chargers, mechanical hard drives failing or upgrading to SSD, RAM upgrades on slow machines, Windows reinstallation after a particularly nasty virus, blue-screen-of-life diagnosis, and best-effort data recovery from drives the operating system can no longer read.",
        "Honest diagnosis is our defining difference. When you drop off a machine, we charge a flat R150 diagnostic fee — and that fee is fully credited toward the repair if you proceed. You'll get a written quote before we touch anything beyond the diagnostic, and a phone call to walk through what we found. If a repair isn't economical (e.g. a R3,500 screen on a R2,500 second-hand laptop), we'll tell you that honestly and suggest alternatives — including quoting a replacement machine if that's the better call.",
        "Parts sourcing in South Africa can take anywhere from same-day (common SSDs, RAM, screens for popular Dell/Lenovo models) to two weeks (specialist parts, ordered from overseas suppliers). We'll give you an estimated turnaround at the time of quote and keep you updated if anything changes. We don't promise what we can't deliver — and we don't charge for the diagnostic if we miss our own deadline.",
      ]}
      whatWeDo={[
        {
          title: "Laptop & desktop diagnostics",
          description:
            "Full hardware and software diagnostic. We identify the actual fault — not the symptom — and explain it in plain English. R150, credited to any repair you approve.",
        },
        {
          title: "Screen & keyboard replacement",
          description:
            "Cracked screens, flickering displays, dead pixels, broken hinges, worn-out keyboards and trackpads. OEM and quality aftermarket parts, depending on your budget.",
        },
        {
          title: "Battery & charger replacement",
          description:
            "Swollen MacBook batteries, dead laptop batteries, lost or broken chargers. We use genuine or certified-equivalent parts and recycle the old battery responsibly.",
        },
        {
          title: "Storage upgrades (HDD to SSD)",
          description:
            "The single biggest speed upgrade you can do for an older machine. We clone your existing drive across so Windows, programs and files all come across unchanged.",
        },
        {
          title: "RAM upgrades",
          description:
            "More memory means more browser tabs and bigger Excel files without slowdown. We check compatibility before ordering — not all laptops can be upgraded.",
        },
        {
          title: "OS reinstall & optimisation",
          description:
            "When a Windows install is beyond saving — slow, virus-ridden, or corrupted — a clean reinstall is often faster and cheaper than hours of troubleshooting. We back up your data first.",
        },
        {
          title: "Virus & malware removal",
          description:
            "Browser hijacks, popup storms, ransomware, cryptominers, and the trojans that hide in free software downloads. We clean, patch, and install proper AV to prevent recurrence.",
        },
        {
          title: "Data recovery (best-effort)",
          description:
            "When a drive is failing or accidentally formatted, we attempt recovery using specialist tools. Best-effort means we charge only if we recover your data — no recovery, no fee for the attempt.",
        },
        {
          title: "Custom PC builds",
          description:
            "Gaming rigs, work-from-home office PCs, video editing workstations. You give us a budget and use-case, we spec the parts, build it, install Windows, and stress-test before handover.",
        },
      ]}
      whoItsFor={[
        "Home users with a sick laptop or desktop",
        "Students whose machines died the week before a deadline",
        "Small business owners running on ageing hardware",
        "Freelancers and remote workers whose computer is their entire office",
      ]}
      process={[
        {
          step: "01",
          title: "Drop-off or on-site visit",
          description:
            "Bring the device to our Kaalfontein workshop in Midrand, or arrange an on-site visit for desktops that are hard to move. We log the device, confirm contact details, and what's at stake.",
        },
        {
          step: "02",
          title: "Free diagnosis + quote",
          description:
            "We run a full diagnostic — usually same day or next morning. You get a phone call and a written quote explaining what's wrong, what it'll cost, and how long it'll take.",
        },
        {
          step: "03",
          title: "You approve",
          description:
            "No work happens beyond the diagnostic until you say go. If the repair isn't economical, we'll tell you. If parts need to be ordered, we'll confirm the timeline before placing the order.",
        },
        {
          step: "04",
          title: "We fix & test",
          description:
            "Repair completed, device stress-tested, and a final clean-up of the OS done before handover. You get the device back with a summary of what was done and a 90-day workmanship warranty.",
        },
      ]}
      faqs={[
        {
          question: "How long do repairs take?",
          answer:
            "Most software repairs (virus removal, OS reinstall, optimisation) are completed same-day or next-day. Common hardware repairs (SSD, RAM, screen on popular models) take 1–3 business days. Specialist parts ordered from overseas can take 1–2 weeks — we'll quote an honest timeline upfront and update you if it slips.",
        },
        {
          question: "Is there a warranty on your work?",
          answer:
            "All repairs carry a 90-day workmanship warranty — if the same fault recurs within 90 days, we fix it free. Parts carry the manufacturer's warranty (usually 1–3 years for SSDs, RAM and screens). Batteries carry 6 months. We don't warranty against new damage (drops, spills, lightning) after the repair is handed over.",
        },
        {
          question: "Will you back up my data before repairing?",
          answer:
            "Yes — for any repair that touches the storage drive (OS reinstall, drive replacement, virus removal), we back up your user data first (Documents, Desktop, Downloads, Pictures, browser bookmarks). We confirm with you what to back up before starting. The backup is held securely during the repair and deleted after handover, unless you ask us to keep it.",
        },
        {
          question: "Do you work on all brands?",
          answer:
            "Yes. We repair Dell, HP, Lenovo, Acer, Asus, MSI, Microsoft Surface, Apple MacBook and most other brands. There's no brand restriction — if the parts are available in South Africa or orderable, we'll fix it. For older or very low-end machines, we'll be honest if the repair cost exceeds the machine's value.",
        },
        {
          question: "Can you fix water-damaged laptops?",
          answer:
            "Often yes, not always. We do an ultrasonic clean of the affected board, dry it properly, and assess component-level damage. Some water-damaged machines are write-offs (especially if the spill happened while the laptop was on and shorted the CPU); others recover fully. We'll give you an honest assessment after the diagnostic and a quote before any board-level work.",
        },
        {
          question: "Can you recover data from a dead hard drive?",
          answer:
            "For drives that are still spinning but unreadable (corrupted file system, bad sectors, accidentally formatted), yes — we use specialist recovery tools and have a good success rate. For drives that have failed mechanically (clicking, not spinning, burned controller board), we partner with a clean-room recovery lab and broker the recovery on your behalf. Best-effort pricing means no charge if no data is recovered.",
        },
      ]}
      pricingGuidance="Diagnostic: R150 (waived if you proceed with the repair). Most repairs land between R350 (small software fixes, RAM installs) and R1,500 (SSD upgrade + OS reinstall, screen on popular models). Specialist repairs and MacBook board-level work quoted per case. A written quote is always provided before any work begins — no surprise invoices."
      serviceArea="Drop off at our workshop in Kaalfontein, Midrand, or arrange an on-site visit for desktops and iMacs that aren't easily moved. We service clients across Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein and Pretoria. For repeat commercial clients we offer a free pickup-and-drop-off service within 15km of Midrand."
      relatedServices={[
        { slug: "it-support-outsourcing", title: "IT Support & Outsourcing" },
        { slug: "networking-wifi", title: "Networking & Wi-Fi" },
        { slug: "printer-office-technology", title: "Printer & Office Technology" },
      ]}
    />
  );
}
