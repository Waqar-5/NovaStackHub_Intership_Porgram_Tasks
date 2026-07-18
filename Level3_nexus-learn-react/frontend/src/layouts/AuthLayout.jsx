import { Link, Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-3xl gradient-signature"
      />

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center font-display text-lg font-bold text-gradient-signature"
        >
          Nexus Learn
        </Link>
        <div className="glass rounded-lg p-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
