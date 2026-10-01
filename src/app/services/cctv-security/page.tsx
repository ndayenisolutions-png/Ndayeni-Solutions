import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "CCTV & Security Camera Installation",
  description:
    "Professional CCTV installation for homes and businesses in Midrand and Gauteng. 4K NVR systems, night vision, motion detection and mobile remote viewing. 4-camera systems from R8,500.",
  alternates: { canonical: "/services/cctv-security" },
};

export default function CCTVSecurityPage() {
  return (
    <ServicePageTemplate
      slug="cctv-security"
      title="CCTV & Security Technology"
      shortTitle="CCTV & Security"
      tagline="See what matters. Deter what doesn't. Professional CCTV installation."
      description="Professionally installed CCTV systems with 4K cameras, night vision, motion detection and mobile remote viewing. We design the camera layout around your actual risks — not just the easiest places to mount a camera."
      heroImage="/section-images/cctv.jpg"
      icon="cctv"
      accentColor="brand"
      longDescription={[
        "In South Africa, CCTV is no longer a nice-to-have — for most homeowners and small businesses, it's a basic layer of security alongside burglar bars, an alarm system and good lighting. The visible presence of cameras is itself a deterrent; the recorded footage is what you fall back on when a break-in, theft, dispute or incident occurs. Without footage, you're left with hearsay and insurance forms — with footage, you have evidence the SAPS can actually use and your insurer will accept.",
        "A modern system includes three core components: cameras (4K is now standard for any new install), an NVR (Network Video Recorder) that stores the footage for 14–30 days, and a mobile app that lets you view live footage and receive motion alerts from anywhere. Indoor cameras tend to be dome-style and discreet; outdoor cameras are bullet-style and weatherproof. Both support night vision — infrared for low-light, and full-colour with auxiliary lighting for darker areas like back gardens.",
        "Camera placement strategy is what separates a useful system from a useless one. The mistake most DIY installs make is mounting cameras too high (you get a clear view of the top of intruders' heads but no faces), too far from the action (footage is too grainy to identify anyone), or covering the wrong area entirely (the camera watches the front gate but the actual break-in happens over the back wall). We do a proper risk assessment first — where are the entry points, where does foot traffic naturally flow, where are the dark corners — and place cameras to capture faces at choke points and overall scenes at overview points.",
        "Privacy matters even on your own property. Under South African law and the POPI Act, you can't record audio without consent, and you can't point cameras at neighbours' private spaces (their yard, their windows, their bathrooms). We work within these constraints — using privacy masking on cameras that might pick up neighbours' properties, disabling audio recording (or warning visitors with clear signage), and discussing the placement with neighbours where a camera's field of view is borderline. Most neighbour disputes about CCTV come from poor placement, not malice.",
        "Footage storage and access are the final pieces. We recommend NVRs with at least 14 days of continuous recording (30 days if your budget allows), backed up off-site to a NAS or cloud for high-value installations. The mobile app gets set up on your phone and one or two trusted contacts' phones — usually a partner or family member — so someone can review footage even if you're travelling. We train you on how to export a clip for SAPS or insurance, and how to navigate the timeline quickly.",
      ]}
      whatWeDo={[
        {
          title: "Site survey & risk assessment",
          description:
            "We walk your premises, identify entry points and blind spots, and produce a camera placement plan that prioritises faces at choke points and overview coverage. Free with any install.",
        },
        {
          title: "4K camera system design",
          description:
            "Hikvision, Dahua, UniFi or Ezviz — matched to your budget and risk profile. 4K is now standard on new installs; 2MP only for overview cameras where identification isn't the goal.",
        },
        {
          title: "NVR setup & configuration",
          description:
            "16–30 day recording loops, motion-optimised recording for longer retention, scheduled recording for business hours, and secure admin credentials. Set up to your specific requirements.",
        },
        {
          title: "Indoor & outdoor camera install",
          description:
            "Dome cameras indoors (discreet, wide-angle). Bullet cameras outdoors (weatherproof IP66+, night vision range matched to the area). PoE (Power over Ethernet) so no separate power supply per camera.",
        },
        {
          title: "Night vision & motion detection",
          description:
            "Infrared night vision for low-light areas. Motion detection zones configured to ignore trees and passing traffic — only the alerts that actually matter hit your phone.",
        },
        {
          title: "Mobile app remote viewing",
          description:
            "Hik-Connect, Dahua DMSS, UniFi Protect, or Ezviz app configured on your phone. Live view, motion alerts with snapshot, two-way audio on supported cameras, and remote playback of recorded footage.",
        },
        {
          title: "Off-site backup of footage",
          description:
            "For high-risk installations, automatic upload of motion-triggered clips to a cloud bucket or local NAS. If the NVR is stolen, you still have the critical footage.",
        },
        {
          title: "Ongoing maintenance",
          description:
            "Annual service: lens cleaning, firmware updates, NVR storage health check, motion zone re-tuning, camera angle re-alignment. From R650 per service visit for installed systems.",
        },
      ]}
      whoItsFor={[
        "Homeowners wanting visible deterrence and post-incident footage",
        "Retailers concerned about shrinkage, till disputes and customer claims",
        "Offices needing perimeter coverage and after-hours monitoring",
        "Restaurants, guest houses and hotels with multiple access points",
        "Warehouses, workshops and yard-based businesses",
        "Schools and crèches with student safety and access control obligations",
      ]}
      process={[
        {
          step: "01",
          title: "Site survey",
          description:
            "We walk the property with you, identify entry points, blind spots, and risk zones. We sketch a camera placement plan and recommend equipment. Free with any install — no obligation.",
        },
        {
          step: "02",
          title: "System design & quote",
          description:
            "Based on the survey, we send a written quote with camera model, NVR spec, storage capacity, and total installed cost. Equipment is ordered on your approval — typically 2–3 day lead time.",
        },
        {
          step: "03",
          title: "Installation & cabling",
          description:
            "Cable runs first (Cat6 to each camera, PoE so no separate power needed). Cameras mounted and aligned. NVR installed in a secure location — usually a ceiling cavity, cupboard, or locked comms cabinet for businesses.",
        },
        {
          step: "04",
          title: "App setup & training",
          description:
            "Mobile app configured on your phone and trusted contacts' phones. Motion alert zones tuned to ignore traffic and trees. We train you on live view, alert response, exporting clips, and basic troubleshooting.",
        },
      ]}
      faqs={[
        {
          question: "How many cameras do I need?",
          answer:
            "For a typical free-standing house in Midrand, 4 cameras (front gate, front door, back door, driveway) covers the major entry points. For larger properties or businesses, 6–8 cameras usually provide full coverage with some redundancy. We don't oversell cameras — the survey will recommend the minimum useful set first, and we'll discuss the trade-off between full coverage and budget honestly.",
        },
        {
          question: "Indoor or outdoor cameras — which do I need?",
          answer:
            "Most homes and businesses benefit from a mix. Outdoor cameras cover entry points and perimeter; indoor cameras cover high-value areas (safe room, till point, server room, reception). Outdoor cameras are weatherproof (IP66 or better) and have stronger night vision. Indoor cameras are typically dome-style, more discreet, and may have audio (note POPIA requires consent for audio recording in business settings).",
        },
        {
          question: "How long is footage recorded for?",
          answer:
            "Default is 14 days of continuous recording on a 4-camera 4K system with a 4TB NVR. 30 days requires an 8TB NVR (about R1,500 more). With motion-optimised recording (continuous loop but only stores motion events at full quality, idle time at lower quality), you can extend retention by 2–3x. For businesses with insurance or compliance requirements, we'll spec the storage to meet the regulatory retention period.",
        },
        {
          question: "Will the cameras use a lot of mobile data?",
          answer:
            "No — the cameras stream over your Wi-Fi/network to the NVR. Mobile data is only used when you open the app to view remotely, or when a motion alert pushes a snapshot to your phone. A typical motion alert snapshot is 50–100KB; a minute of remote live view uses about 15MB on 4K. We can configure the app to only use cellular when you tap a button (Wi-Fi only by default) to keep data use minimal.",
        },
        {
          question: "Can neighbours complain about my cameras?",
          answer:
            "Yes, and the POPI Act gives them some grounds if your cameras capture their private spaces. The right approach is to privacy-mask any camera that might pick up a neighbour's yard, doors or windows, install clear signage indicating CCTV is in operation, and discuss placement with neighbours where a camera's field of view is borderline. Most CCTV disputes are about placement, not surveillance — we'll place cameras to look at your property, not theirs.",
        },
        {
          question: "Does CCTV actually deter crime?",
          answer:
            "Visible cameras reduce opportunistic crime significantly — most break-ins are opportunistic and cameras are a strong signal that the property is monitored. For determined, planned attacks, cameras are more valuable as evidence than deterrent — footage of faces, vehicle number plates and entry methods gives the SAPS something to work with. The combination of visible cameras, alarm system, and physical security (bars, gates, beams) is more effective than any single measure alone.",
        },
        {
          question: "What are my privacy obligations if I record customers?",
          answer:
            "Under the POPI Act, businesses recording customers on premises must display clear CCTV signage at entrances, restrict access to footage to authorised staff, retain footage only as long as needed (usually 30 days unless an incident extends that), and not record audio without consent. For medical rooms, legal practices and other sensitive environments, additional restrictions apply. We'll brief you on the basics during the install and recommend a quick POPIA review if you're unsure of your obligations.",
        },
      ]}
      pricingGuidance="4-camera 4K system with NVR, installed and configured: from R8,500 (basic PoE system, 4TB NVR, mobile app). 8-camera system from R14,000 (better night vision, motion zones tuned, off-site backup option). Larger commercial systems (16+ cameras, central management) quoted per project after the free site survey. Annual maintenance from R650 per service visit."
      serviceArea="Based in Midrand, we install CCTV across greater Gauteng. Most installs happen in Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein and Pretoria. For larger commercial installations outside Gauteng, we travel — travel costs quoted upfront. Site surveys in the Midrand area are free; outside the area, a small callout fee applies (credited to any install)."
      relatedServices={[
        { slug: "networking-wifi", title: "Networking & Wi-Fi" },
        { slug: "it-support-outsourcing", title: "IT Support & Outsourcing" },
        { slug: "computer-repairs", title: "Computer Repairs & Hardware" },
      ]}
    />
  );
}
