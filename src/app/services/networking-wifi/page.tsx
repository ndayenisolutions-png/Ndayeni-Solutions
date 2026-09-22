import type { Metadata } from "next";
import ServicePageTemplate from "@/components/academy/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Networking & Wi-Fi Installation",
  description:
    "Wi-Fi that reaches every corner. Cat6 cabling, mesh systems, managed switches and access points for homes and businesses in Midrand, Centurion, Sandton and across Gauteng.",
  alternates: { canonical: "/services/networking-wifi" },
};

export default function NetworkingWifiPage() {
  return (
    <ServicePageTemplate
      slug="networking-wifi"
      title="Networking & Wi-Fi"
      shortTitle="Networking & Wi-Fi"
      tagline="Wi-Fi that reaches every corner. Networks that don't quit."
      description="From a single-router Wi-Fi upgrade to a full Cat6 office network with managed switches, access points and guest VLANs — we design, cable, install and configure networks that actually cover your space and stay up."
      heroImage="/section-images/network.jpg"
      icon="wifi"
      accentColor="brand"
      longDescription={[
        "Residential and business networking have different requirements but the same goal: reliable coverage where you actually use the internet. A home user wants strong Wi-Fi in the lounge, the bedroom and the garden; a business needs cabled points for the printer and POS, separate Wi-Fi for staff and guests, and enough bandwidth to keep a Zoom call stable while a backup runs. We design for the actual use-case — not a one-size-fits-all install.",
        "Mesh systems (Deco, Eero, Nest, Orbi) are the right answer for most homes and small offices — multiple small units spread through the building create one seamless Wi-Fi network, hand off your device as you walk between rooms, and eliminate the dead zones that a single router leaves behind. Access points (UniFi, Aruba, TP-Link Omada) are the right answer for larger offices and businesses — they're mounted on the ceiling, run back to a central switch, and can be managed centrally with separate SSIDs, VLANs and bandwidth limits.",
        "Cat6 cabling is the backbone of any reliable office network. Even with excellent Wi-Fi, cabled connections are faster, more secure, and essential for fixed devices — printers, NAS, IP phones, IP cameras, POS terminals and desktop workstations. We do clean, professional cable runs: surface-mounted trunking where the building doesn't allow ceiling cavity work, properly terminated RJ45s at wall plates, every cable tested and labelled at handover. No cable soup behind the desk.",
        "Managed switches give us the control to set up VLANs — virtual networks that keep traffic separated. A typical small office setup puts POS and payment devices on one VLAN (most secure, no internet access for anything else), staff computers and printers on another, and a guest Wi-Fi on a third with bandwidth limits and isolation from the rest of the network. This is no longer enterprise-grade complexity — modern managed switches cost from R1,500 and configuring them is part of any business install.",
        "Network security basics matter — a poorly secured Wi-Fi network is the easiest way into a business's data. We disable WPS (a known weak point), use WPA3 where devices support it, change default admin passwords on routers, hide the SSID for sensitive networks, and configure the router's firewall to drop inbound traffic by default. For businesses with POPIA obligations, we'll document the network setup and the security choices made — useful for compliance and for any future IT partner you bring in.",
      ]}
      whatWeDo={[
        {
          title: "Wi-Fi site survey",
          description:
            "We walk your premises with a Wi-Fi analyser, map signal strength and dead zones, and identify sources of interference (microwaves, baby monitors, neighbour networks). The survey is free with any installation.",
        },
        {
          title: "Mesh & access point installation",
          description:
            "TP-Link Deco, UniFi, Omada or Eero — matched to your building size and budget. We place units based on the survey, not the most convenient power point. Wall-mount or ceiling-mount, properly cabled back to the main router.",
        },
        {
          title: "Cat6 network cabling",
          description:
            "Surface trunking or in-conduit cable runs, properly terminated, tested and labelled. Up to 100m per run. Wall plates, surface mounts, and floor boxes available. R350 per point including cable and faceplate.",
        },
        {
          title: "Switch & router setup",
          description:
            "Managed switches for VLANs and traffic shaping. Routers configured for your ISP (Vumatel, Openserve, Frogfoot, Comtel, RocketNet), with Wi-Fi disabled on the ISP router to avoid double-NAT issues.",
        },
        {
          title: "Guest network configuration",
          description:
            "A separate Wi-Fi network for visitors, customers and IoT devices — isolated from your main network with bandwidth limits, captive portal and time limits. Essential for restaurants, guest houses and medical practices.",
        },
        {
          title: "VPN for remote access",
          description:
            "Securely reach your office network from home or while travelling. WireGuard or OpenVPN, configured on a dedicated router port or a small server. Two-factor authentication for sensitive environments.",
        },
        {
          title: "Network security hardening",
          description:
            "Default passwords changed, WPS disabled, WPA3 where supported, admin interfaces firewalled, router firmware updated, DNS configured to block malware domains at the network level.",
        },
        {
          title: "Ongoing monitoring",
          description:
            "For retainer clients, we monitor the network for outages, bandwidth hogs, and unauthorised devices. Alerts go to your support channel before you notice a problem.",
        },
      ]}
      whoItsFor={[
        "Homes with Wi-Fi dead zones — upstairs, the garden, the back room",
        "Small offices where the existing Wi-Fi keeps dropping calls or sessions",
        "Multi-floor businesses — guest houses, B&Bs, restaurants, medical practices",
        "Guest houses and B&Bs needing a separate guest Wi-Fi with bandwidth limits",
        "Restaurants and shops with POS systems that need cabled reliability",
      ]}
      process={[
        {
          step: "01",
          title: "Site survey",
          description:
            "We walk your premises with a Wi-Fi analyser and a tape measure. You get a sketch map showing signal strength, dead zones, and proposed cable runs — and we discuss the trade-offs between mesh, access points and cabling for your specific space.",
        },
        {
          step: "02",
          title: "Equipment recommendation",
          description:
            "Based on the survey, we recommend specific equipment with three price tiers where possible. You pick what fits the budget. We order on your approval — most kit is in stock at South African distributors within 1–2 days.",
        },
        {
          step: "03",
          title: "Cabling & installation",
          description:
            "Cable runs first (messy work — drilling, trunking, ceiling cavity). Equipment install second. Wall plates terminated and tested. We work around your hours — after-hours or weekend installs available for businesses that can't close during the day.",
        },
        {
          step: "04",
          title: "Configuration & testing",
          description:
            "SSIDs, passwords, VLANs, guest network, VPN, security hardening, ISP router reconfigured. We test every cabled point and walk through the building on a phone checking Wi-Fi signal strength in every room. Documentation handed over at the end.",
        },
      ]}
      faqs={[
        {
          question: "Mesh or access points — which do I need?",
          answer:
            "Mesh is best for most homes and small offices up to ~300m² — easy to expand, single network name, automatic device handoff. Access points are better for larger offices, multi-building sites, and businesses that need VLANs, multiple SSIDs, or centralised management. If you're not sure, the site survey will tell us — and we'll recommend without bias toward either (we sell and install both).",
        },
        {
          question: "What does a full-house Wi-Fi install cost?",
          answer:
            "A two-unit Deco mesh covering a typical 3-bedroom house, installed and configured, is around R3,500–R4,500 (equipment + labour). A larger home with 3 units and some Cat6 backhaul runs is R6,000–R8,000. Multi-storey homes and homes with thick walls may need more units. The site survey gives you a fixed quote before we start.",
        },
        {
          question: "Can you hide the Wi-Fi network name?",
          answer:
            "Yes — we can disable SSID broadcast so the network doesn't show up in the list of available networks on phones and laptops. You connect by typing the network name in manually. This is security-through-obscurity (serious attackers can still find it), but it does cut down on neighbour connection attempts and is a reasonable additional layer for sensitive environments.",
        },
        {
          question: "Can you limit guest Wi-Fi bandwidth?",
          answer:
            "Yes. On managed networks we can set per-SSID or per-client bandwidth limits — e.g. give the guest Wi-Fi a 10Mbps cap so a streaming guest can't bring the business network to a crawl. We can also enable client isolation (guest devices can't see each other), set session time limits, and require a captive portal with a password or terms acceptance.",
        },
        {
          question: "Do you handle smart home / IoT integration?",
          answer:
            "Yes — we can set up a dedicated IoT VLAN to keep smart TVs, smart plugs, smart speakers and CCTV cameras off your main network where your laptops and phones live. This is a security best-practice (a compromised smart bulb can't then attack your laptop) and avoids IP conflicts when you have many devices. We work with Home Assistant, SmartThings, Alexa and Google Home ecosystems.",
        },
        {
          question: "Do you offer ongoing network support?",
          answer:
            "Yes — for retainer clients (see IT Support & Outsourcing), we monitor the network 24/7 for outages and bandwidth hogs, push firmware updates out-of-hours, and respond to issues before you notice them. For non-retainer clients, we offer per-incident callouts at R450 + travel for any post-installation issues. All installs come with a 30-day post-installation support window included.",
        },
      ]}
      pricingGuidance="From R2,500 for a single-router Wi-Fi upgrade (entry-level router + basic install). Full mesh system installed and configured from R6,000 (2–3 units). Cat6 cabling R350 per point including cable and faceplate. Office networks with managed switches and VLANs quoted per project — typical 10-point office install lands around R15,000–R25,000 including equipment. Fixed quote provided after the free site survey."
      serviceArea="Based in Midrand, we install and cable networks across greater Gauteng. Most installs happen in Midrand, Centurion, Fourways, Randburg, Sandton, Roodepoort, Kempton Park, Edenvale, Kaalfontein and Pretoria. For larger commercial projects outside Gauteng, we travel and quote travel costs upfront."
      relatedServices={[
        { slug: "cctv-security", title: "CCTV & Security Technology" },
        { slug: "it-support-outsourcing", title: "IT Support & Outsourcing" },
        { slug: "computer-repairs", title: "Computer Repairs & Hardware" },
      ]}
    />
  );
}
