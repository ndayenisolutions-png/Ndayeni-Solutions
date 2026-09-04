import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://ndayenisolutions.co.za";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ndayeni Solutions | Technology Solutions for Small Businesses & Homes",
    template: "%s | Ndayeni Solutions",
  },
  description:
    "Midrand-based technology partner for small businesses and homes across South Africa. We set up, maintain and manage computers, networks, Wi-Fi, CCTV, printers, websites and ongoing IT support.",
  keywords: [
    "Ndayeni Solutions",
    "Technology Solutions South Africa",
    "IT Support Midrand",
    "Computer Repairs Midrand",
    "Networking & Wi-Fi",
    "CCTV Installation",
    "Printer & Office Technology",
    "Web Design South Africa",
    "Small Business IT Support",
    "IT Outsourcing South Africa",
    "Kaalfontein IT",
    "Digital Skills Training",
    "Computer Systems Engineer",
  ],
  authors: [{ name: "Ndayeni Solutions Pty Ltd" }],
  creator: "Ndayeni Solutions Pty Ltd",
  publisher: "Ndayeni Solutions Pty Ltd",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Ndayeni Solutions | Technology Solutions for Small Businesses & Homes",
    description:
      "Seamless Solutions, Limitless Possibilities. Midrand-based technology partner setting up, maintaining and supporting the technology small businesses and homes rely on.",
    url: siteUrl,
    siteName: "Ndayeni Solutions",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ndayeni Solutions — Technology Solutions for Small Businesses & Homes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ndayeni Solutions | Technology Solutions for Small Businesses & Homes",
    description:
      "Seamless Solutions, Limitless Possibilities. Midrand-based technology partner setting up, maintaining and supporting the technology small businesses and homes rely on.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#071515",
  width: "device-width",
  initialScale: 1,
};

const serviceNames = [
  { title: "IT Support & Outsourcing", description: "Ongoing IT support, maintenance and outsourcing for small businesses, shops, offices, NGOs and schools — on-site and remote." },
  { title: "Computer Repairs & Hardware", description: "Fast, reliable hardware and software repairs for laptops, desktops and peripherals. Honest diagnosis, quote before we fix." },
  { title: "Networking & Wi-Fi", description: "From a single Wi-Fi router to a full Cat6 office network with managed switches and access points — designed, cabled and installed." },
  { title: "CCTV & Security Technology", description: "Professionally installed CCTV systems with NVRs, remote viewing and night vision, configured for mobile monitoring." },
  { title: "Printer & Office Technology", description: "Printers, scanners, copiers and the office tech that keeps a workspace moving — supplied, set up, maintained and repaired." },
  { title: "Web Design & Digital Presence", description: "Fast, responsive websites optimized for search, plus business email, Google profile and online listings setup." },
  { title: "Graphic Design & Branding", description: "Logos, brand systems and marketing materials that hold together across every touchpoint." },
  { title: "Digital Skills Training", description: "Practical, hands-on digital literacy for individuals and teams — from basic computer skills to productivity tools." },
];

const servicesJsonLd = serviceNames.map((s) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: s.title,
  description: s.description,
  provider: {
    "@type": "ProfessionalService",
    name: "Ndayeni Solutions Pty Ltd",
    url: siteUrl,
  },
  areaServed: "South Africa",
}));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Ndayeni Solutions Pty Ltd",
  description:
    "Midrand-based technology partner for small businesses and homes across South Africa. IT support, computer repairs, networking & Wi-Fi, CCTV & security, printer & office technology, web design, graphic design, and digital skills training.",
  url: siteUrl,
  telephone: "+27-83-800-6989",
  email: "info@ndayenisolutions.co.za",
  image: `${siteUrl}/og-image.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "4099 Finger Fish Street, Kaalfontein",
    addressLocality: "Midrand",
    addressRegion: "Gauteng",
    postalCode: "1635",
    addressCountry: "ZA",
  },
  areaServed: [
    "South Africa",
    "Gauteng",
    "Western Cape",
    "KwaZulu-Natal",
    "Eastern Cape",
    "Free State",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
  ],
  foundingDate: "2023",
  founder: {
    "@type": "Person",
    name: "Nhlakanipho Ntshangase",
    jobTitle: "Founder & Computer Systems Engineer",
  },
  knowsAbout: [
    "IT Support & Outsourcing",
    "Computer Repairs & Hardware",
    "Networking & Wi-Fi",
    "CCTV & Security Technology",
    "Printer & Office Technology",
    "Web Design & Digital Presence",
    "Graphic Design & Branding",
    "Digital Skills Training",
    "Small Business Technology",
  ],
  openingHours: "Mo-Fr 08:00-17:00",
  priceRange: "$$",
  slogan: "Seamless Solutions, Limitless Possibilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand focus:text-dark-deep focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {servicesJsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
