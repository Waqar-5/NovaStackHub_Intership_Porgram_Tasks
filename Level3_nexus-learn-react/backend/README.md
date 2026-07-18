# Nexus Learn — Backend

Express.js + MongoDB API for the Nexus Learn platform. See `/ARCHITECTURE.md` at the
project root for the full schema, API plan, and roadmap.

## Stack

Node.js · Express 4 · Mongoose · JWT (access + refresh) · bcryptjs · Multer → Cloudinary ·
Nodemailer · Socket.io · Zod (request validation) · Helmet, CORS, rate limiting, mongo-sanitize.

## Getting started

```bash
npm install
cp .env.example .env      # fill in MONGO_URI at minimum
npm run dev                # nodemon, http://localhost:5000
```

Without a valid `MONGO_URI`, the server still starts (see `src/config/db.js`) so you can
confirm the API itself is healthy at `GET /api/v1/health` — every DB-backed route will
fail until it's connected, by design, rather than crashing the whole process on boot.

## Folder structure

```
src/
├─ config/       # env, db, cloudinary, mailer
├─ models/       # Mongoose schemas (added per phase — see ARCHITECTURE.md §3)
├─ controllers/  # route handlers
├─ routes/       # route definitions, mounted in app.js
├─ middleware/   # auth, roleGuard, validate, errorHandler, rateLimiter, upload
├─ services/     # business logic (email, certificates, AI, etc.)
├─ validators/   # zod schemas per route
├─ sockets/      # Socket.io handlers
└─ utils/        # apiResponse, asyncHandler, tokens
```

## Conventions

- Every controller is wrapped in `asyncHandler` — throw an `ApiError(status, message)`
  instead of manually catching and responding.
- Every response uses `apiSuccess` / `apiError` from `src/utils/apiResponse.js` so the
  frontend always sees `{ success, message, data, meta }` or `{ success, message, errors }`.
- Mutating routes follow: `requireAuth` → `roleGuard(...)` → `validate(schema)` → controller.
- The Super Admin role is **never hardcoded** — it's granted automatically to whichever
  account's email matches `SUPER_ADMIN_EMAIL` in `.env` (see `src/config/env.js`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start (production) |
| `npm run lint` | ESLint |
| `npm run seed` | Seed script (added in Phase 2) |
## Status

**Phase 1 complete:** app boots, health check responds, DB connects (or degrades
gracefully without one), Socket.io handshake auth is wired, all core middleware
(auth, roleGuard, validate, errorHandler, rateLimiter, upload) is in place.

**Phase 2 complete:** full auth flow — register, login, logout, refresh-token rotation
(hashed, stored per-user, capped at 5 sessions), email verification, forgot/reset
password, `GET /auth/me`. The Super Admin role is granted automatically — never
hardcoded — to whichever account's email matches `SUPER_ADMIN_EMAIL`; run `npm run seed`
to create or promote that account.

**Phase 3:** frontend-only (landing page) — no backend changes.

**Phase 4 complete:** Course (with embedded modules/lessons — see the design-decision
note below), Enrollment, Assignment, Submission, Quiz, QuizAttempt, Certificate, and
Attendance models, all wired to student-facing routes: browse/search/filter courses,
enroll, track lesson-by-lesson progress (auto-issuing a certificate at 100%), submit
assignments, take timed quizzes (scored server-side — correct answers are stripped
before a quiz is ever sent to the client), view certificates and attendance, and
manage profile/wishlist/bookmarks. `npm run seed:courses` seeds two sample published
courses with a demo teacher account, an assignment, and a quiz, so there's something
real to browse once you point this at an Atlas cluster.

**Design decision — embedded course content:** the original schema sketch (see
`ARCHITECTURE.md` §3) had `Module` and `Lesson` as separate referenced collections.
For Phase 4 I embedded them directly inside `Course` instead — course content is
read constantly and written rarely (by a teacher, occasionally), so paying a
multi-collection join cost on every student page load didn't make sense at this
scale. `Enrollment.completedLessonIds` tracks progress against the embedded lessons'
auto-generated ObjectIds. This can be normalized back out later if course catalogs
get large enough that document size becomes a real constraint — it isn't yet.

Same verification approach as Phase 2: booted the full server with every Phase 4
route mounted and confirmed (a) validation errors return proper 422s, (b) the auth
guard returns 401 correctly, (c) DB-touching routes fail gracefully instead of
crashing without a live database, and (d) the server stays alive throughout. The
actual data round-trip (enroll → complete lessons → earn a certificate → submit an
assignment → take a quiz) needs a real `MONGO_URI` to confirm, same limitation as
Phase 2.

**Phase 5 complete:** teacher-owned course management (create as draft, add
modules/lessons, publish/unpublish — publishing is blocked until at least one lesson
exists), assignment and quiz creation scoped to courses the teacher actually owns
(every write path checks `course.instructor === req.user._id` before touching
anything), a grading queue (`GET /teacher/submissions/pending` across every course
they teach, `PATCH /teacher/submissions/:id/grade`), attendance marking
(`POST /teacher/attendance`, upserts so re-marking corrects rather than duplicates),
a course roster endpoint, and a dashboard overview/performance endpoint for the
Recharts chart on the frontend. Extended the profile endpoint to also handle
`teacherProfile` (bio, expertise).

**Deliberately deferred:** Batch/Slot/Timetable models from the original schema
sketch. My `Attendance` model already references `course` + `student` directly, so
Batches weren't actually required to hit this phase's own exit criteria (create
content → grade a submission → mark attendance that the student sees) — building
them now would be scaffolding for a workflow this phase doesn't need yet. Real video
upload is also deferred since Cloudinary isn't configured; lessons take a `videoUrl`
string same as before.

Same verification approach as every phase: booted the server with every Phase 5 route
mounted, confirmed 401s fire correctly unauthenticated, and confirmed a *valid, signed
JWT* for a teacher role reaches all the way to the database call and fails gracefully
(a clean Mongoose buffering-timeout error, not a crash) rather than stopping short at
the auth layer. That's a step further than prior phases' verification — it proves the
whole middleware chain (auth → roleGuard → validate → controller) executes correctly,
not just that unauthenticated requests get rejected. The actual data round-trip still
needs a real `MONGO_URI`.

**Fix applied — User pre-save hook:** switched `userSchema.pre("save", ...)` to an
async function with no `next` parameter, relying on Mongoose awaiting the returned
promise instead of requiring an explicit `next()` call. Both styles are valid
Mongoose, but this removes any dependency on the callback entirely.

**Avatar upload:** `POST /users/me/avatar` (multipart, field name `avatar`, any
authenticated role) streams the file straight from multer's memory buffer to
Cloudinary (`services/uploadService.js`) — never touches local disk — and saves the
resulting `secure_url` to `User.avatarUrl`. Returns a clear 503 (not a crash) if
`CLOUDINARY_*` env vars aren't set yet, since that's a real, expected state during
local dev before those credentials exist.

**Phase 6 complete:** platform-wide admin capabilities — user management (list with
role/status/search filters, suspend/reactivate, approve pending teachers, change
anyone's role, delete accounts), course management across every instructor (not just
own courses — publish/archive/delete any course), and a lightweight Category model
with public read + admin-write CRUD. Dashboard endpoints for platform overview counts,
a 14-day signup-growth aggregation, and top-courses-by-enrollment popularity.

**Guardrails on the dangerous actions:** every destructive/role-changing endpoint
(`suspend`, `delete`, `role`) refuses to act on the acting admin's own account, and
separately refuses to act on whichever account matches `SUPER_ADMIN_EMAIL` — so an
admin can't suspend, delete, or demote the Super Admin account even by ID, and can't
accidentally lock themselves out either.

**Still deferred to Phase 11 (Growth layer)** per the roadmap: the admin CMS (editing
landing page/FAQ/pricing content without redeploying), audit logs, backup/restore,
feature flags, and email broadcast. Those are genuinely separate features, not
"admin portal" in the MVP sense — building them now would be scope creep against
this phase's own goal (Super Admin can run the platform day-to-day).

### What was actually verified vs. what needs your MongoDB URI

This build sandbox has no route to MongoDB's package repos, so a live database
couldn't be started here. What **was** verified directly, with a script that's no
longer in the repo:

- bcrypt hash/compare round-trip
- JWT access + refresh token sign/verify, including a tampered-token rejection
- Every Zod validator (valid payloads pass, weak passwords / bad emails / a client
  attempting to register directly as `role: "admin"` are all correctly rejected)
- The full server boots with every auth route mounted, `/health` responds, a DB-touching
  route (`/auth/register`) fails gracefully with a proper JSON error instead of
  crashing the process when there's no database, and the server stays alive afterward

**Still needs a real `MONGO_URI` to confirm:** the actual round-trip of a document
being written and read back (register → verify email → login → refresh → logout),
since that requires a live MongoDB connection this environment can't provide. Point
`.env` at an Atlas cluster and run through that flow once — it's the one thing here
that's built-and-reasoned-about-correctly rather than directly observed working.

**Phase 7 complete:** Conversation, Message, Notification, and Announcement models.
Socket.io now does real work — `conversation:join`, `message:send` (persists,
updates the conversation's `lastMessageAt`/`lastMessageText`, broadcasts to the room,
and fires a notification to the other participant), and `typing:start`/`typing:stop`.
REST covers what sockets shouldn't own: conversation list, eligible-contacts lookup,
paginated message history, and notification list/mark-read.

**Who can message whom** (`conversationController.getEligibleContacts`) mirrors the
brief's role boundaries rather than opening chat platform-wide: students can message
teachers of courses they're enrolled in (plus any admin); teachers can message
students enrolled in their own courses (plus any admin); admins can message anyone.
Enforced server-side in `startConversation`, not just hidden in the contact picker UI.

**Notifications got wired into existing actions, not just chat** — grading a
submission, earning a certificate, and a teacher being approved all now fire a real
notification through the same `notify()` service function
(`services/notificationService.js`), which persists to Mongo *and* emits over the
recipient's personal socket room (`user:<id>`, joined on every connection) if they're
online. That's a deliberate single entry point — anything that needs to notify a user
calls `notify()`, rather than each feature reinventing it.

**Verified further than usual for this phase:** since the phase's own success
criterion is specifically about real-time delivery, I didn't stop at REST route
guards — I wrote a real `socket.io-client` handshake test against the live server and
confirmed a validly-signed JWT connects, an invalid token is rejected with the right
error, and a missing token is rejected too, with the server logging real
connect/disconnect events throughout. That's the actual mechanism this phase depends
on, tested directly rather than inferred from route-level checks.

**Scoped down from the original brief:** per-message email notifications were left
out — chat is real-time by nature, and emailing on every message would be spam, not
a feature. Announcements *do* email (via the existing `emailService`, best-effort,
non-blocking) since they're infrequent and higher-signal. At real platform scale,
announcement fan-out to thousands of recipients would move to a queue instead of
direct calls in the request cycle; fine as direct calls at this scale.

**Phase 8 complete:** a single consolidated `GET /admin/analytics` endpoint —
revenue, student activity/retention, enrollment completion rate, quiz performance,
assignment submission rates, weekly attendance trend, and teacher performance,
computed via seven MongoDB aggregation pipelines run in parallel
(`controllers/analyticsController.js`). One endpoint instead of seven separate ones
because the frontend needs all of it on one page load, and one round trip beats
seven.

**"Revenue" is explicitly estimated, not real:** there's no payment system yet
(that's Growth-layer Phase 11), so revenue is computed as `price × enrollments` per
course. The frontend labels it "Estimated revenue" — this isn't a placeholder
pretending to be real data, it's a clearly-marked proxy metric until Stripe
integration exists.

**Verification limitation worth being direct about:** this is the most
aggregation-heavy code in the project — seven non-trivial pipelines using `$group`,
`$lookup`, `$isoWeek`, and conditional `$sum`/`$avg` expressions. I verified the
full middleware chain reaches the database call correctly (same JWT-handshake test
as Phase 5/6 — a valid signed token gets all the way to a graceful Mongoose
buffering-timeout, not a crash), and every pipeline is syntactically valid JS
following correct aggregation pipeline shape. What I *can't* verify without a live
MongoDB connection is whether each pipeline's actual output matches what its name
claims once real documents are behind it — that's meaningfully higher risk here than
in earlier phases' simpler `find()`/`countDocuments()` calls, and I'd want you to
sanity-check the numbers once this is running against real seeded data before
trusting them for anything that matters.
