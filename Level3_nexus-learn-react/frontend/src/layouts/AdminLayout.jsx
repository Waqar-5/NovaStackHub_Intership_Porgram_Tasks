import { Outlet } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, Tags, BarChart3 } from "lucide-react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardShell } from "@/components/shared/dashboard-shell";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminLayout() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardShell navItems={NAV_ITEMS}>
        <Outlet />
      </DashboardShell>
    </ProtectedRoute>
  );
}
