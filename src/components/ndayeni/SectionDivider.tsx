// SectionDivider — a thin gradient line between homepage sections.
//
// Previously used framer-motion's <motion.div> for a scroll-triggered
// scale-X animation. Removed framer-motion entirely (it was the ONLY remaining
// import of framer-motion on the entire site, so the full library was being
// bundled just for this one 1px decorative line). Now a pure server component
// — no "use client", no JS, no hydration cost, saves ~50-100KB of bundle size.

export default function SectionDivider({ variant = "brand" }: { variant?: "brand" | "accent" | "mixed" }) {
  const gradients = {
    brand: "from-transparent via-brand/30 to-transparent",
    accent: "from-transparent via-accent/30 to-transparent",
    mixed: "from-transparent via-brand/20 via-accent/20 to-transparent",
  };
  return (
    <div className="flex items-center justify-center py-4">
      <div className={`h-px w-full max-w-md bg-gradient-to-r ${gradients[variant]}`} />
    </div>
  );
}
