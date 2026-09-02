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
    default: "Ndayeni Solutions | Reliable IT & Web Solutions in Midrand",
    template: "%s | Ndayeni Solutions",
  },
  description:
    "Midrand-based IT and web partner serving clients across South Africa. We design fast websites, manage IT infrastructure, and fix the tech that keeps your business running — wherever you are.",
  keywords: [
    "Ndayeni Solutions",
    "IT Solutions Midrand",
    "Web Design South Africa",
    "SEO Services",
    "Graphic Design",
    "IT Support South Africa",
    "Computer Repairs Midrand",
    "Kaalfontein IT",
    "Digital Skills Training",
    "IT Outsourcing South Africa",
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
    title: "Ndayeni Solutions | Reliable IT & Web Solutions",
    description:
      "Seamless Solutions, Limitless Possibilities. Midrand-based IT and web partner serving homes and businesses across South Africa.",
    url: siteUrl,
    siteName: "Ndayeni Solutions",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ndayeni Solutions — Reliable IT & Web Solutions in Midrand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ndayeni Solutions | Reliable IT & Web Solutions",
    description:
      "Seamless Solutions, Limitless Possibilities. Midrand-based IT and web partner serving homes and businesses across South Africa.",
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
  { title: "Web Design & SEO", description: "Stunning, responsive websites optimized for search engines. We build digital experiences that convert visitors into customers." },
  { title: "IT Outsourcing", description: "Scalable IT infrastructure management. Let us handle your technology needs so you can focus on growing your business." },
  { title: "IT Technical Support", description: "24/7 expert support for all your tech challenges. Remote and on-site solutions to keep your operations running smoothly." },
  { title: "Graphic Design", description: "Eye-catching visual identities and marketing materials. From logos to brand guidelines, we bring your vision to life." },
  { title: "Computer Repairs", description: "Fast, reliable hardware and software repairs. We diagnose and fix issues to get your systems back up and running." },
  { title: "Digital Skills Training", description: "Empowering individuals and teams with essential digital literacy. Customized training programs for all skill levels." },
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
    "Midrand-based IT and web partner serving clients across South Africa. Web design, SEO, IT outsourcing, technical support, graphic design, computer repairs, and digital skills training.",
  url: siteUrl,
  telephone: "+27-63-118-8354",
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
    "Web Design & SEO",
    "IT Outsourcing",
    "IT Technical Support",
    "Graphic Design",
    "Computer Repairs",
    "Digital Skills Training",
    "IT Infrastructure Management",
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
