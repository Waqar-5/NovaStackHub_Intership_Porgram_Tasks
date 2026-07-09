import { Link } from 'react-router-dom';
import { courses } from '../data/courses';

export default function Landing() {
  return (
    <div className="bg-paper min-h-screen">
      <header className="flex items-center justify-between px-6 lg:px-12 py-6">
        <p className="font-display text-2xl text-ink tracking-tight">
          Ledger<span className="text-amber">.</span>
        </p>
        <nav className="flex items-center gap-6">
          <Link to="/login" className="text-sm text-slate hover:text-ink transition-colors">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-chip hover:bg-ink/90 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 lg:px-12 pt-12 pb-20 max-w-5xl mx-auto">
        <p className="font-mono text-xs text-amber-dark mb-4 tracking-wide">
          ENTRY NO. 001 — TODAY'S LESSON
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-ink leading-[1.05] mb-6 max-w-3xl">
          Keep a ledger of everything you learn.
        </h1>
        <p className="text-lg text-slate max-w-xl mb-8 leading-relaxed">
          Most courses you forget by Friday. Ledger tracks every lesson, every streak,
          every certificate — so your learning compounds instead of evaporating.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/signup"
            className="bg-amber text-ink font-medium px-6 py-3 rounded-chip hover:bg-amber-dark transition-colors"
          >
            Start Learning Free
          </Link>
          <Link to="/courses" className="text-sm text-ink font-medium hover:underline">
            Browse the catalog →
          </Link>
        </div>
      </section>

      {/* Ledger-style stats strip */}
      <section className="border-t border-b border-line bg-ink text-paper">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-6 grid grid-cols-3 gap-6 font-mono text-sm">
          <Stat label="Courses" value="120+" />
          <Stat label="Active learners" value="9,800" />
          <Stat label="Avg. completion" value="78%" />
        </div>
      </section>

      {/* Course preview */}
      <section className="px-6 lg:px-12 py-20 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl text-ink mb-8">A few entries to get you started</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="border border-line bg-chalk rounded-chip p-5">
              <div className="text-3xl mb-3">{course.thumbnail}</div>
              <p className="font-display text-base text-ink mb-1">{course.title}</p>
              <p className="text-xs text-slate">{course.instructor} · {course.duration}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line px-6 lg:px-12 py-8 text-center text-xs text-slate">
        Built for the NovaStack Hub Web Development Internship — Level 3 Task.
      </footer>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-2xl text-amber">{value}</p>
      <p className="text-xs text-paper/60 mt-1">{label}</p>
    </div>
  );
}
