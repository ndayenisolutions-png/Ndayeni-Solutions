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

---
Task ID: REBUILD-ALL
Agent: main
Task: Full rebuild after environment reset. Redo ALL changes up to the last working point, including images and SMTP. Set up safeguards to prevent future loss.

Work Log:
- Confirmed environment had reset to original migration state (Sep 2) — all today's work gone (components, images, .env, worklog entries)
- Launched 3 parallel subagents to recreate WhyNdayeni, BusinessSolutions, CarePlans components
- Directly rewrote: Navbar (nav links + Request a Quote CTA + z-[60] mobile fix + removed stuck GSAP animation + pointerEvents fix), Hero (two-column layout with What We Handle panel + trust badges), Services (8 services in 3 category accordions, single-open, image header cards), About (grounded founder story + 4-step process Assess/Recommend/Install/Support + updated stats/values), Contact (smart form with customerType radio incl Home/Individual + 10 interest checkboxes), Footer (updated service links + tagline), layout.tsx (metadata + JSON-LD + phone 083 800 6989), page.tsx (new section order, no Projects)
- Added CSS utilities to globals.css: .section-bg-image, .section-bg-overlay, .card-image-header (visible image band)
- Added .text-gradient-teal class (was missing from original, caused invisible hero text)
- Searched 12 image categories via z-ai image-search, downloaded candidates, VLM-verified EACH image for watermarks
- Found that even "Unsplash"-sourced images sometimes carry "Unsplash+" premium watermark — verified each individually
- Final 13 VLM-confirmed watermark-free images: abstract, cctv, repairs, network, techhelp, techtheme, workspace, printer, webdesign, graphicdesign, training, office, home
- Created src/lib/section-images.ts config pointing all components to verified clean images
- Integrated images: Hero bg (abstract), WhyNdayeni bg (techhelp), Services category headers + 8 service cards (image header bands), BusinessSolutions 3 cards (office/itsupport/home), CarePlans bg (itsupport), About bg (techtheme), Contact bg (workspace)
- Re-setup SMTP .env: mail.ndayenisolutions.co.za:587 (the ACTUAL mail server, not smtp.afrihost.co.za which refused STARTTLS). Tested live: mode=production, email sent attempt 1, delivered to info@ndayenisolutions.co.za
- SAFEGUARD: git rm --cached .env (untrack credentials), confirmed .env in .gitignore, git add -A + commit (85a57ae). .env file remains on disk (perms 600) but is NOT tracked by git — credentials protected
- Agent Browser verification:
  - Desktop 1440px: 0 errors, all 7 sections (home/why/services/solutions/care-plans/about/contact), all headings correct, phone 083 800 6989, 11 card images + 5 bg images all loaded ✓
  - Mobile 390px: navbar at top:0 (visible), burger opens + closes via X, contact radio "Home/Individual" label ✓
  - SMTP: live test returned {"ok":true,"mode":"production"}, email delivered ✓

Stage Summary:
- FULL REBUILD COMPLETE. Everything from the lost session is restored: 15 recommendations, Services accordion, Hero two-column, mobile menu fix, 13 VLM-verified watermark-free images, smart contact form, SMTP email delivery (production mode confirmed).
- SAFEGUARD IN PLACE: All work committed to git (commit 85a57ae). .env untracked + gitignored (credentials protected). A future environment reset can be recovered with `git checkout .` or `git reset --hard 85a57ae`.

---
Task ID: TRUST-1
Agent: general-purpose
Task: Create TrustSignals.tsx component (POPIA compliance + security signals)

Work Log:
- Read /home/z/my-project/worklog.md to recover project context (Ndayeni Solutions migration + WhyNdayeni / BusinessSolutions / CarePlans rebuilds + full REBUILD-ALL with images, SMTP, git commit 85a57ae).
- Inspected sibling components for design + GSAP conventions: src/components/ndayeni/WhyNdayeni.tsx (ScrollTrigger.create + once:true + trigger.kill() cleanup pattern, `.why-card` selector stagger) and src/components/ndayeni/CarePlans.tsx (LucideIcon typing, "use client" + window-guard plugin register).
- Confirmed page.tsx imports CarePlans + About at lines 8-9 and renders them at lines 28/30 (TrustSignals will slot between them when integrated).
- Created /home/z/my-project/src/components/ndayeni/TrustSignals.tsx implementing:
  - "use client" directive at top.
  - Imports: `useRef, useEffect` from react; `type LucideIcon` + `ShieldCheck, Lock, FileCheck, BadgeCheck` from lucide-react; `gsap` + `ScrollTrigger` with `if (typeof window !== "undefined")` register guard.
  - `TrustSignal` type (icon: LucideIcon; title: string; description: string; iconText: string) — no `any` used anywhere.
  - `trustSignals` array with the 4 exact items: POPIA Compliant (ShieldCheck, text-brand), Secure by Default (Lock, text-accent), SLA-Backed Support (FileCheck, text-brand-light), Verified & Insured (BadgeCheck, text-brand) — exact copy verbatim.
  - `<section id="trust" ref={sectionRef} aria-label="Trust & compliance signals" className="relative py-10 sm:py-14">` — compact strip, no header.
  - Background: `<div className="absolute inset-0 bg-dark-surface/50" aria-hidden="true" />` + top and bottom gradient borders (`h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent`, both aria-hidden).
  - Inner container `relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` wrapping a `grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4` (2x2 mobile, 1x4 desktop).
  - Each badge is a `<div className="trust-badge glass rounded-xl p-4 sm:p-5 border-brand/10">` containing: icon in `w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-2.5`, title `text-warm-white font-semibold text-xs sm:text-sm`, description `text-text-muted text-[10px] sm:text-xs leading-tight mt-1`.
  - GSAP: useEffect with `gridRef`, `gsap.set(items, { opacity: 0, y: 24 })` then `ScrollTrigger.create({ start: "top 85%", once: true, onEnter: gsap.to({ opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }) })` targeting `.trust-badge` elements via `querySelectorAll<HTMLElement>`. Cleanup returns `trigger.kill()`.
  - Accessibility: semantic section with `aria-label`, `aria-hidden="true"` on background surface + gradient borders + decorative icons, headings use `<h3>` for proper hierarchy within the strip.
- Verified: `bunx tsc --noEmit --skipLibCheck` reports ZERO errors mentioning TrustSignals (pre-existing unrelated errors elsewhere unchanged). `bun run lint` → clean, no errors/warnings.

Stage Summary:
- /home/z/my-project/src/components/ndayeni/TrustSignals.tsx created (~135 lines), fully-typed, GSAP-animated, accessible, mobile-first.
- Compact trust/compliance strip with 4 glass badges (POPIA Compliant, Secure by Default, SLA-Backed Support, Verified & Insured) following the exact design system (bg-dark-surface/50, glass + border-brand/10, text-brand/accent/brand-light icons, 2-col mobile → 4-col sm).
- Passes tsc + eslint. Self-contained, no new dependencies, no `any`.
- Ready to be wired into src/app/page.tsx between `<CarePlans />` and `<About />` (or right before the footer) — integration step is out of scope for this component task.

---
Task ID: TESTIMONIALS-1
Agent: general-purpose
Task: Create Testimonials.tsx component

Work Log:
- Read /home/z/my-project/worklog.md to recover project context (Ndayeni Solutions migrated into active Next.js 16 project on port 3000; site stack = Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + GSAP/ScrollTrigger + Prisma; dark theme with brand-blue/accent-teal palette defined in src/app/globals.css).
- Inspected sibling components for design conventions: src/components/ndayeni/About.tsx (mesh-gradient bg + 2 blurred orbs pattern, ScrollTrigger.create + once:true + trigger.kill() cleanup, .value-card staggered querySelectorAll pattern, glass card + gradient-text header) and src/components/ui/card.tsx (Card + CardContent exports, arbitrary Tailwind classes pass through cn()).
- Created /home/z/my-project/src/components/ndayeni/Testimonials.tsx implementing:
  * "use client" directive at top.
  * Imports: useRef/useEffect from react, Quote + Star from lucide-react, Card + CardContent from @/components/ui/card, gsap + ScrollTrigger (registration guarded with `if (typeof window !== "undefined")`).
  * Strict TypeScript: typed `Testimonial` interface ({ name, role, location, quote, initial }) — no `any` used anywhere.
  * PLACEHOLDER comment immediately above the testimonials array: `// PLACEHOLDER TESTIMONIALS — replace with real client reviews when available.`
  * 3 testimonials (Thabo M. / Sarah N. / David K.) with exact copy, role, location and first-initial avatar (T, S, D) per spec.
  * `<section id="testimonials" aria-labelledby="testimonials-heading" className="relative py-12 sm:py-20 md:py-28">` (semantic + accessible).
  * Background: `<div className="absolute inset-0" aria-hidden="true">` wrapping mesh-gradient + 2 decorative blurred orbs (top-left `bg-brand/4`, bottom-right `bg-accent/3`, both `rounded-full blur-[120px]`).
  * Centered GSAP-animated header (headerRef): eyebrow `text-brand text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4 block` "Client Feedback"; H2 with `text-warm-white` "What Clients " + `text-gradient-brand` "Say About Us" (id="testimonials-heading"); subtitle `text-text-muted max-w-2xl mx-auto` with exact copy.
  * Cards grid (cardsRef): `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6`.
  * Each card: shadcn `Card` with `testimonial-card h-full bg-dark-card/80 backdrop-blur-sm border-dark-border/50 hover:border-brand/40 transition-all duration-500 hover:-translate-y-1 group` (exact className from spec).
  * Each card body: CardContent `p-5 sm:p-6 lg:p-8` containing Quote icon (`text-brand/30 w-10 h-10 mb-4`), 5 gold stars (Star `w-4 h-4 text-yellow-400 fill-yellow-400`) inside a flex with role="img" aria-label="5 out of 5 stars", italic blockquote text `text-warm-white/90 text-sm sm:text-base leading-relaxed italic mb-5`, divider `h-px bg-dark-border/30 mb-4`, author row (avatar circle w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-light with first initial; name `text-warm-white font-semibold text-sm`; role+location `text-text-muted text-xs`).
  * Bottom Google rating badge row: exactly as specified — glass pill with 5 stars, "4.9 / 5" + "from 40+ reviews" + "Leave us a review on Google →" tagline, responsive flex-col sm:flex-row.
  * GSAP animations: header fade-up via gsap.set opacity:0 y:30 + ScrollTrigger.create({trigger, start:"top 85%", once:true, onEnter:gsap.to opacity:1 y:0 duration:0.8 ease:"power3.out"}); cards staggered via gsap.set on `.testimonial-card` (opacity:0 y:40) + ScrollTrigger start:"top 80%" once → gsap.to duration:0.5 stagger:0.1 ease:"power3.out"; both cleaned up via trigger.kill() in useEffect return.
  * All decorative elements marked aria-hidden="true"; avatar decorative; section uses aria-labelledby.
  * Mobile-first responsive throughout (sm:, lg: breakpoints).
- Verified: `bunx tsc --noEmit` reports ZERO TypeScript errors attributable to Testimonials.tsx (pre-existing errors in unrelated files unchanged). `bun run lint` clean (no errors/warnings).

Stage Summary:
- /home/z/my-project/src/components/ndayeni/Testimonials.tsx created (~210 lines), passes TypeScript strict + ESLint clean.
- Component follows the Ndayeni dark-themed design system exactly (bg-dark-card/80, border-dark-border/50, text-gradient-brand, mesh-gradient + bg-brand/bg-accent blurred orbs, glass class on rating badge) and the project's GSAP + shadcn Card patterns established in About.tsx / Services.tsx.
- 3 PLACEHOLDER testimonials with realistic copy and a clearly marked placeholder comment per spec — ready to be swapped for real client reviews when available.
- Bottom trust element (Google rating badge) rendered exactly as specified.
- Component is self-contained and does not require any new dependencies.
- Next action (out of scope for this task): import `<Testimonials />` into src/app/page.tsx (e.g. after BusinessSolutions / CarePlans and before About, or wherever social proof should appear) when the page composition is updated.

---
Task ID: SMS-API
Agent: general-purpose (sub agent)
Task: Build SMS API routes for the Ndayeni Solutions Digital Academy Student Management System (8 route files: students, courses, attendance, assessments, certificate, audit, reports, users).

Work Log:
- Read worklog.md, prisma/schema.prisma, src/lib/academy-auth.ts, src/lib/academy-session.ts, src/lib/db.ts, and existing routes (login, apply, students, users, certificate) to ground the implementation in the actual schema and helper APIs.
- Prisma models confirmed: AcademyUser, Student, Course, Module, Attendance, Assessment, Certificate, AuditLog (SQLite datasource).

Files created / updated (all routes use `export const dynamic = "force-dynamic"`, `import { db } from "@/lib/db"`, `import { getSession } from "@/lib/academy-session"`, and return JSON `{ ok: boolean, ... }`):

1. UPDATED src/app/api/academy/students/route.ts
   - GET: list students with search (q param matches fullName / email / studentNumber / applicationRef / phone via Prisma `contains` — SQLite is case-insensitive for ASCII LIKE) and filters (status, courseId).
   - POST actions:
     - "create": manually create a student (requires fullName, email, program).
     - "update": update any student field (personal, course, education, kin, enrolment, notes, status, progress). Status-driven timestamps (enrolledAt, completedAt) applied automatically.
     - "delete": super/admin only, deletes student (AuditLog.studentId set to null because the FK cascade is SetNull — we pass null and store the deleted student info in `details`).
     - "convert": converts an "accepted" application → "enrolled" student, generating studentNumber `NSA-YYYY-NNNN` via a count-based sequence.
   - Wrote an AuditLog entry on every create/update/delete/convert. On status change, a dedicated `student.status_change` audit is logged showing the from→to transition.
   - Role gating: write actions require `super | admin | admissions | training`; delete additionally requires `super | admin`.

2. CREATED src/app/api/academy/courses/route.ts
   - GET: list all courses with their modules (`include: { modules: { orderBy: { order: "asc" } } }`). Optional `?active=true` filter.
   - POST actions (super/admin only):
     - "create": create a course — enforces unique `code`, requires code/title/description.
     - "update": update any course field (code, title, description, duration, deliveryMethod, entryRequirements, fee, maxStudents, active).
     - "delete": delete a course (cascade-deletes its modules via Prisma relation onDelete: Cascade).
     - "addModule": add a module to a course (requires courseId, title; optional description/duration/order/learningObjectives/active).
     - "updateModule": update a module by id.
     - "deleteModule": delete a module by id.

3. CREATED src/app/api/academy/attendance/route.ts
   - GET (auth): list attendance filtered by `?studentId=` and/or `?date=YYYY-MM-DD` (uses a gte/lte DateTime range for the day, UTC). Includes the related student (id, fullName, studentNumber, email) for display.
   - POST (auth, super/admin/training): create or update an attendance record. Validates `status` against present|absent|excused. Upsert logic: finds the existing record for the same student+day (no unique constraint in schema, so a manual findFirst) and updates it; otherwise creates. Date stored at the start of the day (UTC).

4. CREATED src/app/api/academy/assessments/route.ts
   - GET (auth): list assessments filtered by `?studentId=`. Includes related student (id, fullName, studentNumber, email). Ordered by date desc.
   - POST (auth, super/admin/training): create or update an assessment. Validates `result` against pass|not-yet-competent. If `id` is provided → update existing (only the supplied fields are changed). Otherwise create new (requires studentId, moduleTitle, result; optional date, mark, comments).

5. UPDATED src/app/api/academy/certificate/route.ts
   - GET (PUBLIC, no auth): view a certificate by `?id=` OR `?certificateNumber=`. Returns the certificate or 404.
   - POST (auth, super/admin/admissions):
     - Default "issue" action: issues a certificate for an existing student (studentId required). Defaults signedBy to "Nhlakanipho Ntshangase, Founder & CEO". Sets student status=completed. Generates cert number `NSDA-YYYY-XXXXXX` (6 random alphanumeric chars). Logs `certificate.issue` audit entry. Returns `{ ok: true, certificate, alreadyExists: true }` if a cert already exists for the student.
     - action="manual": manually issue a certificate for a past student (fullName + programName required; optional issueDate, signedBy, studentId, email). Find-or-create student (tries existing studentId, then matches by fullName contains, otherwise creates a minimal "completed" student record). Honors an explicit issueDate. Logs `certificate.manual_issue` audit entry.

6. CREATED src/app/academy/audit/route.ts  (path: /api/academy/audit)
   - GET (auth required): paginated audit logs. Query params: page (default 1), pageSize (default 50, capped at 100), action (substring match), studentId, userId. Returns `{ ok: true, logs, page, pageSize, total, totalPages }`. Uses Promise.all([count, findMany]) for efficiency.

7. CREATED src/app/api/academy/reports/route.ts
   - GET (auth required): returns dashboard stats object with all 8 counts requested:
     - totalApplications: db.student.count() (every Student row originated from an application or manual entry)
     - pendingApplications: status in ["applied","under-review","info-required"]
     - acceptedApplications: status="accepted"
     - rejectedApplications: status="rejected"
     - enrolledStudents: status="enrolled"
     - activeStudents: status="active"
     - completedStudents: status="completed"
     - certificatesIssued: db.certificate.count()
   - All 8 counts run in parallel via Promise.all.

8. UPDATED src/app/api/academy/users/route.ts
   - Preserved existing GET (list users, returns public fields only), POST (create user, super only), DELETE (delete user, super only, cannot delete self).
   - Added `active` to the public user fields selector (was previously omitted — schema has `active Boolean @default(true)`).
   - Refactored POST to dispatch on `action`:
     - action="create" (default when action omitted, keeps backward compatibility): super only, validates email/password/name, prevents duplicate emails, only super can assign role=super.
     - action="update": updates name/role/active. Role gating via assertCanManageUser: super can do anything; users can edit themselves; non-super cannot promote anyone to super. Safety: super cannot demote themselves if they are the only remaining super.
     - action="resetPassword": resets a user's password. Super can reset anyone's; non-super users can reset their own. Validates id + password. Logs `user.reset_password` audit.
   - DELETE: hardened to prevent deleting the only remaining super user (safety against lockout).
   - All create/update/delete/reset actions now write AuditLog entries with descriptive details.

Quality & type-safety notes:
- All 8 routes verified clean against `npx tsc --noEmit` (no errors in any file under src/app/api/academy/).
- Pre-existing TS errors in unrelated files (src/app/api/contact/route.ts `const` assertions, src/components/ndayeni/HeroScene.tsx three.js typing, Ndayeni-Solutions/* and skills/* subdirs) are not in scope of this task and were left untouched.
- Two narrow TS fixes were needed during implementation:
  1. Certificate route: refactored find-or-create student from `let student = null` (TS inferred type `null`-only) into a self-invoked async IIFE that returns `Student`, so the type is narrowed to `Student` for the subsequent property accesses.
  2. Certificate route GET: replaced `let cert = null` (same TS pitfall) with a chained ternary `id ? findUnique : certificateNumber ? findUnique : null`.
  3. Students route: changed `logAudit` opts typing from `studentId?: string` to `studentId?: string | null` so that the delete audit (which logs `studentId: null` because the FK is SetNull on delete) typechecks.

API surface summary (route path → method(s) → action(s)):
- /api/academy/students      GET (list+search+filter) | POST {action: create|update|delete|convert}
- /api/academy/courses       GET (list w/ modules)     | POST {action: create|update|delete|addModule|updateModule|deleteModule}
- /api/academy/attendance   GET (?studentId|?date)    | POST (upsert by student+date)
- /api/academy/assessments   GET (?studentId)          | POST (create OR update by id)
- /api/academy/certificate   GET (?id|?certificateNumber, public) | POST {action?: issue|manual}
- /api/academy/audit         GET (paginated, ?action|?studentId|?userId)
- /api/academy/reports       GET (dashboard stats)
- /api/academy/users         GET | POST {action?: create|update|resetPassword} | DELETE ?id=

Next actions / integration handoff:
- Frontend pages can now consume these endpoints directly. Recommended next step is wiring the admin dashboard pages (students table, course catalog, attendance/assessment capture, certificate viewer + manual issue form) to call these routes.
- Consider adding a Prisma migration / db seed for sample courses & modules so the dashboard has data on first load.
- (Optional) Tighten attendance upsert by adding a `@@unique([studentId, date])` constraint on the Attendance model in a future schema migration — current code does a manual `findFirst` to dedupe by day.

---
Task ID: SMS-POLISH-PLAN
Agent: main
Task: Plan + dispatch 11 SMS polish items (10 listed + welcome letter)

Work Log:
- Read worklog.md, prisma/schema.prisma, src/lib/academy-auth.ts, src/lib/academy-session.ts, src/app/api/academy/{students,certificate}/route.ts, src/app/training/admin/page.tsx (first 120 of 742 lines)
- Confirmed existing SMS architecture:
  * 11 route files under /api/academy/* (login, logout, apply, students, courses, attendance, assessments, certificate, audit, reports, users)
  * Admin page at /training/admin/page.tsx uses `activeView` state with sidebar nav: dashboard, applications, students, courses, attendance, assessments, certificates, users, reports, settings
  * shadcn/ui has sonner.tsx + toaster.tsx (toast infra ready), recharts installed, qrcode installed, nodemailer installed, all radix primitives present
  * Prisma schema has Student/Course/Module/Attendance/Assessment/Certificate/AuditLog/AcademyUser — no schema changes needed for any polish item
- Stage 1 plan: 6 parallel backend subagents (each owns distinct files, no overlap):
  * SMS-BE-1: edit students/route.ts — add GET ?id=X profile detail (returns student + attendances + assessments + certificates + audit logs)
  * SMS-BE-2: edit attendance/route.ts — add POST {action:"bulk"} + edit assessments/route.ts — add GET ?courseId=X gradebook matrix
  * SMS-BE-3: edit certificate/route.ts — add POST {action:"reissue"} + edit reports/route.ts — add monthly trends
  * SMS-BE-4: create auth/forgot-password/route.ts + auth/reset-password/route.ts (HMAC token, no schema change)
  * SMS-BE-5: create export/route.ts (CSV for students/attendance/certificates)
  * SMS-BE-6: install pdfkit + create welcome-letter/route.ts (real PDF download) — also wire into student convert action so the letter becomes available on enrolment
- Stage 2 plan (after Stage 1, parallel frontend components in src/components/academy/*):
  * StudentProfileModal, AttendanceBulkCapture, AssessmentGradebook, AuditLogViewer, UserManagementPanel, ReportsCharts, ForgotPasswordPage, CSVExportButtons, WelcomeLetterButton
- Stage 3 plan: refactor admin/page.tsx — add new views to navItems, render new components, wire Sonner toasts in every CRUD handler
- Stage 4: Agent Browser verify on /training/admin, fix issues, commit each milestone separately, push to git only when local tests pass

Stage Summary:
- Plan locked in. Dispatching Stage 1 (6 parallel backend subagents) now.
- All subagents instructed to: read worklog.md first, append their entry after work, run tsc + lint at end, NOT touch admin/page.tsx or any file outside their assigned scope.
- Existing work fully protected by git commit 7dc718f + isolation of new files.

---
Task ID: SMS-BE-1
Agent: general-purpose (subagent)
Task: Add GET ?id=X student profile detail endpoint with relations + computed fields

Work Log:
- Read /home/z/my-project/worklog.md (last 300 lines) to confirm prior agent work — file already had SMS-BE-* routes (students list/search/filter + POST create/update/delete/convert, certificate issue/manual, audit, reports, users, courses, attendance, assessments) all git-protected at commit 7dc718f. Confirmed scope: edit ONLY src/app/api/academy/students/route.ts, extend GET with ?id=X branch, do NOT touch POST or any other file.
- Read prisma/schema.prisma to confirm Student/Course/Module/Attendance/Assessment/Certificate/AuditLog field names and relation shapes: Attendance.status ∈ {present, absent, excused}; Assessment.result ∈ {pass, not-yet-competent}; Certificate.status ∈ {active, revoked, reissued, replaced}; Student has enrolledAt/trainingStartDate/expectedCompletion DateTime?; AuditLog.timestamp DateTime.
- Read src/lib/academy-session.ts (getSession reads SESSION_COOKIE → verifySessionToken, returns SessionPayload | null). Confirmed auth pattern: `if (!session) return 401` is already used by the existing GET; reused same pattern (no role gating needed for read).
- Read existing src/app/api/academy/students/route.ts (249 lines). Existing GET: builds `where: Record<string, unknown>` from q/status/courseId, returns `{ ok, students }`. Existing POST has create/update/delete/convert actions — NOT touched.
- Edited GET handler: added a top-of-function branch checking `searchParams.get("id")`. When present:
  * `db.student.findUnique({ where: { id }, include: { certificates: true, attendances: { orderBy: { date: "desc" }, take: 50 }, assessments: { orderBy: { date: "desc" }, take: 50 }, auditLogs: { orderBy: { timestamp: "desc" }, take: 30 } } })`
  * 404 with `{ ok: false, error: "Student not found." }` if null.
  * Fetch course via chained ternary (avoids `let x = null` TS-narrowing pitfall noted in prior worklog): `const course = student.courseId ? await db.course.findUnique({ where: { id: student.courseId }, include: { modules: { where: { active: true }, orderBy: { order: "asc" } } } }) : null`.
  * Computed `attendanceRate` = `present / total * 100` rounded to 1 decimal (Math.round(x*1000)/10); 0 if no attendances.
  * Computed `passRate` = `pass / total * 100` rounded to 1 decimal; 0 if no assessments.
  * Computed `certificateNumber` = most recent active cert's number — sorted `student.certificates` (already included) by issueDate desc, filtered to status==="active", first.certificateNumber or null. No extra query.
  * Computed `enrolledDays` = `floor((now - enrolledAt) / 86400000)` or null if no enrolledAt.
  * Computed `expectedCompletionDays` = `floor((expectedCompletion - enrolledAt) / 86400000)` or null if either missing.
  * Merged into a COPY of the Prisma result via spread: `student: { ...student, ...computed }` — does NOT mutate the Prisma object.
  * Returns `{ ok: true, student: {...student, ...computed}, course }`.
- List/search/filter branch is preserved verbatim below the new branch (no behavior change when `?id` is absent).
- Did NOT touch the POST handler, did NOT add new imports, did NOT modify any other file. Reused existing imports: NextRequest/NextResponse, db, getSession, type SessionPayload (SessionPayload is still imported; it remains used by the existing POST handler's `canWrite(session: SessionPayload | null)` helper).
- Ran `bunx tsc --noEmit --skipLibCheck` → ZERO errors mentioning `students/route`.
- Ran `bun run lint` → ZERO errors mentioning `students/route`.
- Ran `curl -s -b "academy_session=test" http://localhost:3000/api/academy/students?id=nonexistent` → returned `{"ok":false,"error":"Not authenticated."}` (401) — route responds correctly; the test cookie is not a valid HMAC token so auth correctly rejects. Confirmed the endpoint is wired into the live dev server.

Stage Summary:
- Files modified: src/app/api/academy/students/route.ts (extended GET handler only; POST untouched; no other files touched).
- API contract: GET /api/academy/students?id=<studentId> (auth required — any authenticated AcademyUser role may view) → 200 `{ ok: true, student: { ...studentFields, certificates[], attendances[≤50 desc], assessments[≤50 desc], auditLogs[≤30 desc], attendanceRate: number, passRate: number, certificateNumber: string|null, enrolledDays: number|null, expectedCompletionDays: number|null }, course: { ...courseFields, modules: Module[] (active only, ordered by order asc) } | null }` | 404 `{ ok: false, error: "Student not found." }` | 401 `{ ok: false, error: "Not authenticated." }`. Existing list contract unchanged: GET /api/academy/students (no `id` param) → `{ ok: true, students: [...] }` with `q`, `status`, `courseId` filters still working.
- tsc: clean (no errors in students/route.ts) | lint: clean (no errors in students/route.ts)

---
Task ID: SMS-BE-4
Agent: general-purpose (subagent)
Task: Create forgot-password + reset-password endpoints (HMAC-signed tokens, no schema change)

Work Log:
- Read worklog.md (recent entries), prisma/schema.prisma (AcademyUser + AuditLog), src/lib/academy-auth.ts (hashPassword/verifyPassword/createSessionToken pattern + SECRET const + base64url.HMAC token format), src/lib/academy-session.ts, src/app/api/academy/login/route.ts (login flow), src/app/api/contact/route.ts (nodemailer SMTP setup — copied host/port/secure/auth/timeouts/tls:rejectUnauthorized pattern verbatim, plus SMTP_FROM_EMAIL/SMTP_USER fallback chain). Checked .env for SMTP_* + ACADEMY_SECRET presence (no secrets printed).
- Created /home/z/my-project/src/app/api/academy/auth/ directory tree with forgot-password/ and reset-password/ subdirs (each gets its own route.ts → Next.js file-based routing).
- FILE 1 — auth/forgot-password/route.ts (POST):
  * Exports `dynamic = "force-dynamic"`.
  * Parses JSON body, extracts email, lowercases + trims; 422 "A valid email is required." on missing/invalid (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  * Always returns `{ ok: true, message: "If an account with that email exists, a reset link has been sent." }` — even on unexpected errors — to prevent email enumeration.
  * Looks up AcademyUser by email. If user exists AND active=true:
    - Builds reset token: `<base64url(json)>.<hmac>` where json = `{ userId, expiresAt: Date.now() + 3600_000 }`, hmac = HMAC-SHA256(SECRET, data) hex. Uses same `ACADEMY_SECRET || "ndayeni-academy-secret-2024"` fallback as academy-auth.ts.
    - Reset URL: `${NEXT_PUBLIC_SITE_URL || "https://ndayenisolutions.co.za"}/training/forgot-password?token=${token}`.
    - Builds HTML + plain-text email body matching the spec template (greeting with user.name, reset URL, 1-hour expiry, ignore-if-not-you line, "— Ndayeni Solutions Digital Academy" signoff). HTML version uses Ndayeni brand styling consistent with the contact route (#c2410c accent, #071515 headings, #f8fafc bg).
    - Sends via cached nodemailer transport built with the SAME settings as src/app/api/contact/route.ts (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD, secure=port===465, connectionTimeout/greetingTimeout/socketTimeout, tls:rejectUnauthorized=false unless SMTP_REQUIRE_VALID_CERT=true). Transporter cached at module scope per worker.
    - try/catch around `transporter.sendMail` — on failure, console.error logs the error, response is STILL `{ ok: true, ... }` (no SMTP error leakage).
    - Writes AuditLog: action="user.password_reset_requested", userId=user.id, details=`Password reset link sent to ${email}`. AuditLog write also wrapped in try/catch (non-fatal).
  * Has GET handler that returns endpoint metadata.
- FILE 2 — auth/reset-password/route.ts (POST):
  * Exports `dynamic = "force-dynamic"`.
  * Exports `verifyResetToken(token: string): { userId: string } | null` — used by the forgot-password PAGE's GET endpoint to validate the token before showing the form. Checks: well-formed `<data>.<sig>`, HMAC signature match, payload has userId:string + expiresAt:number, expiresAt >= Date.now(). Returns null on ANY failure (no distinguishable error to caller).
  * POST parses body { token, password }.
  * Validates password length >= 8 → 422 "Password must be at least 8 characters." (this check runs BEFORE token verification so password validation errors aren't masked by invalid-token errors).
  * Calls `verifyResetToken(token)` — if null, returns 400 "Invalid or expired reset link." (same message for signature mismatch / expiry / malformed — no enumeration).
  * Looks up AcademyUser by userId. If not found or active=false → same 400 "Invalid or expired reset link." (silent rejection — attacker can't tell user existence from token validity).
  * Hashes new password with `hashPassword` from `@/lib/academy-auth` (pbkdf2 — same scheme as login).
  * Updates user.passwordHash via `db.academyUser.update`.
  * Writes AuditLog: action="user.password_reset", userId, details="User reset their password via email link" (try/catch — non-fatal).
  * Returns `{ ok: true, message: "Your password has been reset. You can now log in." }`.
  * Has GET handler that returns endpoint metadata.
- TypeScript strict: no `any` used; body fields checked with `typeof === "string"` before narrowing; ResetPayload typed via interface + Partial<ResetPayload> on the parse-then-narrow path; err in catches is `unknown`.
- Did NOT edit any existing file, did NOT modify schema, did NOT touch admin/page.tsx — within assigned scope only.

Verification (all green):
- `bunx tsc --noEmit --skipLibCheck` filtered to `auth/forgot-password|auth/reset-password` → EMPTY (no TS errors in either new file).
- `bun run lint` filtered to `auth/forgot-password|auth/reset-password` → EMPTY (no lint errors).
- `curl -s -X POST http://localhost:3000/api/academy/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"nonexistent@example.com"}'` → `{"ok":true,"message":"If an account with that email exists, a reset link has been sent."}` (no email enumeration — confirmed).
- `curl -s -X POST http://localhost:3000/api/academy/auth/reset-password -H "Content-Type: application/json" -d '{"token":"garbage","password":"short"}'` → `{"ok":false,"error":"Password must be at least 8 characters."}` (password validation runs first).
- `curl -s -X POST http://localhost:3000/api/academy/auth/reset-password -H "Content-Type: application/json" -d '{"token":"garbage","password":"newpassword123"}'` → `{"ok":false,"error":"Invalid or expired reset link."}` (bad token rejected with the safe generic error).

Stage Summary:
- Files created: src/app/api/academy/auth/forgot-password/route.ts, src/app/api/academy/auth/reset-password/route.ts
- API contracts:
  - POST /api/academy/auth/forgot-password { email: string } → { ok: true, message: "If an account with that email exists, a reset link has been sent." } (ALWAYS — no enumeration; 422 on missing/invalid email with `{ ok: false, error: "A valid email is required." }`)
  - POST /api/academy/auth/reset-password { token: string, password: string } → 200 `{ ok: true, message: "Your password has been reset. You can now log in." }` | 422 `{ ok: false, error: "Password must be at least 8 characters." }` | 400 `{ ok: false, error: "Invalid or expired reset link." }` (covers bad signature, expired, malformed, user-not-found, user-inactive — same message for all)
  - `verifyResetToken(token: string): { userId: string } | null` exported from reset-password/route.ts for the frontend forgot-password PAGE's GET endpoint to validate a token before rendering the form.
- Token format: `<base64url(json { userId, expiresAt })>.<hmac-sha256-hex>` — signed with `ACADEMY_SECRET` (same secret as session tokens in academy-auth.ts). 1-hour TTL. No DB table needed.
- AuditLog entries: `user.password_reset_requested` (forgot-password, only when user exists+active) and `user.password_reset` (reset-password, after successful update).
- tsc: clean (no errors in either file) | lint: clean (no errors in either file)
- Next actions: frontend task should create /training/forgot-password/page.tsx that (1) on GET ?token=... calls a server-side check via verifyResetToken to decide whether to render the form or an "invalid/expired" notice, (2) on form submit POSTs { token, password } to /api/academy/auth/reset-password and shows the success message + a link back to /training/login. May also want toasts via Sonner for invalid/expired + success states.

---
Task ID: SMS-BE-3
Agent: general-purpose (subagent)
Task: Add certificate reissue action + extend reports with trends, status breakdown, top courses, attendance/assessment summaries

Work Log:
- Read /home/z/my-project/worklog.md (last 300 lines) to confirm prior agent work — Stage 1 plan dispatched 6 parallel backend subagents; SMS-BE-1 (student profile GET) and SMS-BE-4 (forgot/reset password) already appended entries. Confirmed scope: edit ONLY src/app/api/academy/certificate/route.ts + src/app/api/academy/reports/route.ts; preserve existing `issue`/`manual` paths and existing 8 dashboard counts verbatim.
- Read prisma/schema.prisma to confirm field names/types: Certificate { id, studentId, programName, studentName, idNumber?, issueDate, certificateNumber (unique), signedBy?, status (default "active") — statuses: active | revoked | reissued | replaced }; Student.enrolledAt/completedAt/trainingStartDate/expectedCompletion are DateTime?; Student.createdAt DateTime (default now); AuditLog { userId?, studentId?, action, details?, timestamp }.
- Read src/lib/academy-session.ts + src/lib/academy-auth.ts — getSession(req) returns SessionPayload | null via cookie → HMAC verify. SessionPayload has userId, email, role, name. Reused existing auth pattern already present in both routes; no new auth code added.
- Read existing src/app/api/academy/certificate/route.ts (197 lines). Existing POST has two branches: `action === "manual"` (returns early at end of block) then default fall-through to `issue`. Existing `generateCertNumber()` helper reused. Existing `DEFAULT_SIGNATORY`/`SIGNATORY_TITLE` constants left untouched. GET handler untouched.
- Edited src/app/api/academy/certificate/route.ts: inserted a new `if (action === "reissue") { ... }` branch BETWEEN the `manual` block's closing `}` and the `// ── issue (default)` comment. The `manual` and `issue` paths are byte-for-byte unchanged.
  * Auth + role gating: same `super | admin | admissions` check as `issue`/`manual`; 403 with descriptive error if not allowed.
  * Body: `const { certificateId, reason } = body as { certificateId?: string; reason?: string }` — destructures from `body` (Next's `req.json()` Promise<any>); explicit type annotation for clarity + avoids any implicit any lint complaints.
  * 422 if `!certificateId`; 404 if cert not found via `db.certificate.findUnique({ where: { id: certificateId } })`.
  * Marks the OLD certificate `status: "revoked"` via `db.certificate.update` — NOT deleted, preserving the audit trail.
  * Generates a NEW cert number via existing `generateCertNumber()` helper; creates a new Certificate row carrying over `programName`, `studentName`, `idNumber`, `signedBy` from the old cert; sets `issueDate: new Date()` and `status: "active"`.
  * Writes AuditLog entry: `action: "certificate.reissue"`, `details: "Reissued certificate ${oldNum} → ${newNum} for ${studentName}. Reason: ${reason || "not specified"}"` — exact format per spec.
  * Returns 200 `{ ok: true, certificate: <new>, oldCertificateNumber: <old num> }`.
- Read existing src/app/api/academy/reports/route.ts (51 lines). Existing GET runs Promise.all of 8 `db.*.count()` queries and returns `{ ok: true, stats: { ...8 counts... } }`. Existing `stats` shape preserved as-is.
- Rewrote src/app/api/academy/reports/route.ts: added module-level helpers `monthKey(d)`, `last12Months()`, `bucketByMonth(dates, months)` and a `ALL_STATUSES` const tuple. Extended GET:
  * Existing 8 counts Promise.all EXPANDED into a single Promise.all of 16 entries — 8 counts + 8 new aggregations: enrolledTrendRows, completedTrendRows, appliedTrendRows, certTrendRows (findMany select-only-date, filtered by `enrolledAt/completedAt/createdAt/issueDate gte elevenMonthsAgo`), studentsWithStatus (findMany select status), studentsWithCourse (findMany where courseId not null select courseId), recentAttendance (findMany where date gte thirtyDaysAgo select status), allAssessments (findMany select result).
  * Used `not: null` Prisma filter for nullable DateTime fields (enrolledAt, completedAt) — Prisma 6 DateTimeNullableFilter accepts it cleanly.
  * trends: 4 arrays (enrollments/completions/applications/certificates), each 12 entries `{ month: "YYYY-MM", count }` oldest-first. Months start at 11 months ago through current month.
  * statusBreakdown: `Record<string, number>` initialized with all 11 schema statuses set to 0 (applied, under-review, info-required, accepted, enrolled, active, completed, rejected, withdrawn, deferred, terminated), then incremented from `studentsWithStatus` scan; unknown statuses also tallied defensively.
  * topCourses: built Map<courseId, count> from `studentsWithCourse`, sorted desc, sliced top 5, then a SINGLE `db.course.findMany({ where: { id: { in: [...] } }, select: { id, title, code } })` (NOT N+1) and zipped into `[{ courseId, title, code, enrolled }]`. Falls back to "Unknown course"/"" if course record missing.
  * attendanceSummary (last 30 days): counts present/absent/excused, computes `rate = present / total * 100` rounded to 1 dp (0 if total=0).
  * assessmentSummary (all-time): counts pass / not-yet-competent, computes `rate = pass / total * 100` rounded to 1 dp (0 if total=0).
  * Final response: `{ ok: true, stats: { ...8 existing counts... }, trends, statusBreakdown, topCourses, attendanceSummary, assessmentSummary }` — existing `stats` shape is byte-for-byte identical; new fields are additive only → backward compatible.
- TypeScript strict compliance: no `any`. body typed via `as { certificateId?: string; reason?: string }` for the reissue branch destructuring. Map.get returns `number | undefined` handled via `?? 0` and `!== undefined` guards. ALL_STATUSES typed as `readonly string[]` via `as const`. No `as any` anywhere. Prisma return types are inferred; no manual casting.
- Did NOT touch any other file. Did NOT modify schema. Did NOT touch admin/page.tsx. Existing `issue`/`manual` paths in certificate/route.ts preserved byte-for-byte. Existing 8 counts + `stats` shape in reports/route.ts preserved byte-for-byte.

Verification (all green):
- `bunx tsc --noEmit --skipLibCheck 2>&1 | grep -E "certificate/route|reports/route"` → EMPTY (no TS errors in either file). Pre-existing TS errors in unrelated files (Ndayeni-Solutions/*, examples/websocket/*, skills/*, src/app/api/contact/route.ts, src/app/api/academy/apply/route.ts, src/app/api/academy/welcome-letter/route.ts, src/app/training/admin/page.tsx, src/app/training/verify/[certificateNumber]/page.tsx, src/components/ndayeni/HeroScene.tsx) are out of scope and left untouched.
- `bun run lint 2>&1 | grep -E "certificate/route|reports/route"` → EMPTY (no lint errors in either file). Full `bun run lint` output is 1 line (`$ eslint .`) — zero warnings/errors anywhere in the repo.

Stage Summary:
- Files modified: src/app/api/academy/certificate/route.ts (added reissue branch only; manual+issue paths unchanged), src/app/api/academy/reports/route.ts (extended GET response with 5 new fields; existing 8 counts + stats shape unchanged).
- New API contracts:
  - POST /api/academy/certificate { action: "reissue", certificateId: string, reason?: string } → 200 `{ ok: true, certificate: <new Certificate>, oldCertificateNumber: string }` | 401 `{ ok: false, error: "Not authenticated." }` | 403 `{ ok: false, error: "Only super/admin/admissions roles can reissue certificates." }` | 404 `{ ok: false, error: "Certificate not found." }` | 422 `{ ok: false, error: "certificateId is required." }`. Old cert is marked `status: "revoked"` (NOT deleted). Audit log `certificate.reissue` written with details `"Reissued certificate <oldNum> → <newNum> for <studentName>. Reason: <reason|not specified>"`.
  - GET /api/academy/reports → `{ ok: true, stats: { ...existing 8 counts unchanged... }, trends: { enrollments: [{month,count} x12], completions: [...], applications: [...], certificates: [...] } (12 months oldest-first), statusBreakdown: { applied, "under-review", "info-required", accepted, enrolled, active, completed, rejected, withdrawn, deferred, terminated }, topCourses: [{ courseId, title, code, enrolled } x≤5 sorted desc], attendanceSummary: { present, absent, excused, rate } (last 30 days), assessmentSummary: { pass, "not-yet-competent", rate } (all-time) }`. Existing `stats` block is byte-for-byte identical to the prior contract.
- tsc: clean (no errors in either file) | lint: clean (no errors in either file)
- Next actions: frontend task should (1) add a "Reissue" button to the Certificates view in /training/admin/page.tsx that POSTs `{ action: "reissue", certificateId, reason }` and shows a Sonner toast on success; (2) wire ReportsCharts component to consume `trends` (4 line charts via recharts), `statusBreakdown` (pie/bar), `topCourses` (horizontal bar), `attendanceSummary` + `assessmentSummary` (gauge or stat cards).

---
Task ID: SMS-BE-5
Agent: general-purpose (subagent)
Task: Create CSV export endpoint for students / attendance / certificates

Work Log:
- Read worklog.md, prisma/schema.prisma, src/lib/academy-session.ts, src/lib/academy-auth.ts, src/lib/db.ts, and existing route patterns in src/app/api/academy/{students,attendance,certificate}/route.ts to ground the implementation in the actual schema, helper APIs, and existing WHERE-clause patterns.
- Prisma models confirmed: Student (27 exportable fields incl. nullable studentNumber/applicationRef/idNumber/gender/nationality/preferredStartDate/preferredMode/highestEducation/employmentStatus/nextOfKin*/address/notes and DateTime? enrolledAt/trainingStartDate/expectedCompletion/completedAt plus non-null fullName/email/phone/program/status, Int progress, DateTime createdAt), Attendance (id, studentId, DateTime date, status, notes?, createdAt), Certificate (id, studentId, programName, studentName, idNumber?, DateTime issueDate, certificateNumber, signedBy?, status, plus required `student` relation).
- Auth + session helper confirmed: getSession(req) reads the academy_session cookie via verifySessionToken, returns SessionPayload | null. Allowed imports per task scope: NextRequest/NextResponse from next/server, db from @/lib/db, getSession from @/lib/academy-session — no other imports used (SessionPayload type not needed because the `if (!session)` early-return narrows the type locally).
- Created /home/z/my-project/src/app/api/academy/export/route.ts implementing:
  * `export const dynamic = "force-dynamic"` at top.
  * `VALID_TYPES = ["students","attendance","certificates"] as const` + `ExportType` union + `isExportType` type guard.
  * `csvEscape(value: unknown): string` helper: null/undefined → ""; booleans → "Yes"/"No"; Date → full ISO; everything else → String(value). Wraps value in double quotes (and doubles embedded `"`) when the string contains a comma, double quote, or newline.
  * `dateOnly(value)` helper → ISO string sliced to first 10 chars (YYYY-MM-DD) or null.
  * `timestamp(value)` helper → full ISO timestamp or null.
  * `buildCsv(headers, rows)` → joins header + escaped rows with `\r\n` line terminator.
  * GET handler order: (1) parse `type` from URL and validate against VALID_TYPES → 422 JSON if missing/invalid (placed BEFORE auth so the verification curl returns 422 for `?type=invalid` — does not leak data since valid type values are public knowledge); (2) getSession(req) → 401 JSON if null; (3) dispatch on type.
  * Students branch: mirrors the students list route WHERE-clause exactly — optional `status` (skipped if "all"), `courseId` (skipped if "all"), `q` (OR over fullName/email/studentNumber/applicationRef/phone contains). findMany orderBy createdAt desc. 27 columns in spec order.
  * Attendance branch: optional `studentId` and `date` (YYYY-MM-DD treated as UTC day-range gte/lte just like the existing attendance route). findMany orderBy date desc. Then fetches students in a single parallel query `db.student.findMany({ where: { id: { in: studentIds } }, select: { id, studentNumber, fullName } })` and builds a Map for O(1) join — no N+1. 8 columns in spec order (Attendance ID, Student ID, Student Number, Student Name, Date, Status, Notes, Created At).
  * Certificates branch: optional `studentId` filter. findMany orderBy issueDate desc with `include: { student: { select: { id, studentNumber, email, idNumber } } }` so Student Number + Email come from the related Student (Certificate model only stores studentName + idNumber). ID Number uses `c.idNumber ?? c.student.idNumber` fallback. 10 columns in spec order (Certificate Number, Student Number, Student Name, Email, ID Number, Program, Issue Date, Signed By, Status, Certificate ID).
  * Date formatting: date-only fields (Preferred Start Date, attendance Date, certificate Issue Date) use `dateOnly()` → YYYY-MM-DD; timestamp fields (Enrolled At, Training Start Date, Expected Completion, Completed At, Created At, attendance Created At) use `timestamp()` → full ISO; null/undefined → empty string via csvEscape; the only boolean-ish field would already be handled by csvEscape's Yes/No branch (no booleans actually appear in any of the three column lists, but the helper is robust).
  * Response: `return new NextResponse(csv, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": \`attachment; filename="${type}-export-${today}.csv"\`, "Cache-Control": "no-store, no-cache, must-revalidate" } })` — uses NextResponse constructor directly (NOT NextResponse.json) per spec. Filename uses today's date in YYYY-MM-DD format.
- Verification:
  * `bunx tsc --noEmit --skipLibCheck 2>&1 | grep "export/route"` → empty (zero TypeScript errors in the new file; pre-existing errors in apply/route.ts, welcome-letter/route.ts, admin/page.tsx, HeroScene.tsx, contact/route.ts, and skills/* subdirs untouched and out of scope).
  * `bun run lint 2>&1 | grep "export/route"` → empty (ESLint clean for the new file; `bun run lint` overall returns zero warnings/errors).
  * `curl -s "http://localhost:3000/api/academy/export?type=invalid"` → `{"ok":false,"error":"type must be one of: students, attendance, certificates."}` with HTTP 422.
  * `curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/academy/export?type=students"` (no cookie) → HTTP 401 (auth still protects the actual CSV data — type validation happens first but data export does not).
  * `curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/academy/export"` (no type) → HTTP 422.

Stage Summary:
- Files created: src/app/api/academy/export/route.ts (~256 lines, single GET handler).
- API contract: GET /api/academy/export?type=<students|attendance|certificates>&<filters> → CSV file download (Content-Type: text/csv; charset=utf-8, Content-Disposition: attachment; filename="<type>-export-YYYY-MM-DD.csv", Cache-Control: no-store). Auth via academy_session cookie (any authenticated role can export; 401 if absent). 422 JSON if `type` is missing or not one of the three allowed values. Optional filters: students → status, courseId, q (search across fullName/email/studentNumber/applicationRef/phone); attendance → studentId, date (YYYY-MM-DD, treated as UTC day-range); certificates → studentId. CSV escaping: cells containing `,`/`"`/`\n` are wrapped in double quotes with embedded `"` doubled; `\r\n` line terminator; first row is the header. Date cells: date-only fields formatted as YYYY-MM-DD, timestamp fields as full ISO, null/undefined as empty string, booleans as Yes/No.
- Students CSV columns (27): Student Number, Application Ref, Full Name, Email, Phone, ID Number, Gender, Nationality, Status, Program, Course ID, Preferred Start Date, Preferred Mode, Highest Education, Employment Status, Enrolled At, Training Start Date, Expected Completion, Completed At, Progress %, Next of Kin Name, Next of Kin Phone, Next of Kin Email, Next of Kin Relationship, Address, Notes, Created At.
- Attendance CSV columns (8): Attendance ID, Student ID, Student Number, Student Name, Date, Status, Notes, Created At. (Student Number + Student Name are joined via a single parallel `db.student.findMany({ where: { id: { in: studentIds } } })` query and an in-memory Map — no N+1.)
- Certificates CSV columns (10): Certificate Number, Student Number, Student Name, Email, ID Number, Program, Issue Date, Signed By, Status, Certificate ID. (Student Number + Email come from the related Student via Prisma `include: { student: { select: {...} } }`; ID Number falls back from cert.idNumber to student.idNumber.)
- tsc: clean (no errors in src/app/api/academy/export/route.ts) | lint: clean (zero warnings/errors).

---
Task ID: SMS-BE-2
Agent: general-purpose (subagent)
Task: Add bulk attendance POST action + gradebook matrix GET endpoint

Work Log:
- Read worklog.md (last 110 lines for SMS-POLISH-PLAN context), prisma/schema.prisma, src/app/api/academy/attendance/route.ts, src/app/api/academy/assessments/route.ts, src/lib/academy-session.ts, src/lib/academy-auth.ts, src/app/api/academy/students/route.ts (for logAudit pattern), tsconfig.json, eslint.config.mjs.
- Confirmed scope: edit ONLY attendance/route.ts and assessments/route.ts. Existing single-record/`?studentId=` paths must remain 100% unchanged.
- Edited attendance/route.ts POST:
  * Added `action` to the destructured body fields (additive; existing single-record path untouched).
  * Inserted new `if (action === "bulk")` branch BEFORE the existing single-record validation, with its own `return`.
  * Bulk branch: validates date is a parseable YYYY-MM-DD string (regex + `new Date()` NaN check); rejects with 422 if missing/invalid.
  * Validates `records` is a non-empty array ≤200 entries (422 otherwise).
  * For each record: skips + collects reasons for missing studentId, invalid status (not in `present|absent|excused`).
  * Batch-validates student existence via single `db.student.findMany({ where: { id: { in: validIds } }})` — missing students get skipped with reason "Student not found."
  * Performs all upserts inside `db.$transaction(async (tx) => {…})` — finds existing records for studentId+date range, updates if found, creates if not.
  * Writes ONE audit log entry inside the same transaction: `attendance.bulk` with details `Bulk attendance for {date}: {n} records ({present} present, {absent} absent, {excused} excused)` and `userId: session.userId`.
  * Returns `{ ok: true, saved: <count>, skipped: [{ studentId: string|null, reason }] }`.
  * Existing single-record path (no `action` field) is preserved verbatim — backward compatible.
- Edited assessments/route.ts GET:
  * Added `courseId` query param read alongside existing `studentId`.
  * Inserted `if (courseId) {…}` branch BEFORE the existing `studentId` where-clause branch, with its own `return`.
  * Fetches course with `include: { modules: { where: { active: true }, orderBy: { order: "asc" } } }}`; 404 if not found.
  * Fetches all students with `courseId` matching and `status in ["enrolled","active","completed"]`, ordered by fullName asc, projecting `{ id, fullName, studentNumber, email, status, progress }`.
  * Single `db.assessment.findMany({ where: { studentId: { in: studentIds } } })` fetches all relevant assessments.
  * Builds matrix per student: initializes `cells[moduleTitle] = null` for every active module, then fills in the latest assessment (sort desc by `date.getTime()`, first occurrence per `moduleTitle` wins) with `{ result, mark, date: ISOString, comments }`.
  * Summary: `totalStudents`, `totalModules`, `totalCells = totalStudents * totalModules`, `competentCells` (cells where `result === "pass"`), `passRate = Math.round((competentCells / totalCells) * 100)` (0 when no cells).
  * Existing `?studentId=` behavior (no `courseId` param) is preserved verbatim — backward compatible.
- Style notes: matched existing file conventions (function declarations, comment dividers, `Record<string, unknown>` where clause typing, no new imports). No `any` declarations introduced; relied on the existing file's implicit typing from `req.json()` (which `tsconfig.noImplicitAny:false` and `eslint @typescript-eslint/no-explicit-any:off` permit, identical to students/route.ts).

Stage Summary:
- Files modified: src/app/api/academy/attendance/route.ts, src/app/api/academy/assessments/route.ts
- New API contracts:
  - POST /api/academy/attendance { action: "bulk", date, records: [{studentId, status, notes?}] } → { ok, saved, skipped: [{studentId, reason}] }
  - GET /api/academy/assessments?courseId=<id> → { ok, course, students, modules, matrix: [{student, cells: {moduleTitle: {result, mark, date, comments} | null}}], summary: {totalStudents, totalModules, passRate, competentCells, totalCells} }
- tsc: clean (no errors in attendance/route.ts or assessments/route.ts; pre-existing errors in apply/route.ts, contact/route.ts, admin/page.tsx are out of scope) | lint: clean (no errors in attendance/route.ts or assessments/route.ts)

---
Task ID: SMS-BE-3
Agent: general-purpose (subagent)
Task: Add certificate reissue action + extend reports with trends, status breakdown, top courses, attendance/assessment summaries

Work Log:
- Read /home/z/my-project/worklog.md (last 300 lines) to confirm prior agent work — Stage 1 plan dispatched 6 parallel backend subagents; SMS-BE-1 (student profile GET), SMS-BE-2 (attendance bulk + assessments gradebook), and SMS-BE-4 (forgot/reset password) already appended entries. Confirmed scope: edit ONLY src/app/api/academy/certificate/route.ts + src/app/api/academy/reports/route.ts; preserve existing `issue`/`manual` paths and existing 8 dashboard counts verbatim.
- Read prisma/schema.prisma to confirm field names/types: Certificate { id, studentId, programName, studentName, idNumber?, issueDate, certificateNumber (unique), signedBy?, status (default "active") — statuses: active | revoked | reissued | replaced }; Student.enrolledAt/completedAt/trainingStartDate/expectedCompletion are DateTime?; Student.createdAt DateTime (default now); AuditLog { userId?, studentId?, action, details?, timestamp }.
- Read src/lib/academy-session.ts + src/lib/academy-auth.ts — getSession(req) returns SessionPayload | null via cookie → HMAC verify. SessionPayload has userId, email, role, name. Reused existing auth pattern already present in both routes; no new auth code added.
- Read existing src/app/api/academy/certificate/route.ts (197 lines). Existing POST has two branches: `action === "manual"` (returns early at end of block) then default fall-through to `issue`. Existing `generateCertNumber()` helper reused. Existing `DEFAULT_SIGNATORY`/`SIGNATORY_TITLE` constants left untouched. GET handler untouched.
- Edited src/app/api/academy/certificate/route.ts: inserted a new `if (action === "reissue") { ... }` branch BETWEEN the `manual` block's closing `}` and the `// ── issue (default)` comment. The `manual` and `issue` paths are byte-for-byte unchanged.
  * Auth + role gating: same `super | admin | admissions` check as `issue`/`manual`; 403 with descriptive error if not allowed.
  * Body: `const { certificateId, reason } = body as { certificateId?: string; reason?: string }` — destructures from `body` (Next's `req.json()` Promise<any>); explicit type annotation for clarity + avoids any implicit any lint complaints.
  * 422 if `!certificateId`; 404 if cert not found via `db.certificate.findUnique({ where: { id: certificateId } })`.
  * Marks the OLD certificate `status: "revoked"` via `db.certificate.update` — NOT deleted, preserving the audit trail.
  * Generates a NEW cert number via existing `generateCertNumber()` helper; creates a new Certificate row carrying over `programName`, `studentName`, `idNumber`, `signedBy` from the old cert; sets `issueDate: new Date()` and `status: "active"`.
  * Writes AuditLog entry: `action: "certificate.reissue"`, `details: "Reissued certificate ${oldNum} → ${newNum} for ${studentName}. Reason: ${reason || "not specified"}"` — exact format per spec.
  * Returns 200 `{ ok: true, certificate: <new>, oldCertificateNumber: <old num> }`.
- Read existing src/app/api/academy/reports/route.ts (51 lines). Existing GET runs Promise.all of 8 `db.*.count()` queries and returns `{ ok: true, stats: { ...8 counts... } }`. Existing `stats` shape preserved as-is.
- Rewrote src/app/api/academy/reports/route.ts: added module-level helpers `monthKey(d)`, `last12Months()`, `bucketByMonth(dates, months)` and an `ALL_STATUSES` const tuple. Extended GET:
  * Existing 8 counts Promise.all EXPANDED into a single Promise.all of 16 entries — 8 counts + 8 new aggregations: enrolledTrendRows, completedTrendRows, appliedTrendRows, certTrendRows (findMany select-only-date, filtered by `enrolledAt/completedAt/createdAt/issueDate gte elevenMonthsAgo`), studentsWithStatus (findMany select status), studentsWithCourse (findMany where courseId not null select courseId), recentAttendance (findMany where date gte thirtyDaysAgo select status), allAssessments (findMany select result).
  * Used `not: null` Prisma filter for nullable DateTime fields (enrolledAt, completedAt) — Prisma 6 DateTimeNullableFilter accepts it cleanly (tsc verified).
  * trends: 4 arrays (enrollments/completions/applications/certificates), each 12 entries `{ month: "YYYY-MM", count }` oldest-first. Months start at 11 months ago through current month.
  * statusBreakdown: `Record<string, number>` initialized with all 11 schema statuses set to 0 (applied, under-review, info-required, accepted, enrolled, active, completed, rejected, withdrawn, deferred, terminated), then incremented from `studentsWithStatus` scan; unknown statuses also tallied defensively.
  * topCourses: built Map<courseId, count> from `studentsWithCourse`, sorted desc, sliced top 5, then a SINGLE `db.course.findMany({ where: { id: { in: [...] } }, select: { id, title, code } })` (NOT N+1) and zipped into `[{ courseId, title, code, enrolled }]`. Falls back to "Unknown course"/"" if course record missing.
  * attendanceSummary (last 30 days): counts present/absent/excused, computes `rate = present / total * 100` rounded to 1 dp (0 if total=0).
  * assessmentSummary (all-time): counts pass / not-yet-competent, computes `rate = pass / total * 100` rounded to 1 dp (0 if total=0).
  * Final response: `{ ok: true, stats: { ...8 existing counts... }, trends, statusBreakdown, topCourses, attendanceSummary, assessmentSummary }` — existing `stats` shape is byte-for-byte identical; new fields are additive only → backward compatible.
- TypeScript strict compliance: no `any` used anywhere (and no `as any`). body typed via `as { certificateId?: string; reason?: string }` for the reissue branch destructuring. Map.get returns `number | undefined` handled via `?? 0` and `!== undefined` guards. ALL_STATUSES typed as `readonly string[]` via `as const`. Prisma return types are inferred; no manual casting.
- Did NOT touch any other file. Did NOT modify schema. Did NOT touch admin/page.tsx. Existing `issue`/`manual` paths in certificate/route.ts preserved byte-for-byte. Existing 8 counts + `stats` shape in reports/route.ts preserved byte-for-byte.

Verification (all green):
- `bunx tsc --noEmit --skipLibCheck 2>&1 | grep -E "certificate/route|reports/route"` → EMPTY (no TS errors in either file). Pre-existing TS errors in unrelated files (Ndayeni-Solutions/*, examples/websocket/*, skills/*, src/app/api/contact/route.ts, src/app/api/academy/apply/route.ts, src/app/api/academy/welcome-letter/route.ts, src/app/training/admin/page.tsx, src/app/training/verify/[certificateNumber]/page.tsx, src/components/ndayeni/HeroScene.tsx) are out of scope and left untouched.
- `bun run lint 2>&1 | grep -E "certificate/route|reports/route"` → EMPTY (no lint errors in either file). Full `bun run lint` output is 1 line (`$ eslint .`) — zero warnings/errors anywhere in the repo.

Stage Summary:
- Files modified: src/app/api/academy/certificate/route.ts (added reissue branch only; manual+issue paths unchanged), src/app/api/academy/reports/route.ts (extended GET response with 5 new fields; existing 8 counts + stats shape unchanged).
- New API contracts:
  - POST /api/academy/certificate { action: "reissue", certificateId: string, reason?: string } → 200 `{ ok: true, certificate: <new Certificate>, oldCertificateNumber: string }` | 401 `{ ok: false, error: "Not authenticated." }` | 403 `{ ok: false, error: "Only super/admin/admissions roles can reissue certificates." }` | 404 `{ ok: false, error: "Certificate not found." }` | 422 `{ ok: false, error: "certificateId is required." }`. Old cert is marked `status: "revoked"` (NOT deleted). Audit log `certificate.reissue` written with details `"Reissued certificate <oldNum> → <newNum> for <studentName>. Reason: <reason|not specified>"`.
  - GET /api/academy/reports → `{ ok: true, stats: { ...existing 8 counts unchanged... }, trends: { enrollments: [{month,count} x12], completions: [...], applications: [...], certificates: [...] } (12 months oldest-first), statusBreakdown: { applied, "under-review", "info-required", accepted, enrolled, active, completed, rejected, withdrawn, deferred, terminated }, topCourses: [{ courseId, title, code, enrolled } x≤5 sorted desc], attendanceSummary: { present, absent, excused, rate } (last 30 days), assessmentSummary: { pass, "not-yet-competent", rate } (all-time) }`. Existing `stats` block is byte-for-byte identical to the prior contract.
- tsc: clean (no errors in either file) | lint: clean (no errors in either file)
- Next actions: frontend task should (1) add a "Reissue" button to the Certificates view in /training/admin/page.tsx that POSTs `{ action: "reissue", certificateId, reason }` and shows a Sonner toast on success; (2) wire ReportsCharts component to consume `trends` (4 line charts via recharts), `statusBreakdown` (pie/bar), `topCourses` (horizontal bar), `attendanceSummary` + `assessmentSummary` (gauge or stat cards).


---
Task ID: SMS-BE-6
Agent: general-purpose (subagent)
Task: Install pdfkit + create welcome letter PDF generator + download endpoint

Work Log:
- Read worklog.md (last ~160 lines), prisma/schema.prisma, src/lib/academy-session.ts, src/lib/academy-auth.ts, src/app/api/academy/students/route.ts, src/app/api/academy/certificate/route.ts, package.json to ground the implementation in the existing SMS architecture (AcademyUser/Student/Course/Module/Certificate/AuditLog models; getSession(req) cookie auth; db singleton; DEFAULT_SIGNATORY="Nhlakanipho Ntshangase" reused as the welcome letter signatory).
- Installed `pdfkit@0.20.2` + `@types/pdfkit@0.17.6` via `bun add pdfkit @types/pdfkit` (16 packages added).
- Created src/lib/welcome-letter.ts:
  * Exports `interface WelcomeLetterStudent` (fullName/studentNumber/email/phone/address/program/courseId/preferredStartDate/preferredMode/enrolledAt/expectedCompletion/nextOfKinName/nextOfKinPhone) and `async function generateWelcomeLetterPdf(student): Promise<Buffer>`.
  * Uses `import PDFDocument from "pdfkit"` (esModuleInterop=true makes the default import work cleanly).
  * A4 portrait, 50pt margins; Helvetica + Helvetica-Bold fonts; brand navy #1e3a5f for headings, #0f172a for body, #64748b gray for subheading/footer, #cbd5e1 for the horizontal rule.
  * Body text rendered with `lineGap: 3` (≈1.4 line spacing on 11pt); bullets with `lineGap: 2`.
  * Date formatted via `toLocaleDateString("en-ZA", { day:"numeric", month:"long", year:"numeric" })` → "22 September 2025". First name extracted via `fullName.trim().split(/\s+/)[0]`.
  * Buffer collection: subscribes to `doc.on("data", c => chunks.push(Buffer.from(c)))` and resolves on `doc.on("end", ...)`; rejects on `doc.on("error", ...)`; calls `doc.end()` last.
  * Renders all spec content verbatim: letterhead, subheading, horizontal rule, right-aligned date, student block (with conditional Student No + address), greeting, welcome paragraph, PROGRAMME DETAILS / WHAT TO EXPECT / WHAT TO BRING ON YOUR FIRST DAY / CONTACT DETAILS sections, closing, "Warm regards," + 30pt signature gap (`doc.y += 30`), then signatory block (Nhlakanipho Ntshangase / Founder & CEO / Ndayeni Solutions Digital Academy), then the 2-line centered 9pt gray footer.
  * Initial implementation pinned the footer to `doc.page.height - 60` via absolute (x,y) coords — but that pushed the footer onto page 2 because the body filled page 1 past that y. Refactored to flow the footer naturally after the signatory block (`moveDown(0.5)` + centered text), which keeps the entire letter on a single A4 page (verified with pdftotext + pdfinfo → 1 page).
  * Sets PDF metadata (Title/Author/Subject/Creator).
- Created src/app/api/academy/welcome-letter/route.ts:
  * `export const dynamic = "force-dynamic"`; imports NextRequest/NextResponse, db, getSession, generateWelcomeLetterPdf.
  * GET /api/academy/welcome-letter?studentId=<id>:
    - 401 JSON `{ ok:false, error:"Not authenticated." }` if no valid session.
    - 422 JSON `{ ok:false, error:"studentId query parameter is required." }` if studentId missing.
    - 404 JSON if student not found.
    - 403 JSON `{ ok:false, error:"Welcome letter is only available for enrolled students." }` if student.status is NOT in {enrolled, active, completed} — enforces the "once enrolled" rule.
    - Generates the PDF via `generateWelcomeLetterPdf(...)`.
    - Writes an AuditLog: action="welcome_letter.download", userId=session.userId, studentId=student.id, details="Downloaded welcome letter for ${student.fullName}".
    - Returns the PDF as `new NextResponse(body, { status:200, headers:{ "Content-Type":"application/pdf", "Content-Disposition":'attachment; filename="welcome-letter-<studentNumber|id>.pdf"', "Cache-Control":"no-store, no-cache, must-revalidate" } })`.
  * TS-strict workaround: Buffer<ArrayBufferLike> is not assignable to NextResponse's BodyInit under TS 5.9 (BufferSource now requires ArrayBufferView<ArrayBuffer> specifically). Resolved by copying the bytes into a fresh `new Uint8Array(pdfBuffer)` (Uint8Array<ArrayBuffer>), which is type-safe and copies only a few KB. No `any`/`as unknown as` casts used.
- Verified:
  * `bun pm ls | grep -i pdfkit` → `@types/pdfkit@0.17.6` and `pdfkit@0.20.2` listed.
  * `bunx tsc --noEmit --skipLibCheck 2>&1 | grep -E "welcome-letter"` → EMPTY (clean).
  * `bun run lint 2>&1 | grep -E "welcome-letter"` → EMPTY (clean).
  * `curl -s "http://localhost:3000/api/academy/welcome-letter"` → `{"ok":false,"error":"Not authenticated."}` (HTTP 401, not 500).
  * dev.log shows `GET /api/academy/welcome-letter 401 in 112ms (compile: 105ms, render: 7ms)` — endpoint compiled cleanly, no pdfkit errors.
  * End-to-end local test (via a throwaway script, since deleted): generated two sample PDFs (with/without studentNumber + address) and confirmed via `pdfinfo` both are 1-page A4 PDFs, and via `pdftotext -layout` confirmed all spec text (letterhead, subheading, date, student block, greeting, welcome paragraph, all 4 sections, contact bullets, closing, 30pt-gap signature block, and the 2-line footer) renders verbatim with correct alignment.

Stage Summary:
- Files created: src/lib/welcome-letter.ts (PDF generator + WelcomeLetterStudent interface), src/app/api/academy/welcome-letter/route.ts (GET endpoint).
- Dependencies added: pdfkit@0.20.2, @types/pdfkit@0.17.6.
- API contract: GET /api/academy/welcome-letter?studentId=<id> → 200 PDF file download (Content-Type: application/pdf, Content-Disposition: attachment; filename="welcome-letter-<studentNumber|id>.pdf", Cache-Control: no-store). Auth required (401), studentId required (422), student must exist (404), student.status must be enrolled|active|completed (403 otherwise — enforces the "once enrolled" rule). Writes a `welcome_letter.download` AuditLog entry on every successful download.
- Exported helper: `generateWelcomeLetterPdf(student: WelcomeLetterStudent): Promise<Buffer>` in src/lib/welcome-letter.ts — pure, testable, reusable (e.g. can be called from the student "convert" action later to email the letter on enrolment).
- tsc: clean (no errors in welcome-letter files) | lint: clean (no warnings/errors in welcome-letter files)
