"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

gsap.registerPlugin(ScrollToPlugin);

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const serviceLinks = [
  "Web Design & SEO",
  "IT Outsourcing",
  "IT Technical Support",
  "Graphic Design",
  "Computer Repairs",
  "Digital Skills Training",
];

const touchLinkStyles =
  "min-h-[44px] inline-flex items-center [touch-action:manipulation]";

export default function Footer() {
  const scrollToTop = () => {
    gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: "power3.inOut" });
  };

  return (
    <footer className="relative bg-dark-deep border-t border-dark-border/30">
      {/* Top Accent Line */}
      <div
        aria-hidden="true"
        className="h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
          {/* Brand — full width on sm, then 1 col on lg */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
                <span className="text-dark-deep font-bold text-lg">N</span>
              </div>
              <div>
                <div className="text-warm-white font-semibold text-lg leading-tight">
                  Ndayeni
                </div>
                <div className="text-text-muted text-[10px] tracking-[0.2em] uppercase">
                  Solutions
                </div>
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              Seamless Solutions, Limitless Possibilities. Your trusted IT
              partner across South Africa.
            </p>
            <div className="space-y-1">
              <a
                href="tel:0631188354"
                className={`flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-sm ${touchLinkStyles}`}
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                063 118 8354
              </a>
              <a
                href="mailto:info@ndayenisolutions.co.za"
                className={`flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-sm ${touchLinkStyles}`}
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                info@ndayenisolutions.co.za
              </a>
              <a
                href="https://maps.google.com/?q=4099+Finger+Fish+Street+Kaalfontein+Midrand"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-text-muted hover:text-brand transition-colors text-sm ${touchLinkStyles}`}
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                Kaalfontein, Midrand, SA
              </a>
            </div>
          </div>

          {/* Quick Links — side by side with Services on sm */}
          <div>
            <h4 className="text-warm-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-text-muted hover:text-brand transition-colors text-sm items-center gap-2 group ${touchLinkStyles}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-brand/30 group-hover:bg-brand transition-colors flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services — side by side with Quick Links on sm */}
          <div>
            <h4 className="text-warm-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Services
            </h4>
            <ul className="space-y-1">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className={`text-text-muted hover:text-accent transition-colors text-sm items-center gap-2 group ${touchLinkStyles}`}
                  >
                    <span className="w-1 h-1 rounded-full bg-accent/30 group-hover:bg-accent transition-colors flex-shrink-0" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info — full width on sm, then 1 col on lg */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-warm-white font-semibold mb-5 text-sm tracking-wider uppercase">
              Company Info
            </h4>
            <div className="space-y-3 text-sm text-text-muted">
              <p>
                <span className="text-warm-white/70">Company:</span> Ndayeni
                Solutions Pty Ltd
              </p>
              <p>
                <span className="text-warm-white/70">Founded:</span> 2023
              </p>
              <p>
                <span className="text-warm-white/70">Address:</span> 4099
                Finger Fish Street, Kaalfontein, Midrand
              </p>
              <p>
                <span className="text-warm-white/70">Reg:</span> South African
                Registered Company
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-dark-border/30 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <p className="text-text-muted text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Ndayeni Solutions Pty Ltd. All Rights
            Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-text-muted/50 text-xs hidden sm:inline">
              Designed &amp; Developed by Ndayeni Solutions
            </span>
            <button
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full bg-brand/10 hover:bg-brand/20 border border-brand/20 flex items-center justify-center text-brand hover:text-brand-light transition-all duration-300 [touch-action:manipulation]"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
