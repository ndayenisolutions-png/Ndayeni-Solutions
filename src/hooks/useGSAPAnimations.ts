"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/**
 * Hook for smooth scroll-triggered fade-in animations using GSAP.
 * Replaces framer-motion whileInView for a smoother, more performant experience.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: {
    y?: number;
    x?: number;
    duration?: number;
    delay?: number;
    start?: string;
    once?: boolean;
  } = {}
) {
  const {
    y = 40,
    x = 0,
    duration = 0.8,
    delay = 0,
    start = "top 85%",
    once = true,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y, x });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          delay,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [y, x, duration, delay, start, once]);

  return ref;
}

/**
 * Hook for staggered reveal of child elements.
 */
export function useStaggerReveal<T extends HTMLElement>(
  options: {
    childSelector?: string;
    y?: number;
    stagger?: number;
    duration?: number;
    start?: string;
    once?: boolean;
  } = {}
) {
  const {
    childSelector = "> *",
    y = 30,
    stagger = 0.1,
    duration = 0.6,
    start = "top 85%",
    once = true,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(childSelector);
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [childSelector, y, stagger, duration, start, once]);

  return ref;
}

/**
 * Hook for smooth parallax scrolling effect.
 */
export function useParallax<T extends HTMLElement>(
  options: {
    speed?: number;
    start?: string;
    end?: string;
  } = {}
) {
  const { speed = 0.3, start = "top bottom", end = "bottom top" } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: () => window.innerHeight * speed * -1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [speed, start, end]);

  return ref;
}

/**
 * Hook for counting up numbers with GSAP.
 */
export function useCountUp(
  target: number,
  options: {
    duration?: number;
    delay?: number;
    start?: string;
  } = {}
) {
  const { duration = 2, delay = 0, start = "top 80%" } = options;
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration,
          delay,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toString();
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [target, duration, delay, start]);

  return ref;
}

/**
 * Initialize smooth scrolling for anchor links across the page.
 * Call once in a top-level component.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: el, offsetY: 80 },
        ease: "power3.inOut",
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}
