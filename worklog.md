---
Task ID: migrate-ndayeni
Agent: main
Task: Clone https://github.com/mabasoeleanor-cpu/Ndayeni-Solutions.git, inspect it, and migrate it into the active Next.js project so it runs on the dev server (port 3000). Install deps and start it.

Work Log:
- Cloned repo into /home/z/my-project/Ndayeni-Solutions/
- Inspected key files: package.json, src/app/page.tsx, src/app/layout.tsx, src/app/globals.css, src/app/api/contact/route.ts, prisma/schema.prisma, tailwind.config.ts, tsconfig.json, next.config.ts, components.json, .env.example, Hero.tsx, HeroScene.tsx, sitemap.ts, api/route.ts, robots.txt
- Inspected active project structure; confirmed both projects share the same base stack (Next.js 16, React 19, Tailwind 4, shadcn/ui, Prisma SQLite)
- Identified missing deps in active project: gsap, three, @react-three/drei, @react-three/fiber, @types/three, nodemailer, @types/nodemailer
- Installed all missing deps via `bun add` / `bun add -d`
- Migrated source files via cp:
  - src/app/globals.css (Ndayeni brand palette + custom utilities)
  - src/app/page.tsx (Ndayeni homepage: Navbar, Hero, SectionDivider, Services, About, Contact, Footer)
  - src/app/layout.tsx (Ndayeni metadata, JSON-LD, Inter + Space Grotesk fonts)
  - src/app/sitemap.ts (Ndayeni sitemap)
  - src/app/icon.svg (app icon)
  - src/app/api/contact/route.ts (nodemailer contact form with Ethereal test-mode fallback + reCAPTCHA)
  - src/components/ndayeni/{Navbar,Hero,HeroScene,Services,About,SectionDivider,Contact,Footer}.tsx (8 components)
  - src/hooks/useGSAPAnimations.ts
  - public/{logo.svg,favicon.svg,og-image.png,hero-bg.png,3d-element-1.png,robots.txt}
- Fixed a bug in the original repo: `text-gradient-teal` class used in Hero.tsx (the "Business" headline word) was NOT defined in globals.css — would render text invisible. Added `.text-gradient-teal` alias to globals.css.
- Excluded the cloned Ndayeni-Solutions/ folder from ESLint (its static export + examples were producing 4378 lint problems) by adding "Ndayeni-Solutions/**" to eslint.config.mjs ignores. Active project src/ lints clean.
- Added `allowedDevOrigins: [".space-z.ai"]` to next.config.ts to suppress cross-origin dev warning.
- Ran `bun run lint` -> clean (no errors/warnings in active src)
- Ran `bun run db:push` -> database already in sync, Prisma Client regenerated
- Dev server (already running on port 3000) auto-recompiled: `✓ Compiled in 5.5s`, `GET / 200`

Stage Summary:
- Ndayeni Solutions website fully migrated into the active project and running on port 3000.
- Tech: Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + Prisma SQLite + three.js (3D hero) + GSAP (animations) + framer-motion + nodemailer (contact form).
- Contact form runs in Ethereal test mode by default (no SMTP creds in .env); falls back gracefully. To enable real email, add SMTP_HOST/SMTP_USER/SMTP_PASSWORD to .env.
- Original cloned repo preserved at /home/z/my-project/Ndayeni-Solutions/ for reference (excluded from lint/build).
- Remaining: Agent Browser end-to-end verification (render + hero 3D + contact form + sticky footer + responsive).

---
Task ID: migrate-ndayeni-verify
Agent: main
Task: Agent Browser end-to-end self-verification of the migrated Ndayeni Solutions site.

Work Log:
- Opened http://localhost:3000 via agent-browser; page title = "Ndayeni Solutions | Reliable IT & Web Solutions in Midrand"
- Checked page errors: NONE (empty). Console only showed benign warnings (React DevTools prompt, HMR connected, framer-motion scroll-position hint, THREE.Clock deprecation).
- Captured accessibility tree (depth 4): confirmed ALL 6 sections render populated:
  - Navbar (logo + 5 nav links + Get Started CTA)
  - Hero (H1 "Reliable IT & Web Solutions for Your Home & Business", 2 CTAs, 3 stats: 50+/500+/100+)
  - Services (6 cards: Web Design & SEO, IT Outsourcing, IT Technical Support, Graphic Design, Computer Repairs, Digital Skills Training)
  - About (H2 + H3 "Technology Should Empower, Not Frustrate." + 6 features + counters + Work With Us CTA)
  - Contact (4 info links + form: name/email/phone/service-select(7 options)/message + Send Message)
  - Footer (logo, tagline, contact links, Quick Links, Services list)
- Contact form golden path (browser): filled name/email/phone/message, selected "Web Design & SEO", clicked Send Message. Success UI rendered: "Test mode active / Your message was captured by the test mail server. View the email preview → / Message sent — we'll be in touch".
- Contact API verified via curl: GET /api/contact → {ok:true,...}; POST → {ok:true,mode:"test",previewUrl:"https://ethereal.email/message/..."}.
- Dev log confirms 3x POST /api/contact 200 with Ethereal test emails captured; no 500s, no exceptions.
- Mobile responsive (390x844): navbar collapsed to hamburger "Open menu"; mobile nav sheet opened with all 5 links.
- Sticky footer layout verified via eval: root has `min-h-screen flex flex-col`, main has `flex-1`, footer present, docHeight(7644) > viewportHeight(844) → footer pushed down naturally (no overlap, no floating gap).

Stage Summary:
- Site is fully functional and browser-verified. Golden path (contact form → API → email capture) works end-to-end. Responsive + sticky footer confirmed. Dev server healthy on port 3000. Migration COMPLETE.

---
Task ID: REBUILD-WHY
Agent: general-purpose
Task: Recreate WhyNdayeni.tsx component

Work Log:
- Read /home/z/my-project/worklog.md to recover project context (Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + GSAP + Prisma; Ndayeni Solutions site migrated from Ndayeni-Solutions repo into active project on port 3000).
- Inspected sibling components for design conventions: src/components/ndayeni/Services.tsx (GSAP header + staggered cards pattern, Card + CardContent usage, hover:-translate-y-1 group card pattern, top accent bar) and src/components/ndayeni/About.tsx (mesh-gradient bg + blurred orbs pattern, ScrollTrigger.create + once:true + cleanup pattern, `.value-item` / `.stat-card` style class-targeted stagger).
- Inspected src/components/ui/card.tsx to confirm Card / CardContent export surface and that arbitrary Tailwind classes (e.g. `bg-dark-card/80`, `border-dark-border/50`, `hover:border-brand/40`) are passed through `cn(...)` correctly.
- Created /home/z/my-project/src/components/ndayeni/WhyNdayeni.tsx implementing:
  - "use client" directive.
  - Imports: gsap, ScrollTrigger (with `if (typeof window !== "undefined")` register guard), `type LucideIcon` from lucide-react, icons { Wrench, Boxes, MapPin, Store, LifeBuoy, ArrowRight }, shadcn Card + CardContent, Button.
  - `SellingPoint` type (`icon: LucideIcon; title: string; description: string`) — no `any` used anywhere.
  - 5 selling points array (Practical Solutions, One Technology Partner, Local Support, Small Business Focus, Ongoing Support) with exact copy specified.
  - `sectionRef` (`<section id="why" aria-labelledby="why-ndayeni-heading" className="relative py-12 sm:py-20 md:py-28">`).
  - Decorative bg: `<div className="absolute inset-0 mesh-gradient" aria-hidden="true" />` + 2 blurred orbs (`bg-brand/4` top-left, `bg-accent/3` bottom-right, both `rounded-full blur-[120px]`).
  - Centered header (eyebrow `text-accent`, H2 with `text-warm-white` + `text-gradient-brand` split, `text-text-muted max-w-2xl mx-auto` subtitle), with matching `id="why-ndayeni-heading"` on the H2.
  - GSAP header fade: `gsap.set(el,{opacity:0,y:30})` then `ScrollTrigger.create({trigger,start:"top 85%",once:true,onEnter:gsap.to({opacity:1,y:0,duration:0.8,ease:"power3.out"})})` + `trigger.kill()` cleanup.
  - Cards wrapped in a `cardsRef` div; GSAP stagger targets `.why-card` querySelectorAll: `gsap.set(items,{opacity:0,y:40})` then `gsap.to(items,{opacity:1,y:0,duration:0.5,stagger:0.1,ease:"power3.out"})` on `start:"top 80%"`.
  - Row 1: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6` (first 3 cards).
  - Row 2: `max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5` (last 2 cards centered).
  - Each card: shadcn `Card` with `h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 hover:-translate-y-1 group overflow-hidden`, top accent bar `<div className="h-[2px] bg-gradient-to-r from-brand to-brand-light opacity-30 group-hover:opacity-80 transition-opacity duration-500" />`, icon in `bg-brand/10` rounded-2xl square (group-hover:scale-110), title `text-warm-white font-bold text-lg` (group-hover:text-brand), description `text-text-muted text-sm leading-relaxed`.
  - Bottom CTA band exactly as specified (paragraph + `bg-gradient-to-r from-brand to-brand-light` Button linking to #contact with ArrowRight that translates on hover).
  - Mobile-first responsive, all decorative elements `aria-hidden="true"`, semantic section with `aria-labelledby`.
- Verified: `bunx tsc --noEmit` shows ZERO errors in WhyNdayeni.tsx (pre-existing errors elsewhere — HeroScene.tsx, contact/route.ts, cloned Ndayeni-Solutions repo, skills examples — are unchanged). `bun run lint` clean (no errors/warnings).

Stage Summary:
- Recreated /home/z/my-project/src/components/ndayeni/WhyNdayeni.tsx as a fully-typed, GSAP-animated, accessible, mobile-first "Why Ndayeni?" section ready to be imported into src/app/page.tsx (e.g. between Hero/Services and About) when the page composition is restored.
- Follows all site conventions established by Services.tsx / About.tsx (dark theme palette, glass cards, ScrollTrigger animations, lucide icons, shadcn Card/Button).
- No type errors, no lint errors in the new file. Component is self-contained and does not require any new dependencies.
- Next action (out of scope for this task): import `<WhyNdayeni />` into src/app/page.tsx and optionally add a `<SectionDivider variant="brand|accent|mixed" />` before it for visual continuity.

---
Task ID: REBUILD-BIZ
Agent: general-purpose
Task: Recreate BusinessSolutions.tsx component

Work Log:
- Read /home/z/my-project/worklog.md to recover project context (prior migration + verification of Ndayeni Solutions site).
- Inspected reference patterns: src/components/ndayeni/Services.tsx (GSAP + ScrollTrigger + Card + Button usage), src/components/ui/button.tsx (variants), src/components/ui/card.tsx (Card/CardContent API).
- Confirmed design-system tokens exist in src/app/globals.css (text-gradient-brand, mesh-gradient, glow-brand, etc.).
- Created /home/z/my-project/src/components/ndayeni/BusinessSolutions.tsx implementing:
  * "use client" directive, TypeScript strict (no `any`), `type LucideIcon` import for icon typing.
  * Discriminated `SolutionCta` type: `variant: "gradient" | "outline"` (each branch carries only the className tokens it needs).
  * `Solution` type with icon, title, tag, accent gradient, accentBg, accentText, intro, bullets[], cta.
  * 3 solution cards (New Office Setup / Small Business IT Support / Home Technology Setup) with exact content, icons (Building2, LifeBuoy, Home), bullet lists, and CTAs matching the spec.
  * Each card: Card with `solution-card` class, top accent bar (h-[2px] gradient, opacity-30 → group-hover:opacity-80), CardContent p-5 sm:p-6 lg:p-8, icon in rounded-2xl tinted square (w-12 h-12 sm:w-14 sm:h-14), scenario tag (text-[10px] uppercase tracking-wider), title (text-warm-white font-bold text-lg sm:text-xl), intro (text-text-muted text-sm), bullet list (space-y-2 mt-4 with Check icon in colored circle), full-width CTA.
  * CTAs: Card 1 gradient (from-brand to-brand-light text-dark-deep), Cards 2 & 3 outline (accent / brand-light). Each CTA is `<a href="#contact">` wrapping `<Button>` with min-h-[44px] touch target.
  * Background: absolute inset-0 with gradient from-dark-deep via-dark-surface/30 to-dark-deep + brand/4 glow (top-right) + accent/3 glow (bottom-left).
  * Header: eyebrow "Business Solutions", H2 with text-gradient-brand "Real Situations", muted subtitle.
  * Bottom note: "Not sure which one fits? Tell us what you need…" link → #contact.
  * GSAP: header uses gsap.set opacity:0 y:30 + ScrollTrigger "top 85%" once → fade/rise 0.8s power3.out. Cards use gsap.set on `.solution-card` (opacity 0, y 30) + ScrollTrigger "top 80%" once → staggered gsap.to (duration 0.5, stagger 0.1). Cleanup kills all triggers.
  * Accessibility: semantic `<section id="solutions" aria-label="Business Solutions">`, aria-hidden on decorative icons/divs, aria-label on CTA anchors, 44px min touch targets, focus-visible styling inherited from Button.
- Ran `bun run lint` → clean (no errors/warnings from active src/).
- Ran `bunx tsc --noEmit` → no TypeScript errors in BusinessSolutions.tsx (pre-existing errors in unrelated files: Ndayeni-Solutions/examples, skills/, src/app/api/contact/route.ts, HeroScene.tsx).

Stage Summary:
- /home/z/my-project/src/components/ndayeni/BusinessSolutions.tsx created and verified (lint clean, types clean).
- Component follows the Ndayeni dark-themed design system exactly (bg-dark-card/80, border-dark-border/50, text-gradient-brand, bg-brand/accent glows) and the project's GSAP + shadcn Card/Button patterns established in Services.tsx.
- Component is not yet wired into src/app/page.tsx — a follow-up task should import and place `<BusinessSolutions />` (e.g. between Services and About) if it should appear in the rendered page.

---
Task ID: REBUILD-CARE
Agent: general-purpose
Task: Recreate CarePlans.tsx component

Work Log:
- Read /home/z/my-project/worklog.md (contained prior migration + verification records; no prior REBUILD-CARE entry).
- Inspected existing patterns: src/components/ndayeni/Services.tsx (GSAP + shadcn Card/Button/Badge usage), About.tsx (header ScrollTrigger pattern), and the design-system utility classes in src/app/globals.css (confirmed presence of mesh-gradient, glow-brand, animate-float, animate-float-slow, text-gradient-brand, text-gradient-accent).
- Reviewed shadcn ui primitives: button.tsx (variants: default/outline/ghost/secondary/...), card.tsx (Card + CardContent, default `flex flex-col gap-6 py-6`), badge.tsx.
- Created /home/z/my-project/src/components/ndayeni/CarePlans.tsx with:
  - "use client" directive, GSAP ScrollTrigger registration guarded for SSR.
  - Typed `Plan` interface + `LucideIcon`-typed icon field (no `any`).
  - 3 plan cards: Basic (User icon, brand-light accent), Business FEATURED (Building2 icon, brand accent, border-brand/40 + glow-brand + lg:scale-[1.03] + "Most Popular" Badge), Business Plus (Server icon, teal/accent accent).
  - Section #care-plans, mesh-gradient bg + 2 floating decorative shapes, centered GSAP-animated header (eyebrow "Ndayeni Care Plans", gradient H2 "Ongoing IT Support Plans", subtitle), 1/2/3-col responsive grid, pricing area with "Pricing on request" + "Based on your setup & number of devices" note (no prices published), full-width min-h-[44px] CTAs per card, bottom CTA band with gradient button.
  - GSAP: header fade-up on scroll (opacity/y, power3.out, 0.8s), plan cards stagger via .plan-card selector (opacity/y, 0.5s, stagger 0.12).
  - Business Plus included item framed as "Critical system monitoring" (NOT "24/7 support") per requirement.
  - Accessibility: aria-labelledby on section, aria-hidden on decorative shapes/icons, 44px touch targets via min-h-[44px], semantic heading hierarchy.
- Verified: `bunx tsc --noEmit --skipLibCheck` shows ZERO errors attributable to CarePlans.tsx (all reported errors are pre-existing in Ndayeni-Solutions clone, examples/, skills/, src/app/api/contact/route.ts, src/components/ndayeni/HeroScene.tsx). `bun run lint` clean for CarePlans.tsx.

Stage Summary:
- CarePlans.tsx recreated at /home/z/my-project/src/components/ndayeni/CarePlans.tsx (~265 lines).
- Strict TypeScript (LucideIcon + Plan interface, no any), passes tsc + eslint.
- Follows site design system exactly (dark palette, glass surfaces, mesh-gradient bg, glow-brand on featured card, gradient text, animate-float decorations).
- Middle "Business" card visually elevated: persistent border-brand/40, glow-brand box-shadow, lg:scale-[1.03], "Most Popular" Badge floating at top edge.
- Prices intentionally omitted — only "Pricing on request / Based on your setup & number of devices".
- Ready to be imported into src/app/page.tsx (e.g. <CarePlans /> between Services and About, or wherever the layout calls for it). Not yet wired into page.tsx — that integration step is out of scope for this rebuild task.
