import { useQuery } from "@tanstack/react-query";
import { DollarSign, Users, CheckCircle2, ClipboardCheck, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/shared/glass-card";
import { adminService } from "@/services/adminService";

const CHART_COLORS = ["var(--primary)", "var(--secondary)", "var(--accent)"];
const PIE_COLORS = ["var(--success)", "var(--primary)", "var(--danger)"];

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <GlassCard className="flex items-center gap-3">
      <div className="glass flex size-10 items-center justify-center rounded-md">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <p className="font-display text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </GlassCard>
  );
}

function ChartCard({ title, children, empty }) {
  return (
    <GlassCard>
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      <div className="h-64">
        {empty ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {empty}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
}

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: adminService.analytics,
  });
  const a = data?.data;

  if (isLoading) {
    return <Loader2 className="mx-auto mt-20 size-8 animate-spin text-muted-foreground" />;
  }

  const completionPie = a
    ? [
        { name: "Completed", value: a.completion.statusBreakdown.completed },
        { name: "Active", value: a.completion.statusBreakdown.active },
        { name: "Refunded", value: a.completion.statusBreakdown.refunded },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Platform-wide performance across revenue, students, and content.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Estimated revenue"
          value={`$${a?.revenue.estimatedTotal.toLocaleString() ?? 0}`}
          sub="price × enrollments"
        />
        <StatCard
          icon={Users}
          label="Active students"
          value={a?.students.activeCount ?? 0}
          sub={`of ${a?.students.totalCount ?? 0} total`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completion rate"
          value={`${a?.completion.completionRate ?? 0}%`}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Assignment submission rate"
          value={`${a?.assignments.overallRate ?? 0}%`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Estimated revenue — last 6 months"
          empty={a?.revenue.monthlyTrend.length === 0 ? "No enrollments yet in this window." : null}
        >
          <LineChart data={a?.revenue.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard
          title="Revenue by course"
          empty={a?.revenue.byCourse.length === 0 ? "No enrollments yet." : null}
        >
          <BarChart data={a?.revenue.byCourse} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis type="category" dataKey="title" width={120} stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill="var(--secondary)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard
          title="Enrollment status breakdown"
          empty={completionPie.length === 0 ? "No enrollments yet." : null}
        >
          <PieChart>
            <Pie data={completionPie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {completionPie.map((entry, i) => (
                <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartCard>

        <ChartCard
          title="Weekly attendance rate"
          empty={a?.attendance.weekly.length === 0 ? "No attendance records yet." : null}
        >
          <LineChart data={a?.attendance.weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} unit="%" />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="presentPercent"
              stroke="var(--success)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartCard>

        <ChartCard
          title="Quiz performance"
          empty={a?.quizzes.byQuiz.length === 0 ? "No quiz attempts yet." : null}
        >
          <BarChart data={a?.quizzes.byQuiz}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="title" stroke="var(--muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} unit="%" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="avgPercent" fill="var(--accent)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard
          title="Assignment submission rate by assignment"
          empty={a?.assignments.byAssignment.length === 0 ? "No assignments yet." : null}
        >
          <BarChart data={a?.assignments.byAssignment}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="title" stroke="var(--muted-foreground)" fontSize={10} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} unit="%" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="rate" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>

      <ChartCard
        title="Teacher performance — students taught"
        empty={a?.teacherPerformance.length === 0 ? "No teacher activity yet." : null}
      >
        <BarChart data={a?.teacherPerformance}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="studentCount" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} name="Students" />
          <Bar dataKey="courseCount" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} name="Courses" />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </BarChart>
      </ChartCard>
    </div>
  );
}
