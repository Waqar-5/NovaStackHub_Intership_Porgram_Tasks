import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { MarketingLayout } from "@/layouts/MarketingLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { StudentLayout } from "@/layouts/StudentLayout";
import { TeacherLayout } from "@/layouts/TeacherLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));

const StudentDashboardPage = lazy(() => import("@/pages/student/DashboardPage"));
const StudentCoursesPage = lazy(() => import("@/pages/student/CoursesPage"));
const CourseDetailPage = lazy(() => import("@/pages/student/CourseDetailPage"));
const LessonPlayerPage = lazy(() => import("@/pages/student/LessonPlayerPage"));
const AssignmentsPage = lazy(() => import("@/pages/student/AssignmentsPage"));
const QuizPage = lazy(() => import("@/pages/student/QuizPage"));
const CertificatesPage = lazy(() => import("@/pages/student/CertificatesPage"));
const StudentAttendancePage = lazy(() => import("@/pages/student/AttendancePage"));
const StudentProfilePage = lazy(() => import("@/pages/student/ProfilePage"));
const StudentChatPage = lazy(() => import("@/pages/student/ChatPage"));

const TeacherDashboardPage = lazy(() => import("@/pages/teacher/DashboardPage"));
const TeacherCoursesPage = lazy(() => import("@/pages/teacher/CoursesPage"));
const TeacherCourseEditPage = lazy(() => import("@/pages/teacher/CourseEditPage"));
const GradingPage = lazy(() => import("@/pages/teacher/GradingPage"));
const TeacherAttendancePage = lazy(() => import("@/pages/teacher/AttendancePage"));
const TeacherProfilePage = lazy(() => import("@/pages/teacher/ProfilePage"));
const TeacherChatPage = lazy(() => import("@/pages/teacher/ChatPage"));

const AdminDashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/UsersPage"));
const AdminCoursesPage = lazy(() => import("@/pages/admin/CoursesPage"));
const AdminCategoriesPage = lazy(() => import("@/pages/admin/CategoriesPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AnalyticsPage"));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        </Route>

        {/* Student portal */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboardPage />} />
          <Route path="/courses" element={<StudentCoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/learn/:courseId/:lessonId" element={<LessonPlayerPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/quizzes/:id" element={<QuizPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/attendance" element={<StudentAttendancePage />} />
          <Route path="/profile" element={<StudentProfilePage />} />
          <Route path="/chat" element={<StudentChatPage />} />
        </Route>

        {/* Teacher portal */}
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
          <Route path="/teacher/courses/:id/edit" element={<TeacherCourseEditPage />} />
          <Route path="/teacher/grading" element={<GradingPage />} />
          <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
          <Route path="/teacher/profile" element={<TeacherProfilePage />} />
          <Route path="/teacher/chat" element={<TeacherChatPage />} />
        </Route>

        {/* Admin portal */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/courses" element={<AdminCoursesPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
