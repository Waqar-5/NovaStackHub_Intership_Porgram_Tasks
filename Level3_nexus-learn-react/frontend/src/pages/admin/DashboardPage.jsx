import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, GraduationCap, UserCheck, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { AnnouncementComposer } from "@/components/shared/announcement-composer";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/services/adminService";

function StatCard({ icon: Icon, label, value, href, accent }) {
  const content = (
    <GlassCard interactive={Boolean(href)} className="flex items-center gap-3">
      <div className="glass flex size-10 items-center justify-center rounded-md">
        <Icon className={`size-5 ${accent || "text-primary"}`} />
      </div>
      <div>
        <p className="font-display text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </GlassCard>
  );
  return href ? <Link to={href}>{content}</Link> : content;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: adminService.overview,
  });
  const overview = overviewData?.data;

  const { data: growthData } = useQuery({
    queryKey: ["admin", "growth"],
    queryFn: adminService.growth,
  });
  const growth = growthData?.data?.growth || [];

  const { data: popularityData } = useQuery({
    queryKey: ["admin", "popularity"],
    queryFn: adminService.popularity,
  });
  const popularity = popularityData?.data?.popularity || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Welcome, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">Platform overview.</p>
      </div>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={Users} label="Students" value={overview?.studentCount ?? 0} href="/admin/users" />
            <StatCard icon={GraduationCap} label="Teachers" value={overview?.teacherCount ?? 0} href="/admin/users" />
            <StatCard
              icon={BookOpen}
              label="Courses"
              value={`${overview?.publishedCourseCount ?? 0}/${overview?.courseCount ?? 0}`}
              href="/admin/courses"
            />
            <StatCard
              icon={UserCheck}
              label="Pending approvals"
              value={overview?.pendingTeacherCount ?? 0}
              href="/admin/users"
              accent={overview?.pendingTeacherCount > 0 ? "text-warning" : undefined}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GlassCard>
              <h2 className="mb-4 font-display text-lg font-semibold">
                Signups — last 14 days
              </h2>
              <div className="h-56">
                {growth.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No signups yet in this window.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="signups"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="mb-4 font-display text-lg font-semibold">
                Most popular courses
              </h2>
              <div className="h-56">
                {popularity.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No enrollments yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularity} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
                      <YAxis
                        type="category"
                        dataKey="title"
                        stroke="var(--muted-foreground)"
                        fontSize={11}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="enrollments" fill="var(--secondary)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>
          </div>

          {overview?.suspendedCount > 0 && (
            <GlassCard className="text-sm text-muted-foreground">
              {overview.suspendedCount} account{overview.suspendedCount === 1 ? "" : "s"}{" "}
              currently suspended.{" "}
              <Link to="/admin/users?status=suspended" className="text-primary hover:underline">
                Review
              </Link>
            </GlassCard>
          )}

          <AnnouncementComposer />
        </>
      )}
    </div>
  );
}
