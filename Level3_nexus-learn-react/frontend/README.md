# Nexus Learn — Frontend (React SPA)

A Vite + React single-page app — converted from the original Next.js App Router
frontend at the user's request. See `/ARCHITECTURE.md` at the project root for the
design system and backend API plan (both unchanged by this conversion).

## Why this exists

The project originally shipped as Next.js (App Router, SSR, file-based routing).
This is a full rewrite to a client-side-only React SPA: Vite build tool, React
Router for routing, no server-side rendering. **This trades away the SSR/SEO
benefits the landing page was specifically designed around** (the hero section,
meta tags, and fast first paint all assumed server rendering) — worth knowing if
the marketing page's search visibility matters. Everything else — the actual
features, the design system, the backend — is unchanged.

## Stack

React 19 · Vite · React Router 7 · Tailwind CSS v4 · Framer Motion · GSAP ·
Three.js / React Three Fiber / Drei · shadcn-style components (Radix primitives) ·
React Hook Form + Zod · TanStack Query · Zustand · Axios · Recharts · next-themes
(works fine outside Next.js, despite the name) · Socket.io client · Sonner (toasts).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # already done in this delivery — points at :30001
npm run dev       # http://localhost:3000
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## What changed from the Next.js version

| Next.js | React SPA equivalent |
|---|---|
| `next/link` `<Link href>` | `react-router-dom` `<Link to>` |
| `next/navigation` `useRouter().push()` | `useNavigate()` |
| `next/navigation` `usePathname()` | `useLocation().pathname` |
| `next/navigation` `useParams()` | `useParams()` (same API) |
| `next/navigation` `useSearchParams()` | `useSearchParams()` (returns `[params, setParams]`, `.get()` still works) |
| `next/dynamic` (code-splitting) | `React.lazy()` + `<Suspense>` |
| File-based routing (`app/**/page.jsx`) | Explicit route table in `src/App.jsx` |
| Route groups (`(student)/layout.jsx`) | Layout components in `src/layouts/` wrapping `<Outlet />` |
| `process.env.NEXT_PUBLIC_*` | `import.meta.env.VITE_*` |
| Automatic per-route code splitting | Manual — every page is wrapped in `React.lazy()` in `App.jsx`, since Vite doesn't do this automatically for an SPA |

Every service, hook, Zod schema, and Zustand store ported over **unchanged** —
none of that layer had any Next.js-specific code to begin with.

## Folder structure

```
src/
├─ pages/            # one file per route: LandingPage, auth/, student/, teacher/, admin/
├─ layouts/           # MarketingLayout, AuthLayout, StudentLayout, TeacherLayout, AdminLayout
├─ App.jsx            # the full route table (React Router)
├─ main.jsx            # entry point: BrowserRouter + all providers
├─ components/         # ui/ (shadcn-style), shared/, chat/, hero/, landing/
├─ hooks/, lib/, services/, store/, schemas/, utils/   # all ported unchanged from Next.js
```

## Data storage / image uploads

No changes needed here — this was already true before the conversion and remains
true now: every write goes to MongoDB via the Express/Mongoose backend, and
profile-picture uploads (student and teacher) already use multer's in-memory buffer
streamed directly to Cloudinary (`backend/src/services/uploadService.js`) — nothing
ever touches local disk. This is a frontend-only rewrite; the backend and its data
flow are untouched.

## Verification

Since this was a large mechanical port (29 routes), I verified it more heavily than
usual: `npm run lint` and `npm run build` both pass clean, and I ran two rounds of
headless-browser testing against the actual built app — one hitting all 26 routes
directly, one clicking through real navigation links (Login → Register →
Forgot Password → back, plus an unmatched route to confirm the 404 page). Both
came back with zero client-side errors.

One real fix made during the port: `App.jsx` originally bundled all 29 pages into a
single 1.19MB chunk, since Vite (unlike Next.js) doesn't automatically code-split
per route. Converted every page import to `React.lazy()` — the main bundle dropped
to 441KB, with each page now loading as its own small chunk on demand.
