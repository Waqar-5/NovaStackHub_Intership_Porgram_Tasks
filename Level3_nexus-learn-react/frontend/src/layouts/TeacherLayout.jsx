import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  CalendarCheck,
  UserCircle,
  MessageCircle,
} from "lucide-react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { DashboardShell } from "@/components/shared/dashboard-shell";

const NAV_ITEMS = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/courses", label: "My Courses", icon: BookOpen },
  { href: "/teacher/grading", label: "Grading", icon: ClipboardCheck },
  { href: "/teacher/chat", label: "Chat", icon: MessageCircle },
  { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/teacher/profile", label: "Profile", icon: UserCircle },
];

export function TeacherLayout() {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardShell navItems={NAV_ITEMS}>
        <Outlet />
      </DashboardShell>
    </ProtectedRoute>
  );
}
