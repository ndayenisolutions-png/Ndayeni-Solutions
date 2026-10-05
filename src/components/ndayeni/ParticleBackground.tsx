"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleNetwork — lightweight Canvas 2D particle network background.
 *
 * Features:
 * - Small dots drifting slowly, connected by faint lines when close
 * - Brand colours (navy + teal particles)
 * - Respects prefers-reduced-motion (renders nothing)
 * - Pauses when tab is hidden (performance)
 * - No particles on mobile (< 768px) to preserve iPhone performance
 * - ~3KB of JS (vs 600KB+ for three.js)
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const COLORS = [
  "rgba(30, 144, 255, 0.45)",  // brand blue
  "rgba(30, 144, 255, 0.45)",  // brand blue (weighted 70%)
  "rgba(30, 144, 255, 0.45)",  // brand blue
  "rgba(20, 184, 166, 0.45)",  // accent teal (30%)
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Assign to non-null consts so TypeScript doesn't complain inside closures
    const canvasEl = canvas;
    const ctxEl = ctx;

    // Respect reduced motion — don't render anything
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // No particles on mobile (preserve iPhone performance)
    if (window.innerWidth < 768) return;

    let width = 0;
    let height = 0;
    let animationId = 0;
    let running = true;

    // Particle count: 35 on desktop, 20 on tablet
    const particleCount = window.innerWidth < 1024 ? 20 : 35;
    const connectionDistance = 130;
    const particles: Particle[] = [];

    function resize() {
      const parent = canvasEl.parentElement;
      if (!parent) return;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      // Use devicePixelRatio for crisp rendering on retina displays
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;
      ctxEl.scale(dpr, dpr);
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.5 + 0.8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    function animate() {
      if (!running) return;
      ctxEl.clearRect(0, 0, width, height);

      // Update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Keep particles within bounds
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Draw particle
        ctxEl.beginPath();
        ctxEl.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctxEl.fillStyle = p.color;
        ctxEl.fill();
      }

      // Draw connections (O(n²) but n is small — 35 particles = 595 pairs)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.15;
            ctxEl.beginPath();
            ctxEl.moveTo(particles[i].x, particles[i].y);
            ctxEl.lineTo(particles[j].x, particles[j].y);
            ctxEl.strokeStyle = `rgba(30, 144, 255, ${opacity})`;
            ctxEl.lineWidth = 0.5;
            ctxEl.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationId);
      } else {
        running = true;
        animate();
      }
    }

    // Initialise
    resize();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
