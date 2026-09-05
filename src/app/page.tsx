"use client";

import Navbar from "@/components/ndayeni/Navbar";
import Hero from "@/components/ndayeni/Hero";
import WhyNdayeni from "@/components/ndayeni/WhyNdayeni";
import Services from "@/components/ndayeni/Services";
import BusinessSolutions from "@/components/ndayeni/BusinessSolutions";
import CarePlans from "@/components/ndayeni/CarePlans";
import About from "@/components/ndayeni/About";
import Contact from "@/components/ndayeni/Contact";
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
        <Services />
        <SectionDivider variant="brand" />
        <BusinessSolutions />
        <SectionDivider variant="mixed" />
        <CarePlans />
        <SectionDivider variant="accent" />
        <About />
        <SectionDivider variant="mixed" />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
