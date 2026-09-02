"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isMobileOpen]);

  // Close menu on orientation change or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // GSAP entrance animation for header
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  // GSAP animation for mobile menu open/close
  useEffect(() => {
    const menu = mobileMenuRef.current;
    const backdrop = backdropRef.current;
    const linksContainer = menuLinksRef.current;
    if (!menu || !backdrop || !linksContainer) return;

    if (isMobileOpen) {
      // Open animation
      menu.style.display = "block";
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(
        menu,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
      );
      // Stagger the links
      const links = linksContainer.querySelectorAll("a, .cta-wrapper");
      gsap.fromTo(
        links,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, delay: 0.15, ease: "power3.out" }
      );
    } else {
      // Close animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (menu) menu.style.display = "none";
        },
      });
      tl.to(menu, { y: -20, opacity: 0, duration: 0.25, ease: "power2.in" });
      tl.to(backdrop, { opacity: 0, duration: 0.2, ease: "power2.in" }, "<");
    }
  }, [isMobileOpen]);

  // Smooth-scroll to section using GSAP + close menu
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsMobileOpen(false);
      // Defer the scroll until after the menu starts closing
      requestAnimationFrame(() => {
        const target = document.querySelector(href);
        if (target) {
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: target, offsetY: 80 },
            ease: "power3.inOut",
          });
        }
      });
    },
    []
  );

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-strong py-2 sm:py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-3 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="flex items-center gap-2 sm:gap-3 group z-50 relative"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
            <span className="text-dark-deep font-bold text-base sm:text-lg">N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-warm-white font-semibold text-base sm:text-lg leading-tight tracking-tight">
              Ndayeni
            </span>
            <span className="text-text-muted text-[9px] sm:text-[10px] tracking-[0.2em] uppercase leading-tight">
              Solutions
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-warm-white/70 hover:text-brand transition-colors duration-300 text-sm font-medium tracking-wide group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-brand to-brand-light group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>
            <Button className="bg-gradient-to-r from-brand to-brand-light text-dark-deep hover:shadow-lg hover:shadow-brand/25 transition-all duration-300 font-semibold px-6 rounded-full">
              Get Started
            </Button>
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileOpen((v) => !v)}
          className="md:hidden text-warm-white p-3 -mr-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg active:bg-white/10 z-50 relative"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          style={{
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
          }}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav — controlled by GSAP */}
      <div
        ref={backdropRef}
        className="md:hidden fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-40"
        style={{ opacity: 0, display: "none", touchAction: "manipulation" }}
        onClick={() => setIsMobileOpen(false)}
      />
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-label="Mobile navigation menu"
        className="md:hidden fixed top-0 left-0 right-0 glass-strong border-b border-brand/10 z-50 shadow-2xl shadow-black/40"
        style={{ opacity: 0, y: -20, display: "none", touchAction: "manipulation" }}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col pt-20 pb-6 px-5 gap-0">
          <div ref={menuLinksRef}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-warm-white/80 hover:text-brand active:text-brand active:bg-brand/10 transition-colors duration-200 py-4 px-3 text-lg font-medium tracking-wide border-b border-dark-border/20 min-h-[48px] flex items-center rounded-lg"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-5 cta-wrapper">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                style={{
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
              >
                <Button className="w-full bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold rounded-full py-6 text-base">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
