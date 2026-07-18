# Nexus Learn

A production-grade MERN e-learning platform (Student / Teacher / Admin roles). Built in
phases — see `ARCHITECTURE.md` for the full system design, database schema, API plan,
and roadmap.

## Structure

```
nexus-learn/
├─ ARCHITECTURE.md   # architecture, schema, design system, API plan, roadmap
├─ frontend/          # React SPA (Vite + React Router) — converted from Next.js
└─ backend/           # Express + MongoDB API
```

**Architecture note:** the frontend was originally built in Next.js (App Router,
SSR) through Phase 8, then converted to a client-side-only React SPA (Vite + React
Router) at the user's request. This trades away the SSR/SEO benefits the landing
page was designed around, in exchange for a plain React codebase. The backend and
every feature are unaffected — see `frontend/README.md` for exactly what changed
and how it was verified.

## Quick start

```bash
# Terminal 1
cd backend && npm install && cp .env.example .env && npm run dev

# Terminal 2
cd frontend && npm install && cp .env.local.example .env.local && npm run dev
```

Frontend: http://localhost:3000 — Backend health check: http://localhost:5000/api/v1/health

## Progress

- [x] **Phase 1 — Project Setup**: both apps scaffolded, build clean, DB connection
      wired (degrades gracefully without one), theme system live, core middleware in
      place.
- [x] **Phase 2 — Authentication**: register/login/logout, JWT access + rotating
      refresh tokens (httpOnly cookie), email verification, forgot/reset password,
      Super Admin auto-assignment via `SUPER_ADMIN_EMAIL`, role-gated dashboards
      (`/dashboard`, `/teacher/dashboard`, `/admin/dashboard`) with route guards on
      both server (roleGuard middleware) and client (ProtectedRoute). *(this delivery)*
- [x] **Phase 3 — Landing Page**: hero with the R3F glass-panel signature element,
      animated stats, logo marquee, popular courses, teacher showcase, testimonials,
      pricing, FAQ, final CTA — all scroll-reveal, `npm run build` clean, verified the
      production build actually serves real content. *(this delivery)*
- [x] **Phase 4 — Student Portal**: courses (browse/search/filter/enroll), lesson
      player with progress tracking, assignments, timed quizzes, certificates,
      attendance, profile/wishlist/bookmarks, real dashboard data. Course content is
      embedded in the `Course` document rather than separate `Module`/`Lesson`
      collections — a deliberate deviation from the original schema sketch, explained
      in the backend README. `npm run build` clean across 19 frontend routes.
      *(this delivery)*
- [x] **Phase 5 — Teacher Portal**: course creation/curriculum editing, assignment +
      quiz creation, a grading queue, attendance marking, roster view, dashboard with
      a real performance chart, professional profile. Batches/Slots/Timetable
      deliberately deferred — not required by this phase's own exit criteria; see the
      backend README. Verified with an actual headless-browser click-through, not
      just build checks. *(this delivery)*
- [x] **Phase 6 — Admin Portal**: user management (suspend/reactivate/approve
      teachers/change roles/delete), platform-wide course management, categories,
      dashboard with real growth/popularity charts. Super Admin account is
      un-suspendable/un-deletable/un-demotable by design, even by another admin.
      Also shipped in this delivery: student/teacher **avatar upload** (Cloudinary),
      and a fix to `User`'s pre-save hook (async, no `next` callback dependency).
      *(this delivery)*
- [x] **Phase 7 — Chat & Notifications**: real-time 1:1 chat (role-appropriate
      contacts only, enforced server-side), a notification bell + toasts wired to
      live socket events (not polling), and announcements (teacher: course-scoped,
      admin: platform-wide) that fan out as both notifications and email. Verified
      with a direct `socket.io-client` handshake test (not just REST route checks)
      plus the full browser click-through harness — two real React Compiler errors
      were caught and fixed in the process. *(this delivery)*
- [x] **Phase 8 — Analytics**: `/admin/analytics` with revenue (clearly labeled
      estimated — no payment system yet), student activity/retention, completion
      rate, quiz performance, assignment submission rates, weekly attendance, and
      teacher performance, via 7 parallel aggregation pipelines. Flagged explicitly
      in the backend README: this is the highest-risk code in the project to verify
      without a live database, since aggregation pipeline bugs only surface against
      real documents — sanity-check the numbers once it's running for real.
      *(this delivery)*
- [ ] Phase 9 — Deployment
- [ ] Phase 10 — Testing & Optimization
- [ ] Phase 11 — Growth Layer (AI, gamification, payments, CMS, portfolio polish)

Full detail on each phase, including exit criteria, is in `ARCHITECTURE.md` §7.

## Trying Phase 2 locally

1. `cd backend && npm install && cp .env.example .env`
2. Set a real `MONGO_URI` (MongoDB Atlas — this couldn't be tested against a live DB
   in the build sandbox, see backend README for exactly what was and wasn't verified).
3. `npm run dev`, then in another terminal: `npm run seed` — creates/promotes the
   Super Admin account for the email in `SUPER_ADMIN_EMAIL` and prints a one-time
   password (save it, it's not shown again).
4. `cd ../frontend && npm install && cp .env.local.example .env.local && npm run dev`
5. Register a student or teacher account at `/register`, or log in as the seeded
   Super Admin at `/login` — each role lands on its own dashboard.
6. Back in `backend/`, run `npm run seed:courses` to add two sample published
   courses (with a demo teacher, an assignment, and a quiz) so the student portal
   has something real to browse, enroll in, and complete.
