# Nexus Learn — Architecture & Roadmap
### Production E-Learning Platform · Phase 0 Deliverable

> Stack note: **JavaScript + JSX everywhere** (no TypeScript). Next.js 15 App Router, Express.js, MongoDB Atlas.

---

## 1. Product Overview

**Working name:** Nexus Learn (placeholder — swap freely, used only so docs/copy have a subject to anchor to).

Three roles, one Super Admin. Per your note, this is **env-driven, not hardcoded**: `SUPER_ADMIN_EMAIL=wa5134810@gmail.com` in the backend `.env`, matched against the authenticated user's email during seed/first-login to auto-assign the `admin` role — see §6. Core loop: Admin/Teacher publish courses → Students enroll, learn, get graded, get certified → Everyone talks via real-time chat/notifications → Admin watches it all through analytics.

**Scope layers:** Core LMS (Phases 1–10, the MVP that must work end-to-end) and a **Growth layer** (Phase 11: AI features, gamification, payments/subscriptions, CMS, OAuth/2FA, portfolio polish) that sits on top once the core is solid. Building the growth layer straight into the MVP risks a platform that's wide but broken everywhere; sequencing it after means every AI/payment/gamification feature lands on a working, demoable product instead of racing it.

**System shape:**

```
┌─────────────────────┐        HTTPS/REST         ┌──────────────────────┐
│  Next.js 15 (App     │ ───────────────────────▶ │  Express.js API       │
│  Router) — Frontend   │ ◀─────────────────────── │  (Node.js)            │
│  React 19, Zustand,   │      WebSocket (Socket.io) for chat/notifications │
│  TanStack Query        │◀════════════════════════▶│                      │
└─────────┬────────────┘                            └──────────┬───────────┘
          │                                                     │
          │ media                                               │ Mongoose ODM
          ▼                                                     ▼
   ┌─────────────┐                                      ┌───────────────┐
   │ Cloudinary   │                                      │ MongoDB Atlas  │
   │ (video/img/  │                                      │ (documents)    │
   │ pdf storage) │                                      └───────────────┘
   └─────────────┘
          ▲
          │ transactional email
   ┌─────────────┐
   │ Nodemailer   │
   │ (SMTP)       │
   └─────────────┘
```

Frontend deploys to Vercel, backend to Render/Railway, DB on Atlas — all env-var driven, no hardcoded secrets. Growth layer adds two more external services: an **LLM API** (Anthropic/OpenAI — recommendation engine, chatbot, quiz/flashcard generation, feedback, summarizer, all called server-side from `services/aiService.js`, never from the client) and **Stripe** (payments, subscriptions, coupons, invoices, webhooks).

---

## 2. Design System

The brief already pins down a palette and a "premium SaaS / glassmorphism / aurora" direction — that instruction wins, so the tokens below are literal. Where the brief leaves room (type pairing, the signature moment, layout rhythm), those are deliberate choices, not defaults.

### 2.1 Color tokens

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#4F46E5` | Primary actions, active nav, links |
| `--secondary` | `#7C3AED` | Secondary CTAs, gradient partner |
| `--accent` | `#06B6D4` | Highlights, data-viz accents, focus rings |
| `--success` | `#10B981` | Completion, positive deltas |
| `--warning` | `#F59E0B` | Deadlines, pending states |
| `--danger` | `#EF4444` | Errors, destructive actions |
| `--bg-dark` | `#0B1120` | Dark mode canvas |
| `--surface-dark` | `#111827` | Cards, panels (dark) |
| `--glass` | `rgba(255,255,255,0.05)` | Glass panel fill |
| `--glass-border` | `rgba(255,255,255,0.10)` | Glass panel edge |
| `--bg-light` | `#F8F9FC` | Light mode canvas |
| `--surface-light` | `#FFFFFF` | Cards (light), soft shadow `0 8px 30px rgba(79,70,229,0.08)` |

Signature gradient (used sparingly — hero headline underlay, primary CTA, progress rings): `linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #06B6D4 100%)`.

### 2.2 Typography

Two-role pairing, not the default cream-serif or broadsheet look:

- **Display: "Cabinet Grotesk"** (or `Clash Display` as fallback) — a geometric grotesk with real personality in the wide characters, set at tight tracking (-2%) for hero/section headlines. This is what gives the "Linear/Vercel-dashboard" feel rather than generic SaaS.
- **Body/UI: "Inter"** — variable weight 400–600, used at 15–16px base for UI density (dashboards need this over a stylized body face).
- **Data/mono: "JetBrains Mono"** — used only for numbers-that-matter: analytics deltas, certificate IDs, timestamps in tables. This is the utility face that signals "real product," not decoration.

Type scale: `12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64px`, line-height 1.1 for display, 1.5–1.6 for body.

### 2.3 Layout & signature element

Layout concept for the marketing site: a **"live workspace" hero** rather than a static headline-with-stats template — the hero shows an actual miniature product surface (a course card mid-hover, a progress ring animating, a chat bubble arriving) inside a tilted glass panel with mouse-tracked parallax, so the first thing a visitor sees is the product itself, not marketing copy about it. This is the signature moment: **the "live glass panel"** — a 3D-tilted (React Three Fiber, subtle, ±6° max) glass card cluster that reacts to cursor position, reused at smaller scale for feature callouts and the pricing card. One idea, three sizes — not scattered animation everywhere.

Dashboards use a **12-column grid**, glass cards with `backdrop-filter: blur(20px)`, 16px radius, 1px gradient-border on hover only (not resting state — resting state stays quiet per the restraint principle). Charts (Recharts) use the accent/primary/secondary trio only — never rainbow palettes.

Motion budget: page-load stagger-reveal (once), scroll-reveal for landing sections (once each), hover micro-interactions on interactive elements only. No ambient particle fields running behind dashboard tables — that's where "AI-generated" starts to show; particles/aurora are reserved for the public marketing site, not the authenticated app shell.

### 2.4 Component states

Every interactive component ships with: default, hover, focus-visible (2px `--accent` ring, never removed), disabled, loading (skeleton, not spinner-only), error, empty (empty states get one line of guidance + one action, in the interface's voice — e.g. "No courses yet. Create your first course." not "No data available").

### 2.5 Extended component library (Growth layer)

On top of §2.4's base states, the growth layer needs: command palette (⌘K / Ctrl+K, `cmdk` library — global search + quick actions), kanban board (assignment/content pipeline for teachers), stepper (course-creation wizard, onboarding), expandable/timeline cards (course curriculum, activity feed), animated inputs (floating labels, inline validation), skill radar chart and progress rings (Recharts custom shapes, student profile), heatmap (attendance/activity calendar, GitHub-contribution style), infinite logo slider (trusted-by section, CSS-only marquee, no JS animation loop needed), and a Lottie slot for the loading screen and empty-state illustrations. All still draw from the same token set in §2.1–2.2 — no new colors introduced, gradient reserved for the same signature moments.

### 2.6 Dashboard upgrade pattern

Every dashboard (student/teacher/admin) follows the same anatomy so the codebase stays reusable: **KPI row** (animated count-up `StatCard`s, 3–4 max) → **primary chart** (role-specific: student=weekly learning time, teacher=class performance, admin=revenue) → **two-column split** (left: activity feed / recent items, right: calendar or quick actions) → **secondary widgets grid** (badges, streak, deadlines, etc., role-specific per the brief's lists in this doc). This keeps admin from literally becoming Stripe's dashboard file-for-file while still earning the comparison.

---

## 3. Database Schema (MongoDB / Mongoose)

Collections below; `_id` implicit on all. Timestamps (`createdAt`/`updatedAt`) on all via `{ timestamps: true }`.

**User**
```
name, email (unique), password (hashed), avatarUrl, role: enum[student,teacher,admin],
isEmailVerified, emailVerifyToken, resetPasswordToken, resetPasswordExpires,
refreshTokens: [String], status: enum[active,suspended],
studentProfile: { bio, phone, dob, wishlist:[Course], bookmarks:[Lesson], streak, badges:[Badge] },
teacherProfile: { bio, expertise:[String], approved:Boolean, assignedBatches:[Batch] },
lastLoginAt
```

**Course**
```
title, slug, description, objectives:[String], requirements:[String],
thumbnailUrl, trailerUrl, category:Category, tags:[String],
instructor:User, price, discountPrice, difficulty: enum[beginner,intermediate,advanced],
duration (minutes), status: enum[draft,published,archived],
modules:[Module], seo:{ metaTitle, metaDescription }, ratingAvg, ratingCount
```

**Module** (embedded in Course or referenced — referenced for scale)
```
course:Course, title, order, lessons:[Lesson]
```

**Lesson**
```
module:Module, title, order, videoUrl, durationSec, resources:[Resource],
isPreview:Boolean
```

**Resource**
```
lesson:Lesson, type: enum[pdf,image,video,link], url, fileName
```

**Enrollment**
```
student:User, course:Course, enrolledAt, progressPercent,
completedLessons:[Lesson], status: enum[active,completed,refunded],
certificateIssued:Boolean, lastAccessedAt
```

**Batch**
```
name, course:Course, teacher:User, students:[User], startDate, endDate, slot:Slot
```

**Slot**
```
batch:Batch, dayOfWeek, startTime, endTime, timezone
```

**Attendance**
```
batch:Batch, student:User, date, status: enum[present,absent,late,leave], markedBy:User
```

**Assignment**
```
course:Course, teacher:User, title, description, attachmentUrl, deadline, maxScore
```

**Submission**
```
assignment:Assignment, student:User, fileUrl, submittedAt, status: enum[pending,graded,resubmit],
score, feedback, gradedBy:User, gradedAt
```

**Quiz**
```
course:Course, title, timerSeconds, questions:[{
  type: enum[mcq,truefalse,short], text, options:[String], correctAnswer, points
}]
```

**QuizAttempt**
```
quiz:Quiz, student:User, answers:[Mixed], score, submittedAt, autoSubmitted:Boolean
```

**Certificate**
```
student:User, course:Course, certificateId (unique, human-readable), issuedAt, pdfUrl
```

**Review**
```
course:Course, student:User, rating (1-5), comment
```

**Announcement**
```
scope: enum[global,course,batch], course:Course, batch:Batch, author:User, title, body
```

**Notification**
```
user:User, type, title, body, link, isRead, createdAt
```

**Message / Conversation**
```
Conversation: participants:[User], lastMessageAt
Message: conversation:Conversation, sender:User, text, attachmentUrl, readBy:[User]
```

**Category**
```
name, slug, icon
```

**Payment**
```
student:User, course:Course, amount, currency, provider, providerRef, status: enum[pending,paid,refunded]
```

**Event** (calendar)
```
title, type: enum[class,deadline,exam,meeting], date, relatedCourse:Course, relatedBatch:Batch, audience:[User]
```

Indexes: `User.email` (unique), `Course.slug` (unique), `Enrollment{student,course}` (compound unique), `Certificate.certificateId` (unique), text index on `Course.title/description/tags` for search.

### 3.1 Growth-layer collections

**Gamification**
```
UserGamification: user:User, xp, level, currentStreak, longestStreak, lastActiveDate,
Badge: name, icon, criteria (e.g. "complete_5_courses"), xpReward,
UserBadge: user:User, badge:Badge, earnedAt,
Leaderboard is computed on read (aggregation, sorted by xp/period) — not stored.
```

**AI**
```
AIInteraction: user:User, feature: enum[recommendation,assistant,chatbot,quiz-gen,
  feedback,code-review,summarizer,flashcards,roadmap,resume], input, output, tokensUsed, createdAt
Flashcard: user:User, course:Course, front, back, source: enum[ai,manual], nextReviewAt (spaced repetition)
```

**Payments & Growth**
```
Subscription: student:User, plan: enum[monthly,yearly], stripeSubId, status, currentPeriodEnd
Coupon: code (unique), discountPercent, expiresAt, maxUses, usedCount, applicableCourses:[Course]
Invoice: student:User, payment:Payment, amount, pdfUrl, issuedAt
Referral: referrer:User, referredEmail, code, status: enum[pending,joined,rewarded]
```

**Security**
```
LoginHistory: user:User, ip, device, location, success:Boolean, createdAt
OAuthAccount: user:User, provider: enum[google,github], providerId
TwoFactor: user:User, secret, enabled:Boolean, backupCodes:[String]
```

**Admin CMS & Ops**
```
CMSBlock: page: enum[landing-hero,pricing,faq,testimonials,footer,about,policy], key, content (Mixed/JSON), updatedBy:User
Blog: title, slug, body, coverUrl, author:User, published, publishedAt
AuditLog: actor:User, action, targetType, targetId, meta (Mixed), createdAt
FeatureFlag: key (unique), enabled:Boolean, description
```

---

## 4. Folder Structure

### Frontend (`/frontend`, Next.js 15 App Router, JS/JSX only)

```
frontend/
├─ app/
│  ├─ (marketing)/              # landing, pricing, about — public
│  │  ├─ page.jsx
│  │  ├─ pricing/page.jsx
│  │  └─ layout.jsx
│  ├─ (auth)/
│  │  ├─ login/page.jsx
│  │  ├─ register/page.jsx
│  │  ├─ forgot-password/page.jsx
│  │  └─ reset-password/[token]/page.jsx
│  ├─ (student)/
│  │  ├─ dashboard/page.jsx
│  │  ├─ courses/page.jsx
│  │  ├─ courses/[slug]/page.jsx
│  │  ├─ learn/[courseId]/[lessonId]/page.jsx
│  │  ├─ assignments/page.jsx
│  │  ├─ quizzes/[id]/page.jsx
│  │  ├─ certificates/page.jsx
│  │  ├─ attendance/page.jsx
│  │  ├─ chat/page.jsx
│  │  └─ layout.jsx             # student shell + route guard
│  ├─ (teacher)/
│  │  ├─ dashboard/page.jsx
│  │  ├─ batches/page.jsx
│  │  ├─ courses/[id]/edit/page.jsx
│  │  ├─ grading/page.jsx
│  │  ├─ attendance/page.jsx
│  │  └─ layout.jsx
│  ├─ (admin)/
│  │  ├─ dashboard/page.jsx
│  │  ├─ users/page.jsx
│  │  ├─ courses/page.jsx
│  │  ├─ analytics/page.jsx
│  │  ├─ settings/page.jsx
│  │  └─ layout.jsx
│  ├─ layout.jsx                 # root: theme provider, fonts
│  └─ globals.css
├─ components/
│  ├─ ui/                        # shadcn primitives
│  ├─ shared/                    # Navbar, Footer, GlassCard, StatCard, EmptyState
│  ├─ charts/                    # Recharts wrappers
│  ├─ hero/                      # R3F scene, magnetic buttons
│  └─ forms/
├─ hooks/                        # useAuth, useSocket, useTheme, useDebounce
├─ lib/                          # axios instance, queryClient, socket.js
├─ services/                     # authService, courseService, quizService... (API calls)
├─ store/                        # zustand slices: authStore, uiStore
├─ context/                      # ThemeContext (if not covered by store)
├─ schemas/                      # zod schemas per form
├─ utils/                        # formatters, constants, roleGuards
├─ public/
├─ .env.local
└─ package.json
```

### Backend (`/backend`, Express, JS)

```
backend/
├─ src/
│  ├─ config/                    # db.js, cloudinary.js, mailer.js, env.js
│  ├─ models/                    # User.js, Course.js, ... (one per schema above)
│  ├─ controllers/               # authController.js, courseController.js, ...
│  ├─ routes/                    # auth.routes.js, course.routes.js, ...
│  ├─ middleware/                # auth.js (JWT), roleGuard.js, errorHandler.js,
│  │                              #   rateLimiter.js, validate.js (zod/joi), upload.js (multer)
│  ├─ services/                  # emailService.js, certificateService.js (PDF gen)
│  ├─ validators/                # per-route zod/joi schemas
│  ├─ sockets/                   # chatSocket.js, notificationSocket.js, index.js
│  ├─ utils/                     # generateTokens.js, apiResponse.js, logger.js
│  └─ app.js
├─ server.js                     # http server + socket.io bootstrap
├─ .env
└─ package.json
```

---

## 5. API Plan (REST, prefix `/api/v1`)

**Auth** — `/auth`
`POST /register` · `POST /login` · `POST /logout` · `POST /refresh-token` · `POST /verify-email/:token` · `POST /forgot-password` · `POST /reset-password/:token` · `GET /me`

**Users** — `/users` (admin unless noted)
`GET /` · `GET /:id` · `PATCH /me` (self) · `PATCH /:id/suspend` · `DELETE /:id` · `PATCH /:id/promote` (teacher→approved) · `POST /avatar` (self, multer→Cloudinary)

**Courses** — `/courses`
`GET /` (public, filter/search/paginate) · `GET /:slug` (public) · `POST /` (admin/teacher) · `PATCH /:id` (owner/admin) · `DELETE /:id` (admin) · `PATCH /:id/publish` · `POST /:id/reviews` (student)

**Modules/Lessons** — `/courses/:courseId/modules`, `/modules/:moduleId/lessons`
Standard CRUD, teacher (own course) / admin only for write.

**Enrollments** — `/enrollments`
`POST /` (student enrolls) · `GET /me` (student's enrollments) · `PATCH /:id/progress` · `GET /course/:courseId` (teacher/admin roster)

**Batches/Slots** — `/batches`, `/slots` (admin write, teacher read-own)

**Attendance** — `/attendance`
`POST /mark` (teacher) · `GET /batch/:batchId` · `GET /student/:studentId` · `GET /export` (CSV)

**Assignments/Submissions** — `/assignments`, `/submissions`
`POST /assignments` (teacher) · `POST /submissions` (student, multer) · `PATCH /submissions/:id/grade` (teacher)

**Quizzes** — `/quizzes`
`POST /` (teacher/admin) · `GET /:id` (student, strips correct answers) · `POST /:id/attempt` · `GET /:id/leaderboard`

**Certificates** — `/certificates`
`POST /generate` (system, on 100% completion) · `GET /me` · `GET /verify/:certificateId` (public)

**Notifications** — `/notifications`
`GET /me` · `PATCH /:id/read` · `PATCH /read-all`

**Chat** — `/conversations`, `/messages` (REST for history; Socket.io for live)

**Announcements** — `/announcements` CRUD, scoped by role

**Analytics** — `/analytics`
`GET /admin/overview` · `GET /admin/revenue` · `GET /teacher/:id/performance` · `GET /student/:id/progress`

**Categories, Events, Payments** — standard CRUD, admin-write / public-or-scoped-read.

All mutating routes: `auth` middleware (verify JWT) → `roleGuard(...)` → `validate(schema)` → controller. All list routes support `?page&limit&sort&search`.

### 5.1 Growth-layer endpoints

**AI** — `/ai` (rate-limited per user, server-side LLM calls only)
`POST /recommendations` · `POST /assistant/chat` (also mirrored on the Socket.io chatbot channel) · `POST /quiz-generator` (teacher, from lesson content) · `POST /assignment-feedback` (teacher-triggered, per submission) · `POST /code-review` · `POST /summarize` (lesson/notes → summary) · `POST /flashcards/generate` · `POST /roadmap` · `POST /resume-builder`

**Gamification** — `/gamification`
`GET /me` (xp, level, streak, badges) · `GET /leaderboard?period=weekly|monthly|alltime` · internal hooks (not routes) fire on lesson-complete, quiz-pass, streak-tick to award XP/badges

**Payments/Growth** — `/payments`, `/subscriptions`, `/coupons`, `/referrals`
`POST /payments/checkout` (Stripe session) · `POST /payments/webhook` (Stripe events, signature-verified) · `GET /payments/history` · `POST /subscriptions` · `PATCH /subscriptions/cancel` · `POST /coupons/validate` · `GET /referrals/me` · `POST /referrals/redeem`

**Security** — `/auth/2fa`, `/auth/oauth`
`POST /2fa/enable` · `POST /2fa/verify` · `GET /oauth/google` · `GET /oauth/github` · `GET /me/login-history` · `GET /me/devices` · `DELETE /me/devices/:id`

**Admin CMS & Ops** — `/cms`, `/admin`
`GET/PATCH /cms/:page` (landing sections, FAQ, pricing, footer, policies — no redeploy needed) · `GET/POST /blog` · `GET /admin/audit-logs` · `POST /admin/backup` · `POST /admin/restore` · `GET /admin/export?format=csv|pdf` · `PATCH /admin/feature-flags/:key` · `PATCH /admin/maintenance-mode` · `POST /admin/broadcast-email`

---

## 6. Role Permission Matrix (summary)

| Capability | Student | Teacher | Admin |
|---|---|---|---|
| Browse/enroll courses | ✅ | — | — |
| Create/edit own courses | — | ✅ (assigned) | ✅ (all) |
| Mark attendance | — | ✅ (own batches) | ✅ (all) |
| Grade assignments/quizzes | — | ✅ (own students) | ✅ (all) |
| View other teachers' students | — | ❌ | ✅ |
| Suspend/delete accounts | — | ❌ | ✅ |
| Promote teacher, create admin | — | ❌ | ✅ (Super Admin only for admin creation) |
| Platform/theme/SEO settings | — | ❌ | ✅ |

Enforced server-side via `roleGuard` middleware, never trusted from client. Super Admin is seeded from `SUPER_ADMIN_EMAIL` env var matching `wa5134810@gmail.com`; only that account (or one it explicitly promotes) can hold `admin` with full grant rights.

---

## 7. Development Roadmap

Each phase ends with a working build (`npm run build` passes) and a short demo checklist before moving on.

**Phase 1 — Project Setup**
Monorepo or twin-repo scaffold, Next.js 15 (JS) + Tailwind + shadcn init, Express skeleton, MongoDB Atlas connection, env config, ESLint/Prettier, base layout + theme provider (dark/light/system), CI-friendly folder structure from §4.
*Done when:* both apps build and run locally, DB connects, theme toggle works.

**Phase 2 — Authentication**
User model, register/login/refresh/logout, bcrypt, JWT + refresh token rotation, email verification + password reset (Nodemailer), protected route middleware (frontend + backend), role-aware redirect, Super Admin seed script.
*Done when:* all three roles can register/login and land on the correct dashboard shell; protected routes reject unauthenticated/wrong-role access.

**Phase 3 — Landing Page**
Marketing route group: hero (R3F glass-panel signature element + optional 3D globe), stats (animated numbers), testimonials, trusted-by (infinite logo slider), popular courses, teacher showcase, pricing, FAQ, footer, glass navbar — scroll-reveal + one orchestrated load sequence, fully responsive. Animated dashboard preview (a real, simplified live component, not a static screenshot) reinforces the "live workspace hero" signature from §2.3.
*Done when:* Lighthouse perf/SEO pass reasonably, no layout shift, works at 375px–1440px+.

**Phase 4 — Student Portal**
Dashboard (glass cards, charts, continue-learning rail, today's goal, upcoming deadlines/quiz reminders, wishlist/bookmarks, streak/achievements once §11b lands), course browse/search/filter, course detail + enroll, lesson player + progress tracking, assignments (submit), quizzes (timer, auto-submit), certificates, attendance view, calendar, LinkedIn-style profile (bio/skills/certificates/badges/social links).
*Done when:* a seeded student can enroll → complete a course → submit an assignment → take a quiz → see progress update live.

**Phase 5 — Teacher Portal**
Dashboard (today's classes, pending assignments, student messages, quick attendance, average grade, top/weak students, upcoming events), assigned batches/students/slots, attendance marking, lecture/resource upload (Cloudinary), quiz/assignment creation, grading + feedback, performance charts, timetable, professional profile (experience/skills/rating/reviews/availability).
*Done when:* a seeded teacher can create content, grade a real submission, and mark attendance that reflects on the student side.

**Phase 6 — Admin Portal**
Full CRUD across users/courses/categories/batches/slots/timetables/events, approve teachers, suspend/delete accounts, promote/create admin, platform settings (SEO/theme/storage/email/security), dashboard styled toward the Stripe-dashboard reference (revenue, users online, active courses, growth, weekly enrollments, system health, storage usage, API requests, latest activity), logs, data export.
*Done when:* Super Admin can manage the entire platform end-to-end without touching the DB directly.

**Phase 7 — Chat & Notifications**
Socket.io wiring (auth handshake, rooms per conversation), student↔teacher and teacher↔admin chat, real-time + toast + email + dashboard-alert notifications, announcements.
*Done when:* two logged-in sessions in different browsers exchange a message in real time and both receive a notification.

**Phase 8 — Analytics**
Recharts dashboards: revenue, enrollments, active students, teacher performance, student growth, course popularity, attendance %, quiz performance, retention/completion — role-scoped queries with aggregation pipelines.
*Done when:* admin analytics reflect real seeded data changes within a page refresh.

**Phase 9 — Deployment**
Vercel (frontend), Render/Railway (backend), Atlas production cluster, env var audit, CORS lockdown, Helmet + rate limiting review, health-check endpoint, custom domain (optional).
*Done when:* the public URL works end-to-end for all three roles from a cold cache.

**Phase 10 — Testing & Optimization**
Critical-path tests (auth, enrollment, grading, chat), image/video lazy-loading and code-splitting audit, bundle-size check, accessibility pass (keyboard nav, ARIA, contrast), README + API docs + deployment guide finalized.
*Done when:* no console errors/warnings on any authenticated route, Lighthouse a11y ≥ 90, docs are complete enough for a stranger to run the project from clone to running locally.

**Phase 11 — Growth Layer (AI, Gamification, Payments, CMS, Portfolio Polish)**
This is what turns the working LMS from Phase 1–10 into the "startup-grade" version — sequenced last on purpose, so it's built on a stable foundation instead of racing alongside it. Sub-phases (each independently shippable, can be reordered based on what you want to demo first):

- **11a AI:** recommendation engine (content-based on enrollment/category history to start, no cold-start ML needed), learning assistant + chatbot (LLM API, streamed responses), quiz generator (from lesson transcript/notes), assignment feedback, code reviewer, note summarizer, flashcards (with spaced-repetition scheduling), roadmap generator, resume builder.
- **11b Gamification:** XP/levels/streaks/badges wired into the existing lesson-complete/quiz-pass/attendance events, leaderboard, weekly challenges.
- **11c Payments & Growth:** Stripe checkout + webhooks, subscriptions, coupons, invoices, affiliate/referral codes.
- **11d Security hardening:** 2FA, Google/GitHub OAuth, login history, device/session management, email alerts on new-device login.
- **11e Admin CMS:** landing page/FAQ/pricing/testimonials/footer/policies editable without redeploy, blog, audit logs, backup/restore, CSV/PDF export, feature flags, maintenance mode, email broadcast.
- **11f Portfolio polish:** custom 404, custom loading screen (Lottie), favicon + manifest (PWA-ready), command palette, smooth-scroll (Lenis), refined micro-interactions pass.
- **11g Modern SaaS baseline:** PWA/offline shell, browser push notifications, i18n scaffold + RTL readiness (matters given your multilingual work on the greeting-card project), sitemap/robots.txt/Open Graph/Twitter cards.

*Done when:* each sub-phase demos independently; none of them regress the Phase 1–10 core (re-run the Phase 10 checklist after each).

---

## 8. Next Step

This document is the Phase 0 deliverable. Once you confirm the direction (palette/type/roadmap as above, or flag changes), I'll start **Phase 1: Project Setup** — scaffolding both repos, wiring the DB connection, and getting the theme-aware shell running.
