import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationBell } from "@/components/shared/notification-bell";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { cn } from "@/lib/utils";

const ROLE_LABEL = { student: "Student", teacher: "Teacher", admin: "Super Admin" };

export function DashboardShell({ children, navItems }) {
  const { user } = useAuth();
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  async function handleLogout() {
    try {
      await authService.logout();
    } finally {
      clearSession();
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-10 flex items-center justify-between rounded-none border-x-0 border-t-0 px-6 py-4">
        <div>
          <p className="font-display text-lg font-bold text-gradient-signature">Nexus Learn</p>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABEL[user?.role] || "Dashboard"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{user?.name}</span>
          <NotificationBell />
          <ThemeToggle />
          <Button variant="glass" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        {navItems && navItems.length > 0 && (
          <aside className="hidden w-52 shrink-0 md:block">
            <nav className="glass sticky top-24 flex flex-col gap-1 rounded-lg p-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "gradient-signature text-white"
                        : "text-muted-foreground hover:bg-glass hover:text-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="size-4" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
