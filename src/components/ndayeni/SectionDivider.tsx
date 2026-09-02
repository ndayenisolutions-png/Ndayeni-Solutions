"use client";

import { motion } from "framer-motion";

export default function SectionDivider({ variant = "brand" }: { variant?: "brand" | "accent" | "mixed" }) {
  const gradients = {
    brand: "from-transparent via-brand/30 to-transparent",
    accent: "from-transparent via-accent/30 to-transparent",
    mixed: "from-transparent via-brand/20 via-accent/20 to-transparent",
  };

  return (
    <div className="flex items-center justify-center py-4">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className={`h-px w-full max-w-md bg-gradient-to-r ${gradients[variant]}`}
      />
    </div>
  );
}
