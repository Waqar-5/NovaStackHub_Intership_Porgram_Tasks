import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, ClipboardCheck, TrendingUp, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { AnnouncementComposer } from "@/components/shared/announcement-composer";
import { AnnouncementsFeed } from "@/components/shared/announcements-feed";
import { useAuth } from "@/hooks/useAuth";
import { teacherService } from "@/services/teacherService";

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

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ["teacher", "overview"],
    queryFn: teacherService.overview,
  });
  const overview = overviewData?.data;

  const { data: performanceData } = useQuery({
    queryKey: ["teacher", "performance"],
    queryFn: teacherService.performance,
  });
  const performance = performanceData?.data?.performance || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">Here&apos;s how your courses are doing.</p>
      </div>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={BookOpen}
              label="Courses"
              value={`${overview?.publishedCount ?? 0}/${overview?.courseCount ?? 0}`}
              href="/teacher/courses"
            />
            <StatCard icon={Users} label="Total students" value={overview?.studentCount ?? 0} />
            <StatCard
              icon={ClipboardCheck}
              label="Pending grading"
              value={overview?.pendingGradingCount ?? 0}
              href="/teacher/grading"
            />
            <StatCard
              icon={TrendingUp}
              label="Average grade"
              value={overview?.averageGrade !== null ? `${overview?.averageGrade}%` : "—"}
            />
          </div>

          {performance.length > 0 && (
            <GlassCard>
              <h2 className="mb-4 font-display text-lg font-semibold">
                Average score by course
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="course" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                      }}
                    />
                    <Bar dataKey="averageScore" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}

          {overview?.upcomingAssignments?.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-xl font-semibold">Upcoming deadlines</h2>
              <GlassCard className="divide-y divide-border p-0">
                {overview.upcomingAssignments.map((a) => (
                  <div key={a._id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.course?.title}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.deadline).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </GlassCard>
            </div>
          )}

          {overview?.courseCount === 0 && (
            <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
              You haven&apos;t created any courses yet.{" "}
              <Link to="/teacher/courses" className="text-primary hover:underline">
                Create your first course
              </Link>
              .
            </div>
          )}

          {overview?.courses?.filter((c) => c.status === "published").length > 0 && (
            <AnnouncementComposer
              courses={overview.courses.filter((c) => c.status === "published")}
            />
          )}

          <div>
            <h2 className="mb-3 font-display text-xl font-semibold">Recent announcements</h2>
            <AnnouncementsFeed />
          </div>
        </>
      )}
    </div>
  );
}
