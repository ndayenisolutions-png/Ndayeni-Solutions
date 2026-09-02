"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/ndayeni/Navbar";
import Hero from "@/components/ndayeni/Hero";
import Services from "@/components/ndayeni/Services";
import About from "@/components/ndayeni/About";
import Contact from "@/components/ndayeni/Contact";
import Footer from "@/components/ndayeni/Footer";
import SectionDivider from "@/components/ndayeni/SectionDivider";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-deep">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <SectionDivider variant="brand" />
        <Services />
        <SectionDivider variant="accent" />
        <About />
        <SectionDivider variant="mixed" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
