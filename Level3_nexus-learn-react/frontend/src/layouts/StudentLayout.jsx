import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Award,
  CalendarCheck,
  UserCircle,
  MessageCircle,
} from "lucide-react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardShell } from "@/components/shared/dashboard-shell";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function StudentLayout() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardShell navItems={NAV_ITEMS}>
        <Outlet />
      </DashboardShell>
    </ProtectedRoute>
  );
}
