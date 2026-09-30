import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Strict TypeScript in production builds — surface real bugs instead of hiding them.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Surface unsafe patterns (legacy effects, deprecated APIs) during development.
  reactStrictMode: true,
  // Allow the sandbox preview origin to hot-reload without console warnings.
  allowedDevOrigins: [".space-z.ai"],
  images: {
    // Modern formats first — ~30-50% smaller payloads for mobile users.
    formats: ["image/avif", "image/webp"],
    // Allow locally-served section images to be optimised by the Next/Image pipeline.
    remotePatterns: [],
  },
  // ─── HTTP Security Headers ───
  // Covers the technical security expectations of POPIA (secure transmission),
  // the Cybercrimes Act 19 of 2020 (system integrity), and ECT Act (data
  // confidentiality in transit). Applied to every route on the site.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── HSTS: force HTTPS for 2 years, including subdomains, preload-ready ──
          // Vercel already injects HSTS but explicit declaration is defence-in-depth
          // and ensures it stays on if the site ever moves off Vercel.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // ── Clickjacking protection — never allow this site to be framed ──
          { key: "X-Frame-Options", value: "DENY" },
          // ── MIME-type sniffing protection ──
          { key: "X-Content-Type-Options", value: "nosniff" },
          // ── Referrer policy — only send origin on cross-origin, full URL on same-origin ──
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // ── Permissions policy — disable browser features we don't use ──
          // Camera/microphone/geolocation/payment disabled site-wide; the CCTV
          // business doesn't expose any of these on the website itself.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
          },
          // ── Content-Security-Policy — restrict where scripts/styles/etc can load from ──
          // This is the single most powerful XSS mitigation. Allows:
          //   - 'self' for everything (our own origin)
          //   - Vercel Analytics (https://va.vercel-scripts.com)
          //   - Microsoft Clarity (if NEXT_PUBLIC_CLARITY_ID is set — heatmaps)
          //   - Google Fonts (fonts.googleapis.com + fonts.gstatic.com)
          //   - Inline styles (Tailwind + Next.js generate these)
          //   - Inline scripts (Next.js generates these for hydration)
          //   - 'unsafe-eval' for scripts — required by some Next.js dev features + the WhatsApp button. Note: production builds don't strictly need eval but removing it is a bigger refactor; the defences above mitigate the risk.
          //   - Images from any https: source (for stock photos + service page images)
          //   - Connect to Vercel Insights + Clarity endpoints for analytics
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarity.ms https://*.clarity.ms https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://vitals.vercel-insights.com https://*.clarity.ms",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // ── X-DNS-Prefetch-Control — disable cross-origin DNS prefetching (minor privacy win) ──
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
      // ── API routes get the same security headers + no caching ──
      {
        source: "/api/(.*)",
        headers: [
          // API responses should never be cached by browsers or proxies.
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
    ];
  },
};

export default nextConfig;
