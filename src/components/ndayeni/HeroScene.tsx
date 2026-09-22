"use client";

import { useEffect, useState } from "react";

/**
 * HeroScene — pure-CSS animated background.
 *
 * Replaced the previous three.js / @react-three/fiber implementation
 * because:
 *   1. WebGL `MeshDistortMaterial` / `MeshWobbleMaterial` shaders run
 *      per-frame vertex work that throttles iOS Safari GPUs (even modern
 *      iPhones run hot and drop frames).
 *   2. The three.js + drei bundle shipped ~600KB-1MB of JS to every
 *      desktop visitor, slowing first paint.
 *   3. The `<Sparkles>` and `<Particles>` systems add custom shader
 *      work that compounds the iOS issue.
 *
 * This version uses pure CSS transforms (translate3d + rotate) which
 * are GPU-accelerated and run smoothly on every device including iOS
 * Safari. The visual result is a similar "floating tech shapes + glow"
 * aesthetic at ~3KB instead of 600KB+.
 *
 * Respects `prefers-reduced-motion` (animations disabled, shapes static).
 */

type Orb = {
  /** Tailwind gradient + colour, e.g. "from-brand to-brand-light" */
  gradient: string;
  /** Size in px (square) */
  size: number;
  /** Position as Tailwind classes, e.g. "top-[10%] left-[5%]" */
  position: string;
  /** Animation duration in seconds */
  duration: number;
  /** Animation delay in seconds (negative = pre-offset) */
  delay: number;
  /** Float travel distance in px */
  distance: number;
  /** Rotation in degrees applied to the wrapper */
  rotate: number;
};

const orbs: Orb[] = [
  {
    gradient: "from-brand to-brand-light",
    size: 380,
    position: "top-[8%] right-[-5%]",
    duration: 18,
    delay: 0,
    distance: 30,
    rotate: 12,
  },
  {
    gradient: "from-accent to-brand",
    size: 320,
    position: "top-[35%] left-[-8%]",
    duration: 22,
    delay: -3,
    distance: 25,
    rotate: -8,
  },
  {
    gradient: "from-brand-light to-accent",
    size: 260,
    position: "bottom-[5%] right-[20%]",
    duration: 26,
    delay: -7,
    distance: 35,
    rotate: 20,
  },
  {
    gradient: "from-brand to-accent",
    size: 200,
    position: "top-[55%] right-[8%]",
    duration: 20,
    delay: -2,
    distance: 20,
    rotate: -15,
  },
  {
    gradient: "from-accent to-brand-light",
    size: 150,
    position: "top-[20%] left-[40%]",
    duration: 24,
    delay: -10,
    distance: 28,
    rotate: 8,
  },
];

/** Static particle dots — pure CSS, no per-frame work. */
const particles = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  top: `${(i * 53) % 100}%`,
  left: `${(i * 37) % 100}%`,
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  duration: 4 + (i % 4),
  delay: -(i % 5),
}));

export default function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Floating gradient orbs (the main "3D shapes" replacement). */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute ${orb.position}`}
          style={{
            width: orb.size,
            height: orb.size,
            transform: `rotate(${orb.rotate}deg)`,
            willChange: "transform",
          }}
        >
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${orb.gradient} opacity-[0.15] blur-3xl`}
            style={{
              animation: reducedMotion
                ? "none"
                : `hero-float ${orb.duration}s ease-in-out ${orb.delay}s infinite alternate`,
              ["--float-distance" as string]: `${orb.distance}px`,
            } as React.CSSProperties}
          />
        </div>
      ))}

      {/* Subtle particle field (replaces the three.js <Sparkles>). */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-accent/40"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animation: reducedMotion
              ? "none"
              : `hero-twinkle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Inline keyframes — keep them local to this component so globals.css
          stays clean. */}
      <style jsx>{`
        @keyframes hero-float {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          100% {
            transform: translate3d(0, -var(--float-distance, 30px), 0)
              rotate(8deg);
          }
        }
        @keyframes hero-twinkle {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          100% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
