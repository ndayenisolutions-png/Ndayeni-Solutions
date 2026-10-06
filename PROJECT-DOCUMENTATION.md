# Ndayeni Solutions Website — Project Document

**Version:** 1.0  
**Date:** 22 September 2026  
**Author:** Development Team  
**Repository:** https://github.com/ndayenisolutions-png/Ndayeni-Solutions  
**Live URL:** https://www.ndayenisolutions.co.za  
**Admin URL:** https://www.ndayenisolutions.co.za/training/admin  

---

## 1. Project Overview

Ndayeni Solutions is a Midrand-based South African IT services company founded in 2023 by Nhlakanipho Ntshangase. This project is the company's public website + two backend management systems:

1. **Marketing Website** — public-facing site with 9 service pages, vacancies/careers page, contact form, FAQ, legal pages (Privacy Policy + Terms of Service), and SEO infrastructure
2. **Student Management System (SMS)** — a digital academy admin for managing students, courses, attendance, assessments, certificates, and reports
3. **Vacancies Admin** — a standalone careers management system for publishing job postings

The site serves small businesses and homes across South Africa with services including IT support, computer repairs, networking, CCTV, web design, graphic design, digital automation, and digital skills training.

---

## 2. Technology Stack

### Core Framework
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.1+ | React framework with App Router, Server Components, API routes |
| **React** | 19.0.0+ | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript (strict mode enabled) |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **shadcn/ui** | New York style | Component library built on Radix UI primitives |

### Backend & Database
| Technology | Version | Purpose |
|---|---|---|
| **Prisma ORM** | 6.11.1+ | Database ORM with PostgreSQL (Supabase) |
| **Supabase** | — | PostgreSQL database hosting (pooler + direct connection) |
| **nodemailer** | 9.1.1+ | SMTP email sending (mail.ndayenisolutions.co.za:587) |
| **pdfkit** | 0.20.2 | Server-side PDF generation (welcome letters) |
| **qrcode** | 1.5.4 | QR code generation (certificate verification) |

### Frontend Libraries
| Technology | Version | Purpose |
|---|---|---|
| **GSAP** | 3.15.0+ | Scroll-triggered animations (entrance animations on sections) |
| **Recharts** | 2.15.4+ | Charts (reports dashboard: line, bar, pie charts) |
| **lucide-react** | 0.525.0+ | Icon library |
| **framer-motion** | 12.23.2 | *(Installed but no longer imported — removed from bundle via tree-shaking)* |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Vercel** | Hosting + auto-deploy on GitHub push + edge CDN + Web Analytics |
| **GitHub** | Source control (private repo: ndayenisolutions-png/Ndayeni-Solutions) |
| **Afrihost** | DNS management (ndayenisolutions.co.za domain) |
| **Mail server** | mail.ndayenisolutions.co.za:587 (SMTP with STARTTLS) |

### Development Tools
| Tool | Purpose |
|---|---|
| **Bun** | Package manager + JS runtime |
| **ESLint** | Code linting |
| **Turbopack** | Next.js dev server bundler |

---

## 3. Architecture

### Application Structure
```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (client component)
│   ├── layout.tsx                # Root layout (metadata, fonts, JSON-LD, Toaster, Analytics)
│   ├── globals.css              # Global styles + Tailwind + design tokens
│   ├── sitemap.ts               # Dynamic sitemap (16 entries)
│   ├── privacy-policy/          # POPIA privacy policy page
│   ├── terms/                   # Terms of Service page
│   ├── services/                # 9 service landing pages + index
│   ├── vacancies/               # Public vacancies page + detail page + admin
│   ├── training/                # Academy: landing, apply, admin (SMS), certificate, verify, forgot-password
│   └── api/                     # API routes
│       ├── academy/             # SMS API (17 route files)
│       └── contact/             # Contact form API
├── components/
│   ├── ndayeni/                 # Public site components (14 files)
│   ├── academy/                 # Admin/SMS components (11 files)
│   └── ui/                      # shadcn/ui primitives (44 files)
├── lib/                         # Shared libraries
│   ├── academy-auth.ts          # Authentication (PBKDF2, HMAC sessions, password validation)
│   ├── academy-session.ts       # Session extraction from cookies
│   ├── db.ts                    # Prisma client
│   ├── rate-limit.ts            # In-memory rate limiter
│   ├── welcome-letter.ts        # PDF generation logic
│   ├── section-images.ts        # Image path configuration
│   └── utils.ts                 # Utility functions (cn class merger)
└── hooks/
    └── use-toast.ts             # Toast notification hook
```

### Design System
- **Theme:** Dark mode (primary background: `#071515` / `bg-dark-deep`)
- **Brand colors:** Navy `#1e3a5f` (brand), Teal `#14b8a6` (accent/brand-light)
- **Typography:** Inter (sans-serif) + Space Grotesk (mono) via `next/font`
- **Glassmorphism:** `.glass` and `.glass-strong` utility classes (blur scoped to desktop only via `@media (hover: hover) and (pointer: fine)`)
- **Fonts on PDF:** Helvetica 11pt body, Helvetica-Bold 14pt headings, 9pt footer

---

## 4. Database Schema

**Provider:** Supabase (PostgreSQL)  
**ORM:** Prisma 6.x  
**Schema file:** `prisma/schema.prisma`

### Models

| Model | Description | Key Fields |
|---|---|---|
| **User** | Marketing site user (unused in production) | id, email, name |
| **Post** | Blog posts (unused) | id, title, content |
| **AcademyUser** | Admin/staff accounts | id, email, passwordHash (PBKDF2), name, role (super/admin/admissions/training/readonly), active, createdAt |
| **Student** | Student/applicant records | id, studentNumber, applicationRef, fullName, email, phone, idNumber, dateOfBirth, gender, nationality, address, selectedCourses, courseId, preferredStartDate, preferredMode, highestEducation, employmentStatus, nextOfKin*, status (applied→enrolled→completed), progress, notes, enrolledAt, completedAt, certificates, attendances, assessments, auditLogs |
| **Course** | Training courses | id, code (unique), title, description, duration, deliveryMethod, entryRequirements, fee, active, maxStudents, modules |
| **Module** | Course modules | id, courseId, title, description, duration, order, learningObjectives, active |
| **Attendance** | Attendance records | id, studentId, date, status (present/absent/excused), notes |
| **Assessment** | Assessment records | id, studentId, moduleTitle, date, result (pass/not-yet-competent), mark, comments |
| **Certificate** | Issued certificates | id, studentId, programName, studentName, idNumber, issueDate, certificateNumber (unique), signedBy, status (active/revoked/reissued) |
| **AuditLog** | Audit trail | id, userId, studentId, action, details, timestamp |
| **Vacancy** | Job postings | id, title, department, location, employmentType, description, responsibilities, requirements, benefits, closingDate, howToApply, status (draft/active), createdAt, updatedAt |

### Student Status Flow
```
applied → under-review → info-required → accepted → enrolled → active → completed
                                              ↘ rejected
                                              ↘ withdrawn
                                              ↘ deferred
```

---

## 5. Routes & Pages

### Public Pages (20 routes)

| Route | Type | Description |
|---|---|---|
| `/` | Client | Homepage with 12 sections (Hero, WhyNdayeni, Services, BusinessSolutions, CarePlans, Testimonials, TrustSignals, About, Contact, FAQ, Footer) |
| `/services` | Server | Services index page (9 services grouped by category) |
| `/services/it-support-outsourcing` | Server | IT Support service landing page |
| `/services/computer-repairs` | Server | Computer Repairs service landing page |
| `/services/networking-wifi` | Server | Networking & Wi-Fi service landing page |
| `/services/cctv-security` | Server | CCTV & Security service landing page |
| `/services/printer-office-technology` | Server | Printer & Office Tech service landing page |
| `/services/web-design` | Server | Web Design service landing page |
| `/services/graphic-design-branding` | Server | Graphic Design service landing page |
| `/services/digital-automation` | Server | Digital Automation service landing page |
| `/services/digital-skills-training` | Server | Digital Skills Training service landing page |
| `/vacancies` | Server | Public vacancies listing (empty state or cards) |
| `/vacancies/[id]` | Server | Vacancy detail page (full description, apply via email) |
| `/vacancies/admin` | Client | Standalone Vacancies admin (login + CRUD) |
| `/privacy-policy` | Server | POPIA-aligned privacy policy (14 sections) |
| `/terms` | Server | Terms of Service (14 sections, SA legal references) |
| `/training` | Server | Academy landing page |
| `/training/apply` | Client | Academy application form |
| `/training/forgot-password` | Server | Two-mode: request reset link / set new password |
| `/training/verify/[certificateNumber]` | Client | Public certificate verification page |

### Admin Pages (2 routes)

| Route | Type | Description |
|---|---|---|
| `/training/admin` | Client | SMS Admin Dashboard (11 views: Dashboard, Applications, Students, Courses, Attendance, Assessments, Certificates, Users, Reports, Audit Log, Settings) |
| `/vacancies/admin` | Client | Vacancies Admin (standalone, shared SSO with SMS) |

---

## 6. API Endpoints

### SMS API (`/api/academy/`)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/login` | Public | Authenticate with email+password, sets session cookie |
| POST | `/logout` | Public | Clears session cookie |
| POST | `/apply` | Public | Submit academy application (rate-limited: 3/hour/IP) |
| GET | `/students` | Authenticated | List students (search, filter by status/course) |
| GET | `/students?id=X` | Authenticated | Single student profile (with relations + computed fields) |
| POST | `/students` | super/admin/admissions/training | Create/update/delete/convert student |
| GET | `/courses` | Public | List all courses with modules |
| POST | `/courses` | super/admin | Create/update/delete courses + modules |
| GET | `/attendance` | Authenticated | List attendance (filter by student/date) |
| POST | `/attendance` | super/admin/training | Create/update single OR bulk attendance |
| GET | `/assessments` | Authenticated | List assessments (filter by student OR courseId for gradebook) |
| POST | `/assessments` | super/admin/training | Create/update assessment |
| GET | `/certificate` | Public | View certificate by ID or certificateNumber |
| POST | `/certificate` | super/admin/admissions | Issue/manual-issue/reissue certificate |
| GET | `/audit` | Authenticated | Paginated audit log (filter by action/studentId/userId) |
| GET | `/reports` | Authenticated | Dashboard stats + 12-month trends + status breakdown + top courses |
| GET | `/users` | Authenticated | List all academy users |
| POST | `/users` | super (create) / self (edit/reset) | Create/update/resetPassword user |
| DELETE | `/users?id=X` | super | Delete user (cannot delete self or last super) |
| GET | `/export?type=X` | Authenticated | CSV export (students/attendance/certificates) |
| GET | `/welcome-letter?studentId=X` | Authenticated | Download welcome letter PDF |

### Auth API (`/api/academy/auth/`)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/forgot-password` | Public | Request password reset email (rate-limited: 3/hour/IP) |
| POST | `/reset-password` | Public | Reset password with token (rate-limited: 5/hour/IP) |

### Vacancies API (`/api/academy/vacancies`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/vacancies` | Public | List active vacancies (auto-hides expired, rate-limited: 60/min/IP) |
| GET | `/vacancies?id=X` | Public | Single vacancy detail (404 if draft/expired) |
| GET | `/vacancies?admin=true` | super/admin/admissions/training | All vacancies (incl. drafts + expired) |
| POST | `/vacancies` | super/admin/admissions/training | Create vacancy |
| GET | `/vacancies/[id]` | Public (active only) / Admin (all) | Single vacancy by ID |
| PUT | `/vacancies/[id]` | super/admin/admissions/training | Update vacancy (partial update) |
| DELETE | `/vacancies/[id]` | super/admin/admissions/training | Delete vacancy |

### Contact API

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/contact` | Public | Contact form submission (rate-limited: 5/hour/IP, SMTP email to info@ndayenisolutions.co.za) |

---

## 7. Components

### Public Site Components (`src/components/ndayeni/`)

| Component | Description |
|---|---|
| `Navbar.tsx` | Fixed top nav with 3 dropdowns (Services, Training, Vacancies) + mobile burger menu with collapsible accordions |
| `Hero.tsx` | Hero section with headline, CTAs, stats, "What We Handle" panel, particle network background |
| `ParticleBackground.tsx` | Canvas 2D particle network (55 particles desktop, 30 tablet, 0 mobile) |
| `SectionDivider.tsx` | Gradient divider line between sections (server component, no JS) |
| `WhyNdayeni.tsx` | 6 value-prop cards with GSAP entrance animation |
| `Services.tsx` | 9 services in 3 category accordions with image headers |
| `BusinessSolutions.tsx` | 3 solution cards (Business, Home, Ongoing Support) |
| `CarePlans.tsx` | 3 IT support plan cards (Basic, Business featured, Business Plus) |
| `Testimonials.tsx` | Google Reviews CTA card + 4 trust badges |
| `TrustSignals.tsx` | 4 compliance badges (POPIA, Secure by Default, SLA-Backed, Verified) |
| `About.tsx` | Founder story + 4-step process + stats + values |
| `Contact.tsx` | Smart contact form (customer type + interest checkboxes + reCAPTCHA-ready) |
| `FAQ.tsx` | 10 questions in 3 categories (shadcn Accordion + JSON-LD FAQPage schema) |
| `Footer.tsx` | Quick Links + Services + Company Info + Service Area + Legal links + scroll-to-top |
| `WhatsAppButton.tsx` | Floating WhatsApp contact button |

### Admin/SMS Components (`src/components/academy/`)

| Component | Description |
|---|---|
| `StudentProfileModal.tsx` | 8-tab student detail modal (Overview, Personal, Education, Course, Attendance, Assessments, Certificates, Audit Trail) |
| `WelcomeLetterButton.tsx` | Download button for welcome letter PDF (locked until enrolled) |
| `AttendanceBulkCapture.tsx` | Bulk attendance: course picker + date + per-student radio (Present/Absent/Excused) |
| `AssessmentGradebook.tsx` | Gradebook matrix: students × modules with clickable cells + summary |
| `UserManagementPanel.tsx` | User CRUD: table + Add/Edit/Reset Password/Delete dialogs with role gating |
| `AuditLogViewer.tsx` | Filterable paginated audit log table with prefix-colored badges |
| `CSVExportButtons.tsx` | 3 download links for students/attendance/certificates CSV |
| `ReportsCharts.tsx` | 4 KPI cards + 4 recharts (Line, Bar, Bar, Pie donut) |
| `ForgotPasswordForm.tsx` | Two-mode: request reset link / set new password |
| `VacancyManagementPanel.tsx` | Vacancy CRUD: table + create/edit dialog + delete confirm + status toggle |
| `ServicePageTemplate.tsx` | Shared template for the 9 service landing pages |

### shadcn/ui Primitives (`src/components/ui/`)
44 pre-built components including: button, card, dialog, alert-dialog, table, tabs, accordion, select, input, textarea, badge, tooltip, dropdown-menu, popover, toast, toaster, and more.

---

## 8. Security Implementation

### South African Compliance
- **POPIA** (Protection of Personal Information Act 4 of 2013): Privacy Policy page, data minimisation, audit trail, access controls, session security
- **Cybercrimes Act 19 of 2020**: Rate limiting, audit logging, security headers
- **ECT Act 25 of 2002**: HTTPS enforcement, HSTS, CSP
- **Consumer Protection Act 68 of 2008**: Fair Terms of Service, no fake testimonials

### Authentication & Sessions
| Feature | Implementation |
|---|---|
| Password hashing | PBKDF2 (10,000 iterations, 16-byte salt, 64-byte key, SHA-512) |
| Password validation | ≥8 chars + uppercase + lowercase + digit + special char |
| Session tokens | HMAC-SHA256 signed (base64url payload + signature) |
| Session cookie | HttpOnly + Secure + SameSite=Strict + 24-hour expiry |
| Secret | `ACADEMY_SECRET` env var (mandatory, fail-fast if missing or < 16 chars) |
| Password verification | Constant-time comparison (timing-attack resistant) |
| Hash function | Async `pbkdf2` (non-blocking, no event-loop freeze) |

### Rate Limiting
In-memory sliding-window rate limiter (`src/lib/rate-limit.ts`):

| Endpoint | Limit | Window |
|---|---|---|
| Login | 5 attempts | 15 minutes per IP |
| Login (per email) | 5 failed attempts | 15 minutes (account lockout) |
| Forgot password | 3 requests | 1 hour per IP |
| Reset password | 5 attempts | 1 hour per IP |
| Apply form | 3 submissions | 1 hour per IP |
| Contact form | 5 messages | 1 hour per IP |
| Vacancies (public read) | 60 reads | 1 minute per IP |

### HTTP Security Headers (via `next.config.ts`)
| Header | Value |
|---|---|
| Content-Security-Policy | strict (default-src 'self', frame-ancestors 'none', object-src 'none') |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera/microphone/geolocation/payment/usb disabled |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload |
| X-DNS-Prefetch-Control | off |
| Cache-Control (API) | no-store, no-cache, must-revalidate |

### Audit Logging
Every admin action is logged to the `AuditLog` table:
- `login.success`, `login.failed`, `login.locked_out`, `login.inactive_account`
- `student.create`, `student.update`, `student.delete`, `student.status_change`, `student.convert`
- `certificate.issue`, `certificate.manual_issue`, `certificate.reissue`
- `attendance.bulk`
- `user.create`, `user.update`, `user.reset_password`, `user.delete`
- `vacancy.create`, `vacancy.update`, `vacancy.delete`
- `welcome_letter.download`
- `user.password_reset_requested`, `user.password_reset`

### Input Sanitisation
- All user inputs sanitised server-side: trim, strip control chars, cap length
- HTML escaping for email content
- Prisma parameterised queries (SQL injection protected)
- React escapes on render (XSS protected)
- Employment type + status validated against allow-lists

---

## 9. Environment Variables

Required on Vercel (Production + Preview + Development):

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Supabase pooler connection (PostgreSQL) | `postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Supabase direct connection (for migrations) | `postgresql://postgres.xxx:pass@aws-0-region.supabase.com:5432/postgres` |
| `ACADEMY_SECRET` | Session token signing secret (≥ 16 chars, use `openssl rand -hex 32`) | (random 64-char hex string) |
| `SMTP_HOST` | Mail server hostname | `mail.ndayenisolutions.co.za` |
| `SMTP_PORT` | Mail server port | `587` |
| `SMTP_USER` | SMTP username | `info@ndayenisolutions.co.za` |
| `SMTP_PASSWORD` | SMTP password | (mail account password) |
| `CONTACT_TO_EMAIL` | Where contact form submissions are sent | `info@ndayenisolutions.co.za` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://ndayenisolutions.co.za` |

Optional:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID (heatmaps + session recordings) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key (contact form) |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret key (server-side verification) |
| `SMTP_DISABLE_TEST_MODE` | Set to "true" to disable Ethereal test email fallback |

---

## 10. Performance Optimisations

### iOS Safari Performance
| Optimisation | Impact |
|---|---|
| `content-visibility: auto` on below-the-fold sections | Saves ~2.5MB initial image download (only above-the-fold images load on first paint) |
| `backdrop-filter: blur()` scoped to desktop only (`@media (hover: hover)`) | Eliminates 25 blur shader computations per scroll frame on touch devices |
| framer-motion removed entirely (SectionDivider rewritten as server component) | Saves ~50-100KB of JS bundle |
| Three.js HeroScene removed + replaced with Canvas 2D particle network | Saves ~600KB of JS (three.js + drei) |
| Images compressed to WebP q88 | 75% smaller than original JPGs (6.7MB → 1.7MB) |
| Particle background disabled on mobile (< 768px) | No Canvas animation on iPhone |
| GSAP scroll-linked parallax removed from Hero | Eliminates scroll repaints |

### Page Weight
| Resource | Compressed Size |
|---|---|
| HTML | ~32KB (Brotli) |
| JavaScript (14 chunks) | ~294KB (Brotli) |
| CSS (2 files) | ~30KB (Brotli) |
| Images on first load | ~500KB (only above-the-fold, rest lazy-loaded via content-visibility) |
| **Total first load** | **~856KB** |

---

## 11. SEO Infrastructure

| Feature | Implementation |
|---|---|
| Sitemap | `src/app/sitemap.ts` — 16 entries (homepage, services index, 9 service pages, privacy-policy, terms, training routes) |
| robots.txt | `public/robots.txt` — allows all, disallows /api/ |
| Metadata | Per-page `metadata` exports (title, description, canonical, OpenGraph, Twitter cards) |
| JSON-LD | `ProfessionalService` schema + 9 `Service` schemas in `layout.tsx` |
| OpenGraph image | `public/og-image.png` — 1200×630 PNG |
| PWA manifest | `public/manifest.json` — name, theme_color, icons |
| Semantic HTML | `<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>` throughout |
| Accessibility | Skip-to-content link, ARIA labels, keyboard navigation, sr-only classes |

---

## 12. Analytics

| Service | Status | Cookies? |
|---|---|---|
| Vercel Web Analytics | ✅ Active (via `@vercel/analytics`) | No (privacy-friendly) |
| Microsoft Clarity | ⚙️ Wired but inactive (`NEXT_PUBLIC_CLARITY_ID` not set) | Would use cookies if enabled |
| Google Analytics | ❌ Not installed | — |
| reCAPTCHA v3 | ⚙️ Built into contact form but inactive (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` not set) | Would use cookies if enabled |

**Cookie consent banner:** NOT needed — site uses no non-essential cookies.

---

## 13. Deployment

### Hosting
- **Platform:** Vercel (auto-deploy on GitHub push to `main` branch)
- **Build command:** `prisma generate && next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/`
- **Output:** Standalone Next.js server (`output: "standalone"`)
- **Custom domain:** `ndayenisolutions.co.za` (apex → www redirect, Let's Encrypt SSL auto-managed by Vercel)

### DNS (Afrihost)
| Record | Type | Value |
|---|---|---|
| `@` (apex) | A | Vercel IP (216.198.79.1) |
| `www` | CNAME | c5bd9362db9defd2.vercel-dns-017.com |
| `_vercel` | TXT | vc-domain-verify=ndayenisolutions.co.za,... |
| `_vercel.www` | TXT | vc-domain-verify=www.ndayenisolutions.co.za,... |
| MX | MX | mx6912926826.spe.ucebox.co.za (Afrihost email) |
| SPF | TXT | v=spf1 include:spf.aserv.co.za +a +mx -all |
| autoconfig | CNAME | envoy.aserv.co.za (email autodiscovery) |
| autodiscover | CNAME | envoy.aserv.co.za (email autodiscovery) |

### Database Setup
The `supabase-setup.sql` file contains the full database schema creation script. Run it in the Supabase SQL Editor when setting up a new database. It includes:
- AcademyUser, Student, Course, Module, Attendance, Assessment, Certificate, AuditLog, Vacancy tables
- Auto-update triggers for `updatedAt` fields
- Seed data for 4 default courses + their modules

---

## 14. Development

### Prerequisites
- Node.js 18+ or Bun 1.x
- A Supabase project (or local PostgreSQL)
- An SMTP mail server

### Local Setup
```bash
# Clone the repository
git clone https://github.com/ndayenisolutions-png/Ndayeni-Solutions.git
cd Ndayeni-Solutions

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env  # then edit .env with your values

# Generate Prisma client
bun run db:generate

# Push database schema
bun run db:push

# Start dev server
bun run dev
```

### Development Commands
| Command | Description |
|---|---|
| `bun run dev` | Start Next.js dev server on port 3000 |
| `bun run lint` | Run ESLint |
| `bun run build` | Production build (prisma generate + next build) |
| `bun run db:push` | Push Prisma schema to database (--accept-data-loss) |
| `bun run db:generate` | Regenerate Prisma client |
| `bun run db:migrate` | Create a Prisma migration |
| `bun run db:reset` | Reset database (destructive) |

### TypeScript Configuration
- **Strict mode:** enabled
- **Path aliases:** `@/*` → `./src/*`
- **Build errors:** `ignoreBuildErrors: false` (production builds fail on type errors)
- **Excluded directories:** `Ndayeni-Solutions/`, `examples/`, `skills/`, `mini-services/`, `tool-results/`, `tests/`

---

## 15. Admin Credentials

The admin account is stored in the `AcademyUser` table:
- **Email:** nhlakanipho@ndayenisolutions.co.za
- **Role:** super
- **Password:** (PBKDF2 hashed — not stored in plaintext)

Passwords are hashed using PBKDF2 with 10,000 iterations, 16-byte salt, 64-byte derived key, SHA-512 digest. The hash format is `salt:derivedHex`.

---

## 16. Git History Summary

### Major Milestones (most recent first)
1. Welcome letter professional formatting (margins, fonts, spacing)
2. Particle network background (Canvas 2D, 55 particles)
3. Tablet dropdown fix (group-focus-within)
4. iOS performance: content-visibility:auto + framer-motion removed
5. Admin sidebar: position:fixed (never scrolls)
6. Login text simplification
7. Security hardening (rate limiting, headers, sessions, password complexity, audit logging)
8. Solutions tab removed from navbar
9. Vacancies dropdown in navbar
10. Vacancies admin standalone (decoupled from SMS)
11. Vacancies page + admin management
12. SMS admin sidebar sticky fix
13. Mobile burger menu: collapsible accordions
14. Image re-encoding (WebP q88)
15. Hero: 3D objects + background image removed
16. iOS Safari performance (backdrop-filter scoped, three.js removed, images compressed)
17. Final recommendations: legal pages, 9 service pages, FAQ, testimonials, analytics, manifest, sitemap
18. SMS polish: student profile, bulk attendance, gradebook, cert reissue, reports trends, forgot/reset password, CSV export, welcome letter PDF
19. Database: switch to PostgreSQL (Supabase)
20. Initial project setup + marketing site build

---

## 17. Known Limitations & Future Work

### Not Yet Implemented
- Blog / resources section (for content marketing + SEO)
- Case studies / portfolio page
- Team page
- Newsletter signup
- Google reviews integration on testimonials section
- Google Business Profile optimisation
- Custom 404 page
- Cookie consent banner (not needed currently — no non-essential cookies)
- Service area map (Google Maps embed)
- Live chat widget
- CV submission form (currently uses mailto: link)

### Security Notes
- `ACADEMY_SECRET` is mandatory (fail-fast if missing) — must be set in Vercel env vars
- Session tokens expire after 24 hours (users must re-login daily)
- Rate limiting is in-memory (per Vercel instance, not shared across instances) — sufficient for current traffic volume
- reCAPTCHA is built into the contact form but inactive (rate limiting provides sufficient bot protection)
- No CSRF token (SameSite=Strict cookie provides CSRF defence)
- No 2FA (not implemented — recommended for future if admin team grows)

### Performance Notes
- Particle network background is desktop/tablet only (disabled on mobile for iPhone performance)
- Below-the-fold sections use `content-visibility: auto` (images lazy-load on scroll)
- `backdrop-filter: blur()` is desktop-only (touch devices use solid rgba backgrounds)
- Images are WebP q88 (good quality, ~75% smaller than original JPGs)

---

*End of Document*
