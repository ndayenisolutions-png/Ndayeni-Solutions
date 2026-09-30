"use client";

import Navbar from "@/components/ndayeni/Navbar";
import Hero from "@/components/ndayeni/Hero";
import WhyNdayeni from "@/components/ndayeni/WhyNdayeni";
import Services from "@/components/ndayeni/Services";
import BusinessSolutions from "@/components/ndayeni/BusinessSolutions";
import CarePlans from "@/components/ndayeni/CarePlans";
import Testimonials from "@/components/ndayeni/Testimonials";
import TrustSignals from "@/components/ndayeni/TrustSignals";
import About from "@/components/ndayeni/About";
import Contact from "@/components/ndayeni/Contact";
import FAQ from "@/components/ndayeni/FAQ";
import Footer from "@/components/ndayeni/Footer";
import SectionDivider from "@/components/ndayeni/SectionDivider";
import WhatsAppButton from "@/components/ndayeni/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-deep">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <SectionDivider variant="brand" />
        <WhyNdayeni />
        <SectionDivider variant="accent" />
        {/* Below-the-fold sections wrapped in .lazy-section for content-visibility: auto
            — the browser skips loading their background images + rendering their DOM
            until the user scrolls near them. Saves ~2.5MB of initial image download
            on iPhone (the #1 performance fix). */}
        <div className="lazy-section">
          <SectionDivider variant="brand" />
          <Services />
        </div>
        <div className="lazy-section">
          <SectionDivider variant="mixed" />
          <BusinessSolutions />
        </div>
        <div className="lazy-section">
          <SectionDivider variant="brand" />
          <CarePlans />
        </div>
        <div className="lazy-section">
          <SectionDivider variant="accent" />
          <Testimonials />
        </div>
        <div className="lazy-section">
          <SectionDivider variant="brand" />
          <About />
        </div>
        <div className="lazy-section">
          <SectionDivider variant="mixed" />
          <Contact />
        </div>
        <div className="lazy-section">
          <SectionDivider variant="accent" />
          <FAQ />
        </div>
      </main>
      <TrustSignals />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
