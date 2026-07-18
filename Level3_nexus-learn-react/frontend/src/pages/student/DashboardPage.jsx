import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Award, ClipboardList, Clock, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { EnrolledCourseCard } from "@/components/shared/enrolled-course-card";
import { AnnouncementsFeed } from "@/components/shared/announcements-feed";
import { useAuth } from "@/hooks/useAuth";
import { enrollmentService } from "@/services/enrollmentService";
import { assignmentService } from "@/services/assignmentService";
import { certificateService } from "@/services/certificateService";

function StatCard({ icon: Icon, label, value, href }) {
  const content = (
    <GlassCard interactive={Boolean(href)} className="flex items-center gap-3">
      <div className="glass flex size-10 items-center justify-center rounded-md">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <p className="font-display text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </GlassCard>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments", "me"],
    queryFn: enrollmentService.myEnrollments,
  });
  const enrollments = enrollmentsData?.data?.enrollments || [];

  const { data: assignmentsData } = useQuery({
    queryKey: ["assignments", "upcoming"],
    queryFn: assignmentService.upcoming,
  });
  const upcomingAssignments = assignmentsData?.data?.assignments || [];

  const { data: certificatesData } = useQuery({
    queryKey: ["certificates", "me"],
    queryFn: certificateService.mine,
  });
  const certificateCount = certificatesData?.data?.certificates?.length || 0;

  const inProgress = enrollments.filter((e) => e.status === "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">Here&apos;s where you left off.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={BookOpen} label="Active courses" value={inProgress.length} href="/courses" />
        <StatCard
          icon={ClipboardList}
          label="Assignments due"
          value={upcomingAssignments.length}
          href="/assignments"
        />
        <StatCard icon={Award} label="Certificates" value={certificateCount} href="/certificates" />
        <StatCard
          icon={Clock}
          label="Avg. progress"
          value={
            enrollments.length
              ? `${Math.round(
                  enrollments.reduce((s, e) => s + e.progressPercent, 0) / enrollments.length
                )}%`
              : "0%"
          }
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Continue learning</h2>
          <Link to="/courses" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        {enrollmentsLoading ? (
          <Loader2 className="mx-auto mt-6 size-6 animate-spin text-muted-foreground" />
        ) : inProgress.length === 0 ? (
          <div className="glass rounded-lg p-8 text-center text-sm text-muted-foreground">
            No courses in progress.{" "}
            <Link to="/courses" className="text-primary hover:underline">
              Browse the catalog
            </Link>{" "}
            to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.slice(0, 3).map((e) => (
              <EnrolledCourseCard key={e._id} enrollment={e} />
            ))}
          </div>
        )}
      </div>

      {upcomingAssignments.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold">Upcoming deadlines</h2>
          <GlassCard className="divide-y divide-border p-0">
            {upcomingAssignments.slice(0, 5).map((a) => (
              <Link
                key={a._id}
                href="/assignments"
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-glass"
              >
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.course?.title}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(a.deadline).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </GlassCard>
        </div>
      )}

      <div>
        <h2 className="mb-3 font-display text-xl font-semibold">Announcements</h2>
        <AnnouncementsFeed />
      </div>
    </div>
  );
}
