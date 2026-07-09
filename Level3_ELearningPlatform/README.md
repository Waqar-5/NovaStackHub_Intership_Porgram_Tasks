# Ledger — E-Learning Platform (Level 3, MERN Stack)

A full-stack e-learning platform built for the NovaStack Hub Web Development Internship — **Level 3** task: *"Build an e-learning platform using MEAN or MERN stack."*

This uses the **MERN** stack: **M**ongoDB, **E**xpress, **R**eact, **N**ode.

## What it does

- User authentication (signup / login, JWT-based)
- Browse a course catalog with search + category filters
- View course details and module/lesson breakdowns
- Enroll in courses and track progress per lesson
- A lesson player UI with a module sidebar, "mark as complete," and next/previous navigation
- Dashboard with learning stats (hours learned, streak, certificates)
- Certificates page for completed courses
- Fully responsive, works on mobile and desktop

## Architecture

```
Level3_ELearningPlatform/
├── frontend/   → React + Vite + Tailwind CSS (client)
├── backend/    → Node.js + Express + Mongoose (API server)
```

### Why it works without MongoDB installed
The backend ships with a **mock-data fallback**. If no `MONGODB_URI` is set in `backend/.env`, the API automatically serves realistic mock data instead of crashing — so you (or an evaluator) can run and click through the entire app immediately, with zero setup. Connect a real MongoDB database whenever you're ready, and every route switches to live data with no frontend changes required.

The frontend has the same pattern: `frontend/src/services/apiClient.js` has a `USE_MOCK_DATA` flag. Flip it to `false` once your backend is running, and every page will start fetching from the real API instead of `src/data/*.js`.

## How to Run

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
The API runs at `http://localhost:5000`. It works immediately in mock mode — no MongoDB required to demo it.

To connect a real database: sign up free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register), create a cluster, and paste the connection string into `backend/.env` as `MONGODB_URI`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:5173`. Sign up with any name/email/password (mock mode accepts anything) and explore.

## Tech Stack

**Frontend:** React 19, Vite, React Router, Tailwind CSS
**Backend:** Node.js, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, CORS

## Folder Structure (Frontend)
```
frontend/src/
├── components/
│   ├── auth/        → ProtectedRoute
│   ├── common/      → Button, Badge, ProgressBar, LoadingSpinner
│   ├── course/      → CourseCard, LessonItem
│   └── layout/       → Sidebar, Topbar, DashboardLayout
├── context/         → AuthContext (global auth state)
├── data/            → Mock datasets (courses, users)
├── pages/           → Landing, Login, Signup, Dashboard, CourseCatalog,
│                       CourseDetail, CoursePlayer, MyCourses, Certificates, Profile
├── services/        → apiClient, authService, courseService
└── App.jsx          → Routing
```

## Folder Structure (Backend)
```
backend/src/
├── config/db.js               → MongoDB connection (skips gracefully if not configured)
├── models/                    → User.js, Course.js (Mongoose schemas)
├── controllers/                → authController.js, courseController.js
├── routes/                    → authRoutes.js, courseRoutes.js
├── middleware/                → auth.js (JWT guard), errorHandler.js
├── data/mockData.js           → Fallback dataset used when no DB is connected
└── server.js                  → Express app entry point
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current logged-in user |
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Get one course with modules/lessons |
| GET | `/api/courses/enrolled` | Get the logged-in user's enrolled courses |
| GET | `/api/courses/search?q=&category=` | Search/filter courses |
| POST | `/api/courses/:id/enroll` | Enroll in a course |
| POST | `/api/courses/:id/lessons/:lessonId/complete` | Mark a lesson complete |

## How to Submit for Internship

1. Push both `frontend/` and `backend/` folders to a GitHub repository (you can keep them in one repo, as they are here).
2. Take screenshots: landing page, dashboard, course catalog, course player.
3. Submit the GitHub link + screenshots via the submission form when it's shared.

## Possible Upgrades
- Deploy backend on Render/Railway and frontend on Vercel/Netlify
- Add file upload for course thumbnails (e.g. via Cloudinary)
- Add an instructor dashboard for creating/editing courses
- Add real video hosting (e.g. via Mux or YouTube embeds)
